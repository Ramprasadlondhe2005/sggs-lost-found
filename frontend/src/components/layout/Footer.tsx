import { Link } from 'react-router-dom';
import { Search, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="bg-foreground text-background">
    <div className="page-container py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Search className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">SGGS Lost & Found</span>
          </div>
          <p className="text-sm text-background/60">Helping SGGS students recover their lost belongings quickly and securely.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <div className="space-y-2">
            <Link to="/lost-items" className="block text-sm text-background/60 hover:text-background transition-colors">Lost Items</Link>
            <Link to="/about" className="block text-sm text-background/60 hover:text-background transition-colors">About Us</Link>
            <Link to="/contact" className="block text-sm text-background/60 hover:text-background transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Access</h4>
          <div className="space-y-2">
            <Link to="/student-login" className="block text-sm text-background/60 hover:text-background transition-colors">Student Login</Link>
            <Link to="/guard-login" className="block text-sm text-background/60 hover:text-background transition-colors">Guard Login</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <div className="space-y-2 text-sm text-background/60">
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Vishnupuri, Nanded, Maharashtra</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 2462 229 330</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> lostnfound@sggs.ac.in</p>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10 mt-8 pt-6 text-center text-sm text-background/40">
        © 2024 SGGS Institute of Engineering & Technology. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
