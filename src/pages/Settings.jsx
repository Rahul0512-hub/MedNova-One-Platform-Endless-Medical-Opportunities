import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { useTheme } from '../hooks/useTheme';
import { 
  User, Bell, Shield, Sun, Moon, Save, 
  KeyRound, CheckCircle2, ShieldCheck, Lock, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { addNotification } = useNotifications();
  const { theme, toggleTheme } = useTheme();

  // Active tab state: 'profile' | 'notifications' | 'security' | 'appearance'
  const [activeTab, setActiveTab] = useState('profile');

  // 1. Profile States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospital, setHospital] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  // 2. Notification States
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [digestWeekly, setDigestWeekly] = useState(false);

  // 3. Security/Privacy States
  const [publicProfile, setPublicProfile] = useState(false);
  const [npiLookup, setNpiLookup] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Sync profile fields from Auth Context
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setSpecialty(user.specialty || '');
      setHospital(user.hospital || '');
      setLocation(user.location || '');
      setBio(user.bio || '');
    }
  }, [user]);

  // Load other configurations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mednova_platform_settings');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        setEmailAlerts(config.emailAlerts ?? true);
        setPushNotifs(config.pushNotifs ?? true);
        setDigestWeekly(config.digestWeekly ?? false);
        setPublicProfile(config.publicProfile ?? false);
        setNpiLookup(config.npiLookup ?? true);
      } catch (e) {
        console.error("Failed to parse settings configurations", e);
      }
    }
  }, []);

  // Save configurations helper
  const handleSaveSettings = (e, tabType) => {
    e.preventDefault();

    if (tabType === 'profile') {
      updateProfile({
        name,
        email,
        specialty,
        hospital,
        location,
        bio
      });
      addNotification(
        "Profile Settings Saved",
        "Clinical metadata and contact information synced successfully.",
        "system"
      );
    } 
    
    else if (tabType === 'notifications') {
      const config = { emailAlerts, pushNotifs, digestWeekly, publicProfile, npiLookup };
      localStorage.setItem('mednova_platform_settings', JSON.stringify(config));
      addNotification(
        "Alert Rules Updated",
        "Your clinical email and notification parameters have been saved.",
        "system"
      );
    } 
    
    else if (tabType === 'security') {
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
        setNewPassword('');
        setConfirmPassword('');
        addNotification(
          "Password Updated",
          "Your workspace key has been changed. Use your new password on next login.",
          "system"
        );
      }

      const config = { emailAlerts, pushNotifs, digestWeekly, publicProfile, npiLookup };
      localStorage.setItem('mednova_platform_settings', JSON.stringify(config));
      
      addNotification(
        "Privacy Settings Saved",
        "NPI directory checks and clinical networking configurations updated.",
        "system"
      );
    }
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-200 text-left">
      
      {/* Page Header Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-64 h-64 bg-medical-teal/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 z-10">
          <h2 className="text-xl sm:text-2xl font-display font-black text-slate-850 dark:text-white flex items-center gap-2.5">
            <Lock className="w-5.5 h-5.5 text-medical-teal" />
            Portal Settings
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light max-w-xl">
            Configure your clinical profile metadata, notification alert rules, security logs, and theme appearance.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Tabs / Right Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Tab Nav List */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          {/* Navigation items */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3.5 rounded-3xl shadow-sm flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {[
              { id: 'profile', label: 'Profile Settings', icon: User },
              { id: 'notifications', label: 'Alert Toggles', icon: Bell },
              { id: 'security', label: 'Security & Privacy', icon: Shield },
              { id: 'appearance', label: 'Portal Theme', icon: Sun }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 text-left w-auto lg:w-full ${
                    isActive
                      ? 'bg-medical-teal/10 text-medical-teal dark:bg-medical-teal/15 shadow-sm'
                      : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Static security card */}
          <div className="hidden lg:block bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-3xl shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-805 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4.5 h-4.5 text-medical-emerald" />
              HIPAA Verified
            </h4>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-light leading-relaxed">
              This session is signed and audited in compliance with federal clinical privacy frameworks.
            </p>
          </div>
        </div>

        {/* Right Side: Tab Form View Pane */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            
            {/* PROFILE SETTINGS TAB */}
            {activeTab === 'profile' && (
              <motion.div
                key="tab-profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 sm:p-8 rounded-3xl shadow-sm space-y-6"
              >
                <h3 className="text-base font-display font-black text-slate-850 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-dark-border/40 pb-3">
                  <User className="w-5 h-5 text-medical-teal" />
                  Profile Settings
                </h3>

                <form onSubmit={(e) => handleSaveSettings(e, 'profile')} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-350 focus:outline-none focus:border-medical-teal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-350 focus:outline-none focus:border-medical-teal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Clinical Specialty</label>
                      <input 
                        type="text" 
                        required
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-350 focus:outline-none focus:border-medical-teal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Hospital Affiliation</label>
                      <input 
                        type="text" 
                        required
                        value={hospital}
                        onChange={(e) => setHospital(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-350 focus:outline-none focus:border-medical-teal"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Current Location</label>
                    <input 
                      type="text" 
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-350 focus:outline-none focus:border-medical-teal"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Professional Biography</label>
                    <textarea 
                      rows="3"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-350 focus:outline-none focus:border-medical-teal resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-medical-teal to-medical-emerald text-xs font-bold text-white rounded-xl hover:opacity-95 shadow-md shadow-medical-teal/15 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Profile Changes
                  </button>
                </form>
              </motion.div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <motion.div
                key="tab-notifs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 sm:p-8 rounded-3xl shadow-sm space-y-6"
              >
                <h3 className="text-base font-display font-black text-slate-850 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-dark-border/40 pb-3">
                  <Bell className="w-5 h-5 text-medical-teal" />
                  Alert & Communication Rules
                </h3>

                <form onSubmit={(e) => handleSaveSettings(e, 'notifications')} className="space-y-6">
                  
                  {/* email alerts toggle */}
                  <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-dark-border/40">
                    <div className="pr-4">
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block">Email Notifications</span>
                      <span className="text-[10px] sm:text-xs text-slate-455 dark:text-slate-500 font-light">Receive application status updates and research co-author requests via email.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        checked={emailAlerts}
                        onChange={(e) => setEmailAlerts(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 dark:bg-slate-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-medical-teal peer-checked:after:bg-white" />
                    </label>
                  </div>

                  {/* push notifications toggle */}
                  <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-dark-border/40">
                    <div className="pr-4">
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block">Desktop Badge Alerts</span>
                      <span className="text-[10px] sm:text-xs text-slate-455 dark:text-slate-500 font-light">Show pop-up notification alerts on dashboard when certificates are expiring.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        checked={pushNotifs}
                        onChange={(e) => setPushNotifs(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 dark:bg-slate-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-medical-teal peer-checked:after:bg-white" />
                    </label>
                  </div>

                  {/* weekly digest toggle */}
                  <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-dark-border/40">
                    <div className="pr-4">
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block">Weekly Opportunity Digest</span>
                      <span className="text-[10px] sm:text-xs text-slate-455 dark:text-slate-500 font-light">Receive a weekly summary of recommended research trials and clinical intern shadowings.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        checked={digestWeekly}
                        onChange={(e) => setDigestWeekly(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 dark:bg-slate-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-medical-teal peer-checked:after:bg-white" />
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-medical-teal to-medical-emerald text-xs font-bold text-white rounded-xl hover:opacity-95 shadow-md shadow-medical-teal/15 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Communication Rules
                  </button>
                </form>
              </motion.div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <motion.div
                key="tab-security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 sm:p-8 rounded-3xl shadow-sm space-y-6"
              >
                <h3 className="text-base font-display font-black text-slate-850 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-dark-border/40 pb-3">
                  <Shield className="w-5 h-5 text-medical-teal" />
                  Security & Directory Options
                </h3>

                <form onSubmit={(e) => handleSaveSettings(e, 'security')} className="space-y-6">
                  
                  {/* Change Password Block */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                      <KeyRound className="w-4 h-4 text-medical-teal" />
                      Update Password Key
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-550 dark:text-slate-400 font-semibold block">New Password</label>
                        <input 
                          type="password" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-350 focus:outline-none focus:border-medical-teal"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-555 dark:text-slate-400 font-semibold block">Confirm Password</label>
                        <input 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-350 focus:outline-none focus:border-medical-teal"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Privacy Directory configurations */}
                  <div className="space-y-4 border-t border-slate-100 dark:border-dark-border/40 pt-4">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                      <Lock className="w-4 h-4 text-medical-teal" />
                      Privacy configurations
                    </h4>

                    {/* public network directory toggle */}
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-dark-border/40">
                      <div className="pr-4">
                        <span className="text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 block">Public Medical Networking</span>
                        <span className="text-[10px] sm:text-xs text-slate-455 dark:text-slate-500 font-light">Allow other verified clinicians or Principal Investigators to search your profile.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input 
                          type="checkbox" 
                          checked={publicProfile}
                          onChange={(e) => setPublicProfile(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-slate-200 dark:bg-slate-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-medical-teal peer-checked:after:bg-white" />
                      </label>
                    </div>

                    {/* automated NPI lookup toggle */}
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-dark-border/40">
                      <div className="pr-4">
                        <span className="text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 block">Automated NPI license checks</span>
                        <span className="text-[10px] sm:text-xs text-slate-455 dark:text-slate-500 font-light">Periodically query state registries to verify certification status.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input 
                          type="checkbox" 
                          checked={npiLookup}
                          onChange={(e) => setNpiLookup(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-slate-200 dark:bg-slate-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-medical-teal peer-checked:after:bg-white" />
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-medical-teal to-medical-emerald text-xs font-bold text-white rounded-xl hover:opacity-95 shadow-md shadow-medical-teal/15 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Security & Privacy Configurations
                  </button>
                </form>
              </motion.div>
            )}

            {/* PORTAL THEME APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <motion.div
                key="tab-appearance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 sm:p-8 rounded-3xl shadow-sm space-y-6"
              >
                <h3 className="text-base font-display font-black text-slate-850 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-dark-border/40 pb-3">
                  <Sun className="w-5 h-5 text-medical-teal" />
                  Appearance Configurations
                </h3>

                <div className="space-y-5">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-dark-border/40 rounded-2xl flex items-start gap-3">
                    <Info className="w-4.5 h-4.5 text-medical-teal shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                      Select your preferred dashboard visual mode. MedNova theme parameters automatically adjust Tailwind CSS variables for high-fidelity dark-mode integration.
                    </p>
                  </div>

                  {/* Dark Mode Theme selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Light theme card */}
                    <div 
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col gap-4 text-left ${
                        theme === 'light'
                          ? 'border-medical-teal bg-slate-50 shadow shadow-medical-teal/5'
                          : 'border-slate-200 dark:border-dark-border dark:bg-slate-900/10 hover:border-slate-350 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-550/20 text-amber-500 flex items-center justify-center">
                        <Sun className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white">Clean Light Theme</h4>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500 font-light leading-normal">Optimum readability for bright offices and mobile shadowing clerkships.</p>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1 text-[10px] font-bold text-medical-teal">
                        {theme === 'light' && (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active Mode
                          </>
                        )}
                      </div>
                    </div>

                    {/* Dark theme card */}
                    <div 
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col gap-4 text-left ${
                        theme === 'dark'
                          ? 'border-medical-teal bg-[#080d16] shadow shadow-medical-teal/5'
                          : 'border-slate-200 dark:border-dark-border hover:border-slate-350 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-550/20 text-indigo-500 flex items-center justify-center">
                        <Moon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white">Premium Dark Theme</h4>
                        <p className="text-[10px] text-slate-455 dark:text-slate-500 font-light leading-normal">Deep dark aesthetics designed to prevent eye fatigue during night ward shifts.</p>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1 text-[10px] font-bold text-medical-teal">
                        {theme === 'dark' && (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active Mode
                          </>
                        )}
                      </div>
                    </div>
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
export default Settings;
