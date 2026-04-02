import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './store/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// New Architecture Pages
import LandingPage from './pages/Home/LandingPage';
import AuthPage from './pages/Login/AuthPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RetailerHome from './pages/Home/RetailerHome';
import ShopPage from './pages/Catalog/ShopPage';
import CartPage from './pages/Cart/CartPage';
import WishlistPage from './pages/Wishlist/WishlistPage';
import ProductDetailPage from './pages/Catalog/ProductDetailPage';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        
        {/* Retailer Experience */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <RetailerHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/shop" 
          element={
            <ProtectedRoute>
              <ShopPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/product/:id" 
          element={
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/wishlist" 
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          } 
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
