import { Module } from '@nestjs/common';
import {
  EmailSender,
  VerificationEmailTemplate,
} from '../../domain/email/email-message';
import { VerificationNotifier } from '../../domain/notifications/verification-notifier';
import { ResendEmailSender } from '../email/resend-email.sender';
import { HtmlVerificationEmailTemplate } from '../email/verification-email.template';
import { EmailVerificationNotifier } from './email-verification.notifier';

/** Unico lugar donde se elige el canal y el proveedor de las notificaciones. */
@Module({
  providers: [
    { provide: EmailSender, useClass: ResendEmailSender },
    {
      provide: VerificationEmailTemplate,
      useClass: HtmlVerificationEmailTemplate,
    },
    { provide: VerificationNotifier, useClass: EmailVerificationNotifier },
  ],
  exports: [VerificationNotifier],
})
export class NotificationsModule {}
