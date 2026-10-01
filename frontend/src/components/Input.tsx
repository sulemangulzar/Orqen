import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

const inputStyles = 'w-full rounded-lg border border-[var(--border-strong)] bg-white px-3.5 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-slate-400 focus:border-[var(--brand-blue)] focus:ring-4 focus:ring-[var(--brand-blue)]/10';

export function Input({ label, className = '', error, hint, id, ...props }: InputProps) {
  const inputId = id ?? props.name ?? label.toLowerCase().replaceAll(' ', '-');
  const helpId = `${inputId}-help`;
  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-2 block text-[13px] font-semibold text-[var(--text-secondary)]">{label}</span>
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? helpId : undefined}
        className={`${inputStyles} ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : ''} ${className}`}
        {...props}
      />
      {(error || hint) && <span id={helpId} className={`mt-1.5 block text-xs ${error ? 'text-rose-600' : 'text-[var(--text-muted)]'}`}>{error ?? hint}</span>}
    </label>
  );
}

export function PasswordInput({ label, className = '', error, hint, id, ...props }: InputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? props.name ?? label.toLowerCase().replaceAll(' ', '-');
  const helpId = `${inputId}-help`;
  return (
    <div className="block">
      <label className="mb-2 block text-[13px] font-semibold text-[var(--text-secondary)]" htmlFor={inputId}>{label}</label>
      <span className="relative block">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? helpId : undefined}
          className={`${inputStyles} pr-12 ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : ''} ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-[var(--text-soft)] transition hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-blue)]"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </span>
      {(error || hint) && <span id={helpId} className={`mt-1.5 block text-xs ${error ? 'text-rose-600' : 'text-[var(--text-muted)]'}`}>{error ?? hint}</span>}
    </div>
  );
}
