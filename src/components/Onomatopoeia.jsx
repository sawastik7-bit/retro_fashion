import { motion } from 'framer-motion';

export default function Onomatopoeia({ text, className = '', style = {}, delay = 0 }) {
  return (
    <motion.span
      className={`onomatopoeia text-3xl md:text-5xl lg:text-6xl inline-block ${className}`}
      style={style}
      initial={{ scale: 0, rotate: -15 }}
      whileInView={{ scale: 1, rotate: Math.random() * 10 - 5 }}
      viewport={{ once: true }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 12,
        delay,
      }}
    >
      {text}
    </motion.span>
  );
}
