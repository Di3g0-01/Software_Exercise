import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppConfigModule } from './infrastructure/config/config.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AppConfigModule, PrismaModule, AuthModule],
})
export class AppModule {}
