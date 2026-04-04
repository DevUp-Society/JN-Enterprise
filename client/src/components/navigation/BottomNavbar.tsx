import { Link, useLocation } from 'react-router-dom';
import { Home, PackageSearch, List, User, Heart, ShoppingCart } from 'lucide-react';

export function BottomNavbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || (path === '/profile' && location.pathname.startsWith('/profile'));

  // Hide bottom nav on landing page or auth pages if desired, but user says "Adaptive Navigation: For screen widths below 768px, hide the desktop Top Navigation Bar. Implement a Fixed Bottom Navigation Bar"
  // Let's just always show it on mobile unless it's landing `/` or `/login`.
  const hiddenPaths = ['/', '/login', '/signup'];
  if (hiddenPaths.includes(location.pathname)) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#D6D6D6]/90 backdrop-blur-[10px] h-[72px] pb-[env(safe-area-inset-bottom)] border-t border-black/10 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
      <div className="grid grid-cols-6 h-full px-2 items-center">
        <Link to="/home" className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 h-full min-h-[44px] min-w-[44px] ${isActive('/home') ? 'text-black' : 'text-black/40 hover:text-black'}`}>
          <Home size={22} className={isActive('/home') ? 'stroke-[2.5px]' : 'stroke-2'} />
        </Link>
        <Link to="/shop" className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 h-full min-h-[44px] min-w-[44px] ${isActive('/shop') ? 'text-black' : 'text-black/40 hover:text-black'}`}>
          <PackageSearch size={22} className={isActive('/shop') ? 'stroke-[2.5px]' : 'stroke-2'} />
        </Link>
        <Link to="/wishlist" className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 h-full min-h-[44px] min-w-[44px] ${isActive('/wishlist') ? 'text-black' : 'text-black/40 hover:text-black'}`}>
          <Heart size={22} className={isActive('/wishlist') ? 'stroke-[2.5px]' : 'stroke-2'} />
        </Link>
        <Link to="/cart" className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 h-full min-h-[44px] min-w-[44px] ${isActive('/cart') ? 'text-black' : 'text-black/40 hover:text-black'}`}>
          <ShoppingCart size={22} className={isActive('/cart') ? 'stroke-[2.5px]' : 'stroke-2'} />
        </Link>
        <Link to="/waiting-list" className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 h-full min-h-[44px] min-w-[44px] ${isActive('/waiting-list') ? 'text-black' : 'text-black/40 hover:text-black'}`}>
          <List size={22} className={isActive('/waiting-list') ? 'stroke-[2.5px]' : 'stroke-2'} />
        </Link>
        <Link to="/profile" className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 h-full min-h-[44px] min-w-[44px] ${isActive('/profile') ? 'text-black' : 'text-black/40 hover:text-black'}`}>
          <User size={22} className={isActive('/profile') ? 'stroke-[2.5px]' : 'stroke-2'} />
        </Link>
      </div>
    </nav>
  );
}










