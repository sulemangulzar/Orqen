export function Alert({ message, tone = 'info' }: { message: string; tone?: 'info' | 'error' | 'success' }) {
  const styles = {
    info: 'border-slate-200 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300',
    error: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200',
  };

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${styles[tone]}`}>{message}</div>;
}
