import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockItems } from '@/data/mockData';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MapPin, Calendar, Tag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const statusStyles: Record<string, string> = {
  available: 'bg-success/10 text-success',
  claimed: 'bg-warning/10 text-warning',
  delivered: 'bg-info/10 text-info',
};

const ItemDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const item = mockItems.find(i => i.id === id);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!item) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="page-container py-16 text-center">
        <p className="text-muted-foreground">Item not found.</p>
        <Link to="/lost-items" className="text-primary mt-4 inline-block">← Back to items</Link>
      </div>
    </div>
  );

  const handleClaim = () => {
    if (!isAuthenticated) { navigate('/student-login'); return; }
    setShowClaimForm(true);
  };

  const submitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setShowClaimForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="page-container py-8">
        <Link to="/lost-items" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Lost Items
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-xl overflow-hidden border border-border">
            <img src={item.image} alt={item.name} className="w-full h-80 object-cover" />
          </div>
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[item.status]}`}>{item.status}</span>
            <h1 className="text-3xl font-bold text-foreground mt-3">{item.name}</h1>
            <p className="text-muted-foreground mt-3">{item.description}</p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Tag className="w-4 h-4 text-primary" /><span className="font-medium text-foreground">{item.category}</span></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4 text-primary" /><span className="font-medium text-foreground">{item.location}</span></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="w-4 h-4 text-primary" /><span className="font-medium text-foreground">{item.date}</span></div>
            </div>

            {submitted ? (
              <div className="mt-6 p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm font-medium text-success">✓ Claim submitted successfully! You'll receive a notification once it's reviewed.</p>
              </div>
            ) : showClaimForm ? (
              <form onSubmit={submitClaim} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Why do you believe this is yours?</label>
                  <textarea
                    required
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Describe identifying features, when you lost it, etc."
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">Submit Claim</button>
                  <button type="button" onClick={() => setShowClaimForm(false)} className="border border-border px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
                </div>
              </form>
            ) : item.status === 'available' ? (
              <button onClick={handleClaim} className="mt-6 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-md">
                Claim This Item
              </button>
            ) : null}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ItemDetails;
