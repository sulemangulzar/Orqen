import { FormEvent, useEffect, useState } from 'react';
import { Building2, Check, ClipboardList, Sparkles } from 'lucide-react';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { api } from '../lib/api';
import { getAccessToken } from '../lib/auth';
import { navigate } from '../lib/router';

export function Onboarding() {
  const [step, setStep] = useState(1);
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate('/login');
      return;
    }
    api.me(token).catch(() => navigate('/login'));
  }, []);

  function next(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (step < 3) setStep(step + 1);
    else setError('Onboarding backend is next. These details are ready to submit once the organization endpoint is created.');
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <ThemeToggle />
      </header>
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-[2rem] border border-slate-200 bg-white/70 p-6 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-sm font-semibold text-teal-600 dark:text-teal-300">Workspace onboarding</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Teach Orqen how your operations run.</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">We’ll turn your workspace details into the starting point for your AI operation copilot.</p>
          <div className="mt-8 space-y-3">
            {[
              [Building2, 'Company basics'],
              [ClipboardList, 'Operational priorities'],
              [Sparkles, 'AI copilot setup'],
            ].map(([Icon, label], index) => (
              <div key={String(label)} className={`flex items-center gap-3 rounded-2xl p-3 ${step >= index + 1 ? 'bg-teal-500/10 text-teal-700 dark:text-teal-200' : 'bg-slate-100 text-slate-500 dark:bg-white/5'}`}>
                <div className="grid h-9 w-9 place-items-center rounded-full bg-white dark:bg-white/10">
                  {step > index + 1 ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className="font-medium">{String(label)}</span>
              </div>
            ))}
          </div>
        </aside>

        <form onSubmit={next} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-950/5 dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
          {error && <div className="mb-5"><Alert tone="info" message={error} /></div>}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Company basics</h2>
              <Input label="Company name" value={company} onChange={(e) => setCompany(e.target.value)} required placeholder="Acme Operations" />
              <Input label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://acme.com" />
              <Input label="Team size" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} placeholder="1-10, 11-50, 51-200" />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">What should Orqen improve first?</h2>
              {['Customer onboarding', 'Internal approvals', 'Weekly reporting', 'Ticket triage'].map((item) => (
                <button key={item} type="button" onClick={() => setGoal(item)} className={`w-full rounded-2xl border p-4 text-left transition ${goal === item ? 'border-teal-400 bg-teal-500/10' : 'border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:bg-white/5'}`}>{item}</button>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Ready to create your operations cockpit</h2>
              <div className="rounded-2xl bg-slate-100 p-5 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">
                <p><strong>Company:</strong> {company || 'Not set'}</p>
                <p><strong>Website:</strong> {website || 'Not set'}</p>
                <p><strong>Team size:</strong> {teamSize || 'Not set'}</p>
                <p><strong>First priority:</strong> {goal || 'Not set'}</p>
              </div>
            </div>
          )}
          <div className="mt-8 flex justify-between">
            <Button type="button" variant="secondary" onClick={() => (step === 1 ? navigate('/') : setStep(step - 1))}>Back</Button>
            <Button type="submit">{step === 3 ? 'Finish onboarding' : 'Continue'}</Button>
          </div>
        </form>
      </section>
    </main>
  );
}
