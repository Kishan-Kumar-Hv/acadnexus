import React, { useState } from 'react';
import { Target, CheckCircle, Zap, Crosshair, ChevronDown, Rocket, Award, MonitorCheck } from 'lucide-react';

const About = () => {
  const [activeAccordion, setActiveAccordion] = useState(0);

  const modules = [
    {
      title: "Dynamically Generated Study Roadmaps",
      icon: <MonitorCheck size={24} />,
      desc: "The system generates a personalized study schedule based entirely on subjects, required study hours, and exam timelines, calculating the mathematically optimal path.",
    },
    {
      title: "Automated Rescheduling Engine",
      icon: <Zap size={24} />,
      desc: "Miss a day? The engine automatically calculates adaptive rescheduling and issues proactive revision mapping so consistency is naturally preserved.",
    },
    {
      title: "Cognitive Aptitude Evaluation",
      icon: <Target size={24} />,
      desc: "A built-in assessment to heavily evaluate students' logical reasoning, skills, and lateral interests, eliminating bias from career selection.",
    },
    {
      title: "Industry-Synchronized Pathing",
      icon: <Award size={24} />,
      desc: "Recommend suitable career paths by directly contrasting logical performance data against current trending industry demands and labor trajectories.",
    }
  ];

  return (
    <div className="w-full bg-slate-50 relative overflow-hidden py-24 lg:py-32">
      
      {/* Background decorations */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-brand-200/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-200 text-brand-600 mb-6 shadow-sm">
             <Rocket size={32} />
           </div>
           <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">The Engine Behind AcadNexus</h2>
           <p className="text-xl text-slate-600 leading-relaxed">
             AcadNexus Future AI is an advanced algorithmic web platform engineered to surgically manage your academics while simultaneously optimizing your career trajectory.
           </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Interactive Interactive Accordion */}
          <div className="space-y-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <h3 className="text-2xl font-bold text-slate-900 mb-6 px-2">Core Technical Objectives</h3>
            
            {modules.map((mod, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${activeAccordion === idx ? 'border-brand-300 shadow-lg shadow-brand-500/10' : 'border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'}`}
                onClick={() => setActiveAccordion(idx)}
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${activeAccordion === idx ? 'bg-brand-50 text-brand-600' : 'bg-slate-50 text-slate-500'}`}>
                      {mod.icon}
                    </div>
                    <h4 className={`text-lg font-bold transition-colors ${activeAccordion === idx ? 'text-brand-700' : 'text-slate-900'}`}>{mod.title}</h4>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 ${activeAccordion === idx ? 'rotate-180' : ''}`} />
                </div>
                
                <div className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${activeAccordion === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-600 leading-relaxed pl-16 border-l w-full pt-2">
                    {mod.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Interactive UI Widget Side */}
          <div className="relative animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <div className="w-full h-full min-h-[500px] bg-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/30 blur-[80px] rounded-full mix-blend-screen"></div>

              <div className="relative z-10 flex flex-col h-full">
                 <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                    <span className="text-white font-bold text-xl flex items-center gap-2"><Crosshair className="text-brand-400" /> Active System Status</span>
                    <span className="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-400/10 px-3 py-1.5 rounded-full"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> Processing</span>
                 </div>

                 {/* Simulated Live Terminal Data */}
                 <div className="flex-1 space-y-6 font-mono text-sm">
                   {[
                     {log: "Initiating aptitude matrix cross-reference...", time: "0.012s", color: "text-slate-400"},
                     {log: "Logical reasoning index: SCORING_HIGH", time: "0.084s", color: "text-blue-400"},
                     {log: "Identifying industry trajectory clusters...", time: "0.150s", color: "text-slate-400"},
                     {log: "MATCH FOUND: Software Architecture & Data Analysis", time: "0.201s", color: "text-emerald-400 font-bold"},
                     {log: "Re-calculating study parameters based on variance...", time: "1.002s", color: "text-slate-400"},
                     {log: "Schedule optimized. Efficiency +42%", time: "1.045s", color: "text-brand-400"},
                   ].map((line, i) => (
                     <div key={i} className={`flex items-start justify-between border-l-2 pl-4 py-1 border-white/10 ${line.color} opacity-0 animate-fade-in`} style={{animationDelay: `${i * 0.5}s`, animationFillMode: 'forwards'}}>
                       <span className="flex-1">{'>'} {line.log}</span>
                       <span className="opacity-50 flex-shrink-0 text-xs ml-4">+{line.time}</span>
                     </div>
                   ))}
                 </div>
                 
                 <div className="mt-12 pt-6 border-t border-white/10 flex gap-4">
                    <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="text-white/50 text-xs mb-1">Total Processed</div>
                      <div className="text-white font-bold text-2xl">4.2M</div>
                    </div>
                    <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="text-brand-400/50 text-xs mb-1">Network Accuracy</div>
                      <div className="text-brand-400 font-bold text-2xl">99.8%</div>
                    </div>
                 </div>

              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
