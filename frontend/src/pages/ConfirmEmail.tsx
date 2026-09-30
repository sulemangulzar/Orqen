import { useEffect, useState } from 'react';
import { Alert } from '../components/Alert';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { api } from '../lib/api';
import { navigate } from '../lib/router';

export function ConfirmEmail() {
  const [message, setMessage] = useState('Confirming your email...');
  const [tone, setTone] = useState<'info' | 'error' | 'success'>('info');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
      setMessage('Missing confirmation token.');
      setTone('error');
      return;
    }
    api.confirmEmail(token)
      .then((data) => {
        setMessage(data.message);
        setTone('success');
      })
      .catch((err) => {
        setMessage(err instanceof Error ? err.message : 'Could not confirm email');
        setTone('error');
      });
  }, []);

  return (
    <AuthLayout title="Email confirmation" subtitle="Once confirmed, log in to start your onboarding.">
      <div className="space-y-5">
        <Alert tone={tone} message={message} />
        <Button className="w-full" onClick={() => navigate('/login')}>Go to login</Button>
      </div>
    </AuthLayout>
  );
}
