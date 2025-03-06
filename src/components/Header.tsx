
import { useState, useEffect } from 'react';

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
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-md py-2' 
          : 'bg-white/60 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="https://ml-apps-dev.siemens-healthineers.com/taxbot/assets/SiemensLogo.ad6a2bac.png"
            alt="Siemens Logo" 
            className="h-8 md:h-10 w-auto object-contain"
          />
          <div className="h-8 w-px bg-gray-300 mx-2" />
          <h1 className="text-lg font-medium text-gray-800">
            <span className="text-siemens-primary font-semibold">Tax</span>Bot
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-md">
            About
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-md">
            Help
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
