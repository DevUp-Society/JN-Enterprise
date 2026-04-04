import { motion } from 'framer-motion';

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <motion.div 
      className={`flex items-center tracking-widest-xl text-primary font-black ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      JN ENTERPRISE
    </motion.div>
  );
};











