const TOKEN_KEY = 'token';

/** Unica responsabilidad: donde y como se guarda la sesion en el navegador. */
export function saveSession(accessToken: string): void {
  localStorage.setItem(TOKEN_KEY, accessToken);
}

export function readSession(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
}
