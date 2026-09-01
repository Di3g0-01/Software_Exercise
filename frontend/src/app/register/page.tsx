"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
<<<<<<< HEAD
import { AccessibleInput } from '@/components/AccessibleInput';
import { PasswordInput } from '@/components/PasswordInput';
import { FormAlert } from '@/components/FormAlert';
import { registerSchema, type RegisterFormValues } from '@/lib/schemas/auth.schema';
import { authApi } from '@/lib/api/authApi';
=======

const registerSchema = z.object({
  firstName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  lastName: z.string().min(3, "El apellido debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  age: z.coerce.number().min(21, "Debes ser mayor de 21 años").max(120, "Edad no válida"),
  password: z.string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;
>>>>>>> 22bab61 (Update form validation rules on frontend and backend)

export default function RegisterPage() {
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError('');
    try {
      await authApi.register(data);
      setSuccess(true);
    } catch (error) {
      setServerError((error as Error).message);
    }
  };

  if (success) {
    return (
      <main className="w-full max-w-md p-8 bg-white rounded-lg shadow-flat border border-slate-200 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">¡Registro Exitoso!</h2>
        <p className="text-slate-600 mb-6">Hemos enviado un correo electrónico para verificar tu cuenta. Por favor, revisa tu bandeja de entrada.</p>
        <Link href="/login" className="px-6 py-2 bg-primary text-white font-medium rounded shadow-flat hover:bg-primary-hover focus-ring inline-block">
          Ir a iniciar sesión
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full max-w-md p-8 bg-white rounded-lg shadow-flat border border-slate-200">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Crear Cuenta</h1>
        <p className="text-slate-500 mt-2">Ingresa tus datos para registrarte</p>
      </div>

      {serverError && <FormAlert message={serverError} />}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-2 gap-4">
          <AccessibleInput
            label="Nombre"
            type="text"
            {...register('firstName')}
            error={errors.firstName?.message}
            isValid={touchedFields.firstName && !errors.firstName}
          />
          <AccessibleInput
            label="Apellido"
            type="text"
            {...register('lastName')}
            error={errors.lastName?.message}
            isValid={touchedFields.lastName && !errors.lastName}
          />
        </div>

        <AccessibleInput
          label="Correo Electrónico"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          isValid={touchedFields.email && !errors.email}
        />

        <AccessibleInput
          label="Edad"
          type="number"
          {...register('age')}
          error={errors.age?.message}
          isValid={touchedFields.age && !errors.age}
        />

        <PasswordInput
          label="Contraseña"
          {...register('password')}
          error={errors.password?.message}
          isValid={touchedFields.password && !errors.password}
        />

        <PasswordInput
          label="Confirmar Contraseña"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          isValid={touchedFields.confirmPassword && !errors.confirmPassword}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 bg-primary text-white font-medium py-3 rounded shadow-flat hover:bg-primary-hover focus-ring transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline focus-ring rounded">
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </main>
  );
}
