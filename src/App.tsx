import React, { useState, useEffect } from 'react';
import type { ActiveTab } from './types';
import PortalsTab from './components/PortalsTab';
import AdminTab from './components/AdminTab';
import WhatsAppBroadcastManager from './components/WhatsAppBroadcastManager';
import VoiceController from './components/VoiceController';
import { LangType } from './utils/locale';
import { useTranslation } from 'react-i18next';
import { speakText } from './utils/tts';
import { 
  GraduationCap, BookOpen, Users, Video, Camera, Calendar, 
  Clock, ShieldCheck, Award, Bell, MapPin, Phone, Mail,
  CheckCircle2, XCircle, AlertCircle, Sparkles, User, Lock, Key, Layers,
  Activity, Menu, X, HelpCircle, HardDrive, RefreshCcw, Landmark, ArrowRight, MessageCircle, Volume2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('portals');
  const [portalSubTab, setPortalSubTab] = useState<string>('home');
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isWhatsAppManagerOpen, setIsWhatsAppManagerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'original' | 'glassNavy' | 'sunriseOrange'>(() => {
    return (localStorage.getItem('sxc_portal_theme') as 'original' | 'glassNavy' | 'sunriseOrange') || 'glassNavy';
  });
  const [currentTimeString, setCurrentTimeString] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('sxc_admin_session') === 'active';
  });
  const [language, setLanguage] = useState<LangType>(() => {
    return (localStorage.getItem('sxc_portal_lang') as LangType) || 'en';
  });

  const { t, i18n } = useTranslation();

  const handleSetLanguage = (lang: LangType) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('sxc_portal_lang', lang);
    window.dispatchEvent(new Event('sxc_portal_lang_changed'));
  };

  useEffect(() => {
    const checkAdminSession = () => {
      setIsAdminLoggedIn(localStorage.getItem('sxc_admin_session') === 'active');
    };
    window.addEventListener('sxc_admin_login_changed', checkAdminSession);
    
    // Support changing language via Speech recognition as well
    const handleLangChangeTrigger = () => {
      const stored = localStorage.getItem('sxc_portal_lang') as LangType;
      if (stored && stored !== language) {
        setLanguage(stored);
      }
    };
    window.addEventListener('sxc_portal_lang_changed', handleLangChangeTrigger);

    return () => {
      window.removeEventListener('sxc_admin_login_changed', checkAdminSession);
      window.removeEventListener('sxc_portal_lang_changed', handleLangChangeTrigger);
    };
  }, [language]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeString(now.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const changeTheme = (newTheme: 'original' | 'glassNavy' | 'sunriseOrange') => {
    setTheme(newTheme);
    localStorage.setItem('sxc_portal_theme', newTheme);
  };

  const isGlass = theme === 'glassNavy';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-300 relative ${isGlass ? 'bg-[#FFF7ED] text-[#431407]' : 'bg-[#0A0A0B] text-[#D1D5DB]'}`}>
      
      {/* Background Ambient Orbs (Glass Theme only) */}
      {isGlass && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none no-print">
          <div className="absolute top-12 left-[12%] w-[380px] h-[380px] bg-[#F97316]/15 rounded-full blur-[80px]"></div>
          <div className="absolute top-[40%] right-[15%] w-[420px] h-[420px] bg-[#431407]/10 rounded-full blur-[90px]"></div>
          <div className="absolute bottom-[10%] left-[20%] w-[320px] h-[320px] bg-[#E53E3E]/5 rounded-full blur-[70px]"></div>
        </div>
      )}

      {/* Top Telemetry Info Header Ribbon */}
      <div className={`no-print border-b transition-all relative z-40 text-[11px] font-medium tracking-wide ${isGlass ? 'bg-[#1A252F] border-white/5 text-[#A0AEC0]' : 'bg-[#0A0A0C] border-[#1F1F22] text-[#8E8E93]'}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 flex flex-row justify-between items-center gap-2">
          
          <div className="flex items-center gap-3.5 flex-wrap justify-center">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="font-semibold text-rose-500 font-mono">SERVER LIVE</span>
            </span>

            <span className="hidden md:inline h-3 w-px bg-slate-700/50"></span>

            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#F97316]" />
              <span className="hidden sm:inline">Indore Central DB: </span>
              <strong className="text-white font-mono font-bold">CONNECTED</strong>
            </span>

            <span className="hidden md:inline h-3 w-px bg-slate-700/50"></span>

            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-[#E53E3E]" />
              <span className="hidden sm:inline">API Latency: </span>
              <strong className="text-white font-mono font-bold">14ms</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center font-mono">
            {currentTimeString && (
              <span className="flex items-center gap-1.5 text-[10px] text-white font-black bg-white/5 px-2 py-0.5 rounded border border-white/10 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                {currentTimeString}
              </span>
            )}
            
            <span className="hidden sm:inline h-3 w-px bg-slate-700/50"></span>

            <button 
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[10px] tracking-widest border cursor-pointer transition shadow-lg hover:-translate-y-0.5 ${
                activeTab === 'admin' 
                  ? 'bg-yellow-500 text-black border-yellow-500 shadow-yellow-500/20' 
                  : (isAdminLoggedIn 
                      ? 'bg-[#EA580C] text-white border-[#EA580C]/50 shadow-[#EA580C]/20 hover:bg-[#F97316]' 
                      : 'bg-amber-500/10 text-yellow-500 border-yellow-500/30 hover:bg-amber-500/20')
              }`}
            >
              🔑 {activeTab === 'admin' ? 'SECURE TERMINAL' : (isAdminLoggedIn ? 'ADMIN CENTER' : 'ADMIN LOGIN')}
            </button>
          </div>

        </div>
      </div>

      {/* Main App Navigation Header (Full Width Style) */}
      <div className="no-print sticky top-0 z-30 w-full transition-all duration-500 pointer-events-none">
        <header className={`pointer-events-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-b backdrop-blur-xl transition-all flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-8 ${isGlass ? 'bg-white/85 border-white/40' : 'bg-[#121214]/85 border-[#242427]/60'}`}>
            
            {/* Logo and Brand Identity */}
            <div className="flex items-center gap-3 shrink-0 group cursor-pointer pointer-events-auto" onClick={() => setActiveTab('portals')}>
              <div className={`p-2 rounded-xl shadow-lg relative border transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 ${isGlass ? 'bg-gradient-to-br from-white to-[#FFF7ED] text-[#F97316] border-[#F97316]/20' : 'bg-gradient-to-br from-[#1C1C1F] to-black text-[#EA580C] border-[#EA580C]/20'}`}>
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
                <div className={`w-3 h-3 rounded-full absolute -top-1 -right-1 animate-ping opacity-75 ${isGlass ? 'bg-[#F97316]' : 'bg-[#EA580C]'}`}></div>
                <div className={`w-3 h-3 rounded-full absolute -top-1 -right-1 ${isGlass ? 'bg-[#F97316]' : 'bg-[#EA580C]'}`}></div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <h1 className={`text-base sm:text-lg md:text-xl font-serif font-extrabold tracking-tight uppercase leading-none transition-colors ${isGlass ? 'text-[#431407]' : 'text-white'}`}>Saint Xavier Convent School</h1>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase border shadow-sm hidden sm:inline-block ${isGlass ? 'bg-[#F97316] border-[#F97316] text-white' : 'bg-[#EA580C]/20 border-[#EA580C]/30 text-[#EA580C]'}`}>PORTAL</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); speakText('Saint Xavier Convent School Portal', language); }}
                    className={`ml-2 p-1.5 rounded-full hover:bg-black/10 transition-colors ${isGlass ? 'text-[#F97316]' : 'text-white/70 hover:text-white'}`}
                    title="Listen to title"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className={`text-[10px] font-semibold tracking-wide leading-none mt-1.5 ${isGlass ? 'text-[#431407]/60' : 'text-gray-400'}`}>Indore</p>
              </div>
            </div>

            {/* Desktop Navbar Selection Removed (Moved Admin to Quick Settings) */}

            {/* Desktop Quick Settings Grouping */}
            <div className="hidden sm:flex items-center gap-3 pointer-events-auto">
              <button 
                onClick={() => { setActiveTab('admin'); }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-2 relative hover:-translate-y-0.5 ${activeTab === 'admin' 
                  ? (isGlass ? 'bg-gradient-to-r from-[#431407] to-[#5C1B04] text-white shadow-xl shadow-[#431407]/20 border border-transparent' : 'bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white shadow-lg shadow-[#EA580C]/20 border border-transparent') 
                  : (isGlass ? 'bg-white/60 text-[#431407]/70 hover:bg-white border-white/60' : 'bg-[#1C1C1F] text-gray-400 hover:bg-[#242427] hover:text-white border-[#242427]')
                }`}
              >
                <ShieldCheck className={`w-4 h-4 ${activeTab === 'admin' ? 'text-white' : (isGlass ? 'text-[#F97316]' : 'text-[#EA580C]')}`} />
                {t('adminDesk')}
              </button>
              <div className={`flex items-center gap-1 p-1 rounded-xl border shadow-sm ${isGlass ? 'bg-white/50 border-white/60' : 'bg-black/40 border-[#242427]'}`}>
                {/* Compact Theme Toggle */}
                <button 
                  onClick={() => changeTheme(isGlass ? 'original' : 'glassNavy')} 
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${isGlass ? 'bg-white shadow text-[#F97316]' : 'bg-[#1C1C1F] text-zinc-300 hover:text-white'}`}
                  title={isGlass ? 'Switch to Sunset Dark' : 'Switch to Sunrise Light'}
                >
                  {isGlass ? '☀️' : '🌙'}
                </button>
                
                <span className="w-px h-5 bg-gray-300/30 mx-1"></span>

                {/* Compact Language Toggle */}
                <div className="flex items-center gap-1">
                  {(['en', 'hi', 'ur'] as LangType[]).map((l) => (
                    <button 
                      key={l}
                      onClick={() => handleSetLanguage(l)} 
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${language === l 
                        ? (isGlass ? 'bg-[#F97316] text-white shadow-md' : 'bg-[#EA580C] text-white shadow-md') 
                        : (isGlass ? 'text-[#431407]/60 hover:bg-white' : 'text-gray-400 hover:bg-[#1C1C1F]')
                      }`}
                    >
                      {l === 'en' ? 'EN' : l === 'hi' ? 'HI' : 'UR'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multilingual Voice Command */}
              <VoiceController 
                currentLanguage={language} 
                setLanguage={handleSetLanguage} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                theme={theme} 
                setTheme={changeTheme} 
              />

              <button 
                onClick={() => setIsWhatsAppManagerOpen(!isWhatsAppManagerOpen)}
                className={`p-2 rounded-xl border transition-all hover:scale-110 ${isGlass ? 'bg-green-500/10 hover:bg-green-500 border-green-500/30 text-green-600 hover:text-white shadow-sm' : 'bg-green-500/10 hover:bg-green-500 border-green-500/30 text-green-400 hover:text-white'}`}
                title="WhatsApp Broadcast Manager"
              >
                <MessageCircle className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setIsGuidelinesOpen(!isGuidelinesOpen)}
                className={`p-2 rounded-xl border transition-all hover:rotate-12 ${isGlass ? 'bg-white/60 hover:bg-white border-white/60 text-[#431407] shadow-sm' : 'bg-[#1C1C1F] hover:bg-[#242427] border-[#242427] text-gray-300'}`}
                title="Operational Guidelines"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile View Toggle */}
            <div className="flex lg:hidden items-center gap-2 pointer-events-auto">
              <button 
                onClick={() => changeTheme(isGlass ? 'original' : 'glassNavy')} 
                className={`p-2.5 rounded-xl text-xs border shadow-sm ${isGlass ? 'bg-white/60 border-white/60 text-[#F97316]' : 'bg-[#1C1C1F] border-[#242427] text-zinc-300'}`}
                title="Swap Theme"
              >
                {isGlass ? '☀️' : '🌙'}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2.5 rounded-xl border transition-all min-h-[44px] min-w-[44px] flex items-center justify-center shadow-sm ${isGlass ? 'bg-white active:bg-gray-50 border-white/60 text-[#431407]' : 'bg-[#1C1C1F] active:bg-[#2D2D31] border-[#242427] text-gray-200'}`}
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

        </header>

        {/* Floating Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden mt-3 rounded-2xl p-4 space-y-2 shadow-2xl relative z-30 backdrop-blur-2xl border transition-all pointer-events-auto ${isGlass ? 'bg-white/95 border-white/50 text-[#431407]' : 'bg-[#121214]/95 border-[#242427] text-white'}`}>
            <p className="text-[10px] uppercase tracking-widest font-black text-[#F97316] mb-3 px-2">Module Directory</p>
            


            <button 
              onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }}
              className={`w-full px-4 py-3.5 rounded-xl text-sm font-black transition-all flex items-center justify-between min-h-[48px] border ${
                activeTab === 'admin' 
                  ? (isGlass ? 'bg-gradient-to-r from-[#431407] to-[#5C1B04] text-white border-transparent shadow-lg shadow-[#431407]/20' : 'bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white border-transparent') 
                  : (isGlass ? 'bg-white border-gray-100 hover:bg-gray-50 text-[#431407]' : 'bg-[#1C1C1F] border-[#242427] hover:bg-[#242427] text-gray-300')
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className={`w-5 h-5 ${activeTab === 'admin' ? 'text-white' : 'text-[#F97316]'}`} />
                <span>Admin Command Center</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className={`pt-4 mt-4 flex flex-wrap items-center justify-between gap-3 border-t ${isGlass ? 'border-gray-200' : 'border-white/10'}`}>
              <div className="flex gap-2">
                {(['en', 'hi', 'ur'] as LangType[]).map((l) => (
                  <button 
                    key={l}
                    onClick={() => handleSetLanguage(l)} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${language === l 
                      ? (isGlass ? 'bg-[#F97316] text-white shadow-md' : 'bg-[#EA580C] text-white shadow-md') 
                      : (isGlass ? 'bg-white border text-[#431407]/60' : 'bg-[#1C1C1F] border border-[#242427] text-gray-400')
                    }`}
                  >
                    {l === 'en' ? 'EN' : l === 'hi' ? 'HI' : 'UR'}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => { setIsGuidelinesOpen(!isGuidelinesOpen); setIsMobileMenuOpen(false); }}
                className={`text-xs py-2 px-4 rounded-xl flex items-center gap-2 font-bold border ${isGlass ? 'bg-white border-gray-200 text-[#431407]' : 'bg-[#1C1C1F] border-[#242427] text-gray-300'}`}
              >
                <HelpCircle className="w-4 h-4 text-[#F97316]" /> Guidelines
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Roster & Portal Quick Navigation Links (Public Home state only) */}
      {activeTab === 'portals' && (
        <div className={`no-print border-b transition-all relative z-10 text-[10px] sm:text-xs font-black uppercase tracking-wider select-none ${isGlass ? 'bg-white/80 backdrop-blur-md border-white/10 text-[#431407]' : 'bg-[#18181C] border-[#431407]/15 text-gray-300'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 overflow-x-auto flex gap-3 scrollbar-none items-center flex-nowrap whitespace-nowrap">
            <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mr-1 shrink-0 flex items-center gap-1">⚡ Quick Portals:</span>
            
            <button 
              type="button" 
              onClick={() => setPortalSubTab('home')} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[11px] border cursor-pointer transition shrink-0 ${
                portalSubTab === 'home' 
                  ? 'bg-[#F97316] text-white border-[#F97316] shadow-sm' 
                  : 'bg-[#F97316]/10 text-[#F97316] hover:bg-[#F97316]/20 border-[#F97316]/20'
              }`}
            >
              🏫 {t('schoolHome')}
            </button>

            <button 
              type="button" 
              onClick={() => setPortalSubTab('parent_login')} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[11px] border cursor-pointer transition shrink-0 ${
                portalSubTab === 'parent_login' 
                  ? 'bg-orange-400 text-white border-orange-400 shadow-sm' 
                  : 'bg-orange-400/10 text-orange-400 hover:bg-orange-400/20 border-orange-400/20'
              }`}
            >
              👨‍👩‍👦 {t('parentsLogin')}
            </button>

            <button 
              type="button" 
              onClick={() => setPortalSubTab('teacher_login')} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[11px] border cursor-pointer transition shrink-0 ${
                portalSubTab === 'teacher_login' 
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm' 
                  : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/20'
              }`}
            >
              👩‍🏫 {t('teacherLogin')}
            </button>

            <button 
              type="button" 
              onClick={() => setPortalSubTab('student_login')} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[11px] border cursor-pointer transition shrink-0 ${
                portalSubTab === 'student_login' 
                  ? 'bg-amber-500 text-black border-amber-500 shadow-sm font-black' 
                  : 'bg-amber-500/10 text-yellow-500 hover:bg-amber-500/20 border-yellow-500/20'
              }`}
            >
              🎒 {t('studentLogin')}
            </button>

            <span className="h-4 w-px bg-slate-700/50 shrink-0"></span>

            <button 
              type="button" 
              onClick={() => setPortalSubTabAndClose('homework')} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[11px] border cursor-pointer transition shrink-0 ${
                portalSubTab === 'homework' 
                  ? 'bg-rose-500 text-black border-rose-500 shadow-sm font-black' 
                  : 'bg-rose-500/10 text-emerald-400 hover:bg-rose-500/20 border-rose-500/20'
              }`}
            >
              📝 {t('homework')}
            </button>

            <button 
              type="button" 
              onClick={() => setPortalSubTabAndClose('digital_library')} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[11px] border cursor-pointer transition shrink-0 ${
                portalSubTab === 'digital_library' 
                  ? 'bg-blue-500 text-white border-blue-500 shadow-sm font-black' 
                  : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20'
              }`}
            >
              📚 Digital Library
            </button>

            <button 
              type="button" 
              onClick={() => setPortalSubTabAndClose('live_class')} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[11px] border cursor-pointer transition shrink-0 ${
                portalSubTab === 'live_class' 
                  ? 'bg-red-650 bg-red-600 text-white border-red-500 shadow-sm font-black' 
                  : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20'
              }`}
            >
              🎥 {t('liveClass')}
            </button>

            <button 
              type="button" 
              onClick={() => setPortalSubTabAndClose('classroom_cameras')} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[11px] border cursor-pointer transition shrink-0 ${
                portalSubTab === 'classroom_cameras' 
                  ? 'bg-purple-600 border-purple-500 text-white shadow-sm font-black' 
                  : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/20'
              }`}
            >
              👁️ {t('classroomCameras')}
            </button>

            <span className="h-4 w-px bg-slate-700/50 shrink-0"></span>

            <button 
              type="button" 
              onClick={() => setPortalSubTabAndClose('present_students')} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[11px] border cursor-pointer transition shrink-0 ${
                portalSubTab === 'present_students' 
                  ? 'bg-teal-600 text-white border-orange-400 shadow-sm font-black' 
                  : 'bg-orange-400/10 text-rose-500 hover:bg-orange-400/20 border-orange-400/20'
              }`}
            >
              🟢 {t('todayPresent')}
            </button>

            <button 
              type="button" 
              onClick={() => setPortalSubTabAndClose('absent_students')} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[11px] border cursor-pointer transition shrink-0 ${
                portalSubTab === 'absent_students' 
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm font-black' 
                  : 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-500/20'
              }`}
            >
              🔴 {t('absentStudent')}
            </button>

            <button 
              type="button" 
              onClick={() => setPortalSubTabAndClose('scholarship')} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[11px] border cursor-pointer transition shrink-0 ${
                portalSubTab === 'scholarship' 
                  ? 'bg-[#E53E3E] text-white border-[#E53E3E] shadow-sm font-black' 
                  : 'bg-red-500/10 text-red-400 hover:bg-red-500/25 border-red-500/20'
              }`}
            >
              🪙 New Scholarship
            </button>
          </div>
        </div>
      )}

      {/* Main Core Container */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col gap-6 relative z-10">

        {/* Guidelines panel description block */}
        {isGuidelinesOpen && (
          <div className={`no-print border-l-4 p-4 rounded-r-xl shadow-sm text-xs sm:text-sm animate-fade-in border-t border-b border-r transition-all ${
            isGlass 
              ? 'bg-white/70 backdrop-blur-md border-[#F97316]/40 border-l-[#F97316] text-[#431407]' 
              : 'bg-[#1C1C1F] border-[#242427] border-l-[#EA580C] text-gray-300'
          }`}>
            <h3 className={`font-bold mb-1.5 flex items-center gap-1.5 ${isGlass ? 'text-[#431407]' : 'text-white'}`}>
              <HelpCircle className="w-4 h-4 text-[#F97316]" />
              💡 Document Portal Operational Guide
            </h3>
            <ul className="list-disc list-inside space-y-1 leading-relaxed font-medium">
              <li>Use the admin dashboard command center to toggle between generating a **Student Marksheet**, **Transfer Certificate (T.C.)**, and **Admission Forms / Scholar Ledgers**.</li>
              <li>You can edit student particulars in the **editor forms on the left**, and the high-fidelity render card on the right will update in real-time.</li>
              <li>Upload passport photos in the Admissions module with drag-and-drop or browsing options.</li>
              <li>To export these as official PDF documents, click **"Print / Save PDF"**. For perfect output, select **A4 Portrait**, set **Margins as None** and confirm **"Background graphics"** is checked in your browser print settings!</li>
            </ul>
          </div>
        )}

        {/* Current Navigation Path bar */}
        <div className="no-print mt-1 flex flex-col sm:flex-row justify-between items-center pb-3 border-b border-[#431407]/10 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SXC Portal</span>
            <span className="text-slate-400 text-xs text-opacity-55">/</span>
            <span className={`text-[11px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded ${
              isGlass ? 'bg-[#431407]/10 text-[#431407]' : 'bg-white/10 text-white'
            }`}>
              {activeTab === 'portals' ? `Part 0: Academics & Portals` : `Part 1: Admin secure workstation`}
            </span>
          </div>

          <div className="text-[10px] font-mono font-bold text-slate-400/80 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            ACTIVE SESSION SECURE • PORTAL READY
          </div>
        </div>

        {/* Active view component switcher */}
        <div className="flex-1">
          {activeTab === 'portals' ? (
            <PortalsTab theme={theme} initialSubTab={portalSubTab} lang={language} />
          ) : (
            <AdminTab theme={theme} setActiveTab={setActiveTab} lang={language} />
          )}
        </div>

        <WhatsAppBroadcastManager 
          isOpen={isWhatsAppManagerOpen} 
          onClose={() => setIsWhatsAppManagerOpen(false)} 
          theme={theme} 
        />

      </main>

      {/* Portal Consolidated Footer */}
      <footer className={`no-print text-xs py-6 border-t mt-auto relative z-10 transition-all ${
        isGlass 
          ? 'bg-[#431407]/10 border-black/5 text-[#431407]/70' 
          : 'bg-[#0F0F12] text-gray-500 border-t border-[#242427]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p>© {new Date().getFullYear()} Saint Xavier Convent School. Official Internal Office Resource.</p>
            <div className="flex flex-wrap items-center gap-3.5 mt-1">
              {/* WhatsApp */}
              <a href="https://wa.me/#" target="_blank" rel="noreferrer" className="transition duration-300 hover:scale-125 hover:drop-shadow-[0_0_8px_#25D366] text-[#25D366]" title="WhatsApp">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 4.996L2 22l5.135-1.348a9.9 9.9 0 004.877 1.28h.004c5.505 0 9.989-4.478 9.99-9.985A9.97 9.97 0 0012.012 2zm5.717 14.13c-.25.705-1.45 1.283-2.008 1.37-.52.08-1.2.14-3.53-.82-2.98-1.23-4.9-4.27-5.05-4.47-.15-.2-1.2-1.6-1.2-3.05 0-1.45.75-2.15 1.02-2.43.2-.2.55-.3.85-.3l.6 1.45c.1.25.2.45.2.6 0 .15-.05.3-.15.45-.1.15-.2.25-.35.45-.15.15-.3.35-.15.6.3.5.75 1 1.3 1.5.7.6 1.3 1 2.05 1.3.25.1.45.1.65-.1.2-.25.85-1 1.08-1.35.08-.1.2-.18.33-.12l2.05.95c.2.1.35.2.43.35.07.15.07.7-.18 1.4zm0 0"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com/#" target="_blank" rel="noreferrer" className="transition duration-300 hover:scale-125 hover:drop-shadow-[0_0_8px_#FF0000] text-[#FF0000]" title="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11C4.483 20.455 12 20.455 12 20.455s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com/#" target="_blank" rel="noreferrer" className="transition duration-300 hover:scale-125 hover:drop-shadow-[0_0_8px_#E1306C] text-[#E1306C]" title="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com/#" target="_blank" rel="noreferrer" className="transition duration-300 hover:scale-125 hover:drop-shadow-[0_0_8px_#1877F2] text-[#1877F2]" title="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* Telegram */}
              <a href="https://telegram.org/#" target="_blank" rel="noreferrer" className="transition duration-300 hover:scale-125 hover:drop-shadow-[0_0_8px_#0088cc] text-[#0088cc]" title="Telegram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.74 7.57-3.27 3.61-1.5 4.36-1.76 4.85-1.77.11 0 .35.03.51.16.13.12.17.28.19.39.02.09.02.26.01.35z"/>
                </svg>
              </a>
              {/* Snapchat */}
              <a href="https://snapchat.com/#" target="_blank" rel="noreferrer" className="transition duration-300 hover:scale-125 hover:drop-shadow-[0_0_8px_#FFFC00] text-[#FFFC00]" title="Snapchat">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm4.5 12.3c0 .85-.6 1.4-1.35 1.55-.45.1-.9.15-1.35.2v.25c0 .35.15.55.45.6.35.05.7.15.9.35.15.15.2.35.1.5-.1.15-.35.2-.7.25-.95.1-1.9.15-2.85.15s-1.9-.05-2.85-.15c-.35-.05-.6-.1-.7-.25-.1-.15-.05-.35.1-.5.2-.2.55-.3.9-.35.3-.05.45-.25.45-.6v-.25c-.45-.05-.9-.1-1.35-.2-.75-.15-1.35-.7-1.35-1.55 0-.6.4-1.1.95-1.25.3-.1.4-.3.3-.6-.2-.6-.35-1.3-.35-2.05 0-2.4 1.7-4.35 4.1-4.35s4.1 1.95 4.1 4.35c0 .75-.15 1.45-.35 2.05-.1.3 0 .5.3.6.55.15.95.65.95 1.25z"/>
                </svg>
              </a>
              {/* X */}
              <a href="https://x.com/#" target="_blank" rel="noreferrer" className="transition duration-300 hover:scale-125 hover:drop-shadow-[0_0_8px_#FFFFFF] text-[#431407]/75 dark:text-[#FFFFFF]" title="X (Twitter)">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* ShareChat */}
              <a href="https://sharechat.com/#" target="_blank" rel="noreferrer" className="transition duration-300 hover:scale-125 hover:drop-shadow-[0_0_8px_#FF9933] text-[#FF9933]" title="ShareChat">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                </svg>
              </a>
              {/* Moj */}
              <a href="https://mojapp.in/#" target="_blank" rel="noreferrer" className="transition duration-300 hover:scale-125 hover:drop-shadow-[0_0_8px_#FFD700] text-[#FFD700]" title="Moj">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 12c0 1.93-1.57 3.5-3.5 3.5s-3.5-1.57-3.5-3.5 1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5z"/>
                </svg>
              </a>
              {/* Josh */}
              <a href="https://dailyjosh.in/#" target="_blank" rel="noreferrer" className="transition duration-300 hover:scale-125 hover:drop-shadow-[0_0_8px_#FF4500] text-[#FF4500]" title="Josh">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 13h-2v-6h2v6z"/>
                </svg>
              </a>
            </div>
          </div>
          <p className="flex items-center gap-1 font-mono text-[10px] mt-2 md:mt-0">
            RENDER MODE:{' '} 
            <span className={isGlass ? 'text-[#F97316] font-bold' : 'text-[#EA580C] font-bold'}>
              REACTIVE HARDWARE
            </span>{' '}
            | SSL DATA: SYNCED
          </p>
        </div>
      </footer>

    </div>
  );

  function setPortalSubTabAndClose(subTab: string) {
    setPortalSubTab(subTab);
    setIsMobileMenuOpen(false);
  }
}
