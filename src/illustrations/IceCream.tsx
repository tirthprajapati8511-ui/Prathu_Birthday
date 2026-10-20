import { motion } from 'motion/react';

export type IceCreamMood = 'idle' | 'happy' | 'worried' | 'sad';

/** Scoop outline: round top with a scalloped bottom edge. */
function scoop(cx: number, cy: number, r: number, bumps = 5) {
  const w = (2 * r) / bumps;
  let d = `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  for (let i = 0; i < bumps; i++) d += ` a${w / 2} ${w * 0.32} 0 0 1 ${-w} 0`;
  return d + 'Z';
}

const SPRINKLES: [number, number, number, string][] = [
  [72, 118, 30, '#ffd88a'], [124, 112, -20, '#b9a3ff'], [96, 128, 70, '#fff'], [140, 136, 15, '#8fe3cf'],
  [62, 140, -40, '#b9a3ff'], [82, 74, 50, '#ff6b98'], [116, 70, -30, '#ffd88a'], [100, 86, 10, '#fff'],
  [132, 92, 60, '#ff6b98'], [70, 96, -10, '#ffd88a'],
];

function Face({ mood }: { mood: IceCreamMood }) {
  const eyes =
    mood === 'happy' ? (
      <g stroke="#5a1f37" strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d="M78 150 q6 -8 12 0" />
        <path d="M110 150 q6 -8 12 0" />
      </g>
    ) : mood === 'sad' ? (
      <g>
        <g stroke="#5a1f37" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M77 141 l12 -4" />
          <path d="M123 141 l-12 -4" />
        </g>
        <g fill="#5a1f37">
          <ellipse cx="84" cy="150" rx="4.4" ry="4.8" />
          <ellipse cx="116" cy="150" rx="4.4" ry="4.8" />
        </g>
      </g>
    ) : (
      <g fill="#5a1f37">
        <ellipse cx="84" cy={mood === 'worried' ? 149 : 148} rx="4.6" ry={mood === 'worried' ? 6 : 5.4} />
        <ellipse cx="116" cy={mood === 'worried' ? 149 : 148} rx="4.6" ry={mood === 'worried' ? 6 : 5.4} />
        <circle cx="86" cy="146" r="1.6" fill="#fff" />
        <circle cx="118" cy="146" r="1.6" fill="#fff" />
      </g>
    );

  const mouth =
    mood === 'happy' ? (
      <path d="M90 158 q10 14 20 0 z" fill="#5a1f37" />
    ) : mood === 'sad' ? (
      <path d="M91 166 q9 -9 18 0" stroke="#5a1f37" strokeWidth="3.4" strokeLinecap="round" fill="none" />
    ) : mood === 'worried' ? (
      <path d="M93 162 q3.5 -3 7 0 q3.5 3 7 0" stroke="#5a1f37" strokeWidth="3" strokeLinecap="round" fill="none" />
    ) : (
      <path d="M93 159 q7 7 14 0" stroke="#5a1f37" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    );

  return (
    <g>
      <ellipse cx="72" cy="160" rx="7" ry="4" fill="#ff5d8f" opacity="0.45" />
      <ellipse cx="128" cy="160" rx="7" ry="4" fill="#ff5d8f" opacity="0.45" />
      {eyes}
      {mouth}
      {mood === 'sad' && (
        <g fill="#8ec9ff">
          <motion.path
            d="M80 156 q-4 7 0 10 q4 -3 0 -10z"
            animate={{ y: [0, 26], opacity: [1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeIn' }}
          />
          <motion.path
            d="M120 156 q-4 7 0 10 q4 -3 0 -10z"
            animate={{ y: [0, 26], opacity: [1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeIn', delay: 0.6 }}
          />
        </g>
      )}
    </g>
  );
}

export function IceCream({ mood = 'idle', melting = false }: { mood?: IceCreamMood; melting?: boolean }) {
  const drip = melting ? 1 : 0;
  return (
    <svg viewBox="0 0 200 300" width="100%" role="img" aria-label="A smiling ice cream cone">
      <defs>
        <linearGradient id="ic-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2b56b" />
          <stop offset="1" stopColor="#c47a35" />
        </linearGradient>
        <radialGradient id="ic-straw" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffc6d6" />
          <stop offset="0.55" stopColor="#ff8fb1" />
          <stop offset="1" stopColor="#e2557f" />
        </radialGradient>
        <radialGradient id="ic-mint" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#d6fff3" />
          <stop offset="0.55" stopColor="#8fe3cf" />
          <stop offset="1" stopColor="#4fb79c" />
        </radialGradient>
        <radialGradient id="ic-cherry" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#ff8a9e" />
          <stop offset="1" stopColor="#c8193f" />
        </radialGradient>
        <clipPath id="ic-cone-clip">
          <path d="M54 152 L146 152 L100 292 Z" />
        </clipPath>
      </defs>

      {/* cone */}
      <path d="M54 152 L146 152 L100 292 Z" fill="url(#ic-cone)" />
      <g clipPath="url(#ic-cone-clip)" stroke="#a9622a" strokeWidth="2.4" opacity="0.55">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`a${i}`} x1={20 + i * 18} y1="140" x2={-40 + i * 18} y2="300" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`b${i}`} x1={20 + i * 18} y1="140" x2={80 + i * 18} y2="300" />
        ))}
      </g>
      <path d="M54 152 L146 152 L141 166 L59 166 Z" fill="#b86d2e" opacity="0.35" />

      {/* drips over the cone rim */}
      <g fill="#ff8fb1">
        <motion.rect x="64" y="160" width="12" rx="6" initial={{ height: 16 }} animate={{ height: 16 + drip * 30 }} transition={{ duration: 2.4, ease: 'easeInOut' }} />
        <motion.rect x="110" y="160" width="11" rx="5.5" initial={{ height: 24 }} animate={{ height: 24 + drip * 44 }} transition={{ duration: 3, ease: 'easeInOut' }} />
        <motion.rect x="131" y="160" width="9" rx="4.5" initial={{ height: 12 }} animate={{ height: 12 + drip * 22 }} transition={{ duration: 2, ease: 'easeInOut' }} />
      </g>

      {/* strawberry scoop with the face */}
      <path d={scoop(100, 150, 56, 6)} fill="url(#ic-straw)" />
      <path d="M62 126 q14 -26 42 -30" stroke="#fff" strokeOpacity="0.55" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* mint scoop */}
      <path d={scoop(100, 104, 46, 5)} fill="url(#ic-mint)" />
      <path d="M72 84 q10 -18 30 -22" stroke="#fff" strokeOpacity="0.6" strokeWidth="4.5" strokeLinecap="round" fill="none" />

      {SPRINKLES.map(([x, y, r, c], i) => (
        <rect key={i} x={x} y={y} width="9" height="3.2" rx="1.6" fill={c} transform={`rotate(${r} ${x + 4.5} ${y + 1.6})`} />
      ))}

      {/* cherry */}
      <path d="M108 50 q4 -22 20 -30" stroke="#5c8a3a" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <circle cx="106" cy="56" r="13" fill="url(#ic-cherry)" />
      <circle cx="101" cy="51" r="3.4" fill="#fff" opacity="0.7" />

      <Face mood={mood} />
    </svg>
  );
}
