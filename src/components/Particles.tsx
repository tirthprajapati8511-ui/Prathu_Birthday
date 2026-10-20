import { useEffect, useRef } from 'react';
import type { Stage } from '../stages';
import { prefersReducedMotion } from '../stages';

type Kind = 'dot' | 'star' | 'heart' | 'drop';

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  kind: Kind;
  color: string;
  phase: number;
  alpha: number;
};

type Recipe = { kinds: Kind[]; colors: string[]; density: number; fall: boolean };

const recipes: Record<Stage, Recipe> = {
  hello: { kinds: ['dot', 'dot', 'star', 'heart'], colors: ['#ffd88a', '#ff8fb1', '#fff4ec'], density: 1, fall: false },
  reveal: { kinds: ['star', 'dot', 'heart'], colors: ['#ffd88a', '#ff8fb1', '#fff'], density: 1.1, fall: false },
  invite: { kinds: ['dot', 'heart', 'star'], colors: ['#8fe3cf', '#ff8fb1', '#b9a3ff'], density: 0.9, fall: false },
  yes: { kinds: ['heart', 'star', 'dot'], colors: ['#ffd88a', '#ff6b98', '#8fe3cf'], density: 1.1, fall: false },
  no: { kinds: ['drop'], colors: ['#8ea2ff', '#b9a3ff'], density: 1.2, fall: true },
  letter: { kinds: ['dot'], colors: ['#ffcf8a', '#ffb38a'], density: 0.6, fall: false },
  finale: { kinds: ['star', 'heart', 'dot'], colors: ['#ffd88a', '#ff6b98', '#fff4ec', '#b9a3ff'], density: 1.2, fall: false },
};

const pick = <T,>(a: T[]) => a[(Math.random() * a.length) | 0];

function spawn(r: Recipe, w: number, h: number, anywhere: boolean): P {
  const kind = pick(r.kinds);
  const size = kind === 'dot' ? 1 + Math.random() * 2.2 : kind === 'drop' ? 5 + Math.random() * 6 : 4 + Math.random() * 6;
  return {
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : r.fall ? -20 : h + 20,
    vx: (Math.random() - 0.5) * 0.12,
    vy: r.fall ? 0.9 + Math.random() * 1.4 : -(0.12 + Math.random() * 0.35),
    size,
    kind,
    color: pick(r.colors),
    phase: Math.random() * Math.PI * 2,
    alpha: 0.35 + Math.random() * 0.55,
  };
}

function drawHeart(c: CanvasRenderingContext2D, s: number) {
  c.beginPath();
  c.moveTo(0, s * 0.35);
  c.bezierCurveTo(-s * 1.1, -s * 0.35, -s * 0.45, -s * 1.05, 0, -s * 0.45);
  c.bezierCurveTo(s * 0.45, -s * 1.05, s * 1.1, -s * 0.35, 0, s * 0.35);
  c.fill();
}

function drawStar(c: CanvasRenderingContext2D, s: number) {
  c.beginPath();
  c.moveTo(0, -s);
  c.quadraticCurveTo(0, 0, s, 0);
  c.quadraticCurveTo(0, 0, 0, s);
  c.quadraticCurveTo(0, 0, -s, 0);
  c.quadraticCurveTo(0, 0, 0, -s);
  c.fill();
}

function drawDrop(c: CanvasRenderingContext2D, s: number) {
  c.beginPath();
  c.moveTo(0, -s);
  c.quadraticCurveTo(s * 0.55, s * 0.1, 0, s * 0.5);
  c.quadraticCurveTo(-s * 0.55, s * 0.1, 0, -s);
  c.fill();
}

/**
 * One lightweight canvas of ambient particles. The recipe follows the stage,
 * but the animation loop is created once and paused whenever the tab is hidden.
 */
export function Particles({ stage }: { stage: Stage }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const recipe = useRef(recipes[stage]);
  const reset = useRef<(() => void) | null>(null);

  useEffect(() => {
    recipe.current = recipes[stage];
    reset.current?.();
  }, [stage]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let parts: P[] = [];
    let frame = 0;
    let running = false;
    let t = 0;

    const target = () => {
      const base = Math.min(46, Math.max(16, Math.round((w * h) / 26000)));
      return Math.round(base * recipe.current.density);
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        const twinkle = p.kind === 'drop' ? 1 : 0.65 + 0.35 * Math.sin(t * 0.03 + p.phase);
        ctx.globalAlpha = p.alpha * twinkle;
        ctx.fillStyle = p.color;
        ctx.save();
        ctx.translate(p.x, p.y);
        if (p.kind === 'dot') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.kind === 'heart') {
          ctx.rotate(Math.sin(t * 0.01 + p.phase) * 0.3);
          drawHeart(ctx, p.size);
        } else if (p.kind === 'star') {
          ctx.rotate(t * 0.004 + p.phase);
          drawStar(ctx, p.size);
        } else {
          drawDrop(ctx, p.size);
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };

    const step = () => {
      t += 1;
      const r = recipe.current;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.x += p.vx + Math.sin(t * 0.008 + p.phase) * 0.15;
        p.y += p.vy;
        if (p.y < -30 || p.y > h + 30 || p.x < -30 || p.x > w + 30) parts[i] = spawn(r, w, h, false);
      }
      draw();
      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      frame = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    reset.current = () => {
      const r = recipe.current;
      parts = Array.from({ length: target() }, () => spawn(r, w, h, true));
      if (reduced) draw();
    };

    resize();
    reset.current();
    start();

    // Mobile URL bars fire resize constantly; particles outside the new bounds
    // simply respawn in step(), so there's no need to rebuild them here.
    const onResize = () => {
      resize();
      if (reduced) draw();
    };
    const onVis = () => (document.hidden ? stop() : start());
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      stop();
      reset.current = null;
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="particles" />;
}
