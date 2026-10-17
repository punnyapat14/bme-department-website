import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "../supabaseClient";

// 📌 นำเข้า Component พื้นหลังและแบนเนอร์
import { AuroraBackground, SectionBanner } from '../components/ThemeElements';

// 📌 ดึงข้อมูลจาก Context อย่างถูกต้อง
import { useAuth } from "../contexts/AuthContext";

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
    }, { threshold: 0.15 });
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
// 📌 ปุ่มแก้ไข (Edit / Delete) มาตรฐาน
// ==========================================
const ActionButtons = ({ onEdit, onDelete, positionClass = "top-2 right-2", hideDelete = false }) => (
  <div className={`absolute ${positionClass} flex gap-1.5 z-30`}>
    {onEdit && (
      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }} className="p-1.5 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors" title="แก้ไข">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
      </button>
    )}
    {!hideDelete && onDelete && (
      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} className="p-1.5 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600 transition-colors" title="ลบทิ้ง">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    )}
  </div>
);

// 🛠️ Helper: แปลงรูปแบบวันที่ที่เลือกจาก Date Picker ให้แสดงผลเป็นภาษาไทย
const formatDateTH = (dateStr) => {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  return dateStr;
};

// 🛠️ Helper: จัดการแสดงผลวันที่แบบ "ช่วงเวลา" (Start - End)
const formatDateRangeTH = (startStr, endStr) => {
  if (!startStr) return '';
  const startTH = formatDateTH(startStr);
  if (!endStr || startStr === endStr) return startTH; 
  const endTH = formatDateTH(endStr);
  return `${startTH} - ${endTH}`;
};

// ==========================================
// 📌 Component: การ์ดข่าวย่อย (Mini Card)
// ==========================================
const EventCard = ({ event, isAdmin, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3 }}
    className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm hover:shadow-[0_15px_30px_rgba(147,51,234,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full relative group"
  >
    {isAdmin && (
      <ActionButtons 
        onEdit={() => onEdit(event, 'Events')} 
        onDelete={() => onDelete(event.id, 'Events')} 
        positionClass="top-3 right-3 scale-95" 
      />
    )}

    <div className="h-48 bg-slate-100 overflow-hidden relative cursor-pointer shrink-0">
      <img src={event.image || 'https://via.placeholder.com/800x600?text=No+Image'} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e)=>{e.target.src="https://via.placeholder.com/800x600?text=No+Image"}} />
      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-800 shadow-sm">
        {event.category || 'อื่นๆ'}
      </span>
    </div>
    
    <div className="p-6 flex flex-col flex-1">
      <p className="text-[12px] font-semibold text-slate-500 mb-2">{formatDateRangeTH(event.date, event.end_date)}</p>
      <h3 className="text-[16px] font-extrabold text-slate-900 leading-snug mb-3 line-clamp-2 hover:text-indigo-700 transition-colors cursor-pointer">
        {event.title}
      </h3>
      <p className="text-[13px] text-slate-600 mb-4 line-clamp-2 leading-relaxed">{event.description}</p>
      <div className="mt-auto">
        <button className="text-[12px] font-bold text-slate-800 hover:text-indigo-800 transition-colors flex items-center gap-1 group/btn">
          อ่านต่อ 
          <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </button>
      </div>
    </div>
  </motion.div>
);

export default function Events() {
  const { user } = useAuth();
  
  const [pageSettings, setPageSettings] = useState({
    header_title: 'ข่าวสารประชาสัมพันธ์',
    latest_banner: 'ข่าวประชาสัมพันธ์ล่าสุด', // 📌 เพิ่มตัวแปรสำหรับแบนเนอร์ล่าสุด
    academic_banner: 'ข่าวประชาสัมพันธ์วิชาการ',
    activity_banner: 'ข่าวประชาสัมพันธ์กิจกรรม',
    timeline_title: 'กำหนดการเร็วๆ นี้'
  });

  const [eventsData, setEventsData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('Events'); 
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({});

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsModalType, setSettingsModalType] = useState('header'); 
  const [settingsForm, setSettingsForm] = useState({});

  const canManage = useMemo(() => {
    if (!user) return false;
    const role = String(user.role || '').toLowerCase();
    const metaRole = String(user.user_metadata?.role || '').toLowerCase();
    const email = String(user.email || '').toLowerCase();
    
    return (
      ['admin', 'faculty', 'teacher', 'staff', 'instructor'].includes(role) ||
      ['admin', 'faculty', 'teacher', 'staff', 'instructor'].includes(metaRole) ||
      user.isAdmin === true ||
      email.endsWith('@sci.kmutnb.ac.th') || email.endsWith('@email.kmutnb.ac.th') || email === 'bme.kmutnb.th@gmail.com'
    );
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const { data: settingsData } = await supabase.from('event_page_settings').select('*').eq('id', 1).maybeSingle();
        if (settingsData) setPageSettings(settingsData);

        const { data: events, error: eventsError } = await supabase.from('events').select('*').order('created_at', { ascending: false }); 
        if (eventsError) throw eventsError;
        if (events) setEventsData(events);

        const { data: timelines, error: timelinesError } = await supabase.from('timelines').select('*').order('created_at', { ascending: true }); 
        if (timelinesError) throw timelinesError;
        if (timelines) setTimelineData(timelines);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenSettings = (type) => {
    setSettingsModalType(type);
    setSettingsForm(pageSettings);
    setIsSettingsModalOpen(true);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase.from('event_page_settings').upsert({ id: 1, ...settingsForm });
      if (error) throw error;
      setPageSettings(settingsForm);
      setIsSettingsModalOpen(false);
    } catch (err) {
      alert('บันทึกการตั้งค่าไม่สำเร็จ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenModal = (item = null, type = 'Events') => {
    setModalType(type);
    if (item) {
      setFormData(item);
    } else {
      if (type === 'Events') {
        setFormData({ id: '', category: 'กิจกรรม', date: '', end_date: '', title: '', description: '', image: '' });
      } else {
        setFormData({ id: '', short_date: '', title: '', theme: 'slate' });
      }
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `events-images/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage.from('EVENT').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('EVENT').getPublicUrl(filePath);
      setFormData({ ...formData, image: data.publicUrl });
    } catch (error) {
      console.error('Upload Error:', error);
      alert('อัปโหลดรูปภาพไม่สำเร็จ');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert("กรุณากรอกหัวข้อ");
    setIsSaving(true);
    
    try {
      if (modalType === 'Events') {
        const payload = {
          category: formData.category,
          date: formData.date,
          end_date: formData.end_date || null,
          title: formData.title,
          description: formData.description, 
          image: formData.image
        };

        if (formData.id) {
          const { data, error } = await supabase.from('events').update(payload).eq('id', formData.id).select();
          if (error) throw error;
          setEventsData(eventsData.map(ev => ev.id === formData.id ? data[0] : ev));
        } else {
          const { data, error } = await supabase.from('events').insert([payload]).select();
          if (error) throw error;
          setEventsData([data[0], ...eventsData]);
        }
      } else {
        const payload = {
          short_date: formData.short_date,
          title: formData.title,
          theme: formData.theme
        };

        if (formData.id) {
          const { data, error } = await supabase.from('timelines').update(payload).eq('id', formData.id).select();
          if (error) throw error;
          setTimelineData(timelineData.map(tl => tl.id === formData.id ? data[0] : tl));
        } else {
          const { data, error } = await supabase.from('timelines').insert([payload]).select();
          if (error) throw error;
          setTimelineData([...timelineData, data[0]]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('คุณต้องการลบข้อมูลนี้ใช่หรือไม่? ข้อมูลจะถูกลบถาวร')) return;
    try {
      const table = type === 'Events' ? 'events' : 'timelines';
      const { error } = await supabase.from(table).delete().eq('id', id);
      
      if (error) throw error;

      if (type === 'Events') {
        setEventsData(eventsData.filter(ev => ev.id !== id));
      } else {
        setTimelineData(timelineData.filter(tl => tl.id !== id));
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const latestEvent = eventsData.length > 0 ? eventsData[0] : null;
  const searchFilter = (e) => {
    if (!searchTerm) return true;
    return (e.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || ((e.description || '').toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const academicEvents = eventsData.filter(e => e.category === 'วิชาการ' && searchFilter(e));
  const activityEvents = eventsData.filter(e => e.category === 'กิจกรรม' && searchFilter(e));

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(147,51,234,0.08)] transition-all duration-500 relative overflow-hidden";
  const miniBentoGlass = "rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm hover:shadow-[0_15px_30px_rgba(147,51,234,0.08)] transition-all duration-300";

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdfcff]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    );
  }

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />

      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">
        <FadeInSection delay="0.1s">
          <div className="text-center max-w-4xl mx-auto pt-2 pb-6 relative group">
            {canManage && (
              <ActionButtons onEdit={() => handleOpenSettings('header')} positionClass="-top-2 right-0 md:-right-8" hideDelete={true} />
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
              {pageSettings.header_title}
            </h1>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mt-6">
          <div className="lg:col-span-2 flex flex-col gap-12">
            
            {latestEvent && (
                <FadeInSection delay="0.2s">
                {/* 📌 แบนเนอร์ข่าวล่าสุด เพิ่มปุ่มแก้ไขด้านขวาเหมือนอันอื่นแล้ว */}
                <div className="mb-6 flex items-center gap-3 w-full group relative">
                  <div className="flex-1 w-full">
                    <SectionBanner text={pageSettings.latest_banner || 'ข่าวประชาสัมพันธ์ล่าสุด'} variant="exam" />
                  </div>
                  {canManage && (
                    <button 
                      type="button" 
                      onClick={() => { setSettingsModalType('latest_banner'); setSettingsForm(pageSettings); setIsSettingsModalOpen(true); }}
                      className="p-2.5 bg-white text-slate-500 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition shadow-sm border border-slate-200 shrink-0 mb-8 md:mb-12"
                      title="แก้ไขข้อความแบนเนอร์"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                  )}
                </div>

                <div className={`flex flex-col md:flex-row w-full ${bentoGlass} relative`}>
                    {canManage && (
                      <ActionButtons 
                        onEdit={() => handleOpenModal(latestEvent, 'Events')} 
                        onDelete={() => handleDelete(latestEvent.id, 'Events')} 
                        positionClass="top-4 right-4 scale-95" 
                      />
                    )}

                    <div className="md:w-5/12 bg-slate-100 relative overflow-hidden min-h-[280px]">
                      <img src={latestEvent.image || 'https://via.placeholder.com/800x600?text=No+Image'} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Latest" onError={(e)=>{e.target.src="https://via.placeholder.com/800x600?text=No+Image"}} />
                    </div>
                    <div className="p-8 md:w-7/12 flex flex-col justify-center relative">
                      <p className="text-slate-500 font-extrabold text-[11px] mb-2">{formatDateRangeTH(latestEvent.date, latestEvent.end_date)}</p>
                      <h2 className="text-2xl font-extrabold text-slate-900 mb-4 pr-16">{latestEvent.title}</h2>
                      <p className="text-slate-600 mb-8 line-clamp-3">{latestEvent.description}</p>
                    </div>
                </div>
                </FadeInSection>
            )}

            <FadeInSection delay="0.25s">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 backdrop-blur-xl shadow-sm rounded-2xl border border-slate-200 p-2">
                <div className="relative flex-1 w-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input type="text" placeholder="ค้นหาประกาศ ข่าวสาร หรือกิจกรรม..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none text-slate-700 font-medium" />
                </div>
                {canManage && (
                  <button onClick={() => handleOpenModal(null, 'Events')} className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-purple-700 whitespace-nowrap transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                    เพิ่มข่าวใหม่
                  </button>
                )}
              </div>
            </FadeInSection>

            <FadeInSection delay="0.3s">
              <div className="mb-6 flex items-center gap-3 w-full group relative">
                <div className="flex-1 w-full">
                  <SectionBanner text={pageSettings.academic_banner} variant="website" />
                </div>
                {canManage && (
                  <button 
                    type="button" 
                    onClick={() => { setSettingsModalType('academic_banner'); setSettingsForm(pageSettings); setIsSettingsModalOpen(true); }}
                    className="p-2.5 bg-white text-slate-500 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition shadow-sm border border-slate-200 shrink-0 mb-8 md:mb-12"
                    title="แก้ไขข้อความแบนเนอร์"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </button>
                )}
              </div>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {academicEvents.map(event => <EventCard key={event.id} event={event} isAdmin={canManage} onEdit={handleOpenModal} onDelete={handleDelete}/>)}
                </AnimatePresence>
                {academicEvents.length === 0 && <p className="text-slate-500 text-sm">ไม่มีข่าววิชาการในขณะนี้</p>}
              </motion.div>
            </FadeInSection>

            <FadeInSection delay="0.4s">
              <div className="mb-6 flex items-center gap-3 w-full group relative">
                <div className="flex-1 w-full">
                  <SectionBanner text={pageSettings.activity_banner} variant="calendar" />
                </div>
                {canManage && (
                  <button 
                    type="button" 
                    onClick={() => { setSettingsModalType('activity_banner'); setSettingsForm(pageSettings); setIsSettingsModalOpen(true); }}
                    className="p-2.5 bg-white text-slate-500 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition shadow-sm border border-slate-200 shrink-0 mb-8 md:mb-12"
                    title="แก้ไขข้อความแบนเนอร์"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </button>
                )}
              </div>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {activityEvents.map(event => <EventCard key={event.id} event={event} isAdmin={canManage} onEdit={handleOpenModal} onDelete={handleDelete}/>)}
                </AnimatePresence>
                {activityEvents.length === 0 && <p className="text-slate-500 text-sm">ไม่มีข่าวกิจกรรมในขณะนี้</p>}
              </motion.div>
            </FadeInSection>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-8">
            <div className="sticky top-24 flex flex-col gap-8">
              
              <div className={`p-8 ${miniBentoGlass} relative`}>
                
                {canManage && <ActionButtons onEdit={() => { setSettingsModalType('timeline_title'); setSettingsForm(pageSettings); setIsSettingsModalOpen(true); }} positionClass="top-4 right-4" hideDelete={true} />}

                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/60 pr-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 border border-slate-200 shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <h3 className="text-[18px] font-extrabold text-slate-900 leading-snug">{pageSettings.timeline_title}</h3>
                  </div>
                </div>
                
                {canManage && (
                  <button onClick={() => handleOpenModal(null, 'Calendar')} className="w-full mb-6 px-3 py-2.5 bg-white text-purple-600 rounded-xl text-xs font-bold hover:bg-purple-50 transition-colors shadow-sm border border-slate-200 border-dashed flex justify-center">
                    + เพิ่มกำหนดการ
                  </button>
                )}

                <div className="relative pl-6 before:absolute before:inset-0 before:left-[5px] before:w-0.5 before:bg-slate-200 before:h-full mt-4">
                  {timelineData.slice(0, 5).map((item) => (
                    <div key={item.id} className="relative mb-6 last:mb-0 group/timeline pr-14">
                      <div className={`absolute -left-[27.5px] top-1 w-3.5 h-3.5 rounded-full ring-4 ring-white ${item.theme === 'rose' ? 'bg-rose-500' : 'bg-slate-400'}`}></div>
                      <div>
                        <p className="text-[12px] font-bold text-slate-500 mb-0.5">{formatDateTH(item.short_date)}</p>
                        <p className={`text-[14px] leading-snug ${item.theme === 'rose' ? 'font-extrabold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {item.title}
                        </p>
                      </div>
                      
                      {canManage && (
                        <ActionButtons 
                          onEdit={() => handleOpenModal(item, 'Calendar')} 
                          onDelete={() => handleDelete(item.id, 'Calendar')} 
                          positionClass="-top-1 -right-2 scale-75" 
                        />
                      )}
                    </div>
                  ))}
                  {timelineData.length === 0 && <p className="text-sm text-slate-400">ยังไม่มีกำหนดการ</p>}
                </div>
                
                <a href="/services" className="w-full mt-8 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors flex justify-center items-center shadow-sm">
                  ดูปฏิทินการศึกษาทั้งหมด
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.form 
            onSubmit={handleSaveSettings}
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            className="bg-white rounded-[2rem] w-full max-w-xl flex flex-col shadow-2xl"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-extrabold text-slate-800">✏️ แก้ไขข้อความหน้าเว็บ</h2>
              <button type="button" onClick={() => setIsSettingsModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl p-2 rounded-full hover:bg-slate-100 transition-colors">✕</button>
            </div>
            
            <div className="p-6">
              {settingsModalType === 'header' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">หัวข้อหลักเว็บ</label>
                  <input type="text" value={settingsForm.header_title || ''} onChange={e => setSettingsForm({...settingsForm, header_title: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" />
                </div>
              )}
              {/* 📌 เพิ่ม Modal สำหรับแก้แบนเนอร์ข่าวล่าสุด */}
              {settingsModalType === 'latest_banner' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อแบนเนอร์ข่าวล่าสุด</label>
                  <input type="text" value={settingsForm.latest_banner || ''} onChange={e => setSettingsForm({...settingsForm, latest_banner: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" />
                </div>
              )}
              {settingsModalType === 'academic_banner' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อแบนเนอร์ข่าววิชาการ</label>
                  <input type="text" value={settingsForm.academic_banner || ''} onChange={e => setSettingsForm({...settingsForm, academic_banner: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" />
                </div>
              )}
              {settingsModalType === 'activity_banner' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อแบนเนอร์ข่าวกิจกรรม</label>
                  <input type="text" value={settingsForm.activity_banner || ''} onChange={e => setSettingsForm({...settingsForm, activity_banner: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" />
                </div>
              )}
              {settingsModalType === 'timeline_title' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">หัวข้อกระดานกำหนดการ</label>
                  <input type="text" value={settingsForm.timeline_title || ''} onChange={e => setSettingsForm({...settingsForm, timeline_title: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" />
                </div>
              )}
            </div>

            <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0 rounded-b-[2rem]">
              <button type="button" onClick={() => setIsSettingsModalOpen(false)} disabled={isSaving} className="px-5 py-2.5 rounded-full text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm border border-transparent hover:border-slate-300">ยกเลิก</button>
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md transition-colors text-sm">
                {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </button>
            </div>
          </motion.form>
        </div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.form 
            onSubmit={handleSave}
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            className="bg-white rounded-[2rem] w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-extrabold text-slate-800">
                {formData.id ? '✏️ แก้ไขข้อมูล' : '✨ เพิ่มข้อมูลใหม่'} ({modalType === 'Events' ? 'ข่าวสาร' : 'กำหนดการ'})
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl p-2 rounded-full hover:bg-slate-100 transition-colors">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              
              {modalType === 'Events' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">หมวดหมู่</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium">
                      <option value="กิจกรรม">กิจกรรม</option>
                      <option value="วิชาการ">วิชาการ</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">วันเริ่มต้น *</label>
                        <input type="date" name="date" required value={formData.date || ''} onChange={handleChange} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">วันสิ้นสุด (ไม่บังคับ)</label>
                        <input type="date" name="end_date" value={formData.end_date || ''} onChange={handleChange} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" />
                      </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">หัวข้อข่าว *</label>
                    <input type="text" name="title" required value={formData.title || ''} onChange={handleChange} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" placeholder="หัวข้อข่าวสาร..." />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">รายละเอียด</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleChange} rows="4" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-300" placeholder="รายละเอียดเนื้อหา..."></textarea>
                  </div>
                  
                  <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
                    <div className="flex justify-between items-end mb-2">
                       <label className="block text-[11px] font-bold text-slate-700">อัปโหลดรูปภาพหน้าปก</label>
                       <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm flex items-center gap-1">
                         <span className="text-amber-500 text-[12px] leading-none">💡</span> แนะนำสัดส่วน 4:3 (ขนาด 800 x 600 px)
                       </span>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors mt-2" />
                    {isUploading && <p className="text-sm font-bold text-purple-600 mt-2 animate-pulse">กำลังอัปโหลดรูปภาพ...</p>}
                    
                    {formData.image && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-[11px] font-bold text-slate-400 mb-2">รูปภาพปัจจุบัน:</p>
                        <img src={formData.image} alt="Preview" className="h-32 w-auto object-cover rounded-lg border border-slate-200 shadow-sm" />
                      </div>
                    )}
                  </div>
                </>
              )}

              {modalType === 'Calendar' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">วันที่ (เลือกจากปฏิทิน)</label>
                        <input type="date" name="short_date" required value={formData.short_date || ''} onChange={handleChange} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">ความสำคัญ (สีบอกสถานะ)</label>
                        <select name="theme" value={formData.theme || 'slate'} onChange={handleChange} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium">
                          <option value="slate">🔘 ปกติ (สีเทา)</option>
                          <option value="rose">🔴 งานสำคัญ (สีแดง)</option>
                        </select>
                      </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อกำหนดการ / กิจกรรม *</label>
                    <input type="text" name="title" required value={formData.title || ''} onChange={handleChange} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" placeholder="เช่น วันลงทะเบียนเรียน..." />
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSaving || isUploading} className="px-5 py-2.5 rounded-full text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm border border-transparent hover:border-slate-300">ยกเลิก</button>
              <button type="submit" disabled={isSaving || isUploading} className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md transition-colors flex items-center gap-2 text-sm">
                {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </button>
            </div>

          </motion.form>
        </div>
      )}
      </AnimatePresence>

    </div>
  );
}