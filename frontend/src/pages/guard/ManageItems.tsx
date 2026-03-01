import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

const statusStyles: Record<string, string> = {
  available: 'bg-success/20 text-success border-success/30 shadow-success/20',
  claimed: 'bg-warning/20 text-warning border-warning/30 shadow-warning/20',
  delivered: 'bg-info/20 text-info border-info/30 shadow-info/20',
};

const fetchItems = async () => {
  const { data } = await api.get('/items');
  if (data.success && data.items) {
    return data.items.map((item: any) => ({
      ...item,
      id: item._id,
      name: item.title,
      date: new Date(item.foundDate || item.createdAt).toLocaleDateString(),
    }));
  }
  return [];
};

const ManageItems = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: '', location: '', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['manageItems'],
    queryFn: fetchItems,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/items/${id}`);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['manageItems'] });
      const previousItems = queryClient.getQueryData(['manageItems']);
      queryClient.setQueryData(['manageItems'], (old: any) =>
        old ? old.filter((item: any) => item.id !== id) : []
      );
      return { previousItems };
    },
    onSuccess: () => {
      toast.success('Item deleted successfully');
    },
    onError: (err: any, _id: string, context: any) => {
      queryClient.setQueryData(['manageItems'], context?.previousItems);
      toast.error(err.response?.data?.message || 'Failed to delete item');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['manageItems'] });
    }
  });

  const createMutation = useMutation({
    mutationFn: async (fd: FormData) => {
      // Axios auto-sets the correct Content-Type with boundary when passing FormData
      const res = await api.post('/items', fd);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manageItems'] });
      setShowAdd(false);
      setFormData({ title: '', category: '', location: '', description: '' });
      setImageFile(null);
      toast.success('Item added successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add item');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('category', formData.category);
    fd.append('location', formData.location);
    fd.append('description', formData.description);
    if (imageFile) {
      fd.append('image', imageFile);
    }
    createMutation.mutate(fd);
  };

  const deleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="page-container py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-primary/10 text-primary mb-4 tracking-wide border border-primary/20">VAULT CONTROL</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 text-glow">Inventory</span></h1>
            <p className="text-lg text-muted-foreground mt-2">Log discovered items and maintain the secure vault.</p>
          </motion.div>
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} onClick={() => setShowAdd(!showAdd)} className={`inline-flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg hover:-translate-y-1 ${showAdd ? 'bg-secondary text-foreground hover:bg-secondary/80 border border-border' : 'bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-primary/30 glow-border'}`}>
            {showAdd ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />} {showAdd ? 'Cancel Entry' : 'Log New Item'}
          </motion.button>
        </div>

        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
            <form className="mb-12 bento-box p-8 md:p-10 border-t-4 border-t-primary" onSubmit={handleSubmit}>
              <h3 className="text-xl font-bold text-foreground mb-6">Secure Log Entry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">Identifiable Title</label>
                  <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background outline-none transition-all shadow-sm" placeholder="e.g. Blue Dell Laptop" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">Item Category</label>
                  <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background outline-none transition-all shadow-sm">
                    <option value="" disabled>Select Classification</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Documents">Documents</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Books">Books</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Keys">Keys</option>
                    <option value="ID Cards">ID Cards</option>
                    <option value="Water Bottle">Water Bottle</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">Discovery Location</label>
                  <select required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background outline-none transition-all shadow-sm">
                    <option value="" disabled>Select Zone</option>
                    <option value="Main Building">Main Building</option>
                    <option value="Library">Library</option>
                    <option value="Canteen">Canteen</option>
                    <option value="Sports Complex">Sports Complex</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Classroom">Classroom</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Auditorium">Auditorium</option>
                    <option value="Parking">Parking</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">Photographic Evidence</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full cursor-pointer file:cursor-pointer file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all rounded-xl border border-input bg-background/50 backdrop-blur-sm text-sm text-foreground focus:ring-2 focus:border-primary outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">Detailed Observations</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background outline-none transition-all shadow-sm resize-none" placeholder="Provide distinct markings or state..." />
                </div>
                <div className="md:col-span-2 mt-2">
                  <button disabled={createMutation.isPending} type="submit" className="w-full sm:w-auto bg-primary text-primary-foreground px-10 py-4 rounded-xl text-sm font-bold tracking-wide hover:bg-primary-hover hover:-translate-y-1 transition-all disabled:opacity-50 glow-border shadow-lg hover:shadow-primary/30">
                    {createMutation.isPending ? 'Logging to Database...' : 'Commit to Vault'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {isLoading ? (
          <div className="py-12"><div className="text-muted-foreground font-medium flex items-center justify-center gap-2"><div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div> Syncing Vault Records...</div></div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card/40 backdrop-blur-xl rounded-2xl border border-border overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 bg-secondary/30 text-xs uppercase tracking-wider">
                  <th className="text-left p-4 font-bold text-muted-foreground whitespace-nowrap">Asset ID</th>
                  <th className="text-left p-4 font-bold text-muted-foreground whitespace-nowrap">Classification</th>
                  <th className="text-left p-4 font-bold text-muted-foreground whitespace-nowrap">Origin Zone</th>
                  <th className="text-left p-4 font-bold text-muted-foreground whitespace-nowrap">Logged Date</th>
                  <th className="text-center p-4 font-bold text-muted-foreground whitespace-nowrap">Current State</th>
                  <th className="text-right p-4 font-bold text-muted-foreground whitespace-nowrap">Control</th>
                </tr></thead>
                <motion.tbody
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
                >
                  {items.map((item: any) => (
                    <motion.tr variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }} key={item.id} className="border-b border-border/50 last:border-0 hover:bg-white/5 transition-colors group">
                      <td className="p-4 text-foreground font-bold group-hover:text-primary transition-colors whitespace-nowrap">{item.name}</td>
                      <td className="p-4 text-muted-foreground font-medium whitespace-nowrap">{item.category}</td>
                      <td className="p-4 text-muted-foreground font-medium whitespace-nowrap">{item.location}</td>
                      <td className="p-4 text-muted-foreground font-medium whitespace-nowrap">{item.date}</td>
                      <td className="p-4 text-center whitespace-nowrap"><span className={`inline-block px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${statusStyles[item.status]}`}>{item.status}</span></td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button onClick={() => deleteItem(item.id)} className="p-2.5 rounded-xl hover:bg-destructive/20 transition-all text-destructive hover:-translate-y-0.5" title="Remove securely"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </motion.tr>
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan={6} className="p-12 text-center text-muted-foreground text-lg">The vault is completely empty.</td></tr>
                  )}
                </motion.tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div >
  );
};

export default ManageItems;
