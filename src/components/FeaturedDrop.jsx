import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ComicPanel from './ComicPanel';
import Onomatopoeia from './Onomatopoeia';
import SpeechBubble from './SpeechBubble';

gsap.registerPlugin(ScrollTrigger);

const DROPS = [
  {
    title: 'ANARCHY\nBOMBER',
    subtitle: 'Military-grade nylon. Hand-sprayed art. Each one unique. Only 50 made. This is the piece that defines the collection.',
    price: '$195',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop',
    alt: 'Anarchy Bomber Jacket',
    ctaText: 'GRAB IT',
  },
  {
    title: 'VENOM\nVEST',
    subtitle: 'Leather panels. Chain details. The finishing touch to any fit. Limited run, once it\'s gone, it\'s gone.',
    price: '$58',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop',
    alt: 'Venom Vest',
    ctaText: 'GRAB IT',
  },
];

function DropCard({ item, index }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isReversed = index % 2 !== 0;

  useEffect(() => {
    if (reduce || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { x: 80, opacity: 0, rotate: 3 },
        {
          x: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.7,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 70%',
          },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [reduce]);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <div
      ref={cardRef}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center ${index > 0 ? 'mt-16 md:mt-24' : ''}`}
    >
      {/* Text content */}
      <div className={`relative z-10 ${isReversed ? 'lg:order-2' : ''}`}>
        <Onomatopoeia text={index === 0 ? 'SMASH!' : 'POW!'} className="text-3xl md:text-5xl mb-4 inline-block" />

        <ComicPanel className="p-6 md:p-8 bg-punk-black mb-8" delay={0.1}>
          <div className="flex items-center gap-3 mb-4">
            <SpeechBubble variant="pink" className="text-xs px-3 py-1">
              FEATURED
            </SpeechBubble>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide text-punk-white leading-[0.9] mb-4 whitespace-pre-line">
            {item.title}
          </h2>
          <p className="text-punk-white/60 text-base md:text-lg mb-6 max-w-md">
            {item.subtitle}
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-display text-4xl text-punk-pink tracking-wider">
              {item.price}
            </span>
            <motion.button
              className="comic-btn text-base"
              data-cursor="button"
              whileHover={{
                backgroundColor: '#ffd600',
                color: '#0a0a0a',
                transition: { duration: 0.05 },
              }}
              whileTap={{ scale: 0.92 }}
            >
              <span className="relative z-10">{item.ctaText}</span>
            </motion.button>
          </div>
        </ComicPanel>
      </div>

      {/* Featured image */}
      <motion.div
        ref={imageRef}
        className={`relative ${isReversed ? 'lg:order-1' : ''}`}
        style={{ y: parallaxY }}
      >
        <div className="comic-panel-wobble overflow-hidden bg-punk-gray">
          <div className="comic-ink-effect aspect-[3/4]">
            <img
              src={item.image}
              alt={item.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-punk-black/40 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Decorative torn edge */}
        <div className="absolute -bottom-3 left-4 right-4 h-6 bg-punk-black torn-edge" />

        {/* Onomatopoeia decoration */}
        <motion.div
          className="absolute -top-6 -right-4 md:-right-8"
          initial={{ scale: 0, rotate: 20 }}
          whileInView={{ scale: 1, rotate: 12 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.5 }}
        >
          <span className="onomatopoeia text-3xl md:text-5xl text-punk-yellow">{index === 0 ? 'POW!' : 'ZAP!'}</span>
        </motion.div>

        {/* Halftone corner */}
        <div className="absolute bottom-0 right-0 w-32 h-32 halftone-dense opacity-30 pointer-events-none" />
      </motion.div>
    </div>
  );
}

export default function FeaturedDrop() {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 px-4 overflow-hidden" data-cursor="default">
      {/* Speed lines background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (360 / 20) * i;
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={`${50 + 20 * Math.cos(rad)}%`}
                y1={`${50 + 20 * Math.sin(rad)}%`}
                x2={`${50 + 50 * Math.cos(rad)}%`}
                y2={`${50 + 50 * Math.sin(rad)}%`}
                stroke="#ff2d6b"
                strokeWidth="0.5"
              />
            );
          })}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto">
        {DROPS.map((item, i) => (
          <DropCard key={i} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
