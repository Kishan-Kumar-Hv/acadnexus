import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Flame, TrendingUp, Calendar as CalendarIcon, MoreVertical, PlayCircle, Zap, BookOpen, Activity, Sparkles, Check, ChevronRight, Target, Trophy, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

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
  <div className={`relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-[32px] border border-white/80 dark:border-slate-700/80 shadow-[0_8px_40px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.3)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_20px_60px_rgb(0,0,0,0.4)] hover:-translate-y-1 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 dark:from-white/5 to-transparent pointer-events-none"></div>
    {children}
  </div>
);

const DashboardHome = ({ user }) => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [tasks, setTasks] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const fetchTasks = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tasks/${user._id}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchTasks();
  }, [user]);

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const dailyProgress = Math.round((completedTasks.length / (pendingTasks.length + completedTasks.length)) * 100) || 0;

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !user?._id) return;
    try {
      const newTask = {
        title: newTaskTitle,
        type: 'General',
        time: 'Today',
        urgency: 'medium',
        bgTheme: 'from-brand-400 to-brand-500',
        accent: 'text-brand-500',
        progress: 0,
        status: 'pending',
        iconName: 'Target'
      };
      const res = await axios.post(`${API_BASE_URL}/api/tasks/${user._id}`, newTask);
      setTasks([...tasks, res.data]);
      setNewTaskTitle('');
      setIsAdding(false);
    } catch (err) {
      console.error('Failed to add task', err);
    }
  };

  const toggleTaskStatus = async (id) => {
    if (!user?._id) return;
    try {
      setTasks(tasks.map(t => {
        if (t._id === id) {
          return { ...t, status: t.status === 'pending' ? 'completed' : 'pending', progress: t.status === 'pending' ? 100 : 0 };
        }
        return t;
      }));
      await axios.put(`${API_BASE_URL}/api/tasks/${user._id}/${id}`);
    } catch (err) {
      console.error('Failed to toggle task', err);
      fetchTasks();
    }
  };

  const deleteTask = async (id) => {
    if (!user?._id) return;
    try {
      setTasks(tasks.filter(t => (t._id || t.id) !== id));
      await axios.delete(`${API_BASE_URL}/api/tasks/${user._id}/${id}`);
    } catch (err) {
      console.error('Failed to delete task', err);
      fetchTasks();
    }
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
      <div className="relative rounded-2xl overflow-hidden shadow-sm mb-6 border border-white/60 dark:border-slate-700/60 group">
         {/* Background Image */}
         <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=2000" 
             alt="Study Background" 
             className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40 md:to-transparent dark:from-slate-900 dark:via-slate-900/95 dark:to-transparent"></div>
         </div>
         
         <div className="relative z-10 p-6 lg:p-8 flex flex-col lg:flex-row justify-between items-center gap-6 h-full">
           <div className="flex-1 max-w-2xl">
             <div className="flex items-center gap-3.5 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200" 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
                />
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-brand-100 dark:border-brand-900/40 text-brand-700 dark:text-brand-300 text-xs font-semibold shadow-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
                  </span>
                  Tracking {pendingTasks.length} pending missions
                </div>
             </div>
             
             <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
               {getGreeting()}, {user?.name || 'Kishan'}!
             </h1>
             <p className="text-slate-600 dark:text-slate-300 mt-3 font-medium text-sm sm:text-base leading-relaxed max-w-xl backdrop-blur-sm bg-white/30 dark:bg-slate-900/40 p-2 rounded-xl border border-white/50 dark:border-slate-700/50">
               You are <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{dailyProgress}%</strong> through your daily goals. Keep pushing, completing your tasks builds momentum towards your success.
             </p>
           </div>

           {/* Daily Goal Ring Hero */}
           <div className="relative group/ring shrink-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-white dark:border-slate-700 shadow-lg dark:shadow-none">
              <ActivityRing progress={dailyProgress} size={120} strokeWidth={10} colorClass="text-brand-500 dark:text-brand-400" trackClass="text-slate-200 dark:text-slate-700" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
                   <AnimatedCounter end={dailyProgress} suffix="%" />
                </span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Done</span>
              </div>
           </div>
         </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Streak Bento Card */}
        <div className="relative rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 h-48">
           <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" alt="Streak" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
           <div className="relative z-10 flex flex-col h-full justify-between p-5 text-white">
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-1 text-orange-400 drop-shadow-md">Current Streak</h3>
                <Flame size={22} className="text-orange-500 animate-pulse drop-shadow-md" />
              </div>
              <div>
                <div className="text-3xl font-extrabold flex items-center gap-2 drop-shadow-lg">
                  <AnimatedCounter end={12} /> <span className="text-base text-orange-400 font-semibold">Days</span>
                </div>
                 <p className="text-slate-200 text-xs font-medium mt-1 drop-shadow-md">Top <strong className="text-orange-400">5%</strong> of students.</p>
              </div>
           </div>
        </div>

        {/* Productivity Bento Card */}
        <div className="relative rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 h-48">
           <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800" alt="Productivity" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
           <div className="relative z-10 flex flex-col h-full justify-between p-5 text-white">
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-1 text-brand-400 drop-shadow-md">Productivity</h3>
                <TrendingUp size={22} className="text-brand-400 drop-shadow-md" />
              </div>
              <div>
                <div className="text-3xl font-extrabold flex items-center gap-2 mb-3 drop-shadow-lg">
                  <AnimatedCounter end={85} /> <span className="text-base text-brand-400 font-semibold">%</span>
                </div>
                 <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-brand-400 rounded-full w-[85%] shadow-[0_0_10px_rgb(96,165,250)]"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Mini Chart Bento */}
        <div className="relative rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 h-48">
           <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" alt="Output" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-slate-900/20"></div>
           <div className="relative z-10 flex flex-col h-full justify-between p-5 text-white">
             <div>
               <h3 className="text-xs font-bold uppercase tracking-wider mb-1 text-emerald-400 drop-shadow-md">Weekly Output</h3>
               <div className="text-2xl font-extrabold flex items-center gap-2 drop-shadow-lg">
                 42 <span className="text-xs font-bold text-emerald-900 bg-emerald-400 px-1.5 py-0.5 rounded-md">+12%</span>
               </div>
             </div>
             
             {/* Minimal SVG Bar */}
             <div className="flex items-end justify-between h-14 mt-2 gap-1.5">
                {chartData.map((val, i) => (
                  <div key={i} className="w-full bg-white/10 rounded-t relative group/minibar hover:bg-white/30 transition-colors" style={{ height: '100%' }}>
                    <div 
                      className={`absolute bottom-0 w-full rounded-t transition-all duration-1000 ${i === 5 ? 'bg-emerald-400 shadow-[0_0_10px_rgb(52,211,153)]' : 'bg-white/40'}`}
                      style={{ height: mounted ? `${val}%` : '0%' }}
                    ></div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>

      {/* Task Hub */}
      <PremiumCard className="p-0 overflow-hidden flex flex-col md:flex-row border-t border-t-white/90">
        
        {/* Sidebar for Task Categories */}
        <div className="w-full md:w-72 bg-slate-50/50 dark:bg-slate-800/50 border-r border-slate-200/50 dark:border-slate-700/50 p-6 flex flex-col relative z-10">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">Mission Control</h2>
          
          <div className="space-y-4">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                activeTab === 'pending' 
                  ? 'bg-white dark:bg-slate-700 shadow-[0_8px_20px_rgb(0,0,0,0.06)] dark:shadow-none border border-white dark:border-slate-600 scale-105' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${activeTab === 'pending' ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}>
                  <Activity size={20} />
                </div>
                <span className={`font-bold ${activeTab === 'pending' ? 'text-slate-900 dark:text-white' : ''}`}>Pending Tasks</span>
              </div>
              <span className={`text-sm font-black px-2.5 py-1 rounded-lg ${activeTab === 'pending' ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                {pendingTasks.length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('completed')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                activeTab === 'completed' 
                  ? 'bg-white dark:bg-slate-700 shadow-[0_8px_20px_rgb(0,0,0,0.06)] dark:shadow-none border border-white dark:border-slate-600 scale-105' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-xl ${activeTab === 'completed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}>
                  <CheckCircle size={20} />
                </div>
                <span className={`font-bold ${activeTab === 'completed' ? 'text-slate-900 dark:text-white' : ''}`}>Completed</span>
              </div>
              <span className={`text-sm font-black px-2.5 py-1 rounded-lg ${activeTab === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                {completedTasks.length}
              </span>
            </button>
          </div>
          
          <div className="mt-auto pt-8">
            {isAdding ? (
              <form onSubmit={handleAddTask} className="flex flex-col gap-2 animate-fade-in-up">
                <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title..." 
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 py-2 bg-brand-600 text-white font-bold rounded-xl text-sm hover:bg-brand-700">Save</button>
                  <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
                </div>
              </form>
            ) : (
              <button onClick={() => setIsAdding(true)} className="w-full py-4 bg-slate-900 dark:bg-brand-600 hover:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold rounded-2xl transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2">
                <span className="text-xl">+</span> Add New Mission
              </button>
            )}
          </div>
        </div>

        {/* Task List Content Area */}
        <div className="flex-1 p-8 lg:p-10 bg-white/40 dark:bg-slate-900/40">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
              {activeTab === 'pending' ? 'Action Items' : 'Accomplishments'}
              {activeTab === 'completed' && <Trophy className="text-yellow-500" size={24} />}
            </h3>
            <button className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 bg-brand-50 dark:bg-brand-900/30 px-4 py-2 rounded-xl transition-colors">
              Filter List
            </button>
          </div>

          <div className="space-y-4">
             {/* Dynamic rendering based on tab */}
             {(activeTab === 'pending' ? pendingTasks : completedTasks).map((task, i) => (
                <div 
                  key={task.id}
                  className={`group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-[0_10px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_10px_30px_rgb(0,0,0,0.3)] hover:border-brand-100 dark:hover:border-brand-500/50 transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row gap-6 md:items-center ${activeTab === 'completed' ? 'opacity-80' : ''}`}
                >
                  {/* Action Marker */}
                  <div className={`absolute left-0 top-0 bottom-0 w-2 transition-all duration-300 ${activeTab === 'completed' ? 'bg-emerald-500' : 'bg-brand-500 opacity-0 group-hover:opacity-100'}`}></div>

                  {/* Icon & Status Button */}
                  <button 
                    onClick={() => toggleTaskStatus(task._id || task.id)}
                    className="flex-shrink-0 relative group/btn"
                  >
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 shadow-inner
                       ${activeTab === 'completed' 
                         ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-500 dark:text-emerald-400' 
                         : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-500 dark:hover:text-brand-400'
                       }
                     `}>
                       {activeTab === 'completed' ? <Check size={28} /> : (task.icon ? <task.icon size={26} className="transform group-hover/btn:scale-110 transition-transform" /> : <Target size={26} className="transform group-hover/btn:scale-110 transition-transform" />)}
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
                      <h4 className={`text-xl font-bold truncate transition-all duration-300 ${activeTab === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400'}`}>
                        {task.title}
                      </h4>
                      {task.urgency === 'high' && activeTab === 'pending' && (
                        <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-wider flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> ASAP
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      <span className={`flex items-center gap-1.5 ${task.accent}`}>
                         <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${task.bgTheme}`}></div> {task.type}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={16} className="text-slate-400 dark:text-slate-500" /> {task.time}
                      </span>
                    </div>

                    {/* Quick Progress Bar for pending */}
                    {activeTab === 'pending' && task.progress > 0 && (
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
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
                    <button 
                      onClick={() => deleteTask(task._id || task.id)}
                      title="Delete Mission"
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                       <Trash2 size={18} />
                    </button>
                  </div>
                </div>
             ))}

             {/* Empty State */}
             {(activeTab === 'pending' ? pendingTasks : completedTasks).length === 0 && (
               <div className="py-20 flex flex-col items-center justify-center text-center">
                 <div className="w-24 h-24 mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
                    {activeTab === 'pending' ? <CheckCircle size={48} /> : <BookOpen size={48} />}
                 </div>
                 <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                   {activeTab === 'pending' ? "You're all caught up!" : "No tasks completed yet."}
                 </h4>
                 <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm">
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
      <PremiumCard className="p-8 lg:p-10 border-t-2 border-t-white/90 dark:border-t-slate-700/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 relative z-10">
          <div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
              Weekly Consistency <Activity className="text-brand-500" />
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Daily task completion percentages over the week</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Avg Output:</span>
            <span className="text-xl font-black text-emerald-500 dark:text-emerald-400">68%</span>
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
                  ? 'bg-gradient-to-b from-brand-50 dark:from-brand-900/30 to-white dark:to-slate-800 border-brand-200 dark:border-brand-700 shadow-[0_10px_30px_rgb(0,0,0,0.08)] dark:shadow-none scale-105 z-10' 
                  : 'bg-white/50 dark:bg-slate-800/50 border-white dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-[0_10px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_10px_30px_rgb(0,0,0,0.3)] hover:-translate-y-2'
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
                     colorClass={item.progress === 100 ? "text-emerald-500" : item.progress === 0 && !item.isToday ? "text-slate-200 dark:text-slate-600" : "text-brand-500"} 
                     trackClass={item.isToday ? "text-brand-100 dark:text-brand-900/40" : "text-slate-100 dark:text-slate-700"} 
                   />
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className={`text-xl font-black ${item.progress === 100 ? "text-emerald-600" : item.progress === 0 && !item.isToday ? "text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-200"}`}>
                        <AnimatedCounter end={item.progress} suffix="%" />
                     </span>
                   </div>
                 </div>
                 
                 <div className="mt-6 text-center">
                   <h4 className={`text-sm font-black uppercase tracking-widest ${item.isToday ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors'}`}>
                     {item.day}
                   </h4>
                   <div className="h-6 mt-1 flex items-center justify-center">
                     {item.isToday && (
                       <span className="inline-block text-[10px] font-black text-white bg-brand-500 px-2.5 py-1 rounded-full shadow-md animate-pulse">
                         TODAY
                       </span>
                     )}
                     {item.progress === 100 && !item.isToday && (
                       <span className="inline-block text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full shadow-sm">
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
