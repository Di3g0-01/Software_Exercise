import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { HashProvider } from '../../domain/providers/hash.provider';
import { TokenGenerator } from '../../domain/providers/token-generator.provider';
import { VerificationNotifier } from '../../domain/notifications/verification-notifier';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider,
    private readonly tokenGenerator: TokenGenerator,
    private readonly verificationNotifier: VerificationNotifier,
  ) {}

  async execute(data: RegisterDto): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = await this.hashProvider.hash(data.password);
    const verificationToken = this.tokenGenerator.generate();

    const user = await this.userRepository.create({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      passwordHash,
      verificationToken,
    });

    await this.verificationNotifier.notifyVerificationRequired(
      user.email,
      verificationToken,
    );

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }
}
