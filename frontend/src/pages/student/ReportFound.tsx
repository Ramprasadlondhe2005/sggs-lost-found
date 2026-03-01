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
      <div className="page-container py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-primary/10 text-primary mb-4 tracking-wide border border-primary/20">CONTRIBUTE</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Report <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 text-glow">Found Item</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-2">Help the community by securely logging found belongings.</p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onSubmit={handleSubmit} className="mx-auto max-w-2xl bento-box p-8 sm:p-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">Item Name</label>
              <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background outline-none transition-all shadow-sm" placeholder="e.g. Black Leather Wallet" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">Category</label>
              <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background outline-none transition-all shadow-sm">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">Location Found</label>
              <select required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background outline-none transition-all shadow-sm">
                <option value="">Select Location</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background outline-none transition-all shadow-sm resize-none" placeholder="Add specific details like unique markings..." />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">Upload Image</label>
              <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-input rounded-2xl p-10 cursor-pointer bg-background/20 hover:bg-background/50 hover:border-primary/50 transition-all group">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
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
          </div>
        </motion.form>
      </div>
      <Footer />
    </div>
  );
};

export default ReportFound;
