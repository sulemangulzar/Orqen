import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';
import { navigate } from '../lib/router';

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <main className="page-enter flex min-h-screen flex-col bg-[var(--surface-page)] px-5 text-[var(--text-primary)] sm:px-8">
      <header className="mx-auto flex w-full max-w-[1120px] items-center justify-between py-6 sm:py-8">
        <button type="button" onClick={() => navigate('/')} aria-label="Orqen home" className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]">
          <Logo size="sm" />
        </button>
        <button type="button" onClick={() => navigate('/')} className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-xs font-medium text-[var(--text-muted)] transition hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </button>
      </header>

      <section className="auth-form-enter flex flex-1 items-center justify-center py-10 sm:py-14">
        <div className="w-full max-w-[440px] rounded-2xl border border-[var(--border-subtle)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-10">
          <div className="mb-8 h-1 w-10 rounded-full bg-[var(--brand-blue)]" aria-hidden="true" />
          <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[var(--brand-blue)]">Orqen account</p>
          <h1 className="mt-3 font-serif text-[38px] leading-[1.02] tracking-[-.045em] sm:text-[44px]">{title}</h1>
          <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
      <footer className="pb-6 text-center text-[11px] text-[var(--text-soft)] sm:pb-8">AI-assisted operational visibility and coordination.</footer>
    </main>
  );
}
