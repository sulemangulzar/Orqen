import { FormEvent, useEffect, useState } from 'react';
import { Database, Plus } from 'lucide-react';
import { api, type KnowledgeCollection } from '../lib/api';
import { getAccessToken } from '../lib/auth';

export function CollectionPanel({ organizationId }: { organizationId: string }) {
  const token = getAccessToken();
  const [items, setItems] = useState<KnowledgeCollection[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  async function load() { if (token) { try { setItems(await api.listCollections(token, organizationId)); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not load collections.'); } } }
  useEffect(() => { void load(); }, [organizationId]);
  async function create(event: FormEvent) { event.preventDefault(); if (!token || !name.trim()) return; try { const item = await api.createCollection(token, organizationId, { name: name.trim() }); setItems((current) => [...current, item]); setName(''); setError(''); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not create collection.'); } }
  return <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-[var(--brand-blue)]">Knowledge spaces</p><h2 className="mt-1 text-xl font-semibold">Collections</h2><p className="mt-2 text-sm text-slate-500">Separate knowledge spaces for different support systems.</p></div><Database className="h-5 w-5 text-[var(--brand-blue)]" /></div><form onSubmit={create} className="mt-5 flex gap-3"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Store policies" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /><button className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-blue)] px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" />New collection</button></form>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}<div className="mt-5 grid gap-3 sm:grid-cols-2">{items.map((item) => <article key={item.id} className="rounded-xl border border-slate-200 p-4"><p className="font-semibold">{item.name}</p><p className="mt-1 text-xs text-slate-500">/{item.slug}</p><p className="mt-3 text-xs text-emerald-600">Active knowledge space</p></article>)}</div></section>;
}
