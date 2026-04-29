import React from 'react';
import { ArrowRight, Sparkles, LayoutDashboard, BrainCircuit, LineChart, Calendar, ChevronRight, Compass, Zap } from 'lucide-react';

const Home = ({ setRoute }) => {
  return (
    <div className="w-full bg-white relative overflow-hidden flex flex-col items-center">
      
      {/* Background Image */}
      <div 
        className="absolute top-0 inset-x-0 h-[600px] z-0 pointer-events-none animate-pan-bg"
        style={{
          backgroundImage: "url('https://wallpapers.com/images/featured/educational-background-uygkkwviq3gbhewf.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.35,
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
        }}
      ></div>
      {/* Subtle ambient gradient overlay */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-brand-100/30 to-transparent z-0 pointer-events-none"></div>

      {/* Main Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-36 pb-16 w-full text-center flex flex-col items-center border-b border-transparent">
        
        {/* Release Pill */}
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-200 bg-brand-50 text-brand-700 text-sm font-medium hover:bg-brand-100 transition-colors cursor-pointer shadow-sm animate-fade-in-up">
          <Sparkles size={16} className="text-brand-500" />
          <span>Introducing AcadNexus Intelligence Engine</span>
          <ArrowRight size={14} className="ml-1 text-brand-500" />
        </div>

        {/* Headlines */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8 max-w-4xl animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          Master your studies. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-brand-500">
            Architect your career.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          The all-in-one AI platform that builds dynamic study schedules, evaluates your true aptitude, and maps out your optimal career trajectory in real-time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up w-full sm:w-auto" style={{animationDelay: '0.3s'}}>
          <button 
             onClick={() => setRoute('features')}
             className="w-full sm:w-auto px-8 py-4 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
          >
            Explore Platform <ChevronRight size={18} />
          </button>
          <button 
             onClick={() => setRoute('about')}
             className="w-full sm:w-auto px-8 py-4 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Read Objectives
          </button>
        </div>
      </section>

      {/* Premium Dashboard UI Mockup */}
      <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pb-20 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
        
        {/* Glow behind the dashboard */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand-400/20 blur-[120px] rounded-full z-0 pointer-events-none"></div>

        {/* Dashboard Frame - 3D Animated */}
        <div className="relative z-10 w-full bg-white/95 backdrop-blur-md rounded-2xl md:rounded-[2rem] border border-slate-200 shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] overflow-hidden flex flex-col md:flex-row h-[600px] animate-float-3d hover:shadow-[0_45px_80px_-15px_rgba(79,70,229,0.45)] transition-all duration-700">
          
          {/* Sidebar */}
          <div className="hidden md:flex w-64 bg-slate-50 border-r border-slate-200 flex-col p-6">
            <div className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 rounded bg-brand-600"></div>
              <div className="h-4 w-24 bg-slate-200 rounded"></div>
            </div>

            <div className="space-y-4 flex-grow">
               {[ {icon: <LayoutDashboard size={20}/>, active: true}, {icon: <Calendar size={20}/>}, {icon: <BrainCircuit size={20}/>}, {icon: <LineChart size={20}/>} ].map((item, i) => (
                 <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${item.active ? 'bg-white shadow-sm text-brand-600 border border-slate-200' : 'text-slate-500'}`}>
                   {item.icon}
                   <div className={`h-3 rounded w-20 ${item.active ? 'bg-brand-100' : 'bg-slate-200'}`}></div>
                 </div>
               ))}
            </div>
            
            {/* User widget bottom */}
            <div className="mt-auto flex items-center gap-3 pt-6 border-t border-slate-200">
               <div className="w-10 h-10 rounded-full bg-slate-200"></div>
               <div>
                 <div className="h-3 w-16 bg-slate-200 rounded mb-2"></div>
                 <div className="h-2 w-10 bg-slate-100 rounded"></div>
               </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="flex-1 bg-white p-6 md:p-10 flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Weekly Overview</h3>
                <p className="text-slate-500 text-sm">Your AI-adapted schedule is perfectly on track.</p>
              </div>
              <div className="h-10 w-32 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600 font-medium text-sm border border-brand-100">
                Data Science Path
              </div>
            </div>

            {/* Top Cards grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[ {l: 'Study Hours', v: '24.5h', p: '+12%'}, {l: 'Aptitude Match', v: '94%', p: '+2%'}, {l: 'Exams Approaching', v: '3', p: 'Next: 2 days'} ].map((stat, i) => (
                <div key={i} className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col hover:bg-white hover:shadow-md transition-all cursor-default">
                  <span className="text-sm text-slate-500 mb-2 font-medium">{stat.l}</span>
                  <span className="text-2xl font-bold text-slate-900 mb-1">{stat.v}</span>
                  <span className="text-xs text-emerald-600 font-medium">{stat.p}</span>
                </div>
              ))}
            </div>

            {/* Schedule Section */}
            <h4 className="text-base font-bold text-slate-900 mb-4">Today's Dynamic Schedule</h4>
            <div className="flex-1 space-y-3 overflow-hidden relative">
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
              {[ {time: '09:00 AM', title: 'Advanced Algorithms', status: 'Completed', pulse: false}, {time: '11:30 AM', title: 'Logical Reasoning Test', status: 'In Progress', pulse: true}, {time: '02:00 PM', title: 'System Design Basics', status: 'Upcoming', pulse: false}, {time: '04:00 PM', title: 'Career Prep Module', status: 'Upcoming', pulse: false} ].map((task, i) => (
                <div key={i} className="group flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-brand-200 hover:shadow-sm transition-all bg-white relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${task.pulse ? 'bg-brand-500' : 'bg-transparent'} transition-colors delay-100`}></div>
                  <span className="text-sm text-slate-400 font-medium w-20">{task.time}</span>
                  <div className={`w-2 h-2 rounded-full ${task.pulse ? 'bg-brand-500 animate-pulse' : i === 0 ? 'bg-slate-300' : 'bg-brand-200'}`}></div>
                  <span className={`text-sm font-semibold flex-1 group-hover:translate-x-1 transition-transform ${i === 0 ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</span>
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${i===0 ? 'bg-slate-100 text-slate-500' : task.pulse ? 'bg-brand-50 text-brand-600' : 'bg-slate-50 text-slate-400'}`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Value Propositions Below Dashboard */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
        <div className="grid md:grid-cols-3 gap-8">
           
           <div className="group bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.25)] hover:-translate-y-4 hover:scale-[1.03] hover:border-brand-300 transition-all duration-500 cursor-default shadow-sm">
             <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-50 transition-all duration-300">
               <Calendar size={24} className="text-slate-700 group-hover:text-brand-600 transition-colors" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-3">Adaptive Scheduling</h3>
             <p className="text-slate-600 leading-relaxed">
               Missed a session? The engine automatically ripples adjustments through your entire calendar, ensuring you never fall irreparably behind.
             </p>
           </div>

           <div className="group bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.25)] hover:-translate-y-4 hover:scale-[1.03] hover:border-brand-300 transition-all duration-500 cursor-default shadow-sm">
             <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-50 transition-all duration-300">
               <BrainCircuit size={24} className="text-slate-700 group-hover:text-brand-600 transition-colors" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-3">Aptitude Mapping</h3>
             <p className="text-slate-600 leading-relaxed">
               Continuous logical reasoning checks generate a highly accurate profile of your true capabilities, eliminating the guesswork from education.
             </p>
           </div>

           <div className="group bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-2 hover:border-brand-200 transition-all duration-300 cursor-default">
             <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-50 transition-all duration-300">
               <Compass size={24} className="text-slate-700 group-hover:text-brand-600 transition-colors" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-3">Career Calibration</h3>
             <p className="text-slate-600 leading-relaxed">
               Your aptitude data is cross-referenced with real-time market demands to output the exact career paths where you will uniquely excel.
             </p>
           </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
