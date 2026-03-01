import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="page-container py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-primary/10 text-primary mb-6 tracking-wide border border-primary/20">SUPPORT DIRECT</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 text-glow">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">We're here to help the SGGS community. Drop us a line if you have any questions or need direct assistance.</p>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bento-box overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side: Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-secondary/40 p-8 lg:p-12 border-r border-border/50"
              >
                <h2 className="text-2xl font-bold text-foreground mb-8">Contact Information</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                      <MapPin className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">Campus Address</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">SGGS Institute of Engineering & Technology, Vishnupuri, Nanded, Maharashtra 431606</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                      <Phone className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">Security Desk</h3>
                      <p className="text-sm text-muted-foreground">+91 2462 229 330</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                      <Mail className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">Email Support</h3>
                      <p className="text-sm text-muted-foreground">lostnfound@sggs.ac.in</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Side: Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-8 lg:p-12 bg-card/40"
              >
                {sent ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-success/10 border border-success/30 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
                      <Send className="w-8 h-8 text-success" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Message Dispatched!</h3>
                    <p className="text-sm text-muted-foreground mt-2">Our team will respond to your query within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">Name</label>
                        <input required type="text" className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background outline-none transition-all shadow-sm" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">Email</label>
                        <input required type="email" className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background outline-none transition-all shadow-sm" placeholder="john@sggs.ac.in" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">Subject</label>
                      <input required type="text" className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background outline-none transition-all shadow-sm" placeholder="How can we help?" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">Message</label>
                      <textarea required rows={4} className="w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background outline-none transition-all shadow-sm resize-none" placeholder="Explain your issue in detail..." />
                    </div>
                    <button type="submit" className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all glow-border mt-2 shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" /> Send Secure Message
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
