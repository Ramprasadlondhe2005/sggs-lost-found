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
      toast.success('User deactivated successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to deactivate user');
    }
  });

  const deleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      deleteMutation.mutate(id);
    }
  };

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

        {isLoading ? (
          <p className="mt-6 text-muted-foreground">Loading users...</p>
        ) : (
          <div className="mt-6 bg-card rounded-xl border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Role</th>
                <th className="text-left p-3 font-medium text-muted-foreground">PRN/Employee ID</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="border-b border-border last:border-0">
                    <td className="p-3 text-foreground font-medium">{u.name}</td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${u.role === 'admin' ? 'bg-destructive/10 text-destructive' : u.role === 'guard' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}`}>{u.role}</span></td>
                    <td className="p-3 text-muted-foreground">{u.prn || u.employeeId || '—'}</td>
                    <td className="p-3 text-muted-foreground">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${u.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>{u.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-primary"><Edit className="w-4 h-4" /></button>
                      {u.isActive && (
                        <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-destructive"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UserManagement;
