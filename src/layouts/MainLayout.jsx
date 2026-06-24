import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex flex-col relative overflow-hidden font-sans transition-colors duration-300">
      {/* Premium Glow effect */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-medical-teal/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Dynamic sticky navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Startup-Quality Footer */}
      <Footer />
    </div>
  );
};
