import { 
  Layers, 
  Box,
  DollarSign,
  Activity
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { DataService } from '../../services/DataService';
import DateRangePicker from '../../components/admin/DateRangePicker';
import HighDensityChart from '../../components/admin/HighDensityChart';
import { motion } from 'framer-motion';

export default function Overview() {
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      const data = DataService.getAnalyticsSummary(startDate, endDate);
      setAnalytics(data);
      setIsLoading(false);
    };

    loadData();
  }, [startDate, endDate]);

  const stats = useMemo(() => {
    if (!analytics) return [];
    return [
      { 
        label: 'Net Capital Revenue', 
        value: `₹${analytics.netRevenue.toLocaleString()}`, 
        trend: '+12.4% NOMINAL', 
        icon: DollarSign,
        id: 'rev-01'
      },
      { 
        label: 'Institutional Order Volume', 
        value: analytics.orderVolume.toLocaleString(), 
        trend: '+4.2% VECTOR', 
        icon: Box,
        id: 'vol-02'
      },
      { 
        label: 'Average Order Valuation', 
        value: `₹${analytics.aov.toFixed(2)}`, 
        trend: 'PROTOCOL #AOV-992', 
        icon: Layers,
        id: 'aov-03'
      },
    ];
  }, [analytics]);

  if (isLoading || !analytics) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#000000]/5 border-t-[#000000] rounded-full shadow-xl"
        />
        <p className="text-[10px] font-black text-[#000000]/20 uppercase tracking-[0.5em] animate-pulse">Syncing Analytical Core_</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-24 select-none">
      <header className="flex flex-col gap-6 border-b border-[#000000]/10 pb-8 mt-4">
        <div className="flex items-center">
           <h1 className="text-3xl font-black text-[#000000] tracking-tight uppercase">
              Operational Overview_
           </h1>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
           <DateRangePicker 
              startDate={startDate} 
              endDate={endDate} 
              onChange={(s, e) => { setStartDate(s); setEndDate(e); }} 
           />
        </div>
      </header>

      {/* Summary Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-white border-2 border-[#000000]/5 p-10 transition-all hover:bg-[#D6D6D6]/30 hover:border-[#000000]/10 shadow-2xl rounded-[40px] overflow-hidden"
          >
            <div className="flex justify-between items-start mb-8 relative z-10">
              <span className="text-[10px] font-black text-[#000000]/40 uppercase tracking-[0.4em]">{stat.label}</span>
              <div className="w-12 h-12 bg-[#D6D6D6] border-2 border-[#000000]/5 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                 <stat.icon size={21} className="text-[#000000]" />
              </div>
            </div>
            <div className="space-y-3 relative z-10">
               <h3 className="text-4xl font-black text-[#000000] tracking-tighter leading-tight">{stat.value}</h3>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-pulse" />
                  <span className="text-[9px] font-black text-[#FFFFFF] uppercase tracking-[0.3em]">{stat.trend}</span>
               </div>
            </div>
            <div className="absolute -bottom-6 -right-6 text-8xl text-[#000000]/3 group-hover:text-[#000000]/5 transition-all group-hover:rotate-12">
               <Activity size={96} strokeWidth={1} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Analytical Core */}
      <div className="bg-white border-2 border-[#000000]/5 p-12 md:p-16 shadow-2xl rounded-[56px] relative overflow-hidden group">
        <div className="flex justify-between items-center mb-12 relative z-10">
           <div className="space-y-3">
              <h3 className="text-3xl font-black text-[#000000] tracking-tighter uppercase leading-tight flex items-center gap-4">
                 <Activity className="text-[#FFFFFF]" /> 
                 Institutional Trajectory_
              </h3>
              <p className="text-[10px] font-black text-[#000000]/20 uppercase tracking-[0.4em]">Aggregated Historical Data Stream Protocol</p>
           </div>
        </div>

        <div className="h-[450px] w-full relative z-10">
          <HighDensityChart data={analytics.timeData} />
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D6D6D6]/20 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full group-hover:bg-[#D6D6D6]/40 transition-all duration-1000" />
      </div>

      <footer className="pt-16 border-t border-[#000000]/10 flex justify-between items-center opacity-20">
         <p className="text-[10px] font-black text-[#000000] uppercase tracking-[0.5em]">System Pulse Nominal_</p>
         <code className="text-[9px] font-black text-[#000000] uppercase tracking-widest">REGISTRY_V.2.0.4</code>
      </footer>
    </div>
  );
}










