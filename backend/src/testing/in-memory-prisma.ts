import { NewUser, User, UserChanges } from '../domain/entities/user.entity';

/** Doble en memoria de PrismaService, con las consultas que usa el repositorio. */
export class InMemoryPrisma {
  readonly rows: User[] = [];
  private seq = 0;

  user = {
    findUnique: ({
      where,
    }: {
      where: { email: string };
    }): Promise<User | null> =>
      Promise.resolve(this.rows.find((u) => u.email === where.email) ?? null),

    findFirst: ({
      where,
    }: {
      where: { verificationToken: string };
    }): Promise<User | null> =>
      Promise.resolve(
        this.rows.find(
          (u) => u.verificationToken === where.verificationToken,
        ) ?? null,
      ),

    create: ({ data }: { data: NewUser }): Promise<User> => {
      const user: User = {
        id: `user-${++this.seq}`,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };
      this.rows.push(user);
      return Promise.resolve(user);
    },

    update: ({
      where,
      data,
    }: {
      where: { id: string };
      data: UserChanges;
    }): Promise<User> => {
      const user = this.rows.find((u) => u.id === where.id);
      if (!user) return Promise.reject(new Error('not found'));
      Object.assign(user, data, { updatedAt: new Date() });
      return Promise.resolve(user);
    },
  };
}
