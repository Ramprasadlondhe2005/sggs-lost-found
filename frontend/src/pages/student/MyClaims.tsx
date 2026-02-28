import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockClaims } from '@/data/mockData';
import { motion } from 'framer-motion';

const statusStyles: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  approved: 'bg-success/10 text-success',
  rejected: 'bg-destructive/10 text-destructive',
  verified: 'bg-info/10 text-info',
};

const MyClaims = () => (
  <div className="min-h-screen bg-secondary/30">
    <Navbar />
    <div className="page-container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">My Claims</h1>
        <p className="text-muted-foreground mt-1">Track all your claim requests</p>
      </motion.div>

      <div className="mt-6 space-y-4">
        {mockClaims.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{c.itemName}</h3>
                <p className="text-sm text-muted-foreground mt-1">{c.reason}</p>
                <p className="text-xs text-muted-foreground mt-2">Claimed on {c.date}</p>
                {c.verificationDate && <p className="text-xs text-success mt-1">Verification: {c.verificationDate}</p>}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[c.status]}`}>{c.status}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

export default MyClaims;
