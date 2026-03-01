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
      <div className="page-container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Verify Claims</h1>
          <p className="text-muted-foreground mt-1">Review and verify student claims</p>
        </motion.div>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading claims...</p>
          ) : claims.length === 0 ? (
            <p className="text-muted-foreground text-sm">No claims found.</p>
          ) : (
            claims.map((c: any, i: number) => (
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
                        <button onClick={() => setScheduleModal(c.id)} className="inline-flex items-center gap-1 bg-success/10 text-success px-3 py-2 rounded-lg text-sm font-medium hover:bg-success/20 transition-colors">
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => setRejectModal(c.id)} className="inline-flex items-center gap-1 bg-destructive/10 text-destructive px-3 py-2 rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors">
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${c.status === 'approved' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{c.status}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Schedule Modal for Approval */}
        {scheduleModal && (
          <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl border border-border p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-foreground">Schedule Verification</h3>
              <p className="text-sm text-muted-foreground mt-1">Set a date and time for in-person verification</p>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Date</label>
                  <input type="date" value={scheduleData.date} onChange={e => setScheduleData({ ...scheduleData, date: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Time</label>
                  <input type="time" value={scheduleData.time} onChange={e => setScheduleData({ ...scheduleData, time: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <input type="text" placeholder="e.g. Security Office Main Gate" value={scheduleData.location} onChange={e => setScheduleData({ ...scheduleData, location: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button disabled={updateClaimMutation.isPending} onClick={() => handleApprove(scheduleModal)} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50">Confirm</button>
                <button onClick={() => setScheduleModal(null)} className="flex-1 border border-border py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Reject Modal */}
        {rejectModal && (
          <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl border border-border p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-foreground">Reject Claim</h3>
              <p className="text-sm text-muted-foreground mt-1">Provide a reason for rejection</p>
              <div className="mt-4">
                <label className="text-sm font-medium text-foreground">Reason</label>
                <textarea rows={3} value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Does not match description..." />
              </div>
              <div className="flex gap-2 mt-6">
                <button disabled={updateClaimMutation.isPending} onClick={() => handleReject(rejectModal)} className="flex-1 bg-destructive text-destructive-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50">Reject</button>
                <button onClick={() => setRejectModal(null)} className="flex-1 border border-border py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
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
