import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Warehouse, 
  Truck, 
  ShieldCheck,
  Package
} from 'lucide-react';
import { RetailerPortalHeader } from '../../components/navigation/RetailerPortalHeader';

export default function OrderSuccess() {
  const orderId = `JN-REG-${Math.random().toString(36).substring(7).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-[#D6D6D6] text-[#000000] font-sans selection:bg-[#000000] selection:text-[#D6D6D6] pb-40">
      <RetailerPortalHeader />
      
      <main className="max-w-[1200px] mx-auto px-12 py-40">
        <div className="bg-white border border-[#000000]/5 p-20 shadow-2xl space-y-16 relative overflow-hidden rounded-[40px]">
           {/* Visual Flourish */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#000000]/5 blur-[100px] -z-0" />
           
           <div className="relative z-10 space-y-12">
              <div className="flex flex-col items-center text-center space-y-6">
                 <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                    className="w-24 h-24 bg-[#000000] text-white flex items-center justify-center rounded-full shadow-[0_0_40px_rgba(63,104,68,0.3)]"
                 >
                    <CheckCircle2 size={48} />
                 </motion.div>
                 <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter uppercase leading-none text-[#000000]">ORDER RECEIVED_</h1>
                    <p className="text-[14px] font-black text-[#000000]/40 tracking-[0.4em] uppercase">REGISTRY ID: {orderId}</p>
                 </div>
              </div>

              <div className="max-w-xl mx-auto text-center">
                 <p className="text-[14px] font-black uppercase text-[#000000]/60 leading-relaxed">
                    YOUR PROCUREMENT REGISTRY HAS BEEN SYNCHRONIZED WITH OUR CENTRAL ARCHIVE. 
                    <span className="text-[#000000]"> OUR WORKFORCE IS NOW PREPARING YOUR SHIPMENT </span> 
                    FOR DISPATCH FROM THE SHENZHEN HUB terminal.
                 </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                 {[
                   { label: "PROTOCOL_STAGE", val: "VERIFICATION", icon: ShieldCheck },
                   { label: "LOGISTICS_STATUS", val: "QUEUED", icon: Truck },
                   { label: "TERMINAL_NODE", val: "W-04-NORTH", icon: Warehouse }
                 ].map((node, i) => (
                   <div key={i} className="p-8 bg-[#D6D6D6]/30 border border-[#000000]/5 space-y-4 text-center rounded-2xl">
                      <node.icon size={20} className="mx-auto text-[#FFFFFF]" />
                      <div className="space-y-1">
                         <p className="text-[9px] font-bold text-[#000000]/30 uppercase tracking-widest">{node.label}</p>
                         <p className="text-[12px] font-black text-[#000000] uppercase">{node.val}</p>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="flex flex-col md:flex-row gap-6 pt-12 border-t-2 border-[#000000]/5">
                 <button className="flex-1 h-20 bg-[#000000] text-white text-[12px] font-black uppercase tracking-widest hover:bg-[#FFFFFF] transition-all shadow-xl flex items-center justify-center gap-4 group rounded-2xl">
                    <FileText size={20} className="group-hover:scale-110 transition-transform" /> DOWNLOAD INVOICE (PDF)
                 </button>
                 <Link to="/shop" className="flex-1 h-20 bg-white border-2 border-[#000000]/5 text-[#000000] text-[12px] font-black uppercase tracking-widest hover:bg-[#D6D6D6] transition-all flex items-center justify-center gap-4 group rounded-2xl">
                    RETURN TO CATALOG <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                 </Link>
              </div>
           </div>

           {/* Animated Background Graphics */}
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
             className="absolute -bottom-48 -left-48 w-[400px] h-[400px] border border-[#000000]/5 opacity-40 pointer-events-none"
             style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
           />
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 opacity-10">
           <Package size={24} />
           <p className="text-[9px] font-black uppercase tracking-[0.5em]">ISO 9001 QUALITY NODE SYNCHRONIZED</p>
        </div>
      </main>
    </div>
  );
}










