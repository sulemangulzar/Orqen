const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export type AuthUser = {
  user_id: string;
  email: string;
  full_name: string | null;
  organization_id: string | null;
  is_verified: boolean;
  needs_onboarding: boolean;
};

export type LoginResponse = AuthUser & {
  access_token: string;
  token_type: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.detail ?? 'Something went wrong');
  }
  return data as T;
}

export const api = {
  signup: (payload: { full_name: string; email: string; password: string }) =>
    request<AuthUser>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

  confirmEmail: (token: string) =>
    request<{ message: string }>('/auth/confirm-email', { method: 'POST', body: JSON.stringify({ token }) }),

  resendConfirmation: (email: string) =>
    request<{ message: string }>('/auth/resend-confirmation', { method: 'POST', body: JSON.stringify({ email }) }),

  login: (payload: { email: string; password: string }) =>
    request<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  googleLogin: (idToken: string) =>
    request<LoginResponse>('/auth/google', { method: 'POST', body: JSON.stringify({ id_token: idToken }) }),

  me: (accessToken: string) =>
    request<AuthUser>('/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } }),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (token: string, newPassword: string) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    }),

  logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),
};
