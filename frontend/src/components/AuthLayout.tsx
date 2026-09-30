import type { ReactNode } from 'react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { navigate } from '../lib/router';

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-400/20 blur-3xl" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <button onClick={() => navigate('/')} className="text-left">
          <Logo />
        </button>
        <ThemeToggle />
      </header>
      <section className="relative mx-auto grid min-h-[calc(100vh-96px)] max-w-6xl place-items-center px-6 py-10">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-2xl shadow-slate-950/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20 sm:p-8">
          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold text-teal-600 dark:text-teal-300">Orqen workspace access</p>
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{subtitle}</p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
