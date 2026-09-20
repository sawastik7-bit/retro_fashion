import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Onomatopoeia from './Onomatopoeia';
import SpeechBubble from './SpeechBubble';

gsap.registerPlugin(ScrollTrigger);

const LOOKBOOK = [
  {
    id: 1,
    title: 'RIOT HOODIE',
    subtitle: 'Heavy fleece. Hand-sprayed graphics.',
    price: '$89',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=1000&fit=crop&crop=top',
    accent: 'bg-punk-pink',
  },
  {
    id: 2,
    title: 'CHAOS CARGOS',
    subtitle: 'Six pockets. Ripstop nylon. Ready.',
    price: '$74',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop',
    accent: 'bg-punk-yellow',
  },
  {
    id: 3,
    title: 'ANARCHY BOMBER',
    subtitle: 'Military shell. Art on the back.',
    price: '$195',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop',
    accent: 'bg-punk-pink',
  },
  {
    id: 4,
    title: 'BLAST TEE',
    subtitle: '220gsm cotton. Oversized cut.',
    price: '$45',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop',
    accent: 'bg-punk-yellow',
  },
  {
    id: 5,
    title: 'REBEL JACKET',
    subtitle: 'Leather panels. Chain details.',
    price: '$128',
    image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&h=1000&fit=crop',
    accent: 'bg-punk-pink',
  },
  {
    id: 6,
    title: 'VENOM VEST',
    subtitle: 'Leather panels. Chain details. Unapologetic.',
    price: '$58',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop',
    accent: 'bg-punk-yellow',
  },
  {
    id: 7,
    title: 'REVOLT BOOTS',
    subtitle: 'Steel toe. Chunky sole. Loud.',
    price: '$165',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=1000&fit=crop',
    accent: 'bg-punk-pink',
  },
];

export default function HorizontalCarousel() {
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduce || !wrapperRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const totalScroll = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray('.carousel-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 40 + (i % 2) * 20, opacity: 0, rotate: i % 2 === 0 ? -2 : 2 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.6,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: card,
              containerAnimation: gsap.getById?.('carouselScroll'),
              start: 'left 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section className="relative" data-cursor="default">
      {/* Section header (visible before pin) */}
      <div className="px-4 pt-20 md:pt-32 pb-8 max-w-7xl mx-auto">
        <div className="relative">
          <Onomatopoeia text="WHAM!" className="text-3xl md:text-5xl mb-4 inline-block" />
          <SpeechBubble variant="yellow" className="inline-block text-xs px-4 py-1 mb-4 ml-3">
            LOOKBOOK
          </SpeechBubble>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wide text-punk-white mt-2">
            SCROLL THE <span className="text-punk-pink">COLLECTION</span>
          </h2>
          <p className="mt-3 text-punk-white/50 text-base md:text-lg max-w-md">
            Drag sideways or scroll down to explore every piece.
          </p>
        </div>
      </div>

      {/* Horizontal scroll wrapper */}
      <div ref={wrapperRef} className="relative overflow-hidden pt-16 md:pt-20">
        <div
          ref={trackRef}
          className="flex h-[70vh] md:h-[80vh] items-stretch gap-6 md:gap-10 px-4 md:px-12"
        >
          {LOOKBOOK.map((item, i) => (
            <div
              key={item.id}
              className="carousel-card relative shrink-0 w-[280px] md:w-[380px] lg:w-[440px] group"
              data-cursor="product"
            >
              {/* Card */}
              <div className="relative h-full comic-panel-wobble overflow-hidden bg-punk-gray">
                {/* Halftone overlay */}
                <div className="absolute inset-0 halftone-overlay opacity-0 group-hover:opacity-40 transition-opacity duration-200 z-20 pointer-events-none" />

                {/* Image */}
                <div className="comic-ink-effect h-[65%] overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-punk-black via-punk-black/20 to-transparent pointer-events-none" />

                  {/* Impact star on hover */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                    <svg viewBox="0 0 200 200" className="w-24 h-24">
                      <polygon
                        points="100,10 118,68 180,68 128,105 148,170 100,130 52,170 72,105 20,68 82,68"
                        fill="#ffd600"
                        opacity="0.5"
                      />
                    </svg>
                  </div>
                </div>

                {/* Info bar */}
                <div className="h-[35%] p-5 flex flex-col justify-between relative z-10">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display text-2xl md:text-3xl tracking-wider text-punk-white leading-tight">
                        {item.title}
                      </h3>
                      <span className="font-display text-xl md:text-2xl text-punk-pink tracking-wider">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-punk-white/50 text-sm">
                      {item.subtitle}
                    </p>
                  </div>

                  <motion.button
                    className={`self-start ${item.accent} text-punk-black font-display text-sm tracking-wider px-5 py-2 border-3 border-punk-black`}
                    style={{ borderWidth: '3px' }}
                    whileHover={{ scale: 1.05, boxShadow: '3px 3px 0 #0a0a0a' }}
                    whileTap={{ scale: 0.95 }}
                    data-cursor="button"
                  >
                    ADD TO CART
                  </motion.button>
                </div>

                {/* Corner accent */}
                <div className={`absolute top-0 right-0 w-16 h-16 ${item.accent} opacity-20`} style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
              </div>

              {/* Card number */}
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-punk-black border-3 border-punk-pink flex items-center justify-center z-30" style={{ borderWidth: '3px' }}>
                <span className="font-display text-lg text-punk-pink">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}

          {/* End spacer with CTA */}
          <div className="shrink-0 w-[280px] md:w-[380px] flex items-center justify-center">
            <div className="text-center">
              <Onomatopoeia text="GO!" className="text-5xl md:text-7xl mb-6 inline-block" />
              <br />
              <motion.button
                className="comic-btn mt-4"
                data-cursor="button"
                whileHover={{
                  backgroundColor: '#ffd600',
                  color: '#0a0a0a',
                  transition: { duration: 0.05 },
                }}
                whileTap={{ scale: 0.92 }}
              >
                <span className="relative z-10">SHOP ALL</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
