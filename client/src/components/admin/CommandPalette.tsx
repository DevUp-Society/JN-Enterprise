import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Users, X, ArrowRight } from 'lucide-react';
import { DataService } from '../../services/DataService';
import { useNavigate } from 'react-router-dom';

export default function CommandPalette({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ products: any[], retailers: any[] }>({ products: [], retailers: [] });
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 1) {
      setResults(DataService.searchGlobal(query));
    } else {
      setResults({ products: [], retailers: [] });
    }
  }, [query]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 md:px-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary/40 backdrop-blur-sm" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl bg-white shadow-2xl relative z-10 overflow-hidden border border-primary/20"
        >
          <div className="p-6 border-b border-primary/10 flex items-center gap-4 bg-bone">
             <Search size={24} className="text-primary/40" />
             <input 
               autoFocus
               type="text"
               placeholder="SEARCH MASTER REGISTRY (SKU, PRODUCT, PARTNER)..."
               className="flex-1 bg-transparent text-lg font-black uppercase tracking-widest focus:outline-none placeholder:text-primary/20"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
             />
             <button onClick={onClose} className="p-2 hover:bg-primary/5 transition-all text-primary/40 hover:text-primary">
                <X size={20} />
             </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4 scrollbar-hide">
            {query.length <= 1 && (
              <div className="py-12 text-center space-y-2 opacity-30">
                 <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Input Protocol</p>
                 <p className="text-[8px] font-bold uppercase tracking-widest">Type to search 100+ items and 20+ partners</p>
              </div>
            )}

            {query.length > 1 && (
              <div className="space-y-8">
                {/* Products Section */}
                {results.products.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-primary/40 uppercase tracking-[.3em] px-2 flex justify-between">
                       <span>Products Registry</span>
                       <span>{results.products.length} Found</span>
                    </h4>
                    <div className="space-y-1">
                      {results.products.slice(0, 10).map((p: any) => (
                        <div 
                          key={p.id}
                          onClick={() => { navigate('/admin/inventory'); onClose(); }}
                          className="flex items-center gap-4 p-4 hover:bg-primary/5 cursor-pointer group transition-all border border-transparent hover:border-primary/10"
                        >
                          <div className="w-10 h-10 bg-bone flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-white transition-all">
                             <Package size={18} />
                          </div>
                          <div className="flex-1">
                             <p className="text-[8px] font-black text-primary/30 uppercase tracking-widest">{p.sku}</p>
                             <p className="text-sm font-black text-primary uppercase tracking-tight">{p.name}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-black text-primary">${p.price}</p>
                             <p className={`text-[8px] font-bold ${p.stock < 20 ? 'text-gold' : 'text-primary/30'}`}>STOCK: {p.stock}</p>
                          </div>
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-gold translate-x-[-10px] group-hover:translate-x-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Retailers Section */}
                {results.retailers.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-primary/40 uppercase tracking-[.3em] px-2 flex justify-between">
                       <span>Partner Network</span>
                       <span>{results.retailers.length} Found</span>
                    </h4>
                    <div className="space-y-1">
                      {results.retailers.map((r: any) => (
                        <div 
                          key={r.id}
                          onClick={() => { navigate('/admin/partners'); onClose(); }}
                          className="flex items-center gap-4 p-4 hover:bg-primary/5 cursor-pointer group transition-all border border-transparent hover:border-primary/10"
                        >
                          <div className="w-10 h-10 bg-bone flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-white transition-all">
                             <Users size={18} />
                          </div>
                          <div className="flex-1">
                             <p className="text-[8px] font-black text-primary/30 uppercase tracking-widest">{r.id}</p>
                             <p className="text-sm font-black text-primary uppercase tracking-tight">{r.name}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-black text-primary">${(r.lifetimeRevenue / 1000).toFixed(1)}K LTV</p>
                             <p className="text-[8px] font-bold text-primary/30 uppercase tracking-widest">{r.location}</p>
                          </div>
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-gold translate-x-[-10px] group-hover:translate-x-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.products.length === 0 && results.retailers.length === 0 && (
                  <div className="py-20 text-center space-y-4">
                     <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary/30">Zero Matches Found In Cluster</p>
                     <button onClick={() => setQuery('')} className="text-[9px] font-black uppercase text-gold hover:underline">Clear Search Protocol</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 bg-bone border-t border-primary/10 flex justify-between items-center opacity-40">
             <div className="flex gap-4">
                <p className="text-[8px] font-bold uppercase tracking-widest">ESC to close</p>
                <p className="text-[8px] font-bold uppercase tracking-widest">Enter to select</p>
             </div>
             <p className="text-[8px] font-black uppercase tracking-[0.2em]">JN_COMMAND_V3.0</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
