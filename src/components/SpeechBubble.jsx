import { motion } from 'framer-motion';

export default function SpeechBubble({ children, variant = 'yellow', className = '' }) {
  const colors = {
    yellow: 'bg-punk-yellow text-punk-black',
    pink: 'bg-punk-pink text-punk-white',
    white: 'bg-punk-white text-punk-black',
  };

  return (
    <motion.div
      className={`jagged-bubble ${colors[variant] || colors.yellow} ${className}`}
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      {children}
    </motion.div>
  );
}
