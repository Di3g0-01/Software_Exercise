import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class VerifyEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(token: string): Promise<{ message: string }> {
    // Un token vacio no puede llegar al repositorio: Prisma ignora los filtros
    // `undefined` y devolveria un usuario arbitrario.
    if (!token) {
      throw new BadRequestException('Invalid verification token');
    }

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
