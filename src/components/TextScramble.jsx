import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export default function TextScramble({ text, className = '', as: Tag = 'span', delay = 0 }) {
  const ref = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!ref.current || doneRef.current) return;
    doneRef.current = true;

    const el = ref.current;
    const chars = text.split('');
    const original = text;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          setTimeout(() => {
            let frame = 0;
            const totalFrames = 20;
            const interval = setInterval(() => {
              const progress = frame / totalFrames;
              const scrambled = chars.map((char, i) => {
                if (i < Math.floor(progress * chars.length)) return char;
                return CHARS[Math.floor(Math.random() * CHARS.length)];
              }).join('');
              el.textContent = scrambled;
              frame++;
              if (frame > totalFrames) {
                el.textContent = original;
                clearInterval(interval);
              }
            }, 30);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [text, delay]);

  return <Tag ref={ref} className={className}>{text}</Tag>;
}
