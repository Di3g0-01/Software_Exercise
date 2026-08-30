import React from 'react';

/** Unica responsabilidad: presentar un error de servidor en un formulario. */
export function FormAlert({ message }: { message: string }) {
  return (
    <div
      className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm text-center"
      role="alert"
    >
      {message}
    </div>
  );
}
