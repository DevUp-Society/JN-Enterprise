import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/premium/Logo';
import { ArrowRight, Loader2, Lock, Mail, User, CheckCircle2, ShieldCheck, Zap, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  useEffect(() => {
    // If user is already logged in, redirect them to their home base
    const storedUser = localStorage.getItem('jn_user');
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      if (userObj.role === 'ADMIN' || userObj.role === 'SUPER_ADMIN') navigate('/admin');
      else if (userObj.role === 'WORKER') navigate('/worker');
      else navigate('/home');
    }
  }, [navigate]);

  useEffect(() => {
    if (!isLogin) {
      setPasswordStrength({
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[@$!%*?&]/.test(password)
      });
    }
  }, [password, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (isLogin) {
      try {
        const user = await login(email, password);
        if (user) {
          if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') navigate('/admin');
          else if (user.role === 'WORKER') navigate('/worker');
          else navigate('/home');
        } else {
          setError('Invalid email or password.');
        }
      } catch (err: any) {
        setError(err.message || 'Login failed.');
      }
    } else {
      // Frontend validation
      const isStrong = Object.values(passwordStrength).every(Boolean);
      if (!isStrong) {
        setError('Please fulfill all password requirements.');
        return;
      }

      try {
        const user = await register({ name, shopName, address, phone, email, password });
        if (user) {
          setSuccess(true);
          setTimeout(() => {
            setIsLogin(true);
            setSuccess(false);
            setError('');
            setPassword(''); // Clear password after successful registration
          }, 3000);
        } else {
          setError('Registration failed. Please try again.');
        }
      } catch (err: any) {
        setError(err.message || 'Registration failed.');
      }
    }
  };

  const StrengthItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${met ? 'text-[#000000]' : 'text-black/30'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-[#000000]' : 'bg-black/10'}`} />
      {text}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#D6D6D6] flex flex-col lg:flex-row font-sans selection:bg-[#000000] selection:text-white overflow-hidden">
      
      {/* 1. Left Panel (Industrial Brand Narrative) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#000000] overflow-hidden items-center justify-center">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad86d7c7170a?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center mix-blend-overlay opacity-20 grayscale" />
         
         <div className="relative z-10 p-24 space-y-12 max-w-xl text-white">
            <div className="space-y-6">
               <div className="w-12 h-1 bg-[#FFFFFF]" />
               <Logo className="text-white text-3xl font-bold" />
            </div>

            <div className="space-y-6">
               <h2 className="text-6xl font-semibold tracking-tight leading-[1.1]">
                  {isLogin ? "Welcome Back to JN Global_" : "Join the Wholesale Network_"}
               </h2>
               <p className="text-lg text-white/50 font-medium leading-relaxed">
                  {isLogin 
                    ? "Sign in to manage your wholesale orders and view the latest stock arrivals."
                    : "Create an account to start your direct manufacturing partnership with us."}
               </p>
            </div>

            <div className="flex items-center gap-10 pt-10 border-t border-white/10">
                <div className="flex items-center gap-3">
                   <ShieldCheck className="text-[#FFFFFF]" size={20} />
                   <span className="text-[12px] font-bold uppercase tracking-widest text-white/80">Secure Portal</span>
                </div>
                <div className="flex items-center gap-3">
                   <Zap className="text-[#FFFFFF]" size={20} />
                   <span className="text-[12px] font-bold uppercase tracking-widest text-white/80">Direct Factory</span>
                </div>
            </div>
         </div>
      </div>

      {/* 2. Login/Register Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 sm:px-16 lg:px-32 bg-[#D6D6D6] py-20 overflow-y-auto">
         <div className="w-full max-w-md space-y-8">
            
            <div className="space-y-2">
               <div className="lg:hidden mb-12">
                  <Logo className="text-black text-2xl font-bold" />
               </div>
               <h3 className="text-[32px] font-semibold text-[#000000] tracking-tight">
                  {isLogin ? "Login" : "Create Account"}
               </h3>
               <p className="text-[14px] text-black/60 font-medium font-sans">
                  {isLogin ? "Enter your details to sign in" : "Sign up to start buying wholesale"}
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-4">
                  {!isLogin && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 group">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-2">
                          <User size={14} className="text-[#000000]" /> name
                        </label>
                        <input 
                          type="text" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-white border border-transparent rounded-[14px] px-6 py-4 text-[14px] font-medium focus:outline-none focus:border-[#000000] shadow-sm transition-all text-[#000000]"
                          required
                        />
                      </div>
                      <div className="space-y-2 group">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-2">
                          <Zap size={14} className="text-[#000000]" /> shop name
                        </label>
                        <input 
                          type="text" 
                          value={shopName} 
                          onChange={(e) => setShopName(e.target.value)}
                          placeholder="Store Name"
                          className="w-full bg-white border border-transparent rounded-[14px] px-6 py-4 text-[14px] font-medium focus:outline-none focus:border-[#000000] shadow-sm transition-all text-[#000000]"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {!isLogin && (
                    <div className="space-y-2 group">
                       <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-2">
                          <ShieldCheck size={14} className="text-[#000000]" /> shop address
                       </label>
                       <input 
                          type="text" 
                          value={address} 
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Detailed shop address"
                          className="w-full bg-white border border-transparent rounded-[14px] px-6 py-4 text-[14px] font-medium focus:outline-none focus:border-[#000000] shadow-sm transition-all text-[#000000]"
                          required
                       />
                    </div>
                  )}

                  {!isLogin && (
                    <div className="space-y-2 group">
                       <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-2">
                          <Phone size={14} className="text-[#000000]" /> phone
                       </label>
                       <input 
                          type="tel" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 00000 00000"
                          className="w-full bg-white border border-transparent rounded-[14px] px-6 py-4 text-[14px] font-medium focus:outline-none focus:border-[#000000] shadow-sm transition-all text-[#000000]"
                          required
                       />
                    </div>
                  )}

                  <div className="space-y-2 group">
                     <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-2">
                        <Mail size={14} className="text-[#000000]" /> mail
                     </label>
                     <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full bg-white border border-transparent rounded-[14px] px-6 py-4 text-[14px] font-medium focus:outline-none focus:border-[#000000] shadow-sm transition-all text-[#000000]"
                        required 
                     />
                  </div>

                  <div className="space-y-2 group">
                     <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-2">
                        <Lock size={14} className="text-[#000000]" /> password
                     </label>
                     <div className="relative">
                        <input 
                           type={showPassword ? "text" : "password"} 
                           value={password} 
                           onChange={(e) => setPassword(e.target.value)}
                           placeholder="••••••••"
                           className="w-full bg-white border border-transparent rounded-[14px] px-6 py-4 text-[14px] font-medium focus:outline-none focus:border-[#000000] shadow-sm transition-all text-[#000000]"
                           required 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-[#000000] transition-colors"
                        >
                          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                     </div>
                     {!isLogin && password.length > 0 && (
                       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-white/50 rounded-xl mt-4 grid grid-cols-2 gap-y-2">
                          <StrengthItem met={passwordStrength.length} text="8+ Characters" />
                          <StrengthItem met={passwordStrength.upper} text="Uppercase" />
                          <StrengthItem met={passwordStrength.lower} text="Lowercase" />
                          <StrengthItem met={passwordStrength.number} text="Number" />
                          <StrengthItem met={passwordStrength.special} text="Special Char" />
                       </motion.div>
                     )}
                  </div>
               </div>

               <div className="space-y-4 pt-4">
                  {error && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-black/5 border border-black/10 rounded-xl flex items-center gap-3">
                        <AlertCircle size={16} className="text-black" />
                        <p className="text-[12px] font-bold text-black uppercase tracking-tight">{error}</p>
                     </motion.div>
                  )}

                  {success && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-black/5 border border-black/10 rounded-xl flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-black" />
                        <p className="text-[12px] font-bold text-black uppercase tracking-tight">Account Created! Syncing Terminal...</p>
                     </motion.div>
                  )}

                  <button 
                     type="submit"
                     disabled={loading}
                     className="w-full bg-[#000000] text-white py-4 rounded-[14px] text-[15px] font-semibold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg active:scale-[0.98] group disabled:opacity-50"
                  >
                     {loading ? <Loader2 className="animate-spin" size={18} /> : (
                        <>
                           <span>{isLogin ? "Login to Terminal" : "Start Partnership"}</span>
                           <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                     )}
                  </button>

                  <button 
                     type="button"
                     onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(false); setPassword(''); }}
                     className="w-full py-2 text-[13px] font-bold text-black/40 hover:text-[#000000] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                     {isLogin ? "Initialize New Partnership" : "Existing Facility Login"}
                  </button>
               </div>
            </form>
         </div>
      </div>
    </div>
  );
}










