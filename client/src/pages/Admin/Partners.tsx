import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Building2, MapPin, Calendar, Layers, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../../services/DataService';

export default function Partners() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const partners = DataService.getPartners() || [];

  const filteredPartners = useMemo(() => {
    if (!Array.isArray(partners)) return [];
    
    try {
      const q = searchQuery.toLowerCase();
      return partners.filter((p: any) => {
        const nameMatch = p?.name?.toString().toLowerCase().includes(q);
        const locationMatch = p?.location?.toString().toLowerCase().includes(q);
        return nameMatch || locationMatch;
      });
    } catch (err) {
      console.error("PARTNER_PROBE_FAILURE:", err);
      return partners;
    }
  }, [searchQuery, partners]);

  return (
    <div className="space-y-10 pb-24 font-mono select-none">
      {/* TERMINAL_HEADER_PROTOCOL */}
      <header className="flex flex-col gap-10 border-b border-primary/10 pb-12">
        <div className="flex items-center">
           <h1 className="text-3xl font-black text-primary dark:text-bone tracking-tighter uppercase leading-none">
              PARTNER REGISTRY
           </h1>
           <div className="h-[1px] flex-1 bg-primary/5 mx-10" />
        </div>

        <div className="flex items-center gap-10">
           <div className="relative group flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-gold transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="PROBE_PARTNER_DATA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-white dark:bg-dark-surface border border-primary/10 pl-14 pr-6 text-[11px] font-black tracking-widest uppercase focus:outline-none focus:border-primary transition-all placeholder:text-primary/10"
              />
           </div>
        </div>
      </header>

      {/* REGISTRY_LIST_PROTOCOL */}
      <main className="bg-white dark:bg-dark-surface border border-primary/10 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#4B5E6D] text-white border-b border-primary/10">
              <th className="p-8 text-[9px] font-black uppercase tracking-widest">Business Name</th>
              <th className="p-8 text-[9px] font-black uppercase tracking-widest">Location</th>
              <th className="p-8 text-[9px] font-black uppercase tracking-widest">Last Order Date</th>
              <th className="p-8 text-[9px] font-black uppercase tracking-widest">Total Order Volume</th>
              <th className="p-8 text-[9px] font-black uppercase tracking-widest text-right">Lifetime Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {filteredPartners.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-20 text-center text-[10px] font-black text-primary/20 uppercase tracking-[0.5em]">
                   NO_PARTNERS_FOUND_IN_REGISTRY
                </td>
              </tr>
            ) : (
              filteredPartners.map((partner: any) => (
                <motion.tr 
                  key={partner.id || Math.random()}
                  onClick={() => navigate(`/admin/partners/${partner.id}`)}
                  className="group cursor-pointer hover:bg-gold/5 transition-all"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="p-8 text-sm font-black text-primary tracking-tighter uppercase whitespace-nowrap">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/5 border border-primary/5 flex items-center justify-center group-hover:border-gold transition-all">
                          <Building2 size={16} className="text-primary/10 group-hover:text-gold" />
                        </div>
                        {partner.name || 'UNKNOWN_ENTITY'}
                     </div>
                  </td>
                  <td className="p-8 text-[11px] font-bold text-primary/40 uppercase tracking-widest">
                     <div className="flex items-center gap-2">
                        <MapPin size={14} className="opacity-30" />
                        {partner.location || 'N/A'}
                     </div>
                  </td>
                  <td className="p-8 text-[11px] font-bold text-primary/40 tracking-widest uppercase">
                     <div className="flex items-center gap-2">
                        <Calendar size={14} className="opacity-30" />
                        {partner.lastOrderDate ? new Date(partner.lastOrderDate).toLocaleDateString() : 'NO_DATE'}
                     </div>
                  </td>
                  <td className="p-8 text-[11px] font-black text-primary/60 tracking-[0.2em]">
                     <div className="flex items-center gap-2">
                        <Layers size={14} className="opacity-30" />
                        {partner.orderVolume || 12} ORDERS
                     </div>
                  </td>
                  <td className="p-8 text-right font-black text-primary tracking-tighter">
                     <div className="flex items-center justify-end gap-3">
                        <Wallet size={14} className="opacity-20" />
                        <span className="text-lg">₹{(partner.lifetimeRevenue ?? 0).toLocaleString()}</span>
                        <ChevronRight size={14} className="text-primary/10 group-hover:text-gold group-hover:translate-x-2 transition-all" />
                     </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
