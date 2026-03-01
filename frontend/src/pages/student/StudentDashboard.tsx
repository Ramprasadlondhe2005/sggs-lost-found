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
      <div className="page-container py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 text-glow">{user?.name || 'Student'}</span></h1>
          <p className="text-lg text-muted-foreground mt-2">Manage your tracking claims and secure your found items.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {[
            { label: 'Browse Gallery', value: '--', icon: Search, color: 'text-primary', href: '/lost-items' },
            { label: 'My Claims', value: studentClaims.length, icon: ClipboardList, color: 'text-warning', href: '/student/claims' },
            { label: 'Available Items', value: itemsData.total, icon: Package, color: 'text-success', href: '/lost-items' },
            { label: 'Report Found', value: '+', icon: PlusCircle, color: 'text-info', href: '/student/report' },
          ].map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}>
              <Link to={card.href} className="bento-box p-6 flex flex-col items-start group relative overflow-hidden block">
                <div className={`absolute inset-0 bg-gradient-to-br from-${card.color.replace('text-', '')}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`w-12 h-12 rounded-xl bg-${card.color.replace('text-', '')}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <p className="text-4xl font-extrabold text-foreground tracking-tight">{card.value}</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">{card.label}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-2xl font-bold text-foreground mt-16 mb-6">Recent Claims Activity</motion.h2>
        {loadingClaims ? (
          <div className="py-8"><p className="text-muted-foreground text-sm">Loading security logs...</p></div>
        ) : studentClaims.length === 0 ? (
          <div className="bento-box p-8 text-center text-muted-foreground">
            <ClipboardList className="w-10 h-10 opacity-20 mx-auto mb-3" />
            <p>No claims initiated. Browse the gallery to report your items.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card/40 backdrop-blur-xl rounded-2xl border border-border overflow-hidden shadow-lg">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/10 bg-secondary/30 text-xs uppercase tracking-wider"><th className="text-left p-4 font-bold text-muted-foreground">Item Signature</th><th className="text-left p-4 font-bold text-muted-foreground">Registered Date</th><th className="text-left p-4 font-bold text-muted-foreground">Validation Status</th></tr></thead>
              <motion.tbody
                initial="hidden"
                animate="show"
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
              >
                {studentClaims.map(c => (
                  <motion.tr variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }} key={c.id} className="border-b border-border/50 last:border-0 hover:bg-white/5 transition-colors group">
                    <td className="p-4 text-foreground font-semibold group-hover:text-primary transition-colors">{c.itemName}</td>
                    <td className="p-4 text-muted-foreground font-medium">{c.date}</td>
                    <td className="p-4"><span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${c.status === 'approved' ? 'bg-success/20 text-success border-success/30' : c.status === 'rejected' ? 'bg-destructive/20 text-destructive border-destructive/30' : 'bg-warning/20 text-warning border-warning/30'}`}>{c.status}</span></td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </motion.div>
        )}

        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-2xl font-bold text-foreground mt-16 mb-6">Live Found Items Feed</motion.h2>
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
