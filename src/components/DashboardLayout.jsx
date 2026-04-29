import React, { useState } from 'react';
import { LayoutDashboard, User, BookOpen, Calendar as CalendarIcon, Settings, LogOut, Search, Bell, ChevronRight } from 'lucide-react';
import DashboardHome from './DashboardHome';
import Profile from './Profile';
import StudyPlanner from './StudyPlanner';

const DashboardLayout = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'planner', name: 'Study Planner', icon: BookOpen },
    { id: 'schedule', name: 'Schedule', icon: CalendarIcon },
    { id: 'profile', name: 'Profile Settings', icon: User },
  ];

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (Left Corner) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-20 shadow-soft">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/30">
               <span className="text-white font-bold text-sm">A</span>
             </div>
             <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
               AcadNexus
             </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Main Menu</p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-brand-50 text-brand-700 font-semibold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className={isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'} />
                    {item.name}
                  </div>
                  {isActive && <ChevronRight size={16} className="text-brand-600" />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-slate-600 font-medium rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors group"
          >
            <LogOut size={20} className="text-slate-400 group-hover:text-red-500" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Header (Profile top right) */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between px-8">
          <div className="w-96 hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-2 border border-transparent focus-within:border-brand-500/30 focus-within:bg-white focus-within:shadow-sm transition-all focus-within:ring-4 focus-within:ring-brand-500/10">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tasks, materials, etc..." 
              className="bg-transparent border-none focus:outline-none ml-3 w-full text-sm text-slate-700 placeholder-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200"
              >
                <img 
                  src={user?.picture || "https://ui-avatars.com/api/?name=User"} 
                  alt="Profile" 
                  className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || "Student"}</p>
                  <p className="text-xs text-slate-500 font-medium">Free Plan</p>
                </div>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-fade-in-up z-30">
                  <div className="px-4 py-3 border-b border-slate-100 mb-2">
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => { setActiveTab('profile'); setIsProfileMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 font-medium hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Settings size={16} className="text-slate-400" /> Account Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={16} className="text-red-500" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && <DashboardHome />}
          {activeTab === 'profile' && <Profile user={user} />}
          {activeTab === 'planner' && <StudyPlanner />}
          {/* Add more tabs when created */}
          {(activeTab !== 'dashboard' && activeTab !== 'profile' && activeTab !== 'planner') && (
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
