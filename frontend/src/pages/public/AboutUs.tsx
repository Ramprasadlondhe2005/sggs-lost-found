import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Award } from 'lucide-react';

const values = [
  { icon: Shield, title: 'Security First', desc: 'All items are securely stored and verified before handover.' },
  { icon: Target, title: 'Our Mission', desc: 'To ensure every lost item finds its rightful owner quickly.' },
  { icon: Users, title: 'Community Driven', desc: 'Students, guards, and staff working together seamlessly.' },
  { icon: Award, title: 'Trusted System', desc: 'Verified by SGGS administration with transparent processes.' },
];

const AboutUs = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="page-container py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-primary/10 text-primary mb-6 tracking-wide border border-primary/20">OUR STORY</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-6 mt-4">
            Securing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 text-glow">SGGS Community</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            The official central nervous system for recovering lost belongings on the Shri Guru Gobind Singhji campus.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 group aspect-[4/3]"
        >
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500" />
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
            alt="University Campus"
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="lg:pl-8 space-y-6"
        >
          <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-secondary/50 backdrop-blur-md border border-border">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-sm pr-4">Since 2024</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground leading-tight">Built by Students,<br />Trusted by Administration.</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Shri Guru Gobind Singhji Institute of Engineering and Technology (SGGS) is a premier engineering college located in Nanded, Maharashtra. Known for its academic excellence since 1981, campus life is vibrant but busy.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            This system was engineered to completely digitize and streamline the recovery of lost items. With over 1,250 active students on the platform, we successfully return 87% of all reported found items back to their rightful owners within 48 hours.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i + 0.4, type: "spring", stiffness: 100 }}
            className="bento-box p-8 flex flex-col items-start group"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary gap-4 transition-all duration-300 shadow-lg">
              <v.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-foreground tracking-tight mb-3">{v.title}</h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

export default AboutUs;
