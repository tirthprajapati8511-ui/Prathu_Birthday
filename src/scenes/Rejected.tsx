import { motion } from 'motion/react';
import { content } from '../content';
import { Button } from '../components/Button';
import dilTodDiya from '../assets/dil-tod-diya.webp';

const ease = [0.22, 1, 0.36, 1] as const;

export function Rejected({ onChangeMind, onNext }: { onChangeMind: () => void; onNext: () => void }) {
  const c = content.rejected;
  return (
    <>
      <motion.div
        className="sticker reject-sticker"
        initial={{ opacity: 0, scale: 0.3, rotate: 20 }}
        animate={{ opacity: 1, scale: 1, rotate: 4 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 220, damping: 13 }}
        whileHover={{ rotate: 0, scale: 1.05 }}
        whileTap={{ rotate: -4, scale: 0.94 }}
      >
        <img src={dilTodDiya} alt="Sad sticker" width={512} height={512} draggable={false} />
      </motion.div>

      {/* The title lands, then "breaks": a quick shake and a slight droop. */}
      <motion.h1
        className="display display-m reject-title"
        initial={{ opacity: 0, scale: 1.3 }}
        animate={{ opacity: 1, scale: 1, x: [0, -10, 10, -7, 7, -3, 0], rotate: [0, 0, 0, 0, 0, 0, 2] }}
        transition={{
          opacity: { duration: 0.3, delay: 0.7 },
          scale: { duration: 0.5, delay: 0.7, ease: [0.5, 0, 0.75, 0] },
          x: { duration: 0.6, delay: 1.25 },
          rotate: { duration: 1.6, delay: 1.25 },
        }}
      >
        {c.title}
      </motion.h1>

      <motion.p
        className="message-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8, ease }}
      >
        {c.message}
      </motion.p>

      <motion.div
        className="cta-row"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.7, ease }}
      >
        <Button sheen onClick={onChangeMind}>
          {c.change}
        </Button>
        <Button variant="ghost" arrow onClick={onNext}>
          {c.cta}
        </Button>
      </motion.div>
    </>
  );
}
