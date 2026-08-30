import { NewUser, User, UserChanges } from '../entities/user.entity';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByVerificationToken(token: string): Promise<User | null>;
  abstract create(data: NewUser): Promise<User>;
  abstract update(id: string, changes: UserChanges): Promise<User>;
}
