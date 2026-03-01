import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

const fetchUsers = async () => {
  const { data } = await api.get('/users?limit=50');
  if (data.success && data.users) {
    return data.users.map((u: any) => ({
      ...u,
      id: u._id,
    }));
  }
  return [];
};

const UserManagement = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['manageUsers'],
    queryFn: fetchUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manageUsers'] });
      toast.success('User deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  });

  const deleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="page-container py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-primary/10 text-primary mb-4 tracking-wide border border-primary/20">ACCESS CONTROL</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">User <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 text-glow">Directory</span></h1>
            <p className="text-lg text-muted-foreground mt-2">Manage roles, revoke access, and oversee all system personnel.</p>
          </motion.div>
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-xl text-sm font-bold tracking-wide hover:bg-primary-hover hover:-translate-y-1 transition-all glow-border shadow-lg hover:shadow-primary/30">
            <Plus className="w-5 h-5" /> Provision New Identity
          </motion.button>
        </div>

        {isLoading ? (
          <div className="py-12"><div className="text-muted-foreground font-medium flex items-center justify-center gap-2"><div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div> Fetching personnel records...</div></div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card/40 backdrop-blur-xl rounded-2xl border border-border overflow-hidden shadow-xl mt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 bg-secondary/30 text-xs uppercase tracking-wider">
                  <th className="text-left p-4 font-bold text-muted-foreground whitespace-nowrap">Personnel Name</th>
                  <th className="text-left p-4 font-bold text-muted-foreground whitespace-nowrap">Registered Email</th>
                  <th className="text-left p-4 font-bold text-muted-foreground whitespace-nowrap">Access Title</th>
                  <th className="text-left p-4 font-bold text-muted-foreground whitespace-nowrap">Identifier (PRN/EMP)</th>
                  <th className="text-left p-4 font-bold text-muted-foreground whitespace-nowrap">Network Status</th>
                  <th className="text-right p-4 font-bold text-muted-foreground whitespace-nowrap">Control</th>
                </tr></thead>
                <motion.tbody
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
                >
                  {users.map((u: any) => (
                    <motion.tr variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }} key={u.id} className="border-b border-border/50 last:border-0 hover:bg-white/5 transition-colors group">
                      <td className="p-4 text-foreground font-bold group-hover:text-primary transition-colors whitespace-nowrap">{u.name}</td>
                      <td className="p-4 text-muted-foreground font-medium whitespace-nowrap">{u.email}</td>
                      <td className="p-4 whitespace-nowrap"><span className={`inline-block px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-sm ${u.role === 'admin' ? 'bg-destructive/20 text-destructive border-destructive/30' : u.role === 'guard' ? 'bg-warning/20 text-warning border-warning/30' : 'bg-primary/20 text-primary border-primary/30'}`}>{u.role}</span></td>
                      <td className="p-4 text-muted-foreground font-medium whitespace-nowrap">{u.prn || u.employeeId || '—'}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-sm ${u.isActive ? 'bg-success/20 text-success border-success/30' : 'bg-muted/50 text-muted-foreground border-border'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`}></span>
                          {u.isActive ? 'Active' : 'Revoked'}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap space-x-2">
                        <button className="p-2.5 rounded-xl hover:bg-primary/20 transition-all text-primary hover:-translate-y-0.5" title="Modify Privilege"><Edit className="w-4 h-4" /></button>
                        {u.isActive && (
                          <button onClick={() => deleteUser(u.id)} className="p-2.5 rounded-xl hover:bg-destructive/20 transition-all text-destructive hover:-translate-y-0.5" title="Terminate Access"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UserManagement;
