import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  workerOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false, workerOnly = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex bg-[#D6D6D6] items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-[#000000]/10 border-t-[#000000] animate-spin rounded-full" />
           <p className="text-[10px] font-black text-[#000000]/30 uppercase tracking-[0.4em]">SYNCING PROTOCOLS...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin access (ADMIN or SUPER_ADMIN)
  if (adminOnly && !(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
    // Redirect workers to their portal, others to landing
    if (user.role === 'WORKER') return <Navigate to="/worker/orders" replace />;
    return <Navigate to="/home" replace />;
  }

  // Worker access
  if (workerOnly && user.role !== 'WORKER') {
    return <Navigate to="/home" replace />;
  }

  // Retailer access to home/shop is default for all logged-in if not admin/worker
  // But we can add explicit Retailer check if we want one day.

  return <>{children}</>;
};

export default ProtectedRoute;










