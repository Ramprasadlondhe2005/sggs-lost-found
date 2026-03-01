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
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"><Search className="w-5 h-5 text-primary-foreground" /></div>
            <span className="font-bold text-xl text-foreground">SGGS Lost & Found</span>
          </Link>
        </div>
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">Create Account</h2>
          <p className="text-sm text-muted-foreground mt-1">Register as a student to claim lost items</p>

          {error && <p className="mt-4 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input required value={form.name} onChange={e => update('name', e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <input required type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@sggs.ac.in" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">PRN</label>
                <input required value={form.prn} onChange={e => update('prn', e.target.value.toUpperCase())} placeholder="2024IT509" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phone</label>
                <input required type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="9876543210" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Branch</label>
                <select required value={form.branch} onChange={e => update('branch', e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                  <option value="">Select</option>
                  {branches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Year</label>
                <select required value={form.year} onChange={e => update('year', e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                  <option value="">Select</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Password</label>
                <input required type="password" value={form.password} onChange={e => update('password', e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <input required type="password" value={form.confirm} onChange={e => update('confirm', e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">Register</button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Already have an account? <Link to="/student-login" className="text-primary hover:text-primary-hover font-medium">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
