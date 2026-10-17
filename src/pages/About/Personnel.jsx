import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 📌 ดึง Component แสงออโรร่าและแบนเนอร์มาจากไฟล์ส่วนกลาง
import { AuroraBackground, SectionBanner } from '../../components/ThemeElements';

// 📌 ดึงข้อมูลผู้ใช้จาก AuthContext
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
    }, { threshold: 0.1 });
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
      style={{ transitionDelay: delay }}
    >
      {children}
    </div>
  );
};

// ==========================================
// 📌 ปุ่มแก้ไข (Edit / Delete) มาตรฐาน (แสดงตลอดเวลา ไม่ซ่อนแล้ว)
// ==========================================
const ActionButtons = ({ onEdit, onDelete, positionClass = "top-3 right-3" }) => (
  <div className={`absolute ${positionClass} flex gap-2 z-20`}>
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

// Form ดั้งเดิมแบบว่างเปล่าสำหรับการ์ดบุคลากร
const EMPTY_FORM = {
  id: '',
  category: 'faculty',
  name_th: '',
  name_en: '',
  position: 'อาจารย์ประจำสาขาวิชา',
  education: '',
  email: '',
  phone: '',
  image_url: '',
  portfolio_url: '',
  scholar_url: '',
  sort_order: 1
};

const formatImageUrl = (url) => {
  if (!url) return '';
  const trimmed = String(url).trim();
  const driveMatch =
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1000`;
  }
  return trimmed;
};

// ==========================================
// 📌 Component หลัก
// ==========================================
export default function Personnel() {
  const { user } = useAuth();
  
  // State เก็บข้อมูล
  const [pageContent, setPageContent] = useState({ title: '', subtitle: '', description: '' });
  const [personnelList, setPersonnelList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State สำหรับโหมดจัดการข้อมูล (Modal)
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('personnel'); 
  const [editingItem, setEditingItem] = useState(null); 
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // 🔒 ตรวจสอบสิทธิ์
  const canManagePersonnel = Boolean(
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
    fetchPersonnelData();
  }, []);

  const fetchPersonnelData = async () => {
    try {
      setLoading(true);
      setError('');

      const { data: contentData, error: contentError } = await supabase
        .from('personnel_page_content')
        .select('*')
        .eq('id', 1)
        .single();
      if (contentData) setPageContent(contentData);

      const { data: listData, error: listError } = await supabase
        .from('personnel_content')
        .select('*')
        .order('sort_order', { ascending: true });

      if (listError) throw listError;
      if (listData) setPersonnelList(listData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('ไม่สามารถโหลดข้อมูลได้ในขณะนี้');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null, type = 'personnel') => {
    setModalType(type);
    
    if (type === 'content') {
      setFormData(pageContent);
    } else if (type === 'editBanners') {
      // 📌 เปิดหน้าต่างฟอร์มเพื่อแก้ชื่อแบนเนอร์
      setFormData({
        ...pageContent,
        sec_faculty_title: pageContent.sec_faculty_title || 'อาจารย์ประจำสาขาวิชา',
        sec_support_title: pageContent.sec_support_title || 'บุคลากรฝ่ายสนับสนุน'
      });
    } else {
      if (item && typeof item === 'object') {
        setEditingItem(item);
        setFormData(item);
      } else {
        setEditingItem(null);
        // หากเป็นการเพิ่มใหม่ สามารถส่ง category มาทาง item ได้
        setFormData({ ...EMPTY_FORM, category: typeof item === 'string' ? item : 'faculty' });
      }
    }
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `personnel-images/${fileName}`; 

    try {
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setFormData({ ...formData, image_url: data.publicUrl });
    } catch (error) {
      alert('อัปโหลดรูปภาพไม่สำเร็จ');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!canManagePersonnel) return;

    try {
      setSubmitting(true);
      
      // 1. บันทึกข้อมูลข้อความส่วนหัว และ ข้อความแบนเนอร์
      if (modalType === 'content' || modalType === 'editBanners') {
        const payload = {
          id: 1,
          title: formData.title || pageContent.title || '',
          subtitle: formData.subtitle || pageContent.subtitle || '',
          description: formData.description || pageContent.description || '',
          sec_faculty_title: formData.sec_faculty_title || pageContent.sec_faculty_title || 'อาจารย์ประจำสาขาวิชา',
          sec_support_title: formData.sec_support_title || pageContent.sec_support_title || 'บุคลากรฝ่ายสนับสนุน'
        };

        const { data, error } = await supabase
          .from('personnel_page_content')
          .upsert(payload, { onConflict: 'id' })
          .select();

        if (error) throw error;
        if (data && data.length > 0) setPageContent(data[0]);

      // 2. บันทึกข้อมูลการ์ดบุคลากร
      } else {
        if (!formData.name_th.trim()) {
          alert('กรุณากรอกชื่อ-นามสกุล (ภาษาไทย)');
          setSubmitting(false);
          return;
        }
        
        const payload = {
          category: formData.category,
          name_th: formData.name_th,
          name_en: formData.name_en || '',
          position: formData.position || '',
          education: formData.education || '',
          email: formData.email || '',
          phone: formData.phone || '',
          image_url: formData.image_url || '',
          portfolio_url: formData.portfolio_url || '',
          scholar_url: formData.scholar_url || '',
          sort_order: Number(formData.sort_order || 1)
        };

        if (editingItem && editingItem.id) {
          const { error } = await supabase.from('personnel_content').update(payload).eq('id', editingItem.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('personnel_content').insert([payload]);
          if (error) throw error;
        }
      }

      setShowModal(false);
      await fetchPersonnelData(); 
    } catch (err) {
      console.error('Submit error:', err);
      alert('บันทึกข้อมูลไม่สำเร็จ: ' + (err.message || 'กรุณาตรวจสอบสิทธิ์การใช้งาน'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePersonnel = async (item) => {
    if (!canManagePersonnel || !window.confirm(`ยืนยันการลบข้อมูลของ ${item.name_th}? ข้อมูลจะถูกลบถาวร`)) return;
    try {
      const { error } = await supabase.from('personnel_content').delete().eq('id', item.id);
      if (error) throw error;
      await fetchPersonnelData();
    } catch (err) {
      console.error('Delete error:', err);
      alert('ลบข้อมูลไม่สำเร็จ: ' + err.message);
    }
  };

  const { facultyMembers, supportStaff } = useMemo(() => {
    return {
      facultyMembers: personnelList.filter(p => p.category === 'faculty'),
      supportStaff: personnelList.filter(p => p.category === 'support')
    };
  }, [personnelList]);

  const personCardGlass = "rounded-[2rem] bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(147,51,234,0.08)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden";
  const sectionWrapperGlass = "rounded-[2.5rem] md:rounded-[3rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-sm p-6 sm:p-8 md:p-12 mb-16";

  const renderPersonCard = (person, idx) => (
    <FadeInSection key={person.id} delay={`${(idx % 3) * 0.1}s`} className="h-full">
      <div className={`group flex flex-col overflow-hidden h-full ${personCardGlass} relative`}>
        
        {/* 📌 เปลี่ยนมาใช้ปุ่ม ActionButtons ที่แสดงถาวร (ไม่มี opacity-0 แล้ว) */}
        {canManagePersonnel && (
          <ActionButtons onEdit={() => openModal(person, 'personnel')} onDelete={() => handleDeletePersonnel(person)} />
        )}

        <div className="relative w-full h-72 md:h-[340px] bg-slate-100 overflow-hidden border-b border-slate-100">
          {person.image_url ? (
            <img src={formatImageUrl(person.image_url)} alt={person.name_en || person.name_th} referrerPolicy="no-referrer" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-slate-200"><svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg></div>
          )}
          <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-white/90 to-transparent"></div>
        </div>
        <div className="flex flex-col flex-1 p-6 md:p-8 bg-white/50">
          <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{person.name_th}</h3>
          {person.name_en && <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1 mb-3">{person.name_en}</p>}
          {person.position && <p className="text-[13px] font-bold text-purple-700 mb-4 bg-purple-50 inline-block self-start px-3 py-1 rounded-full">{person.position}</p>}
          {(person.email || person.phone) && (
            <div className="flex flex-col gap-2.5 mb-5">
              {person.email && <a href={`mailto:${person.email}`} className="inline-flex items-center gap-2.5 text-[13px] font-medium text-slate-600 hover:text-purple-700 break-all"><div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg></div>{person.email}</a>}
              {person.phone && <a href={`tel:${person.phone}`} className="inline-flex items-center gap-2.5 text-[13px] font-medium text-slate-600 hover:text-purple-700"><div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></div>{person.phone}</a>}
            </div>
          )}
          {person.education && <p className="text-[13px] font-medium text-slate-600 leading-relaxed mb-6 flex-1"><span className="font-bold text-slate-800 block mb-1">สำเร็จการศึกษาจาก:</span>{person.education}</p>}
        </div>
      </div>
    </FadeInSection>
  );

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <section>
          {/* ---------------- Header Section ---------------- */}
          <FadeInSection delay="0.1s">
            <div className="relative text-center max-w-4xl mx-auto pt-2 pb-12 rounded-3xl transition-colors duration-300">
              
              {/* 🔒 ปุ่มแก้ไขส่วนหัวมาตรฐาน */}
              {canManagePersonnel && (
                <ActionButtons onEdit={() => openModal(null, 'content')} positionClass="-top-4 right-0 md:-right-8" />
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm px-6">
                {pageContent.title || "บุคลากรของสาขาวิชา"}
              </h1>
              {/* 📌 รองรับการใช้ Enter ขึ้นบรรทัดใหม่ด้วย whitespace-pre-line */}
              <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl px-6 whitespace-pre-line">
                {pageContent.subtitle ? pageContent.subtitle + '\n' : "สาขาวิชาวิศวกรรมชีวการแพทย์\n"}
                {pageContent.description || "ภาควิชาฟิสิกส์อุตสาหกรรมและอุปกรณ์การแพทย์ คณะวิทยาศาสตร์ประยุกต์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ"}
              </p>
            </div>
          </FadeInSection>

          {/* ---------------- สถานะ Loading / Error ---------------- */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-[2rem] bg-white/70 border border-slate-100 p-6 h-[480px] animate-pulse flex flex-col">
                  <div className="w-full h-64 bg-slate-200 rounded-2xl mb-6"></div>
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
                  <div className="h-16 bg-slate-200 rounded w-full mt-auto"></div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="max-w-2xl mx-auto mb-12 p-6 rounded-3xl bg-amber-50 border border-amber-200 text-center">
              <p className="font-bold text-amber-800">{error}</p>
            </div>
          )}

          {/* ---------------- การ์ดใหญ่ที่ 1: อาจารย์ประจำสาขาวิชา ---------------- */}
          {!loading && !error && (
            <>
              <FadeInSection delay="0.2s">
                <div className={sectionWrapperGlass}>
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 max-w-4xl mx-auto">
                    
                    {/* แบนเนอร์ + ปุ่มแก้ไข */}
                    <div className="flex-1 w-full flex items-center gap-2">
                      <div className="flex-1"><SectionBanner text={pageContent.sec_faculty_title || 'อาจารย์ประจำสาขาวิชา'} variant="website" /></div>
                      {canManagePersonnel && (
                        <button onClick={() => openModal(null, 'editBanners')} title="แก้ไขข้อความแบนเนอร์" className="p-2.5 bg-slate-100/80 text-slate-500 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition shadow-sm border border-slate-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                      )}
                    </div>

                    {/* ปุ่มเพิ่มข้อมูล */}
                    {canManagePersonnel && (
                      <button onClick={() => openModal('faculty', 'personnel')} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow hover:bg-purple-700 shrink-0">
                        + เพิ่มบุคลากร
                      </button>
                    )}
                  </div>

                  {facultyMembers.length === 0 ? (
                    <p className="text-center text-slate-500 py-10 font-medium">ยังไม่มีข้อมูลในฐานข้อมูล</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {facultyMembers.map((person, idx) => renderPersonCard(person, idx))}
                    </div>
                  )}
                </div>
              </FadeInSection>

              {/* ---------------- การ์ดใหญ่ที่ 2: ฝ่ายสนับสนุน ---------------- */}
              <FadeInSection delay="0.3s">
                <div className={sectionWrapperGlass}>
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 max-w-4xl mx-auto">
                    
                    {/* แบนเนอร์ + ปุ่มแก้ไข */}
                    <div className="flex-1 w-full flex items-center gap-2">
                      <div className="flex-1"><SectionBanner text={pageContent.sec_support_title || 'บุคลากรฝ่ายสนับสนุน'} variant="calendar" /></div>
                      {canManagePersonnel && (
                        <button onClick={() => openModal(null, 'editBanners')} title="แก้ไขข้อความแบนเนอร์" className="p-2.5 bg-slate-100/80 text-slate-500 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition shadow-sm border border-slate-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                      )}
                    </div>

                    {/* ปุ่มเพิ่มข้อมูล */}
                    {canManagePersonnel && (
                      <button onClick={() => openModal('support', 'personnel')} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow hover:bg-purple-700 shrink-0">
                        + เพิ่มบุคลากร
                      </button>
                    )}
                  </div>

                  {supportStaff.length === 0 ? (
                    <p className="text-center text-slate-500 py-10 font-medium">ยังไม่มีข้อมูลในฐานข้อมูล</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {supportStaff.map((person, idx) => renderPersonCard(person, idx))}
                    </div>
                  )}
                </div>
              </FadeInSection>
            </>
          )}

        </section>
      </div>

      {/* ---------------- Modal ฟอร์มเพิ่ม/แก้ไข ---------------- */}
      <AnimatePresence>
        {canManagePersonnel && showModal && (
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
                  {modalType === 'content' ? '✏️ แก้ไขข้อความส่วนหัว' : 
                   modalType === 'editBanners' ? '✏️ แก้ไขข้อความแบนเนอร์' : 
                   (editingItem ? '✏️ แก้ไขข้อมูลบุคลากร' : '✨ เพิ่มข้อมูลบุคลากร')}
                </h3>
                <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
              </div>

              {/* ---------------- โหมด: แก้ไขข้อความส่วนหัว ---------------- */}
              {modalType === 'content' ? (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">หัวข้อหลัก (Title)</label>
                    <input type="text" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">พาดหัวย่อย (Subtitle)</label>
                    <input type="text" value={formData.subtitle || ''} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">คำอธิบาย (Description)</label>
                    <textarea rows="3" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:border-purple-500"></textarea>
                  </div>
                </div>
              ) : 
              /* ---------------- โหมด: แก้ไขข้อความแบนเนอร์ ---------------- */
              modalType === 'editBanners' ? (
                <div className="grid grid-cols-1 gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">แบนเนอร์ส่วนอาจารย์</label>
                    <input type="text" value={formData.sec_faculty_title || ''} onChange={(e) => setFormData({...formData, sec_faculty_title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">แบนเนอร์ส่วนฝ่ายสนับสนุน</label>
                    <input type="text" value={formData.sec_support_title || ''} onChange={(e) => setFormData({...formData, sec_support_title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
                  </div>
                </div>
              ) : (
              /* ---------------- โหมด: จัดการการ์ดบุคลากร ---------------- */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-600">ลำดับการแสดงผล (เรียงจากน้อยไปมาก)</label>
                    <input type="number" required value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">หมวดหมู่</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-500">
                      <option value="faculty">อาจารย์ประจำสาขาวิชา</option>
                      <option value="support">บุคลากรฝ่ายสนับสนุน</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">ตำแหน่ง</label>
                    <input type="text" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} placeholder="เช่น อาจารย์ประจำสาขาวิชา" className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-600">ชื่อ-นามสกุล (ภาษาไทย) *</label>
                    <input type="text" required value={formData.name_th} onChange={(e) => setFormData({ ...formData, name_th: e.target.value })} placeholder="เช่น รศ.ดร. สุรพันธ์ ยิ้มมั่น" className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-600">ชื่อ-นามสกุล (ภาษาอังกฤษ)</label>
                    <input type="text" value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} placeholder="เช่น ASSOC.PROF. DR. SURAPUN YIMMAN" className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">อีเมล</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="example@sci.kmutnb.ac.th" className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">เบอร์โทรศัพท์</label>
                    <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="เช่น 02-555-2000 ต่อ 4612" className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-600">ประวัติการศึกษา</label>
                    <input type="text" value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })} placeholder="เช่น วศ.ด. (วิศวกรรมไฟฟ้า) สจล." className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-500" />
                  </div>

                  <div className="sm:col-span-2 border border-slate-200 p-4 rounded-xl bg-slate-50">
                    <label className="block text-sm font-bold text-slate-700 mb-2">อัปโหลดรูปภาพ (Supabase Storage)</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                    {isUploading && <p className="text-sm text-purple-600 mt-2 animate-pulse">กำลังอัปโหลดรูปภาพ...</p>}
                    
                    <div className="mt-3">
                      <label className="text-xs font-bold text-slate-600">หรือวางลิงก์รูปภาพ (Image URL)</label>
                      <input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-500" />
                    </div>

                    {formData.image_url && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-xs text-slate-400 mb-1">รูปภาพปัจจุบัน:</p>
                        <img src={formatImageUrl(formData.image_url)} alt="Preview" className="h-32 w-auto object-cover rounded-lg border border-slate-200" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600">ลิงก์ผลงานวิชาการ</label>
                    <input type="url" value={formData.portfolio_url} onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })} placeholder="https://..." className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">ลิงก์ Google Scholar</label>
                    <input type="url" value={formData.scholar_url} onChange={(e) => setFormData({ ...formData, scholar_url: e.target.value })} placeholder="https://scholar.google.com/..." className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-500" />
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