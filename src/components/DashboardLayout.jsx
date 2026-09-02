import React, { useState } from 'react';
import { LayoutDashboard, User, BookOpen, Calendar as CalendarIcon, Settings, LogOut, Search, Bell, ChevronRight, Menu } from 'lucide-react';
import DashboardHome from './DashboardHome';
import Profile from './Profile';
import StudyPlanner from './StudyPlanner';
import AptitudeAssessment from './AptitudeAssessment';
import SmartCalendar from './SmartCalendar';
import CollegeFinder from './CollegeFinder';
import AITutor from './AITutor';
import Flashcards from './Flashcards';
import ResourceHub from './ResourceHub';
import CommunityQA from './CommunityQA';
import AptitudePreparation from './AptitudePreparation';
import { Zap, GraduationCap, MessageSquare, Layers, Globe, Users, Brain } from 'lucide-react';

const DashboardLayout = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'planner', name: 'Study Planner', icon: BookOpen },
    { id: 'schedule', name: 'Schedule', icon: CalendarIcon },
    { id: 'assessment', name: 'Aptitude Assessment', icon: Zap },
    { id: 'prep', name: 'Aptitude Prep', icon: Brain },
    { id: 'colleges', name: 'Campus Matchmaker', icon: GraduationCap },
    { id: 'tutor', name: 'AI Tutor', icon: MessageSquare },
    { id: 'flashcards', name: 'Flashcards', icon: Layers },
    { id: 'resources', name: 'Resource Hub', icon: Globe },
    { id: 'community', name: 'Anonymous Q&A', icon: Users },
    { id: 'profile', name: 'Profile Settings', icon: User },
  ];

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar (Left Corner) */}
      <aside className={`w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col fixed h-full z-30 shadow-soft transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/30">
               <span className="text-white font-bold text-sm">A</span>
             </div>
             <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
               AcadNexus
             </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <p className="px-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Main Menu</p>
          <nav className="space-y-2 relative">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden
                    ${isActive 
                      ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-[0_8px_16px_rgb(0,0,0,0.15)] shadow-brand-500/30 font-bold transform scale-105' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white font-semibold hover:shadow-[0_4px_12px_rgb(0,0,0,0.05)] hover:-translate-y-0.5 border border-transparent hover:border-slate-100 dark:hover:border-slate-600'
                    }`}
                >
                  <div className={`absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity ${isActive ? 'block' : 'hidden'}`}></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/20 shadow-inner' : 'bg-slate-50 dark:bg-slate-700/50 group-hover:bg-slate-100 dark:group-hover:bg-slate-600 group-hover:scale-110'}`}>
                       <Icon size={18} className={isActive ? 'text-white drop-shadow-md' : 'text-slate-500 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400'} />
                    </div>
                    <span className="tracking-wide">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={18} className="text-white opacity-80 relative z-10 animate-pulse" />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
          >
            <LogOut size={20} className="text-slate-400 dark:text-slate-500 group-hover:text-red-500 dark:group-hover:text-red-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen w-full">
        {/* Top Header (Profile top right) */}
        <header className="h-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="w-96 hidden lg:flex items-center bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-2 border border-transparent focus-within:border-brand-500/30 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:shadow-sm transition-all focus-within:ring-4 focus-within:ring-brand-500/10">
              <Search size={18} className="text-slate-400 dark:text-slate-500" />
              <input 
                type="text" 
                placeholder="Search tasks, materials, etc..." 
                className="bg-transparent border-none focus:outline-none ml-3 w-full text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <button className="relative text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
              >
                <img 
                  src={user?.picture || "https://ui-avatars.com/api/?name=User"} 
                  alt="Profile" 
                  className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user?.name || "Student"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Free Plan</p>
                </div>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 animate-fade-in-up z-30">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 mb-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => { setActiveTab('profile'); setIsProfileMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                  >
                    <Settings size={16} className="text-slate-400 dark:text-slate-500" /> Account Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <LogOut size={16} className="text-red-500 dark:text-red-400" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && <DashboardHome user={user} />}
          {activeTab === 'profile' && <Profile user={user} setUser={setUser} />}
          {activeTab === 'planner' && <StudyPlanner user={user} />}
          {activeTab === 'assessment' && <AptitudeAssessment user={user} />}
          {activeTab === 'prep' && <AptitudePreparation user={user} />}
          {activeTab === 'schedule' && <SmartCalendar user={user} />}
          {activeTab === 'colleges' && <CollegeFinder user={user} />}
          {activeTab === 'tutor' && <AITutor user={user} />}
          {activeTab === 'flashcards' && <Flashcards user={user} />}
          {activeTab === 'resources' && <ResourceHub user={user} />}
          {activeTab === 'community' && <CommunityQA user={user} />}
          {/* Add more tabs when created */}
          {(activeTab !== 'dashboard' && activeTab !== 'profile' && activeTab !== 'planner' && activeTab !== 'assessment' && activeTab !== 'prep' && activeTab !== 'schedule' && activeTab !== 'colleges' && activeTab !== 'tutor' && activeTab !== 'flashcards' && activeTab !== 'resources' && activeTab !== 'community') && (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto animate-fade-in-up">
               <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center mb-6">
                 <Settings size={32} className="text-brand-500" />
               </div>
               <h2 className="text-2xl font-bold text-slate-900 mb-2">Coming Soon</h2>
               <p className="text-slate-500">This module is currently under development. Check back later for updates.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
