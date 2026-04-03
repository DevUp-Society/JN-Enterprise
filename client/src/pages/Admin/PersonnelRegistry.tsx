import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Mail, 
  X, 
  Activity,
  CheckCircle2,
  MoreVertical,
  Shield,
  Trash2,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings as SettingsIcon,
  Check
} from 'lucide-react';
import { DataService } from '../../services/DataService';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import { Logo } from '../../components/premium/Logo';

export default function PersonnelRegistry() {
  const { role } = useParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<any | null>(null);
  const [userPermissions, setUserPermissions] = useState<Record<string, boolean>>({
    overview: true,
    inventory: true,
    orders: true,
    settings: true
  });
  
  const roleLabel = role === 'admins' ? 'Admin' : 'Worker';
  const personnel = DataService.getUsers().filter((u: any) => u.role === roleLabel.toUpperCase());

  const handleTogglePermission = (permission: string) => {
     setUserPermissions(prev => ({
        ...prev,
        [permission]: !prev[permission]
     }));
  };

  return (
    <div className="space-y-12 pb-24 font-mono select-none">
      {/* TERMINAL_HEADER_PROTOCOL (Cleaned) */}
      <header className="flex flex-col gap-10 border-b border-primary/10 pb-12">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="scale-75 origin-left">
                 <Logo />
              </div>
              <h1 className="text-3xl font-black text-primary dark:text-bone tracking-tighter uppercase leading-none">
                 {roleLabel} Registry
              </h1>
           </div>
           
           {!selectedUserForPermissions && (
              <button 
                 onClick={() => setShowCreateModal(true)}
                 className="px-8 h-12 bg-primary text-white flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-gold transition-all shadow-xl active:scale-95"
              >
                 <UserPlus size={16} /> New {roleLabel} Protocol
              </button>
           )}
           {selectedUserForPermissions && (
              <button 
                 onClick={() => setSelectedUserForPermissions(null)}
                 className="px-8 h-12 border border-primary/10 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-lg flex items-center gap-3"
              >
                 <ArrowLeft /> Return to Registry
              </button>
           )}
        </div>
        <Breadcrumbs items={[{ label: 'Settings', path: '/admin/settings' }, { label: `${roleLabel} Registry` }]} />
      </header>

      <main className="floating-card overflow-visible min-h-[600px] relative">
         <AnimatePresence mode="wait">
            {selectedUserForPermissions ? (
               <motion.div 
                  key="permissions"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-12 space-y-12"
               >
                  <div className="flex items-center gap-6 p-10 bg-primary text-white shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-10"><Shield size={120} /></div>
                     <div className="w-20 h-20 bg-white/10 flex items-center justify-center text-3xl font-black">
                        {selectedUserForPermissions.name.charAt(0).toUpperCase()}
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-2xl font-black uppercase tracking-tighter leading-none">{selectedUserForPermissions.name}</h4>
                        <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Access Control Matrix | {selectedUserForPermissions.id}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {[
                        { id: 'overview', label: 'Access Overview Node', desc: 'Ability to view global operational metrics', icon: LayoutDashboard },
                        { id: 'inventory', label: 'Registry Modification', desc: 'Ability to add/edit/remove inventory assets', icon: Package },
                        { id: 'orders', label: 'Fulfillment Logic', desc: 'Manage order status and logistical threads', icon: ShoppingCart },
                        { id: 'settings', label: 'System Configuration', desc: 'Modify global protocols and user access', icon: SettingsIcon },
                     ].map((perm) => (
                        <div key={perm.id} className="p-8 border border-primary/5 bg-bone dark:bg-dark-surface flex items-center justify-between group hover:border-gold transition-all">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-primary/5 flex items-center justify-center text-primary/30 group-hover:text-gold transition-colors">
                                 <perm.icon size={20} />
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[11px] font-black text-primary dark:text-white uppercase tracking-widest">{perm.label}</p>
                                 <p className="text-[9px] font-black text-primary/20 dark:text-white/20 uppercase tracking-widest">{perm.desc}</p>
                              </div>
                           </div>
                           <button 
                              onClick={() => handleTogglePermission(perm.id)}
                              className={`w-14 h-8 border border-primary/10 relative p-1 flex items-center transition-colors ${userPermissions[perm.id] ? 'bg-gold/10' : 'bg-bone dark:bg-dark'}`}
                           >
                              <motion.div 
                                 animate={{ x: userPermissions[perm.id] ? 24 : 0 }}
                                 className={`h-full aspect-square transition-all ${userPermissions[perm.id] ? 'bg-gold shadow-[0_0_8px_#C6AD8F]' : 'bg-primary/20'}`} 
                              />
                           </button>
                        </div>
                     ))}
                  </div>

                  <div className="pt-12 border-t border-primary/5 flex justify-end">
                     <button 
                        onClick={() => setSelectedUserForPermissions(null)}
                        className="px-12 h-16 bg-primary text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gold transition-all shadow-2xl"
                     >
                        Commit Changes
                     </button>
                  </div>
               </motion.div>
            ) : (
               <motion.div 
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
               >
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-bone dark:bg-dark-surface border-b border-primary/10">
                           <th className="p-10 text-[10px] font-black text-primary/40 uppercase tracking-widest leading-none">Identity Node</th>
                           <th className="p-10 text-[10px] font-black text-primary/40 uppercase tracking-widest leading-none">Personnel Endpoint</th>
                           <th className="p-10 text-[10px] font-black text-primary/40 uppercase tracking-widest leading-none">Last Active Flux</th>
                           <th className="p-10 text-[10px] font-black text-primary/40 uppercase tracking-widest text-right leading-none">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-primary/5">
                        {personnel.map((person: any) => (
                           <tr key={person.id} className="group hover:bg-bone dark:hover:bg-primary/5 transition-colors">
                              <td className="p-10">
                                 <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-primary/5 flex items-center justify-center text-primary/30 group-hover:bg-gold group-hover:text-white transition-all text-sm font-black">
                                       {person.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="space-y-1">
                                       <p className="text-[15px] font-black text-primary dark:text-white uppercase tracking-tight leading-none">{person.name}</p>
                                       <p className="text-[9px] font-black text-primary/20 dark:text-white/20 uppercase tracking-widest">{person.id}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-10">
                                 <div className="flex items-center gap-3 text-primary/40 dark:text-white/30">
                                    <Mail size={14} className="opacity-40" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">{person.email}</span>
                                 </div>
                              </td>
                              <td className="p-10 text-[11px] font-black text-primary/60 dark:text-white/40 uppercase tracking-widest leading-none">
                                 {new Date(person.lastActive).toLocaleTimeString()} @ {new Date(person.lastActive).toLocaleDateString()}
                              </td>
                              <td className="p-10 text-right relative">
                                 <button 
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       setActiveMenuId(activeMenuId === person.id ? null : person.id);
                                    }}
                                    className={`p-4 transition-all ${activeMenuId === person.id ? 'bg-primary text-white' : 'text-primary/20 hover:text-primary'}`}
                                 >
                                    <MoreVertical size={20} />
                                 </button>
                                 
                                 <AnimatePresence>
                                    {activeMenuId === person.id && (
                                       <motion.div 
                                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                          className="absolute right-10 top-24 w-60 bg-white dark:bg-dark-surface border border-primary/10 shadow-2xl z-50 p-2"
                                       >
                                          {roleLabel === 'Admin' && (
                                             <button 
                                                onClick={() => {
                                                   setSelectedUserForPermissions(person);
                                                   setActiveMenuId(null);
                                                }}
                                                className="w-full flex items-center justify-between px-6 py-4 text-[10px] font-black text-primary/40 uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all group"
                                             >
                                                Permissions <Shield size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                                             </button>
                                          )}
                                          <button className="w-full flex items-center justify-between px-6 py-4 text-[10px] font-black text-red-500/60 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all group">
                                             Delete Personnel <Trash2 size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                                          </button>
                                       </motion.div>
                                    )}
                                 </AnimatePresence>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </motion.div>
            )}
         </AnimatePresence>
      </main>

      {/* CREATE_PERSONNEL_MODAL */}
      <AnimatePresence>
         {showCreateModal && (
            <CreatePersonnelModal 
               role={roleLabel.toUpperCase()} 
               onClose={() => setShowCreateModal(false)}
               onComplete={() => {
                  setShowCreateModal(false);
               }}
            />
         )}
      </AnimatePresence>
    </div>
  );
}

function CreatePersonnelModal({ role, onClose, onComplete }: any) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    overview: true,
    inventory: true,
    orders: true,
    settings: true
  });
  const [submitted, setSubmitted] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'ADMIN') {
      setStep(2);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    DataService.createUser({ ...formData, role, permissions });
    setSubmitted(true);
    setTimeout(() => onComplete(), 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-12 overflow-hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-dark/60 dark:bg-black/95 backdrop-blur-md cursor-pointer" />
      <motion.div 
         initial={{ scale: 0.95, opacity: 0, y: 20 }}
         animate={{ scale: 1, opacity: 1, y: 0 }}
         className="w-full max-w-2xl bg-white dark:bg-dark-surface z-10 border border-primary/10 shadow-2xl p-16 font-mono"
      >
         {submitted ? (
            <div className="py-20 text-center space-y-8">
               <div className="w-24 h-24 bg-green-500/10 border-2 border-green-500 mx-auto flex items-center justify-center text-green-500">
                  <CheckCircle2 size={40} className="animate-bounce" />
               </div>
               <h3 className="text-3xl font-black text-primary dark:text-white uppercase tracking-tighter">Identity Committed</h3>
               <p className="text-[10px] font-black text-primary/20 uppercase tracking-widest">Personnel added to Master Registry.</p>
            </div>
         ) : (
            <div className="space-y-12">
               <div className="flex justify-between items-start">
                  <div className="space-y-3">
                     <div className="flex items-center gap-3">
                        <Activity size={18} className="text-gold" />
                        <h3 className="text-3xl font-black text-primary dark:text-white uppercase tracking-tighter">New {role} Protocol</h3>
                     </div>
                     <p className="text-[10px] font-black text-primary/20 uppercase tracking-widest italic">
                        {step === 1 ? 'Provisioning decentralized administrative access.' : 'Defining granular access privileges.'}
                     </p>
                  </div>
                  <button type="button" onClick={onClose} className="p-4 border border-primary/10 text-primary/10 hover:text-red-500 transition-all"><X size={20} /></button>
               </div>

               <AnimatePresence mode="wait">
                  {step === 1 ? (
                     <motion.form 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleNext} 
                        className="space-y-8"
                     >
                        <div className="group">
                           <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest block mb-4">Legal Name Log</label>
                           <input 
                              required
                              value={formData.name}
                              onChange={e => setFormData({...formData, name: e.target.value})}
                              className="w-full h-16 bg-bone dark:bg-dark border border-primary/5 px-8 text-sm font-black uppercase focus:border-gold focus:outline-none transition-all"
                              placeholder="ENTER FULL IDENTITY..."
                           />
                        </div>
                        <div className="group">
                           <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest block mb-4">Communications Endpoint</label>
                           <input 
                              required
                              type="email"
                              value={formData.email}
                              onChange={e => setFormData({...formData, email: e.target.value})}
                              className="w-full h-16 bg-bone dark:bg-dark border border-primary/5 px-8 text-sm font-black uppercase focus:border-gold focus:outline-none transition-all"
                              placeholder="IDENTITY@JN_ENTERPRISE.COM"
                           />
                        </div>
                        <div className="group">
                           <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest block mb-4">Authentication Seed</label>
                           <input 
                              required
                              type="password"
                              value={formData.password}
                              onChange={e => setFormData({...formData, password: e.target.value})}
                              className="w-full h-16 bg-bone dark:bg-dark border border-primary/5 px-8 text-sm font-black tracking-widest focus:border-gold focus:outline-none transition-all"
                              placeholder="••••••••••••"
                           />
                        </div>
                        <button type="submit" className="w-full h-20 bg-primary text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-gold transition-all shadow-2xl active:scale-95">
                           {role === 'ADMIN' ? 'Continue to Permissions' : 'Initialize Personnel Decouple'}
                        </button>
                     </motion.form>
                  ) : (
                     <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                     >
                        <div className="grid grid-cols-1 gap-4">
                           {[
                              { id: 'overview', label: 'Access Overview Node' },
                              { id: 'inventory', label: 'Registry Modification' },
                              { id: 'orders', label: 'Fulfillment Logic' },
                              { id: 'settings', label: 'System Configuration' },
                           ].map((perm) => (
                              <button 
                                 key={perm.id}
                                 onClick={() => setPermissions(p => ({...p, [perm.id]: !p[perm.id]}))}
                                 className={`flex items-center justify-between p-6 border transition-all ${permissions[perm.id] ? 'bg-gold/5 border-gold text-primary' : 'bg-bone dark:bg-dark border-primary/10 text-primary/40'}`}
                              >
                                 <span className="text-[10px] font-black uppercase tracking-widest">{perm.label}</span>
                                 <div className={`w-6 h-6 border flex items-center justify-center ${permissions[perm.id] ? 'bg-gold border-gold text-white' : 'border-primary/10'}`}>
                                    {permissions[perm.id] && <Check size={14} strokeWidth={4} />}
                                 </div>
                              </button>
                           ))}
                        </div>
                        <div className="flex gap-4">
                           <button onClick={() => setStep(1)} className="flex-1 h-18 border border-primary/10 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all">Back</button>
                           <button onClick={handleSubmit} className="flex-[2] h-18 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-gold transition-all shadow-xl">Complete Registration</button>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         )}
      </motion.div>
    </div>
  );
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}
