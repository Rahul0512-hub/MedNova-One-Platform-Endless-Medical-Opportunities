import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { 
  Bell, BellOff, Check, X, Calendar, Microscope, Briefcase, 
  Info, Search, Trash2, SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Notifications = () => {
  const { 
    notifications, 
    unreadCount, 
    markAllAsRead, 
    markAsRead, 
    clearNotification,
    clearAllNotifications,
    clearReadNotifications
  } = useNotifications();

  // Filters and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Unread'
  const [categoryFilter, setCategoryFilter] = useState('All'); // 'All' | 'Events' | 'Opportunities' | 'Research' | 'System'
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] = useState(false);

  // Filter logic
  const filtered = notifications.filter(n => {
    // 1. Status Filter
    if (statusFilter === 'Unread' && !n.unread) return false;
    
    // 2. Category Filter
    if (categoryFilter !== 'All') {
      const type = n.type?.toLowerCase();
      if (categoryFilter === 'Events' && type !== 'event') return false;
      if (categoryFilter === 'Opportunities' && type !== 'application' && type !== 'opportunities' && type !== 'opportunity') return false;
      if (categoryFilter === 'Research' && type !== 'research') return false;
      if (categoryFilter === 'System' && type !== 'system') return false;
    }
    
    // 3. Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const titleMatches = n.title?.toLowerCase().includes(q);
      const msgMatches = n.message?.toLowerCase().includes(q);
      if (!titleMatches && !msgMatches) return false;
    }
    
    return true;
  });

  // Icon mapping helper
  const getIcon = (type) => {
    const iconClass = "w-4.5 h-4.5";
    switch (type?.toLowerCase()) {
      case 'event':
        return <Calendar className={`${iconClass} text-medical-teal`} />;
      case 'application':
      case 'opportunities':
      case 'opportunity':
        return <Briefcase className={`${iconClass} text-medical-blue`} />;
      case 'research':
        return <Microscope className={`${iconClass} text-medical-emerald`} />;
      default:
        return <Info className={`${iconClass} text-purple-550 dark:text-purple-400`} />;
    }
  };

  // Color mapping helper for category badges/accents
  const getCategoryTheme = (type) => {
    switch (type?.toLowerCase()) {
      case 'event':
        return {
          bg: 'bg-medical-teal/10 border-medical-teal/20 text-medical-teal',
          border: 'border-l-4 border-l-medical-teal',
          label: 'Event'
        };
      case 'application':
      case 'opportunities':
      case 'opportunity':
        return {
          bg: 'bg-medical-blue/10 border-medical-blue/20 text-medical-blue',
          border: 'border-l-4 border-l-medical-blue',
          label: 'Opportunity'
        };
      case 'research':
        return {
          bg: 'bg-medical-emerald/10 border-medical-emerald/20 text-medical-emerald',
          border: 'border-l-4 border-l-medical-emerald',
          label: 'Research'
        };
      default:
        return {
          bg: 'bg-purple-550/10 border-purple-550/20 text-purple-500',
          border: 'border-l-4 border-l-purple-500',
          label: 'System'
        };
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCategoryFilter('All');
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-200">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-64 h-64 bg-medical-teal/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 z-10 text-left">
          <h2 className="text-xl sm:text-2xl font-display font-black text-slate-850 dark:text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-medical-teal animate-swing" />
            Clinical Alerts Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light max-w-xl">
            Monitor real-time updates on residency applications, mentorship proposals, system certifications, and event schedules.
          </p>
        </div>

        {/* Global actions and counts */}
        <div className="flex flex-wrap gap-2.5 shrink-0 z-10 w-full md:w-auto">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4.5 py-2 bg-gradient-to-r from-medical-teal to-medical-emerald text-white rounded-xl text-xs font-bold shadow-md shadow-medical-teal/10 hover:opacity-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Mark All Read
            </button>
          )}

          {notifications.length > 0 && (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setShowConfirmClear(true);
                  setShowConfirmDeleteAll(false);
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:border-rose-350 dark:hover:border-rose-900/60 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Read
              </button>

              <button
                onClick={() => {
                  setShowConfirmDeleteAll(true);
                  setShowConfirmClear(false);
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:border-rose-350 dark:hover:border-rose-900/60 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Delete All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <AnimatePresence>
        {showConfirmClear && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 text-left"
          >
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-350">
                Are you sure you want to delete all read alerts? This action is permanent.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={() => {
                  clearReadNotifications();
                  setShowConfirmClear(false);
                }} 
                className="px-3 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-bold cursor-pointer"
              >
                Yes, Clear Read
              </button>
              <button 
                onClick={() => setShowConfirmClear(false)} 
                className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-lg text-[10px] font-bold cursor-pointer text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {showConfirmDeleteAll && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 text-left"
          >
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-rose-500 shrink-0" />
              <p className="text-xs font-semibold text-slate-750 dark:text-slate-350">
                Are you sure you want to delete ALL notifications? This will clear your entire inbox.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={() => {
                  clearAllNotifications();
                  setShowConfirmDeleteAll(false);
                }} 
                className="px-3 py-1 bg-rose-500 text-white rounded-lg text-[10px] font-bold cursor-pointer"
              >
                Yes, Delete All
              </button>
              <button 
                onClick={() => setShowConfirmDeleteAll(false)} 
                className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-lg text-[10px] font-bold cursor-pointer text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Controls Panel */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-3xl shadow-sm space-y-4 text-left">
        
        {/* Row 1: Search & Status Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Keyword Search */}
          <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2 bg-slate-50 dark:bg-[#080d16] border border-slate-200 dark:border-dark-border rounded-2xl focus-within:border-medical-teal transition-all">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by keyword, hospital name, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-800 dark:text-slate-300 placeholder-slate-450 dark:placeholder-slate-500 focus:outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-300">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status filter toggles */}
          <div className="flex items-center bg-slate-50 dark:bg-[#080d16] p-1 border border-slate-200 dark:border-dark-border rounded-2xl shrink-0 self-start md:self-auto">
            {['All', 'Unread'].map((t) => (
              <button
                key={t}
                onClick={() => setStatusFilter(t)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === t
                    ? 'bg-white dark:bg-dark-card shadow-sm text-medical-teal border border-slate-150 dark:border-dark-border'
                    : 'bg-transparent text-slate-450 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
                }`}
              >
                {t} ({t === 'All' ? notifications.length : notifications.filter(n => n.unread).length})
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Category Filter Pills */}
        <div className="border-t border-slate-100 dark:border-dark-border/40 pt-3 flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3 h-3" />
            Filter by Clinical Category
          </span>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'All', label: 'All Categories', icon: SlidersHorizontal },
              { id: 'Events', label: 'Events', icon: Calendar },
              { id: 'Opportunities', label: 'Opportunities', icon: Briefcase },
              { id: 'Research', label: 'Research', icon: Microscope },
              { id: 'System', label: 'System', icon: Info },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-medical-teal/10 border-medical-teal/30 text-medical-teal dark:bg-medical-teal/15 font-bold'
                      : 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-dark-border/80 text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Notifications Stream list */}
      <div className="space-y-4 text-left">
        <AnimatePresence initial={false}>
          {filtered.length > 0 ? (
            filtered.map((n) => {
              const theme = getCategoryTheme(n.type);
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, height: 0, y: 15 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div 
                    className={`p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-250 dark:border-dark-border transition-all flex items-start justify-between gap-4 ${
                      n.unread 
                        ? `${theme.border} bg-white shadow-sm ring-1 ring-slate-100/50 dark:ring-transparent` 
                        : 'opacity-70 dark:opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      {/* Icon badge */}
                      <div className={`p-2.5 rounded-xl shrink-0 border ${theme.bg}`}>
                        {getIcon(n.type)}
                      </div>

                      {/* Text details */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-850 dark:text-slate-200 truncate pr-1">
                            {n.title}
                          </h4>
                          {n.unread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-medical-teal animate-pulse shrink-0" />
                          )}
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider shrink-0 ${theme.bg}`}>
                            {theme.label}
                          </span>
                        </div>
                        
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed pr-2">
                          {n.message}
                        </p>
                        
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block pt-1 font-light">
                          {n.time}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {n.unread && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-500 hover:text-medical-emerald hover:border-medical-emerald/30 transition-all cursor-pointer"
                          title="Mark as Read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => clearNotification(n.id)}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-500 hover:text-rose-500 hover:border-rose-500/30 transition-all cursor-pointer"
                        title="Delete Alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })
          ) : (
            // Empty State
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-3xl"
            >
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-150 dark:border-dark-border/40">
                <BellOff className="w-8 h-8 text-slate-400 dark:text-slate-650" />
              </div>
              <h4 className="text-sm font-bold text-slate-750 dark:text-slate-350">
                {notifications.length === 0 ? 'Your Alert Ledger is Empty' : 'No Matching Alerts'}
              </h4>
              <p className="text-xs text-slate-450 dark:text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed font-light">
                {notifications.length === 0 
                  ? 'All quiet! System security updates and rotation schedules will appear here.'
                  : 'We couldn\'t find any alerts that matched your active filters or keywords.'}
              </p>
              {notifications.length > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-xl text-xs font-bold text-slate-650 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                >
                  Reset Active Filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
export default Notifications;
