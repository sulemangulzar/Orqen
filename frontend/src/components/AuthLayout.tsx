import type { ReactNode } from 'react';
import { ArrowLeft, Check, ListTodo, ShieldCheck, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { navigate } from '../lib/router';

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

const previewItems = [
  'Order review assigned to Maya',
  'Support context added to task',
  'Weekly operations review ready',
];

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const isSignup = title.toLowerCase().includes('create');
  const alternateRoute = isSignup ? '/login' : '/signup';

  return (
    <main className="page-enter grid min-h-screen overflow-x-hidden bg-white text-[var(--text-primary)] lg:h-screen lg:grid-cols-[minmax(0,1fr)_minmax(420px,.86fr)]">
      <section className="auth-form-enter flex min-h-screen flex-col px-5 py-5 sm:px-8 sm:py-7 lg:h-screen lg:min-h-0 lg:px-16 lg:py-7">
        <header className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Orqen home"
            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]"
          >
            <Logo size="sm" />
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">
              {isSignup ? 'Already a member?' : 'New to Orqen?'}
            </span>
            <button
              type="button"
              onClick={() => navigate(alternateRoute)}
              className="rounded-lg px-2 py-1 text-xs font-semibold text-[var(--brand-blue)] transition hover:bg-blue-50"
            >
              {isSignup ? 'Sign in' : 'Create account'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              aria-label="Back to home"
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center py-7 sm:py-9">
          <div className="rounded-[20px] border border-white/80 bg-white/95 p-5 shadow-[0_18px_54px_rgba(15,23,42,.1)] backdrop-blur-xl sm:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[var(--brand-violet)]">Orqen account</p>
            <h1 className="mt-4 font-serif text-[42px] leading-none sm:text-[52px]">{title}</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--text-muted)]">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
          <p className="mt-5 text-center text-[11px] leading-5 text-[var(--text-soft)]">
            By continuing, you agree to Orqen's Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>

      <section className="auth-visual-enter relative hidden min-h-screen overflow-hidden bg-[#101d31] p-7 text-white lg:block">
        <div className="logo-gradient absolute inset-0" />
        <div className="absolute left-10 top-10 h-44 w-44 rounded-full bg-[#6bb9ff]/20 blur-3xl" />
        <div className="absolute bottom-16 right-8 h-52 w-52 rounded-full bg-[#6bb9ff]/20 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between rounded-[22px] border border-white/15 bg-white/[.055] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
          <div className="flex items-center justify-end">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold text-white/80">
              Business operations
            </span>
          </div>

          <div className="mx-auto w-full max-w-[520px]">
            <div className="mb-7 max-w-[440px]">
              <Sparkles className="h-5 w-5 text-white/80" />
              <h2 className="mt-5 font-serif text-[48px] leading-none">
                Your workday, easier to read.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
                Keep customers, orders, and team follow-through connected from the first update to the final decision.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white text-slate-900 shadow-[0_30px_80px_rgba(0,0,0,.24)]">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[.14em] text-slate-400">Orqen overview</p>
                  <p className="mt-1 text-xs font-semibold">Today's operational view</p>
                </div>
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#edf3ff] text-[var(--brand-blue)]">
                  <ListTodo className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="grid gap-2 p-5 sm:grid-cols-3">
                {[
                  ['Orders', 'In motion'],
                  ['Tasks', 'Assigned'],
                  ['Team activity', 'Visible'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-slate-100 p-3">
                    <p className="text-[9px] text-slate-400">{label}</p>
                    <p className="mt-2 text-[10px] font-semibold">{value}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 px-5 py-4">
                {previewItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 border-b border-slate-50 py-2.5 last:border-0">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#eaf1ff] text-[var(--brand-blue)]">
                      <Check className="h-3 w-3" />
                    </span>
                    <p className="text-[10px] font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="flex items-center gap-2 text-[11px] text-white/55">
            <ShieldCheck className="h-3.5 w-3.5" />
            Workspace controls and operational history stay visible.
          </p>
        </div>
      </section>
    </main>
  );
}
