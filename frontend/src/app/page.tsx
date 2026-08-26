import Link from 'next/link';

export default function Home() {
  return (
    <main className="text-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenido</h1>
      <p className="mb-8">Sistema de autenticación moderno y accesible.</p>
      <div className="flex gap-4 justify-center">
        <Link href="/login" className="px-6 py-2 bg-primary text-white font-medium rounded shadow-flat hover:bg-primary-hover focus-ring">
          Iniciar Sesión
        </Link>
        <Link href="/register" className="px-6 py-2 bg-white text-slate-800 font-medium rounded border border-slate-300 shadow-flat hover:bg-slate-50 focus-ring">
          Registrarse
        </Link>
      </div>
    </main>
  );
}
