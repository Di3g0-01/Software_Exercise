export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<any>;
  abstract findByVerificationToken(token: string): Promise<any>;
  abstract create(data: any): Promise<any>;
  abstract update(id: string, data: any): Promise<any>;
}
