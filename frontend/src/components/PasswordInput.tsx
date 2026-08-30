'use client';

import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AccessibleInput } from './AccessibleInput';
import type { InputHTMLAttributes } from 'react';

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  helperText?: string;
  isValid?: boolean;
}

/**
 * Extiende AccessibleInput con el conmutador de visibilidad, en lugar de
 * repetir el boton en cada formulario.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <AccessibleInput
          {...props}
          ref={ref}
          type={visible ? 'text' : 'password'}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3 top-10 text-slate-400 hover:text-slate-600 focus-ring rounded"
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {visible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
