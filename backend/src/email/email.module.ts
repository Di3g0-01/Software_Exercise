import { Module } from '@nestjs/common';
import { EmailProvider } from '../domain/providers/email.provider';
import { ResendEmailProvider } from '../infrastructure/providers/resend-email.provider';

@Module({
  providers: [
    {
      provide: EmailProvider,
      useClass: ResendEmailProvider,
    },
  ],
  exports: [EmailProvider],
})
export class EmailModule {}
