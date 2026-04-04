import { useEffect, useState } from 'react';
import { 
  Package, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  AlertTriangle,
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
    <div className="space-y-8 pb-24 select-none">
      <header className="flex flex-col gap-6 border-b border-[#000000]/10 pb-8 mt-4">
        <div className="flex items-center">
           <h1 className="text-3xl font-black text-[#000000] tracking-tight uppercase">
              Order Registry
           </h1>
        </div>
      </header>
         <div className="h-24 w-full bg-[#D6D6D6]/30 animate-pulse rounded-[32px]" />
         <div className="h-[600px] w-full bg-[#D6D6D6]/30 animate-pulse rounded-[32px]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 select-none">
      <header className="flex flex-col gap-6 border-b border-[#000000]/10 pb-8 mt-4">
        <div className="flex items-center">
           <h1 className="text-3xl font-black text-[#000000] tracking-tight uppercase">
              Order Registry
           </h1>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-6 bg-white p-8 rounded-[40px] shadow-2xl border-2 border-[#000000]/5 relative overflow-hidden group">
        <div className="flex-1 relative">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#000000]/20" size={20} />
           <input 
             type="text" 
             placeholder="SYNC_ORDER_ID_OR_PARTNER..." 
             className="w-full h-14 bg-[#D6D6D6]/30 border-2 border-transparent rounded-[24px] pl-16 pr-8 text-[11px] font-black tracking-widest focus:border-[#000000]/10 focus:bg-white focus:outline-none transition-all placeholder:text-[#000000]/20 text-[#000000] uppercase shadow-inner" 
           />
        </div>
        <div className="flex bg-[#D6D6D6]/50 border-2 border-[#000000]/5 p-1.5 rounded-[28px] shadow-inner overflow-x-auto custom-scrollbar">
          {['ALL', 'PENDING', 'PROCESSING', 'ON_HOLD', 'SHIPPED', 'PACKED'].map(f => (
            <button 
               key={f} 
               onClick={() => setFilter(f)} 
               className={`px-8 h-12 text-[10px] font-black rounded-[22px] whitespace-nowrap transition-all uppercase tracking-widest ${filter === f ? 'bg-[#000000] text-[#D6D6D6] shadow-xl' : 'text-[#000000]/40 hover:text-[#000000] hover:bg-white'}`}
            >
               {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <section className="bg-white border-2 border-[#000000]/5 rounded-[48px] shadow-2xl min-h-[600px] overflow-hidden">
        {filteredOrders.length === 0 ? (
           <div className="p-32 flex flex-center">
             <ArchitecturalEmptyState 
               icon={Package}
               title="REGISTRY_EMPTY"
               subtitle="No logistical data streams match the current filter selection."
             />
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#000000] text-[#D6D6D6]">
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] leading-none">Order Identifier</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] leading-none">Partner Node</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-center leading-none">Quantity</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-right leading-none">Valuation</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-center leading-none">Status</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] leading-none">Personnel</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-right leading-none"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#000000]/5 transition-colors">
                {filteredOrders.map((o: any) => (
                  <tr key={o.id} onClick={() => navigate(`/admin/orders/${o.id}`)} className="hover:bg-[#D6D6D6]/40 group cursor-pointer transition-all">
                    <td className="px-10 py-8">
                       <code className="text-[11px] font-black text-[#000000]/40 uppercase tracking-widest">{o.id}</code>
                    </td>
                    <td className="px-10 py-8">
                       <div className="space-y-1">
                          <p className="text-[14px] font-black text-[#000000] uppercase tracking-tighter">{o.retailer}</p>
                          <p className="text-[10px] font-black text-[#000000]/20 uppercase tracking-[0.2em]">Institutional Hub</p>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-center text-[14px] font-black text-[#000000]">
                       {o.itemsCount} <span className="text-[10px] text-[#000000]/30 uppercase tracking-widest">PCS</span>
                    </td>
                    <td className="px-10 py-8 text-right font-black text-[#000000] text-[15px]">
                       ₹{o.value.toLocaleString()}
                    </td>
                    <td className="px-10 py-8 text-center flex justify-center">
                       <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-[16px] text-[9px] font-black uppercase tracking-[0.2em] border-2 shadow-sm ${o.status === 'ON_HOLD' ? 'bg-black/10 text-black border-black/10' : o.status === 'PENDING' ? 'bg-white text-[#000000]/40 border-[#000000]/5' : o.status === 'PROCESSING' ? 'bg-[#000000]/5 text-[#000000] border-[#000000]/5' : 'bg-[#FFFFFF]/10 text-[#2f5134] border-[#FFFFFF]/10'}`}>
                         <div className={`w-2 h-2 rounded-full ${o.status === 'ON_HOLD' ? 'bg-black animate-pulse' : o.status === 'PENDING' ? 'bg-[#000000]/10' : o.status === 'PROCESSING' ? 'bg-[#000000]' : 'bg-[#FFFFFF]'}`} />
                         {o.status.replace('_', ' ')}
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#D6D6D6] text-[#000000]/30 border-2 border-[#000000]/5 group-hover:bg-[#000000] group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
                            <User size={18} />
                         </div>
                         <span className="text-[11px] font-black text-[#000000]/40 uppercase tracking-widest">{o.worker}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <button className="w-12 h-12 rounded-full bg-white border-2 border-[#000000]/5 flex items-center justify-center text-[#000000]/20 group-hover:text-[#000000] group-hover:bg-[#D6D6D6] transition-all ml-auto shadow-sm">
                         <ExternalLink size={20} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12">
         <section className="bg-[#000000] p-12 md:p-16 shadow-2xl relative overflow-hidden group border-b-[8px] border-b-[#FFFFFF] rounded-[56px]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] pointer-events-none group-hover:bg-white/10 transition-all duration-1000" />
            <div className="relative z-10 flex flex-col h-full justify-between space-y-16">
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[#D6D6D6] mb-6">
                     <Globe size={24} className="animate-spin-slow" />
                     <span className="text-[10px] font-black uppercase tracking-[0.5em]">Live Logistics Pulse</span>
                  </div>
                  <h4 className="text-5xl md:text-6xl font-black text-white tracking-widest uppercase leading-tight">Fulfillment <br /> Distribution</h4>
                  <p className="text-[12px] font-black text-[#D6D6D6]/40 uppercase tracking-[0.4em] mt-4">Registry Integrity Nominal</p>
               </div>
               <div className="grid grid-cols-2 gap-x-12 gap-y-12">
                  {[
                    { label: 'Total Queue', val: orders.length.toString(), icon: Package }, 
                    { label: 'Critical Alerts', val: orders.filter((o: any) => o.status === 'ON_HOLD').length.toString(), icon: AlertTriangle }, 
                    { label: 'Pick Accuracy', val: '99.8%', icon: Zap }, 
                    { label: 'Lead Velocity', val: '2.4D', icon: Clock }
                  ].map(stat => (
                     <div key={stat.label} className="space-y-4 border-l-4 border-white/5 pl-8 group/stat hover:border-[#D6D6D6] transition-all">
                        <p className="text-[10px] font-black text-[#D6D6D6]/30 uppercase tracking-[0.3em] flex items-center gap-3">
                           <stat.icon size={14} /> {stat.label}
                        </p>
                        <p className="text-5xl font-black text-[#D6D6D6] tracking-tighter group-hover/stat:text-white transition-colors">{stat.val}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>
 
         <section className="bg-white border-2 border-[#000000]/5 shadow-2xl rounded-[56px] p-12 md:p-16 flex flex-col justify-between">
            <div className="space-y-12">
               <div className="space-y-3">
                  <h4 className="text-4xl font-black text-[#000000] uppercase tracking-tighter">Resource Load_</h4>
                  <p className="text-[10px] font-black text-[#000000]/30 uppercase tracking-[0.3em]">Personnel Capacity Registry Summary</p>
               </div>
               <div className="space-y-6">
                  <div className="p-10 bg-[#D6D6D6]/30 border-2 border-transparent rounded-[32px] flex items-center justify-between group hover:bg-white hover:border-[#000000]/5 transition-all shadow-inner">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#000000]/10 group-hover:text-black shadow-xl transition-all scale-110"><AlertCircle size={28} /></div>
                        <div className="space-y-1">
                           <p className="text-[15px] font-black text-[#000000] uppercase tracking-tight">Unassigned Nodes</p>
                           <p className="text-[9px] font-black text-black uppercase tracking-[0.4em]">IMMEDIATE_ACTION</p>
                        </div>
                     </div>
                     <p className="text-5xl font-black text-black tracking-tighter leading-none">04</p>
                  </div>
                  <div className="p-10 bg-[#D6D6D6]/30 border-2 border-transparent rounded-[32px] flex items-center justify-between group hover:bg-white hover:border-[#000000]/5 transition-all shadow-inner">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#000000]/10 group-hover:text-[#FFFFFF] shadow-xl transition-all scale-110"><CheckCircle2 size={28} /></div>
                        <div className="space-y-1">
                           <p className="text-[15px] font-black text-[#000000] uppercase tracking-tight">Active Dispatch</p>
                           <p className="text-[9px] font-black text-[#FFFFFF] uppercase tracking-[0.4em]">PROTOCOL_NOMINAL</p>
                        </div>
                     </div>
                     <p className="text-5xl font-black text-[#000000] tracking-tighter leading-none">14</p>
                  </div>
               </div>
            </div>
            <button className="w-full h-20 bg-[#000000] text-[#D6D6D6] rounded-[32px] text-[12px] font-black uppercase tracking-[0.5em] hover:bg-[#FFFFFF] transition-all mt-12 shadow-2xl active:scale-[0.98]">
               INIT_BULK_ASSIGNMENT
            </button>
         </section>
      </div>
    </div>
  );
}










