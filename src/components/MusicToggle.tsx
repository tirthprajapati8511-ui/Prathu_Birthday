import { motion } from 'motion/react';
import { content } from '../content';

export function MusicToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  const label = playing ? content.music.on : content.music.off;
  return (
    <motion.button
      type="button"
      className={`music${playing ? ' on' : ''}`}
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? 'Pause music' : 'Play music'}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.92 }}
    >
      <span className={`music-disc${playing ? ' spinning' : ''}`} aria-hidden="true" />
      <span className="music-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="music-text">{label}</span>
    </motion.button>
  );
}
