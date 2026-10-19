import type { JSX } from 'react';

/* Фигурки упражнений рисованы вручную: голова-круг + линии позы. */

const POSES: Record<string, JSX.Element> = {
  pushup: (
    <>
      <circle cx="18.6" cy="8" r="1.7" />
      <path d="M17 9.4 6.8 13.2 2.6 15" />
      <path d="M14.2 10.8v4.6" />
      <path d="M2.5 18.4h19" opacity=".35" />
    </>
  ),
  squat: (
    <>
      <circle cx="13.4" cy="4.6" r="1.7" />
      <path d="M12.9 6.4c-.3 1.8-1.1 3.2-2.5 4.2" />
      <path d="M12.4 8h5.2" />
      <path d="M10.4 10.6l3.2 2.2-.4 4.4" />
      <path d="M13.2 17.2h2.8" />
      <path d="M4 19.4h16" opacity=".35" />
    </>
  ),
  pike: (
    <>
      <circle cx="7.2" cy="11" r="1.5" />
      <path d="M6 17 12.4 6.8 18.8 17" />
      <path d="M3.6 19h16.8" opacity=".35" />
    </>
  ),
  dip: (
    <>
      <circle cx="9.6" cy="5.2" r="1.6" />
      <path d="M9.6 7.2l.6 4.4" />
      <path d="M9.8 8.4 7.2 12.2" />
      <path d="M5 13.6h4" opacity=".6" />
      <path d="M10.2 11.6l4.6 1h4.2" />
      <path d="M3 18.6h18" opacity=".35" />
    </>
  ),
  lunge: (
    <>
      <circle cx="11.4" cy="4.4" r="1.7" />
      <path d="M11.2 6.2v4.2" />
      <path d="M11.2 10.4 14.2 13v4.4" />
      <path d="M11.2 10.4 7 13.6 5 17.2" />
      <path d="M11.2 7.6 8.8 9.6" />
      <path d="M3 19.4h18" opacity=".35" />
    </>
  ),
  wall: (
    <>
      <path d="M5.4 3.4v16.2" opacity=".6" />
      <circle cx="11" cy="6" r="1.6" />
      <path d="M10.4 7.8l-.6 3.8h4.8v4.4h2.4" />
    </>
  ),
  calf: (
    <>
      <circle cx="12" cy="4.2" r="1.7" />
      <path d="M12 6v8" />
      <path d="M12 14l.6 2.8h2.4" />
      <path d="M15 16.8v2.8" />
      <path d="M4 19.6h16" opacity=".35" />
    </>
  ),
  bridge: (
    <>
      <circle cx="4.4" cy="14.6" r="1.6" />
      <path d="M6 15c1.6-3.6 5.4-4.6 7.8-3.2" />
      <path d="M13.8 11.8 15.6 15v2.6" />
      <path d="M2.8 17.8h18.2" opacity=".35" />
    </>
  ),
  plank: (
    <>
      <circle cx="4.9" cy="10.6" r="1.6" />
      <path d="M6.4 11.8 20.4 13.6" />
      <path d="M8.6 12.1l1.8 3.5h2.6" />
      <path d="M3 18.4h18" opacity=".35" />
    </>
  ),
  sideplank: (
    <>
      <circle cx="8.4" cy="5.6" r="1.6" />
      <path d="M9 7.2 14.6 14.6 20 15.8" />
      <path d="M9.2 8.2l1.2 7.2" />
      <path d="M8.8 6.8 6.4 4.2" />
      <path d="M3.4 18h17.2" opacity=".35" />
    </>
  ),
  hollow: (
    <>
      <circle cx="5.6" cy="12.6" r="1.5" />
      <path d="M7 13.4c2 1.6 4.6 1.8 6.6.8" />
      <path d="M13.6 14.2 19 11" />
      <path d="M7.4 13 3.8 10.6" />
    </>
  ),
  crunch: (
    <>
      <circle cx="5.4" cy="12" r="1.6" />
      <path d="M6.9 12.9c1.5-2.3 3.7-2.7 5.1-1.7" />
      <path d="M12 11.2 15.4 9.8l1.2 3.6" />
      <path d="M3 16.4h18" opacity=".35" />
    </>
  ),
  raise: (
    <>
      <circle cx="4.6" cy="14" r="1.5" />
      <path d="M6.1 14.6h6.7" />
      <path d="M12.8 14.6 17.4 9.6" />
      <path d="M12.8 14.6l3.8-3.2" />
      <path d="M3 17.6h18" opacity=".35" />
    </>
  ),
  bicycle: (
    <>
      <circle cx="5" cy="11.6" r="1.5" />
      <path d="M6.4 12.4l4.6 1" />
      <path d="M11 13.4 14.4 10.6l2 2.4" />
      <path d="M11 13.4l4.4 1.2" />
      <path d="M3 17h18" opacity=".35" />
    </>
  ),
  climber: (
    <>
      <circle cx="18.8" cy="7.2" r="1.5" />
      <path d="M17.4 8.4 9.4 11.8" />
      <path d="M9.4 11.8l3.6 2.4-1.2 2.6" />
      <path d="M9.4 11.8 4.2 14.6" />
      <path d="M15.4 9.4v4.4" />
      <path d="M3 18.6h18" opacity=".35" />
    </>
  ),
  superman: (
    <>
      <circle cx="4.9" cy="11.4" r="1.5" />
      <path d="M6.4 11.8h7.8" />
      <path d="M7.4 11.4 3.8 8.6" />
      <path d="M14.2 11.8 19.6 9.2" />
    </>
  ),
  burpee: (
    <>
      <circle cx="17.2" cy="6.4" r="1.6" />
      <path d="M15.8 7.7 6.6 12.6" />
      <path d="M6.6 12.6 3 15.6" />
      <path d="M17.6 5l2.4-2" />
      <path d="M13.4 9.4v4" />
      <path d="M20.8 8.6l1.4 1.4" opacity=".6" />
    </>
  ),
  jack: (
    <>
      <circle cx="12" cy="4.6" r="1.7" />
      <path d="M12 6.4v6.2" />
      <path d="M12 8.2 7.4 4.8M12 8.2l4.6-3.4" />
      <path d="M12 12.6 8.2 18M12 12.6l3.8 5.4" />
    </>
  ),
  knees: (
    <>
      <circle cx="12.4" cy="4.4" r="1.6" />
      <path d="M12.2 6.2l-.6 4.4" />
      <path d="M11.6 10.6h3.6v3.6" />
      <path d="M11.6 10.6l-1.2 3.8.4 3.2" />
      <path d="M12 7.6 9.4 9.2M12 7.6l2.6 1.6" />
      <path d="M4 19.6h16" opacity=".35" />
    </>
  ),
  skater: (
    <>
      <circle cx="10.6" cy="5" r="1.6" />
      <path d="M10.8 6.8 12 11" />
      <path d="M11.2 8.2l3.8-1M11.2 8.2l-3.8 1.2" />
      <path d="M12 11l2.4 2.6-.6 3.8" />
      <path d="M12 11l-3.8 1.8-1.8 2.4" />
      <path d="M4 19.4h16" opacity=".35" />
    </>
  ),
  cat: (
    <>
      <circle cx="5.6" cy="10" r="1.5" />
      <path d="M7 10.8c2-3 6-3 8.4-.4" />
      <path d="M8 10.2l-.4 5.2" />
      <path d="M14.6 10.2l.4 5.2" />
      <path d="M15.4 10.4l3.2-1.4" />
      <path d="M4 17.6h16" opacity=".35" />
    </>
  ),
  fold: (
    <>
      <circle cx="7.8" cy="10.8" r="1.6" />
      <path d="M15.4 18V9.6" />
      <path d="M15.4 9.6c-.6-1.8-2.6-2.2-4.4-1.2" />
      <path d="M11 8.4 9.6 13" />
      <path d="M6 19.4h14" opacity=".35" />
    </>
  ),
  pigeon: (
    <>
      <circle cx="6" cy="7.6" r="1.5" />
      <path d="M6.6 9.2 9 13.2" />
      <path d="M9 13.2l4.6.4 2.8 2" />
      <path d="M9 13.2l5.4-1.8h5" />
      <path d="M4 17.8h16" opacity=".35" />
    </>
  ),
  child: (
    <>
      <circle cx="6.4" cy="12.8" r="1.5" />
      <path d="M7.8 12.4c2.6-2.6 6.8-2.2 8.2.2" />
      <path d="M16 12.6v3" />
      <path d="M7.8 13 4 14.6" />
      <path d="M3.4 17.6h17.2" opacity=".35" />
    </>
  ),
};

export function PoseIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {POSES[name] ?? POSES.squat}
    </svg>
  );
}

/* ---------- UI-иконки ---------- */

function Ui({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const IconPlay = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
);

export const IconPause = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <rect x="6.5" y="5" width="3.6" height="14" rx="1" />
    <rect x="13.9" y="5" width="3.6" height="14" rx="1" />
  </svg>
);

export const IconSkip = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M5 5.5v13l9-6.5z" />
    <rect x="16.5" y="5" width="3" height="14" rx="1" />
  </svg>
);

export const IconPrev = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19 5.5v13l-9-6.5z" />
    <rect x="4.5" y="5" width="3" height="14" rx="1" />
  </svg>
);

export const IconClose = ({ className }: { className?: string }) => (
  <Ui className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Ui>
);

export const IconFlame = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2.5c.6 3.2-1.4 4.8-2.8 6.4C7.7 10.6 7 12 7 13.7A5 5 0 0 0 12 18.5a5 5 0 0 0 5-4.8c0-2.6-1.5-4.2-2.5-5.7-.7 1.2-1.3 1.7-2 2 .4-2.5-.1-5.6-.5-7.5z" />
    <path d="M12 21.5c-4 0-7-2.7-7-6.3 0-1.3.4-2.4 1-3.4" opacity=".4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconClock = ({ className }: { className?: string }) => (
  <Ui className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Ui>
);

export const IconBolt = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13 2.5 5 13.5h5.5L10 21.5l8-11h-5.5z" />
  </svg>
);

export const IconCheck = ({ className }: { className?: string }) => (
  <Ui className={className}>
    <path d="M4.5 12.5 10 18 19.5 6.5" />
  </Ui>
);

export const IconArrowRight = ({ className }: { className?: string }) => (
  <Ui className={className}>
    <path d="M4 12h15M13 5.5 19.5 12 13 18.5" />
  </Ui>
);

export const IconArrowLeft = ({ className }: { className?: string }) => (
  <Ui className={className}>
    <path d="M20 12H5M11 5.5 4.5 12 11 18.5" />
  </Ui>
);

export const IconSound = ({ className }: { className?: string }) => (
  <Ui className={className}>
    <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5z" />
    <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" />
  </Ui>
);

export const IconMute = ({ className }: { className?: string }) => (
  <Ui className={className}>
    <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5z" />
    <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" />
  </Ui>
);

export const IconTrash = ({ className }: { className?: string }) => (
  <Ui className={className}>
    <path d="M4.5 6.5h15M9.5 6V4.5h5V6M6.5 6.5l.8 13h9.4l.8-13M10 10.5v6M14 10.5v6" />
  </Ui>
);

export const IconSearch = ({ className }: { className?: string }) => (
  <Ui className={className}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="M15.2 15.2 20 20" />
  </Ui>
);

export const IconTimer = ({ className }: { className?: string }) => (
  <Ui className={className}>
    <path d="M9.5 2.5h5" />
    <circle cx="12" cy="13.5" r="7.5" />
    <path d="M12 9.5v4l2.6 1.8" />
  </Ui>
);

export const IconRings = ({ className }: { className?: string }) => (
  <Ui className={className}>
    <path d="M12 2.5v3.5" />
    <circle cx="8.5" cy="13.5" r="4.5" />
    <circle cx="15.5" cy="13.5" r="4.5" />
  </Ui>
);

export const IconHome = ({ className }: { className?: string }) => (
  <Ui className={className}>
    <path d="M4 11.2 12 4l8 7.2" />
    <path d="M6.2 9.8V20h11.6V9.8" />
    <path d="M10 20v-5.4h4V20" />
  </Ui>
);

export const IconChart = ({ className }: { className?: string }) => (
  <Ui className={className}>
    <path d="M4 20h16" />
    <path d="M6.5 20v-6M11 20V9M15.5 20v-8.5M20 20V4.5" transform="translate(-1.5 0)" />
  </Ui>
);

export const IconDownload = ({ className }: { className?: string }) => (
  <Ui className={className}>
    <path d="M12 4v10.5M7.5 10.5 12 15l4.5-4.5" />
    <path d="M4.5 19.5h15" />
  </Ui>
);

/* Логотип: перечёркнутая гантель — «без железа». */
export const Logo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <rect x="2" y="12.5" width="4.5" height="7" rx="1" fill="currentColor" />
    <rect x="25.5" y="12.5" width="4.5" height="7" rx="1" fill="currentColor" />
    <rect x="6.5" y="14.5" width="19" height="3" rx="1" fill="currentColor" opacity=".85" />
    <rect x="8" y="9" width="3.5" height="14" rx="1" fill="currentColor" />
    <rect x="20.5" y="9" width="3.5" height="14" rx="1" fill="currentColor" />
    <path d="M5 27 27 5" stroke="var(--color-flare)" strokeWidth="3.4" strokeLinecap="round" />
  </svg>
);
