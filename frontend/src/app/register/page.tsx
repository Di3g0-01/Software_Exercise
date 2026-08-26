"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AccessibleInput } from '@/components/AccessibleInput';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const registerSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  age: z.coerce.number().min(18, "Debes ser mayor de 18 años").max(120, "Edad no válida"),
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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid, touchedFields }, watch } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError("");
    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const errData = await res.json();
        setServerError(errData.message || "Error al registrar usuario");
      }
    } catch (error) {
      setServerError("Error de conexión con el servidor");
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

      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm text-center" role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-2 gap-4">
          <AccessibleInput
            label="Nombre"
            type="text"
            {...register("firstName")}
            error={errors.firstName?.message}
            isValid={touchedFields.firstName && !errors.firstName}
          />
          <AccessibleInput
            label="Apellido"
            type="text"
            {...register("lastName")}
            error={errors.lastName?.message}
            isValid={touchedFields.lastName && !errors.lastName}
          />
        </div>

        <AccessibleInput
          label="Correo Electrónico"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          isValid={touchedFields.email && !errors.email}
        />

        <AccessibleInput
          label="Edad"
          type="number"
          {...register("age")}
          error={errors.age?.message}
          isValid={touchedFields.age && !errors.age}
        />

        <div className="relative">
          <AccessibleInput
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={errors.password?.message}
            isValid={touchedFields.password && !errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 text-slate-400 hover:text-slate-600 focus-ring rounded"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <AccessibleInput
            label="Confirmar Contraseña"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
            isValid={touchedFields.confirmPassword && !errors.confirmPassword}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-10 text-slate-400 hover:text-slate-600 focus-ring rounded"
            aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-primary text-white font-medium py-3 rounded shadow-flat hover:bg-primary-hover focus-ring transition-colors"
        >
          Registrarse
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
