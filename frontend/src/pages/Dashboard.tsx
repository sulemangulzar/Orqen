import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { api } from '../lib/api';
import { clearAccessToken } from '../lib/auth';
import { navigate } from '../lib/router';

export function Dashboard() {
  async function logout() {
    await api.logout().catch(() => null);
    clearAccessToken();
    navigate('/');
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-3"><ThemeToggle /><Button variant="secondary" onClick={logout}>Logout</Button></div>
      </header>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-sm font-semibold text-teal-600 dark:text-teal-300">Dashboard preview</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Your AI operation cockpit is ready.</h1>
          <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400">The next backend step is creating the onboarding organization endpoint and then loading real workspace operations here.</p>
        </div>
      </section>
    </main>
  );
}
