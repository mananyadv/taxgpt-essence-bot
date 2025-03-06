
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Info, ChevronDown, X } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-md py-2' 
            : 'bg-white/70 backdrop-blur-sm py-4'
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
            <motion.img 
              src="https://ml-apps-dev.siemens-healthineers.com/taxbot/assets/SiemensLogo.ad6a2bac.png"
              alt="Siemens Logo" 
              className="h-8 md:h-10 w-auto object-contain"
              whileHover={{ scale: 1.05 }}
            />
            <div className="h-8 w-px bg-gray-300 mx-2" />
            <motion.h1 
              className="text-lg font-medium text-gray-800 flex items-center"
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
              <motion.div 
                className="ml-1 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.span 
                  className="absolute -top-1 -right-1 h-2 w-2 bg-green-400 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 2,
                  }}
                />
              </motion.div>
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
              onClick={() => setShowInfo(true)}
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

      <AnimatePresence>
        {showInfo && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInfo(false)}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={() => setShowInfo(false)}
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-siemens-primary">About TaxBot</h2>
              <p className="text-gray-600 mb-3">
                TaxBot is an AI-powered tax assistant designed to help you navigate tax-related questions with ease.
              </p>
              <p className="text-gray-600 mb-3">
                Powered by Google's Gemini AI, TaxBot provides accurate and helpful information about tax regulations, deductions, credits, and more.
              </p>
              <p className="text-gray-600 mb-4">
                Always remember that while TaxBot provides useful information, it should not replace professional tax advice for your specific situation.
              </p>
              <div className="text-xs text-gray-400 pt-3 border-t border-gray-100">
                Developed by Siemens Tax Division • &copy; {new Date().getFullYear()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
