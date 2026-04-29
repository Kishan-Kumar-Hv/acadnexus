import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Flame, TrendingUp, Calendar as CalendarIcon, MoreVertical, PlayCircle, Zap, BookOpen, Activity, Sparkles, Check, ChevronRight, Target, Trophy } from 'lucide-react';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 1500, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{prefix}{count}{suffix}</span>;
};

// SVG Circular Progress
const ActivityRing = ({ progress, size = 60, strokeWidth = 6, colorClass = "text-brand-500", trackClass = "text-brand-100" }) => {
  const [offset, setOffset] = useState(100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    const timer = setTimeout(() => {
      const newOffset = circumference - (progress / 100) * circumference;
      setOffset(newOffset);
    }, 300);
    return () => clearTimeout(timer);
  }, [progress, circumference]);

  return (
    <div className="relative flex items-center justify-center transform -rotate-90">
      <svg width={size} height={size}>
        <circle
          className={trackClass}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
    </div>
  );
};

const BouncingIcon = ({ icon: Icon, colorClass }) => (
  <div className={`p-4 rounded-2xl bg-white shadow-xl ${colorClass} animate-float group-hover:scale-110 transition-transform duration-500`}>
    <Icon size={28} />
  </div>
);

const STUDY_QUOTES = [
  "Focus on the step in front of you, not the whole staircase.",
  "Doubt kills more dreams than failure ever will.",
  "Success is the sum of small efforts, repeated day in and out.",
  "The secret of your future is hidden in your daily routine.",
  "It always seems impossible until it is done.",
  "Don't stop until you're proud.",
  "The earlier you start, the earlier you reach your goals.",
  "Do something today that your future self will thank you for.",
  "Strive for progress, not perfection.",
  "The only place where success comes before work is in the dictionary.",
  "Discipline is choosing between what you want now and what you want most.",
  "You don't have to be great to start, but you have to start to be great.",
  "Energy and persistence conquer all things.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "A little progress each day adds up to big results.",
  "There are no shortcuts to any place worth going.",
  "The beautiful thing about learning is nobody can take it away from you.",
  "Education is the most powerful weapon which you can use to change the world.",
  "Don't let what you cannot do interfere with what you can do.",
  "Success doesn't come to you, you go to it.",
  "Procrastination makes easy things hard and hard things harder.",
  "You cannot change your future, but you can change your habits.",
  "Work hard in silence, let your success be your noise.",
  "Your only limit is your mind.",
  "Dream big. Start small. Act now.",
  "Focus is more important than intelligence.",
  "Make it happen, shock everyone.",
  "Study while others are sleeping, achieve while others are wishing.",
  "Nothing changes if nothing changes.",
  "Never let a stumble in the road be the end of the journey.",
  "Be stronger than your excuses.",
  "I am not telling you it is going to be easy, I am telling you it is going to be worth it.",
  "If it is important to you, you will find a way. If not, you will find an excuse.",
  "You get what you focus on, so focus on what you want.",
  "A year from now you will wish you had started today.",
  "Don't wait for opportunity. Create it.",
  "The expert in anything was once a beginner.",
  "Believe you can and you're halfway there.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Push yourself, because no one else is going to do it for you.",
  "Do what is right, not what is easy.",
  "You are capable of more than you know.",
  "Action is the foundational key to all success.",
  "Don't watch the clock; do what it does. Keep going.",
  "Hard work beats talent when talent doesn't work hard.",
  "Small steps in the right direction can turn out to be the biggest step of your life.",
  "Either you run the day or the day runs you.",
  "Keep going. Everything you need will come to you at the perfect time.",
  "The difference between ordinary and extraordinary is that little extra.",
  "The best way to predict your future is to create it."
];

const TypingMotivationalQuotes = () => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout2 = setTimeout(() => setBlink((prev) => !prev), 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (index === STUDY_QUOTES.length) return;

    if (subIndex === STUDY_QUOTES[index].length + 1 && !reverse) {
      const waitTimeout = setTimeout(() => setReverse(true), 3000);
      return () => clearTimeout(waitTimeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % STUDY_QUOTES.length);
      return;
    }

    const typeTimeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 30 : Math.floor(Math.random() * 40) + 40);

    return () => clearTimeout(typeTimeout);
  }, [subIndex, index, reverse]);

  return (
    <div className="w-full min-h-[32px] flex items-center justify-center font-mono text-sm sm:text-base md:text-lg font-bold drop-shadow-md">
      <span className="opacity-80 mr-2 text-blue-300">acadnexus:~#</span>
      <span className="text-white">{` ${STUDY_QUOTES[index].substring(0, subIndex)}`}</span>
      <span className={`w-2.5 h-5 bg-white ml-1 inline-block align-middle transition-opacity duration-100 ${blink ? 'opacity-100' : 'opacity-0'}`}></span>
    </div>
  );
};

const PremiumCard = ({ children, className = "" }) => (
  <div className={`relative bg-white/70 backdrop-blur-2xl rounded-[32px] border border-white/80 shadow-[0_8px_40px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgb(0,0,0,0.12)] hover:-translate-y-1 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
    {children}
  </div>
);

const DashboardHome = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete Physics Assignment', type: 'Assignment', time: '5:00 PM', urgency: 'high', bgTheme: 'from-orange-500 to-red-500', accent: 'text-red-500', progress: 45, status: 'pending', icon: BookOpen },
    { id: 2, title: 'Review Math Chapter 4', type: 'Revision', time: '8:00 PM', urgency: 'medium', bgTheme: 'from-amber-400 to-orange-500', accent: 'text-amber-500', progress: 0, status: 'pending', icon: Target },
    { id: 3, title: 'Prepare for Chemistry Quiz', type: 'Quiz Prep', time: 'Tomorrow', urgency: 'medium', bgTheme: 'from-emerald-400 to-teal-500', accent: 'text-emerald-500', progress: 80, status: 'pending', icon: Activity },
    { id: 4, title: 'Read Literature Essay', type: 'Reading', time: 'Tomorrow', urgency: 'low', bgTheme: 'from-blue-400 to-indigo-500', accent: 'text-brand-500', progress: 0, status: 'pending', icon: BookOpen },
    { id: 5, title: 'Submit History Report', type: 'Assignment', time: 'Completed at 10 AM', urgency: 'low', bgTheme: 'from-emerald-400 to-emerald-500', accent: 'text-emerald-500', progress: 100, status: 'completed', icon: CheckCircle },
    { id: 6, title: 'Morning Workout', type: 'Health', time: 'Completed at 7 AM', urgency: 'low', bgTheme: 'from-brand-400 to-brand-500', accent: 'text-brand-500', progress: 100, status: 'completed', icon: Trophy }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const dailyProgress = Math.round((completedTasks.length / (pendingTasks.length + completedTasks.length)) * 100) || 0;

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'pending' ? 'completed' : 'pending', progress: t.status === 'pending' ? 100 : 0 };
      }
      return t;
    }));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const chartData = [40, 65, 45, 80, 55, 95, 75];

  return (
    <div className="relative min-h-[calc(100vh-5rem)] max-w-7xl mx-auto space-y-10 animate-fade-in-up pb-12">
      
      {/* 3D Ambient Orbs */}
      <div className="absolute inset-0 z-[-1] overflow-hidden rounded-[40px] pointer-events-none">
        <div className="absolute -top-10 -left-10 w-[500px] h-[500px] bg-brand-400/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
        <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-amber-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-[600px] h-[600px] bg-purple-400/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Motivation Terminal Banner */}
      <div className="relative w-full bg-[#0a192f] rounded-2xl p-4 shadow-xl border border-blue-400/30 overflow-hidden mb-6 z-10 group cursor-default">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-400/20 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
         <div className="relative z-10 flex items-center justify-center w-full px-2">
            <TypingMotivationalQuotes />
         </div>
      </div>

      {/* Hero Section */}
      <PremiumCard className="p-8 lg:p-12 border-t-2 border-t-white/90">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-bold mb-6 shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
              </span>
              Tracking {pendingTasks.length} pending missions today
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-slate-500 tracking-tight leading-[1.1]">
              {getGreeting()},<br />Kishan!
            </h1>
            <p className="text-slate-500 mt-5 font-medium text-lg leading-relaxed max-w-xl">
              You are <strong className="text-emerald-500 font-extrabold">{dailyProgress}%</strong> through your daily goals. Keep pushing, completing your tasks builds momentum towards your success.
            </p>
          </div>

          {/* Daily Goal Ring Hero */}
          <div className="relative group shrink-0">
             <div className="absolute inset-0 bg-gradient-to-br from-brand-300 to-purple-300 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
             <div className="relative bg-white rounded-full p-6 shadow-2xl flex items-center justify-center border-4 border-white">
               <ActivityRing progress={dailyProgress} size={160} strokeWidth={12} colorClass="text-brand-500" trackClass="text-slate-100" />
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-4xl font-black text-slate-800">
                    <AnimatedCounter end={dailyProgress} suffix="%" />
                 </span>
                 <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Done</span>
               </div>
             </div>
          </div>
        </div>
      </PremiumCard>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Streak Bento Card */}
        <PremiumCard className="p-8 group hover:bg-orange-50/50">
           <div className="absolute -right-6 -top-6 text-orange-200/50 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
             <Flame size={140} />
           </div>
           <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-sm font-black uppercase text-orange-500 tracking-widest mb-1">Current Streak</h3>
                <div className="text-5xl font-black text-slate-900 flex items-center gap-3">
                  <AnimatedCounter end={12} /> <span className="text-xl text-orange-500">Days</span>
                </div>
              </div>
              <div className="mt-8">
                 <p className="text-slate-600 font-medium">You are in the top <strong className="text-orange-600">5%</strong> of students this week!</p>
              </div>
           </div>
        </PremiumCard>

        {/* Productivity Bento Card */}
        <PremiumCard className="p-8 group hover:bg-brand-50/50">
           <div className="absolute -right-6 -top-6 text-brand-200/50 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
             <TrendingUp size={140} />
           </div>
           <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-sm font-black uppercase text-brand-600 tracking-widest mb-1">Productivity</h3>
                <div className="text-5xl font-black text-slate-900 flex items-center gap-3">
                  <AnimatedCounter end={85} /> <span className="text-xl text-brand-500">%</span>
                </div>
              </div>
              <div className="mt-8">
                 <div className="h-3 w-full bg-slate-200/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full w-[85%]"></div>
                 </div>
              </div>
           </div>
        </PremiumCard>

        {/* Mini Chart Bento */}
        <PremiumCard className="p-8 hover:bg-slate-50/80">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-500 tracking-widest mb-1">Weekly Output</h3>
              <div className="text-3xl font-black text-slate-900 flex items-center gap-2">
                42 <span className="text-sm font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+12%</span>
              </div>
            </div>
            
            {/* Minimal SVG Bar */}
            <div className="flex items-end justify-between h-20 mt-4 gap-2">
               {chartData.map((val, i) => (
                 <div key={i} className="w-full bg-slate-100 rounded-t-lg relative group/minibar hover:bg-slate-200 transition-colors" style={{ height: '100%' }}>
                   <div 
                     className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-1000 ${i === 5 ? 'bg-brand-500' : 'bg-slate-400'}`}
                     style={{ height: mounted ? `${val}%` : '0%' }}
                   ></div>
                 </div>
               ))}
            </div>
          </div>
        </PremiumCard>
      </div>

      {/* Massive Task Hub */}
      <PremiumCard className="p-0 overflow-hidden flex flex-col md:flex-row border-t-2 border-t-white/90">
        
        {/* Sidebar for Task Categories */}
        <div className="w-full md:w-80 bg-slate-50/50 border-r border-slate-200/50 p-8 flex flex-col relative z-10">
          <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Mission Control</h2>
          
          <div className="space-y-4">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                activeTab === 'pending' 
                  ? 'bg-white shadow-[0_8px_20px_rgb(0,0,0,0.06)] border border-white scale-105' 
                  : 'hover:bg-slate-100 border border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${activeTab === 'pending' ? 'bg-brand-100 text-brand-600' : 'bg-slate-200 text-slate-400'}`}>
                  <Activity size={20} />
                </div>
                <span className="font-bold">Pending Tasks</span>
              </div>
              <span className={`text-sm font-black px-2.5 py-1 rounded-lg ${activeTab === 'pending' ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {pendingTasks.length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('completed')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                activeTab === 'completed' 
                  ? 'bg-white shadow-[0_8px_20px_rgb(0,0,0,0.06)] border border-white scale-105' 
                  : 'hover:bg-slate-100 border border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-xl ${activeTab === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                  <CheckCircle size={20} />
                </div>
                <span className="font-bold">Completed</span>
              </div>
              <span className={`text-sm font-black px-2.5 py-1 rounded-lg ${activeTab === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {completedTasks.length}
              </span>
            </button>
          </div>
          
          <div className="mt-auto pt-8">
            <button className="w-full py-4 bg-slate-900 hover:bg-brand-600 text-white font-bold rounded-2xl transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2">
              <span className="text-xl">+</span> Add New Mission
            </button>
          </div>
        </div>

        {/* Task List Content Area */}
        <div className="flex-1 p-8 lg:p-10 bg-white/40">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              {activeTab === 'pending' ? 'Action Items' : 'Accomplishments'}
              {activeTab === 'completed' && <Trophy className="text-yellow-500" size={24} />}
            </h3>
            <button className="text-sm font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-4 py-2 rounded-xl transition-colors">
              Filter List
            </button>
          </div>

          <div className="space-y-4">
             {/* Dynamic rendering based on tab */}
             {(activeTab === 'pending' ? pendingTasks : completedTasks).map((task, i) => (
                <div 
                  key={task.id}
                  className={`group bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-[0_10px_30px_rgb(0,0,0,0.06)] hover:border-brand-100 transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row gap-6 md:items-center ${activeTab === 'completed' ? 'opacity-80' : ''}`}
                >
                  {/* Action Marker */}
                  <div className={`absolute left-0 top-0 bottom-0 w-2 transition-all duration-300 ${activeTab === 'completed' ? 'bg-emerald-500' : 'bg-brand-500 opacity-0 group-hover:opacity-100'}`}></div>

                  {/* Icon & Status Button */}
                  <button 
                    onClick={() => toggleTaskStatus(task.id)}
                    className="flex-shrink-0 relative group/btn"
                  >
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 shadow-inner
                       ${activeTab === 'completed' 
                         ? 'bg-emerald-50 border-emerald-200 text-emerald-500' 
                         : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-500'
                       }
                     `}>
                       {activeTab === 'completed' ? <Check size={28} /> : <task.icon size={26} className="transform group-hover/btn:scale-110 transition-transform" />}
                     </div>
                     {/* Check tooltip on hover */}
                     {activeTab === 'pending' && (
                       <div className="absolute inset-0 bg-brand-500 rounded-2xl flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity scale-50 group-hover/btn:scale-100 duration-300 text-white">
                         <Check size={28} />
                       </div>
                     )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h4 className={`text-xl font-bold truncate transition-all duration-300 ${activeTab === 'completed' ? 'line-through text-slate-400' : 'text-slate-900 group-hover:text-brand-700'}`}>
                        {task.title}
                      </h4>
                      {task.urgency === 'high' && activeTab === 'pending' && (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-black uppercase tracking-wider flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> ASAP
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500">
                      <span className={`flex items-center gap-1.5 ${task.accent}`}>
                         <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${task.bgTheme}`}></div> {task.type}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={16} className="text-slate-400" /> {task.time}
                      </span>
                    </div>

                    {/* Quick Progress Bar for pending */}
                    {activeTab === 'pending' && task.progress > 0 && (
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div 
                             className={`h-full bg-gradient-to-r ${task.bgTheme} rounded-full transition-all duration-[2000ms] ease-out`}
                             style={{ width: mounted ? `${task.progress}%` : '0%' }}
                           ></div>
                        </div>
                        <span className={`text-xs font-black ${task.accent}`}>{task.progress}%</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Elements */}
                  <div className="flex items-center justify-end gap-3 shrink-0">
                    {activeTab === 'pending' && (
                      <button className={`hidden md:flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${task.bgTheme} text-white shadow-lg opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 hover:scale-105 active:scale-95`}>
                        <PlayCircle size={24} />
                      </button>
                    )}
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors">
                       <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
             ))}

             {/* Empty State */}
             {(activeTab === 'pending' ? pendingTasks : completedTasks).length === 0 && (
               <div className="py-20 flex flex-col items-center justify-center text-center">
                 <div className="w-24 h-24 mb-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                    {activeTab === 'pending' ? <CheckCircle size={48} /> : <BookOpen size={48} />}
                 </div>
                 <h4 className="text-2xl font-black text-slate-800 mb-2">
                   {activeTab === 'pending' ? "You're all caught up!" : "No tasks completed yet."}
                 </h4>
                 <p className="text-slate-500 font-medium max-w-sm">
                   {activeTab === 'pending' 
                     ? "Great job. Enjoy your free time or get ahead by adding a new mission." 
                     : "Your accomplishments will appear here once you start knocking out tasks."}
                 </p>
               </div>
             )}
          </div>
        </div>
      </PremiumCard>

      {/* Weekly Consistency Progress */}
      <PremiumCard className="p-8 lg:p-10 border-t-2 border-t-white/90">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 relative z-10">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              Weekly Consistency <Activity className="text-brand-500" />
            </h3>
            <p className="text-slate-500 font-medium mt-1">Daily task completion percentages over the week</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Avg Output:</span>
            <span className="text-xl font-black text-emerald-500">68%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 lg:gap-6 relative z-10">
          {[
            { day: 'Mon', progress: 100, isToday: false },
            { day: 'Tue', progress: 85, isToday: false },
            { day: 'Wed', progress: 60, isToday: false },
            { day: 'Thu', progress: 90, isToday: false },
            { day: 'Fri', progress: dailyProgress, isToday: true },
            { day: 'Sat', progress: 0, isToday: false },
            { day: 'Sun', progress: 0, isToday: false }
          ].map((item, i) => (
            <div 
              key={i} 
              className={`relative flex flex-col items-center p-6 rounded-[32px] border transition-all duration-500 group overflow-hidden
                ${item.isToday 
                  ? 'bg-gradient-to-b from-brand-50 to-white border-brand-200 shadow-[0_10px_30px_rgb(0,0,0,0.08)] scale-105 z-10' 
                  : 'bg-white/50 border-white hover:bg-white hover:shadow-[0_10px_30px_rgb(0,0,0,0.06)] hover:-translate-y-2'
                }
              `}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
               {item.isToday && (
                 <div className="absolute inset-0 bg-brand-400/5 mix-blend-multiply opacity-50"></div>
               )}
               
               <div className="relative z-10 flex flex-col items-center">
                 <div className="relative group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                   {/* Ambient glow behind ring */}
                   {(item.progress > 0 || item.isToday) && (
                     <div className={`absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-500
                       ${item.progress === 100 ? 'bg-emerald-400' : 'bg-brand-400'}
                     `}></div>
                   )}
                   
                   <ActivityRing 
                     progress={item.progress} 
                     size={84} 
                     strokeWidth={8} 
                     colorClass={item.progress === 100 ? "text-emerald-500" : item.progress === 0 && !item.isToday ? "text-slate-200" : "text-brand-500"} 
                     trackClass={item.isToday ? "text-brand-100" : "text-slate-100"} 
                   />
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className={`text-xl font-black ${item.progress === 100 ? "text-emerald-600" : item.progress === 0 && !item.isToday ? "text-slate-400" : "text-slate-800"}`}>
                        <AnimatedCounter end={item.progress} suffix="%" />
                     </span>
                   </div>
                 </div>
                 
                 <div className="mt-6 text-center">
                   <h4 className={`text-sm font-black uppercase tracking-widest ${item.isToday ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-800 transition-colors'}`}>
                     {item.day}
                   </h4>
                   <div className="h-6 mt-1 flex items-center justify-center">
                     {item.isToday && (
                       <span className="inline-block text-[10px] font-black text-white bg-brand-500 px-2.5 py-1 rounded-full shadow-md animate-pulse">
                         TODAY
                       </span>
                     )}
                     {item.progress === 100 && !item.isToday && (
                       <span className="inline-block text-[10px] font-black text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full shadow-sm">
                         PERFECT
                       </span>
                     )}
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
};

export default DashboardHome;
