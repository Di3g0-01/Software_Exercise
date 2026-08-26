import { Injectable } from '@nestjs/common';
import { EmailProvider } from '../../domain/providers/email.provider';
import { Resend } from 'resend';

@Injectable()
export class ResendEmailProvider implements EmailProvider {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationEmail(email: string, token: string) {
    const baseUrl = process.env.FRONTEND_URL || 'https://hmfinca.com';
    const verifyLink = `${baseUrl}/verify?token=${token}`;

    try {
      const data = await this.resend.emails.send({
        from: 'HMFinca <hola@hmfinca.com>',
        to: email,
        subject: 'Verify your email address',
        html: `<p>Please verify your email address by clicking the link below:</p><p><a href="${verifyLink}">${verifyLink}</a></p>`,
      });
      return data;
    } catch (error) {
      console.error('Error sending email', error);
      throw error;
    }
  }
}
