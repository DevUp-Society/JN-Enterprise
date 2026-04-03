import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Users, Package, TrendingUp, AlertCircle } from 'lucide-react';

interface Stats {
  users: number;
  products: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/admin/stats');
        setStats(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex bg-slate-900 items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Enterprise Wholesale Management System</p>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
                <Users className="h-6 w-6 text-indigo-400" />
              </div>
              <span className="text-xs font-semibold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-full">+12%</span>
            </div>
            <h3 className="text-slate-400 font-medium">Total Customers</h3>
            <p className="text-3xl font-bold mt-1">{stats?.users || 0}</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl hover:border-cyan-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                <Package className="h-6 w-6 text-cyan-400" />
              </div>
              <span className="text-xs font-semibold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-full">In Stock</span>
            </div>
            <h3 className="text-slate-400 font-medium">Wholesale Products</h3>
            <p className="text-3xl font-bold mt-1">{stats?.products || 0}</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">New</span>
            </div>
            <h3 className="text-slate-400 font-medium">Monthly Revenue</h3>
            <p className="text-3xl font-bold mt-1">$152.4k</p>
          </div>
        </div>

        <div className="mt-12 bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-bold">System Integrity</h2>
            <button className="text-indigo-400 text-sm hover:text-indigo-300 font-medium transition-colors">View Logs</button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-800/50">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <div className="flex-1">
                     <p className="text-sm font-medium">Database sync successful</p>
                     <p className="text-xs text-slate-500">Node Cluster {i} - 2 minutes ago</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
