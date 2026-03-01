import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Search, Eye, EyeOff } from 'lucide-react';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password, 'student');
      navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Premium Image Side */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden items-center justify-center bg-muted">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
          alt="Campus University Life"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] ease-out hover:scale-110"
        />
        <div className="relative z-20 text-center p-8 max-w-lg">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-xl">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-md">SGGS Campus Portal</h2>
            <p className="text-lg text-white/90 drop-shadow">Securely reconnect with your lost belongings through our intelligent campus network.</p>
          </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-background -z-10" />
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
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

            <h2 className="text-2xl font-bold text-foreground relative z-10">Welcome Student</h2>
            <p className="text-sm text-muted-foreground mt-1 relative z-10">Sign in with your college credentials</p>

            {error && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 relative z-10">
                {error}
              </motion.p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5 relative z-10">
              <div>
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@sggs.ac.in" className="mt-1.5 w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative mt-1.5">
                  <input required type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none pr-10 transition-all" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button disabled={!email || !password} type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:bg-primary-hover transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:-translate-y-0">
                Access Dashboard
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50 relative z-10">
              <p className="text-sm text-muted-foreground text-center">
                New to the portal? <Link to="/register" className="text-primary hover:text-primary-hover font-semibold transition-colors">Create Account</Link>
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-4">
                <Link to="/guard-login" className="hover:text-foreground transition-colors">Guard Portal</Link>
                <span className="w-1 h-1 rounded-full bg-border" />
                <Link to="/admin-login" className="hover:text-foreground transition-colors">Admin Portal</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentLogin;
