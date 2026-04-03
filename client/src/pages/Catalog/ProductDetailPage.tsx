import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Minus, 
  Plus, 
  ShoppingCart,
  Zap,
  Box,
  Factory,
  Heart,
  Bell,
  Star,
  MessageSquare,
  ShieldCheck,
  Truck
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(100);
  const [showSticky, setShowSticky] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('specs');

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const product = {
    id: id,
    name: "Industrial Zinc-Coated Wall Hooks",
    price: "₹2,450",
    unitPrice: "₹85",
    moq: "50 Units",
    stockStatus: "In Stock",
    tagline: "Heavy-duty architecture-grade zinc alloy hooks for industrial-grade vertical organization and facility management.",
    images: [
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&q=80&w=1200"
    ],
    bulkPricing: [
      { range: "50-100", price: "85", highlight: false },
      { range: "101-500", price: "72", highlight: true },
      { range: "500+", price: "64", highlight: false }
    ],
    specs: [
      { label: "Material", value: "Zinc-Coated Steel" },
      { label: "Weight Capacity", value: "25kg / hook" },
      { label: "Origin", value: "JN Manufacturing Hub" },
      { label: "Finish", value: "Matte Industrial Zinc" },
      { label: "Dimensions", value: "120mm x 45mm" },
      { label: "Compliance", value: "ISO 9001 Audited" }
    ],
    reviews: [
      { user: "Global Supply Corp", rating: 5, comment: "Exceptional build quality. The zinc coating is consistent across 5,000 units.", date: "2 days ago" },
      { user: "Metro Logistics", rating: 4, comment: "Reliable hooks for our warehouse facility. Quick fulfillment time.", date: "1 week ago" }
    ]
  };

  const isOutOfStock = product.stockStatus === 'Out of Stock';

  return (
    <div className="bg-[#F6F4F2] font-sans selection:bg-[#C6AD8F] selection:text-white">
      <main className="pb-40">
        {/* 1. Breadcrumbs */}
        <section className="pt-[110px] px-8 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-xs font-medium lowercase text-[#6B7280] py-8 border-b border-[#425664]/10 mb-12">
            <Link to="/" className="hover:text-[#111827]">home</Link>
            <ChevronRight size={14} />
            <Link to="/shop" className="hover:text-[#111827]">products</Link>
            <ChevronRight size={14} />
            <span className="text-[#C6AD8F]">#batch-{product.id}00-x</span>
          </div>
        </section>

        {/* 2. Primary Product View */}
        <section className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
           {/* Image Matrix */}
           <div className="space-y-8 sticky top-32">
              <motion.div 
                layoutId="main-product-img"
                className="aspect-square bg-white rounded-[40px] overflow-hidden border border-[#425664]/5 shadow-sm p-12 flex items-center justify-center"
              >
                 <img 
                   src={product.images[activeImage]} 
                   alt={product.name} 
                   className="w-full h-full object-contain" 
                 />
              </motion.div>
              <div className="flex gap-4 scrollbar-hide overflow-x-auto pb-2">
                 {product.images.map((img, idx) => (
                   <button 
                     key={idx}
                     onClick={() => setActiveImage(idx)}
                     className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all p-2 flex-shrink-0 bg-white ${activeImage === idx ? 'border-[#C6AD8F] shadow-lg' : 'border-transparent opacity-40 hover:opacity-100 hover:border-[#425664]/10'}`}
                   >
                     <img src={img} alt={`View ${idx}`} className="w-full h-full object-contain" />
                   </button>
                 ))}
              </div>
           </div>

           {/* Information Dashboard */}
           <div className="space-y-16">
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border ${isOutOfStock ? 'bg-red-50 text-red-500 border-red-100' : 'bg-white text-[#6B7280] border-[#425664]/10'}`}>
                       {product.stockStatus === 'In Stock' ? 'Operational_ Active Stock' : 'Out of Stock_ Depleted'}
                    </div>
                    <div className="flex items-center gap-3">
                       <button className="w-12 h-12 bg-white border border-[#425664]/10 rounded-2xl flex items-center justify-center text-[#425664]/40 hover:text-red-500 hover:border-red-100 transition-all shadow-sm group">
                          <Heart size={20} className="group-hover:fill-current" />
                       </button>
                       <button className="w-12 h-12 bg-white border border-[#425664]/10 rounded-2xl flex items-center justify-center text-[#425664]/40 hover:text-[#C6AD8F] hover:border-[#C6AD8F]/30 transition-all shadow-sm">
                          <Bell size={20} />
                       </button>
                    </div>
                 </div>
                 <h1 className="text-3xl font-bold text-[#425664] leading-tight tracking-tight">{product.name}</h1>
                 <p className="text-base text-[#6B7280] font-normal leading-relaxed max-w-xl">{product.tagline}</p>
                 <div className="flex items-center gap-4 pt-4">
                    <div className="flex text-[#C6AD8F]">
                       {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                    </div>
                    <span className="text-xs font-medium text-[#6B7280] uppercase tracking-widest">4.9 Matrix Rating based on 12 procurement cycles</span>
                 </div>
              </div>

              {/* Advanced Bulk Tiers */}
               <div className="bg-white rounded-[40px] p-10 border border-[#425664]/5 shadow-sm space-y-8">
                 <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-widest text-[#6B7280] border-b border-[#425664]/5 pb-6">
                    <span>Industrial Bulk Tiers</span>
                    <span>Procurement Price / Unit</span>
                 </div>
                 <div className="space-y-4">
                    {product.bulkPricing.map((tier, i) => (
                      <div key={i} className={`flex justify-between items-center px-8 py-6 rounded-3xl border transition-all cursor-pointer ${tier.highlight ? 'bg-[#111827] text-white border-[#111827] shadow-2xl scale-[1.02]' : 'bg-[#F6F4F2] border-[#425664]/5 text-[#425664]'}`}>
                         <span className="text-base font-medium uppercase tracking-wider">{tier.range} Units Bundle</span>
                         <span className="text-xl font-bold">₹{tier.price} <span className="text-xs font-normal text-[#6B7280]">/ Unit</span></span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Execution Stack */}
              <div className="space-y-8">
                 <div className="flex items-center gap-8 p-8 bg-white rounded-[40px] border border-[#425664]/5 shadow-sm">
                    <div className="flex items-center gap-6 bg-[#F6F4F2] p-2 rounded-2xl border border-[#425664]/5">
                       <button onClick={() => setQuantity(Math.max(50, quantity - 50))} className="w-12 h-12 flex items-center justify-center text-[#425664] hover:bg-white rounded-xl transition-all"><Minus size={20} /></button>
                       <span className="text-[20px] font-bold text-[#111827] w-20 text-center">{quantity}</span>
                       <button onClick={() => setQuantity(quantity + 50)} className="w-12 h-12 flex items-center justify-center text-[#425664] hover:bg-white rounded-xl transition-all"><Plus size={20} /></button>
                    </div>
                    <div className="flex-1">
                       <p className="text-[11px] font-black uppercase tracking-widest text-[#425664]/40 mb-1">Total Procurement Estimate_</p>
                       <p className="text-[32px] font-bold text-[#111827] tracking-tighter">₹{(quantity * 72).toLocaleString()}</p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <Link to="/checkout" className="flex-[2] bg-[#111827] text-white py-7 rounded-[32px] font-black uppercase text-[13px] tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-[#111827]/30 flex items-center justify-center gap-4 group">
                       <Zap size={20} fill="white" className="group-hover:scale-125 transition-transform" />
                       Proceed to Payment
                    </Link>
                    <button className="flex-1 bg-white border-2 border-[#111827] text-[#111827] py-7 rounded-[32px] font-black uppercase text-[12px] tracking-widest hover:bg-[#111827] hover:text-white transition-all">
                       Bulk RFQ
                    </button>
                 </div>
              </div>

              {/* Trust & Compliance Matrix */}
              <div className="grid grid-cols-3 gap-8 pt-16 border-t border-[#425664]/10">
                 {[
                    { label: "High-Volume Logistics", Icon: Truck },
                    { label: "ISO 9001 Certified", Icon: ShieldCheck },
                    { label: "Direct Forge Source", Icon: Factory }
                 ].map((stat, i) => (
                    <div key={i} className="text-center space-y-4">
                       <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-[#425664]/5 text-[#C6AD8F]">
                          <stat.Icon size={24} />
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-[#425664]/50 leading-tight">{stat.label}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 3. Advanced Tabs (Specs & Reviews) */}
        <section className="max-w-[1400px] mx-auto px-8 pt-40">
           <div className="bg-white rounded-[60px] border border-[#425664]/10 shadow-sm overflow-hidden">
              <div className="flex bg-[#F6F4F2] border-b border-[#425664]/5">
                 <button 
                   onClick={() => setActiveTab('specs')}
                   className={`px-12 py-8 text-base font-medium tracking-widest transition-all gap-3 flex items-center ${activeTab === 'specs' ? 'bg-white text-[#425664] border-t-4 border-[#425664]' : 'text-[#6B7280] hover:text-[#425664]'}`}
                 >
                    <Box size={18} /> Technical Blueprint
                 </button>
                 <button 
                   onClick={() => setActiveTab('reviews')}
                   className={`px-12 py-8 text-base font-medium tracking-widest transition-all gap-3 flex items-center ${activeTab === 'reviews' ? 'bg-white text-[#425664] border-t-4 border-[#425664]' : 'text-[#6B7280] hover:text-[#425664]'}`}
                 >
                    <MessageSquare size={18} /> Procurement Feedback
                 </button>
              </div>

              <div className="p-16">
                 {activeTab === 'specs' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                       {product.specs.map((spec, i) => (
                          <div key={i} className="space-y-3 pb-8 border-b border-[#425664]/5">
                             <p className="text-[11px] font-black uppercase tracking-widest text-[#C6AD8F]">{spec.label}</p>
                             <p className="text-[18px] font-semibold text-[#111827] tracking-tight">{spec.value}</p>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="space-y-12">
                       <div className="flex justify-between items-center mb-16">
                          <div className="space-y-2">
                             <h4 className="text-4xl font-semibold text-[#111827] tracking-tighter">Procurement Satisfaction_</h4>
                             <p className="text-[14px] text-[#425664]/40 font-semibold uppercase tracking-widest">Audited manufacturing feedback and reviews</p>
                          </div>
                          <button className="bg-[#111827] text-white px-8 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">
                             Submit Internal Audit
                          </button>
                       </div>

                       <div className="grid grid-cols-1 gap-12">
                          {product.reviews.map((rev, i) => (
                             <div key={i} className="p-10 bg-[#F6F4F2] rounded-[40px] border border-[#425664]/5 space-y-6">
                                <div className="flex justify-between items-start">
                                   <div className="space-y-1">
                                      <p className="text-[16px] font-bold text-[#111827]">{rev.user}</p>
                                      <div className="flex text-[#C6AD8F]">
                                         {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= rev.rating ? 'currentColor' : 'none'} />)}
                                      </div>
                                   </div>
                                   <span className="text-[11px] font-black text-[#425664]/30 uppercase tracking-widest">{rev.date} Matrix Logs</span>
                                </div>
                                <p className="text-[16px] text-[#425664] leading-relaxed font-medium italic">"{rev.comment}"</p>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </section>
      </main>

      {/* 4. Sticky Supply Action Bar */}
      <AnimatePresence>
        {showSticky && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 h-[100px] bg-white/95 backdrop-blur-xl border-t border-[#425664]/10 z-[60] px-8 shadow-[0_-15px_40px_rgba(0,0,0,0.08)]"
          >
            <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between gap-12">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#425664]/10 bg-[#F6F4F2] p-2 flex items-center justify-center">
                     <img src={product.images[0]} className="w-full h-full object-contain" alt="Thumb" />
                  </div>
                  <div className="hidden sm:block">
                     <h4 className="text-[17px] font-bold text-[#111827] tracking-tight">{product.name}</h4>
                     <p className="text-[12px] text-[#C6AD8F] font-black uppercase tracking-widest">Tier-2 Batch Allocation Active</p>
                  </div>
               </div>
               <div className="flex items-center gap-12">
                  <div className="text-right hidden md:block">
                     <p className="text-[11px] font-black uppercase tracking-widest text-[#425664]/40">Consolidated Reserve</p>
                     <p className="text-[26px] font-bold text-[#111827]">₹{(quantity * 72).toLocaleString()}</p>
                  </div>
                  <Link to="/checkout" className="bg-[#111827] text-white px-12 py-5 rounded-3xl font-black uppercase text-[12px] tracking-[0.2em] hover:bg-black transition-all flex items-center gap-4 shadow-xl shadow-[#111827]/20 group">
                     <ShoppingCart size={18} className="group-hover:rotate-12 transition-transform" />
                     Proceed to Payment
                  </Link>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
