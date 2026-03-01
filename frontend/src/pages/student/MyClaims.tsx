import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Claim } from '@/types';

const statusStyles: Record<string, string> = {
  pending: 'bg-warning/20 text-warning border-warning/30 shadow-warning/20',
  approved: 'bg-success/20 text-success border-success/30 shadow-success/20',
  rejected: 'bg-destructive/20 text-destructive border-destructive/30 shadow-destructive/20',
  verified: 'bg-info/20 text-info border-info/30 shadow-info/20',
};

const fetchMyClaims = async (): Promise<Claim[]> => {
  const { data } = await api.get('/claims/my');
  if (data.success && data.claims) {
    return data.claims.map((c: any) => ({
      ...c,
      id: c._id,
      itemName: c.item?.title || 'Unknown Item',
      date: new Date(c.createdAt).toLocaleDateString(),
    }));
  }
  return [];
};

const MyClaims = () => {
  const { data: claims = [], isLoading } = useQuery({
    queryKey: ['myClaims'],
    queryFn: fetchMyClaims,
  });

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="page-container py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-primary/10 text-primary mb-4 tracking-wide border border-primary/20">HISTORY</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 text-glow">Claims</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-2">Track and manage all your active and previous item claim requests securely.</p>
        </motion.div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {isLoading ? (
            <div className="py-8 text-center"><div className="text-muted-foreground font-medium flex items-center justify-center gap-2"><div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div> Loading secure records...</div></div>
          ) : claims.length === 0 ? (
            <div className="bento-box p-12 text-center text-muted-foreground max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-secondary mx-auto flex items-center justify-center mb-4">
                <span className="text-2xl opacity-50">📂</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">No Claims Found</h3>
              <p>You haven't initiated any claims yet. Browse the gallery to report missing items.</p>
            </div>
          ) : (
            claims.map((c: any, i: number) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }} className="bento-box p-6 sm:p-8 hover:-translate-y-1 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{c.itemName}</h3>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed mt-2 p-3 bg-secondary/30 rounded-lg border border-border/50">{c.reason}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground mt-4 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span> Registered: {c.date}</span>
                      {c.verificationDate && <span className="flex items-center gap-1.5 text-success"><span className="w-1.5 h-1.5 rounded-full bg-success"></span> Verified: {c.verificationDate}</span>}
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center justify-center self-start sm:self-center">
                    <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border backdrop-blur-md shadow-sm ${statusStyles[c.status] || 'bg-secondary text-foreground'}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyClaims;
