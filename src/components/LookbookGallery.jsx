import { motion } from 'framer-motion';
import Onomatopoeia from './Onomatopoeia';
import ComicPanel from './ComicPanel';

const GALLERY = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=600&h=750&fit=crop',
    span: 'col-span-1 row-span-2',
    label: 'STREET',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop',
    span: 'col-span-1 row-span-1',
    label: 'MOTION',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=400&fit=crop',
    span: 'col-span-1 row-span-1',
    label: 'ATTITUDE',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=750&fit=crop',
    span: 'col-span-1 row-span-2',
    label: 'NOISE',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=400&fit=crop',
    span: 'col-span-1 row-span-1',
    label: 'GRIT',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=400&fit=crop',
    span: 'col-span-1 row-span-1',
    label: 'EDGE',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop',
    span: 'col-span-1 row-span-1',
    label: 'VIBE',
  },
];

export default function LookbookGallery() {
  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden" data-cursor="default">
      <div className="absolute inset-0 halftone-yellow opacity-5" />

      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16 relative">
          <Onomatopoeia text="ZAP!" className="text-3xl md:text-5xl mb-4 inline-block" />
          <ComicPanel className="inline-block p-4 md:p-6 bg-punk-black ml-4" delay={0.2}>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wide text-punk-white">
              LOOKBOOK
            </h2>
          </ComicPanel>
          <p className="mt-4 text-punk-white/50 text-lg max-w-md">
            The vibe. The energy. The people who wear it.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {GALLERY.map((item, i) => (
            <motion.div
              key={item.id}
              className={`${item.span} relative group overflow-hidden comic-panel-wobble`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              data-cursor="product"
            >
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-punk-pink/20 to-transparent mix-blend-multiply pointer-events-none" />
              <div className="absolute inset-0 halftone-overlay opacity-0 group-hover:opacity-50 transition-opacity duration-200 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-punk-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="font-display text-lg md:text-xl tracking-wider text-punk-white">
                  {item.label}
                </span>
              </div>
              <div className="absolute top-2 right-2 jagged-bubble bg-punk-yellow text-punk-black text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
