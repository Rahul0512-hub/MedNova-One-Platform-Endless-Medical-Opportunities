import React, { useState, useMemo } from 'react';
import { mockEvents } from '../data/mockData';
import { useNotifications } from '../hooks/useNotifications';
import { 
  Calendar, User, Clock, MapPin, Search, CheckCircle2, BookmarkCheck,
  Grid, CalendarDays, ChevronLeft, ChevronRight, X, Info,
  AlertCircle, CalendarRange
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Events = () => {
  const { addNotification } = useNotifications();

  // 1. Persistence - Load registered events from localStorage or fall back to mockData defaults
  const [registeredIds, setRegisteredIds] = useState(() => {
    const saved = localStorage.getItem('mednova_registered_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse registered events from localStorage", e);
      }
    }
    const initial = mockEvents.filter(ev => ev.registered).map(ev => ev.id);
    localStorage.setItem('mednova_registered_events', JSON.stringify(initial));
    return initial;
  });

  // 2. Active filters and layout states
  const [timeTab, setTimeTab] = useState('Upcoming'); // 'Upcoming' or 'Past'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (Card View) or 'calendar' (Calendar View)
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All'); // 'All', 'Conference', 'Workshop', 'Webinar'
  const [registrationFilter, setRegistrationFilter] = useState('All'); // 'All', 'Registered Only'
  const [sortBy, setSortBy] = useState('Newest'); // 'Newest' or 'Oldest'

  // 3. Calendar View Date Navigation (Defaulting to July 2026 to show July's dense schedule)
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 6, 1));
  const [selectedDayISO, setSelectedDayISO] = useState(null);

  // Toggle registration RSVP
  const handleToggleRegister = (id, title) => {
    setRegisteredIds(prev => {
      const isReg = prev.includes(id);
      let updated;
      if (isReg) {
        updated = prev.filter(item => item !== id);
        addNotification(
          "RSVP Cancelled",
          `Successfully cancelled your registration for '${title}'.`,
          "system"
        );
      } else {
        updated = [...prev, id];
        addNotification(
          "Event Registration Confirmed",
          `Successfully registered for '${title}'. Calendar invite has been sent.`,
          "event"
        );
      }
      localStorage.setItem('mednova_registered_events', JSON.stringify(updated));
      return updated;
    });
  };

  // 4. Filtering and Sorting logic (with system date anchored to 2026-06-24)
  const filteredEvents = useMemo(() => {
    return mockEvents.filter(ev => {
      // Time Tab Filter (Upcoming vs Past relative to anchor date 2026-06-24)
      const isUpcoming = ev.dateISO >= '2026-06-24';
      if (timeTab === 'Upcoming' && !isUpcoming) return false;
      if (timeTab === 'Past' && isUpcoming) return false;

      // Category Filter
      if (categoryFilter !== 'All' && ev.category !== categoryFilter) return false;

      // Registration Filter
      const isReg = registeredIds.includes(ev.id);
      if (registrationFilter === 'Registered' && !isReg) return false;

      // Search Query Match (Title, host, speaker, location, or description)
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matches = 
          ev.title.toLowerCase().includes(query) ||
          ev.host.toLowerCase().includes(query) ||
          ev.speaker.toLowerCase().includes(query) ||
          ev.location.toLowerCase().includes(query) ||
          ev.description.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [timeTab, categoryFilter, registrationFilter, searchTerm, registeredIds]);

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      if (sortBy === 'Newest') {
        return b.dateISO.localeCompare(a.dateISO);
      } else {
        return a.dateISO.localeCompare(b.dateISO);
      }
    });
  }, [filteredEvents, sortBy]);

  // 5. Calendar Layout Calculations
  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    
    // First day of target month
    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Total days in target month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Total days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month padding cells
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateISO = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dayNum,
        dateISO,
        isCurrentMonth: false,
      });
    }
    
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateISO = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNum: d,
        dateISO,
        isCurrentMonth: true,
      });
    }
    
    // Next month padding cells to fill exactly 42 slots (6 rows of 7 columns)
    const totalSlots = 42;
    const nextPadding = totalSlots - days.length;
    for (let d = 1; d <= nextPadding; d++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateISO = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNum: d,
        dateISO,
        isCurrentMonth: false,
      });
    }
    
    return days;
  }, [calendarDate]);

  const monthName = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCalendarDate(prev => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      return month === 0 ? new Date(year - 1, 11, 1) : new Date(year, month - 1, 1);
    });
  };

  const handleNextMonth = () => {
    setCalendarDate(prev => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      return month === 11 ? new Date(year + 1, 0, 1) : new Date(year, month + 1, 1);
    });
  };

  const resetToDefaultMonth = () => {
    setCalendarDate(new Date(2026, 6, 1));
  };

  // Convert "2026-07-12" to human-readable date in selected cell modal
  const formatISOToReadable = (isoString) => {
    if (!isoString) return '';
    const [y, m, d] = isoString.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Style categories helper
  const getCategoryStyles = (category) => {
    switch (category) {
      case 'Conference':
        return {
          pill: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-500/20',
          dot: 'bg-teal-500',
          badge: 'bg-teal-500/15 text-teal-500 border border-teal-500/30'
        };
      case 'Workshop':
        return {
          pill: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
          dot: 'bg-emerald-500',
          badge: 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
        };
      case 'Webinar':
      default:
        return {
          pill: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-500/20',
          dot: 'bg-sky-500',
          badge: 'bg-sky-500/15 text-sky-500 border border-sky-500/30'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-[#111c30] border border-dark-border p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.08),transparent_45%)]" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-medical-teal animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-medical-teal">Clinical Portals</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Medical Events & Webinars
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light max-w-xl">
            Expand your medical knowledge, participate in simulation workshops, and log CME hours. All registered events automatically secure invitations inside your portal calendar.
          </p>
        </div>

        {/* View Mode and Time Frame Toggles */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-xl p-1 shrink-0">
            <button
              onClick={() => setTimeTab('Upcoming')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                timeTab === 'Upcoming'
                  ? 'bg-white dark:bg-dark-card text-medical-teal shadow-sm border border-slate-200/50 dark:border-dark-border'
                  : 'text-slate-450 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setTimeTab('Past')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                timeTab === 'Past'
                  ? 'bg-white dark:bg-dark-card text-medical-teal shadow-sm border border-slate-200/50 dark:border-dark-border'
                  : 'text-slate-450 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Past
            </button>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded-xl p-1 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-dark-card text-medical-teal shadow-sm border border-slate-200/50 dark:border-dark-border'
                  : 'text-slate-450 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              title="Calendar View"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-dark-card text-medical-teal shadow-sm border border-slate-200/50 dark:border-dark-border'
                  : 'text-slate-450 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Search & Filters Container */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-2xl shadow-sm transition-all duration-300">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch justify-between">
          {/* Search bar */}
          <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl focus-within:border-medical-teal transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by event title, hosts, speakers, locations, description..."
              className="bg-transparent border-none text-xs text-slate-850 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none w-full"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="cursor-pointer">
                <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-250" />
              </button>
            )}
          </div>

          {/* Selector options */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category selection */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Category</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl focus:outline-none focus:border-medical-teal cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Conference">Conferences</option>
                <option value="Workshop">Workshops</option>
                <option value="Webinar">Webinars</option>
              </select>
            </div>

            {/* Registration state */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">RSVP</span>
              <select
                value={registrationFilter}
                onChange={(e) => setRegistrationFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl focus:outline-none focus:border-medical-teal cursor-pointer"
              >
                <option value="All">All Events</option>
                <option value="Registered">Registered Only</option>
              </select>
            </div>

            {/* Sorting (List View only) */}
            {viewMode === 'grid' && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl focus:outline-none focus:border-medical-teal cursor-pointer"
                >
                  <option value="Newest">Newest Date</option>
                  <option value="Oldest">Oldest Date</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Views Grid & Animations */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          // GRID CARD LAYOUT
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedEvents.length > 0 ? (
              sortedEvents.map((ev) => {
                const isRegistered = registeredIds.includes(ev.id);
                const colors = getCategoryStyles(ev.category);
                return (
                  <motion.div 
                    key={ev.id} 
                    layoutId={`card-${ev.id}`}
                    className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl overflow-hidden hover:border-slate-350 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
                  >
                    {/* Event Banner Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-800">
                      <img 
                        src={ev.image} 
                        alt={ev.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                      />
                      <span className={`absolute top-3 left-3 px-2 py-0.5 backdrop-blur-md rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${colors.badge}`}>
                        {ev.category}
                      </span>
                    </div>

                    {/* Event Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-5 text-left">
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                          <span>Hosted by:</span>
                          <span className="text-slate-650 dark:text-slate-300 truncate max-w-[180px]">{ev.host}</span>
                        </div>
                        <h3 className="text-base font-display font-bold text-slate-850 dark:text-white leading-snug line-clamp-2">
                          {ev.title}
                        </h3>
                        
                        <div className="space-y-1.5 text-xs text-slate-550 dark:text-slate-400 pt-1 font-light">
                          <p className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-medical-teal shrink-0" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">{ev.date}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-medical-teal shrink-0" />
                            <span>{ev.time}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-medical-teal shrink-0" />
                            <span className="truncate">{ev.location}</span>
                          </p>
                          <p className="flex items-center gap-2 pt-1 font-medium text-slate-600 dark:text-slate-300">
                            <User className="w-3.5 h-3.5 text-medical-emerald shrink-0" />
                            <span className="truncate">Speaker: {ev.speaker}</span>
                          </p>
                        </div>
                        
                        <p className="text-[11px] text-slate-450 dark:text-slate-500 font-light line-clamp-2 leading-relaxed border-t border-slate-100 dark:border-dark-border/40 pt-2.5">
                          {ev.description}
                        </p>
                      </div>

                      {/* Action controls */}
                      <div className="pt-2">
                        {isRegistered ? (
                          <button
                            onClick={() => handleToggleRegister(ev.id, ev.title)}
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-medical-emerald/10 border border-medical-emerald/20 text-medical-emerald hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 text-xs font-bold transition-all cursor-pointer relative group-button"
                          >
                            <BookmarkCheck className="w-4 h-4 text-current" />
                            <span className="inline group-hover:hidden">Registered RSVP</span>
                            <span className="hidden group-hover:inline">Cancel RSVP</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleRegister(ev.id, ev.title)}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-medical-teal to-medical-emerald hover:opacity-95 text-xs font-bold text-white shadow-md shadow-medical-teal/10 hover:shadow-medical-teal/15 transition-all cursor-pointer text-center"
                          >
                            Register & Reserve Spot
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-3xl">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No Events Match Your Filters</h4>
                <p className="text-xs text-slate-450 dark:text-slate-550 mt-1 max-w-sm mx-auto">
                  Try clearing your search query or adjusting your filters for Category or RSVP status to find events.
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          // CALENDAR GRID VIEW
          <motion.div
            key="calendar-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Calendar Controls */}
            <div className="flex items-center justify-between bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <CalendarRange className="w-5 h-5 text-medical-teal" />
                <h2 className="text-base font-display font-bold text-slate-850 dark:text-white">
                  {monthName}
                </h2>
                {monthName !== "July 2026" && (
                  <button 
                    onClick={resetToDefaultMonth}
                    className="text-[10px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-500 hover:text-medical-teal px-2 py-1 rounded-lg cursor-pointer transition-all"
                  >
                    Reset to July 2026
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-xl border border-slate-250 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-all"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-xl border border-slate-250 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-all"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid Container */}
            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-3xl p-3 sm:p-5 shadow-sm overflow-x-auto min-w-[700px] md:min-w-0">
              <div className="grid grid-cols-7 gap-2">
                {/* Weekday headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 py-2">
                    {day}
                  </div>
                ))}

                {/* Day cells */}
                {calendarDays.map((cell, idx) => {
                  const dayEvents = filteredEvents.filter(ev => ev.dateISO === cell.dateISO);
                  const isToday = cell.dateISO === '2026-06-24'; // Anchored today date
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDayISO(cell.dateISO)}
                      className={`aspect-square md:aspect-[1.3/1] p-2 md:p-3 border rounded-2xl flex flex-col justify-between transition-all select-none relative group cursor-pointer ${
                        cell.isCurrentMonth
                          ? 'bg-white dark:bg-[#0c121e]/40 border-slate-150 dark:border-dark-border/80 hover:border-medical-teal hover:shadow-sm'
                          : 'bg-slate-50/40 dark:bg-slate-900/10 border-slate-200/20 dark:border-dark-border/20 text-slate-350 dark:text-slate-700'
                      } ${
                        isToday 
                          ? 'ring-2 ring-medical-teal ring-offset-2 dark:ring-offset-[#090d16] bg-medical-teal/5 border-medical-teal/40' 
                          : ''
                      }`}
                    >
                      {/* Day number with Today highlight */}
                      <div className="flex justify-between items-start">
                        {isToday ? (
                          <span className="w-5.5 h-5.5 rounded-full bg-medical-teal text-white flex items-center justify-center text-[10px] font-bold" title="Today (Platform Anchor)">
                            {cell.dayNum}
                          </span>
                        ) : (
                          <span className={`text-xs md:text-sm font-semibold ${
                            cell.isCurrentMonth 
                              ? 'text-slate-800 dark:text-slate-200' 
                              : 'text-slate-400 dark:text-slate-600'
                          }`}>
                            {cell.dayNum}
                          </span>
                        )}
                        
                        {/* Event count count on mobile */}
                        {dayEvents.length > 0 && (
                          <span className="md:hidden w-1.5 h-1.5 rounded-full bg-medical-teal" />
                        )}
                      </div>

                      {/* Event Listing inside Cell (Desktop view) */}
                      <div className="hidden md:flex flex-col gap-1 w-full overflow-hidden mt-1.5">
                        {dayEvents.slice(0, 2).map(ev => {
                          const isReg = registeredIds.includes(ev.id);
                          const categoryStyle = getCategoryStyles(ev.category);
                          return (
                            <div
                              key={ev.id}
                              className={`text-[9px] truncate px-1.5 py-0.5 rounded border w-full flex items-center gap-1 font-medium transition-all ${categoryStyle.pill}`}
                              title={ev.title}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${categoryStyle.dot} ${isReg ? 'animate-pulse' : ''}`} />
                              <span className="truncate">{ev.title}</span>
                              {isReg && <CheckCircle2 className="w-2.5 h-2.5 text-medical-emerald shrink-0 ml-auto" />}
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-[8px] text-slate-400 dark:text-slate-500 font-semibold pl-1">
                            + {dayEvents.length - 2} more
                          </div>
                        )}
                      </div>

                      {/* Event dots for medium/mobile viewport */}
                      <div className="hidden sm:flex md:hidden flex-row gap-1 justify-center mt-1">
                        {dayEvents.map(ev => {
                          const categoryStyle = getCategoryStyles(ev.category);
                          return (
                            <span 
                              key={ev.id} 
                              className={`w-1 h-1 rounded-full ${categoryStyle.dot}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Calendar Event Details Modal */}
      <AnimatePresence>
        {selectedDayISO && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            {/* Modal backdrop closer */}
            <div className="absolute inset-0" onClick={() => setSelectedDayISO(null)} />
            
            {/* Modal box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-dark-border rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl relative z-10 p-6 sm:p-8 text-left"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedDayISO(null)}
                className="absolute top-5 right-5 p-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-450 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal header */}
              <div className="border-b border-slate-100 dark:border-dark-border/40 pb-4 mb-6">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Schedule Details
                </span>
                <h3 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white mt-1">
                  {formatISOToReadable(selectedDayISO)}
                </h3>
              </div>

              {/* Modal body (Retrieve ALL events on that day, unaffected by other filters so the user sees everything on that day) */}
              <div className="space-y-6">
                {(() => {
                  const dayEvents = mockEvents.filter(ev => ev.dateISO === selectedDayISO);
                  if (dayEvents.length > 0) {
                    return (
                      <div className="space-y-4">
                        {dayEvents.map(ev => {
                          const isReg = registeredIds.includes(ev.id);
                          const categoryStyle = getCategoryStyles(ev.category);
                          return (
                            <div 
                              key={ev.id}
                              className="border border-slate-200 dark:border-dark-border rounded-2xl p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center relative overflow-hidden"
                            >
                              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-medical-teal" />
                              
                              <div className="space-y-2.5 pl-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide ${categoryStyle.badge}`}>
                                    {ev.category}
                                  </span>
                                  <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">
                                    By {ev.host}
                                  </span>
                                </div>
                                <h4 className="text-base font-display font-bold text-slate-850 dark:text-white leading-snug">
                                  {ev.title}
                                </h4>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-550 dark:text-slate-400 font-light">
                                  <span className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-medical-teal shrink-0" />
                                    {ev.time}
                                  </span>
                                  <span className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-medical-teal shrink-0" />
                                    <span className="truncate">{ev.location}</span>
                                  </span>
                                  <span className="flex items-center gap-2 sm:col-span-2 pt-1 font-semibold text-slate-700 dark:text-slate-350">
                                    <User className="w-3.5 h-3.5 text-medical-emerald shrink-0" />
                                    Speaker: {ev.speaker}
                                  </span>
                                </div>

                                <p className="text-[11px] text-slate-450 dark:text-slate-500 leading-relaxed font-light mt-2 pt-2 border-t border-slate-200/50 dark:border-dark-border/20">
                                  {ev.description}
                                </p>
                              </div>

                              <div className="shrink-0 w-full md:w-auto pt-2 md:pt-0">
                                {isReg ? (
                                  <button
                                    onClick={() => handleToggleRegister(ev.id, ev.title)}
                                    className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-medical-emerald/10 border border-medical-emerald/20 text-medical-emerald hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 text-xs font-bold transition-all cursor-pointer"
                                  >
                                    <BookmarkCheck className="w-4 h-4" />
                                    <span>Registered</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleToggleRegister(ev.id, ev.title)}
                                    className="w-full md:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-medical-teal to-medical-emerald hover:opacity-95 text-xs font-bold text-white shadow-md shadow-medical-teal/10 transition-all cursor-pointer text-center"
                                  >
                                    RSVP Now
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-dark-border rounded-2xl flex flex-col items-center justify-center space-y-3">
                        <Info className="w-8 h-8 text-slate-400" />
                        <p className="text-sm font-semibold text-slate-850 dark:text-slate-200">No Events Scheduled</p>
                        <p className="text-xs text-slate-450 dark:text-slate-500 max-w-xs leading-relaxed">
                          There are no clinical conferences, workshops, or webinars scheduled for this date. Check neighboring days or browse upcoming events list.
                        </p>
                      </div>
                    );
                  }
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

