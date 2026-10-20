import { memo, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import type { Stage } from '../stages';
import { Particles } from './Particles';

type Mood = {
  gradient: string;
  orbs: [string, string, string];
};

export const moods: Record<Stage, Mood> = {
  hello: {
    gradient:
      'radial-gradient(120% 90% at 50% 110%, #3a1546 0%, #1d1030 45%, #0d0717 100%)',
    orbs: ['#ff5d8f', '#7c5cff', '#ffb38a'],
  },
  reveal: {
    gradient:
      'radial-gradient(120% 90% at 50% 100%, #5a1a4c 0%, #2a1038 50%, #12081d 100%)',
    orbs: ['#ff4f8b', '#ffb84d', '#ff8fb1'],
  },
  invite: {
    gradient:
      'radial-gradient(120% 90% at 50% 0%, #34205a 0%, #1f1238 50%, #110a1f 100%)',
    orbs: ['#59d6b8', '#ff6b98', '#a58bff'],
  },
  yes: {
    gradient:
      'radial-gradient(120% 90% at 50% 100%, #6a2350 0%, #351438 50%, #160a20 100%)',
    orbs: ['#ffc65c', '#ff5d8f', '#6fe0c4'],
  },
  no: {
    gradient:
      'radial-gradient(120% 90% at 50% 0%, #1d2346 0%, #141634 50%, #0a0b1a 100%)',
    orbs: ['#4f63d9', '#8b6fd6', '#2f3f7a'],
  },
  letter: {
    gradient:
      'radial-gradient(90% 70% at 50% 45%, #3a2030 0%, #1e1220 55%, #0c070e 100%)',
    orbs: ['#ff9a5c', '#b8345e', '#ffcf8a'],
  },
  finale: {
    gradient:
      'radial-gradient(120% 90% at 50% 100%, #5d1d48 0%, #2c1238 50%, #110818 100%)',
    orbs: ['#ffcf5c', '#ff4f8b', '#9f7bff'],
  },
};

const stages = Object.keys(moods) as Stage[];

export const Atmosphere = memo(function Atmosphere({ stage }: { stage: Stage }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 18 });
  const sy = useSpring(py, { stiffness: 40, damping: 18 });
  const orbX = useTransform(sx, (v) => v * 28);
  const orbY = useTransform(sy, (v) => v * 28);
  const dustX = useTransform(sx, (v) => v * -12);
  const dustY = useTransform(sy, (v) => v * -12);
  const raf = useRef(0);

  useEffect(() => {
    // Parallax only for precise pointers; touch devices keep the scene still.
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        px.set(e.clientX / window.innerWidth - 0.5);
        py.set(e.clientY / window.innerHeight - 0.5);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [px, py]);

  const mood = moods[stage];

  return (
    <div className="atmo" aria-hidden="true">
      {stages.map((s) => (
        <div
          key={s}
          className="atmo-layer"
          style={{ background: moods[s].gradient, opacity: s === stage ? 1 : 0 }}
        />
      ))}
      <motion.div className="atmo-orbs" style={{ x: orbX, y: orbY }}>
        <div className="orb orb-a" style={{ backgroundColor: mood.orbs[0] }} />
        <div className="orb orb-b" style={{ backgroundColor: mood.orbs[1] }} />
        <div className="orb orb-c" style={{ backgroundColor: mood.orbs[2] }} />
      </motion.div>
      <motion.div className="atmo-layer" style={{ x: dustX, y: dustY }}>
        <Particles stage={stage} />
      </motion.div>
      <div className="atmo-vignette" />
      <div className="atmo-grain" />
    </div>
  );
});
