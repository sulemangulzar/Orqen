import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { Logo } from './Logo';
import { navigate } from '../lib/router';

const links = [
  ['Product', '#overview'],
  ['Why Orqen', '#connected'],
  ['Integrations', '#tools'],
];

function scrollToSection(event: MouseEvent<HTMLAnchorElement>, target: string) {
  event.preventDefault();
  document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.replaceState(null, '', window.location.pathname);
}

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--border-subtle)] bg-[rgba(252,252,253,.88)] font-sans backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <a href="#top" onClick={(event) => scrollToSection(event, '#top')} aria-label="Orqen home" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]">
          <Logo size="sm" />
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-8 font-sans md:flex">
          {links.map(([label, href]) => (
            <a key={label} href={href} onClick={(event) => scrollToSection(event, href)} className="text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--brand-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button onClick={() => navigate('/login')} className="rounded-lg px-4 py-2.5 text-[13px] font-semibold text-[var(--text-secondary)] transition hover:bg-slate-100 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]">
            Login
          </button>
          <button onClick={() => navigate('/signup')} className="logo-gradient rounded-lg px-4 py-2.5 text-[13px] font-semibold text-white shadow-[var(--shadow-button)] transition hover:-translate-y-px hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)] focus-visible:ring-offset-2">
            Get Started
          </button>
        </div>

        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} className="relative grid h-10 w-10 place-items-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-primary)] transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)] md:hidden">
          <Menu className={`absolute h-5 w-5 transition duration-200 ${open ? 'scale-75 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'}`} />
          <X className={`absolute h-5 w-5 transition duration-200 ${open ? 'scale-100 opacity-100 rotate-0' : 'scale-75 opacity-0 -rotate-90'}`} />
        </button>
      </div>

      <div className={`grid overflow-hidden border-t border-[var(--border-subtle)] bg-white transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="min-h-0">
          <nav id="mobile-navigation" className={`mx-auto flex max-w-[1200px] flex-col px-5 py-5 font-sans transition-transform duration-300 ease-out ${open ? 'translate-y-0' : '-translate-y-3'}`} aria-label="Mobile navigation" aria-hidden={!open}>
            {links.map(([label, href]) => (
              <a key={label} href={href} tabIndex={open ? 0 : -1} onClick={(event) => { scrollToSection(event, href); setOpen(false); }} className="border-b border-[var(--border-subtle)] py-4 text-sm font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--brand-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]">{label}</a>
            ))}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button tabIndex={open ? 0 : -1} onClick={() => navigate('/login')} className="rounded-lg border border-[var(--border-strong)] px-4 py-3 text-sm font-semibold">Login</button>
              <button tabIndex={open ? 0 : -1} onClick={() => navigate('/signup')} className="logo-gradient rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)] transition hover:brightness-110">Get Started</button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
