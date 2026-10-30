import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Bot, Send, UserRound } from 'lucide-react';
import { api, type Assistant, type SupportSource } from '../lib/api';
import { getAccessToken } from '../lib/auth';

type Message = { role: 'user' | 'assistant'; content: string; sources?: SupportSource[]; handoff?: boolean };

export function SupportChat({ organizationId }: { organizationId: string }) {
  const token = getAccessToken();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [assistantId, setAssistantId] = useState('');
  const [conversationId, setConversationId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    api.getAssistants(token, organizationId).then((items) => {
      const published = items.filter((item) => item.status === 'published');
      setAssistants(published);
      if (published[0]) { setAssistantId(published[0].id); setMessages([{ role: 'assistant', content: published[0].greeting }]); }
    }).catch((reason) => setError(reason instanceof Error ? reason.message : 'Could not load assistants.'));
  }, [organizationId, token]);

  const selected = useMemo(() => assistants.find((item) => item.id === assistantId), [assistants, assistantId]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!token || !assistantId || !input.trim() || busy) return;
    const message = input.trim();
    const next = [...messages, { role: 'user' as const, content: message }];
    setMessages(next); setInput(''); setBusy(true); setError('');
    try {
      const reply = await api.sendSupportMessage(token, { assistant_id: assistantId, conversation_id: conversationId, message, conversation: next.map(({ role, content }) => ({ role, content })) });
      setConversationId(reply.conversation_id);
      setMessages([...next, { role: 'assistant', content: reply.answer, sources: reply.sources, handoff: reply.needs_handoff }]);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'The assistant could not respond.'); }
    finally { setBusy(false); }
  }

  return <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[.04]">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-white/10">
      <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-[var(--brand-blue)]">Support copilot</p><h2 className="mt-1 text-xl font-semibold">Test your assistant</h2></div>
      <select aria-label="Assistant" value={assistantId} onChange={(event) => setAssistantId(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"><option value="">Select published assistant</option>{assistants.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select>
    </div>
    <div className="max-h-[460px] min-h-[240px] space-y-4 overflow-y-auto p-6">{!selected && <p className="text-sm text-slate-500">Publish an assistant to start testing it here.</p>}{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}><div className={`flex max-w-[82%] gap-3 rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-[var(--brand-blue)] text-white' : 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200'}`}>{message.role === 'assistant' && <Bot className="mt-1 h-4 w-4 shrink-0" />}{message.role === 'user' && <UserRound className="mt-1 h-4 w-4 shrink-0" />}<div><p>{message.content}</p>{message.handoff && <p className="mt-2 text-xs font-semibold opacity-80">Human handoff recommended</p>}{message.sources?.length ? <p className="mt-2 text-xs opacity-70">Sources: {message.sources.map((source) => source.title).join(', ')}</p> : null}</div></div></div>)}{busy && <p className="text-sm text-slate-500">Thinking…</p>}</div>
    {error && <p role="alert" className="mx-6 mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
    <form onSubmit={submit} className="flex gap-3 border-t border-slate-200 p-4 dark:border-white/10"><input value={input} onChange={(event) => setInput(event.target.value)} disabled={!assistantId || busy} placeholder="Ask about a product, order, or policy…" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--brand-blue)] dark:border-white/10" /><button disabled={!assistantId || !input.trim() || busy} className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-blue)] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" />Send</button></form>
  </section>;
}
