type LogoProps = {
  className?: string;
  markOnly?: boolean;
};

export function Logo({ className = '', markOnly = false }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-teal-500/20 dark:bg-white dark:text-slate-950">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400/70 via-cyan-400/20 to-indigo-500/60 opacity-90" />
        <svg viewBox="0 0 48 48" className="relative h-7 w-7" aria-hidden="true">
          <path
            d="M24 6 39 15v18L24 42 9 33V15L24 6Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M17 24c0-4 3-7 7-7s7 3 7 7-3 7-7 7-7-3-7-7Z"
            fill="currentColor"
          />
        </svg>
      </div>
      {!markOnly && (
        <div>
          <div className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">Orqen</div>
          <div className="-mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">AI Operation Copilot</div>
        </div>
      )}
    </div>
  );
}
