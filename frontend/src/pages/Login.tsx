import { FormEvent, useState } from 'react';
import { Alert } from '../components/Alert';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { api } from '../lib/api';
import { setAccessToken } from '../lib/auth';
import { navigate } from '../lib/router';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api.login({ email, password });
      setAccessToken(result.access_token);
      navigate(result.needs_onboarding ? '/onboarding' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in after confirming your email to continue to onboarding.">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <Alert tone="error" message={error} />}
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Your password" />
        <div className="flex justify-end">
          <button type="button" onClick={() => navigate('/forgot-password')} className="text-sm font-semibold text-teal-600 dark:text-teal-300">Forgot password?</button>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</Button>
        <Button type="button" variant="secondary" className="w-full" onClick={() => setError('Google sign-in is ready in backend. Add your Google button/client ID next.')}>Continue with Google</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        New to Orqen? <button onClick={() => navigate('/signup')} className="font-semibold text-teal-600 dark:text-teal-300">Create account</button>
      </p>
    </AuthLayout>
  );
}
