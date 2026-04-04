import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Heart, 
  Star,
  Share2,
  ChevronDown,
  Layers,
  Maximize,
  Weight,
  Clock,
  Check,
  User,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../store/CartContext';
import type { CartItem } from '../../store/CartContext';
import { useLists } from '../../store/ListsContext';
import ProductCard from '../../components/premium/ProductCard';
import axios from 'axios';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { carts, activeCartId, setActiveCartId, addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useLists();
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`, { withCredentials: true });
        const prod = data.product;
        setProduct(prod);

        // Fetch similar products
        const similarRes = await axios.get(`/api/products?categoryId=${prod.categoryId}&limit=6`);
        setSimilarProducts(similarRes.data.products.filter((p: any) => p.id !== id));

        const sizes: any = {};
        const availableSizes = prod.availableSizes || [
          { name: 'S', price: prod.price || 0, stock: 124 },
          { name: 'M', price: (prod.price || 0) * 0.95, stock: 82 },
          { name: 'L', price: (prod.price || 0) * 0.9, stock: 45 }
        ];
        availableSizes.forEach((s: any) => {
          sizes[s.name] = 0;
        });
        setSelectedSizes(sizes);
      } catch (err: any) {
        console.error('ERROR_FETCHING_PRODUCT:', err);
        const dummy = {
           id: id,
           name: `Industrial Unit [${id?.slice(0,8)}]`,
           price: 24500,
           image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60',
           category: { name: 'Operations' },
           description: 'Standard technical unit for industrial applications.',
           stockQuantity: 124,
           rating: 4.8,
           specifications: [
             { label: "Material", value: "Reinforced Polypropylene", icon: Layers },
             { label: "Dimensions", value: "600 x 400 x 320 mm", icon: Maximize },
             { label: "Weight", value: "2.4 kg / unit", icon: Weight },
             { label: "Lead Time", value: "3-5 Business Days", icon: Clock }
           ]
        };
        setProduct(dummy);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading || !product) return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center gap-4">
       <div className="w-10 h-10 border-4 border-[#000000]/10 border-t-[#000000] rounded-full animate-spin" />
       <p className="text-[9px] font-black text-[#000000]/40 uppercase tracking-[0.5em]">Loading Node</p>
    </div>
  );

  const images = product.images || (product.image ? [product.image] : ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60']);
  const availableSizes = product.availableSizes || [
     { name: 'S', price: product.price || 0, stock: 124 },
     { name: 'M', price: (product.price || 0) * 0.95, stock: 82 },
     { name: 'L', price: (product.price || 0) * 0.9, stock: 45 }
  ];

  const updateQuantity = (size: string, delta: number) => {
    setSelectedSizes((prev: any) => ({
      ...prev,
      [size]: Math.max(0, (prev[size] || 0) + delta)
    }));
  };

  const totalItems = Object.values(selectedSizes).reduce((a: any, b: any) => a + Number(b), 0) as number;
  const totalPrice = availableSizes.reduce((sum: number, size: any) => sum + (selectedSizes[size.name] || 0) * size.price, 0);

  const handleAddToCart = () => {
    if (totalItems > 0) {
      const itemsToAdd: CartItem[] = [];
      availableSizes.forEach((sizeObj: any) => {
        const qty = selectedSizes[sizeObj.name];
        if (qty > 0) {
          itemsToAdd.push({
            cartItemId: `${product.id}-${sizeObj.name}`,
            productId: product.id,
            name: product.name,
            price: sizeObj.price,
            quantity: qty,
            image: images[0],
            sku: product.sku || 'N/A',
            size: sizeObj.name
          });
        }
      });
      addItem(itemsToAdd);
    }
  };

  const specifications = product.specifications || [
    { label: "Material", value: "Industrial Polymer", icon: Layers },
    { label: "Dimensions", value: "Standard Unit", icon: Maximize },
    { label: "Weight", value: "Variable", icon: Weight },
    { label: "Lead Time", value: "Ready to Dispatch", icon: Clock }
  ];

  const reviews = [
    { user: "Fac. Manager A", rating: 5, comment: "Exceptional build quality. Fits perfectly in our Southern Hub setup." },
    { user: "Ind. Procurements", rating: 4, comment: "Robust hardware. Lead times are accurate. Highly recommended for heavy duty nodes." },
    { user: "Tech Lab Alpha", rating: 5, comment: "The heat resistance is superior to the legacy models. Synchronized perfectly with our D-Block infrastructure." }
  ];

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-sans selection:bg-[#000000] selection:text-[#FFFFFF] pb-24">
      <main className="max-w-[1400px] mx-auto px-0 sm:px-6 md:px-10 pt-0 sm:pt-6 space-y-12">
        
        {/* SHADOWLESS GREY MASTER CONTAINER BOX - Sharper Edges */}
        <div className="bg-[#D6D6D6] rounded-none sm:rounded-[12px] p-4 md:p-6 border border-[#000000]/10">
           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-6 md:gap-16 items-start">
              
              {/* LEFT: GALLERY AREA (Sticky only on large screens, Sharper corners) */}
              <div className="xl:col-span-6 lg:sticky lg:top-10 space-y-4">
                 <div className="absolute top-0 left-0 z-10 p-2">
                    <Link to="/shop" className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center border border-[#000000]/10 group">
                       <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                 </div>
                 
                 <div className="aspect-square bg-[#FFFFFF]/30 rounded-[8px] overflow-hidden border border-[#000000]/5 flex items-center justify-center relative">
                    <AnimatePresence mode="wait">
                       <motion.img 
                         key={activeImage}
                         initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                         src={images[activeImage]} 
                         className="w-full h-full object-cover" 
                       />
                    </AnimatePresence>
                 </div>
                 
                 <div className="grid grid-cols-4 gap-2">
                    {images.map((img: string, idx: number) => (
                       <button key={idx} onClick={() => setActiveImage(idx)} className={`aspect-square rounded-[4px] overflow-hidden border-2 transition-all bg-white ${activeImage === idx ? 'border-[#000000] scale-105' : 'border-transparent opacity-60'}`}>
                          <img src={img} className="w-full h-full object-cover" />
                       </button>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 h-10 bg-white rounded-[4px] flex items-center justify-center transition-all text-[#000000] border border-[#000000]/10 gap-3 text-[10px] font-black tracking-widest uppercase">
                       <Share2 size={14} /> Share
                    </button>
                    <button 
                      onClick={() => toggleWishlist({id: product.id, name: product.name, price: product.price, stockQuantity: 100, category: product.category || {name: 'Catalog'}, image: images[0]})}
                      className={`w-10 h-10 rounded-[4px] flex items-center justify-center transition-all border border-[#000000]/10 ${isInWishlist(product.id as string) ? 'bg-[#000000] text-white' : 'bg-white text-[#000000]'}`}
                    >
                      <Heart size={16} className={isInWishlist(product.id as string) ? 'fill-current' : ''} />
                    </button>
                 </div>
              </div>

              {/* RIGHT: INFO FEED AREA (Dense Responsive Flow, Sharper Corners) */}
              <div className="xl:col-span-6 flex flex-col space-y-8">
                 <div className="space-y-4">
                    <div className="space-y-1">
                       <div className="flex items-center gap-3">
                          <div className="flex text-[#FFC107] gap-0.5">
                             {[...Array(5)].map((_, i) => <Star key={i} size={15} fill={i < Math.floor(product.rating || 4.5) ? 'currentColor' : 'none'} strokeWidth={i < Math.floor(product.rating || 4.5) ? 0 : 2} />)}
                          </div>
                          <span className="text-[10px] font-black text-[#000000]/30 uppercase tracking-widest leading-none">{product.rating || 4.5} Evaluated</span>
                       </div>
                       <h1 className="text-xl md:text-3xl font-black text-[#000000] tracking-tighter uppercase leading-none">{product.name}</h1>
                    </div>

                    <div className="bg-white rounded-[6px] p-4 md:p-6 border border-[#000000]/10 space-y-4">
                       <div className="overflow-x-auto scrollbar-hide">
                          <table className="w-full text-left">
                             <thead>
                                <tr className="border-b border-[#000000]/10">
                                   <th className="pb-4 text-[10px] font-black uppercase tracking-[0.1em] text-[#000000]/30 font-display">Dimension</th>
                                   <th className="pb-4 text-[10px] font-black uppercase tracking-[0.1em] text-[#000000]/30 text-center font-display">Unit Price</th>
                                   <th className="pb-4 text-[10px] font-black uppercase tracking-[0.1em] text-[#000000]/30 text-right font-display">Qty</th>
                                </tr>
                             </thead>
                             <tbody>
                                {availableSizes.map((sizeObj: any) => (
                                   <tr key={sizeObj.name} className="border-b border-[#000000]/5 last:border-none group hover:bg-[#F2F2F2]/40 transition-all">
                                      <td className="py-3"><span className="text-[14px] font-black text-[#000000] uppercase">{sizeObj.name}</span></td>
                                      <td className="py-3 text-center"><span className="text-[16px] font-black text-[#000000]">₹{sizeObj.price.toLocaleString()}</span></td>
                                      <td className="py-3">
                                         <div className="flex items-center justify-end gap-3">
                                            <button onClick={() => updateQuantity(sizeObj.name, -1)} className="w-7 h-7 rounded-[4px] bg-[#D6D6D6]/20 border border-[#000000]/10 flex items-center justify-center hover:bg-[#000000] hover:text-white transition-all"><Minus size={10} /></button>
                                            <span className="text-[14px] font-black text-[#000000] w-5 text-center">{selectedSizes[sizeObj.name] || 0}</span>
                                            <button onClick={() => updateQuantity(sizeObj.name, 1)} className="w-7 h-7 rounded-[4px] bg-[#D6D6D6]/20 border border-[#000000]/10 flex items-center justify-center hover:bg-[#000000] hover:text-white transition-all"><Plus size={10} /></button>
                                         </div>
                                      </td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>

                    <div className="space-y-4">
                       {/* GREY PRICING BOX - Sharp Edges */}
                       <div className="flex justify-between items-center bg-[#D6D6D6]/50 p-5 rounded-[4px] text-black relative border border-[#000000]/10">
                          <div className="space-y-0.5">
                             <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em] font-display">Batch Total</p>
                             <p className="text-2xl md:text-3xl font-black tracking-tighter leading-none text-black">₹{totalPrice.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[9px] font-black opacity-30 uppercase tracking-widest leading-none mb-1 font-display">Selections</p>
                             <p className="text-xl font-black">{totalItems} Units</p>
                          </div>
                       </div>
                       
                       <div className="flex gap-2">
                          <button onClick={handleAddToCart} disabled={totalItems === 0} className={`flex-1 py-3.5 rounded-[4px] font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${totalItems > 0 ? 'bg-black text-[#D6D6D6] hover:bg-[#111111]' : 'bg-black/5 text-black/10 cursor-not-allowed'}`}>
                             ADD TO CART <ShoppingCart size={16} />
                          </button>
                          <button onClick={() => setShowCartDropdown(!showCartDropdown)} className={`w-12 py-3 rounded-[4px] border border-[#000000]/10 flex items-center justify-center transition-all bg-white text-black/30 hover:bg-[#D6D6D6]/10 ${showCartDropdown ? 'rotate-180' : ''}`}>
                             <ChevronDown size={18} />
                          </button>
                       </div>

                       <AnimatePresence>
                          {showCartDropdown && (
                             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-white p-4 rounded-[4px] border border-black/10 space-y-1">
                                {carts.map(c => (
                                   <button key={c.id} onClick={() => { setActiveCartId(c.id); setShowCartDropdown(false); }} className={`w-full flex items-center justify-between p-4 rounded-[4px] transition-all font-black uppercase text-[10px] tracking-widest ${activeCartId === c.id ? 'bg-black text-[#D6D6D6]' : 'bg-[#D6D6D6]/10 text-black hover:bg-[#D6D6D6]/30'}`}>
                                      <span>{c.name}</span>
                                      {activeCartId === c.id && <Check size={16} />}
                                   </button>
                                ))}
                             </motion.div>
                          )}
                       </AnimatePresence>
                    </div>

                    {/* Highly Dense Sharp Review/Specs Area */}
                    <div className="pt-8 space-y-8">
                       <div className="space-y-4">
                          <h2 className="text-md md:text-lg font-black text-black uppercase tracking-tighter border-b border-black/10 pb-2 flex items-center gap-2 font-display"><MessageSquare size={18} strokeWidth={3} /> Feedback</h2>
                          <div className="grid grid-cols-1 gap-2">
                             {reviews.map((r, i) => (
                                <div key={i} className="space-y-2 p-4 bg-white rounded-[4px] border border-black/10 transition-all group">
                                   <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 bg-black text-[#D6D6D6] rounded-full flex items-center justify-center font-black transition-transform group-hover:scale-110"><User size={13} /></div>
                                         <p className="text-[10px] font-black uppercase tracking-tight text-[#000000]">{r.user}</p>
                                      </div>
                                      <div className="flex text-[#FFC107] gap-0.5">
                                         {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={i < r.rating ? 'currentColor' : 'none'} strokeWidth={i < r.rating ? 0 : 2} />)}
                                      </div>
                                   </div>
                                   <p className="text-[11px] font-bold text-black/70 leading-normal uppercase tracking-normal line-clamp-2">{r.comment}</p>
                                </div>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-4">
                          <h2 className="text-md md:text-lg font-black text-black uppercase tracking-tighter border-b border-black/10 pb-2 font-display">Parameters</h2>
                          <div className="grid grid-cols-2 gap-2">
                             {specifications.map((spec: any, i: number) => (
                                <div key={i} className="bg-white p-3 rounded-[4px] border border-black/10 flex items-center gap-3 transition-all group">
                                   <div className="w-8 h-8 bg-[#D6D6D6]/30 rounded-[4px] flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all"><spec.icon size={14} /></div>
                                   <div className="space-y-0.5 min-w-0">
                                      <p className="text-[8px] font-black text-black/30 uppercase tracking-widest leading-none truncate">{spec.label}</p>
                                      <p className="text-[11px] font-black text-black uppercase tracking-tighter truncate">{spec.value}</p>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* 4. SIMILAR PRODUCTS SECTION (GREY CARDS, Sharp) */}
        {similarProducts.length > 0 && (
          <div className="space-y-6 pt-6 px-4 md:px-0">
            <h2 className="text-xl font-black text-black uppercase tracking-tighter border-b border-black/10 pb-2 font-display">Similar Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-4">
               {similarProducts.map((p) => (
                  <ProductCard key={p.id} product={p} className="!bg-[#D6D6D6] !border-black/10 !rounded-[6px]" />
               ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
