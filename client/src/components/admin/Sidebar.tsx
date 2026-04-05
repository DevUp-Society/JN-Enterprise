import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

export default function Sidebar({ issuesCount = 0 }: { issuesCount?: number }) {
  const { user, logout } = useAuth();

  const navItems = [
    { 
      id: 'overview', 
      icon: LayoutDashboard, 
      label: 'Analytics Overview', 
      path: '/admin/overview',
      visible: user?.isSuperAdmin || user?.permissions?.canViewAnalytics 
    },
    { 
      id: 'inventory', 
      icon: Package, 
      label: 'Inventory Control', 
      path: '/admin/inventory',
      // Visible if user can at least view or add products
      visible: user?.isSuperAdmin || user?.permissions?.canViewInventory || user?.permissions?.canAddProduct
    },
    { 
      id: 'partners', 
      icon: Users, 
      label: 'Partner Registry', 
      path: '/admin/partners',
      visible: user?.isSuperAdmin || user?.permissions?.canManagePartners
    },
    { 
      id: 'orders', 
      icon: ShoppingCart, 
      label: 'Order Registry', 
      path: '/admin/orders', 
      notification: issuesCount > 0,
      visible: user?.isSuperAdmin || user?.permissions?.canManageOrders
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'System Settings', 
      path: '/admin/settings',
      visible: user?.isSuperAdmin || user?.permissions?.canAccessSettings
    },
  ];

  const visibleItems = navItems.filter(item => item.visible);

  return (
    <aside className="w-56 bg-[#D6D6D6] text-black flex flex-col fixed h-full z-20 transition-all border-r border-black/10">
      {/* Branding */}
      <div className="p-10 border-b border-black/5 flex items-center gap-4 mb-6">
         <div className="w-10 h-10 bg-black rounded-xl text-[#FFFFFF] flex items-center justify-center font-bold text-lg shadow-lg">JN</div>
         <div className="flex flex-col">
            <h1 className="text-[11px] font-bold tracking-widest text-[#000000] uppercase leading-none">
              {user?.isSuperAdmin ? 'Super Admin' : 'Admin'}
            </h1>
            <p className="text-[9px] font-bold text-black/40 uppercase tracking-tighter mt-1">Registry Control</p>
         </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {visibleItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => 
              `w-full flex items-center gap-4 px-6 py-4 text-[11px] font-bold uppercase tracking-widest transition-all rounded-[16px] ${
                isActive 
                   ? 'bg-black text-white shadow-lg' 
                   : 'text-black/60 hover:bg-black/5 hover:text-black'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
            {item.notification && (
               <div className="ml-auto w-2 h-2 rounded-full bg-black" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin Profile Node */}
      <div className="p-6 border-t border-black/5">
         <div className="p-4 bg-black/5 rounded-[20px] flex items-center justify-between group">
            <div className="flex items-center gap-3 overflow-hidden">
               <div className="w-10 h-10 rounded-full bg-black/10 flex flex-shrink-0 items-center justify-center text-black/40">
                  <User size={18} />
               </div>
               <div className="truncate">
                  <p className="text-[10px] font-bold text-black uppercase tracking-widest truncate">{user?.name || 'Admin'}</p>
                  <p className="text-[8px] font-bold text-black/40 uppercase tracking-tighter truncate">{user?.role}</p>
               </div>
            </div>
            <button onClick={() => logout()} className="p-2 text-red-500 hover:text-red-600 transition-colors">
               <LogOut size={16} />
            </button>
         </div>
      </div>
    </aside>
  );
}
