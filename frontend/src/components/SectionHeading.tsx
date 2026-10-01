import type { ReactNode } from 'react';

export function SectionHeading({ eyebrow, title, description, align = 'left' }: { eyebrow: string; title: ReactNode; description?: string; align?: 'left' | 'center' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-[700px] text-center' : 'max-w-[620px]'}>
      <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[var(--brand-blue)]">{eyebrow}</p>
      <h2 className="mt-4 text-balance font-serif text-[42px] leading-[1.05] tracking-[-.045em] text-[var(--text-primary)] sm:text-[52px]">{title}</h2>
      {description && <p className="mt-5 text-[15px] leading-7 text-[var(--text-muted)]">{description}</p>}
    </div>
  );
}
