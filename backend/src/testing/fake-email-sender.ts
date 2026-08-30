import { EmailMessage, EmailSender } from '../domain/email/email-message';

export class FakeEmailSender implements EmailSender {
  readonly sent: EmailMessage[] = [];

  send(message: EmailMessage): Promise<void> {
    this.sent.push(message);
    return Promise.resolve();
  }
}
