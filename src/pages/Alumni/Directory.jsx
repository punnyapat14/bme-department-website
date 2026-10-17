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

// 📌 Helper: แปลงลิงก์ Google Drive เป็นรูป
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

  // ⚙️ State จัดการแอดมิน (ฟอร์มตั้งค่าเพจและหมวดหมู่)
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [settingsForm, setSettingsForm] = useState({});
  const [formCategories, setFormCategories] = useState([]); // สำหรับจัดการ categories
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
      const { data: settingsData, error: settingsError } = await supabase.from('alumni_settings').select('*').eq('id', 1).single();
      if (!settingsError && settingsData) {
          setSettings(settingsData);
          setFormCategories(settingsData.categories || []);
      }

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
      if(selectedAlumni && selectedAlumni.id === editingId) {
          setSelectedAlumni(profileForm); // Update view if editing currently viewed
      }
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

  // ⚙️ ฟังก์ชันสำหรับการจัดการ Settings และ Categories
  const openEditSettings = () => {
      setSettingsForm(settings);
      setFormCategories([...(settings.categories || [])]);
      setFormError('');
      setShowSettingsForm(true);
  };

  const handleCategoryChange = (index, field, value) => {
      const newCats = [...formCategories];
      newCats[index][field] = value;
      setFormCategories(newCats);
  };

  const addCategory = () => {
      setFormCategories([
          ...formCategories,
          { key: 'หมวดหมู่ใหม่', shortLabel: 'ใหม่', subLabel: 'New Category', color: 'hsl(0 0% 50%)', chip: 'bg-slate-100 text-slate-700 border-slate-200' }
      ]);
  };

  const removeCategory = (index) => {
      const newCats = [...formCategories];
      newCats.splice(index, 1);
      setFormCategories(newCats);
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    if (!canManageDirectory) return;
    setSubmitting(true);
    try {
      const payload = { 
          page_title: settingsForm.page_title, 
          page_subtitle: settingsForm.page_subtitle,
          categories: formCategories // บันทึก categories ที่แก้ไขแล้ว
      };
      const { error } = await supabase.from('alumni_settings').update(payload).eq('id', 1);
      if (error) throw error;
      setShowSettingsForm(false);
      fetchDirectoryData();
    } catch (err) {
      console.error(err);
      setFormError('เกิดข้อผิดพลาดในการอัปเดตการตั้งค่า');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // ตัวแปร CSS
  // ---------------------------------------------------------------------------
  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden";
  const subCard = "bg-slate-50/60 rounded-[2rem] border border-slate-100 shadow-sm relative group"; // เพิ่ม relative และ group สำหรับปุ่มแก้ไข
  const inputClass = 'w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-purple-400 focus:ring-2 transition-all font-medium text-slate-900 text-sm';
  const labelClass = 'text-xs font-semibold text-slate-500 mb-1 block';

  if (!selectedAlumni) {
    return (
      <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
        <AuroraBackground />
        <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">
          
          <div className="text-center max-w-4xl mx-auto pt-2 pb-10 relative group">
            {/* ⚙️ ปุ่มแก้ไข Header (Admin) */}
            {canManageDirectory && (
                <button 
                    onClick={openEditSettings} 
                    className="absolute top-0 right-0 bg-white/90 p-2 rounded-xl shadow-sm border border-slate-200 text-slate-400 hover:text-purple-600 hover:border-purple-300 transition-all opacity-0 group-hover:opacity-100"
                    title="แก้ไขหัวข้อและคำอธิบาย"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
              {settings.page_title}
            </h1>
            <p className="font-medium text-slate-600 text-lg leading-relaxed mx-auto max-w-2xl whitespace-pre-line">
              {settings.page_subtitle}
            </p>
          </div>

          <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
            <SectionBanner text="ทำเนียบศิษย์เก่า" variant="website" />

            {/* 🍩 Donut Chart (รวมปุ่มแก้ไขหมวดหมู่) */}
            <div className="my-8 bg-white/95 border border-slate-100 shadow-lg rounded-[2rem] p-6 md:p-10 max-w-4xl mx-auto relative group">
              {/* ⚙️ ปุ่มแก้ไข กราฟ/หมวดหมู่ (Admin) */}
              {canManageDirectory && (
                  <button 
                      onClick={openEditSettings} 
                      className="absolute top-4 right-4 bg-slate-50 p-2 rounded-xl shadow-sm border border-slate-200 text-slate-400 hover:text-purple-600 transition-all opacity-0 group-hover:opacity-100 z-10"
                      title="ตั้งค่าหมวดหมู่สายอาชีพ"
                  >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </button>
              )}

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
              
              <div className="flex gap-2 items-center">
                  <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">{filteredAlumni.length} คน</span>
                  {/* ➕ ปุ่มเพิ่มข้อมูล (Admin) แบบชัดเจน */}
                  {canManageDirectory && (
                      <button 
                          onClick={openCreateProfile} 
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                      >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                          เพิ่มศิษย์เก่า
                      </button>
                  )}
              </div>
            </div>
            
            <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm relative">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-slate-900 via-purple-900 to-rose-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold">Class of</th>
                      <th className="px-6 py-4 text-left text-xs font-bold">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold">Province</th>
                      <th className="px-6 py-4 text-left text-xs font-bold">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-bold">Title/Company</th>
                      {canManageDirectory && <th className="px-6 py-4 text-right text-xs font-bold">Manage</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAlumni.length === 0 ? (
                        <tr>
                            <td colSpan={canManageDirectory ? 6 : 5} className="px-6 py-8 text-center text-slate-500">
                                ไม่พบข้อมูลที่ค้นหา
                            </td>
                        </tr>
                    ) : (
                        filteredAlumni.map((alumni) => (
                        <tr key={alumni.id} className={`hover:bg-purple-50/40 transition-colors ${!alumni.is_visible ? 'opacity-60 bg-slate-50' : ''}`}>
                            <td className="px-6 py-4 whitespace-nowrap"><span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-rose-400 text-white text-xs font-bold shadow-sm">BME {alumni.generation}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap"><button onClick={() => setSelectedAlumni(alumni)} className="text-slate-900 hover:text-purple-700 font-bold transition-colors text-sm cursor-pointer text-left flex items-center gap-2">{alumni.name} {!alumni.is_visible && <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">ซ่อน</span>}</button></td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">📍 {alumni.province || '-'}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 rounded-full border text-[11px] font-bold ${getCategoryStyle(alumni.category)}`}>{alumni.category}</span></td>
                            <td className="px-6 py-4 text-sm min-w-[220px]"><span className="font-bold text-slate-800 block">{alumni.position}</span><span className="text-slate-500 text-xs mt-0.5 block font-medium">{alumni.company}</span></td>
                            {canManageDirectory && (
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => openEditProfile(alumni)} className="text-slate-500 hover:text-purple-600 bg-slate-100 hover:bg-purple-100 p-1.5 rounded-lg transition-colors cursor-pointer" title="แก้ไข">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button onClick={() => deleteProfile(alumni.id, alumni.name)} className="text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-100 p-1.5 rounded-lg transition-colors cursor-pointer" title="ลบ">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </td>
                            )}
                        </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
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
        <div className="flex justify-between items-center mb-6">
            <button onClick={() => setSelectedAlumni(null)} className="flex items-center text-slate-700 hover:text-white hover:bg-slate-900 text-sm font-bold transition-all bg-white/80 backdrop-blur-md border border-slate-200 rounded-full px-5 py-2 shadow-sm cursor-pointer">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            ย้อนกลับ
            </button>

            {/* ⚙️ ปุ่มแก้ไข/ลบ ในหน้าโปรไฟล์ (Admin) */}
            {canManageDirectory && (
                <div className="flex gap-2">
                    <button 
                        onClick={() => openEditProfile(selectedAlumni)} 
                        className="flex items-center gap-1.5 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full text-sm font-bold border border-purple-200 transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        แก้ไข
                    </button>
                    <button 
                        onClick={() => deleteProfile(selectedAlumni.id, selectedAlumni.name)} 
                        className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full text-sm font-bold border border-rose-200 transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        ลบทิ้ง
                    </button>
                </div>
            )}
        </div>

        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          <div className="text-center mb-10 mt-6 relative">
            {!selectedAlumni.is_visible && (
                <div className="absolute top-0 right-0 bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full border border-rose-200">
                    ซ่อนจากสาธารณะ
                </div>
            )}
            <span className={`inline-block px-4 py-1.5 rounded-full border text-xs font-black uppercase mb-4 ${getCategoryStyle(selectedAlumni.category)}`}>{selectedAlumni.category}</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 mb-3">{selectedAlumni.name}</h1>
            <p className="text-lg md:text-xl text-slate-600 font-medium">{selectedAlumni.position}</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
              <div className="bg-white p-2 shadow-lg rounded-[2rem] border border-slate-100 relative group">
                {/* ปุ่มแก้ไขรูปภาพ */}
                {canManageDirectory && (
                    <button onClick={() => openEditProfile(selectedAlumni)} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md text-slate-500 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </button>
                )}
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
        {/* Modal เพิ่ม/แก้ไข โปรไฟล์ */}
        {canManageDirectory && showProfileForm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowProfileForm(false)} />
            <motion.form onSubmit={saveProfile} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative z-10 bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl">
              <div className="p-5 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                  <h3 className="font-black text-lg text-slate-800">{editingId ? '✏️ แก้ไขข้อมูลศิษย์เก่า' : '✨ เพิ่มข้อมูลศิษย์เก่าใหม่'}</h3>
                  <button type="button" onClick={() => setShowProfileForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 transition-colors cursor-pointer">✕</button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>ชื่อ-นามสกุล *</label><input name="name" required value={profileForm.name} onChange={e => setProfileForm(p => ({...p, name: e.target.value}))} className={inputClass} placeholder="เช่น สมชาย ใจดี" /></div>
                <div><label className={labelClass}>รุ่น (Generation) *</label><input type="number" required value={profileForm.generation} onChange={e => setProfileForm(p => ({...p, generation: e.target.value}))} className={inputClass} placeholder="เช่น 15" /></div>
                <div><label className={labelClass}>หมวดหมู่สายอาชีพ</label>
                  <select value={profileForm.category} onChange={e => setProfileForm(p => ({...p, category: e.target.value}))} className={inputClass}>
                    <option value="" disabled>-- เลือกหมวดหมู่ --</option>
                    {settings.categories && settings.categories.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
                  </select>
                </div>
                <div><label className={labelClass}>ตำแหน่งงาน (Position)</label><input value={profileForm.position} onChange={e => setProfileForm(p => ({...p, position: e.target.value}))} className={inputClass} placeholder="เช่น Software Engineer" /></div>
                <div><label className={labelClass}>สถานที่ทำงาน / บริษัท</label><input value={profileForm.company} onChange={e => setProfileForm(p => ({...p, company: e.target.value}))} className={inputClass} placeholder="เช่น Google Thailand" /></div>
                <div><label className={labelClass}>จังหวัด (สำหรับแสดงจุดบนแผนที่)</label><input value={profileForm.province} onChange={e => setProfileForm(p => ({...p, province: e.target.value}))} className={inputClass} placeholder="เช่น กรุงเทพมหานคร" /></div>
                <div><label className={labelClass}>อายุ</label><input type="number" value={profileForm.age} onChange={e => setProfileForm(p => ({...p, age: e.target.value}))} className={inputClass} placeholder="ตัวเลข" /></div>
                <div><label className={labelClass}>ลิงก์รูปภาพ (URL หรือ Google Drive ID)</label><input value={profileForm.image_url} onChange={e => setProfileForm(p => ({...p, image_url: e.target.value}))} className={inputClass} placeholder="วางลิงก์รูปภาพที่นี่" /></div>
                <div className="md:col-span-2"><label className={labelClass}>คำอธิบาย / ประวัติการทำงาน</label><textarea rows={3} value={profileForm.description} onChange={e => setProfileForm(p => ({...p, description: e.target.value}))} className={inputClass} placeholder="พิมพ์รายละเอียดเพิ่มเติม..." /></div>
                <div className="md:col-span-2"><label className={labelClass}>คำคม / ข้อคิดในการทำงาน (Quote)</label><input value={profileForm.quote} onChange={e => setProfileForm(p => ({...p, quote: e.target.value}))} className={inputClass} placeholder="เช่น ความพยายามอยู่ที่ไหน..." /></div>
                
                <div className="md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200 mt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={profileForm.is_visible} onChange={e => setProfileForm(p => ({...p, is_visible: e.target.checked}))} className="w-5 h-5 accent-purple-600 rounded cursor-pointer" />
                        <div>
                            <span className="text-sm font-bold text-slate-800 block">แสดงโปรไฟล์นี้สู่สาธารณะ</span>
                            <span className="text-xs text-slate-500">หากติ๊กออก จะเห็นเฉพาะแอดมินเท่านั้น</span>
                        </div>
                    </label>
                </div>
                {formError && <p className="md:col-span-2 text-rose-600 font-bold text-sm bg-rose-50 p-3 rounded-lg">{formError}</p>}
              </div>
              <div className="p-5 border-t sticky bottom-0 bg-white flex justify-end gap-3 rounded-b-[2rem]">
                  <button type="button" onClick={() => setShowProfileForm(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">ยกเลิก</button>
                  <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/30 transition-all cursor-pointer flex items-center gap-2">
                      {submitting ? 'กำลังบันทึก...' : (editingId ? 'บันทึกการแก้ไข' : 'เพิ่มข้อมูล')}
                  </button>
              </div>
            </motion.form>
          </div>
        )}

        {/* Modal ตั้งค่าหน้าเว็บ และ หมวดหมู่ */}
        {canManageDirectory && showSettingsForm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowSettingsForm(false)} />
            <motion.form onSubmit={saveSettings} className="relative z-10 bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl flex flex-col">
              <div className="p-5 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                  <h3 className="font-black text-lg flex items-center gap-2">⚙️ ตั้งค่าระบบทำเนียบศิษย์เก่า</h3>
                  <button type="button" onClick={() => setShowSettingsForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 transition-colors cursor-pointer">✕</button>
              </div>
              
              <div className="p-6 space-y-6 flex-grow">
                {/* 1. ตั้งค่าข้อความ */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">1. ข้อความส่วนหัว (Header)</h4>
                    <div className="space-y-4">
                        <div><label className={labelClass}>หัวข้อหลัก (H1)</label><input value={settingsForm.page_title || ''} onChange={e => setSettingsForm(s => ({...s, page_title: e.target.value}))} className={inputClass} /></div>
                        <div><label className={labelClass}>คำอธิบายย่อย</label><textarea rows={2} value={settingsForm.page_subtitle || ''} onChange={e => setSettingsForm(s => ({...s, page_subtitle: e.target.value}))} className={inputClass} /></div>
                    </div>
                </div>

                {/* 2. ตั้งค่าหมวดหมู่ */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-end mb-4 border-b border-slate-200 pb-2">
                        <h4 className="font-bold text-slate-800">2. หมวดหมู่สายอาชีพ (กราฟ Donut)</h4>
                        <button type="button" onClick={addCategory} className="text-xs font-bold bg-slate-900 hover:bg-purple-600 text-white px-3 py-1.5 rounded-full transition-colors cursor-pointer">+ เพิ่มหมวดหมู่</button>
                    </div>
                    
                    <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                        {formCategories.map((cat, idx) => (
                            <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm relative group">
                                <button type="button" onClick={() => removeCategory(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" title="ลบหมวดหมู่นี้">✕</button>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div><label className="text-[10px] font-bold text-slate-500 uppercase">ชื่อเต็ม (ใช้จับคู่ข้อมูล)</label>
                                        <input value={cat.key} onChange={e => handleCategoryChange(idx, 'key', e.target.value)} className="w-full text-sm p-2 border rounded bg-slate-50 focus:bg-white" />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1"><label className="text-[10px] font-bold text-slate-500 uppercase">ป้ายในกราฟ (สั้น)</label>
                                            <input value={cat.shortLabel} onChange={e => handleCategoryChange(idx, 'shortLabel', e.target.value)} className="w-full text-sm p-2 border rounded bg-slate-50 focus:bg-white" />
                                        </div>
                                        <div className="w-20"><label className="text-[10px] font-bold text-slate-500 uppercase">สี HSL</label>
                                            <input value={cat.color} onChange={e => handleCategoryChange(idx, 'color', e.target.value)} className="w-full text-xs p-2 border rounded bg-slate-50 focus:bg-white text-center" placeholder="hsl(0 0% 0%)" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2"><label className="text-[10px] font-bold text-slate-500 uppercase">คำอธิบายย่อย (EN)</label>
                                        <input value={cat.subLabel} onChange={e => handleCategoryChange(idx, 'subLabel', e.target.value)} className="w-full text-sm p-2 border rounded bg-slate-50 focus:bg-white" />
                                    </div>
                                    <div className="md:col-span-2"><label className="text-[10px] font-bold text-slate-500 uppercase">คลาส CSS ป้ายกำกับ (Tailwind)</label>
                                        <input value={cat.chip} onChange={e => handleCategoryChange(idx, 'chip', e.target.value)} className="w-full text-xs p-2 border rounded bg-slate-50 focus:bg-white font-mono" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {formError && <p className="text-rose-600 font-bold text-sm text-center">{formError}</p>}
              </div>

              <div className="p-5 border-t sticky bottom-0 bg-white flex justify-end gap-3 rounded-b-[2rem]">
                  <button type="button" onClick={() => setShowSettingsForm(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">ยกเลิก</button>
                  <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900 hover:bg-black transition-all cursor-pointer flex items-center gap-2">
                      {submitting ? 'กำลังบันทึก...' : '💾 บันทึกการตั้งค่าทั้งหมด'}
                  </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    );
  }
}