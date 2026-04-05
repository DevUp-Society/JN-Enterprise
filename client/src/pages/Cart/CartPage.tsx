import { useState } from 'react';
import { 
  Trash2, 
  Minus, 
  Plus as PlusIcon, 
  ShoppingCart, 
  ArrowRight, 
  BadgeCent,
  Check,
  RotateCcw,
  X,
  CreditCard,
  MapPin,
  ClipboardCheck,
  AlertTriangle,
  MoveLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { IndustrialEmptyState } from '../../components/premium/IndustrialEmptyState';

export default function CartPage() {
  const { cart, carts, activeCartId, setActiveCartId, createCart, deleteCart, removeItem, updateQuantity, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentDone, setPaymentDone] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  
  const [addressData, setAddressData] = useState({
    manager: '',
    hubId: '',
    street: '',
    phone1: '',
    phone2: ''
  });
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const logistics = subtotal * 0.05;
  const total = subtotal + logistics;

  const handleAction = () => {
    if (!isCheckingOut) {
       setIsCheckingOut(true);
    } else {
       if (step < 3) {
          setStep((s) => (s + 1) as 1 | 2 | 3);
       } else {
          setPaymentDone(true);
       }
    }
  };

  const currentDeletingCart = carts.find(c => c.id === showDeleteModal);

  const handleConfirmDelete = () => {
    if (showDeleteModal) {
      deleteCart(showDeleteModal);
      setShowDeleteModal(null);
    }
  };

  const steps = [
    { id: 1, name: 'Review', icon: <ClipboardCheck size={20} /> },
    { id: 2, name: 'Address', icon: <MapPin size={20} /> },
    { id: 3, name: 'Payment', icon: <CreditCard size={20} /> }
  ];

  const isEmpty = cart.length === 0;

  if (paymentDone) {
     return (
         <div className="bg-white min-h-screen flex items-center justify-center p-4 md:p-8 font-sans">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-[#D6D6D6]/40 p-8 md:p-20 rounded-[32px] md:rounded-[80px] border border-black/5 shadow-2xl text-center space-y-8 md:space-y-12 max-w-xl w-full"
            >
              <div className="w-40 h-40 bg-[#000000] text-[#D6D6D6] rounded-full flex items-center justify-center mx-auto shadow-2xl">
                 <Check size={80} strokeWidth={3} />
              </div>
               <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-black text-black tracking-tighter uppercase leading-none">ORDER PLACED</h2>
                  <p className="text-[12px] md:text-[14px] font-bold text-black/50 uppercase tracking-widest max-w-xs mx-auto">Authorization success. The requisition has been added to Active Orders.</p>
               </div>
               <div className="flex flex-col gap-4 mt-8 md:mt-12">
                  <button onClick={() => { clearCart(); setIsCheckingOut(false); setStep(1); setPaymentDone(false); navigate('/orders'); }} className="w-full py-6 md:py-8 bg-black text-[#D6D6D6] rounded-[20px] md:rounded-[32px] font-black uppercase text-[10px] md:text-[12px] tracking-widest md:tracking-[0.4em] hover:bg-black/80 transition-all shadow-xl active:scale-95">
                     CONTINUE TO ORDERS
                  </button>
               </div>
            </motion.div>
         </div>
     )
  }

  return (
    <div className={`bg-white min-h-screen font-sans selection:bg-black selection:text-white`}>
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-32 md:pb-40 space-y-8 md:space-y-10">
        
        {/* Simplified Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-black/10 pb-4 md:pb-6 gap-6">
            <div className="flex flex-col gap-2 md:gap-4 w-full md:w-auto">
               {!isCheckingOut && (
                  <Link to="/home" className="flex items-center gap-2 text-[10px] font-black text-black/40 uppercase tracking-[0.2em] hover:text-black transition-all group w-fit">
                     <MoveLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO SHOP
                  </Link>
               )}
               <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight uppercase">
                   {isCheckingOut ? 'Checkout' : 'Cart'}
               </h1>
            </div>
            
            {!isCheckingOut && (
               <div className="flex items-center gap-2 md:gap-4 p-2 bg-[#D6D6D6]/40 rounded-[20px] border border-black/5 w-full md:w-auto overflow-x-auto scrollbar-hide">
                  {carts.map(c => (
                     <button 
                       key={c.id} 
                       onClick={() => setActiveCartId(c.id)} 
                       className={`group relative shrink-0 px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeCartId === c.id ? 'bg-black text-[#D6D6D6] shadow-sm' : 'text-black/40 hover:bg-white hover:text-black'}`}
                     >
                        {c.name}
                        {carts.length > 1 && (
                           <div 
                             onClick={(e) => { e.stopPropagation(); setShowDeleteModal(c.id); }}
                             className="absolute -top-1 -right-1 p-1 bg-white rounded-full border border-black/10 opacity-0 group-hover:opacity-100 transition-all text-red-500 shadow-sm"
                           >
                              <X size={8} strokeWidth={4} />
                           </div>
                        )}
                     </button>
                  ))}
                  
                  {carts.length < 3 && (
                    <button 
                       onClick={() => createCart('')} 
                       className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-lg border-2 border-dashed border-black/20 flex items-center justify-center text-black/40 hover:border-black hover:text-black transition-all"
                    >
                       <PlusIcon size={14} />
                    </button>
                  )}
               </div>
            )}
        </div>

        {/* Action Steps for Checkout */}
        {isCheckingOut && (
           <div className="flex items-start gap-4 sm:gap-8 md:gap-12 pb-4 overflow-x-auto scrollbar-hide w-full">
              {steps.map((s) => (
                 <div key={s.id} className="flex flex-col gap-2 shrink-0">
                    <div className="flex items-center gap-3 md:gap-4">
                       <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-all ${step === s.id ? 'bg-black text-[#D6D6D6] shadow-md' : 'bg-[#D6D6D6]/40 text-black/20'}`}>
                          {s.icon}
                       </div>
                       <div className="flex flex-col -space-y-0.5 md:-space-y-1">
                          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-black/30">Phase {s.id}</span>
                          <span className={`text-[10px] md:text-[12px] font-black uppercase tracking-tight ${step === s.id ? 'text-black' : 'text-black/30'}`}>{s.name}</span>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        )}

        <div className="space-y-8 md:space-y-12">
           <AnimatePresence mode="wait">
              {(!isCheckingOut || step === 1) && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 md:space-y-10">
                    {!isEmpty ? (
                        <div className="bg-[#D6D6D6]/30 rounded-[16px] md:rounded-[32px] border border-black/5 shadow-sm overflow-hidden p-4 sm:p-6 md:p-10">
                           <div className="space-y-0 text-left">
                              {cart.map((item) => (
                                 <div key={item.cartItemId} className="py-6 border-b border-black/5 last:border-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6 group">
                                    <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto flex-1 min-w-0">
                                       <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-black/5 shrink-0 bg-white">
                                          <img src={item.image} className="w-full h-full object-cover" />
                                       </div>
                                       <div className="space-y-0.5 md:space-y-1 min-w-0">
                                          <p className="text-[14px] md:text-[18px] font-black text-black uppercase tracking-tighter truncate">{item.name}</p>
                                          <p className="text-[9px] md:text-[10px] font-black text-black/40 uppercase tracking-[0.2em] truncate">{item.sku} • {item.size}</p>
                                          <p className="text-[11px] md:text-[12px] font-bold text-black/60 uppercase tracking-tight pt-0.5 md:pt-1">
                                             ₹{item.price.toLocaleString()} × {item.quantity} = <span className="text-black font-black">₹{(item.price * item.quantity).toLocaleString()}</span>
                                          </p>
                                       </div>
                                    </div>

                                    {!isCheckingOut && (
                                       <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                                          <div className="flex items-center gap-2 md:gap-3 bg-white p-1.5 rounded-[8px] md:rounded-xl shadow-sm border border-black/5">
                                             <button onClick={() => updateQuantity(item.cartItemId, -1)} className="w-6 h-6 md:w-8 md:h-8 rounded-[4px] md:rounded-lg bg-[#D6D6D6]/40 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all active:scale-95"><Minus size={10} /></button>
                                             <span className="text-[13px] md:text-[15px] font-black text-black w-5 md:w-6 text-center">{item.quantity}</span>
                                             <button onClick={() => updateQuantity(item.cartItemId, 1)} className="w-6 h-6 md:w-8 md:h-8 rounded-[4px] md:rounded-lg bg-[#D6D6D6]/40 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all active:scale-95"><PlusIcon size={10} /></button>
                                          </div>
                                          <button onClick={() => removeItem(item.cartItemId)} className="p-2 md:p-3 text-red-500/40 hover:text-red-500 hover:bg-red-50 transition-all rounded-[8px] md:rounded-xl"><Trash2 size={16} /></button>
                                       </div>
                                    )}
                                 </div>
                              ))}
                           </div>
                        </div>
                       ) : (
                          <IndustrialEmptyState 
                            icon={ShoppingCart}
                            title="Cart Registry Empty"
                            message="Your industrial requisition node is currently unpopulated. Explore the catalog to select units."
                            actionText="Browse Units"
                            primaryActionPath="/home"
                          />
                       )}
                 </motion.div>
              )}

              {isCheckingOut && step === 2 && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                    <div className="bg-white p-12 rounded-[48px] border border-[#000000]/5 shadow-sm space-y-12 text-left">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-[#000000]/40 uppercase tracking-[0.2em] px-2 flex items-center gap-2">AUTHORIZED MANAGER</label>
                             <input type="text" value={addressData.manager} onChange={(e) => setAddressData({...addressData, manager: e.target.value})} placeholder="FULL NAME" className="w-full bg-[#D6D6D6]/10 p-6 rounded-2xl outline-none font-bold text-[#000000] uppercase text-[12px] tracking-widest border border-transparent focus:border-[#000000] transition-all" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-[#000000]/40 uppercase tracking-[0.2em] px-2 flex items-center gap-2">HUB IDENTIFIER</label>
                             <input type="text" value={addressData.hubId} onChange={(e) => setAddressData({...addressData, hubId: e.target.value})} placeholder="WAREHOUSE / HUB ID" className="w-full bg-[#D6D6D6]/10 p-6 rounded-2xl outline-none font-bold text-[#000000] uppercase text-[12px] tracking-widest border border-transparent focus:border-[#000000] transition-all" />
                          </div>
                          <div className="space-y-3 md:col-span-2">
                             <label className="text-[10px] font-black text-[#000000]/40 uppercase tracking-[0.2em] px-2 flex items-center gap-2">LOGISTICS ADDRESS</label>
                             <input type="text" value={addressData.street} onChange={(e) => setAddressData({...addressData, street: e.target.value})} placeholder="STREET, AREA, FACILITY NO." className="w-full bg-[#D6D6D6]/10 p-6 rounded-2xl outline-none font-bold text-[#000000] uppercase text-[12px] tracking-widest border border-transparent focus:border-[#000000] transition-all" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-[#000000]/40 uppercase tracking-[0.2em] px-2 flex items-center gap-2">PRIMARY CONTACT</label>
                             <input type="tel" value={addressData.phone1} onChange={(e) => setAddressData({...addressData, phone1: e.target.value})} placeholder="+91 XXXX" className="w-full bg-[#D6D6D6]/10 p-6 rounded-2xl outline-none font-bold text-[#000000] uppercase text-[12px] tracking-widest border border-transparent focus:border-[#000000] transition-all" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-[#000000]/40 uppercase tracking-[0.2em] px-2 flex items-center gap-2">SECONDARY CONTACT</label>
                             <input type="tel" value={addressData.phone2} onChange={(e) => setAddressData({...addressData, phone2: e.target.value})} placeholder="+91 XXXX" className="w-full bg-[#D6D6D6]/10 p-6 rounded-2xl outline-none font-bold text-[#000000] uppercase text-[12px] tracking-widest border border-transparent focus:border-[#000000] transition-all" />
                          </div>
                       </div>
                    </div>
                 </motion.div>
              )}

              {isCheckingOut && step === 3 && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                    <div className="bg-white p-12 rounded-[48px] border border-[#000000]/5 shadow-sm space-y-10 text-left">
                       <div className="p-10 bg-[#000000] text-[#D6D6D6] rounded-[32px] flex items-center justify-between shadow-xl cursor-pointer">
                          <div className="flex items-center gap-8">
                             <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/5"><BadgeCent size={24} /></div>
                             <div className="space-y-0.5">
                                <p className="text-[16px] font-black uppercase tracking-widest">ENTERPRISE CREDIT</p>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">NET-45 PROTOCOL</p>
                             </div>
                          </div>
                          <div className="bg-[#D6D6D6] p-3 rounded-full text-[#000000]"><Check size={18} strokeWidth={4} /></div>
                       </div>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>

           {isCheckingOut && (
               <div className="flex flex-col sm:flex-row items-center justify-between gap-6 md:gap-8 pt-8 md:pt-10 border-t border-black/10">
                   <button onClick={() => { setIsCheckingOut(false); setStep(1); }} className="px-6 md:px-8 py-3 md:py-4 text-[10px] font-black text-black/40 uppercase tracking-widest hover:text-black transition-all flex items-center gap-2 border border-black/10 rounded-[8px] sm:border-none sm:rounded-none w-full sm:w-auto justify-center bg-[#D6D6D6]/30 sm:bg-transparent">
                      <RotateCcw size={14} /> CANCEL
                   </button>
                   
                   <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 bg-[#D6D6D6]/30 sm:bg-transparent p-4 sm:p-0 rounded-[16px] sm:rounded-none border border-black/5 sm:border-none w-full sm:w-auto">
                      <div className="px-2 sm:px-6 flex justify-between sm:block opacity-80 sm:opacity-100 items-center">
                         <p className="text-[9px] font-black text-black/50 uppercase tracking-[0.2em]">TOTAL</p>
                         <p className="text-[20px] md:text-[24px] font-black text-black">₹{total.toLocaleString()}</p>
                      </div>
                      <button 
                         onClick={handleAction} 
                         className="flex-1 sm:flex-none px-6 md:px-10 py-4 bg-black text-white rounded-[12px] font-black uppercase text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.3em] hover:bg-black/80 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-md"
                      >
                         NEXT PHASE <ArrowRight size={16} />
                      </button>
                   </div>
               </div>
            )}
        </div>

        {/* Custom Deleting CART Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-[#000000]/20 backdrop-blur-sm"
                 onClick={() => setShowDeleteModal(null)}
               />
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.9, opacity: 0, y: 20 }}
                 className="relative bg-white p-12 rounded-[56px] border border-[#000000]/10 shadow-2xl text-center max-w-md w-full space-y-8"
               >
                  <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
                     <AlertTriangle size={36} />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-2xl font-black text-[#000000] uppercase tracking-tighter leading-none">Deleting {currentDeletingCart?.name || 'Cart'}</h3>
                     <p className="text-[13px] font-medium text-[#000000]/60 leading-relaxed uppercase">Permanently remove this registry?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <button 
                       onClick={() => setShowDeleteModal(null)}
                       className="py-5 rounded-2xl text-[10px] font-black text-[#000000]/40 uppercase tracking-widest hover:bg-[#D6D6D6]/20 transition-all border border-[#000000]/5"
                     >
                        CANCEL
                     </button>
                     <button 
                       onClick={handleConfirmDelete}
                       className="py-5 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg"
                     >
                        DELETE
                     </button>
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
