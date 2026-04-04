import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Heart, 
  Bell,
  LogOut,
  ChevronDown,
  CheckCircle2,
  Search
} from 'lucide-react';
import { Logo } from '../premium/Logo';
import { useAuth } from '../../store/AuthContext';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const isLandingPage = location.pathname === '/';
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className={`relative top-0 w-full z-50 transition-all duration-500 flex items-center shadow-sm h-[60px] md:h-[90px] bg-[#D6D6D6] border-b border-black/5`}>
      {/* Desktop Nav */}
      <nav className="hidden md:flex max-w-[1400px] mx-auto px-8 w-full justify-between items-center text-black">
        <div className="flex items-center gap-12">
          <Link to="/">
            <Logo className="text-2xl font-bold transition-colors text-black" />
          </Link>
          
          {!isLandingPage && (
            <div className="hidden md:flex gap-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
              <Link to="/home" className={`transition-colors pb-1 ${location.pathname === '/home' ? 'text-black border-b-2 border-black' : 'text-black/60 hover:text-black'}`}>Home</Link>
              <Link to="/shop" className={`transition-colors pb-1 ${location.pathname === '/shop' ? 'text-black border-b-2 border-black' : 'text-black/60 hover:text-black'}`}>Products</Link>
              <Link to="/waiting-list" className={`transition-colors pb-1 ${location.pathname === '/waiting-list' ? 'text-black border-b-2 border-black' : 'text-black/60 hover:text-black'}`}>Waiting List</Link>
            </div>
          )}

          {!isLandingPage && (
            <div className="hidden md:flex flex-1 max-w-lg ml-8">
              <div className="relative w-full group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black/40 group-focus-within:text-black transition-colors" size={14} strokeWidth={4} />
                <input 
                  type="text"
                  placeholder="Search Portal Index..."
                  className="w-full bg-black/5 border border-black/10 rounded-full py-4 pl-14 pr-6 text-[11px] font-black uppercase text-black placeholder:text-black/20 focus:bg-white focus:border-black transition-all"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-6">
          {!isLandingPage && (
            <div className="flex items-center gap-4 ml-6">
              <Link to="/wishlist" className="relative group text-black/60 hover:text-black transition-colors p-2 hover:bg-black/5 rounded-full">
                <Heart size={18} />
              </Link>
              <Link to="/notifications" className="relative group text-black/60 hover:text-black transition-colors p-2 hover:bg-black/5 rounded-full">
                <Bell size={18} />
              </Link>
              <Link to="/cart" className="relative group text-black/60 hover:text-black transition-colors p-2 hover:bg-black/5 rounded-full">
                <ShoppingCart size={19} />
                <span className="absolute top-0 right-0 bg-black text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black shadow-lg">0</span>
              </Link>
            </div>
          )}
          
          <div className="relative" ref={menuRef}>
            {authUser ? (
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-black text-base tracking-wide transition-all shadow-lg group active:scale-95 bg-black text-white hover:bg-[#444444] shadow-xl shadow-black/10`}
              >
                <User size={16} />
                <span>{authUser.name}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <Link 
                to="/login" 
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-black text-base tracking-wide transition-all shadow-lg shadow-xl bg-black text-white hover:bg-[#444444] shadow-black/10`}
              >
                <User size={16} />
                <span>Login</span>
              </Link>
            )}

            {/* Dropdown Menu */}
            {showUserMenu && authUser && (
              <div className="absolute right-0 mt-4 w-60 bg-white rounded-3xl shadow-2xl border border-[#FFFFFF]/5 py-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-3 border-b border-black/5 mb-2">
                  <p className="text-[10px] font-bold text-[#000000] uppercase tracking-widest">Enterprise Account</p>
                  <p className="text-sm font-bold text-black truncate">{authUser.email}</p>
                </div>
                <Link to="/profile" className="flex items-center gap-3 px-6 py-3 text-black hover:bg-[#D6D6D6] transition-colors font-medium lowercase">
                  <User size={18} className="text-[#000000]" />
                  Dashboard Profile
                </Link>
                <Link to="/orders" className="flex items-center gap-3 px-6 py-3 text-black hover:bg-[#D6D6D6] transition-colors font-medium lowercase">
                  <ShoppingCart size={18} className="text-[#000000]" />
                  Active Orders
                </Link>
                <Link to="/orders/past" className="flex items-center gap-3 px-6 py-3 text-black hover:bg-[#D6D6D6] transition-colors font-medium lowercase">
                  <CheckCircle2 size={18} className="text-[#000000]" />
                  Past Orders
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium lowercase"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Brand Bar */}
      <div className="flex md:hidden w-full items-center h-full relative px-6 text-black">
         <Link to="/" className="flex-shrink-0">
           <Logo className="text-xl max-[360px]:text-base font-bold transition-colors text-black" />
         </Link>
         {!isLandingPage && (
           <div className="flex items-center gap-4 ml-auto">
             <button className="p-2 transition-colors">
               <Search size={22} />
             </button>
           </div>
         )}
      </div>
    </header>
  );
}










