import { Injectable } from '@nestjs/common';
import {
  EmailMessage,
  VerificationEmailTemplate,
} from '../../domain/email/email-message';

/** Unica responsabilidad: el contenido del correo de verificacion. */
@Injectable()
export class HtmlVerificationEmailTemplate implements VerificationEmailTemplate {
  build(to: string, verificationLink: string): EmailMessage {
    return {
      to,
      subject: 'Verify your email address',
      html:
        `<p>Please verify your email address by clicking the link below:</p>` +
        `<p><a href="${verificationLink}">${verificationLink}</a></p>`,
    };
  }
}
