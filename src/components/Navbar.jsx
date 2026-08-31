import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, Zap, User } from 'lucide-react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
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

  const loginWithPopup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        const res = await axios.post(`${API_BASE_URL}/api/auth/google`, {
          email: userInfo.data.email,
          name: userInfo.data.name,
          given_name: userInfo.data.given_name || userInfo.data.name?.split(' ')[0],
          picture: userInfo.data.picture,
          sub: userInfo.data.sub
        });

        if (res.data && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error('Google Popup Auth Error:', err);
        alert('Google Sign-In failed: ' + (err.message || 'Error'));
      } finally {
        setIsLoading(false);
      }
    },
    onError: (err) => console.error('Google Popup Error:', err)
  });

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
                <div className="flex items-center gap-3">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.error('Google Sign-In failed')}
                    theme="filled_black"
                    shape="pill"
                  />
                  <button 
                    onClick={() => loginWithPopup()}
                    className="px-4 py-2 bg-slate-900 hover:bg-brand-600 text-white font-bold rounded-full text-xs shadow-md transition-all flex items-center gap-1.5"
                    title="Open Google Login Popup"
                  >
                    <svg className="w-3.5 h-3.5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Popup Login</span>
                  </button>
                </div>
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
                <div className="flex flex-col items-center gap-3">
                  <GoogleLogin
                    onSuccess={(res) => { handleGoogleSuccess(res); setIsOpen(false); }}
                    onError={() => console.error('Google Sign-In failed')}
                    theme="filled_black"
                    shape="pill"
                  />
                  <button 
                    onClick={() => { loginWithPopup(); setIsOpen(false); }}
                    className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center gap-2"
                  >
                    <span>Google Popup Login</span>
                  </button>
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
