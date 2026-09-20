import { useEffect, useRef } from 'react';
import { animate, stagger, onScroll } from 'animejs';

export default function ScrollReveal({
  children,
  className = '',
  translateY = [40, 0],
  opacity = [0, 1],
  scale = [0.97, 1],
  duration = 700,
  delay = 0,
  staggerDelay = 0,
  easing = 'easeOutCubic',
  once = true,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const anim = animate(ref.current, {
      translateY,
      opacity,
      scale,
      duration,
      delay,
      ease: easing,
    });

    const cancelScroll = onScroll(anim, {
      container: window,
      enter: 'top bottom+=60',
      once,
    });

    return () => {
      anim.cancel();
      cancelScroll?.();
    };
  }, []);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

export function StaggerReveal({
  children,
  className = '',
  childSelector = '*',
  translateY = [50, 0],
  opacity = [0, 1],
  scale = [0.95, 1],
  duration = 600,
  staggerDelay = 80,
  easing = 'easeOutCubic',
  once = true,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const elements = ref.current.querySelectorAll(childSelector);
    if (!elements.length) return;

    const anim = animate(elements, {
      translateY,
      opacity,
      scale,
      duration,
      delay: stagger(staggerDelay),
      ease: easing,
    });

    const cancelScroll = onScroll(anim, {
      container: window,
      enter: 'top bottom+=60',
      once,
    });

    return () => {
      anim.cancel();
      cancelScroll?.();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
