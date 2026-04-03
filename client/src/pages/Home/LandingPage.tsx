import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Package,
  Truck,
  ShieldCheck,
  Clock,
  Zap,
  Box,
  Layers
} from 'lucide-react';
import { useState } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
};

export default function LandingPage() {
  const [email, setEmail] = useState('');

  const categories = [
    { title: "Precision Hooks", img: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=600", icon: Zap },
    { title: "Custom Stickers", img: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&q=80&w=600", icon: Package },
    { title: "Premium Socks", img: "https://images.unsplash.com/photo-1582966298431-99c6a1e8eb8a?auto=format&fit=crop&q=80&w=600", icon: Layers },
    { title: "Plastic Organization", img: "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?auto=format&fit=crop&q=80&w=600", icon: Box }
  ];

  const benefits = [
    { title: "Direct Manufacturing", icon: Zap, text: "Eliminate middleman costs with factory-direct procurement." },
    { title: "Global Logistics", icon: Truck, text: "Seamless shipping and customs handling for worldwide retail." },
    { title: "Quality Certified", icon: ShieldCheck, text: "ISO-compliant production standards for high-volume orders." },
    { title: "Automated Reordering", icon: Clock, text: "Intelligent stock alerts and one-click bulk replenishment." }
  ];

  return (
    <div className="bg-[#F6F4F2]">

      <main>
        {/* 2. Hero Section */}
        <section className="pt-[160px] pb-[120px] bg-[#425664] relative overflow-hidden">
          {/* Decorative elements for the blue background */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C6AD8F]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

          <div className="max-w-[1400px] mx-auto px-8 grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-10"
            >
              <div className="space-y-6">
                <span className="inline-block text-[#C6AD8F] font-medium text-xs uppercase tracking-widest border-l-4 border-[#C6AD8F] pl-4">
                  Precision Manufacturing Excellence
                </span>
                <h1 className="text-6xl font-bold leading-tight text-[#F6F4F2]">
                  High Quality <br />
                  <span className="text-[#C6AD8F]">Everyday</span> Products.
                </h1>
                <p className="text-base font-normal text-[#F6F4F2]/70 leading-relaxed max-w-xl">
                  Supplying the world's leading brands with precision-molded plastics,
                  premium apparel, and industrial components directly from our manufacturing hubs.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/home" className="bg-[#C6AD8F] text-white px-8 py-3 text-base font-medium rounded-lg hover:bg-[#B89672] transition-colors shadow-lg flex items-center gap-2">
                  Shop Now <ArrowRight size={18} />
                </Link>
                <a href="mailto:wholesale@jn.com?subject=Bulk%20Order%20Inquiry" className="border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white px-8 py-3 text-base font-medium rounded-lg hover:bg-white hover:text-[#425664] transition-all">
                  Bulk Order Inquiry
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative aspect-square md:aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl group"
            >
              <img
                src="https://images.unsplash.com/photo-1530124564312-6f082218042a?auto=format&fit=crop&q=80&w=1200"
                alt="Manufacturing quality"
                className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* 3. Categories Section */}
        <section className="py-[120px] bg-[#F6F4F2]">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="mb-[64px] flex justify-between items-end">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-[#425664] leading-tight">Our Core Manufacturing</h2>
                <p className="text-base font-normal text-[#6B7280] max-w-2xl leading-relaxed">Specialized production lines for industrial and consumer goods.</p>
              </div>
              <div className="hidden md:flex gap-4">
                <button className="w-12 h-12 rounded-full border border-[#425664]/10 flex items-center justify-center hover:bg-white transition-colors"><ArrowRight size={20} className="rotate-180" /></button>
                <button className="w-12 h-12 rounded-full border border-[#425664]/10 flex items-center justify-center hover:bg-white transition-colors"><ArrowRight size={20} /></button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              {categories.map((cat, i) => (
                <Link to="/shop" key={i} className="w-full sm:w-[280px]">
                  <motion.div
                    {...fadeInUp}
                    className="group bg-white h-[200px] rounded-[12px] flex flex-col items-center justify-center p-8 shadow-sm hover:shadow-md border-2 border-transparent hover:border-[#C6AD8F] transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-[#F6F4F2] text-[#425664] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#C6AD8F] group-hover:text-white transition-colors duration-300">
                      <cat.icon size={28} />
                    </div>
                    <h3 className="text-lg font-medium text-[#425664]">{cat.title}</h3>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Infrastructure & Capability Section */}
        <section id="infrastructure" className="py-[140px] bg-[#F6F4F2] border-t border-[#425664]/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none grayscale">
            <img src="https://images.unsplash.com/photo-1549194382-346a85f8266e?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Matrix" />
          </div>

          <div className="max-w-[1400px] mx-auto px-8 relative z-10">
            <div className="mb-[80px] text-center space-y-6">
              <span className="inline-block text-[#C6AD8F] font-medium text-xs uppercase tracking-widest">Industrial Capacity Hub_</span>
              <h2 className="text-2xl font-semibold text-[#425664] leading-tight">Global Infrastructure <br /> & Manufacturing Prowess.</h2>
              <p className="text-base font-normal text-[#6B7280] max-w-xl mx-auto leading-relaxed">Engineered for high-volume corporate partnerships and technical manufacturing excellence across all industrial sectors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { stat: "1,500+", context: "Metric Tons", label: "Monthly Manufacturing Capacity", sub: "High-density scaled production" },
                { stat: "12", context: "Nations", label: "Global Logistics Reach", sub: "Distributed fulfillment network" },
                { stat: "9001", context: "ISO Certified", label: "Audited Quality Standards", sub: "Technical excellence verified" },
                { stat: "100%", context: "Live Status", label: "Supply Chain Visibility", sub: "Real-time asset tracking active" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="p-10 bg-white rounded-[40px] border border-[#425664]/5 shadow-sm hover:shadow-2xl transition-all duration-500 hover:border-[#C6AD8F]/30"
                >
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-[#425664]">{item.stat}</p>
                      <p className="text-xs font-medium uppercase tracking-widest text-[#C6AD8F]">{item.context}</p>
                    </div>
                    <div className="space-y-2 pt-6 border-t border-[#425664]/5">
                      <h4 className="text-lg font-medium text-[#425664] leading-snug">{item.label}</h4>
                      <p className="text-xs text-[#6B7280] font-normal uppercase tracking-wide leading-relaxed">{item.sub}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Promotional Banner */}
        <section className="mx-8 bg-[#425664] rounded-[32px] overflow-hidden py-[100px] relative">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#C6AD8F]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

          <div className="max-w-[1400px] mx-auto px-12 relative z-10 grid lg:grid-cols-2 gap-20 items-center text-center lg:text-left">
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-[#F6F4F2] leading-tight">
                Manufacturing Your Vision <br />
                <span className="text-[#C6AD8F]">At Scale.</span>
              </h2>
              <p className="text-base font-normal text-[#F6F4F2]/70 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Contact our engineering team for custom molding, private label apparel,
                and bespoke hardware production lines.
              </p>
              <a href="mailto:manufacturing@jn.com?subject=Custom%20Manufacturing%20Quote" className="inline-block bg-[#C6AD8F] text-white px-8 py-3 text-base font-medium rounded-lg hover:brightness-110 shadow-lg transition-all">
                Request Manufacturing Quote
              </a>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {benefits.map((b, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md p-8 rounded-[24px] border border-white/10 space-y-4">
                  <div className="text-[#C6AD8F]"><b.icon size={28} /></div>
                  <h3 className="text-lg font-medium text-white">{b.title}</h3>
                  <p className="text-base font-normal text-white/70 leading-relaxed">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter/Contact Section (Incorporated into a clean block) */}
        <section className="py-[120px] bg-[#F6F4F2]">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-16 bg-white p-12 lg:p-20 rounded-[40px] shadow-xl items-center">
              <div className="space-y-6">
                <span className="text-[#C6AD8F] font-medium text-xs uppercase tracking-widest">Industry Updates</span>
                <h2 className="text-2xl font-semibold text-[#425664] leading-tight">Global Supply Intelligence.</h2>
                <p className="text-base font-normal text-[#6B7280] leading-relaxed">Stay ahead of supply chain fluctuations with our monthly market report on raw material pricing and logistics trends.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Work email address"
                  className="flex-1 bg-[#F6F4F2] border border-transparent px-6 py-3 text-base font-normal rounded-lg focus:outline-none focus:border-[#C6AD8F] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="bg-[#425664] text-white px-8 py-3 text-base font-medium rounded-lg hover:bg-black transition-all shadow-md">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
