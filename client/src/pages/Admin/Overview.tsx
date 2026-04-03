import { 
  Layers, 
  Box,
  DollarSign
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
        label: 'Net Revenue', 
        value: `₹${analytics.netRevenue.toLocaleString()}`, 
        trend: '+12.4%', 
        icon: DollarSign,
        id: 'rev-01'
      },
      { 
        label: 'Order Volume', 
        value: analytics.orderVolume.toLocaleString(), 
        trend: '+4.2%', 
        icon: Box,
        id: 'vol-02'
      },
      { 
        label: 'Average Order Value (AOV)', 
        value: `₹${analytics.aov.toFixed(2)}`, 
        trend: 'PROTOCOL REF: #AOV-992', 
        icon: Layers,
        id: 'aov-03'
      },
    ];
  }, [analytics]);

  if (isLoading || !analytics) return (
    <div className="h-96 flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <div className="space-y-12 pb-24 font-mono select-none">
      {/* TERMINAL_HEADER_PROTOCOL */}
      <header className="flex flex-col gap-10 border-b border-primary/10 pb-12">
        <div className="flex items-center">
           <h1 className="text-3xl font-black text-primary dark:text-bone tracking-tighter uppercase leading-none">
              ANALYTIC OVERVIEW
           </h1>
           <div className="h-[1px] flex-1 bg-primary/5 mx-10" />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-white dark:bg-dark-surface border border-primary/5 p-8 transition-all shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.2em]">{stat.label}</span>
              <stat.icon size={16} className="text-gold group-hover:rotate-12 transition-transform" />
            </div>
            <div className="space-y-1">
               <h3 className="text-4xl font-black text-primary dark:text-white tracking-tighter italic">{stat.value}</h3>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-widest">{stat.trend}</span>
                  <div className="flex-1 h-[1px] bg-primary/10" />
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Analytical Core */}
      <div className="bg-white dark:bg-[#1A2530] border border-primary/10 p-12 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-16">
           <div className="space-y-1">
              <h3 className="text-[12px] font-black text-[#1E3A8A] dark:text-bone uppercase tracking-[0.6em] border-l-4 border-gold pl-6">REVENUE_PROTOCOL_CHART</h3>
              <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest italic ml-7">AGGREGATED_SPECTRAL_DATA_STREAM // FIDELITY_LEVEL_01</p>
           </div>
        </div>

        <div className="h-[400px] w-full">
          <HighDensityChart data={analytics.timeData} />
        </div>
      </div>
    </div>
  );
}
