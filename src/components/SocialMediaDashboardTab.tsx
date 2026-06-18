import React, { useState } from 'react';
import { Image, Link2, RefreshCcw, Save, Share2 } from 'lucide-react';
import {
  CAMPUS_HUB_STORAGE_KEY,
  DEFAULT_CAMPUS_HUB_ITEMS,
  DEFAULT_SOCIAL_LINKS,
  SOCIAL_LINKS_STORAGE_KEY,
  loadSettings,
  saveSettings,
  type CampusHubItem,
  type SocialLinkSetting
} from '../settings';

interface SocialMediaDashboardTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange';
}

export default function SocialMediaDashboardTab({ theme = 'glassNavy' }: SocialMediaDashboardTabProps) {
  const isGlass = theme === 'glassNavy';
  const [socialLinks, setSocialLinks] = useState<SocialLinkSetting[]>(() =>
    loadSettings(SOCIAL_LINKS_STORAGE_KEY, DEFAULT_SOCIAL_LINKS)
  );
  const [campusItems, setCampusItems] = useState<CampusHubItem[]>(() =>
    loadSettings(CAMPUS_HUB_STORAGE_KEY, DEFAULT_CAMPUS_HUB_ITEMS)
  );
  const [saved, setSaved] = useState(false);

  const updateSocial = (id: string, field: keyof SocialLinkSetting, value: string) => {
    setSocialLinks(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    setSaved(false);
  };

  const updateCampus = (id: string, field: keyof CampusHubItem, value: string) => {
    setCampusItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    setSaved(false);
  };

  const handleSave = () => {
    saveSettings(SOCIAL_LINKS_STORAGE_KEY, socialLinks);
    saveSettings(CAMPUS_HUB_STORAGE_KEY, campusItems);
    setSaved(true);
  };

  const handleReset = () => {
    setSocialLinks(DEFAULT_SOCIAL_LINKS);
    setCampusItems(DEFAULT_CAMPUS_HUB_ITEMS);
    saveSettings(SOCIAL_LINKS_STORAGE_KEY, DEFAULT_SOCIAL_LINKS);
    saveSettings(CAMPUS_HUB_STORAGE_KEY, DEFAULT_CAMPUS_HUB_ITEMS);
    setSaved(true);
  };

  const panelClass = isGlass
    ? 'bg-white border-gray-100 text-[#431407]'
    : 'bg-[#0F0F12] border-[#242427] text-white';
  const inputClass = isGlass
    ? 'bg-white border-gray-200 focus:border-[#F97316]'
    : 'bg-[#18181B] border-[#2C2C2E] focus:border-rose-500 text-white';

  return (
    <div className={`p-6 sm:p-8 rounded-3xl min-h-[600px] border shadow-sm ${isGlass ? 'bg-white/70 backdrop-blur-xl border-gray-200 text-[#431407]' : 'bg-[#1C1C1F] border-[#2C2C2E] text-white'}`}>
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8 border-b pb-6 border-gray-500/10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-3">
            <Share2 className="w-8 h-8 text-pink-500" />
            Social & Campus Hub
          </h2>
          <p className="text-sm opacity-60 mt-1 font-medium">Topbar, contact area, footer links, and campus tour cards update from here.</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Saved</span>}
          <button onClick={handleReset} className="px-4 py-2 rounded-xl border text-xs font-black flex items-center gap-2 bg-white/5 hover:bg-red-500/10 text-red-500 border-red-500/20">
            <RefreshCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={handleSave} className="px-5 py-2 rounded-xl text-xs font-black flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white shadow-sm">
            <Save className="w-4 h-4" /> Save All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className={`p-5 rounded-2xl border ${panelClass}`}>
          <h3 className="text-lg font-black flex items-center gap-2 mb-5">
            <Link2 className="w-5 h-5 text-blue-500" />
            Social Media Handles
          </h3>
          <div className="space-y-4">
            {socialLinks.map(link => (
              <div key={link.id} className="grid grid-cols-1 sm:grid-cols-[130px_1fr_92px] gap-3 items-center">
                <input
                  value={link.label}
                  onChange={e => updateSocial(link.id, 'label', e.target.value)}
                  className={`px-3 py-2 rounded-xl border text-sm font-bold outline-none ${inputClass}`}
                  aria-label={`${link.id} label`}
                />
                <input
                  value={link.url}
                  onChange={e => updateSocial(link.id, 'url', e.target.value)}
                  className={`px-3 py-2 rounded-xl border text-sm font-mono outline-none ${inputClass}`}
                  aria-label={`${link.id} url`}
                />
                <input
                  value={link.color}
                  onChange={e => updateSocial(link.id, 'color', e.target.value)}
                  className={`px-3 py-2 rounded-xl border text-sm font-mono outline-none ${inputClass}`}
                  aria-label={`${link.id} color`}
                />
              </div>
            ))}
          </div>
        </section>

        <section className={`p-5 rounded-2xl border ${panelClass}`}>
          <h3 className="text-lg font-black flex items-center gap-2 mb-5">
            <Image className="w-5 h-5 text-emerald-500" />
            Campus Tour Video Hub Cards
          </h3>
          <div className="space-y-5">
            {campusItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[112px_1fr] gap-4 pb-5 border-b border-gray-500/10 last:border-b-0 last:pb-0">
                <img src={item.imageUrl} alt={item.title} className="w-full sm:w-28 aspect-video object-cover rounded-xl border border-gray-500/20" />
                <div className="space-y-3">
                  <input
                    value={item.title}
                    onChange={e => updateCampus(item.id, 'title', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-sm font-bold outline-none ${inputClass}`}
                    aria-label={`Campus card ${index + 1} title`}
                  />
                  <textarea
                    value={item.description}
                    onChange={e => updateCampus(item.id, 'description', e.target.value)}
                    rows={2}
                    className={`w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none ${inputClass}`}
                    aria-label={`Campus card ${index + 1} description`}
                  />
                  <input
                    value={item.imageUrl}
                    onChange={e => updateCampus(item.id, 'imageUrl', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono outline-none ${inputClass}`}
                    aria-label={`Campus card ${index + 1} image url`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
