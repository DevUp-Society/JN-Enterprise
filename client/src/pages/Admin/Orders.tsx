import { useEffect, useState } from 'react';
import { 
  Package, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  AlertTriangle,
  Layers,
  Zap,
  Globe,
  Clock,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../../services/DataService';
import ArchitecturalEmptyState from '../../components/feedback/ArchitecturalEmptyState';

export default function Orders() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setOrders(DataService.getOrders());
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter((o: any) => o.status === filter);

  if (!isLoaded) {
    return (
    <div className="space-y-12 pb-24 font-mono select-none">
      <header className="flex flex-col gap-10 border-b border-primary/10 pb-12">
        <div className="flex items-center">
           <h1 className="text-3xl font-black text-primary dark:text-bone tracking-tighter uppercase leading-none">
              ORDER REGISTRY
           </h1>
           <div className="h-[1px] flex-1 bg-primary/5 mx-10" />
        </div>
      </header>
         <div className="h-28 w-full skeleton border-curator" />
         <div className="h-[600px] w-full skeleton border-curator" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 font-mono select-none">
      <header className="flex flex-col gap-10 border-b border-primary/10 pb-12">
        <div className="flex items-center">
           <h1 className="text-3xl font-black text-primary dark:text-bone tracking-tighter uppercase leading-none">
              ORDER REGISTRY
           </h1>
           <div className="h-[1px] flex-1 bg-primary/5 mx-10" />
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8 floating-card p-10 relative overflow-hidden group">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
          <input 
            type="text" 
            placeholder="QUERY_LOGISTICS_REGISTRY_BY_UID_OR_ACCOUNT..." 
            className="w-full h-16 bg-bone dark:bg-dark-surface border border-primary/5 pl-16 pr-6 text-[10px] font-black uppercase tracking-widest focus:border-gold focus:outline-none transition-all placeholder:text-primary/10" 
          />
        </div>
        <div className="flex bg-bone dark:bg-dark border border-primary/10 p-1 shadow-sm">
          {['ALL', 'PENDING', 'PROCESSING', 'ON_HOLD', 'SHIPPED', 'PACKED'].map(f => (
            <button 
               key={f} 
               onClick={() => setFilter(f)} 
               className={`px-6 md:px-8 h-14 text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-white shadow-xl' : 'text-primary/30 dark:text-white/20 hover:text-primary dark:hover:text-gold'}`}
            >
               {f}
            </button>
          ))}
        </div>
      </div>

      <section className="floating-card overflow-hidden min-h-[600px] relative">
        <div className="p-8 border-b border-primary/5 bg-bone dark:bg-dark-surface flex items-center gap-4">
           <Layers size={16} className="text-primary/20" />
           <h3 className="text-[11px] font-black text-primary dark:text-white/60 uppercase tracking-[0.3em]">PROCUREMENT_QUEUE_MATRIX</h3>
        </div>

        {filteredOrders.length === 0 ? (
          <ArchitecturalEmptyState 
            icon={Package}
            title="MATRIX EMPTY"
            subtitle="NO ACTIVE PROCUREMENT NODES DETECTED IN THE CURRENT REGISTRY SEGMENT."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white dark:bg-dark border-b border-primary/10">
                  <th className="p-8 text-[10px] font-black text-primary/40 uppercase tracking-widest leading-none">Order UID</th>
                  <th className="p-8 text-[10px] font-black text-primary/40 uppercase tracking-widest leading-none">Retailer Account</th>
                  <th className="p-8 text-[10px] font-black text-primary/40 uppercase tracking-widest text-center leading-none">Load Volume</th>
                  <th className="p-8 text-[10px] font-black text-primary/40 uppercase tracking-widest text-right leading-none">Valuation ($)</th>
                  <th className="p-8 text-[10px] font-black text-primary/40 uppercase tracking-widest text-center leading-none">Protocol Status</th>
                  <th className="p-8 text-[10px] font-black text-primary/40 uppercase tracking-widest leading-none">Field Specialist</th>
                  <th className="p-8 text-[10px] font-black text-primary/40 uppercase tracking-widest text-right leading-none">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 transition-colors">
                {filteredOrders.map((o: any) => (
                  <tr key={o.id} onClick={() => navigate(`/admin/orders/${o.id}`)} className="hover:bg-bone dark:hover:bg-primary/5 group cursor-pointer transition-colors">
                    <td className="p-8">
                       <code className="text-[11px] font-black text-primary dark:text-gold uppercase bg-primary/5 dark:bg-gold/5 px-2 py-0.5">{o.id}</code>
                    </td>
                    <td className="p-8">
                       <div className="space-y-1">
                          <p className="text-[14px] font-black text-primary dark:text-white uppercase tracking-tight leading-none">{o.retailer}</p>
                          <p className="text-[8px] font-bold text-primary/30 dark:text-white/20 uppercase tracking-widest italic leading-none">Certified Partner Node</p>
                       </div>
                    </td>
                    <td className="p-8 text-center">
                       <div className="flex flex-col items-center gap-1 group-hover:scale-110 transition-transform">
                          <p className="text-[14px] font-black text-primary dark:text-white uppercase tracking-tighter leading-none">{o.itemsCount}</p>
                          <p className="text-[8px] font-bold text-primary/30 dark:text-white/20 uppercase tracking-widest leading-none mt-1">UNITS</p>
                       </div>
                    </td>
                    <td className="p-8 text-right font-black text-primary dark:text-white text-lg tracking-tighter">
                       ${o.value.toLocaleString()}
                    </td>
                    <td className="p-8 text-center">
                       <div className={`inline-flex items-center gap-2 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border ${o.status === 'ON_HOLD' ? 'bg-red-500/10 text-red-500 border-red-500/20' : o.status === 'PENDING' ? 'bg-bone dark:bg-dark text-primary/30 border-primary/10' : o.status === 'PROCESSING' ? 'bg-gold/5 text-gold border-gold/20' : 'bg-primary/5 text-primary border-primary/10'}`}>
                         <div className={`w-1 h-1 rounded-full ${o.status === 'ON_HOLD' ? 'bg-red-500 shadow-[0_0_8px_red]' : o.status === 'PENDING' ? 'bg-primary/20' : o.status === 'PROCESSING' ? 'bg-gold shadow-[0_0_8px_#C6AD8F]' : 'bg-primary'}`} />
                         {o.status}
                       </div>
                    </td>
                    <td className="p-8">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 flex items-center justify-center bg-bone dark:bg-dark-surface text-[9px] font-black text-primary/40 group-hover:bg-primary group-hover:text-white transition-all">
                            <User size={12} strokeWidth={3} />
                         </div>
                         <span className="text-[10px] font-bold text-primary/40 dark:text-white/40 uppercase tracking-widest">{o.worker}</span>
                       </div>
                    </td>
                    <td className="p-8 text-right">
                       <button className="p-4 bg-white dark:bg-dark-surface border border-primary/5 text-primary/10 group-hover:text-gold transition-all shadow-sm">
                         <ExternalLink size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         <section className="bg-primary p-12 md:p-16 shadow-2xl relative overflow-hidden group border-b-4 border-b-gold">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[120px] pointer-events-none group-hover:bg-white/10 transition-all duration-1000" />
            <div className="relative z-10 space-y-16">
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gold mb-4">
                     <Globe size={20} className="animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-[0.4em]">LIVE_LOGISTICS_PULSE</span>
                  </div>
                  <h4 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.85]">Fulfillment <br /> Distribution_</h4>
                  <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.4em]">Real-time Nodal Logistics Integrity Log | v4.0</p>
               </div>
               <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                  {[
                    { label: 'TOTAL QUEUE', val: orders.length.toString(), icon: Package }, 
                    { label: 'ON_HOLD ALERT', val: orders.filter((o: any) => o.status === 'ON_HOLD').length.toString(), icon: AlertTriangle }, 
                    { label: 'PICK SUCCESS', val: '99.8%', icon: Zap }, 
                    { label: 'AVG LEAD TIME', val: '2.4D', icon: Clock }
                  ].map(stat => (
                     <div key={stat.label} className="space-y-2 border-l border-white/10 pl-6 group/stat hover:border-gold transition-colors">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                           <stat.icon size={10} /> {stat.label}
                        </p>
                        <p className="text-4xl font-black text-white tracking-tighter group-hover/stat:text-gold transition-colors">{stat.val}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         <section className="floating-card p-12 md:p-16 flex flex-col justify-between">
            <div className="space-y-12">
               <div className="space-y-3">
                  <h4 className="text-3xl font-black text-primary dark:text-white uppercase tracking-tighter">RESOURCE_ALLOCATION_</h4>
                  <p className="text-[11px] font-bold text-primary/20 dark:text-white/20 uppercase tracking-widest italic">Inventory Specialist Load Factor & Workflow Capacity</p>
               </div>
               <div className="space-y-6">
                  <div className="p-8 bg-bone dark:bg-dark-surface border border-primary/5 flex items-center justify-between group hover:bg-gold/5 transition-all">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 border border-primary/10 flex items-center justify-center text-primary/20 dark:text-white/10 group-hover:text-gold transition-colors"><AlertCircle size={24} /></div>
                        <div className="space-y-1">
                           <p className="text-[11px] font-black text-primary dark:text-white uppercase tracking-widest">Unassigned Queued Nodes</p>
                           <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">Awaiting Command</p>
                        </div>
                     </div>
                     <p className="text-4xl font-black text-gold tracking-tight">04</p>
                  </div>
                  <div className="p-8 bg-bone dark:bg-dark-surface border border-primary/5 flex items-center justify-between group hover:bg-primary/5 transition-all">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 border border-primary/10 flex items-center justify-center text-primary/20 dark:text-white/10 group-hover:text-primary dark:group-hover:text-gold transition-colors"><CheckCircle2 size={24} /></div>
                        <div className="space-y-1">
                           <p className="text-[11px] font-black text-primary dark:text-white uppercase tracking-widest">Active Dispatch Threads</p>
                           <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">Protocol Nominal</p>
                        </div>
                     </div>
                     <p className="text-4xl font-black text-primary dark:text-white tracking-tight">14</p>
                  </div>
               </div>
            </div>
            <button className="w-full h-20 bg-white dark:bg-dark-surface border-2 border-primary/20 dark:border-white/5 text-primary dark:text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-xl mt-12">
               INITIATE BULK ASSIGNMENT_PROTOCOL
            </button>
         </section>
      </div>
    </div>
  );
}
