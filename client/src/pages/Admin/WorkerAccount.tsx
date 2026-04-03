import { useState } from 'react';
import { 
  User, 
  Settings, 
  Power, 
  Clock, 
  Award, 
  Shield, 
  ChevronRight,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../../services/DataService';

export default function WorkerAccount() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [theme, setTheme] = useState(DataService.getTheme());

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    DataService.setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const stats = [
    { label: 'ORDERS PACKED', value: '1,240', icon: Award },
    { label: 'EFFICIENCY', value: '98.5%', icon: Shield },
    { label: 'SHIFT START', value: '08:00 AM', icon: Clock },
  ];

  return (
    <div className="space-y-8 md:space-y-12 pb-24">
      {/* Worker Hero Header */}
      <section className="floating-card p-12 relative overflow-hidden group transition-colors">
         <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 dark:bg-white/5 blur-[100px] group-hover:bg-gold/10 transition-all duration-700 pointer-events-none" />
         
         <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="w-32 h-32 bg-bone dark:bg-dark border border-primary/10 flex items-center justify-center relative">
               <User size={64} className="text-primary/20 dark:text-white/20" />
               <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${isOnline ? 'bg-green-500' : 'bg-primary/20'} border-4 border-white dark:border-dark-surface shadow-xl animate-pulse`} />
            </div>
            <div className="text-center md:text-left space-y-2">
               <p className="text-[10px] font-black text-primary/30 dark:text-white/30 uppercase tracking-[0.4em]">Fulfillment Specialist_</p>
               <h2 className="text-4xl font-black text-primary dark:text-white uppercase tracking-tighter leading-none">{user?.name || 'Michael Vance'}</h2>
               <div className="flex gap-4 justify-center md:justify-start">
                  <span className="text-[9px] font-black text-primary/40 dark:text-white/40 uppercase bg-primary/5 dark:bg-white/5 px-2 py-1">Node_01</span>
                  <span className="text-[9px] font-black text-primary/40 dark:text-white/40 uppercase bg-primary/5 dark:bg-white/5 px-2 py-1">Shift_A</span>
               </div>
            </div>
            <div className="flex-1 hidden md:block" />
            <div className="flex items-center gap-4 w-full md:w-auto">
               <button 
                  onClick={toggleTheme}
                  className="p-5 bg-bone dark:bg-dark-surface border border-primary/10 text-primary dark:text-gold hover:scale-105 transition-all shadow-xl"
               >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
               </button>
               <button 
                  onClick={() => setIsOnline(!isOnline)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 ${isOnline ? 'bg-gold' : 'bg-primary/10 dark:bg-white/5 text-primary dark:text-white/40'} text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl`}
               >
                  <Power size={16} />
                  {isOnline ? 'PROTOCOL_ONLINE' : 'PROTOCOL_OFFLINE'}
               </button>
            </div>
         </div>
      </section>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {stats.map((s, i) => (
            <div key={i} className="floating-card p-10 flex items-center justify-between group">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-primary/20 dark:text-white/20 uppercase tracking-widest">{s.label}</p>
                  <h4 className="text-3xl font-black text-primary dark:text-white tracking-tighter">{s.value}</h4>
               </div>
               <div className="w-12 h-12 bg-bone dark:bg-dark flex items-center justify-center text-primary/20 dark:text-white/20 group-hover:bg-primary group-hover:text-white transition-all">
                  <s.icon size={20} />
               </div>
            </div>
         ))}
      </div>

      {/* Profile Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <section className="floating-card">
            <div className="p-10 border-b border-primary/5">
               <h3 className="text-[11px] font-black text-primary dark:text-white/60 uppercase tracking-[0.3em] flex items-center gap-3">
                  <Settings size={16} /> ACCOUNT_SETTINGS
               </h3>
            </div>
            <div className="p-10 space-y-8">
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-primary/30 dark:text-white/20 uppercase tracking-widest">Display Name</label>
                  <input type="text" defaultValue={user?.name} className="w-full h-16 bg-bone dark:bg-dark border border-primary/5 dark:border-white/5 px-8 text-sm font-black text-primary dark:text-white uppercase tracking-widest focus:outline-none focus:border-gold transition-all" />
               </div>
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-primary/30 dark:text-white/20 uppercase tracking-widest">Email Node</label>
                  <input type="email" defaultValue={user?.email} disabled className="w-full h-16 bg-bone dark:bg-dark border border-primary/5 dark:border-white/5 px-8 text-sm font-black text-primary/40 dark:text-white/20 uppercase tracking-widest cursor-not-allowed" />
               </div>
               <button className="w-full h-20 bg-primary text-white text-[11px] font-black uppercase tracking-widest hover:bg-gold transition-all shadow-xl">
                  PERSIST ACCOUNT DATA_
               </button>
            </div>
         </section>

         <section className="space-y-8">
            <div className="floating-card p-10 flex flex-col gap-6">
               <h3 className="text-[11px] font-black text-primary dark:text-white/60 uppercase tracking-[0.3em] flex items-center gap-3">
                  <Shield size={16} /> SECURITY_ENFORCEMENT
               </h3>
               {[
                  'RESET_SECURITY_PIN',
                  'MFA_PROTOCOL_UPDATE',
                  'DEVICE_AUTHORIZATION',
               ].map(opt => (
                  <button key={opt} className="flex justify-between items-center p-6 bg-bone dark:bg-dark-surface hover:bg-primary hover:text-white transition-all group">
                     <span className="text-[10px] font-black dark:text-white/80 uppercase tracking-widest">{opt}</span>
                     <ChevronRight size={16} className="text-primary/20 dark:text-white/20 group-hover:text-white transition-all" />
                  </button>
               ))}
            </div>

            <button 
               onClick={handleLogout}
               className="w-full h-24 border border-red-500/20 bg-red-500/5 text-red-500 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-4 shadow-sm"
            >
               <LogOut size={20} />
               TERMINATE_SESSION_
            </button>
         </section>
      </div>
    </div>
  );
}
