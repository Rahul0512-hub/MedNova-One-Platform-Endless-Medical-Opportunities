import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, Globe, Mail, MapPin, 
  ShieldAlert, Cpu, Sparkles 
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-card border-t border-slate-200 dark:border-dark-border text-slate-650 dark:text-slate-400 py-12 sm:py-16 transition-colors duration-300 relative overflow-hidden z-10 font-sans">
      
      {/* Background ambient light */}
      <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] bg-medical-teal/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: About MedNova */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-medical-teal to-medical-emerald flex items-center justify-center shadow shadow-medical-teal/15 group-hover:scale-105 transition-transform duration-300">
                <HeartPulse className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                Med<span className="text-medical-teal">Nova</span>
              </span>
            </Link>
            <p className="text-xs font-light leading-relaxed text-slate-500 dark:text-slate-400">
              Next-generation, HIPAA-secure ecosystem empowering clinical practitioners, residents, and researchers with unified opportunities, clerkships, and verifiable credentials.
            </p>
            {/* Social Icons (using inline SVGs to avoid Lucide-brand resolution errors) */}
            <div className="flex items-center gap-3.5 pt-2">
              {/* LinkedIn */}
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 dark:text-slate-500 hover:text-medical-teal dark:hover:text-medical-teal transition-all cursor-pointer"
                title="LinkedIn"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* Twitter / X */}
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 dark:text-slate-500 hover:text-medical-teal dark:hover:text-medical-teal transition-all cursor-pointer"
                title="Twitter/X"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              {/* GitHub */}
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 dark:text-slate-500 hover:text-medical-teal dark:hover:text-medical-teal transition-all cursor-pointer"
                title="GitHub"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              {/* Globe */}
              <a 
                href="https://mednova.org"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-355 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 dark:text-slate-500 hover:text-medical-teal dark:hover:text-medical-teal transition-all cursor-pointer"
                title="Website"
              >
                <Globe className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-medical-teal" />
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-slate-900 dark:hover:text-white hover:underline transition-colors font-light">
                  Home Landing Page
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="hover:text-slate-900 dark:hover:text-white hover:underline transition-colors font-light">
                  Find Opportunities
                </Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-slate-900 dark:hover:text-white hover:underline transition-colors font-light">
                  Academic Research
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-slate-900 dark:hover:text-white hover:underline transition-colors font-light">
                  Symposia & Conferences
                </Link>
              </li>
              <li>
                <Link to="/internships" className="hover:text-slate-900 dark:hover:text-white hover:underline transition-colors font-light">
                  Clinical Rotations
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-medical-blue" />
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/vault" className="hover:text-slate-900 dark:hover:text-white hover:underline transition-colors font-light">
                  Certificate Vault Ledger
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white hover:underline transition-colors font-light">
                  NPI Validation Lookup
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white hover:underline transition-colors font-light">
                  Developer Open API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white hover:underline transition-colors font-light">
                  HIPAA Security Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white hover:underline transition-colors font-light">
                  Help Support Desk
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-medical-emerald" />
              Contact info
            </h4>
            <ul className="space-y-3 text-xs font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-405 dark:text-slate-500 shrink-0 mt-0.5" />
                <span className="text-slate-500 dark:text-slate-400 leading-normal">
                  Boston General Hospital Headquarters,<br />
                  55 Fruit St, Boston, MA 02114
                </span>
              </li>
              <li className="flex items-center gap-2.5 pt-1">
                <Mail className="w-4 h-4 text-slate-405 dark:text-slate-500 shrink-0" />
                <a href="mailto:support@mednova.org" className="hover:text-slate-900 dark:hover:text-white hover:underline transition-colors">
                  support@mednova.org
                </a>
              </li>
              <li className="pt-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-medical-emerald/10 text-medical-emerald border border-medical-emerald/15 text-[10px] font-semibold uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 bg-medical-emerald rounded-full animate-pulse" />
                  Systems Operational
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Panel */}
        <div className="border-t border-slate-200 dark:border-dark-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-light text-slate-450 dark:text-slate-500">
          <p>© 2026 MedNova, Inc. All rights reserved. Registered NPI node.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-805 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-805 dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-805 dark:hover:text-white transition-colors">Compliance Audit</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
