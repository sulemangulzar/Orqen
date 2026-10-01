import { AlertTriangle, ArrowUpRight, Check, ChevronDown, Circle, Clock3, MoreHorizontal, Search, Sparkles } from 'lucide-react';

const updates = [
  { title: 'Customer onboarding', detail: 'Approval is waiting for an owner', status: 'Needs owner', tone: 'amber' },
  { title: 'Operations review', detail: 'Updates and open decisions are gathered', status: 'In review', tone: 'blue' },
  { title: 'Vendor renewal', detail: 'Contract context added to the workflow', status: 'Updated', tone: 'slate' },
];

const sections = ['Overview', 'Operations', 'Decisions', 'Templates'];

export function ProductDashboard() {
  return (
    <div className="overflow-hidden rounded-[16px] border border-[var(--border-strong)] bg-white text-left shadow-[var(--shadow-product)] sm:rounded-[20px]">
      <div className="flex h-14 items-center justify-between border-b border-[var(--border-subtle)] px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--navy-950)] text-xs font-bold text-white">O</div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[var(--text-primary)]">Orqen workspace</p>
            <p className="text-[10px] text-[var(--text-soft)]">Operations</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-[var(--text-soft)]" />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Search workspace" className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] transition hover:bg-slate-50"><Search className="h-3.5 w-3.5" /></button>
          <div aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full border border-[var(--border-subtle)] bg-slate-50"><Circle className="h-3 w-3 text-slate-400" /></div>
        </div>
      </div>

      <div className="grid md:grid-cols-[190px_1fr]">
        <aside className="hidden border-r border-[var(--border-subtle)] bg-[#fafbfc] p-4 md:block">
          <p className="px-2 text-[9px] font-bold uppercase tracking-[.14em] text-[var(--text-soft)]">Workspace</p>
          {sections.map((item, index) => (
            <div key={item} className={`mt-1 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-medium ${index === 0 ? 'bg-white text-[var(--text-primary)] shadow-sm ring-1 ring-black/[.04]' : 'text-[var(--text-muted)]'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${index === 0 ? 'bg-[var(--brand-blue)]' : 'bg-slate-300'}`} />{item}
            </div>
          ))}
          <p className="mb-2 mt-7 px-2 text-[9px] font-bold uppercase tracking-[.14em] text-[var(--text-soft)]">In progress</p>
          {['Customer onboarding', 'Vendor approval', 'Operations review'].map((item) => <div key={item} className="px-2.5 py-2 text-[10px] text-[var(--text-muted)]">{item}</div>)}
        </aside>

        <div className="min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[var(--brand-blue)]">Workspace overview</p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-.03em] text-[var(--text-primary)] sm:text-2xl">Current operations</h3>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Updates, decisions, and work that needs a next step.</p>
            </div>
            <button type="button" className="flex w-fit items-center gap-2 rounded-lg bg-[var(--navy-950)] px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-[var(--navy-800)]"><Sparkles className="h-3 w-3" /> Ask Orqen</button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ['Workflow status', 'In progress', 'Customer onboarding and review'],
              ['Needs attention', 'Owner needed', 'Approval is not yet assigned'],
              ['Latest decision', 'Under review', 'Launch readiness depends on approval'],
            ].map(([label, value, detail], index) => (
              <div key={label} className="rounded-xl border border-[var(--border-subtle)] p-4">
                <div className="flex items-center justify-between"><p className="text-[10px] font-medium text-[var(--text-muted)]">{label}</p>{index === 1 ? <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> : <ArrowUpRight className="h-3.5 w-3.5 text-[var(--text-soft)]" />}</div>
                <p className="mt-3 text-[15px] font-semibold tracking-[-.02em]">{value}</p>
                <p className="mt-1 text-[9px] leading-4 text-[var(--text-soft)]">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
            <div className="rounded-xl border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
                <div><p className="text-xs font-semibold">Operational updates</p><p className="text-[9px] text-[var(--text-soft)]">Recent context across active work</p></div>
                <MoreHorizontal className="h-4 w-4 text-[var(--text-soft)]" />
              </div>
              <div className="divide-y divide-[var(--border-subtle)]">
                {updates.map((update) => (
                  <div key={update.title} className="flex items-start gap-3 p-4">
                    <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${update.tone === 'amber' ? 'bg-amber-400' : update.tone === 'blue' ? 'bg-[var(--brand-blue)]' : 'bg-slate-300'}`} />
                    <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-semibold">{update.title}</p><p className="mt-1 text-[9px] leading-4 text-[var(--text-muted)]">{update.detail}</p></div>
                    <span className="rounded-md bg-slate-50 px-2 py-1 text-[8px] font-semibold text-[var(--text-muted)]">{update.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#cfdbff] bg-[#f6f8ff] p-4">
              <div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--brand-blue)] text-white"><Sparkles className="h-3.5 w-3.5" /></span><p className="text-xs font-semibold">Orqen brief</p></div>
              <p className="mt-4 text-[11px] font-medium leading-5 text-[var(--text-secondary)]">An onboarding workflow is waiting on an approval owner.</p>
              <div className="mt-4 rounded-lg border border-[#dce5ff] bg-white p-3">
                <p className="text-[9px] font-semibold text-[var(--text-muted)]">Possible next step</p>
                <p className="mt-1 text-[10px] leading-4">Assign an owner and record the decision needed to proceed.</p>
              </div>
              <button type="button" className="mt-4 flex items-center gap-1 text-[9px] font-bold text-[var(--brand-blue)]">Review context <ArrowUpRight className="h-3 w-3" /></button>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] px-4 py-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Check className="h-3.5 w-3.5" /></span>
            <div className="flex-1"><p className="text-[10px] font-semibold">Operations review</p><p className="text-[9px] text-[var(--text-soft)]">Updates and open decisions are ready to review.</p></div>
            <Clock3 className="h-3.5 w-3.5 text-[var(--text-soft)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
