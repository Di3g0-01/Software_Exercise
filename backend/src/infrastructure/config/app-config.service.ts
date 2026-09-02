import { Injectable } from '@nestjs/common';

/**
 * Unico punto donde se lee `process.env`. Cambiar el origen de la
 * configuracion (fichero, secret manager) no afecta al resto del codigo.
 */
@Injectable()
export class AppConfigService {
  get frontendUrl(): string {
    return process.env.FRONTEND_URL || 'https://hmfinca.com';
  }

  get emailFrom(): string {
    return process.env.EMAIL_FROM || 'HMFinca <hola@hmfinca.com>';
  }

  get sendgridApiKey(): string | undefined {
    return process.env.SENDGRID_API_KEY;
  }

  get jwtSecret(): string {
    return process.env.JWT_SECRET || 'fallback_secret';
  }

  get jwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || '1h';
  }

  get port(): number {
    return Number(process.env.PORT ?? 3001);
  }
}
