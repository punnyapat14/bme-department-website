import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground, SectionBanner } from '../../components/ThemeElements';
import ThailandAlumniMap from '../../components/ThailandAlumniMap';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';

// ==========================================
// 📌 Component: Interactive Donut Chart
// ==========================================
const DonutChart = ({ data, size = 260, strokeWidth = 32, animationDuration = 1.1, animationDelayPerSegment = 0.06, hoveredLabel, selectedLabel, onSegmentHover, onSegmentClick, centerContent }) => {
  const radius = (size - strokeWidth) / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulatedValue = 0;

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 overflow-visible">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} />
        {data.map((segment, index) => {
          if (segment.value <= 0 || total <= 0) return null;
          const percentage = segment.value / total;
          const dashLength = percentage * circumference;
          const gap = data.filter((d) => d.value > 0).length > 1 ? 3 : 0;
          const visibleStroke = Math.max(0, dashLength - gap);
          const strokeDashoffset = -((accumulatedValue / total) * circumference);
          accumulatedValue += segment.value;

          const isHovered = hoveredLabel === segment.label;
          const isSelected = selectedLabel === segment.key;
          const isDimmed = (hoveredLabel && !isHovered) || (!hoveredLabel && selectedLabel !== 'ALL' && !isSelected);

          return (
            <motion.circle
              key={segment.label}
              cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke={segment.color} strokeLinecap="butt"
              initial={{ strokeDasharray: `0 ${circumference}`, strokeDashoffset }}
              animate={{
                strokeDasharray: `${visibleStroke} ${circumference}`,
                strokeDashoffset,
                strokeWidth: isHovered || isSelected ? strokeWidth + 7 : strokeWidth,
                opacity: isDimmed ? 0.45 : 1,
              }}
              transition={{
                strokeDasharray: { duration: animationDuration, delay: index * animationDelayPerSegment, ease: "easeOut" },
                strokeWidth: { duration: 0.2 }, opacity: { duration: 0.2 },
              }}
              className="cursor-pointer"
              onMouseEnter={() => onSegmentHover && onSegmentHover(segment.label)}
              onMouseLeave={() => onSegmentHover && onSegmentHover(null)}
              onClick={() => onSegmentClick && onSegmentClick(segment.key)}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-8">
        {centerContent}
      </div>
    </div>
  );
};

// 📌 Helper: แปลงลิงก์ Google Drive เป็นรููป (ถ้ามี)
const formatImageUrl = (url) => {
  if (!url) return '';
  const trimmed = String(url).trim();
  const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) || trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1000`;
  return trimmed;
};

// 📌 ค่าตั้งต้นสำหรับฟอร์ม
const EMPTY_ALUMNI_FORM = {
  id: '', generation: '', name: '', age: '', province: '',
  faculty: 'คณะวิทยาศาสตร์ประยุกต์ มจพ.', field: 'วิศวกรรมชีวการแพทย์', category: '',
  position: '', company: '', image_url: '', degree: 'วท.บ. วิศวกรรมชีวการแพทย์',
  description: '', quote: '', is_visible: true
};

export default function Directory() {
  const { user } = useAuth();
  
  // 📦 State ข้อมูลจาก Supabase
  const [alumniData, setAlumniData] = useState([]);
  const [settings, setSettings] = useState({
    page_title: 'กำลังโหลด...',
    page_subtitle: '',
    categories: []
  });
  const [loading, setLoading] = useState(true);

  // 📦 State การแสดงผลและกรองข้อมูล
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState('ALL');

  // ⚙️ State จัดการแอดมิน (ฟอร์มเพิ่ม/แก้ไขศิษย์เก่า)
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState(EMPTY_ALUMNI_FORM);
  const [editingId, setEditingId] = useState(null);

  // ⚙️ State จัดการแอดมิน (ฟอร์มตั้งค่าเพจ)
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [settingsForm, setSettingsForm] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 🔒 ตรวจสอบสิทธิ์ Admin
  const canManageDirectory = Boolean(
    user && (
      ['admin', 'faculty', 'teacher', 'staff', 'instructor'].includes(String(user.role || '').toLowerCase()) ||
      user.isAdmin === true ||
      String(user.email || '').endsWith('@sci.kmutnb.ac.th') ||
      String(user.email || '').toLowerCase() === 'bme.kmutnb.th@gmail.com'
    )
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDirectoryData();
  }, [selectedAlumni]);

  // 📌 1. ดึงข้อมูลจาก Supabase
  const fetchDirectoryData = async () => {
    setLoading(true);
    try {
      // ดึงการตั้งค่าเว็บ + หมวดหมู่
      const { data: settingsData, error: settingsError } = await supabase.from('alumni_settings').select('*').eq('id', 1).single();
      if (!settingsError && settingsData) setSettings(settingsData);

      // ดึงข้อมูลศิษย์เก่า
      const { data: profilesData, error: profilesError } = await supabase.from('alumni_profiles').select('*').order('generation', { ascending: true });
      if (profilesError) throw profilesError;
      setAlumniData(profilesData || []);
    } catch (err) {
      console.error('Fetch directory error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 📌 2. การคำนวณและกรองข้อมูล
  const visibleAlumni = useMemo(() => {
    return alumniData.filter(a => canManageDirectory || a.is_visible);
  }, [alumniData, canManageDirectory]);

  const chartData = useMemo(() => {
    const categories = settings.categories || [];
    const knownKeys = categories.map((c) => c.key);

    return categories.map((cat) => {
      let value = 0;
      if (cat.key.startsWith('อื่นๆ')) {
        value = visibleAlumni.filter((a) => a.category === cat.key || !knownKeys.includes(a.category)).length;
      } else {
        value = visibleAlumni.filter((a) => a.category === cat.key).length;
      }
      return { ...cat, label: cat.shortLabel, value };
    });
  }, [settings.categories, visibleAlumni]);

  const provinceCounts = useMemo(() => {
    return visibleAlumni.reduce((acc, alumni) => {
      const prov = (alumni.province || '').trim();
      if (prov) acc[prov] = (acc[prov] || 0) + 1;
      return acc;
    }, {});
  }, [visibleAlumni]);

  const totalAlumniCount = useMemo(() => chartData.reduce((sum, d) => sum + d.value, 0), [chartData]);

  const activeSegment = useMemo(() => {
    if (hoveredSegment) return chartData.find((s) => s.label === hoveredSegment) || null;
    if (selectedCategoryFilter !== 'ALL') return chartData.find((s) => s.key === selectedCategoryFilter) || null;
    return null;
  }, [hoveredSegment, selectedCategoryFilter, chartData]);

  const displayValue = activeSegment ? activeSegment.value : totalAlumniCount;
  const displayLabel = activeSegment ? activeSegment.label : "ศิษย์เก่าทั้งหมด";
  const displayPercentage = activeSegment && totalAlumniCount > 0 ? (activeSegment.value / totalAlumniCount) * 100 : 100;

  const filteredAlumni = useMemo(() => {
    return visibleAlumni.filter((alumni) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        alumni.name.toLowerCase().includes(q) || (alumni.category || '').toLowerCase().includes(q) ||
        (alumni.position || '').toLowerCase().includes(q) || (alumni.company || '').toLowerCase().includes(q) ||
        (alumni.province || '').toLowerCase().includes(q);
      const matchCat = selectedCategoryFilter === 'ALL' || alumni.category === selectedCategoryFilter;
      const matchProv = selectedProvinceFilter === 'ALL' || alumni.province === selectedProvinceFilter;
      return matchSearch && matchCat && matchProv;
    });
  }, [searchTerm, selectedCategoryFilter, selectedProvinceFilter, visibleAlumni]);

  const getCategoryStyle = (categoryKey) => {
    const found = (settings.categories || []).find((c) => c.key === categoryKey);
    return found ? found.chip : 'bg-slate-100 text-slate-700 border-slate-200';
  };

  // ==========================================
  // 📌 ฟังก์ชันจัดการศิษย์เก่า (แอดมิน)
  // ==========================================
  const openCreateProfile = () => {
    setEditingId(null);
    setProfileForm({ ...EMPTY_ALUMNI_FORM, category: settings.categories[0]?.key || '' });
    setFormError('');
    setShowProfileForm(true);
  };

  const openEditProfile = (p) => {
    setEditingId(p.id);
    setProfileForm({ ...p, age: p.age || '' });
    setFormError('');
    setShowProfileForm(true);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!canManageDirectory) return;
    if (!profileForm.name.trim() || !profileForm.generation) return setFormError('กรุณากรอกชื่อและรุ่น');

    setSubmitting(true);
    try {
      if (editingId) {
        const { error } = await supabase.from('alumni_profiles').update(profileForm).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('alumni_profiles').insert([profileForm]);
        if (error) throw error;
      }
      setShowProfileForm(false);
      fetchDirectoryData();
    } catch (err) {
      console.error('Save profile error:', err);
      setFormError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProfile = async (id, name) => {
    if (!canManageDirectory) return;
    if (!window.confirm(`ยืนยันการลบโปรไฟล์ของ "${name}" ?\nข้อมูลจะถูกลบออกจากฐานข้อมูลถาวร`)) return;
    try {
      await supabase.from('alumni_profiles').delete().eq('id', id);
      fetchDirectoryData();
      if (selectedAlumni?.id === id) setSelectedAlumni(null);
    } catch (err) {
      alert('ไม่สามารถลบข้อมูลได้');
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { page_title: settingsForm.page_title, page_subtitle: settingsForm.page_subtitle };
      const { error } = await supabase.from('alumni_settings').update(payload).eq('id', 1);
      if (error) throw error;
      setShowSettingsForm(false);
      fetchDirectoryData();
    } catch (err) {
      setFormError('เกิดข้อผิดพลาดในการอัปเดตการตั้งค่า');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // ส่วนที่ 1: ตารางแสดงรายชื่อศิษย์เก่า + Donut Chart
  // ---------------------------------------------------------------------------
  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden";
  const subCard = "bg-slate-50/60 rounded-[2rem] border border-slate-100 shadow-sm";
  const inputClass = 'w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-purple-400 focus:ring-2 transition-all font-medium text-slate-900 text-sm';
  const labelClass = 'text-xs font-semibold text-slate-500 mb-1 block';

  if (!selectedAlumni) {
    return (
      <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
        <AuroraBackground />
        <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">
          
          <div className="text-center max-w-4xl mx-auto pt-2 pb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
              {settings.page_title}
            </h1>
            <p className="font-medium text-slate-600 text-lg leading-relaxed mx-auto max-w-2xl whitespace-pre-line">
              {settings.page_subtitle}
            </p>

            {/* 🔒 ปุ่มแอดมิน */}
            {canManageDirectory && (
              <div className="flex flex-wrap justify-center gap-3 mt-7">
                <button onClick={openCreateProfile} className="px-6 py-3 rounded-full text-sm font-bold text-white bg-slate-900 hover:bg-purple-700 shadow-md shadow-slate-900/20 hover:-translate-y-0.5 transition-all">
                  + เพิ่มโปรไฟล์ศิษย์เก่า
                </button>
                <button onClick={() => { setSettingsForm(settings); setShowSettingsForm(true); setFormError(''); }} className="px-6 py-3 rounded-full text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm hover:-translate-y-0.5 transition-all">
                  ⚙️ ตั้งค่าข้อความบนเว็บ
                </button>
              </div>
            )}
          </div>

          <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
            <SectionBanner text="ทำเนียบศิษย์เก่า" variant="website" />

            {/* 🍩 Donut Chart */}
            <div className="my-8 bg-white/95 border border-slate-100 shadow-lg rounded-[2rem] p-6 md:p-10 max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">สัดส่วนสายอาชีพศิษย์เก่า (Career Breakdown)</h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">คลิกที่รายการเพื่อกรองรายชื่อในตาราง</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 flex items-center justify-center">
                  <DonutChart
                    data={chartData} size={240} strokeWidth={30}
                    hoveredLabel={hoveredSegment} selectedLabel={selectedCategoryFilter}
                    onSegmentHover={setHoveredSegment} onSegmentClick={(key) => setSelectedCategoryFilter(prev => prev === key ? 'ALL' : key)}
                    centerContent={
                      <AnimatePresence mode="wait">
                        <motion.div key={displayLabel} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center justify-center text-center">
                          <p className="text-slate-500 text-xs font-bold truncate max-w-[140px]">{displayLabel}</p>
                          <p className="text-4xl font-black text-slate-900 my-0.5">{displayValue}</p>
                          {activeSegment ? (
                            <p className="text-sm font-extrabold" style={{ color: activeSegment.color }}>[{displayPercentage.toFixed(0)}%]</p>
                          ) : <p className="text-xs font-bold text-slate-400">คนในระบบ</p>}
                        </motion.div>
                      </AnimatePresence>
                    }
                  />
                </div>
                <div className="md:col-span-7 flex flex-col space-y-2 w-full pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-8">
                  {chartData.map((segment) => {
                    const pct = totalAlumniCount > 0 ? ((segment.value / totalAlumniCount) * 100).toFixed(0) : 0;
                    const isHovered = hoveredSegment === segment.label;
                    const isSelected = selectedCategoryFilter === segment.key;
                    return (
                      <motion.div key={segment.label} onMouseEnter={() => setHoveredSegment(segment.label)} onMouseLeave={() => setHoveredSegment(null)} onClick={() => setSelectedCategoryFilter(prev => prev === segment.key ? 'ALL' : segment.key)}
                        className={`flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 cursor-pointer border ${isSelected ? 'bg-purple-50/90 border-purple-300' : isHovered ? 'bg-slate-100/80 border-slate-200' : 'bg-transparent border-transparent hover:bg-slate-50'}`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <span className="h-3.5 w-3.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: segment.color }} />
                          <div className="truncate">
                            <span className="text-sm font-bold text-slate-800 block truncate">{segment.label}</span>
                            <span className="text-[11px] font-medium text-slate-400 block truncate">{segment.subLabel}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0 ml-3">
                          <span className="text-xs font-bold text-slate-400">({pct}%)</span>
                          <span className="text-sm font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full min-w-[44px] text-center">{segment.value} คน</span>
                        </div>
                      </motion.div>
                    );
                  })}
                  {selectedCategoryFilter !== 'ALL' && (
                    <div className="pt-2 flex justify-end">
                      <button onClick={() => setSelectedCategoryFilter('ALL')} className="text-xs font-bold text-rose-600 hover:text-rose-700 underline">แสดงทุกสายอาชีพทั้งหมด</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 🗺️ แผนที่ */}
            <div className="my-10"><ThailandAlumniMap provinceData={provinceCounts} onSelectProvince={(p) => setSelectedProvinceFilter(p ? p.nameTH : 'ALL')} /></div>

            {/* ตาราง */}
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-3"><span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-400 rounded-full"></span>รายชื่อศิษย์เก่า</h2>
              <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">{filteredAlumni.length} คน</span>
            </div>
            
            <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-slate-900 via-purple-900 to-rose-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold">Class of</th>
                      <th className="px-6 py-4 text-left text-xs font-bold">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold">Province</th>
                      <th className="px-6 py-4 text-left text-xs font-bold">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-bold">Title/Company</th>
                      {canManageDirectory && <th className="px-6 py-4 text-left text-xs font-bold">Manage</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAlumni.map((alumni) => (
                      <tr key={alumni.id} className={`hover:bg-purple-50/40 transition-colors ${!alumni.is_visible ? 'opacity-60' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-rose-400 text-white text-xs font-bold shadow-sm">BME {alumni.generation}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap"><button onClick={() => setSelectedAlumni(alumni)} className="text-slate-900 hover:text-purple-700 font-bold transition-colors text-sm cursor-pointer text-left">{alumni.name}</button></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">📍 {alumni.province || '-'}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 rounded-full border text-[11px] font-bold ${getCategoryStyle(alumni.category)}`}>{alumni.category}</span></td>
                        <td className="px-6 py-4 text-sm min-w-[220px]"><span className="font-bold text-slate-800 block">{alumni.position}</span><span className="text-slate-500 text-xs mt-0.5 block font-medium">{alumni.company}</span></td>
                        {canManageDirectory && (
                          <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                            <button onClick={() => openEditProfile(alumni)} className="text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg text-xs font-bold">แก้ไข</button>
                            <button onClick={() => deleteProfile(alumni.id, alumni.name)} className="text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs font-bold">ลบ</button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* Modals ตรงนี้ใส่ด้านล่างสุด */}
        {renderModals()}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // ส่วนที่ 2: หน้าโปรไฟล์ส่วนตัว (Alumni Profile Detail)
  // ---------------------------------------------------------------------------
  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />
      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">
        <button onClick={() => setSelectedAlumni(null)} className="flex items-center text-slate-700 hover:text-white hover:bg-slate-900 mb-6 text-sm font-bold transition-all bg-white/80 backdrop-blur-md border border-slate-200 rounded-full px-5 py-2 w-fit shadow-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          ย้อนกลับไปหน้า Directory
        </button>
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          <div className="text-center mb-10 mt-6">
            <span className={`inline-block px-4 py-1.5 rounded-full border text-xs font-black uppercase mb-4 ${getCategoryStyle(selectedAlumni.category)}`}>{selectedAlumni.category}</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 mb-3">{selectedAlumni.name}</h1>
            <p className="text-lg md:text-xl text-slate-600 font-medium">{selectedAlumni.position}</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
              <div className="bg-white p-2 shadow-lg rounded-[2rem] border border-slate-100">
                <img src={formatImageUrl(selectedAlumni.image_url) || "https://placehold.co/400x500?text=BME+Alumni"} alt={selectedAlumni.name} className="w-full h-80 object-cover rounded-[1.6rem] bg-slate-100" />
              </div>
              <div className={`${subCard} p-6`}>
                <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-3"><span className="w-1.5 h-5 bg-gradient-to-b from-purple-500 to-indigo-400 rounded-full"></span>BME Quick Fact</h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-end border-b border-slate-200 pb-3">
                    <div className="text-xs text-slate-500 font-medium">Field:<br /><span className="text-sm font-bold text-slate-800">{selectedAlumni.field}</span></div>
                    <div className="text-xs text-slate-500 text-right font-medium">Class of:<br /><span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-rose-500">BME {selectedAlumni.generation}</span></div>
                  </div>
                  <div className="border-b border-slate-200 pb-3"><p className="text-xs text-slate-500 mb-1 font-medium">Faculty / Institute:</p><p className="text-sm font-bold text-slate-800">{selectedAlumni.faculty}</p></div>
                  <div className="border-b border-slate-200 pb-3"><p className="text-xs text-slate-500 mb-1 font-medium">Province / Area:</p><p className="text-sm font-bold text-slate-800">📍 {selectedAlumni.province || '-'}</p></div>
                  <div><p className="text-xs text-slate-500 mb-1 font-medium">Degree:</p><p className="text-sm font-bold text-slate-800">{selectedAlumni.degree}</p></div>
                </div>
              </div>
            </div>
            <div className={`${subCard} flex-grow p-8 md:p-10 w-full`}>
              <div className="mb-8">
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600">อายุ {selectedAlumni.age || '-'}</span>
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600">{selectedAlumni.company}</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{selectedAlumni.name}</h2>
                <p className="text-purple-700 font-bold">{selectedAlumni.position}</p>
              </div>
              <div className="text-slate-600 font-medium leading-relaxed space-y-6">
                <p className="whitespace-pre-line">{selectedAlumni.description}</p>
                {selectedAlumni.quote && (
                  <div className="border-l-4 border-rose-400 pl-6 py-4 my-8 bg-gradient-to-r from-rose-50 to-purple-50/60 rounded-r-2xl">
                    <p className="italic text-slate-800 font-semibold text-lg mb-2">"{selectedAlumni.quote}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {renderModals()}
      </div>
    </div>
  );

  // ---------------------------------------------------------------------------
  // ฟังก์ชันวาด Modals ฟอร์ม (ใส่ไว้ใน return หลักเพื่อความสะอาดของโค้ด)
  // ---------------------------------------------------------------------------
  function renderModals() {
    return (
      <AnimatePresence>
        {canManageDirectory && showProfileForm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowProfileForm(false)} />
            <motion.form onSubmit={saveProfile} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative z-10 bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl">
              <div className="p-5 border-b sticky top-0 bg-white z-10 flex justify-between"><h3 className="font-black text-lg">{editingId ? 'แก้ไขโปรไฟล์ศิษย์เก่า' : 'เพิ่มโปรไฟล์ใหม่'}</h3><button type="button" onClick={() => setShowProfileForm(false)}>✕</button></div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div><label className={labelClass}>ชื่อ-นามสกุล *</label><input name="name" required value={profileForm.name} onChange={e => setProfileForm(p => ({...p, name: e.target.value}))} className={inputClass} /></div>
                <div><label className={labelClass}>รุ่น (Generation) *</label><input type="number" required value={profileForm.generation} onChange={e => setProfileForm(p => ({...p, generation: e.target.value}))} className={inputClass} placeholder="เช่น 1, 2, 3" /></div>
                <div><label className={labelClass}>หมวดหมู่สายอาชีพ</label>
                  <select value={profileForm.category} onChange={e => setProfileForm(p => ({...p, category: e.target.value}))} className={inputClass}>
                    {settings.categories.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
                  </select>
                </div>
                <div><label className={labelClass}>ตำแหน่งงาน (Position)</label><input value={profileForm.position} onChange={e => setProfileForm(p => ({...p, position: e.target.value}))} className={inputClass} /></div>
                <div><label className={labelClass}>บริษัท (Company)</label><input value={profileForm.company} onChange={e => setProfileForm(p => ({...p, company: e.target.value}))} className={inputClass} /></div>
                <div><label className={labelClass}>จังหวัด (สำหรับการแสดงบนแผนที่)</label><input value={profileForm.province} onChange={e => setProfileForm(p => ({...p, province: e.target.value}))} className={inputClass} placeholder="เช่น กรุงเทพมหานคร" /></div>
                <div><label className={labelClass}>อายุ</label><input type="number" value={profileForm.age} onChange={e => setProfileForm(p => ({...p, age: e.target.value}))} className={inputClass} /></div>
                <div><label className={labelClass}>ลิงก์รูปภาพ (Drive/URL)</label><input value={profileForm.image_url} onChange={e => setProfileForm(p => ({...p, image_url: e.target.value}))} className={inputClass} /></div>
                <div className="col-span-2"><label className={labelClass}>คำอธิบาย / ประสบการณ์</label><textarea rows={3} value={profileForm.description} onChange={e => setProfileForm(p => ({...p, description: e.target.value}))} className={inputClass} /></div>
                <div className="col-span-2"><label className={labelClass}>Quote (คำคม/แรงบันดาลใจ)</label><input value={profileForm.quote} onChange={e => setProfileForm(p => ({...p, quote: e.target.value}))} className={inputClass} /></div>
                <label className="col-span-2 flex items-center gap-3"><input type="checkbox" checked={profileForm.is_visible} onChange={e => setProfileForm(p => ({...p, is_visible: e.target.checked}))} className="w-5 h-5 accent-purple-600" /><span className="text-sm font-bold">แสดงโปรไฟล์นี้สู่สาธารณะ</span></label>
                {formError && <p className="col-span-2 text-rose-600 font-bold text-sm">{formError}</p>}
              </div>
              <div className="p-5 border-t sticky bottom-0 bg-white flex justify-end gap-2"><button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900">บันทึกข้อมูล</button></div>
            </motion.form>
          </div>
        )}

        {canManageDirectory && showSettingsForm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowSettingsForm(false)} />
            <motion.form onSubmit={saveSettings} className="relative z-10 bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl">
              <div className="p-5 border-b flex justify-between"><h3 className="font-black text-lg">⚙️ ตั้งค่าข้อความหน้า Directory</h3><button type="button" onClick={() => setShowSettingsForm(false)}>✕</button></div>
              <div className="p-6 space-y-4">
                <div><label className={labelClass}>หัวข้อหลัก (H1)</label><input value={settingsForm.page_title || ''} onChange={e => setSettingsForm(s => ({...s, page_title: e.target.value}))} className={inputClass} /></div>
                <div><label className={labelClass}>คำอธิบายย่อย</label><textarea rows={2} value={settingsForm.page_subtitle || ''} onChange={e => setSettingsForm(s => ({...s, page_subtitle: e.target.value}))} className={inputClass} /></div>
                <p className="text-xs text-rose-500 font-bold">* การแก้ไขหมวดหมู่สายอาชีพและสีสัน ต้องแก้ไขในฐานข้อมูล (Supabase) โดยตรง เนื่องจากมีความซับซ้อนของค่าสีแบบ HSL</p>
                {formError && <p className="text-rose-600 font-bold text-sm">{formError}</p>}
              </div>
              <div className="p-5 border-t flex justify-end"><button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900">บันทึกการตั้งค่า</button></div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    );
  }
}