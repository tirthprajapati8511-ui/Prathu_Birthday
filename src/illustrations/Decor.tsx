import { AnimatePresence, motion } from 'motion/react';

export function Balloon({ color, shine = '#fff' }: { color: string; shine?: string }) {
  return (
    <svg viewBox="0 0 60 150" width="100%" aria-hidden="true">
      <path d="M30 76 q-6 18 4 34 q8 14 -2 38" stroke="rgba(255,244,236,0.45)" strokeWidth="1.4" fill="none" />
      <path d="M30 4 C8 4 2 26 4 40 C7 60 22 72 30 76 C38 72 53 60 56 40 C58 26 52 4 30 4 Z" fill={color} />
      <path d="M26 74 L34 74 L32 81 L28 81 Z" fill={color} />
      <ellipse cx="19" cy="24" rx="5" ry="10" fill={shine} opacity="0.4" transform="rotate(20 19 24)" />
    </svg>
  );
}

export function Heart({ color = '#ff6b98' }: { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" aria-hidden="true">
      <path
        d="M12 21s-7.5-4.6-10-9.2C.4 8.6 2.3 4.5 6.2 4.5c2.2 0 3.6 1.2 4.4 2.5h.8c.8-1.3 2.2-2.5 4.4-2.5 3.9 0 5.8 4.1 4.2 7.3C19.5 16.4 12 21 12 21z"
        fill={color}
      />
      <ellipse cx="7.5" cy="8.6" rx="1.8" ry="1.1" fill="#fff" opacity="0.45" transform="rotate(-30 7.5 8.6)" />
    </svg>
  );
}

export function Sparkle({ color = '#ffd88a' }: { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" aria-hidden="true">
      <path d="M12 0 C12.8 8 16 11.2 24 12 C16 12.8 12.8 16 12 24 C11.2 16 8 12.8 0 12 C8 11.2 11.2 8 12 0Z" fill={color} />
    </svg>
  );
}

const CANDLES = [
  { x: 92, stripe: '#ff6b98' },
  { x: 116, stripe: '#b9a3ff' },
  { x: 140, stripe: '#8fe3cf' },
];

export function Cake({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 240 250" width="100%" role="img" aria-label={lit ? 'Birthday cake with lit candles' : 'Birthday cake, candles blown out'}>
      <defs>
        <linearGradient id="cake-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd6e2" />
          <stop offset="1" stopColor="#f39ab8" />
        </linearGradient>
        <linearGradient id="cake-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4e4" />
          <stop offset="1" stopColor="#f6d5b4" />
        </linearGradient>
        <radialGradient id="flame" cx="0.5" cy="0.7" r="0.6">
          <stop offset="0" stopColor="#fff8d6" />
          <stop offset="0.5" stopColor="#ffd060" />
          <stop offset="1" stopColor="#ff8a3d" />
        </radialGradient>
        <radialGradient id="glow">
          <stop offset="0" stopColor="#ffd88a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd88a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="120" cy="228" rx="104" ry="14" fill="rgba(0,0,0,0.3)" />
      <ellipse cx="120" cy="222" rx="104" ry="13" fill="#fff4ec" opacity="0.92" />

      {/* bottom tier */}
      <rect x="32" y="146" width="176" height="74" rx="14" fill="url(#cake-a)" />
      <path
        d="M32 160 q0 -14 14 -14 h148 q14 0 14 14 v6 q-8 10 -16 0 q-8 16 -18 0 q-10 12 -20 0 q-9 18 -20 0 q-10 10 -20 0 q-10 16 -20 0 q-10 12 -20 0 q-9 14 -18 0 q-8 10 -16 0 q-8 8 -8 0 z"
        fill="#fff6ef"
      />
      {[60, 92, 124, 156, 186].map((x, i) => (
        <circle key={x} cx={x} cy={196} r="5" fill={['#ff6b98', '#ffd88a', '#b9a3ff', '#8fe3cf', '#ff6b98'][i]} />
      ))}

      {/* top tier */}
      <rect x="64" y="96" width="112" height="56" rx="12" fill="url(#cake-b)" />
      <path
        d="M64 108 q0 -12 12 -12 h88 q12 0 12 12 v4 q-7 10 -14 0 q-8 14 -16 0 q-8 10 -16 0 q-8 16 -16 0 q-8 10 -16 0 q-7 12 -14 0 q-6 8 -12 0 z"
        fill="#ff8fb1"
      />

      {/* candles */}
      {CANDLES.map(({ x, stripe }) => (
        <g key={x}>
          <rect x={x - 4} y="58" width="8" height="40" rx="3" fill="#fff4ec" />
          {[64, 76, 88].map((y) => (
            <polygon key={y} points={`${x - 4},${y + 4} ${x + 4},${y} ${x + 4},${y + 4} ${x - 4},${y + 8}`} fill={stripe} />
          ))}
          <line x1={x} y1="58" x2={x} y2="51" stroke="#5a3a2a" strokeWidth="1.6" />
        </g>
      ))}

      <AnimatePresence>
        {lit &&
          CANDLES.map(({ x }) => (
            <motion.g
              key={`f${x}`}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.2, y: -6 }}
              transition={{ duration: 0.35 }}
              style={{ transformOrigin: `${x}px 52px` }}
            >
              <circle cx={x} cy="40" r="20" fill="url(#glow)" />
              <path className="flame" d={`M${x} 26 C${x + 8} 36 ${x + 7} 48 ${x} 52 C${x - 7} 48 ${x - 8} 36 ${x} 26Z`} fill="url(#flame)" />
            </motion.g>
          ))}
      </AnimatePresence>

      <AnimatePresence>
        {!lit &&
          CANDLES.map(({ x }, i) => (
            <motion.path
              key={`s${x}`}
              d={`M${x} 50 q-6 -10 0 -18 q6 -8 0 -18`}
              stroke="rgba(255,244,236,0.6)"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0.9, y: 0 }}
              animate={{ pathLength: 1, opacity: 0, y: -24 }}
              transition={{ duration: 1.8, delay: i * 0.08, ease: 'easeOut' }}
            />
          ))}
      </AnimatePresence>
    </svg>
  );
}
