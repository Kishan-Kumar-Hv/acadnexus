import React, { useState, useEffect, useRef } from 'react';
import { Upload, Plus, Trash2, BookOpen, Clock, BrainCircuit, Sparkles, CheckCircle, Play, FileText, ChevronRight, Check } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAZz8rGBNwO0ZlXVHfvuoPIPOnt0GTC0HA");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const PremiumCard = ({ children, className = "" }) => (
  <div className={`relative bg-white/20 backdrop-blur-[40px] rounded-[32px] border border-white/40 shadow-[0_8px_40px_rgb(0,0,0,0.08)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgb(0,0,0,0.15)] ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none"></div>
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
    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{message}</h3>
    <p className="mt-2 text-slate-500 font-medium text-center">Using advanced AI models to optimize your learning path...</p>
  </div>
);

const StudyPlanner = () => {
  const [step, setStep] = useState('setup'); // setup, generating, plan, studying, generating_quiz, quiz
  const [subjects, setSubjects] = useState([{ id: 1, name: '', difficulty: 'Medium', syllabusUploaded: false, syllabusStatus: 'idle', topics: '' }]);
  const [hours, setHours] = useState(2);
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
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result.split(',')[1];
          const prompt = "Extract the main subjects, topics, or chapters from this syllabus image. Provide a concise, comma-separated list of the key areas of study. Do not use any markdown formatting, just text.";
          
          const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Data, mimeType: file.type } }
          ]);
          
          const text = result.response.text();
          
          setSubjects(prev => prev.map(s => s.id === subjectId ? { ...s, topics: text, syllabusUploaded: true, syllabusStatus: 'success' } : s));
        } catch (err) {
          console.error("Gemini Error:", err);
          updateSubject(subjectId, 'syllabusStatus', 'error');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
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
    
    const context = subjects.map(s => `${s.name || "Unknown Subject"} (Difficulty: ${s.difficulty}) - Topics: ${s.topics || "General"}`).join("\n");
    
    const prompt = `You are an expert AI study planner. Create a highly detailed study plan for ${hours} hours total. 
    Here are the subjects and their extracted topics:
    ${context}
    
    Distribute the time (in minutes) intelligently based on difficulty. Total duration of all sessions should approach ${hours * 60} minutes.
    Return the result strictly as a valid JSON array of objects, and absolutely NO MARKDOWN wrap (do not include \`\`\`json). The objects must have these exact keys: "subject", "topic", "duration", "type".
    Example: [{"subject": "Math", "topic": "Calculus Basics", "duration": 45, "type": "Deep Focus"}]`;
    
    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsedPlan = JSON.parse(text);
      setGeneratedPlan(parsedPlan.map((item, idx) => ({ ...item, id: idx, status: 'pending' })));
      setStep('plan');
    } catch (e) {
      console.error("Plan Generation Error:", e);
      // Fallback if AI fails
      setGeneratedPlan(subjects.map((subj, idx) => ({
        id: idx,
        subject: subj.name || `Subject ${idx + 1}`,
        topic: subj.topics ? subj.topics.split(',')[0] : 'Core Fundamentals',
        duration: Math.max(30, Math.floor((hours * 60) / subjects.length)),
        type: subj.difficulty === 'Hard' ? 'Deep Focus' : 'Review & Practice',
        status: 'pending'
      })));
      setStep('plan');
    }
  };

  const startSession = (session) => {
    setActiveSession(session);
    setStep('studying');
  };

  const finishSession = async () => {
    setStep('generating_quiz');
    
    const prompt = `Generate a 3-question multiple-choice quiz testing the user on the topic of "${activeSession.topic}" within the subject "${activeSession.subject}". 
    Create realistic, moderately challenging academic questions. 
    Return strictly as a valid JSON array of objects, without any markdown formatting. The structure must be exactly:
    [
      { "question": "Question text?", "options": ["Option A", "Option B", "Option C", "Option D"], "answerIndex": 0 }
    ]`;
    
    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedQuiz = JSON.parse(text);
      setQuizzes(parsedQuiz);
      setCurrentQuestion(0);
      setQuizScore(0);
      setSelectedAnswer(null);
      setStep('quiz');
    } catch (e) {
      console.error("Quiz Error:", e);
      // Fallback quiz if AI generation fails
      setQuizzes([{ question: "Could not generate AI quiz. Mark unit as learned?", options: ["Yes", "No", "Maybe", "I don't know"], answerIndex: 0 }]);
      setCurrentQuestion(0);
      setStep('quiz');
    }
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const submitQuestion = () => {
    if (selectedAnswer === null) return;
    
    if (selectedAnswer === quizzes[currentQuestion].answerIndex) {
      setQuizScore(prev => prev + 1);
    }
    
    if (currentQuestion < quizzes.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz finished
      alert(`Quiz completed! You scored ${selectedAnswer === quizzes[currentQuestion].answerIndex ? quizScore + 1 : quizScore} / ${quizzes.length}`);
      setStep('plan');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] max-w-5xl mx-auto space-y-10 animate-fade-in-up pb-12 pt-4 z-10">
      {/* Full-screen Aesthetic Background Image */}
      <div 
        className="fixed inset-0 z-[-2] pointer-events-none"
        style={{
          backgroundImage: "url('https://i.pinimg.com/736x/97/1e/57/971e57b809e8d3e68b59f81441329c9e.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.35
        }}
      ></div>
      
      <div className="absolute inset-0 z-[-1] overflow-hidden rounded-[40px] pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-300/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
        <div className="absolute bottom-40 left-0 w-[400px] h-[400px] bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-bold mb-6 shadow-xl animate-float">
          <Sparkles className="text-brand-400" size={16} /> AI Adaptive Planner
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">
          Intelligent Learning Engine
        </h1>
        <p className="mt-4 text-lg text-slate-500 font-medium max-w-2xl mx-auto">
          Upload your syllabus, let our AI extract the curriculum, and follow a dynamically scheduled roadmap constructed perfectly to match your goals.
        </p>
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
                  <div key={subj.id} className="group flex flex-col md:flex-row items-center gap-4 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/50 hover:border-brand-300 hover:shadow-lg hover:bg-white/40 transition-all shadow-sm">
                     <div className="flex-1 w-full">
                       <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 block drop-shadow-sm">Subject Name</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Data Structures" 
                         value={subj.name}
                         onChange={(e) => updateSubject(subj.id, 'name', e.target.value)}
                         className="w-full bg-white/50 backdrop-blur-xl px-4 py-3 rounded-xl border border-white/60 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-bold text-slate-800 placeholder-slate-500 shadow-inner" 
                       />
                     </div>
                     
                     <div className="w-full md:w-48">
                       <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 block drop-shadow-sm">Difficulty</label>
                       <select 
                         value={subj.difficulty}
                         onChange={(e) => updateSubject(subj.id, 'difficulty', e.target.value)}
                         className="w-full bg-white/50 backdrop-blur-xl px-4 py-3 rounded-xl border border-white/60 focus:ring-2 focus:ring-brand-500 outline-none font-bold text-slate-800 appearance-none cursor-pointer shadow-inner"
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
                           accept="image/*" 
                           ref={el => fileInputRefs.current[subj.id] = el} 
                           onChange={(e) => handleFileUpload(e, subj.id)} 
                           className="hidden" 
                        />
                        <button 
                          onClick={() => triggerFileInput(subj.id)}
                          disabled={subj.syllabusStatus === 'extracting'}
                          className={`w-full md:w-auto px-4 py-3 flex items-center justify-center gap-2 rounded-xl border border-white/60 font-bold transition-all shadow-sm ${
                            subj.syllabusStatus === 'success' ? 'bg-emerald-500/20 border-emerald-300 text-emerald-800' : 
                            subj.syllabusStatus === 'extracting' ? 'bg-brand-500/20 border-brand-300 text-brand-800 opacity-70' :
                            'bg-white/50 backdrop-blur-xl text-slate-700 hover:bg-white/70 hover:text-brand-700'
                          }`}
                        >
                          {subj.syllabusStatus === 'success' ? <Check size={18} /> : 
                           subj.syllabusStatus === 'extracting' ? <BrainCircuit size={18} className="animate-spin" /> : 
                           <Upload size={18} />}
                          {subj.syllabusStatus === 'success' ? 'Extracted' : 
                           subj.syllabusStatus === 'extracting' ? 'Processing...' : 'Upload Img'}
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

                <button onClick={addSubject} className="w-full py-4 rounded-2xl border-2 border-dashed border-white/50 bg-white/20 backdrop-blur-sm text-slate-700 font-bold hover:border-brand-400 hover:text-brand-700 hover:bg-white/40 transition-all flex items-center justify-center gap-2 shadow-sm">
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
                 
                 <div className="flex items-center gap-6 bg-white/30 backdrop-blur-lg p-6 rounded-2xl border border-white/50 shadow-inner">
                    <button onClick={() => setHours(Math.max(1, hours - 1))} className="w-12 h-12 rounded-xl bg-white/60 backdrop-blur-md shadow-sm border border-white/60 text-2xl font-black text-slate-700 hover:bg-white/80 hover:text-brand-700 transition-all">-</button>
                    <div className="flex-1 text-center">
                       <span className="text-5xl font-black text-slate-900 drop-shadow-sm">{hours}</span>
                       <span className="text-lg font-bold text-slate-600 ml-2 drop-shadow-sm">hrs</span>
                    </div>
                    <button onClick={() => setHours(Math.min(12, hours + 1))} className="w-12 h-12 rounded-xl bg-white/60 backdrop-blur-md shadow-sm border border-white/60 text-2xl font-black text-slate-700 hover:bg-white/80 hover:text-brand-700 transition-all">+</button>
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

    </div>
  );
};

export default StudyPlanner;
