import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { 
  MessageSquare, Heart, Send, PlusCircle, Search, 
  Users, TrendingUp, X, ChevronDown, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export const Community = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  // State for posts
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('mednova_community_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse community posts", e);
      }
    }
    const defaultPosts = [
      {
        id: "post-1",
        title: "Best resources for clinical ECG interpretation?",
        author: "Dr. Alan Turing, MD",
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
        content: "Hey everyone! I'm preparing for my upcoming rotation and want to hone my ECG reading skills. Are there simulating tools, study guides, or manuals you recommend? I saw the ECG Interpretation workshop listed in MedNova events. Has anyone attended it?",
        likes: 14,
        category: "StudyTips",
        time: "3 hours ago",
        comments: [
          { id: "c-1", author: "Dr. Elena Rostova", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300", text: "Check out the ECG interpretation workshop in the Medical Events tab! We practice on high-fidelity simulation mannequins and review real sinus block anomalies. It's very hands-on.", time: "2 hours ago" }
        ]
      },
      {
        id: "post-2",
        title: "Mayo Clinic cardiology sub-internship experience",
        author: "Dr. Grace Hopper, PhD",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
        content: "Just finished my PGY-1 cardiology rotation clerkship at Mayo. The pace was intense but the interventional cardiology cases were absolutely state of the art. PIs there are also actively recruiting for echocardiography fellowships.",
        likes: 28,
        category: "Residency",
        time: "1 day ago",
        comments: [
          { id: "c-2", author: "Dr. Alan Turing, MD", avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300", text: "Congratulations Grace! Did you get a chance to participate in any clinical trials or co-author any paper drafts while there?", time: "18 hours ago" }
        ]
      },
      {
        id: "post-3",
        title: "Clinical CITI & HIPAA certification timeline guide",
        author: "Dr. Elena Rostova",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
        content: "Drafted a quick compliance certification guide for anyone matching into FDA-regulated clinical trials this fall. Covers CITI protocols, biomedical reviews, and how to verify compliance ledgers. Uploading these in your Certificate Vault makes residency audits much faster!",
        likes: 39,
        category: "USMLE",
        time: "2 days ago",
        comments: []
      }
    ];
    localStorage.setItem('mednova_community_posts', JSON.stringify(defaultPosts));
    return defaultPosts;
  });

  // Track liked posts
  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem('mednova_community_liked');
    return saved ? JSON.parse(saved) : [];
  });

  // Expandable post creation
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('StudyTips');

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  // Comments state by post ID
  const [openComments, setOpenComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // Save updates helper
  const savePostsData = (updatedPosts) => {
    setPosts(updatedPosts);
    localStorage.setItem('mednova_community_posts', JSON.stringify(updatedPosts));
  };

  // Like toggler
  const handleLike = (postId) => {
    const isLiked = likedPosts.includes(postId);
    let updatedLikes = [...likedPosts];
    
    if (isLiked) {
      updatedLikes = updatedLikes.filter(id => id !== postId);
    } else {
      updatedLikes.push(postId);
    }
    
    setLikedPosts(updatedLikes);
    localStorage.setItem('mednova_community_liked', JSON.stringify(updatedLikes));

    // Update posts counts
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: isLiked ? Math.max(0, post.likes - 1) : post.likes + 1
        };
      }
      return post;
    });
    savePostsData(updatedPosts);
  };

  // Toggle comments expander
  const toggleComments = (postId) => {
    setOpenComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Submit comments
  const handleAddComment = (e, postId) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      author: user?.name || "Anonymous",
      avatar: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      text,
      time: "Just now"
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });

    savePostsData(updatedPosts);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    
    addNotification(
      "Comment Posted",
      `You added a comment on thread: "${posts.find(p => p.id === postId)?.title}"`,
      "system"
    );
  };

  // Create post submit
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      author: user?.name || "Dr. Elena Rostova",
      avatar: user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
      content: newContent.trim(),
      likes: 0,
      category: newCategory,
      time: "Just now",
      comments: []
    };

    const updated = [newPost, ...posts];
    savePostsData(updated);

    // Reset fields
    setNewTitle('');
    setNewContent('');
    setNewCategory('StudyTips');
    setIsCreating(false);

    addNotification(
      "Discussion Created",
      `Your new discussion thread "${newPost.title}" is live in the community feed.`,
      "system"
    );
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    // Tag filter
    if (activeTag !== 'All' && post.category !== activeTag) return false;

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const titleMatch = post.title?.toLowerCase().includes(q);
      const descMatch = post.content?.toLowerCase().includes(q);
      const authorMatch = post.author?.toLowerCase().includes(q);
      if (!titleMatch && !descMatch && !authorMatch) return false;
    }

    return true;
  });

  // Trending hashtags lists
  const trendingTags = [
    { name: "USMLE", count: 42 },
    { name: "Residency", count: 28 },
    { name: "StudyTips", count: 19 },
    { name: "Cardiology", count: 15 }
  ];

  // Popular discussions widget click targets
  const popularDiscussions = [
    { title: "ECG interpretation workshop tips", tag: "StudyTips" },
    { title: "Shadowing at Boston General Hospital", tag: "Residency" },
    { title: "CITI Certification timeline details", tag: "USMLE" }
  ];

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-200">
      
      {/* 1. Page Header Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-64 h-64 bg-medical-teal/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 z-10 text-left">
          <h2 className="text-xl sm:text-2xl font-display font-black text-slate-850 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-medical-teal" />
            Clinical Student Community
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light max-w-xl">
            Discuss mock rotation case files, share CITI certification guides, and collaborate on USMLE preparation tips.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-gradient-to-r from-medical-teal to-medical-emerald text-white rounded-xl text-xs font-bold shadow-md shadow-medical-teal/10 hover:opacity-95 transition-all cursor-pointer shrink-0 z-10"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          Create Discussion
        </button>
      </div>

      {/* 2. Three-Column Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Feed, Create Post) */}
        <div className="lg:col-span-2 space-y-6 text-left">
          
          {/* Create Post Form Card (AnimatePresence) */}
          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-3xl shadow-sm space-y-4 overflow-hidden"
              >
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-dark-border/40 pb-3">
                  <h3 className="text-xs font-bold text-slate-855 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-medical-teal" />
                    New Discussion Topic
                  </h3>
                  <button 
                    onClick={() => setIsCreating(false)}
                    className="p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-650"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Topic Title</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Study checklists for USMLE rotations..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Discussion Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-250 dark:bg-[#080d16] dark:border-dark-border text-xs rounded-xl px-3.5 py-2 text-slate-700 dark:text-slate-350 focus:outline-none focus:border-medical-teal"
                      >
                        <option value="StudyTips">Study & Clerkship Tips</option>
                        <option value="Residency">Residency Programs</option>
                        <option value="USMLE">USMLE & Credentials</option>
                        <option value="Cardiology">Cardiology specialty</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Message Body</label>
                    <textarea 
                      required
                      rows="4"
                      placeholder="Share details, questions, or rotation resources here..."
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-medical-teal resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-medical-teal to-medical-emerald text-white text-xs font-bold shadow shadow-medical-teal/10 hover:opacity-95 transition-all cursor-pointer text-center"
                  >
                    Post Discussion Topic
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyword Search & Category Header */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2.5 px-3.5 py-2 bg-slate-50 dark:bg-[#080d16] border border-slate-200 dark:border-dark-border rounded-2xl focus-within:border-medical-teal transition-all w-full sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input 
                type="text" 
                placeholder="Search discussions..."
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

            {/* Tag/Category toggle */}
            <div className="flex gap-1.5 overflow-x-auto self-start sm:self-auto max-w-full">
              {['All', 'StudyTips', 'Residency', 'USMLE', 'Cardiology'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer shrink-0 ${
                    activeTag === tag
                      ? 'bg-medical-teal/10 border-medical-teal/30 text-medical-teal dark:bg-medical-teal/15'
                      : 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-dark-border/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tag === 'All' ? 'All Feed' : tag}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Feed Stream */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => {
                const isLiked = likedPosts.includes(post.id);
                const hasComments = openComments[post.id];
                return (
                  <motion.div 
                    layout
                    key={post.id} 
                    variants={itemVariants}
                    whileHover={{ y: -2, scale: 1.005, boxShadow: "0 10px 20px -8px rgba(0,0,0,0.03)" }}
                    className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-3xl shadow-sm space-y-4 relative overflow-hidden"
                  >
                    {/* Post header: Author, time, category badge */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.avatar} 
                          alt={post.author} 
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-slate-100"
                        />
                        <div className="text-left">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250">{post.author}</h4>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-light">{post.time}</span>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-dark-border text-slate-550 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-wide">
                        #{post.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5">
                      <h3 className="text-sm sm:text-base font-display font-black text-slate-850 dark:text-white tracking-tight">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>
                    </div>

                    {/* Actions panel */}
                    <div className="flex items-center gap-4 border-t border-slate-100 dark:border-dark-border/40 pt-3 text-xs">
                      {/* Like button */}
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                          isLiked 
                            ? 'text-rose-500' 
                            : 'text-slate-450 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-450'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                        <span>{post.likes}</span>
                      </button>

                      {/* Comment toggler */}
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-1.5 font-bold text-slate-450 dark:text-slate-500 hover:text-medical-teal transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments.length} Comments</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${hasComments ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Expandable comments stack */}
                    <AnimatePresence>
                      {hasComments && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-slate-100 dark:border-dark-border/40 pt-4 space-y-4 overflow-hidden"
                        >
                          {/* Comments List */}
                          {post.comments.length > 0 && (
                            <div className="space-y-3 pl-2 border-l border-slate-150 dark:border-dark-border/80 ml-4">
                              {post.comments.map((comment) => (
                                <div key={comment.id} className="space-y-1 text-left">
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={comment.avatar} 
                                      alt={comment.author} 
                                      className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                                    />
                                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{comment.author}</span>
                                    <span className="text-[8px] text-slate-400 dark:text-slate-550 font-light">• {comment.time}</span>
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 pl-8 leading-relaxed font-light">
                                    {comment.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Write Comment form */}
                          <form 
                            onSubmit={(e) => handleAddComment(e, post.id)} 
                            className="flex gap-2 pl-4"
                          >
                            <input 
                              type="text"
                              placeholder="Write a comment..."
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                              className="flex-grow bg-slate-50 dark:bg-[#080d16] border border-slate-250 dark:border-dark-border rounded-xl px-3.5 py-1.5 text-xs text-slate-800 dark:text-slate-355 focus:outline-none focus:border-medical-teal transition-all"
                            />
                            <button
                              type="submit"
                              disabled={!commentInputs[post.id]?.trim()}
                              className="p-1.5 rounded-xl bg-gradient-to-r from-medical-teal to-medical-emerald text-white hover:opacity-95 shadow shadow-medical-teal/10 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-16 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-3xl">
                <Users className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No discussions found</h4>
                <p className="text-xs text-slate-455 mt-1 leading-normal max-w-xs mx-auto font-light">
                  Try adjusting your search queries or category tags to find related student conversations.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Sidebar (Trending Tags, Popular Discussions) */}
        <div className="space-y-6 lg:col-span-1 text-left">
          
          {/* Trending Topics Widget */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-base font-display font-black text-slate-850 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-medical-teal" />
              Trending Topics
            </h3>

            <div className="space-y-3 pt-1">
              {trendingTags.map((tag, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveTag(tag.name)}
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border/60 hover:border-medical-teal dark:hover:border-medical-teal/60 rounded-2xl cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <span className="text-xs font-bold text-slate-850 dark:text-slate-200 hover:text-medical-teal">
                    #{tag.name}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-200/50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-[9px] font-extrabold rounded-md">
                    {tag.count} posts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Discussions Widget */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-base font-display font-black text-slate-850 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-medical-teal" />
              Popular Discussions
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-dark-border/60">
              {popularDiscussions.map((d, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setSearchQuery(d.title);
                    setActiveTag(d.tag);
                  }}
                  className="py-3 flex flex-col gap-1 cursor-pointer hover:opacity-85 transition-opacity"
                >
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 line-clamp-2 leading-relaxed">
                    {d.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[9px] font-semibold text-slate-450 dark:text-slate-500 pt-0.5">
                    <span className="uppercase text-medical-teal">#{d.tag}</span>
                    <span>•</span>
                    <span>Active Thread</span>
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
export default Community;
