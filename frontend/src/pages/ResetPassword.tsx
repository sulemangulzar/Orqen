import { FormEvent, useState } from 'react';
import { Alert } from '../components/Alert';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { api } from '../lib/api';
import { navigate } from '../lib/router';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
      setError('Missing reset token.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await api.resetPassword(token, password);
      setMessage(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Choose a new password" subtitle="Set a new password and then log in again.">
      <form onSubmit={onSubmit} className="space-y-4">
        {message && <Alert tone="success" message={message} />}
        {error && <Alert tone="error" message={error} />}
        <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Resetting...' : 'Reset password'}</Button>
      </form>
      <button onClick={() => navigate('/login')} className="mt-6 w-full text-sm font-semibold text-teal-600 dark:text-teal-300">Back to login</button>
    </AuthLayout>
  );
}
