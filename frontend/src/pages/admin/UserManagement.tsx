import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockUsers } from '@/data/mockData';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Trash2, Edit, Plus } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);

  const deleteUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="page-container py-8">
        <div className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage system users</p>
          </motion.div>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>

        <div className="mt-6 bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-secondary/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Role</th>
              <th className="text-left p-3 font-medium text-muted-foreground">PRN</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="p-3 text-foreground font-medium">{u.name}</td>
                  <td className="p-3 text-muted-foreground">{u.email}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${u.role === 'admin' ? 'bg-destructive/10 text-destructive' : u.role === 'guard' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}`}>{u.role}</span></td>
                  <td className="p-3 text-muted-foreground">{u.prn || '—'}</td>
                  <td className="p-3 flex gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-primary"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserManagement;
