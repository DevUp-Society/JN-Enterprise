import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { AuthProvider } from './store/AuthContext';
import { CartProvider } from './store/CartContext';
import { WishlistProvider } from './store/WishlistContext';
import ProtectedRoute from './components/ProtectedRoute';
import { PageLayout } from './components/navigation/PageLayout';

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

// Worker Architecture (Fulfillment)
import WorkerLayout from './layouts/WorkerLayout';
import WorkerOrders from './pages/Admin/WorkerOrders';
import WorkerAccount from './pages/Admin/WorkerAccount';

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
          <Route path="inventory" element={<Inventory />} />
          <Route path="settings" element={<WorkerAccount />} />
          <Route path="completed" element={
            <div className="space-y-12 pb-32 font-mono select-none">
              <div className="py-40 flex flex-col items-center justify-center space-y-6">
                <CheckCircle2 size={64} className="text-gold opacity-20" />
                <h4 className="text-3xl font-black text-primary uppercase tracking-tighter">ARCHIVE EMPTY_</h4>
                <p className="text-[11px] font-bold text-primary/30 uppercase tracking-[0.3em]">No Completed Fulfillment Logs in Current Shift</p>
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
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <AnimatedRoutes />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
