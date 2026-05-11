import React, { useState } from 'react';
import { Layers, ArrowRight, ArrowLeft, RotateCcw, BrainCircuit, Play, FileText } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyD5aHDyevRFdNbj2Gf1x_-7Qd4-fYWCYZM");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const PremiumCard = ({ children, className = "" }) => (
  <div className={`relative bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/80 shadow-[0_8px_40px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-500 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const Flashcards = () => {
  const [step, setStep] = useState('config'); // config, generating, study
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleGenerate = async () => {
    if (!topic.trim()) return alert("Please enter a topic or paste notes.");
    setStep('generating');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress > 90) progress = 90;
      setGenerationProgress(progress);
    }, 300);

    const prompt = `You are an expert educator creating flashcards for active recall and spaced repetition.
    Topic/Notes provided by student: "${topic}"
    
    Extract the most important 5-10 core concepts, definitions, or formulas from this topic.
    Return them STRICTLY as a valid JSON array of objects without any markdown.
    Structure:
    [
      {
        "front": "What is Mitochondria? (or a short term)",
        "back": "The powerhouse of the cell, responsible for generating most of the cell's supply of ATP."
      }
    ]
    `;

    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      let parsedCards = JSON.parse(text);
      if (!Array.isArray(parsedCards)) {
        if (parsedCards && typeof parsedCards === 'object' && Array.isArray(Object.values(parsedCards)[0])) {
          parsedCards = Object.values(parsedCards)[0];
        } else {
          throw new Error("Invalid JSON format from AI");
        }
      }
      clearInterval(interval);
      setGenerationProgress(100);
      
      setTimeout(() => {
        setCards(parsedCards);
        setCurrentIndex(0);
        setIsFlipped(false);
        setStep('study');
      }, 600);

    } catch (e) {
      console.error(e);
      clearInterval(interval);
      setGenerationProgress(100);
      setCards([
        { front: "Concept 1", back: "Definition of concept 1" },
        { front: "Concept 2", back: "Definition of concept 2" }
      ]);
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

  return (
    <div className="relative min-h-[calc(100vh-5rem)] max-w-4xl mx-auto space-y-10 animate-fade-in-up pb-12 pt-4 z-10">
      
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
      </div>

      <div className="relative rounded-[32px] overflow-hidden shadow-[0_8px_40px_rgb(0,0,0,0.08)] mb-10 group">
         <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000" alt="Flashcards and Studying" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" />
         <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40 md:to-transparent"></div>
         
         <div className="relative z-10 p-10 lg:p-14 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-emerald-700 text-sm font-bold mb-6 shadow-sm border border-emerald-100">
              <Layers className="text-emerald-500" size={16} /> Spaced Repetition Engine
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              AI Flashcard <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Generator</span>
            </h1>
         </div>
      </div>

      {step === 'config' && (
        <PremiumCard className="p-8 md:p-12 max-w-2xl mx-auto">
          <label className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
            <FileText size={18} className="text-emerald-500" /> Topic or Raw Notes
          </label>
          <textarea 
            rows={6}
            placeholder="E.g. Paste your history notes, or simply type 'Newton's Laws of Motion'..." 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-slate-50 px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all outline-none font-medium text-slate-700 placeholder-slate-400 resize-none leading-relaxed mb-8"
          />
          <button 
             onClick={handleGenerate}
             className="w-full py-5 rounded-2xl font-black text-lg text-white bg-slate-900 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-lg hover:-translate-y-1"
          >
             Generate Flashcards <Play size={20} />
          </button>
        </PremiumCard>
      )}

      {step === 'generating' && (
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
          <BrainCircuit size={48} className="text-emerald-500 animate-pulse mb-6" />
          <h3 className="text-2xl font-black text-slate-800">Synthesizing Core Concepts...</h3>
          <p className="text-slate-500 font-medium">Extracting flashcards ({generationProgress}%)</p>
        </div>
      )}

      {step === 'study' && cards.length > 0 && (
        <div className="max-w-2xl mx-auto flex flex-col items-center animate-fade-in-up">
           <div className="flex items-center justify-between w-full mb-6 px-4">
             <button onClick={() => setStep('config')} className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">
               <RotateCcw size={14} /> New Deck
             </button>
             <span className="font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
               Card {currentIndex + 1} of {cards.length}
             </span>
           </div>

           {/* Flashcard 3D Container */}
           <div className="w-full aspect-[4/3] perspective-1000 mb-8 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                 {/* Front */}
                 <div className="absolute inset-0 backface-hidden bg-white rounded-3xl border-2 border-slate-100 shadow-xl flex items-center justify-center p-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">
                      {cards[currentIndex].front}
                    </h2>
                    <div className="absolute bottom-6 text-slate-400 text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                       Tap to Flip
                    </div>
                 </div>
                 {/* Back */}
                 <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 rounded-3xl border-2 border-slate-800 shadow-xl flex items-center justify-center p-8 text-center">
                    <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed">
                      {cards[currentIndex].back}
                    </p>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <button 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
                className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:scale-105 transition-all"
              >
                 <ArrowLeft size={24} />
              </button>
              <button 
                onClick={handleNext} 
                disabled={currentIndex === cards.length - 1}
                className="w-14 h-14 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/30 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 hover:scale-105 transition-all"
              >
                 <ArrowRight size={24} />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
