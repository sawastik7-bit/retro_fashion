import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ComicPanel({ children, className = '', delay = 0, index = 0 }) {
  const panelRef = useRef(null);
  const isInView = useInView(panelRef, { once: true, amount: 0.2 });
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduce || !panelRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        {
          y: 60,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: delay + index * 0.08,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: panelRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onComplete: () => {
            gsap.fromTo(
              panelRef.current,
              { x: -3 },
              {
                x: 0,
                duration: 0.4,
                ease: 'elastic.out(1, 0.3)',
                onComplete: () => {
                  gsap.to(panelRef.current, {
                    x: 2,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 3,
                    ease: 'power1.inOut',
                  });
                },
              }
            );
          },
        }
      );
    }, panelRef);

    return () => ctx.revert();
  }, [reduce, delay, index]);

  return (
    <div
      ref={panelRef}
      className={`comic-panel-wobble ${className}`}
      style={{ opacity: reduce ? 1 : 0 }}
    >
      {children}
    </div>
  );
}
