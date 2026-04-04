import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface IndustrialAlertProps {
  message: string;
  onRetry?: () => void;
  code?: string;
}

export const IndustrialAlert = ({ message, onRetry, code = 'ERR_CON_TIMEOUT' }: IndustrialAlertProps) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white border-2 border-black/20 p-12 flex flex-col items-center justify-center space-y-8 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-black" />
    <div className="p-6 bg-black/10 rounded-full border border-black/20 mb-4 animate-pulse">
      <AlertTriangle size={48} className="text-black" />
    </div>

    <div className="space-y-3">
      <div className="flex items-center justify-center gap-4">
        <div className="h-[1px] w-8 bg-black/20" />
        <span className="text-[10px] font-black tracking-widest-xl text-black uppercase">System Disturbance Detected</span>
        <div className="h-[1px] w-8 bg-black/20" />
      </div>
      <h2 className="text-3xl font-black text-slate tracking-tighter uppercase leading-tight">{code}</h2>
      <p className="text-[11px] font-bold text-slate/50 uppercase tracking-widest px-10 leading-relaxed">
        {message}
      </p>
    </div>

    <div className="flex items-center gap-4 pt-4">
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-4 bg-slate text-white px-10 py-4 text-[10px] font-black tracking-widest-xl uppercase hover:bg-gold transition-all shadow-lg active:scale-95 group"
        >
          <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          Re-establish Connection
        </button>
      )}
    </div>

    <div className="absolute bottom-4 right-6 pointer-events-none">
       <span className="text-[8px] font-black italic text-black/20 uppercase tracking-widest opacity-40">Protocol Violation v4.0.2</span>
    </div>
  </motion.div>
);










