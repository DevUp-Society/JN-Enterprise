import { 
  Search, 
  Bell, 
  Settings, 
  Maximize2
} from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="h-28 bg-white/80 dark:bg-dark/80 backdrop-blur-xl border-b border-primary/5 flex items-center justify-between px-12 sticky top-0 z-30 transition-all font-mono">
      {/* Left Axis: Empty/Spacer (Branding moved to Sidebar) */}
      <div className="flex-1" />

      {/* Right Axis: Utility Cluster */}
      <div className="flex items-center gap-10">
        <div className="relative group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-gold transition-colors" />
          <input 
            type="text" 
            placeholder="SEARCH_REGISTRY [CMD+K]" 
            className="bg-primary/5 border border-transparent focus:border-primary/10 focus:bg-white dark:focus:bg-dark-surface h-12 w-80 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
           <button className="p-3 text-primary/30 hover:text-primary dark:hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full border-2 border-white dark:border-dark" />
           </button>
           <button className="p-3 text-primary/30 hover:text-primary dark:hover:text-white transition-colors">
              <Settings size={20} />
           </button>
           <button className="p-3 text-primary/30 hover:text-primary dark:hover:text-white transition-colors">
              <Maximize2 size={20} />
           </button>
        </div>
      </div>
    </header>
  );
}










