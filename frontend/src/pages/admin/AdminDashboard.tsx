import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Package, Users, BarChart3, Settings, ClipboardList, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

const fetchAdminData = async () => {
  const [statsRes, monthlyRes, categoryRes] = await Promise.all([
    api.get('/analytics/stats'),
    api.get('/analytics/monthly'),
    api.get('/analytics/categories'),
  ]);

  return {
    stats: statsRes.data.stats || { users: {}, items: {}, claims: {} },
    monthlyData: monthlyRes.data.items || [],
    categoryData: categoryRes.data.categories ? categoryRes.data.categories.map((c: any) => ({
      name: c._id,
      value: c.count
    })) : []
  };
};

const COLORS = ['hsl(217, 91%, 53%)', 'hsl(142, 71%, 45%)', 'hsl(45, 93%, 47%)', 'hsl(0, 84%, 60%)', 'hsl(270, 50%, 50%)', 'hsl(180, 50%, 45%)'];

const AdminDashboard = () => {
  const { data = { stats: { users: {}, items: {}, claims: {} }, monthlyData: [], categoryData: [] }, isLoading } = useQuery({
    queryKey: ['adminDashboardData'],
    queryFn: fetchAdminData,
    staleTime: 5 * 60 * 1000,
  });

  const { stats, monthlyData, categoryData } = data;

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="page-container py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-primary/10 text-primary mb-4 tracking-wide border border-primary/20">COMMAND CENTER</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">System <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 text-glow">Overview</span></h1>
          <p className="text-lg text-muted-foreground mt-2">Monitor global activity, vault status, and personnel performance.</p>
        </motion.div>

        {isLoading ? (
          <p className="mt-6 text-muted-foreground">Loading dashboard data...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
              {[
                { label: 'Total Vault Items', value: stats.items.total || 0, icon: Package, color: 'text-primary' },
                { label: 'Registered Personnel', value: stats.users.total || 0, icon: Users, color: 'text-success' },
                { label: 'Active Disputes', value: stats.claims.total || 0, icon: ClipboardList, color: 'text-warning' },
                { label: 'System Efficiency', value: `${stats.claims.successRate || 0}%`, icon: ShieldCheck, color: 'text-info' },
              ].map((card, i) => (
                <motion.div key={card.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }} className="bento-box p-6 md:p-8 flex flex-col items-start group relative overflow-hidden block border-l-4" style={{ borderLeftColor: `hsl(var(--${card.color.replace('text-', '')}))` }}>
                  <div className={`absolute inset-0 bg-gradient-to-br from-${card.color.replace('text-', '')}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                  <div className={`w-14 h-14 rounded-2xl bg-${card.color.replace('text-', '')}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-${card.color.replace('text-', '')}/20`}>
                    <card.icon className={`w-7 h-7 ${card.color} drop-shadow-md`} />
                  </div>
                  <p className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight drop-shadow-sm">{card.value}</p>
                  <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest">{card.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bento-box p-6 md:p-8 col-span-1 lg:col-span-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
                <h3 className="text-xl font-extrabold text-foreground mb-6 uppercase tracking-wider flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_theme(colors.primary.DEFAULT)]" /> Ingestion Metrics (30 Days)</h3>
                <div className="h-80 select-none">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
                      <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)' }} dy={10} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                      <Tooltip cursor={{ fill: 'var(--primary)', opacity: 0.1 }} contentStyle={{ borderRadius: '16px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '12px 16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }} itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 6, 6]} barSize={40}>
                        {monthlyData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={`url(#colorCount${index})`} />
                        ))}
                      </Bar>
                      <defs>
                        {monthlyData.map((entry: any, index: number) => (
                          <linearGradient key={`colorCount${index}`} id={`colorCount${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                          </linearGradient>
                        ))}
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bento-box p-6 md:p-8 col-span-1 lg:col-span-2 flex flex-col items-center justify-center">
                <h3 className="text-xl font-extrabold text-foreground mb-6 self-start uppercase tracking-wider flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-info shadow-[0_0_10px_theme(colors.info.DEFAULT)]" /> Inventory Categorization</h3>
                <div className="h-80 w-full max-w-4xl select-none">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" stroke="none" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} >
                        {categoryData.map((item: any, i: number) => (
                          <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" style={{ filter: `drop-shadow(0px 0px 8px ${COLORS[i % COLORS.length]}40)` }} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '12px 16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} itemStyle={{ fontWeight: 'bold' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 mb-8">
          <Link to="/admin/users" className="bento-box p-6 md:p-8 hover:-translate-y-1 transition-all group flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-primary/20">
              <Users className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
            </div>
            <p className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors">Personnel Controls</p>
            <p className="text-sm font-medium text-muted-foreground mt-2">Manage student and guard access credentials</p>
          </Link>
          <Link to="/admin/analytics" className="bento-box p-6 md:p-8 hover:-translate-y-1 transition-all group flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-success/20">
              <BarChart3 className="w-8 h-8 text-success drop-shadow-[0_0_8px_rgba(var(--success),0.5)]" />
            </div>
            <p className="text-xl font-extrabold text-foreground group-hover:text-success transition-colors">Deep Analytics</p>
            <p className="text-sm font-medium text-muted-foreground mt-2">Generate comprehensive audit reports</p>
          </Link>
          <Link to="/admin/settings" className="bento-box p-6 md:p-8 hover:-translate-y-1 transition-all group flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-warning/20">
              <Settings className="w-8 h-8 text-warning drop-shadow-[0_0_8px_rgba(var(--warning),0.5)]" />
            </div>
            <p className="text-xl font-extrabold text-foreground group-hover:text-warning transition-colors">System Settings</p>
            <p className="text-sm font-medium text-muted-foreground mt-2">Configure core global parameters and tuning</p>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
