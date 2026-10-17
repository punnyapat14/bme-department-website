import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "../../supabaseClient";

// 📌 นำเข้า Component พื้นหลังและแบนเนอร์จาก ThemeElements
import { AuroraBackground, SectionBanner } from "../../components/ThemeElements";
import { useAuth } from "../../contexts/AuthContext";

// ==========================================
// 📌 ธีมสีสำหรับการ์ดกิจกรรมนักศึกษา
// ==========================================
const ACTIVITY_THEMES = {
  rose: { label: 'ชมพู (รับน้อง/สาขา)', color: 'from-rose-400 to-pink-500', iconColor: 'text-rose-600 bg-rose-100' },
  amber: { label: 'ส้ม (ภาควิชา/ไหว้ครู)', color: 'from-amber-400 to-orange-500', iconColor: 'text-amber-600 bg-amber-100' },
  purple: { label: 'ม่วง (ศิษย์เก่า/BME)', color: 'from-purple-500 to-indigo-500', iconColor: 'text-purple-600 bg-purple-100' },
  blue: { label: 'ฟ้า (กีฬา/นักศึกษา)', color: 'from-blue-400 to-cyan-500', iconColor: 'text-blue-600 bg-blue-100' },
  emerald: { label: 'เขียว (วิชาการ/Open House)', color: 'from-emerald-400 to-teal-500', iconColor: 'text-emerald-600 bg-emerald-100' },
  slate: { label: 'เทาเข้ม (โครงงาน/สอบ)', color: 'from-slate-600 to-slate-800', iconColor: 'text-slate-700 bg-slate-100' },
};

// ==========================================
// 📌 Component: ระบบ Fade-in เวลาเลื่อนจอ
// ==========================================
const FadeInSection = ({ children, delay = "0s", className = "" }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setVisible(true);
      });
    }, { threshold: 0.12 });
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={domRef} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`} style={{ transitionDelay: delay }}>
      {children}
    </div>
  );
};

// ==========================================
// 📌 ปุ่มแก้ไข (Edit / Delete) มาตรฐาน (แสดงตลอดเวลา)
// ==========================================
const ActionButtons = ({ onEdit, onDelete, positionClass = "top-3 right-3" }) => (
  <div className={`absolute ${positionClass} flex gap-2 z-30`}>
    {onEdit && (
      <button type="button" onClick={onEdit} className="p-1.5 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
      </button>
    )}
    {onDelete && (
      <button type="button" onClick={onDelete} className="p-1.5 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    )}
  </div>
);

// 📌 ฐานข้อมูลจะอ่านฟิลด์พิมพ์เล็ก (activitytype) ต้องแก้ให้ตรงกัน
const EMPTY_FORM = {
  id: '',
  category: 'academic',
  semester: '1/2569',
  date: '',
  title: '',
  activitytype: 'กิจกรรมสาขาวิชา', 
  theme: 'purple'
};

// 🛠️ Helper: แปลงรูปแบบวันที่ที่เลือกจาก Date Picker (YYYY-MM-DD) ให้แสดงผลเป็นภาษาไทยสวยงาม
const formatDateTH = (dateStr) => {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  return dateStr;
};

// 🛠️ Helper: ดึงตัวย่อเดือนออกมาจากวันที่อัตโนมัติ (เช่น นำค่า '2026-08-15' มาแปลงเป็น 'ส.ค.')
const getShortMonthTH = (dateStr) => {
  if (!dateStr) return 'BME';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { month: 'short' });
  }
  return 'BME';
};

// ==========================================
// 📌 Main Component
// ==========================================
export default function AcademicCalendar() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({
    header_title: 'ปฏิทินการศึกษา',
    header_subtitle: 'กำหนดการสำคัญ ตารางการลงทะเบียนเรียน และกิจกรรมเสริมหลักสูตร',
    warning_title: 'พบปัญหาการลงทะเบียนเรียน?',
    warning_subtitle: 'ลืมรหัสผ่าน / ระบบขัดข้อง / ลงทะเบียนไม่ได้ / ชำระเงินไม่ผ่าน',
    warning_text: 'นักศึกษาต้องลงทะเบียนผ่านระบบ REG ด้วยตนเอง และชำระเงินตามช่วงวัน-เวลาที่กำหนด หากพ้นกำหนดจะต้องเสียค่าปรับลงทะเบียนล่าช้าตามระเบียบมหาวิทยาลัย'
  });

  const [loading, setLoading] = useState(true);
  const [activeSemester, setActiveSemester] = useState('1/2569');

  // States สำหรับ Modal เพิ่ม/แก้ไข Event 
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // States สำหรับแก้ไขข้อความหน้าเว็บ (Page Settings)
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsModalType, setSettingsModalType] = useState('header'); 
  const [settingsForm, setSettingsForm] = useState({});

  // 🔒 ตรวจสอบสิทธิ์แบบครอบคลุม
  const canManageCalendar = Boolean(
    user && (
      ['admin', 'faculty', 'teacher', 'staff', 'instructor'].includes(String(user.role || user?.user_metadata?.role || '').toLowerCase()) ||
      user.isAdmin === true ||
      String(user.email || '').endsWith('@sci.kmutnb.ac.th') ||
      String(user.email || '').endsWith('@email.kmutnb.ac.th') ||
      String(user.email || '').toLowerCase() === 'bme.kmutnb.th@gmail.com'
    )
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('calendar_events')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (eventsError) throw eventsError;

      const { data: settingsData, error: settingsError } = await supabase
        .from('page_settings')
        .select('*')
        .eq('id', 1)
        .single();
        
      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;

      setItems(eventsData || []);
      if (settingsData) setSettings(settingsData);

      const semestersInDb = [...new Set((eventsData || []).map(r => r.semester).filter(Boolean).filter(s => s !== '-'))];
      if (semestersInDb.length > 0 && !semestersInDb.includes(activeSemester)) {
        setActiveSemester(semestersInDb[0]);
      }
    } catch (err) {
      console.error('Fetch data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const semesters = useMemo(() => {
    const fromData = [...new Set(items.filter(i => i.category !== 'activity' && i.semester !== '-').map(i => i.semester).filter(Boolean))];
    return fromData.length > 0 ? fromData : ['1/2569', '2/2569'];
  }, [items]);

  const academicList = useMemo(() => items.filter(i => i.category === 'academic' && i.semester === activeSemester), [items, activeSemester]);
  const registrationList = useMemo(() => items.filter(i => i.category === 'registration' && i.semester === activeSemester), [items, activeSemester]);
  const activitiesList = useMemo(() => items.filter(i => i.category === 'activity'), [items]);

  // 📌 ฟังก์ชันจัดการหน้าต่างแก้ไข Settings แบบแยกส่วน
  const openSettingsModal = (type) => {
    setSettingsModalType(type);
    setSettingsForm({
      ...settings,
      sec_calendar_title: settings.sec_calendar_title || 'กำหนดการและวันลงทะเบียน',
      sec_activity_title: settings.sec_activity_title || 'ปฏิทินกิจกรรมนักศึกษา'
    });
    setShowSettingsModal(true);
  };

  // 📌 จัดการข้อมูลกำหนดการ (Events) ลง Supabase
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!canManageCalendar) return;
    setSubmitting(true);
    
    try {
      const payload = {
        category: formData.category,
        semester: formData.category !== 'activity' ? formData.semester : '-',
        date: formData.date,
        title: formData.title,
        // เอา shortdate ออกไปเลย และแก้เป็นพิมพ์เล็กให้ตรงกับฐานข้อมูล
        activitytype: formData.category === 'activity' ? formData.activitytype : null,
        theme: formData.category === 'activity' ? formData.theme : null
      };

      if (editingItem) {
        const { error } = await supabase.from('calendar_events').update(payload).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('calendar_events').insert([payload]);
        if (error) throw error;
      }

      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล (Error 400 หรือโครงสร้างตารางไม่ตรงกัน)');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('ยืนยันการลบรายการนี้?')) return;
    try {
      await supabase.from('calendar_events').delete().eq('id', id);
      fetchData();
    } catch (error) {
      alert('ลบข้อมูลไม่สำเร็จ');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!canManageCalendar) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('page_settings').upsert({ id: 1, ...settingsForm });
      if (error) throw error;
      setSettings(settingsForm);
      setShowSettingsModal(false);
    } catch (error) {
      alert('บันทึกข้อความหน้าเว็บไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden";

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />

      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">

        {/* ---------------- Header Section ---------------- */}
        <FadeInSection delay="0.1s">
          <div className="relative text-center max-w-4xl mx-auto pt-2 pb-10 rounded-3xl transition-colors duration-300">
            {canManageCalendar && (
              <ActionButtons onEdit={() => openSettingsModal('header')} positionClass="-top-4 right-0 md:-right-8" />
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
              {settings.header_title}
            </h1>
            <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl whitespace-pre-line">
              {settings.header_subtitle}
            </p>
          </div>
        </FadeInSection>

        {/* ---------------- 📌 1. ปฏิทินการศึกษา (วิชาการ & ลงทะเบียน) ---------------- */}
        <FadeInSection delay="0.2s">
          <div className={`p-6 md:p-10 lg:p-12 mb-16 ${bentoGlass}`}>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <div className="flex-1 w-full flex items-center gap-2">
                <div className="flex-1">
                  <SectionBanner text={settings.sec_calendar_title || 'กำหนดการและวันลงทะเบียน'} variant="calendar" />
                </div>
                {canManageCalendar && (
                  <button onClick={() => openSettingsModal('banners')} title="แก้ไขข้อความแบนเนอร์" className="p-2.5 bg-slate-100/80 text-slate-500 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition shadow-sm border border-slate-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </button>
                )}
              </div>
              {canManageCalendar && (
                <button onClick={() => { setEditingItem(null); setFormData({ ...EMPTY_FORM, category: 'academic', semester: activeSemester }); setShowModal(true); }} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow hover:bg-purple-700 shrink-0">
                  + เพิ่มกำหนดการ/ลงทะเบียน
                </button>
              )}
            </div>

            {/* ปุ่มสลับเทอม (Tab Switcher) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 border-b border-slate-200/60 pb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  ภาคการศึกษาที่ {activeSemester}
                </h2>
                <p className="text-slate-500 text-sm md:text-base font-medium mt-1.5">ระดับปริญญาตรี และบัณฑิตศึกษา (มจพ. กรุงเทพฯ)</p>
              </div>
              <div className="flex flex-wrap bg-slate-100/80 p-1.5 rounded-2xl shadow-sm shrink-0">
                {semesters.map((term) => (
                  <button
                    key={term}
                    onClick={() => setActiveSemester(term)}
                    className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${activeSemester === term ? 'bg-white text-purple-700 shadow-[0_2px_10px_rgba(0,0,0,0.05)]' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    ภาคเรียนที่ {term}
                  </button>
                ))}
              </div>
            </div>

            {/* ตารางข้อมูล */}
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[1, 2].map((n) => (
                  <div key={n} className="h-80 rounded-[1.5rem] bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSemester}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
                >
                  {/* ตารางที่ 1: กำหนดการทางวิชาการ */}
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">กำหนดการทางวิชาการ</h3>
                      </div>
                    </div>

                    <div className="bg-slate-50/70 rounded-[1.5rem] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-slate-100 relative">
                      <div className="overflow-x-auto w-full">
                        <table className="w-full min-w-[300px] text-left text-sm md:text-[15px]">
                          <thead className="bg-slate-100/80 border-b border-slate-200/80 text-slate-700">
                            <tr>
                              <th className="py-4 px-5 font-bold w-[42%]">วัน/เดือน/ปี</th>
                              <th className="py-4 px-5 font-bold">กิจกรรม</th>
                              {canManageCalendar && <th className="py-4 px-3 font-bold text-right w-24">จัดการ</th>}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100/80">
                            {academicList.length === 0 ? (
                              <tr>
                                <td colSpan={canManageCalendar ? 3 : 2} className="py-8 text-center text-slate-400 font-medium">ยังไม่มีกำหนดการในภาคเรียนนี้</td>
                              </tr>
                            ) : (
                              academicList.map((item) => (
                                <tr key={item.id} className="hover:bg-white transition-colors duration-200">
                                  <td className="py-3.5 px-5 font-semibold text-slate-800 leading-snug">{formatDateTH(item.date)}</td>
                                  <td className="py-3.5 px-5 text-slate-600 font-medium leading-relaxed">{item.title}</td>
                                  {canManageCalendar && (
                                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                                      <button onClick={() => { setEditingItem(item); setFormData(item); setShowModal(true); }} className="text-xs font-bold text-purple-600 hover:text-purple-800 mr-2">แก้ไข</button>
                                      <button onClick={() => handleDeleteEvent(item.id)} className="text-xs font-bold text-rose-500 hover:text-rose-700">ลบ</button>
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

                  {/* ตารางที่ 2: กำหนดการลงทะเบียน */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">กำหนดการลงทะเบียนเรียน</h3>
                      </div>
                    </div>

                    <div className="bg-slate-50/70 rounded-[1.5rem] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-slate-100 relative mb-6">
                      <div className="overflow-x-auto w-full">
                        <table className="w-full min-w-[300px] text-left text-sm md:text-[15px]">
                          <thead className="bg-slate-100/80 border-b border-slate-200/80 text-slate-700">
                            <tr>
                              <th className="py-4 px-5 font-bold w-[42%]">วัน/เดือน/ปี</th>
                              <th className="py-4 px-5 font-bold">กลุ่มนักศึกษา</th>
                              {canManageCalendar && <th className="py-4 px-3 font-bold text-right w-24">จัดการ</th>}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100/80">
                            {registrationList.length === 0 ? (
                              <tr>
                                <td colSpan={canManageCalendar ? 3 : 2} className="py-8 text-center text-slate-400 font-medium">ยังไม่มีกำหนดการในภาคเรียนนี้</td>
                              </tr>
                            ) : (
                              registrationList.map((item) => (
                                <tr key={item.id} className="hover:bg-white transition-colors duration-200">
                                  <td className="py-3.5 px-5 font-bold text-indigo-600 leading-snug">{formatDateTH(item.date)}</td>
                                  <td className="py-3.5 px-5 text-slate-700 font-medium leading-relaxed">{item.title}</td>
                                  {canManageCalendar && (
                                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                                      <button onClick={() => { setEditingItem(item); setFormData(item); setShowModal(true); }} className="text-xs font-bold text-purple-600 hover:text-purple-800 mr-2">แก้ไข</button>
                                      <button onClick={() => handleDeleteEvent(item.id)} className="text-xs font-bold text-rose-500 hover:text-rose-700">ลบ</button>
                                    </td>
                                  )}
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 📌 ย้ายปุ่ม Call-to-Action มาต่อจากตารางลงทะเบียน */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-auto mb-6">
                      <a href="https://acdserv.kmutnb.ac.th/academic-calendar" target="_blank" rel="noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        ดาวน์โหลดปฏิทิน PDF
                      </a>
                      <a href="https://reg2.kmutnb.ac.th/registrar/" target="_blank" rel="noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                        เข้าระบบลงทะเบียน (REG)
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </a>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* ข้อมูลติดต่อเพิ่มเติมสำหรับปัญหาลงทะเบียน */}
            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative">
              {canManageCalendar && <ActionButtons onEdit={() => openSettingsModal('warning')} positionClass="top-4 right-4" />}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-inner border border-blue-200/50">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div className="pr-12 md:pr-0">
                  <h3 className="text-[16px] font-extrabold text-slate-800 mb-1">{settings.warning_title}</h3>
                  <p className="text-[13px] text-slate-500 font-medium whitespace-pre-line">{settings.warning_subtitle}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <a href="https://acdserv.kmutnb.ac.th/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-[12px] font-bold hover:bg-slate-100 transition-colors shadow-sm">
                  กองบริการการศึกษา
                </a>
                <a href="https://it-clinic.icit.kmutnb.ac.th/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-[12px] font-bold hover:bg-slate-100 transition-colors shadow-sm">
                  แจ้งซ่อม ICIT (รหัสผ่าน)
                </a>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* ---------------- 📌 2. ปฏิทินกิจกรรมนักศึกษา ---------------- */}
        <FadeInSection delay="0.3s">
          <div className={`p-6 md:p-10 lg:p-12 mb-16 ${bentoGlass}`}>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <div className="flex-1 w-full flex items-center gap-2">
                <div className="flex-1">
                  <SectionBanner text={settings.sec_activity_title || 'ปฏิทินกิจกรรมนักศึกษา'} variant="social" />
                </div>
                {canManageCalendar && (
                  <button onClick={() => openSettingsModal('banners')} title="แก้ไขข้อความแบนเนอร์" className="p-2.5 bg-slate-100/80 text-slate-500 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition shadow-sm border border-slate-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </button>
                )}
              </div>
              {canManageCalendar && (
                <button onClick={() => { setEditingItem(null); setFormData({ ...EMPTY_FORM, category: 'activity' }); setShowModal(true); }} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow hover:bg-purple-700 shrink-0">
                  + เพิ่มกิจกรรมนักศึกษา
                </button>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">กำหนดการกิจกรรมเสริมหลักสูตร</h2>
              <p className="text-slate-500 text-sm md:text-base font-medium mt-1.5">กิจกรรมชมรม ภาควิชา และสาขาวิชา</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-32 rounded-[1.5rem] bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : activitiesList.length === 0 ? (
              <p className="text-center text-slate-400 py-10 font-medium">ยังไม่มีข้อมูลกิจกรรมนักศึกษาในฐานข้อมูล</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {activitiesList.map((act) => {
                  const themeObj = ACTIVITY_THEMES[act.theme] || ACTIVITY_THEMES.purple;
                  return (
                    <motion.div
                      key={act.id}
                      whileHover={{ y: -5 }}
                      className="bg-white border border-slate-100 rounded-[1.5rem] p-6 shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.05)] transition-all flex items-start gap-4 group relative"
                    >
                      {canManageCalendar && (
                        <ActionButtons onEdit={() => { setEditingItem(act); setFormData({
                          id: act.id, category: act.category, semester: act.semester,
                          date: act.date, title: act.title, 
                          activitytype: act.activitytype || 'กิจกรรมสาขาวิชา', theme: act.theme || 'purple'
                        }); setShowModal(true); }} onDelete={() => handleDeleteEvent(act.id)} positionClass="-top-3 -right-2" />
                      )}

                      <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-inner border border-white/50 ${themeObj.iconColor}`}>
                        {/* 📌 ตัดตัวย่อเดือนออกมาอัตโนมัติ */}
                        <span className="text-[11px] font-extrabold uppercase tracking-wider">{getShortMonthTH(act.date)}</span>
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="inline-flex items-center gap-1.5 mb-2">
                          <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${themeObj.color}`}></span>
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{act.activitytype || 'กิจกรรมสาขาวิชา'}</p>
                        </div>
                        <h4 className="text-[16px] font-extrabold text-slate-800 mb-1.5 leading-snug group-hover:text-purple-600 transition-colors">{act.title}</h4>
                        <p className="text-[13px] text-slate-500 font-medium flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          {formatDateTH(act.date)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="mt-8 text-center">
              <a href="/events" className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors">
                ดูข่าวสารและกิจกรรมทั้งหมด
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </a>
            </div>
          </div>
        </FadeInSection>

      </div>

      {/* ================= MODALS ================= */}
      
      {/* 1. Modal จัดการข้อความหน้าเว็บ (Page Settings) */}
      <AnimatePresence>
        {canManageCalendar && showSettingsModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)} />
            <motion.form onSubmit={handleSaveSettings} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative z-10 bg-white w-full max-w-xl rounded-[2rem] p-8 shadow-2xl border border-slate-100 space-y-4">
              <h3 className="text-xl font-extrabold text-slate-900 border-b pb-4">
                {settingsModalType === 'header' ? '✏️ แก้ไขข้อความส่วนหัว' : 
                 settingsModalType === 'banners' ? '✏️ แก้ไขข้อความแบนเนอร์' : 
                 '✏️ แก้ไขช่องทางการติดต่อ'}
              </h3>
              
              {settingsModalType === 'header' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-600">หัวข้อหลัก</label>
                    <input type="text" value={settingsForm.header_title} onChange={e => setSettingsForm({...settingsForm, header_title: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">คำบรรยายหัวข้อ</label>
                    <textarea rows="3" value={settingsForm.header_subtitle} onChange={e => setSettingsForm({...settingsForm, header_subtitle: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-xl whitespace-pre-line" />
                  </div>
                </>
              )}

              {settingsModalType === 'banners' && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600">แบนเนอร์กำหนดการ</label>
                    <input type="text" value={settingsForm.sec_calendar_title} onChange={e => setSettingsForm({...settingsForm, sec_calendar_title: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">แบนเนอร์กิจกรรมนักศึกษา</label>
                    <input type="text" value={settingsForm.sec_activity_title} onChange={e => setSettingsForm({...settingsForm, sec_activity_title: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-xl" />
                  </div>
                </div>
              )}

              {settingsModalType === 'warning' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-600">หัวข้อติดต่อเมื่อมีปัญหา</label>
                    <input type="text" value={settingsForm.warning_title} onChange={e => setSettingsForm({...settingsForm, warning_title: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">รายละเอียดช่องทางติดต่อ</label>
                    <input type="text" value={settingsForm.warning_subtitle} onChange={e => setSettingsForm({...settingsForm, warning_subtitle: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">ข้อความแจ้งเตือนสีเหลือง (ข้อควรระวัง)</label>
                    <textarea value={settingsForm.warning_text} onChange={e => setSettingsForm({...settingsForm, warning_text: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-xl whitespace-pre-line" rows={3}></textarea>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowSettingsModal(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200">ยกเลิก</button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-purple-600 hover:bg-purple-700">{submitting ? 'กำลังบันทึก...' : 'บันทึกข้อความ'}</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Modal จัดการ Event */}
      <AnimatePresence>
        {canManageCalendar && showModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.form onSubmit={handleSaveEvent} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative z-10 bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl border border-slate-100 space-y-4">
              <h3 className="text-xl font-extrabold text-slate-900 border-b pb-4">{editingItem ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูลใหม่'}</h3>
              
              <div>
                <label className="text-xs font-bold text-slate-600">ประเภทข้อมูล</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-xl bg-white">
                  <option value="academic">กำหนดการทางวิชาการ</option>
                  <option value="registration">กำหนดการลงทะเบียน</option>
                  <option value="activity">ปฏิทินกิจกรรมนักศึกษา</option>
                </select>
              </div>

              {formData.category !== 'activity' && (
                <div>
                  <label className="text-xs font-bold text-slate-600">เทอม (เช่น 1/2569)</label>
                  <input type="text" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-xl" required />
                </div>
              )}
              
              {/* 📌 วันที่เลือกจาก Date Picker */}
              <div>
                <label className="text-xs font-bold text-slate-600">วัน/เดือน/ปี</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-xl bg-white" required />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-600">รายละเอียด / ชื่อกิจกรรม</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-xl" required />
              </div>
              
              {/* 📌 ดึงช่องตัวย่อเดือนออกตามที่ต้องการ แล้วปรับเลย์เอาต์ */}
              {formData.category === 'activity' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600">หมวดกิจกรรม</label>
                    <input type="text" value={formData.activitytype || ''} onChange={e => setFormData({...formData, activitytype: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-xl" placeholder="เช่น กิจกรรมสาขา" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">สีธีม</label>
                    <select value={formData.theme} onChange={e => setFormData({...formData, theme: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-xl bg-white">
                      {Object.entries(ACTIVITY_THEMES).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200">ยกเลิก</button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-purple-700 hover:bg-purple-800">{submitting ? 'กำลังบันทึก...' : 'บันทึก'}</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}