import { motion } from 'framer-motion';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  Plus, 
  Search,
  Bell,
  Settings,
  LogOut,
  LayoutGrid,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/premium/Logo';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { icon: LayoutGrid, label: 'Control Center', active: true },
    { icon: Package, label: 'Infrastructure', active: false },
    { icon: Users, label: 'Node Registry', active: false },
    { icon: ShoppingBag, label: 'Transaction Logs', active: false },
    { icon: Activity, label: 'System Health', active: false },
    { icon: Settings, label: 'Global Config', active: false },
  ];

  const stats = [
    { label: 'Inventory Nodes', value: '2,140', change: '+12.4%', icon: Package, trend: 'up' },
    { label: 'Retail Partners', value: '450', change: '+5.2%', icon: Users, trend: 'up' },
    { label: 'Active Latency', value: '24ms', change: '-4%', icon: Activity, trend: 'down' },
    { label: 'Daily Flux', value: '$84.5K', change: '+18%', icon: TrendingUp, trend: 'up' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen bg-bone text-slate selection:bg-gold selection:text-white"
    >
      {/* Structural Sidebar - Slate Primary */}
      <aside className="w-80 bg-slate flex flex-col p-10 space-y-16 relative overflow-hidden text-white">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gold/50" />
        
        <div className="space-y-2">
           <Logo className="text-3xl justify-start text-white" />
           <p className="text-[8px] tracking-[0.4em] uppercase font-black opacity-40">Consolidated Console v4.0.2</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          <p className="text-[10px] tracking-widest-xl uppercase font-black opacity-30 mb-8 px-4 border-l-2 border-gold/40">Navigation Archive</p>
          {navItems.map((item, i) => (
            <motion.button
              key={i}
              whileHover={{ x: 6 }}
              className={`w-full flex items-center gap-5 px-4 py-4 text-[10px] font-black tracking-widest uppercase transition-all group ${item.active ? 'text-white bg-white/10 border border-white/5 shadow-sm' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={16} className={item.active ? 'text-gold' : 'group-hover:text-gold transition-colors'} />
              {item.label}
              {item.active && <div className="ml-auto w-1 h-1 bg-gold rounded-full" />}
            </motion.button>
          ))}
        </nav>

        <div className="pt-10 border-t border-white/10 space-y-6">
           <div className="px-4 py-6 bg-white/5 border border-white/5 space-y-3">
              <p className="text-[9px] tracking-widest uppercase font-bold opacity-30 text-white">Archive Support</p>
              <button className="text-[10px] font-black text-gold hover:underline">Terminal Access</button>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-4 px-4 py-2 text-[10px] font-black tracking-widest-xl uppercase text-white/40 hover:text-red-400 transition-colors group"
           >
             <LogOut size={16} />
             Kill Connection
           </button>
        </div>
      </aside>

      {/* Primary Workspace - Bone Background */}
      <main className="flex-1 p-16 overflow-y-auto bg-bone bg-[radial-gradient(#42566410_1px,transparent_1px)] [background-size:40px_40px]">
        <header className="flex justify-between items-end mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="h-[1px] w-8 bg-gold" />
               <span className="text-[10px] tracking-widest-xl font-black uppercase text-gold">Status: Synchronized</span>
            </div>
            <h2 className="text-6xl font-black tracking-tighter leading-none text-slate">ADMIN <br /> CONSOLE_</h2>
          </div>
          
          <div className="flex items-center gap-8 pb-2">
            <div className="relative group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={14} />
               <input 
                 type="text" 
                 placeholder="SEARCH REGISTRY..." 
                 className="bg-white border-2 border-slate/5 pl-14 pr-8 py-4 text-[10px] tracking-widest focus:outline-none focus:border-gold transition-all w-80 font-black placeholder:opacity-10"
               />
            </div>
            <button className="relative p-4 bg-white border border-slate/10 hover:border-gold transition-all group">
               <Bell size={18} className="text-slate group-hover:text-gold" />
               <span className="absolute top-0 right-0 w-2 h-2 bg-gold animate-pulse" />
            </button>
            <button className="flex items-center gap-4 bg-gold text-white px-10 py-4 text-[10px] font-black tracking-widest-xl uppercase hover:bg-slate transition-all shadow-lg group relative overflow-hidden">
               <div className="absolute inset-0 bg-slate translate-x-[-101%] group-hover:translate-x-0 transition-transform" />
               <Plus size={16} className="relative z-10 group-hover:rotate-180 transition-transform duration-500" />
               <span className="relative z-10">Add Node</span>
            </button>
          </div>
        </header>

        {/* Intelligence Grid */}
        <section className="grid grid-cols-4 gap-10 mb-20">
           {stats.map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               whileHover={{ y: -5 }}
               className="bg-white border-b-4 border-transparent hover:border-gold p-10 space-y-6 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
             >
               <div className="absolute top-0 right-0 opacity-[0.05] scale-[3] translate-x-1/4 -translate-y-1/4 group-hover:text-gold transition-colors text-slate">
                  <stat.icon size={40} />
               </div>

               <div className="flex justify-between items-start relative z-10">
                 <div className="p-4 bg-slate text-white group-hover:bg-gold transition-all duration-500 shadow-lg">
                    <stat.icon size={20} />
                 </div>
                 <div className="text-right">
                    <span className={`text-[10px] font-black tracking-widest-xl ${stat.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                       {stat.change}
                    </span>
                    <p className="text-[8px] uppercase tracking-widest opacity-20 font-black mt-1">Variance</p>
                 </div>
               </div>
               <div className="relative z-10">
                  <h4 className="text-[10px] uppercase tracking-widest-xl font-bold opacity-30 mb-2 text-slate">{stat.label}</h4>
                  <p className="text-5xl font-black text-slate tracking-tighter">{stat.value}</p>
               </div>
             </motion.div>
           ))}
        </section>

        {/* Global Visualization Area */}
        <div className="bg-white border border-slate/10 p-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
           <div className="bg-bone border border-slate/5 p-20 flex flex-col items-center justify-center space-y-10 relative overflow-hidden h-[600px]">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white/80 pointer-events-none" />
              
              <div className="relative z-10 text-center space-y-8">
                 <div className="inline-block p-10 border border-gold/20 rounded-full mb-4 animate-pulse-slow">
                    <Logo className="text-6xl opacity-20" />
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-[12px] tracking-[0.5em] uppercase font-black text-slate">Consolidated Data Flux</h3>
                    <p className="text-[10px] tracking-widest uppercase font-bold opacity-30">Stream established: AES-GCM 256. Tracking 452 concurrent global nodes.</p>
                 </div>
                 <div className="flex gap-4 justify-center">
                    <div className="h-1 w-24 bg-slate/10 overflow-hidden">
                       <div className="h-full bg-gold w-1/2 animate-[shimmer_2s_infinite]" />
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-6 gap-2 w-full max-w-4xl opacity-5 pointer-events-none">
                 {Array.from({length: 48}).map((_, i) => (
                   <div key={i} className="h-8 bg-slate" style={{ opacity: Math.random() }} />
                 ))}
              </div>
           </div>
        </div>
      </main>
    </motion.div>
  );
}

