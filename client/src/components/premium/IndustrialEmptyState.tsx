import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface IndustrialEmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  primaryActionPath?: string;
}

export function IndustrialEmptyState({ 
  icon: Icon, 
  title, 
  message, 
  actionText, 
  onAction,
  primaryActionPath 
}: IndustrialEmptyStateProps) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) onAction();
    else if (primaryActionPath) navigate(primaryActionPath);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center space-y-8 max-w-md mx-auto"
    >
      <div className="relative">
        <div className="w-24 h-24 bg-black rounded-[32px] flex items-center justify-center text-[#D6D6D6] shadow-2xl relative z-10">
          <Icon size={40} strokeWidth={1.5} />
        </div>
        <div className="absolute -inset-4 bg-black/5 rounded-[40px] blur-xl" />
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl md:text-3xl font-black text-black tracking-tighter uppercase leading-none">{title}</h3>
        <p className="text-[11px] md:text-[13px] font-bold text-black/40 uppercase tracking-widest leading-relaxed">
          {message}
        </p>
      </div>

      {actionText && (
        <button 
          onClick={handleAction}
          className="group flex items-center gap-4 px-12 py-5 bg-black text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-black/80 transition-all active:scale-95 shadow-xl"
        >
          {actionText}
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
             <span className="text-[14px]">→</span>
          </div>
        </button>
      )}
    </motion.div>
  );
}
