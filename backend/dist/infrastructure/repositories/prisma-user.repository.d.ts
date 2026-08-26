import { UserRepository } from '../../domain/repositories/user.repository';
import { PrismaService } from '../../prisma/prisma.service';
export declare class PrismaUserRepository implements UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<any>;
    findByVerificationToken(token: string): Promise<any>;
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
}
