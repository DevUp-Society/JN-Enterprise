import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './store/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { PageLayout } from './components/navigation/PageLayout';

// New Architecture Pages
import LandingPage from './pages/Home/LandingPage';
import AuthPage from './pages/Login/AuthPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RetailerHome from './pages/Home/RetailerHome';
import ShopPage from './pages/Catalog/ShopPage';
import CartPage from './pages/Cart/CartPage';
import WishlistPage from './pages/Wishlist/WishlistPage';
import WaitingListPage from './pages/Wishlist/WaitingListPage';
import NotificationsPage from './pages/Home/NotificationsPage';
import ProductDetailPage from './pages/Catalog/ProductDetailPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageLayout><LandingPage /></PageLayout>} />
        <Route path="/login" element={<AuthPage />} />
        
        {/* Retailer Experience */}
        <Route 
          path="/home" 
          element={<PageLayout><RetailerHome /></PageLayout>} 
        />
        <Route 
          path="/shop" 
          element={<PageLayout><ShopPage /></PageLayout>} 
        />
        <Route 
          path="/product/:id" 
          element={<PageLayout><ProductDetailPage /></PageLayout>} 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <PageLayout><CartPage /></PageLayout>
            </ProtectedRoute>
          } 
        />
         <Route 
           path="/wishlist" 
           element={<PageLayout><WishlistPage /></PageLayout>} 
         />
         <Route 
           path="/waiting-list" 
           element={<PageLayout><WaitingListPage /></PageLayout>} 
         />
         <Route 
           path="/notifications" 
           element={<PageLayout><NotificationsPage /></PageLayout>} 
         />
         <Route 
           path="/checkout" 
           element={<PageLayout><CheckoutPage /></PageLayout>} 
         />
        
        {/* Admin Dashboard */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
