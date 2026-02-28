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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(email, password, 'student')) {
      navigate('/student/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">SGGS Lost & Found</span>
          </Link>
        </div>
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">Student Login</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in with your college credentials</p>

          {error && <p className="mt-4 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@sggs.ac.in" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative mt-1">
                <input required type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">Sign In</button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Don't have an account? <Link to="/register" className="text-primary hover:text-primary-hover font-medium">Register</Link>
          </p>
          <p className="text-sm text-muted-foreground text-center mt-2">
            <Link to="/guard-login" className="text-primary hover:text-primary-hover font-medium">Guard Login</Link> · <Link to="/admin-login" className="text-primary hover:text-primary-hover font-medium">Admin Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentLogin;
