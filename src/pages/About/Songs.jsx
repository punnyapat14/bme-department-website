import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground, SectionBanner } from '../../components/ThemeElements';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from "../../supabaseClient";

// รูปภาพเริ่มต้น (Fallback)
import imgKmutnbSeal from '../../assets/Symbol/KMUTNB_Logo.png';
import imgAppliedScience from '../../assets/Symbol/AppliedScience_Logo.png';

// 🛠️ Helper: จัดการรูปภาพโลโก้
const getIconImage = (url, category) => {
  if (url && url.trim() !== "") return url.trim();
  if (category === 'faculty') return imgAppliedScience;
  return imgKmutnbSeal;
};

// Form ดั้งเดิมแบบว่างเปล่าสำหรับการ์ดบทเพลง
const EMPTY_FORM = { id: null, category: 'university', title: '', lyrics: '', image_url: '', sort_order: 1 };

// ==========================================
// 📌 Components ตกแต่ง
// ==========================================
const CardCloudDecoration = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-[2rem]">
    <div className="absolute inset-0 bg-gradient-to-b from-[#e0f2fe] via-[#f0f9ff] to-[#fdfcf6] opacity-90"></div>
    <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/80 blur-[25px] rounded-full"></div>
    <div className="absolute top-12 -right-16 w-56 h-56 bg-white/70 blur-[35px] rounded-full"></div>
    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120%] h-40 bg-white/90 blur-[20px] rounded-t-[100%]"></div>
  </div>
);

const BirdFlock = () => (
  <svg className="absolute top-8 right-8 w-14 h-14 text-amber-700/40 opacity-80 z-10" viewBox="0 0 100 100" fill="currentColor">
    <path d="M70.5,30.5 C68,28 65,27.5 62.5,29 C65,30.5 66.5,33 66.5,35.5 C66.5,33 68,30.5 70.5,30.5 Z" />
    <path d="M85.5,40.5 C83,38 80,37.5 77.5,39 C80,40.5 81.5,43 81.5,45.5 C81.5,43 83,40.5 85.5,40.5 Z" />
    <path d="M55.5,45.5 C53,43 50,42.5 47.5,44 C50,45.5 51.5,48 51.5,50.5 C51.5,48 53,45.5 55.5,45.5 Z" />
  </svg>
);

const FadeInSection = ({ children, delay = "0s", className = "" }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setVisible(true); });
    }, { threshold: 0.1 });
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
// 📌 ปุ่มแก้ไข (Edit / Delete) มาตรฐาน (แสดงตลอดเวลา ไม่ซ่อนแล้ว)
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

// ==========================================
// 📌 Main Component
// ==========================================
export default function Songs() {
  const { user } = useAuth();
  
  // State เก็บข้อมูล
  const [pageContent, setPageContent] = useState({ title: '', subtitle: '', description: '' });
  const [songsList, setSongsList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State สำหรับโหมดจัดการข้อมูล (Modal)
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('song'); 
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // 🔒 ตรวจสอบสิทธิ์
  const canManageSongs = Boolean(
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
    try {
      setLoading(true);
      setError('');
      
      const { data: contentData } = await supabase.from('songs_page_content').select('*').eq('id', 1).maybeSingle();
      if (contentData) {
        setPageContent(contentData);
      } else {
        setPageContent({ title: 'บทเพลงประจำสถาบัน', subtitle: 'ศูนย์รวมเนื้อเพลง', description: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ และคณะวิทยาศาสตร์ประยุกต์' });
      }

      const { data: songsData, error: songsError } = await supabase.from('songs').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true });
      if (songsError) throw songsError;
      if (songsData) setSongsList(songsData);

    } catch (err) {
      console.error('Fetch error:', err);
      setError('ไม่สามารถโหลดข้อมูลได้ในขณะนี้');
    } finally {
      setLoading(false);
    }
  };

  // 📌 เปิด Modal
  const openModal = (item = null, type = 'song') => {
    setModalType(type);
    
    if (type === 'content') {
      setFormData(pageContent);
    } else if (type === 'editBanners') {
      // 📌 เปิดแบบฟอร์มสำหรับแก้แบนเนอร์โดยเฉพาะ
      setFormData({
        ...pageContent,
        sec_uni_title: pageContent.sec_uni_title || 'บทเพลงมหาวิทยาลัย',
        sec_fac_title: pageContent.sec_fac_title || 'บทเพลงประจำคณะ'
      });
    } else {
      if (item && typeof item === 'object') {
        setEditingItem(item);
        setFormData(item);
      } else {
        setEditingItem(null);
        setFormData({ ...EMPTY_FORM, category: typeof item === 'string' ? item : 'university' });
      }
    }
    setShowModal(true);
  };

  // 📌 ฟังก์ชันจัดการการอัปโหลดรูปภาพ
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `song_icon_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `songs/${fileName}`; 

    try {
      const { error: uploadError } = await supabase.storage.from('Songs').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('Songs').getPublicUrl(filePath);
      setFormData({ ...formData, image_url: data.publicUrl });
    } catch (error) {
      alert('อัปโหลดรูปภาพไม่สำเร็จ');
    } finally {
      setIsUploading(false);
    }
  };

  // 📌 ฟังก์ชันบันทึกข้อมูล
  const handleSave = async (e) => {
    e.preventDefault();
    if (!canManageSongs) return;

    try {
      setSubmitting(true);
      
      // 1. บันทึกข้อมูลส่วนหัว หรือ แบนเนอร์
      if (modalType === 'content' || modalType === 'editBanners') {
        const payload = {
          id: 1,
          title: formData.title || pageContent.title || '',
          subtitle: formData.subtitle || pageContent.subtitle || '',
          description: formData.description || pageContent.description || '',
          sec_uni_title: formData.sec_uni_title || pageContent.sec_uni_title || 'บทเพลงมหาวิทยาลัย',
          sec_fac_title: formData.sec_fac_title || pageContent.sec_fac_title || 'บทเพลงประจำคณะ'
        };
        const { data, error } = await supabase.from('songs_page_content').upsert(payload, { onConflict: 'id' }).select();
        if (error) throw error;
        if (data && data.length > 0) setPageContent(data[0]);
        
      // 2. บันทึกข้อมูลบทเพลง
      } else {
        if (!formData.title.trim()) {
          alert('กรุณากรอกชื่อเพลง');
          setSubmitting(false);
          return;
        }

        const payload = {
          category: formData.category,
          title: formData.title,
          lyrics: formData.lyrics || '',
          image_url: formData.image_url || '',
          sort_order: Number(formData.sort_order || 1)
        };

        if (editingItem && editingItem.id) {
          const { error } = await supabase.from('songs').update(payload).eq('id', editingItem.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('songs').insert([payload]);
          if (error) throw error;
        }
      }

      setShowModal(false);
      await fetchData(); 
    } catch (err) {
      console.error('Submit error:', err);
      alert('บันทึกข้อมูลไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  // 📌 ฟังก์ชันลบเพลง
  const handleDeleteSong = async (item) => {
    if (!canManageSongs || !window.confirm(`ยืนยันการลบเพลง: ${item.title}? ข้อมูลจะถูกลบถาวร`)) return;
    try {
      const { error } = await supabase.from('songs').delete().eq('id', item.id);
      if (error) throw error;
      await fetchData();
    } catch (err) {
      alert('ลบข้อมูลไม่สำเร็จ: ' + err.message);
    }
  };

  // แยกหมวดหมู่เพลง
  const { universitySongs, facultySongs } = useMemo(() => {
    return {
      universitySongs: songsList.filter(s => String(s.category || '').trim().toLowerCase() === 'university'),
      facultySongs: songsList.filter(s => String(s.category || '').trim().toLowerCase() === 'faculty')
    };
  }, [songsList]);

  const sectionWrapperGlass = "rounded-[3rem] bg-white/45 backdrop-blur-2xl border border-white/60 shadow-sm p-6 md:p-10 mb-16";

  // Component สำหรับแสดงการ์ดเพลง
  const renderSongCard = (item) => {
    const iconImg = getIconImage(item.image_url, item.category);
    const lyrics = item.lyrics || '';

    return (
      <motion.div
        key={item.id}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ duration: 0.3 }}
        className="break-inside-avoid mb-8 rounded-[2rem] bg-white border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(14,165,233,0.15)] relative overflow-hidden group/card"
      >
        <CardCloudDecoration />
        <BirdFlock />
        
        {/* 📌 เปลี่ยนมาใช้ปุ่ม ActionButtons ที่แสดงถาวร */}
        {canManageSongs && (
          <ActionButtons onEdit={() => openModal(item, 'song')} onDelete={() => handleDeleteSong(item)} />
        )}

        <div className="p-8 relative z-20 mt-4">
          <div className="flex flex-col items-center pb-6 mb-6 relative">
            <div className="absolute bottom-0 w-32 h-[1px] bg-gradient-to-r from-transparent via-sky-300 to-transparent"></div>
            <div className="w-16 h-16 rounded-full bg-white shadow-md border border-slate-100 p-1 mb-4 flex items-center justify-center transform group-hover/card:scale-110 transition-transform duration-500">
              <img src={iconImg} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center gap-3 w-full justify-center">
              <div className="h-1 w-4 bg-slate-800 rounded-full opacity-60"></div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800 text-center tracking-tight drop-shadow-sm">{item.title}</h3>
              <div className="h-1 w-4 bg-slate-800 rounded-full opacity-60"></div>
            </div>
          </div>

          <div className="text-center space-y-2">
            {lyrics.split('\n').map((line, idx) => {
              const isHighlight = line.trim().startsWith('(') || line.trim().startsWith('*') || line.trim().startsWith('-');
              return (
                <p key={idx} className={`text-[15px] leading-relaxed transition-colors ${line.trim() === '' ? 'h-4' : ''} ${isHighlight ? 'text-blue-800 font-bold italic' : 'text-slate-700 font-medium'}`}>
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />
      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">

        {/* ---------------- Header Section ---------------- */}
        <FadeInSection delay="0.1s">
          <div className="relative text-center max-w-4xl mx-auto pt-2 pb-12 rounded-3xl transition-colors duration-300">
            {canManageSongs && (
              <ActionButtons onEdit={() => openModal(null, 'content')} positionClass="-top-4 right-0 md:-right-8" />
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm px-6">
              {pageContent.title || "บทเพลงประจำสถาบัน"}
            </h1>
            <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl px-6 whitespace-pre-line">
              {pageContent.subtitle ? pageContent.subtitle + '\n' : ''}
              {pageContent.description}
            </p>
          </div>
        </FadeInSection>

        {loading && <div className="text-center text-slate-500 py-20 animate-pulse font-bold text-lg">กำลังโหลดข้อมูล...</div>}
        
        {!loading && error && (
          <div className="max-w-2xl mx-auto mb-12 p-6 rounded-3xl bg-amber-50 border border-amber-200 text-center text-amber-800 font-bold">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ---------------- บทเพลงมหาวิทยาลัย ---------------- */}
            <div className={sectionWrapperGlass}>
              <FadeInSection delay="0.2s">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 max-w-5xl mx-auto w-full">
                  <div className="flex-1 w-full flex items-center gap-2">
                    <div className="flex-1"><SectionBanner text={pageContent.sec_uni_title || 'บทเพลงมหาวิทยาลัย'} variant="website" /></div>
                    
                    {/* 📌 ปุ่มแก้ชื่อแบนเนอร์ (ติดกับแบนเนอร์) */}
                    {canManageSongs && (
                      <button onClick={() => openModal(null, 'editBanners')} title="แก้ไขข้อความแบนเนอร์" className="p-2.5 bg-slate-100/80 text-slate-500 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition shadow-sm border border-slate-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                    )}
                  </div>
                  {canManageSongs && (
                    <button onClick={() => openModal('university', 'song')} className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold shadow-md hover:bg-purple-700 shrink-0 flex items-center gap-2 transition-transform hover:-translate-y-0.5">
                      + เพิ่มเพลงมหาวิทยาลัย
                    </button>
                  )}
                </div>
                
                {universitySongs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto items-start">
                    {universitySongs.map(renderSongCard)}
                  </div>
                ) : <p className="text-center text-slate-500 py-10 font-medium">ยังไม่มีข้อมูลเพลงในหมวดหมู่นี้</p>}
              </FadeInSection>
            </div>

            {/* ---------------- บทเพลงคณะ ---------------- */}
            <div className={sectionWrapperGlass}>
              <FadeInSection delay="0.3s">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 max-w-5xl mx-auto w-full">
                  <div className="flex-1 w-full flex items-center gap-2">
                    <div className="flex-1"><SectionBanner text={pageContent.sec_fac_title || 'บทเพลงประจำคณะ'} variant="calendar" /></div>
                    
                    {/* 📌 ปุ่มแก้ชื่อแบนเนอร์ (ติดกับแบนเนอร์) */}
                    {canManageSongs && (
                      <button onClick={() => openModal(null, 'editBanners')} title="แก้ไขข้อความแบนเนอร์" className="p-2.5 bg-slate-100/80 text-slate-500 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition shadow-sm border border-slate-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                    )}
                  </div>
                  {canManageSongs && (
                    <button onClick={() => openModal('faculty', 'song')} className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold shadow-md hover:bg-purple-700 shrink-0 flex items-center gap-2 transition-transform hover:-translate-y-0.5">
                      + เพิ่มเพลงคณะ
                    </button>
                  )}
                </div>
                
                {facultySongs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto items-start">
                    {facultySongs.map(renderSongCard)}
                  </div>
                ) : <p className="text-center text-slate-500 py-10 font-medium">ยังไม่มีข้อมูลเพลงในหมวดหมู่นี้</p>}
              </FadeInSection>
            </div>
          </>
        )}
      </div>

      {/* ---------------- Modal ฟอร์มเพิ่ม/แก้ไข ---------------- */}
      <AnimatePresence>
        {canManageSongs && showModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            
            <motion.form
              onSubmit={handleSave}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-xl font-extrabold text-slate-900">
                  {modalType === 'content' ? '✏️ แก้ไขข้อความส่วนหัวหน้า' : 
                   modalType === 'editBanners' ? '✏️ แก้ไขข้อความแบนเนอร์' : 
                   (editingItem ? '✏️ แก้ไขข้อมูลบทเพลง' : '✨ เพิ่มบทเพลงใหม่')}
                </h3>
                <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
              </div>

              {/* โหมด: แก้ไขข้อความส่วนหัว */}
              {modalType === 'content' ? (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">หัวข้อหน้าเว็บ</label>
                    <input type="text" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">คำอธิบายใต้หัวข้อ (บรรทัดที่ 1)</label>
                    <input type="text" value={formData.subtitle || ''} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">คำอธิบาย (บรรทัดที่ 2)</label>
                    <textarea rows="3" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:border-purple-500"></textarea>
                  </div>
                </div>
              ) : 
              /* โหมด: แก้ไขข้อความแบนเนอร์ */
              modalType === 'editBanners' ? (
                <div className="grid grid-cols-1 gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">แบนเนอร์ส่วนมหาวิทยาลัย</label>
                    <input type="text" value={formData.sec_uni_title || ''} onChange={(e) => setFormData({...formData, sec_uni_title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">แบนเนอร์ส่วนคณะ</label>
                    <input type="text" value={formData.sec_fac_title || ''} onChange={(e) => setFormData({...formData, sec_fac_title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                  </div>
                </div>
              ) : (
              /* โหมด: จัดการการ์ดเพลง */
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600">หมวดหมู่</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full mt-1 p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500">
                        <option value="university">บทเพลงมหาวิทยาลัย</option>
                        <option value="faculty">บทเพลงประจำคณะ</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600">ลำดับการแสดงผล</label>
                      <input type="number" required value={formData.sort_order || 1} onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })} className="w-full mt-1 p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600">ชื่อเพลง *</label>
                    <input type="text" required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="เช่น เพลงลูกพระจอม" className="w-full mt-1 p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600">เนื้อเพลง (กด Enter เพื่อขึ้นบรรทัดใหม่)</label>
                    <textarea required rows="8" value={formData.lyrics || ''} onChange={e => setFormData({...formData, lyrics: e.target.value})} placeholder="วางเนื้อเพลงที่นี่..." className="w-full mt-1 p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500" />
                  </div>

                  <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
                    <label className="block text-sm font-bold text-slate-700 mb-2">โลโก้เพลง (อัปโหลด หรือ วางลิงก์รูป)</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                    {isUploading && <p className="text-sm text-purple-600 mt-2 animate-pulse">กำลังอัปโหลดรูปภาพ...</p>}
                    
                    <div className="mt-3">
                      <input type="url" value={formData.image_url || ''} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="URL ของรูป (ถ้ามี)" className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-500" />
                    </div>

                    {formData.image_url && (
                      <div className="mt-3 pt-3 border-t border-slate-200 flex justify-center">
                        <img src={formData.image_url} alt="Preview" className="h-16 w-16 object-contain rounded-full shadow-sm bg-white p-1" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
                <button type="button" onClick={() => setShowModal(false)} disabled={submitting || isUploading} className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">ยกเลิก</button>
                <button type="submit" disabled={submitting || isUploading} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-50 transition-colors flex items-center gap-2">
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