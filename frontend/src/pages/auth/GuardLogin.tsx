import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Search, Eye, EyeOff } from 'lucide-react';

const GuardLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username + '@sggs.ac.in', password, 'guard');
    navigate('/guard/dashboard');
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"><Search className="w-5 h-5 text-primary-foreground" /></div>
            <span className="font-bold text-xl text-foreground">SGGS Lost & Found</span>
          </Link>
        </div>
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">Guard Login</h2>
          <p className="text-sm text-muted-foreground mt-1">Access the security management panel</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Username</label>
              <input required value={username} onChange={e => setUsername(e.target.value)} placeholder="guard_username" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative mt-1">
                <input required type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">Sign In</button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-6">
            <Link to="/student-login" className="text-primary hover:text-primary-hover font-medium">Student Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default GuardLogin;
