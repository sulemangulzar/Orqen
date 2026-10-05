import type { FormEvent } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Alert } from '../components/Alert';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { Input, PasswordInput } from '../components/Input';
import { api } from '../lib/api';
import { setAccessToken } from '../lib/auth';
import { navigate } from '../lib/router';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError = (submitted || touched.email) && !email.trim()
    ? 'Enter your email address.'
    : (submitted || touched.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? 'Enter a valid email address.'
      : undefined;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !password) return;

    setLoading(true);
    try {
      const result = await api.login({ email: email.trim(), password });
      setAccessToken(result.access_token);
      navigate(result.needs_onboarding ? '/onboarding' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not sign you in. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Welcome back." subtitle="Sign in to continue where your team left off.">
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {error && <Alert tone="error" message={error} />}
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => setTouched((value) => ({ ...value, email: true }))}
          required
          placeholder="you@company.com"
          error={emailError}
        />
        <PasswordInput
          label="Password"
          name="current-password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onBlur={() => setTouched((value) => ({ ...value, password: true }))}
          required
          placeholder="Your password"
          error={(submitted || touched.password) && !password ? 'Enter your password.' : undefined}
        />
        <div className="flex justify-end">
          <button type="button" onClick={() => navigate('/forgot-password')} className="text-xs font-semibold text-[var(--brand-blue)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]">Forgot password?</button>
        </div>
        <Button type="submit" className="w-full rounded-lg py-3.5" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <div className="mt-5 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-3 text-xs leading-5 text-[var(--text-muted)]">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-blue)]" />
        Your workspace data stays tied to your authenticated Orqen account.
      </div>
    </AuthLayout>
  );
}
