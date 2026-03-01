import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

const statusStyles: Record<string, string> = {
  available: 'bg-success/10 text-success',
  claimed: 'bg-warning/10 text-warning',
  delivered: 'bg-info/10 text-info',
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manageItems'] });
      toast.success('Item deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete item');
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
      <div className="page-container py-8">
        <div className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-foreground">Manage Items</h1>
            <p className="text-muted-foreground mt-1">Add, edit, or remove lost items</p>
          </motion.div>
          <button onClick={() => setShowAdd(!showAdd)} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
            {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {showAdd ? 'Close' : 'Add Item'}
          </button>
        </div>

        {showAdd && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 bg-card rounded-xl border border-border p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
            onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-foreground">Item Name</label>
              <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Category</label>
              <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                <option value="">Select Category</option>
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
              <label className="text-sm font-medium text-foreground">Location</label>
              <select required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                <option value="">Select Location</option>
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
              <label className="text-sm font-medium text-foreground">Image</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea required rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div className="sm:col-span-2">
              <button disabled={createMutation.isPending} type="submit" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50">Save Item</button>
            </div>
          </motion.form>
        )}

        {isLoading ? (
          <p className="mt-6 text-muted-foreground">Loading items...</p>
        ) : (
          <div className="mt-6 bg-card rounded-xl border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Item</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Location</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="p-3 text-foreground font-medium">{item.name}</td>
                    <td className="p-3 text-muted-foreground">{item.category}</td>
                    <td className="p-3 text-muted-foreground">{item.location}</td>
                    <td className="p-3 text-muted-foreground">{item.date}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[item.status]}`}>{item.status}</span></td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No items found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ManageItems;
