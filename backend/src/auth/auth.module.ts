import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailModule } from '../email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from '../domain/repositories/user.repository';
import { PrismaUserRepository } from '../infrastructure/repositories/prisma-user.repository';
import { HashProvider } from '../domain/providers/hash.provider';
import { BcryptHashProvider } from '../infrastructure/providers/bcrypt-hash.provider';

@Module({
  imports: [
    EmailModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'fallback_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: HashProvider,
      useClass: BcryptHashProvider,
    },
  ],
})
export class AuthModule {}
