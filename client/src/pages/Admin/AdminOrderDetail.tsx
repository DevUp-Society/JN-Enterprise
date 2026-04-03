import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Box, 
  Truck, 
  AlertTriangle, 
  Zap, 
  Download, 
  FileText 
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
      <div className="py-40 text-center space-y-6">
        <AlertTriangle size={64} className="mx-auto text-primary/10" />
        <h3 className="text-2xl font-black text-primary uppercase tracking-tighter">MANIFEST_NOT_FOUND</h3>
        <button onClick={() => navigate('/admin/orders')} className="text-[10px] font-black uppercase tracking-widest border-b border-primary/40">Return to Registry</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-24 font-mono select-none">
      {/* TERMINAL_HEADER_PROTOCOL */}
      <header className="flex flex-col gap-10 border-b border-primary/10 pb-12">
        <div className="flex items-center">
           <h1 className="text-3xl font-black text-primary dark:text-bone tracking-tighter uppercase leading-none">
              ORDER_DETAILS: {order.id}
           </h1>
           <div className="h-[1px] flex-1 bg-primary/5 mx-10" />
           <button 
              onClick={() => navigate('/admin/orders')}
              className="px-8 h-12 bg-white dark:bg-dark-surface border border-primary/10 flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-lg group"
           >
              <ArrowLeft size={16} className="text-primary/20 group-hover:text-white" />
              BACK_TO_REGISTRY
           </button>
        </div>

        <Breadcrumbs 
           items={[
             { label: 'ORDERS', path: '/admin/orders' },
             { label: `ORDER ${order.id}` }
           ]} 
        />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
           <section className="space-y-8">
              <h5 className="text-[10px] font-black text-primary/20 dark:text-white/20 uppercase tracking-[0.4em] border-b border-primary/10 pb-4">PARTNER_REGISTRY_NODE</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-10 bg-white dark:bg-dark-surface border border-primary/5 shadow-xl">
                    <p className="text-[9px] font-black text-primary/30 dark:text-white/20 uppercase tracking-widest mb-3 leading-none">Legal Identity</p>
                    <p className="text-[15px] font-black text-primary dark:text-white uppercase tracking-tight">{order.retailer}</p>
                 </div>
                 <div className="p-10 bg-white dark:bg-dark-surface border border-primary/5 shadow-xl">
                    <p className="text-[9px] font-black text-primary/30 dark:text-white/20 uppercase tracking-widest mb-3 leading-none">Protocol Segment</p>
                    <p className="text-[15px] font-black text-primary dark:text-white uppercase tracking-tight">Wholesale Tier 1</p>
                 </div>
              </div>
           </section>

           <section className="space-y-8">
              <h5 className="text-[10px] font-black text-primary/20 dark:text-white/20 uppercase tracking-[0.4em] border-b border-primary/10 pb-4">MANIFEST_PAYLOAD</h5>
              <div className="space-y-4">
                 {order.items?.map((item: any, i: number) => (
                    <motion.div 
                       key={i} 
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="p-8 bg-white dark:bg-dark-surface border border-primary/5 flex items-center justify-between group hover:border-gold transition-all"
                    >
                       <div className="flex items-center gap-8">
                          <div className="w-14 h-14 bg-bone dark:bg-dark border border-primary/5 flex items-center justify-center text-primary/10 group-hover:bg-primary group-hover:text-white transition-all"><Box size={22} /></div>
                          <div className="overflow-hidden">
                             <p className="text-[10px] font-black text-primary/20 dark:text-white/20 uppercase tracking-widest mb-1">{item.sku}</p>
                             <p className="text-[16px] font-black text-primary dark:text-white uppercase tracking-tighter truncate max-w-[200px] md:max-w-md">{item.name}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-3xl font-black text-primary dark:text-white tracking-tighter leading-none">{item.qty}</p>
                          <p className="text-[9px] font-bold text-primary/30 dark:text-white/30 uppercase tracking-widest mt-1">UNITS</p>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </section>
        </div>

        <aside className="space-y-10">
           <div className="p-10 bg-white dark:bg-dark-surface border border-primary/10 shadow-2xl space-y-12">
              <div className="space-y-6">
                 <h5 className="text-[11px] font-black text-primary dark:text-white uppercase tracking-[0.2em] border-b border-primary/10 pb-4">LOGISTICS_INTEL</h5>
                 <div className="space-y-5">
                    {[
                       { label: 'Carrier Node', val: 'JN Expedited' },
                       { label: 'Priority State', val: order.priority || 'Normal' },
                       { label: 'Package Weight', val: '42.5 KG' },
                       { label: 'Security Level', val: 'Tier 1' },
                    ].map(stat => (
                       <div key={stat.label} className="flex justify-between items-center group">
                          <span className="text-[10px] font-black text-primary/40 dark:text-white/30 uppercase tracking-widest group-hover:text-gold transition-colors">{stat.label}</span>
                          <span className="text-[11px] font-black text-primary dark:text-white uppercase">{stat.val}</span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-6">
                 <p className="text-[10px] font-black text-primary/30 dark:text-white/20 uppercase tracking-widest">FULFILLMENT_PROGRESS</p>
                 <div className="w-full bg-bone dark:bg-dark h-[8px] border border-primary/5 relative">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: order.status === 'PENDING' ? '25%' : order.status === 'PROCESSING' ? '50%' : '100%' }}
                       className={`h-full ${order.status === 'ON_HOLD' ? 'bg-red-500' : 'bg-gold'}`} 
                    />
                 </div>
                 <div className="flex justify-between items-center">
                    <p className={`text-[12px] font-black uppercase tracking-widest ${order.status === 'ON_HOLD' ? 'text-red-500' : 'text-primary dark:text-white'}`}>{order.status}</p>
                    <Zap size={14} className={order.status === 'ON_HOLD' ? 'text-red-500' : 'text-gold'} />
                 </div>
              </div>
           </div>

           {isWorker && order.status !== 'ON_HOLD' && (
             <button className="w-full h-24 bg-primary text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-gold transition-all flex items-center justify-center gap-6 group">
               <Truck size={24} className="group-hover:translate-x-2 transition-transform" />
               INITIATE SHIPMENT
             </button>
           )}
           
           {order.status === 'ON_HOLD' && (
              <div className="p-8 bg-red-500/5 dark:bg-red-500/10 border-2 border-red-500/20 text-red-500 space-y-4">
                 <div className="flex items-center gap-3">
                    <AlertTriangle size={20} />
                    <p className="text-[12px] font-black uppercase tracking-widest">HOLD_PROTOCOL_ACTIVE</p>
                 </div>
                 <p className="text-[10px] font-bold uppercase leading-relaxed text-red-500/60">Order logic suspended due to reported fulfillment error. Awaiting Admin clearance.</p>
                 <button className="w-full h-14 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl">RESOLVE_LOGS</button>
              </div>
           )}

           <div className="space-y-4">
              <button className="w-full h-18 border border-primary/10 text-primary/40 dark:text-white/20 text-[10px] font-black uppercase tracking-widest hover:bg-bone dark:hover:bg-primary/5 transition-all flex items-center justify-center gap-3">
                 <Download size={14} /> DOWNLOAD_MANIFEST
              </button>
              <button className="w-full h-18 bg-white dark:bg-dark-surface border-2 border-primary dark:border-gold text-primary dark:text-gold text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white dark:hover:bg-gold dark:hover:text-dark transition-all shadow-xl flex items-center justify-center gap-3">
                 <FileText size={14} /> EXPORT_EDI_LOGS
              </button>
           </div>
        </aside>
      </div>
    </div>
  );
}
