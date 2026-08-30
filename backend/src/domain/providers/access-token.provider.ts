export interface AccessTokenPayload {
  sub: string;
  email: string;
}

/**
 * Emite la credencial de sesion. La implementacion actual usa JWT, pero el
 * caso de uso solo conoce esta abstraccion.
 */
export abstract class AccessTokenProvider {
  abstract sign(payload: AccessTokenPayload): Promise<string>;
}
