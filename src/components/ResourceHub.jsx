import React, { useState, useEffect } from 'react';
import { Search, Youtube, BookOpen, FileText, ExternalLink, Globe, Compass, Sparkles, Zap, ArrowUpRight, Loader2 } from 'lucide-react';
import { generateResourceHubData } from '../config/gemini';

const POPULAR_TOPICS = [
  'Machine Learning & Neural Networks',
  'Data Structures & Algorithms',
  'Calculus & Linear Algebra',
  'Quantum Computing & Physics',
  'System Design & Architecture',
  'Database Management & SQL'
];

const PremiumCard = ({ children, className = "" }) => (
  <div className={`relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/80 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const ResourceHub = () => {
  const [topic, setTopic] = useState('Machine Learning & Neural Networks');
  const [isSearching, setIsSearching] = useState(false);
  const [resources, setResources] = useState(null);

  const handleSearch = async (searchTopic) => {
    const q = (searchTopic || topic || '').trim() || 'Machine Learning & Neural Networks';
    if (searchTopic) setTopic(searchTopic);
    setIsSearching(true);

    try {
      const data = await generateResourceHubData(q);
      setResources(data);
    } catch (e) {
      console.error("ResourceHub error:", e);
      const fallback = await generateResourceHubData(q);
      setResources(fallback);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    handleSearch('Machine Learning & Neural Networks');
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-5rem)] max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-12 pt-4 z-10">
      
      {/* Ambient background blob */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-400/15 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-blue-400/15 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-[32px] overflow-hidden shadow-[0_8px_40px_rgb(0,0,0,0.08)] mb-8 group">
         <img 
           src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=2000" 
           alt="Library and Resources" 
           className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" 
         />
         <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900/40"></div>
         
         <div className="relative z-10 p-8 lg:p-12 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-red-600 dark:text-red-400 text-sm font-bold mb-4 shadow-sm border border-red-100 dark:border-red-900/30">
              <Globe size={16} /> Global Knowledge Base & Curated Media
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-3">
              AI Resource <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500">Aggregator</span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium max-w-xl">
              Instantly aggregate verified lectures, seminal textbooks, and foundational concepts for any academic subject.
            </p>
         </div>
      </div>

      {/* Search Card & Quick Topics */}
      <PremiumCard className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="What do you want to master today? e.g. Quantum Computing..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-800 dark:text-white transition-all"
            />
          </div>
          <button 
            onClick={() => handleSearch()}
            disabled={isSearching || !topic.trim()}
            className="px-7 py-3.5 bg-slate-900 hover:bg-red-600 text-white font-black rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
          >
            {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Compass size={18} />}
            {isSearching ? "Curating..." : "Aggregate"}
          </button>
        </div>

        {/* Quick Topic Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} className="text-red-500" /> Popular:
          </span>
          {POPULAR_TOPICS.map((pt, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(pt)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800"
            >
              {pt}
            </button>
          ))}
        </div>
      </PremiumCard>

      {/* Loading Skeleton */}
      {isSearching && (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full border-4 border-red-100 border-t-red-500 animate-spin mb-4 flex items-center justify-center">
            <Globe className="text-red-500 animate-pulse" size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Curating Academic Resources for "{topic}"</h3>
          <p className="text-sm text-slate-500 mt-1">Connecting to global educational channels and knowledge repositories...</p>
        </div>
      )}

      {/* Results View */}
      {resources && !isSearching && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          
          {/* Videos Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Youtube className="text-red-500" size={22} /> Recommended Lectures
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                {(resources.videos || []).length} Verified
              </span>
            </div>

            <div className="space-y-3">
              {(resources.videos || []).map((vid, i) => (
                <a 
                  key={i} 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(vid.title + ' ' + (vid.channel || ''))}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="block p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700 hover:shadow-md transition-all group"
                >
                   <div className="flex items-start justify-between gap-2">
                     <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 text-sm leading-snug line-clamp-2">
                       {vid.title}
                     </h4>
                     <ArrowUpRight size={16} className="text-slate-400 group-hover:text-red-500 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                   </div>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                     {vid.channel || 'Educational Masterclass'}
                   </p>
                </a>
              ))}
            </div>
          </div>

          {/* Books Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                <BookOpen className="text-blue-500" size={22} /> Essential Reading
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                {(resources.books || []).length} References
              </span>
            </div>

            <div className="space-y-3">
              {(resources.books || []).map((book, i) => (
                <a
                  key={i}
                  href={`https://www.google.com/search?q=${encodeURIComponent(book.title + ' ' + (book.author || '') + ' book')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group"
                >
                   <div className="flex items-start justify-between gap-2">
                     <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm leading-snug">
                       {book.title}
                     </h4>
                     <ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-500 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                   </div>
                   <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-1.5 mb-1.5">
                     {book.author || 'Author Reference'}
                   </p>
                   <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                     {book.desc}
                   </p>
                </a>
              ))}
            </div>
          </div>

          {/* Concepts Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                <FileText className="text-amber-500" size={22} /> Core Concepts
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                {(resources.concepts || []).length} Pillars
              </span>
            </div>

            <div className="space-y-3">
              {(resources.concepts || []).map((concept, i) => (
                <div key={i} className="p-4 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl border border-amber-200/70 dark:border-amber-900/40">
                   <h4 className="font-bold text-amber-950 dark:text-amber-300 text-sm mb-1.5 flex items-center gap-1.5">
                     <Zap size={14} className="text-amber-500 shrink-0" />
                     {concept.term}
                   </h4>
                   <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed font-medium">
                     {concept.definition}
                   </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ResourceHub;

