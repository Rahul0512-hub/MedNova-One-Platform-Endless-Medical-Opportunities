import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartPulse, Search, Bell, User, Settings, Award, 
  LogOut, Sun, Moon, Menu, X, ChevronDown, Info,
  Calendar, Microscope, Briefcase
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Dropdown states
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Refs for closing on click outside
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Opportunities', path: '/opportunities' },
    { name: 'Research', path: '/research' },
    { name: 'Events', path: '/events' },
    { name: 'Internships', path: '/internships' },
  ];

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/login');
  };

  // Get notification item icon
  const getNotifIcon = (type) => {
    switch (type) {
      case 'application': return <Briefcase className="w-4 h-4 text-blue-500" />;
      case 'event': return <Calendar className="w-4 h-4 text-teal-500" />;
      case 'research': return <Microscope className="w-4 h-4 text-emerald-500" />;
      default: return <Info className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-dark-bg/85 backdrop-blur-md border-b border-slate-200 dark:border-dark-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* 1. LOGO */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-medical-teal to-medical-emerald flex items-center justify-center shadow-md shadow-medical-teal/15 group-hover:scale-105 transition-transform duration-300">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-medical-teal dark:group-hover:text-medical-teal transition-colors">
                Med<span className="text-medical-teal">Nova</span>
              </span>
            </Link>
          </div>

          {/* 2. SEARCH BAR (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xs items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl focus-within:border-medical-teal dark:focus-within:border-medical-teal transition-all">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search platform..."
              className="bg-transparent border-none text-xs text-slate-800 dark:text-slate-300 placeholder-slate-450 dark:placeholder-slate-500 focus:outline-none w-full"
            />
          </div>

          {/* 3. NAVIGATION ROUTE LINKS (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-xs font-semibold tracking-wide transition-colors py-1.5 ${
                    isActive 
                      ? 'text-medical-teal' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeBorder"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-medical-teal rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* 4. CONTROLS (Theme, Bell, Profile, Hamburger) */}
          <div className="flex items-center gap-2 sm:gap-3.5 ml-auto">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent transition-all cursor-pointer shrink-0"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-500 animate-spin-slow" /> : <Moon className="w-4.5 h-4.5 text-indigo-500" />}
            </button>

            {/* Notification bell dropdown trigger */}
            {user && (
              <div className="relative shrink-0" ref={notifRef}>
                <button
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    setProfileOpen(false);
                  }}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent transition-all cursor-pointer relative"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white dark:border-dark-bg shadow-md animate-ping" />
                  )}
                </button>

                {/* Notifications Dropdown card */}
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-2xl overflow-hidden z-50 py-1"
                    >
                      <div className="px-4 py-2.5 border-b border-slate-150 dark:border-dark-border/40 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">Recent Alerts</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>

                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-dark-border/40">
                        {notifications.slice(0, 3).map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              markAsRead(n.id);
                            }}
                            className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer transition-colors ${
                              n.unread ? 'bg-slate-50/40 dark:bg-slate-900/10' : ''
                            }`}
                          >
                            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-950/50 shrink-0">
                              {getNotifIcon(n.type)}
                            </div>
                            <div className="min-w-0 space-y-0.5">
                              <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{n.title}</h5>
                              <p className="text-[10px] text-slate-450 dark:text-slate-400 font-light line-clamp-2 leading-relaxed">{n.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Link
                        to="/notifications"
                        onClick={() => setNotifOpen(false)}
                        className="block text-center py-2.5 border-t border-slate-100 dark:border-dark-border/45 text-[11px] font-bold text-medical-teal hover:underline bg-slate-50/30 dark:bg-slate-950/10"
                      >
                        View All Notifications
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Profile Dropdown trigger */}
            {user ? (
              <div className="relative shrink-0" ref={profileRef}>
                <button
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotifOpen(false);
                  }}
                  className="flex items-center gap-1.5 p-1 rounded-full border border-transparent hover:border-slate-200 dark:hover:border-dark-border hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
                  <ChevronDown className="w-4 h-4 text-slate-550 dark:text-slate-400" />
                </button>

                {/* Profile menu dropdown card */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-2xl overflow-hidden z-50 py-1"
                    >
                      {/* Name Card header */}
                      <div className="p-4 border-b border-slate-150 dark:border-dark-border/45 bg-slate-50/50 dark:bg-slate-950/20">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">{user.name}</h4>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500 truncate mt-0.5">{user.email}</p>
                      </div>

                      {/* Options links */}
                      <div className="py-1">
                        <Link 
                          to="/profile" 
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-650 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                          <User className="w-4 h-4 text-medical-teal" />
                          Clinical Profile
                        </Link>
                        <Link 
                          to="/vault" 
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-650 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                          <Award className="w-4 h-4 text-medical-emerald" />
                          Certificate Vault
                        </Link>
                        <Link 
                          to="/settings" 
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-650 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                          <Settings className="w-4 h-4 text-medical-blue" />
                          Portal Settings
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 dark:border-dark-border/45 pt-1 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-500 hover:bg-rose-50/30 dark:hover:bg-rose-500/10 cursor-pointer font-semibold"
                        >
                          <LogOut className="w-4 h-4 shrink-0" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login" className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                  Sign In
                </Link>
                <Link to="/signup" className="px-4 h-8 bg-gradient-to-r from-medical-teal to-medical-emerald rounded-lg text-xs font-semibold text-white flex items-center justify-center shadow shadow-medical-teal/10 hover:opacity-90">
                  Join
                </Link>
              </div>
            )}

            {/* Mobile Hamburger menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-505 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent transition-all cursor-pointer"
            >
              {mobileOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>

          </div>
        </div>
      </div>

      {/* 5. MOBILE FULL-SCREEN MENU DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card transition-colors duration-300"
          >
            <div className="px-4 pt-3 pb-6 space-y-4">
              
              {/* Search bar inside mobile menu */}
              <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-100 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl">
                <Search className="w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search opportunities..."
                  className="bg-transparent border-none text-xs text-slate-800 dark:text-slate-350 focus:outline-none w-full"
                />
              </div>

              {/* Navigation links inside mobile menu */}
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive 
                          ? 'bg-medical-teal/10 text-medical-teal' 
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <hr className="border-slate-100 dark:border-dark-border my-2" />

              {/* Profile links inside mobile menu */}
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-3">
                    <img src={user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</h4>
                      <p className="text-[10px] text-slate-500">{user.role}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <Link 
                      to="/profile" 
                      onClick={() => setMobileOpen(false)}
                      className="py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-dark-border rounded-xl text-slate-700 dark:text-slate-300 font-semibold"
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/vault" 
                      onClick={() => setMobileOpen(false)}
                      className="py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-dark-border rounded-xl text-slate-700 dark:text-slate-300 font-semibold"
                    >
                      Vault
                    </Link>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-500/20 text-rose-500 text-sm font-semibold hover:bg-rose-500/5 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link 
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 text-sm font-semibold"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-medical-teal to-medical-emerald text-white text-sm font-semibold shadow shadow-medical-teal/10"
                  >
                    Join MedNova
                  </Link>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
};
export default Navbar;
