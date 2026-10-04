import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark';
  children: ReactNode;
};

const variants = {
  primary: 'logo-gradient text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 hover:brightness-110',
  dark: 'bg-black text-white shadow-[0_18px_45px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 hover:bg-[#15151a]',
  secondary: 'border border-slate-200 bg-white/75 text-slate-900 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10',
  ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10',
};

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
