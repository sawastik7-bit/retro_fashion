import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { animate, onScroll } from 'animejs';
import SpeechBubble from './SpeechBubble';

export default function ProductCard({ product, onDragToCart, index = 0 }) {
  const cardRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const [clickBounce, setClickBounce] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-150, 150], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-8, 8]), { stiffness: 300, damping: 30 });

  useEffect(() => {
    if (!wrapperRef.current) return;
    const anim = animate(wrapperRef.current, {
      translateY: [60, 0],
      opacity: [0, 1],
      rotate: [-2, 0],
      duration: 600,
      delay: index * 100,
      ease: 'easeOutCubic',
    });
    const cancel = onScroll(anim, { container: window, enter: 'top bottom+=40', once: true });
    return () => { anim.cancel(); cancel?.(); };
  }, [index]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    setClickBounce(true);
    setShowImpact(true);
    setTimeout(() => setClickBounce(false), 500);
    setTimeout(() => setShowImpact(false), 400);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative group"
      data-product="true"
      data-cursor="product"
      style={{ opacity: 0, perspective: 800 }}
    >
      <motion.div
        className="relative bg-punk-gray border-4 border-punk-black overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          borderRadius: '4px 12px 6px 10px',
          boxShadow: '6px 6px 0 #0a0a0a',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        whileHover={{
          boxShadow: '8px 8px 0 #0a0a0a, 0 0 30px rgba(255, 45, 107, 0.15)',
        }}
        animate={clickBounce ? {
          scale: [1, 1.08, 0.95, 1.02, 1],
          transition: { duration: 0.5 },
        } : {}}
        drag
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(e, info) => {
          setIsDragging(false);
          if (info.point.y > window.innerHeight * 0.7) {
            onDragToCart?.(product);
          }
        }}
      >
        {/* Impact star burst on hover */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full opacity-15">
            <polygon
              points="100,5 115,70 185,70 125,110 145,180 100,135 55,180 75,110 15,70 85,70"
              fill="#ffd600"
            />
          </svg>
        </motion.div>

        {/* Halftone overlay on hover */}
        <motion.div
          className="absolute inset-0 halftone-overlay z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.5 }}
          transition={{ duration: 0.2 }}
        />

        {/* Product image with comic ink effect */}
        <div className="comic-ink-effect aspect-[3/4] overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Duotone overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-punk-pink/30 to-punk-yellow/20 mix-blend-multiply pointer-events-none" />
        </div>

        {/* Product info */}
        <div className="p-4 relative z-20">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display text-xl tracking-wide text-punk-white leading-tight">
              {product.name}
            </h3>
            {product.badge && (
              <SpeechBubble variant={product.badge === 'LIMITED' ? 'pink' : 'yellow'} className="shrink-0 text-[10px] px-2 py-1">
                {product.badge}
              </SpeechBubble>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl text-punk-pink tracking-wider">
              ${product.price}
            </span>
            <motion.button
              className="bg-punk-black border-3 border-punk-pink text-punk-pink font-display text-sm px-4 py-2 tracking-wider hover:bg-punk-pink hover:text-punk-black transition-colors"
              style={{ borderWidth: '3px' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-cursor="button"
            >
              ADD
            </motion.button>
          </div>
        </div>

        {/* Drag indicator */}
        {isDragging && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center bg-punk-black/50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="font-marker text-3xl text-punk-yellow">DROP HERE!</span>
          </motion.div>
        )}
      </motion.div>

      {/* Click impact flash */}
      {showImpact && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-40"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.5, 2] }}
          transition={{ duration: 0.4 }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon
              points="100,0 120,70 200,70 135,115 160,200 100,145 40,200 65,115 0,70 80,70"
              fill="#ffd600"
              opacity="0.4"
            />
          </svg>
        </motion.div>
      )}
    </div>
  );
}
