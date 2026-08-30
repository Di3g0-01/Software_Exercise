/**
 * Avisa al usuario de que debe verificar su cuenta. El caso de uso de registro
 * no sabe si el aviso viaja por correo, SMS o cualquier otro canal.
 */
export abstract class VerificationNotifier {
  abstract notifyVerificationRequired(
    email: string,
    token: string,
  ): Promise<void>;
}
