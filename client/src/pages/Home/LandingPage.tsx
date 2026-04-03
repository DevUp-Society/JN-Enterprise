import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Carousel } from '../../components/premium/Carousel';
import { ArrowRight, Package, PenTool, Truck } from 'lucide-react';
import { Logo } from '../../components/premium/Logo';
import { useAuth } from '../../store/AuthContext';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.2 } }
};

export default function LandingPage() {
  const { user } = useAuth();

  const features = [
    { 
      title: "BULK EFFICIENCY", 
      text: "Optimized for large-scale orders with real-time stock transparency across all product lines.",
      icon: Package
    },
    { 
      title: "CUSTOM APPAREL LAB", 
      text: "The industry’s first integrated design engine for bespoke apparel branding and private label manufacturing.",
      icon: PenTool
    },
    { 
      title: "DIRECT LOGISTICS", 
      text: "Seamless supply chain management from our warehouse (London/NYC) directly to your global storefront.",
      icon: Truck
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bone text-slate font-sans selection:bg-gold selection:text-white"
    >
      {/* 1. Clean Header (Fixed & Minimalist) */}
      <header className="fixed top-0 w-full z-50 bg-bone/70 backdrop-blur-md border-b border-slate/5">
        <nav className="max-w-[1600px] mx-auto px-12 py-6 flex justify-between items-center">
          <Logo className="text-xl font-black" />
          
          <div className="flex items-center gap-12">
            <div className="hidden md:flex gap-10 text-[10px] tracking-widest-xl uppercase font-bold opacity-60">
              <Link to="/shop" className="hover:text-gold transition-colors">Collections</Link>
              <button className="hover:text-gold transition-colors">Bulk Orders</button>
            </div>
            {user ? (
              <Link 
                to={user.role === 'ADMIN' ? "/admin" : "/home"}
                className="bg-gold text-white px-8 py-3 text-[10px] tracking-widest-xl font-black uppercase hover:bg-slate transition-all shadow-md group border border-gold"
              >
                GO TO DASHBOARD
              </Link>
            ) : (
              <Link 
                to="/login"
                className="bg-slate text-bone px-8 py-3 text-[10px] tracking-widest-xl font-black uppercase hover:bg-gold transition-all shadow-md group border border-slate"
              >
                RETAILER LOGIN
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-32">
        {/* 2. Hero Section (The Wholesale Hook) */}
        <section className="px-12 py-24 max-w-[1600px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-end">
            <motion.div 
              {...fadeInUp}
              className="space-y-12"
            >
              <div className="space-y-6">
                <div className="h-[2px] w-12 bg-gold" />
                <h1 className="text-8xl font-black leading-[0.9] tracking-tighter text-slate uppercase">
                  THE NEW <br />
                  STANDARD IN <br />
                  WHOLESALE <br />
                  SUPPLY_
                </h1>
              </div>
              
              <p className="text-lg max-w-lg font-light leading-relaxed text-slate/70">
                JN Enterprise provides curated textile and decor solutions for high-volume retailers. 
                Precision sourcing, bulk efficiency, and custom apparel design.
              </p>

              <div className="pt-4">
                <Link 
                  to={user ? (user.role === 'ADMIN' ? "/admin" : "/home") : "/login"}
                  className="group inline-flex items-center gap-6 bg-slate text-bone px-14 py-6 text-xs font-black tracking-widest-xl uppercase hover:bg-gold transition-all relative overflow-hidden"
                >
                  <span className="relative z-10">{user ? "GO TO DASHBOARD" : "START PROCUREMENT"}</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative"
            >
              <Carousel />
              <div className="absolute inset-0 border border-slate/10 pointer-events-none" />
            </motion.div>
          </div>
        </section>

        {/* 3. Core Features (The "Why JN" Section) */}
        <section className="py-48 px-12 border-y border-slate/5 bg-white">
          <div className="max-w-[1600px] mx-auto">
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-12"
            >
              {features.map((feature, i) => (
                <motion.div 
                  key={i}
                  variants={fadeInUp}
                  className="bg-bone border border-slate/10 p-16 space-y-8 group hover:border-gold/30 transition-all shadow-sm"
                >
                  <div className="w-12 h-12 bg-white flex items-center justify-center text-slate group-hover:bg-gold group-hover:text-white transition-all">
                    <feature.icon size={20} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-black tracking-widest-xl text-slate">{feature.title}</h3>
                    <p className="text-sm font-light leading-relaxed text-slate/60">{feature.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 4. The "Atelier" Vision Section */}
        <section className="px-12 py-48 max-w-[1600px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <motion.div 
              {...fadeInUp}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200"
                className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000"
                alt="Premium Textiles Stack"
              />
              <div className="absolute inset-0 border border-slate/10 m-8" />
            </motion.div>

            <motion.div 
              {...fadeInUp}
              className="space-y-12"
            >
              <span className="text-[10px] tracking-widest-xl font-black text-gold uppercase">Atelier Vision</span>
              <p className="text-5xl font-black leading-tight text-slate tracking-tighter uppercase italic opacity-90">
                "We don't just sell products; we provide the inventory that builds your brand."
              </p>
              <div className="pt-8 border-t border-slate/10 flex items-center gap-6">
                <div className="w-12 h-[1px] bg-gold" />
                <span className="text-[11px] tracking-widest-xl font-bold uppercase opacity-40">JN Enterprise Curatorial Board</span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="px-12 py-24 bg-white border-t border-slate/10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <Logo className="text-xl font-black opacity-30" />
          
          <div className="flex gap-16 text-[10px] tracking-widest-xl font-black uppercase opacity-20">
            <span className="hover:text-gold transition-colors cursor-pointer">Intelligence</span>
            <span className="hover:text-gold transition-colors cursor-pointer">Privacy Plan</span>
            <span className="hover:text-gold transition-colors cursor-pointer">Archival</span>
          </div>

          <div className="text-[9px] tracking-widest-xl font-bold uppercase opacity-20">
            © 2024 JN Enterprise. All Rights Reserved.
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
