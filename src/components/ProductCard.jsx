import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { animate } from 'animejs';
import SpeechBubble from './SpeechBubble';

function RippleButton({ children, className, onClick, ...props }) {
  const btnRef = useRef(null);

  const handleClick = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple-circle';
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    onClick?.(e);
  };

  return (
    <button ref={btnRef} className={`btn-ripple ${className || ''}`} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

export default function ProductCard({ product, onDragToCart, index = 0 }) {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const [clickBounce, setClickBounce] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-150, 150], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-8, 8]), { stiffness: 300, damping: 30 });

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

  const handleDoubleClick = () => {
    setIsFlipped(!isFlipped);
    if (cardRef.current) {
      animate(cardRef.current, {
        scale: [1, 1.05, 1],
        duration: 300,
        ease: 'easeOutCubic',
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      data-product="true"
      data-cursor="product"
      initial={{ opacity: 0, y: 50, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: 800 }}
    >
      <div
        className={`flip-card ${isFlipped ? 'flipped' : ''}`}
        onDoubleClick={handleDoubleClick}
      >
        <div
          className="relative bg-punk-gray border-4 border-punk-black overflow-hidden flip-card-inner"
          style={{
            transformStyle: 'preserve-3d',
            borderRadius: '4px 12px 6px 10px',
            boxShadow: '6px 6px 0 #0a0a0a',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {/* Front face */}
          <div className="flip-card-front" style={{ backfaceVisibility: 'hidden' }}>
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <svg viewBox="0 0 200 200" className="w-full h-full opacity-15">
                <polygon
                  points="100,5 115,70 185,70 125,110 145,180 100,135 55,180 75,110 15,70 85,70"
                  fill="#ffd600"
                />
              </svg>
            </div>

            <div className="absolute inset-0 halftone-overlay z-10 pointer-events-none opacity-0 group-hover:opacity-50 transition-opacity duration-200" />

            <div className="comic-ink-effect aspect-[3/4] overflow-hidden relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-punk-pink/30 to-punk-yellow/20 mix-blend-multiply pointer-events-none" />
            </div>

            <div className="p-4 relative z-20">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-display text-xl tracking-wide text-punk-white leading-tight">
                  {product.name}
                </h3>
                {product.badge && (
                  <SpeechBubble variant={product.badge === 'LIMITED' ? 'pink' : 'yellow'} className="shrink-0 text-[10px] px-2 py-1 hover-wiggle">
                    {product.badge}
                  </SpeechBubble>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl text-punk-pink tracking-wider">
                  ${product.price}
                </span>
                <RippleButton
                  className="bg-punk-black border-3 border-punk-pink text-punk-pink font-display text-sm px-4 py-2 tracking-wider hover:bg-punk-pink hover:text-punk-black transition-colors click-bounce"
                  style={{ borderWidth: '3px' }}
                  data-cursor="button"
                >
                  ADD
                </RippleButton>
              </div>
            </div>
          </div>

          {/* Back face */}
          <div
            className="flip-card-back absolute inset-0 bg-punk-black border-4 border-punk-pink p-6 flex flex-col justify-between"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: '4px 12px 6px 10px' }}
          >
            <div>
              <h3 className="font-display text-2xl tracking-wide text-punk-pink mb-2">{product.name}</h3>
              <p className="text-punk-white/60 text-sm leading-relaxed">
                Premium quality streetwear. Limited edition drop. Hand-finished details. Built to last.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-punk-white/40 text-xs">
                  <span className="w-2 h-2 bg-punk-pink rounded-full" />
                  <span>Premium Materials</span>
                </div>
                <div className="flex items-center gap-2 text-punk-white/40 text-xs">
                  <span className="w-2 h-2 bg-punk-yellow rounded-full" />
                  <span>Limited Run</span>
                </div>
                <div className="flex items-center gap-2 text-punk-white/40 text-xs">
                  <span className="w-2 h-2 bg-punk-pink rounded-full" />
                  <span>Hand Finished</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <span className="font-display text-3xl text-punk-yellow">${product.price}</span>
              <p className="text-punk-white/30 text-xs mt-1">Double-click to flip back</p>
            </div>
          </div>
        </div>
      </div>

      {isDragging && (
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center bg-punk-black/50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="font-marker text-3xl text-punk-yellow">DROP HERE!</span>
        </motion.div>
      )}

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
    </motion.div>
  );
}
