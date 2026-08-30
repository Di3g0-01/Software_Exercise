import { IsString, MinLength } from 'class-validator';

export class VerifyEmailDto {
  @IsString({ message: 'El token de verificacion es obligatorio' })
  @MinLength(1, { message: 'El token de verificacion es obligatorio' })
  token: string;
}
