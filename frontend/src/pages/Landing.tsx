import { ArrowRight, Bot, CheckCircle2, LineChart, Moon, Shield, Sparkles, Workflow } from 'lucide-react';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { navigate } from '../lib/router';

const features = [
  { icon: Workflow, title: 'Operational workflows', text: 'Coordinate SOPs, tickets, approvals, and recurring work from one AI-assisted cockpit.' },
  { icon: Bot, title: 'AI execution copilot', text: 'Summarize context, draft next actions, and keep teams aligned without manual chasing.' },
  { icon: LineChart, title: 'Live operations signal', text: 'Spot blockers, workload gaps, and SLA risks before they become business problems.' },
  { icon: Shield, title: 'Built for teams', text: 'Secure auth, workspace onboarding, invitations, and role-based access from day one.' },
];

export function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-120px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-teal-400/20 blur-3xl animate-pulse-glow" />
        <div className="absolute right-[-120px] top-1/3 h-[320px] w-[320px] rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          <a href="#features" className="hover:text-slate-950 dark:hover:text-white">Features</a>
          <a href="#flow" className="hover:text-slate-950 dark:hover:text-white">Flow</a>
          <a href="#security" className="hover:text-slate-950 dark:hover:text-white">Security</a>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="ghost" onClick={() => navigate('/login')} className="hidden sm:inline-flex">Login</Button>
          <Button onClick={() => navigate('/signup')}>Get started</Button>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-2 text-sm font-semibold text-teal-700 dark:text-teal-200">
            <Sparkles className="h-4 w-4" /> AI Operation Copilot for modern teams
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            Run operations with calm, clarity, and AI speed.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Orqen helps founders and ops teams turn scattered work into guided workflows, intelligent summaries, and action-ready decisions.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => navigate('/signup')} className="gap-2">Start free <ArrowRight className="h-4 w-4" /></Button>
            <Button variant="secondary" onClick={() => navigate('/login')}>I already have an account</Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
            {['Email verification', 'Secure refresh cookies', 'Onboarding ready'].map((item) => (
              <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-500" /> {item}</span>
            ))}
          </div>
        </div>

        <div className="relative animate-float-slow">
          <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-4 shadow-2xl shadow-slate-950/10 backdrop-blur dark:border-white/10 dark:bg-white/[0.05]">
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white dark:bg-black/40">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Today’s operation health</p>
                  <h3 className="text-2xl font-semibold">92% on track</h3>
                </div>
                <div className="rounded-full bg-teal-400/20 px-3 py-1 text-sm text-teal-200">Live</div>
              </div>
              <div className="grid gap-3">
                {[
                  ['Customer onboarding', 'AI drafted 4 follow-ups', 'bg-teal-400'],
                  ['Vendor approvals', '2 blockers detected', 'bg-amber-400'],
                  ['Weekly reporting', 'Ready for review', 'bg-indigo-400'],
                ].map(([title, text, color]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${color}`} />
                      <div>
                        <p className="font-medium">{title}</p>
                        <p className="text-sm text-slate-400">{text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">Built for execution</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">A minimal cockpit for daily operations.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-slate-200 bg-white/70 p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/5 dark:border-white/10 dark:bg-white/[0.04]">
              <feature.icon className="mb-5 h-6 w-6 text-teal-500" />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="flow" className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[2rem] border border-slate-200 bg-white/70 p-8 dark:border-white/10 dark:bg-white/[0.04] lg:p-10">
          <h2 className="text-3xl font-semibold tracking-tight">Simple account flow</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {['Sign up', 'Verify email', 'Log in', 'Onboard workspace'].map((step, index) => (
              <div key={step} className="rounded-2xl bg-slate-100 p-5 dark:bg-white/5">
                <span className="text-sm font-semibold text-teal-600 dark:text-teal-300">0{index + 1}</span>
                <p className="mt-3 font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="security" className="relative mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <Logo markOnly />
        <p>© {new Date().getFullYear()} Orqen. Designed for calm operations.</p>
        <div className="inline-flex items-center gap-2"><Moon className="h-4 w-4" /> Light and dark ready</div>
      </footer>
    </main>
  );
}
