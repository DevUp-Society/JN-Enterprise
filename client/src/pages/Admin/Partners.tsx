import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Building2, MapPin, Calendar, Layers } from 'lucide-react';
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
    <div className="space-y-8 pb-24 select-none">
      <header className="flex flex-col gap-6 border-b border-[#000000]/10 pb-8 mt-4">
        <div className="flex items-center justify-between">
           <h1 className="text-3xl font-black text-[#000000] tracking-tight uppercase">
              Partner Registry
           </h1>
        </div>

        <div className="flex items-center gap-6">
           <div className="relative group flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#000000]/20 group-focus-within:text-[#000000] transition-all" size={20} />
              <input 
                type="text" 
                placeholder="SYNC_PARTNER_IDENTIFIER_OR_LOC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-16 bg-[#D6D6D6]/30 border-2 border-transparent rounded-[24px] pl-16 pr-8 text-[11px] font-black tracking-widest text-[#000000] focus:outline-none focus:border-[#000000]/10 focus:bg-white transition-all placeholder:text-[#000000]/20 shadow-inner uppercase"
              />
           </div>
        </div>
      </header>

      {/* REGISTRY_LIST_PROTOCOL */}
      <main className="bg-white border-2 border-[#000000]/5 shadow-2xl rounded-[48px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#000000] text-[#D6D6D6]">
              <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] pl-10">Business Identifier</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em]">Location Node</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em]">Last Sync</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em]">Lifecycle Vol</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-right pr-10">Valuation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#000000]/5">
            {filteredPartners.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-20 text-center text-sm font-medium text-[#000000]/40">
                   No partners found in the system registry.
                </td>
              </tr>
            ) : (
              filteredPartners.map((partner: any) => (
                <motion.tr 
                  key={partner.id || Math.random()}
                  onClick={() => navigate(`/admin/partners/${partner.id}`)}
                  className="group cursor-pointer hover:bg-[#D6D6D6]/30 transition-all"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="p-8 pl-10 text-sm font-black text-[#000000] uppercase tracking-tighter whitespace-nowrap">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-[#D6D6D6] rounded-2xl flex items-center justify-center border-2 border-[#000000]/5 group-hover:bg-[#000000] group-hover:text-[#D6D6D6] transition-all shadow-sm">
                          <Building2 size={20} className="text-[#000000]/20 group-hover:text-white" />
                        </div>
                        <div className="flex flex-col">
                           <span>{partner.name || 'Unknown Entity'}</span>
                           <span className="text-[9px] font-black text-[#000000]/20 uppercase tracking-widest mt-0.5">Verified Partner</span>
                        </div>
                     </div>
                  </td>
                  <td className="p-8 text-[11px] font-black text-[#000000]/60 uppercase tracking-widest">
                     <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-[#FFFFFF]" />
                        {partner.location || 'N/A'}
                     </div>
                  </td>
                  <td className="p-8 text-[11px] font-black text-[#000000]/60 uppercase tracking-widest">
                     <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-[#FFFFFF]" />
                        {partner.lastOrderDate ? new Date(partner.lastOrderDate).toLocaleDateString() : 'NO_ACTIVITY'}
                     </div>
                  </td>
                  <td className="p-8 text-[11px] font-black text-[#000000]/40 uppercase tracking-widest">
                     <div className="flex items-center gap-3">
                        <Layers size={16} className="text-[#FFFFFF]" />
                        <span className="text-[14px] font-black text-[#000000]">{partner.orderVolume || 12}</span>
                     </div>
                  </td>
                  <td className="p-8 pr-10 text-right font-black text-[#000000] tracking-tighter">
                     <div className="flex items-center justify-end gap-6">
                        <span className="text-xl">₹{(partner.lifetimeRevenue ?? 0).toLocaleString()}</span>
                        <div className="w-10 h-10 rounded-full bg-white border-2 border-[#000000]/5 flex items-center justify-center text-[#000000]/10 group-hover:text-[#000000] group-hover:bg-[#D6D6D6] group-hover:rotate-45 transition-all shadow-sm">
                           <ChevronRight size={20} />
                        </div>
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










