import { Logo } from '../premium/Logo';

export function Footer() {
  return (
    <footer className="mt-32 bg-[#425664] text-[#F6F4F2] pt-40 pb-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C6AD8F]/40 to-transparent" />
      <div className="max-w-[1600px] mx-auto px-8 relative z-10">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
            <div className="space-y-8">
               <Logo className="text-white text-3xl font-bold" />
               <p className="text-white/70 text-base font-normal leading-relaxed">Integrated manufacturing logistics for industrial enterprises since 1998.</p>
            </div>
            {["Procurement", "Supply Chain", "Global Network"].map(sec => (
              <div key={sec} className="space-y-6">
                 <h4 className="text-lg font-medium text-[#C6AD8F] uppercase tracking-widest">{sec}</h4>
                 <ul className="space-y-3 text-base font-medium text-white/50">
                    <li className="hover:text-white transition-colors cursor-pointer capitalize">{sec} Hub Logic</li>
                    <li className="hover:text-white transition-colors cursor-pointer capitalize">Commercial Compliance</li>
                    <li className="hover:text-white transition-colors cursor-pointer capitalize">Volume Tiering</li>
                 </ul>
              </div>
            ))}
         </div>
         <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-medium uppercase tracking-widest text-white/40">
            <span>© 2024 JN GLOBAL ENTERPRISE. ALL REQUISITIONS LOGGED.</span>
            <div className="flex gap-12 text-center md:text-left"><span>Security Intel</span><span>Global Trade Hub</span></div>
         </div>
      </div>
    </footer>
  );
}
