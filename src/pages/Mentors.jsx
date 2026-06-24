import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { 
  Search, Star, BookOpen, Clock, X, 
  CheckCircle2, Compass, MessageSquare, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Enriched mock mentors data based on mockFacultyProfiles
const INITIAL_MENTORS = [
  {
    id: "fac-1",
    name: "Dr. Sarah Jenkins, MD, PhD",
    title: "Associate Professor of Oncology",
    institution: "Harvard Medical School",
    specialization: "Oncology",
    publicationsCount: 45,
    email: "s.jenkins@harvard.edu",
    avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300",
    interests: ["Cancer Genomics", "CRISPR Therapeutics", "Immunotherapy Resistance"],
    rating: 4.9,
    reviews: [
      { id: "rev-1", author: "Dr. Elena Rostova", text: "Dr. Jenkins gave incredible feedback on my ERAS oncology application. She is extremely encouraging!", rating: 5, time: "1 week ago" },
      { id: "rev-2", author: "Dr. Grace Hopper, PhD", text: "Helped me structure my genomics clinical study protocols. A phenomenal principal investigator.", rating: 5, time: "3 weeks ago" }
    ],
    slots: ["Monday 09:00 AM", "Tuesday 02:00 PM", "Thursday 11:00 AM"]
  },
  {
    id: "fac-2",
    name: "Prof. Alistair Vance, PhD",
    title: "Senior Cardiovascular Researcher",
    institution: "Oxford University Department of Medicine",
    specialization: "Cardiology",
    publicationsCount: 82,
    email: "a.vance@ox.ac.uk",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    interests: ["Machine Learning in Cardiac Care", "ECG Signal Analysis", "Myocardial Infarction Predictors"],
    rating: 4.8,
    reviews: [
      { id: "rev-3", author: "Dr. Alan Turing, MD", text: "Very insightful advice on convolutional neural networks in cardiology diagnostic tools.", rating: 4, time: "2 weeks ago" }
    ],
    slots: ["Wednesday 10:00 AM", "Wednesday 01:00 PM", "Friday 04:00 PM"]
  },
  {
    id: "fac-3",
    name: "Dr. Chloe Dubois, PhD",
    title: "Principal Genetics Investigator",
    institution: "ETH Zurich Institute of Science",
    specialization: "Genetics",
    publicationsCount: 34,
    email: "c.dubois@ethz.ch",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    interests: ["Gene Editing Diagnostics", "Epigenetics", "Rare Hereditary Pathologies"],
    rating: 5.0,
    reviews: [
      { id: "rev-4", author: "Dr. Elena Rostova", text: "Her research trial guidelines on autosomal recessive conditions are unmatched. Wonderful guidance.", rating: 5, time: "5 days ago" }
    ],
    slots: ["Monday 03:00 PM", "Thursday 09:00 AM", "Thursday 02:00 PM"]
  },
  {
    id: "fac-4",
    name: "Dr. Rajan Patel, MD",
    title: "Assistant Professor of Pediatrics & Neurology",
    institution: "McGill University Health Centre",
    specialization: "Neurology",
    publicationsCount: 19,
    email: "rajan.patel@mcgill.ca",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
    interests: ["Stroke Rehabilitation Robotics", "Cognitive Decline Biomarkers", "Brain Injury Mapping"],
    rating: 4.7,
    reviews: [
      { id: "rev-5", author: "Dr. Grace Hopper, PhD", text: "Very knowledgeable on clinical pediatric neurology clerkship requirements.", rating: 5, time: "1 month ago" }
    ],
    slots: ["Tuesday 11:00 AM", "Friday 09:00 AM"]
  },
  {
    id: "fac-5",
    name: "Prof. Hans Müller, MD",
    title: "Director of Immunology Lab",
    institution: "Heidelberg University Hospital",
    specialization: "Immunology",
    publicationsCount: 112,
    email: "h.mueller@uni-heidelberg.de",
    avatar: "https://images.unsplash.com/photo-1637059824899-a441006a6875?auto=format&fit=crop&q=80&w=300",
    interests: ["Rheumatoid Arthritis Pathways", "Cytokine Storm Mitigation", "Innate Immune Memory"],
    rating: 4.9,
    reviews: [
      { id: "rev-6", author: "Dr. Alan Turing, MD", text: "An absolute legend in systemic reviews. Taught me biostatistics methodology step-by-step.", rating: 5, time: "2 weeks ago" }
    ],
    slots: ["Monday 10:00 AM", "Wednesday 03:00 PM"]
  }
];

export const Mentors = () => {
  const { addNotification } = useNotifications();

  // Search and specialty filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState('All');

  // Booking states
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Load bookings from localStorage to toggle button states
  const [bookedMentors, setBookedMentors] = useState(() => {
    const saved = localStorage.getItem('mednova_mentor_bookings');
    return saved ? JSON.parse(saved) : {};
  });

  // Filter logic
  const filteredMentors = INITIAL_MENTORS.filter(m => {
    // 1. Specialty Filter
    if (activeSpecialty !== 'All' && m.specialization !== activeSpecialty) return false;

    // 2. Keyword Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const nameMatch = m.name?.toLowerCase().includes(q);
      const titleMatch = m.title?.toLowerCase().includes(q);
      const schoolMatch = m.institution?.toLowerCase().includes(q);
      const interestMatch = m.interests.some(i => i.toLowerCase().includes(q));
      if (!nameMatch && !titleMatch && !schoolMatch && !interestMatch) return false;
    }

    return true;
  });

  // Unique specializations for filter lists
  const specializations = ['All', 'Cardiology', 'Oncology', 'Genetics', 'Neurology', 'Immunology'];

  // Handle book session submit
  const handleBookSession = (e) => {
    e.preventDefault();
    if (!bookingSlot) return;

    setIsSubmittingBooking(true);

    setTimeout(() => {
      const updatedBookings = {
        ...bookedMentors,
        [selectedMentor.id]: {
          slot: bookingSlot,
          message: bookingMessage
        }
      };

      setBookedMentors(updatedBookings);
      localStorage.setItem('mednova_mentor_bookings', JSON.stringify(updatedBookings));
      
      setIsSubmittingBooking(false);
      setBookingConfirmed(true);

      addNotification(
        "Mentorship Session Booked",
        `Your slot on ${bookingSlot} with ${selectedMentor.name} is confirmed. Details sent to your workspace.`,
        "system"
      );

      // Auto close modal after brief delay
      setTimeout(() => {
        setBookingConfirmed(false);
        setSelectedMentor(null);
        setBookingSlot('');
        setBookingMessage('');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-200">
      
      {/* 1. Page Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-64 h-64 bg-medical-teal/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 z-10 text-left">
          <h2 className="text-xl sm:text-2xl font-display font-black text-slate-850 dark:text-white flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-medical-teal" />
            Clinical Mentor Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light max-w-xl">
            Book private shadow calls and rotation reviews with leading research investigators and medical school faculty.
          </p>
        </div>
      </div>

      {/* 2. Search & Specialty Filters Panel */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-3xl shadow-sm space-y-4 text-left">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
          {/* Keyword search bar */}
          <div className="flex-grow flex items-center gap-2.5 px-3.5 py-2 bg-slate-50 dark:bg-[#080d16] border border-slate-200 dark:border-dark-border rounded-2xl focus-within:border-medical-teal transition-all">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-555" />
            <input 
              type="text" 
              placeholder="Search by mentor name, hospital, title, or interest tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-800 dark:text-slate-300 placeholder-slate-450 dark:placeholder-slate-500 focus:outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-650">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Specialty Chips */}
        <div className="border-t border-slate-100 dark:border-dark-border/40 pt-3 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
            Specialization Area
          </span>
          <div className="flex flex-wrap gap-1.5">
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setActiveSpecialty(spec)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                  activeSpecialty === spec
                    ? 'bg-medical-teal/10 border-medical-teal/30 text-medical-teal dark:bg-medical-teal/15'
                    : 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-dark-border/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {spec === 'All' ? 'All Areas' : spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Mentor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredMentors.length > 0 ? (
            filteredMentors.map((mentor) => {
              const isBooked = !!bookedMentors[mentor.id];
              return (
                <motion.div
                  key={mentor.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -5, scale: 1.015, boxShadow: "0 12px 25px -8px rgba(0,0,0,0.04)" }}
                  transition={{ duration: 0.25 }}
                  className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-3xl shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-medical-teal/5 to-transparent pointer-events-none" />
                  
                  {/* Card Header: Avatar & Base Meta */}
                  <div className="flex items-start gap-4 text-left">
                    <img 
                      src={mentor.avatar} 
                      alt={mentor.name} 
                      className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 object-cover shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-xs font-bold text-slate-850 dark:text-slate-200 truncate pr-1">
                          {mentor.name}
                        </h3>
                        <span className="flex items-center gap-0.5 text-[10px] text-amber-500 font-extrabold">
                          <Star className="w-3 h-3 fill-amber-500" />
                          {mentor.rating}
                        </span>
                      </div>
                      <p className="text-[10px] font-semibold text-medical-teal leading-normal line-clamp-1">{mentor.title}</p>
                      <p className="text-[9px] text-slate-450 dark:text-slate-500 truncate">{mentor.institution}</p>
                    </div>
                  </div>

                  {/* Research Interests Tags */}
                  <div className="flex flex-wrap gap-1 pt-1 text-left">
                    {mentor.interests.slice(0, 2).map((interest, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-[9px] text-slate-500 dark:text-slate-400 rounded-md font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                    {mentor.interests.length > 2 && (
                      <span className="px-2 py-0.5 text-[9px] text-slate-400 font-light">+ {mentor.interests.length - 2} more</span>
                    )}
                  </div>

                  {/* Footer Action buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-dark-border/40">
                    <button
                      onClick={() => setSelectedMentor(mentor)}
                      className="flex-grow py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border hover:border-slate-350 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white text-xs font-bold text-slate-650 dark:text-slate-350 transition-all cursor-pointer text-center"
                    >
                      View Profile & Reviews
                    </button>

                    <button
                      onClick={() => setSelectedMentor(mentor)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isBooked
                          ? 'bg-medical-emerald/10 border border-medical-emerald/20 text-medical-emerald'
                          : 'bg-gradient-to-r from-medical-teal to-medical-emerald text-white shadow shadow-medical-teal/10 hover:opacity-95'
                      }`}
                    >
                      {isBooked ? 'Booked' : 'Book Call'}
                    </button>
                  </div>

                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-3xl">
              <Compass className="w-12 h-12 text-slate-400 dark:text-slate-650 mx-auto mb-4 animate-spin-slow" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-350">No mentors matching this selection</h4>
              <p className="text-xs text-slate-450 mt-1 leading-normal max-w-xs mx-auto font-light">
                Try expanding your keyword search or adjusting your specialization filter chips.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Mentor Profile & Booking Modal Dialog */}
      <AnimatePresence>
        {selectedMentor && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden text-left flex flex-col md:flex-row h-[90vh] md:h-[620px]"
            >
              
              {/* Left Modal Column: Bio & Reviews (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 border-b md:border-b-0 md:border-r border-slate-150 dark:border-dark-border/40">
                <div className="flex justify-between items-start">
                  {/* Close button (Mobile only) */}
                  <div className="flex gap-4 items-start">
                    <img 
                      src={selectedMentor.avatar} 
                      alt={selectedMentor.name} 
                      className="w-14 h-14 rounded-full border border-slate-200 dark:border-slate-800 object-cover bg-slate-50"
                    />
                    <div className="space-y-1 text-left">
                      <h3 className="text-base font-display font-black text-slate-850 dark:text-white leading-tight">
                        {selectedMentor.name}
                      </h3>
                      <p className="text-xs font-semibold text-medical-teal">{selectedMentor.title}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-light">{selectedMentor.institution}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedMentor(null)}
                    className="md:hidden p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-650"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick stats grid */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200/50 dark:border-dark-border/40 rounded-2xl text-xs">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Publications Log</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-250 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-medical-teal" />
                      {selectedMentor.publicationsCount} papers
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Contact Email</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-350 truncate block hover:text-medical-teal transition-colors" title={selectedMentor.email}>
                      {selectedMentor.email}
                    </span>
                  </div>
                </div>

                {/* Research Interests List */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Research Focus Areas</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMentor.interests.map((interest, idx) => (
                      <span 
                        key={idx}
                        className="px-2.5 py-1 bg-medical-teal/5 border border-medical-teal/15 text-[10px] text-slate-750 dark:text-slate-300 font-medium rounded-xl"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ratings and reviews list */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-550 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-medical-teal" />
                    Student Reviews ({selectedMentor.reviews.length})
                  </h4>

                  <div className="space-y-3">
                    {selectedMentor.reviews.map((rev) => (
                      <div 
                        key={rev.id} 
                        className="p-3.5 bg-slate-55/5 dark:bg-[#070b13] border border-slate-150 dark:border-dark-border/40 rounded-2xl space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-205">{rev.author}</span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-2.5 h-2.5 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-slate-700'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                          "{rev.text}"
                        </p>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-light text-right pt-0.5">{rev.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Modal Column: Book session form */}
              <div className="w-full md:w-80 p-6 md:p-8 bg-slate-50/50 dark:bg-slate-900/10 flex flex-col justify-between gap-6 relative">
                {/* Close button (Desktop only) */}
                <button 
                  onClick={() => setSelectedMentor(null)}
                  className="hidden md:block absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-650 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-850 dark:text-white flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-medical-teal" />
                      Book Shadow Call
                    </h3>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500 font-light">
                      Choose an open time slot to request residency advice or research mentorship.
                    </p>
                  </div>

                  {bookingConfirmed ? (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="py-12 flex flex-col items-center justify-center text-center space-y-3"
                    >
                      <div className="w-12 h-12 bg-medical-emerald/10 border border-medical-emerald/20 text-medical-emerald rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Session Confirmed!</h4>
                      <p className="text-[10px] text-slate-450 dark:text-slate-500 max-w-[200px] leading-relaxed">
                        Calendar invite and session details dispatched to your inbox.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleBookSession} className="space-y-4 text-left">
                      {/* Slot selection */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-450 block">Available Slots</label>
                        <select
                          required
                          value={bookingSlot}
                          onChange={(e) => setBookingSlot(e.target.value)}
                          className="w-full bg-white dark:bg-[#080d16] border border-slate-250 dark:border-dark-border text-xs rounded-xl px-3 py-2 text-slate-800 dark:text-slate-350 focus:outline-none focus:border-medical-teal"
                        >
                          <option value="">Select slot date/time</option>
                          {selectedMentor.slots.map((s, idx) => (
                            <option key={idx} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Brief message */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-455 block">Discuss Details</label>
                        <textarea
                          required
                          rows="4"
                          placeholder="What would you like Dr. Jenkins to review? (e.g. CV drafts, publications)..."
                          value={bookingMessage}
                          onChange={(e) => setBookingMessage(e.target.value)}
                          className="w-full bg-white dark:bg-[#080d16] border border-slate-255 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal resize-none leading-relaxed"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingBooking || !bookingSlot || !bookingMessage.trim()}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-medical-teal to-medical-emerald text-white text-xs font-bold shadow shadow-medical-teal/10 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isSubmittingBooking ? (
                          <>
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            Booking Slot...
                          </>
                        ) : (
                          <>
                            <Award className="w-3.5 h-3.5" />
                            Confirm Booking Slot
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                {/* Footer terms */}
                <div className="text-[8px] text-slate-400 dark:text-slate-500 text-center leading-normal font-light">
                  Booking is subject to faculty availability. Session confirmation will be sent as a calendar notification.
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default Mentors;
