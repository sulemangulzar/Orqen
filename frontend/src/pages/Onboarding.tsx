import { useEffect, useState } from 'react';
import { ArrowRight, Check, MailPlus, SkipForward, Users, Workflow } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { api } from '../lib/api';
import { getAccessToken } from '../lib/auth';
import { navigate } from '../lib/router';

const steps = ['Create organization', 'Invite your team', 'Enter workspace'];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [organization, setOrganization] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) { navigate('/login'); return; }
    api.me(token).catch(() => navigate('/login'));
  }, []);

  async function next() {
    setMessage('');
    if (step === 0 && !organization.trim()) { setMessage('Add an organization name to continue.'); return; }
    if (step === 0) {
      const token = getAccessToken();
      if (!token) { navigate('/login'); return; }
      setSaving(true);
      try {
        await api.createOrganization(token, {
          name: organization.trim(),
        });
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Could not create the organization.');
        setSaving(false);
        return;
      }
      setSaving(false);
    }
    if (step < steps.length - 1) setStep((value) => value + 1);
    else navigate('/dashboard');
  }

  return <AuthLayout title={step === 2 ? 'Your workspace is ready.' : 'Set up your workspace.'} subtitle={step === 2 ? 'This is where your team will organize everyday business operations.' : 'A few details will help shape your first Orqen workspace.'}>
    <div className="mb-8 grid grid-cols-4 gap-2">{steps.map((label, index) => <div key={label}><div className={`h-1 rounded-full ${index <= step ? 'bg-[var(--brand-blue)]' : 'bg-slate-200'}`} /><p className={`mt-2 hidden text-[9px] font-semibold sm:block ${index <= step ? 'text-[var(--brand-blue)]' : 'text-slate-400'}`}>{label}</p></div>)}</div>
    {message && <p role="alert" className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">{message}</p>}
    {step === 0 && <div className="space-y-4"><Input label="Organization name" value={organization} onChange={(event) => setOrganization(event.target.value)} placeholder="Your company" required /><div className="grid gap-4 sm:grid-cols-2"><Input label="Industry" value={industry} onChange={(event) => setIndustry(event.target.value)} placeholder="Retail, services…" /><Input label="Country" value={country} onChange={(event) => setCountry(event.target.value)} placeholder="United States" /></div><p className="text-[11px] leading-5 text-[var(--text-soft)]">Your workspace URL is generated automatically from the organization name. You will start as the owner on the free plan.</p></div>}
    {step === 1 && <div className="space-y-5"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#edf3ff] text-[var(--brand-blue)]"><MailPlus className="h-5 w-5" /></div><div><h2 className="text-xl font-semibold tracking-[-.03em]">Invite your team</h2><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Add work emails separated by commas. This step is optional and can be done later.</p></div><Input label="Team email addresses" value={emails} onChange={(event) => setEmails(event.target.value)} placeholder="alex@company.com, sam@company.com" /><div className="flex items-center gap-2 text-xs text-[var(--text-soft)]"><Users className="h-4 w-4" /> Invitations will be available once the backend endpoint is connected.</div></div>}
    {step === 2 && <div className="rounded-xl border border-[var(--border-subtle)] bg-[#f7f9fc] p-5"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--navy-950)] text-white"><Workflow className="h-5 w-5" /></div><h2 className="mt-5 text-xl font-semibold">Welcome to {organization || 'your workspace'}.</h2><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Your connected place for customers, orders, tasks, and team activity.</p><div className="mt-5 space-y-3 text-xs text-[var(--text-secondary)]">{['Workspace details saved for setup','Team invitations can be added later','Tools can be connected from the dashboard'].map((item) => <div key={item} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" />{item}</div>)}</div></div>}
    <div className="mt-8 flex items-center justify-between gap-3"><button type="button" onClick={() => step === 0 ? navigate('/') : setStep((value) => value - 1)} className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]">{step === 0 ? 'Back home' : 'Back'}</button><div className="flex gap-2">{step > 0 && step < 2 && <button type="button" onClick={() => setStep((value) => value + 1)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)]"><SkipForward className="h-3.5 w-3.5" /> Skip</button>}<Button type="button" onClick={next} disabled={saving}>{saving ? 'Creating…' : step === 2 ? 'Enter workspace' : 'Continue'} <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button></div></div>
  </AuthLayout>;
}
