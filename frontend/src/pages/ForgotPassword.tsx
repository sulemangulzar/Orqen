import { FormEvent, useState } from 'react';
import { Alert } from '../components/Alert';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { api } from '../lib/api';
import { navigate } from '../lib/router';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await api.forgotPassword(email);
      setMessage(result.message);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and we’ll send a secure reset link.">
      <form onSubmit={onSubmit} className="space-y-4">
        {message && <Alert tone="info" message={message} />}
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</Button>
      </form>
      <button onClick={() => navigate('/login')} className="mt-6 w-full text-sm font-semibold text-[var(--brand-blue)]">Back to login</button>
    </AuthLayout>
  );
}
