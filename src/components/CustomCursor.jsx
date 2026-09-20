import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CURSOR_ICONS = {
  default: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <polygon points="4,2 4,22 10,16 18,16" fill="#ff2d6b" stroke="#0a0a0a" strokeWidth="2.5" strokeLinejoin="round"/>
    </svg>
  ),
  button: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <polygon points="16,2 20,12 30,12 22,19 25,30 16,23 7,30 10,19 2,12 12,12" fill="#ffd600" stroke="#0a0a0a" strokeWidth="2"/>
    </svg>
  ),
  product: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <polygon points="15,1 18,11 28,11 20,17 23,28 15,22 7,28 10,17 2,11 12,11" fill="#ff2d6b" stroke="#0a0a0a" strokeWidth="2"/>
    </svg>
  ),
  link: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M8 4 L20 4 L24 14 L14 26 L4 14 Z" fill="#ffd600" stroke="#0a0a0a" strokeWidth="2.5" strokeLinejoin="round"/>
    </svg>
  ),
};

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState('default');
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });
  const trailRef = useRef(null);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const move = (e) => {
      cursorX.set(e.clientX - 14);
      cursorY.set(e.clientY - 14);
    };

    const handleOver = (e) => {
      const el = e.target.closest('[data-cursor]');
      if (el) {
        setCursorType(el.dataset.cursor);
      } else if (e.target.closest('button, a, [role="button"]')) {
        setCursorType('button');
      } else if (e.target.closest('[data-product]')) {
        setCursorType('product');
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', handleOver);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', handleOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ x: springX, y: springY }}
      >
        {CURSOR_ICONS[cursorType]}
      </motion.div>
      <motion.div
        ref={trailRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          x: useSpring(cursorX, { stiffness: 200, damping: 20 }),
          y: useSpring(cursorY, { stiffness: 200, damping: 20 }),
          width: 40,
          height: 40,
          border: '2px solid rgba(255, 45, 107, 0.4)',
          borderRadius: '50%',
          transform: 'translate(-6px, -6px)',
        }}
      />
    </>
  );
}
