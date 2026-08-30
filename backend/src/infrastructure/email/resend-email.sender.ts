import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { EmailMessage, EmailSender } from '../../domain/email/email-message';
import { AppConfigService } from '../config/app-config.service';

/** Unica responsabilidad: entregar un mensaje ya construido a traves de Resend. */
@Injectable()
export class ResendEmailSender implements EmailSender {
  private readonly logger = new Logger(ResendEmailSender.name);
  private readonly resend: Resend;

  constructor(private readonly config: AppConfigService) {
    this.resend = new Resend(this.config.resendApiKey);
  }

  async send(message: EmailMessage): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.config.emailFrom,
        to: message.to,
        subject: message.subject,
        html: message.html,
      });
    } catch (error) {
      this.logger.error('Error sending email', error as Error);
      throw error;
    }
  }
}
