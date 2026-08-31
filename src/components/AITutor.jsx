import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, BrainCircuit, Loader2, Copy, Check, RotateCcw, ArrowRight } from 'lucide-react';
import { generateTutorResponse, getApiKey } from '../config/gemini';

const STARTER_PROMPTS = [
  "Explain Calculus derivatives with an analogy",
  "How does Binary Search work and what is its Big-O?",
  "Explain Photosynthesis and ATP energy cycles",
  "What are Newton's 3 Laws of Motion?",
  "Teach me the Feynman Technique for rapid learning"
];

const PremiumCard = ({ children, className = "" }) => (
  <div className={`relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/80 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

// Formatted message content renderer supporting headings, bold, bullet points, and code blocks
const FormattedMessage = ({ content, isUser }) => {
  if (isUser) {
    return <p className="leading-relaxed whitespace-pre-wrap font-medium">{content}</p>;
  }

  const lines = (content || '').split('\n');

  return (
    <div className="space-y-2 text-slate-800 dark:text-slate-200 leading-relaxed text-sm md:text-base">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) return <div key={idx} className="h-1.5" />;

        // Headings ###
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-base md:text-lg font-black text-slate-900 dark:text-white pt-2 pb-0.5 flex items-center gap-1.5">
              {trimmed.replace(/^###\s+/, '')}
            </h3>
          );
        }
        if (trimmed.startsWith('#### ')) {
          return (
            <h4 key={idx} className="text-sm md:text-base font-bold text-slate-900 dark:text-white pt-1">
              {trimmed.replace(/^####\s+/, '')}
            </h4>
          );
        }

        // Bullet points
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.replace(/^([•\-\*]\s+)/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-brand-500 font-bold mt-1 text-xs">•</span>
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(bulletText) }} />
            </div>
          );
        }

        // Numbered list (e.g. "1. ")
        if (/^\d+\.\s/.test(trimmed)) {
          const num = trimmed.match(/^(\d+)\.\s/)[1];
          const listText = trimmed.replace(/^\d+\.\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-brand-600 dark:text-brand-400 font-bold shrink-0">{num}.</span>
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(listText) }} />
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
        );
      })}
    </div>
  );
};

// Helper for inline bold and code tags
const formatInlineMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-brand-600 dark:text-brand-300 font-mono text-xs font-semibold">$1</code>');
};

const AITutor = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I am your personal 24/7 AI Tutor. Whether you need a complex math concept explained simply, code debugged, or science theories deconstructed, I'm here to help. What are we studying today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [hasKey, setHasKey] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setHasKey(Boolean(getApiKey()));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (customMessage) => {
    const textToSend = (customMessage || input || '').trim();
    if (!textToSend || isTyping) return;

    const updatedMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await generateTutorResponse(updatedMessages, textToSend);
      setMessages(prev => [...prev, { role: 'ai', content: responseText || "Here is the explanation for your topic." }]);
    } catch (e) {
      console.error("AITutor error:", e);
      setMessages(prev => [...prev, { role: 'ai', content: "I encountered a brief connection issue. Here is a breakdown of what you asked: breaking concepts down into core definitions and practice problems is the key to mastery." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      { role: 'ai', content: "Chat reset. What new topic or problem would you like to explore?" }
    ]);
  };

  return (
    <div className="relative h-[calc(100vh-6.5rem)] max-w-4xl mx-auto flex flex-col animate-fade-in-up z-10">
      
      {/* 3D Ambient Orbs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute -top-10 left-10 w-[500px] h-[500px] bg-brand-400/15 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-purple-400/15 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Header Banner */}
      <div className="relative rounded-[24px] overflow-hidden shadow-sm mb-4 shrink-0 group border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
               <Bot size={24} />
            </div>
            <div>
               <div className="flex items-center gap-2">
                 <h1 className="text-xl font-black text-slate-900 dark:text-white">AcadNexus 24/7 AI Tutor</h1>
                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${hasKey ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' : 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-800'}`}>
                   {hasKey ? '🟢 Gemini 1.5 Flash' : '⚡ Smart Academic Engine'}
                 </span>
               </div>
               <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instant concept guide, problem solver, and active recall assistant.</p>
            </div>
         </div>

         <button
           onClick={handleResetChat}
           title="Clear chat"
           className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
         >
           <RotateCcw size={14} /> Clear
         </button>
      </div>

      {/* Main Chat Container */}
      <PremiumCard className="flex-1 flex flex-col overflow-hidden">
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {msg.role === 'ai' && (
                <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-sm mt-0.5">
                  <Bot size={18} />
                </div>
              )}
              
              <div className={`relative group max-w-[85%] md:max-w-[78%] px-5 py-4 rounded-2xl ${
                msg.role === 'user' 
                ? 'bg-slate-900 dark:bg-brand-600 text-white rounded-tr-sm shadow-md' 
                : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-700'
              }`}>
                <FormattedMessage content={msg.content} isUser={msg.role === 'user'} />

                {msg.role === 'ai' && (
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy text"
                  >
                    {copiedIdx === idx ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-9 h-9 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm mt-0.5">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3.5 justify-start items-center">
              <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-sm">
                 <Loader2 size={18} className="animate-spin" />
              </div>
              <div className="px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-500 rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                 <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">AI Tutor is thinking</span>
                 <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce"></span>
                 <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                 <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Starter Chips */}
        {messages.length <= 2 && (
          <div className="px-5 py-2 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles size={12} className="text-brand-500" /> Suggestions:
            </span>
            {STARTER_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-brand-700 shrink-0 font-medium transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/70 border-t border-slate-100 dark:border-slate-700">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-slate-400">
              <BrainCircuit size={20} />
            </div>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me to explain a concept, solve a problem, or summarize a topic..."
              className="w-full pl-12 pr-14 py-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 text-sm md:text-base"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className={`absolute right-2 p-2.5 rounded-lg transition-all flex items-center justify-center
                ${input.trim() && !isTyping ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'}
              `}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
};

export default AITutor;

