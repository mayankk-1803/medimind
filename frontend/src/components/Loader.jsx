import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';

const Loader = ({ fullScreen = false }) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 bg-background/80 dark:bg-dark-bg/80 backdrop-blur-sm z-50 flex items-center justify-center"
    : "flex justify-center items-center py-12";

  return (
    <div className={containerClasses}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 bg-primary/20 rounded-full"
          />
          <HeartPulse className="w-16 h-16 text-primary relative z-10" />
        </div>
        <p className="text-primary font-medium animate-pulse">Analyzing Data...</p>
      </motion.div>
    </div>
  );
};

export default Loader;
