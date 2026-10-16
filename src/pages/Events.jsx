import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "../supabaseClient";

// 📌 นำเข้า Component พื้นหลังและแบนเนอร์ (อ้างอิงตามที่คุณมี)
import { AuroraBackground, SectionBanner } from '../components/ThemeElements';

// ==========================================
// 📌 Config Supabase
// ==========================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


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
      <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(event, 'Events')} className="p-2 bg-blue-500/90 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        </button>
        <button onClick={() => onDelete(event.id, 'Events')} className="p-2 bg-rose-500/90 text-white rounded-lg shadow-md hover:bg-rose-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    )}

    <div className="h-48 bg-slate-100 overflow-hidden relative cursor-pointer shrink-0">
      <img src={event.image || 'https://via.placeholder.com/800x600?text=No+Image'} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-800 shadow-sm">
        {event.category || 'อื่นๆ'}
      </span>
    </div>
    
    <div className="p-6 flex flex-col flex-1">
      <p className="text-[12px] font-semibold text-slate-500 mb-2">{event.date}</p>
      <h3 className="text-[16px] font-extrabold text-slate-900 leading-snug mb-3 line-clamp-2 hover:text-indigo-700 transition-colors cursor-pointer">
        {event.title}
      </h3>
      <p className="text-[13px] text-slate-600 mb-4 line-clamp-2 leading-relaxed">{event.desc}</p>
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
  const [eventsData, setEventsData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('Events'); 
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);

    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setIsAdmin(true);
    };

    const fetchData = async () => {
      try {
        // ดึงข้อมูล ข่าวสาร จาก Supabase
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false }); // ใหม่สุดขึ้นก่อน
          
        if (eventsError) throw eventsError;
        if (events) setEventsData(events);

        // ดึงข้อมูล กำหนดการ จาก Supabase
        const { data: timelines, error: timelinesError } = await supabase
          .from('timelines')
          .select('*')
          .order('created_at', { ascending: true }); // เรียงตามวันที่ลง (หรือจะเรียงตามอื่นก็ได้)

        if (timelinesError) throw timelinesError;
        if (timelines) setTimelineData(timelines);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
    fetchData();
  }, []);

  const handleOpenModal = (item = null, type = 'Events') => {
    setModalType(type);
    if (item) {
      setFormData(item);
    } else {
      if (type === 'Events') {
        setFormData({ id: '', category: 'กิจกรรม', date: '', title: '', desc: '', image: '' });
      } else {
        setFormData({ id: '', short_date: '', title: '', theme: 'slate' });
      }
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📌 ฟังก์ชันอัปโหลดรูปภาพเข้า Supabase Storage
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `events-images/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('images') // ชื่อ Bucket ที่เราสร้าง
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setFormData({ ...formData, image: data.publicUrl });
    } catch (error) {
      console.error('Upload Error:', error);
      alert('อัปโหลดรูปภาพไม่สำเร็จ');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title) return alert("กรุณากรอกหัวข้อ");
    setIsSaving(true);
    
    try {
      if (modalType === 'Events') {
        const payload = {
          category: formData.category,
          date: formData.date,
          title: formData.title,
          desc: formData.desc,
          image: formData.image
        };

        if (formData.id) {
          // Update ข่าวสาร
          const { data, error } = await supabase.from('events').update(payload).eq('id', formData.id).select();
          if (error) throw error;
          setEventsData(eventsData.map(ev => ev.id === formData.id ? data[0] : ev));
        } else {
          // Create ข่าวสาร
          const { data, error } = await supabase.from('events').insert([payload]).select();
          if (error) throw error;
          setEventsData([data[0], ...eventsData]);
        }
      } else {
        // จัดการหน้ากำหนดการ (Calendar)
        const payload = {
          short_date: formData.short_date,
          title: formData.title,
          theme: formData.theme
        };

        if (formData.id) {
          // Update กำหนดการ
          const { data, error } = await supabase.from('timelines').update(payload).eq('id', formData.id).select();
          if (error) throw error;
          setTimelineData(timelineData.map(tl => tl.id === formData.id ? data[0] : tl));
        } else {
          // Create กำหนดการ
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
    return (e.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || ((e.desc || '').toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const remainingEvents = eventsData.filter(e => e.id !== (latestEvent ? latestEvent.id : null));
  const academicEvents = remainingEvents.filter(e => e.category === 'วิชาการ' && searchFilter(e));
  const activityEvents = remainingEvents.filter(e => e.category === 'กิจกรรม' && searchFilter(e));

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
          <div className="text-center max-w-4xl mx-auto pt-2 pb-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
              ข่าวสารประชาสัมพันธ์
            </h1>
          </div>
        </FadeInSection>

        {/* 📌 Admin Buttons */}
        {isAdmin && (
            <div className="flex justify-center gap-4 mb-10">
                <button onClick={() => handleOpenModal(null, 'Events')} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    เพิ่มข่าวสาร/กิจกรรม
                </button>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* 📌 คอลัมน์ซ้าย: เนื้อหาข่าวสาร */}
          <div className="lg:col-span-2 flex flex-col gap-12">
            
            {/* ข่าวล่าสุด */}
            {latestEvent && (
                <FadeInSection delay="0.2s">
                <div className="mb-6"><SectionBanner text="ข่าวประชาสัมพันธ์ล่าสุด" variant="exam" /></div>
                <div className={`flex flex-col md:flex-row w-full ${bentoGlass} group/latest`}>
                    {isAdmin && (
                        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover/latest:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal(latestEvent, 'Events')} className="p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                            <button onClick={() => handleDelete(latestEvent.id, 'Events')} className="p-2 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                        </div>
                    )}
                    <div className="md:w-5/12 bg-slate-100 relative overflow-hidden min-h-[280px]">
                      <img src={latestEvent.image || 'https://via.placeholder.com/800x600?text=No+Image'} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/latest:scale-105" alt="Latest" />
                    </div>
                    <div className="p-8 md:w-7/12 flex flex-col justify-center">
                      <p className="text-slate-500 font-extrabold text-[11px] mb-2">{latestEvent.date}</p>
                      <h2 className="text-2xl font-extrabold text-slate-900 mb-4">{latestEvent.title}</h2>
                      <p className="text-slate-600 mb-8 line-clamp-3">{latestEvent.desc}</p>
                    </div>
                </div>
                </FadeInSection>
            )}

            {/* ช่องค้นหา */}
            <FadeInSection delay="0.25s">
              <input type="text" placeholder="ค้นหาประกาศ ข่าวสาร หรือกิจกรรม..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-6 pr-6 py-4 bg-white/70 backdrop-blur-xl shadow-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
            </FadeInSection>

            {/* ข่าววิชาการ */}
            <FadeInSection delay="0.3s">
              <div className="mb-6"><SectionBanner text="ข่าวประชาสัมพันธ์วิชาการ" variant="website" /></div>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {academicEvents.map(event => <EventCard key={event.id} event={event} isAdmin={isAdmin} onEdit={handleOpenModal} onDelete={handleDelete}/>)}
                </AnimatePresence>
                {academicEvents.length === 0 && <p className="text-slate-500 text-sm">ไม่มีข่าววิชาการในขณะนี้</p>}
              </motion.div>
            </FadeInSection>

            {/* ข่าวกิจกรรม */}
            <FadeInSection delay="0.4s">
              <div className="mb-6"><SectionBanner text="ข่าวประชาสัมพันธ์กิจกรรม" variant="calendar" /></div>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {activityEvents.map(event => <EventCard key={event.id} event={event} isAdmin={isAdmin} onEdit={handleOpenModal} onDelete={handleDelete}/>)}
                </AnimatePresence>
                {activityEvents.length === 0 && <p className="text-slate-500 text-sm">ไม่มีข่าวกิจกรรมในขณะนี้</p>}
              </motion.div>
            </FadeInSection>
          </div>

          {/* 📌 คอลัมน์ขวา: Sidebar (Timeline) */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <div className="sticky top-24 flex flex-col gap-8">
              
              <div className={`p-8 ${miniBentoGlass}`}>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 border border-slate-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <h3 className="text-[18px] font-extrabold text-slate-900">กำหนดการเร็วๆ นี้</h3>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleOpenModal(null, 'Calendar')} className="text-purple-600 hover:text-purple-800 bg-purple-50 p-1.5 rounded-md text-sm font-bold transition-colors hover:bg-purple-100">
                      + เพิ่ม
                    </button>
                  )}
                </div>

                <div className="relative pl-6 before:absolute before:inset-0 before:left-[5px] before:w-0.5 before:bg-slate-200 before:h-full">
                  {timelineData.slice(0, 5).map((item) => (
                    <div key={item.id} className="relative mb-6 last:mb-0 group/timeline">
                      <div className={`absolute -left-[27.5px] top-1 w-3.5 h-3.5 rounded-full ring-4 ring-white ${item.theme === 'rose' ? 'bg-rose-500' : 'bg-slate-400'}`}></div>
                      <div>
                        <p className="text-[12px] font-bold text-slate-500 mb-0.5">{item.short_date}</p>
                        <p className={`text-[14px] leading-snug ${item.theme === 'rose' ? 'font-extrabold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {item.title}
                        </p>
                      </div>
                      
                      {/* Admin Edit/Delete สำหรับแต่ละกำหนดการ */}
                      {isAdmin && (
                        <div className="absolute right-0 top-0 flex gap-1 opacity-0 group-hover/timeline:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-md px-1">
                          <button onClick={() => handleOpenModal(item, 'Calendar')} className="p-1 text-blue-500 hover:text-blue-700"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                          <button onClick={() => handleDelete(item.id, 'Calendar')} className="p-1 text-rose-500 hover:text-rose-700"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                        </div>
                      )}
                    </div>
                  ))}
                  {timelineData.length === 0 && <p className="text-sm text-slate-400">ยังไม่มีกำหนดการ</p>}
                </div>
                
                <a href="/services" className="w-full mt-8 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors flex justify-center items-center">
                  ดูปฏิทินการศึกษาทั้งหมด
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Admin Modal (ใช้ร่วมกัน 2 แท็บ) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">
              {formData.id ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูลใหม่'} ({modalType === 'Events' ? 'ข่าวสาร' : 'กำหนดการ'})
            </h2>
            
            <div className="space-y-4">
              
              {/* ฟอร์มสำหรับแท็บข่าวสาร (Events) */}
              {modalType === 'Events' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">หมวดหมู่</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500">
                          <option value="กิจกรรม">กิจกรรม</option><option value="วิชาการ">วิชาการ</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">วันที่</label>
                        <input type="text" name="date" value={formData.date} onChange={handleChange} placeholder="เช่น 20 ต.ค. 2566" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                      </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">หัวข้อข่าว</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">รายละเอียด</label>
                    <textarea name="desc" value={formData.desc} onChange={handleChange} rows="4" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"></textarea>
                  </div>
                  
                  {/* ส่วนอัปโหลดรูปลง Supabase Storage แทนการกรอก URL เอง */}
                  <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
                    <label className="block text-sm font-bold text-slate-700 mb-2">อัปโหลดรูปภาพ (Supabase Storage)</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                    {isUploading && <p className="text-sm text-purple-600 mt-2 animate-pulse">กำลังอัปโหลดรูปภาพ...</p>}
                    
                    {formData.image && (
                      <div className="mt-3">
                        <p className="text-xs text-slate-400 mb-1">รูปภาพปัจจุบัน:</p>
                        <img src={formData.image} alt="Preview" className="h-32 w-auto object-cover rounded-lg border border-slate-200" />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ฟอร์มสำหรับแท็บกำหนดการ (Calendar) */}
              {modalType === 'Calendar' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">วันที่ (แบบย่อ)</label>
                        <input type="text" name="short_date" value={formData.short_date || ''} onChange={handleChange} placeholder="เช่น: 10 ต.ค. 26" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">ความสำคัญ (สี)</label>
                        <select name="theme" value={formData.theme} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500">
                          <option value="slate">ปกติ (สีเทา)</option>
                          <option value="rose">งานสำคัญ (สีแดง)</option>
                        </select>
                      </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">ชื่อกำหนดการ / กิจกรรม</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                  </div>
                </>
              )}

            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
              <button onClick={() => setIsModalOpen(false)} disabled={isSaving || isUploading} className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors">ยกเลิก</button>
              <button onClick={handleSave} disabled={isSaving || isUploading} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md transition-colors flex items-center gap-2">
                {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                บันทึกข้อมูล
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}