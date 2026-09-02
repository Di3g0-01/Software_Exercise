import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  firstName: string;

  @IsString()
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
  lastName: string;

  @IsEmail({}, { message: 'Correo electronico invalido' })
  email: string;

  @Type(() => Number)
  @IsInt({ message: 'La edad debe ser un numero entero' })
  @Min(21, { message: 'Debes ser mayor de 21 anos' })
  @Max(120, { message: 'Edad no valida' })
  age: number;

  @IsString()
  @MinLength(8, { message: 'La contrasena debe tener al menos 8 caracteres' })
  @Matches(/[A-Z]/, { message: 'Debe contener al menos una mayuscula' })
  @Matches(/[0-9]/, { message: 'Debe contener al menos un numero' })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'Debe contener al menos un caracter especial',
  })
  password: string;
}
