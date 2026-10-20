import { useCallback, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import type { Stage } from './stages';
import { Atmosphere } from './components/Atmosphere';
import { MusicToggle } from './components/MusicToggle';
import { useMusic } from './hooks/useMusic';
import { Hello } from './scenes/Hello';
import { Reveal } from './scenes/Reveal';
import { Invite } from './scenes/Invite';
import { Accepted } from './scenes/Accepted';
import { Rejected } from './scenes/Rejected';
import { Letter } from './scenes/Letter';
import { Finale } from './scenes/Finale';

const ease = [0.22, 1, 0.36, 1] as const;

type Burst = { x: number; y: number; d: number; id: number };

function Scene({ children }: { children: ReactNode }) {
  return (
    <motion.section
      className="scene"
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease } }}
      exit={{ opacity: 0, y: -18, scale: 1.015, transition: { duration: 0.45, ease: [0.4, 0, 1, 1] } }}
    >
      {children}
    </motion.section>
  );
}

export default function App() {
  const [stage, setStage] = useState<Stage>('hello');
  // Bumped on restart so every scene remounts with fresh state.
  const [run, setRun] = useState(0);
  const [burst, setBurst] = useState<Burst | null>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const music = useMusic();
  const mutedByUser = useRef(false);

  const go = useCallback((next: Stage) => setStage(next), []);

  const onBol = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      if (!mutedByUser.current) music.start();
      const d = 2.2 * Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      setBurst({ x, y, d, id: Date.now() });
      window.setTimeout(() => go('reveal'), 380);
    },
    [go, music],
  );

  const restart = useCallback(() => {
    setStage('hello');
    setRun((r) => r + 1);
  }, []);

  const toggleMusic = useCallback(() => {
    mutedByUser.current = music.playing;
    music.toggle();
  }, [music]);

  let scene: ReactNode;
  switch (stage) {
    case 'hello':
      scene = <Hello onBol={onBol} />;
      break;
    case 'reveal':
      scene = <Reveal onNext={() => go('invite')} />;
      break;
    case 'invite':
      scene = <Invite onYes={() => go('yes')} onNo={() => go('no')} />;
      break;
    case 'yes':
      scene = <Accepted onNext={() => go('letter')} />;
      break;
    case 'no':
      scene = <Rejected onChangeMind={() => go('yes')} onNext={() => go('letter')} />;
      break;
    case 'letter':
      scene = <Letter onNext={() => go('finale')} />;
      break;
    case 'finale':
      scene = <Finale onRestart={restart} />;
      break;
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <Atmosphere stage={stage} />

        <div className="stage-viewport" ref={viewport}>
          <AnimatePresence mode="wait" onExitComplete={() => viewport.current?.scrollTo({ top: 0 })}>
            <Scene key={`${stage}-${run}`}>{scene}</Scene>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {burst && (
            <motion.div
              key={burst.id}
              className="burst"
              aria-hidden="true"
              style={{ left: burst.x - burst.d / 2, top: burst.y - burst.d / 2, width: burst.d, height: burst.d }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1, opacity: [1, 1, 0] }}
              transition={{ duration: 1.3, ease: [0.3, 0, 0.2, 1], opacity: { duration: 1.3, times: [0, 0.45, 1] } }}
              onAnimationComplete={() => setBurst(null)}
            />
          )}
        </AnimatePresence>

        <MusicToggle playing={music.playing} onToggle={toggleMusic} />
      </div>
    </MotionConfig>
  );
}
