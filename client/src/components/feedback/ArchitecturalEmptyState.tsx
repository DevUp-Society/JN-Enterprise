import { motion } from 'framer-motion';
import { Search, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  subtitle: string;
  actionText?: string;
  actionPath?: string;
}

export default function ArchitecturalEmptyState({ 
  icon: Icon = Search, 
  title, 
  subtitle, 
  actionText, 
  actionPath 
}: EmptyStateProps) {
  return (
    <div className="py-40 bg-white border border-primary/5 flex flex-col items-center justify-center space-y-10 group relative overflow-hidden">
      {/* Decorative pulse background */}
      <div className="absolute inset-0 bg-primary/[0.02] jn-loader pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-32 h-32 bg-bone border border-primary/10 flex items-center justify-center text-primary/10 group-hover:text-gold group-hover:border-gold transition-all duration-700 relative z-10"
      >
        <Icon size={48} strokeWidth={1.5} />
      </motion.div>

      <div className="text-center space-y-4 relative z-10">
        <h3 className="text-4xl font-black text-primary uppercase tracking-tighter leading-none">{title}_</h3>
        <p className="text-[12px] font-bold text-primary/30 uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {actionText && actionPath && (
        <Link 
          to={actionPath} 
          className="relative z-10 px-12 py-6 bg-primary text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gold shadow-2xl transition-all active:scale-95"
        >
          {actionText}
        </Link>
      )}

      {/* Industrial Grid underlay */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-primary/10" />
      <div className="absolute inset-y-0 right-0 w-px bg-primary/10" />
    </div>
  );
}
