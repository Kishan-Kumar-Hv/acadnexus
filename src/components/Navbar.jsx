import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, Zap, User } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const Navbar = ({ currentRoute, setRoute, user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await axios.post(`${API_BASE_URL}/api/auth/google`, {
        credential: credentialResponse.credential,
        email: decoded.email,
        name: decoded.name,
        given_name: decoded.given_name || decoded.name?.split(' ')[0],
        picture: decoded.picture,
        sub: decoded.sub
      });

      if (res.data && res.data.user) {
        setUser(res.data.user);
      } else {
        alert('Authentication failed: Invalid response from backend');
      }
    } catch (error) {
      console.error('Google login failed:', error);
      alert('Google Sign-In error: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setRoute('home');
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="font-bold text-lg">Authenticating with Google...</p>
          <p className="text-sm text-slate-300 mt-1">Connecting to AcadNexus Portal</p>
        </div>
      )}
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
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.error('Google Sign-In failed')}
                  theme="filled_black"
                  shape="pill"
                />
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
                  <GoogleLogin
                    onSuccess={(res) => { handleGoogleSuccess(res); setIsOpen(false); }}
                    onError={() => console.error('Google Sign-In failed')}
                    theme="filled_black"
                    shape="pill"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  </>
  );
};

export default Navbar;
