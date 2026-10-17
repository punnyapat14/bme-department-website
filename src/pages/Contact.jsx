import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

// 📌 นำเข้า Component ธีมหลักของเว็บไซต์
import { AuroraBackground, SectionBanner } from '../components/ThemeElements';

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

// 🛠️ Helper: จัดการไอคอนตามประเภทช่องทางติดต่อ
const getChannelIcon = (type) => {
  switch (type) {
    case 'phone': return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>;
    case 'email': return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
    case 'facebook': return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>;
    case 'instagram': return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path></svg>;
    case 'line': return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 10.3c0-4.4-4.5-8-10-8s-10 3.6-10 8c0 3.9 3.5 7.3 8.1 7.9.3.1.7.2.9.5.1.2.1.6 0 .9-.1.3-.4 1.5-.5 1.8-.1.4 0 .5.3.3l5-3.6c3.2-2.3 6.2-4.4 6.2-7.8zm-13 2.7c-.2 0-.3-.1-.3-.3V9.2c0-.2.1-.3.3-.3h3.5c.2 0 .3.1.3.3s-.1.3-.3.3h-3.1v1.3h3.1c.2 0 .3.1.3.3s-.1.3-.3.3h-3.1v1.4h3.1c.2 0 .3.1.3.3s-.1.3-.3.3H9.5zm5.7 0c-.2 0-.3-.1-.3-.3V9.2c0-.2.1-.3.3-.3s.3.1.3.3v3.5c0 .2-.1.3-.3.3zm2.5-3.8c.2 0 .3.1.3.3v2c0 .1.1.2.2.2.1 0 .2-.1.2-.2v-2c0-.2.1-.3.3-.3s.3.1.3.3v3.5c0 .2-.1.3-.3.3-.3 0-.6-.1-.8-.4l-1.9-2.6v2.6c0 .2-.1.3-.3.3s-.3-.1-.3-.3V9.2c0-.2.1-.3.3-.3.3 0 .5.1.7.4l1.9 2.6v-2.6c0-.2.2-.3.4-.3zM8 9.2c0-.2.1-.3.3-.3s.3.1.3.3v3.1h2.2c.2 0 .3.1.3.3s-.1.3-.3.3H8.3c-.2 0-.3-.1-.3-.3V9.2z"></path></svg>;
    default: return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>;
  }
};

export default function Contact() {
  const { user } = useAuth(); // 📌 ดึงระบบตรวจสอบ Admin

  // ----------------------------------------------------
  // 📌 State สำหรับฟอร์มเว็บติดต่อ (ระบบ Web3Forms เดิม)
  // ----------------------------------------------------
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: 'สอบถามข้อมูลทั่วไป', message: '' });
  const [status, setStatus] = useState(''); 

  // ----------------------------------------------------
  // 📌 State จัดการข้อมูล Database (Admin)
  // ----------------------------------------------------
  const [pageSettings, setPageSettings] = useState({
    hero_title: 'ติดต่อเรา', hero_subtitle: '', location_title: '', location_address: '', location_map_url: '',
    hours_title: '', hours_weekday: '', hours_weekend: '', map_embed_url: '', form_banner: 'ส่งข้อความถึงเรา', form_subtitle: 'กรอกแบบฟอร์มด้านล่าง แล้วเราจะติดต่อกลับภายใน 1-2 วันทำการ'
  });
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsModalType, setSettingsModalType] = useState('hero'); 
  const [settingsForm, setSettingsForm] = useState({});

  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [channelForm, setChannelForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // 🔒 ตรวจสอบสิทธิ์แบบครอบคลุมและปลอดภัย
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

  // 📌 โหลดข้อมูลจาก Supabase
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const { data: settingsData } = await supabase.from('contact_settings').select('*').eq('id', 1).maybeSingle();
        if (settingsData) setPageSettings(settingsData);

        const { data: channelsData } = await supabase.from('contact_channels').select('*').order('sort_order', { ascending: true });
        if (channelsData) setChannels(channelsData);
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // ----------------------------------------------------
  // 📌 ฟังก์ชันจัดการ Settings (ข้อความต่างๆ)
  // ----------------------------------------------------
  const handleOpenSettings = (type) => {
    setSettingsModalType(type);
    setSettingsForm(pageSettings);
    setIsSettingsModalOpen(true);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await supabase.from('contact_settings').upsert({ id: 1, ...settingsForm });
      setPageSettings(settingsForm);
      setIsSettingsModalOpen(false);
    } catch (err) { alert('บันทึกการตั้งค่าไม่สำเร็จ'); }
    setIsSaving(false);
  };

  // ----------------------------------------------------
  // 📌 ฟังก์ชันจัดการ ช่องทางการติดต่อ (การ์ดย่อย)
  // ----------------------------------------------------
  const handleOpenChannel = (item = null) => {
    if (item) {
      setChannelForm(item);
    } else {
      setChannelForm({ id: '', type: 'phone', label: '', value: '', url: '', sort_order: channels.length + 1 });
    }
    setIsChannelModalOpen(true);
  };

  const handleSaveChannel = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (channelForm.id) {
        const { data } = await supabase.from('contact_channels').update(channelForm).eq('id', channelForm.id).select();
        setChannels(channels.map(c => c.id === channelForm.id ? data[0] : c).sort((a,b) => a.sort_order - b.sort_order));
      } else {
        const payload = { ...channelForm };
        delete payload.id;
        const { data } = await supabase.from('contact_channels').insert([payload]).select();
        setChannels([...channels, data[0]].sort((a,b) => a.sort_order - b.sort_order));
      }
      setIsChannelModalOpen(false);
    } catch (err) { alert('บันทึกข้อมูลไม่สำเร็จ'); }
    setIsSaving(false);
  };

  const handleDeleteChannel = async (id) => {
    if (!window.confirm('ยืนยันการลบช่องทางการติดต่อนีั?')) return;
    try {
      await supabase.from('contact_channels').delete().eq('id', id);
      setChannels(channels.filter(c => c.id !== id));
    } catch (err) { alert('ลบข้อมูลไม่สำเร็จ'); }
  };

  // ----------------------------------------------------
  // 📌 ฟังก์ชันส่งฟอร์ม Web3Forms (ระบบเดิม)
  // ----------------------------------------------------
  const handleFormChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    // รหัส Access Key Web3Forms
    const accessKey = "ใ98a01654-3397-4dad-aaf8-1c6dd49152db"; 
    
    const data = {
      access_key: accessKey,
      subject: `ติดต่อจากเว็บไซต์ BME (หัวข้อ: ${formData.subject})`,
      from_name: formData.name,
      ...formData
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setFormData({ name: '', phone: '', email: '', subject: 'สอบถามข้อมูลทั่วไป', message: '' });
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

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
        
        {/* 📌 Hero Section */}
        <FadeInSection delay="0.1s">
          <div className="text-center max-w-4xl mx-auto pt-2 pb-10 relative group">
            {canManage && <ActionButtons onEdit={() => handleOpenSettings('hero')} positionClass="-top-2 right-0 md:-right-8" hideDelete={true} />}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
              {pageSettings.hero_title}
            </h1>
            <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl whitespace-pre-line">
              {pageSettings.hero_subtitle}
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay="0.2s">
          {/* 📌 Top Info Cards (ช่องทางติดต่อ) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 mb-8">
            {channels.map((ch) => (
              <div key={ch.id} className={`${miniBentoGlass} p-6 flex items-center gap-4 group relative`}>
                {canManage && <ActionButtons onEdit={() => handleOpenChannel(ch)} onDelete={() => handleDeleteChannel(ch.id)} positionClass="-top-3 -right-2 scale-90" />}
                
                <div className="w-12 h-12 flex-shrink-0 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm">
                  {getChannelIcon(ch.type)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] font-bold text-slate-500 mb-0.5">{ch.label}</p>
                  <a href={ch.url} target={ch.url.startsWith('http') ? '_blank' : '_self'} rel="noreferrer" className="font-extrabold text-[14px] text-slate-800 hover:text-purple-600 transition-colors truncate block">
                    {ch.value}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* 📌 ปุ่มเพิ่มช่องทางติดต่อ (สำหรับ Admin) ปรับสัดส่วนใหม่ */}
          {canManage && (
            <div className="flex justify-center mb-12">
              <button onClick={() => handleOpenChannel()} className="px-8 py-3.5 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                เพิ่มช่องทางติดต่อ
              </button>
            </div>
          )}
        </FadeInSection>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 mt-8">
          
          {/* Left: Contact Form */}
          <FadeInSection delay="0.3s" className="lg:col-span-2">
            <div className={`p-8 md:p-10 ${bentoGlass}`}>
              
              {/* 📌 แก้ไขส่วนแบนเนอร์ฟอร์ม ให้ปุ่มเหมือนหน้าอื่น */}
              <div className="mb-8">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 w-full">
                    <SectionBanner text={pageSettings.form_banner || 'ส่งข้อความถึงเรา'} />
                  </div>
                  {canManage && (
                    <button 
                      type="button" 
                      onClick={() => handleOpenSettings('form')} 
                      className="p-2.5 bg-white text-slate-500 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition shadow-sm border border-slate-200 shrink-0 mb-8 md:mb-12"
                      title="แก้ไขข้อความแบนเนอร์"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                  )}
                </div>
                <p className="text-slate-500 font-medium text-sm text-center -mt-6 md:-mt-10">{pageSettings.form_subtitle || 'กรอกแบบฟอร์มด้านล่าง แล้วเราจะติดต่อกลับภายใน 1-2 วันทำการ'}</p>
              </div>
              
              {status === 'success' && (
                <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3 font-bold text-sm shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                  ส่งข้อความสำเร็จ! เราจะรีบติดต่อกลับโดยเร็วที่สุด
                </div>
              )}
              {status === 'error' && (
                <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-3 font-bold text-sm shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  เกิดข้อผิดพลาดในการส่งข้อความ โปรดลองใหม่อีกครั้ง
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">ชื่อ-นามสกุล <span className="text-rose-500">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleFormChange} required className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-purple-400 outline-none font-medium text-slate-800 transition-all shadow-sm" placeholder="กรอกชื่อ-นามสกุล" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">เบอร์โทรศัพท์</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-purple-400 outline-none font-medium text-slate-800 transition-all shadow-sm" placeholder="08X-XXX-XXXX" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-2">อีเมล <span className="text-rose-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleFormChange} required className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-purple-400 outline-none font-medium text-slate-800 transition-all shadow-sm" placeholder="you@example.com" />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-2">หัวข้อ</label>
                  <select name="subject" value={formData.subject} onChange={handleFormChange} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-purple-400 outline-none font-medium text-slate-800 transition-all appearance-none cursor-pointer shadow-sm">
                    <option value="สอบถามข้อมูลทั่วไป">สอบถามข้อมูลทั่วไป</option>
                    <option value="งานเครือข่ายศิษย์เก่า">งานเครือข่ายศิษย์เก่า</option>
                    <option value="เสนอความร่วมมือ / ฝึกงาน">เสนอความร่วมมือ / ฝึกงาน</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-2">ข้อความ <span className="text-rose-500">*</span></label>
                  <textarea name="message" value={formData.message} onChange={handleFormChange} required rows="5" className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-purple-400 outline-none font-medium text-slate-800 transition-all resize-none shadow-sm" placeholder="พิมพ์ข้อความของคุณที่นี่..."></textarea>
                </div>
                
                <button 
                  type="submit" disabled={status === 'submitting'}
                  className={`group bg-slate-900 text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-md hover:bg-purple-700 flex items-center justify-center gap-2 w-full md:w-auto text-sm ${status === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {status === 'submitting' ? 'กำลังส่งข้อความ...' : 'ส่งข้อความ'}
                  {status !== 'submitting' && (
                    <svg className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </FadeInSection>

          {/* Right: Info Cards */}
          <FadeInSection delay="0.4s" className="flex flex-col gap-6">
            
            {/* 📌 Location Card */}
            <div className={`p-8 ${miniBentoGlass} relative group`}>
              {canManage && <ActionButtons onEdit={() => handleOpenSettings('location')} positionClass="top-4 right-4" hideDelete={true} />}
              <div className="w-10 h-10 bg-slate-100 text-slate-800 border border-slate-200 rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-3">{pageSettings.location_title}</h3>
              <p className="text-slate-600 text-[13px] leading-relaxed font-medium mb-6 whitespace-pre-line">
                {pageSettings.location_address}
              </p>
              <a href={pageSettings.location_map_url} target="_blank" rel="noreferrer" className="text-purple-600 hover:text-purple-800 font-bold text-sm flex items-center gap-1.5 transition-colors">
                ดูแผนที่ <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
            </div>

            {/* 📌 Operating Hours Card */}
            <div className={`p-8 ${miniBentoGlass} relative group bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50`}>
              {canManage && <ActionButtons onEdit={() => handleOpenSettings('hours')} positionClass="top-4 right-4" hideDelete={true} />}
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 className="font-extrabold text-slate-900 text-lg">{pageSettings.hours_title}</h3>
              </div>
              <div className="space-y-4 text-[13px] font-medium text-slate-700">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                  <span className="text-slate-500 font-bold">จันทร์ – ศุกร์</span>
                  <span className="font-extrabold text-slate-900">{pageSettings.hours_weekday}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500 font-bold">เสาร์ – อาทิตย์</span>
                  <span className="text-rose-500 font-extrabold">{pageSettings.hours_weekend}</span>
                </div>
              </div>
            </div>

          </FadeInSection>
        </div>

        {/* 📌 Map Full Width Card */}
        <FadeInSection delay="0.5s">
          <div className={`${bentoGlass} p-4 mt-8 relative group`}>
            {canManage && <ActionButtons onEdit={() => handleOpenSettings('map_embed')} positionClass="top-6 right-6" hideDelete={true} />}
            <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pr-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 text-slate-800 border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">ค้นหาเส้นทาง</h3>
                  <p className="text-[12px] text-slate-500 font-bold">BME KMUTNB</p>
                </div>
              </div>
              <a href={pageSettings.location_map_url} target="_blank" rel="noreferrer" className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-700 transition shadow-md flex items-center gap-2">
                เปิดใน Google Maps
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
            </div>
            <div className="w-full h-96 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative z-10">
              {pageSettings.map_embed_url ? (
                <iframe src={pageSettings.map_embed_url} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="KMUTNB Map"></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">ยังไม่มีลิงก์แผนที่ iframe</div>
              )}
            </div>
          </div>
        </FadeInSection>

      </div>

      {/* ========================================================= */}
      {/* 🔒 Admin Modal 1: ตั้งค่าข้อความหลัก */}
      {/* ========================================================= */}
      <AnimatePresence>
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.form onSubmit={handleSaveSettings} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2rem] w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-extrabold text-slate-800">✏️ แก้ไขข้อมูล</h2>
              <button type="button" onClick={() => setIsSettingsModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl p-2 rounded-full hover:bg-slate-100 transition-colors">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              {settingsModalType === 'hero' && (
                <>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">หัวข้อหลัก</label><input type="text" value={settingsForm.hero_title || ''} onChange={e => setSettingsForm({...settingsForm, hero_title: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">คำอธิบาย</label><textarea value={settingsForm.hero_subtitle || ''} onChange={e => setSettingsForm({...settingsForm, hero_subtitle: e.target.value})} rows="4" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm whitespace-pre-line" /></div>
                </>
              )}
              {settingsModalType === 'form' && (
                <>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">แบนเนอร์ฟอร์มติดต่อ</label><input type="text" value={settingsForm.form_banner || ''} onChange={e => setSettingsForm({...settingsForm, form_banner: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">คำอธิบายใต้แบนเนอร์</label><input type="text" value={settingsForm.form_subtitle || ''} onChange={e => setSettingsForm({...settingsForm, form_subtitle: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" /></div>
                </>
              )}
              {settingsModalType === 'location' && (
                <>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">หัวข้อสถานที่</label><input type="text" value={settingsForm.location_title || ''} onChange={e => setSettingsForm({...settingsForm, location_title: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ที่อยู่</label><textarea value={settingsForm.location_address || ''} onChange={e => setSettingsForm({...settingsForm, location_address: e.target.value})} rows="4" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm whitespace-pre-line" /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ลิงก์ Google Maps (สำหรับปุ่มกด)</label><input type="url" value={settingsForm.location_map_url || ''} onChange={e => setSettingsForm({...settingsForm, location_map_url: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" /></div>
                </>
              )}
              {settingsModalType === 'hours' && (
                <>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">หัวข้อเวลาทำการ</label><input type="text" value={settingsForm.hours_title || ''} onChange={e => setSettingsForm({...settingsForm, hours_title: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">จันทร์ - ศุกร์</label><input type="text" value={settingsForm.hours_weekday || ''} onChange={e => setSettingsForm({...settingsForm, hours_weekday: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">เสาร์ - อาทิตย์</label><input type="text" value={settingsForm.hours_weekend || ''} onChange={e => setSettingsForm({...settingsForm, hours_weekend: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" /></div>
                </>
              )}
              {settingsModalType === 'map_embed' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ลิงก์ Iframe (Src URL ของแผนที่)</label>
                  <p className="text-[10px] text-slate-400 mb-2">เอาเฉพาะ URL ที่อยู่ใน src="..." ของ Google Maps Iframe</p>
                  <input type="url" value={settingsForm.map_embed_url || ''} onChange={e => setSettingsForm({...settingsForm, map_embed_url: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" />
                </div>
              )}
            </div>

            <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
              <button type="button" onClick={() => setIsSettingsModalOpen(false)} disabled={isSaving} className="px-5 py-2.5 rounded-full text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm">ยกเลิก</button>
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md transition-colors text-sm">{isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</button>
            </div>
          </motion.form>
        </div>
      )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 🔒 Admin Modal 2: เพิ่ม/แก้ไข การ์ดช่องทางติดต่อ */}
      {/* ========================================================= */}
      <AnimatePresence>
      {isChannelModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.form onSubmit={handleSaveChannel} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2rem] w-full max-w-xl flex flex-col shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-extrabold text-slate-800">{channelForm.id ? '✏️ แก้ไขช่องทาง' : '✨ เพิ่มช่องทางติดต่อ'}</h2>
              <button type="button" onClick={() => setIsChannelModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl p-2 rounded-full hover:bg-slate-100 transition-colors">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ไอคอนโลโก้</label>
                  <select value={channelForm.type || 'other'} onChange={e => setChannelForm({...channelForm, type: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium">
                    <option value="phone">📞 เบอร์โทรศัพท์</option>
                    <option value="email">✉️ อีเมล</option>
                    <option value="facebook">📘 Facebook</option>
                    <option value="instagram">📸 Instagram</option>
                    <option value="line">💬 Line</option>
                    <option value="website">🌐 เว็บไซต์ / อื่นๆ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ลำดับการแสดงผล</label>
                  <input type="number" required value={channelForm.sort_order || 1} onChange={e => setChannelForm({...channelForm, sort_order: parseInt(e.target.value)})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" />
                </div>
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">หัวข้อย่อย (เช่น โทรหาเรา, Facebook)</label>
                <input type="text" required value={channelForm.label || ''} onChange={e => setChannelForm({...channelForm, label: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">ข้อความแสดงผล (เช่น 02-555-2000, BME KMUTNB)</label>
                <input type="text" required value={channelForm.value || ''} onChange={e => setChannelForm({...channelForm, value: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">ลิงก์ URL (ใช้เมื่อคลิก)</label>
                <p className="text-[10px] text-slate-400 mb-2">เบอร์โทร: ใส่ tel:เบอร์ / อีเมล: ใส่ mailto:อีเมล / เว็บ: ใส่ https://...</p>
                <input type="text" required value={channelForm.url || ''} onChange={e => setChannelForm({...channelForm, url: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" />
              </div>
            </div>

            <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0 rounded-b-[2rem]">
              <button type="button" onClick={() => setIsChannelModalOpen(false)} disabled={isSaving} className="px-5 py-2.5 rounded-full text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm border border-transparent hover:border-slate-300">ยกเลิก</button>
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md transition-colors text-sm">
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