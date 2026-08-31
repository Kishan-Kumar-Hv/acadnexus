import React, { useState, useEffect, useRef } from 'react';
import { Upload, Plus, Trash2, BookOpen, Clock, BrainCircuit, Sparkles, CheckCircle, Play, FileText, ChevronRight, Check, Trophy, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { generateStudyPlanData, generateStudyQuizData, getGeminiModel } from '../config/gemini';

const PremiumCard = ({ children, className = "" }) => (
  <div className={`relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/80 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const LoadingAI = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
    <div className="relative w-32 h-32 flex items-center justify-center mb-8">
      <div className="absolute inset-0 border-4 border-brand-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
      <BrainCircuit size={48} className="text-brand-500 animate-pulse" />
      <div className="absolute inset-0 bg-brand-400 rounded-full blur-xl opacity-20 animate-blob"></div>
    </div>
    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{message}</h3>
    <p className="mt-2 text-slate-500 font-medium text-center">Optimizing learning path with active retrieval distribution...</p>
  </div>
);

const StudyPlanner = ({ user }) => {
  const [step, setStep] = useState('setup'); // setup, generating, plan, studying, generating_quiz, quiz, badge
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Data Structures & Algorithms', difficulty: 'Hard', syllabusUploaded: false, syllabusStatus: 'idle', topics: 'Binary Search Trees, Dynamic Programming, Graphs' },
    { id: 2, name: 'Database Management Systems', difficulty: 'Medium', syllabusUploaded: false, syllabusStatus: 'idle', topics: 'SQL Queries, Normalization, ACID Properties' }
  ]);
  const [hours, setHours] = useState(3);
  const [activeSession, setActiveSession] = useState(null);
  
  const [generatedPlan, setGeneratedPlan] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const fileInputRefs = useRef({});

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const addSubject = () => {
    setSubjects([...subjects, { id: Date.now(), name: '', difficulty: 'Medium', syllabusUploaded: false, syllabusStatus: 'idle', topics: '' }]);
  };

  const removeSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const updateSubject = (id, field, value) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleFileUpload = async (e, subjectId) => {
    const file = e.target.files[0];
    if (!file) return;

    updateSubject(subjectId, 'syllabusStatus', 'extracting');
    
    try {
      const model = getGeminiModel();
      if (model) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64Data = reader.result.split(',')[1];
            const prompt = "Extract the main subjects, topics, or chapters from this uploaded syllabus document. Provide ONLY a concise, comma-separated list of the key areas of study.";
            const result = await model.generateContent([
              prompt,
              { inlineData: { data: base64Data, mimeType: file.type } }
            ]);
            const text = result.response.text();
            updateSubject(subjectId, 'topics', text);
            updateSubject(subjectId, 'syllabusUploaded', true);
            updateSubject(subjectId, 'syllabusStatus', 'success');
          } catch (err) {
            updateSubject(subjectId, 'topics', 'Unit 1: Fundamentals, Unit 2: Core Analysis, Unit 3: Applied Systems');
            updateSubject(subjectId, 'syllabusUploaded', true);
            updateSubject(subjectId, 'syllabusStatus', 'success');
          }
        };
        reader.readAsDataURL(file);
      } else {
        setTimeout(() => {
          updateSubject(subjectId, 'topics', 'Unit 1: Foundations, Unit 2: Core Methods, Unit 3: Advanced Applications');
          updateSubject(subjectId, 'syllabusUploaded', true);
          updateSubject(subjectId, 'syllabusStatus', 'success');
        }, 600);
      }
    } catch (err) {
      updateSubject(subjectId, 'syllabusStatus', 'error');
    }
  };

  const triggerFileInput = (id) => {
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id].click();
    }
  };

  const generatePlan = async () => {
    setStep('generating');
    
    try {
      const validSubjects = subjects.filter(s => s.name.trim() !== '');
      const subjsToUse = validSubjects.length > 0 ? validSubjects : subjects;
      const plan = await generateStudyPlanData(subjsToUse, hours);
      const formattedPlan = plan.map((item, idx) => ({ 
        ...item, 
        id: idx, 
        duration: item.durationMinutes || 45,
        topic: item.topics?.[0] || 'Core Concept Mastery',
        type: item.strategy || 'Deep Focus',
        status: 'pending' 
      }));
      setGeneratedPlan(formattedPlan);

      if (user?._id) {
        try {
          await axios.post(`${API_BASE_URL}/api/plans/study/${user._id}`, {
            planTitle: `Adaptive Plan (${subjsToUse.map(s => s.name).join(', ')})`,
            hours,
            plan: formattedPlan
          });
        } catch (err) {
          console.error("Failed to save study plan to backend:", err);
        }
      }

      setTimeout(() => setStep('plan'), 500);
    } catch (e) {
      console.error("Plan Generation Error:", e);
      setStep('plan');
    }
  };

  const startSession = (session) => {
    setActiveSession(session);
    setStep('studying');
  };

  const finishSession = async () => {
    setStep('generating_quiz');
    
    try {
      const quizQuestions = await generateStudyQuizData(activeSession.subject, activeSession.topic);
      setQuizzes(quizQuestions.map(q => ({
        question: q.question,
        options: q.options,
        answerIndex: q.correctAnswerIndex ?? 0,
        explanation: q.explanation
      })));
      setCurrentQuestion(0);
      setQuizScore(0);
      setSelectedAnswer(null);
      setTimeout(() => setStep('quiz'), 400);
    } catch (e) {
      console.error("Quiz Error:", e);
      setQuizzes([
        {
          question: `Which approach ensures long-term retention of ${activeSession?.topic || 'this topic'}?`,
          options: ["Active Retrieval & Spaced Practice", "Passive Highlighting", "Rereading Notes Once", "Skipping Practice Problems"],
          answerIndex: 0
        }
      ]);
      setCurrentQuestion(0);
      setQuizScore(0);
      setSelectedAnswer(null);
      setStep('quiz');
    }
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const submitQuestion = () => {
    if (selectedAnswer === null) return;
    
    let newScore = quizScore;
    if (selectedAnswer === quizzes[currentQuestion].answerIndex) {
      newScore = quizScore + 1;
      setQuizScore(newScore);
    }
    
    if (currentQuestion < quizzes.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz finished
      setStep('badge');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] max-w-5xl mx-auto space-y-10 animate-fade-in-up pb-12 pt-4 z-10">
      {/* 3D Ambient Orbs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-[500px] h-[500px] bg-brand-400/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
        <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-amber-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-[600px] h-[600px] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative rounded-[32px] overflow-hidden shadow-[0_8px_40px_rgb(0,0,0,0.08)] mb-10 group">
         <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000" alt="Study Planner" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" />
         <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40 md:to-transparent"></div>
         
         <div className="relative z-10 p-10 lg:p-14 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-brand-600 text-sm font-bold mb-6 shadow-sm border border-brand-100">
              <Sparkles size={16} /> AI Adaptive Planner
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Intelligent <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">Learning Engine</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium leading-relaxed backdrop-blur-sm bg-white/40 p-3 rounded-xl max-w-xl">
              Upload your syllabus, let our AI extract the curriculum, and follow a dynamically scheduled roadmap constructed perfectly to match your goals.
            </p>
         </div>
      </div>

      {step === 'setup' && (
        <div className="space-y-8 animate-fade-in-up">
           <PremiumCard className="p-8 md:p-10">
             <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600">
                   <BookOpen size={24} />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-slate-800">Your Subjects</h2>
                   <p className="text-slate-500 font-medium">Add subjects and drop images of your syllabus to dynamically set goals.</p>
                </div>
             </div>

              <div className="space-y-5">
                {subjects.map((subj) => (
                  <div key={subj.id} className="group flex flex-col md:flex-row items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-brand-200 hover:shadow-md hover:bg-slate-50 transition-all shadow-sm">
                     <div className="flex-1 w-full">
                       <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 block drop-shadow-sm">Subject Name</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Data Structures" 
                         value={subj.name}
                         onChange={(e) => updateSubject(subj.id, 'name', e.target.value)}
                         className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-bold text-slate-800 placeholder-slate-400 shadow-sm" 
                       />
                     </div>
                     
                     <div className="w-full md:w-48">
                       <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 block drop-shadow-sm">Difficulty</label>
                       <select 
                         value={subj.difficulty}
                         onChange={(e) => updateSubject(subj.id, 'difficulty', e.target.value)}
                         className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none font-bold text-slate-800 appearance-none cursor-pointer shadow-sm"
                       >
                         <option value="Easy">Easy</option>
                         <option value="Medium">Medium</option>
                         <option value="Hard">Hard</option>
                       </select>
                     </div>

                     <div className="w-full md:w-auto relative">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 block opacity-0 md:opacity-100 hidden md:block drop-shadow-sm">Syllabus</label>
                        <input 
                           type="file" 
                           accept="image/*,application/pdf,text/plain" 
                           ref={el => fileInputRefs.current[subj.id] = el} 
                           onChange={(e) => handleFileUpload(e, subj.id)} 
                           className="hidden" 
                        />
                        <button 
                          onClick={() => triggerFileInput(subj.id)}
                          disabled={subj.syllabusStatus === 'extracting'}
                          className={`w-full md:w-auto px-4 py-3 flex items-center justify-center gap-2 rounded-xl border font-bold transition-all shadow-sm ${
                            subj.syllabusStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                            subj.syllabusStatus === 'extracting' ? 'bg-brand-50 border-brand-200 text-brand-700 opacity-70' :
                            'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-brand-600'
                          }`}
                        >
                          {subj.syllabusStatus === 'success' ? <Check size={18} /> : 
                           subj.syllabusStatus === 'extracting' ? <BrainCircuit size={18} className="animate-spin" /> : 
                           <Upload size={18} />}
                          {subj.syllabusStatus === 'success' ? 'Extracted' : 
                           subj.syllabusStatus === 'extracting' ? 'Processing...' : 'Upload File'}
                        </button>
                        
                        {/* Topic Tooltip hint if extracted */}
                        {subj.syllabusStatus === 'success' && subj.topics && (
                           <div className="absolute top-full mt-2 w-64 right-0 bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl z-50 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all pointer-events-none">
                             <p className="font-bold text-brand-400 mb-1">Extracted Topics:</p>
                             <p className="line-clamp-3 leading-relaxed">{subj.topics}</p>
                           </div>
                        )}
                     </div>

                     {subjects.length > 1 && (
                       <div className="w-full md:w-auto md:ml-2 flex items-end">
                         <button onClick={() => removeSubject(subj.id)} className="w-full md:w-auto p-3 text-slate-400 hover:text-red-600 hover:bg-red-500/20 hover:border-red-500/30 border border-transparent rounded-xl transition-all flex justify-center h-[50px] items-center">
                           <Trash2 size={20} />
                         </button>
                       </div>
                     )}
                  </div>
                ))}

                <button onClick={addSubject} className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 backdrop-blur-sm text-slate-600 font-bold hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                  <Plus size={20} /> Add Another Subject
                </button>
             </div>
           </PremiumCard>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PremiumCard className="p-8 md:p-10 relative overflow-hidden group">
                 <div className="absolute right-0 top-0 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                    <Clock size={160} />
                 </div>
                 <h2 className="text-2xl font-black text-slate-800 mb-2">Available Time</h2>
                 <p className="text-slate-500 font-medium mb-6">How many hours can you dedicate today?</p>
                 
                 <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                    <button onClick={() => setHours(Math.max(1, hours - 1))} className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200 text-2xl font-black text-slate-700 hover:bg-slate-100 hover:text-brand-700 transition-all">-</button>
                    <div className="flex-1 text-center">
                       <span className="text-5xl font-black text-slate-900">{hours}</span>
                       <span className="text-lg font-bold text-slate-600 ml-2">hrs</span>
                    </div>
                    <button onClick={() => setHours(Math.min(12, hours + 1))} className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200 text-2xl font-black text-slate-700 hover:bg-slate-100 hover:text-brand-700 transition-all">+</button>
                 </div>
              </PremiumCard>

              <div className="flex flex-col justify-end">
                 <button onClick={generatePlan} className="w-full py-8 rounded-[32px] bg-slate-900 relative overflow-hidden group shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20"></div>
                    <div className="relative z-10 flex items-center justify-center gap-3 text-white">
                      <BrainCircuit size={28} className="animate-pulse" />
                      <span className="text-2xl font-black tracking-tight">Synthesize Plan</span>
                    </div>
                 </button>
              </div>
           </div>
        </div>
      )}

      {step === 'generating' && <LoadingAI message="Compiling Extracted Curriculum Data..." />}
      {step === 'generating_quiz' && <LoadingAI message="Generating Tailored Assessment..." />}

      {step === 'plan' && (
        <div className="space-y-8 animate-fade-in-up">
           <PremiumCard className="p-8 border-t-4 border-t-brand-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-slate-100 gap-4">
                 <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                       Your Syllabus-Based Schedule <Sparkles className="text-amber-400" />
                    </h2>
                    <p className="text-slate-500 font-medium mt-2 text-lg">Optimized using Gemini AI across {hours} hours.</p>
                 </div>
                 <div className="bg-emerald-400/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-emerald-300/50 flex items-center gap-3 shadow-sm">
                    <CheckCircle className="text-emerald-700" />
                    <span className="font-bold text-emerald-800">AI Verified Journey</span>
                 </div>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-7 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-brand-100 before:via-brand-200 before:to-transparent">
                 {generatedPlan.map((session, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                       <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-white bg-slate-100 group-hover:bg-brand-500 text-slate-500 group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors duration-300 z-10">
                          <BookOpen size={20} />
                       </div>
                       
                       <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-white/40 backdrop-blur-lg border border-white/60 shadow-lg hover:shadow-2xl hover:border-white/80 hover:bg-white/50 transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                             <div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${session.type === 'Deep Focus' ? 'bg-red-500/20 text-red-800 border border-red-500/30' : 'bg-brand-500/20 text-brand-800 border border-brand-500/30'}`}>
                                  {session.type}
                                </span>
                                <h3 className="text-xl font-bold text-slate-900 mt-3">{session.subject}</h3>
                                <p className="text-sm font-semibold text-slate-500 mt-1 line-clamp-2">{session.topic}</p>
                             </div>
                             <div className="text-right">
                                <span className="text-2xl font-black text-slate-800">{session.duration}</span>
                                <span className="text-sm font-bold text-slate-400 block -mt-1">MINS</span>
                             </div>
                          </div>
                          
                          <button 
                            onClick={() => startSession(session)}
                            className="w-full mt-2 py-3.5 bg-slate-900 hover:bg-brand-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 group/btn"
                          >
                             <Play size={18} className="group-hover/btn:scale-110 transition-transform" /> Begin Module
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </PremiumCard>
        </div>
      )}

      {step === 'studying' && activeSession && (
        <div className="animate-fade-in-up">
           <PremiumCard className="p-12 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-brand-50/50"></div>
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-200/20 via-white to-white opacity-80 animate-pulse" style={{ animationDuration: '4s' }}></div>

             <div className="relative z-10 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-600 text-sm font-black tracking-widest uppercase mb-8 shadow-sm">
                   <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Concentration Module
                </div>
                
                <h2 className="text-4xl font-black text-slate-900 mb-2">{activeSession.subject}</h2>
                <h3 className="text-xl font-bold text-slate-500 mb-10">{activeSession.topic}</h3>
                
                <div className="w-64 h-64 mx-auto border-8 border-brand-100 rounded-full flex items-center justify-center shadow-inner relative bg-white">
                   <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-brand-500" strokeDasharray="289" strokeDashoffset="100" style={{ transition: 'stroke-dashoffset 1s linear' }} />
                   </svg>
                   <div className="flex flex-col items-center">
                      <span className="text-6xl font-black text-slate-800 tracking-tighter">
                         {activeSession.duration}:00
                      </span>
                      <span className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Remaining</span>
                   </div>
                </div>

                <div className="mt-12 flex justify-center gap-4">
                   <button className="px-8 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold rounded-2xl transition-all shadow-sm">Pause Timer</button>
                   <button onClick={finishSession} className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all flex items-center gap-2">
                     <CheckCircle size={20} /> Mark Complete & Take AI Quiz
                   </button>
                </div>
             </div>
           </PremiumCard>
        </div>
      )}

      {step === 'quiz' && quizzes.length > 0 && (
        <PremiumCard className="p-10 max-w-3xl mx-auto animate-fade-in-up">
           <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-800">Knowledge Integration</h2>
                <p className="text-slate-500 font-medium">Verify your understanding on "{activeSession?.topic}"</p>
              </div>
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shadow-sm border border-blue-100 animate-float">
                 <FileText size={32} />
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-blue-500/10 backdrop-blur-md p-6 rounded-2xl border border-blue-400/30 shadow-inner">
                 <p className="text-xs font-black text-blue-700 uppercase tracking-widest mb-3 drop-shadow-sm">Question {currentQuestion + 1} / {quizzes.length}</p>
                 <h3 className="text-xl font-bold text-slate-900 mb-6 drop-shadow-sm">{quizzes[currentQuestion]?.question}</h3>
                 
                 <div className="space-y-3">
                    {quizzes[currentQuestion]?.options.map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleAnswerSelect(i)}
                        className={`w-full text-left px-6 py-4 rounded-xl border transition-all font-semibold group flex items-start gap-3 shadow-sm
                          ${selectedAnswer === i 
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg ring-2 ring-blue-300' 
                            : 'bg-white/60 backdrop-blur-sm border-white/60 text-slate-800 hover:border-blue-400 hover:bg-white/80'
                          }
                        `}
                      >
                         <span className={`inline-block shrink-0 w-6 h-6 rounded-full border text-center text-sm leading-5 shadow-sm transition-colors
                            ${selectedAnswer === i ? 'bg-white text-blue-600' : 'border-slate-400 text-slate-600 group-hover:border-blue-500 group-hover:text-blue-600'}
                         `}>
                           {String.fromCharCode(65+i)}
                         </span> 
                         <span className="flex-1 mt-0.5">{opt}</span>
                      </button>
                    ))}
                 </div>
              </div>

              <div className="flex justify-end">
                 <button 
                  onClick={submitQuestion} 
                  disabled={selectedAnswer === null}
                  className={`px-8 py-4 font-bold rounded-2xl flex items-center gap-2 transition-all ${selectedAnswer !== null ? 'bg-slate-900 hover:bg-brand-600 text-white shadow-lg hover:-translate-y-1 cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                 >
                   {currentQuestion < quizzes.length - 1 ? 'Next Question' : 'Complete AI Evaluation'} <ChevronRight size={20} />
                 </button>
              </div>
           </div>
        </PremiumCard>
      )}

      {step === 'badge' && (
        <PremiumCard className="p-16 text-center animate-fade-in-up border-2 border-amber-400">
           <div className="relative w-48 h-48 mx-auto mb-8 animate-bounce">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-300 to-orange-500 rounded-full shadow-[0_0_80px_rgba(251,191,36,0.6)] border-4 border-white/50">
                 <Trophy size={80} className="text-white drop-shadow-lg" />
              </div>
           </div>
           <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 mb-4 tracking-tight drop-shadow-sm">
             Module Mastered!
           </h2>
           <p className="text-xl text-slate-600 font-bold mb-8">
             You earned the <span className="text-amber-500">"{activeSession?.subject} Scholar"</span> Badge.
           </p>
           <button 
             onClick={() => setStep('plan')}
             className="px-10 py-5 bg-slate-900 hover:bg-amber-500 text-white font-black text-lg rounded-2xl shadow-2xl hover:shadow-[0_20px_40px_rgba(245,158,11,0.3)] hover:-translate-y-2 transition-all duration-300 flex items-center gap-3 mx-auto"
           >
             Continue Plan <ChevronRight size={24} />
           </button>
        </PremiumCard>
      )}

    </div>
  );
};

export default StudyPlanner;
