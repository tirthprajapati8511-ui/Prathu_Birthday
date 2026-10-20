import { motion, type Variants } from 'motion/react';

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** 'rise' slides letters up from a mask; 'pop' springs them in with a little rotation. */
  effect?: 'rise' | 'pop';
};

const charVariants: Record<'rise' | 'pop', Variants> = {
  rise: {
    hidden: { y: '0.9em', opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 220, damping: 22 } },
  },
  pop: {
    hidden: { y: '0.5em', scale: 0.4, rotate: -12, opacity: 0 },
    show: { y: 0, scale: 1, rotate: 0, opacity: 1, transition: { type: 'spring', stiffness: 380, damping: 16 } },
  },
};

/** Letter-by-letter reveal. Words never break mid-word, and screen readers get the plain text. */
export function SplitText({ text, className, delay = 0, stagger = 0.04, effect = 'rise' }: Props) {
  const words = text.split(' ');
  let i = 0;
  return (
    <motion.span
      className={className}
      aria-label={text}
      role="text"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { delayChildren: delay, staggerChildren: stagger } } }}
      style={{ display: 'inline-block' }}
    >
      {words.map((word, w) => (
        <span key={w} className="split-word" aria-hidden="true">
          {Array.from(word).map((ch) => (
            <motion.span key={i++} className="split-char" variants={charVariants[effect]}>
              {ch}
            </motion.span>
          ))}
          {w < words.length - 1 && ' '}
        </span>
      ))}
    </motion.span>
  );
}
