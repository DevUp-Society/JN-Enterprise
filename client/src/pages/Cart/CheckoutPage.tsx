import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  MapPin,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../../store/CartContext';
import { RetailerPortalHeader } from '../../components/navigation/RetailerPortalHeader';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    warehouse: '',
    taxId: ''
  });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isFormValid = formData.businessName && isEmailValid && formData.warehouse;

  const handlePlaceOrder = () => {
    if (!isFormValid) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      clearCart();
      navigate('/checkout/success');
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-bone flex flex-col items-center justify-center space-y-8 p-12">
        <h2 className="font-sans text-4xl font-black uppercase tracking-tighter">Registry Inactive_</h2>
        <Link to="/shop" className="px-10 py-5 bg-primary text-white text-[11px] font-black uppercase tracking-widest hover:bg-gold transition-all">
           RETURN TO CATALOG
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D6D6D6] text-[#FFFFFF] font-sans selection:bg-[#000000] selection:text-[#D6D6D6] pb-40">
      <RetailerPortalHeader />
      
      <main className="max-w-[1500px] mx-auto px-12 py-32">
        <div className="mb-16 flex items-center justify-between border-b border-primary/10 pb-8">
           <div className="flex items-center gap-6">
              <Link to="/cart" className="p-4 bg-white border border-primary/5 hover:bg-primary hover:text-white transition-all">
                <ArrowLeft size={18} />
              </Link>
              <div className="space-y-1">
                 <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">COMMIT REGISTRY_</h1>
                 <p className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.4em]">Node: {Math.random().toString(36).substring(7).toUpperCase()}</p>
              </div>
           </div>
           <div className="flex items-center gap-4 px-6 py-3 bg-white border border-primary/10">
              <Lock size={14} className="text-gold" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Tier 1 Secured Terminal</span>
           </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-24 items-start">
           <section className="space-y-12">
              <div className="space-y-8">
                 <div className="flex items-center gap-4 pb-4 border-b border-primary/10">
                    <MapPin size={20} className="text-gold" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary">SHIPPING DESTINATION_</h3>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Business Identity</label>
                    <input 
                      type="text" 
                      placeholder="ENTER LEGAL ENTITY..." 
                      className="w-full h-16 bg-bone border border-primary/5 px-8 text-[11px] font-black tracking-widest uppercase focus:border-primary transition-all"
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Enterprise Email</label>
                    <input 
                      type="email" 
                      placeholder="procurement@entity.com" 
                      className={`w-full h-16 bg-bone border ${formData.email && !isEmailValid ? 'border-black' : 'border-primary/5'} px-8 text-[11px] font-black tracking-widest uppercase focus:border-primary transition-all`}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Warehouse Distribution Node</label>
                  <input 
                    type="text" 
                    placeholder="ENTER FULL LOGISTICS ADDRESS..." 
                    className="w-full h-16 bg-bone border border-primary/5 px-8 text-[11px] font-black tracking-widest uppercase focus:border-primary transition-all"
                    value={formData.warehouse}
                    onChange={(e) => setFormData({...formData, warehouse: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Industrial Tax Reference (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="T-X-900-ARC" 
                    className="w-full h-16 bg-bone border border-primary/5 px-8 text-[11px] font-black tracking-widest uppercase focus:border-primary transition-all"
                    value={formData.taxId}
                    onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                  />
                </div>
              </div>

              <div className="p-8 bg-gold/5 border border-gold/10 flex items-center gap-6">
                 <div className="w-12 h-12 bg-gold flex items-center justify-center text-white shrink-0"><Truck size={24} /></div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gold text-primary">BULK FREIGHT LOGISTICS</p>
                    <p className="text-[12px] font-black text-primary/40 uppercase">Containerized shipment from Shenzhen hub currently active for this volume.</p>
                 </div>
              </div>
           </section>

           <aside className="sticky top-40 space-y-12">
              <div className="bg-white border border-primary/5 p-12 shadow-sm space-y-12">
                 <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary border-b border-primary/5 pb-4">ORDER REGISTRY SUMMARY_</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
                       {cart.map(item => (
                         <div key={item.sku} className="flex justify-between items-center py-4 border-b border-primary/5 last:border-0 opacity-60 hover:opacity-100 transition-opacity">
                            <div className="space-y-1">
                               <p className="text-[11px] font-black text-primary uppercase leading-none">{item.name}</p>
                               <p className="text-[8px] font-bold text-primary/30 uppercase tracking-widest">
                                  SKU: {item.sku} • {item.quantity} Units
                               </p>
                            </div>
                            <p className="text-[12px] font-black text-primary tracking-tighter">
                               ${(item.price * item.quantity).toLocaleString()}
                            </p>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6 pt-6 border-t-2 border-primary/10">
                    <div className="flex justify-between items-end">
                       <p className="text-[11px] font-black text-primary/30 uppercase tracking-[0.3em]">Aggregate Subtotal</p>
                       <p className="text-2xl font-black text-primary tracking-tighter">${totalPrice.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-end">
                       <p className="text-[11px] font-black text-primary/30 uppercase tracking-[0.3em]">Wholesale Discount</p>
                       <p className="text-xl font-black text-gold tracking-tighter">-15% Applied</p>
                    </div>
                    <div className="flex justify-between items-end">
                       <p className="text-[11px] font-black text-primary/30 uppercase tracking-[0.3em]">Freight Allocation</p>
                       <p className="text-[11px] font-black text-primary uppercase">TBD at dispatch</p>
                    </div>
                    <div className="pt-8 border-t border-primary/10 flex justify-between items-baseline">
                       <p className="text-[14px] font-black text-primary uppercase tracking-[0.4em]">Final Fulfilment Net</p>
                       <p className="text-6xl font-black text-primary tracking-tighter">${(totalPrice * 0.85).toLocaleString()}</p>
                    </div>
                 </div>

                 <button 
                   onClick={handlePlaceOrder}
                   disabled={loading || !isFormValid}
                   className={`w-full h-24 text-[12px] font-black uppercase tracking-widest-xl flex items-center justify-center gap-4 shadow-2xl transition-all ${
                     isFormValid && !loading 
                     ? 'bg-primary text-white hover:bg-gold' 
                     : 'bg-primary/20 text-primary/40 cursor-not-allowed'
                   }`}
                 >
                    {loading ? (
                      <div className="flex items-center gap-4">
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        SYNCING REGISTRY...
                      </div>
                    ) : (
                      <>PLACE BULK ORDER <ArrowRight size={20} /></>
                    )}
                 </button>

                 <div className="flex items-center justify-center gap-4 opacity-20">
                    <ShieldCheck size={16} />
                    <p className="text-[9px] font-black uppercase tracking-widest">ISO 9001 Data Encryption active</p>
                 </div>
              </div>
           </aside>
        </div>
      </main>
    </div>
  );
}










