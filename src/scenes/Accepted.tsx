import { useEffect } from 'react';
import { motion } from 'motion/react';
import { content } from '../content';
import { Button } from '../components/Button';
import { SplitText } from '../components/SplitText';
import { heartsRain, sprinkle } from '../components/confetti';
import { Sparkle } from '../illustrations/Decor';
import dilTodDiya from '../assets/dil-tod-diya.webp';

const ease = [0.22, 1, 0.36, 1] as const;
const ORBIT = [0, 72, 144, 216, 288];

export function Accepted({ onNext }: { onNext: () => void }) {
  const c = content.accepted;

  useEffect(() => {
    const a = window.setTimeout(() => sprinkle(window.innerWidth / 2, window.innerHeight * 0.3), 200);
    const b = window.setTimeout(heartsRain, 700);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  return (
    <>
      <div style={{ position: 'relative', marginBottom: 22 }}>
        {ORBIT.map((deg, i) => (
          <motion.div
            key={deg}
            aria-hidden="true"
            style={{ position: 'absolute', left: '50%', top: '50%', width: 16 + (i % 2) * 8, marginLeft: -10, marginTop: -10 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1],
              scale: 1,
              x: Math.cos((deg * Math.PI) / 180) * 130,
              y: Math.sin((deg * Math.PI) / 180) * 115,
              rotate: 180,
            }}
            transition={{ delay: 0.5 + i * 0.07, type: 'spring', stiffness: 120, damping: 12 }}
          >
            <Sparkle color={i % 2 ? '#ff8fb1' : '#ffd88a'} />
          </motion.div>
        ))}
        <motion.div
          className="sticker reject-sticker"
          style={{ margin: 0 }}
          initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: -4 }}
          transition={{ type: 'spring', stiffness: 220, damping: 12 }}
          whileHover={{ rotate: 0, scale: 1.05 }}
          whileTap={{ rotate: 4, scale: 0.94 }}
        >
          <img src={dilTodDiya} alt="Sticker" width={512} height={512} draggable={false} />
        </motion.div>
      </div>

      <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        {c.eyebrow}
      </motion.p>
      <h1 className="display display-m" style={{ maxWidth: '14ch' }}>
        <SplitText text={c.title} effect="pop" delay={0.4} stagger={0.025} />
      </h1>
      <motion.div
        className="message-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease }}
      >
        {c.message}
        <small className="message-note">{c.note}</small>
      </motion.div>

      <motion.div className="cta-row" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9, duration: 0.7, ease }}>
        <Button arrow onClick={onNext}>
          {c.cta}
        </Button>
      </motion.div>
    </>
  );
}
