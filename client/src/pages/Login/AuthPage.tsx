import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../store/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../../components/premium/Logo';
import { ArrowRight, Loader, Lock, Mail, User, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const { user, login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'WORKER') {
        navigate('/worker/orders');
      } else {
        navigate('/home');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (isLogin) {
      const userResult = await login(email, password);
      if (userResult) {
        if (userResult.role === 'ADMIN') {
          navigate('/admin');
        } else if (userResult.role === 'WORKER') {
          navigate('/worker/orders');
        } else {
          navigate('/home');
        }
      } else {
        setError('Incorrect email or password. Please try again.');
      }
    } else {
      const userResult = await register(name, email, password);
      if (userResult) {
        setSuccess(true);
        setTimeout(() => {
          setIsLogin(true);
          setSuccess(false);
          setError('');
        }, 2000);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white flex overflow-hidden font-sans selection:bg-primary/20"
    >
      {/* Visual Identity Panel (Left) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-20 bg-dark">
         <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
            alt="HQ Architecture"
         />
         <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark/80 to-transparent" />
         
         <div className="relative z-10">
            <Link to="/">
               <Logo className="text-white scale-125 origin-left" />
            </Link>
            <div className="mt-24 space-y-4">
               <div className="h-1 w-12 bg-primary" />
               <h2 className="text-8xl font-black text-white leading-tight tracking-tighter uppercase font-serif">
                  JN GLOBAL <br />
                  <span className="text-primary italic">ENTERPRISE_</span>
               </h2>
               <p className="text-white/40 text-sm font-bold uppercase tracking-widest max-w-sm leading-relaxed">
                  The infrastructure of industrial distribution and global wholesale networking.
               </p>
            </div>
         </div>

         <div className="relative z-10 pt-10 border-t border-white/10 flex justify-between items-center text-[10px] font-black text-white/20 uppercase tracking-widest">
            <span>ISO 9001:2015 CERTIFIED</span>
            <span>Est. 1998</span>
         </div>
      </div>

      {/* Form Panel (Right) */}
      <div className="flex-1 flex flex-col justify-center px-12 md:px-24 bg-[#FDFDFD] relative">
         <div className="max-w-md w-full mx-auto space-y-12">
            <div className="space-y-4 text-center lg:text-left">
               <h1 className="text-6xl font-black text-dark uppercase tracking-tighter leading-none">
                  {isLogin ? "Login_" : "Sign Up_"}
               </h1>
               <p className="text-[11px] font-bold text-dark/30 uppercase tracking-[0.2em] leading-relaxed">
                  {isLogin ? "Access your enterprise workspace." : "Create your wholesale partner account."}
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="space-y-6">
                  <AnimatePresence mode="wait">
                     {!isLogin && (
                        <motion.div 
                           initial={{ opacity: 0, y: -10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -10 }}
                           className="space-y-2"
                        >
                           <label className="text-[10px] font-black text-dark/40 uppercase tracking-widest flex items-center gap-2">
                              <User size={12} className="text-primary" /> Full Name
                           </label>
                           <input 
                              type="text" 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="John Doe"
                              className="w-full bg-white border border-dark/10 p-5 text-[14px] text-dark font-bold focus:outline-none focus:border-primary transition-all rounded-xl placeholder:text-dark/10 shadow-sm"
                              required={!isLogin}
                           />
                        </motion.div>
                     )}
                  </AnimatePresence>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-dark/40 uppercase tracking-widest flex items-center gap-2">
                        <Mail size={12} className="text-primary" /> Email Address
                     </label>
                     <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-white border border-dark/10 p-5 text-[14px] text-dark font-bold focus:outline-none focus:border-primary transition-all rounded-xl placeholder:text-dark/10 shadow-sm"
                        required 
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-dark/40 uppercase tracking-widest flex items-center gap-2">
                        <Lock size={12} className="text-primary" /> Password
                     </label>
                     <div className="relative group">
                        <input 
                           type={showPassword ? "text" : "password"} 
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           placeholder="********"
                           className="w-full bg-white border border-dark/10 p-5 text-[14px] text-dark font-bold focus:outline-none focus:border-primary transition-all rounded-xl placeholder:text-dark/10 shadow-sm pr-14"
                           required 
                        />
                        <button 
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-5 top-1/2 -translate-y-1/2 text-primary hover:text-dark transition-colors"
                        >
                           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  {error && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-red-50 border-l-4 border-red-500 text-[10px] font-black uppercase tracking-widest text-red-600"
                     >
                        {error}
                     </motion.div>
                  )}

                  {success && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-green-50 border-l-4 border-green-500 text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-3"
                     >
                        <CheckCircle size={14} /> Account Created Successfully
                     </motion.div>
                  )}

                  <button 
                     type="submit"
                     disabled={loading}
                     className="w-full h-20 bg-primary text-white rounded-xl text-[14px] font-black tracking-widest uppercase hover:bg-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-6 disabled:opacity-50"
                  >
                     {loading ? <Loader className="animate-spin" size={20} /> : (
                        <>
                           {isLogin ? "Login" : "Create Account"}
                           <ArrowRight size={20} />
                        </>
                     )}
                  </button>

                  <button 
                     type="button"
                     onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setSuccess(false);
                     }}
                     className="w-full text-center"
                  >
                     <span className="text-[10px] font-black text-dark/20 uppercase tracking-widest hover:text-primary transition-colors">
                        {isLogin ? "Need an account? Sign Up" : "Back to Login"}
                     </span>
                  </button>
               </div>
            </form>
            
               <div className="pt-8 border-t border-dark/5 flex flex-col sm:flex-row justify-between items-center gap-4 opacity-40">
                  <span className="text-[9px] font-black uppercase tracking-widest">Help: admin@jn.com (Admin) | worker@jn.com (Worker)</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">Pass: admin123</span>
               </div>
         </div>
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
    </motion.div>
  );
}
