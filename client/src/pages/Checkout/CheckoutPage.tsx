import { useState } from 'react';
import { 
  CreditCard, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Landmark,
  CheckCircle2,
  Lock,
  ArrowLeft
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
      <div className="bg-[#D6D6D6] min-h-screen flex items-center justify-center selection:bg-[#000000] selection:text-[#D6D6D6]">
         <motion.div 
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="bg-white p-16 rounded-[60px] border border-[#000000]/5 shadow-2xl max-w-xl w-full text-center space-y-10"
         >
            <div className="w-24 h-24 bg-[#000000] rounded-full flex items-center justify-center mx-auto text-[#D6D6D6] mb-4 shadow-xl">
               <CheckCircle2 size={48} />
            </div>
            <div className="space-y-4 text-center">
               <h2 className="text-4xl font-black text-[#000000] tracking-tighter uppercase">Authorized_</h2>
               <p className="text-[14px] text-[#000000]/60 font-medium leading-relaxed uppercase tracking-wide">Your procurement invoice has been fulfilled. Tracking matrix and shipping manifests will be dispatched to your terminal shortly.</p>
            </div>
            <div className="pt-8 flex flex-col gap-4">
               <Link to="/home" className="bg-[#000000] text-[#D6D6D6] py-6 rounded-[32px] font-black uppercase text-[12px] tracking-widest hover:bg-[#FFFFFF] transition-all shadow-lg">
                  Return to Dashboard
               </Link>
               <button className="text-[#FFFFFF] font-black text-[10px] uppercase tracking-[0.3em] hover:text-[#000000] transition-colors">
                  Download Invoice Manifest
               </button>
            </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#D6D6D6] min-h-screen font-sans selection:bg-[#000000] selection:text-[#D6D6D6]">
      <main className="max-w-[1400px] mx-auto px-8 pt-[140px] pb-40">
        
        {/* Header */}
        <div className="border-b border-[#000000]/10 pb-12 mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
           <div className="space-y-1">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-[1px] bg-[#000000]/30" />
                 <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#000000]/60">Clearance Protocol</h2>
              </div>
              <h1 className="text-5xl font-black text-[#000000] tracking-tighter uppercase">Checkout_</h1>
           </div>
           <Link to="/cart" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#000000] hover:text-[#FFFFFF] transition-all group">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Manifest
           </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
           
           {/* Left Column: Form & Methods */}
           <div className="lg:col-span-8 space-y-12">
              
              {/* Delivery Details */}
              <div className="bg-white rounded-[40px] p-10 border border-[#000000]/5 shadow-sm space-y-8">
                 <div className="flex items-center gap-5 border-b border-[#000000]/5 pb-8">
                    <div className="w-14 h-14 bg-[#D6D6D6] rounded-2xl flex items-center justify-center text-[#000000]">
                       <MapPin size={28} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-[#000000] tracking-tighter uppercase">Logistics Destination</h3>
                       <span className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-[0.2em]">Facility Audit Clear</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#000000]/40 uppercase tracking-widest pl-2">Enterprise Name</label>
                       <input type="text" defaultValue="Global Logistics Corp." className="w-full bg-[#D6D6D6]/50 border border-transparent text-[#000000] text-[15px] font-bold p-6 rounded-[24px] focus:border-[#000000]/10 focus:bg-white outline-none transition-all" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#000000]/40 uppercase tracking-widest pl-2">Procurement ID Reference</label>
                       <input type="text" defaultValue="REQ-99X-ALFA" className="w-full bg-[#D6D6D6]/50 border border-transparent text-[#000000] text-[15px] font-bold p-6 rounded-[24px] focus:border-[#000000]/10 focus:bg-white outline-none transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                       <label className="text-[10px] font-black text-[#000000]/40 uppercase tracking-widest pl-2">Facility Address Coordinates</label>
                       <input type="text" defaultValue="Warehouse District 4A, Port Connectivity Route, Navasheva" className="w-full bg-[#D6D6D6]/50 border border-transparent text-[#000000] text-[15px] font-bold p-6 rounded-[24px] focus:border-[#000000]/10 focus:bg-white outline-none transition-all" />
                    </div>
                 </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-[40px] p-10 border border-[#000000]/5 shadow-sm space-y-8">
                 <div className="flex items-center gap-5 border-b border-[#000000]/5 pb-8">
                    <div className="w-14 h-14 bg-[#D6D6D6] rounded-2xl flex items-center justify-center text-[#000000]">
                       <Lock size={28} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-[#000000] tracking-tighter uppercase">Financial Bridge</h3>
                       <span className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-[0.2em]">End-to-End Encrypted</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    {[
                      { id: 'wire', icon: Building2, label: 'Corp Wire' },
                      { id: 'banking', icon: Landmark, label: 'Global Banking' },
                      { id: 'card', icon: CreditCard, label: 'Credit Reserve' }
                    ].map((method) => (
                       <button
                         key={method.id}
                         onClick={() => setSelectedMethod(method.id)}
                         className={`p-8 rounded-[32px] border-2 flex flex-col items-center justify-center gap-5 transition-all duration-300 ${
                           selectedMethod === method.id 
                             ? 'border-[#000000] bg-[#000000] text-white shadow-2xl translate-y-[-8px]' 
                             : 'border-[#000000]/5 bg-[#D6D6D6]/30 text-[#000000]/60 hover:border-[#000000]/20 hover:bg-white'
                         }`}
                       >
                          <method.icon size={32} className={selectedMethod === method.id ? "text-[#D6D6D6]" : ""} />
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedMethod === method.id ? 'text-[#D6D6D6]' : 'text-[#000000]'}`}>{method.label}</span>
                       </button>
                    ))}
                 </div>

                 {/* Simulated Dynamic Form based on selected method */}
                 <div className="pt-8">
                    {selectedMethod === 'card' && (
                       <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-[#000000]/40 uppercase tracking-widest pl-2">Card Sequence Identifier</label>
                             <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-[#D6D6D6]/50 border border-transparent text-[#000000] text-[15px] font-bold p-6 rounded-[24px] focus:border-[#000000]/10 focus:bg-white outline-none transition-all placeholder:text-[#000000]/20" />
                          </div>
                          <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-[#000000]/40 uppercase tracking-widest pl-2">Expiry</label>
                               <input type="text" placeholder="MM/YY" className="w-full bg-[#D6D6D6]/50 border border-transparent text-[#000000] text-[15px] font-bold p-6 rounded-[24px] focus:border-[#000000]/10 focus:bg-white outline-none transition-all placeholder:text-[#000000]/20" />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-[#000000]/40 uppercase tracking-widest pl-2">Security CVR</label>
                               <input type="text" placeholder="•••" className="w-full bg-[#D6D6D6]/50 border border-transparent text-[#000000] text-[15px] font-bold p-6 rounded-[24px] focus:border-[#000000]/10 focus:bg-white outline-none transition-all placeholder:text-[#000000]/20" />
                            </div>
                          </div>
                       </div>
                    )}
                    {(selectedMethod === 'wire' || selectedMethod === 'banking') && (
                       <div className="bg-[#000000] text-white p-10 rounded-[40px] space-y-8 relative overflow-hidden animate-in slide-in-from-bottom-8 duration-700 shadow-2xl">
                          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                          <div className="flex flex-col gap-2">
                             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D6D6D6]">JN Enterprise Trust Account</h4>
                             <div className="w-12 h-1 bg-[#FFFFFF] rounded-full" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 opacity-90">
                             <div>
                                <p className="text-[10px] text-black/40 uppercase tracking-widest mb-3">Routing Matrix</p>
                                <p className="text-xl font-mono font-black tracking-widest text-[#D6D6D6]">JNET-990-INT</p>
                             </div>
                             <div>
                                <p className="text-[10px] text-black/40 uppercase tracking-widest mb-3">Clearance Code</p>
                                <p className="text-xl font-mono font-black tracking-widest text-[#D6D6D6]">045-882-990</p>
                             </div>
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 pt-4">* Wire bridging must be initiated within 48 operational hours.</p>
                       </div>
                    )}
                 </div>
              </div>

           </div>

           {/* Right Column: Mini Cart Summary */}
           <div className="lg:col-span-4 space-y-8 sticky top-32">
              <div className="bg-white border border-[#000000]/5 p-12 rounded-[50px] shadow-2xl space-y-12 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-[#000000]/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
                 
                 <div className="space-y-4">
                    <h2 className="text-3xl font-black text-[#000000] tracking-tighter uppercase">Audit Summary</h2>
                    <div className="w-12 h-1 bg-[#FFFFFF] rounded-full" />
                 </div>
                 
                 <div className="space-y-8">
                    <div className="flex justify-between items-center opacity-60">
                       <span className="text-[10px] font-black text-[#000000] uppercase tracking-widest">Base Requisition</span>
                       <span className="text-xl font-black text-[#000000]">₹245,000</span>
                    </div>
                    <div className="flex justify-between items-center opacity-60">
                       <span className="text-[10px] font-black text-[#000000] uppercase tracking-widest">Logistics Link</span>
                       <span className="text-xl font-black text-[#000000]">₹12,250</span>
                    </div>
                    <div className="pt-8 border-t border-[#000000]/10">
                       <div className="space-y-2">
                          <span className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-[0.3em]">Total Transaction Value</span>
                          <p className="text-5xl font-black text-[#000000] tracking-tighter">₹257,250</p>
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={handlePayment}
                   disabled={isProcessing}
                   className="w-full bg-[#000000] text-[#D6D6D6] py-8 rounded-[36px] font-black uppercase text-[12px] tracking-[0.2em] hover:bg-[#FFFFFF] hover:text-white transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed shadow-xl active:scale-95"
                 >
                    {isProcessing ? 'Auditing Batch...' : 'Authorize Transaction'}
                    {!isProcessing && <ArrowRight size={22} className="group-hover:translate-x-3 transition-transform" />}
                 </button>
                 
                 <div className="flex items-center justify-center gap-4 pt-4 border-t border-[#000000]/5">
                    <ShieldCheck size={18} className="text-[#FFFFFF]" />
                    <span className="text-[9px] uppercase font-black tracking-[0.3em] text-[#000000]/40 leading-none">256-bit encrypted node protocol</span>
                 </div>
              </div>
           </div>

        </div>
      </main>
    </div>
  );
}










