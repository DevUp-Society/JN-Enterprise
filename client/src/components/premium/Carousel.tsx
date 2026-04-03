import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGES = [
  "https://images.unsplash.com/photo-1523381235212-d7b26c07217b?auto=format&fit=crop&q=80&w=800", // Minimalist Apparel
  "https://images.unsplash.com/photo-1594913785162-e6785b42fbb1?auto=format&fit=crop&q=80&w=800", // Textiles
  "https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?auto=format&fit=crop&q=80&w=800", // Minimalist Decor
];

export const Carousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-bone">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={IMAGES[index]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
          alt="Curated Lifestyle"
        />
      </AnimatePresence>
      <div className="absolute inset-0 border border-slate/10 pointer-events-none" />
    </div>
  );
};
