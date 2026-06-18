import React, { useState, useEffect } from 'react';
import type { ActiveTab } from './types';
import PortalsTab from './components/PortalsTab';
import AdminTab from './components/AdminTab';
import WhatsAppBroadcastManager from './components/WhatsAppBroadcastManager';
import SocialMediaHandlerTab from './components/SocialMediaHandlerTab';
import VoiceController from './components/VoiceController';
import { LangType } from './utils/locale';
import { useTranslation } from 'react-i18next';
import { speakText } from './utils/tts';
import {
  DEFAULT_SOCIAL_LINKS,
  SOCIAL_LINKS_STORAGE_KEY,
  getSocialIcon,
  loadSettings,
  type SocialLinkSetting
} from './settings';
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
  const [isSocialHandlerOpen, setIsSocialHandlerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'original' | 'glassNavy' | 'sunriseOrange'>(() => {
    return (localStorage.getItem('sxc_portal_theme') as 'original' | 'glassNavy' | 'sunriseOrange') || 'glassNavy';
  });
  const [currentTimeString, setCurrentTimeString] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('sxc_admin_session') === 'active';
  });
  const [socialLinks, setSocialLinks] = useState<SocialLinkSetting[]>(() =>
    loadSettings(SOCIAL_LINKS_STORAGE_KEY, DEFAULT_SOCIAL_LINKS)
  );
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
    const handlePublicSettingsChange = () => {
      setSocialLinks(loadSettings(SOCIAL_LINKS_STORAGE_KEY, DEFAULT_SOCIAL_LINKS));
    };
    window.addEventListener('sxc_public_settings_changed', handlePublicSettingsChange);

    return () => {
      window.removeEventListener('sxc_admin_login_changed', checkAdminSession);
      window.removeEventListener('sxc_portal_lang_changed', handleLangChangeTrigger);
      window.removeEventListener('sxc_public_settings_changed', handlePublicSettingsChange);
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
                onClick={() => setIsSocialHandlerOpen(true)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 hover:scale-105 ${isGlass ? 'bg-pink-500/10 hover:bg-pink-500 border border-pink-500/30 text-pink-600 hover:text-white shadow-sm' : 'bg-pink-500/10 hover:bg-pink-500 border border-pink-500/30 text-pink-400 hover:text-white'}`}
                title="Social Media Handler — manage WhatsApp, social links, weekly posts & activity"
              >
                <Activity className="w-4 h-4" />
                Social Handler
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

            <button 
              onClick={() => { setIsSocialHandlerOpen(true); setIsMobileMenuOpen(false); }}
              className={`w-full px-4 py-3.5 rounded-xl text-sm font-black transition-all flex items-center justify-between min-h-[48px] border ${isGlass ? 'bg-white border-gray-100 hover:bg-gray-50 text-[#431407]' : 'bg-[#1C1C1F] border-[#242427] hover:bg-[#242427] text-gray-300'}`}
            >
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-pink-500" />
                <span>Social Media Handler</span>
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

        {isSocialHandlerOpen && (
          <SocialMediaHandlerTab
            theme={theme}
            onClose={() => setIsSocialHandlerOpen(false)}
            onOpenWhatsAppBroadcast={() => {
              setIsSocialHandlerOpen(false);
              setIsWhatsAppManagerOpen(true);
            }}
          />
        )}

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
              {socialLinks.filter(link => link.url.trim()).map(link => {
                const Icon = getSocialIcon(link.id);
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="transition duration-300 hover:scale-125"
                    style={{ color: link.color }}
                    title={link.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
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
