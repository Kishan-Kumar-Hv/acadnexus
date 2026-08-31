import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Features from './components/Features';
import About from './components/About';
import DashboardLayout from './components/DashboardLayout';
import axios from 'axios';
import { API_BASE_URL } from './config/api';

function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [user, setUser] = useState(null);

  const handleSetUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('acadnexus_user', JSON.stringify(userData));
      localStorage.removeItem('acadnexus_signed_out');
    } else {
      localStorage.removeItem('acadnexus_user');
      localStorage.setItem('acadnexus_signed_out', 'true');
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('acadnexus_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('acadnexus_user');
      }
    }
  }, []);

  useEffect(() => {
    if (user?.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user?.darkMode]);

  return (
    <div className="dark:bg-slate-900 transition-colors duration-300">
      {user ? (
        <DashboardLayout user={user} setUser={handleSetUser} />
      ) : (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar currentRoute={currentRoute} setRoute={setCurrentRoute} user={user} setUser={handleSetUser} />
          
          <main className="flex-grow pt-20">
            {currentRoute === 'home' && <Home setRoute={setCurrentRoute} setUser={handleSetUser} />}
            {currentRoute === 'features' && <Features />}
            {currentRoute === 'about' && <About />}
          </main>

          <footer className="bg-slate-900 border-t border-slate-800 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
              <p className="font-medium text-slate-300">© 2026 AcadNexus Future AI</p>
              <p className="text-sm mt-3">Empowering students with intelligent planning and strategic career insights.</p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
