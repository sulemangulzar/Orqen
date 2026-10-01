import { ArrowRight, Check, ChevronRight, ClipboardCheck, MessageSquareText, Play, Sparkles, Target } from 'lucide-react';
import { LandingNav } from '../components/LandingNav';
import { Logo } from '../components/Logo';
import { ProductDashboard } from '../components/ProductDashboard';
import { SectionHeading } from '../components/SectionHeading';
import { navigate } from '../lib/router';

const fragmentation = [
  ['Updates', 'Buried across messages and meetings'],
  ['Decisions', 'Separated from their original context'],
  ['Ownership', 'Unclear until work becomes urgent'],
  ['Knowledge', 'Lost when priorities or people change'],
];

const capabilities = [
  {
    number: '01',
    icon: MessageSquareText,
    title: 'Capture what changed',
    description: 'Keep operational updates, context, and open questions together instead of reconstructing them later.',
  },
  {
    number: '02',
    icon: Target,
    title: 'Coordinate decisions',
    description: 'Give owners a shared view of dependencies, decisions, and work that needs attention.',
  },
  {
    number: '03',
    icon: ClipboardCheck,
    title: 'Execute with continuity',
    description: 'Preserve the reasoning behind work so recurring operations become easier to repeat and improve.',
  },
];

const templates = [
  ['Customer onboarding', 'Coordinate milestones, owners, decisions, and launch readiness.'],
  ['Weekly operations review', 'Prepare a consistent view of updates, risks, and open actions.'],
  ['Approval workflow', 'Keep requests, context, and decisions connected from start to finish.'],
  ['Incident follow-up', 'Capture what happened, what changed, and what the team will do next.'],
];

export function Landing() {
  return (
    <main id="top" className="page-enter bg-[var(--surface-page)] text-[var(--text-primary)]">
      <LandingNav />

      <section className="hero-enter mx-auto max-w-[1200px] px-5 pb-16 pt-20 text-center sm:px-8 sm:pb-20 sm:pt-28 lg:pt-32">
        <p className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#d7e1ff] bg-[#f4f7ff] px-3.5 py-2 text-[11px] font-semibold text-[#315ac7]">
          <Sparkles className="h-3.5 w-3.5" /> AI Operations Copilot
        </p>
        <h1 className="mx-auto mt-7 max-w-[940px] text-balance font-serif text-[54px] leading-[.98] tracking-[-.055em] sm:text-[72px] lg:text-[88px]">
          Run operations with{' '}
          <span className="relative whitespace-nowrap text-[var(--brand-blue)]">
            intelligent clarity.
            <span className="absolute inset-x-0 -bottom-1 h-[5px] rounded-full bg-[#dbe4ff]" aria-hidden="true" />
          </span>
        </h1>
        <p className="mx-auto mt-7 max-w-[680px] text-balance text-[16px] leading-7 text-[var(--text-muted)] sm:text-[18px] sm:leading-8">
          Bring your team's workflows, decisions, and operational knowledge together. Orqen helps you stay aligned and understand what needs attention.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={() => navigate('/signup')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--navy-950)] px-5 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-button)] transition hover:-translate-y-px hover:bg-[var(--navy-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)] focus-visible:ring-offset-2">
            Get Started <ArrowRight className="h-4 w-4" />
          </button>
          <a href="#product" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] bg-white px-5 py-3.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]">
            <Play className="h-3.5 w-3.5" /> Explore Orqen
          </a>
        </div>
      </section>

      <section id="product" className="reveal-section mx-auto max-w-[1280px] px-3 pb-24 sm:px-6 lg:pb-32">
        <div className="rounded-[28px] border border-[#d9e2ff] bg-[#edf3ff] p-2.5 sm:p-5 lg:p-8">
          <div className="mb-4 flex items-center justify-between px-2 sm:px-1">
            <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#4e6db6]">Illustrative product preview</p>
            <p className="hidden text-[10px] text-[#6c7fae] sm:block">Sample workspace and scenario</p>
          </div>
          <ProductDashboard />
        </div>
      </section>

      <section className="reveal-section border-y border-[var(--border-subtle)] bg-white py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1200px] gap-14 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <SectionHeading
            eyebrow="The operational gap"
            title="Your team has the information. The problem is keeping it connected."
            description="Day-to-day operations fragment quickly. Context lives in one place, decisions in another, and the reason behind work is often missing when someone needs it most."
          />
          <div className="border-t border-[var(--border-strong)]">
            {fragmentation.map(([title, description], index) => (
              <div key={title} className="grid gap-3 border-b border-[var(--border-subtle)] py-5 sm:grid-cols-[48px_150px_1fr] sm:items-center">
                <span className="text-[11px] font-semibold text-[var(--text-soft)]">0{index + 1}</span>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
                <p className="text-sm text-[var(--text-muted)]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal-section overflow-hidden border-y border-[var(--border-subtle)] bg-[#f7f9fc] py-20 sm:py-28">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <SectionHeading
              eyebrow="A unified workspace"
              title="Operational context that stays useful after the meeting ends."
              description="Keep updates, workflow state, decisions, and ownership in a shared record—so teams can move forward without rebuilding context."
            />
            <p className="max-w-[480px] pb-1 text-sm leading-7 text-[var(--text-muted)] lg:justify-self-end">A change becomes more useful when the reason, decision, and next action travel with it.</p>
          </div>
          <div className="mt-12 grid overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-white sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Update captured', 'An onboarding request is waiting on legal approval.'],
              ['Context attached', 'Approval is needed before access can be enabled.'],
              ['Decision recorded', 'The review owner and decision are made explicit.'],
              ['Next action', 'Confirm approval, then update launch readiness.'],
            ].map(([title, text], index) => (
              <article key={title} className={`relative min-h-[170px] p-5 sm:p-6 ${index > 0 ? 'border-t border-[var(--border-subtle)] sm:border-l sm:border-t-0' : ''} ${index > 1 ? 'lg:border-t-0' : ''}`}>
                <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[var(--brand-blue)]">Step 0{index + 1}</p>
                <h3 className="mt-5 text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">{text}</p>
                {index < 3 && <ChevronRight className="absolute right-4 top-6 hidden h-4 w-4 text-slate-300 lg:block" aria-hidden="true" />}
              </article>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-[var(--text-soft)]">Illustrative operational scenario</p>
        </div>
      </section>

      <section id="capabilities" className="reveal-section bg-[var(--navy-950)] py-24 text-white sm:py-32">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#83a8ff]">Capture. Coordinate. Execute.</p>
              <h2 className="mt-4 max-w-[520px] font-serif text-[42px] leading-[1.05] tracking-[-.045em] sm:text-[54px]">A clearer operating rhythm for work that crosses teams.</h2>
            </div>
            <p className="max-w-[520px] text-[15px] leading-7 text-slate-400 lg:justify-self-end">Build a durable record of what changed, what was decided, and what happens next—without turning every update into another meeting.</p>
          </div>
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/15 bg-white text-[var(--text-primary)] shadow-[0_24px_64px_rgba(0,0,0,.2)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-5 py-4 sm:px-7">
              <div><p className="text-xs font-semibold">Workflow record</p><p className="mt-1 text-[10px] text-[var(--text-soft)]">Illustrative customer onboarding scenario</p></div>
              <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-semibold text-amber-800">Approval needed</span>
            </div>
            <div className="grid lg:grid-cols-[1fr_290px]">
              <div className="divide-y divide-[var(--border-subtle)]">
                {[
                  ['Update', 'Legal approval is required before access can be enabled.', 'Captured'],
                  ['Context', 'The review is part of the launch readiness workflow.', 'Linked'],
                  ['Decision', 'Confirm who owns the review and when it is due.', 'Open'],
                  ['Next action', 'Record the approval and update the workflow status.', 'Ready to assign'],
                ].map(([label, text, status], index) => (
                  <div key={label} className="grid gap-2 px-5 py-4 sm:grid-cols-[112px_1fr_auto] sm:items-center sm:px-7">
                    <div className="flex items-center gap-2"><span className={`grid h-6 w-6 place-items-center rounded-md ${index < 2 ? 'bg-[#edf3ff] text-[var(--brand-blue)]' : 'bg-slate-100 text-[var(--text-muted)]'}`}>{index < 2 ? <Check className="h-3.5 w-3.5" /> : <span className="text-[10px] font-semibold">0{index + 1}</span>}</span><span className="text-[11px] font-semibold">{label}</span></div>
                    <p className="text-xs leading-5 text-[var(--text-muted)]">{text}</p>
                    <span className="w-fit text-[9px] font-medium text-[var(--text-soft)] sm:text-right">{status}</span>
                  </div>
                ))}
              </div>
              <aside className="border-t border-[var(--border-subtle)] bg-[#f7f9ff] p-5 sm:p-6 lg:border-l lg:border-t-0">
                <div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--brand-blue)] text-white"><Sparkles className="h-3.5 w-3.5" /></span><p className="text-xs font-semibold">Orqen context</p></div>
                <p className="mt-4 text-xs leading-6 text-[var(--text-secondary)]">The next step depends on a decision. Keep its owner and outcome with the workflow, so the team can continue with the same context.</p>
                <div className="mt-5 border-t border-[#dce4ff] pt-4"><p className="text-[9px] font-semibold uppercase tracking-[.12em] text-[var(--text-soft)]">Suggested follow-through</p><p className="mt-2 text-[11px] font-medium leading-5">Assign a reviewer, capture the outcome, then update readiness.</p></div>
              </aside>
            </div>
          </div>
          <div className="mt-12 grid border-t border-white/15 lg:grid-cols-3">
            {capabilities.map((item, index) => (
              <article key={item.title} className={`py-8 lg:px-8 ${index > 0 ? 'border-t border-white/15 lg:border-l lg:border-t-0' : ''} ${index === 0 ? 'lg:pl-0' : ''}`}>
                <div className="flex items-center justify-between"><item.icon className="h-5 w-5 text-[#83a8ff]" /><span className="text-[10px] font-semibold text-slate-500">{item.number}</span></div>
                <h3 className="mt-10 text-xl font-semibold tracking-[-.02em]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="teams" className="reveal-section py-24 sm:py-32">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="grid gap-14 lg:grid-cols-[.88fr_1.12fr] lg:items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-[20px] border border-[var(--border-strong)] bg-white p-5 shadow-[var(--shadow-card)] sm:p-7">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-5"><div><p className="text-xs font-semibold">Example decision record</p><p className="mt-1 text-[10px] text-[var(--text-soft)]">Customer launch readiness scenario</p></div><span className="rounded-md bg-[#eef3ff] px-2 py-1 text-[9px] font-semibold text-[#315ac7]">Open</span></div>
                <div className="py-6"><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[var(--text-soft)]">Decision needed</p><p className="mt-2 text-base font-semibold">Proceed before final legal review?</p><p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">Legal approval is the remaining dependency in this example scenario.</p></div>
                <div className="grid gap-3 border-t border-[var(--border-subtle)] pt-5 sm:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-3"><p className="text-[9px] text-[var(--text-soft)]">Owner</p><p className="mt-1 text-xs font-semibold">Needs assignment</p></div>
                  <div className="rounded-lg bg-slate-50 p-3"><p className="text-[9px] text-[var(--text-soft)]">Timing</p><p className="mt-1 text-xs font-semibold">Before launch</p></div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeading
                eyebrow="Team coordination"
                title="Keep decisions close to the work they affect."
                description="When operational decisions have clear context, owners, and deadlines, teams spend less time asking what happened and more time moving the work forward."
              />
              <ul className="mt-7 space-y-3">
                {['Shared visibility across active work', 'Clear ownership for decisions and next actions', 'Context that remains available to the team'].map((item) => <li key={item} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#edf2ff] text-[var(--brand-blue)]"><Check className="h-3 w-3" /></span>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-section border-y border-[var(--border-subtle)] bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
            <SectionHeading
              eyebrow="AI Operations Copilot"
              title="Understand what needs attention without reading every update."
              description="Orqen's copilot experience is designed to help teams review operational context, identify unresolved dependencies, and prepare practical next steps."
            />
            <div className="overflow-hidden rounded-[20px] border border-[#cad7ff] bg-[#f5f7ff]">
              <div className="border-b border-[#dce4ff] p-5 sm:p-6">
                <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--brand-blue)] text-white"><Sparkles className="h-4 w-4" /></span><div><p className="text-xs font-semibold">Ask Orqen</p><p className="text-[10px] text-[var(--text-soft)]">Illustrative response based on a sample scenario</p></div></div>
                <p className="mt-5 rounded-xl border border-[#d8e1ff] bg-white p-4 text-sm font-medium">What is blocking this onboarding workflow?</p>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-sm leading-7 text-[var(--text-secondary)]">In this example, legal approval is unresolved and no owner is recorded yet. That decision needs to be captured before the workflow can move forward.</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#dce4ff] bg-white p-4"><p className="text-[9px] font-semibold uppercase tracking-[.12em] text-[var(--text-soft)]">Needs attention</p><p className="mt-2 text-xs font-semibold">Assign the unowned legal review</p></div>
                  <div className="rounded-xl border border-[#dce4ff] bg-white p-4"><p className="text-[9px] font-semibold uppercase tracking-[.12em] text-[var(--text-soft)]">Prepare next</p><p className="mt-2 text-xs font-semibold">Update launch readiness after decision</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="templates" className="reveal-section py-24 sm:py-32">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <SectionHeading
            eyebrow="Practical starting points"
            title="Structure the operations your team repeats."
            description="Use consistent workspace patterns for operational processes that benefit from shared context, ownership, and follow-through."
            align="center"
          />
          <div className="mt-14 grid border-t border-[var(--border-strong)] sm:grid-cols-2">
            {templates.map(([title, description], index) => (
              <article key={title} className={`group border-b border-[var(--border-subtle)] py-7 sm:p-8 ${index % 2 === 0 ? 'sm:border-r' : ''}`}>
                <div className="flex items-start justify-between gap-6"><div><p className="text-base font-semibold tracking-[-.02em]">{title}</p><p className="mt-2 max-w-[430px] text-sm leading-6 text-[var(--text-muted)]">{description}</p></div><ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[var(--text-soft)] transition group-hover:translate-x-1 group-hover:text-[var(--brand-blue)]" /></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal-section px-5 pb-8 sm:px-8 sm:pb-12">
        <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[24px] bg-[var(--navy-950)] px-6 py-16 text-white sm:px-12 sm:py-20 lg:flex lg:items-end lg:justify-between">
          <div className="max-w-[650px]">
            <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#83a8ff]">Build a clearer operating system</p>
            <h2 className="mt-4 font-serif text-[44px] leading-[1.03] tracking-[-.045em] sm:text-[58px]">Bring the work, context, and decisions together.</h2>
            <p className="mt-5 max-w-[540px] text-sm leading-7 text-slate-400">Create your account, verify your email, and begin setting up your Orqen workspace.</p>
          </div>
          <button onClick={() => navigate('/signup')} className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3.5 text-sm font-semibold text-[var(--navy-950)] transition hover:-translate-y-px hover:bg-[#eef3ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#83a8ff] lg:mt-0">
            Get Started <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <footer className="border-t border-[var(--border-subtle)] bg-white">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto_auto] md:items-start">
          <div><Logo size="sm" /><p className="mt-4 max-w-[300px] text-xs leading-5 text-[var(--text-muted)]">AI-assisted operational visibility and coordination for modern teams.</p></div>
          <div><p className="text-xs font-semibold">Product</p><div className="mt-3 space-y-2 text-xs text-[var(--text-muted)]"><a className="block" href="#product">Overview</a><a className="block" href="#capabilities">Capabilities</a><a className="block" href="#templates">Templates</a></div></div>
          <div><p className="text-xs font-semibold">Account</p><div className="mt-3 space-y-2 text-xs text-[var(--text-muted)]"><button className="block" onClick={() => navigate('/login')}>Login</button><button className="block" onClick={() => navigate('/signup')}>Get Started</button></div></div>
        </div>
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 border-t border-[var(--border-subtle)] px-5 py-5 text-[10px] text-[var(--text-soft)] sm:flex-row sm:items-center sm:justify-between sm:px-8"><p>© {new Date().getFullYear()} Orqen</p><p>AI Operations Copilot</p></div>
      </footer>
    </main>
  );
}
