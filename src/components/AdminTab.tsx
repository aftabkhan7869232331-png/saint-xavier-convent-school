import React, { useState } from 'react';
import type { ActiveTab } from '../types';
import { ShieldCheck, Award, FileText, UserPlus, BookOpen, Cloud, Camera, ChevronLeft, LogOut, BadgeCheck, Video, Megaphone, Lock, Users, Share2 } from 'lucide-react';
import { getTranslation } from '../utils/locale';

import MarksheetTab from './MarksheetTab';
import TCTab from './TCTab';
import AdmissionTab from './AdmissionTab';
import ScholarTab from './ScholarTab';
import ScholarRegisterTab from './ScholarRegisterTab';
import ERPTab from './ERPTab';
import CameraSystemTab from './CameraSystemTab';
import IDCardGeneratorTab from './IDCardGeneratorTab';
import CampusTourTab from './CampusTourTab';

import AnnouncementsTab from './AnnouncementsTab';
import UserSecurityTab from './UserSecurityTab';
import SocialMediaDashboardTab from './SocialMediaDashboardTab';

interface AdminTabProps {
  theme: 'original' | 'glassNavy' | 'sunriseOrange';
  setActiveTab: (tab: ActiveTab) => void;
  lang?: any;
}

type AdminTool = 'dashboard' | 'marksheet' | 'tc' | 'admission' | 'scholar' | 'scholar_register' | 'erp' | 'camera' | 'id_card' | 'campus_tour' | 'social_media' | 'announcements' | 'security';

export default function AdminTab({ theme, setActiveTab, lang = 'en' }: AdminTabProps) {
  const isGlass = theme === 'glassNavy';

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('sxc_admin_session') === 'active';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [activeTool, setActiveTool] = useState<AdminTool>('dashboard');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Head@saintxavierconventschool.com' && password === 'Saint@1990') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('sxc_admin_session', 'active');
      window.dispatchEvent(new Event('sxc_admin_login_changed'));
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('sxc_admin_session');
    window.dispatchEvent(new Event('sxc_admin_login_changed'));
    setActiveTool('dashboard');
  };

  if (!isAdminLoggedIn) {
    return (
      <div className={`p-8 rounded-2xl max-w-md mx-auto mt-10 ${isGlass ? 'bg-white/80 backdrop-blur-xl shadow-xl border border-white/20 text-[#431407]' : 'bg-[#1C1C1F] border border-[#242427] text-white'}`}>
        <div className="flex flex-col items-center mb-6">
          <ShieldCheck className="w-12 h-12 text-rose-500 mb-2" />
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <p className="text-sm opacity-60">Secured Access Only</p>
        </div>
        {error && <p className="text-red-500 text-sm mb-4 text-center font-bold">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1 opacity-80">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className={`w-full p-3 rounded-xl border font-mono text-sm outline-none transition ${isGlass ? 'bg-white/50 border-gray-200 focus:border-[#F97316]' : 'bg-[#0F0F12] border-[#242427] focus:border-rose-500 text-white'}`} placeholder="Enter admin username" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 opacity-80">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={`w-full p-3 rounded-xl border font-mono text-sm outline-none transition ${isGlass ? 'bg-white/50 border-gray-200 focus:border-[#F97316]' : 'bg-[#0F0F12] border-[#242427] focus:border-rose-500 text-white'}`} placeholder="Enter admin password" />
          </div>
          <button type="submit" className={`w-full py-3.5 mt-2 text-white font-black rounded-xl transition ${isGlass ? 'bg-[#F97316] hover:bg-[#2C7A7B]' : 'bg-rose-500 hover:bg-emerald-600'}`}>
            AUTHENTICATE
          </button>
        </form>
      </div>
    );
  }

  // Dashboard grid of tools
  if (activeTool === 'dashboard') {
    const tools = [
      { id: 'marksheet', label: 'Marksheet Builder', icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'hover:border-amber-500/50' },
      { id: 'tc', label: 'TC Engine', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/50' },
      { id: 'admission', label: 'Admission CRM', icon: UserPlus, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'hover:border-rose-500/50' },
      { id: 'scholar', label: 'Scholar Ledger', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'hover:border-purple-500/50' },
      { id: 'scholar_register', label: 'Scholar Register', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/50' },
      { id: 'erp', label: 'Cloud ERP + LMS', icon: Cloud, color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'hover:border-cyan-500/50' },
      { id: 'camera', label: 'AI Camera System', icon: Camera, color: 'text-red-500', bg: 'bg-red-500/10', border: 'hover:border-red-500/50' },
      { id: 'id_card', label: 'ID Card Generator', icon: BadgeCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'hover:border-indigo-500/50' },
      { id: 'campus_tour', label: 'Campus Tours', icon: Video, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'hover:border-pink-500/50' },
      { id: 'social_media', label: 'Social & Campus Hub', icon: Share2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/50' },
      { id: 'announcements', label: 'Announcements', icon: Megaphone, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'hover:border-orange-500/50' },
      { id: 'security', label: 'User Security', icon: Lock, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'hover:border-indigo-500/50' },
    ] as const;

    return (
      <div className={`p-6 sm:p-8 rounded-3xl min-h-[600px] shadow-sm border ${isGlass ? 'bg-white/70 backdrop-blur-xl text-[#431407] border-white' : 'bg-[#0A0A0C] text-white border-[#1F1F22]'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b pb-6 border-gray-500/20">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isGlass ? 'bg-rose-500/10' : 'bg-rose-500/20'}`}>
                <ShieldCheck className="w-7 h-7 text-rose-500" />
              </div>
              Master Admin Dashboard
            </h2>
            <p className="text-sm opacity-70 mt-2 font-medium">Select a restricted module below to manage school operations.</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 font-bold transition border border-red-500/20">
            <LogOut className="w-4 h-4" /> Terminate Session
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as AdminTool)}
              className={`p-6 rounded-2xl border text-left transition-all hover:scale-[1.02] hover:-translate-y-1 ${tool.border} ${isGlass ? 'bg-white hover:shadow-xl border-gray-100' : 'bg-[#18181B] hover:bg-[#202024] border-[#2C2C2E]'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${tool.bg} ${tool.color}`}>
                <tool.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">{tool.label}</h3>
              <p className="text-xs opacity-60 font-medium leading-relaxed">Secured access to manage and export {tool.label.toLowerCase()} records and settings.</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Active Tool View
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Admin Topbar for returning to dashboard */}
      <div className={`no-print flex justify-between items-center p-4 rounded-2xl border shadow-sm ${isGlass ? 'bg-white/80 backdrop-blur-md border-gray-200 text-[#431407]' : 'bg-[#18181B] border-[#2C2C2E] text-white'}`}>
        <button onClick={() => setActiveTool('dashboard')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition border ${isGlass ? 'bg-white hover:bg-gray-50 border-gray-200' : 'bg-[#242427] hover:bg-[#2C2C2E] border-[#3F3F46]'}`}>
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </button>
        <div className="text-xs font-black tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          ADMIN SECURE MODE
        </div>
      </div>

      {/* Render the selected tool */}
      <div className="flex-1">
        {activeTool === 'marksheet' && <MarksheetTab theme={theme} />}
        {activeTool === 'tc' && <TCTab theme={theme} />}
        { activeTool === 'admission' && <AdmissionTab theme={theme} /> }
        { activeTool === 'scholar' && <ScholarTab theme={theme} lang={lang} /> }
        { activeTool === 'scholar_register' && <ScholarRegisterTab theme={theme} /> }
        { activeTool === 'erp' && <ERPTab theme={theme} /> }
        {activeTool === 'camera' && <CameraSystemTab />}
        {activeTool === 'id_card' && <IDCardGeneratorTab theme={theme} />}
        {activeTool === 'campus_tour' && <CampusTourTab theme={theme} />}
        {activeTool === 'social_media' && <SocialMediaDashboardTab theme={theme} />}
        {activeTool === 'announcements' && <AnnouncementsTab theme={theme} />}
        {activeTool === 'security' && <UserSecurityTab theme={theme} />}
      </div>
    </div>
  );
}
