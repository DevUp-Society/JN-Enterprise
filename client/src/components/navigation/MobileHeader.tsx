import { ShoppingCart, Bell, Search, Package, X } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useCart } from '../../store/CartContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileHeader() {
  const { user } = useAuth();
  const { totalQty } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  return (
    <>
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-black/[0.05] z-[90] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link to="/home" className="flex items-center gap-2 group transition-transform active:scale-95">
            <div className="w-8 h-8 bg-black rounded-[8px] flex items-center justify-center text-[#D6D6D6] shadow-lg shadow-black/10">
              <Package size={16} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-black tracking-[0.25em] uppercase text-black">Enterprise</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 rounded-full hover:bg-black/5 transition-colors active:scale-90"
          >
            <Search size={18} strokeWidth={2} />
          </button>
          
          <Link to="/notifications" className="p-2.5 rounded-full hover:bg-black/5 transition-colors active:scale-90 relative">
            <Bell size={18} strokeWidth={2} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full border border-white" />
          </Link>

          {user.role === 'RETAILER' && (
            <Link to="/cart" className="p-2.5 rounded-full hover:bg-black/5 transition-colors active:scale-90 relative">
              <ShoppingCart size={18} strokeWidth={2} />
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {totalQty}
                </span>
              )}
            </Link>
          )}
        </div>
      </header>

      {/* Floating Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-[120] md:hidden px-6 pt-12"
          >
            <div className="flex items-center gap-4 border-b-2 border-black/5 pb-4">
              <Search size={20} className="text-black/40" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search Industrial Nodes..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-bold placeholder:text-black/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-8 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Recent Search Patterns</h4>
              <div className="flex flex-wrap gap-2">
                {['Titanium Alloy', 'Neural Links', 'Core Modules', 'Protocols'].map(tag => (
                  <button key={tag} className="px-4 py-2 bg-black/5 rounded-full text-xs font-bold text-black/60 hover:bg-black hover:text-white transition-all">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
