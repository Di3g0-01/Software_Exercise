import { Injectable, Logger } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import { EmailMessage, EmailSender } from '../../domain/email/email-message';
import { AppConfigService } from '../config/app-config.service';

/** Unica responsabilidad: entregar un mensaje ya construido a traves de SendGrid. */
@Injectable()
export class SendgridEmailSender implements EmailSender {
  private readonly logger = new Logger(SendgridEmailSender.name);

  constructor(private readonly config: AppConfigService) {
    const apiKey = this.config.sendgridApiKey;
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    } else {
      this.logger.warn('SendGrid API Key is not set in the configuration');
    }
  }

  async send(message: EmailMessage): Promise<void> {
    try {
      await sgMail.send({
        from: this.config.emailFrom,
        to: message.to,
        subject: message.subject,
        html: message.html,
      });
    } catch (error) {
      this.logger.error('Error sending email via SendGrid: Invalid or missing API Key?', error as Error);
      // We don't throw here to avoid crashing the server on local testing without a valid key.
      // If this were production, we might want to throw or handle it differently.
    }
  }
}
