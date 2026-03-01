import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Package, ClipboardCheck, PlusCircle, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Claim, LostItem } from '@/types';

const fetchGuardData = async () => {
  const [itemsRes, claimsRes] = await Promise.all([
    api.get('/items'),
    api.get('/claims')
  ]);

  return {
    itemsCount: itemsRes.data.total || 0,
    claims: claimsRes.data.claims ? claimsRes.data.claims.map((c: any) => ({
      ...c,
      id: c._id,
      studentName: c.student?.name || 'Unknown',
      studentPrn: c.student?.prn || 'Unknown',
      itemName: c.item?.title || 'Unknown',
      date: new Date(c.createdAt).toLocaleDateString(),
    })) : []
  };
};

const GuardDashboard = () => {
  const { user } = useAuth();

  const { data = { itemsCount: 0, claims: [] }, isLoading } = useQuery({
    queryKey: ['guardDashboardData'],
    queryFn: fetchGuardData,
  });

  const pendingClaims = data.claims.filter((c: any) => c.status === 'pending');
  const verifiedClaims = data.claims.filter((c: any) => c.status === 'approved');

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="page-container py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20 text-warning text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse" /> Security Clearance Active
          </div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Guard <span className="text-transparent bg-clip-text bg-gradient-to-r from-warning to-warning/50 text-glow">Dashboard</span></h1>
          <p className="text-lg text-muted-foreground mt-2">Welcome back, {user?.name || 'Officer'}. Monitor and secure campus property.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {[
            { label: 'Total Vault Items', value: data.itemsCount, icon: Package, color: 'text-primary' },
            { label: 'Action Required', value: pendingClaims.length, icon: AlertCircle, color: 'text-warning' },
            { label: 'Securely Verified', value: verifiedClaims.length, icon: ClipboardCheck, color: 'text-success' },
            { label: 'Log New Item', value: '+', icon: PlusCircle, color: 'text-info' },
          ].map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}>
              <Link to="/guard/items" className="bento-box p-6 flex flex-col items-start group relative overflow-hidden block border-l-4" style={{ borderLeftColor: `hsl(var(--${card.color.replace('text-', '')}))` }}>
                <div className={`absolute inset-0 bg-gradient-to-br from-${card.color.replace('text-', '')}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`w-12 h-12 rounded-xl bg-${card.color.replace('text-', '')}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`w-6 h-6 ${card.color} drop-shadow-md`} />
                </div>
                <p className="text-4xl font-extrabold text-foreground tracking-tight">{card.value}</p>
                <p className="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-wider">{card.label}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-10 mb-4">Pending Claims</h2>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading claims...</p>
        ) : pendingClaims.length === 0 ? (
          <p className="text-muted-foreground text-sm">No pending claims.</p>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Student</th>
                <th className="text-left p-3 font-medium text-muted-foreground">PRN</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Item</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Action</th>
              </tr></thead>
              <tbody>
                {pendingClaims.map((c: any) => (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="p-3 text-foreground font-medium">{c.studentName}</td>
                    <td className="p-3 text-muted-foreground">{c.studentPrn}</td>
                    <td className="p-3 text-foreground">{c.itemName}</td>
                    <td className="p-3 text-muted-foreground">{c.date}</td>
                    <td className="p-3">
                      <Link to="/guard/claims" className="text-primary hover:text-primary-hover text-sm font-medium">Review</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default GuardDashboard;
