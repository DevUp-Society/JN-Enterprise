import { motion } from 'framer-motion';
import { 
  UserPlus,
  Users,
  Palette,
  Layers,
  Layout
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const actionCards = [
    { 
      id: 'admins', 
      label: 'Admin Profiles', 
      icon: UserPlus, 
      desc: 'Personnel Registry Expansion', 
      path: '/admin/settings/personnel/admins',
      visible: user?.isSuperAdmin // Only super admin manages other admins
    },
    { 
      id: 'workers', 
      label: 'Worker Profiles', 
      icon: Users, 
      desc: 'Fulfillment Capacity Growth', 
      path: '/admin/settings/personnel/workers',
      visible: user?.isSuperAdmin || user?.permissions?.canAccessSettings
    },
    { 
      id: 'theme', 
      label: 'Theme Settings', 
      icon: Palette, 
      desc: 'Visual Projection Matrix',
      visible: user?.isSuperAdmin
    },
    { 
      id: 'categories', 
      label: 'Manage Categories', 
      icon: Layers, 
      desc: 'Registry Catalog Logic', 
      path: '/admin/categories',
      visible: user?.isSuperAdmin || user?.permissions?.canAddProduct
    },
    { 
      id: 'slides', 
      label: 'Manage Slides', 
      icon: Layout, 
      desc: 'Frontend Interface Logic',
      visible: user?.isSuperAdmin
    },
  ].filter(card => card.visible);

  return (
    <div className="space-y-12 pb-24 select-none">
      {/* SIMPLIFIED_HEADER */}
      <header className="border-b border-[#000000]/10 pb-10 mt-6">
        <h1 className="text-[40px] font-black text-[#000000] tracking-tighter uppercase leading-none">
           System Settings
        </h1>
      </header>

      {/* ACTION_COLLECTION_GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
         {actionCards.map((card, idx) => (
            <motion.div 
               key={card.id}
               onClick={() => card.path && navigate(card.path)}
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.05, type: 'spring', damping: 20 }}
               className="bg-white border-2 border-[#000000]/5 shadow-xl rounded-[40px] p-12 flex items-center gap-8 group hover:border-[#000000]/20 transition-all cursor-pointer relative overflow-hidden h-[200px]"
            >
               <div className="w-20 h-20 bg-[#D6D6D6]/40 rounded-[32px] border-2 border-white flex flex-shrink-0 items-center justify-center text-[#000000]/40 group-hover:bg-[#000000] group-hover:text-white transition-all shadow-md">
                  <card.icon size={32} />
               </div>
               <div className="space-y-2 relative z-10 flex-1">
                  <h4 className="text-2xl font-black text-[#000000] tracking-tighter uppercase leading-none">{card.label}</h4>
                  <p className="text-[11px] font-bold text-[#000000]/30 uppercase tracking-[0.2em] leading-relaxed">{card.desc}</p>
               </div>
            </motion.div>
         ))}
      </section>
    </div>
  );
}
