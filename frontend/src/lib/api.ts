const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
import { clearAccessToken, setAccessToken } from './auth';

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

export type Assistant = { id: string; organization_id?: string; public_slug: string; title: string; greeting: string; status: string; document_ids?: string[] };
export type SupportSource = { kind: string; title: string; reference: string | null };
export type SupportReply = { conversation_id: string; answer: string; sources: SupportSource[]; needs_handoff: boolean };
export type PublicSession = { assistant_id: string; title: string; greeting: string; support_email: string | null; session_token: string };
export type KnowledgeDocument = { id: string; filename: string; mime_type: string; state: string; error_message: string | null; created_at: string };
export type ConversationSummary = { id: string; assistant_id: string; status: string; needs_handoff: boolean; created_at: string; updated_at: string };
export type ConversationDetail = ConversationSummary & { messages: { id: string; role: string; content: string; sources: SupportSource[] | null; created_at: string }[] };
export type KnowledgeCollection = { id: string; organization_id: string; name: string; slug: string; namespace: string; status: string; created_at: string };

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  return requestWithRefresh<T>(path, options, false);
}

async function requestWithRefresh<T>(path: string, options: RequestInit, retried: boolean): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 60000);
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
      signal: controller.signal,
    });
  } catch (reason) {
    if (reason instanceof DOMException && reason.name === 'AbortError') throw new Error('The request timed out. Check that the backend is running.');
    throw reason;
  } finally { window.clearTimeout(timeout); }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && !retried && path !== '/auth/refresh' && path !== '/auth/login' && path !== '/auth/register') {
      try {
        const refreshed = await request<{ access_token: string }>('/auth/refresh', { method: 'POST' });
        setAccessToken(refreshed.access_token);
        return requestWithRefresh<T>(path, options, true);
      } catch {
        clearAccessToken();
      }
    }
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

  getAssistants: (accessToken: string, organizationId: string) =>
    request<Assistant[]>(`/api/v1/organizations/${organizationId}/assistants`, { headers: { Authorization: `Bearer ${accessToken}` } }),

  createAssistant: (accessToken: string, organizationId: string, payload: { title: string; public_slug?: string; greeting: string; fallback_response: string; support_email?: string; document_ids: string[] }) =>
    request<Assistant>(`/api/v1/organizations/${organizationId}/assistants`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` }, body: JSON.stringify(payload) }),

  publishAssistant: (accessToken: string, organizationId: string, assistantId: string) =>
    request<Assistant>(`/api/v1/organizations/${organizationId}/assistants/${assistantId}/publish`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` } }),
  updateAssistant: (accessToken: string, organizationId: string, assistantId: string, payload: { title: string; public_slug: string; greeting: string; document_ids: string[] }) =>
    request<Assistant>(`/api/v1/organizations/${organizationId}/assistants/${assistantId}`, { method: 'PATCH', headers: { Authorization: `Bearer ${accessToken}` }, body: JSON.stringify(payload) }),

  sendSupportMessage: (accessToken: string, payload: { assistant_id: string; conversation_id?: string; message: string; conversation: { role: 'user' | 'assistant'; content: string }[] }) =>
    request<SupportReply>('/api/v1/support/message', { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` }, body: JSON.stringify(payload) }),

  createPublicSession: (slug: string) => request<PublicSession>(`/api/v1/public/assistants/${encodeURIComponent(slug)}`),

  sendPublicMessage: (slug: string, payload: { session_token: string; message: string }) =>
    request<SupportReply>(`/api/v1/public/assistants/${encodeURIComponent(slug)}/messages`, { method: 'POST', body: JSON.stringify(payload) }),

  listDocuments: (accessToken: string, organizationId: string) => request<KnowledgeDocument[]>(`/api/v1/organizations/${organizationId}/documents`, { headers: { Authorization: `Bearer ${accessToken}` } }),

  uploadDocument: async (accessToken: string, organizationId: string, file: File, title: string) => {
    const form = new FormData(); form.append('file', file); form.append('title', title);
    const controller = new AbortController(); const timeout = window.setTimeout(() => controller.abort(), 120000);
    let response: Response;
    try { response = await fetch(`${API_URL}/api/v1/documents/upload`, { method: 'POST', credentials: 'include', headers: { Authorization: `Bearer ${accessToken}` }, body: form, signal: controller.signal }); }
    catch (reason) { if (reason instanceof DOMException && reason.name === 'AbortError') throw new Error('Document indexing timed out. Check the backend logs.'); throw reason; }
    finally { window.clearTimeout(timeout); }
    const data = await response.json(); if (!response.ok) throw new Error(data?.detail ?? 'Upload failed'); return data as KnowledgeDocument;
  },

  publishDocument: (accessToken: string, organizationId: string, assistantId: string, documentId: string) => request<KnowledgeDocument>(`/api/v1/organizations/${organizationId}/assistants/${assistantId}/documents/${documentId}/publish`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` } }),

  unpublishDocument: (accessToken: string, organizationId: string, assistantId: string, documentId: string) => request<KnowledgeDocument>(`/api/v1/organizations/${organizationId}/assistants/${assistantId}/documents/${documentId}/unpublish`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` } }),

  listConversations: (accessToken: string, organizationId: string) => request<ConversationSummary[]>(`/api/v1/conversations/organizations/${organizationId}`, { headers: { Authorization: `Bearer ${accessToken}` } }),

  getConversation: (accessToken: string, organizationId: string, conversationId: string) => request<ConversationDetail>(`/api/v1/conversations/organizations/${organizationId}/${conversationId}`, { headers: { Authorization: `Bearer ${accessToken}` } }),

  listCollections: (accessToken: string, organizationId: string) => request<KnowledgeCollection[]>(`/api/v1/collections/organizations/${organizationId}`, { headers: { Authorization: `Bearer ${accessToken}` } }),

  createCollection: (accessToken: string, organizationId: string, payload: { name: string; slug?: string }) => request<KnowledgeCollection>(`/api/v1/collections/organizations/${organizationId}`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` }, body: JSON.stringify(payload) }),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (token: string, newPassword: string) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    }),

  logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),
};
