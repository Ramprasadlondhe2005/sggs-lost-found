import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockItems, mockClaims, mockUsers } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Package, Users, BarChart3, Settings, ClipboardList, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const monthlyData = [
  { month: 'Jul', items: 12 }, { month: 'Aug', items: 19 }, { month: 'Sep', items: 25 },
  { month: 'Oct', items: 22 }, { month: 'Nov', items: 30 }, { month: 'Dec', items: 18 },
];

const categoryData = [
  { name: 'Electronics', value: 35 }, { name: 'Documents', value: 20 },
  { name: 'Accessories', value: 15 }, { name: 'Books', value: 12 },
  { name: 'Clothing', value: 10 }, { name: 'Keys', value: 8 },
];

const COLORS = ['hsl(217, 91%, 53%)', 'hsl(142, 71%, 45%)', 'hsl(45, 93%, 47%)', 'hsl(0, 84%, 60%)', 'hsl(270, 50%, 50%)', 'hsl(180, 50%, 45%)'];

const AdminDashboard = () => (
  <div className="min-h-screen bg-secondary/30">
    <Navbar />
    <div className="page-container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">System overview and management</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Total Items', value: mockItems.length, icon: Package, color: 'text-primary' },
          { label: 'Total Users', value: mockUsers.length, icon: Users, color: 'text-success' },
          { label: 'Active Claims', value: mockClaims.length, icon: ClipboardList, color: 'text-warning' },
          { label: 'Verification Rate', value: '87%', icon: ShieldCheck, color: 'text-info' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl border border-border p-5">
            <card.icon className={`w-8 h-8 ${card.color} mb-3`} />
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="items" fill="hsl(217, 91%, 53%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Items by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <Link to="/admin/users" className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow flex items-center gap-4">
          <Users className="w-10 h-10 text-primary" />
          <div><p className="font-semibold text-foreground">User Management</p><p className="text-sm text-muted-foreground">Manage students, guards</p></div>
        </Link>
        <Link to="/admin/analytics" className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow flex items-center gap-4">
          <BarChart3 className="w-10 h-10 text-success" />
          <div><p className="font-semibold text-foreground">Analytics</p><p className="text-sm text-muted-foreground">View detailed stats</p></div>
        </Link>
        <Link to="/admin/settings" className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow flex items-center gap-4">
          <Settings className="w-10 h-10 text-warning" />
          <div><p className="font-semibold text-foreground">Settings</p><p className="text-sm text-muted-foreground">System configuration</p></div>
        </Link>
      </div>
    </div>
    <Footer />
  </div>
);

export default AdminDashboard;
