import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Package, ClipboardList, PlusCircle, Search } from 'lucide-react';
import ItemCard from '@/components/shared/ItemCard';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Claim, LostItem } from '@/types';

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

const fetchRecentItems = async (): Promise<{ items: LostItem[], total: number }> => {
  // Let's just get the recent items and total available from items API
  const { data } = await api.get('/items?limit=4&status=available');
  if (data.success) {
    return {
      total: data.total,
      items: data.items.map((item: any) => ({
        ...item,
        id: item._id,
        name: item.title,
        date: new Date(item.foundDate || item.createdAt).toLocaleDateString(),
      }))
    };
  }
  return { items: [], total: 0 };
};

const StudentDashboard = () => {
  const { user } = useAuth();

  const { data: studentClaims = [], isLoading: loadingClaims } = useQuery({
    queryKey: ['myClaims'],
    queryFn: fetchMyClaims,
  });

  const { data: itemsData = { items: [], total: 0 }, isLoading: loadingItems } = useQuery({
    queryKey: ['recentItemsQuery'],
    queryFn: fetchRecentItems,
  });

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="page-container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Welcome, {user?.name || 'Student'}</h1>
          <p className="text-muted-foreground mt-1">Manage your claims and report found items</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Browse Items', value: '--', icon: Search, color: 'text-primary', link: '/lost-items' },
            { label: 'My Claims', value: studentClaims.length, icon: ClipboardList, color: 'text-warning', link: '/student/claims' },
            { label: 'Available Items', value: itemsData.total, icon: Package, color: 'text-success', link: '/lost-items' },
            { label: 'Report Found', value: '+', icon: PlusCircle, color: 'text-info', link: '/student/report' },
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

        <h2 className="text-lg font-semibold text-foreground mt-10 mb-4">Recent Claims</h2>
        {loadingClaims ? (
          <p className="text-muted-foreground text-sm">Loading claims...</p>
        ) : studentClaims.length === 0 ? (
          <p className="text-muted-foreground text-sm">No claims yet. Browse items to make a claim.</p>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-secondary/50"><th className="text-left p-3 font-medium text-muted-foreground">Item</th><th className="text-left p-3 font-medium text-muted-foreground">Date</th><th className="text-left p-3 font-medium text-muted-foreground">Status</th></tr></thead>
              <tbody>
                {studentClaims.map(c => (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="p-3 text-foreground font-medium">{c.itemName}</td>
                    <td className="p-3 text-muted-foreground">{c.date}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${c.status === 'approved' ? 'bg-success/10 text-success' : c.status === 'rejected' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h2 className="text-lg font-semibold text-foreground mt-10 mb-4">Recently Found</h2>
        {loadingItems ? (
          <p className="text-muted-foreground text-sm">Loading items...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {itemsData.items.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
