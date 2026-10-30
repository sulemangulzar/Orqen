import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import * as React from 'react';
import { Activity, AlertTriangle, Bot, FileText, MessageSquare } from 'lucide-react';
import { api, type Assistant, type ConversationSummary, type KnowledgeDocument } from '../lib/api';
import { getAccessToken } from '../lib/auth';

export function OverviewAnalytics({ organizationId }: { organizationId: string }) {
  const token = getAccessToken(); const [data, setData] = useState<{ assistants: Assistant[]; documents: KnowledgeDocument[]; conversations: ConversationSummary[] } | null>(null);
  useEffect(() => { if (!token) return; Promise.all([api.getAssistants(token, organizationId), api.listDocuments(token, organizationId), api.listConversations(token, organizationId)]).then(([assistants, documents, conversations]) => setData({ assistants, documents, conversations })).catch(() => setData({ assistants: [], documents: [], conversations: [] })); }, [organizationId, token]);
  if (!data) return <div className="mt-5 grid animate-pulse gap-4 sm:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="h-28 rounded-2xl bg-slate-200" />)}</div>;
  const indexed = data.documents.filter((item) => item.state === 'indexed').length; const handoffs = data.conversations.filter((item) => item.needs_handoff).length; const rate = data.conversations.length ? Math.round((handoffs / data.conversations.length) * 100) : 0;
  return <section className="mt-6"><div className="mb-3 flex items-center gap-2"><Activity className="h-4 w-4 text-[var(--brand-blue)]" /><h2 className="text-sm font-semibold text-slate-700">Workspace analytics</h2></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={<FileText className="h-5 w-5 text-blue-600" />} label="Indexed documents" value={indexed} note={`${data.documents.length} total uploaded`} /><Metric icon={<Bot className="h-5 w-5 text-violet-600" />} label="Assistants" value={data.assistants.length} note="Published support agents" /><Metric icon={<MessageSquare className="h-5 w-5 text-emerald-600" />} label="Conversations" value={data.conversations.length} note="Last 100 conversations" /><Metric icon={<AlertTriangle className="h-5 w-5 text-amber-600" />} label="Handoff rate" value={`${rate}%`} note={`${handoffs} need attention`} /></div></section>;
}
function Metric({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string | number; note: string }) { return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between">{icon}<span className="text-xs text-slate-400">Live</span></div><p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-slate-500">{note}</p></article>; }
