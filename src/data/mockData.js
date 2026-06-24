// Mock data for MedNova Healthcare Platform

export const mockUser = {
  name: "Dr. Elena Rostova",
  email: "elena.rostova@mednova.org",
  role: "Resident Cardiologist / Medical Researcher",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
  bio: "Passionate about integrating machine learning in cardiac diagnostics. Clinical resident at Boston Medical and author of 12+ published papers.",
  specialty: "Cardiology",
  hospital: "Boston General Hospital",
  location: "Boston, MA",
  joined: "October 2024",
  stats: {
    savedOpportunities: 5,
    opportunitiesApplied: 3,
    certificatesEarned: 4,
    upcomingDeadlines: 3,
    eventsAttended: 14,
    researchPapers: 12
  }
};

export const mockOpportunities = [
  {
    id: "opp-1",
    title: "Senior Resident in Interventional Cardiology",
    organization: "Mayo Clinic",
    location: "Rochester, MN",
    workplaceType: "On-site",
    salary: "$120,000 - $145,000 / yr",
    isPaid: true,
    category: "Residency",
    description: "Seeking a highly motivated Cardiology Resident to join our world-renowned team. You will participate in state-of-the-art diagnostic and therapeutic procedures.",
    deadline: "2026-07-01",
    postedDate: "2026-06-22",
    popularity: 150,
    tags: ["Cardiology", "Residency", "Clinical"]
  },
  {
    id: "opp-2",
    title: "Pediatric Emergency Medicine Fellowship",
    organization: "Children's Hospital of Philadelphia",
    location: "Philadelphia, PA",
    workplaceType: "Hybrid",
    salary: "$95,000 - $110,000 / yr",
    isPaid: true,
    category: "Fellowship",
    description: "A 2-year fellowship program designed to prepare pediatricians for academic careers in emergency medicine.",
    deadline: "2026-07-15",
    postedDate: "2026-06-18",
    popularity: 80,
    tags: ["Pediatrics", "Emergency", "Fellowship"]
  },
  {
    id: "opp-3",
    title: "Clinical Trial Research Coordinator",
    organization: "Pfizer Pharmaceuticals",
    location: "New York, NY",
    workplaceType: "Hybrid",
    salary: "$85,000 - $105,000 / yr",
    isPaid: true,
    category: "Research",
    description: "Manage phase III clinical trials for novel immunotherapies. Coordinate patient enrollment, compliance, and FDA documentation.",
    deadline: "2026-08-01",
    postedDate: "2026-06-20",
    popularity: 110,
    tags: ["Clinical Trials", "Immunology", "Pharma"]
  },
  {
    id: "opp-4",
    title: "Primary Care Attending Physician",
    organization: "One Medical",
    location: "San Francisco, CA",
    workplaceType: "On-site",
    salary: "$210,000 - $240,000 / yr",
    isPaid: true,
    category: "Attending",
    description: "Provide patient-centered, technology-enabled primary care in a collaborative setting with direct digital link portals.",
    deadline: "2026-08-10",
    postedDate: "2026-06-21",
    popularity: 95,
    tags: ["Family Medicine", "Primary Care", "Attending"]
  },
  {
    id: "opp-5",
    title: "Medical Student Research Assistant",
    organization: "Harvard Medical School",
    location: "Boston, MA",
    workplaceType: "Remote",
    salary: "Unpaid (Academic Credit)",
    isPaid: false,
    category: "Research",
    description: "Assist with database aggregation and literature reviews for clinical trials on genetic factors in Alzheimer's disease.",
    deadline: "2026-06-30",
    postedDate: "2026-06-23",
    popularity: 220,
    tags: ["Genetics", "Alzheimer", "Academic"]
  },
  {
    id: "opp-6",
    title: "Neurology Rotation Clerkship",
    organization: "Boston General Hospital",
    location: "Boston, MA",
    workplaceType: "On-site",
    salary: "$4,500 / mo",
    isPaid: true,
    category: "Residency",
    description: "Shadow attending neurologists, participate in stroke ward rounds, and present weekly case summaries.",
    deadline: "2026-07-20",
    postedDate: "2026-06-15",
    popularity: 70,
    tags: ["Neurology", "Rotation", "Clerkship"]
  },
  {
    id: "opp-7",
    title: "Oncology Clinical Fellow",
    organization: "Stanford Medicine",
    location: "Stanford, CA",
    workplaceType: "Hybrid",
    salary: "$105,000 - $125,000 / yr",
    isPaid: true,
    category: "Fellowship",
    description: "Participate in clinical care and translational oncology research trials focusing on immunotherapy treatments.",
    deadline: "2026-09-01",
    postedDate: "2026-06-10",
    popularity: 130,
    tags: ["Oncology", "Fellowship", "Immunotherapy"]
  },
  {
    id: "opp-8",
    title: "Healthcare Public Policy Intern",
    organization: "World Health Organization (WHO)",
    location: "Remote / Geneva",
    workplaceType: "Remote",
    salary: "Unpaid (Volunteer)",
    isPaid: false,
    category: "Research",
    description: "Collaborate on international reviews of health system responses to pandemic containment and policy guidelines.",
    deadline: "2026-08-15",
    postedDate: "2026-06-24",
    popularity: 310,
    tags: ["Policy", "WHO", "Global Health"]
  },
  {
    id: "opp-9",
    title: "Internal Medicine Attending",
    organization: "Johns Hopkins Medicine",
    location: "Baltimore, MD",
    workplaceType: "On-site",
    salary: "$230,000 / yr",
    isPaid: true,
    category: "Attending",
    description: "Provide high-quality tertiary level care to patients in both inpatient wards and outpatient settings.",
    deadline: "2026-07-25",
    postedDate: "2026-06-12",
    popularity: 45,
    tags: ["Internal Medicine", "Attending", "Hospitalist"]
  },
  {
    id: "opp-10",
    title: "Telehealth Resident Clerkship",
    organization: "Mayo Clinic",
    location: "Remote / Rochester",
    workplaceType: "Remote",
    salary: "Unpaid (Academic Credit)",
    isPaid: false,
    category: "Residency",
    description: "Evaluate clinical workflows, shadow digital clinic consultations, and participate in patient triage algorithms.",
    deadline: "2026-07-10",
    postedDate: "2026-06-19",
    popularity: 190,
    tags: ["Telehealth", "Residency", "Digital Clinic"]
  }
];

export const mockEvents = [
  {
    id: "ev-1",
    title: "Global Cardiology Summit 2026",
    host: "World Heart Association",
    date: "July 12, 2026",
    dateISO: "2026-07-12",
    time: "09:00 AM - 05:00 PM EST",
    location: "Boston Convention Center & Virtual",
    category: "Conference",
    description: "Join leading cardiologists discussing the future of cardiac surgery, non-invasive imaging, and preventive medicine.",
    registered: true,
    speaker: "Dr. Elena Rostova & others",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "ev-2",
    title: "AI in Clinical Diagnostics Webinar",
    host: "MedNova Innovate",
    date: "August 04, 2026",
    dateISO: "2026-08-04",
    time: "02:00 PM - 04:00 PM EST",
    location: "Online (Vite Stream)",
    category: "Webinar",
    description: "Explore how machine learning models are being integrated into radiology and ECG analyses to enhance diagnostic accuracy.",
    registered: false,
    speaker: "Dr. Alan Turing, MD",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "ev-3",
    title: "Bioethics & Modern Oncology Forum",
    host: "Harvard Medical School",
    date: "September 18, 2026",
    dateISO: "2026-09-18",
    time: "10:00 AM - 03:00 PM EST",
    location: "Harvard Amphitheater, Cambridge, MA",
    category: "Conference",
    description: "A deep dive into the ethical boundaries of CRISPR diagnostics and personalized genetic therapeutics in cancer care.",
    registered: false,
    speaker: "Prof. Jennifer Doudna",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "ev-4",
    title: "Electrocardiogram (ECG) Interpretation Workshop",
    host: "Boston Medical Center",
    date: "July 22, 2026",
    dateISO: "2026-07-22",
    time: "01:00 PM - 04:00 PM EST",
    location: "Cardiology Lab B, Boston, MA",
    category: "Workshop",
    description: "A hands-on clinical lab parsing sinus rhythms, blocks, infarctions, and arrhythmias. Practice on high-fidelity simulation mannequins.",
    registered: false,
    speaker: "Dr. Elena Rostova",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "ev-5",
    title: "HIPAA Compliance in Digital Medicine",
    host: "HIPAA Alliance",
    date: "July 28, 2026",
    dateISO: "2026-07-28",
    time: "11:00 AM - 12:30 PM EST",
    location: "Online Webinar",
    category: "Webinar",
    description: "Learn how healthcare regulations apply to web dashboards, credential vaults, telehealth, and AI clinical diagnostics.",
    registered: false,
    speaker: "Attorney Sarah Jenkins, JD",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "ev-6",
    title: "Basic Surgical Suturing Skills Lab",
    host: "Mayo Clinic Simulation Center",
    date: "June 10, 2026",
    dateISO: "2026-06-10",
    time: "09:00 AM - 12:00 PM EST",
    location: "Surgical Suite 3, Rochester, MN",
    category: "Workshop",
    description: "Introductory course practicing simple interrupted, running, and mattress suture patterns on clinical simulated tissue.",
    registered: true,
    speaker: "Dr. William Osler, MD",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "ev-7",
    title: "Introduction to Clinical Research Ethics",
    host: "NIH Office of Research",
    date: "June 20, 2026",
    dateISO: "2026-06-20",
    time: "02:00 PM - 03:30 PM EST",
    location: "Online Webinar",
    category: "Webinar",
    description: "A foundational webinar for resident investigators detailing consent protocols and IRB approval guidelines.",
    registered: false,
    speaker: "Prof. Robert Chen, PhD",
    image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=600"
  }
];

export const mockResearch = [
  {
    id: "res-1",
    title: "Efficacy of AI-Driven ECG Analysis in Early Detection of Atrial Fibrillation",
    journal: "Journal of American College of Cardiology (JACC)",
    status: "Published",
    date: "March 2026",
    role: "Lead Author",
    abstract: "This study evaluates the performance of a deep convolutional neural network in identifying subclinical atrial fibrillation from standard 12-lead ECGs during normal sinus rhythm.",
    citations: 28,
    coauthors: ["Dr. Sarah Jenkins", "Dr. Robert Chen"]
  },
  {
    id: "res-2",
    title: "Clinical Trials of Multi-Target CAR-T Therapy for Relapsed B-Cell Lymphoma",
    journal: "New England Journal of Medicine",
    status: "Under Review",
    date: "May 2026",
    role: "Co-Investigator",
    abstract: "Phase II multicenter trial results assessing toxicity profiles and progression-free survival rates in patients treated with dual-targeting CAR-T cells.",
    citations: 0,
    coauthors: ["Dr. William Osler", "Dr. Patricia Bath"]
  },
  {
    id: "res-3",
    title: "Long-term Outcomes of Transcatheter Aortic Valve Replacement (TAVR) in Low-Risk Patients",
    journal: "The Lancet",
    status: "In Progress",
    date: "Active Study",
    role: "Clinical Lead",
    abstract: "Enrolling 450 patients over 5 sites to track hemodynamics, valve durability, and quality of life indices over a 10-year span.",
    citations: 0,
    coauthors: ["Dr. Elizabeth Blackwell"]
  }
];

export const mockInternships = [
  {
    id: "int-1",
    title: "Cardiothoracic Surgery Clinical Rotation",
    institution: "Massachusetts General Hospital",
    location: "Boston, MA",
    duration: "8 Weeks",
    stipend: "$4,500 / month",
    isPaid: true,
    level: "Medical Students (Year 3-4)",
    description: "Hands-on rotation in coronary bypass, valve repairs, and thoracic oncology. Includes scrub-in opportunities and daily ICU rounds.",
    deadline: "July 1, 2026",
    spotsLeft: 3
  },
  {
    id: "int-2",
    title: "Neuroscience Research Internship",
    institution: "Broad Institute of MIT and Harvard",
    location: "Cambridge, MA",
    duration: "12 Weeks",
    stipend: "$5,200 / month",
    isPaid: true,
    level: "Graduates / PhD Candidates",
    description: "Assist with single-cell RNA sequencing analyses of brain tissue samples to identify markers for Alzheimer's disease.",
    deadline: "Ended",
    spotsLeft: 0
  },
  {
    id: "int-3",
    title: "Global Public Health Clerkship",
    institution: "World Health Organization (WHO)",
    location: "Remote / Geneva",
    duration: "6 Months",
    stipend: "Unpaid (Academic Credit)",
    isPaid: false,
    level: "MPH / Medical Students",
    description: "Participate in data aggregation, policy reviews, and health campaign rollouts focusing on infectious disease prevention in developing areas.",
    deadline: "August 15, 2026",
    spotsLeft: 8
  },
  {
    id: "int-4",
    title: "Pediatric Emergency Medicine Shadowing",
    institution: "Children's Hospital of Philadelphia",
    location: "Philadelphia, PA",
    duration: "4 Weeks",
    stipend: "Unpaid (Volunteer)",
    isPaid: false,
    level: "Pre-Med / Med Students",
    description: "Shadow emergency pediatric clinicians, attend morning rounds, and observe clinical triage in one of the nation's busiest pediatric ERs.",
    deadline: "July 15, 2026",
    spotsLeft: 2
  },
  {
    id: "int-5",
    title: "Internal Medicine Sub-Internship",
    institution: "Mayo Clinic",
    location: "Rochester, MN",
    duration: "8 Weeks",
    stipend: "$3,800 / month",
    isPaid: true,
    level: "Medical Students (Year 4)",
    description: "Act as a junior intern on internal medicine wards, manage patient lists under supervision, and present at daily department conferences.",
    deadline: "July 20, 2026",
    spotsLeft: 4
  }
];

export const mockCertificates = [
  {
    id: "cert-1",
    title: "Advanced Cardiac Life Support (ACLS)",
    issuer: "American Heart Association",
    dateEarned: "Jan 12, 2025",
    expiryDate: "Jan 12, 2027",
    verificationId: "ACLS-88921-WHA",
    badgeColor: "from-red-500 to-rose-600",
    status: "Active"
  },
  {
    id: "cert-2",
    title: "Good Clinical Practice (GCP)",
    issuer: "CITI Program",
    dateEarned: "May 08, 2024",
    expiryDate: "May 08, 2027",
    verificationId: "GCP-300481-CITI",
    badgeColor: "from-teal-500 to-emerald-600",
    status: "Active"
  },
  {
    id: "cert-3",
    title: "Pediatric Advanced Life Support (PALS)",
    issuer: "American Heart Association",
    dateEarned: "Jun 19, 2025",
    expiryDate: "Jun 19, 2027",
    verificationId: "PALS-77123-WHA",
    badgeColor: "from-cyan-500 to-blue-600",
    status: "Active"
  },
  {
    id: "cert-4",
    title: "Certified Clinical Research Coordinator (CCRC)",
    issuer: "Association of Clinical Research Professionals",
    dateEarned: "Nov 02, 2023",
    expiryDate: "Nov 02, 2026",
    verificationId: "CCRC-104958",
    badgeColor: "from-purple-500 to-indigo-600",
    status: "Active (Expiring Soon)"
  }
];

export const mockNotifications = [
  {
    id: "notif-1",
    type: "application",
    title: "Application Received",
    message: "Your application for 'Senior Resident in Interventional Cardiology' at Mayo Clinic has been received and is under review.",
    time: "2 hours ago",
    unread: true
  },
  {
    id: "notif-2",
    type: "event",
    title: "Event Starting Tomorrow",
    message: "Reminder: 'Global Cardiology Summit 2026' begins tomorrow at 9:00 AM. Check your registered session list.",
    time: "1 day ago",
    unread: true
  },
  {
    id: "notif-3",
    type: "research",
    title: "Co-Author Request",
    message: "Dr. Elizabeth Blackwell requested your input and co-authorship on the paper 'TAVR Outcomes in Low-Risk Cohorts'.",
    time: "3 days ago",
    unread: false
  },
  {
    id: "notif-4",
    type: "system",
    title: "Certificate Expiring Soon",
    message: "Your 'Certified Clinical Research Coordinator (CCRC)' credential will expire in 4 months. Schedule a renewal exam.",
    time: "5 days ago",
    unread: false
  }
];

export const mockDeadlines = [
  {
    id: "dl-1",
    title: "Mayo Clinic Residency Application",
    dueDate: "July 01, 2026",
    urgency: "Urgent",
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20"
  },
  {
    id: "dl-2",
    title: "WHO Internship Submission",
    dueDate: "August 15, 2026",
    urgency: "Moderate",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
  },
  {
    id: "dl-3",
    title: "ACLS Certificate Renewal",
    dueDate: "Jan 12, 2027",
    urgency: "Normal",
    color: "text-slate-400 bg-slate-900/40 border-dark-border"
  }
];

export const mockActivities = [
  {
    id: "act-1",
    type: "application",
    action: "Submitted Application",
    target: "Senior Resident in Interventional Cardiology",
    entity: "Mayo Clinic",
    timestamp: "2 hours ago"
  },
  {
    id: "act-2",
    type: "certificate",
    action: "Uploaded Certificate",
    target: "Pediatric Advanced Life Support (PALS)",
    entity: "American Heart Association",
    timestamp: "2 days ago"
  },
  {
    id: "act-3",
    type: "event",
    action: "RSVP'd to Event",
    target: "Global Cardiology Summit 2026",
    entity: "Boston Convention Center",
    timestamp: "3 days ago"
  },
  {
    id: "act-4",
    type: "research",
    action: "Published Manuscript",
    target: "AI-Driven ECG Analysis in Early Detection",
    entity: "Journal of JACC",
    timestamp: "1 week ago"
  }
];

export const mockResearchOpportunities = [
  {
    id: "opp-r1",
    title: "Genomes & Cancer Clinical Assistant",
    institution: "Cambridge University Hospital",
    supervisor: "Dr. Elizabeth Blackwell",
    specialization: "Oncology",
    country: "United Kingdom",
    type: "Clinical Trial",
    duration: "6 Months",
    compensation: "Stipend Provided",
    description: "Assist with patient profiling and gene sequencing analysis for target immunotherapies. Involves patient screening and data correlation.",
    applied: false
  },
  {
    id: "opp-r2",
    title: "AI-Driven Echocardiography Research Fellow",
    institution: "Mayo Clinic",
    supervisor: "Prof. Alistair Vance",
    specialization: "Cardiology",
    country: "United States",
    type: "Translational",
    duration: "1 Year",
    compensation: "Fully Paid",
    description: "Deploy and evaluate convolutional neural network models to identify subtle heart wall motion anomalies in ultrasound clips.",
    applied: false
  },
  {
    id: "opp-r3",
    title: "Neurodegenerative Diseases Lab Assistant",
    institution: "Brain Research Institute",
    supervisor: "Dr. Chloe Dubois",
    specialization: "Neurology",
    country: "Switzerland",
    type: "Basic Science",
    duration: "3 Months",
    compensation: "Volunteer (Credit)",
    description: " Shadow senior researchers conducting in-vitro neuron cell-line editing to observe genetic mutations associated with early-onset dementia.",
    applied: false
  },
  {
    id: "opp-r4",
    title: "Pediatric Asthma Observational Study Assistant",
    institution: "Toronto Hospital for Sick Children",
    supervisor: "Dr. Rajan Patel",
    specialization: "Pediatrics",
    country: "Canada",
    type: "Observational",
    duration: "9 Months",
    compensation: "Paid Position",
    description: "Track childhood environmental triggers and airway inflammation profiles in a cohort of 200 pediatric patients in the Ontario region.",
    applied: false
  },
  {
    id: "opp-r5",
    title: "Autoimmune Pathways Systematic Reviewer",
    institution: "Charité Berlin Hospital",
    supervisor: "Prof. Hans Müller",
    specialization: "Immunology",
    country: "Germany",
    type: "Systematic Review",
    duration: "4 Months",
    compensation: "Stipend Provided",
    description: "Conduct literature aggregation and meta-analysis on cytokine storm inhibitors and their clinical endpoints in rheumatoid arthritis trials.",
    applied: false
  }
];

export const mockFacultyProfiles = [
  {
    id: "fac-1",
    name: "Dr. Sarah Jenkins, MD, PhD",
    title: "Associate Professor of Oncology",
    institution: "Harvard Medical School",
    specialization: "Oncology",
    country: "United States",
    primaryType: "Clinical Trial",
    publicationsCount: 45,
    email: "s.jenkins@harvard.edu",
    avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300",
    interests: ["Cancer Genomics", "CRISPR Therapeutics", "Immunotherapy Resistance"]
  },
  {
    id: "fac-2",
    name: "Prof. Alistair Vance, PhD",
    title: "Senior Cardiovascular Researcher",
    institution: "Oxford University Department of Medicine",
    specialization: "Cardiology",
    country: "United Kingdom",
    primaryType: "Translational",
    publicationsCount: 82,
    email: "a.vance@ox.ac.uk",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    interests: ["Machine Learning in Cardiac Care", "ECG Signal Analysis", "Myocardial Infarction Predictors"]
  },
  {
    id: "fac-3",
    name: "Dr. Chloe Dubois, PhD",
    title: "Principal Genetics Investigator",
    institution: "ETH Zurich Institute of Science",
    specialization: "Genetics",
    country: "Switzerland",
    primaryType: "Basic Science",
    publicationsCount: 34,
    email: "c.dubois@ethz.ch",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    interests: ["Gene Editing Diagnostics", "Epigenetics", "Rare Hereditary Pathologies"]
  },
  {
    id: "fac-4",
    name: "Dr. Rajan Patel, MD",
    title: "Assistant Professor of Pediatrics & Neurology",
    institution: "McGill University Health Centre",
    specialization: "Neurology",
    country: "Canada",
    primaryType: "Observational",
    publicationsCount: 19,
    email: "rajan.patel@mcgill.ca",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
    interests: ["Stroke Rehabilitation Robotics", "Cognitive Decline Biomarkers", "Brain Injury Mapping"]
  },
  {
    id: "fac-5",
    name: "Prof. Hans Müller, MD",
    title: "Director of Immunology Lab",
    institution: "Heidelberg University Hospital",
    specialization: "Immunology",
    country: "Germany",
    primaryType: "Systematic Review",
    publicationsCount: 112,
    email: "h.mueller@uni-heidelberg.de",
    avatar: "https://images.unsplash.com/photo-1637059824899-a441006a6875?auto=format&fit=crop&q=80&w=300",
    interests: ["Rheumatoid Arthritis Pathways", "Cytokine Storm Mitigation", "Innate Immune Memory"]
  }
];

export const mockResearchResources = [
  {
    id: "res-r1",
    title: "NCBI PubMed Medical Database",
    description: "Access the largest global index of biomedical literature, life science journals, and clinical trials reference papers.",
    category: "Database",
    specialization: "All",
    country: "Global",
    type: "Free Access",
    link: "https://pubmed.ncbi.nlm.nih.gov/"
  },
  {
    id: "res-r2",
    title: "Clinical Trial Protocol Biostatistics Toolkit",
    description: "Curated collection of R scripts and SAS templates optimized for processing medical cohort data and confidence intervals.",
    category: "Software Tool",
    specialization: "Cardiology",
    country: "United States",
    type: "Institution Access",
    link: "https://www.r-project.org/"
  },
  {
    id: "res-r3",
    title: "HIPAA Clinical Trial Compliance Framework",
    description: "Official operational checklists and encryption manuals required to secure patient records and consent protocols during FDA trials.",
    category: "Manual",
    specialization: "All",
    country: "United States",
    type: "Free Access",
    link: "https://www.hhs.gov/hipaa/index.html"
  },
  {
    id: "res-r4",
    title: "Oncology Genomic Mutation Datasets",
    description: "High-density cancer genomic sequencing data sets available to researchers working on target mutations.",
    category: "Dataset",
    specialization: "Oncology",
    country: "United Kingdom",
    type: "Institution Access",
    link: "https://www.genomicsengland.co.uk/"
  }
];

