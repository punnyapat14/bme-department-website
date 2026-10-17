import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground, SectionBanner } from '../../components/ThemeElements';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient'; 

// 📌 รูปสัญลักษณ์ (สำหรับเป็น Fallback)
import imgKmutnbSeal from '../../assets/Symbol/KMUTNB_Logo.png';

const bentoGlass = 'rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden';
const EMPTY_FORM = { id: '', category: 'university', sub_category: 'symbol', title: '', subtitle: '', detail1: '', detail2: '', detail3: '', detail4: '', sort_order: 1 };

// 🛠️ Helper: ฟังก์ชันแปลงลิงก์รูป 
const parseImageUrl = (url, fallback = null) => {
  if (!url || url.trim() === "") return fallback;
  let parsedUrl = url.trim();

  if (parsedUrl.includes('drive.google.com/file/d/')) {
    const match = parsedUrl.match(/\/d\/(.*?)\//);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }
  }

  const isImageFile = /\.(png|jpe?g|gif|svg|webp)$/i.test(parsedUrl);

  if (!parsedUrl.startsWith('http') && isImageFile) {
    const { data } = supabase.storage.from('Symbols').getPublicUrl(parsedUrl);
    return data?.publicUrl || fallback;
  }

  return parsedUrl;
};

// ==========================================
// 📌 ปุ่มแก้ไข (Edit / Delete) 
// เอา Hover ออก เพื่อให้แอดมินมองเห็นปุ่มตลอดเวลา ป้องกันปุ่มหาย
// ==========================================
const ActionButtons = ({ onEdit, onDelete, positionClass = "top-3 right-3" }) => (
  <div className={`absolute ${positionClass} flex gap-2 z-20`}>
    <button type="button" onClick={onEdit} className="p-1.5 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
    </button>
    {onDelete && (
      <button type="button" onClick={onDelete} className="p-1.5 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    )}
  </div>
);

// ==========================================
// 📌 Component: การ์ดสัญลักษณ์ 
// ==========================================
const SymbolCard = ({ item, canManage, onEdit, onDelete }) => {
  const tag = item.subtitle;
  const title = item.title;
  const desc = item.detail1;
  const accent = item.detail2 || '#7B2FA0';
  const img = parseImageUrl(item.detail3, imgKmutnbSeal);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = img;
    link.download = `${tag}_Logo`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }} className="rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col relative h-full">
      <div className="h-1.5 w-full" style={{ backgroundColor: accent }}></div>
      <div className="p-6 flex flex-col items-center text-center flex-1 relative group/imgcontainer">
        <div className="relative w-full h-44 rounded-2xl bg-slate-50 shadow-inner flex items-center justify-center p-5 mb-5 overflow-hidden">
          <img src={img} alt={title} className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <button onClick={handleDownload} className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2.5 rounded-full font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              ดาวน์โหลดรูปภาพ
            </button>
          </div>
        </div>
        <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold mb-3 truncate max-w-full">{tag}</span>
        <h3 className="text-lg font-black text-slate-800 mb-2 leading-snug">{title}</h3>
        <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{desc}</p>

        {canManage && <ActionButtons onEdit={() => onEdit(item)} onDelete={() => onDelete(item)} positionClass="top-4 right-4" />}
      </div>
    </motion.div>
  );
};

// ==========================================
// 📌 Component: ตัวอย่างสี
// ==========================================
const ColorSwatch = ({ item, canManage, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const label = item.title;
  const name = item.detail1;
  const hex = item.detail2 || '#000000';
  const rgb = item.detail3;
  const cmyk = item.detail4;

  const copyHex = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { window.prompt('คัดลอกรหัสสี', hex); }
  };

  return (
    <div className="rounded-[2rem] bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full relative">
      <div className="h-28 flex items-end p-4 relative overflow-hidden" style={{ backgroundColor: hex }}>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <span className="relative z-10 px-3 py-1 rounded-full bg-white/90 text-[11px] font-black text-slate-800 shadow-sm truncate">{label}</span>
      </div>
      <div className="p-5 flex flex-col flex-1 relative">
        <p className="text-base font-black text-slate-800 mb-3">{name}</p>
        <dl className="space-y-1.5 text-xs font-medium text-slate-600 mb-4 flex-1">
          <div className="flex justify-between"><dt className="text-slate-400">HEX</dt><dd className="font-bold">{hex}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-400">RGB</dt><dd className="font-bold">{rgb}</dd></div>
          {cmyk && <div className="flex justify-between"><dt className="text-slate-400">CMYK</dt><dd className="font-bold">{cmyk}</dd></div>}
        </dl>
        <button onClick={copyHex} className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 shadow-sm hover:bg-slate-900 transition-all mt-auto">
          {copied ? 'คัดลอกสำเร็จแล้ว!' : 'คัดลอกรหัสสี HEX'}
        </button>
      </div>

      {canManage && <ActionButtons onEdit={() => onEdit(item)} onDelete={() => onDelete(item)} positionClass="top-3 right-3" />}
    </div>
  );
};

// ==========================================
// 📌 Component: กล่องข้อมูลสั้น (FactCard)
// ==========================================
const FactCard = ({ item, canManage, onEdit, onDelete }) => {
  const label = item.title;
  const value = item.subtitle;
  
  let rawIcon = item.detail1 || '📌';
  const icon = parseImageUrl(rawIcon, rawIcon);
  const bgImage = parseImageUrl(item.detail2); 
  const tone = item.detail3 || 'border-slate-100';

  const isImageIcon = typeof icon === 'string' && 
                      (icon.startsWith('http') || 
                       icon.includes('googleusercontent.com') ||
                       /\.(png|jpe?g|gif|svg|webp)$/i.test(icon)
                      );

  return (
    <motion.div whileHover={{ y: -5, scale: 1.02 }} className={`relative overflow-hidden rounded-[2rem] border border-white/60 p-6 shadow-sm bg-gradient-to-br ${tone} flex flex-col h-full group`}>
      {bgImage && (
        <>
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${bgImage})` }}></div>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] group-hover:bg-black/50 transition-colors duration-300"></div>
        </>
      )}

      {!bgImage && !isImageIcon && (
        <div className="absolute -right-4 -bottom-6 text-8xl opacity-10 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 pointer-events-none">
          {icon}
        </div>
      )}
      
      <div className="relative z-10 flex flex-col h-full">
        <div className={`${isImageIcon ? 'w-24 h-24 rounded-full' : 'w-14 h-14 rounded-[1rem]'} shrink-0 bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-3xl mb-5 group-hover:-translate-y-1 transition-transform duration-300 overflow-hidden border border-white/50`}>
          {isImageIcon ? <img src={icon} alt={label} className="w-full h-full object-cover" /> : icon}
        </div>
        <div className="flex-1 flex flex-col justify-end">
          <p className={`text-[12px] font-bold mb-1.5 uppercase tracking-wide truncate ${bgImage ? 'text-white/80' : 'text-slate-500'}`}>{label}</p>
          <p className={`text-xl lg:text-2xl font-black tracking-tight leading-tight drop-shadow-sm ${bgImage ? 'text-white' : 'text-slate-800'}`}>{value}</p>
        </div>
      </div>

      {canManage && <ActionButtons onEdit={() => onEdit(item)} onDelete={() => onDelete(item)} positionClass="top-4 right-4" />}
    </motion.div>
  );
};


// ==========================================
// 📌 Main Component
// ==========================================
export default function Symbols() {
  const { user } = useAuth();
  
  const [items, setItems] = useState([]);
  const [pageInfo, setPageInfo] = useState({}); 
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [bgUploadFile, setBgUploadFile] = useState(null);

  const canManage = Boolean(
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
      const [contentRes, infoRes] = await Promise.all([
        supabase.from('symbols_content').select('*').order('sort_order', { ascending: true }),
        supabase.from('symbols_page_info').select('*').eq('id', 1).single()
      ]);
        
      if (contentRes.error) throw contentRes.error;
      if (contentRes.data) setItems(contentRes.data);
      if (infoRes.data) setPageInfo(infoRes.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (categoryOrItem) => {
    setUploadFile(null);
    setBgUploadFile(null);

    if (categoryOrItem === 'pageHeader') {
      setEditingItem(null);
      setFormData({ ...pageInfo, category: 'pageHeader' });
    } else if (categoryOrItem === 'editBanners') {
      // 📌 แยกหมวดแก้ไขแบนเนอร์ออกมาโดยเฉพาะ
      setEditingItem(null);
      setFormData({ 
        ...pageInfo, 
        category: 'editBanners',
        sec_uni_title: pageInfo.sec_uni_title || 'สัญลักษณ์ระดับมหาวิทยาลัย',
        sec_fac_title: pageInfo.sec_fac_title || 'สัญลักษณ์ระดับคณะ',
        sec_dept_title: pageInfo.sec_dept_title || 'สัญลักษณ์ระดับภาควิชา',
        sec_bme_title: pageInfo.sec_bme_title || 'สัญลักษณ์ระดับสาขาวิชา'
      });
    } else if (categoryOrItem && typeof categoryOrItem === 'object') {
      setEditingItem(categoryOrItem);
      setFormData(categoryOrItem);
    } else {
      setEditingItem(null);
      setFormData({ ...EMPTY_FORM, category: categoryOrItem });
    }
    setShowModal(true);
  };

  const uploadImageToSupabase = async (file) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('Symbols').upload(fileName, file);
    if (uploadError) throw uploadError;
    return fileName; 
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!canManage) return;

    try {
      setSubmitting(true);
      
      // 📌 บันทึกข้อมูลส่วนหัวเว็บ หรือ ข้อมูลชื่อแบนเนอร์
      if (formData.category === 'pageHeader' || formData.category === 'editBanners') {
        const payload = {
          id: 1,
          header_title: formData.header_title || pageInfo.header_title,
          header_subtitle: formData.header_subtitle || pageInfo.header_subtitle,
          sec_uni_title: formData.sec_uni_title || pageInfo.sec_uni_title,
          sec_fac_title: formData.sec_fac_title || pageInfo.sec_fac_title,
          sec_dept_title: formData.sec_dept_title || pageInfo.sec_dept_title,
          sec_bme_title: formData.sec_bme_title || pageInfo.sec_bme_title,
        };
        
        const { data, error } = await supabase.from('symbols_page_info').upsert(payload, { onConflict: 'id' }).select();
        if (error) throw error;
        if (data && data.length > 0) setPageInfo(data[0]);
      } 
      // 📌 บันทึกข้อมูลการ์ดต่างๆ 
      else {
        let finalDetail1 = formData.detail1; 
        let finalDetail2 = formData.detail2; 
        let finalDetail3 = formData.detail3; 

        if (formData.sub_category === 'symbol') {
          if (uploadFile) {
            const uploadedName = await uploadImageToSupabase(uploadFile);
            if (uploadedName) finalDetail3 = uploadedName; 
          }
        } else if (formData.sub_category === 'fact') {
          if (uploadFile) {
            const uploadedName = await uploadImageToSupabase(uploadFile);
            if (uploadedName) finalDetail1 = uploadedName; 
          }
          if (bgUploadFile) {
            const uploadedName = await uploadImageToSupabase(bgUploadFile);
            if (uploadedName) finalDetail2 = uploadedName; 
          }
        }

        const payload = {
          category: formData.category,
          sub_category: formData.sub_category,
          title: formData.title,
          subtitle: formData.subtitle,
          detail1: finalDetail1,
          detail2: finalDetail2,
          detail3: finalDetail3,
          detail4: formData.detail4,
          sort_order: Number(formData.sort_order)
        };

        if (editingItem && editingItem.id) {
          const { error } = await supabase.from('symbols_content').update(payload).eq('id', editingItem.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('symbols_content').insert([payload]);
          if (error) throw error;
        }
      }

      setShowModal(false);
      await fetchData();
      
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (err.message || 'กรุณาตรวจสอบสิทธิ์ RLS'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!canManage || !window.confirm(`ยืนยันการลบ: ${item.title}?`)) return;
    try {
      const { error } = await supabase.from('symbols_content').delete().eq('id', item.id);
      if (error) throw error;
      await fetchData();
    } catch (err) {
      alert('ไม่สามารถลบได้: ' + err.message);
    }
  };

  const getSectionData = (category) => ({
    symbols: items.filter(i => String(i.category || '').trim().toLowerCase() === category && String(i.sub_category || '').trim().toLowerCase() === 'symbol'),
    colors: items.filter(i => String(i.category || '').trim().toLowerCase() === category && String(i.sub_category || '').trim().toLowerCase() === 'color'),
    facts: items.filter(i => String(i.category || '').trim().toLowerCase() === category && String(i.sub_category || '').trim().toLowerCase() === 'fact'),
  });

  const sections = [
    { key: 'university', title: pageInfo.sec_uni_title || 'สัญลักษณ์ระดับมหาวิทยาลัย', banner: 'website' },
    { key: 'faculty', title: pageInfo.sec_fac_title || 'สัญลักษณ์ระดับคณะ', banner: 'calendar' },
    { key: 'department', title: pageInfo.sec_dept_title || 'สัญลักษณ์ระดับภาควิชา', banner: 'exam' },
    { key: 'bme', title: pageInfo.sec_bme_title || 'สัญลักษณ์ระดับสาขาวิชา', banner: 'scholarship' }
  ];

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />
      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">

        {/* 🌟 หัวเว็บ */}
        <div className="relative group text-center max-w-4xl mx-auto pt-2 pb-10">
          {canManage && <ActionButtons onEdit={() => openModal('pageHeader')} positionClass="-top-4 right-0 md:-right-8" />}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
            {pageInfo.header_title || 'สัญลักษณ์และแบรนด์'}
          </h1>
          <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl whitespace-pre-line">
            {pageInfo.header_subtitle || 'ตรา สี และสัญลักษณ์ประจำมหาวิทยาลัย คณะ ภาควิชา และสาขาวิชาวิศวกรรมชีวการแพทย์'}
          </p>
        </div>

        {loading ? <div className="text-center text-slate-500 py-20">กำลังโหลดข้อมูล...</div> : 
          sections.map(sec => {
            const data = getSectionData(sec.key);
            const gridCols = sec.key === 'bme' ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3';

            return (
              <div key={sec.key} className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
                
                {/* 📌 ส่วนหัวแต่ละ Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                  <div className="flex-1 w-full flex items-center gap-2">
                    <div className="flex-1"><SectionBanner text={sec.title} variant={sec.banner} /></div>
                    
                    {/* 📌 ปุ่มแก้ชื่อแบนเนอร์ (ติดกับแบนเนอร์) */}
                    {canManage && (
                      <button onClick={() => openModal('editBanners')} title="แก้ไขข้อความแบนเนอร์" className="p-2.5 bg-slate-100/80 text-slate-500 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition shadow-sm border border-slate-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                    )}
                  </div>
                  
                  {/* 📌 ปุ่มเพิ่มการ์ด */}
                  {canManage && (
                    <button onClick={() => openModal(sec.key)} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow hover:bg-purple-700 shrink-0">
                      + เพิ่มข้อมูล ({sec.title})
                    </button>
                  )}
                </div>

                <div className={`grid ${gridCols} gap-6 h-full items-stretch`}>
                  {data.symbols.map(item => <SymbolCard key={item.id} item={item} canManage={canManage} onEdit={openModal} onDelete={handleDelete} />)}
                  {data.colors.map(item => <ColorSwatch key={item.id} item={item} canManage={canManage} onEdit={openModal} onDelete={handleDelete} />)}
                  {data.facts.map(item => <FactCard key={item.id} item={item} canManage={canManage} onEdit={openModal} onDelete={handleDelete} />)}
                </div>
                
                {data.symbols.length === 0 && data.colors.length === 0 && data.facts.length === 0 && (
                  <p className="text-center text-slate-400 py-10">ยังไม่มีข้อมูลในการ์ดหมวดหมู่นี้</p>
                )}
              </div>
            );
          })
        }
      </div>

      {/* 🔒 Modal Form สำหรับจัดการข้อมูล */}
      <AnimatePresence>
        {canManage && showModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            
            <motion.form onSubmit={handleSave} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative z-10 bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-xl font-extrabold text-slate-900">
                  {formData.category === 'pageHeader' ? '✏️ แก้ไขข้อมูลส่วนหัวเว็บ' : 
                   formData.category === 'editBanners' ? '✏️ แก้ไขข้อความในแบนเนอร์' :
                   (editingItem ? 'แก้ไขข้อมูลการ์ด' : 'เพิ่มข้อมูลการ์ดใหม่')}
                </h3>
                <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
              </div>

              <div className="space-y-4">
                
                {/* 📌 ฟอร์มสำหรับ หัวเว็บ */}
                {formData.category === 'pageHeader' ? (
                  <>
                    <div>
                      <label className="text-[11px] font-bold">หัวข้อหน้าเว็บ</label>
                      <input className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.header_title || ''} onChange={e => setFormData({...formData, header_title: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold">คำอธิบายใต้หัวข้อ (กด Enter เพื่อเว้นบรรทัดได้)</label>
                      <textarea rows="3" className="w-full mt-1 p-2 border rounded-xl text-sm whitespace-pre-line" value={formData.header_subtitle || ''} onChange={e => setFormData({...formData, header_subtitle: e.target.value})} />
                    </div>
                  </>
                ) : 
                /* 📌 ฟอร์มสำหรับ แก้ไขแบนเนอร์โดยเฉพาะ */
                formData.category === 'editBanners' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500">แบนเนอร์ (มหาวิทยาลัย)</label>
                      <input className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.sec_uni_title || ''} onChange={e => setFormData({...formData, sec_uni_title: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500">แบนเนอร์ (คณะ)</label>
                      <input className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.sec_fac_title || ''} onChange={e => setFormData({...formData, sec_fac_title: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500">แบนเนอร์ (ภาควิชา)</label>
                      <input className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.sec_dept_title || ''} onChange={e => setFormData({...formData, sec_dept_title: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500">แบนเนอร์ (สาขาวิชา)</label>
                      <input className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.sec_bme_title || ''} onChange={e => setFormData({...formData, sec_bme_title: e.target.value})} />
                    </div>
                  </div>
                ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600">ลำดับการแสดงผล</label>
                      <input type="number" required className="w-full mt-1 p-2.5 border rounded-xl bg-slate-50" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600">หมวดหมู่ระดับ</label>
                      <select className="w-full mt-1 p-2.5 border rounded-xl bg-slate-50" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option value="university">มหาวิทยาลัย</option>
                        <option value="faculty">คณะ</option>
                        <option value="department">ภาควิชา</option>
                        <option value="bme">สาขาวิชา (BME)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-600">ประเภทของการ์ด</label>
                    <select className="w-full mt-1 p-2.5 border rounded-xl bg-slate-50" value={formData.sub_category} onChange={e => setFormData({...formData, sub_category: e.target.value})}>
                      <option value="symbol">ตราสัญลักษณ์ (Symbol)</option>
                      <option value="color">สีประจำหน่วยงาน (Color)</option>
                      <option value="fact">ข้อมูลสั้น/ตัวเลขสำคัญ (Fact)</option>
                    </select>
                  </div>

                  {formData.sub_category === 'symbol' && (
                    <>
                      <div><label className="text-xs font-bold text-slate-600">ชื่อตรา (Title)</label><input required className="w-full mt-1 p-2 border rounded-xl" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                      <div><label className="text-xs font-bold text-slate-600">ป้ายกำกับสั้นๆ (Tag)</label><input className="w-full mt-1 p-2 border rounded-xl" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} /></div>
                      <div><label className="text-xs font-bold text-slate-600">คำอธิบาย (Description)</label><textarea className="w-full mt-1 p-2 border rounded-xl" value={formData.detail1} onChange={e => setFormData({...formData, detail1: e.target.value})} /></div>
                      <div><label className="text-xs font-bold text-slate-600">รหัสสีของแถบ (HEX) เช่น #AC3520</label><input className="w-full mt-1 p-2 border rounded-xl" value={formData.detail2} onChange={e => setFormData({...formData, detail2: e.target.value})} /></div>
                      
                      <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <label className="text-xs font-bold text-purple-900 block mb-2">อัปโหลดรูปภาพโลโก้ใหม่</label>
                        <input type="file" accept="image/*" className="w-full text-xs cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700" onChange={e => setUploadFile(e.target.files[0])} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600">หรือระบุชื่อไฟล์ (เช่น bme_Logo.png) / URL โดยตรง</label>
                        <input className="w-full mt-1 p-2 border rounded-xl text-xs" value={formData.detail3} onChange={e => setFormData({...formData, detail3: e.target.value})} placeholder="bme_Logo.png หรือ https://..." />
                      </div>
                    </>
                  )}

                  {formData.sub_category === 'color' && (
                    <>
                      <div><label className="text-xs font-bold text-slate-600">หัวข้อ (เช่น สีประจำมหาวิทยาลัย)</label><input required className="w-full mt-1 p-2 border rounded-xl" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                      <div><label className="text-xs font-bold text-slate-600">ชื่อสี (เช่น สีแดงหมากสุก)</label><input required className="w-full mt-1 p-2 border rounded-xl" value={formData.detail1} onChange={e => setFormData({...formData, detail1: e.target.value})} /></div>
                      <div><label className="text-xs font-bold text-slate-600">HEX Code (เช่น #AC3520)</label><input required className="w-full mt-1 p-2 border rounded-xl" value={formData.detail2} onChange={e => setFormData({...formData, detail2: e.target.value})} /></div>
                      <div><label className="text-xs font-bold text-slate-600">RGB (เช่น 172, 53, 32)</label><input className="w-full mt-1 p-2 border rounded-xl" value={formData.detail3} onChange={e => setFormData({...formData, detail3: e.target.value})} /></div>
                    </>
                  )}

                  {formData.sub_category === 'fact' && (
                    <>
                      <div><label className="text-xs font-bold text-slate-600">หัวข้อ (เช่น วันสถาปนา)</label><input required className="w-full mt-1 p-2 border rounded-xl" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                      <div><label className="text-xs font-bold text-slate-600">ข้อความ/วันที่ (เช่น 19 กุมภาพันธ์...)</label><input required className="w-full mt-1 p-2 border rounded-xl" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} /></div>
                      <div className="p-4 bg-slate-50 border rounded-xl space-y-4">
                        <div><label className="text-xs font-bold text-slate-600 block mb-1">อัปโหลดรูปไอคอน</label><input type="file" accept="image/*" className="text-xs" onChange={e => setUploadFile(e.target.files[0])} /></div>
                        <div><label className="text-xs font-bold text-slate-600">หรือ ชื่อไฟล์ไอคอน/Emoji</label><input className="w-full mt-1 p-2 border rounded-xl bg-white" value={formData.detail1} onChange={e => setFormData({...formData, detail1: e.target.value})} /></div>
                      </div>
                      <div className="p-4 bg-slate-50 border rounded-xl space-y-4">
                        <div><label className="text-xs font-bold text-slate-600 block mb-1">อัปโหลดรูปพื้นหลัง</label><input type="file" accept="image/*" className="text-xs" onChange={e => setBgUploadFile(e.target.files[0])} /></div>
                        <div><label className="text-xs font-bold text-slate-600">หรือ ชื่อไฟล์พื้นหลัง/URL</label><input className="w-full mt-1 p-2 border rounded-xl bg-white text-xs" value={formData.detail2} onChange={e => setFormData({...formData, detail2: e.target.value})} /></div>
                      </div>
                    </>
                  )}
                </>
                )}

              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
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