import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Home, ShoppingBag, ShoppingCart, Clock } from 'lucide-react';
import { Logo } from '../premium/Logo';
import { useAuth } from '../../store/AuthContext';

export const RetailerPortalHeader = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/home', icon: <Home size={14} /> },
    { name: 'Shop', path: '/shop', icon: <ShoppingBag size={14} /> },
    { name: 'Cart', path: '/cart', icon: <ShoppingCart size={14} /> },
    { name: 'Waiting List', path: '/wishlist', icon: <Clock size={14} /> },
  ];

  return (
    <div className="sticky top-0 w-full z-50 shadow-sm border-b border-slate/5">
      {/* Top Header: Main Controls */}
      <header className="w-full flex justify-between items-center px-12 h-16 bg-white/80 backdrop-blur-md">
        {/* Left: Brand */}
        <div className="flex items-center gap-4">
           <Link to="/home">
              <Logo className="scale-100 origin-left" />
           </Link>
        </div>

        {/* Right: Search & Profile */}
        <div className="flex items-center gap-6">
           {/* Search Bar - Compact */}
           <div className="hidden md:flex items-center gap-3 bg-bone/50 border border-slate/10 px-4 py-1.5 w-64 group focus-within:border-gold transition-all">
              <Search size={14} className="text-slate/30 group-focus-within:text-gold" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-transparent border-none text-[9px] font-bold uppercase tracking-widest outline-none w-full"
              />
           </div>

           <div className="h-4 w-[1px] bg-slate/10" />

           {user ? (
             <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-full border border-slate/10 flex items-center justify-center bg-white group-hover:border-gold transition-colors overflow-hidden">
                   <User size={14} className="stroke-[1.5] text-slate" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate">{user.name}</span>
                   <span className="text-[7px] font-bold text-slate/30 uppercase tracking-tighter">Gold Tier Retailer</span>
                </div>
             </div>
           ) : (
             <Link to="/login" className="text-[10px] font-black tracking-widest-xl uppercase hover:text-gold transition-colors">LOGIN</Link>
           )}
        </div>
      </header>

      {/* Secondary Nav Bar: Navigation - Compact */}
      <nav className="w-full bg-[#F6F4F2] border-t border-slate/5 px-12 overflow-x-auto no-scrollbar">
        <ul className="flex items-center justify-start gap-8 h-10">
          {navLinks.map((link) => (
            <li key={link.name} className="h-full flex items-center relative">
              <Link 
                to={link.path}
                className={`text-[9px] font-black tracking-widest uppercase flex items-center gap-2 transition-colors ${location.pathname === link.path ? 'text-gold' : 'text-slate/40 hover:text-slate'}`}
              >
                {link.icon}
                {link.name}
              </Link>
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
