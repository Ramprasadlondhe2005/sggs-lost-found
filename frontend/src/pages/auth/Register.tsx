import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const branches = [
  'Computer Science',
  'Information Technology',
  'Electronics & Telecommunication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Production Engineering'
];
const years = ['First Year (FE)', 'Second Year (SE)', 'Third Year (TE)', 'Final Year (BE)'];

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', prn: '', branch: '', year: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\d{4}(CS|IT|EC|EE|ME|CE|PR)\d{3}$/i.test(form.prn)) { setError('Invalid PRN format (e.g., 2024IT509)'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    try {
      await register({
        name: form.name,
        email: form.email,
        prn: form.prn,
        branch: form.branch,
        year: form.year,
        phone: form.phone,
        password: form.password,
        role: 'student'
      });
      navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse bg-background">
      {/* Premium Image Side - Reversed for Register */}
      <div className="hidden md:flex md:w-[45%] relative overflow-hidden items-center justify-center bg-muted">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
          alt="Students learning"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] ease-out hover:scale-110"
        />
        <div className="relative z-20 text-center p-8 max-w-lg">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-xl">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-md">Join the Network</h2>
            <p className="text-lg text-white/90 drop-shadow">Create your student account to claim lost items and help maintain a secure campus.</p>
          </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-[55%] flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-background -z-10" />
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg my-8"
        >
          <div className="text-left mb-8 md:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <Search className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">SGGS Lost & Found</span>
            </Link>
          </div>

          <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8 shadow-2xl relative overflow-hidden">
            {/* Decorative blob */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-2xl font-bold text-foreground relative z-10">Create Account</h2>
            <p className="text-sm text-muted-foreground mt-1 relative z-10">Register as a student to claim lost items</p>

            {error && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 relative z-10">
                {error}
              </motion.p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <input required value={form.name} onChange={e => update('name', e.target.value)} placeholder="John Doe" className="mt-1.5 w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input required type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@sggs.ac.in" className="mt-1.5 w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">PRN</label>
                  <input required value={form.prn} onChange={e => update('prn', e.target.value.toUpperCase())} placeholder="2024IT509" className="mt-1.5 w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Phone</label>
                  <input required type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="9876543210" className="mt-1.5 w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Branch</label>
                  <select required value={form.branch} onChange={e => update('branch', e.target.value)} className="mt-1.5 w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all">
                    <option value="" disabled>Select Branch</option>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Year</label>
                  <select required value={form.year} onChange={e => update('year', e.target.value)} className="mt-1.5 w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all">
                    <option value="" disabled>Select Year</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <input required type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="••••••••" className="mt-1.5 w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Confirm Password</label>
                  <input required type="password" value={form.confirm} onChange={e => update('confirm', e.target.value)} placeholder="••••••••" className="mt-1.5 w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
                </div>
              </div>
              <button disabled={!form.email || !form.password || !form.prn} type="submit" className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:bg-primary-hover transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:-translate-y-0">
                Create Account
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50 relative z-10">
              <p className="text-sm text-muted-foreground text-center">
                Already have an account? <Link to="/student-login" className="text-primary hover:text-primary-hover font-semibold transition-colors">Sign In</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
