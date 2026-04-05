import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  ArrowLeft,
  Package,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

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
  
  // Refactored Media State: 4 explicit slots
  const [slots, setSlots] = useState<(File | null)[]>([null, null, null, null]);
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Dynamic Specs Logic
  const [specs, setSpecs] = useState<{key: string, value: string}[]>([
    { key: '', value: '' }
  ]);

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axiosInstance.get('/products/categories');
        setCategories(res.data.categories);
      } catch (err) {
        console.error('FETCH_CATEGORIES_FAILURE', err);
      }
    };
    fetchCats();
  }, []);

  const handleSlotUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newSlots = [...slots];
      newSlots[index] = file;
      setSlots(newSlots);

      const newPreviews = [...previews];
      if (newPreviews[index]) URL.revokeObjectURL(newPreviews[index]!);
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);
    }
  };

  const removeSlot = (index: number) => {
    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);

    const newPreviews = [...previews];
    if (newPreviews[index]) URL.revokeObjectURL(newPreviews[index]!);
    newPreviews[index] = null;
    setPreviews(newPreviews);
  };

  const addSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const next = [...specs];
    next[index][field] = val;
    setSpecs(next);
  };

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
      return { price: basePrice || 0, qty: baseQty || 0 };
    }
    const totalQty = variantRows.reduce((acc, r) => acc + Number(r.qty || 0), 0);
    const avgPrice = isConstantPrice ? (basePrice || 0) : (variantRows.reduce((acc, r) => acc + Number(r.price || 0), 0) / (variantRows.length || 1));
    return { price: avgPrice, qty: totalQty };
  }, [hasDifferentSizes, isConstantPrice, basePrice, baseQty, variantRows]);

  const handleSync = async () => {
    if (!name.trim()) return alert('REQUIRED: PRODUCT_NAME');
    if (!category) return alert('REQUIRED: CATEGORICAL_TIER');
    
    const activeSlots = slots.filter(s => s !== null);
    if (activeSlots.length === 0) return alert('REQUIRED: PRIMARY_MEDIA_ASSET');
    
    if (hasDifferentSizes === null) return alert('VALUATION_ERROR: SIZE_LOGIC_UNDEFINED');
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('categoryId', category);
      formData.append('price', (totals.price || 0).toString());
      formData.append('stockQuantity', (totals.qty || 0).toString());
      formData.append('sku', `SKU-${Math.floor(1000 + Math.random() * 9000)}`);
      formData.append('minThreshold', '5');
      
      // Append all active image slots
      activeSlots.forEach((file) => {
        if (file) formData.append('image', file);
      });

      // Append specs as stringified JSON
      const filteredSpecs = specs.filter(s => s.key && s.value);
      formData.append('specs', JSON.stringify(filteredSpecs));

      await axiosInstance.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setShowSuccess(true);
      setTimeout(() => navigate('/admin/inventory'), 2500);
    } catch (err: any) {
      console.error('SYNC_FAILURE', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-32 px-4 md:px-0 bg-[#F5F5F5] min-h-screen">
      <header className="flex flex-col gap-6 border-b border-[#000000]/5 pb-8 pt-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-4xl font-black text-[#000000] tracking-tighter uppercase leading-none">Add New Product</h1>
              <p className="text-[10px] font-bold text-[#000000]/40 uppercase tracking-[0.4em] mt-2">Industrial Registry Protocol</p>
           </div>
           <button 
              onClick={() => navigate('/admin/inventory')}
              className="px-8 h-12 bg-white border border-[#000000]/10 rounded-full flex items-center justify-center gap-3 text-[10px] font-black text-[#000000]/60 hover:bg-black hover:text-white transition-all shadow-sm uppercase tracking-widest active:scale-95"
           >
              <ArrowLeft size={14} /> Back to Catalog
           </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-16">
        
        {/* DETAILS OF PRODUCT */}
        <section className="bg-white p-10 rounded-[40px] border border-[#000000]/5 shadow-sm space-y-10">
           <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-black rounded-full" />
              <h3 className="text-[11px] font-black text-black uppercase tracking-[0.4em]">Details of Product</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                 <label className="text-[9px] font-black text-black/40 uppercase tracking-[0.3em] ml-2">Product Nomenclature</label>
                 <input 
                   type="text"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   placeholder="Enter unit name..."
                   className="w-full h-14 bg-[#F9F9F9] border border-black/5 rounded-2xl px-6 text-sm font-bold text-black focus:outline-none focus:border-black/20 transition-all placeholder:text-black/10"
                 />
              </div>
              <div className="space-y-4">
                 <label className="text-[9px] font-black text-black/40 uppercase tracking-[0.3em] ml-2">Categorical Tier</label>
                 <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-14 bg-[#F9F9F9] border border-black/5 rounded-2xl px-6 text-sm font-bold text-black focus:outline-none focus:border-black/20 transition-all appearance-none cursor-pointer"
                 >
                    <option value="">Select Category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
              </div>
              <div className="md:col-span-2 space-y-4">
                 <label className="text-[9px] font-black text-black/40 uppercase tracking-[0.3em] ml-2">Product Description</label>
                 <textarea 
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                   placeholder="Enter technical details and overview..."
                   className="w-full h-32 bg-[#F9F9F9] border border-black/5 rounded-3xl p-6 text-sm font-bold text-black focus:outline-none focus:border-black/20 transition-all placeholder:text-black/10 resize-none"
                 />
              </div>
           </div>

           <div className="space-y-6">
              <label className="text-[9px] font-black text-black/40 uppercase tracking-[0.3em] ml-2">Technical Specs</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {specs.map((spec, i) => (
                    <div key={i} className="flex gap-2 items-center bg-[#F9F9F9] p-3 rounded-2xl border border-black/5">
                       <div className="flex-1 space-y-2">
                          <input 
                             value={spec.key}
                             onChange={(e) => updateSpec(i, 'key', e.target.value)}
                             placeholder="Label"
                             className="w-full h-8 bg-white border border-black/5 rounded-lg px-3 text-[10px] font-bold text-black outline-none"
                          />
                          <input 
                             value={spec.value}
                             onChange={(e) => updateSpec(i, 'value', e.target.value)}
                             placeholder="Value"
                             className="w-full h-8 bg-white border border-black/5 rounded-lg px-3 text-[10px] font-bold text-black outline-none"
                          />
                       </div>
                       <button onClick={() => removeSpec(i)} className="w-8 h-8 rounded-lg flex items-center justify-center text-black/20 hover:text-red-500 hover:bg-red-50 transition-all"><X size={14} /></button>
                    </div>
                 ))}
                 <button onClick={addSpec} className="h-[92px] border border-dashed border-black/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-black/30 hover:bg-black/5 transition-all">
                    <Plus size={16} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Add Spec</span>
                 </button>
              </div>
           </div>
        </section>

        {/* IMAGES OF THE PRODUCT */}
        <section className="bg-white p-10 rounded-[40px] border border-[#000000]/5 shadow-sm space-y-10">
            <div className="flex items-center gap-4">
               <div className="w-1 h-8 bg-black rounded-full" />
               <h3 className="text-[11px] font-black text-black uppercase tracking-[0.4em]">Images of the Product</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {slots.map((_, i) => (
                  <div key={i} className="group relative aspect-square rounded-[32px] border-2 border-dashed border-black/10 bg-[#F9F9F9] flex flex-col items-center justify-center overflow-hidden transition-all hover:border-black/20">
                     {previews[i] ? (
                        <>
                           <img src={previews[i]!} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button onClick={() => removeSlot(i)} className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><Trash2 size={16} /></button>
                           </div>
                        </>
                     ) : (
                        <div className="flex flex-col items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black/10 shadow-sm"><ImageIcon size={20} /></div>
                           <label className="cursor-pointer bg-black text-white px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                              Upload
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleSlotUpload(i, e)} />
                           </label>
                        </div>
                     )}
                  </div>
               ))}
            </div>
            <p className="text-[9px] font-bold text-black/20 uppercase tracking-[0.2em] text-center">Standard multi-angle asset projection system. Support for 4 high-fidelity files.</p>
        </section>

        {/* VALUE OF PRODUCT */}
        <section className="bg-white p-10 rounded-[40px] border border-[#000000]/5 shadow-sm space-y-10">
           <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-black rounded-full" />
              <h3 className="text-[11px] font-black text-black uppercase tracking-[0.4em]">Value of Product</h3>
           </div>

           <div className="space-y-12">
              <div className="space-y-6">
                 <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">Variation Logic</p>
                 <div className="flex flex-wrap gap-6">
                    {[
                      { val: false, label: 'Single Node Specification' },
                      { val: true, label: 'Categorical Variance' }
                    ].map((opt) => (
                       <button key={String(opt.val)} onClick={() => { setHasDifferentSizes(opt.val); if (!opt.val) setIsConstantPrice(null); }} className={`flex items-center gap-4 px-6 h-12 rounded-full border transition-all ${hasDifferentSizes === opt.val ? 'bg-black text-white border-black' : 'bg-white text-black/40 border-black/10 hover:border-black/30'}`}>
                          <div className={`w-3 h-3 rounded-full ${hasDifferentSizes === opt.val ? 'bg-white' : 'bg-black/10'}`} />
                          <span className="text-[9px] font-black uppercase tracking-widest">{opt.label}</span>
                       </button>
                    ))}
                 </div>
              </div>

              {hasDifferentSizes === true && (
                <div className="space-y-10 border-t border-black/5 pt-10">
                  <div className="space-y-6">
                      <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">Pricing Strategy</p>
                      <div className="flex flex-wrap gap-6">
                         {[
                           { val: true, label: 'Uniform Valuation' },
                           { val: false, label: 'Tiered Pricing Model' }
                         ].map((opt) => (
                            <button key={String(opt.val)} onClick={() => setIsConstantPrice(opt.val)} className={`flex items-center gap-4 px-6 h-12 rounded-full border transition-all ${isConstantPrice === opt.val ? 'bg-black text-white border-black' : 'bg-white text-black/40 border-black/10 hover:border-black/30'}`}>
                               <div className={`w-3 h-3 rounded-full ${isConstantPrice === opt.val ? 'bg-white' : 'bg-black/10'}`} />
                               <span className="text-[9px] font-black uppercase tracking-widest">{opt.label}</span>
                            </button>
                         ))}
                      </div>
                   </div>

                  {isConstantPrice !== null && (
                    <div className="space-y-8">
                        {isConstantPrice && (
                           <div className="max-w-xs space-y-4">
                              <label className="text-[9px] font-black text-black/40 uppercase tracking-[0.3em] ml-2">Flat Rate (₹)</label>
                              <input type="number" value={basePrice || ''} onChange={(e) => setBasePrice(Number(e.target.value))} placeholder="0.00" className="w-full h-14 bg-[#F9F9F9] border border-black/5 rounded-2xl px-6 text-sm font-bold text-black" />
                           </div>
                        )}
                        <div className="rounded-[32px] border border-black/5 overflow-hidden">
                           <table className="w-full text-left">
                              <thead className="bg-[#F9F9F9]">
                                 <tr className="border-b border-black/5">
                                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest opacity-40">Variation</th>
                                    {!isConstantPrice && <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest opacity-40">Price (₹)</th>}
                                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest opacity-40">Qty</th>
                                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest opacity-40 text-right">Delete</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-black/5">
                                 {variantRows.map((row, i) => (
                                    <tr key={i}>
                                       <td className="px-6 py-4"><input value={row.size} onChange={(e) => updateVariantRow(i, 'size', e.target.value)} placeholder="Size..." className="w-full h-10 bg-white border border-black/5 rounded-xl px-4 text-xs font-bold" /></td>
                                       {!isConstantPrice && <td className="px-6 py-4"><input type="number" value={row.price || ''} onChange={(e) => updateVariantRow(i, 'price', e.target.value)} placeholder="0.00" className="w-full h-10 bg-white border border-black/5 rounded-xl px-4 text-xs font-bold" /></td>}
                                       <td className="px-6 py-4"><input type="number" value={row.qty || ''} onChange={(e) => updateVariantRow(i, 'qty', e.target.value)} placeholder="0" className="w-full h-10 bg-white border border-black/5 rounded-xl px-4 text-xs font-bold" /></td>
                                       <td className="px-6 py-4 text-right"><button onClick={() => removeVariantRow(i)} className="w-10 h-10 rounded-xl text-black/20 hover:text-red-500 hover:bg-red-50 transition-all inline-flex items-center justify-center"><Trash2 size={16} /></button></td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                           <button onClick={addVariantRow} className="w-full py-5 bg-[#F9F9F9] hover:bg-black hover:text-white transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3"><Plus size={16} /> Add Variant</button>
                        </div>
                    </div>
                  )}
                </div>
              )}

              {hasDifferentSizes === false && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-black/5 pt-10">
                   <div className="space-y-4">
                      <label className="text-[9px] font-black text-black/40 uppercase tracking-[0.3em] ml-2">Unit Valuation (₹)</label>
                      <input type="number" value={basePrice || ''} onChange={(e) => setBasePrice(Number(e.target.value))} placeholder="0.00" className="w-full h-14 bg-[#F9F9F9] border border-black/5 rounded-2xl px-6 text-sm font-bold text-black" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[9px] font-black text-black/40 uppercase tracking-[0.3em] ml-2">Total Units</label>
                      <input type="number" value={baseQty || ''} onChange={(e) => setBaseQty(Number(e.target.value))} placeholder="Quantity..." className="w-full h-14 bg-[#F9F9F9] border border-black/5 rounded-2xl px-6 text-sm font-bold text-black" />
                   </div>
                </div>
              )}
           </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto flex gap-6 pt-10">
        <button onClick={() => navigate('/admin/inventory')} className="flex-1 h-16 bg-white border border-black/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black/40 hover:bg-[#F9F9F9] hover:text-black transition-all shadow-sm">
           Cancel
        </button>
        <button onClick={handleSync} disabled={isSubmitting} className={`flex-[2] h-16 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-4 ${isSubmitting ? 'bg-black/20 text-black/40 cursor-wait' : 'bg-black text-white hover:bg-black/90 active:scale-[0.98]'}`}>
           {isSubmitting ? <div className="w-4 h-4 border-2 border-black/10 border-t-black animate-spin rounded-full" /> : <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
           {isSubmitting ? 'Syncing...' : 'Add to Inventory'}
        </button>
      </footer>

      {/* SUCCESS POPUP */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-[#F5F5F5] z-[3000] flex flex-col items-center justify-center space-y-8"
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="w-24 h-24 bg-black rounded-[32px] flex items-center justify-center text-white shadow-2xl"
             >
                <Package size={40} />
             </motion.div>
             <div className="text-center space-y-3">
                <h3 className="text-4xl font-black text-black uppercase tracking-tighter">The item have been added</h3>
                <p className="text-[12px] font-bold text-black/20 uppercase tracking-[0.6em]">Redirecting to Inventory Control Control...</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
