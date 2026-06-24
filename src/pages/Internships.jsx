import React, { useState, useMemo } from 'react';
import { mockInternships } from '../data/mockData';
import { useNotifications } from '../hooks/useNotifications';
import { 
  GraduationCap, Landmark, Calendar, DollarSign, CheckCircle2,
  Search, MapPin, SlidersHorizontal, X, Clock, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Internships = () => {
  const { addNotification } = useNotifications();

  // 1. Core States
  const [searchTerm, setSearchTerm] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [durationFilter, setDurationFilter] = useState('All');
  const [compFilter, setCompFilter] = useState('All'); // 'All', 'Paid', 'Unpaid'

  // Applied rotations tracking (persisted in localStorage)
  const [appliedIds, setAppliedIds] = useState(() => {
    const saved = localStorage.getItem('mednova_applied_internships');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Action Handlers
  const handleApply = (id, title, institution) => {
    if (appliedIds.includes(id)) return;
    const updated = [...appliedIds, id];
    setAppliedIds(updated);
    localStorage.setItem('mednova_applied_internships', JSON.stringify(updated));
    
    addNotification(
      "Rotation Application Received",
      `Your application for '${title}' rotation at ${institution} was sent to the staffing coordinator.`,
      "application"
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setHospitalFilter('All');
    setLocationFilter('All');
    setDurationFilter('All');
    setCompFilter('All');
  };

  // 3. Dynamic lists for filter selectors
  const hospitals = useMemo(() => {
    return ['All', ...new Set(mockInternships.map(item => item.institution))];
  }, []);

  const locations = useMemo(() => {
    return ['All', ...new Set(mockInternships.map(item => item.location))];
  }, []);

  const durations = useMemo(() => {
    return ['All', ...new Set(mockInternships.map(item => item.duration))];
  }, []);

  // 4. Filtering Logic
  const filteredInternships = useMemo(() => {
    return mockInternships.filter((item) => {
      // Search term match
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matches = 
          item.title.toLowerCase().includes(query) ||
          item.institution.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.level.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Hospital Filter
      if (hospitalFilter !== 'All' && item.institution !== hospitalFilter) return false;

      // Location Filter
      if (locationFilter !== 'All' && item.location !== locationFilter) return false;

      // Duration Filter
      if (durationFilter !== 'All' && item.duration !== durationFilter) return false;

      // Paid / Unpaid Filter
      if (compFilter === 'Paid' && !item.isPaid) return false;
      if (compFilter === 'Unpaid' && item.isPaid) return false;

      return true;
    });
  }, [searchTerm, hospitalFilter, locationFilter, durationFilter, compFilter]);

  const hasActiveFilters = searchTerm !== '' || hospitalFilter !== 'All' || locationFilter !== 'All' || durationFilter !== 'All' || compFilter !== 'All';

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-[#0e1625] border border-dark-border p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.06),transparent_45%)]" />
        <div className="space-y-2 relative z-10 text-left">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-medical-blue animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-medical-blue">Clerkship Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Clinical Rotations & Internships
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light max-w-xl">
            Discover verified hands-on clerkships, shadowing programs, and sub-internship electives at accredited clinics and hospital units.
          </p>
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
              placeholder="Search by role, hospital department, or level keywords..."
              className="bg-transparent border-none text-xs text-slate-850 dark:text-slate-350 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none w-full"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="cursor-pointer">
                <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-250" />
              </button>
            )}
          </div>

          {/* Selector options */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Hospital Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Hospital</span>
              <select
                value={hospitalFilter}
                onChange={(e) => setHospitalFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-350 px-3 py-2 rounded-xl focus:outline-none focus:border-medical-teal cursor-pointer max-w-[150px]"
              >
                {hospitals.map(h => (
                  <option key={h} value={h}>{h === 'All' ? 'All Hospitals' : h}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Location</span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-350 px-3 py-2 rounded-xl focus:outline-none focus:border-medical-teal cursor-pointer"
              >
                {locations.map(l => (
                  <option key={l} value={l}>{l === 'All' ? 'All Locations' : l}</option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Duration</span>
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-350 px-3 py-2 rounded-xl focus:outline-none focus:border-medical-teal cursor-pointer"
              >
                {durations.map(d => (
                  <option key={d} value={d}>{d === 'All' ? 'All Durations' : d}</option>
                ))}
              </select>
            </div>

            {/* Paid / Unpaid Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Type</span>
              <select
                value={compFilter}
                onChange={(e) => setCompFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-350 px-3 py-2 rounded-xl focus:outline-none focus:border-medical-teal cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Paid">Paid Only</option>
                <option value="Unpaid">Unpaid / Credit</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-[10px] font-bold text-medical-teal hover:text-medical-emerald flex items-center gap-1.5 px-3 py-2 rounded-xl bg-medical-teal/10 hover:bg-medical-teal/15 cursor-pointer transition-all border border-medical-teal/20"
              >
                <SlidersHorizontal className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Internships Grid Card Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key="internships-grid"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredInternships.length > 0 ? (
            filteredInternships.map((intern) => {
              const hasApplied = appliedIds.includes(intern.id);
              const isClosed = intern.deadline === 'Ended' || intern.spotsLeft === 0;
              return (
                <div 
                  key={intern.id} 
                  className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl hover:border-slate-350 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 flex flex-col justify-between gap-5 text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-medical-blue/5 to-transparent rounded-bl-full pointer-events-none" />

                  <div className="space-y-4">
                    {/* Top badging & Open spots */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-dark-border/40 pb-3">
                      <div className="p-2 rounded-xl bg-medical-blue/10 text-medical-blue shrink-0">
                        <GraduationCap className="w-5 h-5 text-medical-blue" />
                      </div>
                      
                      {isClosed ? (
                        <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-500 rounded text-[9px] font-extrabold uppercase tracking-wide">
                          Rotation Full
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-medical-emerald/10 border border-medical-emerald/20 text-medical-emerald rounded text-[9px] font-extrabold uppercase tracking-wide">
                          {intern.spotsLeft} Open Slots
                        </span>
                      )}
                    </div>

                    {/* Role & Hospital */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">
                        {intern.level}
                      </span>
                      <h3 className="text-base font-display font-black text-slate-850 dark:text-white leading-tight">
                        {intern.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-650 dark:text-slate-300 flex items-center gap-1.5 pt-0.5">
                        <Landmark className="w-3.5 h-3.5 text-medical-teal shrink-0" />
                        <span>{intern.institution}</span>
                      </p>
                    </div>

                    {/* Metadata duration, stipend, location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-550 dark:text-slate-400 pt-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Duration: <strong className="text-slate-700 dark:text-slate-350">{intern.duration}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Stipend: <strong className="text-slate-705 dark:text-slate-350">{intern.stipend}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Location: <strong className="text-slate-700 dark:text-slate-350">{intern.location}</strong></span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-light pt-2.5 border-t border-slate-100 dark:border-dark-border/40">
                      {intern.description}
                    </p>
                  </div>

                  {/* Footer apply & deadline */}
                  <div className="flex justify-between items-center gap-4 pt-4 mt-auto border-t border-slate-100 dark:border-dark-border/30">
                    <span className="text-[10px] text-slate-455 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Deadline: <span className="text-slate-700 dark:text-slate-405 ml-1">{intern.deadline}</span>
                    </span>
                    
                    {isClosed ? (
                      <button 
                        disabled 
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-dark-border/50 text-slate-400 dark:text-slate-650 text-xs font-bold rounded-xl"
                      >
                        Closed
                      </button>
                    ) : hasApplied ? (
                      <button 
                        disabled 
                        className="flex items-center gap-1.5 px-4 py-2 bg-medical-emerald/10 border border-medical-emerald/20 text-medical-emerald text-xs font-bold rounded-xl"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Applied
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleApply(intern.id, intern.title, intern.institution)}
                        className="px-4 py-2 bg-gradient-to-r from-medical-teal to-medical-emerald hover:opacity-95 text-xs font-bold text-white rounded-xl shadow-md shadow-medical-teal/10 hover:shadow-medical-teal/15 transition-all cursor-pointer text-center"
                      >
                        Apply Rotation
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-3xl">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No Internships Found</h4>
              <p className="text-xs text-slate-450 dark:text-slate-550 mt-1 max-w-sm mx-auto">
                No rotations match your search terms or filters. Try adjusting your selectors.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

