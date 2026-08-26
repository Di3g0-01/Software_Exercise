"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AccessibleInput } from '@/components/AccessibleInput';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("");
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const { access_token } = await res.json();
        localStorage.setItem("token", access_token);
        alert("¡Sesión iniciada con éxito! (Redirigiendo...)");
        // Aquí podrías redirigir al dashboard: router.push('/dashboard')
      } else {
        const errData = await res.json();
        setServerError(errData.message || "Error al iniciar sesión");
      }
    } catch (error) {
      setServerError("Error de conexión con el servidor");
    }
  };

  return (
    <main className="w-full max-w-md p-8 bg-white rounded-lg shadow-flat border border-slate-200">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Iniciar Sesión</h1>
        <p className="text-slate-500 mt-2">Ingresa tus credenciales para acceder</p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm text-center" role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AccessibleInput
          label="Correo Electrónico"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <div className="relative">
          <AccessibleInput
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={errors.password?.message}
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

        <button
          type="submit"
          className="w-full mt-6 bg-primary text-white font-medium py-3 rounded shadow-flat hover:bg-primary-hover focus-ring transition-colors"
        >
          Entrar
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
