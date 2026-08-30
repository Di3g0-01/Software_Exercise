import { Injectable } from '@nestjs/common';
import { VerificationNotifier } from '../../domain/notifications/verification-notifier';
import {
  EmailSender,
  VerificationEmailTemplate,
} from '../../domain/email/email-message';
import { AppConfigService } from '../config/app-config.service';

/**
 * Unica responsabilidad: componer el aviso de verificacion (enlace + plantilla)
 * y entregarlo al transporte de correo.
 */
@Injectable()
export class EmailVerificationNotifier implements VerificationNotifier {
  constructor(
    private readonly emailSender: EmailSender,
    private readonly template: VerificationEmailTemplate,
    private readonly config: AppConfigService,
  ) {}

  async notifyVerificationRequired(
    email: string,
    token: string,
  ): Promise<void> {
    const verificationLink = `${this.config.frontendUrl}/verify?token=${encodeURIComponent(token)}`;
    await this.emailSender.send(this.template.build(email, verificationLink));
  }
}
