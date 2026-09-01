import { IsEmail, IsInt, IsString, Min, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  firstName: string;

  @IsString()
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
  lastName: string;

  @IsEmail({}, { message: 'Correo electrónico inválido' })
  email: string;

  @IsInt()
  @Min(21, { message: 'Debes ser mayor de 21 años' })
  age: number;

  @IsString()
  @MinLength(8, { message: 'Mínimo 8 caracteres' })
  @Matches(/[A-Z]/, { message: 'Debe contener al menos una mayúscula' })
  @Matches(/[0-9]/, { message: 'Debe contener al menos un número' })
  @Matches(/[^A-Za-z0-9]/, { message: 'Debe contener al menos un carácter especial' })
  password: string;
}
