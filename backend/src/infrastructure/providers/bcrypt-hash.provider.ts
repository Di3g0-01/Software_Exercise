import { Injectable } from '@nestjs/common';
import { HashProvider } from '../../domain/providers/hash.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHashProvider implements HashProvider {
  async hash(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(data, salt);
  }

  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
