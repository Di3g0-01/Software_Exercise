import { postJson, apiRequest } from './http';
import type { LoginFormValues, RegisterFormValues } from '../schemas/auth.schema';

export interface MessageResponse {
  message: string;
}

export interface LoginResponse {
  access_token: string;
}

/** Unica responsabilidad: el contrato con los endpoints de /auth. */
export const authApi = {
  register({ confirmPassword, ...payload }: RegisterFormValues) {
    // confirmPassword solo existe para la validacion del formulario.
    return postJson<MessageResponse>('/auth/register', payload);
  },

  login(payload: LoginFormValues) {
    return postJson<LoginResponse>('/auth/login', payload);
  },

  verifyEmail(token: string) {
    return apiRequest<MessageResponse>(
      `/auth/verify?token=${encodeURIComponent(token)}`,
    );
  },
};
