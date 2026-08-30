import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { NewUser, User, UserChanges } from '../../domain/entities/user.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByVerificationToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { verificationToken: token } });
  }

  create(data: NewUser): Promise<User> {
    return this.prisma.user.create({ data });
  }

  update(id: string, changes: UserChanges): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: changes });
  }
}
