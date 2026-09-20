import { useRef, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';

function SpeedLinesSVG({ color = '#0a0a0a', count = 24, className = '' }) {
  const lines = useMemo(() => {
    const result = [];
    for (let i = 0; i < count; i++) {
      const angle = (360 / count) * i;
      const innerR = 30 + Math.random() * 20;
      const outerR = 70 + Math.random() * 30;
      const rad = (angle * Math.PI) / 180;
      result.push({
        x1: 50 + innerR * Math.cos(rad),
        y1: 50 + innerR * Math.sin(rad),
        x2: 50 + outerR * Math.cos(rad),
        y2: 50 + outerR * Math.sin(rad),
        width: 1 + Math.random() * 2,
      });
    }
    return result;
  }, [count]);

  return (
    <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="none">
      {lines.map((line, i) => (
        <line
          key={i}
          x1={`${line.x1}%`}
          y1={`${line.y1}%`}
          x2={`${line.x2}%`}
          y2={`${line.y2}%`}
          stroke={color}
          strokeWidth={line.width}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function FloatingShape({ children, className = '', speed = 1, scrollRange = [0, 500], parallaxAmount = 100 }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, scrollRange, [0, -parallaxAmount]);
  const rotate = useTransform(scrollY, scrollRange, [0, speed * 30]);

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{ y, rotate }}
      animate={{
        y: [0, -15 * speed, 0],
        rotate: [0, 3 * speed, 0],
      }}
      transition={{
        duration: 6 + speed * 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const speedLineOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0.8]);
  const speedLineScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      data-cursor="default"
    >
      {/* Background halftone */}
      <div className="absolute inset-0 halftone-sparse opacity-20" />

      {/* Speed lines behind hero */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: speedLineOpacity, scale: speedLineScale }}
      >
        <SpeedLinesSVG color="rgba(255,45,107,0.25)" count={36} />
      </motion.div>

      {/* Floating decorative shapes */}
      <FloatingShape
        className="top-[15%] left-[8%] md:left-[12%] w-24 h-24 md:w-40 md:h-40 bg-punk-pink opacity-20"
        speed={0.8}
        parallaxAmount={120}
        style={{ transform: 'skewX(-12deg)' }}
      >
        <div className="w-full h-full bg-punk-pink opacity-30" style={{ transform: 'skewX(-12deg)' }} />
      </FloatingShape>

      <FloatingShape
        className="bottom-[20%] right-[5%] md:right-[10%] w-20 h-20 md:w-32 md:h-32 bg-punk-yellow opacity-15"
        speed={1.2}
        parallaxAmount={80}
      >
        <div className="w-full h-full bg-punk-yellow opacity-25 rotate-45" />
      </FloatingShape>

      <FloatingShape
        className="top-[30%] right-[15%] w-16 h-16 md:w-24 md:h-24 opacity-10"
        speed={0.6}
        parallaxAmount={150}
      >
        <div className="w-full h-full border-4 border-punk-pink rotate-12" />
      </FloatingShape>

      {/* Main hero content */}
      <motion.div
        className="relative z-10 text-center px-4"
        style={{ y: textY }}
      >
        {/* Eyebrow */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="jagged-bubble bg-punk-yellow text-punk-black text-sm md:text-base px-6 py-2">
            NEW DROP — FALL 2026
          </span>
        </motion.div>

        {/* RETRO text */}
        <motion.h1
          className="font-display text-[18vw] md:text-[14vw] lg:text-[12vw] leading-[0.85] tracking-tight text-punk-white mb-0"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          RETRO
        </motion.h1>

        {/* PUNK text with jitter */}
        <motion.h1
          className="font-display text-[22vw] md:text-[18vw] lg:text-[15vw] leading-[0.8] tracking-tight text-punk-pink relative inline-block"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          data-cursor="button"
          style={{
            textShadow: '4px 4px 0 #0a0a0a, -2px -2px 0 #0a0a0a, 2px -2px 0 #0a0a0a, -2px 2px 0 #0a0a0a',
            animation: 'jitter 0.3s infinite',
          }}
          whileHover={{
            scale: 1.05,
            transition: { type: 'spring', stiffness: 400, damping: 10 },
          }}
        >
          PUNK
          {/* Impact star behind on hover */}
          <motion.span
            className="absolute inset-[-20%] pointer-events-none"
            initial={{ opacity: 0, scale: 0 }}
            whileHover={{ opacity: 0.3, scale: 1.2, rotate: 15 }}
            transition={{ duration: 0.2 }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <polygon
                points="100,10 120,75 190,75 135,115 155,180 100,140 45,180 65,115 10,75 80,75"
                fill="#ffd600"
                opacity="0.5"
              />
            </svg>
          </motion.span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="mt-8 text-lg md:text-xl text-punk-white/70 font-body max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Streetwear that fights back. Brutal cuts. Raw energy. No compromise.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.button
            className="comic-btn"
            data-cursor="button"
            whileHover={{
              backgroundColor: '#ffd600',
              color: '#0a0a0a',
              transition: { duration: 0.05 },
            }}
            whileTap={{
              scale: 0.92,
              boxShadow: '2px 2px 0 #0a0a0a',
            }}
            style={{ animation: 'none' }}
            onHoverStart={() => {}}
          >
            <span className="relative z-10">SHOP THE DROP</span>
            <svg className="relative z-10 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Onomatopoeia decoration */}
        <motion.div
          className="absolute -top-8 -right-4 md:right-[10%] md:top-[5%]"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 1.2 }}
        >
          <span className="onomatopoeia text-4xl md:text-6xl text-punk-yellow">RAW!</span>
        </motion.div>
      </motion.div>

      {/* Bottom ink splatter */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        <svg viewBox="0 0 1200 120" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,80 Q50,20 100,70 T200,50 T300,75 T400,40 T500,65 T600,30 T700,60 T800,35 T900,55 T1000,25 T1100,50 T1200,40 L1200,120 L0,120 Z"
            fill="#0a0a0a"
          />
          <path
            d="M0,90 Q80,60 160,85 T320,70 T480,80 T640,55 T800,75 T960,50 T1120,70 T1200,60 L1200,120 L0,120 Z"
            fill="#0a0a0a"
            opacity="0.5"
          />
        </svg>
      </div>
    </section>
  );
}
