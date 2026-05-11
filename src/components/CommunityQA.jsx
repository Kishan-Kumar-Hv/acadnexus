import React, { useState } from 'react';
import { Users, HelpCircle, MessageCircle, Send, ChevronDown, ChevronUp, Clock, Tag } from 'lucide-react';

const PremiumCard = ({ children, className = "" }) => (
  <div className={`relative bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/80 shadow-[0_8px_40px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-500 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const initialQuestions = [
  {
    id: 1,
    title: "I'm struggling with visualizing 4D matrices in Linear Algebra. Any tips?",
    description: "I understand 2D and 3D matrices perfectly, but when my professor brings up 4D tensors for machine learning, I completely lose the mental picture. Is there a trick to this?",
    domain: "Mathematics",
    timeAgo: "2 hours ago",
    answers: [
      { text: "Don't try to visualize it spatially! Think of a 4D matrix simply as an array of 3D cubes. Just like a 3D matrix is an array of 2D grids.", timeAgo: "1 hour ago" },
      { text: "I highly recommend the 3Blue1Brown YouTube series on Linear Algebra. It completely saved my semester when we hit tensors.", timeAgo: "45 mins ago" }
    ],
    isExpanded: false
  },
  {
    id: 2,
    title: "How do you guys memorize the Krebs Cycle for Biology without going insane?",
    description: "I have my final in 3 days. I've tried flashcards but the enzyme names are just too similar. Please help!",
    domain: "Biology",
    timeAgo: "5 hours ago",
    answers: [
      { text: "Use mnemonics! 'Citrate Is Krebs Starting Substrate For Making Oxaloacetate'. Each capital letter corresponds to the first letter of the cycle.", timeAgo: "4 hours ago" }
    ],
    isExpanded: false
  }
];

const CommunityQA = () => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDomain, setNewDomain] = useState('General');
  const [isPosting, setIsPosting] = useState(false);
  const [answerInputs, setAnswerInputs] = useState({});

  const handlePostQuestion = () => {
    if (!newTitle.trim() || !newDesc.trim()) return;
    
    const newQ = {
      id: Date.now(),
      title: newTitle,
      description: newDesc,
      domain: newDomain,
      timeAgo: "Just now",
      answers: [],
      isExpanded: false
    };

    setQuestions([newQ, ...questions]);
    setNewTitle('');
    setNewDesc('');
    setIsPosting(false);
  };

  const handlePostAnswer = (qId) => {
    const answerText = answerInputs[qId];
    if (!answerText || !answerText.trim()) return;

    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          answers: [...q.answers, { text: answerText, timeAgo: "Just now" }]
        };
      }
      return q;
    }));

    setAnswerInputs({ ...answerInputs, [qId]: '' });
  };

  const toggleExpand = (id) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, isExpanded: !q.isExpanded } : q));
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-12 pt-4 z-10">
      
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-6 border border-indigo-100 shadow-sm animate-float">
          <Users className="text-indigo-500" size={16} /> Anonymous Peer Network
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">
          Community Q&A Board
        </h1>
        <p className="mt-4 text-lg text-slate-500 font-medium max-w-2xl mx-auto">
          Stuck on a problem the AI couldn't explain? Ask the global community. Post anonymously, share knowledge, and help your peers succeed.
        </p>
      </div>

      {/* Post a Question Section */}
      <PremiumCard className="p-6 md:p-8">
        {!isPosting ? (
          <div 
            onClick={() => setIsPosting(true)}
            className="w-full bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-2xl p-6 text-center cursor-pointer transition-colors group"
          >
            <HelpCircle size={32} className="mx-auto text-slate-400 group-hover:text-indigo-500 mb-3 transition-colors" />
            <h3 className="text-lg font-black text-slate-700 group-hover:text-indigo-600 transition-colors">Post a new doubt anonymously</h3>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in-up">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-4">
               <HelpCircle className="text-indigo-500" /> Ask the Community
            </h3>
            <input 
              type="text" 
              placeholder="Question Title (e.g. How do I solve quadratic equations fast?)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-50 px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-800 placeholder-slate-400"
            />
            <div className="flex gap-4">
               <select 
                 value={newDomain}
                 onChange={(e) => setNewDomain(e.target.value)}
                 className="bg-slate-50 px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-800"
               >
                 <option value="General">General Study</option>
                 <option value="Mathematics">Mathematics</option>
                 <option value="Science">Science / Biology / Physics</option>
                 <option value="Engineering">Engineering & Tech</option>
                 <option value="Arts">Arts & Humanities</option>
               </select>
            </div>
            <textarea 
              rows={4}
              placeholder="Provide more context or show where you got stuck..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full bg-slate-50 px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700 resize-none"
            />
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setIsPosting(false)}
                className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handlePostQuestion}
                className="px-6 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                Post Anonymously <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </PremiumCard>

      {/* Questions Feed */}
      <div className="space-y-6">
        {questions.map((q) => (
          <PremiumCard key={q.id} className="p-0 overflow-hidden">
             {/* Question Header */}
             <div className="p-6 md:p-8 cursor-pointer hover:bg-slate-50/50 transition-colors" onClick={() => toggleExpand(q.id)}>
                <div className="flex items-start justify-between gap-4">
                   <div className="flex-1">
                     <div className="flex items-center gap-3 mb-3">
                        <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                          <Tag size={12} /> {q.domain}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                          <Clock size={12} /> {q.timeAgo}
                        </span>
                     </div>
                     <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight mb-2">
                       {q.title}
                     </h2>
                     <p className="text-slate-600 font-medium leading-relaxed line-clamp-2">
                       {q.description}
                     </p>
                   </div>
                   <div className="flex flex-col items-center gap-1 text-slate-400 shrink-0">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-black text-lg text-slate-700">
                         {q.answers.length}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">Ans</span>
                   </div>
                </div>
                
                <div className="mt-4 flex justify-center text-slate-300">
                   {q.isExpanded ? <ChevronUp /> : <ChevronDown />}
                </div>
             </div>

             {/* Answers Section */}
             {q.isExpanded && (
               <div className="border-t border-slate-100 bg-slate-50/50 p-6 md:p-8 animate-fade-in-up">
                 <div className="mb-6">
                    <h4 className="font-bold text-slate-900 mb-2">Full Description:</h4>
                    <p className="text-slate-600 font-medium leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                      {q.description}
                    </p>
                 </div>

                 <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <MessageCircle size={18} className="text-indigo-500" /> Community Answers ({q.answers.length})
                 </h4>

                 <div className="space-y-4 mb-6">
                   {q.answers.length === 0 ? (
                     <p className="text-slate-500 font-medium italic text-center py-4">No answers yet. Be the first to help!</p>
                   ) : (
                     q.answers.map((ans, idx) => (
                       <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative">
                         <div className="absolute -left-3 top-5 w-6 h-6 rounded-full bg-indigo-100 border-4 border-slate-50 flex items-center justify-center">
                           <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                         </div>
                         <div className="flex justify-between items-start mb-2">
                           <span className="text-sm font-bold text-slate-800">Anonymous Peer</span>
                           <span className="text-xs font-medium text-slate-400">{ans.timeAgo}</span>
                         </div>
                         <p className="text-slate-700 font-medium leading-relaxed">{ans.text}</p>
                       </div>
                     ))
                   )}
                 </div>

                 {/* Submit Answer */}
                 <div className="relative flex items-center">
                    <input 
                      type="text" 
                      value={answerInputs[q.id] || ''}
                      onChange={(e) => setAnswerInputs({...answerInputs, [q.id]: e.target.value})}
                      onKeyDown={(e) => e.key === 'Enter' && handlePostAnswer(q.id)}
                      placeholder="Write your answer anonymously to help out..."
                      className="w-full pl-6 pr-16 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700 shadow-sm"
                    />
                    <button 
                      onClick={() => handlePostAnswer(q.id)}
                      disabled={!answerInputs[q.id]?.trim()}
                      className="absolute right-2 p-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={16} />
                    </button>
                 </div>
               </div>
             )}
          </PremiumCard>
        ))}
      </div>

    </div>
  );
};

export default CommunityQA;
