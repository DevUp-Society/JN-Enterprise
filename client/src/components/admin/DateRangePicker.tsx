import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, X } from 'lucide-react';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (start: Date, end: Date) => void;
  isMobile?: boolean;
}

export default function DateRangePicker({ startDate, endDate, onChange, isMobile }: DateRangePickerProps) {
  const [isOpen, setIsOpen ] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  const presets: { id: string; label: string; getRange: () => [Date, Date] }[] = [
    { id: '24h', label: '24H', getRange: () => [new Date(Date.now() - 24*60*60*1000), new Date()] as [Date, Date] },
    { id: '7d', label: '7D', getRange: () => [new Date(Date.now() - 7*24*60*60*1000), new Date()] as [Date, Date] },
    { id: '30d', label: '30D', getRange: () => [new Date(Date.now() - 30*24*60*60*1000), new Date()] as [Date, Date] },
  ];

  const [activePreset, setActivePreset] = useState<string | null>('30d');

  const handlePreset = (id: string, getRange: () => [Date, Date]) => {
    const [start, end] = getRange();
    onChange(start, end);
    setActivePreset(id);
    setIsCustomMode(false);
    setIsOpen(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }).toUpperCase();
  };

  const handleCustomSubmit = () => {
    if (startInputRef.current?.value && endInputRef.current?.value) {
       onChange(new Date(startInputRef.current.value), new Date(endInputRef.current.value));
       setActivePreset(null);
       setIsCustomMode(false);
    }
  };

  if (isMobile) {
    return (
      <>
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-32 right-8 w-16 h-16 bg-primary text-white flex items-center justify-center shadow-2xl z-[80] active:scale-95 transition-transform"
        >
          <Clock size={24} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-[100]"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface z-[110] p-10 space-y-10 border-t border-primary/10"
              >
                <div className="flex justify-between items-center">
                   <h3 className="text-xl font-black text-primary dark:text-white uppercase tracking-tighter">Temporal_Range_</h3>
                   <button onClick={() => setIsOpen(false)} className="p-3 text-primary/20"><X size={20} /></button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   {presets.map(p => (
                     <button 
                        key={p.label}
                        onClick={() => handlePreset(p.id, p.getRange)}
                        className={`h-16 border border-primary/10 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activePreset === p.id ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'hover:bg-primary hover:text-white'}`}
                     >
                        {p.label}
                     </button>
                   ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-primary/5">
                   <p className="text-[9px] font-black text-primary/20 uppercase tracking-widest">Selected Period</p>
                   <div className="flex justify-between items-center text-sm font-black text-primary dark:text-white uppercase">
                      <span>{formatDate(startDate)}</span>
                      <span className="text-primary/20">—</span>
                      <span>{formatDate(endDate)}</span>
                   </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-dark-surface p-2 border border-primary/5 shadow-sm rounded-none">
       {/* High-Contrast Timeline Node */}
       <div className="flex items-center gap-4 px-4 bg-bone/30 dark:bg-white/5 py-2">
          <Clock size={14} className="text-black/40" />
          <div className="flex items-center gap-4">
             <div className="space-y-0 text-left">
                <p className="text-[7px] font-black text-black/40 uppercase tracking-widest">TIMELINE_START</p>
                <p className="text-[12px] font-black text-blue-900 dark:text-blue-400 leading-none">{formatDate(startDate)}</p>
             </div>
             <div className="w-[1px] h-6 bg-primary/10 mx-1" />
             <div className="space-y-0 text-left">
                <p className="text-[7px] font-black text-black/40 uppercase tracking-widest">TIMELINE_END</p>
                <p className="text-[12px] font-black text-blue-900 dark:text-blue-400 leading-none">{formatDate(endDate)}</p>
             </div>
          </div>
       </div>

       {/* Compact Preset Control Column */}
       <div className="flex items-center gap-1 border-l border-primary/10 pl-4">
          {presets.map(p => (
            <button 
               key={p.label}
               onClick={() => handlePreset(p.id, p.getRange)}
               className={`px-3 h-8 border text-[9px] font-black uppercase tracking-widest transition-all ${activePreset === p.id ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'border-primary/5 text-primary/40 dark:text-white/40 hover:bg-primary hover:text-white hover:border-primary'}`}
            >
               {p.label}
            </button>
          ))}
          
          <div className="relative">
             <button 
                onClick={() => setIsCustomMode(!isCustomMode)}
                className={`flex items-center gap-2 px-3 h-8 border ${isCustomMode || (activePreset === null) ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'border-primary/5 text-primary/40'} text-[9px] font-black uppercase tracking-widest hover:bg-[#1E3A8A] hover:text-white transition-all`}
             >
                <Calendar size={12} />
                CUSTOM
             </button>

             <AnimatePresence>
                {isCustomMode && (
                   <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-12 bg-white dark:bg-[#1A2530] p-8 border border-primary/20 shadow-[0_30px_60px_rgba(0,0,0,0.4)] z-[50] w-80 space-y-8"
                   >
                      <div className="grid grid-cols-1 gap-6">
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-primary/40 dark:text-white/40">START DATE</label>
                            <input ref={startInputRef} type="date" className="w-full h-12 px-4 bg-bone/50 dark:bg-dark border border-primary/10 text-[11px] font-black outline-none focus:border-[#1E3A8A] transition-colors dark:text-white" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-primary/40 dark:text-white/40">END DATE</label>
                            <input ref={endInputRef} type="date" className="w-full h-12 px-4 bg-bone/50 dark:bg-dark border border-primary/10 text-[11px] font-black outline-none focus:border-[#1E3A8A] transition-colors dark:text-white" />
                         </div>
                      </div>
                      <button 
                         onClick={handleCustomSubmit}
                         className="w-full h-12 bg-[#1E3A8A] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-colors"
                      >
                         ENTER
                      </button>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
       </div>
    </div>
  );
}
