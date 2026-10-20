import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { content } from '../content';
import { Button } from '../components/Button';
import { SplitText } from '../components/SplitText';
import { celebrate, fireworks } from '../components/confetti';
import { Cake } from '../illustrations/Decor';

const ease = [0.22, 1, 0.36, 1] as const;

export function Finale({ onRestart }: { onRestart: () => void }) {
  const c = content.finale;
  const [lit, setLit] = useState(true);
  const cancelShow = useRef<() => void>(() => {});

  useEffect(() => () => cancelShow.current(), []);

  const blow = () => {
    if (!lit) return;
    setLit(false);
    celebrate();
    cancelShow.current = fireworks(3200);
  };

  return (
    <>
      <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        {c.eyebrow}
      </motion.p>

      <h1 className="display display-l reveal-title">
        <SplitText text={c.title[0]} delay={0.4} stagger={0.04} />
        <motion.span
          className="reveal-name"
          initial={{ clipPath: 'inset(-40% 130% -40% -30%)' }}
          animate={{ clipPath: 'inset(-40% -30% -40% -30%)' }}
          transition={{ delay: 1.1, duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
        >
          {c.title[1]}
        </motion.span>
      </h1>

      <motion.button
        type="button"
        className="cake-btn"
        onClick={blow}
        disabled={!lit}
        aria-label={lit ? 'Blow out the candles' : 'Candles blown out'}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={lit ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: [1, 1.06, 1] }}
        transition={lit ? { delay: 1.6, type: 'spring', stiffness: 120, damping: 14 } : { duration: 0.6 }}
        whileHover={lit ? { scale: 1.03 } : undefined}
        whileTap={lit ? { scale: 0.97 } : undefined}
      >
        <Cake lit={lit} />
      </motion.button>

      <AnimatePresence mode="wait">
        <motion.p
          key={lit ? 'hint' : 'done'}
          className="finale-hint"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, delay: lit ? 2.3 : 0.4 }}
          aria-live="polite"
        >
          {lit ? c.hint : c.afterWish}
        </motion.p>
      </AnimatePresence>

      <AnimatePresence>
        {!lit && (
          <motion.div
            className="cta-row"
            style={{ marginTop: 26 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.8, ease }}
          >
            <Button variant="ghost" onClick={onRestart}>
              ↺ {c.restart}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
