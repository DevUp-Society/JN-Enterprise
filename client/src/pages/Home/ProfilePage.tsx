import { useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import { User, ShieldCheck, Mail, MapPin, Building2, Activity, Phone, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, Key } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const { user } = useAuth();
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!user) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const resp = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await resp.json();
      if (resp.ok) {
        setSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => {
          setShowPasswordSection(false);
          setSuccess('');
        }, 3000);
      } else {
        setError(data.message || 'Failed to update password.');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen selection:bg-black selection:text-white">
       <main className="max-w-[1400px] mx-auto px-8 pt-10 pb-32">
          
          {/* COMPACT HEADER */}
          <div className="border-b border-black/10 pb-8 mb-10 flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="space-y-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-black text-black tracking-tighter uppercase leading-none">Account Dashboard</h1>
             </div>
             <div className="flex gap-4">
                <Link to="/orders" className="text-[11px] font-black uppercase tracking-widest text-[#D6D6D6] bg-black hover:bg-[#D6D6D6] hover:text-black transition-all rounded-[10px] px-8 py-4 shadow-sm active:scale-95 flex items-center gap-3">
                   <Activity size={16} /> REGISTRY LOGS
                </Link>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
             
             {/* PROFILE CARD - Transitioned from Black to Grey as requested */}
             <div className="lg:col-span-4 bg-[#D6D6D6] text-black p-10 md:p-14 rounded-[12px] border border-black/10 relative overflow-hidden group shadow-sm transition-all">
                <div className="absolute top-0 right-0 w-80 h-80 bg-black/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none group-hover:bg-black/20 transition-all duration-700" />
                
                <div className="relative z-10 space-y-8">
                   <div className="flex items-center gap-8">
                      <div className="w-20 h-20 bg-white rounded-[12px] flex items-center justify-center border border-black/5 shadow-xs group-hover:scale-105 transition-transform duration-500">
                         <User size={40} className="text-black" />
                      </div>
                      <div className="min-w-0">
                         <h2 className="text-2xl font-black tracking-tight uppercase leading-none truncate">{user.name || 'Enterprise User'}</h2>
                         <div className="flex items-center gap-3 mt-3 text-black/40 font-black uppercase text-[10px] tracking-widest bg-white/50 px-3 py-1 rounded-[4px] w-fit">
                            <ShieldCheck size={14} className="text-black" /> Verified <span className="text-black font-black">{user.role}</span>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6 pt-2">
                      <div className="flex items-center gap-5">
                         <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 border border-black/5"><Building2 size={18} className="text-black/30" /></div>
                         <div className="min-w-0">
                            <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] mb-0.5 leading-none">Entity Name</p>
                            <p className="text-[15px] font-black text-black tracking-tight truncate uppercase leading-none">{user.role === 'RETAILER' ? (user.company?.name || 'Partner Facility') : 'JN Enterprise Internal'}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-5">
                         <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 border border-black/5"><Mail size={18} className="text-black/30" /></div>
                         <div className="min-w-0">
                            <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] mb-0.5 leading-none">Remittance ID</p>
                            <p className="text-[15px] font-black text-black tracking-tight truncate lowercase leading-none">{user.email}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-5">
                         <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 border border-black/5"><Phone size={18} className="text-black/30" /></div>
                         <div className="min-w-0">
                            <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] mb-0.5 leading-none">Terminal Contact</p>
                            <p className="text-[15px] font-black text-black tracking-tight truncate leading-none">{user.phone || 'No direct line'}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-5">
                         <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 border border-black/5"><MapPin size={18} className="text-black/30" /></div>
                         <div className="min-w-0">
                            <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] mb-0.5 leading-none">Operating Zone</p>
                            <p className="text-[13px] font-black text-black/80 tracking-tight leading-relaxed line-clamp-2 uppercase">{user.address || 'Location Unspecified'}</p>
                         </div>
                      </div>
                   </div>

                   <button 
                     onClick={() => setShowPasswordSection(!showPasswordSection)}
                     className="w-full mt-4 bg-white text-black py-4 rounded-[6px] font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all shadow-sm flex items-center justify-center gap-4 active:scale-95"
                   >
                      CHANGE PASSWORD <Key size={16} />
                   </button>

                   <AnimatePresence>
                      {showPasswordSection && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pt-4 overflow-hidden"
                        >
                           <form onSubmit={handlePasswordChange} className="space-y-4 bg-white p-6 rounded-[8px] border border-black/10">
                              <div className="space-y-1.5">
                                 <label className="text-[9px] font-black text-black/30 uppercase tracking-widest">Current Key</label>
                                 <div className="relative">
                                    <input 
                                      type={showCurrentPassword ? "text" : "password"} 
                                      value={currentPassword}
                                      onChange={(e) => setCurrentPassword(e.target.value)}
                                      className="w-full bg-[#D6D6D6]/20 border border-black/10 rounded-lg px-4 py-3 text-[13px] font-black focus:outline-none focus:border-black"
                                      placeholder="••••••••"
                                      required
                                    />
                                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/20 hover:text-black">
                                       {showCurrentPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                 </div>
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-[9px] font-black text-black/30 uppercase tracking-widest">New Protocol</label>
                                 <div className="relative">
                                    <input 
                                      type={showNewPassword ? "text" : "password"} 
                                      value={newPassword}
                                      onChange={(e) => setNewPassword(e.target.value)}
                                      className="w-full bg-[#D6D6D6]/20 border border-black/10 rounded-lg px-4 py-3 text-[13px] font-black focus:outline-none focus:border-black"
                                      placeholder="••••••••"
                                      required
                                    />
                                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/20 hover:text-black">
                                       {showNewPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                 </div>
                              </div>

                              {error && <div className="text-[10px] font-black text-red-600 uppercase tracking-tight flex items-center gap-2"><AlertCircle size={13} /> {error}</div>}
                              {success && <div className="text-[10px] font-black text-green-600 uppercase tracking-tight flex items-center gap-2"><CheckCircle2 size={13} /> {success}</div>}

                              <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-black text-white py-3 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#D6D6D6] hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                              >
                                 {loading ? <Loader2 size={14} className="animate-spin" /> : 'RE-SYNC PASSKEY'}
                              </button>
                           </form>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             </div>

             {/* STATS & RECENT OPERATIONS */}
             <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div className="p-8 bg-[#D6D6D6] border border-black/10 rounded-[12px] shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                      <div className="absolute -right-8 -top-8 w-24 h-24 bg-black/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                      <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] leading-none">Node Value</p>
                      <h3 className="text-3xl font-black text-black mt-3 tracking-tighter leading-none">₹4.28M</h3>
                      <div className="flex items-center gap-2 mt-4 text-black/40 font-black text-[10px] uppercase tracking-widest leading-none"><Activity size={12} /> Positive Pulse</div>
                   </div>
                   <div className="p-8 bg-[#D6D6D6] border border-black/10 rounded-[12px] shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                      <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] leading-none">GST Entity</p>
                      <h3 className="text-[14px] font-black text-black mt-4 tracking-widest leading-none">29ABCDE1234F1Z5</h3>
                      <div className="flex items-center gap-2 mt-5 text-black/40 font-black text-[10px] uppercase tracking-widest leading-none"><ShieldCheck size={12} /> Verified</div>
                   </div>
                   <div className="p-8 bg-[#D6D6D6] border border-black/10 rounded-[12px] shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                      <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] leading-none">Credit Pulse</p>
                      <h3 className="text-xl font-black text-black mt-3 tracking-tighter leading-none uppercase">Net 30 Nominal</h3>
                      <p className="text-[10px] font-black text-black/40 mt-4 uppercase tracking-[0.1em] leading-none">Utilization: 14%</p>
                   </div>
                </div>
                
                <div className="bg-white p-8 md:p-12 border border-black/10 rounded-[12px] shadow-sm space-y-10">
                   <div className="flex items-center justify-between border-b border-black/10 pb-6">
                      <h3 className="text-xl font-black uppercase tracking-tighter text-black leading-none">Infrastructure Hub</h3>
                      <div className="w-2.5 h-2.5 bg-black rounded-full animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.3)]" />
                   </div>
                   <div className="space-y-8">
                      <div className="flex justify-between items-center group gap-4">
                         <div className="space-y-1.5 min-w-0">
                            <p className="text-[10px] font-black text-black/30 uppercase tracking-widest leading-none">Authorized Lead</p>
                            <p className="text-lg font-black text-black tracking-tight leading-none truncate uppercase">Sarah Jenkins</p>
                            <p className="text-[12px] text-black/50 font-black mt-1 leading-none truncate lowercase">sarah.j@jn.enterprise.com</p>
                         </div>
                         <button className="shrink-0 px-6 py-3 bg-[#D6D6D6] text-black text-[10px] font-black uppercase tracking-widest rounded-[6px] border border-black/10 hover:bg-black hover:text-white transition-all shadow-sm">Protocol Link</button>
                      </div>
                      <div className="flex justify-between items-center group gap-4">
                         <div className="space-y-1.5 min-w-0">
                            <p className="text-[10px] font-black text-black/30 uppercase tracking-widest leading-none">Default Terminal</p>
                            <p className="text-lg font-black text-black tracking-tight leading-none truncate uppercase">Facility A Central</p>
                            <p className="text-[12px] text-black/50 font-black mt-1 leading-none truncate uppercase">Primary fulfillment gate.</p>
                         </div>
                         <button className="shrink-0 px-6 py-3 bg-[#D6D6D6] text-black text-[10px] font-black uppercase tracking-widest rounded-[6px] border border-black/10 hover:bg-black hover:text-white transition-all shadow-sm">Sync Re-Route</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </main>
    </div>
  )
}
