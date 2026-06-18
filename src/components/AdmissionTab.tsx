import React, { useState, useRef } from 'react';
import SchoolHeader from './SchoolHeader';
import QRCodeGenerator from './QRCodeGenerator';
import { Camera, Calendar, User, Phone, Mail, Award, CheckCircle2, FileText, Upload, Plus, Trash2, Sparkles, RotateCcw, Printer } from 'lucide-react';
import { AdmissionFormRecord } from '../types';
import { SAMPLE_ADMISSIONS } from '../data';

interface AdmissionTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange';
}


export default function AdmissionTab({ theme = 'glassNavy' }: AdmissionTabProps) {
  const isGlass = theme === 'glassNavy';

  // Dynamic Register Log list
  const [admissionsList, setAdmissionsList] = useState<AdmissionFormRecord[]>(() => {
    const saved = localStorage.getItem('sxc_all_admissions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SAMPLE_ADMISSIONS;
  });

  const [activeId, setActiveId] = useState<string>('adm-123');

  // Form fields
  const [record, setRecord] = useState<AdmissionFormRecord>(() => {
    const saved = localStorage.getItem('sxc_current_admission');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const found = admissionsList.find(a => a.id === parsed.id);
        if (found) return found;
      } catch (e) {}
    }
    return admissionsList[0] || SAMPLE_ADMISSIONS[0];
  });

  const updateField = (field: keyof AdmissionFormRecord, value: any) => {
    const updated = { ...record, [field]: value };
    setRecord(updated);
    localStorage.setItem('sxc_current_admission', JSON.stringify(updated));
    const updatedList = admissionsList.map(a => a.id === updated.id ? updated : a);
    setAdmissionsList(updatedList);
    localStorage.setItem('sxc_all_admissions', JSON.stringify(updatedList));
  };

  const loadPreset = (preset: AdmissionFormRecord) => {
    setRecord(preset);
    localStorage.setItem('sxc_current_admission', JSON.stringify(preset));
  };

  // File upload drag-and-drop status
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startNewAdmission = () => {
    const newRecord: AdmissionFormRecord = {
      id: `adm-${Date.now()}`,
      docketNo: `SXC-REG-2026-NEW-${Math.floor(100 + Math.random() * 899)}`,
      diseCode: '23260519102',
      psNo: `PS-${Math.floor(1000 + Math.random() * 9000)}`,
      admissionNo: `ADM-2026/${Math.floor(100 + Math.random() * 900)}`,
      enrollmentDate: new Date().toISOString().split('T')[0],
      session: '2026-27',
      name: 'NEW STUDENT RECORD',
      gender: 'MALE',
      bloodGroup: 'B+',
      dob: '2020-01-01',
      dobWords: 'FIRST OF JANUARY TWO THOUSAND TWENTY',
      birthPlace: 'INDORE',
      nationality: 'INDIAN',
      religion: 'HINDU',
      category: 'GENERAL',
      motherTongue: 'HINDI',
      classTarget: 'Pre-Primary (PP-I)',
      prevSchool: 'N/A',
      fatherName: 'FATHER NAME',
      fatherOcc: 'SERVICE',
      motherName: 'MOTHER NAME',
      motherOcc: 'HOUSEWIFE',
      guardianName: 'FATHER NAME',
      phone: '+91 90000 00000',
      email: 'parent@domain.com',
      address: 'STREET ADDRESS, AREA',
      city: 'INDORE',
      pinCode: '452001',
      sssmiId: '',
      aadharNo: '',
      aparId: '',
      transportRequired: 'NO',
      photoUrl: null
    };

    const updatedList = [...admissionsList, newRecord];
    setAdmissionsList(updatedList);
    setRecord(newRecord);
    localStorage.setItem('sxc_all_admissions', JSON.stringify(updatedList));
    localStorage.setItem('sxc_current_admission', JSON.stringify(newRecord));
  };

  const deleteAdmission = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (admissionsList.length <= 1) {
      alert("At least one registration receipt must remain.");
      return;
    }
    const updated = admissionsList.filter(a => a.id !== id);
    setAdmissionsList(updated);
    const nextActive = updated[0];
    setRecord(nextActive);
    localStorage.setItem('sxc_all_admissions', JSON.stringify(updated));
    localStorage.setItem('sxc_current_admission', JSON.stringify(nextActive));
  };

  const resetAllToDefault = () => {
    localStorage.removeItem('sxc_all_admissions');
    localStorage.removeItem('sxc_current_admission');
    setAdmissionsList(SAMPLE_ADMISSIONS);
    setRecord(SAMPLE_ADMISSIONS[0]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        updateField('photoUrl', uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        updateField('photoUrl', uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sidebarClass = isGlass
    ? 'no-print w-full xl:w-5/12 bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/50 h-fit max-h-[85vh] overflow-y-auto text-[#431407]'
    : 'no-print w-full xl:w-5/12 bg-[#0F0F12] p-6 rounded-2xl shadow-lg border border-[#242427] h-fit max-h-[85vh] overflow-y-auto';

  const previewPanelClass = isGlass
    ? 'flex-1 overflow-x-auto bg-[#FFF7ED]/50 p-6 rounded-2xl border border-white/40 flex justify-center'
    : 'flex-1 overflow-x-auto bg-[#0F0F12]/50 p-6 rounded-2xl border border-[#242427] flex justify-center';

  const h2Class = isGlass ? 'text-xl font-black text-[#431407]' : 'text-xl font-bold text-white';
  const subTextClass = isGlass ? 'text-xs text-slate-600' : 'text-xs text-gray-400';
  const labelClass = isGlass ? 'text-xs text-[#431407]/80 font-bold tracking-wide uppercase' : 'text-xs text-gray-400 font-semibold';
  const sectionHeaderClass = isGlass
    ? 'text-xs font-bold text-[#F97316] uppercase border-b border-[#431407]/15 pb-1 mt-6'
    : 'text-xs font-bold text-[#EA580C] uppercase border-b border-[#242427] pb-1 mt-6';

  const firstSectionHeaderClass = isGlass
    ? 'text-xs font-bold text-[#F97316] uppercase border-b border-[#431407]/15 pb-1'
    : 'text-xs font-bold text-[#EA580C] uppercase border-b border-[#242427] pb-1';

  const inputClass = isGlass
    ? 'w-full mt-1 p-2 bg-white/65 border border-[#431407]/15 text-[#431407] rounded-lg focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316] placeholder:text-slate-400 text-xs transition-all font-medium shadow-sm'
    : 'w-full mt-1 p-2 bg-[#1C1C1F] border border-[#242427] text-white rounded-lg focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C] text-xs transition-all';

  const selectClass = isGlass
    ? 'w-full mt-1 p-2 bg-white/65 border border-[#431407]/15 text-[#431407] rounded-lg focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316] text-xs font-semibold'
    : 'w-full mt-1 p-2 bg-[#1C1C1F] border border-[#242427] text-white rounded-lg text-xs focus:border-[#EA580C] focus:outline-none';

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className={sidebarClass}>
        <div className="flex justify-between items-center mb-4 border-b pb-4 border-slate-500/10">
          <div>
            <h2 className={h2Class}>Admission CRM</h2>
            <p className={subTextClass}>Enroll new students & generate official dockets</p>
          </div>
          <button
            onClick={resetAllToDefault}
            title="Reset register to original defaults"
            className={isGlass ? 'p-2 border border-[#431407]/15 bg-white/50 rounded-lg hover:bg-white/80 text-[#431407] transition flex items-center gap-1 text-xs font-semibold' : 'p-2 border border-[#242427] bg-[#1C1C1F] rounded-lg hover:bg-[#242427] text-gray-300 transition flex items-center gap-1 text-xs font-semibold'}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset All
          </button>
        </div>

        {/* Dynamic Log */}
        <div className={isGlass ? 'mb-6 p-4 bg-[#FFF7ED]/65 rounded-xl border border-white shadow-sm flex flex-col relative overflow-hidden' : 'mb-6 p-4 bg-[#1C1C1F] rounded-xl border border-[#242427]'}>
          <div className="flex justify-between items-center mb-2.5">
            <p className={isGlass ? 'text-xs font-bold text-[#F97316] uppercase flex items-center gap-1' : 'text-xs font-bold text-[#EA580C] uppercase flex items-center gap-1'}>
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              Registered Admissions ({admissionsList.length})
            </p>
            <button
              type="button"
              onClick={startNewAdmission}
              className="px-2 py-1 bg-[#F97316]/10 hover:bg-[#F97316]/20 text-[#F97316] dark:text-[#EA580C] dark:bg-[#EA580C]/10 dark:hover:bg-[#EA580C]/20 border border-[#F97316]/20 rounded-md transition-all text-[10px] font-bold flex items-center gap-0.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#F97316]" /> New Form
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {admissionsList.map((a) => (
              <div key={a.id} className="relative group flex items-center">
                <button
                  type="button"
                  onClick={() => loadPreset(a)}
                  className={`${
                    record.id === a.id 
                      ? (isGlass ? 'px-3 py-1.5 rounded-lg text-xs font-black shadow bg-[#431407] text-[#FFF7ED]' : 'px-3 py-1.5 rounded-lg text-xs font-extrabold shadow-sm bg-[#EA580C] text-black shadow-[#EA580C]/20')
                      : (isGlass ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-white/45 border border-[#431407]/10 text-[#431407] hover:bg-white/80 transition-all' : 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0F0F12] border border-[#242427] text-gray-400 hover:bg-[#242427] hover:text-white transition-all')
                  } pr-6`}
                >
                  {a.name.split(' ')[0]} ({a.classTarget ? a.classTarget.split(' ')[0] : 'N/A'})
                </button>
                {admissionsList.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => deleteAdmission(a.id, e)}
                    className="absolute right-1 py-0.5 px-1 text-red-500 hover:text-red-700 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded transition-all"
                    title={`Delete registration receipt of ${a.name}`}
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Editor Form */}
        <div className="space-y-4">
          <p className={firstSectionHeaderClass}>Header Info</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Docket Number</label>
              <input type="text" value={record.docketNo} onChange={e => updateField('docketNo', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>DISE Code</label>
              <input type="text" value={record.diseCode} onChange={e => updateField('diseCode', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>PS Number</label>
              <input type="text" value={record.psNo} onChange={e => updateField('psNo', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Admission Number</label>
              <input type="text" value={record.admissionNo} onChange={e => updateField('admissionNo', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Application Date</label>
              <input type="date" value={record.enrollmentDate} onChange={e => updateField('enrollmentDate', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Session</label>
              <input type="text" value={record.session} onChange={e => updateField('session', e.target.value)} className={inputClass} />
            </div>
          </div>

          <p className={sectionHeaderClass}>Student Photograph</p>
          <div>
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`mt-1.5 p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                dragActive 
                  ? 'border-[#F97316] bg-[#F97316]/10' 
                  : (isGlass ? 'border-gray-200 hover:border-slate-400 bg-white/40' : 'border-zinc-800 hover:border-zinc-600 bg-[#0F0F12]')
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
              {record.photoUrl ? (
                <div className="relative group">
                  <img src={record.photoUrl} alt="Preview student" className="w-16 h-18 object-cover rounded border border-gray-300" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white rounded transition-all">Change</div>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 mb-2 text-[#F97316]" />
                  <p className="text-xs font-bold text-gray-500">Drag & Drop photo here, or <span className="text-[#F97316] hover:underline">Browse</span></p>
                  <p className="text-[9px] text-gray-400 mt-0.5">JPEG / PNG Portrait</p>
                </>
              )}
            </div>
          </div>

          <p className={sectionHeaderClass}>Student Information</p>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Student Name</label>
              <input type="text" value={record.name} onChange={e => updateField('name', e.target.value.toUpperCase())} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Gender</label>
                <select value={record.gender} onChange={e => updateField('gender', e.target.value)} className={selectClass}>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Blood Group</label>
                <input type="text" value={record.bloodGroup} onChange={e => updateField('bloodGroup', e.target.value.toUpperCase())} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input type="date" value={record.dob} onChange={e => updateField('dob', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>DOB in Words</label>
                <input type="text" value={record.dobWords} onChange={e => updateField('dobWords', e.target.value.toUpperCase())} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Birth Place</label>
                <input type="text" value={record.birthPlace} onChange={e => updateField('birthPlace', e.target.value.toUpperCase())} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Nationality</label>
                <input type="text" value={record.nationality} onChange={e => updateField('nationality', e.target.value.toUpperCase())} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Religion</label>
                <input type="text" value={record.religion} onChange={e => updateField('religion', e.target.value.toUpperCase())} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <input type="text" value={record.category} onChange={e => updateField('category', e.target.value.toUpperCase())} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Mother Tongue</label>
              <input type="text" value={record.motherTongue} onChange={e => updateField('motherTongue', e.target.value.toUpperCase())} className={inputClass} />
            </div>
          </div>

          <p className={sectionHeaderClass}>Class Applied & Academic History</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Class Target</label>
              <input type="text" value={record.classTarget} onChange={e => updateField('classTarget', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Previous School</label>
              <input type="text" value={record.prevSchool} onChange={e => updateField('prevSchool', e.target.value)} className={inputClass} />
            </div>
          </div>

          <p className={sectionHeaderClass}>Guardian Information</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Father's Name</label>
                <input type="text" value={record.fatherName} onChange={e => updateField('fatherName', e.target.value.toUpperCase())} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Father Occupation</label>
                <input type="text" value={record.fatherOcc} onChange={e => updateField('fatherOcc', e.target.value.toUpperCase())} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Mother's Name</label>
                <input type="text" value={record.motherName} onChange={e => updateField('motherName', e.target.value.toUpperCase())} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Mother Occupation</label>
                <input type="text" value={record.motherOcc} onChange={e => updateField('motherOcc', e.target.value.toUpperCase())} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Guardian Name</label>
              <input type="text" value={record.guardianName} onChange={e => updateField('guardianName', e.target.value.toUpperCase())} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Mobile Number</label>
                <input type="text" value={record.phone} onChange={e => updateField('phone', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" value={record.email} onChange={e => updateField('email', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          <p className={sectionHeaderClass}>Address & IDs</p>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Street Address</label>
              <input type="text" value={record.address} onChange={e => updateField('address', e.target.value)} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>City</label>
                <input type="text" value={record.city} onChange={e => updateField('city', e.target.value.toUpperCase())} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Pin Code</label>
                <input type="text" value={record.pinCode} onChange={e => updateField('pinCode', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className={labelClass}>SSSMI ID</label>
                <input type="text" value={record.sssmiId || ''} onChange={e => updateField('sssmiId', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Aadhar No</label>
                <input type="text" value={record.aadharNo || ''} onChange={e => updateField('aadharNo', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>APAR ID</label>
                <input type="text" value={record.aparId || ''} onChange={e => updateField('aparId', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>School Transport Required</label>
              <select value={record.transportRequired} onChange={e => updateField('transportRequired', e.target.value as 'YES' | 'NO')} className={selectClass}>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className={isGlass ? 'w-full mt-4 bg-[#F97316] hover:bg-[#2c9c96] text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2' : 'w-full mt-4 bg-[#EA580C] hover:bg-[#2bc48b] text-black font-extrabold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2'}
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      <div className={previewPanelClass}>
        <div id="admission-section" className="print-page w-[210mm] min-h-[297mm] bg-white p-[12mm] text-[#431407] border border-slate-400 shadow-2xl relative select-none text-[11px] flex flex-col justify-between">
          <div>
            <SchoolHeader subTitle="PUPIL ENROLLMENT & PROVISIONAL ADMISSION RECEIPT" />

            <div className="mt-4 border border-[#431407] p-4 bg-[#FFF7ED]/30 rounded">
              <div className="flex justify-between font-mono font-bold mb-3 text-xs">
                <span>DOCKET NO: <span className="bg-slate-100 px-2 border-b border-[#431407]">{record.docketNo}</span></span>
                <span>ADMISSION NO: <span className="bg-slate-100 px-2 border-b border-[#431407]">{record.admissionNo}</span></span>
              </div>
              <div className="flex justify-between font-mono font-bold mb-4 text-xs">
                <span>DISE CODE: <span className="bg-slate-100 px-2 border-b border-[#431407]">{record.diseCode}</span></span>
                <span>PS NUMBER: <span className="bg-slate-100 px-2 border-b border-[#431407]">{record.psNo}</span></span>
              </div>

              <div className="flex flex-row gap-6 justify-between items-start">
                <div className="flex-1 grid grid-cols-1 gap-y-2 text-xs">
                  <p className="border-b border-[#431407]/10 pb-0.5"><span className="font-bold w-44 inline-block">1. Full Name of Pupil:</span> <span className="font-black text-slate-900">{record.name}</span></p>
                  <p className="border-b border-[#431407]/10 pb-0.5"><span className="font-bold w-44 inline-block">2. Gender / Blood Group:</span> <span className="font-bold">{record.gender} / {record.bloodGroup}</span></p>
                  <p className="border-b border-[#431407]/10 pb-0.5"><span className="font-bold w-44 inline-block">3. Date of Birth:</span> <span className="font-bold">{record.dob} ({record.dobWords})</span></p>
                  <p className="border-b border-[#431407]/10 pb-0.5"><span className="font-bold w-44 inline-block">4. Birth Place / Nationality:</span> <span className="font-bold">{record.birthPlace} / {record.nationality}</span></p>
                  <p className="border-b border-[#431407]/10 pb-0.5"><span className="font-bold w-44 inline-block">5. Religion / Category / Tongue:</span> <span className="font-bold">{record.religion} / {record.category} / {record.motherTongue}</span></p>
                  <p className="border-b border-[#431407]/10 pb-0.5"><span className="font-bold w-44 inline-block">6. Target Class Applied:</span> <span className="font-black text-indigo-900">{record.classTarget}</span></p>
                  <p className="border-b border-[#431407]/10 pb-0.5"><span className="font-bold w-44 inline-block">7. Previous Institution:</span> <span className="italic">{record.prevSchool}</span></p>
                  <p className="border-b border-[#431407]/10 pb-0.5"><span className="font-bold w-44 inline-block">8. Father's Name & Occ:</span> <span>{record.fatherName} ({record.fatherOcc})</span></p>
                  <p className="border-b border-[#431407]/10 pb-0.5"><span className="font-bold w-44 inline-block">9. Mother's Name & Occ:</span> <span>{record.motherName} ({record.motherOcc})</span></p>
                  <p className="border-b border-[#431407]/10 pb-0.5"><span className="font-bold w-44 inline-block">10. Contact Mobile & Email:</span> <span className="font-mono">{record.phone} / {record.email}</span></p>
                  <p className="border-b border-[#431407]/10 pb-0.5"><span className="font-bold w-44 inline-block">11. SSSMI / Aadhaar / APAR:</span> <span className="font-mono">{record.sssmiId || 'N/A'} / {record.aadharNo || 'N/A'} / {record.aparId || 'N/A'}</span></p>
                  <p className="border-b border-[#431407]/10 pb-0.5"><span className="font-bold w-44 inline-block">12. Transport Required?</span> <span className="font-bold text-slate-800">{record.transportRequired}</span></p>
                  <p className="border-b border-[#431407]/10 pb-0.5"><span className="font-bold w-44 inline-block">13. Residential Address:</span> <span>{record.address}, {record.city} - {record.pinCode}</span></p>
                </div>

                <div className="w-32 flex flex-col items-center gap-4 py-2 bg-slate-50 border border-slate-200 rounded-xl p-2 shrink-0">
                  <div className="w-24 h-28 border-2 border-dashed border-gray-300 bg-white rounded flex items-center justify-center overflow-hidden shrink-0 relative">
                    {record.photoUrl ? (
                      <img src={record.photoUrl} alt="Enrollment Pupil" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <Camera className="w-6 h-6 mx-auto mb-1 opacity-40" />
                        <span className="text-[6px] font-sans font-bold block leading-none">PASSPORT</span>
                      </div>
                    )}
                  </div>
                  <QRCodeGenerator
                    value={`SAINT XAVIER CONVENT ADMISSION PROVISIONAL ENROLLMENT\nRegistration Docket: ${record.docketNo}\nPupil Name: ${record.name}\nTarget Class: ${record.classTarget}`}
                    studentId={record.name ? record.name.slice(0, 3).toUpperCase() : 'SXC'}
                    label="REG ID CODE"
                    size={48}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[9px] font-black uppercase text-[#431407] mb-2 border-b border-[#F97316] pb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#F97316]" /> Declaration and Directives
              </div>
              <p className="text-[9.5px] leading-relaxed">
                I hereby declare that the particulars furnished above are correct to the best of my knowledge. I promise to abide by the rules and regulations of the school. Any discrepancy in birth certificate or transfer document will terminate the registry.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-end mt-12 pt-4 border-t border-[#F97316]">
            <div className="text-center w-36">
              <div className="h-6 border-b border-[#431407] mx-auto w-24"></div>
              <p className="font-bold text-[9px] text-[#431407] uppercase tracking-wider mt-1">Guardian's Signature</p>
            </div>

            <div className="text-center w-36 border border-[#F97316] p-2 bg-[#FFF7ED]/50 rounded scale-95 flex flex-col justify-center items-center">
              <span className="text-[10px] font-black text-[#431407] uppercase tracking-widest block">SAINT XAVIER</span>
              <span className="text-[7px] text-[#F97316] block mt-0.5 font-sans">CONVENT SCHOOL</span>
              <span className="text-[6px] text-slate-500 block uppercase font-mono tracking-tighter mt-1">REGISTRATION SEAL</span>
            </div>

            <div className="text-center w-36">
              <div className="h-6 border-b border-[#431407] mx-auto w-24"></div>
              <p className="font-bold text-[9px] text-[#431407] uppercase tracking-wider mt-1">Registrar Desk Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
