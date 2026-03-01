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
      <div className="page-container py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-warning/10 text-warning mb-4 tracking-wide border border-warning/20">GLOBAL PARAMETERS</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">System <span className="text-transparent bg-clip-text bg-gradient-to-r from-warning to-warning/50 text-glow">Settings</span></h1>
          <p className="text-lg text-muted-foreground mt-2">Configure core operational behaviors and automated background tasks.</p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onSubmit={handleSave} className="mt-8 max-w-3xl space-y-8">

          <div className="bento-box p-8 md:p-10 border-t-4 border-t-warning">
            <h3 className="text-xl font-extrabold text-foreground mb-6 uppercase tracking-wider">General Configuration</h3>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 block">System Designation</label>
                <input defaultValue="SGGS Lost & Found" className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-warning/20 focus:border-warning focus:bg-background outline-none transition-all shadow-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 block">Root Administrator Email</label>
                <input defaultValue="admin@sggs.ac.in" type="email" className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-warning/20 focus:border-warning focus:bg-background outline-none transition-all shadow-sm" />
              </div>
            </div>
          </div>

          <div className="bento-box p-8 md:p-10 border-l-4 border-l-info">
            <h3 className="text-xl font-extrabold text-foreground mb-6 uppercase tracking-wider">Communication & Alerts</h3>
            <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-border">
              <div className="flex h-6 items-center">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-input text-info focus:ring-info/20" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground group-hover:text-info transition-colors">Broadcast Email Notifications</span>
                <span className="text-xs text-muted-foreground mt-1">Send immediate alerts to claims handlers upon new requests.</span>
              </div>
            </label>
          </div>

          <div className="bento-box p-8 md:p-10 border-l-4 border-l-destructive">
            <h3 className="text-xl font-extrabold text-foreground mb-6 uppercase tracking-wider">Data Lifecycle</h3>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 block">Unclaimed Asset Expiry (Days)</label>
                <input defaultValue="7" type="number" className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-destructive/20 focus:border-destructive focus:bg-background outline-none transition-all shadow-sm" />
              </div>
              <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-border">
                <div className="flex h-6 items-center">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-input text-destructive focus:ring-destructive/20" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground group-hover:text-destructive transition-colors">Invoke Automated Garbage Collection</span>
                  <span className="text-xs text-muted-foreground mt-1">Permanently erase vault items that have exceeded their retention period.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <button type="submit" className="bg-warning text-warning-foreground px-10 py-4 rounded-xl text-sm font-bold tracking-wide hover:bg-warning/90 hover:-translate-y-1 transition-all shadow-lg hover:shadow-warning/30 glow-border flex items-center gap-2">
              <Save className="w-5 h-5" /> Commit Parameters
            </button>
            {saved && (
              <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-sm font-bold text-success flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" /> Configuration fully synchronized.
              </motion.p>
            )}
          </div>

        </motion.form>
      </div>
      <Footer />
    </div>
  );
};

export default AdminSettings;
