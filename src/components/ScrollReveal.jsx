import { useRef, useEffect } from 'react';
import { animate, stagger, onScroll } from 'animejs';

export default function ScrollReveal({ children, className = '', translateY = 40, scale = 1, staggerDelay = 0, childSelector = null }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const els = childSelector
      ? ref.current.querySelectorAll(childSelector)
      : [ref.current];
    if (!els.length) return;

    const anim = animate(els, {
      translateY: [translateY, 0],
      scale: childSelector ? [0.95, 1] : [scale, 1],
      duration: 600,
      delay: childSelector ? stagger(staggerDelay) : 0,
      ease: 'easeOutCubic',
    });
    const cancel = onScroll(anim, { container: window, enter: 'top bottom+=50', once: true });
    return () => { anim.cancel(); cancel?.(); };
  }, [translateY, scale, staggerDelay, childSelector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
