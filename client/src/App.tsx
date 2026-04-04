import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { AuthProvider } from './store/AuthContext';
import { CartProvider } from './store/CartContext';
import { ListsProvider } from './store/ListsContext';
import ProtectedRoute from './components/ProtectedRoute';
import { PageLayout } from './components/navigation/PageLayout';
import ErrorBoundary from './components/premium/ErrorBoundary';

// New Architecture Pages
import LandingPage from './pages/Home/LandingPage';
import AuthPage from './pages/Login/AuthPage';
import RetailerHome from './pages/Home/RetailerHome';
import ShopPage from './pages/Catalog/ShopPage';
import CartPage from './pages/Cart/CartPage';
import WishlistPage from './pages/Wishlist/WishlistPage';
import WaitingListPage from './pages/Wishlist/WaitingListPage';
import NotificationsPage from './pages/Home/NotificationsPage';
import ProductDetailPage from './pages/Catalog/ProductDetailPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import OrderSuccess from './pages/Cart/OrderSuccess';
import ProfilePage from './pages/Home/ProfilePage';
import OrdersPage from './pages/Home/OrdersPage';
import PastOrdersPage from './pages/Home/PastOrdersPage';

// Admin Architecture (Modular)
import AdminLayout from './layouts/AdminLayout';
import Overview from './pages/Admin/Overview';
import Inventory from './pages/Admin/Inventory';
import CreateInventory from './pages/Admin/CreateInventory';
import Partners from './pages/Admin/Partners';
import PartnerProfile from './pages/Admin/PartnerProfile';
import OrderManifest from './pages/Admin/OrderManifest';
import Orders from './pages/Admin/Orders';
import AdminOrderDetail from './pages/Admin/AdminOrderDetail';
import Profile from './pages/Admin/Profile';
import PersonnelRegistry from './pages/Admin/PersonnelRegistry';
import Settings from './pages/Admin/Settings';
import CategoryManager from './pages/Admin/CategoryManager';

// Worker Architecture (Fulfillment)
import WorkerLayout from './layouts/WorkerLayout';
import WorkerOrders from './pages/Worker/WorkerOrders';
import WorkerOrderDetail from './pages/Worker/WorkerOrderDetail';
import WorkerAccount from './pages/Worker/WorkerAccount';

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
          element={
            <ProtectedRoute>
              <PageLayout><RetailerHome /></PageLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/shop" 
          element={
            <ProtectedRoute>
              <PageLayout><ShopPage /></PageLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/product/:id" 
          element={
            <ProtectedRoute>
              <PageLayout><ProductDetailPage /></PageLayout>
            </ProtectedRoute>
          } 
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
          path="/checkout" 
          element={
            <ProtectedRoute>
              <PageLayout><CheckoutPage /></PageLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout/success" 
          element={
            <ProtectedRoute>
              <PageLayout><OrderSuccess /></PageLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/wishlist" 
          element={
            <ProtectedRoute>
              <PageLayout><WishlistPage /></PageLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/waiting-list" 
          element={
            <ProtectedRoute>
              <PageLayout><WaitingListPage /></PageLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <PageLayout><ProfilePage /></PageLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <PageLayout><OrdersPage /></PageLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders/past" 
          element={
            <ProtectedRoute>
              <PageLayout><PastOrdersPage /></PageLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <PageLayout><NotificationsPage /></PageLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Dashboard (Modular & Routed) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="inventory/create" element={<CreateInventory />} />
          <Route path="partners" element={<Partners />} />
          <Route path="partners/:id" element={<PartnerProfile />} />
          <Route path="partners/:id/orders/:orderId" element={<OrderManifest />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<AdminOrderDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="settings/personnel/:role" element={<PersonnelRegistry />} />
        </Route>

        {/* Worker Portal (Fulfillment & Logistics) */}
        <Route 
          path="/worker" 
          element={
            <ProtectedRoute workerOnly>
              <WorkerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="orders" element={<WorkerOrders />} />
          <Route path="orders/:id" element={<WorkerOrderDetail />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="settings" element={<WorkerAccount />} />
          <Route path="completed" element={
            <div className="space-y-12 pb-32 select-none">
              <div className="py-40 flex flex-col items-center justify-center space-y-6 bg-white border border-[#000000]/5 rounded-[32px] shadow-sm">
                <div className="w-24 h-24 bg-[#D6D6D6] rounded-full flex items-center justify-center mb-2">
                   <CheckCircle2 size={48} className="text-[#000000] opacity-50" />
                </div>
                <h4 className="text-2xl font-semibold text-[#000000] tracking-tight">Archive Empty</h4>
                <p className="text-sm font-medium text-[#000000]/60">No completed fulfillment orders in the current shift</p>
              </div>
            </div>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <CartProvider>
            <ListsProvider>
              <AnimatedRoutes />
            </ListsProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
