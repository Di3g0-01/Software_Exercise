export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}

/** Transporte de correo: solo sabe entregar un mensaje ya construido. */
export abstract class EmailSender {
  abstract send(message: EmailMessage): Promise<void>;
}

/**
 * Construye el cuerpo del correo de verificacion. Anadir otro correo
 * (recuperar contrasena, bienvenida) es crear una plantilla nueva, no
 * modificar las existentes ni el transporte.
 */
export abstract class VerificationEmailTemplate {
  abstract build(to: string, verificationLink: string): EmailMessage;
}
