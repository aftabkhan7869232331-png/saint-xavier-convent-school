import React, { useState, useEffect } from 'react';
import { Megaphone, Trash2, Edit3, PlusCircle } from 'lucide-react';

interface AnnouncementsTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange';
}

export interface AnnouncementType {
  id: string;
  title: string;
  message: string;
  date: string;
  isUrgent: boolean;
}

export default function AnnouncementsTab({ theme = 'glassNavy' }: AnnouncementsTabProps) {
  const isGlass = theme === 'glassNavy';
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sxc_announcements');
    if (saved) {
      try {
        setAnnouncements(JSON.parse(saved));
      } catch (e) {}
    } else {
      const defaultAnnouncements: AnnouncementType[] = [
        {
          id: 'ann-1',
          title: 'Tomorrow is a Holiday',
          message: 'Due to severe weather conditions, the school will remain closed tomorrow.',
          date: new Date().toISOString(),
          isUrgent: true
        }
      ];
      setAnnouncements(defaultAnnouncements);
      localStorage.setItem('sxc_announcements', JSON.stringify(defaultAnnouncements));
    }
  }, []);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    const newAnnouncement: AnnouncementType = {
      id: `ann-${Date.now()}`,
      title,
      message,
      date: new Date().toISOString(),
      isUrgent
    };

    const updated = [newAnnouncement, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('sxc_announcements', JSON.stringify(updated));
    setTitle('');
    setMessage('');
    setIsUrgent(true);
  };

  const handleDelete = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('sxc_announcements', JSON.stringify(updated));
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl min-h-[600px] border shadow-sm ${isGlass ? 'bg-white/70 backdrop-blur-xl border-gray-200 text-[#431407]' : 'bg-[#1C1C1F] border-[#2C2C2E] text-white'}`}>
      <div className="flex justify-between items-center mb-8 border-b pb-6 border-gray-500/10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-orange-500" />
            School Announcements
          </h2>
          <p className="text-sm opacity-60 mt-1 font-medium">Post urgent server-wide notices and sticky banners for all students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Post New Notice</h3>
          <form onSubmit={handlePost} className={`p-5 rounded-2xl border ${isGlass ? 'bg-white border-gray-100' : 'bg-[#0F0F12] border-[#242427]'}`}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1 opacity-80">Announcement Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weather Alert, Holiday Notice"
                className={`w-full p-3 rounded-xl border outline-none font-medium transition ${isGlass ? 'bg-gray-50 focus:border-orange-500' : 'bg-[#1C1C1F] border-[#2C2C2E] focus:border-orange-500'}`}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1 opacity-80">Message Details</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide complete details here..."
                rows={4}
                className={`w-full p-3 rounded-xl border outline-none font-medium transition resize-none ${isGlass ? 'bg-gray-50 focus:border-orange-500' : 'bg-[#1C1C1F] border-[#2C2C2E] focus:border-orange-500'}`}
                required
              />
            </div>

            <div className="mb-6 flex items-center gap-3">
              <input 
                type="checkbox" 
                id="urgent-check" 
                checked={isUrgent} 
                onChange={(e) => setIsUrgent(e.target.checked)} 
                className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
              />
              <label htmlFor="urgent-check" className="text-sm font-bold cursor-pointer">Mark as Urgent Sticky Banner</label>
            </div>

            <button type="submit" className={`w-full py-3.5 rounded-xl font-black transition flex items-center justify-center gap-2 shadow-md ${isGlass ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'}`}>
              <PlusCircle className="w-5 h-5" /> Publish Announcement
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Past & Active Notices</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {announcements.length === 0 ? (
              <div className="p-8 text-center opacity-60 font-bold border-2 border-dashed rounded-2xl border-gray-500/20">
                No active announcements right now.
              </div>
            ) : (
              announcements.map(ann => (
                <div key={ann.id} className={`p-4 rounded-xl border flex gap-4 transition-all hover:shadow-md ${isGlass ? 'bg-white border-gray-100' : 'bg-[#0F0F12] border-[#242427]'}`}>
                  <div className={`p-3 rounded-lg shrink-0 h-fit ${ann.isUrgent ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg leading-tight">{ann.title}</h4>
                      <button onClick={() => handleDelete(ann.id)} className="p-1.5 bg-gray-500/10 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition ml-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs font-bold opacity-50 mb-2 mt-1 uppercase tracking-wider">{new Date(ann.date).toLocaleString()} • {ann.isUrgent ? 'Urgent' : 'Standard'}</p>
                    <p className="text-sm opacity-80">{ann.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
