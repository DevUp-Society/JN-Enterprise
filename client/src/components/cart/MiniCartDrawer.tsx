import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../store/CartContext';
import { useNavigate } from 'react-router-dom';

export default function MiniCartDrawer() {
  const { cart, isMiniCartOpen, setIsMiniCartOpen, removeItem, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsMiniCartOpen(false);
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isMiniCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMiniCartOpen(false)}
            className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl border-l border-primary/5 flex flex-col"
          >
            <header className="p-8 border-b border-primary/5 flex justify-between items-center bg-bone">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary text-white flex items-center justify-center font-black">JN</div>
                <div>
                   <h3 className="text-[12px] font-black text-primary uppercase tracking-widest">PROCUREMENT TRAY_</h3>
                   <p className="text-[8px] font-bold text-primary/30 uppercase tracking-[0.2em]">Live Session: Active</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMiniCartOpen(false)}
                className="p-3 border border-primary/10 text-primary/20 hover:text-primary transition-all rounded-full"
              >
                <X size={20} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-20">
                  <ShoppingBag size={48} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-center">Your tray is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.sku} className="p-6 bg-bone border border-primary/5 space-y-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-24 bg-white border border-primary/5 shrink-0">
                        <img src={item.image} className="w-full h-full object-cover grayscale-[0.2]" alt={item.name} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-[11px] font-black text-primary uppercase tracking-tight leading-tight">{item.name}</p>
                        <p className="text-[8px] font-black text-primary/30 uppercase tracking-widest">SKU: {item.sku}</p>
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                          {Object.entries(item.sizeQuantities).map(([size, qty]) => (
                            <span key={size} className="text-[8px] font-bold bg-white px-2 py-1 border border-primary/5 text-primary/40 uppercase tracking-widest">
                              {size}: {qty}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.sku)}
                        className="text-primary/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <footer className="p-8 border-t border-primary/10 bg-white space-y-6">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">Estimated Value</p>
                <p className="text-3xl font-black text-primary tracking-tighter">${totalPrice.toLocaleString()}</p>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full h-16 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-gold transition-all shadow-xl active:scale-95 disabled:grayscale disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  REVIEW PROCUREMENT <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => setIsMiniCartOpen(false)}
                  className="w-full h-14 bg-white border border-primary/10 text-primary text-[9px] font-black uppercase tracking-widest hover:bg-bone transition-all"
                >
                  CONTINUE BROWSING
                </button>
              </div>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
