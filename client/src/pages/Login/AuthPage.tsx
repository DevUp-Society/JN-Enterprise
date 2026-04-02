import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/premium/Logo';
import { ArrowRight, Loader, Lock, Mail, User, ArrowLeft, CheckCircle } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (isLogin) {
      const user = await login(email, password);
      if (user) {
        if (user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/catalog');
        }
      } else {
        setError('Incorrect email or password. Please try again.');
      }
    } else {
      const user = await register(name, email, password);
      if (user) {
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
      className="min-h-screen bg-bone flex flex-col lg:flex-row overflow-hidden selection:bg-gold selection:text-white"
    >
      {/* Visual Side Panel (Slate Blue) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 2 }}
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200" 
          className="absolute inset-0 w-full h-full object-cover grayscale"
          alt="Professional Workspace"
        />
        <div className="absolute inset-0 flex flex-col justify-between p-20">
          <Logo className="text-white scale-[1.2] origin-left" />
          
          <div className="space-y-8 max-w-md">
             <div className="space-y-4">
                <div className="h-[2px] w-12 bg-gold" />
                <h2 className="text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                   {isLogin ? "Welcome Back_" : "Start Now_"}
                </h2>
             </div>
             <p className="text-lg font-light text-white/50 leading-relaxed italic">
                Access the global wholesale archive and manage your premium inventory with precision.
             </p>
          </div>
        </div>
      </div>

      {/* Form Panel (White / Bone Contrast) */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 bg-white lg:bg-bone/20 relative">
        <div className="max-w-md w-full mx-auto space-y-12 backdrop-blur-sm p-10 bg-white/40 border border-slate/5 lg:border-none lg:bg-transparent shadow-2xl lg:shadow-none">
          <div className="space-y-4">
             <Logo className="lg:hidden mb-12" />
             <h3 className="text-5xl font-black text-slate tracking-tighter uppercase leading-none">
               {isLogin ? "Login" : "Sign Up"}
             </h3>
             <p className="text-[10px] font-bold opacity-30 tracking-widest-xl uppercase">
               {isLogin ? "Enter your details to access your account" : "Sign up to start your wholesale partnership"}
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-8">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 group"
                  >
                    <div className="flex items-center gap-2 opacity-30 group-focus-within:opacity-100 transition-opacity">
                       <User size={12} className="text-gold" />
                       <label className="text-[10px] tracking-widest-xl uppercase font-black text-black">Full Name</label>
                    </div>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-bone/30 border border-slate/10 p-5 focus:outline-none focus:border-gold transition-all text-slate font-bold placeholder:opacity-10 placeholder:text-[9px] placeholder:uppercase placeholder:tracking-widest"
                      required={!isLogin}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3 group">
                <div className="flex items-center gap-2 opacity-30 group-focus-within:opacity-100 transition-opacity">
                   <Mail size={12} className="text-gold" />
                   <label className="text-[10px] tracking-widest-xl uppercase font-black text-black">Email</label>
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-bone/30 border border-slate/10 p-5 focus:outline-none focus:border-gold transition-all text-slate font-bold placeholder:opacity-10 placeholder:text-[9px] placeholder:uppercase placeholder:tracking-widest"
                  required 
                />
              </div>
              
              <div className="space-y-3 group">
                <div className="flex items-center gap-2 opacity-30 group-focus-within:opacity-100 transition-opacity">
                   <Lock size={12} className="text-gold" />
                   <label className="text-[10px] tracking-widest-xl uppercase font-black text-black">Password</label>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-bone/30 border border-slate/10 p-5 focus:outline-none focus:border-gold transition-all text-slate font-bold placeholder:opacity-10"
                  required 
                />
              </div>
            </div>

            <div className="space-y-6">
              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[9px] font-bold tracking-widest-xl uppercase text-red-500 bg-red-50 p-4 border-l-2 border-red-500"
                >
                  {error}
                </motion.p>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[9px] font-bold tracking-widest-xl uppercase text-green-600 bg-green-50 p-4 border-l-2 border-green-600 flex items-center gap-3"
                >
                  <CheckCircle size={14} /> Account Created Successfully
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-slate text-bone py-6 text-xs font-black tracking-widest-xl uppercase hover:bg-black transition-all shadow-xl flex items-center justify-center gap-4 group"
              >
                {loading ? <Loader className="animate-spin" size={16} /> : (
                  <>
                    {isLogin ? "Login" : "Create Account"}
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
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
                className="w-full text-center text-[10px] font-black tracking-widest-xl uppercase text-slate/30 hover:text-gold transition-colors py-4 flex items-center justify-center gap-4 group"
              >
                {isLogin ? (
                  <>
                    New here? Create an account
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to login
                  </>
                )}
              </button>
            </div>
          </form>

          <footer className="pt-24 flex justify-between items-center text-[9px] font-black tracking-widest-xl uppercase opacity-20 text-black">
             <span>© 2024 JN Enterprise</span>
             <span className="text-gold opacity-100">Help Center</span>
          </footer>
        </div>
      </div>
    </motion.div>
  );
}
