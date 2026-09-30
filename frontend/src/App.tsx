import { ConfirmEmail } from './pages/ConfirmEmail';
import { Dashboard } from './pages/Dashboard';
import { ForgotPassword } from './pages/ForgotPassword';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { ResetPassword } from './pages/ResetPassword';
import { Signup } from './pages/Signup';
import { usePathname } from './lib/router';

export function App() {
  const route = usePathname().split('?')[0];

  if (route === '/signup') return <Signup />;
  if (route === '/confirm-email') return <ConfirmEmail />;
  if (route === '/login') return <Login />;
  if (route === '/forgot-password') return <ForgotPassword />;
  if (route === '/reset-password') return <ResetPassword />;
  if (route === '/onboarding') return <Onboarding />;
  if (route === '/dashboard') return <Dashboard />;

  return <Landing />;
}
