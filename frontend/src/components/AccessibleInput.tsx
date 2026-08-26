import React, { InputHTMLAttributes, useId, forwardRef } from 'react';

interface AccessibleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  isValid?: boolean; // For visual checkmarks if needed
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ label, error, helperText, isValid, id, ...props }, ref) => {
    const defaultId = useId();
    const inputId = id || defaultId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const describedBy = [
      error ? errorId : null,
      helperText ? helperId : null,
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div className="flex flex-col mb-4 text-left">
        <label htmlFor={inputId} className="mb-1 font-medium text-slate-700">
          {label}
        </label>
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={`w-full p-3 border rounded shadow-flat text-slate-800 
              focus-ring bg-white transition-colors
              ${error ? 'border-red-500' : 'border-slate-300'}
              ${isValid ? 'border-green-500 pr-10' : ''}
            `}
            {...props}
          />
          {isValid && !error && (
            <div className="absolute right-3 top-3 text-green-500 pointer-events-none" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          )}
        </div>
        
        {error && (
          <span id={errorId} className="text-red-500 text-sm mt-1 font-medium" role="alert">
            {error}
          </span>
        )}
        {helperText && !error && (
          <span id={helperId} className="text-slate-500 text-sm mt-1">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);
AccessibleInput.displayName = 'AccessibleInput';
