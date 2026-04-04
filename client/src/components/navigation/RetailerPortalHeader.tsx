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
    { name: 'Products', path: '/shop' },
    { name: 'Waiting List', path: '/waiting-list' },
  ];

  return (
    <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#D6D6D6]/95 backdrop-blur-md shadow-xl' : 'bg-transparent'}`}>
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
                      className={`text-[12px] font-bold tracking-widest-xl uppercase transition-all ${location.pathname === link.path ? 'text-black' : 'text-black/40 hover:text-black'}`}
                    >
                      {link.name}
                    </Link>
                    {location.pathname === link.path && (
                      <motion.div 
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-black rounded-none shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                      />
                    )}
                  </li>
                ))}
              </ul>
           </nav>
        </div>

        {/* Right: Search, Cart & Profile */}
        <div className="flex items-center gap-8">
           <div className="hidden md:flex items-center gap-4 bg-black/5 border border-black/5 rounded-full px-5 py-2 group focus-within:border-black/50 transition-all">
              <Search size={15} className="text-black/30 group-focus-within:text-black" />
              <input 
                type="text" 
                placeholder="Search catalog..." 
                className="bg-transparent border-none text-[11px] font-bold tracking-tight outline-none w-48 text-black placeholder-black/20"
              />
           </div>

           <Link to="/cart" className="relative group cursor-pointer transition-all hover:scale-105">
              <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center bg-black/5 hover:bg-black transition-all duration-300 group">
                 <Search size={18} className="text-black group-hover:text-white hidden" />
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black group-hover:text-white transition-colors">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                 </svg>
              </div>
           </Link>

           <Link to="/profile" className="relative group cursor-pointer transition-all hover:scale-105">
              <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center bg-black/5 hover:bg-black transition-all duration-300 group">
                 <User size={18} className="text-black group-hover:text-white" />
              </div>
           </Link>
        </div>
      </header>
    </div>
  );
};










