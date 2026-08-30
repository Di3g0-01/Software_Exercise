import { Module } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PrismaUserRepository } from './prisma-user.repository';

/** Unico lugar donde se elige la tecnologia de persistencia. */
@Module({
  providers: [{ provide: UserRepository, useClass: PrismaUserRepository }],
  exports: [UserRepository],
})
export class PersistenceModule {}
