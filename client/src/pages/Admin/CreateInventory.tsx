import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Upload, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Package,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../../services/DataService';

type VariantRow = {
  size: string;
  price: number;
  qty: number;
};

export default function CreateInventory() {
  const navigate = useNavigate();
  
  // Core Registry Data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  
  // Design Logic State
  const [hasDifferentSizes, setHasDifferentSizes] = useState<boolean | null>(null);
  const [isConstantPrice, setIsConstantPrice] = useState<boolean | null>(null);
  
  // Data State
  const [basePrice, setBasePrice] = useState<number>(0);
  const [baseQty, setBaseQty] = useState<number>(0);
  const [variantRows, setVariantRows] = useState<VariantRow[]>([
    { size: 'S', price: 0, qty: 0 }
  ]);
  
  // Media Reference
  const [mainImage, setMainImage] = useState<string | null>(null);

  const categories = ['APPAREL', 'PLASTICS', 'TOYS', 'ELECTRONICS', 'METALS'];

  const addVariantRow = () => {
    setVariantRows([...variantRows, { size: '', price: 0, qty: 0 }]);
  };

  const removeVariantRow = (index: number) => {
    setVariantRows(variantRows.filter((_, i) => i !== index));
  };

  const updateVariantRow = (index: number, field: keyof VariantRow, value: any) => {
    const next = [...variantRows];
    next[index] = { ...next[index], [field]: value };
    setVariantRows(next);
  };

  const totals = useMemo(() => {
    if (hasDifferentSizes === false) {
      return { price: basePrice, qty: baseQty };
    }
    const totalQty = variantRows.reduce((acc, r) => acc + Number(r.qty), 0);
    const avgPrice = isConstantPrice ? basePrice : (variantRows.reduce((acc, r) => acc + Number(r.price), 0) / (variantRows.length || 1));
    return { price: avgPrice, qty: totalQty };
  }, [hasDifferentSizes, isConstantPrice, basePrice, baseQty, variantRows]);

  const handleSync = () => {
    // HARD_VALIDATION_PROTOCOL
    if (!name.trim()) return alert('REQUIRED: PRODUCT_NAME');
    if (!category) return alert('REQUIRED: CATEGORICAL_TIER');
    if (!mainImage) return alert('REQUIRED: PRIMARY_MEDIA_ASSET');
    
    if (hasDifferentSizes === null) return alert('VALUATION_ERROR: SIZE_LOGIC_UNDEFINED');
    
    if (hasDifferentSizes) {
       if (isConstantPrice === null) return alert('VALUATION_ERROR: PRICING_LOGIC_UNDEFINED');
       if (variantRows.length === 0) return alert('VALUATION_ERROR: NO_SIZES_REGISTERED');
       
       const allFieldsValid = variantRows.every(r => (isConstantPrice ? basePrice > 0 : r.price > 0) && r.qty > 0 && r.size.trim());
       if (!allFieldsValid) return alert('VALUATION_ERROR: PRICE/QTY/SIZE_MUST_BE_NON_ZERO');
    } else {
       if (basePrice <= 0 || baseQty <= 0) return alert('VALUATION_ERROR: PRICE/QTY_MUST_BE_POSITIVE');
    }

    const payload = {
      name,
      description,
      category,
      price: totals.price,
      stock: totals.qty,
      image: mainImage,
      variants: hasDifferentSizes ? variantRows.map(r => ({
        size: r.size,
        price: isConstantPrice ? basePrice : r.price,
        qty: r.qty
      })) : []
    };

    DataService.persistProduct(payload);
    navigate('/admin/inventory');
  };

  return (
    <div className="space-y-12 pb-32 font-mono select-none">
      {/* TERMINAL_HEADER_PROTOCOL */}
      <header className="flex flex-col gap-10 border-b border-primary/10 pb-12 mt-12">
        <div className="flex items-center">
           <h1 className="text-3xl font-black text-primary dark:text-bone tracking-tighter uppercase leading-none">
              ADD NEW REGISTRY
           </h1>
           <div className="h-[1px] flex-1 bg-primary/5 mx-10" />
        </div>
      </header>

      {/* ADMINISTRATIVE_LEDGER_FORM */}
      <main className="space-y-20">
        
        {/* BASIC DETAILS */}
        <section className="space-y-10">
           <div className="flex items-center gap-6 border-l-4 border-primary pl-6">
              <h3 className="text-[12px] font-black text-primary dark:text-white uppercase tracking-[0.4em]">BASIC DETAILS</h3>
           </div>
           
           <div className="space-y-10 pl-10">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest pl-1">Product Name</label>
                 <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ENTER_PRODUCT_NAME..."
                    className="w-full h-16 bg-[#F6F4F2] dark:bg-dark-surface border border-primary/20 px-8 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-primary transition-all"
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest pl-1">Description</label>
                    <textarea 
                       value={description}
                       onChange={(e) => setDescription(e.target.value)}
                       placeholder="SPECIFY_UNIT_DETAILS..."
                       className="w-full h-40 bg-[#F6F4F2] dark:bg-dark-surface border border-primary/20 p-8 text-[11px] font-medium font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-all resize-none"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest pl-1">Category</label>
                    <div className="relative">
                       <select 
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full h-16 bg-[#F6F4F2] dark:bg-dark-surface border border-primary/20 px-8 text-xs font-black uppercase tracking-widest appearance-none focus:outline-none focus:border-primary transition-all"
                       >
                          <option value="">SELECT CATEGORY...</option>
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                       <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-primary/20">
                          <ChevronRight size={16} className="rotate-90" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* MEDIA DETAILS */}
        <section className="space-y-10">
           <div className="flex items-center gap-6 border-l-4 border-primary pl-6">
              <h3 className="text-[12px] font-black text-primary dark:text-white uppercase tracking-[0.4em]">MEDIA DETAILS</h3>
           </div>

           <div className="pl-10 space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                 <div className="flex-[2] relative border-2 border-dashed border-primary/10 bg-[#F6F4F2] dark:bg-dark-surface h-80 flex flex-col items-center justify-center group overflow-hidden">
                    {mainImage ? (
                       <>
                          <img src={mainImage} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Preview" />
                          <button 
                             onClick={() => setMainImage(null)}
                             className="absolute top-6 right-6 w-10 h-10 bg-white dark:bg-dark border border-primary flex items-center justify-center text-primary hover:text-red-500 transition-all shadow-xl"
                          >
                             <X size={16} />
                          </button>
                       </>
                    ) : (
                       <div className="flex flex-col items-center gap-6">
                          <Upload size={32} className="text-primary/10 group-hover:text-primary transition-colors" />
                          <div className="text-center space-y-2">
                             <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">DRAG_DROP_REGISTRY_ASSET</p>
                             <button className="text-[9px] font-black uppercase tracking-widest border border-primary px-6 py-2 bg-primary text-white hover:bg-gold transition-all shadow-lg active:scale-95">SELECT FILE</button>
                          </div>
                       </div>
                    )}
                 </div>

                 <div className="flex-1 space-y-4">
                    <p className="text-[9px] font-black text-primary/20 uppercase tracking-widest">Gallery Preview</p>
                    <div className="grid grid-cols-2 gap-4">
                       {[0, 1, 2, 3].map(i => (
                          <div key={i} className="aspect-square bg-[#F6F4F2] dark:bg-dark-surface border border-primary/5 flex items-center justify-center group cursor-pointer hover:border-primary transition-all">
                             <ImageIcon size={14} className="text-primary/5 group-hover:text-primary transition-colors" />
                          </div>
                      ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* VALUATION */}
        <section className="space-y-12">
           <div className="flex items-center gap-6 border-l-4 border-primary pl-6">
              <h3 className="text-[12px] font-black text-primary dark:text-white uppercase tracking-[0.4em]">VALUATION</h3>
           </div>

           <div className="pl-10 space-y-16">
              {/* Question 1: Sizes */}
              <div className="space-y-6">
                 <p className="text-[12px] font-black text-primary/60 uppercase tracking-[0.2em]">Are there different sizes for this product?</p>
                 <div className="flex gap-10">
                    {[
                      { val: true, label: 'Yes - Different Sizes' },
                      { val: false, label: 'No - Single Size' }
                    ].map((opt) => (
                       <button 
                          key={String(opt.val)}
                          onClick={() => {
                            setHasDifferentSizes(opt.val);
                            if (opt.val === false) setIsConstantPrice(null);
                          }}
                          className="flex items-center gap-4 group cursor-pointer"
                       >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${hasDifferentSizes === opt.val ? 'border-primary' : 'border-primary/10 group-hover:border-primary/40'}`}>
                             {hasDifferentSizes === opt.val && <div className="w-3 h-3 rounded-full bg-primary" />}
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${hasDifferentSizes === opt.val ? 'text-primary' : 'text-primary/30'}`}>
                             {opt.label}
                          </span>
                       </button>
                    ))}
                 </div>
              </div>

              <AnimatePresence mode="wait">
                {hasDifferentSizes === true && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-16"
                  >
                    {/* Question 2: Constant Price */}
                    <div className="space-y-6 mt-10">
                       <p className="text-[12px] font-black text-primary/60 uppercase tracking-[0.2em]">Constant price for all sizes?</p>
                       <div className="flex gap-10">
                          {[
                            { val: true, label: 'Yes - Fixed Price' },
                            { val: false, label: 'No - Per Size Pricing' }
                          ].map((opt) => (
                             <button 
                                key={String(opt.val)}
                                onClick={() => setIsConstantPrice(opt.val)}
                                className="flex items-center gap-4 group cursor-pointer"
                             >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isConstantPrice === opt.val ? 'border-primary' : 'border-primary/10 group-hover:border-primary/40'}`}>
                                   {isConstantPrice === opt.val && <div className="w-3 h-3 rounded-full bg-primary" />}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${isConstantPrice === opt.val ? 'text-primary' : 'text-primary/30'}`}>
                                   {opt.label}
                                </span>
                             </button>
                          ))}
                       </div>
                    </div>

                    {isConstantPrice !== null && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-10"
                      >
                         <div className="h-[1px] w-full bg-primary/5" />
                         
                         {isConstantPrice && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest pl-1">Constant Price (₹)</label>
                                  <div className="relative">
                                     <div className="absolute left-8 top-1/2 -translate-y-1/2 text-primary font-black text-lg">₹</div>
                                     <input 
                                        type="number"
                                        value={basePrice || ''}
                                        onChange={(e) => setBasePrice(Number(e.target.value))}
                                        placeholder="0.00"
                                        className="w-full h-16 bg-[#F6F4F2] dark:bg-dark border border-primary/20 pl-16 text-xl font-black italic focus:outline-none focus:border-primary"
                                     />
                                  </div>
                               </div>
                            </div>
                         )}

                         <div className="bg-white dark:bg-dark-surface border border-primary/10 overflow-hidden shadow-2xl">
                            <table className="w-full text-left border-collapse">
                               <thead>
                                  <tr className="bg-primary text-white border-b border-primary/10">
                                     <th className="p-8 text-[9px] font-black uppercase tracking-widest">Size</th>
                                     {!isConstantPrice && <th className="p-8 text-[9px] font-black uppercase tracking-widest">Price (₹)</th>}
                                     <th className="p-8 text-[9px] font-black uppercase tracking-widest">Quantity</th>
                                     <th className="p-8 text-[9px] font-black uppercase tracking-widest text-center">Action</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-primary/5">
                                  {variantRows.map((row, i) => (
                                     <tr key={i} className="group">
                                        <td className="p-8">
                                           <input 
                                              value={row.size}
                                              onChange={(e) => updateVariantRow(i, 'size', e.target.value)}
                                              placeholder="S, M, L..."
                                              className="w-full h-12 bg-[#F6F4F2] px-6 text-[11px] font-black uppercase focus:outline-none focus:border-primary border border-transparent transition-all font-mono"
                                           />
                                        </td>
                                        {!isConstantPrice && (
                                           <td className="p-8">
                                              <input 
                                                 type="number"
                                                 value={row.price || ''}
                                                 onChange={(e) => updateVariantRow(i, 'price', e.target.value)}
                                                 placeholder="₹ 0.00"
                                                 className="w-full h-12 bg-[#F6F4F2] px-6 text-[11px] font-black uppercase focus:outline-none focus:border-primary border border-transparent transition-all font-mono"
                                              />
                                           </td>
                                        )}
                                        <td className="p-8">
                                           <input 
                                              type="number"
                                              value={row.qty || ''}
                                              onChange={(e) => updateVariantRow(i, 'qty', e.target.value)}
                                              placeholder="0"
                                              className="w-full h-12 bg-[#F6F4F2] px-6 text-[11px] font-black uppercase focus:outline-none focus:border-primary border border-transparent transition-all font-mono"
                                           />
                                        </td>
                                        <td className="p-8 text-center">
                                           <button 
                                              onClick={() => removeVariantRow(i)}
                                              className="w-10 h-10 border border-primary/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center mx-auto"
                                           >
                                              <Trash2 size={14} />
                                           </button>
                                        </td>
                                     </tr>
                                  ))}
                               </tbody>
                            </table>
                            <button 
                               onClick={addVariantRow}
                               className="w-full h-16 bg-[#F6F4F2] hover:bg-gold hover:text-white transition-all text-primary/40 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 border-t border-primary/5"
                            >
                               <Plus size={16} /> Add New Size Row
                            </button>
                         </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {hasDifferentSizes === false && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white dark:bg-dark-surface p-12 border border-primary/10 shadow-2xl mt-10"
                  >
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest pl-1">Unit Price (₹)</label>
                        <div className="relative">
                           <div className="absolute left-8 top-1/2 -translate-y-1/2 text-primary font-black text-lg">₹</div>
                           <input 
                              type="number"
                              value={basePrice || ''}
                              onChange={(e) => setBasePrice(Number(e.target.value))}
                              placeholder="0.00"
                              className="w-full h-16 bg-[#F6F4F2] border border-primary/20 pl-16 text-xl font-black italic focus:outline-none focus:border-primary"
                           />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-primary/30 uppercase tracking-widest pl-1">Quantity</label>
                        <div className="relative">
                           <Package className="absolute left-8 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                           <input 
                              type="number"
                              value={baseQty || ''}
                              onChange={(e) => setBaseQty(Number(e.target.value))}
                              placeholder="0"
                              className="w-full h-16 bg-[#F6F4F2] border border-primary/20 pl-16 text-xl font-black italic focus:outline-none focus:border-primary"
                           />
                        </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </section>
      </main>

      {/* FOOTER_ACTION_PROTOCOL */}
      <footer className="pt-20 border-t border-primary/10 flex flex-col md:flex-row gap-6">
        <button 
           onClick={() => navigate('/admin/inventory')}
           className="flex-1 h-20 bg-[#F6F4F2] dark:bg-dark-surface border border-primary/20 text-primary/40 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-primary transition-all flex items-center justify-center gap-4"
        >
           <X size={18} /> CANCEL
        </button>
        <button 
           onClick={handleSync}
           className="flex-[2] h-20 bg-primary text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-gold transition-all shadow-2xl flex items-center justify-center gap-6 group"
        >
           <div className="w-2 h-2 rounded-full bg-gold group-hover:bg-white animate-pulse" />
           ADD TO INVENTORY
           <ArrowLeft size={18} className="rotate-180 group-hover:translate-x-2 transition-transform" />
        </button>
      </footer>
    </div>
  );
}
