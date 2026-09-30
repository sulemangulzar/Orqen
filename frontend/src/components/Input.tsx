import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <input
        className={`w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-teal-300 ${className}`}
        {...props}
      />
    </label>
  );
}
