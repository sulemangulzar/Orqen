import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { navigate } from '../lib/router';

const links = [
  ['Product', '#product'],
  ['Capabilities', '#capabilities'],
  ['Teams', '#teams'],
  ['Templates', '#templates'],
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[rgba(252,252,253,.88)] backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <a href="#top" aria-label="Orqen home" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]">
          <Logo size="sm" />
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="text-[13px] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button onClick={() => navigate('/login')} className="rounded-lg px-4 py-2.5 text-[13px] font-semibold text-[var(--text-secondary)] transition hover:bg-slate-100 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]">
            Login
          </button>
          <button onClick={() => navigate('/signup')} className="rounded-lg bg-[var(--navy-950)] px-4 py-2.5 text-[13px] font-semibold text-white shadow-[var(--shadow-button)] transition hover:-translate-y-px hover:bg-[var(--navy-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)] focus-visible:ring-offset-2">
            Get Started
          </button>
        </div>

        <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation" className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-primary)] md:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--border-subtle)] bg-white px-5 py-5 md:hidden">
          <nav className="mx-auto flex max-w-[1200px] flex-col" aria-label="Mobile navigation">
            {links.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)} className="border-b border-[var(--border-subtle)] py-4 text-sm font-medium text-[var(--text-primary)]">{label}</a>
            ))}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={() => navigate('/login')} className="rounded-lg border border-[var(--border-strong)] px-4 py-3 text-sm font-semibold">Login</button>
              <button onClick={() => navigate('/signup')} className="rounded-lg bg-[var(--navy-950)] px-4 py-3 text-sm font-semibold text-white">Get Started</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
