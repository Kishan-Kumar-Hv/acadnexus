import React, { useState, useEffect } from 'react';
import { Layers, ArrowRight, ArrowLeft, RotateCcw, BrainCircuit, Play, FileText, Sparkles, Zap, Shuffle, CheckCircle, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { generateFlashcardsData } from '../config/gemini';

const PRESET_DECKS = [
  'Calculus & Differential Equations',
  'Data Structures & Algorithms',
  'Newtonian Physics & Mechanics',
  'Cellular Biology & Photosynthesis',
  'Organic Chemistry & Reaction Mechanisms'
];

const PremiumCard = ({ children, className = "" }) => (
  <div className={`relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/80 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const Flashcards = () => {
  const [step, setStep] = useState('config'); // config, generating, study
  const [topic, setTopic] = useState('Calculus & Differential Equations');
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [masteredCards, setMasteredCards] = useState(new Set());

  const handleGenerate = async (targetDeck) => {
    const targetTopic = (typeof targetDeck === 'string' ? targetDeck : topic || '').trim() || 'Calculus & Differential Equations';
    if (typeof targetDeck === 'string') setTopic(targetDeck);

    setStep('generating');
    setGenerationProgress(30);
    setMasteredCards(new Set());
    
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) return 90;
        return prev + 30;
      });
    }, 200);

    try {
      const generatedCards = await generateFlashcardsData(targetTopic);
      clearInterval(interval);
      setGenerationProgress(100);
      
      setTimeout(() => {
        setCards(Array.isArray(generatedCards) && generatedCards.length > 0 ? generatedCards : []);
        setCurrentIndex(0);
        setIsFlipped(false);
        setStep('study');
      }, 350);
    } catch (e) {
      console.error("Flashcard generation error:", e);
      clearInterval(interval);
      setGenerationProgress(100);
      const fallbackCards = await generateFlashcardsData(targetTopic);
      setCards(fallbackCards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setStep('study');
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) setCurrentIndex(prev => prev + 1);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    }, 150);
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const toggleMastered = (idx) => {
    const next = new Set(masteredCards);
    if (next.has(idx)) {
      next.delete(idx);
    } else {
      next.add(idx);
    }
    setMasteredCards(next);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (step !== 'study') return;
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.key === 'ArrowRight' && currentIndex < cards.length - 1) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, currentIndex, cards.length]);

  return (
    <div className="relative min-h-[calc(100vh-5rem)] max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-12 pt-4 z-10">
      
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-emerald-400/15 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-teal-400/15 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-[32px] overflow-hidden shadow-[0_8px_40px_rgb(0,0,0,0.08)] mb-8 group">
         <img 
           src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000" 
           alt="Flashcards and Studying" 
           className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" 
         />
         <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900/40"></div>
         
         <div className="relative z-10 p-8 lg:p-12 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-emerald-700 dark:text-emerald-300 text-sm font-bold mb-4 shadow-sm border border-emerald-100 dark:border-emerald-900/40">
              <Layers className="text-emerald-500" size={16} /> Spaced Repetition & Active Recall Engine
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-2">
              AI Flashcard <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Generator</span>
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium">
              Transform syllabus notes or target topics into 3D active recall decks for fast exam mastery.
            </p>
         </div>
      </div>

      {step === 'config' && (
        <PremiumCard className="p-8 md:p-10 max-w-2xl mx-auto space-y-6">
          <div>
            <label className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-2.5 flex items-center gap-2">
              <FileText size={18} className="text-emerald-500" /> Topic or Chapter Notes
            </label>
            <textarea 
              rows={4}
              placeholder="E.g. Type 'Newton's Laws of Motion' or paste raw subject notes..." 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all outline-none font-medium text-slate-800 dark:text-white placeholder-slate-400 resize-none leading-relaxed"
            />
          </div>

          {/* Quick Deck Presets */}
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
              Or pick a popular topic deck:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_DECKS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleGenerate(preset)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 font-medium transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <button 
             onClick={() => handleGenerate()}
             className="w-full py-4 rounded-xl font-black text-base text-white bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-2.5 shadow-lg active:scale-98"
          >
             Generate Flashcard Deck <Play size={18} />
          </button>
        </PremiumCard>
      )}

      {step === 'generating' && (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin mb-6 flex items-center justify-center">
            <BrainCircuit size={28} className="text-emerald-500 animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-1">Synthesizing Core Concepts...</h3>
          <p className="text-slate-500 font-medium text-sm">Generating active recall questions ({generationProgress}%)</p>
        </div>
      )}

      {step === 'study' && cards.length > 0 && (
        <div className="max-w-2xl mx-auto flex flex-col items-center animate-fade-in-up space-y-6">
           
           {/* Deck Controls Header */}
           <div className="flex items-center justify-between w-full px-2">
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => setStep('config')} 
                 className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
               >
                 <RotateCcw size={14} /> New Topic
               </button>
               <button 
                 onClick={handleShuffle} 
                 className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
               >
                 <Shuffle size={14} /> Shuffle
               </button>
             </div>

             <div className="flex items-center gap-2">
               {masteredCards.size > 0 && (
                 <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 px-2.5 py-1 rounded-lg">
                   ⭐ {masteredCards.size}/{cards.length} Mastered
                 </span>
               )}
               <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 px-3 py-1 rounded-lg">
                 Card {currentIndex + 1} of {cards.length}
               </span>
             </div>
           </div>

           {/* Progress Bar */}
           <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
             <div 
               className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300"
               style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
             ></div>
           </div>

           {/* Flashcard 3D Container */}
           <div 
             className="w-full aspect-[16/10] md:aspect-[16/9] perspective-1000 cursor-pointer select-none" 
             onClick={() => setIsFlipped(!isFlipped)}
           >
              <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                 
                 {/* Front Side */}
                 <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200/80 dark:border-slate-700 shadow-xl flex flex-col justify-between p-8 md:p-10 text-center">
                    <div className="flex items-center justify-between w-full">
                       <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md">
                         Question / Concept
                       </span>
                       <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                         <HelpCircle size={14} /> Front
                       </span>
                    </div>

                    <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-snug my-auto px-2">
                      {cards[currentIndex]?.front}
                    </h2>

                    <div className="text-slate-400 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5">
                       <Eye size={14} className="text-emerald-500" /> Tap or press space to flip
                    </div>
                 </div>

                 {/* Back Side */}
                 <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 dark:bg-slate-950 rounded-3xl border-2 border-slate-700 shadow-xl flex flex-col justify-between p-8 md:p-10 text-center">
                    <div className="flex items-center justify-between w-full">
                       <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/40">
                         Answer & Explanation
                       </span>
                       <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                         <CheckCircle size={14} className="text-emerald-400" /> Back
                       </span>
                    </div>

                    <p className="text-lg md:text-xl lg:text-2xl font-medium text-slate-100 leading-relaxed my-auto px-2">
                      {cards[currentIndex]?.back}
                    </p>

                    <div className="text-slate-400 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5">
                       <EyeOff size={14} /> Tap to flip back
                    </div>
                 </div>

              </div>
           </div>

           {/* Navigation and Mastery Actions */}
           <div className="flex items-center justify-between w-full px-4 pt-2">
              <button 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-200 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                 <ArrowLeft size={16} /> Prev
              </button>

              <button
                onClick={() => toggleMastered(currentIndex)}
                className={`px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  masteredCards.has(currentIndex)
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                }`}
              >
                {masteredCards.has(currentIndex) ? '✓ Mastered' : 'Mark as Mastered'}
              </button>

              <button 
                onClick={handleNext} 
                disabled={currentIndex === cards.length - 1}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                 Next <ArrowRight size={16} />
              </button>
           </div>

           {/* Keyboard Hint */}
           <p className="text-xs text-slate-400 dark:text-slate-500 text-center font-medium">
             Pro tip: Use <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-[10px]">Space</kbd> to flip, and <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-[10px]">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-[10px]">→</kbd> to navigate.
           </p>

        </div>
      )}
    </div>
  );
};

export default Flashcards;

