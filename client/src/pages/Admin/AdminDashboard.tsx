import { useState, useEffect } from 'react';
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
  Activity,
  AlertCircle,
  Truck,
  ArrowRight,
  TrendingUp,
  Globe,
  Zap,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/premium/Logo';
import axiosInstance from '../../api/axiosInstance';
import { SkeletonStatCard } from '../../components/premium/SkeletonCards';
import { IndustrialAlert } from '../../components/premium/IndustrialAlert';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/dashboard/stats');
      const data = response.data.stats;

      const mappedStats = [
        { label: 'Inventory Assets', value: data.totalProducts, change: '+12.4%', icon: Package, trend: 'up', color: '#FFFFFF' },
        { label: 'Low Stock Alerts', value: data.lowStockCount, change: 'CRITICAL', icon: AlertCircle, trend: 'down', color: '#EF4444' },
        { label: 'Active Operations', value: data.activeTasks, change: 'SYNCED', icon: Truck, trend: 'up', color: '#000000' },
        { label: 'Personnel Hub', value: data.totalWorkers, change: 'CONNECTED', icon: Users, trend: 'up', color: '#FFFFFF' },
      ];
      setStats(mappedStats);
      setError(null);
    } catch (err: any) {
      console.error('FETCH_STATS_FAILURE', err);
      setError('Unable to synchronize consolidated dashboard stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { icon: LayoutGrid, label: 'Control Center', active: true, path: '/admin/overview' },
    { icon: Package, label: 'Infrastructure', active: false, path: '/admin/inventory' },
    { icon: Users, label: 'Node Registry', active: false, path: '/admin/settings/personnel/workers' },
    { icon: ShoppingBag, label: 'Order Pipeline', active: false, path: '/admin/orders' },
    { icon: Activity, label: 'System Health', active: false, path: '/admin/settings' },
    { icon: Settings, label: 'Global Config', active: false, path: '/admin/settings' },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-[#D6D6D6] flex items-center justify-center p-20">
        <IndustrialAlert message={error} onRetry={fetchStats} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen bg-[#D6D6D6] text-black selection:bg-[#000000] selection:text-[#D6D6D6]"
    >
      {/* PREMIUM SIDEBAR - Slate Blue */}
      <aside className="w-80 bg-[#D6D6D6] flex flex-col p-10 space-y-16 relative overflow-hidden text-black shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#FFFFFF]" />
        
        <div className="space-y-4">
           <Logo className="text-3xl justify-start text-black" />
           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              <p className="text-[10px] tracking-widest uppercase font-bold text-black/40">Network Synchronized</p>
           </div>
        </div>
        
        <nav className="flex-1 space-y-3">
          <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-black/40 mb-8 px-4 border-l-2 border-black">Operations</p>
          {navItems.map((item, i) => (
            <motion.button
              key={i}
              whileHover={{ x: 6 }}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-4 text-xs font-bold tracking-widest uppercase transition-all group rounded-[12px] ${item.active ? 'text-white bg-black shadow-lg scale-105' : 'text-black/40 hover:text-black hover:bg-black/5'}`}
            >
              <item.icon size={18} className={item.active ? 'text-white' : 'group-hover:text-black transition-colors'} />
              {item.label}
              {item.active && <ArrowRight size={14} className="ml-auto text-white" />}
            </motion.button>
          ))}
        </nav>

        <div className="pt-10 border-t border-white/5 space-y-8">
           <div className="p-6 bg-white/5 border border-white/5 rounded-[20px] space-y-4 relative overflow-hidden group hover:bg-white/10 transition-all">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-all scale-150"><Zap size={100} /></div>
              <p className="text-[10px] tracking-widest uppercase font-bold text-black/30">System Integrity</p>
              <div className="flex items-end justify-between">
                 <p className="text-2xl font-semibold tracking-tight">99.8%</p>
                 <TrendingUp size={16} className="text-black mb-1" />
              </div>
           </div>
           
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-4 px-4 py-2 text-xs font-bold tracking-widest uppercase text-red-500 hover:text-red-700 transition-colors group"
           >
             <LogOut size={16} />
             Terminate Session
           </button>
        </div>
      </aside>

      {/* PRIMARY WORKSPACE */}
      <main className="flex-1 p-16 overflow-y-auto custom-scrollbar">
        <header className="flex justify-between items-end mb-20">
          <div className="space-y-6">
                <div className="flex items-center gap-4 text-[#000000]">
               <div className="h-[2px] w-12 bg-[#000000]" />
               <span className="text-xs font-bold tracking-[0.3em] uppercase">Enterprise Command</span>
            </div>
            <h2 className="text-5xl font-semibold tracking-tight leading-none text-[#FFFFFF]">Administration <br /> Dashboard</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#000000]/20 group-focus-within:text-[#000000] transition-colors" size={18} />
               <input 
                 type="text" 
                 placeholder="Search registry..." 
                 className="bg-white border border-[#000000]/5 pl-14 pr-8 h-14 rounded-[16px] text-sm font-semibold focus:outline-none focus:border-[#000000]/20 transition-all w-80 shadow-sm placeholder:text-[#000000]/20"
               />
            </div>
            <button className="relative w-14 h-14 bg-white border border-[#000000]/5 rounded-[16px] flex items-center justify-center text-[#000000]/40 hover:text-[#000000] hover:bg-[#D6D6D6] transition-all shadow-sm group">
               <Bell size={20} />
               <span className="absolute top-4 right-4 w-2 h-2 bg-[#000000] rounded-full ring-4 ring-white" />
            </button>
            <button 
              onClick={() => navigate('/admin/inventory/create')}
              className="flex items-center gap-4 bg-[#FFFFFF] text-[#D6D6D6] px-8 h-14 rounded-[16px] text-xs font-bold tracking-widest uppercase hover:bg-[#000000] transition-all shadow-lg active:scale-95"
            >
               <Plus size={18} strokeWidth={2.5} />
               New Asset
            </button>
          </div>
        </header>

        {/* INTELLIGENCE GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
           {loading ? (
             Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
           ) : (
             stats.map((stat, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 whileHover={{ y: -4 }}
                 className="bg-white p-8 rounded-[32px] border border-[#000000]/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
               >
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[#000000] group-hover:scale-110 group-hover:opacity-[0.06] transition-all">
                    <stat.icon size={80} />
                 </div>

                 <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="p-3 bg-[#D6D6D6] rounded-[16px] text-[#000000] group-hover:bg-[#000000] group-hover:text-white transition-all shadow-sm">
                       <stat.icon size={20} />
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 ${stat.trend === 'up' ? 'bg-[#D6D6D6] text-black' : 'bg-black text-black'}`}>
                       <div className={`w-1 h-1 rounded-full ${stat.trend === 'up' ? 'bg-black' : 'bg-black'}`} />
                       {stat.change}
                    </div>
                 </div>
                 
                 <div className="space-y-1 relative z-10">
                    <p className="text-xs font-bold text-[#000000]/30 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-4xl font-semibold text-[#000000] tracking-tight">{stat.value}</p>
                 </div>
               </motion.div>
             ))
           )}
        </section>

        {/* LOGISTICS VISUALIZATION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white rounded-[32px] border border-[#000000]/5 p-10 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-center mb-10">
                 <div className="space-y-1">
                    <h3 className="text-xl font-semibold tracking-tight">Real-time Fulfillment Flow</h3>
                    <p className="text-sm font-medium text-[#000000]/40">Active logistics threads across global nodes</p>
                 </div>
                 <button className="p-3 bg-[#D6D6D6] rounded-full text-[#000000]/40 hover:text-[#000000] transition-colors"><MoreVertical size={20} /></button>
              </div>

              <div className="h-[400px] bg-[#D6D6D6] rounded-[32px] border border-[#000000]/5 relative flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                 <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group/pulse relative">
                       <Globe size={32} className="text-[#000000]" />
                       <div className="absolute inset-0 rounded-full border-2 border-[#000000] animate-ping opacity-20" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#000000]">Data Flux Active</p>
                       <p className="text-[10px] font-medium text-[#000000]/40">Tracking 452 concurrent operations</p>
                    </div>
                 </div>
                 
                 {/* Visual decoration */}
                 <div className="absolute bottom-10 left-10 right-10 flex gap-1 items-end">
                    {Array.from({length: 40}).map((_, i) => (
                       <motion.div 
                          key={i}
                          initial={{ height: 2 }}
                          animate={{ height: [2, Math.random() * 40 + 5, 2] }}
                          transition={{ repeat: Infinity, duration: 2, delay: i * 0.05 }}
                          className="flex-1 bg-[#000000]/10 rounded-full"
                       />
                    ))}
                 </div>
              </div>
           </div>

            <div className="bg-[#000000] rounded-[32px] p-10 text-[#D6D6D6] relative overflow-hidden shadow-2xl group flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-all"><Truck size={160} /></div>
              
              <div className="space-y-12 relative z-10">
                 <div className="space-y-4">
                    <div className="w-12 h-12 bg-[#D6D6D6]/10 rounded-[16px] flex items-center justify-center text-[#FFFFFF]"><Zap size={24} /></div>
                    <h3 className="text-3xl font-semibold tracking-tight leading-tight">Operational <br /> Excellence</h3>
                    <p className="text-sm font-medium text-[#D6D6D6]/40">Fulfillment lead time reduced by 24% this quarter.</p>
                 </div>

                 <div className="space-y-6">
                    <div className="p-5 bg-[#D6D6D6]/5 border border-[#D6D6D6]/5 rounded-[20px] flex items-center justify-between group/stat hover:bg-[#D6D6D6]/10 transition-all cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-black shadow-[0_0_12px_rgba(0,0,0,0.2)]" />
                          <span className="text-xs font-bold uppercase tracking-widest text-[#D6D6D6]/60">Dispatch Nodes</span>
                       </div>
                       <span className="text-lg font-semibold tabular-nums">14 Active</span>
                    </div>
                    <div className="p-5 bg-[#D6D6D6]/5 border border-[#D6D6D6]/5 rounded-[20px] flex items-center justify-between group/stat hover:bg-[#D6D6D6]/10 transition-all cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-[#FFFFFF] shadow-[0_0_12px_rgba(0,0,0,0.2)]" />
                          <span className="text-xs font-bold uppercase tracking-widest text-[#D6D6D6]/60">Processing Cap</span>
                       </div>
                       <span className="text-lg font-semibold tabular-nums">92.4%</span>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => navigate('/admin/orders')}
                className="w-full h-16 bg-[#FFFFFF] text-[#D6D6D6] rounded-[20px] text-xs font-bold uppercase tracking-widest hover:bg-[#D6D6D6] hover:text-[#FFFFFF] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 mt-8 relative z-10"
              >
                 View Logistics Map <ArrowRight size={16} />
              </button>
           </div>
        </div>
      </main>
    </motion.div>
  );
}











