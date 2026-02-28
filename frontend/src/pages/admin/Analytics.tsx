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
    <div className="page-container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Detailed statistics and insights</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Monthly Found vs Returned</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="found" fill="hsl(217, 91%, 53%)" radius={[4, 4, 0, 0]} name="Found" />
              <Bar dataKey="returned" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} name="Returned" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Items by Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={locationData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
                {locationData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl border border-border p-6 lg:col-span-2">
          <h3 className="font-semibold text-foreground mb-4">Success Rate Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData.map(m => ({ ...m, rate: Math.round((m.returned / m.found) * 100) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} domain={[0, 100]} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Line type="monotone" dataKey="rate" stroke="hsl(217, 91%, 53%)" strokeWidth={2} dot={{ fill: 'hsl(217, 91%, 53%)' }} name="Success Rate" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Analytics;
