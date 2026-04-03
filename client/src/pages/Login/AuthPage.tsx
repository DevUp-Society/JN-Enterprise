import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/premium/Logo';
import { ArrowRight, Loader2, Lock, Mail, User, ArrowLeft, CheckCircle2, ShieldCheck, Zap, Phone, KeyRound } from 'lucide-react';

export default function AuthPage() {
   const [isLogin, setIsLogin] = useState(true);
   const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [name, setName] = useState('');
   const [phone, setPhone] = useState('');
   const [otp, setOtp] = useState('');
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
               navigate('/shop');
            }
         } else {
            setError('Login failed. Please check your email and password.');
         }
      } else {
         if (!isVerifyingOTP) {
            setIsVerifyingOTP(true);
            return;
         }

         if (otp === '123456') {
            const user = await register(name, email, password);
            if (user) {
               setSuccess(true);
               setTimeout(() => {
                  setIsLogin(true);
                  setIsVerifyingOTP(false);
                  setSuccess(false);
                  setError('');
               }, 2000);
            }
         } else {
            setError('Invalid OTP code. Please try again.');
         }
      }
   };

   return (
      <div className="min-h-screen bg-[#F6F4F2] flex flex-col lg:flex-row font-sans selection:bg-[#C6AD8F] selection:text-white overflow-hidden">

         {/* 1. Left Panel (Industrial Brand Narrative) */}
         <div className="hidden lg:flex lg:w-1/2 relative bg-[#425664] overflow-hidden items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad86d7c7170a?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center mix-blend-overlay opacity-20 grayscale" />

            <div className="relative z-10 p-24 space-y-12 max-w-xl text-white">
               <div className="space-y-6">
                  <div className="w-12 h-1 bg-[#C6AD8F]" />
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

               <div className="flex items-center gap-10 pt-10 border-t border-white/5">
                  <div className="flex items-center gap-3">
                     <ShieldCheck className="text-[#C6AD8F]" size={20} />
                     <span className="text-[12px] font-bold uppercase tracking-widest text-white/80">Secure Portal</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <Zap className="text-[#C6AD8F]" size={20} />
                     <span className="text-[12px] font-bold uppercase tracking-widest text-white/80">Direct Factory</span>
                  </div>
               </div>
            </div>
         </div>

         {/* 2. Login/Register Form Section */}
         <div className="flex-1 flex flex-col justify-center items-center px-8 sm:px-16 lg:px-32 bg-[#F6F4F2] py-20">
            <div className="w-full max-w-md space-y-10">

               <div className="space-y-2">
                  <div className="lg:hidden mb-12">
                     <Logo className="text-[#425664] text-2xl font-bold" />
                  </div>
                  <h3 className="text-[32px] font-semibold text-[#111827] tracking-tight">
                     {isLogin ? "Login" : isVerifyingOTP ? "Verification" : "Create Account"}
                  </h3>
                  <p className="text-[14px] text-[#425664]/60 font-medium font-sans">
                     {isLogin ? "Enter your details to sign in" : isVerifyingOTP ? "We've sent a code to your email and phone" : "Sign up to start buying wholesale"}
                  </p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                     <AnimatePresence mode="wait">
                        {isVerifyingOTP ? (
                           <motion.div
                              key="otp-step"
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="space-y-6"
                           >
                              <div className="space-y-2">
                                 <label className="text-[11px] font-bold uppercase tracking-widest text-[#425664]/40 flex items-center gap-2">
                                    <KeyRound size={14} className="text-[#C6AD8F]" /> Verification Code
                                 </label>
                                 <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="000000"
                                    className="w-full bg-white border border-[#425664]/10 rounded-[16px] px-6 py-5 text-2xl font-bold tracking-[0.8em] text-center focus:outline-none focus:border-[#C6AD8F] shadow-sm transition-all text-[#111827]"
                                    required
                                 />
                              </div>
                              <p className="text-[11px] text-[#425664]/40 font-bold uppercase tracking-widest text-center">
                                 Enter <span className="text-[#425664]">123456</span> to proceed
                              </p>
                           </motion.div>
                        ) : (
                           <motion.div
                              key="initial-step"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-4"
                           >
                              {!isLogin && (
                                 <div className="space-y-2 group">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#425664]/40 flex items-center gap-2">
                                       <User size={14} className="text-[#C6AD8F]" /> name
                                    </label>
                                    <input
                                       type="text"
                                       value={name}
                                       onChange={(e) => setName(e.target.value)}
                                       placeholder="Enter your name"
                                       className="w-full bg-white border border-[#425664]/10 rounded-[14px] px-6 py-4 text-[15px] font-medium focus:outline-none focus:border-[#C6AD8F] shadow-sm transition-all text-[#111827]"
                                       required={!isLogin}
                                    />
                                 </div>
                              )}

                              <div className="space-y-2 group">
                                 <label className="text-[11px] font-bold uppercase tracking-widest text-[#425664]/40 flex items-center gap-2">
                                    <Mail size={14} className="text-[#C6AD8F]" /> mail
                                 </label>
                                 <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@email.com"
                                    className="w-full bg-white border border-[#425664]/10 rounded-[14px] px-6 py-4 text-[15px] font-medium focus:outline-none focus:border-[#C6AD8F] shadow-sm transition-all text-[#111827]"
                                    required
                                 />
                              </div>

                              {!isLogin && (
                                 <div className="space-y-2 group">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#425664]/40 flex items-center gap-2">
                                       <Phone size={14} className="text-[#C6AD8F]" /> phone
                                    </label>
                                    <input
                                       type="tel"
                                       value={phone}
                                       onChange={(e) => setPhone(e.target.value)}
                                       placeholder="+91 00000 00000"
                                       className="w-full bg-white border border-[#425664]/10 rounded-[14px] px-6 py-4 text-[15px] font-medium focus:outline-none focus:border-[#C6AD8F] shadow-sm transition-all text-[#111827]"
                                       required={!isLogin}
                                    />
                                 </div>
                              )}

                              <div className="space-y-2 group">
                                 <label className="text-[11px] font-bold uppercase tracking-widest text-[#425664]/40 flex items-center gap-2">
                                    <Lock size={14} className="text-[#C6AD8F]" /> password
                                 </label>
                                 <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white border border-[#425664]/10 rounded-[14px] px-6 py-4 text-[15px] font-medium focus:outline-none focus:border-[#C6AD8F] shadow-sm transition-all text-[#111827]"
                                    required
                                 />
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>

                  <div className="space-y-4 pt-4">
                     {!isVerifyingOTP && isLogin && (
                        <div className="flex gap-3 pb-2">
                           <button
                              type="button"
                              onClick={() => { setEmail('admin@jn.com'); setPassword('admin123'); }}
                              className="flex-1 bg-[#425664]/5 hover:bg-[#425664]/10 text-[11px] font-bold uppercase tracking-widest text-[#425664] py-3 rounded-[12px] transition-all flex items-center justify-center gap-2"
                           >
                              <User size={14} className="text-[#C6AD8F]" /> Admin Test
                           </button>
                           <button
                              type="button"
                              onClick={() => { setEmail('user@jn.com'); setPassword('user123'); }}
                              className="flex-1 bg-[#425664]/5 hover:bg-[#425664]/10 text-[11px] font-bold uppercase tracking-widest text-[#425664] py-3 rounded-[12px] transition-all flex items-center justify-center gap-2"
                           >
                              <User size={14} className="text-[#C6AD8F]" /> Retailer Test
                           </button>
                        </div>
                     )}

                     {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-400/5 border border-red-400/10 rounded-xl">
                           <p className="text-[12px] font-bold text-red-500">{error}</p>
                        </motion.div>
                     )}

                     {success && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-green-400/5 border border-green-400/10 rounded-xl flex items-center gap-3">
                           <CheckCircle2 size={16} className="text-green-600" />
                           <p className="text-[12px] font-bold text-green-600">Account Created Successfully</p>
                        </motion.div>
                     )}

                     <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#111827] text-white py-4.5 rounded-[14px] text-[15px] font-semibold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg active:scale-[0.98] group"
                     >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : (
                           <>
                              <span>{isLogin ? "Login" : isVerifyingOTP ? "Verify Details" : "Create Account"}</span>
                              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                           </>
                        )}
                     </button>

                     {!isVerifyingOTP && (
                        <button
                           type="button"
                           onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(false); }}
                           className="w-full py-2 text-[14px] font-medium text-[#425664]/60 hover:text-[#111827] transition-all flex items-center justify-center gap-2"
                        >
                           {isLogin ? "New here? Create an account" : "Already have an account? Login"}
                        </button>
                     )}

                     {isVerifyingOTP && (
                        <button
                           type="button"
                           onClick={() => setIsVerifyingOTP(false)}
                           className="w-full py-2 text-[13px] font-medium text-[#425664]/40 hover:text-[#425664] transition-all flex items-center justify-center gap-2"
                        >
                           <ArrowLeft size={14} /> Back to details
                        </button>
                     )}
                  </div>
               </form>

            </div>
         </div>
      </div>
   );
}
