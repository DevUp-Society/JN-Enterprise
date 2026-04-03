import { 
  User, 
  Mail, 
  Shield, 
  MapPin, 
  Calendar, 
  Key, 
  Hash, 
  Activity,
  LogOut,
  Edit2
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-12 pb-24 font-mono select-none">
      {/* TERMINAL_HEADER_PROTOCOL */}
      <header className="flex flex-col gap-10 border-b border-primary/10 pb-12">
        <div className="flex items-center">
           <h1 className="text-3xl font-black text-primary dark:text-bone tracking-tighter uppercase leading-none">
              ADMIN_IDENTITY_PROFILE
           </h1>
           <div className="h-[1px] flex-1 bg-primary/5 mx-10" />
           <button 
              onClick={() => logout()}
              className="px-8 h-12 bg-red-500 text-white flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-red-600 transition-all shadow-xl active:scale-95 whitespace-nowrap"
           >
              <LogOut size={16} /> LOGOUT_PROTOCOL
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-1 space-y-12">
           <div className="floating-card p-12 text-center space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold" />
              <div className="w-40 h-40 rounded-full bg-primary/5 border-2 border-primary/10 mx-auto flex items-center justify-center text-primary group-hover:border-gold transition-all overflow-hidden relative">
                 <User size={80} strokeWidth={1} className="relative z-10 opacity-20" />
                 <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-primary/10 group-hover:text-gold/20 transition-all">
                    {user.name.charAt(0).toUpperCase()}
                 </div>
              </div>
              <div className="space-y-2">
                 <h2 className="text-3xl font-black text-primary dark:text-white uppercase tracking-tighter">{user.name}</h2>
                 <p className="text-[10px] font-black text-gold uppercase tracking-[0.5em]">{user.role}_OPERATOR</p>
              </div>
              <button className="w-full h-14 border border-primary/10 text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3">
                 <Edit2 size={12} /> MODIFY_PROJECTION
              </button>
           </div>

           <section className="floating-card p-10 space-y-6">
              <h4 className="text-[10px] font-black text-primary/30 uppercase tracking-widest border-b border-primary/5 pb-4">AUTARKY_METRICS</h4>
              <div className="space-y-4">
                 {[
                   { label: 'Uptime Factor', val: '98.5%', icon: Activity },
                   { label: 'Access Level', val: 'Tier_01', icon: Shield },
                   { label: 'Registry UID', val: user.id.slice(0, 8), icon: Hash },
                 ].map(stat => (
                   <div key={stat.label} className="flex justify-between items-center group">
                      <div className="flex items-center gap-3 text-primary/20 group-hover:text-gold transition-colors">
                         <stat.icon size={14} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <span className="text-[10px] font-black text-primary dark:text-white uppercase font-mono">{stat.val}</span>
                   </div>
                 ))}
              </div>
           </section>
        </div>

        <div className="lg:col-span-2 space-y-12">
           <section className="floating-card p-12 space-y-12">
              <div className="space-y-4">
                 <h3 className="text-2xl font-black text-primary dark:text-white uppercase tracking-tighter leading-none flex items-center gap-4">
                    <Key size={24} className="text-gold" /> CORE_IDENTITY_PROTOCOL
                 </h3>
                 <p className="text-[10px] font-black text-primary/20 dark:text-white/20 uppercase tracking-widest italic">Immutable personnel data stored in secure ledger segment.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest pl-2 flex items-center gap-2">
                       <Mail size={10} /> COMMUNICATIONS_ENDPOINT
                    </label>
                    <div className="h-16 bg-bone dark:bg-dark border border-primary/5 px-8 flex items-center text-sm font-black text-primary dark:text-white uppercase tracking-widest">
                       {user.email}
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest pl-2 flex items-center gap-2">
                       <MapPin size={10} /> ASSIGNED_NODE_LOCATION
                    </label>
                    <div className="h-16 bg-bone dark:bg-dark border border-primary/5 px-8 flex items-center text-sm font-black text-primary dark:text-white uppercase tracking-widest">
                       CENTRAL_HU_01 (MUMBAI)
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest pl-2 flex items-center gap-2">
                       <Calendar size={10} /> COMMISSIONS_TIMESTAMP
                    </label>
                    <div className="h-16 bg-bone dark:bg-dark border border-primary/5 px-8 flex items-center text-sm font-black text-primary dark:text-white uppercase tracking-widest">
                       MAY_2024_EPOCH
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest pl-2 flex items-center gap-2">
                       <Shield size={10} /> SECURITY_CLEARANCE
                    </label>
                    <div className="h-16 bg-bone dark:bg-dark border border-primary/5 px-8 flex items-center text-sm font-black text-gold uppercase tracking-[0.3em]">
                       ADMIN_OVERRIDE_V2
                    </div>
                 </div>
              </div>
           </section>

           <section className="bg-primary p-16 shadow-2xl relative overflow-hidden group border-b-4 border-b-gold">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[120px] pointer-events-none group-hover:bg-white/10 transition-all duration-1000" />
              <div className="relative z-10 space-y-12">
                 <div className="space-y-3">
                    <h4 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Activity_Log_</h4>
                    <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest italic">Monitoring session integrity and command history.</p>
                 </div>
                 <div className="space-y-4">
                    {[
                       'AUTH_SESSION_INITIATED: CENTRAL_NODE',
                       'REGISTRY_MODIFICATION_LOGGED: INVENTORY_V14',
                       'SYSTEM_BROADCAST_COMMITTED: FULFILLMENT_THREAD',
                       'MANIFEST_AUDIT_EXCERPTED: ORDER_JN_102'
                    ].map((log, i) => (
                       <div key={i} className="flex items-center gap-4 text-[10px] font-black text-white/60 tracking-widest border-l-2 border-white/10 pl-6 group-hover:border-gold transition-colors">
                          <code className="text-gold opacity-40">[{new Date().toLocaleTimeString()}]</code> {log}
                       </div>
                    ))}
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
