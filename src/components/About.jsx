import { motion } from 'framer-motion';
import ComicPanel from './ComicPanel';
import Onomatopoeia from './Onomatopoeia';
import SpeechBubble from './SpeechBubble';

export default function About() {
  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden" data-cursor="default">
      {/* Ink splatter decoration */}
      <div className="absolute top-10 left-[5%] w-40 h-40 pointer-events-none opacity-10">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="30" fill="#ff2d6b" />
          <circle cx="30" cy="35" r="12" fill="#ff2d6b" />
          <circle cx="70" cy="40" r="8" fill="#ff2d6b" />
          <circle cx="45" cy="70" r="10" fill="#ff2d6b" />
          <circle cx="65" cy="65" r="6" fill="#ff2d6b" />
          <ellipse cx="50" cy="50" rx="40" ry="25" fill="#ff2d6b" opacity="0.3" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Left column - manifesto */}
          <div className="lg:col-span-3">
            <Onomatopoeia text="CRASH!" className="text-3xl md:text-5xl mb-6 inline-block" />

            <ComicPanel className="p-6 md:p-10 bg-punk-black" delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide text-punk-white leading-[0.9] mb-6">
                WE DON'T DO<br />
                <span className="text-punk-pink">NICE.</span>
              </h2>
              <div className="space-y-4 text-punk-white/70 text-base md:text-lg leading-relaxed max-w-lg">
                <p>
                  RETRO PUNK was born in a basement in 2019. Three designers tired of safe
                  collections and predictable colorways. We make clothes that look like they
                  were ripped from a manga panel and spray-painted on a subway car.
                </p>
                <p>
                  Every piece is designed to be loud. To take up space. To make people look twice.
                  We don't do subtle. We don't do quiet. And we definitely don't do boring.
                </p>
              </div>
            </ComicPanel>
          </div>

          {/* Right column - stats/values */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ComicPanel className="p-6 bg-punk-pink" delay={0.3}>
              <SpeechBubble variant="white" className="text-xs px-3 py-1 mb-3">
                OUR RULES
              </SpeechBubble>
              <ul className="space-y-3">
                {[
                  'NO boring basics',
                  'NO fast-fashion BS',
                  'YES to hand-drawn art',
                  'YES to limited runs',
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    className="font-display text-lg md:text-xl tracking-wider text-punk-black flex items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <span className="w-3 h-3 bg-punk-black shrink-0" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </ComicPanel>

            <ComicPanel className="p-6 bg-punk-yellow" delay={0.5}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-4 border-punk-black flex items-center justify-center shrink-0">
                  <span className="font-display text-3xl text-punk-black">50</span>
                </div>
                <div>
                  <p className="font-display text-xl tracking-wider text-punk-black">
                    PIECES PER DROP
                  </p>
                  <p className="text-punk-black/60 text-sm">
                    Scarcity is the point.
                  </p>
                </div>
              </div>
            </ComicPanel>
          </div>
        </div>
      </div>
    </section>
  );
}
