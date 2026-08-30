import { API_BASE_URL } from '../config';

export class ApiError extends Error {}

function extractMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const { message } = payload as { message: unknown };
    // Nest devuelve string o string[] segun el numero de errores de validacion.
    if (Array.isArray(message) && message.length > 0) return String(message[0]);
    if (typeof message === 'string' && message) return message;
  }
  return fallback;
}

/**
 * Unica responsabilidad: hablar HTTP con el backend y normalizar los errores.
 * Las paginas no conocen fetch, URLs ni formatos de error.
 */
export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch {
    throw new ApiError('Error de conexión con el servidor');
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(extractMessage(payload, 'Ocurrió un error inesperado'));
  }

  return payload as T;
}

export function postJson<T>(path: string, body: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
