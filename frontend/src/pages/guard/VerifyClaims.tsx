import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

const fetchAllClaims = async () => {
  const { data } = await api.get('/claims');
  if (data.success && data.claims) {
    return data.claims.map((c: any) => ({
      ...c,
      id: c._id,
      itemName: c.item?.title || 'Unknown Item',
      studentName: c.student?.name || 'Unknown',
      studentPrn: c.student?.prn || 'Unknown',
      date: new Date(c.createdAt).toLocaleDateString(),
    }));
  }
  return [];
};

const VerifyClaims = () => {
  const queryClient = useQueryClient();
  const [scheduleModal, setScheduleModal] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState({ date: '', time: '', location: '' });
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: claims = [], isLoading } = useQuery({
    queryKey: ['allClaims'],
    queryFn: fetchAllClaims,
  });

  const updateClaimMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: any }) => {
      const { data } = await api.put(`/claims/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allClaims'] });
      setScheduleModal(null);
      setRejectModal(null);
      setScheduleData({ date: '', time: '', location: '' });
      setRejectionReason('');
      toast.success('Claim status updated successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update claim');
    }
  });

  const handleApprove = (id: string) => {
    updateClaimMutation.mutate({
      id,
      payload: {
        status: 'approved',
        verificationDate: scheduleData.date,
        verificationTime: scheduleData.time,
        verificationLocation: scheduleData.location || 'Security Office'
      }
    });
  };

  const handleReject = (id: string) => {
    updateClaimMutation.mutate({
      id,
      payload: {
        status: 'rejected',
        rejectionReason
      }
    });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="page-container py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-primary/10 text-primary mb-4 tracking-wide border border-primary/20">AUTHORIZATION</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">Verify <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 text-glow">Claims</span></h1>
          <p className="text-lg text-muted-foreground mt-2">Cross-reference ownership proofs and schedule collections securely.</p>
        </motion.div>

        <div className="space-y-6 max-w-5xl mx-auto">
          {isLoading ? (
            <div className="py-12"><div className="text-muted-foreground font-medium flex items-center justify-center gap-2"><div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div> Loading secure logs...</div></div>
          ) : claims.length === 0 ? (
            <div className="bento-box p-12 text-center text-muted-foreground max-w-2xl mx-auto">
              <CheckCircle className="w-12 h-12 opacity-20 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-1">Queue is Empty</h3>
              <p>No active claim requests require authorization.</p>
            </div>
          ) : (
            claims.map((c: any, i: number) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }} className="bento-box p-6 md:p-8 hover:-translate-y-1 transition-all group relative overflow-hidden border-t-4 border-t-transparent hover:border-t-primary">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 rounded-full bg-secondary/80 border border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">Log #{c.id.slice(-6)}</span>
                      <span className="text-xs font-bold text-muted-foreground flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {c.date}</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">{c.itemName}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-background/40 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Claimant Identity</p>
                        <p className="font-semibold text-foreground">{c.studentName}</p>
                        <p className="text-sm font-medium text-muted-foreground">{c.studentPrn}</p>
                      </div>
                      <div className="bg-background/40 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Provided Justification</p>
                        <p className="text-sm font-medium text-foreground leading-relaxed">{c.reason}</p>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-start lg:items-end justify-center min-w-[200px] border-t lg:border-t-0 lg:border-l border-border/50 pt-6 lg:pt-0 lg:pl-8">
                    {c.status === 'pending' ? (
                      <div className="w-full space-y-3">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 lg:text-right hidden lg:block">Authorization Required</p>
                        <button onClick={() => setScheduleModal(c.id)} className="w-full flex items-center justify-center gap-2 bg-success text-success-foreground px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-success/90 transition-all shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:shadow-success/30 hover:-translate-y-0.5">
                          <CheckCircle className="w-4 h-4" /> Approve Claim
                        </button>
                        <button onClick={() => setRejectModal(c.id)} className="w-full flex items-center justify-center gap-2 bg-destructive/10 text-destructive px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-all hover:shadow-destructive/30 hover:-translate-y-0.5">
                          <XCircle className="w-4 h-4" /> Deny Claim
                        </button>
                      </div>
                    ) : (
                      <div className="w-full flex flex-col lg:items-end">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Final Status</p>
                        <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border backdrop-blur-md shadow-sm ${c.status === 'approved' ? 'bg-success/20 text-success border-success/30 shadow-success/10' : 'bg-destructive/20 text-destructive border-destructive/30 shadow-destructive/10'}`}>
                          {c.status === 'approved' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          {c.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Schedule Modal for Approval */}
        {scheduleModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-card rounded-3xl border border-border p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-success to-success/50" />
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-2xl font-extrabold text-foreground tracking-tight">Schedule Pickup</h3>
              <p className="text-muted-foreground mt-2 font-medium">Coordinate a secure handoff time with the student.</p>

              <div className="mt-8 space-y-5">
                <div>
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 block">Available Date</label>
                  <input type="date" value={scheduleData.date} onChange={e => setScheduleData({ ...scheduleData, date: e.target.value })} className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-success/20 focus:border-success focus:bg-background outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 block">Allocated Time</label>
                  <input type="time" value={scheduleData.time} onChange={e => setScheduleData({ ...scheduleData, time: e.target.value })} className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-success/20 focus:border-success focus:bg-background outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 block">Handoff Location</label>
                  <input type="text" placeholder="e.g. Main Security Desk" value={scheduleData.location} onChange={e => setScheduleData({ ...scheduleData, location: e.target.value })} className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-success/20 focus:border-success focus:bg-background outline-none transition-all shadow-sm" />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button disabled={updateClaimMutation.isPending} onClick={() => handleApprove(scheduleModal)} className="flex-1 bg-success text-success-foreground py-4 rounded-xl text-sm font-bold tracking-wide hover:bg-success/90 transition-all disabled:opacity-50 shadow-lg hover:shadow-success/20 hover:-translate-y-0.5">Authorize & Notify</button>
                <button onClick={() => setScheduleModal(null)} className="flex-1 bg-secondary text-foreground py-4 rounded-xl text-sm font-bold tracking-wide hover:bg-secondary/80 transition-all border border-border">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Reject Modal */}
        {rejectModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-card rounded-3xl border border-border p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-destructive to-destructive/50" />
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-2xl font-extrabold text-foreground tracking-tight">Deny Claim Request</h3>
              <p className="text-muted-foreground mt-2 font-medium">Record the discrepancy preventing authorization.</p>

              <div className="mt-8">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 block">Reason for Denial</label>
                <textarea rows={4} value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-destructive/20 focus:border-destructive focus:bg-background outline-none transition-all shadow-sm resize-none" placeholder="State clear reasons (e.g., incorrect serial number)..." />
              </div>

              <div className="flex gap-3 mt-8">
                <button disabled={updateClaimMutation.isPending} onClick={() => handleReject(rejectModal)} className="flex-1 bg-destructive text-destructive-foreground py-4 rounded-xl text-sm font-bold tracking-wide hover:bg-destructive/90 transition-all disabled:opacity-50 shadow-lg hover:shadow-destructive/20 hover:-translate-y-0.5">Deny & Notify</button>
                <button onClick={() => setRejectModal(null)} className="flex-1 bg-secondary text-foreground py-4 rounded-xl text-sm font-bold tracking-wide hover:bg-secondary/80 transition-all border border-border">Cancel</button>
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
