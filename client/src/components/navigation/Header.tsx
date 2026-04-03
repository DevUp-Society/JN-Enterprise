import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Heart,
  Bell,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Logo } from '../premium/Logo';
import { useAuth } from '../../store/AuthContext';
import { useCart } from '../../store/CartContext';
import { useWishlist } from '../../store/WishlistContext';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const { totalQty } = useCart();
  const { wishlistCount } = useWishlist();
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
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 h-[80px] flex items-center shadow-sm ${isLandingPage
        ? 'bg-[#F6F4F2]/95 backdrop-blur-md border-b border-[#425664]/5'
        : 'bg-[#425664] shadow-2xl shadow-[#425664]/20'
      }`}>
      <nav className="max-w-[1400px] mx-auto px-8 w-full flex justify-between items-center">
        <div className="flex items-center gap-12">
          <Link to="/">
            <Logo className={`text-2xl font-bold transition-colors ${isLandingPage ? 'text-[#425664]' : 'text-white'}`} />
          </Link>

          {/* Conditional Nav Links - Hidden on Landing Page */}
          {!isLandingPage && (
            <div className="hidden md:flex gap-8 text-base font-normal lowercase tracking-wide">
              <Link to="/home" className={`transition-colors pb-1 ${location.pathname === '/home' ? 'text-[#C6AD8F] border-b-2 border-[#C6AD8F]' : 'text-white/60 hover:text-[#C6AD8F]'}`}>home</Link>
              <Link to="/shop" className={`transition-colors pb-1 ${location.pathname === '/shop' ? 'text-[#C6AD8F] border-b-2 border-[#C6AD8F]' : 'text-white/60 hover:text-[#C6AD8F]'}`}>products</Link>
              <Link to="/waiting-list" className={`transition-colors pb-1 ${location.pathname === '/waiting-list' ? 'text-[#C6AD8F] border-b-2 border-[#C6AD8F]' : 'text-white/60 hover:text-[#C6AD8F]'}`}>waiting list</Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          {!isLandingPage && (
            <div className="flex items-center gap-4">
              <Link to="/wishlist" className="relative group text-white/60 hover:text-[#C6AD8F] transition-colors p-2 hover:bg-white/5 rounded-full">
                <Heart size={21} />
                {wishlistCount > 0 && <span className="absolute top-0 right-0 bg-[#C6AD8F] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium shadow-lg animate-in zoom-in">{wishlistCount}</span>}
              </Link>
              <Link to="/notifications" className="relative group text-white/60 hover:text-[#C6AD8F] transition-colors p-2 hover:bg-white/5 rounded-full">
                <Bell size={20} />
              </Link>
              <Link to="/cart" className="relative group text-white/60 hover:text-[#C6AD8F] transition-colors p-2 hover:bg-white/5 rounded-full">
                <ShoppingCart size={22} />
                {totalQty > 0 && <span className="absolute top-0 right-0 bg-[#C6AD8F] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium shadow-lg animate-in zoom-in">{totalQty}</span>}
              </Link>
              <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />
            </div>
          )}

          <div className="relative" ref={menuRef}>
            {authUser ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-base lowercase tracking-wide transition-all shadow-lg group active:scale-95 ${isLandingPage
                    ? 'bg-[#C6AD8F] text-white hover:bg-[#425664]'
                    : 'bg-[#F6F4F2] text-[#425664] hover:bg-[#C6AD8F] hover:text-white shadow-xl shadow-black/10'
                  }`}
              >
                <User size={16} />
                <span>{authUser.name}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <Link
                to="/login"
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-base lowercase tracking-wide transition-all shadow-lg ${isLandingPage
                    ? 'bg-[#C6AD8F] text-white hover:bg-[#425664]'
                    : 'bg-[#F6F4F2] text-[#425664] hover:bg-[#C6AD8F] hover:text-white shadow-xl shadow-black/10'
                  }`}
              >
                <User size={16} />
                <span>login</span>
              </Link>
            )}

            {/* Dropdown Menu */}
            {showUserMenu && authUser && (
              <div className="absolute right-0 mt-4 w-60 bg-white rounded-3xl shadow-2xl border border-[#425664]/5 py-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-3 border-b border-[#425664]/5 mb-2">
                  <p className="text-[10px] font-bold text-[#C6AD8F] uppercase tracking-widest">Enterprise Account</p>
                  <p className="text-sm font-bold text-[#425664] truncate">{authUser.email}</p>
                </div>
                <Link to="/profile" className="flex items-center gap-3 px-6 py-3 text-[#425664] hover:bg-[#F6F4F2] transition-colors font-medium lowercase">
                  <User size={18} className="text-[#C6AD8F]" />
                  Dashboard Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-6 py-3 text-[#B45309] hover:bg-[#FEF3C7] transition-colors font-medium lowercase"
                >
                  <LogOut size={18} />
                  Sign Out of Terminal
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
