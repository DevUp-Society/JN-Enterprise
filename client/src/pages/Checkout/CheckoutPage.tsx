import { useState } from 'react';
import { 
  CreditCard, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Landmark,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const [selectedMethod, setSelectedMethod] = useState('wire');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="bg-[#F6F4F2] min-h-screen flex items-center justify-center">
         <motion.div 
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="bg-white p-16 rounded-[60px] border border-[#425664]/5 shadow-2xl shadow-[#425664]/5 max-w-xl w-full text-center space-y-8"
         >
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 mb-4">
               <CheckCircle2 size={48} />
            </div>
            <div className="space-y-4 text-center">
               <h2 className="text-3xl font-bold text-[#425664] tracking-tight">Transaction Authorized_</h2>
               <p className="text-base text-[#6B7280] font-normal leading-relaxed">Your procurement invoice has been fulfilled. Tracking matrix and shipping manifests will be dispatched to your terminal shortly.</p>
            </div>
            <div className="pt-8 flex flex-col gap-4">
               <Link to="/home" className="bg-[#425664] text-white py-5 rounded-full font-medium text-base hover:bg-[#111827] transition-all">
                  Return to Dashboard
               </Link>
               <button className="text-[#C6AD8F] font-semibold text-sm uppercase tracking-widest hover:text-[#425664] transition-colors">
                  Download Invoice Manifest
               </button>
            </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F4F2] min-h-screen font-sans">
      <main className="max-w-[1400px] mx-auto px-8 pt-[140px] pb-40">
        
        {/* Header */}
        <div className="border-b border-[#425664]/10 pb-12 mb-16">
           <h1 className="text-3xl font-bold text-[#425664] tracking-tight leading-tight">
              procurement clearance
           </h1>
           <p className="text-base text-[#6B7280] font-normal mt-4">Secure encrypted bridge for corporate transactions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
           
           {/* Left Column: Form & Methods */}
           <div className="lg:col-span-8 space-y-12">
              
              {/* Delivery Details */}
              <div className="bg-white rounded-[40px] p-10 border border-[#425664]/5 shadow-sm space-y-8">
                 <div className="flex items-center gap-4 border-b border-[#425664]/5 pb-6">
                    <div className="w-12 h-12 bg-[#F6F4F2] rounded-2xl flex items-center justify-center text-[#425664]/50">
                       <MapPin size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-[#425664] tracking-tight">Logistics Destination</h3>
                       <span className="text-xs font-semibold text-[#C6AD8F] uppercase tracking-widest">Facility Audit Clear</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-3">
                       <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-widest">Enterprise Name</label>
                       <input type="text" defaultValue="Global Logistics Corp." className="w-full bg-[#F6F4F2] border-none text-[#425664] text-base font-medium p-5 rounded-2xl focus:ring-2 focus:ring-[#C6AD8F] outline-none transition-all" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-widest">Procurement ID Reference</label>
                       <input type="text" defaultValue="REQ-99X-ALFA" className="w-full bg-[#F6F4F2] border-none text-[#425664] text-base font-medium p-5 rounded-2xl focus:ring-2 focus:ring-[#C6AD8F] outline-none transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                       <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-widest">Facility Address Coordinates</label>
                       <input type="text" defaultValue="Warehouse District 4A, Port Connectivity Route, Navasheva" className="w-full bg-[#F6F4F2] border-none text-[#425664] text-base font-medium p-5 rounded-2xl focus:ring-2 focus:ring-[#C6AD8F] outline-none transition-all" />
                    </div>
                 </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-[40px] p-10 border border-[#425664]/5 shadow-sm space-y-8">
                 <div className="flex items-center gap-4 border-b border-[#425664]/5 pb-6">
                    <div className="w-12 h-12 bg-[#F6F4F2] rounded-2xl flex items-center justify-center text-[#425664]/50">
                       <Lock size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-[#425664] tracking-tight">Financial Clearance Bridge</h3>
                       <span className="text-xs font-semibold text-[#C6AD8F] uppercase tracking-widest">End-to-End Encrypted</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    {[
                      { id: 'wire', icon: Building2, label: 'Corp Wire Transfer' },
                      { id: 'banking', icon: Landmark, label: 'Global Banking' },
                      { id: 'card', icon: CreditCard, label: 'Credit Reserve' }
                    ].map((method) => (
                       <button
                         key={method.id}
                         onClick={() => setSelectedMethod(method.id)}
                         className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
                           selectedMethod === method.id 
                             ? 'border-[#425664] bg-[#425664] text-white shadow-xl translate-y-[-4px]' 
                             : 'border-[#425664]/10 bg-[#F6F4F2] text-[#425664]/60 hover:border-[#C6AD8F]/50 hover:bg-white'
                         }`}
                       >
                          <method.icon size={28} className={selectedMethod === method.id ? "text-[#C6AD8F]" : ""} />
                          <span className={`text-xs font-bold uppercase tracking-widest ${selectedMethod === method.id ? 'text-white' : 'text-[#425664]'}`}>{method.label}</span>
                       </button>
                    ))}
                 </div>

                 {/* Simulated Dynamic Form based on selected method */}
                 <div className="pt-8">
                    {selectedMethod === 'card' && (
                       <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                          <div className="space-y-3">
                             <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-widest">Card Sequence Identifier</label>
                             <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-[#F6F4F2] border-none text-[#425664] text-base font-medium p-5 rounded-2xl focus:ring-2 focus:ring-[#C6AD8F] outline-none transition-all placeholder:text-[#425664]/20" />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                               <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-widest">Expiry</label>
                               <input type="text" placeholder="MM/YY" className="w-full bg-[#F6F4F2] border-none text-[#425664] text-base font-medium p-5 rounded-2xl focus:ring-2 focus:ring-[#C6AD8F] outline-none transition-all placeholder:text-[#425664]/20" />
                            </div>
                            <div className="space-y-3">
                               <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-widest">Security CVR</label>
                               <input type="text" placeholder="•••" className="w-full bg-[#F6F4F2] border-none text-[#425664] text-base font-medium p-5 rounded-2xl focus:ring-2 focus:ring-[#C6AD8F] outline-none transition-all placeholder:text-[#425664]/20" />
                            </div>
                          </div>
                       </div>
                    )}
                    {(selectedMethod === 'wire' || selectedMethod === 'banking') && (
                       <div className="bg-[#111827] text-white p-8 rounded-3xl space-y-6 relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                          <h4 className="text-sm font-semibold uppercase tracking-widest text-[#C6AD8F]">JN Enterprise Trust Account</h4>
                          <div className="grid grid-cols-2 gap-8 opacity-80">
                             <div>
                                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Routing Matrix</p>
                                <p className="text-lg font-mono font-bold tracking-wider">JNET-990-INT</p>
                             </div>
                             <div>
                                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Clearance Code</p>
                                <p className="text-lg font-mono font-bold tracking-wider">045-882-990</p>
                             </div>
                          </div>
                          <p className="text-xs italic text-white/50">* Wire bridging must be initiated within 48 operational hours.</p>
                       </div>
                    )}
                 </div>
              </div>

           </div>

           {/* Right Column: Mini Cart Summary */}
           <div className="lg:col-span-4 space-y-8 sticky top-32">
              <div className="bg-[#425664] text-white p-10 rounded-[60px] shadow-2xl shadow-[#425664]/20 space-y-10 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
                 
                 <h2 className="text-2xl font-bold tracking-tight border-b border-white/10 pb-6">Financial Audit_</h2>
                 
                 <div className="space-y-6">
                    <div className="flex justify-between items-center opacity-60">
                       <span className="text-xs font-semibold uppercase tracking-widest">Base Requisition</span>
                       <span className="text-lg font-bold">₹245,000</span>
                    </div>
                    <div className="flex justify-between items-center opacity-60">
                       <span className="text-xs font-semibold uppercase tracking-widest">Global Logistics Link</span>
                       <span className="text-lg font-bold">₹12,250</span>
                    </div>
                    <div className="pt-6 border-t border-white/10">
                       <div className="space-y-1">
                          <span className="text-xs font-semibold text-[#C6AD8F] uppercase tracking-widest">Total Transaction Value</span>
                          <p className="text-4xl font-bold tracking-tight">₹257,250</p>
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={handlePayment}
                   disabled={isProcessing}
                   className="w-full bg-[#C6AD8F] text-white py-8 rounded-[40px] font-semibold uppercase text-sm tracking-widest hover:bg-[#B89672] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {isProcessing ? 'Auditing...' : 'Authorize Transaction'}
                    {!isProcessing && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />}
                 </button>
                 
                 <div className="flex items-center justify-center gap-2 pt-2">
                    <ShieldCheck size={14} className="text-[#C6AD8F]" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">256-bit encrypted channel</span>
                 </div>
              </div>
           </div>

        </div>
      </main>
    </div>
  );
}
