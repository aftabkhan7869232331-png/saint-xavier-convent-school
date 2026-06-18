import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Download, Search, HardDrive, LogOut, Filter } from 'lucide-react';

interface DigitalLibraryTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange';
}

const mockLibraryResources = [
  { id: 'b1', title: 'Mathematics Grade 8 Textbook', subject: 'Mathematics', grade: 'VIII', type: 'Textbook', cover: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&q=80&w=200&h=300' },
  { id: 'b2', title: 'Advanced Science Guide', subject: 'Science', grade: 'VIII', type: 'Supplementary', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200&h=300' },
  { id: 'b3', title: 'English Grammar Worksheets', subject: 'English', grade: 'VII', type: 'Educational PDF', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200&h=300' },
  { id: 'b4', title: 'World History - The Middle Ages', subject: 'Social Studies', grade: 'IX', type: 'Textbook', cover: 'https://images.unsplash.com/photo-1447069387366-2a34706322b7?auto=format&fit=crop&q=80&w=200&h=300' },
  { id: 'b5', title: 'Physics Form 1 Notes', subject: 'Science', grade: 'IX', type: 'Educational PDF', cover: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=200&h=300' },
  { id: 'b6', title: 'Geometry Simplified', subject: 'Mathematics', grade: 'X', type: 'Supplementary', cover: 'https://images.unsplash.com/photo-1615014606552-829dce6deba8?auto=format&fit=crop&q=80&w=200&h=300' },
];

export default function DigitalLibraryTab({ theme = 'glassNavy' }: DigitalLibraryTabProps) {
  const isGlass = theme === 'glassNavy';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const grades = ['All', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const subjects = ['All', 'Mathematics', 'Science', 'English', 'Social Studies'];

  const filteredResources = mockLibraryResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'All' || resource.grade === selectedGrade;
    const matchesSubject = selectedSubject === 'All' || resource.subject === selectedSubject;
    return matchesSearch && matchesGrade && matchesSubject;
  });

  return (
    <div className={`p-6 sm:p-8 rounded-3xl min-h-[600px] border ${isGlass ? 'bg-white/80 backdrop-blur-xl border-white/40 text-[#431407]' : 'bg-[#1C1C1F] border-[#2C2C2E] text-white'}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-gray-500/10 gap-4">
        <div>
          <h2 className="text-3xl font-black flex items-center gap-3"><BookOpen className="text-blue-500 w-8 h-8" /> Digital Library</h2>
          <p className="opacity-60 text-sm mt-2 font-medium">Browse and access school-approved textbooks, supplementary materials, and educational PDFs.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search books, PDFs..."
              className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none font-medium transition ${isGlass ? 'bg-white border-gray-200 focus:border-blue-500' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-blue-500'}`}
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <div className="relative">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className={`appearance-none pl-4 pr-10 py-3 rounded-xl border outline-none font-medium transition cursor-pointer ${isGlass ? 'bg-white border-gray-200 focus:border-blue-500' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-blue-500'}`}
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade === 'All' ? 'All Grades' : `Class ${grade}`}</option>
                ))}
              </select>
              <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className={`appearance-none pl-4 pr-10 py-3 rounded-xl border outline-none font-medium transition cursor-pointer ${isGlass ? 'bg-white border-gray-200 focus:border-blue-500' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-blue-500'}`}
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject === 'All' ? 'All Subjects' : subject}</option>
                ))}
              </select>
              <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
            </div>
          </div>
        </div>

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredResources.map(resource => (
              <div 
                key={resource.id} 
                className={`group rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg overflow-hidden flex flex-col ${isGlass ? 'bg-white border-gray-100 hover:border-blue-200 shadow-sm' : 'bg-[#0F0F12] border-[#2C2C2E] hover:border-blue-500/50'}`}
              >
                <div className="h-48 w-full relative bg-gray-100">
                  <img src={resource.cover} alt={resource.title} className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition" />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded">
                    {resource.type}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm ${isGlass ? 'bg-blue-50 text-blue-600' : 'bg-blue-500/20 text-blue-400'}`}>
                      {resource.subject}
                    </span>
                    <span className="text-xs opacity-60 font-bold">Class {resource.grade}</span>
                  </div>
                  <h4 className="font-bold text-sm leading-snug group-hover:text-blue-500 transition-colors mb-4">{resource.title}</h4>
                  
                  <button className={`mt-auto w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${isGlass ? 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 hover:border-blue-200' : 'bg-[#1C1C1F] text-gray-300 hover:text-white hover:bg-blue-500/20 border border-[#2C2C2E] hover:border-blue-500/30'}`}>
                    <Download className="w-4 h-4" /> View/Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`py-16 text-center rounded-2xl border border-dashed ${isGlass ? 'bg-gray-50/50 border-gray-200' : 'bg-[#0F0F12]/50 border-[#2C2C2E]'}`}>
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h4 className="font-bold mb-1">No resources found</h4>
            <p className="text-sm opacity-60 max-w-sm mx-auto">Try adjusting your filters or search term to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
}
