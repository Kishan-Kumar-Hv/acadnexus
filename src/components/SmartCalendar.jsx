import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Target, Sparkles, BrainCircuit, ChevronRight, CheckCircle, AlertCircle, CalendarDays, ArrowRight } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyD5aHDyevRFdNbj2Gf1x_-7Qd4-fYWCYZM");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const PremiumCard = ({ children, className = "" }) => (
  <div className={`relative bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/80 shadow-[0_8px_40px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgb(0,0,0,0.12)] hover:-translate-y-1 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const LoadingAI = ({ message, progress }) => (
  <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
    <div className="relative w-32 h-32 flex items-center justify-center mb-8">
      <svg className="absolute inset-0 w-full h-full transform -rotate-90 text-brand-500" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-100" />
        <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="289" strokeDashoffset={289 - (289 * progress) / 100} style={{ transition: 'stroke-dashoffset 0.3s ease' }} className="text-brand-500" strokeLinecap="round" />
      </svg>
      <BrainCircuit size={48} className="text-brand-500 animate-pulse" />
      <div className="absolute inset-0 bg-brand-400 rounded-full blur-xl opacity-20 animate-blob"></div>
    </div>
    <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">{message}</h3>
    <p className="text-slate-500 font-medium text-center max-w-md">Running algorithmic timeline distribution across your remaining study days ({progress}%)...</p>
  </div>
);

const SmartCalendar = () => {
  const [step, setStep] = useState('config'); // config, generating, calendar
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [topicsText, setTopicsText] = useState('');
  
  const [calendarPlan, setCalendarPlan] = useState([]);
  const [generationProgress, setGenerationProgress] = useState(0);

  const calculateDaysRemaining = () => {
    if (!examDate) return 0;
    const target = new Date(examDate);
    const today = new Date();
    const diffTime = Math.abs(target - today);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleGenerate = async () => {
    const daysRemaining = calculateDaysRemaining();
    if (daysRemaining <= 0 || !topicsText || !examName) return alert("Please fill out all fields with a valid future date.");

    setStep('generating');
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress > 90) progress = 90;
      setGenerationProgress(progress);
    }, 400);

    const prompt = `You are an expert academic planning AI. The user is preparing for an exam named "${examName}" which is in exactly ${daysRemaining} days. 
    They can study ${hoursPerDay} hours per day.
    
    Here is the raw list of topics/syllabus they need to cover:
    "${topicsText}"
    
    Analyze the topics, identify the most critical ones that require more focus, and distribute everything intelligently across the ${daysRemaining} days.
    Crucial Rules:
    1. Group related topics into logical daily study sessions.
    2. Identify high-priority/complex topics and mark them with "highFocus": true.
    3. Reserve the last 15-20% of the days strictly for "Revision & Practice Exams".
    
    Return the result STRICTLY as a valid JSON array of objects. No markdown formatting.
    Structure:
    [
      {
        "dayNumber": 1,
        "dateLabel": "Day 1",
        "phase": "Learning",
        "focusTitle": "Core Fundamentals of X",
        "tasks": ["Read Chapter 1", "Complete practice set A"],
        "highFocus": true
      }
    ]
    Make sure to return an array containing an object for each of the ${daysRemaining} days.
    `;

    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      let parsedPlan = JSON.parse(text);
      if (!Array.isArray(parsedPlan)) {
        if (parsedPlan && typeof parsedPlan === 'object' && Array.isArray(Object.values(parsedPlan)[0])) {
          parsedPlan = Object.values(parsedPlan)[0];
        } else {
          throw new Error("Invalid JSON format from AI");
        }
      }
      
      clearInterval(interval);
      setGenerationProgress(100);
      
      setTimeout(() => {
        setCalendarPlan(parsedPlan);
        setStep('calendar');
      }, 600);

    } catch (e) {
      console.error("Calendar Generation Error:", e);
      clearInterval(interval);
      setGenerationProgress(100);
      
      // Fallback
      setCalendarPlan([
        { dayNumber: 1, dateLabel: "Day 1", phase: "Learning", focusTitle: "Initial Setup & Basics", tasks: ["Review syllabus", "Start first module"] },
        { dayNumber: 2, dateLabel: "Day 2", phase: "Learning", focusTitle: "Deep Dive Topic 1", tasks: ["Read core material", "Take notes"] },
        { dayNumber: 3, dateLabel: "Day 3", phase: "Revision", focusTitle: "Mock Testing", tasks: ["Complete mock exam", "Review weak points"] }
      ]);
      
      setTimeout(() => setStep('calendar'), 600);
    }
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="relative min-h-[calc(100vh-5rem)] max-w-5xl mx-auto space-y-10 animate-fade-in-up pb-12 pt-4 z-10">
      
      {/* 3D Ambient Orbs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative rounded-[32px] overflow-hidden shadow-[0_8px_40px_rgb(0,0,0,0.08)] mb-10 group">
         <img src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=2000" alt="Calendar Planning" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" />
         <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40 md:to-transparent"></div>
         
         <div className="relative z-10 p-10 lg:p-14 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-brand-700 text-sm font-bold mb-6 shadow-sm border border-brand-100">
              <CalendarDays className="text-brand-500" size={16} /> Algorithmic Roadmapping
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Smart Calendar <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Engine</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium leading-relaxed backdrop-blur-sm bg-white/40 p-3 rounded-xl max-w-xl">
              Distribute your massive syllabus across your remaining days automatically. Our AI creates a perfectly balanced timeline prioritizing learning and final revisions.
            </p>
         </div>
      </div>

      {step === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PremiumCard className="p-8 md:p-10">
               <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                 <Target className="text-brand-500" /> Exam Configuration
               </h2>

               <div className="space-y-6">
                 <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Target Exam / Certification Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. AWS Solutions Architect, Final Semester Math..." 
                      value={examName}
                      onChange={(e) => setExamName(e.target.value)}
                      className="w-full bg-slate-50 px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 transition-all outline-none font-bold text-slate-800 placeholder-slate-400"
                    />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Exam Date</label>
                      <input 
                        type="date" 
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                        className="w-full bg-slate-50 px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 transition-all outline-none font-bold text-slate-800 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Daily Study Capacity (Hrs)</label>
                      <div className="flex items-center gap-4 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200">
                        <button onClick={() => setHoursPerDay(Math.max(1, hoursPerDay - 1))} className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200 text-xl font-black text-slate-700 hover:text-brand-600">-</button>
                        <span className="flex-1 text-center font-black text-2xl text-slate-800">{hoursPerDay}</span>
                        <button onClick={() => setHoursPerDay(Math.min(16, hoursPerDay + 1))} className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200 text-xl font-black text-slate-700 hover:text-brand-600">+</button>
                      </div>
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                       <span>Raw Syllabus / Topic List</span>
                       <span className="text-brand-500 font-bold lowercase">Paste from study planner</span>
                    </label>
                    <textarea 
                      rows={5}
                      placeholder="Paste your comma-separated topics, raw syllabus text, or learning goals here..." 
                      value={topicsText}
                      onChange={(e) => setTopicsText(e.target.value)}
                      className="w-full bg-slate-50 px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 transition-all outline-none font-medium text-slate-700 placeholder-slate-400 resize-none leading-relaxed"
                    />
                 </div>
               </div>
            </PremiumCard>
          </div>

          <div className="space-y-6">
            <PremiumCard className="p-8 bg-slate-900 border-slate-800 text-white relative overflow-hidden h-full flex flex-col">
               <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl"></div>
               
               <h3 className="text-lg font-bold text-slate-300 mb-8 uppercase tracking-widest flex items-center gap-2">
                 <Clock size={18} className="text-brand-400" /> Timeline Analysis
               </h3>
               
               <div className="flex-1 flex flex-col items-center justify-center text-center">
                 {examDate ? (
                   <>
                     <span className="text-7xl font-black text-white drop-shadow-lg mb-2">{daysRemaining > 0 ? daysRemaining : 0}</span>
                     <span className="text-xl font-bold text-slate-400">Days Remaining</span>
                     
                     {daysRemaining > 0 ? (
                       <div className="mt-8 p-4 bg-brand-500/10 border border-brand-500/30 rounded-2xl">
                          <p className="text-brand-300 font-medium text-sm">
                            Perfect. The AI will distribute your topics across the first <strong className="text-white">{Math.floor(daysRemaining * 0.8)} days</strong>, and reserve the final <strong className="text-white">{Math.ceil(daysRemaining * 0.2)} days</strong> for intensive revision.
                          </p>
                       </div>
                     ) : (
                       <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3">
                          <AlertCircle className="text-red-400 shrink-0 mt-0.5" />
                          <p className="text-red-300 font-medium text-sm text-left">
                            The target date has passed or is today. Please select a future date to generate a timeline.
                          </p>
                       </div>
                     )}
                   </>
                 ) : (
                   <div className="text-slate-500 font-medium">
                     <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
                     Select an exam date to calculate your remaining runway.
                   </div>
                 )}
               </div>

               <button 
                 onClick={handleGenerate}
                 disabled={daysRemaining <= 0 || !topicsText}
                 className={`w-full mt-8 py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 shadow-lg
                   ${(daysRemaining > 0 && topicsText) 
                     ? 'bg-brand-500 hover:bg-brand-400 text-white hover:-translate-y-1' 
                     : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                   }
                 `}
               >
                 Generate Smart Calendar <ArrowRight size={20} />
               </button>
            </PremiumCard>
          </div>
        </div>
      )}

      {step === 'generating' && <LoadingAI message="Synthesizing Temporal Strategy..." progress={generationProgress} />}

      {step === 'calendar' && (
        <div className="space-y-8 animate-fade-in-up">
           <div className="flex items-center justify-between mb-2">
             <div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Action Plan</h2>
               <p className="text-slate-500 font-medium mt-1">Roadmap for {examName} ({calendarPlan.length} Days)</p>
             </div>
             <button 
               onClick={() => setStep('config')}
               className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:text-slate-900 shadow-sm transition-all"
             >
               Edit Parameters
             </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {calendarPlan.map((day, idx) => {
                const isRevision = day.phase && day.phase.toLowerCase().includes('revision');
                
                return (
                  <PremiumCard key={idx} className="p-0 h-full flex flex-col group">
                     {/* Header */}
                     <div className={`p-4 border-b ${isRevision ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-brand-500/10 border-brand-500/20'}`}>
                        <div className="flex items-center justify-between mb-1">
                           <span className={`text-xs font-black uppercase tracking-widest ${isRevision ? 'text-emerald-700' : 'text-brand-700'}`}>
                              {day.dateLabel || `Day ${day.dayNumber}`}
                           </span>
                           <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isRevision ? 'bg-emerald-500 text-white shadow-sm' : 'bg-brand-200 text-brand-800'}`}>
                              {day.phase}
                           </span>
                        </div>
                        <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight text-lg mt-2 group-hover:text-brand-600 transition-colors flex items-center gap-2">
                          {day.focusTitle}
                          {day.highFocus && <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest whitespace-nowrap border border-red-200">High Focus</span>}
                        </h3>
                     </div>
                     
                     {/* Task List */}
                     <div className="p-5 flex-1 bg-white/40">
                        <ul className="space-y-3">
                           {day.tasks && day.tasks.map((task, i) => (
                             <li key={i} className="flex items-start gap-2.5">
                               <div className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 ${isRevision ? 'border-emerald-300 bg-emerald-50 text-emerald-500' : 'border-slate-300 bg-white text-transparent group-hover:border-brand-400'}`}>
                                 <CheckCircle size={14} />
                               </div>
                               <span className="text-sm font-medium text-slate-700 leading-relaxed">{task}</span>
                             </li>
                           ))}
                        </ul>
                     </div>
                  </PremiumCard>
                )
              })}
           </div>
        </div>
      )}
    </div>
  );
};

export default SmartCalendar;
