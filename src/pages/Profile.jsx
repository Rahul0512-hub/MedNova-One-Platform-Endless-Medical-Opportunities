import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { mockCertificates, mockResearch } from '../data/mockData';
import { 
  MapPin, Hospital, Edit3, Save, CheckCircle2, Award, 
  GraduationCap, Microscope, BookOpen, Quote, Trophy, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);

  // 1. Local States for core user fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospital, setHospital] = useState('');
  const [location, setLocation] = useState('');

  // 2. Extra Profile Attributes (Education, Skills, Achievements)
  const [extraInfo, setExtraInfo] = useState(() => {
    const saved = localStorage.getItem('mednova_profile_extra');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse extra profile info from localStorage", e);
      }
    }
    const defaults = {
      education: [
        { degree: "Doctor of Medicine (M.D.)", institution: "Harvard Medical School", years: "2020 - 2024" },
        { degree: "Bachelor of Science in Bioengineering", institution: "Stanford University", years: "2016 - 2020" }
      ],
      skills: ["Cardiothoracic Surgery", "Echocardiography", "Genomics", "Biostatistics", "CRISPR Editing", "HIPAA Protocol"],
      achievements: [
        { title: "Outstanding Clinical Resident Award", organization: "Boston General Hospital", year: "2025" },
        { title: "Young Investigator Grant Winner", organization: "National Institutes of Health (NIH)", year: "2025" }
      ]
    };
    localStorage.setItem('mednova_profile_extra', JSON.stringify(defaults));
    return defaults;
  });

  // Edit states for extra info (Education & Achievements separated into rows for easy input validation)
  const [editSkills, setEditSkills] = useState('');
  
  const [eduDegree1, setEduDegree1] = useState('');
  const [eduSchool1, setEduSchool1] = useState('');
  const [eduYears1, setEduYears1] = useState('');
  
  const [eduDegree2, setEduDegree2] = useState('');
  const [eduSchool2, setEduSchool2] = useState('');
  const [eduYears2, setEduYears2] = useState('');

  const [achTitle1, setAchTitle1] = useState('');
  const [achOrg1, setAchOrg1] = useState('');
  const [achYear1, setAchYear1] = useState('');

  const [achTitle2, setAchTitle2] = useState('');
  const [achOrg2, setAchOrg2] = useState('');
  const [achYear2, setAchYear2] = useState('');

  // Sync auth user fields
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setRole(user.role || '');
      setBio(user.bio || '');
      setSpecialty(user.specialty || '');
      setHospital(user.hospital || '');
      setLocation(user.location || '');
    }
  }, [user]);

  // Sync edit fields when entering edit mode
  useEffect(() => {
    if (isEditing && extraInfo) {
      setEditSkills(extraInfo.skills.join(', '));
      
      const edu1 = extraInfo.education[0] || { degree: '', institution: '', years: '' };
      setEduDegree1(edu1.degree);
      setEduSchool1(edu1.institution);
      setEduYears1(edu1.years);

      const edu2 = extraInfo.education[1] || { degree: '', institution: '', years: '' };
      setEduDegree2(edu2.degree);
      setEduSchool2(edu2.institution);
      setEduYears2(edu2.years);

      const ach1 = extraInfo.achievements[0] || { title: '', organization: '', year: '' };
      setAchTitle1(ach1.title);
      setAchOrg1(ach1.organization);
      setAchYear1(ach1.year);

      const ach2 = extraInfo.achievements[1] || { title: '', organization: '', year: '' };
      setAchTitle2(ach2.title);
      setAchOrg2(ach2.organization);
      setAchYear2(ach2.year);
    }
  }, [isEditing, extraInfo]);

  // 3. Database Integrations (Read live certificates and research papers)
  const liveCertificates = useMemo(() => {
    const saved = localStorage.getItem('mednova_vault_certificates');
    return saved ? JSON.parse(saved) : mockCertificates;
  }, []);

  const livePublications = useMemo(() => {
    const saved = localStorage.getItem('mednova_logged_publications');
    return saved ? JSON.parse(saved) : mockResearch;
  }, []);

  // 4. Save handler
  const handleSave = (e) => {
    e.preventDefault();

    // Update global Auth user profile metadata
    updateProfile({
      name,
      role,
      bio,
      specialty,
      hospital,
      location
    });

    // Update extra profile structures
    const updatedExtra = {
      skills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
      education: [
        { degree: eduDegree1, institution: eduSchool1, years: eduYears1 },
        { degree: eduDegree2, institution: eduSchool2, years: eduYears2 }
      ].filter(edu => edu.degree && edu.institution),
      achievements: [
        { title: achTitle1, organization: achOrg1, year: achYear1 },
        { title: achTitle2, organization: achOrg2, year: achYear2 }
      ].filter(ach => ach.title && ach.organization)
    };

    setExtraInfo(updatedExtra);
    localStorage.setItem('mednova_profile_extra', JSON.stringify(updatedExtra));

    addNotification(
      "Profile Settings Updated",
      "Successfully updated your clinical profile and academic curriculum vitae.",
      "system"
    );
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 text-slate-800 dark:text-slate-200">
      
      {/* A. Profile Header Widget Card */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
        <div className="absolute right-0 top-0 w-64 h-64 bg-medical-teal/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Profile Picture */}
        <div className="shrink-0 relative">
          <img 
            src={user?.avatar} 
            alt={user?.name} 
            className="w-24 h-24 rounded-full border-2 border-slate-200 dark:border-slate-700 object-cover shadow-xl bg-slate-800"
          />
          <span className="absolute bottom-1 right-1 w-4.5 h-4.5 bg-medical-emerald border-4 border-white dark:border-dark-card rounded-full" />
        </div>

        {/* Short info summary */}
        <div className="text-center md:text-left space-y-2 flex-grow min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-2.5">
            <h2 className="text-xl sm:text-2xl font-display font-black text-slate-850 dark:text-white tracking-tight">
              {user?.name}
            </h2>
            <span className="self-center flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-medical-emerald/10 border border-medical-emerald/20 text-medical-emerald text-[9px] font-extrabold uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              Verified Physician
            </span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-medical-teal">{user?.role}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-2 text-xs text-slate-450 dark:text-slate-400 font-light pt-1">
            <span className="flex items-center gap-1.5">
              <Hospital className="w-4 h-4 text-slate-400 shrink-0" />
              {user?.hospital}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              {user?.location}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light pt-2 max-w-2xl mx-auto md:mx-0">
            {user?.bio}
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="md:self-start flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border hover:border-slate-350 dark:hover:border-slate-700 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-sm hover:shadow"
        >
          <Edit3 className="w-4.5 h-4.5" />
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      {/* B. Main Two-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Skills, Achievements, Certificates Quick View) */}
        <div className="space-y-8 lg:col-span-1 text-left">
          
          {/* 1. Skills Cloud */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-base font-display font-black text-slate-850 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-medical-teal" />
              Clinical Skills
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {extraInfo.skills.map((skill) => (
                <span 
                  key={skill}
                  className="px-2.5 py-1 text-[10px] bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-dark-border text-slate-650 dark:text-slate-350 rounded-xl font-semibold hover:border-medical-teal hover:text-medical-teal transition-all cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Achievements Ledger */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-base font-display font-black text-slate-850 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-medical-teal" />
              Achievements & Grants
            </h3>
            <div className="space-y-4 pt-1">
              {extraInfo.achievements.map((ach, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl shrink-0 mt-0.5">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">{ach.title}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{ach.organization} • {ach.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Credentials Vault Quick-look */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-base font-display font-black text-slate-850 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-medical-teal" />
              Verified Credentials
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-dark-border/60">
              {liveCertificates.map((cert) => (
                <div key={cert.id} className="py-3 flex justify-between items-center gap-4">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{cert.title}</h4>
                    <p className="text-[9px] text-slate-450 dark:text-slate-500 truncate">{cert.issuer}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-medical-emerald/10 border border-medical-emerald/20 text-medical-emerald text-[9px] font-extrabold uppercase tracking-wide shrink-0 rounded">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Edit Area OR Education Timeline + Research Portfolio) */}
        <div className="lg:col-span-2 space-y-8 text-left">
          
          <AnimatePresence mode="wait">
            {isEditing ? (
              // EDIT PROFILE MODE PANEL
              <motion.div
                key="edit-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 sm:p-8 rounded-3xl shadow-sm space-y-6"
              >
                <h3 className="text-base font-display font-black text-slate-850 dark:text-white border-b border-slate-100 dark:border-dark-border/40 pb-3">
                  Edit Clinical Profile
                </h3>
                
                <form onSubmit={handleSave} className="space-y-5">
                  {/* Basic user info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Full Name</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required
                        className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Clinical Specialty</label>
                      <input 
                        type="text" 
                        value={specialty} 
                        onChange={(e) => setSpecialty(e.target.value)} 
                        required
                        className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Clinical Role Description</label>
                    <input 
                      type="text" 
                      value={role} 
                      onChange={(e) => setRole(e.target.value)} 
                      required
                      className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Hospital Affiliation</label>
                      <input 
                        type="text" 
                        value={hospital} 
                        onChange={(e) => setHospital(e.target.value)} 
                        required
                        className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Location</label>
                      <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        required
                        className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Professional Biography</label>
                    <textarea 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)} 
                      rows="3"
                      className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal resize-none leading-relaxed"
                    />
                  </div>

                  {/* Skills input */}
                  <div className="space-y-1 border-t border-slate-100 dark:border-dark-border/40 pt-4">
                    <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Skills (comma separated)</label>
                    <input 
                      type="text"
                      value={editSkills}
                      onChange={(e) => setEditSkills(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal"
                    />
                  </div>

                  {/* Education inputs */}
                  <div className="space-y-4 border-t border-slate-100 dark:border-dark-border/40 pt-4">
                    <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Education History</label>
                    
                    {/* Edu Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-550/5 dark:bg-[#070b13] border border-slate-150 dark:border-dark-border/40 rounded-2xl">
                      <div className="space-y-1 sm:col-span-1">
                        <span className="text-[10px] text-slate-450 uppercase tracking-wider font-bold">Degree</span>
                        <input type="text" value={eduDegree1} onChange={(e)=>setEduDegree1(e.target.value)} placeholder="e.g. M.D." className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-300" />
                      </div>
                      <div className="space-y-1 sm:col-span-1">
                        <span className="text-[10px] text-slate-450 uppercase tracking-wider font-bold">School</span>
                        <input type="text" value={eduSchool1} onChange={(e)=>setEduSchool1(e.target.value)} placeholder="University" className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-300" />
                      </div>
                      <div className="space-y-1 sm:col-span-1">
                        <span className="text-[10px] text-slate-450 uppercase tracking-wider font-bold">Years</span>
                        <input type="text" value={eduYears1} onChange={(e)=>setEduYears1(e.target.value)} placeholder="Years" className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-300" />
                      </div>
                    </div>

                    {/* Edu Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-550/5 dark:bg-[#070b13] border border-slate-150 dark:border-dark-border/40 rounded-2xl">
                      <div className="space-y-1 sm:col-span-1">
                        <span className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">Degree</span>
                        <input type="text" value={eduDegree2} onChange={(e)=>setEduDegree2(e.target.value)} placeholder="e.g. B.S." className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-300" />
                      </div>
                      <div className="space-y-1 sm:col-span-1">
                        <span className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">School</span>
                        <input type="text" value={eduSchool2} onChange={(e)=>setEduSchool2(e.target.value)} placeholder="University" className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-300" />
                      </div>
                      <div className="space-y-1 sm:col-span-1">
                        <span className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">Years</span>
                        <input type="text" value={eduYears2} onChange={(e)=>setEduYears2(e.target.value)} placeholder="Years" className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-300" />
                      </div>
                    </div>
                  </div>

                  {/* Achievements inputs */}
                  <div className="space-y-4 border-t border-slate-100 dark:border-dark-border/40 pt-4">
                    <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Achievements & Awards</label>
                    
                    {/* Ach Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-550/5 dark:bg-[#070b13] border border-slate-150 dark:border-dark-border/40 rounded-2xl">
                      <div className="space-y-1 sm:col-span-1">
                        <span className="text-[10px] text-slate-450 uppercase tracking-wider font-bold">Award Title</span>
                        <input type="text" value={achTitle1} onChange={(e)=>setAchTitle1(e.target.value)} placeholder="Award Name" className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-300" />
                      </div>
                      <div className="space-y-1 sm:col-span-1">
                        <span className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">Organization</span>
                        <input type="text" value={achOrg1} onChange={(e)=>setAchOrg1(e.target.value)} placeholder="Issuer Agency" className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-300" />
                      </div>
                      <div className="space-y-1 sm:col-span-1">
                        <span className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">Year</span>
                        <input type="text" value={achYear1} onChange={(e)=>setAchYear1(e.target.value)} placeholder="Year" className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-300" />
                      </div>
                    </div>

                    {/* Ach Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-550/5 dark:bg-[#070b13] border border-slate-150 dark:border-dark-border/40 rounded-2xl">
                      <div className="space-y-1 sm:col-span-1">
                        <span className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">Award Title</span>
                        <input type="text" value={achTitle2} onChange={(e)=>setAchTitle2(e.target.value)} placeholder="Award Name" className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-300" />
                      </div>
                      <div className="space-y-1 sm:col-span-1">
                        <span className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">Organization</span>
                        <input type="text" value={achOrg2} onChange={(e)=>setAchOrg2(e.target.value)} placeholder="Issuer Agency" className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-300" />
                      </div>
                      <div className="space-y-1 sm:col-span-1">
                        <span className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">Year</span>
                        <input type="text" value={achYear2} onChange={(e)=>setAchYear2(e.target.value)} placeholder="Year" className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-300" />
                      </div>
                    </div>
                  </div>

                  {/* Form Submission */}
                  <div className="pt-2 flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-medical-teal to-medical-emerald text-white text-xs font-bold shadow-md shadow-medical-teal/10 transition-all cursor-pointer text-center"
                    >
                      <Save className="w-4 h-4" />
                      Save Settings Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              // READ-ONLY PROFILE VIEWS (EDUCATION TIMELINE + PUBLICATIONS)
              <motion.div
                key="read-mode"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* 1. Education Timeline */}
                <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                  <h3 className="text-base font-display font-black text-slate-850 dark:text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-medical-teal" />
                    Education Details
                  </h3>
                  
                  <div className="relative border-l border-slate-150 dark:border-dark-border/80 pl-6 ml-2.5 space-y-6 pt-1 text-left">
                    {extraInfo.education.map((edu, idx) => (
                      <div key={idx} className="relative space-y-1">
                        <span className="absolute -left-[31px] top-0.5 p-1 bg-slate-50 dark:bg-dark-card border-2 border-slate-200 dark:border-slate-800 rounded-full text-slate-400 dark:text-slate-500">
                          <GraduationCap className="w-3.5 h-3.5" />
                        </span>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{edu.degree}</h4>
                          <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold">{edu.years}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-light flex items-center gap-1">
                          <Hospital className="w-3 h-3 text-slate-400 shrink-0" />
                          {edu.institution}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Publications & Research experience portfolio */}
                <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                  <h3 className="text-base font-display font-black text-slate-850 dark:text-white flex items-center gap-2">
                    <Microscope className="w-5 h-5 text-medical-teal" />
                    Research & Publications
                  </h3>

                  <div className="space-y-4">
                    {livePublications.map((pub) => (
                      <div 
                        key={pub.id} 
                        className="p-4 bg-slate-50 dark:bg-[#080d16] border border-slate-150 dark:border-dark-border/40 rounded-2xl flex flex-col gap-3 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-medical-teal/5 to-transparent pointer-events-none" />

                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 hover:text-medical-teal transition-colors line-clamp-2 pr-4">
                            {pub.title}
                          </h4>
                          <p className="text-[10px] text-slate-450 dark:text-slate-400 flex items-center gap-1 pt-0.5">
                            <BookOpen className="w-3 h-3 text-medical-teal shrink-0" />
                            {pub.journal}
                          </p>
                        </div>

                        {/* Citation & Coauthors */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/50 dark:border-dark-border/20 text-[10px]">
                          <div className="flex items-center gap-3 text-slate-450 dark:text-slate-550">
                            <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400">
                              <Quote className="w-3 h-3 text-medical-teal" />
                              {pub.citations} Citations
                            </span>
                            <span>•</span>
                            <span>Role: <strong className="text-slate-650 dark:text-slate-350">{pub.role}</strong></span>
                          </div>

                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-dark-border/80 rounded text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                            Co-Authors: {pub.coauthors.join(', ') || 'None'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
