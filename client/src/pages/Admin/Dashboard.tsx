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
      <div className="flex bg-[#D6D6D6] items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D6D6D6] p-8 text-black">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-black uppercase tracking-tighter">
            Admin Dashboard
          </h1>
          <p className="text-black/60 mt-2">Enterprise Wholesale Management System</p>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-black/5 border border-black/50 rounded-xl flex items-center gap-3 text-black">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#D6D6D6]/50 backdrop-blur-xl border border-black/10 p-6 rounded-2xl hover:border-black/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-black/10 rounded-xl group-hover:bg-black/5 transition-colors">
                <Users className="h-6 w-6 text-black" />
              </div>
              <span className="text-xs font-semibold text-black bg-black/10 px-2 py-1 rounded-full">+12%</span>
            </div>
            <h3 className="text-black/60 font-medium">Total Customers</h3>
            <p className="text-3xl font-bold mt-1">{stats?.users || 0}</p>
          </div>

          <div className="bg-[#D6D6D6]/50 backdrop-blur-xl border border-black/10 p-6 rounded-2xl hover:border-black/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-black/10 rounded-xl group-hover:bg-black/5 transition-colors">
                <Package className="h-6 w-6 text-black" />
              </div>
              <span className="text-xs font-semibold text-black bg-black/10 px-2 py-1 rounded-full">In Stock</span>
            </div>
            <h3 className="text-black/60 font-medium">Wholesale Products</h3>
            <p className="text-3xl font-bold mt-1">{stats?.products || 0}</p>
          </div>

          <div className="bg-[#D6D6D6]/50 backdrop-blur-xl border border-black/10 p-6 rounded-2xl hover:border-black/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-black/10 rounded-xl group-hover:bg-black/5 transition-colors">
                <TrendingUp className="h-6 w-6 text-black" />
              </div>
              <span className="text-xs font-semibold text-black bg-black/10 px-2 py-1 rounded-full">New</span>
            </div>
            <h3 className="text-black/60 font-medium">Monthly Revenue</h3>
            <p className="text-3xl font-bold mt-1">$152.4k</p>
          </div>
        </div>

        <div className="mt-12 bg-[#D6D6D6]/30 border border-black/10 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-black/10 flex justify-between items-center">
            <h2 className="text-xl font-bold">System Integrity</h2>
            <button className="text-black text-sm hover:text-black font-medium transition-colors">View Logs</button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex items-center gap-4 p-4 bg-black/5 rounded-xl border border-black/10/50">
                   <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
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











