import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Shield, Clock, Mail, CheckCircle, Users, TrendingUp, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ItemCard from '@/components/shared/ItemCard';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { LostItem } from '@/types';

const fetchRecentItems = async (): Promise<LostItem[]> => {
  const { data } = await api.get('/items/recent?limit=4');
  if (data.success && data.items) {
    return data.items.map((item: any) => ({
      ...item,
      id: item._id,
      name: item.title,
      date: new Date(item.foundDate || item.createdAt).toLocaleDateString(),
    }));
  }
  return [];
};

const stats = [
  { label: 'Items Found', value: '500+', icon: Search },
  { label: 'Returned', value: '435+', icon: CheckCircle },
  { label: 'Active Students', value: '1250+', icon: Users },
  { label: 'Success Rate', value: '87%', icon: TrendingUp },
];

const trustItems = [
  { icon: Shield, title: 'Verified by SGGS', desc: 'Official college-approved system' },
  { icon: Clock, title: '24/7 Security', desc: 'Round-the-clock item safekeeping' },
  { icon: Mail, title: 'Email Notifications', desc: 'Instant alerts on item matches' },
];

const Index = () => {
  const { data: recentItems = [], isLoading } = useQuery({
    queryKey: ['recentItems'],
    queryFn: fetchRecentItems,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="page-container py-20 lg:py-28 relative">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
                SGGS Institute — Official Portal
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Lost Something?
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-lg">
                Don't worry! Our Lost & Found portal helps you recover your belongings. Browse found items or report what you've lost.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link to="/lost-items" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-md hover:shadow-lg">
                  Browse Lost Items <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/about" className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary transition-colors">
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-secondary/30">
        <div className="page-container py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <s.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Items */}
      <section className="section-padding">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Recently Found Items</h2>
              <p className="text-muted-foreground mt-1">Browse the latest items turned in to security</p>
            </div>
            <Link to="/lost-items" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <p className="text-muted-foreground col-span-full">Loading recent items...</p>
            ) : recentItems.length > 0 ? (
              recentItems.map((item, i) => (
                <ItemCard key={item.id} item={item} index={i} />
              ))
            ) : (
              <p className="text-muted-foreground col-span-full">No recent items found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="section-padding bg-secondary/30">
        <div className="page-container">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Why Trust Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustItems.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card rounded-xl border border-border p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <t.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{t.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
