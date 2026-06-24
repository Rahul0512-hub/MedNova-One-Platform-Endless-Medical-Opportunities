import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { 
  mockOpportunities, 
  mockDeadlines, 
  mockActivities 
} from '../data/mockData';
import { 
  Briefcase, Calendar, Award, ArrowRight, ShieldCheck, 
  CheckCircle2, Clock, Bookmark, Sparkles, 
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Animations variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 24
    }
  }
};

export const Dashboard = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  // Local state for interactive properties
  const [savedOpps, setSavedOpps] = useState(() => {
    const saved = localStorage.getItem('mednova_saved_opps');
    return saved ? JSON.parse(saved) : ['opp-2'];
  });
  const [appliedOpps, setAppliedOpps] = useState(() => {
    const applied = localStorage.getItem('mednova_applied_opps');
    return applied ? JSON.parse(applied) : [];
  });
  const [activities, setActivities] = useState(mockActivities);

  // Stats calculation
  const savedCount = savedOpps.length;
  const appliedCount = appliedOpps.length;
  const certificatesCount = user?.stats?.certificatesEarned || 4;
  const deadlinesCount = mockDeadlines.length;

  const handleToggleSave = (opp) => {
    const isSaved = savedOpps.includes(opp.id);
    let nextSaved;
    if (isSaved) {
      nextSaved = savedOpps.filter(id => id !== opp.id);
      addNotification(
        "Opportunity Unsaved",
        `Removed '${opp.title}' from your saved board.`,
        "system"
      );
      // Remove from activity
      setActivities(prev => [
        {
          id: `act-${Date.now()}`,
          type: "system",
          action: "Removed Saved Item",
          target: opp.title,
          entity: opp.organization,
          timestamp: "Just now"
        },
        ...prev
      ]);
    } else {
      nextSaved = [...savedOpps, opp.id];
      addNotification(
        "Opportunity Saved",
        `Saved '${opp.title}' to your bookmarks board.`,
        "system"
      );
      // Add to activity
      setActivities(prev => [
        {
          id: `act-${Date.now()}`,
          type: "system",
          action: "Saved Opportunity",
          target: opp.title,
          entity: opp.organization,
          timestamp: "Just now"
        },
        ...prev
      ]);
    }
    setSavedOpps(nextSaved);
    localStorage.setItem('mednova_saved_opps', JSON.stringify(nextSaved));
  };

  const handleApply = (opp) => {
    if (appliedOpps.includes(opp.id)) return;
    const nextApplied = [...appliedOpps, opp.id];
    setAppliedOpps(nextApplied);
    localStorage.setItem('mednova_applied_opps', JSON.stringify(nextApplied));
    addNotification(
      "Application Sent",
      `Your credentials were encrypted and sent for '${opp.title}' at ${opp.organization}.`,
      "application"
    );
    // Add to activity
    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        type: "application",
        action: "Submitted Application",
        target: opp.title,
        entity: opp.organization,
        timestamp: "Just now"
      },
      ...prev
    ]);
  };

  // Get icons for activity list
  const getActivityIcon = (type) => {
    switch (type) {
      case 'application': return <Briefcase className="w-4 h-4 text-blue-500" />;
      case 'certificate': return <Award className="w-4 h-4 text-purple-400" />;
      case 'event': return <Calendar className="w-4 h-4 text-teal-500" />;
      default: return <Sparkles className="w-4 h-4 text-medical-teal" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-10"
    >
      
      {/* 1. WELCOME BANNER */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-r from-[#0d1627] via-[#091522] to-slate-900 border border-slate-200/10 dark:border-dark-border p-6 sm:p-8 rounded-3xl relative overflow-hidden text-left shadow-xl"
      >
        {/* Glow graphic */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-medical-teal/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-40 h-40 bg-medical-emerald/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-medical-teal/10 border border-medical-teal/20 text-[10px] font-bold text-medical-teal uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Academic Portal Active
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white leading-tight">
              Welcome back, {user?.name || 'Dr. Elena Rostova'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed max-w-xl">
              Academic Year: <span className="text-slate-200 font-medium">{user?.year || 'Residency Year 2'}</span> • Institution: <span className="text-slate-200 font-medium">{user?.college || 'Boston General Hospital'}</span>
            </p>
          </div>
          
          <Link 
            to="/profile" 
            className="flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-medical-teal to-medical-emerald text-xs font-bold text-white rounded-xl hover:opacity-95 shadow-md shadow-medical-teal/15 transition-all w-fit"
          >
            Clinical Portfolio
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* 2. STATISTICS CARDS GRID */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        
        {/* Saved Opportunities Card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.015, boxShadow: "0 10px 20px -5px rgba(0,0,0,0.03)" }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-slate-350 dark:hover:border-slate-700 transition-colors shadow-sm text-left cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Saved Positions</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Bookmark className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {savedCount}
            </span>
            <p className="text-[9px] text-slate-400 dark:text-slate-500">Saved board opportunities</p>
          </div>
        </motion.div>

        {/* Applications Card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.015, boxShadow: "0 10px 20px -5px rgba(0,0,0,0.03)" }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-slate-350 dark:hover:border-slate-700 transition-colors shadow-sm text-left cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Applications</span>
            <div className="p-2 rounded-xl bg-medical-teal/10 text-medical-teal">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {appliedCount}
            </span>
            <p className="text-[9px] text-slate-400 dark:text-slate-500">{appliedOpps.length} pending new reviews</p>
          </div>
        </motion.div>

        {/* Certificates Card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.015, boxShadow: "0 10px 20px -5px rgba(0,0,0,0.03)" }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-slate-350 dark:hover:border-slate-700 transition-colors shadow-sm text-left cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Vault Certificates</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Award className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {certificatesCount}
            </span>
            <p className="text-[9px] text-slate-400 dark:text-slate-500">All cryptographic credentials verified</p>
          </div>
        </motion.div>

        {/* Upcoming Deadlines Card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.015, boxShadow: "0 10px 20px -5px rgba(0,0,0,0.03)" }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-slate-355 dark:hover:border-slate-700 transition-colors shadow-sm text-left cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Urgent Deadlines</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {deadlinesCount}
            </span>
            <p className="text-[9px] text-slate-400 dark:text-slate-500">Submissions due this month</p>
          </div>
        </motion.div>

      </motion.div>

      {/* 3. TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Column: Recommended & Activities */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* A. Recommended Opportunities */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl space-y-5 text-left shadow-sm transition-colors duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">Recommended Opportunities</h3>
                <p className="text-xs text-slate-450 dark:text-slate-500 font-light mt-0.5">Tailored rotation and internship vacancies matching your specialty</p>
              </div>
              <Link to="/opportunities" className="text-xs text-medical-teal hover:underline flex items-center gap-1 shrink-0 font-semibold">
                Explore all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {mockOpportunities.slice(0, 3).map((opp) => {
                const isSaved = savedOpps.includes(opp.id);
                const hasApplied = appliedOpps.includes(opp.id);
                
                return (
                  <motion.div 
                    key={opp.id} 
                    variants={itemVariants}
                    whileHover={{ scale: 1.008, borderSide: "1px solid #14b8a6" }}
                    className="p-4 bg-slate-50/50 dark:bg-[#090d16] border border-slate-200 dark:border-dark-border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-350 dark:hover:border-slate-800 transition-colors"
                  >
                    <div className="space-y-1.5 text-left min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-slate-250 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded text-[9px] font-bold uppercase tracking-wider">
                          {opp.organization}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-light">{opp.location}</span>
                      </div>
                      <Link to={`/opportunities/${opp.id}`} className="hover:text-medical-teal hover:underline transition-colors block">
                        <h4 className="text-sm font-bold text-slate-855 dark:text-slate-100 truncate">{opp.title}</h4>
                      </Link>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-light truncate leading-relaxed">{opp.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      {/* Save Button */}
                      <button
                        onClick={() => handleToggleSave(opp)}
                        className={`p-2 border rounded-xl transition-all cursor-pointer ${
                          isSaved 
                            ? 'bg-blue-500/10 border-blue-500/35 text-blue-500' 
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-dark-border hover:border-slate-350 dark:hover:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        }`}
                        title={isSaved ? "Unsave Position" : "Save Position"}
                      >
                        <Bookmark className="w-4 h-4 fill-current stroke-current" />
                      </button>

                      {/* Apply Button */}
                      <button 
                        onClick={() => handleApply(opp)}
                        disabled={hasApplied}
                        className={`flex-grow sm:flex-grow-0 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                          hasApplied 
                            ? 'bg-medical-emerald/10 border border-medical-emerald/25 text-medical-emerald cursor-default' 
                            : 'bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-250 dark:border-dark-border hover:border-slate-350 dark:hover:border-slate-755 text-slate-700 dark:text-slate-300 cursor-pointer'
                        }`}
                      >
                        {hasApplied ? "Applied" : "Apply"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* B. Recent Activities Feed */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl space-y-6 text-left shadow-sm transition-colors duration-300">
            <div>
              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">Recent Activities</h3>
              <p className="text-xs text-slate-455 dark:text-slate-500 font-light mt-0.5">Timeline log of your clinical portfolio and submissions activity</p>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-150 dark:border-dark-border/40 space-y-6 ml-3 text-left">
              <AnimatePresence initial={false}>
                {activities.map((act) => (
                  <motion.div 
                    key={act.id} 
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative group text-left"
                  >
                    {/* Circle icon placement */}
                    <div className="absolute left-[-35px] top-0.5 p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-dark-border rounded-xl shrink-0">
                      {getActivityIcon(act.type)}
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-light">
                        {act.timestamp}
                      </span>
                      <p className="text-xs text-slate-800 dark:text-slate-300 leading-normal">
                        <span className="font-semibold text-slate-900 dark:text-white">{act.action}</span> - {act.target} 
                        {act.entity && <span className="text-slate-450 dark:text-slate-500"> • {act.entity}</span>}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Right Column: Deadlines & NPI Verification Checklist */}
        <div className="space-y-8">
          
          {/* C. Upcoming Deadlines Section */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl space-y-4 text-left shadow-sm transition-colors duration-300">
            <div>
              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-500 shrink-0" />
                Upcoming Deadlines
              </h3>
              <p className="text-[11px] text-slate-455 dark:text-slate-500 font-light mt-0.5">Track and submit rotation registration packages</p>
            </div>

            <div className="space-y-3">
              {mockDeadlines.map((dl, dIdx) => (
                <motion.div 
                  key={dl.id} 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: dIdx * 0.08, type: "spring", stiffness: 200 }}
                  whileHover={{ x: 4 }}
                  className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-dark-border rounded-xl space-y-2 cursor-pointer"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-slate-855 dark:text-slate-255 truncate max-w-[150px]">{dl.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${dl.color} border shrink-0`}>
                      {dl.urgency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-450 dark:text-slate-500">
                    <span className="font-light">Due: {dl.dueDate}</span>
                    <Link to="/opportunities" className="text-medical-teal hover:underline font-semibold flex items-center gap-0.5">
                      Submit <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* D. Verification Checklist Widget */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl space-y-5 text-left shadow-sm transition-colors duration-300">
            <div>
              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-medical-emerald shrink-0 animate-pulse" />
                Credentials Verification
              </h3>
              <p className="text-[11px] text-slate-450 dark:text-slate-500 font-light mt-0.5">Secure verification checklist for cryptographic credentials vault</p>
            </div>

            <ul className="space-y-3.5 text-xs font-semibold">
              <li className="flex items-center gap-3 text-slate-800 dark:text-slate-350">
                <CheckCircle2 className="w-4 h-4 text-medical-emerald shrink-0" />
                <span>NPI Registry Account Linked</span>
              </li>
              <li className="flex items-center gap-3 text-slate-800 dark:text-slate-350">
                <CheckCircle2 className="w-4 h-4 text-medical-emerald shrink-0" />
                <span>Degrees & Residency Verified</span>
              </li>
              <li className="flex items-center gap-3 text-slate-800 dark:text-slate-350">
                <CheckCircle2 className="w-4 h-4 text-medical-emerald shrink-0" />
                <span>ACLS Certificate Authenticated</span>
              </li>
              <li className="flex items-center gap-3 text-slate-450 dark:text-slate-500 font-medium">
                <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-800 shrink-0" />
                <span>State Board License Link (Pending)</span>
              </li>
            </ul>

            <button 
              onClick={() => {
                addNotification(
                  "Verification Check Initiated",
                  "Scanned international databases for medical certifications.",
                  "system"
                );
                alert("Initiated credential resync. Check alerts pane!");
              }}
              className="w-full text-center py-2.5 bg-slate-55 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            >
              Force Verification Resync
            </button>
          </div>

        </div>

      </div>

    </motion.div>
  );
};
