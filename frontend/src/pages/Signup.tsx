import { FormEvent, useState } from 'react';
import { Alert } from '../components/Alert';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { api } from '../lib/api';
import { navigate } from '../lib/router';

export function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.signup({ full_name: fullName, email, password });
      setSuccess('Account created. Check your email and confirm it before logging in.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start with your user account. Workspace onboarding happens after email verification and login.">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <Alert tone="error" message={error} />}
        {success && <Alert tone="success" message={success} />}
        <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Suleman Gulzar" />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="At least 8 characters" />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already verified? <button onClick={() => navigate('/login')} className="font-semibold text-teal-600 dark:text-teal-300">Log in</button>
      </p>
    </AuthLayout>
  );
}
