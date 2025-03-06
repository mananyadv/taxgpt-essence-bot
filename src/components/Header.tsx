
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Info } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-md py-2' 
          : 'bg-white/60 backdrop-blur-sm py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <img 
            src="https://ml-apps-dev.siemens-healthineers.com/taxbot/assets/SiemensLogo.ad6a2bac.png"
            alt="Siemens Logo" 
            className="h-8 md:h-10 w-auto object-contain"
          />
          <div className="h-8 w-px bg-gray-300 mx-2" />
          <motion.h1 
            className="text-lg font-medium text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.span 
              className="text-siemens-primary font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              Tax
            </motion.span>
            Bot
          </motion.h1>
        </motion.div>
        
        <motion.nav 
          className="hidden md:flex items-center space-x-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button 
            className="px-4 py-2 text-sm text-gray-600 hover:text-siemens-primary transition-colors rounded-md flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Info size={16} />
            <span>About</span>
          </motion.button>
          <motion.button 
            className="px-4 py-2 text-sm text-gray-600 hover:text-siemens-primary transition-colors rounded-md flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HelpCircle size={16} />
            <span>Help</span>
          </motion.button>
        </motion.nav>
      </div>
    </motion.header>
  );
};

export default Header;
