import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockItems } from '@/data/mockData';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const statusStyles: Record<string, string> = {
  available: 'bg-success/10 text-success',
  claimed: 'bg-warning/10 text-warning',
  delivered: 'bg-info/10 text-info',
};

const ManageItems = () => {
  const [items, setItems] = useState(mockItems);
  const [showAdd, setShowAdd] = useState(false);

  const deleteItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

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
            onSubmit={e => { e.preventDefault(); setShowAdd(false); }}>
            <div>
              <label className="text-sm font-medium text-foreground">Item Name</label>
              <input required className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Category</label>
              <select required className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                <option value="">Select</option>
                <option>Electronics</option><option>Documents</option><option>Accessories</option><option>Books</option><option>Clothing</option><option>Keys</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Location</label>
              <input required className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Image URL</label>
              <input className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea required rows={2} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">Save Item</button>
            </div>
          </motion.form>
        )}

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
              {items.map(item => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="p-3 text-foreground font-medium">{item.name}</td>
                  <td className="p-3 text-muted-foreground">{item.category}</td>
                  <td className="p-3 text-muted-foreground">{item.location}</td>
                  <td className="p-3 text-muted-foreground">{item.date}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[item.status]}`}>{item.status}</span></td>
                  <td className="p-3 flex gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-primary"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManageItems;
