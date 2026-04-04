import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, ArrowRight, Plus, ChevronDown, ShoppingCart } from 'lucide-react';
import { useCart } from '../../store/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function MiniCartDrawer() {
  const { cart, isMiniCartOpen, setIsMiniCartOpen, removeItem, totalPrice, carts, createCart, deleteCart, activeCartId, setActiveCartId } = useCart();
  const navigate = useNavigate();
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  const handleCheckout = () => {
    setIsMiniCartOpen(false);
    navigate('/cart');
  };

  const activeCart = carts.find(c => c.id === activeCartId) || carts[0];

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
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#D6D6D6] z-[110] shadow-2xl border-l border-[#000000]/10 flex flex-col font-sans"
          >
            <header className="p-10 pb-6 border-b border-[#000000]/5 flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-[#000000] text-[#D6D6D6] flex items-center justify-center font-black rounded-2xl shadow-xl">JN</div>
                <div>
                   <h3 className="text-[14px] font-black text-[#000000] uppercase tracking-tighter leading-none">Procurement Tray_</h3>
                   <p className="text-[9px] font-bold text-[#000000]/30 uppercase tracking-widest mt-1">Live Inventory Link</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMiniCartOpen(false)}
                className="w-10 h-10 border border-[#000000]/10 text-[#000000] hover:bg-[#000000] hover:text-[#D6D6D6] transition-all rounded-full flex items-center justify-center shadow-sm"
              >
                <X size={20} />
              </button>
            </header>

            {/* HIGH-FIDELITY CART SELECTOR TERMINAL */}
            <div className="px-10 py-6 border-b border-[#000000]/5 relative z-20">
               <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] font-bold text-[#000000]/30 uppercase tracking-[0.2em]">Procurement List</p>
                  <button onClick={() => createCart('')} className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-widest flex items-center gap-2 hover:bg-[#FFFFFF] hover:text-white px-3 py-1 rounded-full transition-all border border-transparent hover:border-[#FFFFFF]/10"><Plus size={12}/> NEW REGISTRY</button>
               </div>
               
               <button 
                 onClick={() => setShowCartDropdown(!showCartDropdown)}
                 className="w-full flex items-center justify-between p-5 bg-white rounded-[24px] border border-[#000000]/10 shadow-sm hover:border-[#000000]/30 transition-all hover:shadow-lg group"
               >
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-[#D6D6D6] text-[#000000] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShoppingCart size={18} />
                     </div>
                     <span className="text-[13px] font-black text-[#000000] uppercase tracking-tighter">{activeCart?.name || 'Cart'}</span>
                  </div>
                  <ChevronDown size={20} className={`text-[#000000]/30 transition-transform duration-300 ${showCartDropdown ? 'rotate-180' : ''}`} />
               </button>

               <AnimatePresence>
                  {showCartDropdown && (
                     <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-10 right-10 mt-2 bg-white rounded-[32px] shadow-2xl border border-[#000000]/5 p-3 space-y-1 overflow-hidden shadow-[#000000]/10"
                     >
                        {carts.map(c => (
                           <div 
                             key={c.id} 
                             onClick={() => { setActiveCartId(c.id); setShowCartDropdown(false); }}
                             className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${activeCartId === c.id ? 'bg-[#000000] text-[#D6D6D6]' : 'text-[#000000] hover:bg-[#D6D6D6]'}`}
                           >
                              <span className="text-[12px] font-black uppercase tracking-tighter">{c.name}</span>
                              {carts.length > 1 && (
                                <button onClick={(e) => { e.stopPropagation(); deleteCart(c.id); }} className={`p-1 rounded-full hover:bg-black/10 ${activeCartId === c.id ? 'text-white/30 hover:text-white' : 'text-[#000000]/10 hover:text-[#000000]'}`}>
                                   <X size={14} />
                                </button>
                              )}
                           </div>
                        ))}
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-6 scrollbar-hide bg-white/20">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-20 py-20 bg-white/10 rounded-[60px]">
                  <div className="w-24 h-24 bg-[#000000]/5 flex items-center justify-center rounded-full border border-[#000000]/5">
                     <ShoppingBag size={40} className="text-[#000000]" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-center max-w-xs">The procurement tray contains no active nodes.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartItemId} className="p-6 bg-white rounded-[12px] border border-black/[0.03] space-y-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all group overflow-hidden relative">
                    <div className="flex gap-4">
                      {/* Image Frame */}
                      <div className="w-20 h-20 bg-[#F7F7F7] rounded-[8px] border border-black/[0.02] shrink-0 overflow-hidden group-hover:scale-105 transition-all duration-700">
                        <img src={item.image} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all" alt={item.name} />
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div className="space-y-1">
                           <div className="flex justify-between items-start gap-2">
                              <p className="text-[12px] font-bold text-black uppercase tracking-tight leading-tight line-clamp-1">{item.name}</p>
                              <button 
                                onClick={() => removeItem(item.cartItemId)}
                                className="text-black/10 hover:text-red-500 transition-colors shrink-0"
                              >
                                <X size={14} />
                              </button>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="text-[8px] font-black text-white bg-black px-1.5 py-0.5 rounded shadow-sm tracking-widest uppercase">{item.size}</span>
                              <span className="text-[8px] font-bold text-black/30 uppercase tracking-[0.1em]">SKU: {item.sku?.split('-').pop() || '0000'}</span>
                           </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1">
                               <span className="text-[13px] font-black text-black">₹{item.price.toLocaleString()}</span>
                               <span className="text-[8px] font-bold text-black/20 uppercase">/UNIT</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-black/[0.03] px-2 py-0.5 rounded-full">
                               <span className="text-[9px] font-black text-black/40 uppercase tracking-widest">QTY: {item.quantity}</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <footer className="p-10 border-t border-[#000000]/5 bg-white space-y-8 rounded-t-[48px] shadow-[0_-20px_80px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-[#000000]/30 uppercase tracking-[.2em]">Remittance Registry</p>
                   <p className="text-4xl font-black text-[#000000] tracking-tighter leading-none">₹{totalPrice.toLocaleString()}</p>
                </div>
                <p className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-widest">Global Link Active</p>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full h-20 bg-[#000000] text-[#D6D6D6] text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-5 hover:bg-[#FFFFFF] transition-all shadow-2xl active:scale-95 disabled:grayscale disabled:opacity-30 disabled:cursor-not-allowed rounded-[32px]"
                >
                  REVIEW AUTHORIZATION <ArrowRight size={20} />
                </button>
                <button 
                  onClick={() => setIsMiniCartOpen(false)}
                  className="w-full h-16 bg-transparent border border-[#000000]/10 text-[#000000] text-[10px] font-black uppercase tracking-widest hover:bg-[#D6D6D6] transition-all rounded-[32px]"
                >
                  CONTINUE PROCUREMENT
                </button>
              </div>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}










