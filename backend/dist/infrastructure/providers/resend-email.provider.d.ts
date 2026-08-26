import { EmailProvider } from '../../domain/providers/email.provider';
export declare class ResendEmailProvider implements EmailProvider {
    private resend;
    constructor();
    sendVerificationEmail(email: string, token: string): Promise<import("resend").CreateEmailResponse>;
}
