import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, BrainCircuit, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyD5aHDyevRFdNbj2Gf1x_-7Qd4-fYWCYZM");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const PremiumCard = ({ children, className = "" }) => (
  <div className={`relative bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/80 shadow-[0_8px_40px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-500 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const AITutor = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I am your personal AI Tutor. Whether you need a complex math concept explained simply, or want to discuss history, I'm here to help. What are we studying today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const chatHistory = messages.map(msg => `${msg.role === 'ai' ? 'Tutor' : 'Student'}: ${msg.content}`).join('\n');
      
      const prompt = `You are a highly intelligent, encouraging, and patient AI Tutor. 
      You explain complex topics simply, use analogies, and help students understand rather than just giving them the answer.
      
      Chat History:
      ${chatHistory}
      Student: ${userMessage}
      
      Tutor Response (be conversational, clear, and helpful. Avoid markdown wrap if possible, but keep it structured):`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      setMessages(prev => [...prev, { role: 'ai', content: responseText }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I'm having trouble connecting right now. Please try asking again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="relative h-[calc(100vh-8rem)] max-w-4xl mx-auto flex flex-col animate-fade-in-up z-10">
      
      {/* 3D Ambient Orbs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute -top-10 left-10 w-[500px] h-[500px] bg-brand-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative rounded-[32px] overflow-hidden shadow-[0_8px_40px_rgb(0,0,0,0.08)] mb-6 shrink-0 group">
         <img src="https://images.unsplash.com/photo-1571260899304-425dea57a99c?auto=format&fit=crop&q=80&w=2000" alt="Personal Tutor" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" />
         <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40 md:to-transparent"></div>
         
         <div className="relative z-10 p-8 lg:p-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-brand-700 text-sm font-bold mb-4 shadow-sm border border-brand-100">
              <Sparkles className="text-brand-500" size={16} /> 24/7 AI Tutor
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Doubt Resolver & <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">Concept Guide</span>
            </h1>
         </div>
      </div>

      <PremiumCard className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {msg.role === 'ai' && (
                <div className="w-10 h-10 shrink-0 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shadow-sm border border-brand-200">
                  <Bot size={20} />
                </div>
              )}
              
              <div className={`max-w-[75%] px-6 py-4 rounded-2xl ${
                msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-sm shadow-lg' 
                : 'bg-white text-slate-700 rounded-tl-sm shadow-md border border-slate-100'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.role === 'user' && (
                <div className="w-10 h-10 shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shadow-sm border border-slate-300">
                  <User size={20} />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4 justify-start">
              <div className="w-10 h-10 shrink-0 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shadow-sm border border-brand-200">
                 <Loader2 size={20} className="animate-spin" />
              </div>
              <div className="px-6 py-4 rounded-2xl bg-white text-slate-500 rounded-tl-sm shadow-md border border-slate-100 flex items-center gap-2">
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
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
              className="w-full pl-12 pr-16 py-4 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm font-medium text-slate-700"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`absolute right-2 p-2.5 rounded-lg transition-all flex items-center justify-center
                ${input.trim() && !isTyping ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
              `}
            >
              <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
            </button>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
};

export default AITutor;
