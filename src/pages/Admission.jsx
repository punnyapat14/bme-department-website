import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { AuroraBackground, SectionBanner } from '../components/ThemeElements';
import { useAuth } from '../contexts/AuthContext';

// 📌 Helper: Map สีสำหรับลิงก์
const LINK_COLORS = {
  blue: { bg: 'from-[#00a8ff] to-[#0097e6]', label: 'น้ำเงิน (Blue)' },
  red: { bg: 'from-[#ff6b81] to-[#ff4757]', label: 'แดงส้ม (Red)' },
  emerald: { bg: 'from-[#2ed573] to-[#2bad60]', label: 'เขียว (Emerald)' },
  purple: { bg: 'from-[#a29bfe] to-[#6c5ce7]', label: 'ม่วง (Purple)' },
  orange: { bg: 'from-[#ffa502] to-[#e69300]', label: 'ส้ม (Orange)' },
  pink: { bg: 'from-[#ff4757] to-[#ff6b81]', label: 'ชมพู (Pink)' },
  slate: { bg: 'from-[#57606f] to-[#2f3542]', label: 'เทาดำ (Slate)' },
  indigo: { bg: 'from-[#3742fa] to-[#5352ed]', label: 'น้ำเงินเข้ม (Indigo)' },
};

// 📌 Helper: Map ไอคอนรวมทั้งหมด
const SVG_ICONS = {
  'check-circle': { path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'ติ๊กถูกวงกลม (Check Circle)' },
  'clipboard': { path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'คลิปบอร์ด (Clipboard)' },
  'currency-dollar': { path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'เหรียญการเงิน (Dollar)' },
  'clipboard-check': { path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', label: 'คลิปบอร์ดติ๊กถูก (Clipboard Check)' },
  'puzzle': { path: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z', label: 'จิ๊กซอว์ (Puzzle)' },
  'badge-check': { path: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', label: 'ตราสัญลักษณ์ (Badge Check)' },
  'download': { path: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', label: 'ดาวน์โหลด (Download)' },
  'globe': { path: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9', label: 'ลูกโลก (Globe)' },
};

// 📌 Component: EditButton (แสดงตลอด สีฟ้าขอบมน)
const EditButton = ({ onClick, className = "" }) => (
  <button type="button" onClick={onClick} className={`absolute z-30 p-2 bg-[#3b82f6] text-white rounded-lg shadow-sm hover:bg-blue-600 transition-all active:scale-95 ${className}`}>
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
  </button>
);

// 📌 Component: BannerEditButton (ปุ่มแก้ไขข้างๆ แบนเนอร์ สีขาวขอบเทา)
const BannerEditButton = ({ onClick, className = "" }) => (
  <button type="button" onClick={onClick} className={`flex-shrink-0 z-30 p-2 bg-white border border-slate-200 text-slate-500 rounded-lg shadow-sm hover:bg-slate-50 transition-all active:scale-95 ${className}`}>
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
  </button>
);

// 📌 Component: ActionButtons (กลุ่มปุ่ม แก้ไข/ลบ บนการ์ด)
const ActionButtons = ({ onEdit, onDelete, className = "" }) => (
  <div className={`absolute flex gap-1.5 z-20 ${className}`}>
    <button type="button" onClick={onEdit} className="p-1.5 bg-[#3b82f6] text-white rounded-lg shadow-sm hover:bg-blue-600 active:scale-95 transition-all">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
    </button>
    <button type="button" onClick={onDelete} className="p-1.5 bg-[#ff4757] text-white rounded-lg shadow-sm hover:bg-rose-600 active:scale-95 transition-all">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
    </button>
  </div>
);

export default function Admission() {
  const { user } = useAuth();
  
  // 🔒 ตรวจสอบสิทธิ์ Admin
  const canManage = Boolean(
    user && (
      ['admin', 'faculty', 'teacher', 'staff', 'instructor'].includes(String(user.role || user?.user_metadata?.role || '').toLowerCase()) ||
      user.isAdmin === true ||
      String(user.email || '').endsWith('@sci.kmutnb.ac.th') ||
      String(user.email || '').endsWith('@email.kmutnb.ac.th') ||
      String(user.email || '').toLowerCase() === 'bme.kmutnb.th@gmail.com'
    )
  );

  const [pageData, setPageData] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [tcasRounds, setTcasRounds] = useState([]);
  const [steps, setSteps] = useState([]);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // States สำหรับ Modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); 
  const [editingItem, setEditingItem] = useState(null);
  const [editBannerField, setEditBannerField] = useState('');
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const stepColorMap = {
    amber: { bg: 'from-amber-50 to-yellow-50/30', border: 'border-amber-400', icon: 'bg-amber-400' },
    teal: { bg: 'from-teal-50 to-emerald-50/30', border: 'border-teal-500', icon: 'bg-teal-500' },
    emerald: { bg: 'from-emerald-50 to-green-50/30', border: 'border-emerald-500', icon: 'bg-emerald-500' },
    yellow: { bg: 'from-yellow-50 to-amber-50/30', border: 'border-yellow-500', icon: 'bg-yellow-500' },
    purple: { bg: 'from-purple-50 to-fuchsia-50/30', border: 'border-purple-500', icon: 'bg-purple-500' },
    rose: { bg: 'from-rose-50 to-pink-50/30', border: 'border-rose-500', icon: 'bg-rose-500' },
    blue: { bg: 'from-blue-50 to-cyan-50/30', border: 'border-blue-500', icon: 'bg-blue-500' },
  };

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [
        { data: pageRes }, { data: qualRes }, { data: tcasRes }, { data: stepsRes }, { data: linksRes }
      ] = await Promise.all([
        supabase.from('page_admission').select('*').eq('id', 1).maybeSingle(),
        supabase.from('admission_qualifications').select('*').order('order_num', { ascending: true }),
        supabase.from('admission_tcas_rounds').select('*').order('order_num', { ascending: true }),
        supabase.from('admission_steps').select('*').order('step_number', { ascending: true }),
        supabase.from('admission_links').select('*').order('order_num', { ascending: true })
      ]);

      if (pageRes) setPageData(pageRes);
      if (qualRes) setQualifications(qualRes);
      if (tcasRes) setTcasRounds(tcasRes);
      if (stepsRes) setSteps(stepsRes);
      if (linksRes) setLinks(linksRes);
    } catch (error) {
      console.error('Error fetching admission data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAllData();
  }, []);

  const openBannerModal = (field) => {
    setModalType('banner');
    setEditBannerField(field);
    setFormData({ [field]: pageData[field] || '' });
    setShowModal(true);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    
    if (['header', 'fee', 'footer', 'contact'].includes(type)) {
      setFormData(pageData || {});
    } else if (type === 'qual_list') {
      setFormData({ items: qualifications.length > 0 ? JSON.parse(JSON.stringify(qualifications)) : [{ text: '' }] });
    } else if (type === 'tcas_list') {
      setFormData({ items: tcasRounds.length > 0 ? JSON.parse(JSON.stringify(tcasRounds)) : [{ round_name: '', description: '' }] });
    } else if (type === 'step') {
      setFormData(item ? { ...item, sub_list_text: item.sub_list?.join('\n') || '' } : { step_number: steps.length + 1, color_theme: 'amber', title: '', description: '' });
    } else if (type === 'link') {
      setFormData(item || { order_num: links.length + 1, color_classes: 'blue', icon_path: 'check-circle' });
    }
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `admission_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `admission/${fileName}`; 

    try {
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setFormData({ ...formData, graphic_img_url: data.publicUrl });
    } catch (error) {
      alert('อัปโหลดรูปภาพไม่สำเร็จ');
    } finally {
      setIsUploading(false);
    }
  };

  const handleListItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };
  const addListItem = (defaultObj) => setFormData({ ...formData, items: [...formData.items, defaultObj] });
  const removeListItem = (index) => setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!canManage) return;
    setSubmitting(true);

    try {
      if (modalType === 'banner') {
        await supabase.from('page_admission').update({ [editBannerField]: formData[editBannerField] }).eq('id', 1);
      } 
      else if (['header', 'fee', 'footer', 'contact'].includes(modalType)) {
        let updateData = {};
        if (modalType === 'header') updateData = { header_title: formData.header_title, header_subtitle: formData.header_subtitle, graphic_btn_url: formData.graphic_btn_url, graphic_img_url: formData.graphic_img_url };
        else if (modalType === 'fee') updateData = { tuition_fee: formData.tuition_fee, tuition_period: formData.tuition_period };
        else if (modalType === 'footer') updateData = { footer_note: formData.footer_note };
        else if (modalType === 'contact') updateData = { contact_office: formData.contact_office, contact_address: formData.contact_address, contact_phone: formData.contact_phone, contact_fax: formData.contact_fax, contact_fb_url: formData.contact_fb_url, contact_fb_name: formData.contact_fb_name, contact_fb_subtitle: formData.contact_fb_subtitle };
        
        await supabase.from('page_admission').update(updateData).eq('id', 1);
      } 
      else if (modalType === 'qual_list') {
        const keepIds = formData.items.map(i => i.id).filter(Boolean);
        const idsToDelete = qualifications.map(q => q.id).filter(id => !keepIds.includes(id));
        if (idsToDelete.length > 0) await supabase.from('admission_qualifications').delete().in('id', idsToDelete);
        for (let i = 0; i < formData.items.length; i++) {
          const item = formData.items[i];
          if (!item.text?.trim()) continue;
          if (item.id) await supabase.from('admission_qualifications').update({ text: item.text, order_num: i + 1 }).eq('id', item.id);
          else await supabase.from('admission_qualifications').insert({ text: item.text, order_num: i + 1 });
        }
      }
      else if (modalType === 'tcas_list') {
        const keepIds = formData.items.map(i => i.id).filter(Boolean);
        const idsToDelete = tcasRounds.map(t => t.id).filter(id => !keepIds.includes(id));
        if (idsToDelete.length > 0) await supabase.from('admission_tcas_rounds').delete().in('id', idsToDelete);
        for (let i = 0; i < formData.items.length; i++) {
          const item = formData.items[i];
          if (!item.round_name?.trim() || !item.description?.trim()) continue;
          if (item.id) await supabase.from('admission_tcas_rounds').update({ round_name: item.round_name, description: item.description, order_num: i + 1 }).eq('id', item.id);
          else await supabase.from('admission_tcas_rounds').insert({ round_name: item.round_name, description: item.description, order_num: i + 1 });
        }
      }
      else {
        const table = modalType === 'step' ? 'admission_steps' : 'admission_links';
        let payload = { ...formData };
        if (modalType === 'step') {
          payload.sub_list = payload.sub_list_text ? payload.sub_list_text.split('\n').map(s => s.trim()).filter(Boolean) : null;
          delete payload.sub_list_text;
        }
        if (!editingItem) delete payload.id;

        if (editingItem && editingItem.id) await supabase.from(table).update(payload).eq('id', editingItem.id);
        else await supabase.from(table).insert([payload]);
      }

      setShowModal(false);
      await fetchAllData();
    } catch (err) {
      alert('บันทึกไม่สำเร็จ: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (type, item) => {
    if (!canManage || !window.confirm('ยืนยันการลบข้อมูลนี้?')) return;
    try {
      const table = type === 'step' ? 'admission_steps' : 'admission_links';
      await supabase.from(table).delete().eq('id', item.id);
      await fetchAllData();
    } catch (err) {
      alert('ลบข้อมูลไม่สำเร็จ');
    }
  };

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden";

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#fdfcff]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>;
  if (!pageData) return <div className="min-h-screen flex items-center justify-center bg-[#fdfcff]"><div className="text-rose-500 font-bold">ไม่มีข้อมูล โปรดเพิ่มข้อมูลตั้งต้นใน Supabase</div></div>;

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />

      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">
        
        {/* ---------------- Header Section ---------------- */}
        <div className="text-center max-w-4xl mx-auto pt-8 pb-12 relative rounded-3xl">
          {canManage && <EditButton onClick={() => openModal('header')} className="absolute top-2 right-2 md:-right-8" />}
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600">
              {pageData.header_title}
            </h1>
            <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl px-4">
              {pageData.header_subtitle}
            </p>
          </motion.div>
        </div>

        {/* ---------------- 1. ภาพกราฟิกการรับสมัคร ---------------- */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`p-6 md:p-10 mb-16 ${bentoGlass}`}>
          <div className="flex flex-col items-center relative z-10">
            <div className="mb-10 w-full flex justify-center">
              <div className="inline-flex items-center gap-3">
                <SectionBanner text={pageData.banner_graphic_title || "ประกาศการรับสมัครนักศึกษาใหม่"} variant="exam" />
                {canManage && <BannerEditButton onClick={() => openBannerModal('banner_graphic_title')} />}
              </div>
            </div>

            <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.12)] border-8 border-white group/img transition-shadow duration-500">
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-20">
                   <a href={pageData.graphic_img_url} download="KMUTNB_Admission.jpg" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-full font-bold text-sm shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:bg-slate-100 hover:scale-105 transition-all">
                       <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                       ดาวน์โหลดประกาศ
                   </a>
               </div>
              <img src={pageData.graphic_img_url} alt="กราฟิกการรับสมัคร" className="w-full h-auto object-cover group-hover/img:scale-105 transition-transform duration-700" />
            </div>
            
            <div className="mt-10 text-center">
              <a href={pageData.graphic_btn_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-rose-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                เข้าสู่เว็บไซต์รับสมัครนักศึกษา (ส่วนกลาง)
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </a>
            </div>
          </div>
        </motion.div>
        
        {/* ---------------- 1.5 ข้อมูลรับสมัครเฉพาะสาขาวิชา BME ---------------- */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`p-6 sm:p-8 md:p-12 mb-16 ${bentoGlass}`}>
          <div className="relative mb-10 w-full">
            {/* Center Area: Banner + BannerEdit */}
            <div className="flex justify-center items-center">
              <div className="inline-flex items-center gap-3">
                <SectionBanner text={pageData.banner_bme_title || "ข้อมูลรับสมัครสาขาวิชาวิศวกรรมชีวการแพทย์"} variant="scholarship" />
                {canManage && <BannerEditButton onClick={() => openBannerModal('banner_bme_title')} />}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 relative">
            
            {/* 1. คุณสมบัติผู้สมัคร (การ์ด) */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50/30 rounded-3xl p-5 lg:p-6 shadow-sm border border-blue-100 flex flex-col hover:-translate-y-1 transition-transform relative">
              {canManage && <EditButton onClick={() => openModal('qual_list')} className="top-3 right-3 scale-90" />}
              <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center mb-4 shadow-md shrink-0"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div>
              <h3 className="text-[17px] font-extrabold text-slate-800 mb-3 pr-10">คุณสมบัติผู้สมัคร</h3>
              <ul className="space-y-3 text-[13px] xl:text-[14px] text-slate-600 font-medium flex-1">
                {qualifications.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 shrink-0">▪</span>
                    <span className="leading-snug break-words flex-1">{q.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. รอบที่เปิดรับ (TCAS) (การ์ด) */}
            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50/30 rounded-3xl p-5 lg:p-6 shadow-sm border border-purple-100 flex flex-col hover:-translate-y-1 transition-transform relative">
              {canManage && <EditButton onClick={() => openModal('tcas_list')} className="top-3 right-3 scale-90" />}
              <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center mb-4 shadow-md shrink-0"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg></div>
              <h3 className="text-[17px] font-extrabold text-slate-800 mb-3 pr-10">รอบที่เปิดรับ (TCAS)</h3>
              <ul className="space-y-3 text-[13px] xl:text-[14px] text-slate-600 font-medium flex-1">
                {tcasRounds.map((tcas, idx) => (
                  <li key={idx} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 leading-snug border-b border-purple-100 pb-2 last:border-0">
                    <span className="font-extrabold text-purple-700 shrink-0">{tcas.round_name}</span>
                    <span className="break-words flex-1">{tcas.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. ค่าธรรมเนียมการศึกษา (การ์ด) */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 rounded-3xl p-5 lg:p-6 shadow-sm border border-emerald-100 flex flex-col hover:-translate-y-1 transition-transform relative">
              {canManage && <EditButton onClick={() => openModal('fee')} className="top-3 right-3 scale-90" />}
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-md shrink-0"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
              <h3 className="text-[17px] font-extrabold text-slate-800 mb-3 pr-10">ค่าธรรมเนียมการศึกษา</h3>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-3xl lg:text-4xl font-black text-emerald-600 tracking-tight flex items-baseline gap-1">
                  {pageData.tuition_fee?.toLocaleString()} <span className="text-sm font-extrabold text-slate-500">บาท</span>
                </p>
                <p className="text-[13px] text-slate-500 mt-2 font-medium break-words">{pageData.tuition_period}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---------------- 2. สรุปขั้นตอนการสมัคร ---------------- */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`p-8 md:p-12 mb-16 ${bentoGlass}`}>
          <div className="relative w-full mb-10">
            {/* Center Area: Banner + BannerEdit */}
            <div className="flex justify-center items-center">
              <div className="inline-flex items-center gap-3">
                <SectionBanner text={pageData.banner_step_title || "สรุปขั้นตอนการสมัครเข้าศึกษา"} variant="calendar" />
                {canManage && <BannerEditButton onClick={() => openBannerModal('banner_step_title')} />}
              </div>
            </div>

            {/* Right Area: Add Button (Absolute on Desktop) */}
            {canManage && (
              <div className="mt-6 flex justify-center md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:mt-0">
                <button onClick={() => openModal('step')} className="px-5 py-2.5 bg-[#0f172a] text-white rounded-full text-sm font-bold shadow-md hover:bg-slate-800 whitespace-nowrap">
                  + เพิ่มข้อมูล (ขั้นตอน)
                </button>
              </div>
            )}
          </div>

          <div className="text-center mb-10">
            <p className="text-slate-500 font-medium">ผ่านระบบการรับสมัครนักศึกษาออนไลน์ มจพ.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => {
              const theme = stepColorMap[step.color_theme] || stepColorMap.amber;
              return (
                <div key={step.id} className={`bg-gradient-to-br ${theme.bg} rounded-2xl p-6 border-t-4 ${theme.border} shadow-sm relative group/item hover:shadow-md transition-shadow`}>
                  {canManage && <ActionButtons onEdit={() => openModal('step', step)} onDelete={() => handleDelete('step', step)} className="top-3 right-3" />}
                  
                  <div className={`w-10 h-10 rounded-full ${theme.icon} text-white flex items-center justify-center font-black text-lg mb-4 shadow-sm`}>{step.step_number}</div>
                  <h3 className="font-bold text-slate-800 mb-2 pr-16">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">{step.description}</p>
                  
                  {step.sub_list && Array.isArray(step.sub_list) && step.sub_list.length > 0 && (
                    <ul className="text-[13px] text-slate-500 list-disc pl-4 space-y-1 mt-2">
                      {step.sub_list.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {pageData.footer_note && (
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5 text-center shadow-sm relative hover:shadow-md transition-shadow">
              {canManage && <EditButton onClick={() => openModal('footer')} className="top-2 right-2 scale-90" />}
              <p className="text-sm font-bold text-blue-800 pr-10" dangerouslySetInnerHTML={{ __html: pageData.footer_note }} />
            </div>
          )}
        </motion.div>

        {/* ---------------- 3. ระบบและข้อมูลที่เกี่ยวข้อง ---------------- */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`p-8 md:p-12 mb-16 ${bentoGlass}`}>
          <div className="relative w-full mb-10">
            {/* Center Area: Banner + BannerEdit */}
            <div className="flex justify-center items-center">
              <div className="inline-flex items-center gap-3">
                <SectionBanner text={pageData.banner_link_title || "ระบบและข้อมูลที่เกี่ยวข้อง"} variant="website" />
                {canManage && <BannerEditButton onClick={() => openBannerModal('banner_link_title')} />}
              </div>
            </div>

            {/* Right Area: Add Button (Absolute on Desktop) */}
            {canManage && (
              <div className="mt-6 flex justify-center md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:mt-0">
                <button onClick={() => openModal('link')} className="px-5 py-2.5 bg-[#0f172a] text-white rounded-full text-sm font-bold shadow-md hover:bg-slate-800 whitespace-nowrap">
                  + เพิ่มข้อมูล (ลิงก์)
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {links.map((link) => {
              const linkBg = LINK_COLORS[link.color_classes]?.bg || link.color_classes || 'from-[#00a8ff] to-[#0097e6]';
              const linkIconPath = SVG_ICONS[link.icon_path]?.path || link.icon_path || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';

              return (
                <div key={link.id} className="relative block h-full">
                  {canManage && <ActionButtons onEdit={() => openModal('link', link)} onDelete={() => handleDelete('link', link)} className="top-3 right-3" />}
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="group/link relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex items-center gap-4 h-full"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${linkBg} text-white flex items-center justify-center shrink-0 shadow-inner group-hover/link:scale-110 transition-transform`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={linkIconPath}></path></svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-[13px] leading-snug group-hover/link:text-purple-700 transition-colors pr-14">{link.title}</h3>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ---------------- 4. ข้อมูลติดต่อ ---------------- */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`p-8 md:p-12 mb-8 ${bentoGlass}`}>
          <div className="mb-10 w-full flex justify-center">
            <div className="inline-flex items-center gap-3">
              <SectionBanner text={pageData.banner_contact_title || "ติดต่อสอบถามข้อมูล"} variant="website" />
              {canManage && <BannerEditButton onClick={() => openBannerModal('banner_contact_title')} />}
            </div>
          </div>

          <div className="relative rounded-3xl p-2 md:p-4">
            {canManage && <EditButton onClick={() => openModal('contact')} className="top-0 right-0 md:top-2 md:right-2" />}
            
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between relative z-10 pt-4 pr-4">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-[17px] font-extrabold text-[#1e293b] mb-5">{pageData.contact_office}</h3>
                <div className="space-y-4 text-slate-600 text-sm font-medium">
                  <div className="flex items-start gap-3 justify-center md:justify-start">
                    <svg className="w-5 h-5 text-[#ff4757] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <p className="max-w-sm">{pageData.contact_address}</p>
                  </div>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <svg className="w-5 h-5 text-[#ff4757] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    <p>{pageData.contact_phone}</p>
                  </div>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <svg className="w-5 h-5 text-[#ff4757] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    <p>{pageData.contact_fax}</p>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <a href={pageData.contact_fb_url} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-2 bg-[#eef4ff] border border-blue-100 hover:shadow-md px-10 py-6 rounded-2xl transition-all text-center w-64 h-full">
                  <svg className="w-[3.5rem] h-[3.5rem] text-[#1877F2] mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  <p className="font-black text-slate-800 text-[15px]">{pageData.contact_fb_name}</p>
                  <p className="text-[12px] text-slate-500 font-medium">{pageData.contact_fb_subtitle || 'กลุ่มงานรับเข้าศึกษา มจพ.'}</p>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ---------------- 🔒 Modal Form ---------------- */}
      <AnimatePresence>
        {canManage && showModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            
            <motion.form onSubmit={handleSave} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative z-10 bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-xl font-extrabold text-slate-900">
                  {modalType === 'banner' && '✏️ แก้ไขข้อความป้ายแบนเนอร์'}
                  {modalType === 'header' && '✏️ แก้ไขข้อมูลส่วนหัวเว็บ'}
                  {modalType === 'fee' && '✏️ แก้ไขค่าธรรมเนียมการศึกษา'}
                  {modalType === 'footer' && '✏️ แก้ไขหมายเหตุท้ายขั้นตอน'}
                  {modalType === 'contact' && '✏️ แก้ไขข้อมูลติดต่อ'}
                  {modalType === 'qual_list' && '📋 จัดการคุณสมบัติผู้สมัคร'}
                  {modalType === 'tcas_list' && '📋 จัดการรอบ TCAS'}
                  {modalType === 'step' && (editingItem ? '✏️ แก้ไขขั้นตอน' : '✨ เพิ่มขั้นตอน')}
                  {modalType === 'link' && (editingItem ? '✏️ แก้ไขลิงก์' : '✨ เพิ่มลิงก์')}
                </h3>
                <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
              </div>

              <div className="space-y-4">
                
                {/* ---------- Form: Banner Edit ---------- */}
                {modalType === 'banner' && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-1">ข้อความบนแบนเนอร์</label>
                      <input required value={formData[editBannerField] || ''} onChange={e=>setFormData({...formData, [editBannerField]: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                    </div>
                  </div>
                )}

                {/* ---------- Form: Header & Poster ---------- */}
                {modalType === 'header' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"><label className="text-xs font-bold text-slate-600">หัวข้อหลัก</label><input required value={formData.header_title || ''} onChange={e=>setFormData({...formData, header_title: e.target.value})} className="w-full mt-1 p-2 border rounded-xl" /></div>
                    <div className="md:col-span-2"><label className="text-xs font-bold text-slate-600">คำอธิบายย่อย</label><input required value={formData.header_subtitle || ''} onChange={e=>setFormData({...formData, header_subtitle: e.target.value})} className="w-full mt-1 p-2 border rounded-xl" /></div>
                    <div className="md:col-span-2"><label className="text-xs font-bold text-slate-600">ลิงก์ปุ่ม "เข้าสู่เว็บไซต์รับสมัคร"</label><input value={formData.graphic_btn_url || ''} onChange={e=>setFormData({...formData, graphic_btn_url: e.target.value})} className="w-full mt-1 p-2 border rounded-xl" /></div>
                    
                    <div className="md:col-span-2 border p-4 rounded-xl bg-slate-50">
                      <label className="text-xs font-bold text-slate-600">โปสเตอร์รับสมัคร (อัปโหลด หรือ URL)</label>
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="block w-full text-xs mt-2 mb-2" />
                      <input value={formData.graphic_img_url || ''} onChange={e=>setFormData({...formData, graphic_img_url: e.target.value})} placeholder="URL รูปภาพ..." className="w-full p-2 border rounded-xl text-sm" />
                    </div>
                  </div>
                )}

                {/* ---------- Form: Fee ---------- */}
                {modalType === 'fee' && (
                  <div className="grid grid-cols-1 gap-4">
                    <div><label className="text-xs font-bold text-slate-600">ค่าธรรมเนียม (ตัวเลข)</label><input type="number" value={formData.tuition_fee || 0} onChange={e=>setFormData({...formData, tuition_fee: Number(e.target.value)})} className="w-full mt-1 p-3 border rounded-xl font-bold" /></div>
                    <div><label className="text-xs font-bold text-slate-600">ระยะเวลา (เช่น ต่อภาคการศึกษา)</label><input value={formData.tuition_period || ''} onChange={e=>setFormData({...formData, tuition_period: e.target.value})} className="w-full mt-1 p-3 border rounded-xl" /></div>
                  </div>
                )}

                {/* ---------- Form: Footer Note ---------- */}
                {modalType === 'footer' && (
                  <div className="grid grid-cols-1 gap-4">
                    <div><label className="text-xs font-bold text-slate-600">หมายเหตุด้านล่าง (รองรับ HTML Tag)</label><textarea rows="5" value={formData.footer_note || ''} onChange={e=>setFormData({...formData, footer_note: e.target.value})} className="w-full mt-1 p-3 border rounded-xl" placeholder="เช่น 📌 เฉพาะผู้สมัคร..." /></div>
                  </div>
                )}

                {/* ---------- Form: Contact ---------- */}
                {modalType === 'contact' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"><label className="text-xs font-bold text-slate-600">ชื่อหน่วยงานติดต่อ</label><input value={formData.contact_office || ''} onChange={e=>setFormData({...formData, contact_office: e.target.value})} className="w-full mt-1 p-2 border rounded-xl" /></div>
                    <div className="md:col-span-2"><label className="text-xs font-bold text-slate-600">ที่อยู่</label><textarea rows="2" value={formData.contact_address || ''} onChange={e=>setFormData({...formData, contact_address: e.target.value})} className="w-full mt-1 p-2 border rounded-xl" /></div>
                    <div><label className="text-xs font-bold text-slate-600">เบอร์โทร</label><input value={formData.contact_phone || ''} onChange={e=>setFormData({...formData, contact_phone: e.target.value})} className="w-full mt-1 p-2 border rounded-xl" /></div>
                    <div><label className="text-xs font-bold text-slate-600">โทรสาร (แฟกซ์)</label><input value={formData.contact_fax || ''} onChange={e=>setFormData({...formData, contact_fax: e.target.value})} className="w-full mt-1 p-2 border rounded-xl" /></div>
                    <div className="md:col-span-2"><label className="text-xs font-bold text-slate-600">Facebook URL</label><input value={formData.contact_fb_url || ''} onChange={e=>setFormData({...formData, contact_fb_url: e.target.value})} className="w-full mt-1 p-2 border rounded-xl" /></div>
                    <div><label className="text-xs font-bold text-slate-600">ชื่อเพจ Facebook</label><input value={formData.contact_fb_name || ''} onChange={e=>setFormData({...formData, contact_fb_name: e.target.value})} className="w-full mt-1 p-2 border rounded-xl" /></div>
                    <div><label className="text-xs font-bold text-slate-600">คำอธิบายเพจ Facebook</label><input value={formData.contact_fb_subtitle || ''} onChange={e=>setFormData({...formData, contact_fb_subtitle: e.target.value})} className="w-full mt-1 p-2 border rounded-xl" placeholder="เช่น กลุ่มงานรับเข้าศึกษา มจพ." /></div>
                  </div>
                )}

                {/* ---------- Form: Qualifications List ---------- */}
                {modalType === 'qual_list' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 mb-2">เพิ่ม/แก้ไข/ลบ รายการคุณสมบัติ (ลำดับจะเรียงตามที่ปรากฏด้านล่าง)</p>
                    {formData.items?.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <span className="mt-2 font-bold text-slate-400 w-4">{index + 1}.</span>
                        <input
                          className="flex-1 p-2 border rounded-xl text-sm"
                          value={item.text || ''}
                          onChange={(e) => handleListItemChange(index, 'text', e.target.value)}
                          placeholder="กรอกข้อความคุณสมบัติ..."
                        />
                        <button type="button" onClick={() => removeListItem(index)} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addListItem({ text: '' })} className="mt-4 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2.5 rounded-xl w-full hover:bg-blue-100 transition-colors">
                      + เพิ่มคุณสมบัติใหม่
                    </button>
                  </div>
                )}

                {/* ---------- Form: TCAS Rounds List ---------- */}
                {modalType === 'tcas_list' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 mb-2">เพิ่ม/แก้ไข/ลบ รอบการรับสมัคร (ลำดับจะเรียงตามที่ปรากฏด้านล่าง)</p>
                    {formData.items?.map((item, index) => (
                      <div key={index} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 relative group">
                        <button type="button" onClick={() => removeListItem(index)} className="absolute top-3 right-3 text-rose-400 hover:text-rose-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                        <div className="flex items-center gap-2 w-full pr-8">
                          <span className="font-bold text-slate-400">{index + 1}.</span>
                          <input className="flex-1 p-2 border rounded-lg text-sm" value={item.round_name || ''} onChange={(e) => handleListItemChange(index, 'round_name', e.target.value)} placeholder="ชื่อรอบ (เช่น รอบ 1:)" />
                        </div>
                        <div className="pl-6 w-full">
                          <input className="w-full p-2 border rounded-lg text-sm" value={item.description || ''} onChange={(e) => handleListItemChange(index, 'description', e.target.value)} placeholder="คำอธิบาย (เช่น Portfolio)" />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => addListItem({ round_name: '', description: '' })} className="mt-4 text-sm font-bold text-purple-600 bg-purple-50 px-4 py-2.5 rounded-xl w-full hover:bg-purple-100 transition-colors">
                      + เพิ่มรอบ TCAS ใหม่
                    </button>
                  </div>
                )}

                {/* ---------- Form: Steps ---------- */}
                {modalType === 'step' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold">เลขขั้นตอน</label><input type="number" required value={formData.step_number || 1} onChange={e=>setFormData({...formData, step_number: e.target.value})} className="w-full mt-1 p-2 border rounded-xl" /></div>
                    <div>
                      <label className="text-xs font-bold">ธีมสี</label>
                      <select value={formData.color_theme || 'amber'} onChange={e=>setFormData({...formData, color_theme: e.target.value})} className="w-full mt-1 p-2 border rounded-xl">
                        <option value="amber">เหลือง (Amber)</option><option value="teal">เขียวอมฟ้า (Teal)</option>
                        <option value="emerald">เขียว (Emerald)</option><option value="yellow">เหลืองทอง (Yellow)</option>
                        <option value="purple">ม่วง (Purple)</option><option value="rose">แดงกุหลาบ (Rose)</option>
                        <option value="blue">น้ำเงิน (Blue)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2"><label className="text-xs font-bold">หัวข้อขั้นตอน</label><input required value={formData.title || ''} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full mt-1 p-2 border rounded-xl" /></div>
                    <div className="md:col-span-2"><label className="text-xs font-bold">คำอธิบาย</label><textarea required rows="2" value={formData.description || ''} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full mt-1 p-2 border rounded-xl" /></div>
                    <div className="md:col-span-2"><label className="text-xs font-bold">ลิสต์ย่อย (กด Enter เพื่อขึ้นบรรทัดใหม่ - เว้นว่างได้)</label><textarea rows="3" value={formData.sub_list_text || ''} onChange={e=>setFormData({...formData, sub_list_text: e.target.value})} placeholder="เช่น Mobile Banking&#10;ตู้ ATM" className="w-full mt-1 p-2 border rounded-xl text-sm" /></div>
                  </div>
                )}

                {/* ---------- Form: Links ---------- */}
                {modalType === 'link' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold">ลำดับการแสดงผล</label><input type="number" required value={formData.order_num || 1} onChange={e=>setFormData({...formData, order_num: e.target.value})} className="w-full mt-1 p-2 border rounded-xl" /></div>
                    <div className="md:col-span-2"><label className="text-xs font-bold">ชื่อลิงก์</label><input required value={formData.title || ''} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full mt-1 p-2 border rounded-xl" /></div>
                    <div className="md:col-span-2"><label className="text-xs font-bold">URL (ลิงก์ปลายทาง)</label><input required type="url" value={formData.url || ''} onChange={e=>setFormData({...formData, url: e.target.value})} className="w-full mt-1 p-2 border rounded-xl" /></div>
                    
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold">เลือกสีพื้นหลัง (Gradient Color)</label>
                      <div className="flex gap-4 items-center mt-1">
                        <select value={formData.color_classes || 'blue'} onChange={e=>setFormData({...formData, color_classes: e.target.value})} className="w-full p-2 border rounded-xl text-sm">
                          {Object.keys(LINK_COLORS).map(key => <option key={key} value={key}>{LINK_COLORS[key].label}</option>)}
                        </select>
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br shrink-0 border border-slate-200 shadow-inner ${LINK_COLORS[formData.color_classes]?.bg || LINK_COLORS['blue'].bg}`}></div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-bold">เลือกไอคอน (SVG Icon)</label>
                      <div className="flex gap-4 items-center mt-1">
                        <select value={formData.icon_path || 'check-circle'} onChange={e=>setFormData({...formData, icon_path: e.target.value})} className="w-full p-2 border rounded-xl text-sm">
                          {Object.keys(SVG_ICONS).map(key => <option key={key} value={key}>{SVG_ICONS[key].label}</option>)}
                        </select>
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                          <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={SVG_ICONS[formData.icon_path]?.path || SVG_ICONS['check-circle'].path}></path></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-6 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setShowModal(false)} disabled={submitting || isUploading} className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">ยกเลิก</button>
                <button type="submit" disabled={submitting || isUploading} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 flex items-center gap-2 transition-colors">
                  {(submitting || isUploading) && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                  บันทึกข้อมูล
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}