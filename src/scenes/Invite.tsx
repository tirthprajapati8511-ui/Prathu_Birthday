import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue } from 'motion/react';
import { content, NAAAA_ESCAPES } from '../content';
import { Button } from '../components/Button';
import { IceCream, type IceCreamMood } from '../illustrations/IceCream';

const ease = [0.22, 1, 0.36, 1] as const;
const PAD = 10;
/** Below this arena width HAAAN sits on top and NAAAA starts underneath (see CSS). */
const STACKED_BELOW = 440;
const YES_GROWTH = 0.02;
/** A click that lands this soon after a dodge belongs to the same tap and is ignored. */
const SAME_GESTURE_MS = 450;

type Props = { onYes: () => void; onNo: () => void };

export function Invite({ onYes, onNo }: Props) {
  const c = content.invite;
  const [attempts, setAttempts] = useState(0);
  const exhausted = attempts >= NAAAA_ESCAPES;

  const mood: IceCreamMood = attempts === 0 ? 'idle' : exhausted ? 'sad' : 'worried';

  return (
    <motion.div
      className="invite-card"
      initial={{ opacity: 0, y: 40, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, ease }}
      style={{ transformPerspective: 900 }}
    >
      <motion.div
        className="icecream-wrap"
        initial={{ y: 60, opacity: 0, rotate: -8 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 140, damping: 12 }}
      >
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 2, 0, -2, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        >
          <IceCream mood={mood} />
        </motion.div>
      </motion.div>

      <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        {c.eyebrow}
      </motion.p>
      <motion.h1
        className="display invite-title"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.9, ease }}
      >
        {c.title}
      </motion.h1>
      <motion.p
        className="lede"
        style={{ marginTop: 12 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.95, duration: 0.8 }}
      >
        {c.sub}
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 0.8, ease }}>
        <Arena attempts={attempts} setAttempts={setAttempts} onYes={onYes} onNo={onNo} />

        <div className="attempt-dots" aria-hidden="true">
          {Array.from({ length: NAAAA_ESCAPES }, (_, i) => (
            <span key={i} className={i < attempts ? 'used' : undefined} />
          ))}
        </div>
        <p className="taunt" aria-live="polite">
          {c.taunts[Math.min(attempts, c.taunts.length - 1)]}
        </p>
      </motion.div>
    </motion.div>
  );
}

function Arena({
  attempts,
  setAttempts,
  onYes,
  onNo,
}: Props & { attempts: number; setAttempts: (n: number) => void }) {
  const c = content.invite;
  const arena = useRef<HTMLDivElement>(null);
  const noBtn = useRef<HTMLButtonElement>(null);
  const yesWrap = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const placed = useRef(false);
  /** Where NAAAA is headed; clamping must use this, not the mid-flight position. */
  const target = useRef({ x: 0, y: 0 });
  const lastDodge = useRef(-Infinity);
  const count = useRef(attempts);
  count.current = attempts;

  const exhausted = attempts >= NAAAA_ESCAPES;

  const bounds = useCallback(() => {
    const a = arena.current!.getBoundingClientRect();
    const b = noBtn.current!.getBoundingClientRect();
    return { a, bw: b.width, bh: b.height, maxX: a.width - b.width - PAD, maxY: a.height - b.height - PAD };
  }, []);

  // Place NAAAA on first layout, and keep it inside the arena when its label
  // changes width or the viewport resizes.
  useLayoutEffect(() => {
    const fit = () => {
      if (!arena.current || !noBtn.current) return;
      const { a, bw, bh, maxX, maxY } = bounds();
      if (!placed.current) {
        const stacked = a.width < STACKED_BELOW;
        target.current = stacked
          ? { x: a.width / 2 - bw / 2, y: a.height * 0.72 - bh / 2 }
          : { x: Math.min(maxX, a.width * 0.72 - bw / 2), y: a.height / 2 - bh / 2 };
        x.jump(target.current.x);
        y.jump(target.current.y);
        placed.current = true;
        return;
      }
      const spring = { type: 'spring' as const, stiffness: 420, damping: 30 };
      if (target.current.x > maxX) animate(x, (target.current.x = Math.max(PAD, maxX)), spring);
      if (target.current.y > maxY) animate(y, (target.current.y = Math.max(PAD, maxY)), spring);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [attempts, bounds, x, y]);

  const dodge = useCallback(
    (px?: number, py?: number) => {
      if (count.current >= NAAAA_ESCAPES || !arena.current || !noBtn.current) return;
      const { a, bw, bh, maxX, maxY } = bounds();
      const r = yesWrap.current!.getBoundingClientRect();
      const grow = (r.width * YES_GROWTH * NAAAA_ESCAPES) / 2;
      const yes = { left: r.left - grow, right: r.right + grow, top: r.top - grow / 3, bottom: r.bottom + grow / 3 };
      const cx = x.get();
      const cy = y.get();
      // Pointer position relative to the arena (falls back to the button centre for keyboard).
      const pointerX = px !== undefined ? px - a.left : cx + bw / 2;
      const pointerY = py !== undefined ? py - a.top : cy + bh / 2;

      let best = { x: cx, y: cy, score: -Infinity };
      for (let i = 0; i < 24; i++) {
        const nx = PAD + Math.random() * Math.max(0, maxX - PAD);
        const ny = PAD + Math.random() * Math.max(0, maxY - PAD);
        const overlapsYes =
          nx < yes.right - a.left + 8 &&
          nx + bw > yes.left - a.left - 8 &&
          ny < yes.bottom - a.top + 8 &&
          ny + bh > yes.top - a.top - 8;
        if (overlapsYes) continue;
        const fromPointer = Math.hypot(nx + bw / 2 - pointerX, ny + bh / 2 - pointerY);
        const travel = Math.hypot(nx - cx, ny - cy);
        // Prefer spots far from the finger/cursor, but never a tiny hop.
        const score = fromPointer + (travel < 60 ? -500 : 0) + Math.random() * 40;
        if (score > best.score) best = { x: nx, y: ny, score };
      }

      target.current = { x: best.x, y: best.y };
      const spring = { type: 'spring' as const, stiffness: 520, damping: 24, mass: 0.7 };
      animate(x, best.x, spring);
      animate(y, best.y, spring);
      animate(rotate, [0, best.x > cx ? 14 : -14, 0], { duration: 0.45, ease: 'easeOut' });

      lastDodge.current = performance.now();
      setAttempts(count.current + 1);
    },
    [bounds, rotate, setAttempts, x, y],
  );

  const yesScale = 1 + Math.min(attempts, NAAAA_ESCAPES) * YES_GROWTH;

  return (
    <div className="arena" ref={arena}>
      <motion.div
        ref={yesWrap}
        className="arena-yes"
        style={{ x: '-50%', y: '-50%' }}
        animate={{ scale: yesScale }}
        transition={{ type: 'spring', stiffness: 300, damping: 14 }}
      >
        <Button sheen onClick={onYes}>
          {c.yes}
        </Button>
      </motion.div>

      <motion.button
        ref={noBtn}
        type="button"
        className={`btn btn-ghost arena-no${exhausted ? ' tired' : ''}`}
        style={{ x, y, rotate }}
        animate={exhausted ? { scale: [1, 0.92, 1], rotate: [0, -6, 4, 0] } : { scale: 1 }}
        transition={{ duration: 0.6 }}
        whileTap={exhausted ? { scale: 0.92 } : undefined}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse' || e.pointerType === 'pen') dodge(e.clientX, e.clientY);
        }}
        onPointerDown={(e) => {
          if (e.pointerType === 'touch') dodge(e.clientX, e.clientY);
        }}
        onClick={() => {
          if (performance.now() - lastDodge.current < SAME_GESTURE_MS) return;
          if (count.current < NAAAA_ESCAPES) dodge();
          else onNo();
        }}
      >
        <span className="btn-label">{c.dodgeLines[Math.min(attempts, c.dodgeLines.length - 1)]}</span>
      </motion.button>
    </div>
  );
}
