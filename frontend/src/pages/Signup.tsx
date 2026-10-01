import { useState } from 'react';
import type { FormEvent } from 'react';
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

  const emailError = submitted && !email.trim()
    ? 'Enter your email address.'
    : (submitted || email.length > 0) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? 'Enter a valid email address.'
      : undefined;
  const passwordError = (submitted || password.length > 0) && password.length < 8 ? 'Use at least 8 characters.' : undefined;
  const confirmError = (submitted || confirmPassword.length > 0) && confirmPassword !== password ? 'Passwords do not match.' : undefined;

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
    <AuthLayout title="Create your account" subtitle="Set up your Orqen account. You can create or join a workspace after confirming your email.">
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {error && <Alert tone="error" message={error} />}
        {success && <Alert tone="success" message={success} />}
        <Input
          label="Full name"
          name="name"
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
          maxLength={120}
          placeholder="Your full name"
          error={submitted && !fullName.trim() ? 'Enter your name.' : undefined}
        />
        <Input
          label="Work email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
          required
          placeholder="Enter your password again"
          error={confirmError}
        />
        <Button type="submit" className="mt-2 w-full rounded-lg bg-[var(--navy-950)] py-3.5 hover:bg-[var(--navy-800)]" disabled={loading || Boolean(success)}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Already have an account? <button type="button" onClick={() => navigate('/login')} className="font-semibold text-[var(--brand-blue)] hover:underline">Sign in</button>
      </p>

    </AuthLayout>
  );
}
