import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import { Logo } from '../premium/Logo';
import { useAuth } from '../../store/AuthContext';
import { useState, useEffect } from 'react';

export const RetailerPortalHeader = () => {
  const { } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

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
           <Link to="/home">
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
           <div className="hidden md:flex items-center gap-4 bg-white/10 border border-white/5 rounded-full px-5 py-2 group focus-within:border-primary/50 transition-all">
              <Search size={15} className="text-white/30 group-focus-within:text-primary" />
              <input 
                type="text" 
                placeholder="Search catalog..." 
                className="bg-transparent border-none text-[11px] font-bold tracking-tight outline-none w-48 text-white placeholder-white/20"
              />
           </div>

           <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-primary transition-all duration-300">
                 <User size={18} className="text-white" />
              </div>
           </div>
        </div>
      </header>
    </div>
  );
};
