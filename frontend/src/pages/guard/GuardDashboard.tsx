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
      <div className="page-container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Guard Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome, {user?.name || 'Guard'}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total Items', value: data.itemsCount, icon: Package, color: 'text-primary', link: '/guard/items' },
            { label: 'Pending Claims', value: pendingClaims.length, icon: AlertCircle, color: 'text-warning', link: '/guard/claims' },
            { label: 'Verified', value: verifiedClaims.length, icon: ClipboardCheck, color: 'text-success', link: '/guard/claims' },
            { label: 'Add Item', value: '+', icon: PlusCircle, color: 'text-info', link: '/guard/items' },
          ].map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={card.link} className="block bg-card rounded-xl border border-border p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <card.icon className={`w-8 h-8 ${card.color} mb-3`} />
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.label}</p>
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
