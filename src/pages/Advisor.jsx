import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, Sparkles, Award, 
  ArrowRight, HelpCircle, 
  User, Briefcase, MapPin, Loader2
} from 'lucide-react';
import { mockOpportunities } from '../data/mockData';

// Roadmaps definition
const ROADMAPS = {
  general: {
    title: "Standard Residency Pathway",
    description: "Milestones for matching into an ACGME accredited clinical residency.",
    steps: [
      { id: 1, title: "MS3 Core Clerkships", desc: "Complete rotations in Internal Med, Pediatrics, and Surgery." },
      { id: 2, title: "ERAS Portfolio Draft", desc: "Collect 3 Letters of Recommendation (LoRs) and draft personal statement." },
      { id: 3, title: "Interview Match Season", desc: "Attend virtual interviews and submit your Rank Order List (ROL)." },
      { id: 4, title: "Match Day & Transition", desc: "Match into your residency hospital and begin PGY-1 training." }
    ]
  },
  cardiology: {
    title: "Cardiothoracic & Cardiology Pathway",
    description: "Advanced timeline for entering fellowship programs in cardiology.",
    steps: [
      { id: 1, title: "Cardiovascular Electives", desc: "Take intensive cardiology and cardiac ICU rotations in MS4." },
      { id: 2, title: "USMLE Mastery", desc: "Aim for 250+ score on Step 2 CK focusing on physiology." },
      { id: 3, title: "Scholarly Publication", desc: "Publish cardiovascular trial outcomes (record in Research Hub)." },
      { id: 4, title: "Fellowship Match", desc: "Apply for competitive Interventional Cardiology fellowships." }
    ]
  },
  research: {
    title: "Clinical Research Pathway",
    description: "Milestones for launching an academic medicine/clinician-scientist career.",
    steps: [
      { id: 1, title: "PI Mentorship", desc: "Select a Faculty mentor conducting clinical or basic science trials." },
      { id: 2, title: "Compliance Credentials", desc: "Complete CITI and HIPAA compliance courses (log in Vault)." },
      { id: 3, title: "Manuscript Drafts", desc: "Co-author manuscripts, abstracts, and trial protocols." },
      { id: 4, title: "Research Grants", desc: "Apply for NIH Young Investigator or independent training awards." }
    ]
  },
  pediatrics: {
    title: "Pediatric Medicine Pathway",
    description: "Milestones for matching into high-volume pediatric residencies and emergency fellowships.",
    steps: [
      { id: 1, title: "PALS Certification", desc: "Obtain Pediatric Advanced Life Support certificate." },
      { id: 2, title: "Pediatric Sub-Internship", desc: "Shadow pediatric wings at CHOP or regional children's hospitals." },
      { id: 3, title: "ERAS Pediatrics Fit", desc: "Obtain LoRs highlighting clinical empathy and child advocacy." },
      { id: 4, title: "Neonatal/EM Fellowship", desc: "Progress from general pediatrics residency to specialized sub-fellowships." }
    ]
  }
};

export const Advisor = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am your MedNova AI Career Advisor. I am trained on medical residency pathways, clinical clerkships, and research guidelines. Ask me about cardiology pathways, pediatric programs, clinical research tips, or match timelines!",
      time: "Just now"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeRoadmap, setActiveRoadmap] = useState('general');

  const messagesEndRef = useRef(null);

  // Auto-scroll chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Suggested questions list
  const suggestedQuestions = [
    "What is the Cardiology residency pathway?",
    "How do I start clinical research?",
    "What certificates do I need for Pediatrics?",
    "Show me a standard residency match roadmap."
  ];

  // Map user query to dummy response
  const handleQueryResponse = (queryText) => {
    setIsTyping(true);

    setTimeout(() => {
      const q = queryText.toLowerCase();
      let reply = "";
      let newRoadmap = activeRoadmap;

      if (q.includes('cardio') || q.includes('heart') || q.includes('surg')) {
        reply = "Cardiology training requires matching into an Internal Medicine residency (3 years) followed by a Cardiology Fellowship (3 years) or direct Cardiothoracic training. Tips for success:\n\n1. **Electives**: Take cardiology sub-internships early in your MS4 year.\n2. **USMLE**: Step 2 CK scores are highly valued; aim for 250+.\n3. **Scholarly Activity**: Join clinical trials. Check out our **Research Hub** under Research Placements to find active trials (e.g. Mayo Clinic AI-Driven Echocardiography fellowship).\n4. **Log publications**: Keep your profile current by uploading cardiovascular paper drafts in the Research logger.";
        newRoadmap = 'cardiology';
      } 
      else if (q.includes('research') || q.includes('publish') || q.includes('paper') || q.includes('mentor')) {
        reply = "Building a strong clinical research profile is key for competitive matching. Recommended steps:\n\n1. **Faculty Mentors**: Go to the **Research Hub** and check the Faculty Profiles list to connect with PIs like Dr. Sarah Jenkins.\n2. **Database Research**: Start by assisting on literature reviews, PubMed aggregation, or statistical analytics.\n3. **Prerequisites**: Complete CITI and HIPAA protocols. Ensure you upload these credentials to your **Certificate Vault** so they display on your verified profile.";
        newRoadmap = 'research';
      }
      else if (q.includes('pediatr') || q.includes('child') || q.includes('pals')) {
        reply = "Pediatrics residencies and fellowships focus heavily on clinical hours and pediatric certifications. Action items:\n\n1. **Vital Certificates**: Obtain **PALS (Pediatric Advanced Life Support)**. You can track this and verify it via your Certificate Vault.\n2. **Rotations**: Shadow pediatric critical care wards or ER rotation clerkships.\n3. **Recommended Internships**: Explore clinical shadows in pediatrics under our Internships portal.";
        newRoadmap = 'pediatrics';
      }
      else if (q.includes('roadmap') || q.includes('timeline') || q.includes('match') || q.includes('eras')) {
        reply = "A standard timeline for residency matching focuses on MS3 and MS4 milestones:\n\n- **MS3 year**: Pass core rotations and start identifying your target specialty.\n- **MS4 summer**: Select sub-internship rotations and secure Letters of Recommendation (LoRs).\n- **MS4 fall**: Submit your ERAS application and rank matching hospitals.\n- **MS4 spring**: Match Day and transition to PGY-1 resident doctor.\n\nI have loaded the **Standard Residency Pathway** roadmap in the side panel for details.";
        newRoadmap = 'general';
      }
      else {
        reply = "I'm ready to help you plan! You can type:\n\n- **'Cardiology'** to check cardiothoracic and cardiac pathways.\n- **'Research'** to view publication and faculty mentorship advice.\n- **'Pediatrics'** for pediatric rotations and life support certifications.\n- **'Roadmap'** to overview standard residency match timelines.\n\nWhich clinical specialty are you focusing on?";
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setActiveRoadmap(newRoadmap);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: userMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInput('');
    handleQueryResponse(userMsg);
  };

  // Recommended opportunities computed live
  const recommendations = mockOpportunities.slice(0, 3);

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-200">
      
      {/* A. Header Title Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-64 h-64 bg-medical-teal/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 z-10 text-left">
          <h2 className="text-xl sm:text-2xl font-display font-black text-slate-850 dark:text-white flex items-center gap-2.5">
            <Sparkles className="w-5.5 h-5.5 text-medical-teal animate-pulse" />
            AI Career Advisor
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light max-w-xl">
            Get personalized roadmap milestones, recommendation matching, and tips on clinical residency applications.
          </p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-medical-teal/10 border border-medical-teal/20 text-medical-teal text-[10px] font-extrabold uppercase tracking-wide shrink-0">
          Medical AI Engine v1.2
        </span>
      </div>

      {/* B. Two Column Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Chat Workspace */}
        <div className="lg:col-span-2 flex flex-col bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-3xl overflow-hidden shadow-sm h-[580px]">
          {/* Chat Workspace Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-dark-border/40 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-medical-teal/10 border border-medical-teal/25 flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-medical-teal" />
              </div>
              <div className="text-left">
                <h3 className="text-xs font-bold text-slate-800 dark:text-white">MedNova Career Assistant</h3>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-medical-emerald animate-pulse" />
                  Ready to assist
                </p>
              </div>
            </div>
          </div>

          {/* Messages stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((m) => {
                const isAi = m.sender === 'ai';
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    key={m.id} 
                    className={`flex gap-3 max-w-[85%] ${isAi ? 'self-start text-left mr-auto' : 'self-end text-left ml-auto flex-row-reverse'}`}
                  >
                    {isAi ? (
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-dark-border flex items-center justify-center shrink-0">
                        <Bot className="w-4.5 h-4.5 text-medical-teal" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-medical-teal/10 border border-medical-teal/30 flex items-center justify-center shrink-0">
                        <User className="w-4.5 h-4.5 text-medical-teal" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                        isAi 
                          ? 'bg-slate-50 border border-slate-200 dark:bg-slate-900/40 dark:border-dark-border text-slate-700 dark:text-slate-300' 
                          : 'bg-gradient-to-tr from-medical-teal to-medical-emerald text-white font-medium shadow-sm shadow-medical-teal/10'
                      }`}>
                        {m.text}
                      </div>
                      <span className="text-[8px] text-slate-400 dark:text-slate-500 block px-1">
                        {m.time}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 max-w-[85%] self-start mr-auto text-left"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-205 dark:border-dark-border flex items-center justify-center shrink-0">
                  <Bot className="w-4.5 h-4.5 text-medical-teal" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-900/40 dark:border-dark-border flex items-center gap-2">
                  <div className="flex gap-1.5 py-1">
                    <span className="w-1.5 h-1.5 bg-medical-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-medical-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-medical-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[10px] text-slate-450 dark:text-slate-400 font-semibold">AI is analyzing pathways...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions area */}
          <div className="px-5 py-3 border-t border-slate-100 dark:border-dark-border/40 bg-slate-50/20">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-550 flex items-center gap-1.5 mb-2 text-left">
              <HelpCircle className="w-3 h-3 text-medical-teal" />
              Suggested Questions
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQuestions.map((q, idx) => (
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  key={idx}
                  onClick={() => {
                    setInput(q);
                    setMessages(prev => [
                      ...prev,
                      {
                        id: `user-suggest-${Date.now()}`,
                        sender: 'user',
                        text: q,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }
                    ]);
                    handleQueryResponse(q);
                  }}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-dark-border text-slate-655 dark:text-slate-400 dark:hover:text-slate-250 rounded-xl text-[10px] font-semibold text-left transition-all cursor-pointer truncate max-w-full"
                >
                  {q}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Send Input Bar */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-dark-border/45 bg-white dark:bg-dark-card flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the medical advisor (e.g. 'What is the cardiology pathway?')..."
              className="flex-grow bg-slate-550/5 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-slate-350 focus:outline-none focus:border-medical-teal transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-gradient-to-r from-medical-teal to-medical-emerald text-white hover:opacity-95 shadow-md shadow-medical-teal/10 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: AI Sidebar Info (Roadmap timelines + Opportunities) */}
        <div className="space-y-6 lg:col-span-1 text-left">
          
          {/* 1. Dynamic Roadmap timeline */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-black text-slate-850 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-medical-teal" />
                Specialty Roadmap
              </h3>
              
              <select 
                value={activeRoadmap} 
                onChange={(e) => setActiveRoadmap(e.target.value)}
                className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-dark-border text-[10px] font-bold rounded-lg px-2 py-1 text-slate-650 dark:text-slate-400 focus:outline-none focus:border-medical-teal"
              >
                <option value="general">Residency Match</option>
                <option value="cardiology">Cardiology Path</option>
                <option value="research">Clinical Research</option>
                <option value="pediatrics">Pediatrics Path</option>
              </select>
            </div>

            <div className="space-y-1 pb-1">
              <h4 className="text-xs font-bold text-medical-teal">{ROADMAPS[activeRoadmap].title}</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-550 font-light leading-normal">{ROADMAPS[activeRoadmap].description}</p>
            </div>

            {/* Vertical timeline steps with animate presence on activeRoadmap toggle */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeRoadmap}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="relative border-l border-slate-150 dark:border-dark-border/80 pl-5 ml-2 space-y-5 pt-1 text-left"
                >
                  {ROADMAPS[activeRoadmap].steps.map((s) => (
                    <div key={s.id} className="relative space-y-0.5">
                      <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 bg-slate-50 dark:bg-dark-card border-2 border-medical-teal rounded-full flex items-center justify-center text-[7px] font-black text-medical-teal shrink-0">
                        {s.id}
                      </span>
                      <h5 className="text-[11px] font-bold text-slate-800 dark:text-slate-250">{s.title}</h5>
                      <p className="text-[10px] text-slate-455 dark:text-slate-500 font-light leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* 2. Recommended Opportunities Card list */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-base font-display font-black text-slate-850 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-medical-teal" />
              Related Placement Suggestions
            </h3>
            
            <div className="divide-y divide-slate-100 dark:divide-dark-border/60">
              {recommendations.map((opp) => (
                <div key={opp.id} className="py-3 flex flex-col gap-2">
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 truncate">{opp.title}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-0.5">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        {opp.organization}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {opp.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-dark-border rounded text-[9px] font-semibold text-slate-550 dark:text-slate-400">
                      {opp.category}
                    </span>
                    <Link
                      to={`/opportunities/${opp.id}`}
                      className="text-[10px] font-bold text-medical-teal hover:text-medical-emerald flex items-center gap-0.5 transition-colors"
                    >
                      View details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default Advisor;
