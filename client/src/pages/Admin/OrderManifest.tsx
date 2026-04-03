import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, DollarSign, Wallet } from 'lucide-react';
import { DataService } from '../../services/DataService';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

export default function OrderManifest() {
  const { id, orderId } = useParams();
  const navigate = useNavigate();
  const partner = DataService.getPartnerById(id!);
  const order = DataService.getOrders().find((o: any) => o.id === orderId);
  const items = DataService.getOrderManifest(orderId!);

  if (!order || !partner) return <div className="py-40 text-center uppercase font-black text-primary/10 tracking-[0.5em]">MANIFEST_NOT_FOUND_</div>;

  return (
    <div className="space-y-10 pb-24 font-mono select-none">
      {/* TERMINAL_HEADER_PROTOCOL */}
      <header className="flex flex-col gap-10 border-b border-primary/10 pb-12">
        <div className="flex items-center">
           <h1 className="text-3xl font-black text-primary dark:text-bone tracking-tighter uppercase leading-none">
              ORDER_MANIFEST: #{order.id}
           </h1>
           <div className="h-[1px] flex-1 bg-primary/5 mx-10" />
           <button 
              onClick={() => navigate(`/admin/partners/${id}`)}
              className="px-8 h-12 bg-white dark:bg-dark-surface border border-primary/10 flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-lg group"
           >
              <ArrowLeft size={16} className="text-primary/20 group-hover:text-white" />
              BACK_TO_PROFILE
           </button>
        </div>

        <Breadcrumbs 
           items={[
             { label: 'PARTNERS', path: '/admin/partners' },
             { label: partner.name, path: `/admin/partners/${id}` },
             { label: `ORDER #${order.id}` }
           ]} 
        />
      </header>

      {/* MANIFEST_LEDGER_LEDGER */}
      <main className="bg-white dark:bg-dark-surface border border-primary/10 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#4B5E6D] text-white border-b border-primary/10">
              <th className="p-8 text-[9px] font-black uppercase tracking-widest w-24">Product Image</th>
              <th className="p-8 text-[9px] font-black uppercase tracking-widest">Product Name</th>
              <th className="p-8 text-[9px] font-black uppercase tracking-widest">SKU</th>
              <th className="p-8 text-[9px] font-black uppercase tracking-widest text-center">Quantity Ordered</th>
              <th className="p-8 text-[9px] font-black uppercase tracking-widest">Unit Price</th>
              <th className="p-8 text-[9px] font-black uppercase tracking-widest text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {items.map((item: any, idx: number) => (
              <motion.tr 
                key={idx}
                className="group hover:bg-gold/5 transition-all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td className="p-8">
                   <div className="w-16 h-16 border-2 border-primary/5 p-1 bg-white flex items-center justify-center group-hover:border-gold transition-all overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                   </div>
                </td>
                <td className="p-8 text-[11px] font-black text-primary uppercase tracking-widest">
                   {item.name}
                </td>
                <td className="p-8 text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                   <div className="flex items-center gap-2">
                      <Package size={14} className="opacity-20" />
                      {item.sku}
                   </div>
                </td>
                <td className="p-8 text-center text-[11px] font-black text-primary/60 tracking-widest uppercase">
                   {item.quantity} UNITS
                </td>
                <td className="p-8 text-[11px] font-black text-primary/40 tracking-tighter uppercase whitespace-nowrap">
                   <div className="flex items-center gap-2">
                      <DollarSign size={12} className="opacity-10" />
                      ₹{(item.price || 500).toLocaleString()}
                   </div>
                </td>
                <td className="p-8 text-right font-black text-primary tracking-tighter whitespace-nowrap">
                   <div className="flex items-center justify-end gap-3 text-lg">
                      <Wallet size={14} className="opacity-20" />
                      ₹{(item.quantity * (item.price || 500)).toLocaleString()}
                   </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
          <tfoot className="border-t border-primary/20 bg-primary/5">
            <tr>
              <td colSpan={5} className="p-8 text-right text-[10px] font-black uppercase tracking-widest text-primary/30 italic">Order Aggregation Protocol</td>
              <td className="p-8 text-right font-black text-primary tracking-tighter text-2xl">
                 <div className="flex items-center justify-end gap-4 text-primary">
                    <span className="text-[10px] uppercase font-black tracking-widest opacity-30 italic leading-none">Inbound_Total:</span>
                    ₹{(order.total ?? order.value ?? 0).toLocaleString()}
                 </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </main>
    </div>
  );
}
