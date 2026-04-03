import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

interface MatrixRow {
  size: string;
  stock: number;
  qty: number;
}

export const QuickOrderMatrix = () => {
  const [rows, setRows] = useState<MatrixRow[]>([
    { size: 'S', stock: 120, qty: 0 },
    { size: 'M', stock: 240, qty: 0 },
    { size: 'L', stock: 85, qty: 0 },
    { size: 'XL', stock: 42, qty: 0 },
    { size: 'XXL', stock: 18, qty: 0 },
  ]);

  const updateQty = (index: number, delta: number) => {
    setRows(prev => prev.map((row, i) => 
      i === index ? { ...row, qty: Math.max(0, Math.min(row.stock, row.qty + delta)) } : row
    ));
  };

  const totalQty = rows.reduce((acc, row) => acc + row.qty, 0);

  return (
    <div className="bg-white border border-slate/10 p-8 space-y-8 shadow-sm">
      <div className="flex justify-between items-center border-b border-slate/5 pb-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest-xl text-slate/40">Wholesale Grid Matrix</h4>
        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-gold bg-gold/5 px-3 py-1">
          Minimum Order: 12 Units
        </div>
      </div>

      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={row.size} className="flex items-center justify-between group">
            <div className="flex items-baseline gap-4">
               <span className="text-xs font-black text-slate w-8">{row.size}</span>
               <span className="text-[9px] font-bold text-slate/20 uppercase tracking-tighter">Stock: {row.stock}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => updateQty(i, -1)}
                className="w-8 h-8 flex items-center justify-center border border-slate/10 hover:bg-slate hover:text-white transition-all"
              >
                <Minus size={12} />
              </button>
              <input 
                type="number" 
                value={row.qty}
                onChange={(e) => updateQty(i, parseInt(e.target.value) || 0)}
                className="w-12 text-center text-[11px] font-black text-slate focus:outline-none bg-bone/20 p-2 border border-transparent focus:border-gold"
              />
              <button 
                onClick={() => updateQty(i, 1)}
                className="w-8 h-8 flex items-center justify-center border border-slate/10 hover:bg-slate hover:text-white transition-all"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-slate/5 flex flex-col gap-4">
        <div className="flex justify-between items-center px-2">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate/40">Total Batch Qty</span>
           <span className="text-xl font-black text-slate">{totalQty} Units</span>
        </div>
        
        <button className="w-full h-12 bg-slate text-bone text-[10px] font-black uppercase tracking-widest-xl hover:bg-gold transition-all flex items-center justify-center gap-3 shadow-lg group">
           Push to Matrix <ShoppingCart size={16} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};
