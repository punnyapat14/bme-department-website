import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 📌 ดึง Component แสงออโรร่าและแบนเนอร์มาจากไฟล์ส่วนกลาง
import { AuroraBackground, SectionBanner } from '../../components/ThemeElements';

// 📌 ดึงข้อมูลผู้ใช้จาก AuthContext เพื่อตรวจสอบสิทธิ์แอดมิน/อาจารย์
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient'; // นำเข้า supabase client

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

// Form ดั้งเดิมแบบว่างเปล่า
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

// จัดการ URL รูปภาพกรณีนำมาจาก Google Drive
const formatImageUrl = (url) => {
  if (!url) return '';
  const trimmed = String(url).trim();
  const driveMatch =
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }
  return trimmed;
};

// ==========================================
// 📌 Component หลัก
// ==========================================
export default function Personnel() {
  const { user } = useAuth();
  
  const [personnelList, setPersonnelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // โหมดจัดการข้อมูล (Modal)
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // ใช้เก็บข้อมูลที่กำลังแก้ไข (ถ้ามี)
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // 🔒 ตรวจสอบสิทธิ์
  const canManagePersonnel = Boolean(
    user && (
      ['admin', 'faculty', 'teacher', 'staff', 'instructor'].includes(String(user.role || '').toLowerCase()) ||
      user.isAdmin === true ||
      String(user.email || '').endsWith('@sci.kmutnb.ac.th') ||
      String(user.email || '').toLowerCase() === 'bme.kmutnb.th@gmail.com'
    )
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPersonnelData();
  }, []);

  // 📌 ฟังก์ชันดึงข้อมูลจาก Supabase
  const fetchPersonnelData = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('personnel_content')
        .select('*')
        .order('sort_order', { ascending: true }); // เรียงลำดับตาม sort_order

      if (error) throw error;
      if (data) setPersonnelList(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('ไม่สามารถโหลดข้อมูลบุคลากรได้ในขณะนี้');
    } finally {
      setLoading(false);
    }
  };

  // 📌 เปิด Modal (แยกเคสว่าเปิดเพื่อเพิ่ม หรือเปิดเพื่อแก้ไข)
  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item); // โหลดข้อมูลเดิมใส่ Form
    } else {
      setEditingItem(null);
      setFormData({ ...EMPTY_FORM, category: 'faculty' }); // ล้าง Form
    }
    setShowModal(true);
  };

  // 📌 ฟังก์ชันบันทึกข้อมูลลง Supabase (เพิ่มใหม่ หรือ อัปเดต)
  const handleSavePersonnel = async (e) => {
    e.preventDefault();
    if (!canManagePersonnel) return;
    if (!formData.name_th.trim()) return alert('กรุณากรอกชื่อ-นามสกุล (ภาษาไทย)');

    try {
      setSubmitting(true);
      
      // จัดเตรียมข้อมูลก่อนบันทึก
      const payload = {
        category: formData.category,
        name_th: formData.name_th,
        name_en: formData.name_en,
        position: formData.position,
        education: formData.education,
        email: formData.email,
        phone: formData.phone,
        image_url: formData.image_url,
        portfolio_url: formData.portfolio_url,
        scholar_url: formData.scholar_url,
        sort_order: Number(formData.sort_order)
      };

      if (editingItem && editingItem.id) {
        // อัปเดตข้อมูลเก่า
        await supabase.from('personnel_content').update(payload).eq('id', editingItem.id);
      } else {
        // เพิ่มข้อมูลใหม่
        await supabase.from('personnel_content').insert([payload]);
      }

      setShowModal(false);
      await fetchPersonnelData(); // โหลดข้อมูลใหม่
    } catch (err) {
      console.error('Submit error:', err);
      alert('บันทึกข้อมูลไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  // 📌 ฟังก์ชันลบข้อมูล
  const handleDeletePersonnel = async (item) => {
    if (!canManagePersonnel || !window.confirm(`ยืนยันการลบข้อมูลของ ${item.name_th}?`)) return;
    
    try {
      await supabase.from('personnel_content').delete().eq('id', item.id);
      await fetchPersonnelData();
    } catch (err) {
      console.error('Delete error:', err);
      alert('ลบข้อมูลไม่สำเร็จ');
    }
  };

  // แยกหมวดหมู่อาจารย์ และ ฝ่ายสนับสนุน โดยใช้ useMemo เพื่อประสิทธิภาพ
  const { facultyMembers, supportStaff } = useMemo(() => {
    return {
      facultyMembers: personnelList.filter(p => p.category === 'faculty'),
      supportStaff: personnelList.filter(p => p.category === 'support')
    };
  }, [personnelList]);

  // ตัวแปรสไตล์
  const personCardGlass = "rounded-[2rem] bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(147,51,234,0.08)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden";
  const sectionWrapperGlass = "rounded-[2.5rem] md:rounded-[3rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-sm p-6 sm:p-8 md:p-12 mb-16";

  // Component สำหรับเรนเดอร์การ์ดบุคลากรแต่ละคน
  const renderPersonCard = (person, idx) => (
    <FadeInSection key={person.id} delay={`${(idx % 3) * 0.1}s`} className="h-full">
      <div className={`group flex flex-col overflow-hidden h-full ${personCardGlass} relative`}>

        {/* 🔒 ปุ่มจัดการแก้ไข/ลบ (แสดงเฉพาะตอน Admin Hover) */}
        {canManagePersonnel && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex gap-2 z-20 transition-opacity duration-300">
            <button onClick={() => openModal(person)} className="text-[10px] bg-white text-purple-700 px-3 py-1.5 rounded-lg font-bold shadow-md hover:bg-purple-50">แก้ไข</button>
            <button onClick={() => handleDeletePersonnel(person)} className="text-[10px] bg-white text-rose-600 px-3 py-1.5 rounded-lg font-bold shadow-md hover:bg-rose-50">ลบ</button>
          </div>
        )}

        {/* รูปภาพ หรือ ไอคอน */}
        <div className="relative w-full h-72 md:h-[340px] bg-slate-100 overflow-hidden border-b border-slate-100">
          {person.image_url ? (
            <img
              src={formatImageUrl(person.image_url)}
              alt={person.name_en || person.name_th}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-slate-200">
              <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
            </div>
          )}
          <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-white/90 to-transparent"></div>
        </div>

        {/* ข้อมูลบุคลากร */}
        <div className="flex flex-col flex-1 p-6 md:p-8 bg-white/50">
          <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{person.name_th}</h3>
          {person.name_en && (
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1 mb-3">{person.name_en}</p>
          )}
          {person.position && (
            <p className="text-[13px] font-bold text-purple-700 mb-4 bg-purple-50 inline-block self-start px-3 py-1 rounded-full">
              {person.position}
            </p>
          )}

          {/* อีเมล & เบอร์โทรศัพท์ */}
          {(person.email || person.phone) && (
            <div className="flex flex-col gap-2.5 mb-5">
              {person.email && (
                <a href={`mailto:${person.email}`} className="inline-flex items-center gap-2.5 text-[13px] font-medium text-slate-600 hover:text-purple-700 transition-colors break-all">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                  </div>
                  {person.email}
                </a>
              )}
              {person.phone && (
                <a href={`tel:${person.phone}`} className="inline-flex items-center gap-2.5 text-[13px] font-medium text-slate-600 hover:text-purple-700 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  {person.phone}
                </a>
              )}
            </div>
          )}

          {/* ประวัติการศึกษา */}
          {person.education && (
            <p className="text-[13px] font-medium text-slate-600 leading-relaxed mb-6 flex-1">
              <span className="font-bold text-slate-800 block mb-1">สำเร็จการศึกษาจาก:</span>
              {person.education}
            </p>
          )}

          {/* ปุ่มลิงก์ผลงานวิชาการ / Google Scholar */}
          {(person.portfolio_url || person.scholar_url) && (
            <div className="flex gap-2 mt-auto w-full pt-4">
              {person.portfolio_url && (
                <a
                  href={person.portfolio_url} target="_blank" rel="noreferrer"
                  className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-2.5 px-3 rounded-xl text-center font-bold text-[12px] shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                  ผลงานวิชาการ
                </a>
              )}
              {person.scholar_url && (
                <a
                  href={person.scholar_url} target="_blank" rel="noreferrer"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-3 rounded-xl text-center font-bold text-[12px] shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                  Scholar
                </a>
              )}
            </div>
          )}
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
            <div className="text-center max-w-4xl mx-auto pt-2 pb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
                บุคลากรของสาขาวิชา
              </h1>
              <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
                สาขาวิชาวิศวกรรมชีวการแพทย์ <br />
                ภาควิชาฟิสิกส์อุตสาหกรรมและอุปกรณ์การแพทย์ คณะวิทยาศาสตร์ประยุกต์ <br className="hidden md:block" />
                มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
              </p>

              {/* 🔒 แสดงปุ่มเพิ่มข้อมูลเฉพาะแอดมินหรืออาจารย์ที่ล็อกอินแล้วเท่านั้น */}
              {canManagePersonnel && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => openModal()}
                    className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-slate-900 text-white hover:bg-purple-700 shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5"
                  >
                    + เพิ่มบุคลากรลงฐานข้อมูล
                  </button>
                </div>
              )}
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
                  <div className="mb-10 max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex-1 w-full"><SectionBanner text="อาจารย์ประจำสาขาวิชา" variant="website" /></div>
                  </div>

                  {facultyMembers.length === 0 ? (
                    <p className="text-center text-slate-500 py-10 font-medium">ยังไม่มีข้อมูลอาจารย์ประจำสาขาวิชาในฐานข้อมูล</p>
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
                  <div className="mb-10 max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex-1 w-full"><SectionBanner text="บุคลากรฝ่ายสนับสนุน" variant="calendar" /></div>
                  </div>

                  {supportStaff.length === 0 ? (
                    <p className="text-center text-slate-500 py-10 font-medium">ยังไม่มีข้อมูลบุคลากรฝ่ายสนับสนุนในฐานข้อมูล</p>
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
              onSubmit={handleSavePersonnel}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-xl font-extrabold text-slate-900">{editingItem ? 'แก้ไขข้อมูลบุคลากร' : 'เพิ่มข้อมูลบุคลากร'}</h3>
                <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600">ลำดับการแสดงผล (เรียงจากน้อยไปมาก)</label>
                  <input
                    type="number" required
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">หมวดหมู่</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  >
                    <option value="faculty">อาจารย์ประจำสาขาวิชา</option>
                    <option value="support">บุคลากรฝ่ายสนับสนุน</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">ตำแหน่ง</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="เช่น อาจารย์ประจำสาขาวิชา"
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600">ชื่อ-นามสกุล (ภาษาไทย) *</label>
                  <input
                    type="text" required
                    value={formData.name_th}
                    onChange={(e) => setFormData({ ...formData, name_th: e.target.value })}
                    placeholder="เช่น รศ.ดร. สุรพันธ์ ยิ้มมั่น"
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600">ชื่อ-นามสกุล (ภาษาอังกฤษ)</label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="เช่น ASSOC.PROF. DR. SURAPUN YIMMAN"
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">อีเมล</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@sci.kmutnb.ac.th"
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="เช่น 02-555-2000 ต่อ 4612"
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600">ประวัติการศึกษา</label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="เช่น วศ.ด. (วิศวกรรมไฟฟ้า) สจล."
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600">ลิงก์รูปภาพ (Image URL)</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">ลิงก์ผลงานวิชาการ</label>
                  <input
                    type="url"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">ลิงก์ Google Scholar</label>
                  <input
                    type="url"
                    value={formData.scholar_url}
                    onChange={(e) => setFormData({ ...formData, scholar_url: e.target.value })}
                    placeholder="https://scholar.google.com/..."
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200">ยกเลิก</button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-50">
                  {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}