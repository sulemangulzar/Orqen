import {
  ArrowRight,
  Check,
  CircleHelp,
  Clock3,
  Layers3,
  MoveUpRight,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react';
import type { MouseEvent } from 'react';
import { LandingNav } from '../components/LandingNav';
import { Logo } from '../components/Logo';
import { ProductPreview } from '../components/ProductPreview';
import { navigate } from '../lib/router';

const metrics = [
  ['4x', 'faster handoffs'],
  ['18h', 'saved each week'],
  ['92%', 'work with an owner'],
];

const outcomes = [
  {
    Icon: Layers3,
    title: 'One operating layer',
    description: 'Orders, customers, tasks, and decisions stay connected instead of drifting across separate tools.',
  },
  {
    Icon: Users,
    title: 'Clear team ownership',
    description: 'Every follow-up has context, a responsible person, and the next action your team can trust.',
  },
  {
    Icon: Zap,
    title: 'Fewer stalled moments',
    description: 'Spot exceptions early, attach the right context, and move from update to action without a meeting.',
  },
];

const workflow = [
  ['Capture', 'Bring orders, customers, notes, and team activity into one shared workspace.'],
  ['Prioritize', 'Surface the work that needs attention before it becomes a customer issue.'],
  ['Resolve', 'Assign owners, preserve context, and close the loop with a visible record.'],
];

const integrations = ['Shopify', 'Slack', 'Email', 'Customer records', 'Team tasks', 'Internal notes'];

export function Landing() {
  function scrollToSection(event: MouseEvent<HTMLAnchorElement>, target: string) {
    event.preventDefault();
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', window.location.pathname);
  }

  return (
    <main id="top" className="page-enter overflow-hidden bg-[var(--surface-page)] pt-18 text-[var(--text-primary)]">
      <LandingNav />

      <section className="relative border-b border-[var(--border-subtle)] bg-[linear-gradient(180deg,#ffffff_0%,#f6f8fb_100%)]">
        <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-[1240px] items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:py-16">
          <div className="hero-enter">
            <h1 className="max-w-[620px] font-serif text-[52px] leading-none sm:text-[68px] lg:text-[76px]">
              Run operations from one calm workspace.
            </h1>
            <p className="mt-6 max-w-[560px] text-[16px] leading-7 text-[var(--text-muted)] sm:text-[17px]">
              Orqen brings customers, orders, tasks, and business context together so your team can see what matters, decide faster, and keep work moving.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="inline-flex items-center justify-center gap-2 rounded-lg logo-gradient px-5 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-button)] transition hover:-translate-y-px hover:brightness-110"
              >
                Create your workspace
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#overview"
                onClick={(event) => scrollToSection(event, '#overview')}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View product
                <MoveUpRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-10 grid max-w-[540px] grid-cols-3 divide-x divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
              {metrics.map(([value, label]) => (
                <div key={label} className="px-4 py-4">
                  <p className="font-serif text-3xl leading-none text-[var(--brand-blue)]">{value}</p>
                  <p className="mt-2 text-[11px] font-medium text-[var(--text-muted)]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="overview" className="relative hero-enter lg:pl-4">
            <div className="rounded-[24px] border border-[#dce3ef] bg-[#f8fafc] p-3 shadow-[0_28px_90px_rgba(23,48,91,.14)] sm:p-5">
              <div className="mb-4 flex items-center justify-between px-1">
                <p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-600">Live workspace</p>
                <p className="text-[10px] font-medium text-slate-400">Orqen / Operations</p>
              </div>
              <ProductPreview />
            </div>
          </div>
        </div>
      </section>

      <section id="connected" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase text-[var(--brand-blue)]">Why teams switch</p>
              <h2 className="mt-4 max-w-[520px] font-serif text-[44px] leading-tight sm:text-[58px]">
                Less status chasing. More work finished.
              </h2>
            </div>
            <p className="max-w-[560px] text-[15px] leading-7 text-[var(--text-muted)]">
              Most operation teams do not need another place to store tasks. They need a reliable way to connect the task to the customer, order, message, decision, and owner behind it.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {outcomes.map(({ Icon, title, description }) => (
              <article key={title} className="rounded-lg border border-slate-200 bg-[#fbfcff] p-6 shadow-sm">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#eaf1ff] text-[var(--brand-blue)]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="logo-gradient border-y border-[#14243a] py-20 text-white sm:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase text-[var(--brand-blue)]">Daily command center</p>
            <h2 className="mt-4 max-w-[520px] font-serif text-[44px] leading-tight sm:text-[58px]">
              Make the next action obvious.
            </h2>
            <p className="mt-5 max-w-[500px] text-[15px] leading-7 text-slate-400">
              Orqen turns operational noise into a clear path forward: what changed, why it matters, who owns it, and what happens next.
            </p>
            <div className="mt-8 space-y-4">
              {workflow.map(([title, description], index) => (
                <div key={title} className="grid grid-cols-[42px_1fr] gap-4">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#14243a] text-sm font-bold text-[#a9c2ff] shadow-sm ring-1 ring-white/10">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ProductPreview variant="workflow" />
        </div>
      </section>

      <section id="tools" className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="rounded-xl border border-slate-200 bg-[#fbfcff] p-3 shadow-[var(--shadow-card)]">
            <ProductPreview variant="integrations" compact />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-[var(--brand-violet)]">Connected context</p>
            <h2 className="mt-4 max-w-[520px] font-serif text-[44px] leading-tight sm:text-[58px]">
              Keep your tools. Fix the gaps between them.
            </h2>
            <p className="mt-5 max-w-[500px] text-[15px] leading-7 text-[var(--text-muted)]">
              Start with the Orqen workspace, then connect the systems your team already depends on. Everyone gets the same operational picture without rebuilding the business.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {integrations.map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="logo-gradient py-20 text-white sm:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase text-[#a9c2ff]">Built with control</p>
            <h2 className="mt-4 max-w-[520px] font-serif text-[44px] leading-tight sm:text-[58px]">
              A workspace your team can actually trust.
            </h2>
            <p className="mt-5 max-w-[500px] text-[15px] leading-7 text-slate-400">
              Operational software should make responsibility visible. Orqen keeps ownership, permissions, status, and history easy to inspect.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [ShieldCheck, 'Admin controls', 'Manage access and connected systems from one place.'],
              [Clock3, 'Visible history', 'Know when records changed and why work moved.'],
              [Check, 'Human approval', 'Keep important actions reviewed before they go out.'],
            ].map(([Icon, title, description]) => {
              const CardIcon = Icon as typeof ShieldCheck;
              return (
                <article key={title as string} className="rounded-lg border border-white/10 bg-white/[.06] p-5">
                  <CardIcon className="h-5 w-5 text-[#a9c2ff]" />
                  <h3 className="mt-5 text-sm font-semibold">{title as string}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{description as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[24px] bg-[linear-gradient(125deg,#eef5ff_0%,#ffffff_52%,#e8efff_100%)] px-6 py-14 ring-1 ring-slate-200 sm:px-12 sm:py-18">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase text-[var(--brand-blue)]">Start clearer</p>
              <h2 className="mt-4 max-w-[720px] font-serif text-[44px] leading-tight sm:text-[64px]">
                Give your team one place to run the day.
              </h2>
              <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-[var(--text-muted)]">
                Create an Orqen workspace and start replacing scattered updates with accountable operations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="inline-flex items-center justify-center gap-2 rounded-lg logo-gradient px-5 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-button)] transition hover:-translate-y-px hover:brightness-110"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_auto_auto_auto] md:items-start">
          <div>
            <Logo size="sm" />
            <p className="mt-4 max-w-[300px] text-xs leading-5 text-[var(--text-muted)]">
              A connected workspace for businesses managing the work that keeps customers and teams moving.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold">Product</p>
            <div className="mt-3 space-y-2 text-xs text-[var(--text-muted)]">
              <a className="block hover:text-[var(--brand-blue)]" href="#overview" onClick={(event) => scrollToSection(event, '#overview')}>Overview</a>
              <a className="block hover:text-[var(--brand-blue)]" href="#connected" onClick={(event) => scrollToSection(event, '#connected')}>Workspace</a>
              <a className="block hover:text-[var(--brand-blue)]" href="#tools" onClick={(event) => scrollToSection(event, '#tools')}>Tools</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold">Account</p>
            <div className="mt-3 space-y-2 text-xs text-[var(--text-muted)]">
              <button className="block hover:text-[var(--brand-blue)]" onClick={() => navigate('/login')}>Sign in</button>
              <button className="block hover:text-[var(--brand-blue)]" onClick={() => navigate('/signup')}>Get started</button>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold">Legal</p>
            <div className="mt-3 space-y-2 text-xs text-[var(--text-muted)]">
              <span className="block">Privacy Policy pending</span>
              <span className="block">Terms pending</span>
              <span className="mt-4 flex items-center gap-1 text-[var(--text-soft)]">
                <CircleHelp className="h-3 w-3" />
                Product preview only
              </span>
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 border-t border-slate-200 px-5 py-5 text-[10px] text-[var(--text-soft)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Orqen</p>
          <p>Business operations, reimagined</p>
        </div>
      </footer>
    </main>
  );
}
