import React, { useState } from 'react';
import { Camera, RefreshCw, Layers, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function CameraSystemTab() {
  const [selectedCam, setSelectedCam] = useState<number | null>(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[08:31:02] CAM-01 Class VI-A: Lesson Feed Started.',
    '[09:12:15] CAM-03 Class VIII-B: Focus detected on tutor board.',
    '[10:04:42] CAM-02 Class V-A: Attendance checked. 26/26 present.',
    '[11:15:20] CAM-04 Class VII-C: Classroom safety audit completed.',
    '[12:02:11] SYSTEM: AI engagement optimizer synced'
  ]);

  const [cameraFeeds, setCameraFeeds] = useState<{id: number, name: string, floor: string, details: string}[]>(() => {
    const saved = localStorage.getItem('sxc_cameras');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, name: 'Class V-A Front', floor: '1st Floor, Wing A', details: 'Engagement Index: 92% • Active' },
      { id: 2, name: 'Class VI-B Right', floor: '1st Floor, Wing B', details: 'Engagement Index: 88% • Active' },
      { id: 3, name: 'Class VII-A Main', floor: '2nd Floor, Wing A', details: 'Board Visibility: 99% • Active' },
      { id: 4, name: 'Class VIII-C Rear', floor: '2nd Floor, Wing C', details: 'Pupil Scan Complete • Active' },
      { id: 5, name: 'Pre-Primary Play Area', floor: 'Ground Floor', details: 'Outdoor activity focus • Active' },
      { id: 6, name: 'Chemistry Laboratory', floor: 'Basement Lab Area', details: 'Safety parameters clear • Active' }
    ];
  });

  const [newCamName, setNewCamName] = useState('');
  const [newCamFloor, setNewCamFloor] = useState('');

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLogs(prev => [
        `[${new Date().toLocaleTimeString('en-US', { hour12: false })}] CAM-Auto: Optimizing surveillance matrices...`,
        ...prev.slice(0, 5)
      ]);
    }, 800);
  };

  const handleAddCamera = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamName || !newCamFloor) return;
    const newId = cameraFeeds.length > 0 ? Math.max(...cameraFeeds.map(c => c.id)) + 1 : 1;
    const newFeed = { id: newId, name: newCamName, floor: newCamFloor, details: 'Newly Added • Active' };
    const updated = [...cameraFeeds, newFeed];
    setCameraFeeds(updated);
    localStorage.setItem('sxc_cameras', JSON.stringify(updated));
    setNewCamName('');
    setNewCamFloor('');
  };

  const handleDeleteCamera = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = cameraFeeds.filter(c => c.id !== id);
    setCameraFeeds(updated);
    localStorage.setItem('sxc_cameras', JSON.stringify(updated));
    if (selectedCam === id) setSelectedCam(null);
  };

  return (
    <div className="p-6 rounded-3xl min-h-[600px] bg-black border border-zinc-800 text-white shadow-2xl flex flex-col gap-6">
      
      {/* CCTV Top section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2 text-indigo-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            Surveillance & AI Analytics Feed
          </h2>
          <p className="text-xs text-zinc-400 font-medium">Saint Xavier campus safety & real-time classroom analytics registry.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <form onSubmit={handleAddCamera} className="flex gap-2">
            <input type="text" value={newCamName} onChange={e => setNewCamName(e.target.value)} placeholder="Camera Name" className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs outline-none focus:border-indigo-500" required />
            <input type="text" value={newCamFloor} onChange={e => setNewCamFloor(e.target.value)} placeholder="Location/Floor" className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs outline-none focus:border-indigo-500" required />
            <button type="submit" className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-xs font-bold transition text-white">Add</button>
          </form>
          <button 
            onClick={triggerRefresh}
            className={`px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 rounded-lg text-xs font-bold font-mono text-zinc-300 flex items-center gap-1.5 transition ${isRefreshing ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Feeds
          </button>
        </div>
      </div>

      {/* Main grids layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Cam views grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cameraFeeds.length === 0 && <div className="text-zinc-500 text-sm italic col-span-2 text-center py-8">No cameras registered.</div>}
            {cameraFeeds.map((feed) => {
              const isSelected = selectedCam === feed.id;
              return (
                <div 
                  key={feed.id}
                  onClick={() => setSelectedCam(feed.id)}
                  className={`relative rounded-xl overflow-hidden aspect-video border transition-all cursor-pointer group ${
                    isSelected ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)] scale-[1.01]' : 'border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <button onClick={(e) => handleDeleteCamera(feed.id, e)} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition z-10 text-red-500 hover:bg-red-500 hover:text-white">✕</button>
                  {/* Blurred simulated canvas feed with text */}
                  <div className="absolute inset-0 bg-zinc-900/90 flex flex-col items-center justify-center p-4 text-center">
                    <Camera className="w-8 h-8 opacity-30 text-zinc-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black tracking-wider text-zinc-200">{feed.name}</span>
                    <span className="text-[9px] text-zinc-500">{feed.floor}</span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center text-[10px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      REC CAM-0{feed.id}
                    </span>
                    <span className="text-[8px] font-bold text-rose-500">{feed.details.split('•')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Diagnostics & AI Telemetry Logs */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between max-h-[420px] lg:max-h-none overflow-y-auto">
          <div>
            <div className="flex items-center gap-1.5 pb-2.5 mb-3 border-b border-zinc-800 text-zinc-300 font-bold uppercase tracking-wider text-xs">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Surveillance Telemetry Logs</span>
            </div>
            
            <div className="space-y-2 max-h-[220px] lg:max-h-none overflow-y-auto font-mono text-[9px] text-zinc-400 leading-normal scrollbar-none">
              {logs.map((log, i) => (
                <div key={i} className="p-1 px-1.5 bg-zinc-940 border-l border-zinc-700 hover:text-white transition-colors">
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2.5">
            <h4 className="text-[10px] uppercase font-bold text-red-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Campus safety compliant
            </h4>
            <p className="text-[9px] text-zinc-400 leading-relaxed font-mono">Surveillance footage is processed strictly on-premise at Saint Xavier School, Indore. AI face mappings are encrypted using AES-256 protocols and stored on local servers.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
