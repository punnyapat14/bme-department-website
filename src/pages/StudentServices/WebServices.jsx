import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground, SectionBanner } from "../../components/ThemeElements";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../supabaseClient";

const FadeInSection = ({ children, delay = "0s", className = "" }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setVisible(true); });
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
// 📌 ปุ่มแก้ไข (Edit / Delete) มาตรฐาน (แสดงตลอดเวลา)
// ==========================================
const ActionButtons = ({ onEdit, onDelete, positionClass = "top-3 right-3" }) => (
  <div className={`absolute ${positionClass} flex gap-1.5 z-30`}>
    {onEdit && (
      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }} className="p-1.5 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
      </button>
    )}
    {onDelete && (
      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} className="p-1.5 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    )}
  </div>
);

// 📌 ธีมสีสำหรับปุ่มบริการและทุนการศึกษา
const THEME_COLORS = [
  { label: '🔵 สีฟ้า-น้ำเงิน (Blue/Cyan)', value: 'from-blue-500 to-cyan-500', baseColor: 'blue' },
  { label: '🟣 สีม่วง-ชมพู (Purple/Pink)', value: 'from-purple-500 to-pink-500', baseColor: 'purple' },
  { label: '🟠 สีส้ม-เหลือง (Orange/Yellow)', value: 'from-orange-500 to-amber-500', baseColor: 'amber' },
  { label: '🟢 สีเขียว-มิ้นต์ (Emerald/Teal)', value: 'from-emerald-500 to-teal-500', baseColor: 'emerald' },
  { label: '🔴 สีแดง-ส้ม (Rose/Orange)', value: 'from-rose-500 to-orange-500', baseColor: 'rose' },
  { label: '⚫️ สีเทา-ดำ (Slate)', value: 'from-slate-600 to-slate-800', baseColor: 'slate' }
];

// 📌 ธีมสีสำหรับที่นั่งสอบ
const EXAM_THEMES = [
  { id: 'amber', label: '🟡 สีเหลือง (Yellow)', iconColor: 'text-amber-500 bg-amber-50', hoverColor: 'hover:bg-amber-50/60' },
  { id: 'rose', label: '🔴 สีแดง (Red)', iconColor: 'text-rose-500 bg-rose-50', hoverColor: 'hover:bg-rose-50/60' },
  { id: 'blue', label: '🔵 สีฟ้า (Blue)', iconColor: 'text-blue-500 bg-blue-50', hoverColor: 'hover:bg-blue-50/60' },
  { id: 'emerald', label: '🟢 สีเขียว (Green)', iconColor: 'text-emerald-500 bg-emerald-50', hoverColor: 'hover:bg-emerald-50/60' },
  { id: 'purple', label: '🟣 สีม่วง (Purple)', iconColor: 'text-purple-500 bg-purple-50', hoverColor: 'hover:bg-purple-50/60' }
];

const SERVICE_GROUPS = [
  {
    id: 'ส่วนกลางและระบบการศึกษา', title: 'ส่วนกลางและระบบการศึกษา', desc: 'ระบบบริการการศึกษา ปฏิทินการศึกษา ทุน และเว็บไซต์ทางการ',
    iconColor: 'bg-orange-50 text-orange-600 border-orange-200',
    icon: ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg> )
  },
  {
    id: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม', title: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม', desc: 'จองห้องค้นคว้ากลุ่ม ห้องอัจฉริยะ หอสมุด และสารสนเทศกิจกรรมนักศึกษา',
    iconColor: 'bg-purple-50 text-purple-600 border-purple-200',
    icon: ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> )
  }
];

export default function StudentServices() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ทั้งหมด');
  
  const [servicesData, setServicesData] = useState([]);
  const [pageSettings, setPageSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // States สำหรับ Admin Modal (Web Services Database)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ id: '', category: 'ส่วนกลางและระบบการศึกษา', name: '', short: '', url: '', description: '', color: 'from-blue-500 to-cyan-500', img_url: '' });
  const [uploadFile, setUploadFile] = useState(null);

  // States สำหรับ Modal ตั้งค่าข้อความ (Text Settings)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsModalType, setSettingsModalType] = useState('header'); 
  const [settingsForm, setSettingsForm] = useState({});

  // States สำหรับ Modal จัดการ JSON Arrays รายตัว (เพิ่ม/แก้ไขการ์ดย่อย)
  const [jsonModalState, setJsonModalState] = useState({ isOpen: false, field: '', index: -1, data: {} });

  const isAdmin = Boolean(
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
      const { data: webServices } = await supabase.from('web_services').select('*').order('created_at', { ascending: true });
      if (webServices) setServicesData(webServices);

      const { data: pSettings } = await supabase.from('service_page_settings').select('*').eq('id', 1).single();
      if (pSettings) setPageSettings(pSettings);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['ทั้งหมด', 'ส่วนกลางและระบบการศึกษา', 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม'];
  const visibleGroups = SERVICE_GROUPS.filter(group => activeTab === 'ทั้งหมด' || activeTab === group.id);

  const getFilteredItems = (categoryId) => {
    return servicesData.filter(item => {
      const matchCategory = item.category === categoryId;
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || (item.short || '').toLowerCase().includes(searchTerm.toLowerCase()) || (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  };

  // ----------------------------------------------------
  // 📌 1. ฟังก์ชันจัดการเว็บไซต์บริการ (web_services table)
  // ----------------------------------------------------
  const handleOpenModal = (service = null) => {
    setUploadFile(null);
    if (service) setFormData(service);
    else setFormData({ id: '', category: 'ส่วนกลางและระบบการศึกษา', name: '', short: '', url: '', description: '', color: 'from-blue-500 to-cyan-500', img_url: '' });
    setIsModalOpen(true);
  };

  const uploadImageToSupabase = async (file) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
    const { error } = await supabase.storage.from('images').upload(`services/${fileName}`, file);
    if (error) throw error;
    const { data } = supabase.storage.from('images').getPublicUrl(`services/${fileName}`);
    return data.publicUrl;
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalImgUrl = formData.img_url;
      if (uploadFile) {
        const uploadedUrl = await uploadImageToSupabase(uploadFile);
        if (uploadedUrl) finalImgUrl = uploadedUrl;
      }

      const payload = { ...formData, img_url: finalImgUrl };
      if (payload.id) { await supabase.from('web_services').update(payload).eq('id', payload.id); } 
      else { delete payload.id; await supabase.from('web_services').insert([payload]); }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert('บันทึกไม่สำเร็จ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('ลบข้อมูลบริการนี้ใช่หรือไม่?')) return;
    try {
      await supabase.from('web_services').delete().eq('id', id);
      fetchData();
    } catch (error) {
      alert('ลบไม่สำเร็จ');
    }
  };

  // ----------------------------------------------------
  // 📌 2. ฟังก์ชันจัดการข้อความ Text (service_page_settings table)
  // ----------------------------------------------------
  const handleOpenSettingsModal = (type) => {
    setSettingsModalType(type);
    setSettingsForm(pageSettings);
    setIsSettingsModalOpen(true);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await supabase.from('service_page_settings').upsert({ id: 1, ...settingsForm });
      setPageSettings({...pageSettings, ...settingsForm});
      setIsSettingsModalOpen(false);
    } catch (error) {
      alert('บันทึกการตั้งค่าไม่สำเร็จ');
    } finally {
      setIsSaving(false);
    }
  };

  // ----------------------------------------------------
  // 📌 3. ฟังก์ชันจัดการข้อมูล Array JSON (เพิ่ม/ลบ/แก้ไข การ์ดย่อย)
  // ----------------------------------------------------
  const openJsonItemModal = (field, index = -1) => {
    setUploadFile(null);
    let initialData = {};
    if (index >= 0 && pageSettings[field] && pageSettings[field][index]) {
      initialData = { ...pageSettings[field][index] };
    } else {
      // Default structure based on the field
      if (field === 'exam_links') initialData = { faculty: '', url: '', theme: 'blue' };
      else if (field === 'scholarship_links') initialData = { title: '', desc: '', url: '', color: 'blue' };
      else if (field === 'software_list') initialData = { name: '', img: '' };
      else if (field === 'it_clinic_table') initialData = { name: '', private: 'YES', kmutnb: 'YES' };
      else if (field === 'facebook_pages' || field === 'instagram_pages') initialData = { name: '', url: '' };
    }
    setJsonModalState({ isOpen: true, field, index, data: initialData });
  };

  const handleSaveJsonItem = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { field, index, data } = jsonModalState;
      let newArray = Array.isArray(pageSettings[field]) ? [...pageSettings[field]] : [];
      let itemToSave = { ...data };

      // แปลงรูปภาพถ้ามีการอัปโหลด (สำหรับ software_list)
      if (uploadFile && field === 'software_list') {
        const uploadedUrl = await uploadImageToSupabase(uploadFile);
        if (uploadedUrl) itemToSave.img = uploadedUrl;
      }

      // สร้าง theme อัตโนมัติสำหรับ exam_links ให้สอดคล้องกับ UI เก่า
      if (field === 'exam_links') {
        const themeObj = EXAM_THEMES.find(t => t.id === itemToSave.theme) || EXAM_THEMES[2];
        itemToSave.iconColor = themeObj.iconColor;
        itemToSave.hoverColor = themeObj.hoverColor;
      }

      if (index >= 0) {
        newArray[index] = itemToSave;
      } else {
        newArray.push(itemToSave);
      }

      await supabase.from('service_page_settings').update({ [field]: newArray }).eq('id', 1);
      setPageSettings({ ...pageSettings, [field]: newArray });
      setJsonModalState({ isOpen: false, field: '', index: -1, data: {} });
    } catch (error) {
      alert('บันทึกไม่สำเร็จ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteJsonItem = async (field, index) => {
    if (!window.confirm('ยืนยันการลบข้อมูลนี้?')) return;
    try {
      let newArray = [...pageSettings[field]];
      newArray.splice(index, 1);
      await supabase.from('service_page_settings').update({ [field]: newArray }).eq('id', 1);
      setPageSettings({ ...pageSettings, [field]: newArray });
    } catch (error) {
      alert('ลบไม่สำเร็จ');
    }
  };

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 relative overflow-hidden";

  if (isLoading || !pageSettings) {
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

        {/* ---------------- 📌 Header ---------------- */}
        <FadeInSection delay="0.1s">
          <div className="text-center max-w-4xl mx-auto pt-2 pb-10 relative">
            {isAdmin && <ActionButtons onEdit={() => handleOpenSettingsModal('header')} positionClass="top-0 right-0 md:-right-8" />}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600">
              {pageSettings.header_title}
            </h1>
            <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl whitespace-pre-line">
              {pageSettings.header_subtitle}
            </p>
          </div>
        </FadeInSection>

        {/* ---------------- 📌 Search ---------------- */}
        <FadeInSection delay="0.2s">
          <div className="text-center max-w-4xl mx-auto pb-10">
            <div className="max-w-xl mx-auto relative group mb-8">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><svg className="w-5 h-5 text-slate-400 group-focus-within:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
              <input type="text" placeholder="ค้นหาบริการที่ต้องการ เช่น REG, K-Room, ทุน..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-12 py-3.5 bg-white/90 backdrop-blur-md shadow-sm rounded-full border border-slate-100 focus:ring-2 focus:ring-purple-400" />
            </div>
            <div className="flex flex-wrap justify-center gap-2.5">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveTab(cat)} className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm ${activeTab === cat ? 'bg-slate-900 text-white scale-105' : 'bg-white/80 text-slate-600 hover:bg-white'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* ---------------- 📌 1. เว็บไซต์ส่วนกลาง ---------------- */}
        <FadeInSection delay="0.3s">
          <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50`}>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1 w-full"><SectionBanner text="เว็บไซต์บริการส่วนกลาง" variant="website" /></div>
              {isAdmin && (
                <button onClick={() => handleOpenModal()} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow hover:bg-purple-700 shrink-0">
                  + เพิ่มบริการส่วนกลาง
                </button>
              )}
            </div>
            
            <div className="space-y-12 mt-10">
              {visibleGroups.map((group) => {
                const services = getFilteredItems(group.id);
                if (services.length === 0) return null;
                return (
                  <div key={group.id} className="pt-4 first:pt-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${group.iconColor}`}>{group.icon}</div>
                        <div><h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">{group.title}</h3><p className="text-xs md:text-sm text-slate-500 font-medium">{group.desc}</p></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      <AnimatePresence>
                        {services.map((item) => (
                          <motion.div layout key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} whileHover={{ y: -6, scale: 1.02 }} className="relative rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden group flex flex-col p-5">
                            
                            {isAdmin && <ActionButtons onEdit={() => handleOpenModal(item)} onDelete={() => handleDeleteService(item.id)} positionClass="top-2 right-2" />}
                            
                            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.color}`}></div>
                            <div className="flex justify-between items-center mb-4 pt-1"><span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">{item.short}</span></div>
                            <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center p-3 rounded-2xl bg-slate-50 shadow-inner group-hover:scale-105 transition-transform">
                                <img src={item.img_url || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-contain mix-blend-multiply drop-shadow-xs" onError={(e)=>{e.target.src="https://via.placeholder.com/150"}} />
                            </div>
                            <div className="text-center flex-1 flex flex-col justify-between">
                              <div><h4 className="text-sm font-black text-slate-800 mb-1.5 group-hover:text-purple-700">{item.name}</h4><p className="text-[11px] font-medium text-slate-500 line-clamp-2 mb-5">{item.description}</p></div>
                              <a href={item.url} target="_blank" rel="noreferrer" className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${item.color} shadow-sm flex items-center justify-center gap-2 hover:shadow-md active:scale-95`}>เข้าสู่เว็บไซต์ <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeInSection>

        {/* ---------------- 📌 2. ที่นั่งสอบ ---------------- */}
        <FadeInSection delay="0.4s">
          <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50 relative`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1 w-full flex items-center gap-2">
                <div className="flex-1"><SectionBanner text="ระบบเช็คที่นั่งสอบ" variant="exam" /></div>
                {isAdmin && <button onClick={() => handleOpenSettingsModal('exam')} className="p-2.5 bg-slate-100/80 text-slate-500 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition shadow-sm border border-slate-200"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>}
              </div>
              {isAdmin && <button onClick={() => openJsonItemModal('exam_links')} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow hover:bg-purple-700 shrink-0">+ เพิ่มที่นั่งสอบคณะ</button>}
            </div>
            
            <div className="mt-8">
              <div className="flex items-center gap-4 mb-8 pb-5 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">{pageSettings.exam_title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{pageSettings.exam_desc}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {(pageSettings.exam_links || []).map((item, idx) => (
                  <div key={idx} className={`relative flex flex-col justify-between p-5 rounded-2xl bg-white shadow-sm border hover:shadow-md transition-all group ${item.hoverColor}`}>
                    {isAdmin && <ActionButtons onEdit={() => openJsonItemModal('exam_links', idx)} onDelete={() => handleDeleteJsonItem('exam_links', idx)} positionClass="top-2 right-2" />}
                    
                    <a href={item.url} target="_blank" rel="noreferrer" className="flex flex-col h-full z-10">
                      <div className="mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${item.iconColor}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-slate-900">{item.faculty}</h4>
                      </div>
                      <div className="flex items-center text-[11px] font-bold text-slate-500 group-hover:text-slate-800 mt-auto">ตรวจสอบที่นั่งสอบ <svg className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* ---------------- 📌 3. ทุนการศึกษา ---------------- */}
        <FadeInSection delay="0.5s">
          <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50 relative`}>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1 w-full flex items-center gap-2">
                <div className="flex-1"><SectionBanner text="ทุนการศึกษา" variant="scholarship" /></div>
                {isAdmin && <button onClick={() => handleOpenSettingsModal('scholarship')} className="p-2.5 bg-slate-100/80 text-slate-500 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition shadow-sm border border-slate-200"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>}
              </div>
              {isAdmin && <button onClick={() => openJsonItemModal('scholarship_links')} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow hover:bg-purple-700 shrink-0">+ เพิ่มทุนการศึกษา</button>}
            </div>

            <div className="mt-8 flex flex-col lg:flex-row gap-10 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-100/60 text-amber-700 text-[11px] font-black uppercase mb-5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path></svg> Scholarships & Opportunities
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">{pageSettings.scholarship_title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{pageSettings.scholarship_desc}</p>
              </div>
              <div className="w-full lg:w-[50%] grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(pageSettings.scholarship_links || []).map((item, idx) => {
                  const baseColor = item.color || 'blue'; // fallback
                  return (
                    <div key={idx} className="relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center">
                      {isAdmin && <ActionButtons onEdit={() => openJsonItemModal('scholarship_links', idx)} onDelete={() => handleDeleteJsonItem('scholarship_links', idx)} positionClass="top-2 right-2" />}
                      <a href={item.url} target="_blank" rel="noreferrer" className="flex flex-col items-center z-10 w-full">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${baseColor}-100 to-${baseColor}-200 text-${baseColor}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.315 48.315 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"></path></svg></div>
                        <h4 className={`text-base font-black text-slate-800 mb-2 group-hover:text-${baseColor}-600 transition-colors`}>{item.title}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* ---------------- 📌 4. บริการและสวัสดิการ ---------------- */}
        <FadeInSection delay="0.6s">
          <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50`}>
            <SectionBanner text="บริการและสวัสดิการ" variant="service" />
            
            {/* 4.1 ICIT Service */}
            <div className="mt-10 mb-12 relative">
              
              <div className="relative overflow-hidden rounded-[2rem] bg-[#293896] shadow-lg p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-800/50 mt-4">
                {isAdmin && <ActionButtons onEdit={() => handleOpenSettingsModal('icit_wifi_software')} positionClass="top-4 right-4" />}
                <div className="absolute inset-0 bg-blue-500/10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
                <div className="relative z-10 flex-1 max-w-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-md">
                      <img src={pageSettings.icit_logo_img || 'https://via.placeholder.com/150'} alt="ICIT" className="w-full h-full object-contain" onError={(e)=>{e.target.src="https://via.placeholder.com/150"}}/>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">{pageSettings.icit_title}</h2>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-blue-200 mb-3">{pageSettings.icit_subtitle}</h3>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-6">{pageSettings.icit_desc}</p>
                  <a href={pageSettings.icit_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white text-[#293896] px-5 py-3 rounded-full font-bold text-xs hover:bg-blue-50 transition-colors shadow-md transform hover:-translate-y-1">ไปที่งานบริการ <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>
                </div>
                <div className="relative z-10 w-full md:w-[40%] flex justify-center items-center">
                    <img src={pageSettings.icit_main_img || 'https://via.placeholder.com/350'} alt="ICIT Options" className="w-full max-w-[350px] object-cover rounded-[1.5rem] shadow-xl hover:scale-105 transition-transform duration-500 border-4 border-white/10" onError={(e)=>{e.target.src="https://via.placeholder.com/350"}}/>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* 💻 ซอฟต์แวร์ลิขสิทธิ์ */}
                <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 flex flex-col shadow-sm hover:shadow-md transition-shadow relative">
                  {isAdmin && <ActionButtons onEdit={() => openJsonItemModal('software_list')} positionClass="top-6 right-20" />}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></div>
                      <h3 className="text-lg font-bold text-slate-800">{pageSettings.software_title}</h3>
                    </div>
                    <a href={pageSettings.software_url} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100">ดาวน์โหลด</a>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-auto">
                    {(pageSettings.software_list || []).map((sw, i) => (
                      <div key={i} className="relative group/sw">
                        {isAdmin && <ActionButtons onEdit={() => openJsonItemModal('software_list', i)} onDelete={() => handleDeleteJsonItem('software_list', i)} positionClass="top-1 right-1" />}
                        <a href={pageSettings.software_url} target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden h-20 w-full group-hover/sw:scale-105 transition-transform duration-300 block">
                          <img src={sw.img || 'https://via.placeholder.com/150'} alt={sw.name} title={sw.name} className="w-full h-full object-cover" onError={(e)=>{e.target.src="https://via.placeholder.com/150"}}/>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 📡 บริการเครือข่าย Wi-Fi */}
                <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 flex flex-col shadow-sm hover:shadow-md transition-shadow relative">
                  {isAdmin && <ActionButtons onEdit={() => handleOpenSettingsModal('icit_wifi_software')} positionClass="top-6 right-24" />}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg></div>
                      <h3 className="text-lg font-bold text-slate-800">{pageSettings.wifi_title}</h3>
                    </div>
                    <a href={pageSettings.wifi_url} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full hover:bg-teal-100">คู่มือใช้งาน</a>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-700">@KMUTNB</span>
                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-700">@KMUTNB by AIS / TRUE</span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 mb-1">{pageSettings.wifi_kmutnb_desc1}</p>
                      <p className="text-[10px] text-rose-500">{pageSettings.wifi_kmutnb_desc2}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-700">eduroam</span>
                      </div>
                      <div className="text-[11px] text-slate-600 space-y-1">
                        <p><span className="font-bold">User:</span> {pageSettings.wifi_eduroam_user}</p>
                        <p><span className="font-bold">Pass:</span> {pageSettings.wifi_eduroam_pass}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 relative">
                
                {/* 🔧 IT Clinic */}
                <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow mt-4 relative">
                  {isAdmin && <ActionButtons onEdit={() => handleOpenSettingsModal('clinic_hosting')} positionClass="top-6 right-24" />}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
                      <h3 className="text-lg font-bold text-slate-800">{pageSettings.it_clinic_title}</h3>
                    </div>
                    <a href={pageSettings.it_clinic_url} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100">ติดต่อใช้บริการ</a>
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="bg-white p-3 rounded-xl border border-purple-100 text-center shadow-sm flex-1">
                      <p className="text-[10px] text-purple-700 font-bold">นักศึกษา</p>
                      <p className="text-xl font-black text-slate-800">{pageSettings.it_clinic_student_price} <span className="text-[10px] font-normal">บาท</span></p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-pink-100 text-center shadow-sm flex-1">
                      <p className="text-[10px] text-pink-700 font-bold">บุคลากร</p>
                      <p className="text-xl font-black text-slate-800">{pageSettings.it_clinic_staff_price} <span className="text-[10px] font-normal">บาท</span></p>
                    </div>
                  </div>

                  {/* 📌 ตาราง IT Clinic: เพิ่มปุ่มจัดการและเพิ่มข้อมูล */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm text-[10px] relative">
                    {isAdmin && (
                      <button onClick={() => openJsonItemModal('it_clinic_table')} className="absolute -top-7 right-0 text-[10px] bg-slate-900 text-white px-2 py-1 rounded shadow-sm hover:bg-slate-700 z-10">+ เพิ่มรายการ</button>
                    )}
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600"><tr><th className="py-2 px-3 font-bold">Software</th><th className="py-2 px-3 text-center">ส่วนตัว</th><th className="py-2 px-3 text-center">มจพ.</th>{isAdmin && <th className="py-2 px-3 text-right">จัดการ</th>}</tr></thead>
                        <tbody className="divide-y divide-slate-100 text-slate-500">
                          {(pageSettings.it_clinic_table || []).map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 group/row">
                              <td className="py-1.5 px-3 truncate max-w-[120px]">{row.name}</td>
                              <td className={`py-1.5 px-3 text-center ${row.private === 'YES' ? 'text-emerald-500 font-bold' : 'text-slate-300'}`}>{row.private}</td>
                              <td className={`py-1.5 px-3 text-center ${row.kmutnb === 'YES' ? 'text-emerald-500 font-bold' : 'text-slate-300'}`}>{row.kmutnb}</td>
                              {isAdmin && (
                                <td className="py-1.5 px-3 text-right">
                                  <button onClick={() => openJsonItemModal('it_clinic_table', i)} className="text-purple-600 hover:text-purple-800 mr-2 font-bold">แก้ไข</button>
                                  <button onClick={() => handleDeleteJsonItem('it_clinic_table', i)} className="text-rose-500 hover:text-rose-700 font-bold">ลบ</button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* ☁️ Hosting */}
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-900 to-slate-900 p-6 shadow-sm border border-slate-700 flex flex-col justify-center mt-4">
                  {isAdmin && <ActionButtons onEdit={() => handleOpenSettingsModal('clinic_hosting')} positionClass="top-4 right-4" />}
                  <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/10 border border-white/20 text-cyan-300 text-[9px] font-bold tracking-widest uppercase mb-3 backdrop-blur-sm"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> Web & Database </div>
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{pageSettings.hosting_title}</h3>
                    <p className="text-slate-300 text-xs leading-relaxed mb-5 line-clamp-3">{pageSettings.hosting_desc}</p>
                    <a href={pageSettings.hosting_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xs shadow-md transform hover:-translate-y-0.5">ขอใช้บริการ <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></a>
                  </div>
                </div>
              </div>
            </div>

            {/* 4.2 บัญชีธนาคารและบัตรนักศึกษา */}
            <div className="mt-12 relative">
              
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f8f9ff] to-[#f1f5f9] shadow-md border border-slate-200/60 p-8 flex flex-col md:flex-row items-center justify-between gap-8 mt-4">
                {isAdmin && <ActionButtons onEdit={() => handleOpenSettingsModal('bank')} positionClass="top-4 right-4" />}
                <div className="relative z-10 w-full md:w-[50%] flex flex-col justify-center items-start mt-4 md:mt-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-100/60 text-blue-700 text-[10px] font-black uppercase mb-4 shadow-sm tracking-wider">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg> 
                    Bank Account & ID Card 
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] tracking-tight mb-4 leading-snug">{pageSettings.bank_title}</h3>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6">{pageSettings.bank_desc}</p>
                  <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-100/60 flex items-start gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-600 shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </span>
                    <p className="text-[11px] text-slate-700 font-medium leading-relaxed">{pageSettings.bank_note}</p>
                  </div>
                </div>
                
                <div className="relative z-10 w-full md:w-[45%] flex justify-center items-center min-h-[220px] mt-6 md:mt-0">
                  <motion.div animate={{ y: [3, -3, 3] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute z-10 right-[5%] sm:right-[15%] top-[5%] shadow-lg rounded-r-2xl rounded-l-md rotate-6 w-32 sm:w-40 h-44 sm:h-52 bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] border-l-[10px] border-[#0f172a] p-4 flex flex-col items-center justify-center text-white">
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 mb-2 flex items-center justify-center"><div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-white/40"></div></div></div>
                    <h4 className="text-[9px] sm:text-[10px] font-black tracking-widest mb-1 opacity-90">ธนาคารกรุงเทพ</h4>
                    <div className="w-10 h-[1px] bg-white/30 mb-2"></div>
                    <p className="text-[8px] sm:text-[10px] text-center opacity-90 font-medium">บัญชีสะสมทรัพย์</p>
                  </motion.div>
                  
                  <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute z-20 left-[5%] sm:left-[10%] bottom-[5%] shadow-xl rounded-[1rem] -rotate-3 w-56 sm:w-64 h-36 sm:h-40 bg-white border border-slate-200 p-4 flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500"></div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100 shrink-0"><span className="text-[7px] text-rose-600 font-black">มจพ</span></div>
                      <div className="leading-tight"><p className="text-[8px] font-extrabold text-slate-800">มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ</p></div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="w-9 h-7 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-500 border border-yellow-600/50 p-1"><div className="w-full h-[1px] bg-yellow-700/30"></div></div>
                      <div className="w-10 h-12 bg-slate-100 border border-slate-200 rounded-md flex items-end justify-center pb-1"><svg className="w-6 h-6 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
                    </div>
                    <div className="mt-1"><p className="text-xs font-mono font-bold text-slate-800 tracking-widest">{pageSettings.bank_account_no}</p></div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* 4.3 ศูนย์บริการสุขภาพ มจพ. */}
            <div className="mt-12 relative">
              
              <div className="bg-slate-50/50 rounded-[2rem] border border-slate-100 p-8 shadow-sm mt-4 relative">
                {isAdmin && <ActionButtons onEdit={() => handleOpenSettingsModal('health')} positionClass="top-4 right-4" />}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-slate-200 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center p-1 border border-slate-200"><img src={pageSettings.health_logo_img || 'https://via.placeholder.com/150'} alt="Health" className="w-full h-full object-cover rounded-xl" onError={(e)=>{e.target.src="https://via.placeholder.com/150"}}/></div>
                    <div><h3 className="text-xl md:text-2xl font-black text-slate-800">{pageSettings.health_title}</h3><p className="text-xs md:text-sm text-slate-500 font-medium">{pageSettings.health_desc}</p></div>
                  </div>
                  <a href={pageSettings.health_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-full font-bold text-xs hover:bg-emerald-100 mt-4 md:mt-0">เว็บไซต์ศูนย์สุขภาพ <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div>
                      <h4 className="text-lg font-bold text-slate-800">{pageSettings.health_schedule_title}</h4>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 group">
                      <img src={pageSettings.health_schedule_img || 'https://via.placeholder.com/400x600'} alt="Schedule" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{e.target.src="https://via.placeholder.com/400x600"}}/>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"><a href={pageSettings.health_schedule_img} target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-3 py-1.5 rounded-full font-bold text-xs shadow-md flex items-center gap-1.5">ขยายรูป</a></div>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{pageSettings.health_note}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div>
                      <h4 className="text-lg font-bold text-slate-800">{pageSettings.health_insure_title}</h4>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 group">
                      <img src={pageSettings.health_insure_img || 'https://via.placeholder.com/400x600'} alt="Insure" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{e.target.src="https://via.placeholder.com/400x600"}}/>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"><a href={pageSettings.health_insure_img} target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-3 py-1.5 rounded-full font-bold text-xs shadow-md flex items-center gap-1.5">ขยายรูป</a></div>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{pageSettings.health_insure_desc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4.4 แผนที่มหาวิทยาลัย */}
            <div className="mt-12 relative">
              <div className="bg-slate-50/50 rounded-[2rem] border border-slate-100 p-8 shadow-sm mt-4 relative">
                {isAdmin && <ActionButtons onEdit={() => handleOpenSettingsModal('map')} positionClass="top-4 right-4" />}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-extrabold text-slate-800 mb-1 tracking-tight">{pageSettings.map_title}</h2>
                  <p className="text-slate-500 font-medium text-xs md:text-sm">{pageSettings.map_desc}</p>
                </div>
                <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm group">
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                  <img src={pageSettings.map_img || 'https://via.placeholder.com/800x600'} alt="Map" className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500" onError={(e)=>{e.target.src="https://via.placeholder.com/800x600"}}/>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <a href={pageSettings.map_img} target="_blank" rel="noreferrer" className="bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2 rounded-full font-bold text-xs shadow-md flex items-center gap-1.5 hover:bg-slate-900 hover:text-white">ดูภาพขนาดเต็ม</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* ---------------- 📌 5. เพจหน่วยงาน ---------------- */}
        <FadeInSection delay="0.7s">
          <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50 relative`}>
            
            <SectionBanner text="เพจหน่วยงาน" variant="social" />
            
            <div className="text-center mb-10 mt-6 relative z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{pageSettings.social_title}</h2>
              <p className="text-slate-500 font-medium text-sm">{pageSettings.social_desc}</p>
              {isAdmin && <ActionButtons onEdit={() => handleOpenSettingsModal('social')} positionClass="top-0 right-0 md:-right-4" />}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
              {/* Facebook */}
              <div className="bg-slate-50/50 rounded-[2rem] p-6 md:p-8 border border-slate-100/80 relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></div>
                    <h3 className="font-extrabold text-slate-800 text-xl">Facebook</h3>
                  </div>
                  {isAdmin && <button onClick={() => openJsonItemModal('facebook_pages')} className="text-[10px] font-bold text-white bg-[#1877F2] px-3 py-1.5 rounded-lg hover:bg-blue-600">+ เพิ่มเพจ</button>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {(pageSettings.facebook_pages || []).map((page, idx) => (
                    <div key={idx} className="relative group/social">
                      {isAdmin && <ActionButtons onEdit={() => openJsonItemModal('facebook_pages', idx)} onDelete={() => handleDeleteJsonItem('facebook_pages', idx)} positionClass="top-2 right-2" />}
                      <a href={page.url} target="_blank" rel="noreferrer" className="flex items-center px-4 py-3 bg-white rounded-xl border border-slate-200/70 shadow-sm hover:border-blue-400 hover:shadow-md transition-all h-full">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1877F2] flex items-center justify-center text-white mr-3"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></div>
                        <span className="font-bold text-slate-700 text-[11px] sm:text-xs group-hover/social:text-[#1877F2] line-clamp-2 pr-6">{page.name}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              {/* Instagram */}
              <div className="bg-slate-50/50 rounded-[2rem] p-6 md:p-8 border border-slate-100/80 relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></div>
                    <h3 className="font-extrabold text-slate-800 text-xl">Instagram</h3>
                  </div>
                  {isAdmin && <button onClick={() => openJsonItemModal('instagram_pages')} className="text-[10px] font-bold text-white bg-pink-600 px-3 py-1.5 rounded-lg hover:bg-pink-700">+ เพิ่มเพจ</button>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {(pageSettings.instagram_pages || []).map((page, idx) => (
                    <div key={idx} className="relative group/social">
                      {isAdmin && <ActionButtons onEdit={() => openJsonItemModal('instagram_pages', idx)} onDelete={() => handleDeleteJsonItem('instagram_pages', idx)} positionClass="top-2 right-2" />}
                      <a href={page.url} target="_blank" rel="noreferrer" className="flex items-center px-4 py-3 bg-white rounded-xl border border-slate-200/70 shadow-sm hover:border-pink-400 hover:shadow-md transition-all h-full">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-500 flex items-center justify-center text-white mr-3"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></div>
                        <span className="font-bold text-slate-700 text-[11px] sm:text-xs group-hover/social:text-pink-600 line-clamp-2 pr-6">{page.name}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

      </div>
      
      {/* 🟢 Back to Top */}
      <motion.button initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ margin: "-300px" }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-slate-900 text-white shadow-lg hover:bg-purple-600 hover:-translate-y-1 transition-all">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"></path></svg>
      </motion.button>

      {/* ================= Admin Modals ================= */}
      
      {/* 📌 Modal 1: เว็บไซต์บริการส่วนกลาง (Main Card) */}
      <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-extrabold text-slate-800">{formData.id ? '✏️ แก้ไขเว็บไซต์บริการ' : '✨ เพิ่มเว็บไซต์บริการใหม่'}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">หมวดหมู่</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm">
                  <option value="ส่วนกลางและระบบการศึกษา">ส่วนกลางและระบบการศึกษา</option>
                  <option value="ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม">ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อเว็บไซต์</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" required /></div>
                <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อย่อ (Tag)</label><input type="text" value={formData.short} onChange={e => setFormData({...formData, short: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" required /></div>
              </div>
              <div><label className="block text-[11px] font-bold text-slate-700 mb-1">URL เว็บไซต์</label><input type="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" required /></div>
              <div><label className="block text-[11px] font-bold text-slate-700 mb-1">คำอธิบาย</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="2" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm"></textarea></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">สีของปุ่ม</label>
                  {/* 📌 เปลี่ยนจากกรอก Tailwind เป็นเลือกสี (Dropdown) */}
                  <select value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm">
                    {THEME_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div><label className="block text-[11px] font-bold text-slate-700 mb-1">URL รูปภาพ</label><input type="url" value={formData.img_url} onChange={e => setFormData({...formData, img_url: e.target.value})} placeholder="https://..." className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" /></div>
              </div>
            </div>
            
            <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-full text-slate-600 font-bold bg-slate-200 hover:bg-slate-300 text-sm">ยกเลิก</button>
              <button type="button" onClick={handleSaveService} disabled={isSaving} className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md text-sm">{isSaving ? 'บันทึก...' : 'บันทึกข้อมูล'}</button>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* 📌 Modal 2: ตั้งค่าข้อความหน้าเว็บแบบแยกส่วน (Text Settings) */}
      <AnimatePresence>
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.form onSubmit={handleSaveSettings} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2rem] w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-extrabold text-slate-800">
                {settingsModalType === 'header' ? '✏️ แก้ไขข้อความส่วนหัว' :
                 settingsModalType === 'exam' ? '✏️ ตั้งค่าระบบเช็คที่นั่งสอบ' :
                 settingsModalType === 'scholarship' ? '✏️ ตั้งค่าทุนการศึกษา' :
                 settingsModalType === 'icit_wifi_software' ? '✏️ ตั้งค่า ICIT & Wi-Fi' :
                 settingsModalType === 'clinic_hosting' ? '✏️ ตั้งค่า IT Clinic & Hosting' :
                 settingsModalType === 'bank' ? '✏️ ตั้งค่าบัญชีธนาคาร' :
                 settingsModalType === 'health' ? '✏️ ตั้งค่าศูนย์สุขภาพ' :
                 settingsModalType === 'map' ? '✏️ ตั้งค่าแผนที่' :
                 settingsModalType === 'social' ? '✏️ ตั้งค่าโซเชียลมีเดีย' : 'ตั้งค่า'}
              </h2>
              <button type="button" onClick={() => setIsSettingsModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* 📌 ลบช่องกรอก JSON ออกทั้งหมด ให้แก้เฉพาะ Text เท่านั้น */}
              {settingsModalType === 'header' && (
                <>
                  <div><label className="block text-[11px] font-bold mb-1">หัวข้อหลัก</label><input type="text" value={settingsForm.header_title} onChange={e => setSettingsForm({...settingsForm, header_title: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">คำบรรยายหลัก (กด Enter เว้นบรรทัดได้)</label><textarea value={settingsForm.header_subtitle} onChange={e => setSettingsForm({...settingsForm, header_subtitle: e.target.value})} rows="4" className="w-full p-3 border rounded-xl text-sm bg-white whitespace-pre-line"></textarea></div>
                </>
              )}

              {settingsModalType === 'exam' && (
                <>
                  <div><label className="block text-[11px] font-bold mb-1">หัวข้อ ที่นั่งสอบ</label><input type="text" value={settingsForm.exam_title} onChange={e => setSettingsForm({...settingsForm, exam_title: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">คำบรรยาย ที่นั่งสอบ</label><input type="text" value={settingsForm.exam_desc} onChange={e => setSettingsForm({...settingsForm, exam_desc: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                </>
              )}

              {settingsModalType === 'scholarship' && (
                <>
                  <div><label className="block text-[11px] font-bold mb-1">หัวข้อ ทุนการศึกษา</label><input type="text" value={settingsForm.scholarship_title} onChange={e => setSettingsForm({...settingsForm, scholarship_title: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">คำบรรยาย ทุนการศึกษา</label><input type="text" value={settingsForm.scholarship_desc} onChange={e => setSettingsForm({...settingsForm, scholarship_desc: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                </>
              )}

              {settingsModalType === 'icit_wifi_software' && (
                <>
                  <div><label className="block text-[11px] font-bold mb-1">หัวข้อ ICIT</label><input type="text" value={settingsForm.icit_title} onChange={e => setSettingsForm({...settingsForm, icit_title: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">หัวข้อรอง ICIT</label><input type="text" value={settingsForm.icit_subtitle} onChange={e => setSettingsForm({...settingsForm, icit_subtitle: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">รายละเอียด ICIT</label><textarea value={settingsForm.icit_desc} onChange={e => setSettingsForm({...settingsForm, icit_desc: e.target.value})} rows="3" className="w-full p-3 border rounded-xl text-sm bg-white"></textarea></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-[11px] font-bold mb-1">URL โลโก้ ICIT</label><input type="text" value={settingsForm.icit_logo_img} onChange={e => setSettingsForm({...settingsForm, icit_logo_img: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                    <div><label className="block text-[11px] font-bold mb-1">URL รูปภาพหลัก ICIT</label><input type="text" value={settingsForm.icit_main_img} onChange={e => setSettingsForm({...settingsForm, icit_main_img: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  </div>
                  
                  <hr className="my-4 border-slate-100"/>
                  <div><label className="block text-[11px] font-bold mb-1">หัวข้อ ซอฟต์แวร์</label><input type="text" value={settingsForm.software_title} onChange={e => setSettingsForm({...settingsForm, software_title: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">URL ดาวน์โหลดซอฟต์แวร์</label><input type="text" value={settingsForm.software_url} onChange={e => setSettingsForm({...settingsForm, software_url: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  
                  <hr className="my-4 border-slate-100"/>
                  <div><label className="block text-sm font-bold text-teal-600 mb-2">ตั้งค่า Wi-Fi</label></div>
                  <div><label className="block text-[11px] font-bold mb-1">หัวข้อ Wi-Fi</label><input type="text" value={settingsForm.wifi_title} onChange={e => setSettingsForm({...settingsForm, wifi_title: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">URL คู่มือ Wi-Fi</label><input type="text" value={settingsForm.wifi_url} onChange={e => setSettingsForm({...settingsForm, wifi_url: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-[11px] font-bold mb-1">KMUTNB คำอธิบาย 1</label><input type="text" value={settingsForm.wifi_kmutnb_desc1} onChange={e => setSettingsForm({...settingsForm, wifi_kmutnb_desc1: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                    <div><label className="block text-[11px] font-bold mb-1">KMUTNB คำอธิบาย 2</label><input type="text" value={settingsForm.wifi_kmutnb_desc2} onChange={e => setSettingsForm({...settingsForm, wifi_kmutnb_desc2: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                    <div><label className="block text-[11px] font-bold mb-1">Eduroam User</label><input type="text" value={settingsForm.wifi_eduroam_user} onChange={e => setSettingsForm({...settingsForm, wifi_eduroam_user: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                    <div><label className="block text-[11px] font-bold mb-1">Eduroam Pass</label><input type="text" value={settingsForm.wifi_eduroam_pass} onChange={e => setSettingsForm({...settingsForm, wifi_eduroam_pass: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  </div>
                </>
              )}

              {settingsModalType === 'clinic_hosting' && (
                <>
                  <div><label className="block text-[11px] font-bold mb-1">หัวข้อ IT Clinic</label><input type="text" value={settingsForm.it_clinic_title} onChange={e => setSettingsForm({...settingsForm, it_clinic_title: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">URL ติดต่อ IT Clinic</label><input type="text" value={settingsForm.it_clinic_url} onChange={e => setSettingsForm({...settingsForm, it_clinic_url: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-[11px] font-bold mb-1">ราคา นศ.</label><input type="text" value={settingsForm.it_clinic_student_price} onChange={e => setSettingsForm({...settingsForm, it_clinic_student_price: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                    <div><label className="block text-[11px] font-bold mb-1">ราคา บุคลากร</label><input type="text" value={settingsForm.it_clinic_staff_price} onChange={e => setSettingsForm({...settingsForm, it_clinic_staff_price: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  </div>
                  
                  <hr className="my-4 border-slate-100"/>
                  <div><label className="block text-sm font-bold text-indigo-600 mb-2">ตั้งค่า Hosting</label></div>
                  <div><label className="block text-[11px] font-bold mb-1">หัวข้อ Hosting</label><input type="text" value={settingsForm.hosting_title} onChange={e => setSettingsForm({...settingsForm, hosting_title: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">URL ขอโฮสติ้ง</label><input type="text" value={settingsForm.hosting_url} onChange={e => setSettingsForm({...settingsForm, hosting_url: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">รายละเอียด Hosting</label><textarea value={settingsForm.hosting_desc} onChange={e => setSettingsForm({...settingsForm, hosting_desc: e.target.value})} rows="3" className="w-full p-3 border rounded-xl text-sm bg-white"></textarea></div>
                </>
              )}

              {settingsModalType === 'bank' && (
                <>
                  <div><label className="block text-[11px] font-bold mb-1">หัวข้อ ธนาคาร</label><input type="text" value={settingsForm.bank_title} onChange={e => setSettingsForm({...settingsForm, bank_title: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">รายละเอียด ธนาคาร</label><input type="text" value={settingsForm.bank_desc} onChange={e => setSettingsForm({...settingsForm, bank_desc: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">หมายเหตุ (กล่องเหลือง)</label><input type="text" value={settingsForm.bank_note} onChange={e => setSettingsForm({...settingsForm, bank_note: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">เลขบัญชีบนบัตร</label><input type="text" value={settingsForm.bank_account_no} onChange={e => setSettingsForm({...settingsForm, bank_account_no: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                </>
              )}

              {settingsModalType === 'health' && (
                <>
                  <div><label className="block text-[11px] font-bold mb-1">หัวข้อ ศูนย์สุขภาพ</label><input type="text" value={settingsForm.health_title} onChange={e => setSettingsForm({...settingsForm, health_title: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">คำบรรยาย ศูนย์สุขภาพ</label><input type="text" value={settingsForm.health_desc} onChange={e => setSettingsForm({...settingsForm, health_desc: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">URL โลโก้ศูนย์</label><input type="text" value={settingsForm.health_logo_img} onChange={e => setSettingsForm({...settingsForm, health_logo_img: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div><label className="block text-[11px] font-bold mb-1">หัวข้อ ตารางแพทย์</label><input type="text" value={settingsForm.health_schedule_title} onChange={e => setSettingsForm({...settingsForm, health_schedule_title: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                    <div><label className="block text-[11px] font-bold mb-1">URL รูปตารางแพทย์</label><input type="text" value={settingsForm.health_schedule_img} onChange={e => setSettingsForm({...settingsForm, health_schedule_img: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                    <div className="col-span-2"><label className="block text-[11px] font-bold mb-1">คำอธิบายใต้ตารางแพทย์</label><input type="text" value={settingsForm.health_note} onChange={e => setSettingsForm({...settingsForm, health_note: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div><label className="block text-[11px] font-bold mb-1">หัวข้อ ประกัน</label><input type="text" value={settingsForm.health_insure_title} onChange={e => setSettingsForm({...settingsForm, health_insure_title: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                    <div><label className="block text-[11px] font-bold mb-1">URL รูปประกัน</label><input type="text" value={settingsForm.health_insure_img} onChange={e => setSettingsForm({...settingsForm, health_insure_img: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                    <div className="col-span-2"><label className="block text-[11px] font-bold mb-1">คำอธิบาย ประกันอุบัติเหตุ</label><input type="text" value={settingsForm.health_insure_desc} onChange={e => setSettingsForm({...settingsForm, health_insure_desc: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  </div>
                </>
              )}

              {settingsModalType === 'map' && (
                <>
                  <div><label className="block text-[11px] font-bold mb-1">หัวข้อ แผนที่</label><input type="text" value={settingsForm.map_title} onChange={e => setSettingsForm({...settingsForm, map_title: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">รายละเอียด แผนที่</label><input type="text" value={settingsForm.map_desc} onChange={e => setSettingsForm({...settingsForm, map_desc: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">URL รูปแผนที่</label><input type="text" value={settingsForm.map_img} onChange={e => setSettingsForm({...settingsForm, map_img: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                </>
              )}

              {settingsModalType === 'social' && (
                <>
                  <div><label className="block text-[11px] font-bold mb-1">หัวข้อ โซเชียล</label><input type="text" value={settingsForm.social_title} onChange={e => setSettingsForm({...settingsForm, social_title: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                  <div><label className="block text-[11px] font-bold mb-1">คำบรรยาย โซเชียล</label><input type="text" value={settingsForm.social_desc} onChange={e => setSettingsForm({...settingsForm, social_desc: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white" /></div>
                </>
              )}
            </div>

            <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
              <button type="button" onClick={() => setIsSettingsModalOpen(false)} className="px-5 py-2.5 rounded-full text-slate-600 font-bold bg-slate-200 hover:bg-slate-300 text-sm">ยกเลิก</button>
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md text-sm">{isSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}</button>
            </div>
          </motion.form>
        </div>
      )}
      </AnimatePresence>

      {/* 📌 Modal 3: ฟอร์มจัดการ JSON Arrays (เพิ่ม/แก้ไขการ์ดย่อยแบบฟอร์มกรอกง่ายๆ) */}
      <AnimatePresence>
      {jsonModalState.isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.form onSubmit={handleSaveJsonItem} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2rem] w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-extrabold text-slate-900">
                {jsonModalState.index >= 0 ? '✏️ แก้ไขข้อมูลการ์ด' : '✨ เพิ่มข้อมูลการ์ดใหม่'}
              </h3>
              <button type="button" onClick={() => setJsonModalState({ isOpen: false, field: '', index: -1, data: {} })} className="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              
              {/* ฟอร์มที่นั่งสอบ */}
              {jsonModalState.field === 'exam_links' && (
                <>
                  <div><label className="text-xs font-bold mb-1 block text-slate-600">ชื่อคณะ/หน่วยงาน</label><input required className="w-full p-3 border border-slate-200 rounded-xl" value={jsonModalState.data.faculty || ''} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, faculty: e.target.value}}))} /></div>
                  <div><label className="text-xs font-bold mb-1 block text-slate-600">URL ระบบตรวจสอบที่นั่ง</label><input required type="url" className="w-full p-3 border border-slate-200 rounded-xl" value={jsonModalState.data.url || ''} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, url: e.target.value}}))} /></div>
                  <div><label className="text-xs font-bold mb-1 block text-slate-600">ธีมสีของไอคอน</label>
                    <select className="w-full p-3 border border-slate-200 rounded-xl bg-white" value={jsonModalState.data.theme || 'blue'} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, theme: e.target.value}}))}>
                      {EXAM_THEMES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* ฟอร์มทุนการศึกษา */}
              {jsonModalState.field === 'scholarship_links' && (
                <>
                  <div><label className="text-xs font-bold mb-1 block text-slate-600">หัวข้อทุน</label><input required className="w-full p-3 border border-slate-200 rounded-xl" value={jsonModalState.data.title || ''} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, title: e.target.value}}))} /></div>
                  <div><label className="text-xs font-bold mb-1 block text-slate-600">รายละเอียด</label><input required className="w-full p-3 border border-slate-200 rounded-xl" value={jsonModalState.data.desc || ''} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, desc: e.target.value}}))} /></div>
                  <div><label className="text-xs font-bold mb-1 block text-slate-600">URL ลิงก์รายละเอียด</label><input required type="url" className="w-full p-3 border border-slate-200 rounded-xl" value={jsonModalState.data.url || ''} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, url: e.target.value}}))} /></div>
                  <div><label className="text-xs font-bold mb-1 block text-slate-600">ธีมสี</label>
                    <select className="w-full p-3 border border-slate-200 rounded-xl bg-white" value={jsonModalState.data.color || 'blue'} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, color: e.target.value}}))}>
                      {THEME_COLORS.map(c => <option key={c.baseColor} value={c.baseColor}>{c.label}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* ฟอร์มซอฟต์แวร์ */}
              {jsonModalState.field === 'software_list' && (
                <>
                  <div><label className="text-xs font-bold mb-1 block text-slate-600">ชื่อ Software</label><input required className="w-full p-3 border border-slate-200 rounded-xl" value={jsonModalState.data.name || ''} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, name: e.target.value}}))} /></div>
                  <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 mt-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-2">อัปโหลดรูปภาพโลโก้</label>
                    <input type="file" accept="image/*" onChange={e => setUploadFile(e.target.files[0])} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    <div className="mt-3">
                      <label className="text-[11px] font-bold text-slate-600">หรือวางลิงก์รูปภาพ (URL)</label>
                      <input type="url" value={jsonModalState.data.img || ''} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, img: e.target.value}}))} className="w-full mt-1 p-2 border border-slate-200 rounded-xl text-sm bg-white" />
                    </div>
                  </div>
                </>
              )}

              {/* ฟอร์ม IT Clinic */}
              {jsonModalState.field === 'it_clinic_table' && (
                <>
                  <div><label className="text-xs font-bold mb-1 block text-slate-600">ชื่อ Software</label><input required className="w-full p-3 border border-slate-200 rounded-xl" value={jsonModalState.data.name || ''} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, name: e.target.value}}))} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold mb-1 block text-slate-600">ส่วนตัว</label>
                      <select className="w-full p-3 border border-slate-200 rounded-xl bg-white" value={jsonModalState.data.private || 'YES'} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, private: e.target.value}}))}>
                        <option value="YES">รองรับ (YES)</option><option value="NO">ไม่รองรับ (NO)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold mb-1 block text-slate-600">อุปกรณ์ มจพ.</label>
                      <select className="w-full p-3 border border-slate-200 rounded-xl bg-white" value={jsonModalState.data.kmutnb || 'YES'} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, kmutnb: e.target.value}}))}>
                        <option value="YES">รองรับ (YES)</option><option value="NO">ไม่รองรับ (NO)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* ฟอร์ม Facebook / Instagram */}
              {(jsonModalState.field === 'facebook_pages' || jsonModalState.field === 'instagram_pages') && (
                <>
                  <div><label className="text-xs font-bold mb-1 block text-slate-600">ชื่อเพจ / ชื่อช่อง</label><input required className="w-full p-3 border border-slate-200 rounded-xl" value={jsonModalState.data.name || ''} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, name: e.target.value}}))} /></div>
                  <div><label className="text-xs font-bold mb-1 block text-slate-600">URL ลิงก์ไปยังเพจ</label><input required type="url" className="w-full p-3 border border-slate-200 rounded-xl" value={jsonModalState.data.url || ''} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, url: e.target.value}}))} /></div>
                </>
              )}

            </div>
            
            <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
              <button type="button" onClick={() => setJsonModalState({ isOpen: false, field: '', index: -1, data: {} })} className="px-5 py-2.5 rounded-full text-slate-600 font-bold bg-slate-200 hover:bg-slate-300 text-sm">ยกเลิก</button>
              <button type="button" onClick={handleSaveJsonItem} disabled={isSaving} className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md text-sm">{isSaving ? 'บันทึก...' : 'บันทึกข้อมูล'}</button>
            </div>
          </motion.form>
        </div>
      )}
      </AnimatePresence>

    </div>
  );
}