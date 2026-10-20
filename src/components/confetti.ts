import confetti from 'canvas-confetti';
import { isCoarsePointer, prefersReducedMotion } from '../stages';

const PALETTE = ['#ff6b98', '#ffd88a', '#ffb38a', '#b9a3ff', '#8fe3cf', '#fff4ec'];

let fire: confetti.CreateTypes | null = null;
let heart: confetti.Shape | null = null;

function cannon() {
  if (fire) return fire;
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '15',
  });
  document.body.appendChild(canvas);
  fire = confetti.create(canvas, { resize: true, useWorker: true, disableForReducedMotion: true });
  return fire;
}

function heartShape() {
  heart ??= confetti.shapeFromPath({
    path: 'M12 21s-7.5-4.6-10-9.2C.4 8.6 2.3 4.5 6.2 4.5c2.2 0 3.6 1.2 4.4 2.5h.8c.8-1.3 2.2-2.5 4.4-2.5 3.9 0 5.8 4.1 4.2 7.3C19.5 16.4 12 21 12 21z',
  });
  return heart;
}

/** Fewer particles on phones keeps low-end Android smooth. */
const scale = (n: number) => Math.round(n * (isCoarsePointer() ? 0.55 : 1));

export function celebrate() {
  if (prefersReducedMotion()) return;
  const f = cannon();
  const common = { colors: PALETTE, ticks: 260, gravity: 0.9, scalar: 1.05 };
  f({ ...common, particleCount: scale(90), angle: 60, spread: 62, startVelocity: 58, origin: { x: 0, y: 0.85 } });
  f({ ...common, particleCount: scale(90), angle: 120, spread: 62, startVelocity: 58, origin: { x: 1, y: 0.85 } });
  window.setTimeout(() => {
    f({ ...common, particleCount: scale(70), spread: 100, startVelocity: 38, origin: { x: 0.5, y: 0.35 }, shapes: [heartShape(), 'circle'], scalar: 1.3 });
  }, 380);
}

export function sprinkle(x: number, y: number) {
  if (prefersReducedMotion()) return;
  cannon()({
    particleCount: scale(40),
    spread: 70,
    startVelocity: 26,
    ticks: 140,
    gravity: 1.1,
    scalar: 0.8,
    colors: PALETTE,
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
  });
}

export function heartsRain() {
  if (prefersReducedMotion()) return;
  cannon()({
    particleCount: scale(50),
    spread: 160,
    startVelocity: 30,
    ticks: 300,
    gravity: 0.6,
    scalar: 1.6,
    shapes: [heartShape()],
    colors: ['#ff6b98', '#ff8fb1', '#ffd88a'],
    origin: { x: 0.5, y: 0.3 },
  });
}

/** A short fireworks show. Returns a cancel function for unmount. */
export function fireworks(duration = 2600) {
  if (prefersReducedMotion()) return () => {};
  const f = cannon();
  const end = Date.now() + duration;
  let timer = 0;
  const burst = () => {
    f({
      particleCount: scale(55),
      spread: 360,
      startVelocity: 26,
      ticks: 120,
      gravity: 0.7,
      scalar: 0.95,
      colors: PALETTE,
      shapes: ['star', 'circle'],
      origin: { x: 0.15 + Math.random() * 0.7, y: 0.15 + Math.random() * 0.35 },
    });
    if (Date.now() < end) timer = window.setTimeout(burst, 320 + Math.random() * 260);
  };
  burst();
  return () => window.clearTimeout(timer);
}
