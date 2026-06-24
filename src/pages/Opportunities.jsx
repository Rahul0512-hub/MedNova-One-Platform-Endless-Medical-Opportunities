import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockOpportunities } from '../data/mockData';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  }
};
import { useNotifications } from '../hooks/useNotifications';
import { 
  Search, Briefcase, MapPin, DollarSign, Filter, CheckCircle2, 
  Grid, List, ChevronLeft, ChevronRight, Bookmark, 
  Calendar, RotateCcw
} from 'lucide-react';

export const Opportunities = () => {
  const { addNotification } = useNotifications();

  // Search, Filter, Sort and Layout States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedWorkplace, setSelectedWorkplace] = useState('All');
  const [selectedCompensation, setSelectedCompensation] = useState('All');
  const [selectedDeadline, setSelectedDeadline] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isGridView, setIsGridView] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  // Local Save / Apply States (persisted via localStorage)
  const [savedIds, setSavedIds] = useState(() => {
    const saved = localStorage.getItem('mednova_saved_opps');
    return saved ? JSON.parse(saved) : ['opp-2'];
  });
  const [appliedIds, setAppliedIds] = useState(() => {
    const applied = localStorage.getItem('mednova_applied_opps');
    return applied ? JSON.parse(applied) : [];
  });

  // Extract unique locations from dataset
  const locations = ['All', 'MN', 'PA', 'NY', 'CA', 'MA', 'MD', 'Geneva'];
  const categories = ['All', 'Residency', 'Fellowship', 'Research', 'Attending'];
  const workplaces = ['All', 'On-site', 'Hybrid', 'Remote'];
  const compensations = ['All', 'Paid', 'Unpaid'];
  const deadlines = ['All', 'Open', 'Closed'];

  // Reset page to 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLocation, selectedWorkplace, selectedCompensation, selectedDeadline, sortBy]);

  // Handle bookmarking
  const handleToggleSave = (opp) => {
    const isSaved = savedIds.includes(opp.id);
    let nextSaved;
    if (isSaved) {
      nextSaved = savedIds.filter(id => id !== opp.id);
      addNotification("Opportunity Unsaved", `Removed '${opp.title}' from your saved list.`, "system");
    } else {
      nextSaved = [...savedIds, opp.id];
      addNotification("Opportunity Bookmarked", `Saved '${opp.title}' to your saved list.`, "system");
    }
    setSavedIds(nextSaved);
    localStorage.setItem('mednova_saved_opps', JSON.stringify(nextSaved));
  };

  // Handle application submission
  const handleApply = (opp) => {
    if (appliedIds.includes(opp.id)) return;
    const nextApplied = [...appliedIds, opp.id];
    setAppliedIds(nextApplied);
    localStorage.setItem('mednova_applied_opps', JSON.stringify(nextApplied));
    addNotification("Application Submitted", `Credentials successfully sent for '${opp.title}'.`, "application");
  };

  // Clear all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSelectedWorkplace('All');
    setSelectedCompensation('All');
    setSelectedDeadline('All');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Filter logic
  const filteredOpps = mockOpportunities.filter(opp => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || opp.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesWorkplace = selectedWorkplace === 'All' || opp.workplaceType === selectedWorkplace;
    const matchesCompensation = 
      selectedCompensation === 'All' || 
      (selectedCompensation === 'Paid' && opp.isPaid) || 
      (selectedCompensation === 'Unpaid' && !opp.isPaid);

    // Current date set to 2026-06-24
    const currentDate = "2026-06-24";
    const matchesDeadline = 
      selectedDeadline === 'All' || 
      (selectedDeadline === 'Open' && opp.deadline >= currentDate) || 
      (selectedDeadline === 'Closed' && opp.deadline < currentDate);

    return matchesSearch && matchesCategory && matchesLocation && matchesWorkplace && matchesCompensation && matchesDeadline;
  });

  // Sorting logic
  const sortedOpps = [...filteredOpps].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.postedDate) - new Date(a.postedDate);
    }
    if (sortBy === 'oldest') {
      return new Date(a.postedDate) - new Date(b.postedDate);
    }
    if (sortBy === 'popular') {
      return b.popularity - a.popularity;
    }
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedOpps.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOpps = sortedOpps.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Active filter count (excluding 'All' values)
  const activeFiltersCount = 
    (selectedCategory !== 'All' ? 1 : 0) + 
    (selectedLocation !== 'All' ? 1 : 0) + 
    (selectedWorkplace !== 'All' ? 1 : 0) + 
    (selectedCompensation !== 'All' ? 1 : 0) + 
    (selectedDeadline !== 'All' ? 1 : 0) +
    (searchQuery !== '' ? 1 : 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-dark-border pb-5 text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">Clinical Opportunities</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light mt-1">Explore medical residency slots, fellowships, and clinical trials vacancies</p>
        </div>
        
        {/* Layout grid/list toggle & stats */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-between">
          <span className="text-xs text-slate-500 font-light mr-2 hidden sm:inline">
            Showing {sortedOpps.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + ITEMS_PER_PAGE, sortedOpps.length)} of {sortedOpps.length} results
          </span>
          <div className="flex items-center bg-slate-100 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border p-1 rounded-xl shrink-0">
            <button 
              onClick={() => setIsGridView(true)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${isGridView ? 'bg-white dark:bg-dark-card text-medical-teal shadow-sm' : 'text-slate-450 hover:text-slate-800 dark:hover:text-slate-200'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsGridView(false)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${!isGridView ? 'bg-white dark:bg-dark-card text-medical-teal shadow-sm' : 'text-slate-450 hover:text-slate-800 dark:hover:text-slate-200'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. CORE EXPLORER LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* A. SIDEBAR FILTERS (Desktop) */}
        <div className="hidden lg:block lg:col-span-1 space-y-6 text-left shrink-0">
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-2xl space-y-6 transition-colors duration-300">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-dark-border/40">
              <span className="text-sm font-display font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-medical-teal" />
                Filters
              </span>
              {activeFiltersCount > 0 && (
                <button 
                  onClick={handleResetFilters}
                  className="text-[10px] text-rose-500 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Specialty Category</label>
              <div className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedCategory === cat 
                        ? 'bg-medical-teal/10 text-medical-teal' 
                        : 'text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    {cat === 'All' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Workplace type Filter */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Workplace Mode</label>
              <div className="flex flex-col gap-1">
                {workplaces.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWorkplace(w)}
                    className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedWorkplace === w 
                        ? 'bg-medical-teal/10 text-medical-teal' 
                        : 'text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    {w === 'All' ? 'All Modes' : w}
                  </button>
                ))}
              </div>
            </div>

            {/* Location selector */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Location</label>
              <select 
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-350 p-2 rounded-xl focus:outline-none focus:border-medical-teal"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === 'All' ? 'All Locations' : loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Compensation type Filter */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Compensation</label>
              <div className="flex flex-col gap-1">
                {compensations.map((comp) => (
                  <button
                    key={comp}
                    onClick={() => setSelectedCompensation(comp)}
                    className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedCompensation === comp 
                        ? 'bg-medical-teal/10 text-medical-teal' 
                        : 'text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    {comp === 'All' ? 'All types' : comp === 'Paid' ? 'Paid Positions' : 'Unpaid / Credit'}
                  </button>
                ))}
              </div>
            </div>

            {/* Deadline Filter */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Closing Deadline</label>
              <div className="flex flex-col gap-1">
                {deadlines.map((dl) => (
                  <button
                    key={dl}
                    onClick={() => setSelectedDeadline(dl)}
                    className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedDeadline === dl 
                        ? 'bg-medical-teal/10 text-medical-teal' 
                        : 'text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    {dl === 'All' ? 'All Statuses' : dl === 'Open' ? 'Open Vacancies' : 'Closed / Expired'}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* B. MAIN LISTINGS DISPLAY (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Search bar & Sorting bar */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-stretch justify-between shadow-sm transition-colors duration-300">
            {/* Search */}
            <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl focus-within:border-medical-teal transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, hospital, or tag keywords..."
                className="bg-transparent border-none text-xs text-slate-800 dark:text-slate-350 placeholder-slate-450 dark:placeholder-slate-500 focus:outline-none w-full"
              />
            </div>

            {/* Sorting control */}
            <div className="flex items-center gap-3 justify-between md:justify-start">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-350 px-3 py-2 rounded-xl focus:outline-none focus:border-medical-teal cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>

              {/* Mobile Filter Toggle Trigger */}
              <button 
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-950 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 text-xs font-semibold cursor-pointer shrink-0"
              >
                <Filter className="w-3.5 h-3.5" />
                Filters
              </button>
            </div>
          </div>

          {/* Collapsible Mobile Filters Drawer panel */}
          {mobileFiltersOpen && (
            <div className="lg:hidden bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-2xl space-y-4 text-left shadow-lg">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-dark-border/40">
                <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Configure Filters</span>
                <div className="flex items-center gap-3">
                  {activeFiltersCount > 0 && (
                    <button 
                      onClick={handleResetFilters}
                      className="text-[10px] text-rose-500 hover:underline font-bold"
                    >
                      Clear All
                    </button>
                  )}
                  <button 
                    onClick={() => setMobileFiltersOpen(false)}
                    className="text-[10px] text-slate-400 dark:text-slate-500 hover:underline font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category select */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-450">Category</label>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full text-[11px] bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-350 p-2 rounded-lg"
                  >
                    {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                  </select>
                </div>

                {/* Workplace select */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-450">Workplace Mode</label>
                  <select 
                    value={selectedWorkplace} 
                    onChange={(e) => setSelectedWorkplace(e.target.value)}
                    className="w-full text-[11px] bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-350 p-2 rounded-lg"
                  >
                    {workplaces.map(w => <option key={w} value={w}>{w === 'All' ? 'All Modes' : w}</option>)}
                  </select>
                </div>

                {/* Location select */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-450">Location</label>
                  <select 
                    value={selectedLocation} 
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full text-[11px] bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-350 p-2 rounded-lg"
                  >
                    {locations.map(l => <option key={l} value={l}>{l === 'All' ? 'All Locations' : l}</option>)}
                  </select>
                </div>

                {/* Compensation select */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-455">Compensation</label>
                  <select 
                    value={selectedCompensation} 
                    onChange={(e) => setSelectedCompensation(e.target.value)}
                    className="w-full text-[11px] bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-350 p-2 rounded-lg"
                  >
                    {compensations.map(c => <option key={c} value={c}>{c === 'All' ? 'All types' : c === 'Paid' ? 'Paid' : 'Unpaid'}</option>)}
                  </select>
                </div>

                {/* Deadline select */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-455">Deadline Status</label>
                  <select 
                    value={selectedDeadline} 
                    onChange={(e) => setSelectedDeadline(e.target.value)}
                    className="w-full text-[11px] bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-350 p-2 rounded-lg"
                  >
                    {deadlines.map(d => <option key={d} value={d}>{d === 'All' ? 'All Statuses' : d === 'Open' ? 'Open' : 'Closed'}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Active Filter Badges */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mr-1">Active filters ({activeFiltersCount}):</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="text-rose-500 font-bold ml-1">×</button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-medical-teal/10 border border-medical-teal/20 text-[10px] font-semibold text-medical-teal">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="text-medical-teal font-bold ml-1">×</button>
                </span>
              )}
              {selectedWorkplace !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-medical-emerald/10 border border-medical-emerald/20 text-[10px] font-semibold text-medical-emerald">
                  Mode: {selectedWorkplace}
                  <button onClick={() => setSelectedWorkplace('All')} className="text-medical-emerald font-bold ml-1">×</button>
                </span>
              )}
              {selectedLocation !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-semibold text-blue-500">
                  Location: {selectedLocation}
                  <button onClick={() => setSelectedLocation('All')} className="text-blue-500 font-bold ml-1">×</button>
                </span>
              )}
              {selectedCompensation !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-semibold text-purple-400">
                  Type: {selectedCompensation}
                  <button onClick={() => setSelectedCompensation('All')} className="text-purple-400 font-bold ml-1">×</button>
                </span>
              )}
              {selectedDeadline !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-semibold text-rose-550">
                  Deadline: {selectedDeadline}
                  <button onClick={() => setSelectedDeadline('All')} className="text-rose-550 font-bold ml-1">×</button>
                </span>
              )}
            </div>
          )}

          {/* C. LISTINGS VIEWPORT (GRID or LIST) */}
          {paginatedOpps.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={isGridView ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}
            >
              {paginatedOpps.map((opp) => {
                const isSaved = savedIds.includes(opp.id);
                const hasApplied = appliedIds.includes(opp.id);

                return (
                  <motion.div 
                    layout
                    key={opp.id}
                    variants={cardVariants}
                    whileHover={{ y: -4, scale: 1.01, boxShadow: "0 12px 20px -8px rgba(0,0,0,0.04)" }}
                    className={`bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl flex transition-all duration-300 hover:border-slate-350 dark:hover:border-slate-750 hover:shadow-lg text-left relative overflow-hidden ${
                      isGridView ? "flex-col justify-between p-6 gap-5" : "flex-col md:flex-row justify-between items-start md:items-center p-5 gap-6"
                    }`}
                  >
                    
                    {/* Inner Content */}
                    <div className="space-y-2.5 flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          {opp.workplaceType}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-medical-teal/10 text-medical-teal text-[9px] font-bold uppercase tracking-wide">
                          {opp.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${
                          opp.isPaid 
                            ? 'bg-medical-emerald/5 border-medical-emerald/20 text-medical-emerald' 
                            : 'bg-slate-200/50 border-slate-300 dark:bg-slate-950 dark:border-slate-800 text-slate-650 dark:text-slate-400'
                        }`}>
                          {opp.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>

                      <h3 className="text-base font-display font-bold text-slate-900 dark:text-white leading-snug truncate">
                        {opp.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-355">{opp.organization}</p>
                      
                      {/* Stats grid line */}
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-505 dark:text-slate-400 pt-1 font-light">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-medical-teal shrink-0" />
                          {opp.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-medical-emerald shrink-0" />
                          {opp.salary}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          Deadline: {opp.deadline}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-450 dark:text-slate-500 font-light leading-relaxed pt-1 line-clamp-2">
                        {opp.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        {opp.tags.map((t) => (
                          <span key={t} className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-955 text-slate-500 dark:text-slate-450 text-[9px] font-bold rounded-full">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions Panel */}
                    <div className={`flex items-center gap-2 shrink-0 w-full ${isGridView ? "border-t border-slate-100 dark:border-dark-border/40 pt-4" : "md:w-auto pt-2 md:pt-0"}`}>
                      {/* Save Button */}
                      <button
                        onClick={() => handleToggleSave(opp)}
                        className={`p-2.5 border rounded-xl transition-all cursor-pointer ${
                          isSaved 
                            ? 'bg-blue-500/10 border-blue-500/35 text-blue-500' 
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-dark-border hover:border-slate-350 dark:hover:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        }`}
                        title={isSaved ? "Unsave Position" : "Bookmark Position"}
                      >
                        <Bookmark className="w-4 h-4 fill-current stroke-current" />
                      </button>

                      {/* View Details Link */}
                      <Link 
                        to={`/opportunities/${opp.id}`}
                        className="px-3.5 py-2.5 border border-slate-200 dark:border-dark-border bg-white hover:bg-slate-100 dark:bg-slate-955 hover:border-slate-300 dark:hover:border-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold text-center block transition-all"
                      >
                        Details
                      </Link>

                      {/* Apply Button */}
                      {hasApplied ? (
                        <button
                          disabled
                          className="flex-grow flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-medical-emerald bg-medical-emerald/10 text-medical-emerald text-xs font-bold md:w-32 cursor-default"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Applied
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApply(opp)}
                          className="flex-grow px-4 py-2.5 rounded-xl bg-gradient-to-r from-medical-teal to-medical-emerald hover:opacity-95 text-xs font-bold text-white shadow-md shadow-medical-teal/10 transition-all cursor-pointer text-center md:w-32"
                        >
                          Apply Now
                        </button>
                      )}
                    </div>

                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-dark-card border border-slate-250 dark:border-dark-border rounded-2xl space-y-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-dark-border rounded-full w-fit mx-auto text-slate-400">
                <Briefcase className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="text-sm font-display font-bold text-slate-850 dark:text-slate-200">No medical opportunities found</h4>
                <p className="text-xs text-slate-450 dark:text-slate-500 font-light leading-relaxed">
                  No listings matched your active search query or filter settings. Click below to reset preferences.
                </p>
              </div>
              <button 
                onClick={handleResetFilters}
                className="px-4 py-2 border border-slate-200 dark:border-dark-border hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* D. PAGINATION NAVIGATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4 select-none">
              
              {/* Prev button */}
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 border rounded-xl transition-all ${
                  currentPage === 1 
                    ? 'border-slate-200 dark:border-slate-850 text-slate-300 dark:text-slate-700 cursor-default' 
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-350 cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Number buttons */}
              {Array.from({ length: totalPages }, (_, idx) => {
                const pageNum = idx + 1;
                const isCurrent = pageNum === currentPage;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isCurrent 
                        ? 'bg-medical-teal border-medical-teal text-white shadow shadow-medical-teal/15' 
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next button */}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 border rounded-xl transition-all ${
                  currentPage === totalPages 
                    ? 'border-slate-200 dark:border-slate-850 text-slate-300 dark:text-slate-700 cursor-default' 
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-350 cursor-pointer'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
