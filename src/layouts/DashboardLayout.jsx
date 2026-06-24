import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { 
  LayoutDashboard, Briefcase, Microscope, Calendar, 
  GraduationCap, Award, User, Settings, Bot, Users, Compass
} from 'lucide-react';

export const DashboardLayout = () => {
  const location = useLocation();

  const sidebarLinks = [
    { name: 'Portal Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Opportunities', path: '/opportunities', icon: Briefcase },
    { name: 'Research Trials', path: '/research', icon: Microscope },
    { name: 'Medical Events', path: '/events', icon: Calendar },
    { name: 'Clinical Internships', path: '/internships', icon: GraduationCap },
    { name: 'Certificate Vault', path: '/vault', icon: Award },
    { name: 'AI Career Advisor', path: '/advisor', icon: Bot },
    { name: 'Student Community', path: '/community', icon: Users },
    { name: 'Mentor Directory', path: '/mentors', icon: Compass },
    { name: 'Clinical Profile', path: '/profile', icon: User },
    { name: 'Portal Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b12] text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {/* Sticky top medical platform navbar */}
      <Navbar />

      {/* Unified Flex Layout for Sidebar + Main Content */}
      <div className="flex flex-1 relative">
        
        {/* Premium Left Sidebar - Desktop only */}
        <aside className="w-64 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto hidden lg:flex flex-col justify-between py-6 px-4 shrink-0 transition-colors duration-300">
          <div className="space-y-6">
            <div className="px-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                Workspace Portal
              </span>
            </div>
            
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-medical-teal/10 text-medical-teal dark:bg-medical-teal/15'
                        : 'text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-medical-teal' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Sidebar Footer Info */}
          <div className="px-3 py-3 border-t border-slate-100 dark:border-dark-border/40 text-[10px] text-slate-400 dark:text-slate-500 font-light flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-medical-emerald animate-pulse shrink-0" />
            <span>HIPAA Secure Session</span>
          </div>
        </aside>

        {/* Main content viewport */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 relative min-w-0">
          {/* Ambient background glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-medical-teal/5 rounded-full blur-[100px] pointer-events-none z-0" />
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
      
    </div>
  );
};
