import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProductCard } from '../../components/premium/ProductCard';

// Sample data – in a real app this would come from an API
const categories = [
  {
    name: 'Hardware',
    products: [
      { id: '1', name: 'Industrial Zinc-Coated Wall Hooks', price: 2450, moq: 50, image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=400' },
      { id: '2', name: 'Heavy‑Duty Support Bracket', price: 4100, moq: 30, image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&q=80&w=400' },
      { id: '3', name: 'Precision Steel Bolt', price: 120, moq: 100, image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?auto=format&fit=crop&q=80&w=400' },
      { id: '4', name: 'Industrial Pipe Clamp', price: 560, moq: 20, image: 'https://images.unsplash.com/photo-1582966298431-99c6a1e8eb8a?auto=format&fit=crop&q=80&w=400' },
      { id: '5', name: 'Heavy‑Duty Chain', price: 980, moq: 10, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=400' },
    ],
  },
  {
    name: 'Textiles',
    products: [
      { id: '6', name: 'Cotton Blend Crew Socks', price: 1200, moq: 50, image: 'https://images.unsplash.com/photo-1582966298431-99c6a1e8eb8a?auto=format&fit=crop&q=80&w=400' },
      { id: '7', name: 'Technical Fabric Roll', price: 3750, moq: 20, image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=400' },
      { id: '8', name: 'Premium Wool Blanket', price: 8900, moq: 5, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400' },
      { id: '9', name: 'Silk Scarf', price: 2500, moq: 15, image: 'https://images.unsplash.com/photo-1558273109-60437a70127b?auto=format&fit=crop&q=80&w=400' },
      { id: '10', name: 'Eco‑Friendly Tote', price: 1800, moq: 30, image: 'https://images.unsplash.com/photo-1582966298431-99c6a1e8eb8a?auto=format&fit=crop&q=80&w=400' },
    ],
  },
  // Add more categories as needed
];

export default function CategoriesPage() {
  // State to keep track of scroll positions for each category (optional for arrow controls)
  const [scrollRefs, setScrollRefs] = useState<Record<string, HTMLDivElement | null>>({});

  const scroll = (category: string, direction: 'left' | 'right') => {
    const container = scrollRefs[category];
    if (container) {
      const scrollAmount = container.clientWidth * 0.8; // scroll by ~80% of visible width
      container.scrollBy({ left: direction === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#F6F4F2] min-h-screen py-12">
      <main className="max-w-[1400px] mx-auto px-8 space-y-8">
        {categories.map((cat) => (
          <section key={cat.name} className="space-y-4">
            {/* Category Header */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-[#425664]">{cat.name}</h2>
              <Link
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="flex items-center text-sm font-medium text-[#C6AD8F] hover:underline"
              >
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            <hr className="border-t border-[#425664]/10 mb-4" />
            <div className="relative">
              {/* Left Arrow */}
              <button
                onClick={() => scroll(cat.name, 'left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-white/70 rounded-full shadow-md hover:bg-white transition-colors"
                aria-label="Scroll left"
              >
                <ArrowLeft size={20} className="text-[#425664]" />
              </button>

              {/* Scrollable Row */}
              <div
                ref={(el) => setScrollRefs((prev) => ({ ...prev, [cat.name]: el }))}
                className="flex space-x-4 overflow-x-auto scrollbar-hide py-2 scroll-smooth snap-x snap-mandatory"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {cat.products.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-[260px] snap-start">
                      <ProductCard
                        product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          category: cat.name,
                          image: product.image,
                        }}
                      />
                  </div>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => scroll(cat.name, 'right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-white/70 rounded-full shadow-md hover:bg-white transition-colors"
                aria-label="Scroll right"
              >
                <ArrowRight size={20} className="text-[#425664]" />
              </button>

              {/* Fade indicators – subtle left/right gradient */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#F6F4F2] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#F6F4F2] to-transparent" />
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
