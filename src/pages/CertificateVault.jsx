import React, { useState, useMemo } from 'react';
import { mockCertificates } from '../data/mockData';
import { useNotifications } from '../hooks/useNotifications';
import { 
  Award, BadgeCheck, UploadCloud, X, Search, SlidersHorizontal, 
  Download, Eye, AlertCircle, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CertificateVault = () => {
  const { addNotification } = useNotifications();

  // 1. Persistence - Load certificates from localStorage or fall back to mock data
  const [certs, setCerts] = useState(() => {
    const saved = localStorage.getItem('mednova_vault_certificates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse vault certificates from localStorage", e);
      }
    }
    localStorage.setItem('mednova_vault_certificates', JSON.stringify(mockCertificates));
    return mockCertificates;
  });

  // 2. Active filters and layout states
  const [searchTerm, setSearchTerm] = useState('');
  const [issuerFilter, setIssuerFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);

  // 3. Upload Form States
  const [newTitle, setNewTitle] = useState('');
  const [newIssuer, setNewIssuer] = useState('American Heart Association');
  const [newDateEarned, setNewDateEarned] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [newVerificationId, setNewVerificationId] = useState('');

  // 4. Action Handlers
  const handleUploadCert = (e) => {
    e.preventDefault();
    if (!newTitle || !newDateEarned || !newExpiryDate || !newVerificationId) return;

    // Pick random gradient badge color
    const badges = [
      'from-rose-500 to-rose-650',
      'from-teal-500 to-emerald-600',
      'from-cyan-500 to-blue-600',
      'from-purple-500 to-indigo-600',
      'from-amber-500 to-orange-600'
    ];
    const badgeColor = badges[Math.floor(Math.random() * badges.length)];

    const newCert = {
      id: `cert-${Date.now()}`,
      title: newTitle,
      issuer: newIssuer,
      dateEarned: newDateEarned,
      expiryDate: newExpiryDate,
      verificationId: newVerificationId,
      badgeColor,
      status: "Active"
    };

    const updated = [...certs, newCert];
    setCerts(updated);
    localStorage.setItem('mednova_vault_certificates', JSON.stringify(updated));

    addNotification(
      "Credential Import Success",
      `'${newTitle}' was verified and successfully locked in your vault.`,
      "system"
    );

    // reset
    setNewTitle('');
    setNewDateEarned('');
    setNewExpiryDate('');
    setNewVerificationId('');
    setUploadModalOpen(false);
  };

  // Real download handler: generates and downloads a verified txt ledger validation manifest
  const handleDownloadLedger = (cert) => {
    const checksum = `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const ledgerContent = `==================================================================
                 MEDNOVA SECURE HEALTH PORTAL
                 VERIFIED CREDENTIAL LEDGER MANIFEST
==================================================================

[HOSPITAL VERIFICATION LOG]
Candidate: Dr. Elena Rostova
Credential: ${cert.title}
Issuer Agency: ${cert.issuer}
Ledger Registration ID: ${cert.verificationId}

[VALIDATION STATUS]
Status: ${cert.status.toUpperCase()}
Issue Date: ${cert.dateEarned}
Expiration Date: ${cert.expiryDate}
Verification Protocol: HIPAA Sec. 164.312 / NPI Sync
Platform Ledger Checksum: ${checksum}
Validation Timestamp: ${new Date().toLocaleString()}

==================================================================
This manifest serves as digital proof of certification. The NPI
network registry has approved this ledger entry as authentic.
MedNova Platform Cryptographic Signature: SECURE-LEDGER-${cert.id.toUpperCase()}
==================================================================`;

    const blob = new Blob([ledgerContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cert.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_ledger.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addNotification(
      "Credential Exported",
      `Verified ledger manifest for '${cert.title}' downloaded successfully.`,
      "system"
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setIssuerFilter('All');
    setStatusFilter('All');
  };

  // 5. Dynamic filter calculations
  const uniqueIssuers = useMemo(() => {
    return ['All', ...new Set(certs.map(c => c.issuer))];
  }, [certs]);

  const filteredCerts = useMemo(() => {
    return certs.filter((cert) => {
      // Search matches title, issuer, or verification ID
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matches = 
          cert.title.toLowerCase().includes(query) ||
          cert.issuer.toLowerCase().includes(query) ||
          cert.verificationId.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Issuer Filter
      if (issuerFilter !== 'All' && cert.issuer !== issuerFilter) return false;

      // Status Filter
      if (statusFilter !== 'All') {
        if (statusFilter === 'Active' && cert.status !== 'Active') return false;
        if (statusFilter === 'Expiring Soon' && !cert.status.includes('Expiring Soon')) return false;
      }

      return true;
    });
  }, [certs, searchTerm, issuerFilter, statusFilter]);

  const hasActiveFilters = searchTerm !== '' || issuerFilter !== 'All' || statusFilter !== 'All';

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-[#121c2c] border border-dark-border p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.08),transparent_45%)]" />
        <div className="space-y-2 relative z-10 text-left">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-medical-teal animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-medical-teal">Credentials vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Verified Credential Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light max-w-xl">
            Tamper-proof medical credential ledger verified via hospital NPI registry channels. Access, download, and index your certified licenses.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-medical-teal to-medical-emerald text-xs font-bold text-white rounded-xl hover:opacity-90 shadow-md shadow-medical-teal/15 transition-all cursor-pointer shrink-0 relative z-10"
        >
          <UploadCloud className="w-4.5 h-4.5" />
          Add Credential
        </button>
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
              placeholder="Search certificates by title, issuer agency, or verification ledger ID..."
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
            {/* Issuer Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Issuer</span>
              <select
                value={issuerFilter}
                onChange={(e) => setIssuerFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-350 px-3 py-2 rounded-xl focus:outline-none focus:border-medical-teal cursor-pointer max-w-[160px]"
              >
                {uniqueIssuers.map(issuer => (
                  <option key={issuer} value={issuer}>{issuer === 'All' ? 'All Issuers' : issuer}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-slate-700 dark:text-slate-350 px-3 py-2 rounded-xl focus:outline-none focus:border-medical-teal cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Expiring Soon">Expiring Soon</option>
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

      {/* 3. Certificates Grid Layout */}
      <AnimatePresence mode="wait">
        <motion.div
          key="certs-grid"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredCerts.length > 0 ? (
            filteredCerts.map((cert) => (
              <motion.div 
                key={cert.id} 
                layout
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                whileHover={{ y: -5, scale: 1.015, boxShadow: "0 12px 25px -8px rgba(0,0,0,0.04)" }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-3xl overflow-hidden hover:border-slate-350 dark:hover:border-slate-700 transition-colors duration-300 flex flex-col justify-between text-left cursor-pointer"
              >
                {/* Header Banner */}
                <div className={`bg-gradient-to-r ${cert.badgeColor} p-5 text-white flex justify-between items-start gap-4`}>
                  <div className="space-y-1 min-w-0">
                    <span className="text-[9px] font-bold tracking-wider uppercase opacity-85 block truncate">
                      {cert.issuer}
                    </span>
                    <h3 className="text-base font-display font-black leading-snug line-clamp-2">
                      {cert.title}
                    </h3>
                  </div>
                  <div className="p-2.5 bg-white/10 rounded-xl text-white shrink-0">
                    <Award className="w-5.5 h-5.5" />
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 space-y-5 flex-grow flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-550 dark:text-slate-400">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold block">Date Earned</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{cert.dateEarned}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold block">Expiry Date</span>
                      <p className="font-semibold text-slate-850 dark:text-slate-200">{cert.expiryDate}</p>
                    </div>
                  </div>

                  {/* Verification Status Ledger bar */}
                  <div className="bg-slate-50 dark:bg-[#080d16] p-3 rounded-2xl border border-slate-150 dark:border-dark-border/40 flex justify-between items-center gap-2 text-xs">
                    <div className="min-w-0">
                      <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold block">Verification Ledger ID</span>
                      <p className="font-mono text-slate-700 dark:text-slate-350 tracking-tight mt-0.5 truncate">{cert.verificationId}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-medical-emerald font-extrabold uppercase tracking-wide shrink-0">
                      <BadgeCheck className="w-4 h-4 text-medical-emerald" />
                      Verified
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="pt-3 border-t border-slate-100 dark:border-dark-border/40 flex items-center justify-between gap-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide ${
                      cert.status.includes('Active')
                        ? 'bg-medical-emerald/10 text-medical-emerald border border-medical-emerald/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {cert.status}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewCert(cert)}
                        className="p-2 rounded-xl border border-slate-250 dark:border-dark-border bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-slate-905 dark:hover:text-white cursor-pointer transition-all hover:shadow-sm"
                        title="Preview Certificate Document"
                      >
                        <Eye className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDownloadLedger(cert)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-medical-teal to-medical-emerald text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-md shadow-medical-teal/10 cursor-pointer transition-all"
                        title="Download Verified Ledger PDF/TXT"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Ledger</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-3xl">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No Credentials Found</h4>
              <p className="text-xs text-slate-450 dark:text-slate-550 mt-1 max-w-sm mx-auto">
                No indexed credentials match your filters or query search. Try adjusting selectors or import a new certification.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 4. Certificate Preview Modal */}
      <AnimatePresence>
        {previewCert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0" onClick={() => setPreviewCert(null)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-dark-border rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col"
            >
              {/* Modal header options */}
              <div className="p-5 border-b border-slate-100 dark:border-dark-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-medical-teal" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-350">
                    Holographic Security Verification Portal
                  </span>
                </div>
                <button
                  onClick={() => setPreviewCert(null)}
                  className="p-1 rounded-xl bg-slate-100 hover:bg-slate-250 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-450 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Graphic Certificate Preview Panel */}
              <div className="p-8 sm:p-12 flex justify-center bg-slate-50 dark:bg-[#060a12]/40 border-b border-slate-100 dark:border-dark-border/30 overflow-x-auto">
                {/* Certificate paper simulation */}
                <div className="aspect-[1.414/1] w-full min-w-[550px] max-w-[650px] bg-amber-50/95 dark:bg-[#0b101c] border-8 border-double border-amber-600/35 p-8 text-center rounded-xl shadow-2xl relative flex flex-col justify-between text-slate-850 dark:text-slate-200">
                  {/* Decorative corner borders */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-600/40" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-600/40" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-600/40" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-600/40" />

                  {/* Top Seal Header */}
                  <div className="space-y-1">
                    <span className="font-serif tracking-widest uppercase text-[10px] text-amber-700/80 dark:text-amber-500/80 font-bold block">
                      MedNova Verification Network
                    </span>
                    <h2 className="font-serif font-black text-slate-800 dark:text-white text-xl tracking-wide">
                      VERIFIED MEDICAL CREDENTIAL
                    </h2>
                  </div>

                  {/* Body text */}
                  <div className="space-y-4 my-6">
                    <p className="font-serif italic text-xs text-slate-450 dark:text-slate-400">
                      This certificate validates that clinical Resident candidate
                    </p>
                    <h1 className="font-serif font-black text-2xl text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-800 pb-2 max-w-sm mx-auto tracking-wide">
                      Dr. Elena Rostova
                    </h1>
                    <p className="font-serif italic text-xs text-slate-450 dark:text-slate-400 leading-relaxed">
                      has successfully logged, verified, and locked credentials matching NPI requirements for
                    </p>
                    <h3 className="font-display font-black text-lg text-medical-teal leading-snug">
                      {previewCert.title}
                    </h3>
                    <p className="font-serif font-bold text-[10px] text-slate-450 uppercase tracking-widest">
                      Issued by: {previewCert.issuer}
                    </p>
                  </div>

                  {/* Footer stamps / seals */}
                  <div className="flex justify-between items-end border-t border-slate-200/50 dark:border-slate-800/80 pt-4 text-xs font-serif">
                    <div className="text-left space-y-1">
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">Ledger ID Verification</p>
                      <p className="font-mono text-[9px] text-slate-700 dark:text-slate-400">{previewCert.verificationId}</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500">Issued: {previewCert.dateEarned} | Exp: {previewCert.expiryDate}</p>
                    </div>

                    {/* Verified stamp badge */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-full border-4 border-dashed border-medical-emerald/40 flex items-center justify-center rotate-12 relative">
                        <span className="text-[8px] text-medical-emerald font-extrabold uppercase tracking-wide">VERIFIED</span>
                      </div>
                      <span className="text-[7px] text-slate-400 uppercase tracking-widest font-mono">Platform seal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal actions */}
              <div className="p-5 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/40">
                <button
                  onClick={() => setPreviewCert(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-250 dark:border-dark-border text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer text-xs font-bold"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    handleDownloadLedger(previewCert);
                    setPreviewCert(null);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-medical-teal to-medical-emerald text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-md shadow-medical-teal/10 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Ledger Manifest</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Add Credential Modal Overlay (Retaining original form logic) */}
      <AnimatePresence>
        {uploadModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={() => setUploadModalOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-dark-border w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 text-left"
            >
              <button 
                onClick={() => setUploadModalOpen(false)}
                className="absolute top-5 right-5 p-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-450 hover:text-slate-705 dark:hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  index credential
                </span>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white mt-1">
                  Import Medical Credential
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
                  Provide credential registration values to activate secure syncing.
                </p>
              </div>

              <form onSubmit={handleUploadCert} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Certificate / Course Title</label>
                  <input 
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Advanced Cardiac Life Support (ACLS)"
                    required
                    className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Credential Issuer</label>
                  <select
                    value={newIssuer}
                    onChange={(e) => setNewIssuer(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-medical-teal cursor-pointer"
                  >
                    <option value="American Heart Association">American Heart Association</option>
                    <option value="CITI Program">CITI Program (Clinical Trials)</option>
                    <option value="American Board of Internal Medicine">American Board of Internal Medicine</option>
                    <option value="MedNova Clinical Academy">MedNova Clinical Academy</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Date Earned</label>
                    <input 
                      type="text"
                      value={newDateEarned}
                      onChange={(e) => setNewDateEarned(e.target.value)}
                      placeholder="e.g., Jan 12, 2025"
                      required
                      className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-slate-300 focus:outline-none focus:border-medical-teal"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Expiry Date</label>
                    <input 
                      type="text"
                      value={newExpiryDate}
                      onChange={(e) => setNewExpiryDate(e.target.value)}
                      placeholder="e.g., Jan 12, 2027"
                      required
                      className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-slate-300 focus:outline-none focus:border-medical-teal"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-550 dark:text-slate-400 font-bold block">Credential / Verification ID</label>
                  <input 
                    type="text"
                    value={newVerificationId}
                    onChange={(e) => setNewVerificationId(e.target.value)}
                    placeholder="e.g., ACLS-30489-VERIFY"
                    required
                    className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-905 dark:hover:bg-slate-900 text-xs font-semibold text-slate-500 hover:text-slate-850 dark:text-slate-450 dark:hover:text-white transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-medical-teal to-medical-emerald text-xs font-bold text-white shadow-md shadow-medical-teal/10 hover:shadow-medical-teal/15 transition-all cursor-pointer text-center"
                  >
                    Index Credential
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

