import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { HashProvider } from '../../domain/providers/hash.provider';
import { AccessTokenProvider } from '../../domain/providers/access-token.provider';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider,
    private readonly accessTokenProvider: AccessTokenProvider,
  ) {}

  async execute(data: LoginDto): Promise<{ access_token: string }> {
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

    return {
      access_token: await this.accessTokenProvider.sign({
        sub: user.id,
        email: user.email,
      }),
    };
  }
}
