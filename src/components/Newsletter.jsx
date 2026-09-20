import { useState } from 'react';
import { motion } from 'framer-motion';
import ComicPanel from './ComicPanel';
import SpeechBubble from './SpeechBubble';
import { LightningBolt, SmokePuff, DiamondShape } from './ComicDecorations';

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden" data-cursor="default">
      <div className="absolute inset-0 halftone-yellow opacity-5" />

      {/* Decorations */}
      <div className="section-decorations">
        <LightningBolt className="absolute top-[10%] left-[5%] hidden md:block" size={40} delay={0.3} />
        <SmokePuff className="absolute bottom-[15%] right-[6%] hidden lg:block" size={50} delay={0.5} />
        <DiamondShape className="absolute top-[30%] right-[4%] hidden lg:block" size={16} delay={0.7} />
        <LightningBolt className="absolute bottom-[10%] left-[8%] hidden lg:block" size={32} color="#ff2d6b" delay={0.9} />
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SpeechBubble variant="yellow" className="inline-block text-sm px-6 py-2 mb-6">
            STAY CONNECTED
          </SpeechBubble>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
          <ComicPanel className="p-8 md:p-12 bg-punk-black" delay={0.2}>
            <h2 className="font-display text-3xl md:text-5xl tracking-wide text-punk-white mb-4">
              JOIN THE <span className="text-punk-pink">RIOT</span>
            </h2>
            <p className="text-punk-white/60 text-base md:text-lg mb-8 max-w-md mx-auto">
              First access to drops. Exclusive colorways. Behind-the-scenes chaos. No spam, just noise.
            </p>

            {submitted ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <span className="onomatopoeia text-4xl md:text-5xl text-punk-yellow block mb-4">DONE!</span>
                <p className="text-punk-white/70">You're in. Watch your inbox.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="YOUR EMAIL"
                  required
                  className="flex-1 bg-punk-gray border-3 border-punk-white/20 text-punk-white font-display text-lg tracking-wider px-5 py-3 placeholder:text-punk-white/30 focus:border-punk-pink focus:outline-none transition-colors"
                  style={{ borderWidth: '3px' }}
                />
                <motion.button
                  type="submit"
                  className="comic-btn whitespace-nowrap"
                  data-cursor="button"
                  whileHover={{
                    backgroundColor: '#ffd600',
                    color: '#0a0a0a',
                    transition: { duration: 0.05 },
                  }}
                  whileTap={{ scale: 0.92 }}
                >
                  <span className="relative z-10">SEND IT</span>
                </motion.button>
              </form>
            )}
          </ComicPanel>
        </motion.div>
      </div>
    </section>
  );
}
