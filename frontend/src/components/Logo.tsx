type LogoProps = {
  className?: string;
  markOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  inverted?: boolean;
};

const markSizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-14 w-14' };
const wordSizes = { sm: 'text-xl', md: 'text-2xl', lg: 'text-4xl' };

export function Logo({ className = '', markOnly = false, size = 'md', inverted = false }: LogoProps) {
  const mark = <img src="/orqen-logo.svg" alt="" aria-hidden="true" className={`${markSizes[size]} shrink-0 ${inverted ? 'brightness-0 invert' : ''}`} />;
  if (markOnly) return <span className={className} aria-label="Orqen">{mark}</span>;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {mark}
      <span className={`font-semibold leading-none tracking-[-.04em] ${wordSizes[size]} ${inverted ? 'text-white' : 'text-[#10183d]'}`}>Orqen</span>
    </span>
  );
}
