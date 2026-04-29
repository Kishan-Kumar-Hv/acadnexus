import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, Zap } from 'lucide-react';

const Navbar = ({ currentRoute, setRoute, user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Features', id: 'features' },
    { name: 'About', id: 'about' }
  ];

  const handleInstantLogin = () => {
    setUser({
      name: "Developer Name",
      given_name: "Developer",
      email: "dev@acadnexus.ai",
      picture: "https://ui-avatars.com/api/?name=Dev+User&background=6366f1&color=fff&rounded=true"
    });
  };

  const handleLogout = () => {
    setUser(null);
    setRoute('home');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || user ? 'bg-white shadow-sm py-3 border-b border-slate-200' : 'bg-white/90 backdrop-blur-md py-4 border-b border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => !user && setRoute('home')}>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              AcadNexus 
            </span>
            {user && (
              <span className="ml-3 px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider hidden sm:block">
                Portal
              </span>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            
            {/* Show landing links ONLY if not logged in */}
            {!user && (
              <div className="flex space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRoute(item.id)}
                    className={`text-sm font-medium transition-colors ${
                      currentRoute === item.id ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
            
            {/* Google Authentication Section */}
            <div className={`flex items-center ${!user ? 'border-l border-slate-200 pl-8' : ''}`}>
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
                    <span className="text-sm font-medium text-slate-700">{user.given_name}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-slate-500 hover:text-red-600 transition-colors text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
                    title="Sign Out"
                  >
                    <LogOut size={16} /> <span className="hidden lg:inline ml-1">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleInstantLogin}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-brand-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Zap size={18} /> Instant Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900 transition-colors">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            
            {/* Show landing links ONLY if not logged in */}
            {!user && navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setRoute(item.id); setIsOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded text-base font-medium transition-colors ${
                  currentRoute === item.id ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.name}
              </button>
            ))}
            
            <div className={`pt-4 mt-2 px-4 pb-2 ${!user ? 'border-t border-slate-100' : ''}`}>
              {user ? (
                 <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[150px]">{user.email}</p>
                      </div>
                    </div>
                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="p-2 text-slate-400 hover:text-red-600 bg-white shadow-sm rounded-md border border-slate-200">
                      <LogOut size={18} />
                    </button>
                 </div>
              ) : (
                <div className="flex justify-center">
                  <button 
                    onClick={() => { handleInstantLogin(); setIsOpen(false); }}
                    className="w-full px-6 py-3 bg-slate-900 hover:bg-brand-600 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Zap size={18} /> Instant Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
