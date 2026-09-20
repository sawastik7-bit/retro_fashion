import { useRef, useEffect } from 'react';
import { animate, stagger, onScroll } from 'animejs';

export default function StickerPop({ children, className = '', delay = 0, rotate = 12 }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const anim = animate(ref.current, {
      scale: [0, 1.15, 1],
      rotate: [-20, rotate],
      duration: 500,
      delay,
      ease: 'easeOutBack',
    });
    const cancel = onScroll(anim, { container: window, enter: 'top bottom+=30', once: true });
    return () => { anim.cancel(); cancel?.(); };
  }, [delay, rotate]);

  return (
    <div ref={ref} className={className} style={{ transformOrigin: 'center center' }}>
      {children}
    </div>
  );
}
