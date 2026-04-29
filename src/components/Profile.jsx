import React, { useState } from 'react';
import { User, Phone, Save, ShieldCheck, Mail, ChevronDown } from 'lucide-react';

// Comprehensive list of country codes with flags
const countryCodes = [
  { code: '+1', flag: '🇺🇸', name: 'US' },
  { code: '+1', flag: '🇨🇦', name: 'CA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+91', flag: '🇮🇳', name: 'IN' },
  { code: '+61', flag: '🇦🇺', name: 'AU' },
  { code: '+49', flag: '🇩🇪', name: 'DE' },
  { code: '+33', flag: '🇫🇷', name: 'FR' },
  { code: '+81', flag: '🇯🇵', name: 'JP' },
  { code: '+86', flag: '🇨🇳', name: 'CN' },
  { code: '+971', flag: '🇦🇪', name: 'AE' },
  { code: '+55', flag: '🇧🇷', name: 'BR' },
  { code: '+52', flag: '🇲🇽', name: 'MX' },
  { code: '+27', flag: '🇿🇦', name: 'ZA' },
  { code: '+34', flag: '🇪🇸', name: 'ES' },
  { code: '+39', flag: '🇮🇹', name: 'IT' },
  { code: '+7', flag: '🇷🇺', name: 'RU' },
  { code: '+82', flag: '🇰🇷', name: 'KR' },
  { code: '+65', flag: '🇸🇬', name: 'SG' },
  { code: '+64', flag: '🇳🇿', name: 'NZ' },
  { code: '+46', flag: '🇸🇪', name: 'SE' },
  { code: '+41', flag: '🇨🇭', name: 'CH' },
  { code: '+31', flag: '🇳🇱', name: 'NL' },
  { code: '+32', flag: '🇧🇪', name: 'BE' },
  { code: '+47', flag: '🇳🇴', name: 'NO' },
  { code: '+45', flag: '🇩🇰', name: 'DK' },
  { code: '+353', flag: '🇮🇪', name: 'IE' },
  { code: '+43', flag: '🇦🇹', name: 'AT' },
  { code: '+90', flag: '🇹🇷', name: 'TR' },
  { code: '+62', flag: '🇮🇩', name: 'ID' },
  { code: '+60', flag: '🇲🇾', name: 'MY' },
  { code: '+63', flag: '🇵🇭', name: 'PH' },
  { code: '+66', flag: '🇹🇭', name: 'TH' },
  { code: '+84', flag: '🇻🇳', name: 'VN' },
  { code: '+92', flag: '🇵🇰', name: 'PK' },
  { code: '+880', flag: '🇧🇩', name: 'BD' },
  { code: '+94', flag: '🇱🇰', name: 'LK' },
  { code: '+977', flag: '🇳🇵', name: 'NP' },
  { code: '+20', flag: '🇪🇬', name: 'EG' },
  { code: '+234', flag: '🇳🇬', name: 'NG' },
  { code: '+254', flag: '🇰🇪', name: 'KE' }
];

const Profile = ({ user }) => {
  const [selectedCode, setSelectedCode] = useState('+91');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 lg:py-20 animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Profile</h1>
        <p className="text-slate-500 mt-2">Manage your personal settings and contact information.</p>
      </div>

      <div className="bg-white border text-left border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Profile Header Box */}
        <div className="bg-slate-50/50 border-b border-slate-100 p-8 flex items-center gap-6">
           <img 
              src={user?.picture || "https://ui-avatars.com/api/?name=User"} 
              alt={user.name} 
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              referrerPolicy="no-referrer"
           />
           <div>
             <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
             <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                <ShieldCheck size={16} className="text-emerald-500" /> Google Verified Account
             </div>
           </div>
        </div>

        {/* Input Details */}
        <div className="p-8 space-y-8 max-w-2xl">
          
          {/* Name Info */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
               <User size={16} className="text-slate-400" /> Full Name
            </label>
            <input 
              type="text" 
              defaultValue={user.name}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
            />
          </div>

          {/* Email Info */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
               <Mail size={16} className="text-slate-400" /> Email Address
            </label>
            <input 
              type="email" 
              defaultValue={user.email}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-100/50 text-slate-500 cursor-not-allowed font-medium"
            />
          </div>

          {/* Phone Number Input with Country Code Dropdown */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
               <Phone size={16} className="text-slate-400" /> Phone Number
            </label>
            
            <div className="flex relative shadow-sm rounded-xl">
              {/* Country Code Selector */}
              <div className="relative flex items-center border border-r-0 border-slate-200 bg-slate-50 rounded-l-xl overflow-hidden hover:bg-slate-100 transition-colors focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 z-10 w-[120px]">
                <select 
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                  className="w-full h-full pl-3 pr-8 py-3 bg-transparent text-slate-700 font-medium appearance-none cursor-pointer focus:outline-none"
                >
                  {countryCodes.map((c, idx) => (
                    <option key={idx} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-slate-400 absolute right-3 pointer-events-none" />
              </div>
              
              {/* Phone Input */}
              <input 
                type="tel" 
                placeholder="0000 000 000"
                className="flex-1 w-full px-4 py-3 rounded-r-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
              />
            </div>
            
            <p className="text-xs text-slate-400 mt-2">Required for SMS study reminders and revision updates.</p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
           <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 shadow-sm hover:shadow-md transition-all">
             <Save size={18} /> Update Profile
           </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
