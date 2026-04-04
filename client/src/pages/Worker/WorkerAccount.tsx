import { useState } from 'react';
import { 
  User, 
  Settings, 
  Power, 
  Clock, 
  Award, 
  Shield, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function WorkerAccount() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const stats = [
    { label: 'ORDERS PACKED', value: '1,240', icon: Award },
    { label: 'EFFICIENCY', value: '98.5%', icon: Shield },
    { label: 'SHIFT START', value: '08:00 AM', icon: Clock },
  ];

  return (
    <div className="space-y-8 md:space-y-12 pb-24">
      {/* Worker Hero Header */}
      <section className="bg-white border border-[#000000]/5 rounded-[32px] p-8 md:p-12 relative overflow-hidden group transition-colors shadow-sm">
         <div className="absolute top-0 right-0 w-80 h-80 bg-[#000000]/5 blur-[100px] group-hover:bg-[#000000]/10 transition-all duration-700 pointer-events-none" />
         
         <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-[#D6D6D6] rounded-full flex items-center justify-center relative shadow-inner">
               <User size={48} className="text-[#000000]/20" />
               <div className={`absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 ${isOnline ? 'bg-black' : 'bg-[#000000]/20'} border-4 border-white rounded-full shadow-lg`} />
            </div>
            <div className="text-center md:text-left space-y-2">
               <p className="text-xs font-bold text-[#000000]/40 uppercase tracking-widest">Fulfillment Specialist</p>
               <h2 className="text-3xl md:text-4xl font-semibold text-[#000000] tracking-tight">{user?.name || 'Michael Vance'}</h2>
               <div className="flex gap-3 justify-center md:justify-start pt-2">
                  <span className="text-[10px] font-bold text-[#000000]/60 uppercase bg-[#000000]/5 px-3 py-1.5 rounded-full">Warehouse Node 01</span>
                  <span className="text-[10px] font-bold text-[#000000]/60 uppercase bg-[#000000]/5 px-3 py-1.5 rounded-full">Shift A</span>
               </div>
            </div>
            <div className="flex-1 hidden md:block" />
            <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
               <button 
                  onClick={() => setIsOnline(!isOnline)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-xl ${isOnline ? 'bg-[#D6D6D6] text-black' : 'bg-[#000000]/5 text-[#000000]/60'} text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all outline-none`}
               >
                  <Power size={18} />
                  {isOnline ? 'Status: Online' : 'Status: Offline'}
               </button>
            </div>
         </div>
      </section>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.map((s, i) => (
            <div key={i} className="bg-white border border-[#000000]/5 rounded-[24px] p-8 flex items-center justify-between group hover:border-[#000000] hover:shadow-lg transition-all shadow-sm">
               <div className="space-y-1">
                  <p className="text-xs font-bold text-[#000000]/40 uppercase tracking-widest">{s.label}</p>
                  <h4 className="text-3xl font-semibold text-[#000000] tracking-tight">{s.value}</h4>
               </div>
               <div className="w-14 h-14 bg-[#D6D6D6] rounded-[16px] flex items-center justify-center text-[#000000]/30 group-hover:bg-[#000000] group-hover:text-white transition-all transform group-hover:scale-110 group-hover:-rotate-12">
                  <s.icon size={24} />
               </div>
            </div>
         ))}
      </div>

      {/* Profile Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <section className="bg-white border border-[#000000]/5 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-[#000000]/5">
               <h3 className="text-sm font-bold text-[#000000] uppercase tracking-widest flex items-center gap-3">
                  <Settings size={18} className="text-[#000000]" /> Account Settings
               </h3>
            </div>
            <div className="p-8 space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-[#000000]/60 uppercase tracking-widest">Display Name</label>
                  <input type="text" defaultValue={user?.name} className="w-full h-14 bg-white border border-[#000000]/10 rounded-xl px-6 text-sm font-semibold text-[#000000] focus:outline-none focus:border-[#000000] hover:border-[#000000]/50 transition-all outline-none" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-[#000000]/60 uppercase tracking-widest">Email Address</label>
                  <input type="email" defaultValue={user?.email} disabled className="w-full h-14 bg-[#D6D6D6] border border-[#000000]/5 rounded-xl px-6 text-sm font-semibold text-[#000000]/40 cursor-not-allowed outline-none" />
               </div>
               <button className="w-full h-14 mt-4 bg-[#000000] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#000000] transition-all shadow-md active:scale-[0.98]">
                  Save Changes
               </button>
            </div>
         </section>

         <section className="space-y-6">
            <div className="bg-white border border-[#000000]/5 rounded-[32px] p-8 flex flex-col gap-4 shadow-sm">
               <h3 className="text-sm font-bold text-[#000000] uppercase tracking-widest flex items-center gap-3 mb-2">
                  <Shield size={18} className="text-[#000000]" /> Security Options
               </h3>
               {[
                  'Reset Security PIN',
                  'Update MFA Protocol',
                  'Authorized Devices',
               ].map(opt => (
                  <button key={opt} className="flex justify-between items-center p-4 rounded-xl hover:bg-[#D6D6D6] transition-colors group outline-none">
                     <span className="text-sm font-semibold text-[#000000] group-hover:text-[#000000]">{opt}</span>
                     <ChevronRight size={18} className="text-[#000000]/20 group-hover:text-[#000000] transition-all transform group-hover:translate-x-1" />
                  </button>
               ))}
            </div>

            <button 
               onClick={handleLogout}
               className="w-full h-16 rounded-[20px] bg-black text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:shadow-lg hover:text-white transition-all flex items-center justify-center gap-3 shadow-sm outline-none active:scale-[0.98]"
            >
               <LogOut size={20} />
               Sign Out Securely
            </button>
         </section>
      </div>
    </div>
  );
}










