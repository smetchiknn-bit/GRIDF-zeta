import { useEffect, useRef, useState, type ReactNode } from 'react';

/* Появление блока при скролле */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* Бегущая строка */
export function Ticker() {
  const words = [
    'GRIT',
    'БЕЗ ГАНТЕЛЕЙ',
    'БЕЗ ГИРЬ',
    'БЕЗ ТРЕНАЖЁРОВ',
    'СВОЙ ВЕС — ТВОЙ ВЕС',
    'ЛЮБАЯ КОМНАТА — ЗАЛ',
    'ТАЙМЕР ВЕДЁТ',
    'РАБОТАЕТ ОФЛАЙН',
  ];
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {words.map((w) => (
        <span key={key + w} className="flex items-center">
          <span className="px-6 font-display text-sm font-bold tracking-[0.22em] text-ink">{w}</span>
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-ink" fill="currentColor" aria-hidden="true">
            <path d="M6 0l1.8 4.2L12 6 7.8 7.8 6 12 4.2 7.8 0 6l4.2-1.8z" />
          </svg>
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative z-10 overflow-hidden border-y border-ink/20 bg-lime py-2.5">
      <div className="marquee-track flex w-max">{[row('a'), row('b')]}</div>
    </div>
  );
}

/* Шкала уровня: три растущих деления */
export function LevelPips({ level }: { level: 1 | 2 | 3 }) {
  const color = level === 1 ? 'bg-lime' : level === 2 ? 'bg-chalk' : 'bg-flare';
  return (
    <span className="flex items-end gap-[3px]" title={`Уровень: ${level}/3`}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-[5px] ${i === 1 ? 'h-[7px]' : i === 2 ? 'h-[11px]' : 'h-[15px]'} ${
            i <= level ? color : 'bg-line'
          }`}
        />
      ))}
    </span>
  );
}

/* Заголовок секции с индексом */
export function SectionHead({
  index,
  title,
  aside,
}: {
  index: string;
  title: string;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <span className="font-display text-xs font-medium tracking-[0.3em] text-flare">{index}</span>
          <span className="h-px w-14 bg-line" />
        </div>
        <h2 className="font-display text-2xl font-700 uppercase tracking-tight text-chalk sm:text-4xl">
          {title}
        </h2>
      </div>
      {aside}
    </div>
  );
}

/* Кнопка с уголком */
export function NotchButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'lime';
  className?: string;
}) {
  const base =
    'notch-sm inline-flex items-center gap-2.5 px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider transition-all duration-200 active:translate-y-[2px]';
  const variants = {
    primary: 'bg-flare text-ink hover:bg-flare-soft',
    lime: 'bg-lime text-ink hover:bg-[#d8f98b]',
    ghost:
      'border border-line bg-transparent text-chalk hover:border-flare hover:text-flare',
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
