import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../hooks/useAuth';
import { 
  Briefcase, Microscope, GraduationCap, Award, 
  ArrowRight, Sparkles, CheckCircle2, ChevronRight, 
  ChevronLeft, ShieldCheck, Mail, Hospital, MapPin 
} from 'lucide-react';

// Animations variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
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
      stiffness: 260,
      damping: 22
    }
  }
};

const categoryContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  }
};

const categoryItemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

export const Home = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  // Interactive testimonial state
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Interactive Waitlist state
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  // Interactive Apply states
  const [appliedIds, setAppliedIds] = useState([]);

  // Testimonials database
  const testimonials = [
    {
      name: "Dr. Elena Rostova, MD",
      role: "Resident Cardiologist, Boston General Hospital",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150",
      quote: "MedNova revolutionized how I track my rotations and secure my ACLS credentials. Hospital coordinators verify my credentials instantly, which expedited my licensing by weeks."
    },
    {
      name: "Dr. Alan Turing, MD, PhD",
      role: "Director of Clinical AI, Stanford Medicine",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150",
      quote: "Managing multi-site oncology trials used to require endless spreadsheets. MedNova's Research platform connected us to verified resident investigators in a click."
    },
    {
      name: "Dr. Patricia Bath, MD",
      role: "Residency Program Director, Mayo Clinic",
      avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150",
      quote: "We verify candidate degree certifications instantly via the Certificate Vault. It saves our residency coordination team hours of administrative verification every cycle."
    }
  ];

  // Featured vacancies database
  const featuredOpportunities = [
    {
      id: "feat-1",
      title: "Residency in Interventional Cardiology",
      organization: "Mayo Clinic",
      location: "Rochester, MN",
      salary: "$125,000 / yr",
      tags: ["Cardiology", "Residency"],
      logoColor: "from-blue-500 to-indigo-600"
    },
    {
      id: "feat-2",
      title: "Pediatric Emergency Medicine Fellowship",
      organization: "Children's Hospital",
      location: "Philadelphia, PA",
      salary: "$98,000 / yr",
      tags: ["Pediatrics", "Fellowship"],
      logoColor: "from-teal-500 to-emerald-600"
    },
    {
      id: "feat-3",
      title: "Neurology Clinical Rotation Clerkship",
      organization: "Boston General Hospital",
      location: "Boston, MA (On-site)",
      salary: "$4,500 / mo",
      tags: ["Neurology", "Rotations"],
      logoColor: "from-purple-500 to-indigo-600"
    }
  ];

  // Categories list
  const careerCategories = [
    { name: "Residency Slots", count: "148 Available", icon: Hospital, color: "text-blue-500 bg-blue-500/10" },
    { name: "Fellowship Electives", count: "84 Available", icon: GraduationCap, color: "text-teal-500 bg-teal-500/10" },
    { name: "Clinical Trials", count: "32 Active Trials", icon: Microscope, color: "text-emerald-500 bg-emerald-500/10" },
    { name: "Hospital Internships", count: "110 Spots Open", icon: Briefcase, color: "text-indigo-500 bg-indigo-500/10" },
    { name: "Licensing Vault", count: "Cryptographic", icon: Award, color: "text-purple-500 bg-purple-500/10" },
    { name: "NPI Directory", count: "NPI Node Verified", icon: ShieldCheck, color: "text-rose-500 bg-rose-500/10" }
  ];

  const handleApply = (id, title, org) => {
    if (appliedIds.includes(id)) return;
    setAppliedIds(prev => [...prev, id]);
    addNotification(
      "Application Sent",
      `Your application for '${title}' at ${org} was sent successfully.`,
      "application"
    );
  };

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setWaitlistSubmitted(true);
    addNotification(
      "Waitlist Confirmed",
      `Email ${waitlistEmail} has been added to MedNova's news queue.`,
      "system"
    );
    setWaitlistEmail('');
  };

  // Testimonial Navigation
  const nextTestimonial = () => {
    setActiveTestimonial(prev => (prev + 1) % testimonials.length);
  };
  const prevTestimonial = () => {
    setActiveTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="space-y-24 pb-20 transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Pulsing cardiac background representation (Framer Motion) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-medical-teal/5 dark:bg-medical-teal/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Text details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-6 text-left"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-medical-teal hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-medical-teal animate-pulse" />
              <span>Verifiable Healthcare Network</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Empowering the Next Generation of <span className="bg-gradient-to-r from-medical-teal via-medical-emerald to-primary-blue bg-clip-text text-transparent">Medicine</span>
            </h1>

            {/* Sub-paragraph */}
            <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-light leading-relaxed max-w-xl">
              Connect directly with accredited residencies, secure medical rotations, publish clinical abstracts, and secure your board credentials in a cryptographic digital vault.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              {user ? (
                <Link 
                  to="/dashboard" 
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-medical-teal to-medical-emerald text-white text-sm font-semibold hover:opacity-95 shadow-md shadow-medical-teal/15 transition-all group"
                >
                  Enter Portal Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/signup" 
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-medical-teal to-medical-emerald text-white text-sm font-semibold hover:opacity-95 shadow-md shadow-medical-teal/15 transition-all group"
                  >
                    Join MedNova
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:border-slate-400 dark:hover:bg-slate-800 transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Right Mockup Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-lg"
          >
            {/* Ambient glows behind device */}
            <div className="absolute inset-0 bg-gradient-to-tr from-medical-teal/10 to-primary-blue/10 rounded-3xl filter blur-xl pointer-events-none" />
            
            {/* Device frame mockup */}
            <div className="rounded-2xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="rounded-xl border border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-dark-bg overflow-hidden aspect-[16/11] flex flex-col">
                {/* Header bar */}
                <div className="h-9 border-b border-slate-200 dark:border-slate-900 flex items-center justify-between px-4 bg-white dark:bg-dark-card/50">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">portal.mednova.org/dashboard</span>
                  <div className="w-8" />
                </div>
                
                {/* Simulated Portal Content */}
                <div className="flex-grow p-4 space-y-4 text-left overflow-hidden select-none">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-3 w-28 bg-slate-300 dark:bg-slate-700 rounded" />
                      <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                    <div className="h-6 w-16 bg-medical-teal/20 rounded-full" />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card rounded-lg space-y-2">
                      <div className="h-2 w-8 bg-slate-200 dark:bg-slate-850 rounded" />
                      <div className="h-4 w-4 bg-slate-300 dark:bg-slate-700 rounded" />
                    </div>
                    <div className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card rounded-lg space-y-2">
                      <div className="h-2 w-8 bg-slate-200 dark:bg-slate-850 rounded" />
                      <div className="h-4 w-6 bg-slate-350 dark:bg-slate-700 rounded" />
                    </div>
                    <div className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card rounded-lg space-y-2">
                      <div className="h-2 w-8 bg-slate-200 dark:bg-slate-850 rounded" />
                      <div className="h-4 w-5 bg-slate-300 dark:bg-slate-700 rounded" />
                    </div>
                  </div>

                  <div className="p-3 border border-slate-200 dark:border-slate-900 bg-white dark:bg-dark-card/30 rounded-xl space-y-2">
                    <div className="h-2.5 w-1/3 bg-slate-300 dark:bg-slate-750 rounded" />
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-850 rounded" />
                    <div className="h-1.5 w-5/6 bg-slate-200 dark:bg-slate-850 rounded" />
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. FEATURED OPPORTUNITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">Featured Openings</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light mt-1">Apply directly using verified academic digital portfolios</p>
          </div>
          <Link to="/opportunities" className="text-xs font-semibold text-medical-teal hover:underline flex items-center gap-1 shrink-0">
            Browse All Opportunities
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Opportunities grid with stagger entrance */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {featuredOpportunities.map((opp) => {
            const hasApplied = appliedIds.includes(opp.id);

            return (
              <motion.div 
                key={opp.id} 
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.015, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)" }}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl flex flex-col justify-between gap-6 hover:border-slate-350 dark:hover:border-slate-750 transition-all text-left"
              >
                <div className="space-y-3">
                  {/* Category and Tags */}
                  <div className="flex justify-between items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-905 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded text-[9px] font-bold uppercase tracking-wider">
                      {opp.organization}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{opp.salary}</span>
                  </div>

                  <h3 className="text-base font-display font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 h-10">
                    {opp.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-medical-teal shrink-0" />
                    {opp.location}
                  </p>

                  <div className="flex items-center gap-1.5 pt-1.5">
                    {opp.tags.map((t) => (
                      <span key={t} className="px-2.5 py-0.5 bg-primary-blue/5 dark:bg-primary-blue/10 text-primary-blue rounded-full text-[9px] font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-dark-border/40">
                  {hasApplied ? (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-medical-emerald/10 border border-medical-emerald/20 text-medical-emerald text-xs font-bold"
                    >
                      <CheckCircle2 className="w-4 h-4 text-medical-emerald" />
                      Applied Candidate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(opp.id, opp.title, opp.organization)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-medical-teal to-medical-emerald hover:opacity-95 text-xs font-bold text-white shadow-md shadow-medical-teal/10 transition-all cursor-pointer text-center"
                    >
                      Quick Apply
                    </button>
                  )}
                </div>

              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="bg-slate-100/60 dark:bg-slate-950/40 border-y border-slate-200 dark:border-dark-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">Explore Careers & Tools</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light max-w-md mx-auto">
              Unified portals covering credentials verification and residency shadowing positions.
            </p>
          </div>

          <motion.div 
            variants={categoryContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {careerCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div 
                  key={idx}
                  variants={categoryItemVariants}
                  whileHover={{ y: -5, scale: 1.025, borderSide: "1px solid #14b8a6" }}
                  className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border hover:border-slate-350 dark:hover:border-slate-700 transition-colors flex flex-col justify-between items-center text-center gap-4 group"
                >
                  <div className={`p-3 rounded-xl ${cat.color} group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">{cat.name}</h4>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500">{cat.count}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* 4. STATISTICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-primary-blue/5 via-medical-teal/5 to-transparent border border-slate-200 dark:border-dark-border rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white block">500+</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">Hospital Partners</span>
            </div>
            <div className="space-y-2">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white block">20K+</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">Medical Members</span>
            </div>
            <div className="space-y-2">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white block">99.8%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">Credential Verification</span>
            </div>
            <div className="space-y-2">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white block">100K+</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">Rotation Hours Logged</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW MEDNOVA WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">How MedNova Works</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light max-w-md mx-auto">
            A frictionless ecosystem from credential validation to direct clinical deployment.
          </p>
        </div>

        {/* 3-step grid cards with entrance stagers */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          
          {/* Connecting line (Desktop) */}
          <div className="hidden md:block absolute top-1/3 left-1/6 right-1/6 h-0.5 bg-slate-200 dark:bg-slate-900 z-0" />

          {/* Step 1 */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl flex flex-col items-center gap-4 relative z-10 hover:border-slate-355 dark:hover:border-slate-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-blue text-white flex items-center justify-center font-display font-bold shadow-md shadow-blue-500/15">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Verify Profile NPI</h3>
            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-light text-center">
              Sign up and link your National Provider Identifier or medical student details. Our node validates your registry instantly.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl flex flex-col items-center gap-4 relative z-10 hover:border-slate-355 dark:hover:border-slate-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-medical-teal text-white flex items-center justify-center font-display font-bold shadow-md shadow-teal-500/15">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Match Rotations & Roles</h3>
            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-light text-center">
              Browse clinical rotations, residencies, and fellowships. Filter by criteria and apply using verified credentials.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl flex flex-col items-center gap-4 relative z-10 hover:border-slate-355 dark:hover:border-slate-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-medical-emerald text-white flex items-center justify-center font-display font-bold shadow-md shadow-emerald-500/15">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Secure Certifications</h3>
            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-light text-center">
              Upload ACLS, board registries, or clinical badges to the Certificate Vault to keep credentials secure and verifiable.
            </p>
          </motion.div>

        </motion.div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">Endorsed by Clinicians</h2>
        
        {/* Slider viewport */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-8 sm:p-10 rounded-3xl relative flex flex-col items-center gap-6 shadow-inner">
          <div className="absolute right-4 top-4 text-slate-100 dark:text-slate-900 font-display text-7xl font-extrabold leading-none select-none">
            “
          </div>
          
          {/* Testimonial card contents with horizontal slide transitions */}
          <div className="relative h-40 sm:h-28 flex items-center justify-center w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="space-y-4 w-full"
              >
                <p className="text-sm sm:text-base text-slate-650 dark:text-slate-300 italic font-light leading-relaxed max-w-2xl mx-auto">
                  "{testimonials[activeTestimonial].quote}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 text-left pt-2 border-t border-slate-100 dark:border-dark-border/40 w-full justify-center">
            <img 
              src={testimonials[activeTestimonial].avatar} 
              alt={testimonials[activeTestimonial].name} 
              className="w-11 h-11 rounded-full object-cover border border-slate-300 dark:border-slate-800"
            />
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                {testimonials[activeTestimonial].name}
              </h5>
              <p className="text-[10px] text-slate-550">
                {testimonials[activeTestimonial].role}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-2">
            <button 
              onClick={prevTestimonial}
              className="p-1.5 rounded-lg border border-slate-250 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-650 text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="p-1.5 rounded-lg border border-slate-250 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-650 text-slate-500 hover:text-slate-855 dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 7. CALL TO ACTION (CTA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-medical-teal via-medical-emerald to-primary-blue rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          
          {/* Subtle background visual elements */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
              Ready to Accelerate Your Medical Career?
            </h2>
            <p className="text-xs sm:text-sm text-teal-50 font-light leading-relaxed max-w-md mx-auto">
              Join 20,000+ clinicians and residency coordinators. Secure your profile waits and get licensing alerts instantly.
            </p>

            {/* Waiting list input form */}
            {waitlistSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/20 rounded-xl text-xs font-semibold"
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>You've been added to our waiting list queue!</span>
              </motion.div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1 relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/60">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="doctor@hospital.org"
                    className="block w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-white/60 focus:outline-none focus:bg-white/20 focus:ring-1 focus:ring-white transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Join Waiting List
                </button>
              </form>
            )}

            <div className="pt-2 flex justify-center gap-6 text-[10px] text-teal-100 font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                HIPAA Compliant
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                NPI Verified
              </span>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
export default Home;
