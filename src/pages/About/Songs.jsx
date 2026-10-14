import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground, SectionBanner } from '../../components/ThemeElements';
import { useAuth } from '../../contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';

// รูปภาพเริ่มต้น (Fallback)
import imgKmutnbSeal from '../../assets/Symbol/KMUTNB_Logo.png';
import imgAppliedScience from '../../assets/Symbol/AppliedScience_Logo.png';

// การเชื่อมต่อ Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const EMPTY_FORM = { id: null, category: 'university', title: '', lyrics: '', image_url: '' }; 

// 🛠️ Helper: จัดการรูปภาพ
const getIconImage = (url, category) => {
  if (url && url.trim() !== "") return url.trim();
  if (category === 'faculty') return imgAppliedScience;
  return imgKmutnbSeal;
};

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
// 📌 Component: การ์ดเนื้อเพลง
// ==========================================
const SongCard = ({ item, canManage, onEdit, onDelete }) => {
  const iconImg = getIconImage(item.image_url, item.category);
  const lyrics = item.lyrics || '';

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="break-inside-avoid mb-8 rounded-[2rem] bg-white border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(14,165,233,0.15)] relative overflow-hidden group"
    >
      <CardCloudDecoration />
      <BirdFlock />
      
      <div className="p-8 relative z-20">
        {canManage && (
          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-30 bg-white/50 backdrop-blur-sm p-2 rounded-bl-2xl">
            <button onClick={() => onEdit(item)} className="text-[10px] text-purple-600 font-bold bg-white px-2 py-1 rounded shadow-sm">แก้ไข</button>
            <button onClick={() => onDelete(item)} className="text-[10px] text-rose-600 font-bold bg-white px-2 py-1 rounded shadow-sm">ลบ</button>
          </div>
        )}

        <div className="flex flex-col items-center pb-6 mb-6 relative">
          <div className="absolute bottom-0 w-32 h-[1px] bg-gradient-to-r from-transparent via-sky-300 to-transparent"></div>
          <div className="w-16 h-16 rounded-full bg-white shadow-md border border-slate-100 p-1 mb-4 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
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

// ==========================================
// 📌 Main Component
// ==========================================
export default function Songs() {
  const { user } = useAuth();
  
  const [items, setItems] = useState([]);
  const [pageSettings, setPageSettings] = useState({ title: 'บทเพลงประจำสถาบัน', subtitle: 'ศูนย์รวมเนื้อเพลงประจำมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ และคณะวิทยาศาสตร์ประยุกต์' });
  const [loading, setLoading] = useState(true);

  // States สำหรับ Modal เพลง
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [uploadFile, setUploadFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // States สำหรับ Modal แก้ไขหัวข้อเว็บ
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsData, setSettingsData] = useState({ title: '', subtitle: '' });

  const canManage = Boolean(
    user && (['admin', 'faculty', 'teacher', 'staff'].includes(String(user.role || '').toLowerCase()) || user.isAdmin === true || String(user.email || '').endsWith('@sci.kmutnb.ac.th'))
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. ดึงข้อความหัวเว็บ (ใช้ maybeSingle จะไม่เกิด Error 406 แม้ไม่มีข้อมูล)
      const { data: settings } = await supabase.from('page_settings').select('*').eq('id', 'songs_page').maybeSingle();
      if (settings) {
        setPageSettings(settings);
      }

      // 2. ดึงข้อมูลเพลงทั้งหมด
      const { data: songsData, error: songsError } = await supabase.from('songs').select('*').order('created_at', { ascending: true });
      
      if (songsError) {
        console.error('Error fetching songs:', songsError.message);
      } else {
        setItems(songsData || []);
      }

    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- จัดการหัวเว็บ (Page Settings) ---
  const openSettingsModal = () => {
    setSettingsData({ title: pageSettings.title, subtitle: pageSettings.subtitle });
    setShowSettingsModal(true);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!canManage) return;
    try {
      setSubmitting(true);
      await supabase.from('page_settings').upsert({
        id: 'songs_page',
        title: settingsData.title,
        subtitle: settingsData.subtitle
      });
      setShowSettingsModal(false);
      await fetchData();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า');
    } finally {
      setSubmitting(false);
    }
  };

  // --- จัดการเพลง (Songs) ---
  const openModal = (category, item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ ...EMPTY_FORM, category });
    }
    setUploadFile(null);
    setShowModal(true);
  };

  const handleSaveSong = async (e) => {
    e.preventDefault();
    if (!canManage) return;
    try {
      setSubmitting(true);
      let finalImageUrl = formData.image_url;

      // 🌟 อัปโหลดรูปลง Supabase
      if (uploadFile) {
        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `song_icon_${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
        const filePath = `songs/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('Songs').upload(filePath, uploadFile);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('Songs').getPublicUrl(filePath);
        finalImageUrl = publicUrlData.publicUrl;
      }

      const payload = {
        category: formData.category,
        title: formData.title,
        lyrics: formData.lyrics,
        image_url: finalImageUrl,
      };

      if (editingItem && editingItem.id) {
        // อัปเดตข้อมูล
        await supabase.from('songs').update(payload).eq('id', editingItem.id);
      } else {
        // สร้างใหม่
        await supabase.from('songs').insert([payload]);
      }

      setShowModal(false);
      setUploadFile(null);
      await fetchData();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูลเพลง');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSong = async (item) => {
    if (!canManage || !window.confirm(`ยืนยันการลบเพลง: ${item.title}?`)) return;
    try {
      await supabase.from('songs').delete().eq('id', item.id);
      await fetchData();
    } catch (err) {
      alert('ไม่สามารถลบได้');
    }
  };

  const universitySongs = items.filter(s => String(s.category || '').trim().toLowerCase() === 'university');
  const facultySongs = items.filter(s => String(s.category || '').trim().toLowerCase() === 'faculty');

  return (
    <div className="relative font-sans text-slate-900 min-h-screen pt-16 pb-32">
      <AuroraBackground />
      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">

        <FadeInSection delay="0.1s">
          <div className="relative text-center max-w-4xl mx-auto pt-2 pb-12 group">
            {canManage && (
              <button 
                onClick={openSettingsModal} 
                className="absolute -top-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-white text-purple-600 border border-purple-200 rounded-lg text-xs font-bold shadow-sm z-20"
              >
                ✏️ แก้ไขข้อความหัวเว็บ
              </button>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
              {pageSettings.title}
            </h1>
            <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
              {pageSettings.subtitle}
            </p>
          </div>
        </FadeInSection>

        {loading ? <div className="text-center text-slate-500 py-20">กำลังโหลดข้อมูล...</div> : (
          <>
            {/* บทเพลงมหาวิทยาลัย */}
            <div className="rounded-[3rem] bg-white/45 backdrop-blur-2xl border border-white/60 shadow-sm p-6 md:p-10 mb-16">
              <FadeInSection delay="0.2s">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 max-w-5xl mx-auto w-full">
                  <div className="flex-1 w-full"><SectionBanner text="บทเพลงมหาวิทยาลัย" variant="website" /></div>
                  {canManage && (
                    <button onClick={() => openModal('university')} className="px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow hover:bg-sky-600 shrink-0">
                      + เพิ่มเพลงมหาวิทยาลัย
                    </button>
                  )}
                </div>
                
                {universitySongs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto items-start">
                    {universitySongs.map(song => <SongCard key={song.id} item={song} canManage={canManage} onEdit={openModal} onDelete={handleDeleteSong} />)}
                  </div>
                ) : <p className="text-center text-slate-500 py-10">ยังไม่มีข้อมูลเพลงในหมวดหมู่นี้</p>}
              </FadeInSection>
            </div>

            {/* บทเพลงคณะ */}
            <div className="rounded-[3rem] bg-white/45 backdrop-blur-2xl border border-white/60 shadow-sm p-6 md:p-10 mb-16">
              <FadeInSection delay="0.3s">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 max-w-5xl mx-auto w-full">
                  <div className="flex-1 w-full"><SectionBanner text="บทเพลงประจำคณะ" variant="calendar" /></div>
                  {canManage && (
                    <button onClick={() => openModal('faculty')} className="px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow hover:bg-sky-600 shrink-0">
                      + เพิ่มเพลงคณะ
                    </button>
                  )}
                </div>
                
                {facultySongs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto items-start">
                    {facultySongs.map(song => <SongCard key={song.id} item={song} canManage={canManage} onEdit={openModal} onDelete={handleDeleteSong} />)}
                  </div>
                ) : <p className="text-center text-slate-500 py-10">ยังไม่มีข้อมูลเพลงในหมวดหมู่นี้</p>}
              </FadeInSection>
            </div>
          </>
        )}
      </div>

      {/* 🔒 Modal Form สำหรับจัดการข้อมูลเพลง */}
      <AnimatePresence>
        {canManage && showModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.form onSubmit={handleSaveSong} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative z-10 bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-100">
              <h3 className="text-xl font-extrabold text-slate-900 mb-4 pb-3 border-b">
                {editingItem ? 'แก้ไขข้อมูลบทเพลง' : 'เพิ่มบทเพลงใหม่'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold">หมวดหมู่</label>
                  <select className="w-full mt-1 p-2 border rounded-xl" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="university">บทเพลงมหาวิทยาลัย</option>
                    <option value="faculty">บทเพลงประจำคณะ</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold">ชื่อเพลง</label>
                  <input required className="w-full mt-1 p-2 border rounded-xl" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="เช่น เพลงลูกพระจอม" />
                </div>

                <div>
                  <label className="text-xs font-bold">เนื้อเพลง (กด Enter เพื่อขึ้นบรรทัดใหม่)</label>
                  <textarea required rows="10" className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.lyrics} onChange={e => setFormData({...formData, lyrics: e.target.value})} placeholder="วางเนื้อเพลงที่นี่..." />
                </div>

                <div>
                  <label className="text-xs font-bold">อัปโหลดโลโก้เพลง (เว้นว่างไว้เพื่อใช้โลโก้มาตรฐานตามหมวดหมู่)</label>
                  <input type="file" accept="image/*" className="w-full mt-1 p-2 border rounded-xl text-xs bg-slate-50 cursor-pointer" onChange={e => setUploadFile(e.target.files[0])} />
                  {editingItem && formData.image_url && !uploadFile && (
                    <p className="text-[10px] text-green-600 mt-1">✓ มีรูปโลโก้เฉพาะอยู่แล้ว (ไม่ต้องเลือกไฟล์ถ้าไม่ต้องการเปลี่ยน)</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 bg-slate-100">ยกเลิก</button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-sky-600 disabled:opacity-50">
                  {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* 🔒 Modal Form สำหรับจัดการข้อความหัวเว็บ */}
      <AnimatePresence>
        {canManage && showSettingsModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)} />
            <motion.form onSubmit={handleSaveSettings} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative z-10 bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-100">
              <h3 className="text-xl font-extrabold text-slate-900 mb-4 pb-3 border-b">
                ตั้งค่าข้อความหัวเว็บ
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold">หัวข้อหลัก (Title)</label>
                  <input required className="w-full mt-1 p-2 border rounded-xl" value={settingsData.title} onChange={e => setSettingsData({...settingsData, title: e.target.value})} />
                </div>

                <div>
                  <label className="text-xs font-bold">ข้อความบรรยาย (Subtitle)</label>
                  <textarea required rows="3" className="w-full mt-1 p-2 border rounded-xl text-sm" value={settingsData.subtitle} onChange={e => setSettingsData({...settingsData, subtitle: e.target.value})} />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowSettingsModal(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 bg-slate-100">ยกเลิก</button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-purple-600 disabled:opacity-50">
                  {submitting ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}