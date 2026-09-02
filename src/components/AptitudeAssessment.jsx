import React, { useState, useEffect } from 'react';
import { Zap, Brain, ArrowRight, CheckCircle2, ChevronRight, Activity, Award, Sparkles, Target, Compass, RefreshCcw } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { generateAptitudeQuestionsData, generateCareerPathData } from '../config/gemini';

// Questions will be generated dynamically.

const CAREER_RESULTS = {
  analytical: {
    title: "Data Scientist / Software Engineer",
    description: "You have a highly logical mind. You excel at breaking down complex problems and finding structured solutions. Careers in tech, research, and analysis are perfect for you.",
    icon: Activity,
    color: "from-blue-500 to-indigo-600",
    bgAccent: "bg-blue-50",
    textAccent: "text-blue-600"
  },
  creative: {
    title: "UX/UI Designer / Product Innovator",
    description: "You thrive on imagination and aesthetics. You naturally see how things could be improved visually and conceptually. Creative fields will harness your innovative spirit.",
    icon: Sparkles,
    color: "from-purple-500 to-pink-600",
    bgAccent: "bg-purple-50",
    textAccent: "text-purple-600"
  },
  social: {
    title: "Product Manager / Consultant",
    description: "You are a natural communicator and leader. You understand people and know how to align teams to achieve great things. Leadership and interpersonal roles are your strength.",
    icon: Target,
    color: "from-orange-400 to-red-500",
    bgAccent: "bg-orange-50",
    textAccent: "text-orange-600"
  },
  practical: {
    title: "Operations Manager / Systems Architect",
    description: "You are hands-on and highly organized. You prefer real-world applications over pure theory. You will excel in roles that require building and optimizing functional systems.",
    icon: Compass,
    color: "from-emerald-400 to-teal-500",
    bgAccent: "bg-emerald-50",
    textAccent: "text-emerald-600"
  }
};

const PremiumCard = ({ children, className = "" }) => (
  <div className={`relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/80 dark:border-slate-700 shadow-sm overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none"></div>
    {children}
  </div>
);

const AptitudeAssessment = ({ user }) => {
  const [step, setStep] = useState('intro'); // intro, generating_questions, quiz, processing, results
  const [academicStage, setAcademicStage] = useState('12th Grade / Pre-University');
  const [dynamicQuestions, setDynamicQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [processingProgress, setProcessingProgress] = useState(0);
  const [resultCategory, setResultCategory] = useState(null);

  const handleStart = async () => {
    setStep('generating_questions');
    
    try {
      const questions = await generateAptitudeQuestionsData(academicStage);
      setDynamicQuestions(questions.map(q => ({
        question: q.scenario,
        options: q.options
      })));
      setCurrentQuestionIndex(0);
      setAnswers({});
      setTimeout(() => setStep('quiz'), 400);
    } catch (e) {
      console.error(e);
      setDynamicQuestions([
        { question: "How do you naturally approach complex real-world challenges?", options: [{ text: "Break it down with logical algorithms and data metrics", category: "analytical" }, { text: "Brainstorm creative alternatives and novel user experiences", category: "creative" }] },
        { question: "When collaborating in high-stakes environments, where is your greatest strength?", options: [{ text: "Aligning people and communicating strategic vision", category: "social" }, { text: "Hands-on execution and building concrete deliverables", category: "practical" }] }
      ]);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setStep('quiz');
    }
  };

  const handleOptionSelect = (category) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: category };
    setAnswers(newAnswers);

    if (currentQuestionIndex < dynamicQuestions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 400);
    } else {
      setTimeout(() => calculateResults(newAnswers), 400);
    }
  };

  const calculateResults = async (finalAnswers) => {
    setStep('processing');
    
    let progress = 20;
    setProcessingProgress(progress);
    const progressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress > 95) progress = 95;
      setProcessingProgress(progress);
    }, 80);

    try {
      const counts = { analytical: 0, creative: 0, social: 0, practical: 0 };
      Object.values(finalAnswers).forEach(cat => {
        if (counts[cat] !== undefined) counts[cat]++;
      });

      const dominant = Object.keys(counts).reduce((a, b) => counts[a] >= counts[b] ? a : b, 'analytical');
      const careerPaths = await generateCareerPathData(dominant, academicStage);

      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (user?._id) {
        try {
          await axios.post(`${API_BASE_URL}/api/assessments/score/${user._id}`, {
            category: `Aptitude Assessment (${dominant})`,
            score: counts[dominant] || 1,
            total: Object.keys(finalAnswers).length || 5,
            details: { dominantTrait: dominant, careerPaths }
          });
        } catch (err) {
          console.error("Failed to save assessment score to backend:", err);
        }
      }
      
      setTimeout(() => {
        setResultCategory(careerPaths);
        setStep('results');
      }, 500);

    } catch (e) {
      clearInterval(progressInterval);
      setProcessingProgress(100);
      setResultCategory([
        { title: "Software Engineer", matchPercentage: 92, description: "You have a highly logical mind and excel at breaking down complex problems.", keyStrengths: ["Logic", "Focus", "Algorithms"] },
        { title: "Data Analyst", matchPercentage: 88, description: "You are great at analyzing data and finding hidden patterns.", keyStrengths: ["Analysis", "Patience", "Modeling"] },
        { title: "Product Manager", matchPercentage: 85, description: "You are a natural communicator and understand how to align teams.", keyStrengths: ["Leadership", "Strategy", "Execution"] }
      ]);
      setStep('results');
    }
  };

  const currentQuestion = dynamicQuestions[currentQuestionIndex];
  const progressPercent = dynamicQuestions.length ? ((currentQuestionIndex) / dynamicQuestions.length) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-12">
      
      {/* 3D Ambient Orbs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Brain className="text-brand-500" size={32} />
            AI Career Aptitude
          </h1>
          <p className="text-slate-500 font-medium mt-1">Discover your optimal career trajectory based on cognitive patterns.</p>
        </div>
      </div>

      {step === 'intro' && (
        <div className="relative rounded-2xl sm:rounded-[32px] overflow-hidden shadow-[0_8px_40px_rgb(0,0,0,0.08)] group">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000" alt="Team Brainstorming" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/60 md:to-transparent"></div>
          
          <div className="relative z-10 p-5 sm:p-10 lg:p-14 flex flex-col md:flex-row gap-6 sm:gap-10 items-center justify-between">
            <div className="flex-1 text-left w-full">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg border border-slate-100">
                 <Brain size={28} className="text-brand-500" />
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight">Unlock Your True Potential</h2>
              <p className="text-sm sm:text-lg text-slate-600 mb-6 sm:mb-8 max-w-xl leading-relaxed backdrop-blur-sm bg-white/40 p-2 rounded-xl">
                Our proprietary AI assessment analyzes your problem-solving style, communication preferences, and cognitive instincts to map you to the most lucrative and fulfilling career trajectories.
              </p>
              
              <div className="w-full max-w-md bg-white/90 backdrop-blur-xl p-5 sm:p-8 rounded-2xl sm:rounded-[24px] border border-white shadow-2xl">
                 <label className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-2">
                    <Brain size={16} className="text-brand-500" /> Current Academic Stage
                 </label>
                 <select 
                    value={academicStage}
                    onChange={(e) => setAcademicStage(e.target.value)}
                    className="w-full bg-slate-50 px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 transition-all outline-none font-bold text-slate-800 shadow-sm cursor-pointer mb-6"
                 >
                     <option value="">Select your current stage...</option>
                     <option value="Completed 10th Grade">Completed 10th Grade (Stream Selection)</option>
                     <option value="Completed 12th Grade">Completed 12th Grade (Degree Selection)</option>
                     <option value="Current Undergraduate">Current Undergraduate (Specialization / Career)</option>
                     <option value="Postgraduate / Professional">Postgraduate / Professional</option>
                 </select>
                 
                 <button 
                  onClick={handleStart}
                  className="w-full group/btn relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-slate-900 rounded-xl overflow-hidden transition-all active:scale-95 shadow-xl hover:shadow-brand-500/30 hover:bg-brand-600"
                 >
                  <span className="relative flex items-center gap-2 text-lg">
                    Start Assessment <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                 </button>
              </div>
            </div>

            <div className="hidden lg:flex flex-col gap-6">
               <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white shadow-xl w-72 transform translate-x-4 hover:-translate-x-0 transition-transform duration-500">
                 <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><CheckCircle2 size={24} /></div>
                   <span className="font-black text-slate-800 text-lg">5 Questions</span>
                 </div>
                 <p className="text-sm text-slate-500 font-medium">Quick, situational psychological profiling.</p>
               </div>
               
               <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white shadow-xl w-72 transform -translate-x-8 hover:-translate-x-0 transition-transform duration-500">
                 <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><Zap size={24} /></div>
                   <span className="font-black text-slate-800 text-lg">Instant AI Analysis</span>
                 </div>
                 <p className="text-sm text-slate-500 font-medium">Powered by advanced cognitive algorithms.</p>
               </div>
               
               <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white shadow-xl w-72 transform translate-x-4 hover:-translate-x-0 transition-transform duration-500">
                 <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-brand-100 rounded-lg text-brand-600"><Award size={24} /></div>
                   <span className="font-black text-slate-800 text-lg">Career Roadmap</span>
                 </div>
                 <p className="text-sm text-slate-500 font-medium">Get highly tailored real-world career paths.</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {step === 'generating_questions' && (
        <PremiumCard className="p-16 text-center animate-fade-in-up">
           <div className="relative w-32 h-32 mx-auto mb-8">
              <Brain size={64} className="text-brand-500 animate-pulse absolute inset-0 m-auto" />
              <div className="absolute inset-0 rounded-full border-4 border-brand-200 border-t-brand-500 animate-spin"></div>
           </div>
           <h3 className="text-2xl font-black text-slate-900 mb-2">Tailoring Assessment...</h3>
           <p className="text-slate-500 font-medium">Generating questions specifically for your {academicStage} background using Gemini AI.</p>
        </PremiumCard>
      )}

      {step === 'quiz' && dynamicQuestions.length > 0 && currentQuestion && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-between text-sm font-bold text-slate-500 mb-2">
            <span>Question {currentQuestionIndex + 1} of {dynamicQuestions.length}</span>
            <span className="text-brand-600">{Math.round(progressPercent)}% Completed</span>
          </div>
          
          <div className="h-3 w-full bg-slate-200/50 rounded-full overflow-hidden mb-8">
            <div 
              className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <PremiumCard className="p-5 sm:p-8 md:p-12">
            <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 mb-5 sm:mb-8 leading-tight">
              {currentQuestion.question}
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestionIndex] === option.category;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option.category)}
                    className={`text-left p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 flex items-center justify-between gap-3 group
                      ${isSelected 
                        ? 'border-brand-500 bg-brand-50 shadow-[0_8px_20px_rgb(0,0,0,0.06)]' 
                        : 'border-slate-100 bg-white hover:border-brand-200 hover:bg-slate-50 hover:shadow-sm'
                      }`}
                  >
                    <span className={`text-sm sm:text-lg font-semibold flex-1 ${isSelected ? 'text-brand-800' : 'text-slate-700'}`}>
                      {option.text}
                    </span>
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors
                      ${isSelected ? 'border-brand-500 bg-brand-500' : 'border-slate-300 group-hover:border-brand-300'}
                    `}>
                      {isSelected && <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white"></div>}
                    </div>
                  </button>
                )
              })}
            </div>
          </PremiumCard>
        </div>
      )}

      {step === 'processing' && (
        <PremiumCard className="p-16 text-center animate-fade-in-up">
           <div className="relative w-32 h-32 mx-auto mb-8">
              <svg className="animate-spin-slow w-full h-full text-brand-500" viewBox="0 0 100 100">
                <circle className="text-slate-100 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                <circle className="text-brand-500 stroke-current" strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray="250" strokeDashoffset={250 - (250 * processingProgress) / 100} style={{ transition: 'stroke-dashoffset 0.3s ease' }}></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                 <Brain size={32} className="text-brand-600 animate-pulse" />
              </div>
           </div>
           <h3 className="text-2xl font-black text-slate-900 mb-2">Analyzing Cognitive Profile...</h3>
           <p className="text-slate-500 font-medium">Running aptitude correlation matrix ({processingProgress}%)</p>
        </PremiumCard>
      )}

      {step === 'results' && Array.isArray(resultCategory) && (
        <div className="space-y-8 animate-fade-in-up">
          <div className="text-center mb-8">
            <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-100 text-emerald-700 font-black text-sm tracking-widest uppercase mb-4 shadow-sm">
              Analysis Complete
            </span>
            <h2 className="text-4xl font-black text-slate-900 mb-4">Your Dynamic Career Trajectories</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">Based on your cognitive profile, the Gemini AI engine has generated these 5 highly tailored career paths.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {resultCategory.map((career, idx) => (
              <PremiumCard key={idx} className="p-0 overflow-hidden relative group">
                <div className={`absolute top-0 left-0 w-2 h-full ${idx === 0 ? 'bg-gradient-to-b from-emerald-400 to-emerald-600' : 'bg-gradient-to-b from-brand-400 to-brand-600'}`}></div>
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-lg sm:text-xl shadow-inner shrink-0 ${idx === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-50 text-brand-600'}`}>
                         #{idx + 1}
                      </div>
                      <h3 className="text-lg sm:text-2xl font-black text-slate-900">{career.title}</h3>
                    </div>
                    <div className="self-start sm:self-auto flex items-center gap-2 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-100 shadow-sm">
                       <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">Match</span>
                       <span className={`text-lg sm:text-2xl font-black ${idx === 0 ? 'text-emerald-500' : 'text-brand-500'}`}>{career.matchPercentage}%</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm sm:text-lg mb-4 sm:mb-6 leading-relaxed md:ml-16">
                    {career.description}
                  </p>
                  <div className="md:ml-16">
                    <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-widest flex items-center gap-2">
                       <Zap size={16} className="text-amber-500" /> Aligned Strengths
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {career.keyStrengths.map((trait, i) => (
                         <span key={i} className="px-3 py-1.5 bg-white text-slate-700 font-bold rounded-lg text-sm border border-slate-200 shadow-sm hover:border-brand-300 hover:text-brand-700 transition-colors">
                           {trait}
                         </span>
                       ))}
                    </div>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>

          <div className="flex justify-center mt-8">
             <button 
               onClick={() => setStep('intro')}
               className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
             >
               <RefreshCcw size={18} /> Retake Assessment
             </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AptitudeAssessment;
