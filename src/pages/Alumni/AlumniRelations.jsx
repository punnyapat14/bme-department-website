import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom'; // 📌 เพิ่ม Link และ Navigate
import { AuroraBackground, SectionBanner } from '../../components/ThemeElements';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';

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

// 📌 Helper: แปลงลิงก์ Google Drive
const formatImageUrl = (url) => {
  if (!url) return '';
  const trimmed = String(url).trim();
  const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) || trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1000`;
  return trimmed;
};

const EMPTY_MESSAGE_FORM = { id: '', name: '', role: '', message: '', image_url: '', is_visible: true };

export default function AlumniRelations() {
  const { user } = useAuth();
  
  // 📦 State ข้อมูลจาก Supabase
  const [settings, setSettings] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⚙️ State จัดการแอดมิน
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [settingsForm, setSettingsForm] = useState({});
  const [showMsgForm, setShowMsgForm] = useState(false);
  const [msgForm, setMsgForm] = useState(EMPTY_MESSAGE_FORM);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 📝 State สำหรับฟอร์มศิษย์เก่าฝากข้อความ
  const [inlineMsg, setInlineMsg] = useState('');
  const [inlineName, setInlineName] = useState(user?.displayName || user?.name || '');
  const [inlineRole, setInlineRole] = useState('');
  const [inlineImage, setInlineImage] = useState('');
  const [isInlineSubmitting, setIsInlineSubmitting] = useState(false);

  // 🔒 เช็คสิทธิ์
  const canManagePage = Boolean(
    user && (
      ['admin', 'faculty', 'teacher', 'staff', 'instructor'].includes(String(user.role || '').toLowerCase()) ||
      user.isAdmin === true ||
      String(user.email || '').endsWith('@sci.kmutnb.ac.th')
    )
  );

  // ตรวจสอบว่าเป็นศิษย์เก่าหรือไม่ (ปรับใช้ตามฟิลด์ role ในระบบของคุณ)
  const isAlumni = Boolean(user && String(user.role || '').toLowerCase() === 'alumni');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: settingsData } = await supabase.from('alumni_relations_settings').select('*').eq('id', 1).single();
      const { data: msgData } = await supabase.from('alumni_messages').select('*').order('created_at', { ascending: false });
      
      if (settingsData) setSettings(settingsData);
      if (msgData) setMessages(msgData);
    } catch (err) {
      console.error('Fetch data error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // 🔒 ระบบบล็อกการเข้าถึง หากไม่ได้ล็อกอิน
  // ----------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-screen bg-[#fdfcff] flex items-center justify-center p-6 relative">
        <AuroraBackground />
        <div className="relative z-10 text-center bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full">
          <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">เฉพาะสมาชิกเท่านั้น</h2>
          <p className="text-slate-600 font-medium mb-8 leading-relaxed">กรุณาล็อกอินเข้าสู่ระบบ<br/>เพื่อเข้าถึงเครือข่ายศิษย์เก่า BME</p>
          <Link to="/login" className="block w-full py-3.5 rounded-full font-bold text-white bg-slate-900 hover:bg-purple-700 transition-colors shadow-md">
            ไปที่หน้าล็อกอิน
          </Link>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ฟังก์ชันต่างๆ สำหรับแอดมิน และศิษย์เก่า
  // ----------------------------------------------------
  const saveSettings = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await supabase.from('alumni_relations_settings').update(settingsForm).eq('id', 1);
      setShowSettingsForm(false);
      fetchData();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setSubmitting(false);
    }
  };

  const saveMessage = async (e) => {
    e.preventDefault();
    if (!msgForm.name || !msgForm.message) return;
    setSubmitting(true);
    try {
      if (editingMsgId) {
        await supabase.from('alumni_messages').update(msgForm).eq('id', editingMsgId);
      } else {
        await supabase.from('alumni_messages').insert([msgForm]);
      }
      setShowMsgForm(false);
      fetchData();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อความ');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMessage = async (id, name) => {
    if (!window.confirm(`ยืนยันการลบข้อความของ "${name}" ?`)) return;
    await supabase.from('alumni_messages').delete().eq('id', id);
    fetchData();
  };

  // ฟังก์ชันให้ศิษย์เก่าฝากข้อความด้วยตัวเอง
  const handleInlineSubmit = async (e) => {
    e.preventDefault();
    if (!inlineName || !inlineMsg) return alert('กรุณากรอกชื่อและข้อความ');
    setIsInlineSubmitting(true);
    try {
      await supabase.from('alumni_messages').insert([{
        name: inlineName,
        role: inlineRole,
        message: inlineMsg,
        image_url: inlineImage,
        is_visible: true
      }]);
      setInlineMsg('');
      setInlineRole('');
      setInlineImage('');
      alert('ฝากข้อความสำเร็จ!');
      fetchData();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการส่งข้อความ');
    } finally {
      setIsInlineSubmitting(false);
    }
  };

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden";
  const inputClass = 'w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-purple-400 focus:ring-2 font-medium text-slate-900 text-sm';
  const labelClass = 'text-xs font-semibold text-slate-500 mb-1 block';

  if (loading || !settings) return <div className="min-h-screen pt-32 text-center text-slate-500 font-bold">กำลังโหลดข้อมูล...</div>;

  const visibleMessages = messages.filter(m => canManagePage || m.is_visible);

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />

      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">

        {/* ---------------- Header Section ---------------- */}
        <FadeInSection delay="0.1s">
          <div className="text-center max-w-4xl mx-auto pt-2 pb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
              {settings.page_title}
            </h1>
            <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl whitespace-pre-line">
              {settings.page_subtitle}
            </p>

            {canManagePage && (
              <div className="mt-6">
                <button onClick={() => { setSettingsForm(settings); setShowSettingsForm(true); }} className="px-6 py-2.5 rounded-full text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all">
                  ⚙️ แก้ไขข้อมูลหน้าเว็บ (หัวข้อ / แบนเนอร์กิจกรรม)
                </button>
              </div>
            )}
          </div>
        </FadeInSection>

        {/* ---------------- 📌 1. ไฮไลท์กิจกรรม (Highlight Event) ---------------- */}
        {/* เช็คว่าถ้าไม่มีชื่อกิจกรรม ให้ซ่อนกล่องนี้ไปเลย */}
        {settings.event_title && settings.event_title.trim() !== '' && (
          <FadeInSection delay="0.2s">
            <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
              <SectionBanner text="กิจกรรมสานสัมพันธ์" variant="social" />

              <div className="mt-8 flex flex-col lg:flex-row bg-slate-900 rounded-[2rem] overflow-hidden shadow-xl border border-slate-800 relative group">
                <div className="w-full lg:w-1/2 h-64 lg:h-auto relative overflow-hidden bg-slate-800">
                  <img src={formatImageUrl(settings.event_image_url)} alt="Event" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
                  {settings.event_badge && (
                    <div className="absolute top-6 left-6 bg-rose-500 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-md">
                      {settings.event_badge}
                    </div>
                  )}
                </div>

                <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-10">
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                    {settings.event_title}<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-400">{settings.event_highlight_text}</span>
                  </h3>
                  <p className="text-slate-300 font-medium mb-6 mt-4 leading-relaxed text-sm md:text-base whitespace-pre-line">
                    {settings.event_description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {settings.event_date && (
                      <div className="flex items-center text-slate-200 text-sm font-medium">
                        <svg className="w-5 h-5 mr-3 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {settings.event_date}
                      </div>
                    )}
                    {settings.event_location && (
                      <div className="flex items-center text-slate-200 text-sm font-medium">
                        <svg className="w-5 h-5 mr-3 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {settings.event_location}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                    {settings.event_register_url && (
                      // ตรวจสอบว่าเป็นลิงก์ภายในเว็บหรือไม่
                      settings.event_register_url.startsWith('/') ? (
                        <Link to={settings.event_register_url} className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all text-center text-sm flex-1 hover:-translate-y-0.5">
                          ลงทะเบียนเข้าร่วมงาน
                        </Link>
                      ) : (
                        <a href={settings.event_register_url} target="_blank" rel="noreferrer" className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all text-center text-sm flex-1 hover:-translate-y-0.5">
                          ลงทะเบียนเข้าร่วมงาน
                        </a>
                      )
                    )}
                    {settings.event_gallery_url && (
                      <a href={settings.event_gallery_url} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all text-center text-sm backdrop-blur-md flex-1">
                        ดูภาพบรรยากาศ
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        )}

        {/* ---------------- 📌 2. บริการและเครือข่ายศิษย์เก่า (Services) ---------------- */}
        <FadeInSection delay="0.3s">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {(settings.services || []).map((srv, idx) => {
              const colors = {
                purple: 'bg-purple-100 text-purple-600',
                emerald: 'bg-emerald-100 text-emerald-600',
                amber: 'bg-amber-100 text-amber-600',
                sky: 'bg-sky-100 text-sky-600'
              };
              const textColors = {
                purple: 'text-purple-600',
                emerald: 'text-emerald-600',
                amber: 'text-amber-600',
                sky: 'text-sky-600'
              };

              // ตรวจสอบว่าลิงก์เป็นลิงก์ภายใน (เริ่มด้วย /) ให้ใช้ Link จาก react-router-dom
              const isInternalLink = srv.url && srv.url.startsWith('/');

              const CardContent = (
                <>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform ${colors[srv.icon_type] || colors.purple}`}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fillOpacity="0.3"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800 mb-2">{srv.title}</h3>
                  <p className="text-sm text-slate-500 font-medium mb-6">{srv.desc}</p>
                  <div className={`${textColors[srv.icon_type] || textColors.purple} font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-auto`}>
                    {srv.action_text} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </>
              );

              return isInternalLink ? (
                <Link key={idx} to={srv.url} className={`p-8 ${bentoGlass} group hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col justify-between block`}>
                  {CardContent}
                </Link>
              ) : (
                <a key={idx} href={srv.url} target="_blank" rel="noreferrer" className={`p-8 ${bentoGlass} group hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col justify-between block`}>
                  {CardContent}
                </a>
              );
            })}
          </div>
        </FadeInSection>

        {/* ---------------- 📌 3. จากพี่สู่น้อง (Messages to Juniors) ---------------- */}
        <FadeInSection delay="0.4s">
          <div className={`p-6 md:p-10 mb-12 ${bentoGlass} border border-slate-50`}>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <SectionBanner text="ฝากข้อความถึงรุ่นน้อง" variant="scholarship" />
              {canManagePage && (
                <button onClick={() => { setEditingMsgId(null); setMsgForm(EMPTY_MESSAGE_FORM); setShowMsgForm(true); }} className="px-5 py-2 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-amber-600 shadow-sm transition-colors">
                  + แอดมิน: เพิ่มข้อความใหม่
                </button>
              )}
            </div>

            {/* ส่วนสำหรับกรอกข้อความ (แสดงเฉพาะ Role Alumni) */}
            {isAlumni && (
              <div className="mb-10 p-6 md:p-8 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-[2rem] shadow-sm">
                <h3 className="font-bold text-amber-800 text-lg mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  พื้นที่สำหรับศิษย์เก่า: ฝากข้อความทักทาย หรือให้กำลังใจรุ่นน้อง
                </h3>
                <form onSubmit={handleInlineSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-amber-700 mb-1 block">ชื่อของคุณ / รุ่นพี่ (เช่น พี่เอก BME 01)</label>
                      <input required value={inlineName} onChange={e => setInlineName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-amber-700 mb-1 block">ตำแหน่งงาน (ถ้าต้องการระบุ)</label>
                      <input value={inlineRole} onChange={e => setInlineRole(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm" placeholder="เช่น AI Developer" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-amber-700 mb-1 block">ข้อความที่ต้องการฝากถึงน้องๆ *</label>
                    <textarea required rows={3} value={inlineMsg} onChange={e => setInlineMsg(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm resize-none" placeholder="พิมพ์ข้อความที่นี่..." />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-amber-700 mb-1 block">ลิงก์รูปโปรไฟล์ (ตัวเลือกเสริม)</label>
                    <input value={inlineImage} onChange={e => setInlineImage(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm" placeholder="วางลิงก์รูปจาก Google Drive หรือเว็บอื่น" />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={isInlineSubmitting} className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-8 rounded-full text-sm transition-all shadow-md">
                      {isInlineSubmitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visibleMessages.length === 0 ? (
                <p className="col-span-3 text-center text-slate-400 py-10 font-medium">ยังไม่มีข้อความ</p>
              ) : visibleMessages.map((msg) => (
                <motion.div key={msg.id} whileHover={{ y: -5 }} className={`bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col relative ${!msg.is_visible ? 'opacity-50' : ''}`}>
                  <svg className="absolute top-6 right-6 w-12 h-12 text-amber-100 opacity-60" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                  
                  <p className="text-slate-600 font-medium leading-relaxed mb-8 relative z-10 italic whitespace-pre-line">"{msg.message}"</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto border-t border-slate-100 pt-5 relative z-10">
                    <div className="flex items-center gap-3">
                      <img src={formatImageUrl(msg.image_url) || "https://placehold.co/100x100?text=BME"} alt={msg.name} className="w-11 h-11 rounded-full object-cover border-2 border-amber-100 bg-slate-50" />
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{msg.name}</h4>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">{msg.role}</p>
                      </div>
                    </div>
                    {canManagePage && (
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingMsgId(msg.id); setMsgForm(msg); setShowMsgForm(true); }} className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded">แก้ไข</button>
                        <button onClick={() => deleteMessage(msg.id, msg.name)} className="text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-1 rounded">ลบ</button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </div>

      {/* ========================================================= */}
      {/* 🔒 Modal: ตั้งค่าหน้าเว็บ (แอดมิน) */}
      <AnimatePresence>
        {canManagePage && showSettingsForm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowSettingsForm(false)} />
            <motion.form onSubmit={saveSettings} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative z-10 bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl">
              <div className="p-5 border-b sticky top-0 bg-white z-10 flex justify-between items-center"><h3 className="font-black text-lg">⚙️ ตั้งค่าเนื้อหาหน้าเว็บ</h3><button type="button" onClick={() => setShowSettingsForm(false)}>✕</button></div>
              <div className="p-6 space-y-6">
                
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 border-b pb-2">1. ข้อความส่วนหัว (Header)</h4>
                  <div><label className={labelClass}>หัวข้อหลัก (H1)</label><input value={settingsForm.page_title || ''} onChange={e => setSettingsForm(s => ({...s, page_title: e.target.value}))} className={inputClass} /></div>
                  <div><label className={labelClass}>คำอธิบายใต้หัวข้อ</label><textarea rows={2} value={settingsForm.page_subtitle || ''} onChange={e => setSettingsForm(s => ({...s, page_subtitle: e.target.value}))} className={inputClass} /></div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-rose-600 border-b pb-2">2. แบนเนอร์กิจกรรมไฮไลท์</h4>
                  <p className="text-xs text-rose-500 font-bold">* หากต้องการซ่อนส่วนกิจกรรม ให้ลบ "ชื่อกิจกรรม" ออกให้เป็นช่องว่าง</p>
                  <div><label className={labelClass}>ชื่อกิจกรรม</label><input value={settingsForm.event_title || ''} onChange={e => setSettingsForm(s => ({...s, event_title: e.target.value}))} className={inputClass} placeholder="เว้นว่างไว้เพื่อซ่อนส่วนนี้" /></div>
                  <div><label className={labelClass}>ข้อความไฮไลท์สี (ต่อท้ายชื่อกิจกรรม)</label><input value={settingsForm.event_highlight_text || ''} onChange={e => setSettingsForm(s => ({...s, event_highlight_text: e.target.value}))} className={inputClass} /></div>
                  <div><label className={labelClass}>ป้ายกำกับมุมซ้ายบน</label><input value={settingsForm.event_badge || ''} onChange={e => setSettingsForm(s => ({...s, event_badge: e.target.value}))} className={inputClass} /></div>
                  <div><label className={labelClass}>รายละเอียดกิจกรรม</label><textarea rows={3} value={settingsForm.event_description || ''} onChange={e => setSettingsForm(s => ({...s, event_description: e.target.value}))} className={inputClass} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelClass}>วัน-เวลา</label><input value={settingsForm.event_date || ''} onChange={e => setSettingsForm(s => ({...s, event_date: e.target.value}))} className={inputClass} /></div>
                    <div><label className={labelClass}>สถานที่</label><input value={settingsForm.event_location || ''} onChange={e => setSettingsForm(s => ({...s, event_location: e.target.value}))} className={inputClass} /></div>
                  </div>
                  <div><label className={labelClass}>ลิงก์รููปภาพ (Google Drive หรือ URL)</label><input value={settingsForm.event_image_url || ''} onChange={e => setSettingsForm(s => ({...s, event_image_url: e.target.value}))} className={inputClass} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelClass}>ลิงก์ลงทะเบียน</label><input value={settingsForm.event_register_url || ''} onChange={e => setSettingsForm(s => ({...s, event_register_url: e.target.value}))} className={inputClass} /></div>
                    <div><label className={labelClass}>ลิงก์อัลบั้มภาพ</label><input value={settingsForm.event_gallery_url || ''} onChange={e => setSettingsForm(s => ({...s, event_gallery_url: e.target.value}))} className={inputClass} /></div>
                  </div>
                </div>
              </div>
              <div className="p-5 border-t sticky bottom-0 bg-white flex justify-end gap-2"><button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900">บันทึกการตั้งค่า</button></div>
            </motion.form>
          </div>
        )}

        {/* 🔒 Modal: จัดการข้อความรุ่นพี่ (แอดมิน) */}
        {canManagePage && showMsgForm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowMsgForm(false)} />
            <motion.form onSubmit={saveMessage} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative z-10 bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl">
              <div className="p-5 border-b sticky top-0 bg-white z-10 flex justify-between items-center"><h3 className="font-black text-lg">{editingMsgId ? 'แก้ไขข้อความ' : 'เพิ่มข้อความใหม่'}</h3><button type="button" onClick={() => setShowMsgForm(false)}>✕</button></div>
              <div className="p-6 space-y-4">
                <div><label className={labelClass}>ชื่อ-นามสกุล / รุ่นพี่ (BME 00) *</label><input required value={msgForm.name} onChange={e => setMsgForm(m => ({...m, name: e.target.value}))} className={inputClass} /></div>
                <div><label className={labelClass}>ตำแหน่งงาน (Role)</label><input value={msgForm.role} onChange={e => setMsgForm(m => ({...m, role: e.target.value}))} className={inputClass} /></div>
                <div><label className={labelClass}>ข้อความถึงน้องๆ *</label><textarea required rows={4} value={msgForm.message} onChange={e => setMsgForm(m => ({...m, message: e.target.value}))} className={inputClass} /></div>
                <div><label className={labelClass}>ลิงก์รููปภาพโปรไฟล์ (Google Drive หรือ URL)</label><input value={msgForm.image_url} onChange={e => setMsgForm(m => ({...m, image_url: e.target.value}))} className={inputClass} /></div>
                <label className="flex items-center gap-3"><input type="checkbox" checked={msgForm.is_visible} onChange={e => setMsgForm(m => ({...m, is_visible: e.target.checked}))} className="w-5 h-5 accent-purple-600" /><span className="text-sm font-bold">แสดงข้อความนี้บนเว็บ</span></label>
              </div>
              <div className="p-5 border-t sticky bottom-0 bg-white flex justify-end gap-2"><button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900">บันทึกข้อความ</button></div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}