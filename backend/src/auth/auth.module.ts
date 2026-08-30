import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { VerifyEmailUseCase } from '../application/use-cases/verify-email.use-case';
import { PersistenceModule } from '../infrastructure/repositories/persistence.module';
import { SecurityModule } from '../infrastructure/security/security.module';
import { NotificationsModule } from '../infrastructure/notifications/notifications.module';

@Module({
  imports: [PersistenceModule, SecurityModule, NotificationsModule],
  controllers: [AuthController],
  providers: [RegisterUserUseCase, LoginUseCase, VerifyEmailUseCase],
})
export class AuthModule {}
