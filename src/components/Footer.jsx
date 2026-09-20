import { motion } from 'framer-motion';
import { ZigZag, CrossHair } from './ComicDecorations';

export default function Footer() {
  return (
    <footer className="relative border-t-4 border-punk-black bg-punk-black py-12 px-4" data-cursor="default">
      {/* Halftone strip at top */}
      <div className="absolute top-0 left-0 right-0 h-2 halftone-pink" />

      {/* Decorations */}
      <div className="section-decorations">
        <ZigZag className="absolute top-[20%] left-[3%] hidden lg:block" width={50} color="#ff2d6b" delay={0.3} />
        <CrossHair className="absolute top-[30%] right-[5%] hidden md:block" size={20} delay={0.5} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-3xl tracking-wider text-punk-white mb-3">
              RETRO<span className="text-punk-pink">PUNK</span>
            </h3>
            <p className="text-punk-white/40 text-sm max-w-xs">
              Brutalist streetwear for people who refuse to blend in.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg tracking-wider text-punk-pink mb-4">NAVIGATE</h4>
            <ul className="space-y-2">
              {['Shop All', 'New Drops', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <motion.a
                    href="#"
                    className="text-punk-white/60 hover:text-punk-white text-sm font-display tracking-wider transition-colors"
                    whileHover={{ x: 4 }}
                    data-cursor="link"
                  >
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-lg tracking-wider text-punk-pink mb-4">FOLLOW</h4>
            <ul className="space-y-2">
              {['Instagram', 'TikTok', 'Twitter/X', 'Discord'].map((link) => (
                <li key={link}>
                  <motion.a
                    href="#"
                    className="text-punk-white/60 hover:text-punk-white text-sm font-display tracking-wider transition-colors"
                    whileHover={{ x: 4 }}
                    data-cursor="link"
                  >
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t-2 border-punk-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-punk-white/30 text-xs font-display tracking-wider">
            &copy; 2026 RETROPUNK. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-punk-pink" />
            <span className="w-2 h-2 bg-punk-yellow" />
            <span className="w-2 h-2 bg-punk-white" />
          </div>
        </div>
      </div>
    </footer>
  );
}
