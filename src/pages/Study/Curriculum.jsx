import React, { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "../../supabaseClient";

import { AuroraBackground, SectionBanner } from "../../components/ThemeElements";
import { useAuth } from "../../contexts/AuthContext";
import bmeFlowImage from "../../assets/bme_flow.png"; 

// ==========================================
// 📌 ธีมสีสำหรับหมวดหมู่วิชา
// ==========================================
const CATEGORY_COLORS = [
  { value: 'pink', label: '💗 สีชมพู (Pink)' },
  { value: 'orange', label: '🧡 สีส้ม (Orange)' },
  { value: 'yellow', label: '💛 สีเหลือง (Yellow)' },
  { value: 'green', label: '💚 สีเขียว (Green)' },
  { value: 'gray', label: '🩶 สีเทา (Gray)' },
  { value: 'purple', label: '💜 สีม่วง (Purple)' }
];

// ==========================================
// 📌 Component: ระบบ Fade-in
// ==========================================
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
// 📌 ปุ่มแก้ไข (Edit / Delete) มาตรฐาน (แสดงตลอดเวลา)
// ==========================================
const ActionButtons = ({ onEdit, onDelete, positionClass = "top-2 right-2" }) => (
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

export default function Curriculum() {
  const { user } = useAuth();
  const [activePlan, setActivePlan] = useState('normal'); 
  const [isLoading, setIsLoading] = useState(true);

  // Data States
  const [pageInfo, setPageInfo] = useState({});
  const [courseMaster, setCourseMaster] = useState({});
  const [studyPlan, setStudyPlan] = useState([]);
  const [categories, setCategories] = useState([]);

  // Admin Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'pageInfo', 'course', 'term', 'category', 'subcategory', 'mapCourseTerm', 'mapCourseSubcat'
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

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
    fetchCurriculumData();
  }, []);

  const fetchCurriculumData = async () => {
    setIsLoading(true);
    try {
      // 1. ดึงข้อมูลเพจ
      const { data: infoData } = await supabase.from('curriculum_info').select('*').eq('id', 1).maybeSingle();
      if (infoData) setPageInfo(infoData);

      // 2. ดึงข้อมูลรายวิชาทำเป็น Dictionary
      const { data: coursesData } = await supabase.from('courses').select('*');
      const coursesDict = {};
      if (coursesData) {
        coursesData.forEach(c => {
          coursesDict[c.course_id] = {
            id: c.course_id,
            nameTH: c.name_th,
            nameEN: c.name_en,
            creditText: c.credit_text,
            isEng: c.is_eng,
            prereq: c.prereq || [],
            coreq: c.coreq
          };
        });
        setCourseMaster(coursesDict);
      }

      // 3. ดึงแผนการเรียน
      const { data: yearsData } = await supabase.from('study_plan_years').select(`
          id, year_number, sort_order,
          study_plan_terms (
            id, title, term_plan, is_summer, total_credits, sort_order,
            study_plan_courses ( id, course_id, sort_order )
          )
        `).order('sort_order', { ascending: true });
      
      if (yearsData) {
        const formattedPlan = yearsData.map(year => ({
          id: year.id,
          year: `ชั้นปีที่ ${year.year_number}`,
          year_number: year.year_number,
          terms: year.study_plan_terms
            .sort((a, b) => a.sort_order - b.sort_order)
            .map(term => ({
              id: term.id,
              title: term.title,
              plan: term.term_plan,
              isSummer: term.is_summer,
              totalCredits: term.total_credits,
              courses: term.study_plan_courses
                .sort((a, b) => a.sort_order - b.sort_order)
                .map(c => ({ map_id: c.id, id: c.course_id, sort_order: c.sort_order }))
            }))
        }));
        setStudyPlan(formattedPlan);
      }

      // 4. ดึงหมวดหมู่วิชา
      const { data: catData } = await supabase.from('curriculum_categories').select(`
          id, title, total_credits, color_theme, sort_order,
          curriculum_subcategories (
            id, title, description, sort_order,
            curriculum_subcategory_courses ( id, course_id, sort_order )
          )
        `).order('sort_order', { ascending: true });

      if (catData) {
        const formattedCategories = catData.map(cat => ({
          id: cat.id,
          title: cat.title,
          totalCredits: cat.total_credits,
          color: cat.color_theme,
          sort_order: cat.sort_order,
          subCategories: cat.curriculum_subcategories
            .sort((a, b) => a.sort_order - b.sort_order)
            .map(sub => ({
              id: sub.id,
              title: sub.title,
              description: sub.description,
              sort_order: sub.sort_order,
              courses: sub.curriculum_subcategory_courses
                .sort((a, b) => a.sort_order - b.sort_order)
                .map(c => ({ map_id: c.id, id: c.course_id, sort_order: c.sort_order }))
            }))
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error("Error fetching curriculum data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorClasses = (colorName) => {
    switch(colorName) {
      case 'pink': return 'bg-[#fff0f5]/80 border-[#fbcfe8] text-[#be185d]';
      case 'orange': return 'bg-[#fff7ed]/80 border-[#fed7aa] text-[#c2410c]';
      case 'yellow': return 'bg-[#fefce8]/80 border-[#fef08a] text-[#854d0e]';
      case 'green': return 'bg-[#f0fdf4]/80 border-[#bbf7d0] text-[#15803d]';
      case 'gray': return 'bg-[#f8fafc]/80 border-[#cbd5e1] text-[#334155]';
      case 'purple': return 'bg-purple-50/80 border-purple-200 text-purple-800';
      default: return 'bg-white/80 border-slate-200 text-slate-700';
    }
  };

  const getHeaderColor = (colorName) => {
    switch(colorName) {
      case 'pink': return 'bg-gradient-to-r from-[#d81b60] to-[#ec4899]'; 
      case 'orange': return 'bg-gradient-to-r from-[#ea580c] to-[#f97316]';
      case 'yellow': return 'bg-gradient-to-r from-[#ca8a04] to-[#eab308]';
      case 'green': return 'bg-gradient-to-r from-[#059669] to-[#10b981]'; 
      case 'gray': return 'bg-gradient-to-r from-[#475569] to-[#64748b]';
      case 'purple': return 'bg-gradient-to-r from-purple-700 to-purple-500';
      default: return 'bg-gradient-to-r from-slate-700 to-slate-500';
    }
  };

  const getFullCourseInfo = (courseId) => {
    return courseMaster[courseId] || {
      id: courseId, nameTH: 'วิชาเลือก / กำลังอัปเดตข้อมูล', nameEN: '', creditText: '-', prereq: [], coreq: null, isEng: false
    };
  };

  // ==========================================
  // 📌 ฟังก์ชันจัดการ Admin (เพิ่ม/แก้/ลบ)
  // ==========================================
  const openAdminModal = (type, data = {}) => {
    setModalType(type);
    setFormData(data);
    setUploadFile(null);
    setIsModalOpen(true);
  };

  const uploadImageToSupabase = async (file) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
    const { error } = await supabase.storage.from('images').upload(`curriculum/${fileName}`, file);
    if (error) throw error;
    const { data } = supabase.storage.from('images').getPublicUrl(`curriculum/${fileName}`);
    return data.publicUrl;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let payload = { ...formData };
      
      // 1. หัวเว็บ และ Flowchart
      if (modalType === 'pageInfo') {
        if (uploadFile) {
          const imgUrl = await uploadImageToSupabase(uploadFile);
          if (imgUrl) payload.flowchart_url = imgUrl;
        }
        await supabase.from('curriculum_info').upsert({ id: 1, ...payload });
      } 
      
      // 2. จัดการฐานข้อมูลรายวิชา (Master Course)
      else if (modalType === 'course') {
        // ประมวลผล Array ของ Prereq
        if (typeof payload.prereq === 'string') {
          payload.prereq = payload.prereq.split(',').map(s => s.trim()).filter(Boolean);
        }
        const { error } = await supabase.from('courses').upsert({
          course_id: payload.course_id,
          name_th: payload.name_th,
          name_en: payload.name_en,
          credit_text: payload.credit_text,
          is_eng: payload.is_eng === 'true' || payload.is_eng === true,
          prereq: payload.prereq,
          coreq: payload.coreq || null
        });
        if (error) throw error;
      }
      
      // 3. จัดการโครงสร้าง (Category)
      else if (modalType === 'category') {
        if (payload.id) await supabase.from('curriculum_categories').update(payload).eq('id', payload.id);
        else await supabase.from('curriculum_categories').insert(payload);
      }
      
      // 4. จัดการโครงสร้าง (SubCategory)
      else if (modalType === 'subcategory') {
        if (payload.id) await supabase.from('curriculum_subcategories').update(payload).eq('id', payload.id);
        else await supabase.from('curriculum_subcategories').insert(payload);
      }
      
      // 5. จัดการภาคเรียน (Term)
      else if (modalType === 'term') {
        // payload needs year_id, title, term_plan, is_summer, total_credits
        payload.is_summer = payload.is_summer === 'true' || payload.is_summer === true;
        if (payload.id) await supabase.from('study_plan_terms').update(payload).eq('id', payload.id);
        else await supabase.from('study_plan_terms').insert(payload);
      }

      // 6. เพิ่มรายวิชาลงในภาคเรียน (Map Course -> Term)
      else if (modalType === 'mapCourseTerm') {
        if (payload.map_id) {
           await supabase.from('study_plan_courses').update({ course_id: payload.course_id, sort_order: payload.sort_order }).eq('id', payload.map_id);
        } else {
           await supabase.from('study_plan_courses').insert({ term_id: payload.term_id, course_id: payload.course_id, sort_order: payload.sort_order || 1 });
        }
      }

      // 7. เพิ่มรายวิชาลงในหมวดหมู่ (Map Course -> Subcategory)
      else if (modalType === 'mapCourseSubcat') {
        if (payload.map_id) {
           await supabase.from('curriculum_subcategory_courses').update({ course_id: payload.course_id, sort_order: payload.sort_order }).eq('id', payload.map_id);
        } else {
           await supabase.from('curriculum_subcategory_courses').insert({ subcategory_id: payload.subcategory_id, course_id: payload.course_id, sort_order: payload.sort_order || 1 });
        }
      }

      setIsModalOpen(false);
      fetchCurriculumData();
    } catch (error) {
      alert('บันทึกไม่สำเร็จ กรุณาตรวจสอบรหัสวิชาว่ามีอยู่ในระบบหรือไม่');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (table, idField, idValue) => {
    if (!window.confirm('ยืนยันการลบข้อมูลนี้? (รายการที่เกี่ยวข้องจะถูกลบด้วย)')) return;
    try {
      await supabase.from(table).delete().eq(idField, idValue);
      fetchCurriculumData();
    } catch (error) {
      alert('ลบไม่สำเร็จ');
    }
  };

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 relative overflow-hidden";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfcff]">
        <div className="text-purple-600 font-bold animate-pulse text-lg">กำลังโหลดข้อมูลหลักสูตร...</div>
      </div>
    );
  }

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 pt-2">
        
        {/* ---------------- Header Section ---------------- */}
        <div className="text-center max-w-4xl mx-auto pt-2 pb-10 relative">
          {isAdmin && (
            <ActionButtons onEdit={() => openAdminModal('pageInfo', pageInfo)} positionClass="top-0 right-0" />
          )}
          <span className="inline-block py-1 px-4 rounded-full bg-purple-100/60 backdrop-blur-sm text-purple-700 text-[11px] font-bold tracking-widest uppercase mb-4 shadow-sm">
            Curriculum Map
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
            {pageInfo.title || "แผนผังและโครงสร้างหลักสูตร"}
          </h1>
          <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl mb-3 whitespace-pre-line">
            {pageInfo.subtitle || "หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมชีวการแพทย์"}
          </p>
          <p className="font-medium text-slate-600 text-sm md:text-base leading-relaxed mx-auto mb-8">
            หน่วยกิตรวมตลอดหลักสูตร: <span className="font-bold text-purple-700">{pageInfo.total_credits || 146} หน่วยกิต</span>
          </p>
          
          <div className="flex justify-center">
            <a href="/flow" className="text-sm font-bold bg-white text-purple-700 hover:bg-purple-600 hover:text-white border border-purple-200 hover:border-purple-600 shadow-md px-8 py-3.5 rounded-full transition-all flex items-center gap-2 transform hover:-translate-y-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              ไปยังระบบจำลองแผนการเรียน
            </a>
          </div>
        </div>

        {/* ---------------- 1. แผนผังการเรียน ---------------- */}
        <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50`}>
          <SectionBanner text="แผนผังการเรียน" variant="exam" />

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 mt-8 border-b border-slate-100 pb-4 px-2">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
              <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              BME Flowchart
            </h3>
            {isAdmin && (
               <button onClick={() => openAdminModal('pageInfo', pageInfo)} className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200">
                 ✏️ อัปเดตแผนผัง
               </button>
            )}
          </div>
          
          <div className="w-full rounded-[1.5rem] overflow-hidden border-2 border-slate-100 bg-slate-50 relative group">
            <TransformWrapper initialScale={1} minScale={0.8} maxScale={3} wheel={{ step: 0.05, smoothStep: 0.005 }} centerOnInit={true}>
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="absolute bottom-6 right-6 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl px-3 py-2 rounded-2xl opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={() => zoomIn(0.2)} className="w-9 h-9 bg-slate-100 hover:bg-purple-600 hover:text-white rounded-xl flex items-center justify-center font-bold transition-all text-sm">+</button>
                    <button onClick={() => zoomOut(0.2)} className="w-9 h-9 bg-slate-100 hover:bg-purple-600 hover:text-white rounded-xl flex items-center justify-center font-bold transition-all text-sm">-</button>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                    <button onClick={() => resetTransform()} className="px-3 h-9 bg-slate-100 hover:bg-slate-800 hover:text-white rounded-xl flex items-center justify-center text-xs font-bold transition-all">Reset</button>
                  </div>
                  <TransformComponent wrapperClass="!w-full !h-auto min-h-[500px] cursor-grab active:cursor-grabbing flex items-center justify-center">
                    <img src={pageInfo.flowchart_url || bmeFlowImage} alt="BME Curriculum Flowchart" className="w-full h-auto object-contain max-h-[850px] select-none mix-blend-multiply" draggable="false" />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>
        </div>

        {/* ---------------- 2. แผนการศึกษา ---------------- */}
        <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50`}>
          <SectionBanner text="แผนการเรียนแต่ละชั้นปี" variant="calendar" />

          <div className="flex flex-col md:flex-row justify-between items-center mb-8 mt-8 px-2 gap-4">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Study Plan
            </h3>
            
            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl shadow-sm border border-slate-200/60 w-full md:w-auto">
              <button 
                onClick={() => setActivePlan('normal')}
                className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${activePlan === 'normal' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
              >
                โครงการปกติ
              </button>
              <button 
                onClick={() => setActivePlan('coop')}
                className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${activePlan === 'coop' ? 'bg-indigo-600 text-white shadow-sm border border-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                โครงการสหกิจศึกษา
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {studyPlan.map((yearItem, yIdx) => {
              const visibleTerms = yearItem.terms.filter(term => term.plan === 'all' || term.plan === activePlan);
              if (visibleTerms.length === 0 && !isAdmin) return null;

              return (
                <div key={yIdx} className="bg-slate-50/50 rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-8 py-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg shadow-sm">{yIdx + 1}</div>
                      <h3 className="text-xl font-extrabold tracking-wide">{yearItem.year}</h3>
                    </div>
                    {isAdmin && (
                      <button onClick={() => openAdminModal('term', { year_id: yearItem.id, term_plan: 'all', is_summer: false })} className="px-3 py-1.5 bg-white/20 text-white rounded-lg text-xs font-bold hover:bg-white/30 transition">+ เพิ่มภาคเรียน</button>
                    )}
                  </div>

                  <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {visibleTerms.map((term, tIdx) => (
                      <div key={tIdx} className={`rounded-[1.5rem] border relative ${term.plan === 'coop' ? 'border-indigo-200 bg-indigo-50/30 shadow-[0_4px_15px_rgba(79,70,229,0.05)]' : term.isSummer ? 'border-dashed border-slate-300 bg-white' : 'border-slate-200 bg-white shadow-sm'} overflow-hidden flex flex-col hover:shadow-md transition-shadow`}>
                        
                        {isAdmin && (
                           <ActionButtons 
                              onEdit={() => openAdminModal('term', term)} 
                              onDelete={() => handleDelete('study_plan_terms', 'id', term.id)} 
                           />
                        )}

                        <div className={`px-5 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${term.plan === 'coop' ? 'bg-indigo-100/50 border-indigo-100 text-indigo-900' : term.isSummer ? 'bg-slate-50 border-slate-100 text-slate-700' : 'bg-slate-50/80 border-slate-100 text-slate-800'}`}>
                          <h4 className="font-extrabold text-[15px] flex items-center gap-2 pr-16">
                              <span className={`w-2 h-2 rounded-full ${term.plan === 'coop' ? 'bg-indigo-500' : 'bg-purple-500'}`}></span>
                              {term.title} {isAdmin && <span className="text-[10px] text-slate-400 font-normal">({term.plan})</span>}
                          </h4>
                          <div className="flex gap-2">
                            {!term.isSummer && (
                              <span className="text-[12px] font-black bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 shadow-sm">รวม {term.totalCredits} นก.</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-5 flex flex-col gap-2.5 flex-1 relative">
                          {term.courses.map((c, cIdx) => {
                            const info = getFullCourseInfo(c.id);
                            return (
                              <div key={cIdx} className="relative flex justify-between items-start gap-3 border-b border-slate-100 last:border-0 pb-3 mb-1 last:pb-0 last:mb-0 hover:bg-slate-50 p-2 rounded-xl transition-colors">
                                {/* 📌 ปุ่มจัดการรายวิชาในภาคเรียน */}
                                {isAdmin && (
                                  <ActionButtons 
                                    onEdit={() => openAdminModal('course', {
                                      course_id: info.id, name_th: info.nameTH, name_en: info.nameEN, 
                                      credit_text: info.creditText, is_eng: info.isEng, prereq: info.prereq?.join(','), coreq: info.coreq
                                    })} 
                                    onDelete={() => handleDelete('study_plan_courses', 'id', c.map_id)} 
                                    positionClass="-top-1 -right-1 scale-75"
                                  />
                                )}

                                <div className="pr-12">
                                  <div className="text-[10px] font-mono text-slate-400 font-bold mb-1 tracking-wider">{info.id}</div>
                                  <div className="text-[13.5px] text-slate-800 font-black leading-snug">{info.nameTH}</div>
                                  {info.nameEN && <div className="text-[11.5px] text-slate-500 font-medium leading-snug mt-0.5">{info.nameEN}</div>}
                                </div>
                                <div className="text-[11px] font-bold text-slate-500 whitespace-nowrap pt-1 flex flex-col items-end gap-1.5">
                                  <div className="flex gap-1.5 items-center">
                                    {info.isEng && <span className="text-[9px] font-black bg-slate-800 text-white px-2 py-0.5 rounded-md tracking-widest shadow-sm">ENG</span>}
                                    <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 shadow-sm">{info.creditText}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          
                          {isAdmin && (
                            <button onClick={() => openAdminModal('mapCourseTerm', { term_id: term.id, sort_order: term.courses.length + 1 })} className="mt-3 w-full py-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 transition">
                              + เพิ่มรายวิชาลงในภาคเรียนนี้
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------- 3. โครงสร้างรายวิชา ---------------- */}
        <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50`}>
          <div className="flex justify-between items-center mb-8">
            <SectionBanner text="โครงสร้างรายวิชา" variant="website" />
            {isAdmin && <button onClick={() => openAdminModal('category', { sort_order: categories.length + 1, color_theme: 'purple' })} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow hover:bg-purple-700">+ เพิ่มหมวดหมู่วิชาหลัก</button>}
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3 mb-8 px-2 tracking-tight">
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            หมวดหมู่รายวิชาทั้งหมด
          </h3>

          <div className="flex flex-col gap-10">
            {categories.map((category) => (
              <div key={category.id} className={`rounded-[2rem] overflow-hidden border relative ${getColorClasses(category.color)} shadow-sm transition-all hover:shadow-md backdrop-blur-md`}>
                
                {isAdmin && <ActionButtons onEdit={() => openAdminModal('category', category)} onDelete={() => handleDelete('curriculum_categories', 'id', category.id)} positionClass="top-4 right-4" />}

                <div className={`${getHeaderColor(category.color)} text-white p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pr-24`}>
                  <h3 className="text-xl md:text-2xl font-black tracking-tight">{category.title}</h3>
                  <div className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap border border-white/20 shadow-sm">
                    รวม {category.totalCredits} หน่วยกิต
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col gap-10">
                  {category.subCategories.map((sub, idx) => (
                    <div key={idx} className="relative">
                      
                      <div className="flex items-center justify-between mb-2 border-b border-current pb-2 opacity-80">
                         <div className="flex items-center gap-3">
                           <h4 className="text-[16px] font-extrabold">{sub.title}</h4>
                         </div>
                         {isAdmin && (
                           <div className="flex gap-2">
                             <button onClick={() => openAdminModal('mapCourseSubcat', { subcategory_id: sub.id, sort_order: sub.courses.length + 1 })} className="px-3 py-1 bg-white/50 text-slate-800 rounded-lg text-[10px] font-bold shadow-sm hover:bg-white">+ เพิ่มวิชา</button>
                             <button onClick={() => openAdminModal('subcategory', sub)} className="px-2 py-1 bg-white/50 text-blue-600 rounded-lg text-[10px] font-bold shadow-sm hover:bg-white">แก้ไข</button>
                             <button onClick={() => handleDelete('curriculum_subcategories', 'id', sub.id)} className="px-2 py-1 bg-white/50 text-rose-600 rounded-lg text-[10px] font-bold shadow-sm hover:bg-white">ลบ</button>
                           </div>
                         )}
                      </div>
                      {sub.description && <p className="text-[13px] mb-5 font-medium opacity-70">{sub.description}</p>}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-4">
                        {sub.courses.map((c, i) => {
                          const info = getFullCourseInfo(c.id);
                          return (
                            <div key={i} className="relative bg-white/90 backdrop-blur-sm rounded-[1.25rem] p-5 border border-slate-200/60 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
                              
                              {/* 📌 ปุ่มจัดการรายวิชาในหมวดย่อย */}
                              {isAdmin && (
                                <ActionButtons 
                                  onEdit={() => openAdminModal('course', {
                                    course_id: info.id, name_th: info.nameTH, name_en: info.nameEN, 
                                    credit_text: info.creditText, is_eng: info.isEng, prereq: info.prereq?.join(','), coreq: info.coreq
                                  })} 
                                  onDelete={() => handleDelete('curriculum_subcategory_courses', 'id', c.map_id)} 
                                  positionClass="top-2 right-2 scale-75"
                                />
                              )}

                              <div className="flex justify-between items-start gap-2 pr-10">
                                <div className="flex flex-col gap-1">
                                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                    <span className="text-[11px] font-mono text-slate-500 font-bold tracking-wider group-hover:text-current transition-colors">{info.id}</span>
                                    {info.isEng && <span className="text-[9px] font-black bg-slate-800 text-white px-2 py-0.5 rounded-md tracking-widest shadow-sm">ENG</span>}
                                    {info.prereq?.length > 0 && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md text-[9px] font-bold border border-orange-200 shadow-sm">มีตัวต่อ</span>}
                                    {info.coreq && <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md text-[9px] font-bold border border-indigo-200 shadow-sm">วิชาควบ</span>}
                                  </div>
                                  <div className="text-[14.5px] font-black text-slate-800 leading-snug group-hover:text-current transition-colors">{info.nameTH}</div>
                                  {info.nameEN && <div className="text-[12px] font-medium text-slate-500 leading-snug mt-0.5">{info.nameEN}</div>}
                                </div>
                                <div className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg whitespace-nowrap flex-shrink-0 shadow-sm">
                                  {info.creditText}
                                </div>
                              </div>
                              {(info.prereq?.length > 0 || info.coreq) && (
                                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 mt-1">
                                  {info.prereq?.length > 0 && (
                                    <div className="text-[10.5px] text-slate-500 flex items-center gap-1.5">
                                      <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                                      ต้องผ่าน: <span className="font-mono font-bold text-slate-700">{info.prereq.join(', ')}</span>
                                    </div>
                                  )}
                                  {info.coreq && (
                                    <div className="text-[10.5px] text-slate-500 flex items-center gap-1.5">
                                      <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                      เรียนควบ: <span className="font-mono font-bold text-slate-700">{info.coreq}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* ปุ่มเพิ่มหมวดย่อย */}
                  {isAdmin && (
                    <div className="mt-4 border-t border-current/20 pt-6">
                      <button onClick={() => openAdminModal('subcategory', { category_id: category.id, sort_order: category.subCategories.length + 1 })} className="px-5 py-2.5 bg-white/50 text-slate-800 rounded-xl text-xs font-bold shadow-sm hover:bg-white w-full border border-current/20 border-dashed">
                        + เพิ่มหมวดย่อย (Subcategory)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ================= MODALS (โครงสร้างใหม่ ป้องกันการทับซ้อนและใช้งานง่าย) ================= */}
      <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.form 
            onSubmit={handleSave} 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            className="bg-white rounded-3xl w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* 📌 1. ส่วนหัว Modal (ยึดติดกับที่) */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-extrabold text-slate-800">
                {modalType === 'pageInfo' ? '✏️ แก้ไขข้อมูลหน้าหลัก' :
                 modalType === 'course' ? '✏️ เพิ่ม/แก้ไข ฐานข้อมูลวิชา' :
                 modalType === 'term' ? '✏️ เพิ่ม/แก้ไข ภาคเรียน' :
                 modalType === 'category' ? '✏️ เพิ่ม/แก้ไข หมวดหมู่วิชาหลัก' :
                 modalType === 'subcategory' ? '✏️ เพิ่ม/แก้ไข หมวดย่อย' :
                 '✏️ นำวิชาเข้าสู่ระบบ'}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
            </div>
            
            {/* 📌 2. ส่วนเนื้อหา Modal (Scroll ได้) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              
              {/* Form: Page Info */}
              {modalType === 'pageInfo' && (
                <>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">หัวข้อหลัก</label><input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">คำอธิบาย</label><textarea value={formData.subtitle || ''} onChange={e => setFormData({...formData, subtitle: e.target.value})} rows="3" className="w-full p-3 border border-slate-200 rounded-xl text-sm"></textarea></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">หน่วยกิตรวมทั้งหลักสูตร (ตัวเลข)</label><input type="number" value={formData.total_credits || ''} onChange={e => setFormData({...formData, total_credits: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                  <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 mt-4">
                    <label className="block text-[11px] font-bold text-slate-700 mb-2">อัปโหลดภาพ Flowchart ใหม่</label>
                    <input type="file" accept="image/*" onChange={e => setUploadFile(e.target.files[0])} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700" />
                  </div>
                </>
              )}

              {/* Form: Course Master */}
              {modalType === 'course' && (
                <>
                  <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded-xl border border-amber-200 font-medium mb-2">
                    💡 <b>คำแนะนำ:</b> การแก้ไขชื่อวิชา หรือหน่วยกิตที่นี่ จะส่งผลต่อทุกๆ ที่ในหน้าเว็บที่มีวิชานี้อยู่
                  </div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">รหัสวิชา *</label><input type="text" value={formData.course_id || ''} onChange={e => setFormData({...formData, course_id: e.target.value})} disabled={!!formData.id} className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50" placeholder="เช่น 010113000" /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อวิชา (ภาษาไทย) *</label><input type="text" value={formData.name_th || ''} onChange={e => setFormData({...formData, name_th: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อวิชา (ภาษาอังกฤษ)</label><input type="text" value={formData.name_en || ''} onChange={e => setFormData({...formData, name_en: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-[11px] font-bold text-slate-700 mb-1">หน่วยกิต * (เช่น 3(3-0-6))</label><input type="text" value={formData.credit_text || ''} onChange={e => setFormData({...formData, credit_text: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                    <div><label className="block text-[11px] font-bold text-slate-700 mb-1">เป็นวิชาภาษาอังกฤษ? (ENG)</label>
                      <select value={formData.is_eng || false} onChange={e => setFormData({...formData, is_eng: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white">
                        <option value={false}>ไม่ใช่</option><option value={true}>ใช่</option>
                      </select>
                    </div>
                  </div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">วิชาบังคับก่อน (Prerequisite)</label><input type="text" value={formData.prereq || ''} onChange={e => setFormData({...formData, prereq: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" placeholder="ถ้ามีหลายวิชา ให้คั่นด้วยลูกน้ำ เช่น 01011, 01012" /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">วิชาบังคับเรียนควบ (Corequisite)</label><input type="text" value={formData.coreq || ''} onChange={e => setFormData({...formData, coreq: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" placeholder="รหัสวิชา 1 ตัว (ถ้ามี)" /></div>
                </>
              )}

              {/* Form: Term */}
              {modalType === 'term' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อภาคเรียน *</label><input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" placeholder="เช่น ภาคเรียนที่ 1" /></div>
                    <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ลำดับการแสดงผล</label><input type="number" value={formData.sort_order || 1} onChange={e => setFormData({...formData, sort_order: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="block text-[11px] font-bold text-slate-700 mb-1">รวมหน่วยกิต</label><input type="number" value={formData.total_credits || 0} onChange={e => setFormData({...formData, total_credits: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                    <div><label className="block text-[11px] font-bold text-slate-700 mb-1">รูปแบบแผนการเรียน</label>
                      <select value={formData.term_plan || 'all'} onChange={e => setFormData({...formData, term_plan: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white">
                        <option value="all">เรียนทุกแผน</option><option value="normal">เฉพาะแผนปกติ</option><option value="coop">เฉพาะสหกิจ</option>
                      </select>
                    </div>
                    <div><label className="block text-[11px] font-bold text-slate-700 mb-1">เป็นภาคฤดูร้อน?</label>
                      <select value={formData.is_summer || false} onChange={e => setFormData({...formData, is_summer: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white">
                        <option value={false}>ไม่ใช่</option><option value={true}>ใช่</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Form: Category */}
              {modalType === 'category' && (
                <>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อหมวดหมู่วิชาหลัก *</label><input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" placeholder="เช่น หมวดวิชาศึกษาทั่วไป" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-[11px] font-bold text-slate-700 mb-1">รวมหน่วยกิต</label><input type="number" value={formData.total_credits || 0} onChange={e => setFormData({...formData, total_credits: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                    <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ลำดับการแสดงผล</label><input type="number" value={formData.sort_order || 1} onChange={e => setFormData({...formData, sort_order: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">ธีมสีของการ์ด (Dropdown)</label>
                    <select value={formData.color_theme || 'purple'} onChange={e => setFormData({...formData, color_theme: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white">
                      {CATEGORY_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* Form: Subcategory */}
              {modalType === 'subcategory' && (
                <>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อหมวดย่อย *</label><input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" placeholder="เช่น กลุ่มวิชาสังคมศาสตร์" /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">คำอธิบายเพิ่มเติม (ถ้ามี)</label><textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows="2" className="w-full p-3 border border-slate-200 rounded-xl text-sm"></textarea></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ลำดับการแสดงผล</label><input type="number" value={formData.sort_order || 1} onChange={e => setFormData({...formData, sort_order: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                </>
              )}

              {/* Form: Mapping Course (Term / Subcat) */}
              {(modalType === 'mapCourseTerm' || modalType === 'mapCourseSubcat') && (
                <>
                  <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-xl border border-blue-200 font-medium mb-2">
                    💡 <b>สำคัญ:</b> กรุณาตรวจสอบให้แน่ใจว่า "รหัสวิชา" ที่คุณกรอก มีอยู่ในฐานข้อมูลวิชาเรียบร้อยแล้ว
                  </div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">รหัสวิชา *</label><input type="text" value={formData.course_id || ''} onChange={e => setFormData({...formData, course_id: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" placeholder="เช่น 010113000" /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ลำดับการแสดงผลวิชาในกลุ่มนี้</label><input type="number" value={formData.sort_order || 1} onChange={e => setFormData({...formData, sort_order: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                </>
              )}

            </div>
            
            {/* 📌 3. ส่วนปุ่มกด Modal (ยึดติดกับที่) */}
            <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-full text-slate-600 font-bold bg-slate-200 hover:bg-slate-300 text-sm">ยกเลิก</button>
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md text-sm">{isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</button>
            </div>
          </motion.form>
        </div>
      )}
      </AnimatePresence>

    </div>
  );
}