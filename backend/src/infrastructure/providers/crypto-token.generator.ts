import { Injectable } from '@nestjs/common';
import { TokenGenerator } from '../../domain/providers/token-generator.provider';
import { randomBytes } from 'crypto';

@Injectable()
export class CryptoTokenGenerator implements TokenGenerator {
  generate(): string {
    return randomBytes(32).toString('hex');
  }
}
