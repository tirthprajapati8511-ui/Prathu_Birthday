import { motion } from 'motion/react';
import { content } from '../content';
import { Button } from '../components/Button';
import { SplitText } from '../components/SplitText';
import { Heart, Sparkle } from '../illustrations/Decor';

const ease = [0.22, 1, 0.36, 1] as const;

// [left %, top %, size px, kind, float delay]
const DECOR: [number, number, number, 'heart' | 'spark', number][] = [
  [12, 22, 26, 'spark', 0],
  [84, 18, 34, 'heart', 0.6],
  [8, 72, 30, 'heart', 1.2],
  [88, 70, 22, 'spark', 0.3],
  [70, 86, 16, 'spark', 0.9],
];

export function Hello({ onBol }: { onBol: (origin: { x: number; y: number }) => void }) {
  const c = content.hello;
  return (
    <>
      <motion.div
        className="hello-ring"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease }}
      />

      {DECOR.map(([left, top, size, kind, delay], i) => (
        <motion.div
          key={i}
          className="float-deco"
          style={{ left: `${left}%`, top: `${top}%`, width: size }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.9, scale: 1, y: [0, -14, 0] }}
          transition={{
            opacity: { delay: 1.4 + i * 0.12, duration: 0.6 },
            scale: { delay: 1.4 + i * 0.12, type: 'spring', stiffness: 260, damping: 14 },
            y: { delay: 2 + delay, duration: 5 + i, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {kind === 'heart' ? <Heart color={i % 2 ? '#ff8fb1' : '#ff6b98'} /> : <Sparkle />}
        </motion.div>
      ))}

      <motion.p
        className="eyebrow"
        initial={{ opacity: 0, y: 10, letterSpacing: '0.5em' }}
        animate={{ opacity: 1, y: 0, letterSpacing: '0.22em' }}
        transition={{ delay: 0.25, duration: 1.4, ease }}
      >
        {c.eyebrow}
      </motion.p>

      <h1 className="display display-xl hello-title">
        <SplitText text={c.title[0]} delay={0.55} stagger={0.07} />
        <motion.span
          className="line-2 gradient-ink italic"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.0, type: 'spring', stiffness: 120, damping: 16 }}
        >
          {c.title[1]}
        </motion.span>
      </h1>

      <motion.p
        className="hello-hint"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.9, duration: 0.9, ease }}
      >
        {c.hint}
      </motion.p>

      <motion.div
        className="cta-row halo"
        initial={{ opacity: 0, y: 24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 2.2, type: 'spring', stiffness: 160, damping: 15 }}
      >
        <Button
          size="xl"
          sheen
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            onBol({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
          }}
        >
          {c.cta}
        </Button>
      </motion.div>
    </>
  );
}
