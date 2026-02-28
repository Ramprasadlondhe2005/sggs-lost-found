import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockClaims } from '@/data/mockData';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';

const VerifyClaims = () => {
  const [claims, setClaims] = useState(mockClaims);
  const [scheduleModal, setScheduleModal] = useState<string | null>(null);

  const updateStatus = (id: string, status: 'approved' | 'rejected') => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="page-container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Verify Claims</h1>
          <p className="text-muted-foreground mt-1">Review and verify student claims</p>
        </motion.div>

        <div className="mt-6 space-y-4">
          {claims.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl border border-border p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{c.itemName}</h3>
                  <p className="text-sm text-muted-foreground mt-1"><strong>Student:</strong> {c.studentName} ({c.studentPrn})</p>
                  <p className="text-sm text-muted-foreground mt-1"><strong>Reason:</strong> {c.reason}</p>
                  <p className="text-xs text-muted-foreground mt-2">Claimed on {c.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  {c.status === 'pending' ? (
                    <>
                      <button onClick={() => updateStatus(c.id, 'approved')} className="inline-flex items-center gap-1 bg-success/10 text-success px-3 py-2 rounded-lg text-sm font-medium hover:bg-success/20 transition-colors">
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button onClick={() => updateStatus(c.id, 'rejected')} className="inline-flex items-center gap-1 bg-destructive/10 text-destructive px-3 py-2 rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button onClick={() => setScheduleModal(c.id)} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                        <Calendar className="w-4 h-4" /> Schedule
                      </button>
                    </>
                  ) : (
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${c.status === 'approved' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{c.status}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Schedule Modal */}
        {scheduleModal && (
          <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl border border-border p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-foreground">Schedule Verification</h3>
              <p className="text-sm text-muted-foreground mt-1">Set a date and time for in-person verification</p>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Date</label>
                  <input type="date" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Time</label>
                  <input type="time" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Notes</label>
                  <textarea rows={2} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setScheduleModal(null)} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">Confirm</button>
                <button onClick={() => setScheduleModal(null)} className="flex-1 border border-border py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default VerifyClaims;
