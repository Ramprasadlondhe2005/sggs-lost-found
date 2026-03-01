import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const monthlyData = [
  { month: 'Jan', found: 15, returned: 12 }, { month: 'Feb', found: 20, returned: 17 },
  { month: 'Mar', found: 18, returned: 15 }, { month: 'Apr', found: 25, returned: 22 },
  { month: 'May', found: 30, returned: 28 }, { month: 'Jun', found: 22, returned: 19 },
  { month: 'Jul', found: 12, returned: 10 }, { month: 'Aug', found: 19, returned: 16 },
  { month: 'Sep', found: 25, returned: 23 }, { month: 'Oct', found: 22, returned: 20 },
  { month: 'Nov', found: 30, returned: 27 }, { month: 'Dec', found: 18, returned: 15 },
];

const locationData = [
  { name: 'Library', value: 30 }, { name: 'Canteen', value: 25 },
  { name: 'Lab', value: 20 }, { name: 'Ground', value: 15 }, { name: 'Other', value: 10 },
];

const COLORS = ['hsl(217, 91%, 53%)', 'hsl(142, 71%, 45%)', 'hsl(45, 93%, 47%)', 'hsl(0, 84%, 60%)', 'hsl(270, 50%, 50%)'];

const Analytics = () => (
  <div className="min-h-screen bg-secondary/30">
    <Navbar />
    <div className="page-container py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-success/10 text-success mb-4 tracking-wide border border-success/20">DATA INTELLIGENCE</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">System <span className="text-transparent bg-clip-text bg-gradient-to-r from-success to-success/50 text-glow">Analytics</span></h1>
        <p className="text-lg text-muted-foreground mt-2">Deep dive into campus recovery statistics and spatial distribution.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bento-box p-6 md:p-8 bg-card/40 backdrop-blur-xl group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <h3 className="text-xl font-extrabold text-foreground mb-6 uppercase tracking-wider flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_theme(colors.primary.DEFAULT)]" /> Recovery Operations</h3>
          <div className="h-80 select-none relative z-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)' }} dy={10} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                <Tooltip cursor={{ fill: 'var(--foreground)', opacity: 0.05 }} contentStyle={{ borderRadius: '16px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '12px 16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} itemStyle={{ fontWeight: 'bold' }} />
                <Bar dataKey="found" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]} name="Found" barSize={20} />
                <Bar dataKey="returned" fill="hsl(var(--success))" radius={[4, 4, 4, 4]} name="Returned" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bento-box p-6 md:p-8 bg-card/40 backdrop-blur-xl group relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-info/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <h3 className="text-xl font-extrabold text-foreground mb-6 self-start uppercase tracking-wider flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-info shadow-[0_0_10px_theme(colors.info.DEFAULT)]" /> Spatial Distribution</h3>
          <div className="h-80 select-none relative z-10 w-full ml-[-20px] sm:ml-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={locationData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {locationData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" style={{ filter: `drop-shadow(0px 0px 8px ${COLORS[i % COLORS.length]}40)` }} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '12px 16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} itemStyle={{ fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bento-box p-6 md:p-8 bg-card/40 backdrop-blur-xl lg:col-span-2 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <h3 className="text-xl font-extrabold text-foreground mb-6 uppercase tracking-wider flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-success shadow-[0_0_10px_theme(colors.success.DEFAULT)]" /> Resolution Trajectory</h3>
          <div className="h-64 select-none relative z-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData.map(m => ({ ...m, rate: Math.round((m.returned / m.found) * 100) }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)' }} dy={10} />
                <YAxis fontSize={12} domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                <Tooltip cursor={{ stroke: 'var(--foreground)', strokeWidth: 1, opacity: 0.1, strokeDasharray: '5 5' }} contentStyle={{ borderRadius: '16px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '12px 16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} itemStyle={{ color: 'var(--success)', fontWeight: 'bold' }} formatter={(v: number) => `${v}%`} />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--success))" strokeWidth={4} dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4, stroke: 'var(--card)' }} activeDot={{ r: 8, strokeWidth: 0, fill: 'hsl(var(--success))', className: 'drop-shadow-[0_0_8px_rgba(var(--success),0.8)]' }} name="Resolution Rate" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Analytics;
