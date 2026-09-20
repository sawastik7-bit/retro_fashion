import { motion } from 'framer-motion';

export function LightningBolt({ className = '', size = 60, color = '#ffd600', delay = 0 }) {
  return (
    <motion.div
      className={`pointer-events-none sticker-shadow ${className}`}
      initial={{ scale: 0, rotate: -20, opacity: 0 }}
      whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 300, damping: 14, delay }}
    >
      <svg width={size} height={size * 1.4} viewBox="0 0 40 56" fill="none">
        <path d="M24 0L0 30h16L12 56l28-34H22L24 0z" fill={color} stroke="#0a0a0a" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

export function ThunderCloud({ className = '', size = 80, delay = 0 }) {
  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      initial={{ x: -20, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative" style={{ width: size, height: size * 0.7 }}>
        <svg viewBox="0 0 120 84" className="w-full h-full">
          <ellipse cx="60" cy="40" rx="50" ry="22" fill="white" opacity="0.08" />
          <ellipse cx="35" cy="38" rx="30" ry="18" fill="white" opacity="0.06" />
          <ellipse cx="85" cy="42" rx="28" ry="16" fill="white" opacity="0.07" />
          <ellipse cx="55" cy="32" rx="35" ry="20" fill="white" opacity="0.05" />
        </svg>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <svg width="16" height="22" viewBox="0 0 16 22" className="lightning-flash">
            <path d="M10 0L0 12h6L4 22l12-14H8L10 0z" fill="#ffd600" opacity="0.6" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

export function ComicStarburst({ className = '', size = 50, color = '#ffd600', delay = 0, text = '' }) {
  return (
    <motion.div
      className={`pointer-events-none sticker-shadow ${className}`}
      initial={{ scale: 0, rotate: 0 }}
      whileInView={{ scale: 1, rotate: 180 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 250, damping: 12, delay }}
      style={{ width: size, height: size }}
    >
      <div className="relative w-full h-full">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
            fill={color}
            stroke="#0a0a0a"
            strokeWidth="3"
          />
        </svg>
        {text && (
          <span className="absolute inset-0 flex items-center justify-center font-marker text-punk-black text-[10px] md:text-xs leading-none pointer-events-none"
            style={{ transform: 'rotate(180deg)' }}>
            {text}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function InkSplat({ className = '', size = 70, color = '#ff2d6b', delay = 0 }) {
  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100">
        <path
          d="M50 10C60 5 75 15 80 30C85 45 95 50 85 65C75 80 60 90 45 85C30 80 15 70 10 55C5 40 15 15 50 10Z"
          fill={color}
          opacity="0.15"
        />
        <circle cx="35" cy="30" r="8" fill={color} opacity="0.1" />
        <circle cx="70" cy="40" r="5" fill={color} opacity="0.08" />
        <circle cx="55" cy="70" r="6" fill={color} opacity="0.12" />
      </svg>
    </motion.div>
  );
}

export function SmokePuff({ className = '', size = 60, delay = 0 }) {
  return (
    <div className={`pointer-events-none cloud-float ${className}`} style={{ animationDelay: `${delay}s` }}>
      <svg width={size} height={size * 0.6} viewBox="0 0 100 60">
        <ellipse cx="50" cy="35" rx="40" ry="18" fill="white" opacity="0.06" />
        <ellipse cx="30" cy="30" rx="25" ry="14" fill="white" opacity="0.04" />
        <ellipse cx="70" cy="38" rx="22" ry="12" fill="white" opacity="0.05" />
      </svg>
    </div>
  );
}

export function ComicBurst({ className = '', size = 100, color = '#ffd600', delay = 0 }) {
  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (360 / 12) * i;
          const rad = (angle * Math.PI) / 180;
          const r1 = 20;
          const r2 = i % 2 === 0 ? 48 : 38;
          return (
            <line
              key={i}
              x1={50 + r1 * Math.cos(rad)}
              y1={50 + r1 * Math.sin(rad)}
              x2={50 + r2 * Math.cos(rad)}
              y2={50 + r2 * Math.sin(rad)}
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.3"
            />
          );
        })}
        <circle cx="50" cy="50" r="18" fill={color} opacity="0.15" stroke="#0a0a0a" strokeWidth="2" />
      </svg>
    </motion.div>
  );
}

export function DiamondShape({ className = '', size = 30, color = '#ff2d6b', delay = 0 }) {
  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      initial={{ scale: 0, rotate: 0 }}
      whileInView={{ scale: 1, rotate: 45 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 300, damping: 14, delay }}
    >
      <div style={{ width: size, height: size, background: color, opacity: 0.15, transform: 'rotate(45deg)' }} />
    </motion.div>
  );
}

export function CrossHair({ className = '', size = 24, color = '#ff2d6b', delay = 0 }) {
  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 0.2 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 300, damping: 14, delay }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.5" />
        <line x1="12" y1="0" x2="12" y2="24" stroke={color} strokeWidth="1" />
        <line x1="0" y1="12" x2="24" y2="12" stroke={color} strokeWidth="1" />
      </svg>
    </motion.div>
  );
}

export function ZigZag({ className = '', width = 80, color = '#ffd600', delay = 0 }) {
  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 0.3 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <svg width={width} height="8" viewBox="0 0 80 8">
        <polyline
          points="0,4 8,0 16,8 24,0 32,8 40,0 48,8 56,0 64,8 72,0 80,4"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}
