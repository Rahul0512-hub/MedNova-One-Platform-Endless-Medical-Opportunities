import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients for premium aesthetic */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-medical-teal/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-medical-blue/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link to="/" className="flex items-center justify-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-medical-teal to-medical-emerald flex items-center justify-center shadow-lg shadow-medical-teal/20 group-hover:scale-105 transition-transform duration-300">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Med<span className="text-medical-teal">Nova</span>
          </span>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4"
      >
        <div className="bg-dark-card/60 backdrop-blur-xl border border-dark-border py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};
