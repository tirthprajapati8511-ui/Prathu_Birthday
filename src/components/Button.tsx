import { forwardRef, useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from 'motion/react';

type Variant = 'primary' | 'ghost' | 'gold';

type Props = Omit<HTMLMotionProps<'button'>, 'children'> & {
  variant?: Variant;
  size?: 'md' | 'xl';
  arrow?: boolean;
  sheen?: boolean;
  children: ReactNode;
};

const spring = { stiffness: 260, damping: 18, mass: 0.6 };

/**
 * Pill button with a magnetic pull toward the pointer (fine pointers only)
 * and a springy press. The magnetism lives in motion values, so pointer
 * movement never re-renders React.
 */
export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', arrow, sheen, className = '', children, onPointerMove, onPointerLeave, ...rest },
  ref,
) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, spring);
  const y = useSpring(my, spring);
  const rect = useRef<DOMRect | null>(null);

  const cls = ['btn', variant !== 'primary' && `btn-${variant}`, size === 'xl' && 'btn-xl', className]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.button
      ref={ref}
      type="button"
      className={cls}
      style={{ x, y }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onPointerEnter={(e) => {
        rect.current = e.currentTarget.getBoundingClientRect();
      }}
      onPointerMove={(e) => {
        onPointerMove?.(e);
        if (e.pointerType !== 'mouse' || !rect.current) return;
        const r = rect.current;
        mx.set((e.clientX - (r.left + r.width / 2)) * 0.22);
        my.set((e.clientY - (r.top + r.height / 2)) * 0.3);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        mx.set(0);
        my.set(0);
      }}
      {...rest}
    >
      {sheen && <span className="btn-sheen" aria-hidden="true" />}
      <span className="btn-label">{children}</span>
      {arrow && (
        <span className="btn-arrow btn-label" aria-hidden="true">
          →
        </span>
      )}
    </motion.button>
  );
});
