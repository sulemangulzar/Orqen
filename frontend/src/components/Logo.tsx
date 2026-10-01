import orqenLogo from '../assets/orqen_logo.png';

type LogoProps = {
  className?: string;
  markOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  inverted?: boolean;
};

const frames = {
  sm: 'h-7 w-[112px]',
  md: 'h-9 w-[144px]',
  lg: 'h-14 w-[224px]',
};

const images = {
  sm: 'w-[160px] -left-[25px] -top-[25px]',
  md: 'w-[206px] -left-[32px] -top-[32px]',
  lg: 'w-[320px] -left-[49px] -top-[49px]',
};

export function Logo({ className = '', markOnly = false, size = 'md', inverted = false }: LogoProps) {
  if (markOnly) {
    return (
      <div className={`relative h-10 w-10 overflow-hidden ${className}`}>
        <img
          src={orqenLogo}
          alt="Orqen"
          className="absolute -left-[13px] -top-[31px] w-[178px] max-w-none"
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${frames[size]} ${inverted ? 'mix-blend-screen' : ''} ${className}`}>
      <img
        src={orqenLogo}
        alt="Orqen"
        className={`absolute max-w-none ${images[size]} ${inverted ? 'brightness-0 invert' : ''}`}
      />
    </div>
  );
}
