import React, { useState } from 'react';
import { 
  Calendar, Users, Award, BookOpen, Clock, Activity, ShieldCheck, 
  DollarSign, FileText, Download, Plus, Trash2, ArrowRight, 
  TrendingUp, BarChart2, Bell, FileSpreadsheet, CheckCircle, HelpCircle
} from 'lucide-react';

interface ERPTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange';
}

interface Notice {
  id: string;
  date: string;
  title: string;
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface TimeTableSlot {
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

export default function ERPTab({ theme = 'glassNavy' }: ERPTabProps) {
  const isGlass = theme === 'glassNavy';

  // Sub-tab state
  const [erpSubTab, setErpSubTab] = useState<'dashboard' | 'fees' | 'timetable' | 'notices'>('dashboard');

  // Stats
  const stats = [
    { label: 'Total Enrolled Pupils', value: '2,548', change: '+12% this session', icon: Users, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Academic Staff/Teachers', value: '84 Roster', change: '100% Verified', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Active Curriculums', value: '45 Subjects', change: 'CBSE & MP Board', icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Average Board Rating', value: '9.8 / 10', change: 'First Division Honors', icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10' }
  ];

  // Fee receipt state
  const [feeStudent, setFeeStudent] = useState('Rahul Sharma');
  const [feeClass, setFeeClass] = useState('Class VIII');
  const [feeAmount, setFeeAmount] = useState('12500');
  const [feeType, setFeeType] = useState('Quarterly Tuition Fee');
  const [receipts, setReceipts] = useState<any[]>([
    { id: 'REC-9821', student: 'Rahul Sharma', class: 'Class VIII', amount: 12500, type: 'Quarterly Tuition Fee', date: '2026-06-18', mode: 'UPI' },
    { id: 'REC-9820', student: 'Priya Patel', class: 'Class VI', amount: 15000, type: 'Quarterly Tuition Fee', date: '2026-06-17', mode: 'Cash' }
  ]);
  const [activeReceipt, setActiveReceipt] = useState<any>(null);

  // Time table schedule by day
  const [selectedDay, setSelectedDay] = useState<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT'>('MON');
  const timetableData: Record<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT', TimeTableSlot[]> = {
    MON: [
      { time: '08:30 AM - 09:15 AM', subject: 'Mathematics (Algebra)', teacher: 'Mr. Surendra Sharma', room: 'L-101' },
      { time: '09:15 AM - 10:00 AM', subject: 'Science (Physics)', teacher: 'Mrs. Rekha Verma', room: 'Lab-A' },
      { time: '10:15 AM - 11:00 AM', subject: 'English Grammar', teacher: 'Miss Priya Patel', room: 'L-101' },
      { time: '11:00 AM - 11:45 AM', subject: 'Social Studies', teacher: 'Mr. Manoj Verma', room: 'L-101' }
    ],
    TUE: [
      { time: '08:30 AM - 09:15 AM', subject: 'Hindi Literature', teacher: 'Mrs. Savita Sharma', room: 'L-101' },
      { time: '09:15 AM - 10:00 AM', subject: 'Mathematics (Geometry)', teacher: 'Mr. Surendra Sharma', room: 'L-101' },
      { time: '10:15 AM - 11:00 AM', subject: 'Computer Applications', teacher: 'Mrs. Radhika Patel', room: 'Lab-B' },
      { time: '11:00 AM - 11:45 AM', subject: 'Physical Education', teacher: 'Mr. Amit Sinha', room: 'Playground' }
    ],
    WED: [
      { time: '08:30 AM - 09:15 AM', subject: 'Science (Chemistry)', teacher: 'Mrs. Rekha Verma', room: 'Lab-A' },
      { time: '09:15 AM - 10:00 AM', subject: 'English (Prose)', teacher: 'Miss Priya Patel', room: 'L-101' },
      { time: '10:15 AM - 11:00 AM', subject: 'Sanskrit / Urdu', teacher: 'Mr. Jameel Alam', room: 'L-102' },
      { time: '11:00 AM - 11:45 AM', subject: 'Social Studies', teacher: 'Mr. Manoj Verma', room: 'L-101' }
    ],
    THU: [
      { time: '08:30 AM - 09:15 AM', subject: 'Mathematics (Arithmetic)', teacher: 'Mr. Surendra Sharma', room: 'L-101' },
      { time: '09:15 AM - 10:00 AM', subject: 'Science (Biology)', teacher: 'Mrs. Rekha Verma', room: 'Lab-A' },
      { time: '10:15 AM - 11:00 AM', subject: 'English Reading', teacher: 'Miss Priya Patel', room: 'L-101' },
      { time: '11:00 AM - 11:45 AM', subject: 'Art & Sketching', teacher: 'Mrs. Farah Khan', room: 'Art Hall' }
    ],
    FRI: [
      { time: '08:30 AM - 09:15 AM', subject: 'Social Studies (History)', teacher: 'Mr. Manoj Verma', room: 'L-101' },
      { time: '09:15 AM - 10:00 AM', subject: 'Hindi Grammar', teacher: 'Mrs. Savita Sharma', room: 'L-101' },
      { time: '10:15 AM - 11:00 AM', subject: 'Vedic Maths Extra', teacher: 'Mr. Surendra Sharma', room: 'L-101' },
      { time: '11:00 AM - 11:45 AM', subject: 'Science Quiz', teacher: 'Mrs. Rekha Verma', room: 'Seminar Hall' }
    ],
    SAT: [
      { time: '08:30 AM - 09:15 AM', subject: 'General Knowledge Quiz', teacher: 'Mrs. Radhika Patel', room: 'L-101' },
      { time: '09:15 AM - 10:00 AM', subject: 'Moral Values & Ethics', teacher: 'Principal Desk', room: 'Seminar Hall' },
      { time: '10:15 AM - 11:00 AM', subject: 'Weekly Assessment', teacher: 'Invigilator Staff', room: 'L-101' },
      { time: '11:00 AM - 11:45 AM', subject: 'Library Hour', teacher: 'Librarian', room: 'Library' }
    ]
  };

  // Notices State
  const [notices, setNotices] = useState<Notice[]>([
    { id: 'N-1', date: '2026-06-15', title: 'Summer Vacations extended by 5 days due to intense heat waves.', category: 'ADMIN', priority: 'HIGH' },
    { id: 'N-2', date: '2026-06-12', title: 'Distribution of Board Marksheets and TC Clearance Forms.', category: 'EXAMS', priority: 'MEDIUM' },
    { id: 'N-3', date: '2026-06-10', title: 'Interactive Science Exhibition Registration starts.', category: 'EVENTS', priority: 'LOW' }
  ]);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticePriority, setNewNoticePriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [newNoticeCat, setNewNoticeCat] = useState('ADMIN');

  const addNotice = () => {
    if (!newNoticeTitle.trim()) return;
    const item: Notice = {
      id: `N-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: newNoticeTitle,
      category: newNoticeCat,
      priority: newNoticePriority
    };
    setNotices([item, ...notices]);
    setNewNoticeTitle('');
  };

  const removeNotice = (id: string) => {
    setNotices(notices.filter(n => n.id !== id));
  };

  // Generate Fee Receipt
  const handleGenerateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeStudent || !feeAmount) return;
    const newRec = {
      id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      student: feeStudent,
      class: feeClass,
      amount: parseFloat(feeAmount),
      type: feeType,
      date: new Date().toISOString().split('T')[0],
      mode: 'UPI'
    };
    setReceipts([newRec, ...receipts]);
    setActiveReceipt(newRec);
  };

  const headerTextClass = isGlass ? 'text-[#431407]' : 'text-white';
  const textMutedClass = isGlass ? 'text-slate-600' : 'text-gray-400';
  const cardBgClass = isGlass 
    ? 'bg-white/80 border border-white/50 backdrop-blur-md shadow-sm p-5 rounded-2xl' 
    : 'bg-[#18181C] border border-[#2C2C2E] p-5 rounded-2xl';

  const tabBtnClass = (active: boolean) => 
    active 
      ? (isGlass ? 'px-4 py-2 rounded-xl text-xs font-black bg-[#431407] text-[#FFF7ED] shadow' : 'px-4 py-2 rounded-xl text-xs font-extrabold bg-[#EA580C] text-black shadow-lg shadow-[#EA580C]/20')
      : (isGlass ? 'px-4 py-2 rounded-xl text-xs font-bold bg-white/40 hover:bg-white/75 border border-slate-200 text-[#431407]/75' : 'px-4 py-2 rounded-xl text-xs font-medium bg-[#131316] hover:bg-[#202024] border border-[#242427] text-gray-400 hover:text-white');

  return (
    <div className={`p-6 sm:p-8 rounded-3xl min-h-[600px] border ${isGlass ? 'bg-white/80 backdrop-blur-xl border-white/40 text-[#431407]' : 'bg-[#1C1C1F] border-[#2C2C2E] text-white'}`}>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <BookOpen className="text-indigo-500" />
            Cloud School ERP & Learning Management System
          </h2>
          <p className="opacity-70 text-sm mt-1">Convent operations, daily rosters, fee invoicing, and notice boards.</p>
        </div>
        
        {/* Real-time latency tracking */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold font-mono no-print">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>PORTAL CLOUD SYNCED</span>
        </div>
      </div>

      {/* Navigation sub-tabs */}
      <div className="flex flex-wrap gap-2.5 mb-6 border-b pb-4 border-slate-500/10 no-print">
        <button onClick={() => setErpSubTab('dashboard')} className={tabBtnClass(erpSubTab === 'dashboard')}>📊 Overview</button>
        <button onClick={() => setErpSubTab('fees')} className={tabBtnClass(erpSubTab === 'fees')}>💵 Fee Invoicing</button>
        <button onClick={() => setErpSubTab('timetable')} className={tabBtnClass(erpSubTab === 'timetable')}>📅 Timetable Roster</button>
        <button onClick={() => setErpSubTab('notices')} className={tabBtnClass(erpSubTab === 'notices')}>🔔 Notice Circulars</button>
      </div>

      {/* Render subtabs */}
      {erpSubTab === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          {/* Grid statistics metrics cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className={cardBgClass}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[10px] font-bold ${textMutedClass} uppercase tracking-wider`}>{stat.label}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                </div>
                <div className={`text-2xl font-black ${headerTextClass}`}>{stat.value}</div>
                <div className="text-[10px] text-rose-500 font-bold mt-1">✓ {stat.change}</div>
              </div>
            ))}
          </div>

          {/* Interactive CSS Performance Chart Section */}
          <div className={`p-6 rounded-2xl border ${isGlass ? 'bg-white/50 border-gray-100 shadow-sm' : 'bg-[#0F0F12] border-[#2C2C2E]'}`}>
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Annual Student Enrollment & Grade Pass Performance Index
            </h3>
            
            {/* Custom chart structure */}
            <div className="h-64 flex items-end gap-3 sm:gap-6 pt-4 border-b border-l border-slate-500/10 px-2 sm:px-6 relative">
              <div className="absolute left-2 top-2 text-[9px] text-gray-400 font-mono">100% Pass Rate</div>
              <div className="absolute left-2 top-1/2 text-[9px] text-gray-400 font-mono">50% Average</div>

              {/* Bar 1 */}
              <div className="flex-1 flex flex-col items-center h-full justify-end">
                <div className="w-full sm:w-12 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg relative group transition-all duration-300 hover:opacity-95" style={{ height: '78%' }}>
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-1.5 py-0.5 rounded shadow">78%</span>
                </div>
                <span className="text-[9px] mt-2 font-bold font-mono">2022-23</span>
              </div>
              {/* Bar 2 */}
              <div className="flex-1 flex flex-col items-center h-full justify-end">
                <div className="w-full sm:w-12 bg-gradient-to-t from-amber-500 to-yellow-400 rounded-t-lg relative group transition-all duration-300 hover:opacity-95" style={{ height: '84%' }}>
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-1.5 py-0.5 rounded shadow">84%</span>
                </div>
                <span className="text-[9px] mt-2 font-bold font-mono">2023-24</span>
              </div>
              {/* Bar 3 */}
              <div className="flex-1 flex flex-col items-center h-full justify-end">
                <div className="w-full sm:w-12 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg relative group transition-all duration-300 hover:opacity-95" style={{ height: '91%' }}>
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-1.5 py-0.5 rounded shadow">91%</span>
                </div>
                <span className="text-[9px] mt-2 font-bold font-mono">2024-25</span>
              </div>
              {/* Bar 4 */}
              <div className="flex-1 flex flex-col items-center h-full justify-end">
                <div className="w-full sm:w-12 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg relative group transition-all duration-300 hover:opacity-95" style={{ height: '97%' }}>
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-1.5 py-0.5 rounded shadow">97%</span>
                </div>
                <span className="text-[9px] mt-2 font-bold font-mono">2025-26</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span> CBSE Enrollment Rate</span>
              <span className="font-semibold">Last updated: Real-time DB Sync</span>
            </div>
          </div>
        </div>
      )}

      {erpSubTab === 'fees' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Editor/Generator */}
          <div className={`p-6 rounded-2xl border ${isGlass ? 'bg-white/50 border-gray-100 shadow-sm' : 'bg-[#0F0F12] border-[#2C2C2E]'}`}>
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Receipt Generator
            </h3>
            <form onSubmit={handleGenerateReceipt} className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1">Student Full Name</label>
                <input 
                  type="text" 
                  value={feeStudent} 
                  onChange={e => setFeeStudent(e.target.value)} 
                  className={`w-full p-2 bg-white/60 border rounded-lg text-xs outline-none ${isGlass ? 'border-gray-200' : 'bg-[#1C1C1F] border-[#242427]'}`} 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1">Target Class</label>
                  <input 
                    type="text" 
                    value={feeClass} 
                    onChange={e => setFeeClass(e.target.value)} 
                    className={`w-full p-2 bg-white/60 border rounded-lg text-xs outline-none ${isGlass ? 'border-gray-200' : 'bg-[#1C1C1F] border-[#242427]'}`} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Amount (₹)</label>
                  <input 
                    type="number" 
                    value={feeAmount} 
                    onChange={e => setFeeAmount(e.target.value)} 
                    className={`w-full p-2 bg-white/60 border rounded-lg text-xs outline-none ${isGlass ? 'border-gray-200' : 'bg-[#1C1C1F] border-[#242427]'}`} 
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Fee Category / Description</label>
                <select 
                  value={feeType} 
                  onChange={e => setFeeType(e.target.value)} 
                  className={`w-full p-2 bg-white/60 border rounded-lg text-xs outline-none ${isGlass ? 'border-gray-200' : 'bg-[#1C1C1F] border-[#242427]'}`}
                >
                  <option value="Quarterly Tuition Fee">Quarterly Tuition Fee</option>
                  <option value="Annual Computer & Lab Fee">Annual Computer & Lab Fee</option>
                  <option value="Transportation Fee Q1">Transportation Fee Q1</option>
                  <option value="Admission & Registration Charges">Admission & Registration Charges</option>
                </select>
              </div>
              <button 
                type="submit" 
                className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition ${isGlass ? 'bg-[#F97316] hover:bg-[#2C7A7B]' : 'bg-[#EA580C] hover:bg-emerald-600'}`}
              >
                Generate & Save Invoiced Receipt
              </button>
            </form>

            {/* Generated Invoices Logs */}
            <div className="mt-6 border-t pt-4 border-slate-500/10">
              <h4 className="text-xs font-bold uppercase mb-2 tracking-wide">Recent Invoiced Receipts</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {receipts.map(r => (
                  <div 
                    key={r.id} 
                    onClick={() => setActiveReceipt(r)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between ${
                      activeReceipt?.id === r.id 
                        ? (isGlass ? 'bg-[#431407]/10 border-[#F97316]/40' : 'bg-[#EA580C]/10 border-[#EA580C]/40')
                        : (isGlass ? 'bg-white/50 border-gray-100 hover:bg-white' : 'bg-[#18181C] border-[#2C2C2E] hover:bg-[#202024]')
                    }`}
                  >
                    <div>
                      <p className="font-bold">{r.student}</p>
                      <p className="text-[10px] text-gray-500">{r.type} - {r.class}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold">₹{r.amount}</p>
                      <p className="text-[9px] text-[#F97316] font-mono">{r.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive live receipt viewer */}
          <div className="lg:col-span-2 flex justify-center">
            {activeReceipt ? (
              <div className="w-full max-w-[148mm] bg-white text-slate-800 p-8 border border-slate-300 shadow-xl rounded-xl relative font-sans text-xs flex flex-col justify-between min-h-[500px]">
                {/* Ribbon decoration */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-indigo-600 rounded-t-xl"></div>
                
                <div>
                  <div className="flex justify-between items-start border-b pb-4 mt-2">
                    <div>
                      <h4 className="font-serif font-extrabold text-sm uppercase text-slate-900">SAINT XAVIER CONVENT</h4>
                      <p className="text-[10px] text-slate-500 leading-tight">Sector D, Scheme 74, Vijay Nagar, Indore</p>
                      <p className="text-[9px] text-slate-400 font-mono">DISE: 23260519102 | Affiliated to CBSE</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">PAYMENT CLEARED</span>
                      <p className="text-[10px] font-mono text-slate-500 mt-2">No: <span className="font-bold">{activeReceipt.id}</span></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 my-6">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Received From Student</span>
                      <span className="text-sm font-bold text-slate-900">{activeReceipt.student}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Class / Grade</span>
                      <span className="text-sm font-bold text-slate-900">{activeReceipt.class}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Receipt Date</span>
                      <span className="text-sm font-bold font-mono text-slate-900">{activeReceipt.date}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Payment Mode</span>
                      <span className="text-sm font-bold font-mono text-slate-900">{activeReceipt.mode}</span>
                    </div>
                  </div>

                  <table className="w-full border-collapse border border-slate-200 mt-4 text-left">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-200 p-2 font-bold uppercase text-[9px]">Fee Particulars Description</th>
                        <th className="border border-slate-200 p-2 text-right font-bold uppercase text-[9px] w-28">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-200 p-2 font-medium">{activeReceipt.type}</td>
                        <td className="border border-slate-200 p-2 text-right font-mono font-black text-slate-900">₹ {activeReceipt.amount.toLocaleString('en-IN')}.00</td>
                      </tr>
                      <tr className="bg-slate-50 font-black">
                        <td className="border border-slate-200 p-2 text-right">Grand Total Paid</td>
                        <td className="border border-slate-200 p-2 text-right font-mono text-indigo-700">₹ {activeReceipt.amount.toLocaleString('en-IN')}.00</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <p className="text-[9px] text-slate-400 italic mt-6 leading-relaxed">
                    Declaration: This is an auto-generated system receipt and does not require a physical seal. Amount is non-refundable.
                  </p>
                </div>

                <div className="flex justify-between items-end border-t pt-4 mt-8">
                  <div className="text-center w-28 text-[9px]">
                    <div className="border-b border-slate-300 h-5 mx-auto w-20"></div>
                    <p className="text-slate-500 mt-1">Cashier Desk</p>
                  </div>
                  <div className="text-center w-28 text-[9px]">
                    <div className="border-b border-slate-300 h-5 mx-auto w-20"></div>
                    <p className="text-slate-500 mt-1">Accountant Sign</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400 text-center border-2 border-dashed border-slate-500/20 rounded-2xl w-full max-w-[148mm]">
                <FileText className="w-12 h-12 mb-3 opacity-30 text-indigo-500" />
                <p className="font-bold">No Active Invoiced Receipt Selected</p>
                <p className="text-xs text-gray-500 mt-1">Select one from the sidebar log or generate a new one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {erpSubTab === 'timetable' && (
        <div className={`p-6 rounded-2xl border ${isGlass ? 'bg-white/50 border-gray-100 shadow-sm' : 'bg-[#0F0F12] border-[#2C2C2E]'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4 border-slate-500/10">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Weekly Timetable Grid & Class Syllabus Diaries
            </h3>
            
            {/* Day Selector */}
            <div className="flex flex-wrap gap-1">
              {(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const).map(day => (
                <button 
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    selectedDay === day 
                      ? (isGlass ? 'bg-[#431407] text-[#FFF7ED]' : 'bg-[#EA580C] text-black font-extrabold')
                      : (isGlass ? 'bg-white/60 hover:bg-white text-[#431407]' : 'bg-[#1C1C1F] text-gray-400 hover:text-white')
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Timetable Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timetableData[selectedDay].map((slot, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-xl border flex justify-between items-start gap-4 transition hover:shadow-md ${
                  isGlass ? 'bg-white border-gray-100 hover:border-[#F97316]/30' : 'bg-[#18181C] border-[#2C2C2E] hover:border-[#EA580C]/40'
                }`}
              >
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-tight bg-indigo-500/10 text-indigo-500 uppercase">
                    {slot.time}
                  </span>
                  <h4 className="text-sm font-black mt-1 leading-tight">{slot.subject}</h4>
                  <p className="text-[11px] text-gray-500 font-medium">Classroom Chamber: <span className="font-bold text-[#F97316]">{slot.room}</span></p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">Instructor</span>
                  <span className="text-xs font-black block mt-0.5">{slot.teacher}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {erpSubTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Creator panel */}
          <div className={`p-6 rounded-2xl border ${isGlass ? 'bg-white/50 border-gray-100 shadow-sm' : 'bg-[#0F0F12] border-[#2C2C2E]'}`}>
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#F97316]" />
              Publish Circular Notice
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1">Notice Description Title</label>
                <textarea 
                  value={newNoticeTitle} 
                  onChange={e => setNewNoticeTitle(e.target.value)} 
                  rows={3}
                  placeholder="e.g. Science Fair scheduled for 25th June. All classes must enroll."
                  className={`w-full p-2 bg-white/60 border rounded-lg text-xs outline-none resize-none ${isGlass ? 'border-gray-200' : 'bg-[#1C1C1F] border-[#242427]'}`} 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1">Notice Priority</label>
                  <select 
                    value={newNoticePriority} 
                    onChange={e => setNewNoticePriority(e.target.value as any)} 
                    className={`w-full p-2 bg-white/60 border rounded-lg text-xs outline-none ${isGlass ? 'border-gray-200' : 'bg-[#1C1C1F] border-[#242427]'}`}
                  >
                    <option value="HIGH">🔴 HIGH Priority</option>
                    <option value="MEDIUM">🟡 MEDIUM Priority</option>
                    <option value="LOW">🔵 LOW Priority</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Circular Category</label>
                  <select 
                    value={newNoticeCat} 
                    onChange={e => setNewNoticeCat(e.target.value)} 
                    className={`w-full p-2 bg-white/60 border rounded-lg text-xs outline-none ${isGlass ? 'border-gray-200' : 'bg-[#1C1C1F] border-[#242427]'}`}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="EXAMS">EXAMS</option>
                    <option value="EVENTS">EVENTS</option>
                    <option value="SPORTS">SPORTS</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={addNotice} 
                className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition ${isGlass ? 'bg-[#F97316] hover:bg-[#2C7A7B]' : 'bg-[#EA580C] hover:bg-emerald-600'}`}
              >
                Broadcast Circular Notice
              </button>
            </div>
          </div>

          {/* Bulletin Notice Board */}
          <div className={`lg:col-span-2 p-6 rounded-2xl border ${isGlass ? 'bg-white/50 border-gray-100 shadow-sm' : 'bg-[#0F0F12] border-[#2C2C2E]'}`}>
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-3 border-slate-500/10">
              <Bell className="w-4 h-4 text-amber-500" />
              School Official Bulletin Notice Board
            </h3>
            
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
              {notices.map(notice => (
                <div 
                  key={notice.id} 
                  className={`p-4 rounded-xl border relative transition hover:-translate-y-0.5 ${
                    isGlass ? 'bg-white border-gray-100' : 'bg-[#18181C] border-[#2C2C2E]'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                        notice.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                        notice.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {notice.priority} PRIORITY
                      </span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        📂 {notice.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono font-bold">{notice.date}</span>
                  </div>
                  
                  <p className="text-xs font-bold leading-relaxed pr-8">{notice.title}</p>
                  
                  {/* Delete notice */}
                  <button 
                    onClick={() => removeNotice(notice.id)}
                    className="absolute right-3 bottom-3 p-1 hover:bg-rose-500/10 rounded-lg text-rose-500 transition"
                    title="Remove notice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
