import { NavLink } from 'react-router-dom';
import { 
  ShieldCheck,
  User
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

interface WorkerSidebarProps {
  issuesCount?: number;
}

export default function WorkerSidebar({ issuesCount = 0 }: WorkerSidebarProps) {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'queue', label: 'OPERATIONS_QUEUE', path: '/worker/orders' },
    { id: 'inventory', label: 'INVENTORY_PULSE', path: '/worker/inventory' },
    { id: 'archive', label: 'FULFILLMENT_ARCHIVE', path: '/worker/completed' },
    { id: 'settings', label: 'TERMINAL_SETTINGS', path: '/worker/settings' },
  ];

  return (
    <aside className="w-64 bg-[#D6D6D6] h-screen fixed left-0 top-0 flex flex-col border-r border-black/5 z-[100] selection:bg-black selection:text-[#D6D6D6]">
      {/* Institutional Branding */}
      <div className="p-10 border-b border-black/5 flex flex-col gap-2">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white shadow-lg">
               <ShieldCheck size={18} />
            </div>
            <h1 className="text-sm font-black tracking-widest text-black uppercase">JN ENTERPRISE</h1>
         </div>
      </div>

      {/* Primary Navigation Hub */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `
              group flex items-center px-6 py-4 text-[11px] font-bold uppercase tracking-widest rounded-[16px] transition-all duration-300 relative overflow-hidden
              ${isActive 
                ? 'bg-black text-white shadow-xl shadow-black/10' 
                : 'text-black/40 hover:text-black hover:bg-white/40'
              }
            `}
          >
            <span className="flex-1">{item.label}</span>
            {item.id === 'queue' && issuesCount > 0 && (
              <span className="bg-black text-white px-2 py-0.5 rounded-full text-[8px] animate-pulse">
                {issuesCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Personnel Profile & Session Termination */}
      <div className="p-6 border-t border-black/5 bg-black/[0.02] flex flex-col gap-6">
        <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-inner shrink-0">
               <User size={20} />
            </div>
          <div className="flex-1 min-w-0">
             <p className="text-[11px] font-black text-black truncate uppercase tracking-tighter">
                {user?.name || 'FIELD_OPERATIVE_01'}
             </p>
             <p className="text-[9px] font-bold text-black/30 uppercase tracking-widest">
                {user?.role || 'WORKER'}
             </p>
          </div>
          <button 
             onClick={logout}
             className="px-3 py-2 bg-black/5 hover:bg-black hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
          >
             LOGOUT
          </button>
        </div>
      </div>
    </aside>
  );
}
