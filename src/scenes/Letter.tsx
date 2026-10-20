import { useState } from 'react';
import { AnimatePresence, motion, useAnimate } from 'motion/react';
import { content } from '../content';
import { Button } from '../components/Button';
import { Heart } from '../illustrations/Decor';

const ease = [0.22, 1, 0.36, 1] as const;
type Phase = 'sealed' | 'opening' | 'open';

export function Letter({ onNext }: { onNext: () => void }) {
  const c = content.letter;
  const [phase, setPhase] = useState<Phase>('sealed');
  const [scope, animate] = useAnimate();

  const open = async () => {
    if (phase !== 'sealed') return;
    setPhase('opening');
    await animate('.seal', { scale: [1, 1.2, 0], opacity: [1, 1, 0] }, { duration: 0.5, ease: 'easeIn' });
    await animate('.env-flap', { rotateX: 180 }, { duration: 0.75, ease: [0.65, 0, 0.35, 1] });
    await animate('.env-flap', { zIndex: 1 }, { duration: 0 });
    await animate('.env-paper', { y: '-46%' }, { duration: 0.95, ease });
    setPhase('open');
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {phase !== 'open' ? (
        <motion.div
          key="envelope"
          className="envelope-stage"
          initial={{ opacity: 0, y: 40, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: 60, scale: 0.92, transition: { duration: 0.5, ease } }}
          transition={{ duration: 1, ease }}
        >
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {c.eyebrow}
          </motion.p>

          <button
            type="button"
            className="envelope-btn"
            onClick={open}
            disabled={phase !== 'sealed'}
            aria-label="Open the letter"
          >
            <motion.div
              ref={scope}
              className="env"
              animate={phase === 'sealed' ? { y: [0, -6, 0] } : { y: 0 }}
              transition={phase === 'sealed' ? { duration: 3.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
            >
              <div className="env-back" />
              <div className="env-paper">
                <span />
                <span />
                <span />
                <span className="short" />
              </div>
              <div className="env-front" />
              <div className="env-flap" />
              <div className="seal">
                <div className="seal-heart">
                  <Heart color="#ffe7ec" />
                </div>
              </div>
            </motion.div>
          </button>

          <motion.p
            className="letter-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'sealed' ? [0.5, 1, 0.5] : 0 }}
            transition={phase === 'sealed' ? { delay: 1, duration: 2.4, repeat: Infinity } : { duration: 0.3 }}
          >
            {c.tapHint}
          </motion.p>
        </motion.div>
      ) : (
        <motion.div
          key="paper"
          style={{ width: '100%', position: 'relative' }}
          initial={{ opacity: 0, y: 70, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease }}
        >
          <div className="letter-glow" aria-hidden="true" />
          <motion.article
            className="paper"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { delayChildren: 0.7, staggerChildren: 0.55 } } }}
          >
            <motion.h2 className="paper-greeting" variants={line}>
              {c.greeting}
            </motion.h2>
            {c.paragraphs.map((p) => (
              <motion.p key={p} variants={line}>
                {p}
              </motion.p>
            ))}
            <motion.div className="paper-sign" variants={line}>
              <small>{c.signoff}</small>
              <strong>{c.signature}</strong>
            </motion.div>
          </motion.article>

          <motion.div
            className="cta-row letter-cta"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + (c.paragraphs.length + 2) * 0.55 + 0.4, duration: 0.8, ease }}
          >
            <Button variant="gold" arrow onClick={onNext}>
              {c.cta}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const line = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.1, ease } },
};
