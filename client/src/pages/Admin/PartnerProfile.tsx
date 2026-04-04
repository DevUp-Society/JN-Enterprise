import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Box, 
  CreditCard, 
  Clock, 
  ChevronRight, 
  ArrowLeft,
  Calendar,
  Wallet
} from 'lucide-react';
import { DataService } from '../../services/DataService';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

export default function PartnerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const partner = DataService.getPartnerById(id!);
  const orders = DataService.getOrdersByPartner(id!);

  if (!partner) return <div className="py-40 text-center uppercase font-black text-primary/10 tracking-[0.5em]">PARTNER_NOT_FOUND_</div>;

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: Calendar, color: 'text-primary' },
    { label: 'Pending Shipments', value: orders.filter((o: any) => o.status === 'PROCESSING').length, icon: Box, color: 'text-gold' },
    { label: 'Outstanding Balance', value: '₹' + (partner.lifetimeRevenue * 0.15).toLocaleString(), icon: CreditCard, color: 'text-black' }
  ];

  return (
    <div className="space-y-10 pb-24 font-mono select-none">
      {/* TERMINAL_HEADER_PROTOCOL */}
      <header className="flex flex-col gap-10 border-b border-primary/10 pb-12">
        <div className="flex items-center gap-10">
           <button 
              onClick={() => navigate('/admin/partners')}
              className="p-3 hover:bg-gold/10 rounded-full transition-all text-primary/40 hover:text-primary shadow-sm bg-white dark:bg-dark-surface border border-primary/5"
           >
              <ArrowLeft size={24} />
           </button>
           <h1 className="text-3xl font-black text-primary dark:text-bone tracking-tighter uppercase leading-none">
              PARTNER: {partner.name}
           </h1>
           <div className="h-[1px] flex-1 bg-primary/5 mx-10" />
        </div>

        <Breadcrumbs 
           items={[
             { label: 'PARTNERS', path: '/admin/partners' },
             { label: partner.name }
           ]} 
        />
      </header>

      {/* KPI_GRID_PROTOCOL */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
           <motion.div 
              key={idx}
              className="bg-white dark:bg-dark-surface p-10 border border-primary/10 shadow-2xl space-y-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
           >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-primary/5 flex items-center justify-center border border-primary/5">
                    <stat.icon size={20} className={stat.color} />
                 </div>
                 <span className="text-[10px] font-black text-primary/30 uppercase tracking-widest">{stat.label}</span>
              </div>
              <p className="text-4xl font-black text-primary tracking-tighter uppercase leading-none">{stat.value}</p>
           </motion.div>
        ))}
      </section>

      {/* ORDER_HISTORY_LEDGER */}
      <main className="space-y-8">
        <div className="flex items-center gap-6 border-l-4 border-gold pl-6">
           <h3 className="text-[12px] font-black text-primary dark:text-white uppercase tracking-[0.4em]">Order History</h3>
           <div className="h-[1px] flex-1 bg-primary/5" />
        </div>

        <div className="bg-white dark:bg-dark-surface border border-primary/10 shadow-2xl overflow-hidden">
           <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#4B5E6D] text-white border-b border-primary/10">
                  <th className="p-8 text-[9px] font-black uppercase tracking-widest">Order ID</th>
                  <th className="p-8 text-[9px] font-black uppercase tracking-widest">Order Date</th>
                  <th className="p-8 text-[9px] font-black uppercase tracking-widest text-center">Delivery Status</th>
                  <th className="p-8 text-[9px] font-black uppercase tracking-widest text-center">Item Count</th>
                  <th className="p-8 text-[9px] font-black uppercase tracking-widest text-right">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {orders.map((order: any) => (
                   <motion.tr 
                      key={order.id}
                      onClick={() => navigate(`/admin/partners/${partner.id}/orders/${order.id}`)}
                      className="group cursor-pointer hover:bg-gold/5 transition-all text-[11px]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                   >
                      <td className="p-8 font-black text-primary tracking-widest uppercase">#{order.id}</td>
                      <td className="p-8 font-bold text-primary/40 uppercase tracking-widest">
                         <div className="flex items-center gap-2">
                            <Clock size={14} className="opacity-30" />
                            {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                         </div>
                      </td>
                      <td className="p-8">
                         <div className="flex flex-col items-center gap-2">
                            <div className={`px-4 h-6 border flex items-center justify-center text-[8px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-black/10 text-black border-black/20' : 'bg-gold/10 text-gold border-gold/20'}`}>
                               {order.status}
                            </div>
                         </div>
                      </td>
                      <td className="p-8 text-center font-black text-primary/40 tracking-[0.2em]">{order.items?.length || 5} PIECES</td>
                      <td className="p-8 text-right font-black text-primary tracking-tighter">
                         <div className="flex items-center justify-end gap-3 text-lg">
                            <Wallet size={14} className="opacity-20" />
                            ₹{(order.total ?? order.value ?? 0).toLocaleString()}
                            <ChevronRight size={14} className="text-primary/10 group-hover:text-gold group-hover:translate-x-2 transition-all" />
                         </div>
                      </td>
                   </motion.tr>
                ))}
              </tbody>
           </table>
        </div>
      </main>
    </div>
  );
}










