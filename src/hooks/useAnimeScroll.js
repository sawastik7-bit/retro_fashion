import { useEffect, useRef } from 'react';
import { animate, stagger, onScroll } from 'animejs';

export function useScrollReveal(selector, options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const {
      translateY = [40, 0],
      opacity = [0, 1],
      duration = 800,
      delay = 0,
      easing = 'easeOutCubic',
      stagger = 0,
      once = true,
    } = options;

    const elements = ref.current.querySelectorAll(selector);
    if (!elements.length) return;

    const animations = animate(elements, {
      translateY,
      opacity,
      duration,
      delay: stagger ? stagger(delay, { start: delay }) : delay,
      ease: easing,
    });

    const cancelScroll = onScroll(animations, {
      container: window,
      enter: 'top bottom+=80',
      once,
    });

    return () => {
      animations.cancel();
      cancelScroll?.();
    };
  }, [selector]);

  return ref;
}

export function useStaggerReveal(selector, options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const {
      translateY = [60, 0],
      opacity = [0, 1],
      scale = [0.95, 1],
      duration = 600,
      delay = 100,
      easing = 'easeOutCubic',
      once = true,
    } = options;

    const elements = ref.current.querySelectorAll(selector);
    if (!elements.length) return;

    const animations = animate(elements, {
      translateY,
      opacity,
      scale,
      duration,
      delay: stagger(delay),
      ease: easing,
    });

    const cancelScroll = onScroll(animations, {
      container: window,
      enter: 'top bottom+=60',
      once,
    });

    return () => {
      animations.cancel();
      cancelScroll?.();
    };
  }, [selector]);

  return ref;
}

export function useParallax(selector, options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const {
      translateY = [-30, 30],
      easing = 'linear',
    } = options;

    const elements = ref.current.querySelectorAll(selector);
    if (!elements.length) return;

    const animations = animate(elements, {
      translateY,
      ease: easing,
    });

    const cancelScroll = onScroll(animations, {
      container: window,
      enter: 'top bottom',
      leave: 'bottom top',
      once: false,
    });

    return () => {
      animations.cancel();
      cancelScroll?.();
    };
  }, [selector]);

  return ref;
}
