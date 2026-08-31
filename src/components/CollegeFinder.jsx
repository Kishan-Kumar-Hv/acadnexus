import React, { useState } from 'react';
import { GraduationCap, MapPin, Users, Building, Sparkles, BrainCircuit, ArrowRight, CheckCircle2, ChevronRight, Compass, RefreshCcw, Landmark, Search, Zap } from 'lucide-react';
import { generateCollegeMatches } from '../config/gemini';

const PremiumCard = ({ children, className = "" }) => (
  <div className={`relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/80 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const CollegeFinder = () => {
  const [step, setStep] = useState('config'); // config, processing, results
  const [preferences, setPreferences] = useState({
    academicStage: 'Completed 12th Grade (Looking for Undergraduate Degree)',
    major: 'Computer Science & Engineering',
    city: 'Bangalore',
    locationType: 'Urban / City Center',
    vibe: 'Collaborative & Innovative',
    size: 'Medium (5k - 15k)'
  });
  const [results, setResults] = useState([]);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleGenerate = async () => {
    // Fill in default fallback if user cleared anything
    const finalPrefs = {
      academicStage: preferences.academicStage || 'Completed 12th Grade (Looking for Undergraduate Degree)',
      major: preferences.major || 'Computer Science & Engineering',
      city: preferences.city || 'Bangalore',
      locationType: preferences.locationType || 'Urban / City Center',
      vibe: preferences.vibe || 'Collaborative & Innovative',
      size: preferences.size || 'Medium (5k - 15k)'
    };

    setStep('processing');
    setProcessingProgress(25);
    
    const pInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) return 90;
        return prev + 25;
      });
    }, 200);

    try {
      const matchResults = await generateCollegeMatches(finalPrefs);
      clearInterval(pInterval);
      setProcessingProgress(100);
      
      setTimeout(() => {
        setResults(matchResults);
        setStep('results');
      }, 400);
    } catch (e) {
      console.error('Matchmaker error:', e);
      clearInterval(pInterval);
      setProcessingProgress(100);
      const fallbackMatches = await generateCollegeMatches(finalPrefs);
      setResults(fallbackMatches);
      setStep('results');
    }
  };

  const handleAutoFill = (domain, cityName, stage) => {
    setPreferences({
      academicStage: stage || 'Completed 12th Grade (Looking for Undergraduate Degree)',
      major: domain,
      city: cityName,
      locationType: 'Urban / City Center',
      vibe: 'Collaborative & Innovative',
      size: 'Medium (5k - 15k)'
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] max-w-5xl mx-auto space-y-10 animate-fade-in-up pb-12 pt-4 z-10">
      
      {/* 3D Ambient Orbs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-orange-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative rounded-[32px] overflow-hidden shadow-[0_8px_40px_rgb(0,0,0,0.08)] mb-10 group">
         <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000" alt="University Campus" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" />
         <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40 md:to-transparent"></div>
         
         <div className="relative z-10 p-10 lg:p-14 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-orange-600 text-sm font-bold mb-6 shadow-sm border border-orange-100">
              <GraduationCap size={16} /> Global Institution Matchmaker
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Find Your Perfect <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Academic Environment</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium leading-relaxed backdrop-blur-sm bg-white/40 p-3 rounded-xl max-w-xl">
              Whether you are choosing a stream after 10th grade, an undergrad college after 12th, or a Master's program—our AI pinpoints institutions that fit your exact vibe, domain, and city.
            </p>
         </div>
      </div>

      {step === 'config' && (
        <PremiumCard className="p-6 md:p-10 max-w-3xl mx-auto">
           <div className="space-y-6">

             {/* Quick Match Presets */}
             <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-500" /> Quick Match Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleAutoFill('Computer Science & AI', 'Bangalore', 'Completed 12th Grade (Looking for Undergraduate Degree)')}
                    className="px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-slate-700 text-orange-700 dark:text-orange-300 text-xs font-bold hover:bg-orange-100 dark:hover:bg-slate-600 transition-colors border border-orange-200 dark:border-slate-600 flex items-center gap-1.5"
                  >
                    ⚡ Tech & CS (Bangalore)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAutoFill('Medical Sciences / MBBS', 'Delhi', 'Completed 12th Grade (Looking for Undergraduate Degree)')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-slate-600 transition-colors border border-emerald-200 dark:border-slate-600 flex items-center gap-1.5"
                  >
                    🩺 Medicine & Healthcare
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAutoFill('Business Administration / MBA', 'Mumbai', 'Current Undergraduate (Looking for Master\'s/Postgrad)')}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors border border-blue-200 dark:border-slate-600 flex items-center gap-1.5"
                  >
                    💼 MBA & Management
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAutoFill('Design, UI/UX & Fine Arts', 'Ahmedabad', 'Completed 12th Grade (Looking for Undergraduate Degree)')}
                    className="px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-slate-700 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 dark:hover:bg-slate-600 transition-colors border border-purple-200 dark:border-slate-600 flex items-center gap-1.5"
                  >
                    🎨 Design & Architecture
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAutoFill('PCM / Science Stream', 'Delhi', 'Completed 10th Grade (Looking for High School/Stream)')}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 flex items-center gap-1.5"
                  >
                    🏫 11th/12th Streams
                  </button>
                </div>
             </div>
             
             {/* Academic Stage */}
             <div>
                <label className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <GraduationCap size={16} className="text-emerald-500" /> Current Academic Stage
                </label>
                <select 
                  value={preferences.academicStage}
                  onChange={(e) => setPreferences({...preferences, academicStage: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-700 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500 transition-all outline-none font-bold text-slate-800 dark:text-white cursor-pointer shadow-sm text-sm"
                >
                   <option value="">Select your current stage...</option>
                   <option value="Completed 10th Grade (Looking for High School/Stream)">Completed 10th Grade (Looking for 11th/12th / Stream / Diploma)</option>
                   <option value="Completed 12th Grade (Looking for Undergraduate Degree)">Completed 12th Grade (Looking for Undergraduate Degree)</option>
                   <option value="Current Undergraduate (Looking for Master's/Postgrad)">Current Undergraduate (Looking for Master's / Postgrad)</option>
                   <option value="Professional (Looking for specialized academies/bootcamps)">Professional (Looking for specialized academies / bootcamps)</option>
                </select>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Major Input */}
               <div>
                  <label className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Building size={18} className="text-orange-500" /> Target Domain
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. PCM, Computer Science..." 
                    value={preferences.major}
                    onChange={(e) => setPreferences({...preferences, major: e.target.value})}
                    className="w-full bg-slate-50 px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 transition-all outline-none font-bold text-slate-800 placeholder-slate-400"
                  />
               </div>

               {/* City Input */}
               <div>
                  <label className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Search size={18} className="text-blue-500" /> Specific City (Optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Bangalore, Mumbai..." 
                    value={preferences.city}
                    onChange={(e) => setPreferences({...preferences, city: e.target.value})}
                    className="w-full bg-slate-50 px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold text-slate-800 placeholder-slate-400"
                  />
               </div>
             </div>

             {/* Location Type */}
             <div>
                <label className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-500" /> Location Vibe
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Urban / City Center', 'Suburban / College Town', 'Rural / Nature Bound'].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setPreferences({...preferences, locationType: loc})}
                      className={`p-4 rounded-xl border-2 text-center font-bold transition-all ${
                        preferences.locationType === loc 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                        : 'border-slate-100 bg-white text-slate-500 hover:border-blue-200 hover:bg-slate-50'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
             </div>

             {/* Campus Culture */}
             <div>
                <label className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-purple-500" /> Campus Culture & People
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Highly Academic & Competitive', 'Collaborative & Innovative', 'Social & Greek Life Heavy', 'Artsy, Quirky & Independent'].map((vibe) => (
                    <button
                      key={vibe}
                      onClick={() => setPreferences({...preferences, vibe: vibe})}
                      className={`p-4 rounded-xl border-2 text-center font-bold transition-all ${
                        preferences.vibe === vibe 
                        ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm' 
                        : 'border-slate-100 bg-white text-slate-500 hover:border-purple-200 hover:bg-slate-50'
                      }`}
                    >
                      {vibe}
                    </button>
                  ))}
                </div>
             </div>

             {/* Campus Size */}
             <div>
                <label className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Users size={18} className="text-emerald-500" /> Student Body Size
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Small (< 5,000)', 'Medium (5k - 15k)', 'Massive (> 15k)'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setPreferences({...preferences, size: size})}
                      className={`p-4 rounded-xl border-2 text-center font-bold transition-all ${
                        preferences.size === size 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' 
                        : 'border-slate-100 bg-white text-slate-500 hover:border-emerald-200 hover:bg-slate-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
             </div>

             <button 
               onClick={handleGenerate}
               className="w-full mt-8 py-5 rounded-2xl font-black text-lg text-white bg-slate-900 hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-lg hover:-translate-y-1 active:scale-95"
             >
               Find My Campus Match <ArrowRight size={22} />
             </button>
           </div>
        </PremiumCard>
      )}

      {step === 'processing' && (
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
          <div className="relative w-32 h-32 flex items-center justify-center mb-8">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90 text-orange-500" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-100" />
              <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="289" strokeDashoffset={289 - (289 * processingProgress) / 100} style={{ transition: 'stroke-dashoffset 0.3s ease' }} className="text-orange-500" strokeLinecap="round" />
            </svg>
            <Compass size={48} className="text-orange-500 animate-spin-slow" />
            <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-20 animate-blob"></div>
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Scouting Campuses...</h3>
          <p className="text-slate-500 font-medium text-center max-w-md">Matching your cultural and academic preferences against global databases ({processingProgress}%)...</p>
        </div>
      )}

      {step === 'results' && (
        <div className="space-y-8 animate-fade-in-up">
           <div className="flex items-center justify-between mb-4">
             <div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Campus Matches</h2>
               <p className="text-slate-500 font-medium mt-1">Colleges that fit your exact vibe and academic goals.</p>
             </div>
             <button 
               onClick={() => setStep('config')}
               className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:text-slate-900 shadow-sm transition-all flex items-center gap-2"
             >
               <RefreshCcw size={16} /> Adjust Preferences
             </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {results.map((college, idx) => (
               <PremiumCard key={idx} className="p-0 overflow-hidden flex flex-col h-full group">
                 <div className={`h-3 w-full ${idx === 0 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`}></div>
                 <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                       <div>
                         <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-orange-600 transition-colors">{college.name}</h3>
                         <span className="text-slate-500 font-bold flex items-center gap-1 mt-2">
                           <MapPin size={16} /> {college.location}
                         </span>
                       </div>
                       <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-center shrink-0">
                         <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Match</span>
                         <span className={`text-xl font-black ${idx === 0 ? 'text-orange-500' : 'text-blue-500'}`}>{college.matchPercentage}%</span>
                       </div>
                    </div>
                    
                    <div className="space-y-6 flex-1">
                      <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100/50">
                         <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Users size={16} className="text-orange-500" /> The Environment
                         </h4>
                         <p className="text-slate-600 font-medium leading-relaxed">
                           {college.environmentSummary}
                         </p>
                      </div>

                      <div>
                         <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Landmark size={16} className="text-blue-500" /> Why It Fits You
                         </h4>
                         <p className="text-slate-600 font-medium leading-relaxed">
                           {college.whyItFits}
                         </p>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100">
                      <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                         Explore Virtual Tour <ChevronRight size={18} />
                      </button>
                    </div>
                 </div>
               </PremiumCard>
             ))}
           </div>
        </div>
      )}

    </div>
  );
};

export default CollegeFinder;
