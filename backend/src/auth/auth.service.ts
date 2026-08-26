import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../domain/repositories/user.repository';
import { HashProvider } from '../domain/providers/hash.provider';
import { EmailProvider } from '../domain/providers/email.provider';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly hashProvider: HashProvider,
    private readonly emailProvider: EmailProvider,
  ) {}

  async register(data: any) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = await this.hashProvider.hash(data.password);
    const verificationToken = randomBytes(32).toString('hex');

    const user = await this.userRepository.create({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      age: parseInt(data.age),
      passwordHash,
      verificationToken,
    });

    // Send verification email
    await this.emailProvider.sendVerificationEmail(
      user.email,
      verificationToken,
    );

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  async login(data: any) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Account not verified. Please check your email.',
      );
    }

    const isPasswordValid = await this.hashProvider.compare(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verify(token: string) {
    const user = await this.userRepository.findByVerificationToken(token);

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.userRepository.update(user.id, {
      isVerified: true,
      verificationToken: null,
    });

    return { message: 'Email verified successfully. You can now login.' };
  }
}
