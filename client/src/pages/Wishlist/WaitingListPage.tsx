import { 
  Clock, 
  Filter
} from 'lucide-react';
import ProductCard from '../../components/premium/ProductCard';
import { useNavigate } from 'react-router-dom';
import { useLists } from '../../store/ListsContext';

export default function WaitingListPage() {
  const { waitlist } = useLists();
  const navigate = useNavigate();

  return (
    <div className={`bg-[#D6D6D6] ${waitlist.length === 0 ? 'h-screen overflow-hidden' : 'min-h-screen'} selection:bg-[#000000] selection:text-[#D6D6D6] font-sans`}>
      <main className={`max-w-[1400px] mx-auto px-8 pt-12 space-y-12 ${waitlist.length === 0 ? '' : 'pb-32'}`}>
        
        {/* Simplified Header */}
        <div className="flex justify-between items-end border-b border-[#000000]/10 pb-6">
            <h1 className="text-4xl font-black text-[#000000] tracking-tight uppercase">
                Waiting List
            </h1>
            {waitlist.length > 0 && (
               <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#000000] hover:text-[#FFFFFF] transition-all bg-white px-8 py-4 rounded-2xl border border-[#000000]/10 shadow-sm">
                   <Filter size={16} /> Filter
               </button>
            )}
        </div>

        {/* Content Section */}
        {waitlist.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10">
              {waitlist.map((item) => (
                 <ProductCard key={item.id} product={item} />
              ))}
           </div>
        ) : (
            <div className="p-10 max-w-md mx-auto text-center space-y-6 bg-white border border-[#000000]/10 rounded-[40px] shadow-sm my-20">
               <div className="w-20 h-20 rounded-full bg-[#D6D6D6] flex items-center justify-center mx-auto border border-[#000000]/5">
                  <Clock size={32} className="text-[#000000]/30" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight text-[#000000]">Waiting List Empty</h3>
                  <p className="text-[13px] font-medium text-[#000000]/60 leading-relaxed">Your waiting list is currently empty. Explore our catalog to find items.</p>
               </div>
               <div className="pt-2">
                  <button 
                    onClick={() => navigate('/home')}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#000000] text-white font-bold uppercase text-[11px] tracking-widest py-4 px-8 rounded-2xl hover:bg-[#D6D6D6] hover:text-[#000000] transition-all shadow-lg active:scale-95"
                  >
                     SHOP NOW
                  </button>
               </div>
            </div>
        )}
      </main>
    </div>
  );
}
