import React, { useState } from 'react';
import { Search, Youtube, BookOpen, FileText, ExternalLink, Globe, Compass } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyD5aHDyevRFdNbj2Gf1x_-7Qd4-fYWCYZM");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const PremiumCard = ({ children, className = "" }) => (
  <div className={`relative bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/80 shadow-[0_8px_40px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgb(0,0,0,0.12)] ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const ResourceHub = () => {
  const [topic, setTopic] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [resources, setResources] = useState(null);

  const handleSearch = async () => {
    if (!topic.trim()) return;
    setIsSearching(true);

    const prompt = `You are an expert academic librarian. The student wants to learn about: "${topic}".
    Provide a curated list of resources for this topic.
    Return strictly a valid JSON object without markdown.
    Structure:
    {
      "videos": [
        {"title": "Search term for YouTube 1", "channel": "e.g. CrashCourse"},
        {"title": "Search term for YouTube 2", "channel": "e.g. Khan Academy"}
      ],
      "books": [
        {"title": "Book Title", "author": "Author Name", "desc": "Short description"}
      ],
      "concepts": [
        {"term": "Key Concept", "definition": "Short definition"}
      ]
    }`;

    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      let parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        if (parsed && typeof parsed === 'object' && Array.isArray(Object.values(parsed)[0])) {
          parsed = Object.values(parsed)[0];
        } else {
          throw new Error("Invalid JSON format");
        }
      }
      setResources(parsed);
    } catch (e) {
      console.error(e);
      // Fallback
      setResources({
        videos: [{ title: `${topic} explained simply`, channel: "Educational Channel" }],
        books: [{ title: `Introduction to ${topic}`, author: "Expert Author", desc: "A great starting point." }],
        concepts: [{ term: "Core Concept", definition: "The fundamental idea." }]
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] max-w-6xl mx-auto space-y-10 animate-fade-in-up pb-12 pt-4 z-10">
      
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
      </div>

      <div className="relative rounded-[32px] overflow-hidden shadow-[0_8px_40px_rgb(0,0,0,0.08)] mb-10 group">
         <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=2000" alt="Library and Resources" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" />
         <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40 md:to-transparent"></div>
         
         <div className="relative z-10 p-10 lg:p-14 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-red-600 text-sm font-bold mb-6 shadow-sm border border-red-100">
              <Globe className="text-red-500" size={16} /> Global Knowledge Base
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              AI Resource <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500">Aggregator</span>
            </h1>
         </div>
      </div>

      <PremiumCard className="p-4 md:p-6 max-w-3xl mx-auto mb-12">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="What do you want to learn today? e.g. Quantum Physics..."
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-700"
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={isSearching || !topic.trim()}
            className="px-8 py-4 bg-slate-900 hover:bg-red-600 text-white font-black rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
          >
            {isSearching ? <Compass className="animate-spin" /> : "Aggregate"}
          </button>
        </div>
      </PremiumCard>

      {resources && !isSearching && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
          
          {/* Videos */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 border-b pb-2">
              <Youtube className="text-red-500" /> Recommended Watches
            </h3>
            {resources.videos.map((vid, i) => (
              <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(vid.title + ' ' + vid.channel)}`} target="_blank" rel="noreferrer" className="block p-4 bg-white rounded-2xl border border-slate-100 hover:border-red-300 hover:shadow-md transition-all group">
                 <h4 className="font-bold text-slate-900 group-hover:text-red-600 line-clamp-2">{vid.title}</h4>
                 <p className="text-sm text-slate-500 mt-1 font-medium">{vid.channel}</p>
              </a>
            ))}
          </div>

          {/* Books */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 border-b pb-2">
              <BookOpen className="text-blue-500" /> Essential Reading
            </h3>
            {resources.books.map((book, i) => (
              <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100">
                 <h4 className="font-bold text-slate-900">{book.title}</h4>
                 <p className="text-xs font-black text-blue-500 uppercase tracking-widest mt-1 mb-2">{book.author}</p>
                 <p className="text-sm text-slate-600 leading-relaxed">{book.desc}</p>
              </div>
            ))}
          </div>

          {/* Concepts */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 border-b pb-2">
              <FileText className="text-amber-500" /> Core Concepts
            </h3>
            {resources.concepts.map((concept, i) => (
              <div key={i} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                 <h4 className="font-bold text-amber-900 mb-1">{concept.term}</h4>
                 <p className="text-sm text-amber-700/80 leading-relaxed font-medium">{concept.definition}</p>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default ResourceHub;
