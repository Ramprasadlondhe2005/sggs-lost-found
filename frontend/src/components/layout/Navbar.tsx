import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'student': return '/student/dashboard';
      case 'guard': return '/guard/dashboard';
      case 'admin': return '/admin/dashboard';
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Search className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">SGGS Lost & Found</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/lost-items" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Lost Items</Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About Us</Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
            {!isAuthenticated && (
              <Link to="/guard-login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Guard Login</Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <Link to={getDashboardPath()} className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
                  Dashboard
                </Link>
                <span className="text-sm text-muted-foreground">{user?.name}</span>
                <button onClick={() => { logout(); navigate('/'); }} className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/student-login" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors">
                Student Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <div className="py-4 space-y-3">
                <Link to="/" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-primary px-2 py-1">Home</Link>
                <Link to="/lost-items" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-primary px-2 py-1">Lost Items</Link>
                <Link to="/about" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-primary px-2 py-1">About Us</Link>
                <Link to="/contact" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-primary px-2 py-1">Contact Us</Link>
                {isAuthenticated ? (
                  <>
                    <Link to={getDashboardPath()} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-primary px-2 py-1">Dashboard</Link>
                    <button onClick={() => { logout(); navigate('/'); setMobileOpen(false); }} className="block w-full text-left text-sm font-medium text-destructive px-2 py-1">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/guard-login" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-primary px-2 py-1">Guard Login</Link>
                    <Link to="/student-login" onClick={() => setMobileOpen(false)} className="block text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg text-center">Student Login</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
