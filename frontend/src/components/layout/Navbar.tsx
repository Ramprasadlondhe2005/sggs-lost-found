import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'student': return '/student/dashboard';
      case 'guard': return '/guard/dashboard';
      case 'admin': return '/admin/dashboard';
    }
  };

  return (
    <div className="fixed top-0 w-full z-50 p-4 sm:p-6 transition-all">
      <nav className={`mx-auto max-w-7xl rounded-full transition-all duration-300 ${isScrolled
        ? 'bg-background/70 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] py-2'
        : 'bg-transparent py-4'
        }`}>
        <div className="px-6 md:px-8">
          <div className="flex items-center justify-between h-14">
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
                  <ThemeToggle />
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/guard-login" className="text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                    Guard Login
                  </Link>
                  <Link to="/student-login" className="text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                    Student Login
                  </Link>
                  <ThemeToggle />
                </div>
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
                      <Link to="/guard-login" onClick={() => setMobileOpen(false)} className="block text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg text-center">Guard Login</Link>
                      <Link to="/student-login" onClick={() => setMobileOpen(false)} className="block text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg text-center">Student Login</Link>
                    </>
                  )}
                  <div className="pt-2 px-2 border-t border-border mt-2">
                    <ThemeToggle />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
