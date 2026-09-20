import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import ComicPanel from './ComicPanel';
import Onomatopoeia from './Onomatopoeia';
import { ComicStarburst, InkSplat, DiamondShape, CrossHair } from './ComicDecorations';

const PRODUCTS = [
  {
    id: 1,
    name: 'RIOT HOODIE',
    price: '89',
    badge: 'NEW DROP',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=800&fit=crop&crop=top',
  },
  {
    id: 2,
    name: 'CHAOS CARGOS',
    price: '74',
    badge: 'LIMITED',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
  },
  {
    id: 3,
    name: 'BLAST TEE',
    price: '45',
    badge: null,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
  },
  {
    id: 4,
    name: 'VENOM VEST',
    price: '58',
    badge: 'NEW DROP',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
  },
  {
    id: 5,
    name: 'REBEL JACKET',
    price: '128',
    badge: 'LIMITED',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
  },
  {
    id: 6,
    name: 'ANARCHY SLIDES',
    price: '52',
    badge: null,
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&h=800&fit=crop',
  },
];

export default function ProductGrid() {
  const [cartItems, setCartItems] = useState([]);
  const [showCartImpact, setShowCartImpact] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragToCart = useCallback((product) => {
    setCartItems((prev) => [...prev, product]);
    setShowCartImpact(true);
    setTimeout(() => setShowCartImpact(false), 600);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const productData = e.dataTransfer.getData('text/plain');
      const product = JSON.parse(productData);
      handleDragToCart(product);
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden" data-cursor="default">
      <div className="absolute inset-0 halftone-pink opacity-5" />

      <div className="section-decorations">
        <ComicStarburst className="absolute top-[8%] right-[5%] hidden md:block" size={50} color="#ffd600" delay={0.3} text="NEW" />
        <InkSplat className="absolute bottom-[12%] left-[3%] hidden lg:block" size={65} delay={0.5} />
        <DiamondShape className="absolute top-[25%] left-[5%] hidden lg:block" size={16} delay={0.7} />
        <CrossHair className="absolute bottom-[20%] right-[8%] hidden md:block" size={22} delay={0.9} />
        <DiamondShape className="absolute top-[40%] right-[3%] hidden lg:block" size={20} color="#ffd600" delay={1.1} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-16 relative">
          <Onomatopoeia text="BOOM!" className="absolute -top-4 -left-2 md:left-4 text-3xl md:text-5xl" />
          <ComicPanel className="inline-block p-4 md:p-6 bg-punk-black" delay={0.2}>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wide text-punk-white">
              THE DROP
            </h2>
          </ComicPanel>
          <p className="mt-4 text-punk-white/60 text-lg max-w-md">
            This season's freshest cuts. Limited quantities. When they're gone, they're gone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {PRODUCTS.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onDragToCart={handleDragToCart}
            />
          ))}
        </div>

        <motion.div
          className={`mt-12 cart-zone p-6 text-center relative ${isDragOver ? 'cart-zone-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={showCartImpact ? {
            scale: [1, 1.03, 1],
            borderColor: ['#ff2d6b', '#ffd600', '#ff2d6b'],
          } : {}}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="font-display text-xl tracking-wider text-punk-white/70">
              DRAG ITEMS HERE TO ADD TO CART
            </span>
            {cartItems.length > 0 && (
              <motion.div
                className="jagged-bubble bg-punk-yellow text-punk-black text-sm px-4 py-2"
                key={cartItems.length}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ type: 'spring', stiffness: 400, damping: 12 }}
              >
                {cartItems.length} ITEM{cartItems.length !== 1 ? 'S' : ''}
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {showCartImpact && (
              <motion.div
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: [0, 1, 0], scale: [0.3, 1.5, 2] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <svg viewBox="0 0 200 200" className="w-32 h-32">
                  <polygon
                    points="100,5 115,70 185,70 125,110 145,180 100,135 55,180 75,110 15,70 85,70"
                    fill="#ffd600"
                    opacity="0.6"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
