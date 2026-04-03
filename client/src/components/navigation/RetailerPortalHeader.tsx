import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, ShoppingBag } from 'lucide-react';
import { Logo } from '../premium/Logo';
import { useAuth } from '../../store/AuthContext';
import { useCart } from '../../store/CartContext';
import MiniCartDrawer from '../cart/MiniCartDrawer';

export const RetailerPortalHeader = () => {
  const { logout } = useAuth();
  const { totalQty, setIsMiniCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Shop', path: '/shop' },
    { name: 'Cart', path: '/cart' },
    { name: 'Wishlist', path: '/wishlist' },
  ];

  return (
    <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-dark/95 backdrop-blur-md shadow-xl' : 'bg-transparent'}`}>
      <header className="max-w-[1750px] mx-auto flex justify-between items-center px-12 h-20">
        {/* Left: Brand */}
         <div className="flex-1 flex items-center gap-12">
            <Link to="/home" className="hover:opacity-70 transition-opacity">
               <Logo className="scale-110 origin-left" />
            </Link>

           {/* Navigation - Inline with logo to reduce height */}
           <nav className="hidden lg:block">
              <ul className="flex items-center gap-10">
                {navLinks.map((link) => (
                  <li key={link.name} className="relative py-2">
                    <Link 
                      to={link.path}
                      className={`text-[12px] font-bold tracking-widest-xl uppercase transition-all ${location.pathname === link.path ? 'text-primary' : 'text-white/60 hover:text-white'}`}
                    >
                      {link.name}
                    </Link>
                    {location.pathname === link.path && (
                      <motion.div 
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary rounded-full shadow-[0_0_10px_rgba(255,107,0,0.5)]"
                      />
                    )}
                  </li>
                ))}
              </ul>
           </nav>
        </div>

        {/* Right: Search & Profile */}
         <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsMiniCartOpen(true)}
              className="relative p-2 text-white/60 hover:text-white transition-colors group"
            >
               <ShoppingBag size={20} />
               <AnimatePresence>
                 {totalQty > 0 && (
                   <motion.span 
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     exit={{ scale: 0 }}
                     transition={{ type: 'spring', damping: 12, stiffness: 300 }}
                     className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary text-white text-[9px] font-black flex items-center justify-center border border-dark group-hover:shadow-[0_0_15px_rgba(255,107,0,0.4)]"
                   >
                     {totalQty}
                   </motion.span>
                 )}
               </AnimatePresence>
            </button>

            <div className="hidden md:flex items-center gap-4 bg-white/10 border border-white/5 rounded-full px-5 py-2 group focus-within:border-primary/50 transition-all">
               <Search size={15} className="text-white/30 group-focus-within:text-primary" />
               <input 
                 type="text" 
                 placeholder="Search catalog..." 
                 className="bg-transparent border-none text-[11px] font-bold tracking-tight outline-none w-48 text-white placeholder-white/20"
               />
            </div>

            <div className="flex items-center gap-3">
               <div title="Profile Registry" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-primary/20 transition-all duration-300">
                  <User size={18} className="text-white" />
               </div>
               <button 
                 onClick={handleLogout}
                 title="Terminate Session" 
                 className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 group"
               >
                  <LogOut size={16} className="text-white/40 group-hover:text-red-400" />
               </button>
            </div>
         </div>
      </header>
      <MiniCartDrawer />
    </div>
  );
};
