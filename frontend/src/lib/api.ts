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

export type Organization = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  subscription_status: string;
  website: string | null;
  company_size: string | null;
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
    const detail = data?.detail;
    const message = Array.isArray(detail)
      ? detail.map((item) => `${item.loc?.at(-1) ?? 'field'}: ${item.msg}`).join(', ')
      : typeof detail === 'string'
        ? detail
        : 'Something went wrong';
    throw new Error(message);
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

  createOrganization: (accessToken: string, payload: { name: string }) =>
    request<Organization>('/organizations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    }),

  getOrganization: (accessToken: string) =>
    request<Organization>('/organizations/me', { headers: { Authorization: `Bearer ${accessToken}` } }),

  connectShopify: (accessToken: string, shopDomain: string) =>
    request<{ authorization_url: string }>('/integrations/shopify/connect', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ shop_domain: shopDomain }),
    }),

  getShopifyStatus: (accessToken: string) =>
    request<{ connected: boolean; shop_domain: string | null; status: string | null; scopes: string | null }>(
      '/integrations/shopify/status',
      { headers: { Authorization: `Bearer ${accessToken}` } },
    ),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (token: string, newPassword: string) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    }),

  logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),
};
