import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<any> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByVerificationToken(token: string): Promise<any> {
    return this.prisma.user.findFirst({ where: { verificationToken: token } });
  }

  async create(data: any): Promise<any> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.user.update({ where: { id }, data });
  }
}
