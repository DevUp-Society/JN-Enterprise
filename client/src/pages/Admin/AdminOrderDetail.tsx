import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Box, 
  Truck, 
  AlertTriangle, 
  Zap, 
  Download, 
  FileText,
  User,
  MapPin,
  ClipboardList,
  Activity
} from 'lucide-react';
import { DataService } from '../../services/DataService';
import { useAuth } from '../../store/AuthContext';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

export default function AdminOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const order = DataService.getOrders().find((o: any) => o.id === orderId);
  const isWorker = user?.role === 'WORKER';

  if (!order) {
    return (
      <div className="py-40 text-center space-y-12 bg-white rounded-[48px] border-2 border-[#000000]/5 shadow-2xl mx-10">
        <AlertTriangle size={80} className="mx-auto text-[#000000]/5 animate-pulse" />
        <div className="space-y-4">
           <h3 className="text-4xl font-black text-[#000000] uppercase tracking-tighter">MANIFEST_NOT_FOUND_</h3>
           <p className="text-[10px] font-black text-[#000000]/20 uppercase tracking-[0.5em]">Logistical path is invalid or corrupted</p>
        </div>
        <button 
           onClick={() => navigate('/admin/orders')} 
           className="px-12 h-16 bg-[#000000] text-[#D6D6D6] rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#FFFFFF] transition-all shadow-xl active:scale-95"
        >
           Return to Registry Protocol
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 select-none px-4 md:px-0">
      <header className="flex flex-col gap-8 border-b border-[#000000]/10 pb-8 mt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="flex items-center gap-8">
              <button 
                 onClick={() => navigate('/admin/orders')}
                 className="p-4 hover:bg-[#D6D6D6] rounded-full transition-all text-[#000000]/40 hover:text-black shadow-xl bg-white border-2 border-black/5"
              >
                 <ArrowLeft size={32} />
              </button>
              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-8 bg-[#FFFFFF] rounded-full" />
                    <h1 className="text-4xl font-black text-[#000000] tracking-tighter uppercase leading-none">
                       Order Registry_
                    </h1>
                 </div>
                 <div className="flex items-center gap-6 pl-6">
                    <code className="text-[10px] font-black text-[#000000]/40 uppercase tracking-[0.3em] bg-[#D6D6D6] px-4 py-1.5 rounded-full border border-[#000000]/5">ID: {order.id}</code>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#000000]/10" />
                    <span className="text-[10px] font-black text-[#000000]/20 uppercase tracking-[0.4em]">NOMINAL_PATH_ESTABLISHED</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="pl-6">
           <Breadcrumbs 
              items={[
                { label: 'registry', path: '/admin/orders' },
                { label: `manifest_${order.id.split('-')[0]}...` }
              ]} 
           />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
           <section className="space-y-8">
              <div className="flex items-center gap-4 border-b border-[#000000]/10 pb-6 ml-2">
                 <User className="text-[#000000]/20" size={20} />
                 <h5 className="text-[10px] font-black text-[#000000]/40 uppercase tracking-[0.5em]">Partner Infrastructure</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-2">
                 <div className="p-10 bg-white border-2 border-[#000000]/5 shadow-2xl rounded-[40px] group hover:bg-[#D6D6D6]/30 transition-all cursor-default relative overflow-hidden">
                    <p className="text-[10px] font-black text-[#000000]/20 uppercase tracking-[0.4em] mb-4 relative z-10">Legal Entity_</p>
                    <p className="text-2xl font-black text-[#000000] tracking-tighter uppercase relative z-10 leading-none">{order.retailer}</p>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#000000]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <div className="p-10 bg-white border-2 border-[#000000]/5 shadow-2xl rounded-[40px] group hover:bg-[#D6D6D6]/30 transition-all cursor-default relative overflow-hidden">
                    <p className="text-[10px] font-black text-[#000000]/20 uppercase tracking-[0.4em] mb-4 relative z-10">Protocol Tier_</p>
                    <p className="text-2xl font-black text-[#000000] tracking-tighter uppercase relative z-10 leading-none">Wholesale_Institutional_01</p>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFFFFF]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
              </div>
           </section>

           <section className="space-y-8">
              <div className="flex items-center gap-4 border-b border-[#000000]/10 pb-6 ml-2">
                 <ClipboardList className="text-[#000000]/20" size={20} />
                 <h5 className="text-[10px] font-black text-[#000000]/40 uppercase tracking-[0.5em]">Registry Manifest Detail</h5>
              </div>
              <div className="space-y-6 pl-2">
                 <AnimatePresence mode="popLayout">
                   {order.items?.map((item: any, i: number) => (
                      <motion.div 
                         key={i} 
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: i * 0.05 }}
                         className="p-10 bg-white border-2 border-[#000000]/5 rounded-[40px] flex items-center justify-between group hover:bg-[#D6D6D6]/50 hover:border-[#000000]/15 transition-all shadow-2xl"
                      >
                         <div className="flex items-center gap-10">
                            <div className="w-20 h-20 bg-white border-2 border-[#000000]/5 text-[#000000]/10 rounded-[28px] flex items-center justify-center group-hover:bg-[#000000] group-hover:text-[#D6D6D6] group-hover:scale-110 group-hover:-rotate-6 transition-all shadow-xl">
                               <Box size={32} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-2 overflow-hidden">
                               <code className="text-[10px] font-black text-[#000000]/20 uppercase tracking-[0.4em] block">SKU: {item.sku}</code>
                               <p className="text-2xl font-black text-[#000000] tracking-tighter uppercase leading-tight truncate max-w-[200px] md:max-w-md">{item.name}</p>
                            </div>
                         </div>
                         <div className="text-right flex flex-col items-end gap-2">
                            <div className="px-6 py-3 bg-[#000000] text-[#D6D6D6] rounded-full shadow-lg">
                               <p className="text-3xl font-black tracking-tighter leading-none">{item.qty}</p>
                            </div>
                            <p className="text-[10px] font-black text-[#000000]/30 uppercase tracking-[0.4em] mr-2">UNITS_RESERVED</p>
                         </div>
                      </motion.div>
                   ))}
                 </AnimatePresence>
              </div>
           </section>
        </div>

        <aside className="space-y-12">
           <div className="p-12 bg-white border-2 border-[#000000]/5 shadow-[0_0_80px_rgba(0,0,0,0.1)] rounded-[56px] space-y-12 sticky top-8">
              <div className="space-y-10">
                 <div className="flex items-center gap-3 border-b border-[#000000]/10 pb-6">
                    <MapPin className="text-[#000000]/20" size={18} />
                    <h5 className="text-[10px] font-black text-[#000000] uppercase tracking-[0.5em]">Logistics Protocol</h5>
                 </div>
                 <div className="space-y-8">
                    {[
                       { label: 'Distribution Node', val: 'JN_EXPEDITED_HUB_01' },
                       { label: 'Priority Assignment', val: order.priority || 'STANDARD_ROUTING' },
                       { label: 'Metric Payload', val: '42.5 KG_NET' },
                       { label: 'Security Clearance', val: 'LEVEL_01_INSTITUTIONAL' },
                    ].map(stat => (
                       <div key={stat.label} className="flex flex-col gap-2 group">
                          <span className="text-[9px] font-black text-[#000000]/30 uppercase tracking-[0.4em] group-hover:text-[#FFFFFF] transition-colors">{stat.label}_</span>
                          <span className="text-[14px] font-black text-[#000000] uppercase tracking-widest">{stat.val}</span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="flex justify-between items-center mb-6">
                    <p className="text-[10px] font-black text-[#000000]/30 uppercase tracking-[0.4em]">Fulfillment Vector Pulse</p>
                    <Activity size={16} className="text-[#FFFFFF] animate-pulse" />
                 </div>
                 <div className="w-full bg-[#D6D6D6] h-4 rounded-full relative overflow-hidden shadow-inner border border-[#000000]/5">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: order.status === 'PENDING' ? '25%' : order.status === 'PROCESSING' ? '50%' : '100%' }}
                       className={`h-full shadow-lg ${order.status === 'ON_HOLD' ? 'bg-black' : 'bg-[#000000]'}`} 
                       transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                 </div>
                 <div className="flex justify-between items-center bg-[#D6D6D6] px-6 h-14 rounded-full border border-[#000000]/5">
                    <p className={`text-[11px] font-black uppercase tracking-[0.3em] ${order.status === 'ON_HOLD' ? 'text-black' : 'text-[#000000]'}`}>{order.status.replace('_', ' ')}</p>
                    <Zap size={18} className={order.status === 'ON_HOLD' ? 'text-black animate-pulse' : 'text-[#000000]/20'} />
                 </div>
              </div>

              {isWorker && order.status !== 'ON_HOLD' && (
                <button className="w-full h-20 bg-[#000000] text-[#D6D6D6] rounded-[32px] text-[12px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-[#FFFFFF] transition-all flex items-center justify-center gap-6 group active:scale-95">
                  <Truck size={28} strokeWidth={2.5} className="group-hover:translate-x-2 transition-transform" />
                  INIT_DISTRIBUTION_STREAM
                </button>
              )}
              
              {order.status === 'ON_HOLD' && (
                 <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-10 bg-black/5 border-2 border-black/10 rounded-[40px] text-black space-y-6 shadow-xl relative overflow-hidden"
                 >
                    <div className="flex items-center gap-4 relative z-10">
                       <AlertTriangle size={24} className="animate-pulse" />
                       <p className="text-[11px] font-black uppercase tracking-[0.4em]">SYSTEM_HOLD_CLEARANCE_REQUIRED</p>
                    </div>
                    <p className="text-[11px] font-bold leading-relaxed text-black/60 relative z-10">Registry state suspended. Awaiting administrative verification nodes to stabilize distribution path.</p>
                    <button className="w-full h-14 bg-black text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl active:scale-95 relative z-10">EMERGENCY_RESOLUTION_PASS</button>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-full blur-3xl" />
                 </motion.div>
              )}

              <div className="flex flex-col gap-4">
                 <button className="w-full h-16 border-2 border-[#000000]/5 text-[#000000]/40 rounded-[24px] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D6D6D6] hover:text-[#000000] transition-all flex items-center justify-center gap-4 shadow-sm group">
                    <Download size={20} className="group-hover:translate-y-1 transition-transform" /> 
                    ARCHIVE_INSTITUTIONAL_MANIFEST
                 </button>
                 <button className="w-full h-16 bg-white border-2 border-[#000000] text-[#000000] rounded-[24px] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#000000] hover:text-[#D6D6D6] transition-all shadow-xl flex items-center justify-center gap-4 active:scale-[0.98]">
                    <FileText size={20} /> SYNC_EDI_LOG_STREAM
                 </button>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}










