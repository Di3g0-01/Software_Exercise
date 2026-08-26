export declare abstract class EmailProvider {
    abstract sendVerificationEmail(email: string, token: string): Promise<any>;
}
