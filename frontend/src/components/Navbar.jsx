import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  HeartPulse, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Moon, 
  Sun,
  Activity,
  MessageSquare,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { name: 'Symptom Checker', path: '/symptom-checker', icon: <Activity className="w-4 h-4 mr-2" /> },
    { name: 'AI Chat', path: '/chat', icon: <MessageSquare className="w-4 h-4 mr-2" /> }
  ];

  return (
    <motion.nav 
      animate={{ 
        paddingTop: isScrolled ? '0.5rem' : '1rem',
        paddingBottom: isScrolled ? '0.5rem' : '1rem'
      }}
      transition={{ duration: 0.3 }}
      className={`fixed w-full top-0 z-50 transition-all duration-500 font-sans ${
        isScrolled 
          ? 'bg-background/90 backdrop-blur-2xl shadow-sm border-b border-slate-200/50' 
          : 'bg-background border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-black p-2 rounded-xl group-hover:scale-105 transition-transform">
                <HeartPulse className="h-6 w-6 text-white" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-textMain">
                MediMind <span className="font-light">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:ml-10 md:flex md:space-x-8">
            <Link to="/symptom-checker" className="text-[#1A1A1A] hover:text-black py-2 text-sm font-medium transition-colors relative group">
              <span>Symptom Checker</span>
              <span className="absolute bottom-1 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/diseases" className="text-[#1A1A1A] hover:text-black py-2 text-sm font-medium transition-colors relative group">
              <span>Disease Database</span>
              <span className="absolute bottom-1 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {user && (
               <Link to="/chat" className="text-[#1A1A1A] hover:text-black py-2 text-sm font-medium transition-colors relative group">
                 <span>AI Assistant</span>
                 <span className="absolute bottom-1 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
               </Link>
            )}
          </div>

          {/* Right side interactions */}
          <div className="flex items-center gap-4">
            {user ? (
                <div className="relative group flex items-center gap-3">
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-sm font-semibold text-textMain">{user.name}</span>
                    <span className="text-xs text-textSecondary font-medium uppercase tracking-widest">Patient</span>
                  </div>
                  <Link to="/dashboard" className="p-2.5 rounded-full bg-white hover:bg-slate-50 transition-all border border-slate-200">
                    <User className="h-4 w-4 text-black" />
                  </Link>
                  <button onClick={handleLogout} className="p-2.5 text-slate-500 hover:text-black transition-colors rounded-full hover:bg-slate-100">
                    <LogOut className="h-4 w-4" />
                  </button>
               </div>
            ) : (
                <div className="hidden md:flex items-center space-x-4">
                    <Link to="/login" className="text-[#1A1A1A] hover:text-black px-4 py-2 text-sm font-medium transition-colors">Login</Link>
                    <Link to="/register" className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2A2A2A] transition-colors">Register</Link>
                </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 dark:text-gray-300 p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white/80 backdrop-blur-2xl border-t border-slate-200 absolute w-full left-0 top-[100%] rounded-b-2xl shadow-xl"
            >
              <div className="px-4 pt-4 pb-6 space-y-2">
                <Link to="/symptom-checker" className="block px-4 py-3 rounded-xl text-sm font-medium text-[#1A1A1A] hover:text-black hover:bg-slate-50 transition-colors">Symptom Checker</Link>
                <Link to="/diseases" className="block px-4 py-3 rounded-xl text-sm font-medium text-[#1A1A1A] hover:text-black hover:bg-slate-50 transition-colors">Disease Database</Link>
                {user ? (
                  <>
                    <Link to="/chat" className="block px-4 py-3 rounded-xl text-sm font-medium text-[#1A1A1A] hover:text-black hover:bg-slate-50 transition-colors">AI Assistant</Link>
                    <Link to="/dashboard" className="block px-4 py-3 rounded-xl text-sm font-medium text-[#1A1A1A] hover:text-black hover:bg-slate-50 transition-colors">Dashboard</Link>
                    <div className="border-t border-slate-200 my-2"></div>
                    <button onClick={handleLogout} className="w-full text-left block px-4 py-3 rounded-xl text-sm font-medium text-black hover:bg-slate-50 transition-colors">Logout</button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-slate-200 my-2"></div>
                    <Link to="/login" className="block px-4 py-3 rounded-xl text-sm font-medium text-[#1A1A1A] hover:text-black hover:bg-slate-50 transition-colors">Login</Link>
                    <Link to="/register" className="block px-4 py-3 mt-2 rounded-full text-sm font-medium text-white bg-black text-center hover:bg-[#2A2A2A]">Register</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.nav>
  );
};

export default Navbar;
