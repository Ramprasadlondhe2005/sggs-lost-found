import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MapPin, Calendar, Tag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

const fetchItemDetails = async (id: string) => {
  const { data } = await api.get(`/items/${id}`);
  if (data.success && data.item) {
    return {
      ...data.item,
      id: data.item._id,
      name: data.item.title,
      date: new Date(data.item.foundDate || data.item.createdAt).toLocaleDateString(),
    };
  }
  throw new Error('Item not found');
};

const statusStyles: Record<string, string> = {
  available: 'bg-success/10 text-success',
  claimed: 'bg-warning/10 text-warning',
  delivered: 'bg-info/10 text-info',
};

const ItemDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: item, isLoading, isError } = useQuery({
    queryKey: ['item', id],
    queryFn: () => fetchItemDetails(id as string),
    enabled: !!id,
  });

  const [showClaimForm, setShowClaimForm] = useState(false);
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const claimMutation = useMutation({
    mutationFn: async (payload: { itemId: string, reason: string }) => {
      const { data } = await api.post('/claims', payload);
      return data;
    },
    onSuccess: () => {
      setSubmitted(true);
      setShowClaimForm(false);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to submit claim');
    }
  });

  const submitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    claimMutation.mutate({ itemId: id as string, reason });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="page-container py-16 text-center">
          <p className="text-muted-foreground">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (isError || !item) return (
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="page-container py-24">
        <Link to="/lost-items" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-10 group">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          Back to Items Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Feature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="rounded-[2rem] overflow-hidden border-4 border-white/5 shadow-2xl relative aspect-square group bg-secondary/20"
          >
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500" />
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <Tag className="w-16 h-16 opacity-20 mb-4" />
                <p className="font-medium">No Image Available</p>
              </div>
            )}

            {/* Floating Status Badge */}
            <div className="absolute top-6 left-6 z-20">
              <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-md ${item.status === 'available' ? 'bg-success/20 text-success border border-success/30' :
                  item.status === 'claimed' ? 'bg-warning/20 text-warning border border-warning/30' :
                    'bg-info/20 text-info border border-info/30'
                }`}>{item.status}</span>
            </div>
          </motion.div>

          {/* Right: Details & Action */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">{item.name}</h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">{item.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="bento-box p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Tag className="w-5 h-5 text-primary" /></div>
                <div><p className="text-xs text-muted-foreground font-semibold uppercase">Category</p><p className="font-bold text-foreground">{item.category}</p></div>
              </div>
              <div className="bento-box p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><MapPin className="w-5 h-5 text-primary" /></div>
                <div><p className="text-xs text-muted-foreground font-semibold uppercase">Location</p><p className="font-bold text-foreground">{item.location}</p></div>
              </div>
              <div className="bento-box p-4 flex items-center gap-4 sm:col-span-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Calendar className="w-5 h-5 text-primary" /></div>
                <div><p className="text-xs text-muted-foreground font-semibold uppercase">Found Date</p><p className="font-bold text-foreground">{item.date}</p></div>
              </div>
            </div>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-6 rounded-2xl bg-success/10 border border-success/30 text-center">
                <div className="w-12 h-12 rounded-full bg-success/20 mx-auto flex items-center justify-center mb-3">
                  <span className="text-success text-xl">✓</span>
                </div>
                <h3 className="font-bold text-success mb-1">Claim Submitted Securely</h3>
                <p className="text-sm font-medium text-success/80">You will be notified once a guard verifies your request.</p>
              </motion.div>
            ) : showClaimForm ? (
              <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={submitClaim} className="space-y-5 bg-card/40 p-6 rounded-2xl border border-border">
                <div>
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">Ownership Proof Validation</label>
                  <textarea
                    required
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm resize-none"
                    placeholder="Provide specific identifying marks, contents, or when you lost it..."
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="submit" className="flex-1 bg-primary text-primary-foreground px-6 py-3.5 rounded-xl font-bold hover:bg-primary-hover transition-all glow-border shadow-lg">Submit Verification</button>
                  <button type="button" onClick={() => setShowClaimForm(false)} className="sm:w-1/3 bg-secondary/50 border border-border px-6 py-3.5 rounded-xl font-bold hover:bg-secondary transition-all">Cancel</button>
                </div>
              </motion.form>
            ) : item.status === 'available' ? (
              <button onClick={handleClaim} className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-hover hover:-translate-y-1 active:translate-y-0 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-primary/30 glow-border">
                Claim This Item
              </button>
            ) : null}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ItemDetails;
