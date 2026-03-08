import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, MessageSquare, ShieldAlert, HeartPulse, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] relative overflow-hidden font-sans bg-gradient-to-br from-[#F8F4EC] via-[#FFFFFF] to-[#EFE8DD] dark:from-[#0F0F0F] dark:via-[#151515] dark:to-[#0F0F0F]">
      
      {/* Subtle Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/60 dark:bg-white/5 blur-[120px] mix-blend-overlay"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#EFE8DD]/80 dark:bg-black/50 blur-[150px] mix-blend-overlay"></div>
      </div>

      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center px-4 py-20 lg:py-32 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-black dark:text-white font-semibold text-sm mb-8 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>The Future of Clinical AI is Here</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-extrabold text-[#0F0F0F] dark:text-white mb-8 tracking-tighter leading-[1.1]"
          >
            Your Intelligent <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A1A1A] to-[#444444] dark:from-white dark:to-[#E8E2D9]">
              Health Companion
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-[#4B4B4B] dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Experience premium healthcare assistance. Our predictive symptom checker and clinical-grade AI chatbot empower you with instant medical insights.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <Link to="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto rounded-2xl flex items-center justify-center gap-2 group">
              Get Started Free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/symptom-checker" className="btn-outline text-lg px-8 py-4 w-full sm:w-auto rounded-2xl bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all font-semibold border-slate-300 dark:border-slate-700">
              Try Symptom Checker
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Bento Section */}
      <section className="py-24 px-4 relative z-10 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight text-[#0F0F0F] dark:text-white">Clinical Features, Beautifully Designed</h2>
            <p className="text-lg text-[#4B4B4B] dark:text-slate-400 max-w-2xl mx-auto font-medium">Access powerful medical AI through a breathtaking, distraction-free interface.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:auto-rows-[250px]">
            {/* Feature 1 (Spans 2 cols) */}
            <div className="md:col-span-2 premium-card h-full flex flex-col justify-center p-10 group bg-white dark:bg-[#1A1A1A]">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7 text-black dark:text-white" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-3 text-black dark:text-white">AI Medical Chatbot</h3>
              <p className="text-[#4B4B4B] dark:text-slate-400 text-lg leading-relaxed max-w-xl">
                Converse naturally with our advanced engine. Built on clinical context, our AI provides instant, reliable health information in an elegant format.
              </p>
            </div>
            
            {/* Feature 2 (Spans 1 col, 2 rows) */}
            <div className="md:col-span-1 md:row-span-2 premium-card h-full flex flex-col p-10 group bg-white dark:bg-[#1A1A1A]">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                <ShieldAlert className="w-7 h-7 text-black dark:text-white" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-3 mt-auto md:mt-0 text-black dark:text-white">Emergency Detection</h3>
              <p className="text-[#4B4B4B] dark:text-slate-400 text-lg leading-relaxed mt-2">
                Our system continuously monitors for critical symptom combinations, immediately alerting you if emergency care is required.
              </p>
            </div>

            {/* Feature 3 (Spans 2 cols) */}
            <div className="md:col-span-2 premium-card h-full flex flex-col justify-center p-10 group bg-white dark:bg-[#1A1A1A]">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7 text-black dark:text-white" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-3 text-black dark:text-white">Predictive Symptom Checker</h3>
              <p className="text-[#4B4B4B] dark:text-slate-400 text-lg leading-relaxed max-w-xl">
                Select or type your symptoms to receive instant disease predictions, severity classifications, and specialist recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
