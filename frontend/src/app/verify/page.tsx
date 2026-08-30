"use client";

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/authApi';

type VerificationStatus = 'loading' | 'success' | 'error';

/** Unica responsabilidad: orquestar la verificacion y exponer su estado. */
function useEmailVerification(token: string | null): VerificationStatus {
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const alreadyCalled = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    if (alreadyCalled.current) return;
    alreadyCalled.current = true;

    authApi
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return status;
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const status = useEmailVerification(searchParams.get('token'));

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Verificación de Cuenta</h1>

      {status === 'loading' && (
        <p className="text-gray-600">Verificando tu cuenta, por favor espera...</p>
      )}

      {status === 'success' && (
        <div>
          <div className="text-green-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-700 mb-6">Tu cuenta ha sido verificada exitosamente.</p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Ir a Iniciar Sesión
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div>
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-gray-700 mb-6">El enlace es inválido o ha expirado. Por favor, asegúrate de haber copiado el enlace correcto.</p>
          <Link href="/register" className="inline-block text-blue-600 hover:underline font-medium">
            Volver al registro
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={<p className="text-gray-600">Cargando...</p>}>
        <VerifyContent />
      </Suspense>
    </main>
  );
}
