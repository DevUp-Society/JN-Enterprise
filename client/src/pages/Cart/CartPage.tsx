import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingCart, 
  ArrowRight, 
  FileText, 
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    { id: "1", name: "Industrial Zinc-Coated Wall Hooks", price: 2450, quantity: 100, moq: 50, image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=400" },
    { id: "3", name: "Cotton Blend Crew Socks", price: 1200, quantity: 50, moq: 50, image: "https://images.unsplash.com/photo-1582966298431-99c6a1e8eb8a?auto=format&fit=crop&q=80&w=400" }
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity / 50)), 0);
  const logistics = subtotal * 0.05;
  const total = subtotal + logistics;

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items => items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(item.moq, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="bg-[#F6F4F2] min-h-screen">
      <main className="max-w-[1400px] mx-auto px-8 pt-[120px] pb-32 space-y-12">
        
        {/* Cart Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-[#425664]/10 pb-8">
           <h1 className="text-3xl font-bold text-[#425664] tracking-tight lowercase pt-2 leading-tight">
              shopping cart
           </h1>
        </div>

        {cartItems.length > 0 ? (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              {/* Items List */}
              <div className="lg:col-span-8 space-y-6">
                 {cartItems.map((item) => (
                    <div key={item.id} className="bg-white p-8 rounded-[40px] border border-[#425664]/5 shadow-sm flex flex-col md:flex-row items-center gap-10 group hover:border-[#C6AD8F]/30 transition-all duration-500">
                       <div className="w-40 h-40 rounded-3xl overflow-hidden bg-[#F6F4F2] p-4 flex-shrink-0 group-hover:p-2 transition-all">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                       </div>
                       
                       <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 text-xs font-semibold text-[#C6AD8F] uppercase tracking-widest">
                             <span>Asset #B-{item.id}00-X</span>
                             <span className="w-1 h-1 rounded-full bg-[#C6AD8F]/30" />
                             <span>MOQ Verified</span>
                          </div>
                          <h3 className="text-xl font-bold text-[#425664] tracking-tight">{item.name}</h3>
                          <p className="text-base font-semibold text-[#425664]">₹{item.price.toLocaleString()} <span className="text-xs font-medium text-[#6B7280]">/ Base Batch</span></p>
                       </div>

                       <div className="flex flex-col items-center gap-4">
                          <div className="flex items-center gap-4 bg-[#F6F4F2] p-1.5 rounded-2xl border border-[#425664]/5">
                             <button onClick={() => updateQuantity(item.id, -50)} className="w-10 h-10 flex items-center justify-center text-[#425664] hover:bg-white rounded-xl transition-all"><Minus size={16} /></button>
                             <span className="text-[16px] font-bold text-[#111827] w-14 text-center">{item.quantity}</span>
                             <button onClick={() => updateQuantity(item.id, 50)} className="w-10 h-10 flex items-center justify-center text-[#425664] hover:bg-white rounded-xl transition-all"><Plus size={16} /></button>
                          </div>
                          <p className="text-[10px] font-black text-[#425664]/30 uppercase tracking-widest">Quantity (Units)</p>
                       </div>

                       <div className="text-right min-w-[120px]">
                          <p className="text-[24px] font-bold text-[#111827] tracking-tighter">₹{(item.price * (item.quantity / 50)).toLocaleString()}</p>
                          <button onClick={() => removeItem(item.id)} className="text-[#425664]/30 hover:text-red-500 transition-colors mt-2 p-2 rounded-full hover:bg-red-50">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4 space-y-8 sticky top-32">
                 <div className="bg-[#425664] text-white p-10 rounded-[60px] shadow-2xl shadow-[#425664]/20 space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
                    
                    <h2 className="text-2xl font-bold tracking-tight border-b border-white/10 pb-6">Finalized Summary_</h2>
                    
                    <div className="space-y-6">
                       <div className="flex justify-between items-center opacity-60">
                          <span className="text-[13px] font-semibold uppercase tracking-widest">Base Requisition</span>
                          <span className="text-[18px] font-bold">₹{subtotal.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center opacity-60">
                          <span className="text-[13px] font-semibold uppercase tracking-widest">Logistics Link</span>
                          <span className="text-[18px] font-bold">₹{logistics.toLocaleString()}</span>
                       </div>
                       <div className="pt-6 border-t border-white/10">
                          <div className="flex justify-between items-end">
                             <div className="space-y-1">
                                <span className="text-[11px] font-black text-[#C6AD8F] uppercase tracking-[0.2em]">Total Commercial Value</span>
                                <p className="text-5xl font-bold tracking-tighter">₹{total.toLocaleString()}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <Link to="/checkout" className="w-full bg-[#C6AD8F] text-white py-8 rounded-[40px] font-semibold uppercase text-sm tracking-widest hover:bg-[#B89672] transition-all flex items-center justify-center gap-4 group">
                       Proceed to Payment <Zap size={20} fill="white" className="group-hover:scale-125 transition-transform" />
                    </Link>
                    
                    <button className="w-full bg-white/5 border border-white/10 text-white/50 py-6 rounded-[32px] font-bold uppercase text-[11px] tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3">
                       <FileText size={16} /> Export Draft Invoice
                    </button>
                  </div>
               </div>
            </div>
         ) : (
           <div className="py-60 text-center space-y-10 bg-white border border-[#425664]/5 rounded-[60px] shadow-sm">
              <div className="w-40 h-40 rounded-full bg-[#F6F4F2] flex items-center justify-center mx-auto mb-4 border border-[#425664]/5">
                 <ShoppingCart size={80} className="text-[#425664]/10" />
              </div>
              <div className="space-y-4">
                 <h3 className="text-4xl font-bold tracking-tighter text-[#425664]/20 uppercase">Procurement Vault Empty_</h3>
                 <p className="text-[14px] font-medium text-[#6B7280] uppercase tracking-widest max-w-xs mx-auto leading-relaxed">No wholesale assets have been batched for the current commercial session.</p>
                 <div className="pt-8">
                    <Link to="/home" className="inline-flex items-center gap-3 text-[#C6AD8F] font-black uppercase text-[12px] tracking-widest hover:gap-5 transition-all">
                       Initialize Product Requisition <ArrowRight size={16} />
                    </Link>
                 </div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
}
