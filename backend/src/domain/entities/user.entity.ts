export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  passwordHash: string;
  isVerified: boolean;
  verificationToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewUser {
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  passwordHash: string;
  verificationToken: string;
}

export type UserChanges = Partial<
  Pick<User, 'isVerified' | 'verificationToken' | 'passwordHash'>
>;
