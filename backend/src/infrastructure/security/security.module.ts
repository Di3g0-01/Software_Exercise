import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';
import { HashProvider } from '../../domain/providers/hash.provider';
import { TokenGenerator } from '../../domain/providers/token-generator.provider';
import { AccessTokenProvider } from '../../domain/providers/access-token.provider';
import { BcryptHashProvider } from '../providers/bcrypt-hash.provider';
import { CryptoTokenGenerator } from '../providers/crypto-token.generator';
import { JwtAccessTokenProvider } from '../providers/jwt-access-token.provider';
import { AppConfigService } from '../config/app-config.service';

/** Unico lugar donde se eligen los algoritmos de hash y de sesion. */
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.jwtSecret,
        signOptions: {
          expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
        },
      }),
    }),
  ],
  providers: [
    { provide: HashProvider, useClass: BcryptHashProvider },
    { provide: TokenGenerator, useClass: CryptoTokenGenerator },
    { provide: AccessTokenProvider, useClass: JwtAccessTokenProvider },
  ],
  exports: [HashProvider, TokenGenerator, AccessTokenProvider],
})
export class SecurityModule {}
