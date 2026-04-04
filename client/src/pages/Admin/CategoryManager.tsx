import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  Plus, 
  GripVertical, 
  Trash2, 
  Edit3, 
  X,
  LayoutGrid,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  logoUrl?: string;
  orderIndex: number;
  isActive: boolean;
  _count?: { products: number };
}

export default function CategoryManager() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newName, setNewName] = useState("");
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [pendingCategories, setPendingCategories] = useState<Category[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosInstance.get('/products/categories');
      return res.data.categories as Category[];
    }
  });

  useEffect(() => {
    if (categories && !hasChanges) {
      setPendingCategories([...categories]);
    }
  }, [categories, hasChanges]);

  const reorderMutation = useMutation({
    mutationFn: (items: { id: string, orderIndex: number }[]) => 
      axiosInstance.put('/products/categories/reorder', { items }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['home-categories'] });
      setHasChanges(false);
      setNotification({ message: "Categorical positions have been rearranged", type: 'success' });
      setTimeout(() => {
        setNotification(null);
        navigate('/admin/settings');
      }, 2000);
    },
    onError: (err: any) => setNotification({ message: err.response?.data?.message || "Failed to preserve hierarchy", type: 'error' })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => 
      axiosInstance.delete(`/products/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    onError: (err: any) => setNotification({ message: err.response?.data?.message || "Deletion protocol failed", type: 'error' })
  });

  const upsertMutation = useMutation({
    mutationFn: (data: any) => {
      if (editingCategory) {
        return axiosInstance.patch(`/products/categories/${editingCategory.id}`, data);
      }
      return axiosInstance.post('/products/categories', data);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      closeModal();
      const catName = editingCategory ? editingCategory.name : res.data.name;
      setNotification({ message: editingCategory ? `Categorical node "${catName}" updated` : `New "${catName}" category added to registry`, type: 'success' });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    },
    onError: (err: any) => setNotification({ message: err.response?.data?.message || "Synchronization failed", type: 'error' })
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = pendingCategories.findIndex((c) => c.id === active.id);
      const newIndex = pendingCategories.findIndex((c) => c.id === over.id);
      let newOrder = arrayMove(pendingCategories, oldIndex, newIndex);
      newOrder = newOrder.map((c, idx) => ({ ...c, orderIndex: idx }));
      setPendingCategories(newOrder);
      setHasChanges(true);
    }
  };

  const saveOrderChanges = () => {
    const reorderPayload = pendingCategories.map((cat, idx) => ({ id: cat.id, orderIndex: idx }));
    reorderMutation.mutate(reorderPayload);
  };

  const cancelOrderChanges = () => {
    if (categories) {
      setPendingCategories([...categories]);
      setHasChanges(false);
    }
  };


  const handleManualPositionChange = (oldIndex: number, newIndex: number) => {
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= pendingCategories.length) newIndex = pendingCategories.length - 1;
    if (oldIndex === newIndex) return;

    const newOrder = arrayMove(pendingCategories, oldIndex, newIndex);
    setPendingCategories(newOrder.map((c, idx) => ({ ...c, orderIndex: idx })));
    setHasChanges(true);
  };

  const openModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setNewName(cat.name);
    } else {
      setEditingCategory(null);
      setNewName("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) return (
     <div className="h-screen flex flex-col items-center justify-center bg-[#D6D6D6]/30 select-none">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 border-4 border-[#000000]/5 border-t-[#000000] rounded-full shadow-2xl mb-8" />
        <p className="text-[10px] font-black text-[#000000]/40 uppercase tracking-[0.5em] animate-pulse">Establishing Categorical Link_</p>
     </div>
  );

  return (
    <div className="space-y-12 pb-32 pt-4 select-none px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[#000000]/10 pb-8 mt-4">
        <div className="space-y-3">
           <h1 className="text-3xl font-black text-[#000000] tracking-tighter uppercase leading-none">
              Manage Categories
           </h1>
        </div>
        <div className="flex items-center gap-6">
           <button onClick={() => openModal()} className="flex items-center gap-4 h-16 bg-[#000000] text-[#D6D6D6] px-12 rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-[#FFFFFF] hover:text-black transition-all active:scale-95 border-2 border-transparent hover:border-black/10"><Plus size={20} strokeWidth={3} /> Insert New Category</button>
        </div>
      </header>

      <div className="bg-white rounded-[48px] border-2 border-[#000000]/5 shadow-2xl overflow-hidden relative group">
        <div className="hidden lg:grid grid-cols-[80px_120px_1fr_200px_180px] gap-8 p-10 bg-[#000000] text-[10px] font-black uppercase tracking-[0.5em] text-[#D6D6D6]">
           <span className="text-center">Move</span>
           <span className="text-center">Position</span>
           <span className="text-left ml-4">Category Name</span>
           <span className="text-center">Product Count</span>
           <span className="text-right mr-4">Actions</span>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
           <SortableContext items={pendingCategories.map(c => c.id)} strategy={verticalListSortingStrategy}>
              <div className="divide-y divide-[#000000]/5 transition-colors">
                 {pendingCategories.map((cat, idx) => (
                    <SortableItem key={cat.id} cat={cat} index={idx} onEdit={() => openModal(cat)} onDelete={() => deleteMutation.mutate(cat.id)} onPositionChange={handleManualPositionChange} />
                 ))}
                 {pendingCategories.length === 0 && (
                    <div className="p-32 text-center space-y-4">
                       <LayoutGrid size={64} className="mx-auto text-[#000000]/5" />
                       <p className="text-[10px] font-black text-[#000000]/20 uppercase tracking-[0.5em]">No categories found_</p>
                    </div>
                 )}
              </div>
           </SortableContext>
        </DndContext>

        {hasChanges && (
          <div className="p-8 border-t-2 border-black/5 bg-black/5 flex items-center justify-between rounded-b-[40px]">
            <div className="flex-1 space-y-1">
               <p className="text-[10px] font-black text-black uppercase tracking-widest">Global Sequence Modified_</p>
               <p className="text-[9px] font-bold text-black/40 uppercase tracking-tighter italic">Manual curation detected. Synchronization required for storefront persistence.</p>
            </div>
            <div className="flex gap-4">
               <button onClick={cancelOrderChanges} className="px-10 h-16 bg-white/50 border-2 border-black/5 rounded-[24px] text-[11px] font-black text-black hover:bg-black hover:text-white transition-all uppercase tracking-widest">Discard Changes</button>
               <button onClick={saveOrderChanges} disabled={reorderMutation.isPending} className="px-12 h-16 bg-black text-white rounded-[24px] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-[#444444] transition-all active:scale-95 disabled:opacity-50">{reorderMutation.isPending ? "SAVING..." : "Save Changes"}</button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {notification && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#000000]/20 backdrop-blur-xl z-[2000]" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2100]">
               <div className={`p-10 rounded-[40px] shadow-[0_32px_128px_rgba(0,0,0,0.3)] border-2 border-[#000000]/5 flex flex-col items-center gap-6 min-w-[400px] ${notification.type === 'success' ? 'bg-black text-white' : 'bg-red-600 text-white'}`}>
                  <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${notification.type === 'success' ? 'bg-[#FFFFFF]/10' : 'bg-[#FFFFFF]/20'}`}>
                     {notification.type === 'success' ? <Check size={32} className="text-green-400" /> : <X size={32} className="text-white" />}
                  </div>
                  <div className="space-y-1 text-center">
                     <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">{notification.type === 'success' ? 'Protocol Executed' : 'Operational Error'}</p>
                     <p className="text-xl font-black tracking-tight">{notification.message}</p>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="fixed inset-0 bg-[#000000]/30 backdrop-blur-md z-[1000]" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 30 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-4rem)] max-w-xl bg-white p-12 shadow-[0_0_100px_rgba(0,0,0,0.2)] z-[1100] rounded-[56px] border-2 border-[#000000]/5 text-center flex flex-col items-center gap-10">
              <div className="space-y-3">
                 <h3 className="text-3xl font-black text-[#000000] tracking-tighter uppercase leading-tight">{editingCategory ? "Update Category Name" : "Create New Category"}</h3>
                 <p className="text-[10px] font-black text-[#000000]/20 uppercase tracking-[0.3em]">Enter name for the catalog node</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); upsertMutation.mutate({ name: newName }); }} className="space-y-12 w-full">
                 <div className="relative group">
                    <input autoFocus required value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-[#D6D6D6]/40 border-2 border-transparent rounded-[28px] h-20 text-2xl font-black text-[#000000] outline-none focus:border-[#000000]/10 focus:bg-white text-center tracking-tighter shadow-inner transition-all group-hover:scale-[1.02]" placeholder="NAME..." />
                    <div className="absolute inset-0 rounded-[28px] border-2 border-[#000000]/5 pointer-events-none" />
                 </div>
                 <div className="flex gap-6 w-full pt-4">
                    <button type="button" onClick={closeModal} className="flex-1 h-14 bg-white border-2 border-[#000000]/5 text-[#000000]/40 rounded-[20px] font-black text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm">Abort</button>
                    <button type="submit" disabled={upsertMutation.isPending} className="flex-[2] h-14 bg-[#000000] text-[#D6D6D6] rounded-[20px] font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-[#FFFFFF] hover:text-black transition-all active:scale-95 disabled:opacity-50">{upsertMutation.isPending ? "SAVING..." : "Confirm Category"}</button>
                 </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SortableItem({ cat, index, onEdit, onDelete, onPositionChange }: { cat: Category, index: number, onEdit: () => void, onDelete: () => void, onPositionChange: (old: number, next: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });
  const [localPos, setLocalPos] = useState((index + 1).toString());
  
  useEffect(() => {
    setLocalPos((index + 1).toString());
  }, [index]);

  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 20 : 1, opacity: isDragging ? 0.9 : 1 };

  const handleCommit = () => {
    const newPos = parseInt(localPos);
    if (!isNaN(newPos) && newPos > 0 && newPos <= 99 && newPos !== index + 1) {
      onPositionChange(index, newPos - 1);
    } else {
      setLocalPos((index + 1).toString());
    }
  };

  return (
    <div ref={setNodeRef} style={style} className={`flex flex-col lg:grid lg:grid-cols-[80px_120px_1fr_200px_180px] gap-8 p-6 items-center bg-white transition-all relative ${isDragging ? 'shadow-2xl ring-4 ring-[#000000]/10 bg-white scale-[1.01] rounded-[32px] z-20' : 'hover:bg-[#000000]/[0.02]'}`}>
      <div {...attributes} {...listeners} className="flex items-center justify-center cursor-grab active:cursor-grabbing text-[#000000]/10 hover:text-[#000000] transition-all p-3 hover:bg-white rounded-xl shadow-sm"><GripVertical size={20} /></div>
      
      <div className="flex justify-center">
         <input 
            type="number"
            value={localPos}
            onChange={(e) => setLocalPos(e.target.value)}
            onBlur={handleCommit}
            onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
            onFocus={(e) => (e.target as HTMLInputElement).select()}
            className="w-16 h-12 bg-black/5 hover:bg-black hover:text-white border-2 border-black/5 rounded-xl text-center text-lg font-black text-black outline-none transition-all focus:scale-110 focus:shadow-xl group-hover:bg-white"
         />
      </div>

      <div className="flex items-center gap-6 flex-1 min-w-0 pl-4">
         <div className="flex flex-col">
            <p className="text-xl font-black text-[#000000] uppercase tracking-tighter truncate leading-none">{cat.name}</p>
         </div>
      </div>

      <div className="flex justify-center">
         <div className="inline-flex items-center gap-4 px-6 py-2 bg-black/5 rounded-full border border-black/5">
            <span className="text-[12px] font-black text-[#000000]">{cat._count?.products || 0} Products</span>
         </div>
      </div>

      <div className="flex gap-4 justify-end pr-4">
         <button onClick={onEdit} className="w-10 h-10 text-black/20 hover:text-black hover:bg-white border-2 border-black/5 rounded-xl transition-all active:scale-90 flex items-center justify-center"><Edit3 size={16} /></button>
         <button onClick={onDelete} className="w-10 h-10 text-black/20 hover:text-red-600 hover:bg-red-50 border-2 border-black/5 rounded-xl transition-all active:scale-90 flex items-center justify-center"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}
