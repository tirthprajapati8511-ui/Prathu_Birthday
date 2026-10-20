import { useEffect } from 'react';
import { motion } from 'motion/react';
import { content } from '../content';
import { Button } from '../components/Button';
import { SplitText } from '../components/SplitText';
import { celebrate } from '../components/confetti';
import { Balloon } from '../illustrations/Decor';
import highFive from '../assets/baby-highfive.webp';

const ease = [0.22, 1, 0.36, 1] as const;

// [left %, width px, color, rise duration s, delay s, sway deg]
const BALLOONS: [number, number, string, number, number, number][] = [
  [6, 64, '#ff6b98', 9, 0.1, 6],
  [20, 46, '#ffd88a', 11, 0.9, -5],
  [74, 58, '#b9a3ff', 10, 0.4, 5],
  [88, 70, '#ff8fb1', 8.5, 0.2, -7],
  [58, 40, '#8fe3cf', 12, 1.6, 4],
  [36, 36, '#ffb38a', 13, 2.2, -4],
];

export function Reveal({ onNext }: { onNext: () => void }) {
  const c = content.reveal;

  useEffect(() => {
    const t = window.setTimeout(celebrate, 450);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <div className="balloon-field" aria-hidden="true">
        {BALLOONS.map(([left, w, color, dur, delay, sway], i) => (
          <motion.div
            key={i}
            style={{ position: 'absolute', left: `${left}%`, bottom: 0, width: w }}
            initial={{ y: '20vh', rotate: 0 }}
            animate={{ y: '-130vh', rotate: [0, sway, -sway, 0] }}
            transition={{
              y: { duration: dur, delay, ease: [0.3, 0, 0.6, 1] },
              rotate: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <Balloon color={color} />
          </motion.div>
        ))}
      </div>

      <motion.p
        className="eyebrow"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.9, ease }}
      >
        {c.eyebrow}
      </motion.p>

      <h1 className="display display-l reveal-title">
        <SplitText text={c.lineOne} effect="pop" delay={0.35} stagger={0.06} />
        <SplitText text={c.lineTwo} effect="pop" delay={0.65} stagger={0.05} />
        <motion.span
          className="reveal-name"
          initial={{ clipPath: 'inset(-40% 130% -40% -30%)', opacity: 0.4 }}
          animate={{ clipPath: 'inset(-40% -30% -40% -30%)', opacity: 1 }}
          transition={{ delay: 1.25, duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
        >
          {c.name}
        </motion.span>
      </h1>

      <motion.div
        className="sticker"
        initial={{ opacity: 0, scale: 0.3, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: -6 }}
        transition={{ delay: 2.1, type: 'spring', stiffness: 260, damping: 13 }}
        whileHover={{ rotate: 0, scale: 1.06 }}
        whileTap={{ rotate: 4, scale: 0.94 }}
      >
        <img src={highFive} alt="A baby giving a high five" width={512} height={512} draggable={false} />
      </motion.div>

      <motion.p
        className="lede"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.9, ease }}
      >
        {c.sub}
      </motion.p>

      <motion.div
        className="cta-row"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, type: 'spring', stiffness: 160, damping: 16 }}
      >
        <Button arrow onClick={onNext}>
          {c.cta}
        </Button>
      </motion.div>
    </>
  );
}
