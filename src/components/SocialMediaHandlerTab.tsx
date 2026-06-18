import React, { useEffect, useState } from 'react';
import {
  Activity, Image as ImageIcon, Video, LogOut, Lock, User,
  Plus, Trash2, RefreshCcw, Clock, X, Link2, Save
} from 'lucide-react';
import {
  DEFAULT_SOCIAL_LINKS,
  SOCIAL_LINKS_STORAGE_KEY,
  getSocialIcon,
  loadSettings,
  saveSettings,
  type SocialLinkSetting
} from '../settings';

interface SocialMediaHandlerTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange';
  onClose: () => void;
  onOpenWhatsAppBroadcast?: () => void;
}

const API_BASE = 'http://localhost:3001/api/social';
const SESSION_KEY = 'sxc_social_handler_token';

interface WeeklyImageItem {
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
  weekLabel: string;
  createdAt: string;
}

interface WeeklyVideoItem {
  id: string;
  title: string;
  videoUrl: string;
  caption: string;
  weekLabel: string;
  createdAt: string;
}

interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
}

type SocialData = {
  weeklyImages: WeeklyImageItem[];
  weeklyVideos: WeeklyVideoItem[];
  activityLog: ActivityItem[];
};

export default function SocialMediaHandlerTab({ theme = 'glassNavy', onClose, onOpenWhatsAppBroadcast }: SocialMediaHandlerTabProps) {
  const isGlass = theme === 'glassNavy';

  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(SESSION_KEY));
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [data, setData] = useState<SocialData>({ weeklyImages: [], weeklyVideos: [], activityLog: [] });
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const [activeSection, setActiveSection] = useState<'links' | 'images' | 'videos' | 'activity'>('links');

  // Social links (WhatsApp/YouTube/Instagram/Facebook/Telegram/X) — now managed only inside the handler
  const [socialLinks, setSocialLinks] = useState<SocialLinkSetting[]>(() =>
    loadSettings(SOCIAL_LINKS_STORAGE_KEY, DEFAULT_SOCIAL_LINKS)
  );
  const [linksSaved, setLinksSaved] = useState(false);

  // Form state for adding new entries
  const [newImage, setNewImage] = useState({ title: '', imageUrl: '', caption: '', weekLabel: '' });
  const [newVideo, setNewVideo] = useState({ title: '', videoUrl: '', caption: '', weekLabel: '' });

  const panelClass = isGlass
    ? 'bg-white border-gray-100 text-[#431407]'
    : 'bg-[#0F0F12] border-[#242427] text-white';
  const inputClass = isGlass
    ? 'bg-white border-gray-200 focus:border-[#F97316]'
    : 'bg-[#18181B] border-[#2C2C2E] focus:border-rose-500 text-white';

  const authHeaders = (): HeadersInit => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  });

  const loadData = async (activeToken: string) => {
    setIsLoadingData(true);
    setFetchError('');
    try {
      const res = await fetch(`${API_BASE}/data`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (res.status === 401) {
        // Session expired — force re-login
        sessionStorage.removeItem(SESSION_KEY);
        setToken(null);
        setFetchError('Session expired. Please log in again.');
        return;
      }
      if (!res.ok) throw new Error('Failed to load dashboard data');
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setFetchError(e?.message || 'Could not reach the server. Make sure the backend is running on port 3001.');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) loadData(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: loginId, password: loginPassword })
      });
      const json = await res.json();
      if (!res.ok) {
        setLoginError(json.error || 'Invalid credentials.');
        return;
      }
      sessionStorage.setItem(SESSION_KEY, json.token);
      setToken(json.token);
      setLoginPassword('');
    } catch {
      setLoginError('Could not reach the server. Make sure the backend is running on port 3001.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch(`${API_BASE}/logout`, { method: 'POST', headers: authHeaders() });
      } catch {
        // ignore network errors on logout
      }
    }
    sessionStorage.removeItem(SESSION_KEY);
    setToken(null);
  };

  const addImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newImage.imageUrl.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/images`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(newImage)
      });
      if (!res.ok) throw new Error('Failed to add image');
      const item = await res.json();
      setData(prev => ({ ...prev, weeklyImages: [item, ...prev.weeklyImages] }));
      setNewImage({ title: '', imageUrl: '', caption: '', weekLabel: '' });
      loadData(token); // refresh activity log too
    } catch (e: any) {
      setFetchError(e?.message || 'Could not add image.');
    }
  };

  const deleteImage = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/images/${id}`, { method: 'DELETE', headers: authHeaders() });
      setData(prev => ({ ...prev, weeklyImages: prev.weeklyImages.filter(i => i.id !== id) }));
      loadData(token);
    } catch {
      setFetchError('Could not delete image.');
    }
  };

  const addVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newVideo.videoUrl.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/videos`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(newVideo)
      });
      if (!res.ok) throw new Error('Failed to add video');
      const item = await res.json();
      setData(prev => ({ ...prev, weeklyVideos: [item, ...prev.weeklyVideos] }));
      setNewVideo({ title: '', videoUrl: '', caption: '', weekLabel: '' });
      loadData(token);
    } catch (e: any) {
      setFetchError(e?.message || 'Could not add video.');
    }
  };

  const deleteVideo = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/videos/${id}`, { method: 'DELETE', headers: authHeaders() });
      setData(prev => ({ ...prev, weeklyVideos: prev.weeklyVideos.filter(v => v.id !== id) }));
      loadData(token);
    } catch {
      setFetchError('Could not delete video.');
    }
  };

  const updateSocialLink = (id: string, field: keyof SocialLinkSetting, value: string) => {
    setSocialLinks(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    setLinksSaved(false);
  };

  const saveSocialLinks = () => {
    saveSettings(SOCIAL_LINKS_STORAGE_KEY, socialLinks);
    setLinksSaved(true);
    if (token) {
      fetch(`${API_BASE}/activity`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ action: 'SOCIAL_LINKS_UPDATED', detail: 'Topbar & footer social handles updated' })
      }).then(() => loadData(token)).catch(() => {});
    }
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  // ---------------- Login screen ----------------
  if (!token) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className={`relative w-full max-w-md p-8 rounded-3xl shadow-2xl border ${isGlass ? 'bg-white text-[#431407] border-white/40' : 'bg-[#18181B] text-white border-[#2C2C2E]'}`}>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10">
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-3">
              <Activity className="w-7 h-7 text-pink-500" />
            </div>
            <h2 className="text-2xl font-black">Social Media Handler</h2>
            <p className="text-sm opacity-60 mt-1 text-center">Separate secured login for weekly content & activity control</p>
          </div>
          {loginError && <p className="text-red-500 text-sm mb-4 text-center font-bold">{loginError}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1 opacity-80">Handler ID</label>
              <div className={`flex items-center gap-2 px-3 rounded-xl border ${inputClass}`}>
                <User className="w-4 h-4 opacity-50" />
                <input
                  type="text"
                  value={loginId}
                  onChange={e => setLoginId(e.target.value)}
                  className="w-full py-3 bg-transparent outline-none font-mono text-sm"
                  placeholder="Enter handler ID"
                  autoComplete="username"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 opacity-80">Password</label>
              <div className={`flex items-center gap-2 px-3 rounded-xl border ${inputClass}`}>
                <Lock className="w-4 h-4 opacity-50" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full py-3 bg-transparent outline-none font-mono text-sm"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 mt-2 text-white font-black rounded-xl transition bg-pink-500 hover:bg-pink-600 disabled:opacity-60"
            >
              {isLoggingIn ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
            </button>
          </form>
          <p className="text-[10px] opacity-50 mt-4 text-center">
            Requires the backend server running on port 3001.
          </p>
        </div>
      </div>
    );
  }

  // ---------------- Dashboard ----------------
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 py-8">
      <div className={`relative w-full max-w-5xl rounded-3xl shadow-2xl border ${isGlass ? 'bg-white text-[#431407] border-white/40' : 'bg-[#18181B] text-white border-[#2C2C2E]'}`}>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 sm:p-8 border-b border-gray-500/10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-500/10">
                <Activity className="w-7 h-7 text-pink-500" />
              </div>
              Social Media Handler
            </h2>
            <p className="text-sm opacity-60 mt-1 font-medium">Weekly images, videos & live activity control</p>
          </div>
          <div className="flex items-center gap-2">
            {onOpenWhatsAppBroadcast && (
              <button onClick={onOpenWhatsAppBroadcast} className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 text-green-600 rounded-xl hover:bg-green-500/20 font-bold transition border border-green-500/20" title="Open WhatsApp Broadcast Manager">
                <Activity className="w-4 h-4" /> WhatsApp Broadcast
              </button>
            )}
            <button onClick={() => loadData(token)} className={`p-2.5 rounded-xl border ${isGlass ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' : 'bg-[#1C1C1F] border-[#2C2C2E] hover:bg-[#242427]'}`} title="Refresh">
              <RefreshCcw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 font-bold transition border border-red-500/20">
              <LogOut className="w-4 h-4" /> Logout
            </button>
            <button onClick={onClose} className="p-2.5 rounded-xl hover:bg-black/10">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {fetchError && (
          <div className="mx-6 sm:mx-8 mt-4 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-bold">
            {fetchError}
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex gap-2 px-6 sm:px-8 pt-6 flex-wrap">
          {[
            { id: 'links', label: 'Social Links', icon: Link2, count: socialLinks.filter(l => l.url.trim()).length },
            { id: 'images', label: 'Weekly Images', icon: ImageIcon, count: data.weeklyImages.length },
            { id: 'videos', label: 'Weekly Videos', icon: Video, count: data.weeklyVideos.length },
            { id: 'activity', label: 'Activity Log', icon: Clock, count: data.activityLog.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition border ${
                activeSection === tab.id
                  ? 'bg-pink-500 text-white border-pink-500'
                  : (isGlass ? 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100' : 'bg-[#1C1C1F] text-gray-300 border-[#2C2C2E] hover:bg-[#242427]')
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeSection === tab.id ? 'bg-white/20' : 'bg-black/10'}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {/* ----- Social Links Section ----- */}
          {activeSection === 'links' && (
            <div className={`p-5 rounded-2xl border ${panelClass}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                <h3 className="text-sm font-black flex items-center gap-2"><Link2 className="w-4 h-4 text-pink-500" /> WhatsApp, YouTube, Instagram, Facebook & more</h3>
                <div className="flex items-center gap-2">
                  {linksSaved && <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Saved</span>}
                  <button onClick={saveSocialLinks} className="px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white shadow-sm">
                    <Save className="w-4 h-4" /> Save Links
                  </button>
                </div>
              </div>
              <p className="text-xs opacity-60 mb-5">These handles power the topbar and footer icons site-wide. Leave the URL blank to hide an icon from the public site.</p>
              <div className="space-y-3">
                {socialLinks.map(link => {
                  const Icon = getSocialIcon(link.id);
                  return (
                    <div key={link.id} className="grid grid-cols-1 sm:grid-cols-[40px_110px_1fr_90px] gap-3 items-center">
                      <div className="hidden sm:flex items-center justify-center" style={{ color: link.color }}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <input
                        value={link.label}
                        onChange={e => updateSocialLink(link.id, 'label', e.target.value)}
                        className={`px-3 py-2 rounded-xl border text-sm font-bold outline-none ${inputClass}`}
                        aria-label={`${link.id} label`}
                      />
                      <input
                        value={link.url}
                        onChange={e => updateSocialLink(link.id, 'url', e.target.value)}
                        placeholder="https://..."
                        className={`px-3 py-2 rounded-xl border text-sm font-mono outline-none ${inputClass}`}
                        aria-label={`${link.id} url`}
                      />
                      <input
                        value={link.color}
                        onChange={e => updateSocialLink(link.id, 'color', e.target.value)}
                        className={`px-3 py-2 rounded-xl border text-sm font-mono outline-none ${inputClass}`}
                        aria-label={`${link.id} color`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ----- Images Section ----- */}
          {activeSection === 'images' && (
            <div className="space-y-6">
              <form onSubmit={addImage} className={`p-5 rounded-2xl border ${panelClass}`}>
                <h3 className="text-sm font-black mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-pink-500" /> Add Weekly Image</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={newImage.title} onChange={e => setNewImage(p => ({ ...p, title: e.target.value }))} placeholder="Title" className={`px-3 py-2.5 rounded-xl border text-sm outline-none ${inputClass}`} />
                  <input value={newImage.weekLabel} onChange={e => setNewImage(p => ({ ...p, weekLabel: e.target.value }))} placeholder="Week label (e.g. Week 24, 2026)" className={`px-3 py-2.5 rounded-xl border text-sm outline-none ${inputClass}`} />
                  <input value={newImage.imageUrl} onChange={e => setNewImage(p => ({ ...p, imageUrl: e.target.value }))} placeholder="Image URL" className={`sm:col-span-2 px-3 py-2.5 rounded-xl border text-sm font-mono outline-none ${inputClass}`} />
                  <textarea value={newImage.caption} onChange={e => setNewImage(p => ({ ...p, caption: e.target.value }))} placeholder="Caption" rows={2} className={`sm:col-span-2 px-3 py-2.5 rounded-xl border text-sm outline-none resize-none ${inputClass}`} />
                </div>
                <button type="submit" className="mt-3 px-5 py-2.5 rounded-xl text-sm font-black bg-pink-500 hover:bg-pink-600 text-white">Add Image</button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.weeklyImages.map(img => (
                  <div key={img.id} className={`rounded-2xl border overflow-hidden ${panelClass}`}>
                    {img.imageUrl && <img src={img.imageUrl} alt={img.title} className="w-full aspect-video object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                    <div className="p-4">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm">{img.title}</h4>
                        <button onClick={() => deleteImage(img.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {img.weekLabel && <p className="text-[10px] font-black uppercase tracking-wide text-pink-500 mt-1">{img.weekLabel}</p>}
                      {img.caption && <p className="text-xs opacity-70 mt-2">{img.caption}</p>}
                    </div>
                  </div>
                ))}
                {data.weeklyImages.length === 0 && <p className="text-sm opacity-50 col-span-full text-center py-8">No weekly images added yet.</p>}
              </div>
            </div>
          )}

          {/* ----- Videos Section ----- */}
          {activeSection === 'videos' && (
            <div className="space-y-6">
              <form onSubmit={addVideo} className={`p-5 rounded-2xl border ${panelClass}`}>
                <h3 className="text-sm font-black mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-pink-500" /> Add Weekly Video</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={newVideo.title} onChange={e => setNewVideo(p => ({ ...p, title: e.target.value }))} placeholder="Title" className={`px-3 py-2.5 rounded-xl border text-sm outline-none ${inputClass}`} />
                  <input value={newVideo.weekLabel} onChange={e => setNewVideo(p => ({ ...p, weekLabel: e.target.value }))} placeholder="Week label (e.g. Week 24, 2026)" className={`px-3 py-2.5 rounded-xl border text-sm outline-none ${inputClass}`} />
                  <input value={newVideo.videoUrl} onChange={e => setNewVideo(p => ({ ...p, videoUrl: e.target.value }))} placeholder="Video URL (YouTube link, etc.)" className={`sm:col-span-2 px-3 py-2.5 rounded-xl border text-sm font-mono outline-none ${inputClass}`} />
                  <textarea value={newVideo.caption} onChange={e => setNewVideo(p => ({ ...p, caption: e.target.value }))} placeholder="Caption" rows={2} className={`sm:col-span-2 px-3 py-2.5 rounded-xl border text-sm outline-none resize-none ${inputClass}`} />
                </div>
                <button type="submit" className="mt-3 px-5 py-2.5 rounded-xl text-sm font-black bg-pink-500 hover:bg-pink-600 text-white">Add Video</button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.weeklyVideos.map(vid => (
                  <div key={vid.id} className={`rounded-2xl border p-4 ${panelClass}`}>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-sm">{vid.title}</h4>
                      <button onClick={() => deleteVideo(vid.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {vid.weekLabel && <p className="text-[10px] font-black uppercase tracking-wide text-pink-500 mt-1">{vid.weekLabel}</p>}
                    <a href={vid.videoUrl} target="_blank" rel="noreferrer" className="text-xs font-mono text-blue-500 break-all block mt-2 hover:underline">{vid.videoUrl}</a>
                    {vid.caption && <p className="text-xs opacity-70 mt-2">{vid.caption}</p>}
                  </div>
                ))}
                {data.weeklyVideos.length === 0 && <p className="text-sm opacity-50 col-span-full text-center py-8">No weekly videos added yet.</p>}
              </div>
            </div>
          )}

          {/* ----- Activity Log Section ----- */}
          {activeSection === 'activity' && (
            <div className={`rounded-2xl border ${panelClass}`}>
              <div className="divide-y divide-gray-500/10">
                {data.activityLog.map(a => (
                  <div key={a.id} className="flex items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                      <div>
                        <p className="text-sm font-bold">{a.action.replace(/_/g, ' ')}</p>
                        {a.detail && <p className="text-xs opacity-60">{a.detail}</p>}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono opacity-50 shrink-0">{formatTime(a.timestamp)}</span>
                  </div>
                ))}
                {data.activityLog.length === 0 && <p className="text-sm opacity-50 text-center py-8">No activity recorded yet.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
