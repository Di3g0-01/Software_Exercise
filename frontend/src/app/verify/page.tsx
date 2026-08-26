"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const called = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    if (called.current) return;
    called.current = true;

    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/verify?token=${token}`);
        if (response.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Verificación de Cuenta</h1>
        
        {status === "loading" && (
          <p className="text-gray-600">Verificando tu cuenta, por favor espera...</p>
        )}

        {status === "success" && (
          <div>
            <div className="text-green-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {status === "error" && (
          <div>
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-gray-700 mb-6">El enlace es inválido o ha expirado. Por favor, asegúrate de haber copiado el enlace correcto.</p>
            <Link
              href="/register"
              className="inline-block text-blue-600 hover:underline font-medium"
            >
              Volver al registro
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
