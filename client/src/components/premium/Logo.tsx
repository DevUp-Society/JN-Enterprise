import { motion } from 'framer-motion';

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <motion.div 
      className={`flex items-center tracking-[0.4em] text-primary dark:text-white font-black uppercase ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      JN ENTERPRISE
    </motion.div>
  );
};
