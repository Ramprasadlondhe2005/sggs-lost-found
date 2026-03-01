import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

const categories = [
  'Electronics',
  'Documents',
  'Accessories',
  'Books',
  'Clothing',
  'Keys',
  'ID Cards',
  'Water Bottle',
  'Other'
];

const locations = [
  'Main Building',
  'Library',
  'Canteen',
  'Sports Complex',
  'Hostel',
  'Classroom',
  'Laboratory',
  'Auditorium',
  'Parking',
  'Other'
];

const ReportFound = () => {
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState('');
  const [formData, setFormData] = useState({ title: '', category: '', location: '', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const reportMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Axios auto-sets the correct Content-Type with boundary when passing FormData
      const res = await api.post('/items', data);
      return res.data;
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to report item');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('location', formData.location);
    data.append('description', formData.description);
    if (imageFile) {
      data.append('image', imageFile);
    }
    reportMutation.mutate(data);
  };

  if (submitted) return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="page-container py-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Item Reported!</h2>
          <p className="text-muted-foreground mt-2">Thank you for reporting a found item. Security will review it shortly.</p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="page-container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Report Found Item</h1>
          <p className="text-muted-foreground mt-1">Found something? Help us return it to the owner.</p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onSubmit={handleSubmit} className="mt-6 max-w-xl bg-card rounded-xl border border-border p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Item Name</label>
            <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Category</label>
            <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
              <option value="">Select Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Location Found</label>
            <select required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
              <option value="">Select Location</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Upload Image</label>
            <label className="mt-1 flex items-center justify-center gap-2 border-2 border-dashed border-input rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{fileName || 'Click to upload image'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setFileName(e.target.files[0].name);
                  setImageFile(e.target.files[0]);
                }
              }} />
            </label>
          </div>
          <button type="submit" disabled={reportMutation.isPending} className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50">
            {reportMutation.isPending ? 'Submitting...' : 'Submit Report'}
          </button>
        </motion.form>
      </div>
      <Footer />
    </div>
  );
};

export default ReportFound;
