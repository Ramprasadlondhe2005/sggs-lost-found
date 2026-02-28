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
    <div className="page-container py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">About Us</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">Learn more about SGGS Institute's Lost & Found Management System.</p>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-semibold text-foreground mb-4">About SGGS Institute</h2>
          <p className="text-muted-foreground leading-relaxed">
            Shri Guru Gobind Singhji Institute of Engineering and Technology (SGGS) is a premier engineering college located in Nanded, Maharashtra.
            Established in 1981, the institute is known for its academic excellence and vibrant campus life.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            The Lost & Found Management System was developed to streamline the process of recovering lost belongings on campus.
            With over 1,250 active students using the platform, we've successfully returned 87% of all found items to their rightful owners.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <v.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">{v.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default AboutUs;
