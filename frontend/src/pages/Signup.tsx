import type { FormEvent } from 'react';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { Alert } from '../components/Alert';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { Input, PasswordInput } from '../components/Input';
import { api } from '../lib/api';
import { navigate } from '../lib/router';

export function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false });

  const emailError = (submitted || touched.email) && !email.trim()
    ? 'Enter your email address.'
    : (submitted || touched.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? 'Enter a valid email address.'
      : undefined;
  const passwordError = (submitted || touched.password) && password.length < 8 ? 'Use at least 8 characters.' : undefined;
  const confirmError = (submitted || touched.confirmPassword) && Boolean(confirmPassword) && confirmPassword !== password ? 'Passwords do not match.' : undefined;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setError('');
    if (!fullName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || password.length < 8 || confirmPassword !== password) return;

    setLoading(true);
    try {
      await api.signup({ full_name: fullName.trim(), email: email.trim(), password });
      setSuccess('Account created. Check your inbox for the email confirmation link, then sign in to continue.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create your Orqen account." subtitle="Start with a workspace built around customers, orders, ownership, and follow-through.">
      {success ? (
        <div className="py-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#eaf1ff] text-[var(--brand-blue)]">
            <Check className="h-7 w-7" />
          </div>
          <h2 className="mt-6 font-serif text-3xl text-[var(--text-primary)]">Check your email.</h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[var(--text-muted)]">
            We sent a confirmation link to <span className="font-semibold text-[var(--text-secondary)]">{email}</span>. Confirm your email before signing in.
          </p>
          <Button type="button" onClick={() => navigate('/login')} className="mt-7 rounded-lg px-6 py-3">
            Go to sign in
          </Button>
        </div>
      ) : <>
      <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
        {error && <div className="sm:col-span-2"><Alert tone="error" message={error} /></div>}
        {success && <div className="sm:col-span-2"><Alert tone="success" message={success} /></div>}
        <Input
          label="Full name"
          name="name"
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          onBlur={() => setTouched((value) => ({ ...value, name: true }))}
          required
          maxLength={120}
          placeholder="Your full name"
          error={(submitted || touched.name) && !fullName.trim() ? 'Enter your name.' : undefined}
        />
        <Input
          label="Work email"
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
          name="new-password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onBlur={() => setTouched((value) => ({ ...value, password: true }))}
          required
          minLength={8}
          placeholder="At least 8 characters"
          error={passwordError}
          hint="Use at least 8 characters."
        />
        <PasswordInput
          label="Confirm password"
          name="confirm-password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          onBlur={() => setTouched((value) => ({ ...value, confirmPassword: true }))}
          required
          placeholder="Enter your password again"
          error={confirmError}
        />
        <Button type="submit" className="mt-2 w-full rounded-lg py-3.5 sm:col-span-2" disabled={loading || Boolean(success)}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <div className="mt-5 grid gap-2 rounded-lg bg-slate-50 px-3 py-3 text-xs text-[var(--text-muted)] sm:grid-cols-3">
        {['Shared context', 'Team ownership', 'Clear handoffs'].map((item) => (
          <span key={item} className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-[var(--brand-blue)]" />
            {item}
          </span>
        ))}
      </div>
      </>}
    </AuthLayout>
  );
}
