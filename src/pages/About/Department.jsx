import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuroraBackground, SectionBanner } from "../../components/ThemeElements";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../supabaseClient";

// 📌 นำเขตรูปภาพและโลโก้
import kmutnbLogo from "../../assets/Symbol/KMUTNB_Logo.png";
import appliedScienceLogo from "../../assets/Symbol/AppliedScience_Logo.png";
import imiLogo from "../../assets/Symbol/IMI_Logo.png";

import lab01 from '../../assets/Lab/Lab01.jpg';
import lab02 from '../../assets/Lab/Lab02.jpg';
import lab03 from '../../assets/Lab/Lab03.jpg';
import lab04 from '../../assets/Lab/Lab04.jpg';
import lab05 from '../../assets/Lab/Lab05.jpg'; 
import lab06 from '../../assets/Lab/Lab06.jpg';

// ==========================================
// 📌 Components ย่อย
// ==========================================
const FadeInSection = ({ children, delay = "0s", className = "" }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setVisible(true); });
    }, { threshold: 0.12 });
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={domRef} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`} style={{ transitionDelay: delay }}>
      {children}
    </div>
  );
};

const LightHolographicBeams = () => (
  <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none opacity-80 z-0">
    <style>{`
      @keyframes holo-sweep { 0% { transform: translateX(-150%) skewX(-20deg); } 100% { transform: translateX(250%) skewX(-20deg); } }
      .holo-beam-base { position: absolute; top: -20%; bottom: -20%; filter: blur(20px); }
      .holo-beam-1 { width: 60%; background: linear-gradient(90deg, transparent 0%, rgba(200, 180, 255, 0.25) 30%, rgba(160, 210, 255, 0.2) 50%, rgba(255, 180, 210, 0.25) 70%, transparent 100%); animation: holo-sweep 8s infinite ease-in-out; }
      .holo-beam-2 { width: 40%; background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(220, 230, 255, 0.3) 60%, transparent 100%); animation: holo-sweep 6s infinite linear; animation-delay: 2.5s; }
    `}</style>
    <div className="holo-beam-base holo-beam-1"></div>
    <div className="holo-beam-base holo-beam-2"></div>
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjYpIi8+PC9zdmc+')] opacity-40 mix-blend-overlay"></div>
  </div>
);

const EMPTY_FORM = { id: '', category: 'lab', sub_category: '', title: '', subtitle: '', detail1: '', detail2: '', detail3: '', detail4: '', sort_order: 1 };

// ==========================================
// 📌 Component หลัก
// ==========================================
export default function Department() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // สไลด์ห้อง Lab
  const labImages = [lab01, lab02, lab03, lab04, lab05, lab06];
  const [currentLabIdx, setCurrentLabIdx] = useState(0);
  const nextLab = () => setCurrentLabIdx((prev) => (prev + 1) % labImages.length);
  const prevLab = () => setCurrentLabIdx((prev) => (prev - 1 + labImages.length) % labImages.length);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // สิทธิ์จัดการ
  const canManage = Boolean(
    user && (
      ['admin', 'faculty', 'teacher', 'staff'].includes(String(user.role || '').toLowerCase()) ||
      user.isAdmin === true ||
      String(user.email || '').endsWith('@sci.kmutnb.ac.th')
    )
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('department_content').select('*').order('sort_order', { ascending: true });
      if (data) setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // จัดกลุ่มข้อมูล
  const { objectiveData, groupData, bangkokLabs, rayongLabs, timelineData, careersData } = useMemo(() => {
    return {
      objectiveData: items.filter(i => i.category === 'objective').sort((a, b) => a.sort_order - b.sort_order),
      groupData: items.filter(i => i.category === 'group').sort((a, b) => a.sort_order - b.sort_order),
      bangkokLabs: items.filter(i => i.category === 'lab' && i.sub_category === 'bangkok').sort((a, b) => a.sort_order - b.sort_order),
      rayongLabs: items.filter(i => i.category === 'lab' && i.sub_category === 'rayong').sort((a, b) => a.sort_order - b.sort_order),
      timelineData: items.filter(i => i.category === 'timeline').sort((a, b) => a.sort_order - b.sort_order),
      careersData: items.filter(i => i.category === 'career').sort((a, b) => a.sort_order - b.sort_order),
    };
  }, [items]);

  // ฟังก์ชัน Form
  const openModal = (category, item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ ...EMPTY_FORM, category });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!canManage) return;
    try {
      setSubmitting(true);
      const payload = {
        category: formData.category, sub_category: formData.sub_category,
        title: formData.title, subtitle: formData.subtitle,
        detail1: formData.detail1, detail2: formData.detail2,
        detail3: formData.detail3, detail4: formData.detail4,
        sort_order: Number(formData.sort_order)
      };

      if (editingItem && editingItem.id) {
        await supabase.from('department_content').update(payload).eq('id', editingItem.id);
      } else {
        await supabase.from('department_content').insert([payload]);
      }
      setShowModal(false);
      await fetchData();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!canManage || !window.confirm(`ยืนยันการลบ?`)) return;
    await supabase.from('department_content').delete().eq('id', item.id);
    await fetchData();
  };

  // Styles
  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(147,51,234,0.08)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden";
  const sectionWrapperGlass = "rounded-[2.5rem] md:rounded-[3rem] bg-white/50 backdrop-blur-2xl border border-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8 md:p-12 relative overflow-hidden";

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />
      
      <div className="relative z-10 w-full px-4 md:px-6">
        <div className="max-w-[1250px] mx-auto flex flex-col gap-10 md:gap-14 pt-2">

          {/* ---------------- Header Section ---------------- */}
          <FadeInSection delay="0.1s">
            <div className="text-center max-w-4xl mx-auto pt-2 pb-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
                เกี่ยวกับสาขาวิชา
              </h1>
              <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
                สาขาวิชาวิศวกรรมชีวการแพทย์ <br/>
                ภาควิชาฟิสิกส์อุตสาหกรรมและอุปกรณ์การแพทย์ คณะวิทยาศาสตร์ประยุกต์ <br className="hidden md:block"/>
                มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
              </p>
            </div>
          </FadeInSection>

          {/* ---------------- 1. รายละเอียดหลักสูตร & แนวทาง ---------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <FadeInSection delay="0.2s" className="h-full">
              <div className={`p-8 sm:p-10 md:p-12 flex flex-col h-full ${bentoGlass}`}>
                <LightHolographicBeams />
                <div className="absolute left-0 top-20 bottom-20 w-1.5 bg-gradient-to-b from-rose-400 to-purple-500 rounded-r-lg z-10"></div>
                
                <div className="flex items-center gap-4 mb-8 pl-2 z-10 relative">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-800 shadow-inner border border-slate-200">
                    <svg className="w-7 h-7 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">รายละเอียดหลักสูตร</h2>
                </div>

                <div className="flex flex-col gap-5 flex-1 z-10 relative pl-2">
                  <div className="bg-white/70 backdrop-blur-md rounded-[1.5rem] p-6 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">ชื่อหลักสูตร</p>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-extrabold">ก่อตั้งเมื่อ พ.ศ. 2557</span>
                    </div>
                    <p className="text-lg font-extrabold text-slate-900 mb-1">วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมชีวการแพทย์</p>
                    <p className="text-[14px] text-slate-600 font-medium">Bachelor of Engineering Program in Biomedical Engineering</p>
                  </div>

                  <div className="bg-white/70 backdrop-blur-md rounded-[1.5rem] p-6 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">ชื่อปริญญา</p>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-base sm:text-lg font-extrabold text-slate-900">วิศวกรรมศาสตรบัณฑิต (วิศวกรรมชีวการแพทย์)</p>
                      <span className="text-slate-800 font-bold bg-slate-100 px-3 py-0.5 rounded-lg text-xs border border-slate-200 shrink-0">วศ.บ.</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13px] sm:text-[14px] text-slate-600 font-medium">Bachelor of Engineering (Biomedical Engineering)</p>
                      <span className="text-slate-800 font-bold text-[14px] shrink-0">B.Eng.</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-6 bg-white/70 backdrop-blur-md rounded-[1.5rem] p-5 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-center">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">รูปแบบหลักสูตร</p>
                      <p className="text-[15px] font-extrabold text-slate-900 mb-1">ปริญญาตรี 4 ปี</p>
                      <p className="text-[12px] text-slate-600 leading-relaxed font-medium">เสริมทักษะภาษาอังกฤษไม่น้อยกว่าร้อยละ 20 ของหน่วยกิตรวม</p>
                    </div>
                    <div className="sm:col-span-3 bg-gradient-to-br from-purple-700 to-rose-600 rounded-[1.5rem] p-5 flex flex-col justify-center items-center text-center shadow-lg border border-purple-500/40 relative overflow-hidden">
                      <p className="text-[10px] font-bold text-purple-100 uppercase tracking-widest mb-1 relative z-10">ก่อตั้งปี พ.ศ.</p>
                      <p className="text-3xl font-black text-white leading-none tracking-tight relative z-10">2557</p>
                      <span className="text-[10px] font-semibold text-purple-100 mt-1">ค.ศ. 2014</span>
                    </div>
                    <div className="sm:col-span-3 bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-900 rounded-[1.5rem] p-5 flex flex-col justify-center items-center text-center shadow-lg border border-indigo-700/50 relative overflow-hidden">
                      <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1 relative z-10">หน่วยกิตรวม</p>
                      <p className="text-3xl font-black text-white leading-none tracking-tight relative z-10">146</p>
                      <span className="text-[10px] font-semibold text-indigo-200 mt-1">หน่วยกิต</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay="0.3s" className="h-full">
              <div className={`p-8 sm:p-10 md:p-12 flex flex-col h-full ${bentoGlass}`}>
                <LightHolographicBeams />
                <div className="absolute left-0 top-20 bottom-20 w-1.5 bg-gradient-to-b from-rose-400 to-purple-500 rounded-r-lg z-10"></div>
                
                <div className="flex items-center justify-between mb-8 pl-2 z-10 relative">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-800 shadow-inner border border-slate-200">
                      <svg className="w-7 h-7 animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">แนวทางสาขาวิชา</h2>
                  </div>
                  {canManage && <button onClick={() => openModal('objective')} className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-bold shadow hover:bg-purple-200">+ เพิ่มวัตถุประสงค์</button>}
                </div>

                <div className="flex flex-col flex-1 pl-2 z-10 relative">
                  <div className="mb-6 bg-white/70 backdrop-blur-md rounded-[1.5rem] p-6 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">ปรัชญาสาขาวิชา</p>
                    <p className="text-[17px] sm:text-[18px] font-extrabold text-slate-900 leading-relaxed italic">
                      "ผลิตบุคลากรที่มีความรู้ ความสามารถด้านวิศวกรรมชีวการแพทย์เพื่อพัฒนาคน พัฒนาเทคโนโลยีทางด้านการรักษาพยาบาล และการดูแลสุขภาพ"
                    </p>
                  </div>

                  <div className="bg-white/70 backdrop-blur-md rounded-[1.5rem] p-6 sm:p-8 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex-1 relative">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-5">วัตถุประสงค์หลัก</p>
                    {loading ? <p className="text-slate-400 text-sm">กำลังโหลด...</p> : (
                      <ul className="space-y-5">
                        {objectiveData.map((obj, idx) => (
                          <li key={obj.id} className="flex items-start gap-4 relative group pr-12">
                            <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[12px] shrink-0 mt-0.5 shadow-sm">{idx + 1}</div>
                            {obj.detail1 ? (
                              <p className="text-[14px] sm:text-[15px] text-slate-700 font-medium leading-relaxed">{obj.detail1}</p>
                            ) : (
                              <p className="text-[14px] text-slate-300 italic">(ไม่มีข้อความ)</p>
                            )}
                            
                            {canManage && (
                              <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex flex-col gap-1">
                                <button onClick={() => openModal('objective', obj)} className="text-[9px] bg-slate-200 text-slate-700 px-2 py-1 rounded">แก้ไข</button>
                                <button onClick={() => handleDelete(obj)} className="text-[9px] bg-rose-100 text-rose-700 px-2 py-1 rounded">ลบ</button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>

          {/* ---------------- 2. หน่วยงานต้นสังกัด ---------------- */}
          <section>
            <FadeInSection delay="0.2s">
              <div className={sectionWrapperGlass}>
                <div className="mb-10 max-w-4xl mx-auto">
                  <SectionBanner text="หน่วยงานต้นสังกัด" variant="website" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`p-8 md:p-10 flex flex-col items-center text-center h-full ${bentoGlass}`}>
                    <LightHolographicBeams />
                    <img src={kmutnbLogo} alt="KMUTNB Logo" className="w-24 h-24 object-contain mb-6 drop-shadow-sm z-10" />
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 z-10">มหาวิทยาลัย</p>
                    <p className="text-[17px] font-extrabold text-slate-900 leading-snug mb-2 z-10">มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ</p>
                    <p className="text-[13px] font-medium text-slate-600 z-10">King Mongkut's University of Technology North Bangkok</p>
                  </div>
                  <div className={`p-8 md:p-10 flex flex-col items-center text-center h-full ${bentoGlass}`}>
                    <LightHolographicBeams />
                    <img src={appliedScienceLogo} alt="Applied Science Logo" className="w-24 h-24 object-contain mb-6 drop-shadow-sm z-10" />
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 z-10">คณะ</p>
                    <p className="text-[17px] font-extrabold text-slate-900 leading-snug mb-2 z-10">คณะวิทยาศาสตร์ประยุกต์</p>
                    <p className="text-[13px] font-medium text-slate-600 z-10">Faculty of Applied Science</p>
                  </div>
                  <div className={`p-8 md:p-10 flex flex-col items-center text-center h-full ${bentoGlass}`}>
                    <LightHolographicBeams />
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-1.5 mb-6 shadow-sm border border-slate-100 z-10">
                      <img src={imiLogo} alt="IMI Logo" className="w-full h-full object-contain rounded-full" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 z-10">ภาควิชา</p>
                    <p className="text-[17px] font-extrabold text-slate-900 leading-snug mb-2 z-10">ภาควิชาฟิสิกส์อุตสาหกรรมและอุปกรณ์การแพทย์</p>
                    <p className="text-[13px] font-medium text-slate-600 z-10">Department of Industrial Physics and Medical Instrumentation</p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </section>

          {/* ---------------- 3. ภาพรวมการเรียนการสอน (Timeline) ย้ายมาไว้ตรงนี้ ---------------- */}
          <section>
            <FadeInSection delay="0.2s">
              <div className={`p-8 sm:p-10 md:p-16 text-center ${bentoGlass}`}>
                <LightHolographicBeams />
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-14 z-10 relative max-w-4xl mx-auto">
                  <div className="flex-1 w-full"><SectionBanner text="ภาพรวมการเรียนการสอน" variant="scholarship" /></div>
                  {canManage && <button onClick={() => openModal('timeline')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow hover:bg-purple-700 shrink-0">+ เพิ่มชั้นปี</button>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative max-w-5xl mx-auto z-10">
                  {/* เส้นเชื่อมหลังตัวเลข */}
                  <div className="hidden md:block absolute top-[36px] left-[12.5%] right-[12.5%] h-1 bg-slate-200/60 -z-10 rounded-full"></div>

                  {loading ? <p className="col-span-4 text-slate-400">กำลังโหลด...</p> : timelineData.map((item) => (
                    <div key={item.id} className="flex flex-col items-center text-center relative z-10 group">
                      
                      <div className={`w-16 h-16 text-2xl font-black rounded-3xl flex items-center justify-center mb-6 shadow-sm transition-all duration-300 ${
                        item.detail3 === 'TRUE' 
                          ? 'bg-gradient-to-br from-slate-800 to-indigo-900 text-white shadow-[0_8px_20px_rgba(49,46,129,0.25)] border border-slate-700' 
                          : 'bg-white/80 backdrop-blur-md border-4 border-slate-200 text-slate-800 shadow-[0_0_15px_rgba(0,0,0,0.03)] hover:scale-110'
                      }`}>
                        {item.sub_category}
                      </div>
                      
                      <h3 className="font-extrabold text-[18px] mb-3 text-slate-900">ปีที่ {item.sub_category}: {item.title}</h3>
                      <p className="text-[14px] text-slate-600 leading-relaxed font-medium mb-6 px-2">{item.detail1}</p>
                      
                      {item.detail3 === 'TRUE' ? (
                        <div className="mt-auto w-full">
                          <p className="text-[12px] font-bold text-white bg-gradient-to-r from-slate-800 to-indigo-900 border border-slate-700 rounded-xl py-2 px-3 shadow-sm shadow-indigo-900/20 cursor-default">
                            🎓 สำเร็จการศึกษา
                          </p>
                        </div>
                      ) : (
                        <div className="mt-auto w-full">
                          <p className="text-[12px] font-bold text-slate-700 flex items-center justify-center gap-2 border border-slate-200/80 bg-white/80 backdrop-blur-sm rounded-xl py-2 px-3 shadow-sm hover:border-slate-300 transition-colors cursor-default">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_5px_rgba(244,63,94,0.5)]"></span> ฤดูร้อน: {item.detail2 || 'FALSE'}
                          </p>
                        </div>
                      )}

                      {canManage && (
                        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 flex flex-col gap-1 z-20">
                          <button onClick={() => openModal('timeline', item)} className="text-[9px] bg-slate-200 text-slate-700 px-2 py-1 rounded">แก้ไข</button>
                          <button onClick={() => handleDelete(item)} className="text-[9px] bg-rose-100 text-rose-700 px-2 py-1 rounded">ลบ</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>
          </section>

          {/* ---------------- 4. การแบ่งกลุ่มสาขาวิชา ---------------- */}
          <section>
            <FadeInSection delay="0.2s">
              <div className={sectionWrapperGlass}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 max-w-4xl mx-auto">
                  <div className="flex-1 w-full"><SectionBanner text="การแบ่งกลุ่มสาขาวิชา" variant="calendar" /></div>
                  {canManage && <button onClick={() => openModal('group')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-purple-700 shrink-0">+ เพิ่มกลุ่มสาขา</button>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {loading ? <p className="col-span-3 text-center text-slate-400">กำลังโหลด...</p> : groupData.map(group => (
                    <div key={group.id} className={`p-8 md:p-10 h-full ${bentoGlass} group/card`}>
                      <LightHolographicBeams />
                      <div className="w-14 h-14 bg-slate-100 backdrop-blur-sm text-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-200 z-10 relative">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={group.detail2 || "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"}></path></svg>
                      </div>
                      <h3 className="text-[20px] font-extrabold text-slate-900 mb-1 z-10 relative">{group.title}</h3>
                      <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4 z-10 relative">{group.subtitle}</p>
                      <p className="text-[15px] text-slate-600 leading-relaxed font-medium z-10 relative">{group.detail1}</p>
                      
                      {canManage && (
                        <div className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 flex gap-2 z-20">
                          <button onClick={() => openModal('group', group)} className="text-[10px] bg-white text-slate-700 border px-2 py-1 rounded font-bold shadow-sm">แก้ไข</button>
                          <button onClick={() => handleDelete(group)} className="text-[10px] bg-rose-50 text-rose-600 border px-2 py-1 rounded font-bold shadow-sm">ลบ</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>
          </section>

          {/* ---------------- 5. ห้องปฏิบัติการบริการ ---------------- */}
          <section>
            <FadeInSection delay="0.2s">
              <div className={sectionWrapperGlass}>
                <div className="mb-10 max-w-4xl mx-auto">
                  <SectionBanner text="ห้องปฏิบัติการบริการ" variant="exam" />
                </div>

                {/* สไลด์ภาพบรรยากาศห้องปฏิบัติการ (แบบเดิม) */}
                <div className="relative w-full h-[260px] sm:h-[360px] md:h-[460px] rounded-[2rem] overflow-hidden bg-slate-900 mb-10 shadow-md">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentLabIdx}
                      src={labImages[currentLabIdx]}
                      initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt={`Lab ${currentLabIdx + 1}`}
                    />
                  </AnimatePresence>
                  
                  <button onClick={prevLab} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-colors z-10 border border-white/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <button onClick={nextLab} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-colors z-10 border border-white/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/40 px-3 py-2 rounded-full backdrop-blur-sm">
                    {labImages.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentLabIdx(idx)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentLabIdx === idx ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`} />
                    ))}
                  </div>
                </div>

                {/* รายการห้อง Lab */}
                <div className="space-y-8">
                  {/* กรุงเทพฯ */}
                  <div className="bg-white/90 rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 mb-6 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="w-1.5 h-7 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full"></span>
                        <div>
                          <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">วิทยาเขตกรุงเทพฯ (มจพ. พระนครเหนือ)</h3>
                          <p className="text-xs sm:text-sm text-slate-500 font-medium">ห้องปฏิบัติการเฉพาะทางภายในพื้นที่มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ กรุงเทพฯ</p>
                        </div>
                      </div>
                      <span className="self-start sm:self-center px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-extrabold shrink-0">
                        {bangkokLabs.length} ห้องปฏิบัติการ
                      </span>
                    </div>

                    {canManage && <button onClick={() => openModal('lab')} className="absolute top-6 right-6 text-[10px] bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold shadow hover:bg-slate-700">+ เพิ่ม</button>}

                    {loading ? <p className="text-slate-400">กำลังโหลด...</p> : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bangkokLabs.map((lab, idx) => (
                          <div key={lab.id} className="p-5 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-100 hover:border-purple-200 transition-all duration-300 shadow-sm flex items-start gap-4 relative group/lab">
                            
                            {/* ดึง Gradient ตัวเลขจาก SQL (detail3) ถ้าไม่มีให้ใช้สีเทา */}
                            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${lab.detail3 || 'from-slate-400 to-slate-500'} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm`}>
                              {idx + 1}
                            </div>
                            
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                {/* ดึงสีป้าย Badge จาก SQL (detail4) */}
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${lab.detail4 || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                                  {lab.subtitle}
                                </span>
                              </div>
                              <h4 className="text-base font-extrabold text-slate-900 leading-snug mb-1">{lab.title}</h4>
                              <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-rose-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                <span>{lab.detail2}</span>
                              </p>
                            </div>

                            {canManage && (
                              <div className="absolute top-3 right-3 opacity-0 group-hover/lab:opacity-100 flex flex-col gap-1">
                                <button onClick={() => openModal('lab', lab)} className="text-[9px] bg-slate-200 text-slate-700 px-2 py-1 rounded">แก้ไข</button>
                                <button onClick={() => handleDelete(lab)} className="text-[9px] bg-rose-100 text-rose-700 px-2 py-1 rounded">ลบ</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ระยอง */}
                  <div className="bg-white/90 rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 mb-6 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="w-1.5 h-7 bg-gradient-to-b from-rose-500 to-purple-600 rounded-full"></span>
                        <div>
                          <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">วิทยาเขตระยอง (มจพ. ระยอง)</h3>
                          <p className="text-xs sm:text-sm text-slate-500 font-medium">ศูนย์ความร่วมมือและวิจัยด้านปัญญาประดิษฐ์ทางการแพทย์</p>
                        </div>
                      </div>
                      <span className="self-start sm:self-center px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-extrabold shrink-0">
                        {rayongLabs.length} ศูนย์ปฏิบัติการ
                      </span>
                    </div>

                    {loading ? <p className="text-slate-400">กำลังโหลด...</p> : (
                      <div className="grid grid-cols-1 gap-4">
                        {rayongLabs.map((lab, idx) => (
                          <div key={lab.id} className="p-5 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-100 hover:border-purple-200 transition-all duration-300 shadow-sm flex items-start gap-4 relative group/lab">
                            
                            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${lab.detail3 || 'from-slate-400 to-slate-500'} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm`}>
                              {idx + 1}
                            </div>
                            
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${lab.detail4 || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                                  {lab.subtitle}
                                </span>
                              </div>
                              <h4 className="text-base font-extrabold text-slate-900 leading-snug mb-1">{lab.title}</h4>
                              <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-rose-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                <span>{lab.detail2}</span>
                              </p>
                            </div>

                            {canManage && (
                              <div className="absolute top-3 right-3 opacity-0 group-hover/lab:opacity-100 flex flex-col gap-1">
                                <button onClick={() => openModal('lab', lab)} className="text-[9px] bg-slate-200 text-slate-700 px-2 py-1 rounded">แก้ไข</button>
                                <button onClick={() => handleDelete(lab)} className="text-[9px] bg-rose-100 text-rose-700 px-2 py-1 rounded">ลบ</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </FadeInSection>
          </section>

          {/* ---------------- 6. โอกาสทางวิชาชีพ (Careers) ---------------- */}
          <section>
            <FadeInSection delay="0.2s">
              <div className={sectionWrapperGlass}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 max-w-4xl mx-auto">
                  <div className="flex-1 w-full"><SectionBanner text="โอกาสทางวิชาชีพ" variant="website" /></div>
                  {canManage && <button onClick={() => openModal('career')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-purple-700 shrink-0">+ เพิ่มอาชีพ</button>}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
                  {loading ? <p className="col-span-5 text-center text-slate-400">กำลังโหลด...</p> : careersData.map((career, idx) => (
                    <FadeInSection key={career.id} delay={`${(idx % 5) * 0.08}s`} className="h-full">
                      <div className={`p-6 flex flex-col items-center text-center h-full ${bentoGlass} hover:-translate-y-2 group/card relative`}>
                        <span className="text-[11px] font-black text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full mb-3">อาชีพที่ {career.sub_category}</span>
                        
                        <div className="w-13 h-13 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-800 mb-4 shadow-sm border border-slate-200 p-3">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={career.detail1 || "M12 4v16m8-8H4"}></path></svg>
                        </div>
                        
                        <h3 className="text-[15px] font-extrabold text-slate-900 mb-1.5 leading-snug">{career.title}</h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-auto">{career.subtitle}</p>

                        {canManage && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 flex gap-1 bg-white/90 p-1 rounded-lg shadow-sm">
                            <button onClick={() => openModal('career', career)} className="text-[9px] text-purple-600 font-bold px-1.5 hover:underline">แก้ไข</button>
                            <button onClick={() => handleDelete(career)} className="text-[9px] text-rose-600 font-bold px-1.5 hover:underline">ลบ</button>
                          </div>
                        )}
                      </div>
                    </FadeInSection>
                  ))}
                </div>
              </div>
            </FadeInSection>
          </section>

        </div>
      </div>

      {/* ---------------- 🔒 Modal Form ---------------- */}
      <AnimatePresence>
        {canManage && showModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.form onSubmit={handleSave} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative z-10 bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2rem] p-6 shadow-2xl border border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900 mb-4 pb-3 border-b">{editingItem ? `แก้ไขข้อมูล (${formData.category})` : `เพิ่มข้อมูลใหม่ (${formData.category})`}</h3>
              <div className="space-y-4">
                
                <div><label className="text-[11px] font-bold">ลำดับการเรียง (ตัวเลข)</label><input required type="number" className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: e.target.value})} /></div>

                {formData.category === 'objective' && (
                  <>
                    <div><label className="text-[11px] font-bold">ข้อที่ (ตัวเลข)</label><input required className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.sub_category} onChange={e => setFormData({...formData, sub_category: e.target.value})} /></div>
                    <div><label className="text-[11px] font-bold">ข้อความวัตถุประสงค์</label><textarea rows="4" className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.detail1} onChange={e => setFormData({...formData, detail1: e.target.value})} /></div>
                  </>
                )}

                {formData.category === 'group' && (
                  <>
                    <div><label className="text-[11px] font-bold">รหัสกลุ่ม (ตัวเลข)</label><input required className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.sub_category} onChange={e => setFormData({...formData, sub_category: e.target.value})} /></div>
                    <div><label className="text-[11px] font-bold">ชื่อกลุ่ม (ภาษาไทย)</label><input required className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                    <div><label className="text-[11px] font-bold">ชื่อกลุ่ม (EN)</label><input className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} /></div>
                    <div><label className="text-[11px] font-bold">รายละเอียด</label><textarea rows="3" className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.detail1} onChange={e => setFormData({...formData, detail1: e.target.value})} /></div>
                    <div><label className="text-[11px] font-bold">SVG Icon Path</label><input className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.detail2} onChange={e => setFormData({...formData, detail2: e.target.value})} /></div>
                  </>
                )}

                {formData.category === 'lab' && (
                  <>
                    <div><label className="text-[11px] font-bold">วิทยาเขต (bangkok/rayong)</label><select required className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.sub_category} onChange={e => setFormData({...formData, sub_category: e.target.value})}><option value="bangkok">กรุงเทพฯ</option><option value="rayong">ระยอง</option></select></div>
                    <div><label className="text-[11px] font-bold">ชื่อห้องปฏิบัติการ</label><input required className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                    <div><label className="text-[11px] font-bold">ป้าย (ชั้น... อาคาร...)</label><input className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} /></div>
                    <div><label className="text-[11px] font-bold">สถานที่เต็มใต้ชื่อ</label><input className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.detail2} onChange={e => setFormData({...formData, detail2: e.target.value})} /></div>
                    <div><label className="text-[11px] font-bold">Gradient สีวงกลม (Tailwind: from-X to-Y)</label><input className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.detail3} placeholder="from-purple-600 to-indigo-600" onChange={e => setFormData({...formData, detail3: e.target.value})} /></div>
                    <div><label className="text-[11px] font-bold">สีพื้นหลังป้าย/ข้อความ (Tailwind)</label><input className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.detail4} placeholder="bg-purple-50 text-purple-700 border-purple-200" onChange={e => setFormData({...formData, detail4: e.target.value})} /></div>
                  </>
                )}

                {formData.category === 'timeline' && (
                  <>
                    <div><label className="text-[11px] font-bold">ชั้นปี (ตัวเลข)</label><input required type="number" className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.sub_category} onChange={e => setFormData({...formData, sub_category: e.target.value})} /></div>
                    <div><label className="text-[11px] font-bold">หัวข้อ (เช่น ปูพื้นฐาน)</label><input required className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                    <div><label className="text-[11px] font-bold">รายละเอียด</label><textarea className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.detail1} onChange={e => setFormData({...formData, detail1: e.target.value})} /></div>
                    <div><label className="text-[11px] font-bold">กิจกรรมฤดูร้อน (ถ้ามี)</label><input className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.detail2} onChange={e => setFormData({...formData, detail2: e.target.value})} /></div>
                    <div><label className="text-[11px] font-bold">สำเร็จการศึกษา (TRUE/FALSE)</label><select className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.detail3} onChange={e => setFormData({...formData, detail3: e.target.value})}><option value="FALSE">ไม่ใช่ (FALSE)</option><option value="TRUE">ใช่ (TRUE)</option></select></div>
                  </>
                )}

                {formData.category === 'career' && (
                  <>
                    <div><label className="text-[11px] font-bold">ลำดับที่ (ตัวเลข)</label><input required type="number" className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.sub_category} onChange={e => setFormData({...formData, sub_category: e.target.value})} /></div>
                    <div><label className="text-[11px] font-bold">ชื่ออาชีพ (ภาษาไทย)</label><input required className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                    <div><label className="text-[11px] font-bold">ชื่ออาชีพ (ภาษาอังกฤษ)</label><input className="w-full mt-1 p-2 border rounded-xl text-sm" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} /></div>
                    <div><label className="text-[11px] font-bold">SVG Path ของไอคอน</label><textarea className="w-full mt-1 p-2 border rounded-xl text-xs" rows="3" value={formData.detail1} onChange={e => setFormData({...formData, detail1: e.target.value})} /></div>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200">ยกเลิก</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50">บันทึกข้อมูล</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}