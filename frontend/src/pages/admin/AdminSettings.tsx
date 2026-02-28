import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Save } from 'lucide-react';

const AdminSettings = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="page-container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground mt-1">Configure system preferences</p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onSubmit={handleSave} className="mt-6 max-w-xl bg-card rounded-xl border border-border p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground">System Name</label>
            <input defaultValue="SGGS Lost & Found" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Admin Email</label>
            <input defaultValue="admin@sggs.ac.in" type="email" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Claim Expiry (days)</label>
            <input defaultValue="7" type="number" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" defaultChecked id="emailNotif" className="rounded border-input" />
            <label htmlFor="emailNotif" className="text-sm text-foreground">Enable email notifications</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" defaultChecked id="autoDelete" className="rounded border-input" />
            <label htmlFor="autoDelete" className="text-sm text-foreground">Auto-delete unclaimed items after 30 days</label>
          </div>

          <button type="submit" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
            <Save className="w-4 h-4" /> Save Settings
          </button>

          {saved && <p className="text-sm text-success">Settings saved successfully!</p>}
        </motion.form>
      </div>
      <Footer />
    </div>
  );
};

export default AdminSettings;
