import React, { useState, useMemo } from 'react';
import { 
  mockResearch, 
  mockResearchOpportunities, 
  mockFacultyProfiles, 
  mockResearchResources 
} from '../data/mockData';
import { useNotifications } from '../hooks/useNotifications';
import { 
  Microscope, BookOpen, Quote, PlusCircle, X,
  Search, Globe, SlidersHorizontal, Mail, BookOpenCheck,
  UserCheck, GraduationCap, Building, CheckCircle2, ChevronRight, Award,
  Info, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Research = () => {
  const { addNotification } = useNotifications();

  // 1. Core Hub States
  const [activeTab, setActiveTab] = useState('opportunities'); // 'opportunities', 'faculty', 'resources', 'publications'
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // 2. Action Tracking States
  // Applied Opportunities (persisted to localStorage)
  const [appliedOppIds, setAppliedOppIds] = useState(() => {
    const saved = localStorage.getItem('mednova_applied_research_opps');
    return saved ? JSON.parse(saved) : [];
  });

  // Mentorship modal target faculty
  const [mentorshipFaculty, setMentorshipFaculty] = useState(null);
  const [mentorshipMessage, setMentorshipMessage] = useState('');

  // 3. Publications Portfolio States (Retaining original publications logger functionality)
  const [researchList, setResearchList] = useState(() => {
    const saved = localStorage.getItem('mednova_logged_publications');
    return saved ? JSON.parse(saved) : mockResearch;
  });
  const [addPubModalOpen, setAddPubModalOpen] = useState(false);
  const [pubTitle, setPubTitle] = useState('');
  const [pubJournal, setPubJournal] = useState('');
  const [pubAbstract, setPubAbstract] = useState('');
  const [pubCoauthors, setPubCoauthors] = useState('');

  // 4. Action Handlers
  const handleApplyOpportunity = (opp) => {
    if (appliedOppIds.includes(opp.id)) return;
    const updated = [...appliedOppIds, opp.id];
    setAppliedOppIds(updated);
    localStorage.setItem('mednova_applied_research_opps', JSON.stringify(updated));

    addNotification(
      "Research Placement Applied",
      `Your academic profile has been submitted to ${opp.supervisor} at ${opp.institution} for '${opp.title}'.`,
      "application"
    );
  };

  const handleSendMentorshipRequest = (e) => {
    e.preventDefault();
    if (!mentorshipFaculty || !mentorshipMessage.trim()) return;

    addNotification(
      "Mentorship Request Dispatched",
      `Your request has been sent to ${mentorshipFaculty.name}. They will review your publications and bio.`,
      "system"
    );

    // Reset
    setMentorshipMessage('');
    setMentorshipFaculty(null);
  };

  const handleAddPublication = (e) => {
    e.preventDefault();
    if (!pubTitle || !pubJournal || !pubAbstract) return;

    const newPaper = {
      id: `res-${Date.now()}`,
      title: pubTitle,
      journal: pubJournal,
      status: "Under Review",
      date: "June 2026",
      role: "Lead Author",
      abstract: pubAbstract,
      citations: 0,
      coauthors: pubCoauthors.split(',').map(s => s.trim()).filter(Boolean)
    };

    const updated = [newPaper, ...researchList];
    setResearchList(updated);
    localStorage.setItem('mednova_logged_publications', JSON.stringify(updated));

    addNotification(
      "Research Abstract Logged",
      `'${pubTitle}' has been indexed in your publications portfolio.`,
      "research"
    );

    // Reset form
    setPubTitle('');
    setPubJournal('');
    setPubAbstract('');
    setPubCoauthors('');
    setAddPubModalOpen(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSpecializationFilter('All');
    setCountryFilter('All');
    setTypeFilter('All');
  };

  // 5. Dynamic Filtering Logic
  const filteredOpportunities = useMemo(() => {
    return mockResearchOpportunities.filter(opp => {
      // Specialization Filter
      if (specializationFilter !== 'All' && opp.specialization !== specializationFilter) return false;
      // Country Filter
      if (countryFilter !== 'All' && opp.country !== countryFilter) return false;
      // Research Type Filter
      if (typeFilter !== 'All' && opp.type !== typeFilter) return false;

      // Search Query
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matches = 
          opp.title.toLowerCase().includes(query) ||
          opp.institution.toLowerCase().includes(query) ||
          opp.supervisor.toLowerCase().includes(query) ||
          opp.description.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [specializationFilter, countryFilter, typeFilter, searchTerm]);

  const filteredFaculty = useMemo(() => {
    return mockFacultyProfiles.filter(fac => {
      // Specialization Filter
      if (specializationFilter !== 'All' && fac.specialization !== specializationFilter) return false;
      // Country Filter
      if (countryFilter !== 'All' && fac.country !== countryFilter) return false;
      // Research Type Filter (matches primary research methodology)
      if (typeFilter !== 'All' && fac.primaryType !== typeFilter) return false;

      // Search Query
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matches = 
          fac.name.toLowerCase().includes(query) ||
          fac.title.toLowerCase().includes(query) ||
          fac.institution.toLowerCase().includes(query) ||
          fac.interests.some(interest => interest.toLowerCase().includes(query));
        if (!matches) return false;
      }
      return true;
    });
  }, [specializationFilter, countryFilter, typeFilter, searchTerm]);

  const filteredResources = useMemo(() => {
    return mockResearchResources.filter(res => {
      // Specialization Filter
      if (specializationFilter !== 'All' && res.specialization !== 'All' && res.specialization !== specializationFilter) return false;
      // Country Filter
      if (countryFilter !== 'All' && res.country !== 'Global' && res.country !== countryFilter) return false;
      
      // Search Query
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matches = 
          res.title.toLowerCase().includes(query) ||
          res.description.toLowerCase().includes(query) ||
          res.category.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [specializationFilter, countryFilter, searchTerm]);

  const filteredPublications = useMemo(() => {
    return researchList.filter(paper => {
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matches = 
          paper.title.toLowerCase().includes(query) ||
          paper.journal.toLowerCase().includes(query) ||
          paper.abstract.toLowerCase().includes(query) ||
          paper.coauthors.some(c => c.toLowerCase().includes(query));
        if (!matches) return false;
      }
      return true;
    });
  }, [researchList, searchTerm]);

  // Check if any filter is active
  const hasActiveFilters = searchTerm !== '' || specializationFilter !== 'All' || countryFilter !== 'All' || typeFilter !== 'All';

  // Styles helper for categories
  const getTabBadgeStyles = (tabName) => {
    return activeTab === tabName 
      ? 'bg-medical-teal text-white' 
      : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-800';
  };

  return (
    <div className="space-y-6">
      {/* A. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-[#0e1625] border border-dark-border p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.06),transparent_45%)]" />
        <div className="space-y-2 relative z-10 text-left">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-medical-emerald animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-medical-emerald">Investigator Space</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Clinical Research Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light max-w-xl">
            Explore active laboratory vacancies, request 1-on-1 mentorship with principal investigators, index reference toolkits, and log your peer-reviewed publications.
          </p>
        </div>

        {activeTab === 'publications' && (
          <button
            onClick={() => setAddPubModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-medical-teal to-medical-emerald text-xs font-bold text-white rounded-xl hover:opacity-90 shadow-md shadow-medical-teal/15 transition-all cursor-pointer shrink-0 relative z-10"
          >
            <PlusCircle className="w-4.5 h-4.5" />
            Log Publication
          </button>
        )}
      </div>

      {/* B. Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 border-b border-slate-200 dark:border-dark-border/80">
        {[
          { id: 'opportunities', label: 'Research Placements', icon: Microscope, count: mockResearchOpportunities.length },
          { id: 'faculty', label: 'Faculty Mentors', icon: GraduationCap, count: mockFacultyProfiles.length },
          { id: 'resources', label: 'Reference Resources', icon: BookOpen, count: mockResearchResources.length },
          { id: 'publications', label: 'My Publications', icon: Award, count: researchList.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                // Clear tab-specific filters or keep search
              }}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-display text-xs font-bold whitespace-nowrap transition-all group cursor-pointer ${
                isActive
                  ? 'border-medical-teal text-medical-teal'
                  : 'border-transparent text-slate-450 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${getTabBadgeStyles(tab.id)}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* C. Filter Panel */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-2xl shadow-sm transition-all duration-300">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch justify-between">
          {/* Search bar */}
          <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl focus-within:border-medical-teal transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeTab === 'opportunities' ? "Search placements by title, supervisor, hospital..." :
                activeTab === 'faculty' ? "Search mentors by name, department, interests..." :
                activeTab === 'resources' ? "Search reference guides, data tools, libraries..." :
                "Search your logged publications by title, journal, abstract..."
              }
              className="bg-transparent border-none text-xs text-slate-850 dark:text-slate-350 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none w-full"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="cursor-pointer">
                <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-250" />
              </button>
            )}
          </div>

          {/* Selector options (Omit specific filters on Resources & Publications if they don't apply) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Specialization selection */}
            {activeTab !== 'publications' && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Specialty</span>
                <select
                  value={specializationFilter}
                  onChange={(e) => setSpecializationFilter(e.target.value)}
                  className="text-xs bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-350 px-3 py-2 rounded-xl focus:outline-none focus:border-medical-teal cursor-pointer"
                >
                  <option value="All">All Specialties</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Genetics">Genetics</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Immunology">Immunology</option>
                </select>
              </div>
            )}

            {/* Country selection */}
            {activeTab !== 'publications' && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Country</span>
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="text-xs bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-350 px-3 py-2 rounded-xl focus:outline-none focus:border-medical-teal cursor-pointer"
                >
                  <option value="All">All Countries</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>
            )}

            {/* Research Type selection (Omit on Resources & Publications) */}
            {(activeTab === 'opportunities' || activeTab === 'faculty') && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Methodology</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="text-xs bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-350 px-3 py-2 rounded-xl focus:outline-none focus:border-medical-teal cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="Clinical Trial">Clinical Trials</option>
                  <option value="Basic Science">Basic Science</option>
                  <option value="Translational">Translational</option>
                  <option value="Systematic Review">Systematic Reviews</option>
                  <option value="Observational">Observational Studies</option>
                </select>
              </div>
            )}

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-[10px] font-bold text-medical-teal hover:text-medical-emerald flex items-center gap-1.5 px-3 py-2 rounded-xl bg-medical-teal/10 hover:bg-medical-teal/15 cursor-pointer transition-all border border-medical-teal/20"
              >
                <SlidersHorizontal className="w-3 h-3" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* D. Main Active Tab Panel Views */}
      <AnimatePresence mode="wait">
        {activeTab === 'opportunities' && (
          <motion.div
            key="opportunities-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredOpportunities.length > 0 ? (
              filteredOpportunities.map((opp) => {
                const isApplied = appliedOppIds.includes(opp.id);
                return (
                  <div 
                    key={opp.id} 
                    className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-5 hover:border-slate-350 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full text-left relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-medical-teal/5 to-transparent rounded-bl-full pointer-events-none" />
                    
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-medical-teal/10 dark:bg-medical-teal/15 text-medical-teal border border-medical-teal/20 text-[9px] font-extrabold uppercase tracking-wide">
                          {opp.type}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-dark-border/40 text-slate-500 dark:text-slate-400 text-[9px] font-bold">
                          {opp.duration}
                        </span>
                      </div>

                      {/* Title & PI */}
                      <div className="space-y-1">
                        <h3 className="text-base font-display font-black text-slate-850 dark:text-white leading-snug line-clamp-2">
                          {opp.title}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                          <Building className="w-3.5 h-3.5 text-medical-teal shrink-0" />
                          <span className="truncate">{opp.institution}</span>
                        </p>
                        <p className="text-xs font-semibold text-slate-550 dark:text-slate-300 flex items-center gap-1.5 pt-0.5">
                          <UserCheck className="w-3.5 h-3.5 text-medical-emerald shrink-0" />
                          <span>PI: {opp.supervisor}</span>
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-light line-clamp-3">
                        {opp.description}
                      </p>
                    </div>

                    {/* Bottom Metadata & CTA */}
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-dark-border/40 flex items-center justify-between gap-3">
                      <div className="space-y-0.5 text-left">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">compensation</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{opp.compensation}</span>
                      </div>

                      {isApplied ? (
                        <div className="flex items-center gap-1 px-3.5 py-1.5 bg-medical-emerald/10 border border-medical-emerald/20 text-medical-emerald rounded-xl text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Applied</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApplyOpportunity(opp)}
                          className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-medical-teal to-medical-emerald text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-md shadow-medical-teal/10 hover:shadow-medical-teal/15 transition-all cursor-pointer"
                        >
                          Apply Placement
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-3xl">
                <Info className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No Research Placements Found</h4>
                <p className="text-xs text-slate-450 dark:text-slate-550 mt-1 max-w-sm mx-auto">
                  Try adjusting your Specialty, Country, or Methodology filters to explore other laboratory placements.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'faculty' && (
          <motion.div
            key="faculty-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredFaculty.length > 0 ? (
              filteredFaculty.map((fac) => (
                <div 
                  key={fac.id} 
                  className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-5 hover:border-slate-350 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full text-left"
                >
                  <div className="space-y-4">
                    {/* Faculty Profile Meta */}
                    <div className="flex gap-4">
                      <img 
                        src={fac.avatar} 
                        alt={fac.name} 
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-dark-border/80 shrink-0 bg-slate-800"
                      />
                      <div className="space-y-1 min-w-0">
                        <h3 className="text-base font-display font-black text-slate-850 dark:text-white leading-snug truncate">
                          {fac.name}
                        </h3>
                        <p className="text-[11px] text-slate-450 dark:text-slate-400 leading-snug truncate">
                          {fac.title}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{fac.institution}</span>
                        </p>
                      </div>
                    </div>

                    {/* Interests tags */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Research Interests</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {fac.interests.map((interest) => (
                          <span 
                            key={interest} 
                            className="text-[9px] bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-dark-border px-2 py-0.5 rounded-lg text-slate-600 dark:text-slate-400"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Metadata Row & Email / Mentorship Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-dark-border/40 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-slate-450 text-[10px] font-semibold">
                      <span className="flex items-center gap-1">
                        <BookOpenCheck className="w-3.5 h-3.5 text-medical-teal" />
                        {fac.publicationsCount} Pubs
                      </span>
                      <span>•</span>
                      <span className="text-medical-emerald font-bold">{fac.primaryType}</span>
                    </div>

                    <button
                      onClick={() => setMentorshipFaculty(fac)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-medical-teal to-medical-emerald text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-md shadow-medical-teal/10 transition-all cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Request Mentorship
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-3xl">
                <Info className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No Mentors Found</h4>
                <p className="text-xs text-slate-450 dark:text-slate-550 mt-1 max-w-sm mx-auto">
                  No matching Principal Investigators found for this selection. Try shifting your filters.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'resources' && (
          <motion.div
            key="resources-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredResources.length > 0 ? (
              filteredResources.map((res) => (
                <div 
                  key={res.id} 
                  className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-5 hover:border-slate-350 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full text-left"
                >
                  <div className="space-y-4">
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-dark-border/40 pb-3">
                      <span className="px-2 py-0.5 rounded bg-medical-blue/10 dark:bg-medical-blue/15 text-medical-blue border border-medical-blue/20 text-[9px] font-extrabold uppercase tracking-wide">
                        {res.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        Region: {res.country}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <div className="space-y-2">
                      <h3 className="text-base font-display font-black text-slate-850 dark:text-white leading-snug">
                        {res.title}
                      </h3>
                      <p className="text-xs text-slate-550 dark:text-slate-450 leading-relaxed font-light">
                        {res.description}
                      </p>
                    </div>
                  </div>

                  {/* Access Button */}
                  <div className="pt-4 mt-4 border-t border-slate-150 dark:border-dark-border/40 flex items-center justify-between gap-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-dark-border/40 text-slate-500 dark:text-slate-400 text-[9px] font-bold">
                      {res.type}
                    </span>

                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 border border-slate-250 dark:border-dark-border text-slate-650 hover:text-slate-900 dark:text-slate-450 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/60 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <span>Access Portal</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-3xl">
                <Info className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No Resources Found</h4>
                <p className="text-xs text-slate-450 dark:text-slate-550 mt-1 max-w-sm mx-auto">
                  No reference files or data toolkits match your Specialty or Country selections.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'publications' && (
          // MY PUBLICATIONS (ORIGINAL LOGICAL GRID)
          <motion.div
            key="publications-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* List */}
            <div className="grid grid-cols-1 gap-6">
              {filteredPublications.length > 0 ? (
                filteredPublications.map((paper) => (
                  <div 
                    key={paper.id} 
                    className="bg-white dark:bg-dark-card border border-slate-250 dark:border-dark-border p-6 rounded-2xl hover:border-slate-350 dark:hover:border-slate-700 transition-all flex flex-col gap-4 relative overflow-hidden text-left shadow-sm hover:shadow-md"
                  >
                    {/* Status badge & Date */}
                    <div className="flex items-center justify-between gap-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        paper.status === 'Published' 
                          ? 'bg-medical-emerald/10 text-medical-emerald border border-medical-emerald/20' 
                          : paper.status === 'Under Review' 
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                          : 'bg-medical-blue/10 text-medical-blue border border-medical-blue/20'
                      }`}>
                        {paper.status}
                      </span>
                      <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold">{paper.date}</span>
                    </div>

                    {/* Title / Journal */}
                    <div className="space-y-1">
                      <h3 className="text-base font-display font-black text-slate-850 dark:text-white leading-snug">
                        {paper.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                        <BookOpen className="w-3.5 h-3.5 text-medical-teal shrink-0" />
                        {paper.journal}
                      </p>
                    </div>

                    {/* Abstract */}
                    <div className="space-y-1 bg-slate-50 dark:bg-[#070b13] p-4 rounded-xl border border-slate-100 dark:border-dark-border/40">
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">Abstract Excerpt</span>
                      <p className="text-xs text-slate-550 dark:text-slate-400 font-light leading-relaxed">
                        {paper.abstract}
                      </p>
                    </div>

                    {/* Footer citation and role */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-150 dark:border-dark-border/40 text-xs">
                      <div className="flex items-center gap-4 text-slate-450 dark:text-slate-500">
                        <span className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-400">
                          <Quote className="w-3.5 h-3.5 text-medical-teal" />
                          {paper.citations} Citations
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span>Role: <strong className="text-slate-700 dark:text-slate-350">{paper.role}</strong></span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 text-[10px] text-slate-500 dark:text-slate-400 items-center">
                        <span className="text-slate-400 mr-1">Co-Authors:</span>
                        {paper.coauthors.length > 0 ? (
                          paper.coauthors.map(c => (
                            <span key={c} className="bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-dark-border/50 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 font-medium">
                              {c}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-450 dark:text-slate-650 italic">None logged</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-3xl">
                  <Info className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No Publications Found</h4>
                  <p className="text-xs text-slate-450 dark:text-slate-550 mt-1 max-w-sm mx-auto">
                    No logged publications match your keyword search. Click the "Log Publication" button above to index new research.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* E. Faculty Mentorship Request Overlay Modal */}
      <AnimatePresence>
        {mentorshipFaculty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            {/* Backdrop click closer */}
            <div className="absolute inset-0" onClick={() => setMentorshipFaculty(null)} />

            {/* Form box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-dark-border w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 text-left"
            >
              <button 
                onClick={() => setMentorshipFaculty(null)}
                className="absolute top-5 right-5 p-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-450 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  academic mentorship
                </span>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white mt-1">
                  Request Mentorship
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1.5">
                  Send a mentorship pitch to <strong className="text-medical-teal">{mentorshipFaculty.name}</strong>. They will receive access to your publications and portal credentials.
                </p>
              </div>

              <form onSubmit={handleSendMentorshipRequest} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Recipient PI</label>
                  <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-700 dark:text-slate-350">
                    <span className="font-semibold block">{mentorshipFaculty.name}</span>
                    <span className="text-[10px] text-slate-450 dark:text-slate-500">{mentorshipFaculty.title}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Mentorship Cover Letter / Message</label>
                  <textarea 
                    value={mentorshipMessage}
                    onChange={(e) => setMentorshipMessage(e.target.value)}
                    placeholder="Briefly state your clinical research background, publication history, and what topics you wish to focus on under their laboratory guidance..."
                    required
                    rows="5"
                    className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal resize-none leading-relaxed placeholder-slate-400 dark:placeholder-slate-550"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setMentorshipFaculty(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-905 dark:hover:bg-slate-900 text-xs font-semibold text-slate-500 hover:text-slate-850 dark:text-slate-450 dark:hover:text-white transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-medical-teal to-medical-emerald text-xs font-bold text-white shadow-md shadow-medical-teal/10 hover:shadow-medical-teal/15 transition-all cursor-pointer text-center"
                  >
                    Send Invitation Pitch
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* F. Log Publication Modal (Retaining original logger function) */}
      <AnimatePresence>
        {addPubModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            {/* Backdrop click closer */}
            <div className="absolute inset-0" onClick={() => setAddPubModalOpen(false)} />

            {/* Modal box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-dark-border w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 text-left animate-fade-in-up"
            >
              <button 
                onClick={() => setAddPubModalOpen(false)}
                className="absolute top-5 right-5 p-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-450 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Publications vault
                </span>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white mt-1">
                  Log Academic Research
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
                  Add details of your published papers or draft clinical trials.
                </p>
              </div>

              <form onSubmit={handleAddPublication} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Paper Title</label>
                  <input 
                    type="text"
                    value={pubTitle}
                    onChange={(e) => setPubTitle(e.target.value)}
                    placeholder="e.g., Efficacy of Beta-Blockers in Diabetic Heart Disease"
                    required
                    className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Target Journal / Publisher</label>
                  <input 
                    type="text"
                    value={pubJournal}
                    onChange={(e) => setPubJournal(e.target.value)}
                    placeholder="e.g., The Lancet, NEJM, JAMA"
                    required
                    className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Abstract Description</label>
                  <textarea 
                    value={pubAbstract}
                    onChange={(e) => setPubAbstract(e.target.value)}
                    placeholder="Summarize methods, cohorts, analysis results, and study outcomes..."
                    required
                    rows="4"
                    className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Co-Authors (comma separated)</label>
                  <input 
                    type="text"
                    value={pubCoauthors}
                    onChange={(e) => setPubCoauthors(e.target.value)}
                    placeholder="Dr. S. Jenkins, Dr. R. Chen"
                    className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setAddPubModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-905 dark:hover:bg-slate-900 text-xs font-semibold text-slate-500 hover:text-slate-850 dark:text-slate-450 dark:hover:text-white transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-medical-teal to-medical-emerald text-xs font-bold text-white shadow-md shadow-medical-teal/10 hover:shadow-medical-teal/15 transition-all cursor-pointer text-center"
                  >
                    Log Publication
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
