import { useEffect, useState } from 'react';
import { ArrowRight, Check, Store } from 'lucide-react';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { api, type Organization } from '../lib/api';
import { clearAccessToken, getAccessToken } from '../lib/auth';
import { navigate } from '../lib/router';

type ShopifyStatus = { connected: boolean; shop_domain: string | null; status: string | null; scopes: string | null };

export function Dashboard() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [shopify, setShopify] = useState<ShopifyStatus | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAccessToken();
    if (!token) { navigate('/login'); return; }
    Promise.all([api.getOrganization(token), api.getShopifyStatus(token)])
      .then(([org, status]) => { setOrganization(org); setShopify(status); })
      .catch((reason) => { setError(reason instanceof Error ? reason.message : 'Could not load your workspace.'); });
  }, []);

  async function logout() {
    await api.logout().catch(() => null);
    clearAccessToken();
    navigate('/');
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="border-b border-slate-200 bg-white/90 dark:border-white/10 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo />
          <div className="flex items-center gap-3"><ThemeToggle /><Button variant="secondary" onClick={logout}>Logout</Button></div>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-sm font-semibold text-[var(--brand-blue)]">Workspace overview</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">{organization?.name ?? 'Loading workspace…'}</h1><p className="mt-3 text-slate-600 dark:text-slate-400">Your organization is ready for the next operational step.</p></div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">{organization?.plan ?? 'free'} plan</span>
        </div>
        {error && <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[.04]"><p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">Workspace</p><p className="mt-4 text-lg font-semibold">{organization?.name ?? '—'}</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">/{organization?.slug ?? '—'}</p></article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[.04]"><p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">Subscription</p><p className="mt-4 text-lg font-semibold capitalize">{organization?.plan ?? 'Free'}</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{organization?.subscription_status ?? 'Active'}</p></article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[.04]"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">Shopify</p><Store className="h-4 w-4 text-[var(--brand-blue)]" /></div><p className="mt-4 text-lg font-semibold">{shopify?.connected ? shopify.shop_domain : 'Not connected'}</p><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">{shopify?.connected ? <><Check className="h-3.5 w-3.5 text-[var(--brand-blue)]" /> Connected</> : 'Connect from onboarding'}</p></article>
        </div>
        <div className="mt-8 rounded-2xl bg-[var(--navy-950)] p-7 text-white"><p className="text-xs font-semibold uppercase tracking-[.14em] text-[#a9c2ff]">Next step</p><h2 className="mt-3 text-2xl font-semibold">Keep your operations in one place.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Your workspace identity and Shopify connection are now ready to power the next dashboard views.</p><button type="button" onClick={() => navigate('/')} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#a9c2ff]">View landing page <ArrowRight className="h-4 w-4" /></button></div>
      </section>
    </main>
  );
}
