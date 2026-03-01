import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Shield, Clock, Mail, CheckCircle, Users, TrendingUp, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ItemCard from '@/components/shared/ItemCard';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { LostItem } from '@/types';
import Lottie from 'lottie-react';
import mapAnimation from '@/assets/map.json';

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
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-secondary/80 rounded-full blur-[100px] opacity-50 pointer-events-none" />

        <div className="page-container py-20 lg:py-28 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl pt-12 lg:pt-24"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-primary/10 text-primary mb-6 border border-primary/20 backdrop-blur-md"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                SGGS Institute — Official Premium Portal
              </motion.span>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-6">
                Lost <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/50 text-glow">Something?</span><br />
                We've got you.
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mb-8 leading-relaxed">
                Connect with the central SGGS campus security network. Instantly browse found items or securely report your lost belongings.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/lost-items" className="group relative inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary-hover transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(var(--primary),0.3)] hover:-translate-y-1 active:translate-y-0 text-lg overflow-hidden">
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center gap-2">
                    Browse Items
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link to="/about" className="inline-flex items-center gap-2 bg-secondary/50 backdrop-blur-md border border-border text-foreground px-8 py-4 rounded-xl font-semibold hover:bg-secondary transition-all hover:-translate-y-1 active:translate-y-0 text-lg glow-border">
                  Learn More
                </Link>
              </div>
            </motion.div>

            {/* Right Image/Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full flex items-center justify-center lg:justify-end translate-y-8 lg:translate-y-16 -mr-24 lg:-mr-48">
                {Object.keys(mapAnimation).length > 0 ? (
                  <Lottie
                    animationData={mapAnimation}
                    loop={true}
                    className="w-[100%] lg:w-[115%] h-auto drop-shadow-2xl transition-transform duration-700 ease-out hover:scale-105 mix-blend-multiply dark:mix-blend-lighten"
                  />
                ) : (
                  <div className="text-center p-8 bg-card rounded-[2rem] border border-border">
                    <p className="text-muted-foreground font-medium mb-2">Waiting for animation data...</p>
                    <p className="text-sm text-muted-foreground/80">Please paste full JSON into `map.json`.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats - Bento Box UI */}
      <section className="relative z-20 pt-16 pb-20">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                className="bento-box p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <p className="text-4xl font-extrabold text-foreground tracking-tight">{s.value}</p>
                <p className="text-sm font-medium text-muted-foreground mt-2">{s.label}</p>
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
