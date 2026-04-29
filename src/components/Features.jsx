import React from 'react';
import { CalendarClock, BrainCircuit, Compass, ArrowRight, Activity, Code, Layers } from 'lucide-react';

const Features = () => {
  const sections = [
    {
      id: 1,
      title: "Intelligent Smart Planner",
      desc: "Stop wasting hours manually adjusting your study schedule. Our engine calculates exactly how much time you need for each subject based on your exam timelines, and automatically generates a dynamic roadmap.",
      icon: <CalendarClock size={28} />,
      img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      reversed: false,
      color: "from-blue-400 to-blue-600",
      bgAlert: "bg-blue-50 text-blue-600",
      stats: [{l: "Optimization", v: "100%"}, {l: "Time Saved", v: "14h/wk"}]
    },
    {
      id: 2,
      title: "Deep Aptitude Assessment",
      desc: "Go beyond standard tests. Through an engaging series of logical reasoning and skill evaluations, we map out your true strengths, exposing career affinities you might never have considered.",
      icon: <BrainCircuit size={28} />,
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      reversed: true,
      color: "from-brand-400 to-brand-600",
      bgAlert: "bg-brand-50 text-brand-600",
      stats: [{l: "Logic Testing", v: "Deep"}, {l: "Accuracy", v: "98.5%"}]
    },
    {
      id: 3,
      title: "Market-Aligned Guidance",
      desc: "We don't just suggest careers; we cross-reference your optimal paths with real-time industry demand metrics. Enter the workforce exactly where your talents are most valued and secure.",
      icon: <Compass size={28} />,
      img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      reversed: false,
      color: "from-emerald-400 to-emerald-600",
      bgAlert: "bg-emerald-50 text-emerald-600",
      stats: [{l: "Current Trends", v: "Live"}, {l: "Paths Analyzed", v: "5,000+"}]
    }
  ];

  return (
    <div className="w-full bg-white pb-32">
      
      {/* Sleek Light Header */}
      <div className="pt-32 pb-16 px-4 max-w-4xl mx-auto text-center animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-bold shadow-sm mb-6 uppercase tracking-wider">
          <Activity size={16} className="text-brand-500" /> Platform Architecture
        </div>
        <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          Precision engineered for <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-500">absolute success.</span>
        </h2>
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Hover over each module to see how AcadNexus seamlessly synthesizes raw academic data into dynamic, actionable roadmaps.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-32 py-10">
          {sections.map((sec, idx) => (
            <div key={sec.id} className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center group animate-fade-in-up" style={{animationDelay: `${idx * 0.2}s`}}>
              
              {/* Interactive Visual Frame */}
              <div className={`relative w-full rounded-[2.5rem] p-4 lg:p-8 bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors duration-500 ${sec.reversed ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/20 group-hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] transition-shadow duration-500">
                  <img 
                    src={sec.img} 
                    alt={sec.title} 
                    className="w-full h-[450px] object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors duration-700"></div>
                  
                  {/* Floating Stat Widget triggered by hover */}
                  <div className="absolute bottom-6 left-6 right-6 flex gap-4 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-out delay-100">
                     {sec.stats.map((stat, i) => (
                       <div key={i} className="flex-1 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{stat.l}</p>
                          <p className="text-xl font-extrabold text-slate-900">{stat.v}</p>
                       </div>
                     ))}
                  </div>
                </div>
              </div>

              {/* Content Frame */}
              <div className={`${sec.reversed ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className={`w-16 h-16 rounded-2xl ${sec.bgAlert} flex items-center justify-center mb-8 shadow-sm border border-white group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                  {sec.icon}
                </div>
                <h3 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight group-hover:text-brand-600 transition-colors duration-500">{sec.title}</h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-10">
                  {sec.desc}
                </p>
                <div className="pt-8 border-t border-slate-100">
                   <button className="flex items-center gap-3 text-slate-900 font-bold hover:text-brand-600 transition-colors group/btn">
                    Explore deeper <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
