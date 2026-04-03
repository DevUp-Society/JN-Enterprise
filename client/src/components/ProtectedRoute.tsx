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
      <div className="flex bg-bone items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-primary/10 border-t-gold animate-spin" />
           <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.4em]">SYNCING PROTOCOLS...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Auto-redirect workers from general paths to their dedicated portal
  if (user.role === 'WORKER' && adminOnly) {
    return <Navigate to="/worker/orders" replace />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  if (workerOnly && user.role !== 'WORKER') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
