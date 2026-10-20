import { useCallback, useEffect, useRef, useState } from 'react';

// Happy Birthday as a music box: [midi note, beats, optional bass note].
const MELODY: [number, number, number?][] = [
  [67, 0.75], [67, 0.25], [69, 1, 48], [67, 1], [72, 1], [71, 2, 43],
  [67, 0.75], [67, 0.25], [69, 1, 43], [67, 1], [74, 1], [72, 2, 48],
  [67, 0.75], [67, 0.25], [79, 1, 48], [76, 1], [72, 1], [71, 1, 41], [69, 2],
  [77, 0.75], [77, 0.25], [76, 1, 48], [72, 1], [74, 1, 43], [72, 3, 48],
];
const BEAT = 0.6; // seconds
const LOOP_GAP_BEATS = 3;
const LOOKAHEAD = 0.5;

const freq = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

type Engine = {
  ctx: AudioContext;
  master: GainNode;
  bus: GainNode;
  timer: number;
  nextTime: number;
  index: number;
};

function pluck(e: Engine, midi: number, at: number, gain: number, len: number) {
  const { ctx, bus } = e;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(gain, at + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, at + len);
  g.connect(bus);

  const base = ctx.createOscillator();
  base.type = 'sine';
  base.frequency.value = freq(midi);
  const bell = ctx.createOscillator();
  bell.type = 'triangle';
  bell.frequency.value = freq(midi) * 2.005;
  const bellGain = ctx.createGain();
  bellGain.gain.value = 0.28;

  base.connect(g);
  bell.connect(bellGain).connect(g);
  base.start(at);
  bell.start(at);
  base.stop(at + len + 0.05);
  bell.stop(at + len + 0.05);
}

/**
 * A synthesized music-box loop. Nothing runs until start() is called from a
 * user gesture, and the scheduler is torn down completely on stop().
 */
export function useMusic() {
  const [playing, setPlaying] = useState(false);
  const engine = useRef<Engine | null>(null);

  const schedule = useCallback(() => {
    const e = engine.current;
    if (!e) return;
    while (e.nextTime < e.ctx.currentTime + LOOKAHEAD) {
      const [note, beats, bass] = MELODY[e.index];
      pluck(e, note, e.nextTime, 0.16, Math.max(1.2, beats * BEAT * 1.6));
      if (bass) pluck(e, bass, e.nextTime, 0.1, 2.4);
      e.nextTime += beats * BEAT;
      e.index += 1;
      if (e.index >= MELODY.length) {
        e.index = 0;
        e.nextTime += LOOP_GAP_BEATS * BEAT;
      }
    }
  }, []);

  const start = useCallback(() => {
    if (engine.current) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.2);
    master.connect(ctx.destination);

    // Soft echo for a little room around the notes.
    const bus = ctx.createGain();
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.28;
    const fb = ctx.createGain();
    fb.gain.value = 0.28;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2400;
    bus.connect(master);
    bus.connect(delay);
    delay.connect(lp).connect(fb).connect(delay);
    lp.connect(master);

    engine.current = { ctx, master, bus, timer: 0, nextTime: ctx.currentTime + 0.15, index: 0 };
    schedule();
    engine.current.timer = window.setInterval(schedule, 120);
    setPlaying(true);
  }, [schedule]);

  const stop = useCallback(() => {
    const e = engine.current;
    if (!e) return;
    engine.current = null;
    window.clearInterval(e.timer);
    const now = e.ctx.currentTime;
    e.master.gain.cancelScheduledValues(now);
    e.master.gain.setValueAtTime(e.master.gain.value, now);
    e.master.gain.linearRampToValueAtTime(0, now + 0.4);
    window.setTimeout(() => void e.ctx.close(), 500);
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => (engine.current ? stop() : start()), [start, stop]);

  useEffect(() => {
    // Silence while the tab is hidden; resume when it returns.
    const onVis = () => {
      const e = engine.current;
      if (!e) return;
      if (document.hidden) void e.ctx.suspend();
      else void e.ctx.resume();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      stop();
    };
  }, [stop]);

  return { playing, start, stop, toggle };
}
