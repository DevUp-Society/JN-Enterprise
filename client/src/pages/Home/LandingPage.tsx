import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Box, Layers, ArrowRight, ShieldCheck, Globe, Share2, Send, Link2 } from 'lucide-react';
import { Logo } from '../../components/premium/Logo';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  const brands = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/600px-BMW.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/640px-Apple_logo_black.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/640px-Logo_NIKE.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Adidas_Logo.svg/640px-Adidas_Logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Samsung_Logo.svg/640px-Samsung_Logo.svg.png",
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-dark font-sans selection:bg-primary/20">
      {/* 1. High-Performance Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-dark/5">
        <nav className="max-w-[1700px] mx-auto px-12 h-24 flex justify-between items-center">
          <div className="flex items-center gap-16">
             <Logo className="text-2xl font-black text-dark" />
             <div className="hidden lg:flex gap-10 text-[11px] font-black uppercase tracking-widest text-dark/40">
                <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
                <Link to="/sectors" className="hover:text-primary transition-colors">Global Sectors</Link>
                <Link to="/logistics" className="hover:text-primary transition-colors">Logistics Hub</Link>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
             <Link 
               to="/shop" 
               className="px-10 h-14 border-2 border-dark/5 rounded-full flex items-center justify-center text-[11px] font-black uppercase tracking-widest text-dark hover:bg-dark hover:text-white transition-all shadow-sm"
             >
               Explore Shop
             </Link>
             <Link 
               to="/login" 
               className="px-10 h-14 bg-primary rounded-full flex items-center justify-center text-[11px] font-black uppercase tracking-widest text-white hover:bg-dark transition-all shadow-xl shadow-primary/30"
             >
               Partner Login
             </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* 2. Kinetic Hero Section */}
        <section className="pt-56 pb-32 px-12 max-w-[1750px] mx-auto overflow-hidden">
           <div className="grid lg:grid-cols-2 gap-32 items-center">
              <motion.div 
                {...fadeInUp}
                className="space-y-12"
              >
                 <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full">
                       <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                       <span className="text-[10px] font-black text-primary uppercase tracking-widest">Authorized Wholesale Node</span>
                    </div>
                    <h1 className="text-7xl sm:text-[110px] font-black leading-[0.8] tracking-tighter text-dark uppercase font-serif">
                       THE CORE <br />
                       OF GLOBAL <br />
                       <span className="text-primary italic">SUPPLY_</span>
                    </h1>
                 </div>
                 
                 <p className="text-xl max-w-lg font-bold leading-relaxed text-dark/40 uppercase tracking-tighter">
                    JN Enterprise: Infrastructure for high-volume retailers. Precision-engineered textiles, bulk logistics, and automated procurement systems.
                 </p>

                 <div className="flex items-center gap-8 pt-8">
                    <Link 
                      to="/login"
                      className="h-20 px-16 bg-dark text-white rounded-full text-xs font-black tracking-widest-xl uppercase hover:bg-primary transition-all shadow-2xl flex items-center gap-6 group"
                    >
                      Establish Connection <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <div className="hidden sm:block">
                       <p className="text-[10px] font-black text-dark/20 uppercase tracking-widest mb-2">Verified Trust Rank</p>
                       <div className="flex gap-2">
                          {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />)}
                       </div>
                    </div>
                 </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 100, rotate: 5 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="relative"
              >
                 <div className="aspect-[4/3] rounded-[80px] bg-dark-surface border border-dark/5 overflow-hidden shadow-2xl relative">
                    <img 
                      src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600" 
                      className="w-full h-full object-cover grayscale-[0.2]"
                      alt="Industrial Logistics"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
                    <div className="absolute bottom-16 left-16 space-y-2">
                       <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Active Hub Tracking</p>
                       <p className="text-3xl font-sans font-black text-white uppercase tracking-tighter leading-none">Shenzhen Global Node_</p>
                    </div>
                 </div>
                 {/* Visual Floating Cards */}
                 <motion.div 
                   animate={{ y: [0, -20, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute -top-12 -left-12 p-8 bg-white shadow-2xl rounded-[32px] border border-dark/5 space-y-4"
                 >
                    <Box className="text-primary" size={24} />
                    <p className="text-[10px] font-black uppercase text-dark opacity-20">Volume Threshold</p>
                    <p className="text-2xl font-black text-dark tracking-tighter">94.2k+_</p>
                 </motion.div>
              </motion.div>
           </div>
        </section>

        {/* 3. Global Partner Strip */}
        <section className="bg-white py-20 border-y border-dark/5">
           <div className="max-w-[1750px] mx-auto px-12">
              <div className="flex flex-wrap justify-between items-center gap-16 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                 {brands.map((brand, i) => (
                    <img key={i} src={brand} className="h-10 object-contain" alt="Partner Logo" />
                 ))}
                 <p className="text-[12px] font-black text-dark tracking-widest uppercase">TRUSTED BY INDUSTRY TITANS</p>
              </div>
           </div>
        </section>

        {/* 4. Strategic Sectors Grid */}
        <section className="py-48 px-12 bg-dark rounded-t-[100px] -mt-20">
           <div className="max-w-[1750px] mx-auto space-y-32">
              <div className="flex justify-between items-end border-b border-white/5 pb-10">
                 <div className="space-y-4">
                    <h2 className="text-6xl font-black text-white tracking-tighter uppercase font-serif">Strategic Sectors_</h2>
                    <p className="text-white/30 text-[13px] font-bold tracking-widest uppercase">Specialized inventory for high-growth markets</p>
                 </div>
                 <Link to="/sectors" className="text-primary font-black text-[12px] tracking-widest uppercase border-b-2 border-primary/20 hover:border-primary transition-all pb-2">View All Sectors</Link>
              </div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-12"
              >
                 {[
                   { title: "Apparel Registry", icon: Box, text: "High-density textiles and private label apparel manufacturing units." },
                   { title: "Hardware Matrix", icon: ShieldCheck, text: "Industrial hardware and tool procurement for large scale infrastructure." },
                   { title: "Material Depot", icon: Layers, text: "Raw bulk materials and sustainable textile archives for global fashion houses." }
                 ].map((sector, i) => (
                   <motion.div 
                     key={i}
                     variants={fadeInUp}
                     className="bg-white/5 border border-white/5 p-16 rounded-[48px] space-y-12 group hover:bg-primary transition-all duration-500 shadow-2xl"
                   >
                     <div className="w-16 h-16 bg-white/5 flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary transition-all rounded-2xl">
                        <sector.icon size={24} />
                     </div>
                     <div className="space-y-6">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{sector.title}</h3>
                        <p className="text-white/40 text-[14px] font-bold leading-relaxed uppercase tracking-tight group-hover:text-white transition-colors">{sector.text}</p>
                     </div>
                     <div className="pt-8 border-t border-white/5 group-hover:border-white/20">
                        <span className="text-[10px] font-black text-primary group-hover:text-white uppercase tracking-widest flex items-center gap-4 transition-colors">
                           Enter Sector Hub <ArrowRight size={14} />
                        </span>
                     </div>
                   </motion.div>
                 ))}
              </motion.div>
           </div>
        </section>
      </main>

      {/* 5. Minimalist Enterprise Footer */}
      <footer className="bg-white px-12 pt-48 pb-20 rounded-t-[100px]">
        <div className="max-w-[1750px] mx-auto space-y-48">
           <div className="grid md:grid-cols-4 gap-32">
              <div className="space-y-12">
                 <Logo className="text-3xl" />
                 <p className="text-[14px] font-bold text-dark/40 leading-relaxed uppercase tracking-tight">
                    The infrastructure of industrial distribution and global wholesale networking.
                 </p>
                 <div className="flex gap-6">
                    {[Share2, Globe, Send, Link2].map((Icon, i) => (
                       <div key={i} className="w-12 h-12 rounded-full border border-dark/5 flex items-center justify-center text-dark/20 hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer">
                          <Icon size={20} />
                       </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-10">
                 <h4 className="text-[14px] font-black text-dark uppercase tracking-widest-xl">Operations</h4>
                 <ul className="space-y-6 text-[12px] font-black text-dark/30 uppercase tracking-widest">
                    <li className="hover:text-primary transition-colors cursor-pointer">Global Sourcing</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Fulfillment Map</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Manufacturer Audit</li>
                 </ul>
              </div>

              <div className="space-y-10">
                 <h4 className="text-[14px] font-black text-dark uppercase tracking-widest-xl">Resources</h4>
                 <ul className="space-y-6 text-[12px] font-black text-dark/30 uppercase tracking-widest">
                    <li className="hover:text-primary transition-colors cursor-pointer">Protocol API</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Supply Register</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Help Center</li>
                 </ul>
              </div>

              <div className="space-y-10">
                 <h4 className="text-[14px] font-black text-dark uppercase tracking-widest-xl">Newsletter</h4>
                 <p className="text-[11px] font-bold text-dark/30 uppercase tracking-widest leading-relaxed">
                    Subscribe to the industrial pulse. Direct factory insights.
                 </p>
                 <div className="flex gap-4">
                    <input className="bg-slate border-b-2 border-dark/5 p-4 text-[11px] font-black uppercase tracking-widest flex-1 focus:outline-none focus:border-primary transition-all" />
                    <button className="w-14 h-14 bg-dark text-white flex items-center justify-center hover:bg-primary transition-all rounded-xl">
                       <ArrowRight size={20} />
                    </button>
                 </div>
              </div>
           </div>

           <div className="flex justify-between items-center text-[10px] font-black text-dark/10 uppercase tracking-widest-xl pt-12 border-t border-dark/5">
              <span>© 2024 JN GLOBAL ENTERPRISE INC.</span>
              <span>ISO 9001:2015 CERTIFIED OPERATIONS HUB_</span>
           </div>
        </div>
      </footer>
    </div>
  );
}
