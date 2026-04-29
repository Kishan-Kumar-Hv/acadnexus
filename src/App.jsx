import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Features from './components/Features';
import About from './components/About';
import DashboardLayout from './components/DashboardLayout';

function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [user, setUser] = useState(null);

  return (
    <>
      {user ? (
        <DashboardLayout user={user} setUser={setUser} />
      ) : (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar currentRoute={currentRoute} setRoute={setCurrentRoute} user={user} setUser={setUser} />
          
          <main className="flex-grow pt-20">
            {currentRoute === 'home' && <Home setRoute={setCurrentRoute} />}
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
    </>
  );
}

export default App;
