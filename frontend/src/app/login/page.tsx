"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { AccessibleInput } from '@/components/AccessibleInput';
import { PasswordInput } from '@/components/PasswordInput';
import { FormAlert } from '@/components/FormAlert';
import { loginSchema, type LoginFormValues } from '@/lib/schemas/auth.schema';
import { authApi } from '@/lib/api/authApi';
import { saveSession } from '@/lib/session';

export default function LoginPage() {
  const [serverError, setServerError] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError('');
    try {
      const { access_token } = await authApi.login(data);
      saveSession(access_token);
      setSignedIn(true);
    } catch (error) {
      setServerError((error as Error).message);
    }
  };

  return (
    <main className="w-full max-w-md p-8 bg-white rounded-lg shadow-flat border border-slate-200">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Iniciar Sesión</h1>
        <p className="text-slate-500 mt-2">Ingresa tus credenciales para acceder</p>
      </div>

      {serverError && <FormAlert message={serverError} />}

      {signedIn && (
        <div
          className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm text-center"
          role="status"
        >
          ¡Sesión iniciada con éxito!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AccessibleInput
          label="Correo Electrónico"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <PasswordInput
          label="Contraseña"
          {...register('password')}
          error={errors.password?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 bg-primary text-white font-medium py-3 rounded shadow-flat hover:bg-primary-hover focus-ring transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-primary font-medium hover:underline focus-ring rounded">
            Regístrate aquí
          </Link>
        </p>
      </form>
    </main>
  );
}
