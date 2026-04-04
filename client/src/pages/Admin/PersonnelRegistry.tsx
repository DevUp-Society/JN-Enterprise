import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Mail, 
  X, 
  Shield,
  Trash2,
  LayoutDashboard,
  ShoppingCart,
  Settings as SettingsIcon,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
  Plus,
  Search,
  Users,
  ArrowLeft
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export default function PersonnelRegistry() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<any | null>(null);
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<any | null>(null);
  
  const roleLabel = role === 'admins' ? 'Admin' : 'Worker';
  const apiRole = role === 'admins' ? 'ADMIN' : 'WORKER';

  const fetchPersonnel = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/admin/users?role=${apiRole}`);
      setPersonnel(response.data);
    } catch (error) {
      console.error('FETCH_PERSONNEL_FAILURE', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, [role]);

  const handleTogglePermission = async (userId: string, permissionKey: string, currentValue: boolean) => {
     try {
        const userToUpdate = personnel.find(p => p.id === userId);
        if (!userToUpdate) return;

        const updatedPermissions = {
           ...userToUpdate.permissions,
           [permissionKey]: !currentValue
        };

        // Sync with backend - use consistent map
        await axiosInstance.patch(`/admin/users/permissions/${userId}`, {
           permissions: {
              overview: updatedPermissions.canViewAnalytics,
              inventory: updatedPermissions.canViewInventory,
              products: updatedPermissions.canAddProduct,
              orders: updatedPermissions.canManageOrders,
              partners: updatedPermissions.canManagePartners,
              settings: updatedPermissions.canAccessSettings
           }
        });

        // Update local state
        setPersonnel(prev => prev.map(p => 
           p.id === userId ? { ...p, permissions: updatedPermissions } : p
        ));
        
        if (selectedUserForPermissions?.id === userId) {
           setSelectedUserForPermissions({ ...selectedUserForPermissions, permissions: updatedPermissions });
        }
     } catch (error) {
        console.error('PERMISSION_SYNC_FAILURE', error);
     }
  };

  const handleDeleteUser = async (userId: string) => {
     try {
        await axiosInstance.delete(`/admin/users/${userId}`);
        setPersonnel(prev => prev.filter(p => p.id !== userId));
        setDeleteConfirmUser(null);
     } catch (error) {
        console.error('DELETE_USER_FAILURE', error);
     }
  };

  return (
    <div className="space-y-8 pb-24 select-none">
      <header className="flex flex-col gap-4 border-b border-[#000000]/10 pb-8 mt-4">
        <div className="flex items-center gap-6">
           <button 
              onClick={() => navigate('/admin/settings')}
              className="p-3 hover:bg-[#D6D6D6] rounded-full transition-all text-[#000000]/40 hover:text-black shadow-sm bg-white"
           >
              <ArrowLeft size={24} />
           </button>
           <h1 className="text-3xl font-black text-[#000000] tracking-tighter uppercase leading-none">
              Manage {roleLabel}s
           </h1>
        </div>
        
        <div className="flex items-center justify-end -mt-12">
            <button 
               onClick={() => setShowCreateModal(true)}
               className="px-8 h-12 bg-[#000000] text-white rounded-[18px] flex items-center justify-center gap-3 text-[11px] font-black hover:bg-black/80 transition-all shadow-xl active:scale-95 uppercase tracking-widest"
            >
               <UserPlus size={16} /> New {roleLabel}
            </button>
        </div>
      </header>

      <main className="min-h-[400px] relative">
         <AnimatePresence mode="wait">
            {selectedUserForPermissions ? (
               <motion.div 
                  key="permissions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-10"
               >
                  <div className="flex items-center justify-between p-8 bg-white border-2 border-black/5 rounded-[32px] shadow-2xl relative overflow-hidden group">
                     <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 bg-black rounded-[24px] flex items-center justify-center text-white text-3xl font-black shadow-inner">
                           {selectedUserForPermissions.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-3xl font-black tracking-tighter leading-none uppercase text-black">{selectedUserForPermissions.name}</h4>
                           <p className="text-[10px] font-bold text-black/40 tracking-[0.4em] uppercase">User Profile Access Control</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => setSelectedUserForPermissions(null)}
                        className="px-8 h-12 bg-black text-white rounded-[18px] text-[11px] font-black hover:bg-black/80 transition-all z-20 uppercase tracking-widest shadow-xl"
                     >
                        Save Changes
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {[
                        { key: 'canViewAnalytics', label: 'View Overview', desc: 'Analytics Terminal Visibility', icon: LayoutDashboard },
                        { key: 'canViewInventory', label: 'Read Inventory Registry', desc: 'Registry Catalog Logic (View only)', icon: Search },
                        { key: 'canAddProduct', label: 'Modify Inventory Registry', desc: 'Authorized Creation & Edit Nodes', icon: Plus },
                        { key: 'canManageOrders', label: 'View Order Registry', desc: 'Fulfillment Logic Control', icon: ShoppingCart },
                        { key: 'canManagePartners', label: 'View Partner Registry', desc: 'Retailer & Supplier System Hub', icon: Users },
                        { key: 'canAccessSettings', label: 'View System Registry', desc: 'Global Control & Access Rights', icon: SettingsIcon },
                     ].map((perm) => (
                        <div key={perm.key} className="p-8 border-2 border-[#000000]/5 rounded-[32px] bg-white shadow-xl flex items-center justify-between group transition-all hover:bg-[#D6D6D6]/30">
                           <div className="flex items-center gap-5">
                              <div className="w-12 h-12 bg-[#D6D6D6] rounded-[18px] flex items-center justify-center text-[#000000]/40 group-hover:text-[#000000] group-hover:bg-white transition-all shadow-sm">
                                 <perm.icon size={20} />
                              </div>
                              <div className="space-y-0.5">
                                 <p className="text-[14px] font-black text-[#000000] uppercase tracking-tighter leading-none">{perm.label}</p>
                                 <p className="text-[9px] font-bold text-[#000000]/30 uppercase tracking-tight">{perm.desc}</p>
                              </div>
                           </div>
                           <button 
                              onClick={() => handleTogglePermission(selectedUserForPermissions.id, perm.key, selectedUserForPermissions.permissions?.[perm.key])}
                              className={`w-14 h-8 rounded-full border-2 relative p-1.5 flex items-center transition-all ${selectedUserForPermissions.permissions?.[perm.key] ? 'bg-[#000000] border-[#000000]' : 'bg-[#D6D6D6] border-[#000000]/10'}`}
                           >
                              <motion.div 
                                 animate={{ x: selectedUserForPermissions.permissions?.[perm.key] ? 24 : 0 }}
                                 className={`h-full aspect-square rounded-full bg-white shadow-lg transition-all`} 
                              />
                           </button>
                        </div>
                     ))}
                  </div>
               </motion.div>
            ) : (
               <motion.div 
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border-2 border-[#000000]/5 shadow-xl rounded-[40px] overflow-hidden"
               >
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-[#000000] text-[#D6D6D6]">
                              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] min-w-[300px]">Institutional Personnel</th>
                              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em]">Email Node</th>
                              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em]">Last Active</th>
                              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[#000000]/5">
                           {loading ? (
                             Array.from({ length: 4 }).map((_, i) => (
                               <tr key={i} className="animate-pulse">
                                 <td colSpan={4} className="px-10 py-8 bg-[#D6D6D6]/20" />
                               </tr>
                             ))
                           ) : personnel.length === 0 ? (
                              <tr>
                                 <td colSpan={4} className="p-32 text-center">
                                    <p className="text-[12px] font-black text-[#000000]/20 uppercase tracking-[0.5em]">No records found</p>
                                 </td>
                              </tr>
                           ) : personnel.map((person: any) => (
                              <tr 
                                 key={person.id} 
                                 className="group hover:bg-[#D6D6D6]/40 transition-all cursor-pointer h-20"
                                 onClick={() => roleLabel === 'Admin' && setSelectedUserForPermissions(person)}
                              >
                                 <td className="px-10 py-4">
                                    <div className="flex items-center gap-6">
                                       <div className="w-12 h-12 bg-white border border-[#000000]/10 rounded-[14px] flex items-center justify-center text-[#000000]/40 group-hover:bg-[#000000] group-hover:text-white transition-all text-sm font-black shadow-sm">
                                          {person.name.charAt(0).toUpperCase()}
                                       </div>
                                       <div className="space-y-1">
                                          <p className="text-[14px] font-black text-[#000000] uppercase tracking-tighter leading-none">{person.name}</p>
                                          <code className="text-[9px] font-bold text-[#000000]/20 uppercase tracking-[0.2em]">ID: {person.id.split('-')[0]}</code>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-10 py-4">
                                    <div className="flex items-center gap-3 text-[#000000]/40">
                                       <Mail size={14} className="opacity-30" />
                                       <span className="text-[12px] font-bold tracking-tight lowercase truncate">{person.email}</span>
                                    </div>
                                 </td>
                                 <td className="px-10 py-4 text-[12px] font-bold text-[#000000]/20 uppercase tracking-tighter">
                                    {new Date(person.lastActive || Date.now()).toLocaleTimeString()}
                                 </td>
                                 <td className="px-10 py-4 text-right relative">
                                    <div className="flex justify-end gap-3 transition-opacity">
                                       {roleLabel === 'Admin' && (
                                          <button 
                                             onClick={(e) => { e.stopPropagation(); setSelectedUserForPermissions(person); }}
                                             className="w-10 h-10 rounded-full bg-white border border-[#000000]/10 flex items-center justify-center text-[#000000]/40 hover:bg-[#000000] hover:text-white transition-all shadow-sm"
                                          >
                                             <Shield size={16} />
                                          </button>
                                       )}
                                       <button 
                                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmUser(person); }}
                                          className="w-10 h-10 rounded-full bg-white border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                       >
                                          <Trash2 size={16} />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </main>

      {/* CREATE_PERSONNEL_MODAL */}
      <AnimatePresence>
         {showCreateModal && (
            <CreatePersonnelModal 
               role={apiRole} 
               onClose={() => setShowCreateModal(false)}
               onComplete={() => {
                  setShowCreateModal(false);
                  fetchPersonnel();
               }}
            />
         )}
      </AnimatePresence>

      {/* DELETE_CONFIRMATION_MODAL */}
      <AnimatePresence>
         {deleteConfirmUser && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
               <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-16 text-center space-y-10 border-2 border-red-500/10"
               >
                  <div className="w-20 h-20 bg-red-500/10 rounded-full mx-auto flex items-center justify-center text-red-500">
                     <AlertTriangle size={40} className="animate-pulse" />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-4xl font-black text-black tracking-tighter uppercase leading-tight">Delete User?</h3>
                     <p className="text-[13px] font-bold text-black/40 uppercase tracking-widest leading-relaxed">
                        Are you sure you want to remove <span className="text-black">{deleteConfirmUser.name}</span>? Access will be terminated immediately.
                     </p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <button 
                        onClick={() => setDeleteConfirmUser(null)}
                        className="h-14 bg-[#D6D6D6] text-black rounded-[18px] text-[11px] font-black uppercase tracking-widest hover:bg-[#C2C2C2] transition-colors"
                     >
                        Cancel
                     </button>
                     <button 
                        onClick={() => handleDeleteUser(deleteConfirmUser.id)}
                        className="h-14 bg-red-500 text-white rounded-[18px] text-[11px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                     >
                        Delete User
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}

function CreatePersonnelModal({ role, onClose, onComplete }: any) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    overview: false,
    inventory: false,
    products: false,
    orders: false,
    partners: false,
    settings: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'ADMIN') {
      setStep(2);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await axiosInstance.post('/admin/users/create', { 
        ...formData, 
        role, 
        permissions 
      });
      onComplete();
    } catch (err: any) {
      console.error('CREATE_USER_FAILURE', err);
      setError(err.response?.data?.message || 'Failed to establish personnel record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
      <motion.div 
         initial={{ scale: 0.95, opacity: 0, y: 20 }}
         animate={{ scale: 1, opacity: 1, y: 0 }}
         className="w-full max-w-xl bg-white rounded-[40px] shadow-2xl p-16 relative overflow-hidden"
      >
         <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-[#D6D6D6] rounded-full text-[#000000]/20 hover:text-black transition-all z-20 shadow-sm"><X size={18} /></button>
         
         <div className="space-y-10">
            <div className="space-y-2">
               <h3 className="text-4xl font-black text-black tracking-tighter uppercase leading-none">
                  {step === 1 ? 'New Personnel' : 'Set Permissions'}
               </h3>
               <p className="text-[11px] font-bold text-black/40 uppercase tracking-[0.3em]">
                  {step === 1 ? `Enroll a new ${role === 'ADMIN' ? 'admin' : 'worker'} access node` : 'Define specific access rights'}
               </p>
            </div>

            {error && (
               <div className="p-5 bg-red-500/5 border-2 border-red-500/10 rounded-[18px]">
                  <p className="text-[11px] font-black text-red-500 uppercase tracking-widest">{error}</p>
               </div>
            )}

            <AnimatePresence mode="wait">
               {step === 1 ? (
                  <motion.form 
                     key="step1"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     onSubmit={handleNext} 
                     className="space-y-6"
                     autoComplete="off"
                  >
                      <div className="space-y-5">
                         <div className="space-y-2">
                            <label className="text-[11px] font-black text-[#000000]/40 uppercase tracking-widest ml-2">Name</label>
                            <input 
                               required
                               autoComplete="one-time-code"
                               value={formData.name}
                               onChange={e => setFormData({...formData, name: e.target.value})}
                               className="w-full h-14 bg-[#D6D6D6]/30 border-2 border-transparent rounded-[18px] px-6 text-sm font-bold text-[#000000] focus:border-[#000000]/10 focus:bg-white transition-all shadow-inner"
                               placeholder="Enter name"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[11px] font-black text-[#000000]/40 uppercase tracking-widest ml-2">Mail</label>
                            <input 
                               required
                               autoComplete="off"
                               type="email"
                               value={formData.email}
                               onChange={e => setFormData({...formData, email: e.target.value})}
                               className="w-full h-14 bg-[#D6D6D6]/30 border-2 border-transparent rounded-[18px] px-6 text-sm font-bold text-[#000000] focus:border-[#000000]/10 focus:bg-white transition-all shadow-inner"
                               placeholder="user@jn-enterprise.com"
                            />
                         </div>
                         <div className="space-y-2 relative">
                            <label className="text-[11px] font-black text-[#000000]/40 uppercase tracking-widest ml-2">Password</label>
                            <div className="relative">
                               <input 
                                  required
                                  autoComplete="new-password"
                                  type={showPassword ? 'text' : 'password'}
                                  value={formData.password}
                                  onChange={e => setFormData({...formData, password: e.target.value})}
                                  className="w-full h-14 bg-[#D6D6D6]/30 border-2 border-transparent rounded-[18px] px-6 text-sm font-bold text-[#000000] focus:border-[#000000]/10 focus:bg-white transition-all shadow-inner"
                                  placeholder="••••••••"
                               />
                               <button 
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-5 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                                >
                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                               </button>
                            </div>
                         </div>
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full h-14 bg-[#000000] rounded-[20px] text-white text-[12px] font-black uppercase tracking-[0.4em] hover:bg-black/80 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                      >
                         {loading ? 'Processing...' : role === 'ADMIN' ? 'Next' : 'Create User'}
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
                     <div className="grid grid-cols-1 gap-3">
                        {[
                           { id: 'overview', label: 'View Overview' },
                           { id: 'inventory', label: 'Read Inventory Registry' },
                           { id: 'products', label: 'Modify Inventory Registry' },
                           { id: 'orders', label: 'View Order Registry' },
                           { id: 'partners', label: 'View Partner Registry' },
                           { id: 'settings', label: 'View System Registry' },
                        ].map((perm) => (
                           <button 
                              key={perm.id}
                              onClick={() => setPermissions(p => ({...p, [perm.id]: !p[perm.id]}))}
                              className={`flex items-center justify-between px-6 py-4 rounded-[18px] transition-all border-2 ${permissions[perm.id] ? 'bg-[#000000] border-[#000000] text-white shadow-lg' : 'bg-[#D6D6D6]/30 border-transparent text-black/30 hover:bg-[#D6D6D6]'}`}
                           >
                              <span className="text-[12px] font-black uppercase tracking-widest">{perm.label}</span>
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${permissions[perm.id] ? 'bg-white text-black' : 'bg-black/10'}`}>
                                 {permissions[perm.id] && <Check size={12} strokeWidth={4} />}
                              </div>
                           </button>
                        ))}
                     </div>
                     <div className="flex gap-4 mt-8">
                        <button onClick={() => setStep(1)} className="flex-1 h-14 bg-[#D6D6D6] text-black rounded-[18px] text-[11px] font-black uppercase tracking-widest hover:bg-[#C2C2C2] transition-colors">Back</button>
                        <button 
                           onClick={handleSubmit} 
                           disabled={loading}
                           className="flex-[2] h-14 bg-[#000000] text-white rounded-[18px] text-[12px] font-black uppercase tracking-widest hover:bg-black/80 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                        >
                           {loading ? 'Creating...' : 'Finalize Profile'}
                        </button>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </motion.div>
    </div>
  );
}
