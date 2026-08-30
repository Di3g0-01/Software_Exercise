import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenPayload,
  AccessTokenProvider,
} from '../../domain/providers/access-token.provider';

@Injectable()
export class JwtAccessTokenProvider implements AccessTokenProvider {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: AccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
