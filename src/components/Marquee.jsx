import { motion } from 'framer-motion';

export default function Marquee({ items = [], speed = 20, className = '' }) {
  const duplicated = [...items, ...items, ...items];

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} data-cursor="default">
      <motion.div
        className="inline-flex gap-8 md:gap-12"
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {duplicated.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-display text-3xl md:text-5xl lg:text-6xl tracking-wider text-punk-white/10 shrink-0 flex items-center gap-4 md:gap-6"
          >
            {item}
            <span className="w-3 h-3 bg-punk-pink/30 shrink-0 inline-block" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
