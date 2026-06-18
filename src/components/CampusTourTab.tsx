import React, { useState, useEffect } from 'react';
import { Calendar, Video, CheckCircle2, Phone, User, Clock, Trash2 } from 'lucide-react';

interface CampusTourTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange';
}

interface TourRecord {
  id: string;
  name: string;
  date: string;
  phone: string;
  status: 'Pending' | 'Approved' | 'Completed';
}

export default function CampusTourTab({ theme = 'glassNavy' }: CampusTourTabProps) {
  const isGlass = theme === 'glassNavy';
  const [tours, setTours] = useState<TourRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sxc_campus_tours');
    if (saved) {
      try {
        setTours(JSON.parse(saved));
      } catch (e) {}
    } else {
      // Setup some default mock data if none exist
      const defaultTours: TourRecord[] = [
        { id: 'tour-1', name: 'Rahul Sharma', date: '2026-06-20', phone: '+91 9876543210', status: 'Pending' },
        { id: 'tour-2', name: 'Priya Singh', date: '2026-06-22', phone: '+91 8765432109', status: 'Approved' }
      ];
      setTours(defaultTours);
      localStorage.setItem('sxc_campus_tours', JSON.stringify(defaultTours));
    }
  }, []);

  const updateStatus = (id: string, newStatus: 'Pending' | 'Approved' | 'Completed') => {
    const updated = tours.map(t => t.id === id ? { ...t, status: newStatus } : t);
    setTours(updated);
    localStorage.setItem('sxc_campus_tours', JSON.stringify(updated));
  };

  const deleteTour = (id: string) => {
    const updated = tours.filter(t => t.id !== id);
    setTours(updated);
    localStorage.setItem('sxc_campus_tours', JSON.stringify(updated));
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl min-h-[600px] border shadow-sm ${isGlass ? 'bg-white/70 backdrop-blur-xl border-gray-200 text-[#431407]' : 'bg-[#1C1C1F] border-[#2C2C2E] text-white'}`}>
      <div className="flex justify-between items-center mb-8 border-b pb-6 border-gray-500/10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-3">
            <Video className="w-8 h-8 text-blue-500" />
            Campus Tour Management
          </h2>
          <p className="text-sm opacity-60 mt-1 font-medium">Review and schedule requested campus tours.</p>
        </div>
      </div>

      <div className="space-y-4">
        {tours.length === 0 ? (
          <div className="p-10 text-center opacity-60 font-bold border-2 border-dashed rounded-2xl border-gray-500/20">
            No campus tour requests pending.
          </div>
        ) : (
          tours.map(tour => (
            <div key={tour.id} className={`p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:-translate-y-1 hover:shadow-md ${isGlass ? 'bg-white border-gray-100' : 'bg-[#0F0F12] border-[#242427]'}`}>
              <div className="flex-1 flex flex-col gap-2 w-full">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{tour.name}'s Family</h3>
                  <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full ${
                    tour.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                    tour.status === 'Approved' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-rose-500/10 text-rose-500'
                  }`}>
                    {tour.status}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm opacity-80 font-medium">
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {tour.date}</div>
                  <div className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {tour.phone}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 justify-end">
                {tour.status === 'Pending' && (
                  <button onClick={() => updateStatus(tour.id, 'Approved')} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition">
                    Approve
                  </button>
                )}
                {tour.status === 'Approved' && (
                  <button onClick={() => updateStatus(tour.id, 'Completed')} className="px-4 py-2 bg-rose-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Mark Completed
                  </button>
                )}
                <button onClick={() => deleteTour(tour.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
