import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'SHOP', href: '#shop' },
    { label: 'DROPS', href: '#drops' },
    { label: 'ABOUT', href: '#about' },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 flex items-center justify-between transition-all duration-200 ${
          scrolled ? 'bg-punk-black/95 backdrop-blur-sm border-b-3 border-punk-pink' : 'bg-transparent'
        }`}
        style={{ borderWidth: scrolled ? '0 0 3px 0' : '0' }}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Logo */}
        <motion.a
          href="#"
          className="font-display text-2xl md:text-3xl tracking-wider text-punk-white no-underline"
          data-cursor="link"
          whileHover={{ scale: 1.05 }}
        >
          RETRO<span className="text-punk-pink">PUNK</span>
        </motion.a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="font-display text-sm tracking-[0.2em] text-punk-white/70 hover:text-punk-pink transition-colors no-underline"
              data-cursor="link"
              whileHover={{ y: -2 }}
            >
              {link.label}
            </motion.a>
          ))}
          <motion.a
            href="#shop"
            className="comic-btn text-sm py-2 px-5 no-underline"
            data-cursor="button"
            whileHover={{
              backgroundColor: '#ffd600',
              color: '#0a0a0a',
              transition: { duration: 0.05 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">SHOP NOW</span>
          </motion.a>
        </div>

        {/* Mobile menu button */}
        <motion.button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          data-cursor="button"
          whileTap={{ scale: 0.9 }}
        >
          <motion.span
            className="w-6 h-0.5 bg-punk-white block"
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="w-6 h-0.5 bg-punk-pink block"
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          />
          <motion.span
            className="w-6 h-0.5 bg-punk-white block"
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
          />
        </motion.button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-punk-black flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {links.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="font-display text-4xl tracking-wider text-punk-white no-underline"
                data-cursor="link"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setMenuOpen(false)}
                whileHover={{ color: '#ff2d6b' }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#shop"
              className="comic-btn mt-4 no-underline"
              data-cursor="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setMenuOpen(false)}
            >
              <span className="relative z-10">SHOP NOW</span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
