import React, { useState, useEffect } from 'react';
import { Brain, BookOpen, Target, Puzzle, CheckCircle2, ChevronRight, Calculator, AlignLeft, Lightbulb, ArrowLeft, Play, RefreshCcw, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { generatePrepGuideData, generatePrepQuizData } from '../config/gemini';
import GlassCard from './ui/GlassCard';

const PremiumCard = ({ children, className = "" }) => (
  <GlassCard className={`relative rounded-2xl border border-white/80 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300 ${className}`}>
    {children}
  </GlassCard>
);

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const AptitudePreparation = ({ user }) => {
  const [step, setStep] = useState('home'); // home, loading, learn, quiz, quiz_result
  const [activeCategory, setActiveCategory] = useState(null);
  const [learningContent, setLearningContent] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes

  const saveQuizScore = async (finalScore) => {
    if (!user?._id) return;
    try {
      await axios.post(`${API_BASE_URL}/api/assessments/score/${user._id}`, {
        category: activeCategory?.title || 'Aptitude Practice Quiz',
        score: finalScore,
        total: quizQuestions.length,
        details: { categoryId: activeCategory?.id }
      });
    } catch (err) {
      console.error("Failed to save quiz score to backend:", err);
    }
  };

  const categories = [
    {
      id: 'quant',
      title: 'Quantitative Aptitude',
      description: 'Master numerical calculations, algebra, geometry, and data interpretation.',
      icon: Calculator,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      topics: ['Number Systems', 'Percentages & Ratios', 'Time & Work', 'Data Interpretation']
    },
    {
      id: 'logical',
      title: 'Logical Reasoning',
      description: 'Enhance your pattern recognition, deductive logic, and critical thinking.',
      icon: Puzzle,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      topics: ['Blood Relations', 'Syllogisms', 'Seating Arrangements', 'Puzzles']
    },
    {
      id: 'verbal',
      title: 'Verbal Ability',
      description: 'Improve reading comprehension, grammar, vocabulary, and verbal logic.',
      icon: AlignLeft,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      topics: ['Reading Comprehension', 'Sentence Correction', 'Vocabulary & Idioms', 'Para Jumbles']
    },
    {
      id: 'abstract',
      title: 'Abstract Reasoning',
      description: 'Develop the ability to identify rules and patterns in visual information.',
      icon: Lightbulb,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      topics: ['Pattern Matrices', 'Spatial Reasoning', 'Sequence Completion', 'Rule Deduction']
    }
  ];

  useEffect(() => {
    let timer;
    if (step === 'quiz' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && step === 'quiz') {
      setStep('quiz_result');
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && step === 'quiz') {
        alert("Warning: Tab switching is strictly prohibited during the aptitude test! Your quiz has been auto-submitted.");
        setStep('quiz_result');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [step]);

  const handleLearn = async (category) => {
    setActiveCategory(category);
    setStep('loading');

    try {
      const guide = await generatePrepGuideData(category);
      setLearningContent(guide);
      setTimeout(() => setStep('learn'), 300);
    } catch (e) {
      console.error(e);
      setLearningContent(category.topics.map(t => ({
        subheading: t,
        content: `Comprehensive revision notes and shortcuts for ${t}.`
      })));
      setStep('learn');
    }
  };

  const handleQuiz = async (category) => {
    setActiveCategory(category);
    setStep('loading');

    try {
      const questions = await generatePrepQuizData(category);
      setQuizQuestions(questions.map(q => ({
        question: q.question,
        options: q.options,
        answerIndex: q.correctAnswerIndex ?? 0,
        explanation: q.explanation
      })));
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setScore(0);
      setTimeLeft(1200);
      setTimeout(() => setStep('quiz'), 300);
    } catch (e) {
      console.error(e);
      setQuizQuestions([
        {
          question: "If 12 men complete a project in 20 days, how many men can complete it in 15 days?",
          options: ["14", "16", "18", "20"],
          answerIndex: 1,
          explanation: "Man-days = 12 * 20 = 240. Required men = 240 / 15 = 16 men."
        }
      ]);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setScore(0);
      setTimeLeft(1200);
      setStep('quiz');
    }
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    
    let newScore = score;
    if (selectedAnswer === quizQuestions[currentQuestionIndex].answerIndex) {
      newScore = score + 1;
      setScore(newScore);
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      saveQuizScore(newScore);
      setStep('quiz_result');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] max-w-6xl mx-auto space-y-10 animate-fade-in-up pb-12 pt-4 z-10">
      
      {/* 3D Ambient Orbs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
        <div className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {step === 'home' && (
        <div className="animate-fade-in-up">
          <div className="relative rounded-[32px] overflow-hidden shadow-[0_8px_40px_rgb(0,0,0,0.08)] mb-12 group">
             <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=2000" alt="Preparation Background" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" />
             <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40 md:to-transparent"></div>
             
             <div className="relative z-10 p-10 lg:p-14 max-w-3xl text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-blue-600 text-sm font-bold mb-6 shadow-sm border border-blue-100">
                  <Brain size={16} /> Aptitude Training Center
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                  Aptitude <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Preparation</span>
                </h1>
                <p className="text-lg text-slate-600 font-medium leading-relaxed backdrop-blur-sm bg-white/40 p-3 rounded-xl max-w-xl">
                  Comprehensive learning modules covering all forms of aptitude testing. Master the fundamentals and practice with strict timed AI assessments.
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <PremiumCard key={category.id} className="p-8 group flex flex-col h-full hover:-translate-y-2">
                   <div className="flex items-start gap-5 mb-6">
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500 ${category.bg} ${category.color}`}>
                       <Icon size={32} />
                     </div>
                     <div>
                       <h2 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{category.title}</h2>
                       <p className="text-slate-500 font-medium leading-relaxed dark:text-slate-300">{category.description}</p>
                     </div>
                   </div>

                   <div className="flex-1 mb-8">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Core Modules</h4>
                     <div className="grid grid-cols-2 gap-3">
                       {category.topics.map((topic, idx) => (
                         <div key={idx} className={`flex items-center gap-2 text-sm font-bold text-slate-700 bg-white px-3 py-2 rounded-lg border ${category.border} shadow-sm`}>
                           <CheckCircle2 size={14} className={category.color} />
                           <span className="truncate">{topic}</span>
                         </div>
                       ))}
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4 mt-auto">
                     <button
                        onClick={() => handleLearn(category)}
                        className="btn-primary"
                      >
                        <BookOpen size={18} /> Learn Theory
                      </button>
                      <button
                        onClick={() => handleQuiz(category)}
                        className="btn-secondary"
                      >
                        <Target size={18} /> Practice AI Quiz
                      </button>
                   </div>
                </PremiumCard>
              );
            })}
          </div>
        </div>
      )}

      {step === 'loading' && (
        <div className="flex flex-col items-center justify-center py-32 animate-fade-in-up">
           <div className="relative w-32 h-32 flex items-center justify-center mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin"></div>
              <Brain size={48} className="text-blue-500 animate-pulse" />
           </div>
           <h3 className="text-3xl font-black text-slate-800 mb-2">Generating AI Content...</h3>
           <p className="text-slate-500 font-medium max-w-md text-center">Creating perfectly tailored materials for {activeCategory?.title}.</p>
        </div>
      )}

      {step === 'learn' && activeCategory && (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <button 
            onClick={() => setStep('home')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-6 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Categories
          </button>

          <PremiumCard className="p-8 md:p-12 border-t-8" style={{ borderTopColor: 'currentColor' }}>
             <div className={`${activeCategory.color} mb-8`}>
               <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${activeCategory.bg}`}>
                  <activeCategory.icon size={32} />
               </div>
               <h1 className="text-4xl font-black text-slate-900 mb-2">{activeCategory.title}</h1>
               <p className="text-lg text-slate-500 font-medium">AI-Generated Theory & Strategies</p>
             </div>

             <div className="space-y-8">
               {learningContent.map((section, idx) => (
                 <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <CheckCircle2 className={activeCategory.color} size={20} />
                       {section.subheading}
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                      {section.content}
                    </p>
                 </div>
               ))}
             </div>

             <div className="mt-10 flex justify-center">
               <button
                  onClick={() => handleQuiz(activeCategory)}
                  className="btn-secondary px-8 py-4 text-lg"
                >
                  Ready? Take the Timed Quiz <Play size={20} />
                </button>
             </div>
          </PremiumCard>
        </div>
      )}

      {step === 'quiz' && activeCategory && quizQuestions.length > 0 && (
        <div className="max-w-3xl mx-auto animate-fade-in-up space-y-6">
           
           {/* Anti-cheat banner */}
           <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold shadow-sm">
             <AlertTriangle size={20} />
             <p className="text-sm md:text-base">Proctored Assessment: Do not switch tabs. Switching tabs will instantly auto-submit your quiz.</p>
           </div>

           <PremiumCard className="p-10">
             <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-800">{activeCategory.title} Test</h2>
                  <p className="text-slate-500 font-medium mt-1">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
                </div>
                <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-sm border border-slate-100 ${timeLeft < 120 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-900 text-white'}`}>
                   <Clock size={24} />
                   <span className="text-2xl font-black tracking-widest">{formatTime(timeLeft)}</span>
                </div>
             </div>

             <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                   <h3 className="text-xl font-bold text-slate-900 mb-6 leading-relaxed">
                     {quizQuestions[currentQuestionIndex].question}
                   </h3>
                   
                   <div className="space-y-3">
                      {quizQuestions[currentQuestionIndex].options.map((opt, i) => (
                        <button 
                          key={i} 
                          onClick={() => setSelectedAnswer(i)}
                          className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all font-semibold flex items-start gap-3
                            ${selectedAnswer === i 
                              ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                              : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400'
                            }
                          `}
                        >
                           <span className={`inline-block shrink-0 w-6 h-6 rounded-full border-2 text-center text-sm leading-5 shadow-sm transition-colors
                              ${selectedAnswer === i ? 'bg-white text-blue-600 border-transparent' : 'border-slate-300 text-slate-500'}
                           `}>
                             {String.fromCharCode(65+i)}
                           </span> 
                           <span className="flex-1 mt-0.5">{opt}</span>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="flex justify-between items-center">
                   <button
                      onClick={() => setStep('home')}
                      className="btn-tertiary"
                    >
                      Forfeit Quiz
                    </button>
                    <button
                     onClick={submitAnswer} 
                     disabled={selectedAnswer === null}
                     className={`btn-primary ${selectedAnswer !== null ? '' : 'opacity-50 cursor-not-allowed'}`}
                    >
                      {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ChevronRight size={20} />
                    </button>
                </div>
             </div>
           </PremiumCard>
        </div>
      )}

      {step === 'quiz_result' && (
        <PremiumCard className="max-w-2xl mx-auto p-12 text-center animate-fade-in-up">
           <div className="w-32 h-32 mx-auto rounded-full bg-slate-900 text-white flex items-center justify-center mb-8 shadow-2xl relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
              <span className="text-5xl font-black relative z-10">{score}</span>
              <span className="text-xl font-bold text-slate-400 absolute bottom-4 right-4 relative z-10">/{quizQuestions.length}</span>
           </div>
           
           <h2 className="text-4xl font-black text-slate-900 mb-4">Quiz Completed!</h2>
           <p className="text-lg text-slate-500 font-medium mb-10">
             You scored a {Math.round((score / quizQuestions.length) * 100)}% on the {activeCategory?.title} assessment.
           </p>

           <div className="flex justify-center gap-4">
             <button 
               onClick={() => setStep('home')}
               className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
             >
               Back to Home
             </button>
             <button 
               onClick={() => handleQuiz(activeCategory)}
               className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:-translate-y-1 flex items-center gap-2"
             >
               <RefreshCcw size={20} /> Generate New Quiz
             </button>
           </div>
        </PremiumCard>
      )}

    </div>
  );
};

export default AptitudePreparation;
