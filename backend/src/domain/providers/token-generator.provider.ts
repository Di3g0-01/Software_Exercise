/**
 * Genera los tokens de un solo uso (verificacion de correo, recuperacion de
 * contrasena). Aislarlo permite cambiar la estrategia -- bytes aleatorios,
 * OTP numerico, token firmado -- sin tocar los casos de uso.
 */
export abstract class TokenGenerator {
  abstract generate(): string;
}
