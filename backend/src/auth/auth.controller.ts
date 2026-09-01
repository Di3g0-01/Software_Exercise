import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
<<<<<<< HEAD
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { VerifyEmailUseCase } from '../application/use-cases/verify-email.use-case';
import { RegisterDto } from '../application/dto/register.dto';
import { LoginDto } from '../application/dto/login.dto';
import { VerifyEmailDto } from '../application/dto/verify-email.dto';
=======
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
>>>>>>> 22bab61 (Update form validation rules on frontend and backend)

/**
 * Adaptador HTTP: su unica razon de cambio es el contrato REST de /auth.
 * Toda la logica vive en los casos de uso.
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly login: LoginUseCase,
    private readonly verifyEmail: VerifyEmailUseCase,
  ) {}

  @Post('register')
<<<<<<< HEAD
  register(@Body() body: RegisterDto) {
    return this.registerUser.execute(body);
=======
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
>>>>>>> 22bab61 (Update form validation rules on frontend and backend)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() body: LoginDto) {
    return this.login.execute(body);
  }

  @Get('verify')
  verify(@Query() query: VerifyEmailDto) {
    return this.verifyEmail.execute(query.token);
  }
}
