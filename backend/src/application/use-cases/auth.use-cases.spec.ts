import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterUserUseCase } from './register-user.use-case';
import { LoginUseCase } from './login.use-case';
import { VerifyEmailUseCase } from './verify-email.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { HashProvider } from '../../domain/providers/hash.provider';
import { TokenGenerator } from '../../domain/providers/token-generator.provider';
import { AccessTokenProvider } from '../../domain/providers/access-token.provider';
import { VerificationNotifier } from '../../domain/notifications/verification-notifier';
import { PrismaUserRepository } from '../../infrastructure/repositories/prisma-user.repository';
import { InMemoryPrisma } from '../../testing/in-memory-prisma';
import { PrismaService } from '../../prisma/prisma.service';

// Dobles minimos: cada uno implementa una sola abstraccion del dominio.
class FakeHash implements HashProvider {
  hash(data: string | Buffer): Promise<string> {
    return Promise.resolve(`hashed:${String(data)}`);
  }
  compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return Promise.resolve(`hashed:${String(data)}` === encrypted);
  }
}

class FixedTokenGenerator implements TokenGenerator {
  constructor(private readonly value = 'token-123') {}
  generate() {
    return this.value;
  }
}

class FakeAccessTokenProvider implements AccessTokenProvider {
  sign(payload: { sub: string; email: string }): Promise<string> {
    return Promise.resolve(`signed:${payload.sub}`);
  }
}

class RecordingNotifier implements VerificationNotifier {
  readonly calls: Array<{ email: string; token: string }> = [];
  notifyVerificationRequired(email: string, token: string): Promise<void> {
    this.calls.push({ email, token });
    return Promise.resolve();
  }
}

const validRegistration = {
  firstName: 'Diego',
  lastName: 'Perez',
  email: 'diego@example.com',
  age: 25,
  password: 'Password1!',
};

describe('Casos de uso de autenticacion', () => {
  let prisma: InMemoryPrisma;
  let repository: UserRepository;
  let notifier: RecordingNotifier;
  let register: RegisterUserUseCase;
  let login: LoginUseCase;
  let verify: VerifyEmailUseCase;

  beforeEach(() => {
    prisma = new InMemoryPrisma();
    repository = new PrismaUserRepository(prisma as unknown as PrismaService);
    notifier = new RecordingNotifier();
    register = new RegisterUserUseCase(
      repository,
      new FakeHash(),
      new FixedTokenGenerator(),
      notifier,
    );
    login = new LoginUseCase(
      repository,
      new FakeHash(),
      new FakeAccessTokenProvider(),
    );
    verify = new VerifyEmailUseCase(repository);
  });

  describe('registro', () => {
    it('crea el usuario sin verificar, guarda el hash y avisa al usuario', async () => {
      const result = await register.execute(validRegistration);

      expect(result.message).toContain('Registration successful');
      expect(prisma.rows).toHaveLength(1);
      expect(prisma.rows[0].passwordHash).toBe('hashed:Password1!');
      expect(prisma.rows[0].passwordHash).not.toBe('Password1!');
      expect(prisma.rows[0].isVerified).toBe(false);
      expect(prisma.rows[0].verificationToken).toBe('token-123');
      expect(notifier.calls).toEqual([
        { email: 'diego@example.com', token: 'token-123' },
      ]);
    });

    it('rechaza un correo ya registrado', async () => {
      await register.execute(validRegistration);
      await expect(register.execute(validRegistration)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.rows).toHaveLength(1);
    });
  });

  describe('login', () => {
    it('rechaza a un usuario inexistente', async () => {
      await expect(
        login.execute({ email: 'nadie@example.com', password: 'Password1!' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rechaza a un usuario sin verificar', async () => {
      await register.execute(validRegistration);
      await expect(
        login.execute({
          email: validRegistration.email,
          password: 'Password1!',
        }),
      ).rejects.toThrow('Account not verified. Please check your email.');
    });

    it('rechaza una contrasena incorrecta', async () => {
      await register.execute(validRegistration);
      await verify.execute('token-123');
      await expect(
        login.execute({ email: validRegistration.email, password: 'otra' }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('emite un access_token cuando las credenciales son validas', async () => {
      await register.execute(validRegistration);
      await verify.execute('token-123');

      const result = await login.execute({
        email: validRegistration.email,
        password: 'Password1!',
      });

      expect(result.access_token).toBe('signed:user-1');
    });
  });

  describe('verificacion', () => {
    it('marca la cuenta como verificada y consume el token', async () => {
      await register.execute(validRegistration);

      const result = await verify.execute('token-123');

      expect(result.message).toContain('Email verified successfully');
      expect(prisma.rows[0].isVerified).toBe(true);
      expect(prisma.rows[0].verificationToken).toBeNull();
    });

    it('rechaza un token inexistente', async () => {
      await register.execute(validRegistration);
      await expect(verify.execute('otro-token')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.rows[0].isVerified).toBe(false);
    });

    it('rechaza un token vacio sin consultar el repositorio', async () => {
      await register.execute(validRegistration);
      const spy = jest.spyOn(repository, 'findByVerificationToken');

      await expect(verify.execute('')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(
        verify.execute(undefined as unknown as string),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(spy).not.toHaveBeenCalled();
      expect(prisma.rows[0].isVerified).toBe(false);
    });

    it('no reutiliza un token ya consumido', async () => {
      await register.execute(validRegistration);
      await verify.execute('token-123');
      await expect(verify.execute('token-123')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });
});
