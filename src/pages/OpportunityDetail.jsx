import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockOpportunities } from '../data/mockData';
import { useNotifications } from '../hooks/useNotifications';
import { 
  ArrowLeft, MapPin, DollarSign, Calendar, Clock, 
  Briefcase, Bookmark, Share2, ShieldCheck, CheckCircle2, 
  Sparkles
} from 'lucide-react';

export const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Find opportunity
  const opp = mockOpportunities.find(o => o.id === id);

  // States for interactive options
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [shareText, setShareText] = useState("Share Opportunity");

  // Synchronize dynamic local saves/applications from localStorage
  useEffect(() => {
    if (!opp) return;
    
    const saved = localStorage.getItem('mednova_saved_opps');
    if (saved) {
      const savedList = JSON.parse(saved);
      setIsSaved(savedList.includes(opp.id));
    }
    
    const applied = localStorage.getItem('mednova_applied_opps');
    if (applied) {
      const appliedList = JSON.parse(applied);
      setHasApplied(appliedList.includes(opp.id));
    }
    
    // Scroll to top on id change
    window.scrollTo(0, 0);
  }, [id, opp]);

  if (!opp) {
    return (
      <div className="text-center py-20 space-y-4">
        <Briefcase className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-850 dark:text-white">Opportunity not found</h2>
        <p className="text-xs text-slate-500">The vacancy link you followed is invalid or has expired.</p>
        <button onClick={() => navigate('/opportunities')} className="px-4 py-2 border rounded-xl text-xs font-semibold hover:bg-slate-50">
          Back to Listings
        </button>
      </div>
    );
  }

  // Dynamic Details Provider (Medical Prereqs based on Category)
  const getCategoryDetails = (cat) => {
    switch (cat) {
      case 'Residency':
        return {
          eligibility: "Medical graduates (MD/DO) within the past 2 years, or final-year medical students (MS4) in good academic standing.",
          benefits: [
            "ACLS / CPR certification support",
            "Comprehensive health, dental, and vision insurance options",
            "Structured academic curriculum and weekly grand rounds",
            "Access to medical simulation laboratories and library catalog"
          ],
          requirements: [
            "Completed USMLE Step 1 and Step 2 CK with passing scores",
            "Dean's Letter (MSPE) and clinical transcript",
            "Three letters of recommendation from clinical faculty directors",
            "Ecfmg Certification (for international medical graduates)"
          ]
        };
      case 'Fellowship':
        return {
          eligibility: "Physicians who have successfully completed an accredited internal medicine or pediatric residency training program.",
          benefits: [
            "Clinical specialization fellowship credentials certificate",
            "Competitive academic fellowship salary and CME allowance",
            "Hospital laboratory research project funding and mentorship",
            "Fully paid annual travel allowance for national medical conferences"
          ],
          requirements: [
            "Board-eligible or board-certified status in core specialty",
            "State medical license (active or board-eligible in target state)",
            "Three letters of recommendation including core residency director",
            "Curriculum Vitae listing clinical publications and research logs"
          ]
        };
      case 'Research':
        return {
          eligibility: "Medical students, graduate researchers, or post-doctoral fellows looking to gather clinical research hours.",
          benefits: [
            "Co-authorship opportunities in peer-reviewed journals (PubMed)",
            "One-on-one mentorship with principal clinical investigators",
            "Academic research hours credit coordination",
            "Flexible work schedules (hybrid rotation options)"
          ],
          requirements: [
            "Prior exposure to data extraction, literature reviews, or analysis",
            "Completed GCP (Good Clinical Practice) ethics training course",
            "Basic understanding of statistical software tools (SPSS, R, or Python)",
            "Strong command of medical terminology and manuscript writing"
          ]
        };
      default: // Attending
        return {
          eligibility: "Fully licensed physicians (MD/DO) with clinical practice experience.",
          benefits: [
            "Highly competitive base salary with RVU performance bonuses",
            "Complete clinical malpractice insurance coverage",
            "CME budget allowance and paid professional leave days",
            "401(k) matching and employer retirement contributions"
          ],
          requirements: [
            "Board certification in specialty field (e.g., family medicine)",
            "Active and unencumbered state medical license",
            "Active DEA registration and clean credentials file",
            "Excellent communication skills and patient satisfaction score history"
          ]
        };
    }
  };

  const details = getCategoryDetails(opp.category);

  // Toggle Save
  const handleToggleSave = () => {
    const saved = localStorage.getItem('mednova_saved_opps');
    let savedList = saved ? JSON.parse(saved) : [];
    
    let nextSaved;
    if (isSaved) {
      nextSaved = savedList.filter(oId => oId !== opp.id);
      addNotification("Opportunity Unsaved", `Removed '${opp.title}' from your saved board.`, "system");
    } else {
      nextSaved = [...savedList, opp.id];
      addNotification("Opportunity Saved", `Saved '${opp.title}' to your saved bookmarks.`, "system");
    }
    
    setIsSaved(!isSaved);
    localStorage.setItem('mednova_saved_opps', JSON.stringify(nextSaved));
  };

  // Toggle Apply
  const handleApply = () => {
    if (hasApplied) return;
    
    const applied = localStorage.getItem('mednova_applied_opps');
    let appliedList = applied ? JSON.parse(applied) : [];
    
    const nextApplied = [...appliedList, opp.id];
    setHasApplied(true);
    localStorage.setItem('mednova_applied_opps', JSON.stringify(nextApplied));
    
    addNotification(
      "Application Sent",
      `Your encrypted credentials sent successfully to ${opp.organization}.`,
      "application"
    );
  };

  // Share link function
  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setShareText("Link Copied!");
    addNotification("Link Copied", "Opportunity detail page link copied to clipboard.", "system");
    setTimeout(() => {
      setShareText("Share Opportunity");
    }, 2000);
  };

  // Get similar opportunities (same category, excluding current one)
  const similarOpportunities = mockOpportunities
    .filter(o => o.category === opp.category && o.id !== opp.id)
    .slice(0, 3);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="space-y-8 pb-16"
    >
      
      {/* Back Button */}
      <div className="text-left">
        <Link 
          to="/opportunities" 
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-855 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explorer Listings
        </Link>
      </div>

      {/* Header Container */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 sm:p-8 rounded-3xl relative overflow-hidden text-left shadow-sm transition-colors duration-300">
        <div className="absolute right-0 top-0 w-64 h-64 bg-medical-teal/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-slate-105 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {opp.workplaceType}
            </span>
            <span className="px-2 py-0.5 rounded bg-medical-teal/10 text-medical-teal text-[9px] font-bold uppercase tracking-wide">
              {opp.category}
            </span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
              opp.isPaid ? 'bg-medical-emerald/5 border-medical-emerald/20 text-medical-emerald' : 'bg-slate-200/50 border-slate-350 dark:bg-slate-950 dark:border-slate-850 text-slate-500'
            }`}>
              {opp.isPaid ? 'Paid' : 'Unpaid'}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white leading-tight">
              {opp.title}
            </h1>
            <p className="text-sm sm:text-base font-semibold text-medical-teal">{opp.organization}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-505 dark:text-slate-400 pt-1 font-light">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              {opp.location}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              {opp.salary}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              Posted: {opp.postedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns - Detailed Content */}
        <div className="lg:col-span-2 space-y-6 text-left">
          
          {/* 1. Job Description */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl space-y-3 shadow-sm transition-colors">
            <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white uppercase tracking-wider">Opportunity Description</h3>
            <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-355 font-light leading-relaxed whitespace-pre-line">
              {opp.description}
            </p>
          </div>

          {/* 2. Candidate Requirements */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl space-y-4 shadow-sm transition-colors">
            <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white uppercase tracking-wider">Clinical Prerequisites & Requirements</h3>
            <ul className="space-y-3">
              {details.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-650 dark:text-slate-355 font-light">
                  <ShieldCheck className="w-4.5 h-4.5 text-medical-teal shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Candidate Eligibility */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl space-y-3 shadow-sm transition-colors">
            <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white uppercase tracking-wider">Target Candidate Eligibility</h3>
            <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-355 font-light leading-relaxed">
              {details.eligibility}
            </p>
          </div>

          {/* 4. Benefits */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl space-y-4 shadow-sm transition-colors">
            <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white uppercase tracking-wider">Benefits & Compensation Offerings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {details.benefits.map((benefit, idx) => (
                <div key={idx} className="p-3 bg-slate-50/50 dark:bg-[#080d16] border border-slate-150 dark:border-dark-border/40 rounded-xl flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-medical-emerald shrink-0" />
                  <span className="text-xs font-semibold text-slate-750 dark:text-slate-300 leading-normal">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6 text-left">
          
          {/* Action Sidebar Widget */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl space-y-6 shadow-sm transition-colors duration-300">
            
            {/* Meta tags details */}
            <div className="space-y-4 pb-6 border-b border-slate-100 dark:border-dark-border/40">
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-rose-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Application Deadline</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{opp.deadline}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-medical-teal shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Clinical Site Location</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{opp.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-medical-emerald shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Salary / Stipend Range</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{opp.salary}</span>
                </div>
              </div>

            </div>

            {/* Actions Triggers */}
            <div className="space-y-3">
              {hasApplied ? (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-medical-emerald bg-medical-emerald/10 text-medical-emerald text-sm font-bold cursor-default"
                >
                  <CheckCircle2 className="w-4.5 h-4.5" />
                  Application Sent
                </button>
              ) : (
                <button
                  onClick={handleApply}
                  className="w-full text-center py-3 bg-gradient-to-r from-medical-teal to-medical-emerald text-white hover:opacity-95 text-sm font-bold rounded-xl transition-all shadow-md shadow-medical-teal/15 cursor-pointer"
                >
                  Apply to Position
                </button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleToggleSave}
                  className={`py-2.5 px-3 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSaved
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-500'
                      : 'bg-white hover:bg-slate-50 dark:bg-slate-955 border-slate-200 dark:border-dark-border text-slate-655 dark:text-slate-300'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Bookmarked' : 'Save'}
                </button>

                <button
                  onClick={handleShare}
                  className="py-2.5 px-3 border border-slate-200 dark:border-dark-border bg-white hover:bg-slate-50 dark:bg-slate-955 text-slate-655 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-slate-400" />
                  {shareText === "Link Copied!" ? "Copied" : "Share"}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Similar Opportunities Section */}
      {similarOpportunities.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-slate-200 dark:border-dark-border/40 text-left">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 dark:text-white">Similar Opportunities</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">Explore similar clinical vacancies in {opp.category} specialty</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarOpportunities.map((similarOpp, sIdx) => (
              <motion.div 
                key={similarOpp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sIdx * 0.08, type: "spring", stiffness: 260, damping: 22 }}
                whileHover={{ y: -4, scale: 1.01, boxShadow: "0 10px 20px -8px rgba(0,0,0,0.04)" }}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-2xl flex flex-col justify-between gap-5 hover:border-slate-350 dark:hover:border-slate-755 transition-colors text-left cursor-pointer"
              >
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[8px] font-bold text-slate-500 Doctor uppercase tracking-wide">
                      {similarOpp.workplaceType}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold">{similarOpp.salary}</span>
                  </div>
                  
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 line-clamp-1 leading-snug">
                    {similarOpp.title}
                  </h4>
                  <p className="text-[10px] text-slate-550 dark:text-slate-400 font-light">{similarOpp.organization}</p>
                </div>

                <Link 
                  to={`/opportunities/${similarOpp.id}`}
                  className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-250 dark:border-dark-border rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  View Vacancy Details
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

    </motion.div>
  );
};
