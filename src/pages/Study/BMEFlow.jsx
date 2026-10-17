import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { supabase } from '../../supabaseClient';
import { AuroraBackground, SectionBanner } from '../../components/ThemeElements';

// 📌 ดึงข้อมูลจาก Context อย่างถูกต้อง
import { useAuth } from "../../contexts/AuthContext";

// 📌 กำหนดค่าเกรดคงที่ 
const GRADE_POINTS = { 'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0, 'Fa': 0, 'Fe': 0, 'W': null, 'S': null, 'U': null, 'ยังไม่ระบุ': null };

// ==========================================
// 📌 ปุ่มแก้ไข (Edit / Delete) มาตรฐาน (แสดงตลอดเวลา)
// ==========================================
const ActionButtons = ({ onEdit, onDelete, positionClass = "top-3 right-3", hideDelete = false }) => (
  <div className={`absolute ${positionClass} flex gap-1.5 z-30`}>
    {onEdit && (
      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }} className="p-1.5 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
      </button>
    )}
    {!hideDelete && onDelete && (
      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} className="p-1.5 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    )}
  </div>
);

export default function BMEFlow() {
  const { user } = useAuth(); // 📌 ดึง user ตัวจริงจากระบบ
  const [activePlan, setActivePlan] = useState('normal'); 
  const [isLoading, setIsLoading] = useState(true);

  // 📌 State สำหรับเก็บข้อมูลตั้งต้นจาก Supabase
  const [pageInfo, setPageInfo] = useState({
    title: 'จำลองแผนการเรียน', subtitle: '', description: '', total_required_credits: 146, standard_study_years: 4, max_study_years: 8,
    sec_flow_title: 'กระดานแผนการเรียน', min_gpax: 2.00
  });
  const [courseMaster, setCourseMaster] = useState([]);
  const [yearlyPlanTemplate, setYearlyPlanTemplate] = useState([]);

  // 📌 State สำหรับการจำลองฝั่งผู้ใช้ (Client-side)
  const [myPlan, setMyPlan] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetSemester, setTargetSemester] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 📌 State สำหรับ Admin (จัดการข้อมูลลงฐานข้อมูล)
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);
  const [settingsModalType, setSettingsModalType] = useState('header'); // แยกประเภทฟอร์ม
  const [settingsForm, setSettingsForm] = useState({});
  const [isAdminMapOpen, setIsAdminMapOpen] = useState(false);
  const [mapForm, setMapForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // 🔒 ตรวจสอบสิทธิ์แบบครอบคลุมและปลอดภัย
  const canManage = useMemo(() => {
    if (!user) return false;
    
    // ตรวจสอบเงื่อนไขต่างๆ
    const role = String(user.role || '').toLowerCase();
    const metaRole = String(user.user_metadata?.role || '').toLowerCase();
    const email = String(user.email || '').toLowerCase();
    
    return (
      ['admin', 'faculty', 'teacher', 'staff', 'instructor'].includes(role) ||
      ['admin', 'faculty', 'teacher', 'staff', 'instructor'].includes(metaRole) ||
      user.isAdmin === true ||
      email.endsWith('@sci.kmutnb.ac.th') ||
      email.endsWith('@email.kmutnb.ac.th') ||
      email === 'bme.kmutnb.th@gmail.com'
    );
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSimulationData();
  }, []);

  // เมื่อข้อมูลแม่แบบโหลดเสร็จ หรือเปลี่ยนแผน (ปกติ/สหกิจ) ให้สร้างตารางจำลองใหม่
  useEffect(() => {
    if (yearlyPlanTemplate.length > 0 && courseMaster.length > 0) {
      setMyPlan(generateDefaultPlanState(activePlan, yearlyPlanTemplate, courseMaster));
    }
  }, [activePlan, yearlyPlanTemplate, courseMaster]);

  // 📌 ฟังก์ชันดึงข้อมูลจาก Supabase
  const fetchSimulationData = async () => {
    setIsLoading(true);
    try {
      // 1. ดึงการตั้งค่าหน้าเพจ
      const { data: configData } = await supabase.from('simulation_config').select('*').eq('id', 1).maybeSingle();
      if (configData) setPageInfo(configData);

      // 2. ดึงข้อมูลรายวิชาทั้งหมด
      const { data: coursesData } = await supabase.from('courses').select('*');
      if (coursesData) setCourseMaster(coursesData);

      // 3. ดึงเทมเพลตแผนการเรียน (โครงสร้างปีและเทอม และ map_id)
      const { data: yearsData } = await supabase.from('study_plan_years').select(`
          id, year_number, sort_order,
          study_plan_terms (
            id, title, term_plan, is_summer, total_credits, sort_order,
            study_plan_courses ( id, course_id, sort_order )
          )
        `).order('sort_order', { ascending: true });
      
      if (yearsData) setYearlyPlanTemplate(yearsData);

    } catch (error) {
      console.error("Error fetching simulation data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 📌 ฟังก์ชันจัดเรียงวิชาเริ่มต้น
  const generateDefaultPlanState = (targetPlan, planData, coursesData) => {
    const defaultState = [];
    if (!planData || planData.length === 0) return defaultState; 

    planData.forEach((yearItem) => {
      const yearNum = yearItem.year_number;
      const terms = yearItem.study_plan_terms || [];
      const visibleTerms = terms.filter(term => term.term_plan === 'all' || term.term_plan === targetPlan)
                                .sort((a, b) => a.sort_order - b.sort_order);

      visibleTerms.forEach((term, tIdx) => {
        const termTitle = String(term.title || '');
        let termNum;
        if (term.is_summer || termTitle.includes('ฤดูร้อน')) { termNum = 3; } 
        else if (termTitle.includes('สหกิจศึกษา') && !termTitle.includes('ที่ 1') && !termTitle.includes('ที่ 2')) { termNum = 4; } 
        else if (termTitle.includes('ที่ 1') || termTitle.includes('เทอม 1')) { termNum = 1; } 
        else if (termTitle.includes('ที่ 2') || termTitle.includes('เทอม 2')) { termNum = 2; } 
        else { termNum = tIdx + 1; }

        const semesterId = `y${yearNum}s${termNum}`;
        const coursesInTerm = term.study_plan_courses || [];

        coursesInTerm.forEach((c) => {
          const masterData = coursesData.find(master => String(master.course_id) === String(c.course_id));
          if (!masterData) return;

          const nameTH = String(masterData.name_th).replace('*', ''); 

          defaultState.push({
            uid: `${masterData.course_id}-${semesterId}-${Date.now()}-${Math.random()}`, 
            map_id: c.id, 
            term_id: term.id,
            sort_order: c.sort_order,
            id: masterData.course_id,
            nameTH: nameTH, 
            nameEN: masterData.name_en || '',
            creditText: masterData.credit_text || '-', 
            semesterId: semesterId,
            grade: 'ยังไม่ระบุ'
          });
        });
      });
    });
    return defaultState;
  };

  // ----------------------------------------------------
  // 📌 ส่วนของ Admin: จัดการ Database
  // ----------------------------------------------------
  
  // เปิดตั้งค่าหน้าเพจแบบแยกส่วน
  const handleOpenSettings = (type) => {
    setSettingsModalType(type);
    
    // กำหนดค่าตั้งต้นหากยังไม่มีใน DB
    let initialForm = { ...pageInfo };
    if (type === 'banner') {
      initialForm.sec_flow_title = pageInfo.sec_flow_title || 'กระดานแผนการเรียน';
    } else if (type === 'gpa') {
      initialForm.min_gpax = pageInfo.min_gpax || 2.00;
    }
    
    setSettingsForm(initialForm);
    setIsAdminSettingsOpen(true);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase.from('simulation_config').upsert({ id: 1, ...settingsForm });
      if (error) throw error;
      setPageInfo(settingsForm);
      setIsAdminSettingsOpen(false);
    } catch (err) { alert('บันทึกไม่สำเร็จ'); }
    setIsSaving(false);
  };

  // เปิดแก้ไข/ลบ ปีและเทอม
  const handleOpenYearEdit = (yearObj) => {
    setMapForm({ id: yearObj.id, year_number: yearObj.year_number, sort_order: yearObj.sort_order || 1, type: 'year' });
    setIsAdminMapOpen(true);
  };

  const handleOpenTermEdit = (termObj) => {
    setMapForm({ 
      id: termObj.id, 
      title: termObj.title, 
      term_plan: termObj.term_plan || 'all', 
      is_summer: termObj.is_summer || false, 
      total_credits: termObj.total_credits || 0,
      sort_order: termObj.sort_order || 1, 
      type: 'term' 
    });
    setIsAdminMapOpen(true);
  };

  // เปิดแก้ไขลำดับวิชาในเทอม
  const handleOpenMapEdit = (courseItem) => {
    setMapForm({ id: courseItem.map_id, course_id: courseItem.id, sort_order: courseItem.sort_order || 1, type: 'courseMap' });
    setIsAdminMapOpen(true);
  };

  const handleSaveMapEdit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (mapForm.type === 'year') {
        await supabase.from('study_plan_years').update({ year_number: mapForm.year_number, sort_order: mapForm.sort_order }).eq('id', mapForm.id);
      } else if (mapForm.type === 'term') {
        await supabase.from('study_plan_terms').update({ 
          title: mapForm.title, term_plan: mapForm.term_plan, is_summer: String(mapForm.is_summer) === 'true', 
          total_credits: mapForm.total_credits, sort_order: mapForm.sort_order 
        }).eq('id', mapForm.id);
      } else if (mapForm.type === 'courseMap') {
        await supabase.from('study_plan_courses').update({ sort_order: mapForm.sort_order }).eq('id', mapForm.id);
      }
      setIsAdminMapOpen(false);
      fetchSimulationData();
    } catch (err) { alert('บันทึกไม่สำเร็จ'); }
    setIsSaving(false);
  };

  const handleDeleteStructure = async (type, id) => {
    const confirmMsg = type === 'term' ? 'ลบภาคเรียนนี้พร้อมวิชาทั้งหมดในภาคเรียนนี้หรือไม่?' : 'ลบวิชานี้ออกจากโครงสร้างหลักสูตรถาวรหรือไม่?';
    if (!window.confirm(confirmMsg)) return;
    try {
      if (type === 'term') {
        await supabase.from('study_plan_terms').delete().eq('id', id);
      } else {
        await supabase.from('study_plan_courses').delete().eq('id', id);
      }
      fetchSimulationData();
    } catch (err) { alert('ลบไม่สำเร็จ'); }
  };

  // ----------------------------------------------------
  // 📌 ส่วนของ Student: จำลองแผนการเรียน (Client-side)
  // ----------------------------------------------------
  
  const handleCustomDetailChange = (uid, field, value) => {
    setMyPlan(prev => prev.map(c => c.uid === uid ? { ...c, [field]: value } : c));
  };

  const handleGradeChange = (uid, newGrade) => {
    setMyPlan(prev => prev.map(c => c.uid === uid ? { ...c, grade: newGrade } : c));
  };

  const handleRemoveCourse = (uid) => {
    setMyPlan(prev => prev.filter(c => c.uid !== uid));
  };

  // Modal ค้นหาวิชา 
  const openCourseModal = (semanticSemesterId, termTitle, dbTermId = null, isAdminAdd = false) => {
    setTargetSemester({ id: semanticSemesterId, title: termTitle, dbTermId, isAdminAdd });
    setSearchQuery('');
    setIsModalOpen(true);
  };

  const handleAddCourse = async (course) => {
    if (targetSemester.isAdminAdd) {
      // 📌 Admin: เพิ่มวิชาลงฐานข้อมูล
      setIsSaving(true);
      try {
        const currentTermCourses = myPlan.filter(c => c.term_id === targetSemester.dbTermId);
        const nextSortOrder = currentTermCourses.length > 0 ? Math.max(...currentTermCourses.map(c => c.sort_order || 0)) + 1 : 1;
        
        const { error } = await supabase.from('study_plan_courses').insert({
          term_id: targetSemester.dbTermId,
          course_id: course.course_id,
          sort_order: nextSortOrder
        });
        if (error) throw error;
        setIsModalOpen(false);
        fetchSimulationData(); 
      } catch (err) { alert('เพิ่มรายวิชาไม่สำเร็จ'); }
      setIsSaving(false);
    } else {
      // 📌 Student: เพิ่มวิชาลงกระดานจำลอง
      let coursesToAdd = [{ 
        ...course, 
        uid: `${course.course_id}-${Date.now()}`, 
        id: course.course_id,
        nameTH: course.name_th,
        nameEN: course.name_en,
        creditText: course.credit_text,
        semesterId: targetSemester.id, 
        grade: 'ยังไม่ระบุ' 
      }];
      setMyPlan(prev => [...prev, ...coursesToAdd]);
      setIsModalOpen(false);
    }
  };

  // 📌 คำนวณผลการเรียนรวมทั้งหมด
  const computedData = useMemo(() => {
    let passedCredits = 0;
    let totalEnrolledCredits = 0;
    let pendingCredits = 0;
    let qualityPoints = 0;
    let gradedCredits = 0;

    const planWithDetails = myPlan.map(instance => {
      const courseIdStr = String(instance.id || '');
      const masterData = courseMaster.find(c => String(c.course_id) === courseIdStr);
      
      const creditStr = String(instance.creditText || '0');
      const creditNumber = parseInt(creditStr.split('(')[0].replace(/\D/g, '')) || 0;
      
      totalEnrolledCredits += creditNumber;

      if (!instance.grade || instance.grade === 'ยังไม่ระบุ') {
        pendingCredits += creditNumber;
      }

      const points = GRADE_POINTS[instance.grade];
      if (points !== undefined && points !== null) { 
        qualityPoints += (creditNumber * points);
        gradedCredits += creditNumber;
        if (points > 0) passedCredits += creditNumber; 
      }

      return {
        ...instance,
        credit: creditNumber,
        prereq: masterData?.prereq || [],
        isEng: String(instance.nameTH || '').includes('*') || masterData?.is_eng
      };
    });

    const gpax = gradedCredits > 0 ? (qualityPoints / gradedCredits).toFixed(2) : '0.00';
    
    let currentYear = 1;
    if (myPlan.length > 0) {
      const years = myPlan.map(c => parseInt(String(c.semesterId || '').replace('y', '').split('s')[0]) || 1);
      currentYear = Math.max(...years);
    }

    return { planWithDetails, gpax, passedCredits, totalEnrolledCredits, pendingCredits, currentYear };
  }, [myPlan, courseMaster]);

  const filteredCourses = useMemo(() => {
    if (!courseMaster || courseMaster.length === 0) return [];
    return courseMaster.filter(c => {
      const isAlreadyInPlan = myPlan.some(p => String(p.id) === String(c.course_id));
      if (isAlreadyInPlan && !targetSemester?.isAdminAdd) return false; 

      const searchLower = String(searchQuery || '').toLowerCase();
      const idStr = String(c.course_id || '').toLowerCase();
      const nameTHStr = String(c.name_th || '').toLowerCase();
      const nameENStr = String(c.name_en || '').toLowerCase();

      return idStr.includes(searchLower) || nameTHStr.includes(searchLower) || nameENStr.includes(searchLower);
    });
  }, [myPlan, searchQuery, courseMaster, targetSemester]);

  const safeGradePointsKeys = Object.keys(GRADE_POINTS).filter(g => g !== 'ยังไม่ระบุ');
  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 relative overflow-hidden";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfcff]">
        <div className="text-purple-600 font-bold animate-pulse text-lg">กำลังเตรียมระบบจำลองแผนการเรียน...</div>
      </div>
    );
  }

  const getRenderStructure = () => {
    const structure = [];
    yearlyPlanTemplate.forEach(yearItem => {
      const terms = yearItem.study_plan_terms || [];
      const visibleTerms = terms.filter(t => t.term_plan === 'all' || t.term_plan === activePlan)
                                .sort((a,b) => a.sort_order - b.sort_order);
      if (visibleTerms.length > 0) {
        structure.push({ 
          id: yearItem.id,
          yearTitle: `ชั้นปีที่ ${yearItem.year_number}`, 
          yearNum: yearItem.year_number, 
          sort_order: yearItem.sort_order,
          terms: visibleTerms 
        });
      }
    });
    return structure;
  };

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />
      
      <div className="relative z-10 max-w-[1500px] mx-auto px-4 md:px-6 pt-2">
        
        {/* ---------------- Header Section ---------------- */}
        <div className="text-center max-w-4xl mx-auto pt-2 pb-10 relative group">
          {canManage && <ActionButtons onEdit={() => handleOpenSettings('header')} positionClass="top-0 right-0 md:-right-8" hideDelete={true} />}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
            {pageInfo.title}
          </h1>
          <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl mb-2 whitespace-pre-line">
            {pageInfo.subtitle}
          </p>
          <p className="text-slate-500 text-sm md:text-base whitespace-pre-line">
            {pageInfo.description}
          </p>
        </div>

        {/* ---------------- 📌 1. Dashboard สรุปผล ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12 md:mb-16">
            
            <div className="rounded-[1.5rem] p-6 bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100/60 text-slate-700 shadow-sm relative overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              {canManage && <ActionButtons onEdit={() => handleOpenSettings('credits')} positionClass="top-4 right-4" hideDelete={true} />}
              <h3 className="text-xl font-black mb-4 border-b border-rose-200/60 pb-3 text-rose-600 pr-8">หน่วยกิตสะสม</h3>
              <div className="flex-1 space-y-2 font-medium text-sm z-10">
                <div className="flex justify-between text-slate-500"><span>หน่วยกิตขั้นต่ำ</span><span className="font-bold text-slate-700">{pageInfo.total_required_credits}</span></div>
                <div className="flex justify-between text-slate-500"><span>ลงทะเบียนแล้ว</span><span className="font-bold text-slate-700">{computedData.totalEnrolledCredits}</span></div>
                <div className="flex justify-between text-slate-500"><span>สอบผ่านแล้ว</span><span className="font-bold text-emerald-600">{computedData.passedCredits}</span></div>
                <div className="flex justify-between text-slate-500"><span>อยู่ระหว่างศึกษา</span><span className="font-bold text-slate-400">{computedData.pendingCredits}</span></div>
              </div>
            </div>

            <div className="rounded-[1.5rem] p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/60 text-slate-700 shadow-sm relative overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              {canManage && <ActionButtons onEdit={() => handleOpenSettings('years')} positionClass="top-4 right-4" hideDelete={true} />}
              <h3 className="text-xl font-black mb-4 border-b border-blue-200/60 pb-3 text-blue-600 pr-8">ระยะเวลาศึกษา</h3>
              <div className="flex-1 space-y-2 font-medium text-sm z-10">
                <div className="flex justify-between text-slate-500"><span>ระยะเวลาตามหลักสูตร</span><span className="font-bold text-slate-700">{pageInfo.standard_study_years} ปี</span></div>
                <div className="flex justify-between text-slate-500"><span>ระยะเวลาสูงสุด</span><span className="font-bold text-slate-700">{pageInfo.max_study_years} ปี</span></div>
                <div className="flex justify-between mt-4 text-lg text-slate-600"><span>ชั้นปีปัจจุบัน</span><span className="font-black text-blue-600">ปีที่ {computedData.currentYear}</span></div>
              </div>
            </div>

            <div className="rounded-[1.5rem] p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100/60 text-slate-700 shadow-sm relative overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              {/* 📌 เพิ่มปุ่มแก้ไขในกล่อง เกรดเฉลี่ยสะสม */}
              {canManage && <ActionButtons onEdit={() => handleOpenSettings('gpa')} positionClass="top-4 right-4" hideDelete={true} />}
              <h3 className="text-xl font-black mb-4 border-b border-purple-200/60 pb-3 text-purple-600 pr-8">เกรดเฉลี่ยสะสม</h3>
              <div className="flex-1 flex flex-col justify-center items-center py-2 z-10">
                <span className="text-6xl font-black tracking-tighter drop-shadow-sm text-purple-700">{computedData.gpax}</span>
                <span className="text-sm font-medium mt-2 text-slate-500">เกณฑ์ขั้นต่ำ {Number(pageInfo.min_gpax || 2.00).toFixed(2)}</span>
              </div>
            </div>
        </div>

        {/* ---------------- 📌 2. กระดานจำลองแผนการเรียน ---------------- */}
        <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50`}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-2 gap-4 relative">
            <div className="flex-1 w-full flex items-center gap-2">
              <div className="flex-1">
                <SectionBanner text={pageInfo.sec_flow_title || 'กระดานแผนการเรียน'} variant="calendar" />
              </div>
              {canManage && (
                <button onClick={() => handleOpenSettings('banner')} title="แก้ไขข้อความแบนเนอร์" className="p-2.5 bg-slate-100/80 text-slate-500 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition shadow-sm border border-slate-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
              )}
            </div>
            
            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl shadow-sm border border-slate-200/60 w-full md:w-auto mt-4 md:mt-0">
              <button onClick={() => setActivePlan('normal')} className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${activePlan === 'normal' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>โครงการปกติ</button>
              <button onClick={() => setActivePlan('coop')} className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${activePlan === 'coop' ? 'bg-indigo-600 text-white shadow-sm border border-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>โครงการสหกิจศึกษา</button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-12">
            {getRenderStructure().map((yearObj, yIdx) => (
              <div key={yIdx} className="bg-slate-50/50 p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                
                <h3 className="text-2xl font-extrabold text-slate-800 mb-8 flex items-center gap-3 border-b border-slate-200 pb-4 relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white shadow-md">{yearObj.yearNum}</div>
                  {yearObj.yearTitle}
                  {canManage && <ActionButtons onEdit={() => handleOpenYearEdit(yearObj)} positionClass="relative top-0 right-0 ml-2 scale-75" hideDelete={true} />}
                </h3>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {yearObj.terms.map((term, tIdx) => {
                    const termTitle = String(term.title || '');
                    let termNum;
                    if (term.is_summer || termTitle.includes('ฤดูร้อน')) { termNum = 3; } 
                    else if (termTitle.includes('สหกิจศึกษา') && !termTitle.includes('ที่ 1') && !termTitle.includes('ที่ 2')) { termNum = 4; } 
                    else if (termTitle.includes('ที่ 1') || termTitle.includes('เทอม 1')) { termNum = 1; } 
                    else if (termTitle.includes('ที่ 2') || termTitle.includes('เทอม 2')) { termNum = 2; } 
                    else { termNum = tIdx + 1; }
                    
                    const semanticSemesterId = `y${yearObj.yearNum}s${termNum}`;
                    const coursesInTerm = computedData.planWithDetails.filter(c => c.semesterId === semanticSemesterId);
                    const enrolledCredits = coursesInTerm.reduce((sum, c) => sum + c.credit, 0);

                    const limit = term.is_summer || termTitle.includes('ฤดูร้อน') ? 9 : 22;
                    const hasInternship = coursesInTerm.some(c => String(c.nameTH || '').includes('สหกิจ') || String(c.nameTH || '').includes('ฝึกงาน'));
                    
                    const isOverLimit = enrolledCredits > limit;
                    const isUnderCredit = enrolledCredits > 0 && enrolledCredits < 9 && !term.is_summer && !termTitle.includes('ฤดูร้อน') && !hasInternship;
                    
                    return (
                      <div key={semanticSemesterId} className={`rounded-[1.5rem] border relative ${isOverLimit || isUnderCredit ? 'border-rose-200 bg-rose-50/30 shadow-[0_4px_15px_rgba(244,63,94,0.05)]' : term.is_summer || termTitle.includes('ฤดูร้อน') ? 'border-dashed border-slate-300 bg-white' : 'border-slate-200 bg-white shadow-sm'} p-6 flex flex-col transition-all hover:shadow-md`}>
                        
                        <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-4">
                          <h4 className="font-extrabold text-[16px] text-slate-800 tracking-tight flex items-center gap-2 pr-16 relative">
                             <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span> {term.title}
                             {canManage && <ActionButtons onEdit={() => handleOpenTermEdit(term)} onDelete={() => handleDeleteStructure('term', term.id)} positionClass="relative top-0 right-0 ml-1 scale-75" />}
                          </h4>
                          <div className="text-right whitespace-nowrap">
                            <div className={`text-[13px] font-black ${isOverLimit || isUnderCredit ? 'text-rose-600' : 'text-emerald-600'}`}>
                              รวม {enrolledCredits} <span className="font-medium text-slate-400">/ {limit} นก.</span>
                            </div>
                            {isOverLimit && <div className="text-[10px] font-bold text-rose-500 bg-rose-100 px-2 py-0.5 rounded mt-1">เกินเกณฑ์ ({limit})</div>}
                            {isUnderCredit && <div className="text-[10px] font-bold text-rose-500 bg-rose-100 px-2 py-0.5 rounded mt-1">ต่ำกว่าเกณฑ์ (9)</div>}
                          </div>
                        </div>
                        
                        {(isOverLimit || isUnderCredit) && (
                          <div className="bg-rose-50 border border-rose-100 text-rose-800 rounded-xl p-3 mb-5 flex gap-2.5 items-start shadow-sm">
                            <svg className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <div className="text-[11px] font-medium leading-relaxed">
                              <strong className="font-bold">แจ้งเตือน:</strong> หน่วยกิต{isOverLimit ? 'เกิน' : 'ต่ำกว่า'}เกณฑ์ ยื่นคำร้องขอลงทะเบียน{isOverLimit ? 'สูง' : 'ต่ำ'}กว่าเกณฑ์
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col gap-3.5 flex-1 mb-5">
                          {coursesInTerm.map(c => {
                            const isElectivePlaceholder = String(c.nameTH || '').includes('วิชาเลือก') || String(c.id || '').includes('X');
                            return (
                              <div key={c.uid} className={`rounded-[1rem] border p-4 flex flex-col justify-between gap-3 relative transition-colors ${c.grade === 'ยังไม่ระบุ' ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 shadow-sm hover:border-purple-200'}`}>
                                
                                {/* 📌 ปุ่มจัดการ Admin (ถ้ามี map_id แปลว่าดึงมาจาก Database) */}
                                {canManage && c.map_id && (
                                  <ActionButtons onEdit={() => handleOpenMapEdit(c)} onDelete={() => handleDeleteCourseMap(c.map_id)} positionClass="-top-2 -right-2 scale-90" />
                                )}

                                <div className="flex justify-between items-start gap-2 pr-12">
                                  <div className="flex-1">
                                    <div className="text-[10px] font-mono text-indigo-600 font-bold tracking-wider mb-1">{c.customCode || c.id}</div>
                                    <div className="text-[13.5px] font-black text-slate-800 leading-snug">{c.customNameTH || c.nameTH}</div>
                                    {(c.customNameEN || c.nameEN) && <div className="text-[11px] text-slate-500 font-medium leading-snug mt-1 opacity-80">{c.customNameEN || c.nameEN}</div>}
                                  </div>
                                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0 pt-0.5">
                                    <span className="text-[11px] font-black text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">{c.creditText}</span>
                                    {c.isEng && <span className="text-[9px] font-black bg-slate-800 text-white px-2 py-0.5 rounded-md tracking-widest shadow-sm">ENG</span>}
                                  </div>
                                </div>

                                {isElectivePlaceholder && (
                                  <div className="mt-2 pt-3 pb-1 border-t border-slate-100 border-dashed flex flex-col gap-2">
                                    <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
                                      <svg className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                      ระบุวิชาที่เลือกลงเรียน (จำลอง):
                                    </div>
                                    <input type="text" placeholder="รหัสวิชา..." value={c.customCode || ''} onChange={(e) => handleCustomDetailChange(c.uid, 'customCode', e.target.value)} className="text-[11px] px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-400 focus:bg-white w-full font-mono bg-slate-50/50" />
                                    <input type="text" placeholder="ชื่อวิชา (ภาษาไทย)..." value={c.customNameTH || ''} onChange={(e) => handleCustomDetailChange(c.uid, 'customNameTH', e.target.value)} className="text-[11px] px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-400 focus:bg-white w-full bg-slate-50/50" />
                                  </div>
                                )}

                                <div className="pt-3 border-t border-slate-100 flex justify-between items-center mt-1 gap-2">
                                  <select value={c.grade} onChange={(e) => handleGradeChange(c.uid, e.target.value)} className={`text-xs font-bold px-3 py-1.5 rounded-lg outline-none shadow-sm appearance-none pr-8 transition-colors ${c.grade === 'ยังไม่ระบุ' ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-slate-800 text-white border border-slate-700'}`} style={{ backgroundImage: c.grade === 'ยังไม่ระบุ' ? 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23d97706\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")' : 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23ffffff\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em'}}>
                                    <option value="ยังไม่ระบุ">รอระบุเกรด</option>
                                    {safeGradePointsKeys.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                                  </select>
                                  
                                  <button onClick={() => handleRemoveCourse(c.uid)} className="text-[11px] font-bold text-slate-400 hover:text-rose-600 px-2 py-1 rounded transition-colors whitespace-nowrap">
                                    นำออก
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* 📌 แบ่งปุ่มระหว่าง แอดมิน และ นศ. */}
                        <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-2">
                          <button onClick={() => openCourseModal(semanticSemesterId, term.title)} className="w-full py-2.5 rounded-xl text-center text-[12px] font-bold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 shadow-sm">
                            + เพิ่มวิชาลงกระดานจำลอง
                          </button>
                          {canManage && (
                            <button onClick={() => openCourseModal(semanticSemesterId, term.title, term.id, true)} className="w-full py-2.5 rounded-xl text-center text-[12px] font-bold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 shadow-sm">
                              + เพิ่มวิชาลงฐานข้อมูล (Admin)
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- Modal ค้นหาและเลือกวิชา ---------------- */}
      <AnimatePresence>
      {isModalOpen && targetSemester && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-3xl rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl flex flex-col max-h-[85vh]">
            
            <div className={`p-6 md:p-8 border-b border-slate-100 bg-gradient-to-b shrink-0 ${targetSemester.isAdminAdd ? 'from-purple-50 to-white' : 'from-slate-50 to-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${targetSemester.isAdminAdd ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-700'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                  </div>
                  {targetSemester.isAdminAdd ? 'เลือกวิชาเพิ่มลงฐานข้อมูล' : `เลือกวิชาจำลองลงใน ${targetSemester.title}`}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors">✕</button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
                <input type="text" placeholder="พิมพ์ค้นหารหัสวิชา, ชื่อภาษาไทย หรือ English name..." className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none text-slate-700 font-bold shadow-sm transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/50">
              <div className="flex flex-col gap-3">
                {filteredCourses.map(course => {
                  const prereqArr = Array.isArray(course.prereq) ? course.prereq : [];
                  const isEngFlag = String(course.name_th || '').includes('*') || course.is_eng;
                  return (
                    <div key={course.course_id} onClick={() => !isSaving && handleAddCourse(course)} className={`bg-white p-5 rounded-[1.25rem] border border-slate-200 shadow-sm hover:border-purple-400 hover:shadow-md cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${isSaving ? 'opacity-50 pointer-events-none' : ''}`}>
                      <div>
                        <div className="font-mono text-xs font-bold text-purple-600 mb-1.5 flex flex-wrap items-center gap-2">
                          {course.course_id}
                          {prereqArr.length > 0 && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md text-[9px] border border-orange-200">มีตัวต่อ</span>}
                          {course.coreq && <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md text-[9px] border border-indigo-200">มีวิชาเรียนควบ</span>}
                          {isEngFlag && <span className="bg-slate-800 text-white px-2 py-0.5 rounded-md text-[9px] tracking-widest">ENG</span>}
                        </div>
                        <div className="text-[15px] font-extrabold text-slate-800 leading-snug group-hover:text-purple-700 transition-colors">{String(course.name_th || '').replace('*','')}</div>
                        <div className="text-[12px] text-slate-500 font-medium mt-0.5">{course.name_en}</div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">{course.credit_text}</span>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all shadow-sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredCourses.length === 0 && (
                  <div className="text-center py-16 text-slate-400">
                    <p className="text-sm font-bold text-slate-500">ไม่พบวิชาที่ค้นหา</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* ================= Admin Modals (Settings & Map Edit) ================= */}
      <AnimatePresence>
      {canManage && isAdminSettingsOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.form onSubmit={handleSaveSettings} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2rem] w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-extrabold text-slate-800">
                {settingsModalType === 'header' ? '✏️ ตั้งค่าข้อความหน้าจำลอง' :
                 settingsModalType === 'banner' ? '✏️ ตั้งค่าแบนเนอร์' :
                 settingsModalType === 'credits' ? '✏️ ตั้งค่าหน่วยกิตขั้นต่ำ' :
                 settingsModalType === 'years' ? '✏️ ตั้งค่าระยะเวลาศึกษา' : 
                 settingsModalType === 'gpa' ? '✏️ ตั้งค่าเกณฑ์เกรดเฉลี่ย' : 'ตั้งค่า'}
              </h2>
              <button type="button" onClick={() => setIsAdminSettingsOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-slate-50/30">
              {settingsModalType === 'header' && (
                <>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">หัวข้อหลัก</label><input type="text" value={settingsForm.title || ''} onChange={e => setSettingsForm({...settingsForm, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">พาดหัวย่อย (กด Enter ได้)</label><textarea value={settingsForm.subtitle || ''} onChange={e => setSettingsForm({...settingsForm, subtitle: e.target.value})} rows="2" className="w-full p-3 border border-slate-200 rounded-xl text-sm whitespace-pre-line"></textarea></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">คำอธิบาย (กด Enter ได้)</label><textarea value={settingsForm.description || ''} onChange={e => setSettingsForm({...settingsForm, description: e.target.value})} rows="2" className="w-full p-3 border border-slate-200 rounded-xl text-sm whitespace-pre-line"></textarea></div>
                </>
              )}

              {settingsModalType === 'banner' && (
                <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อแบนเนอร์ตาราง</label><input type="text" value={settingsForm.sec_flow_title || ''} onChange={e => setSettingsForm({...settingsForm, sec_flow_title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
              )}

              {settingsModalType === 'credits' && (
                <div><label className="block text-[11px] font-bold text-slate-700 mb-1">หน่วยกิตที่ต้องการ (ขั้นต่ำ)</label><input type="number" value={settingsForm.total_required_credits || ''} onChange={e => setSettingsForm({...settingsForm, total_required_credits: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
              )}

              {settingsModalType === 'years' && (
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ปีตามหลักสูตร</label><input type="number" value={settingsForm.standard_study_years || ''} onChange={e => setSettingsForm({...settingsForm, standard_study_years: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ปีสูงสุด</label><input type="number" value={settingsForm.max_study_years || ''} onChange={e => setSettingsForm({...settingsForm, max_study_years: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                </div>
              )}

              {settingsModalType === 'gpa' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">เกณฑ์เกรดเฉลี่ยขั้นต่ำ (GPAX)</label>
                  <input type="number" step="0.01" value={settingsForm.min_gpax || ''} onChange={e => setSettingsForm({...settingsForm, min_gpax: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" />
                </div>
              )}
            </div>
            
            <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
              <button type="button" onClick={() => setIsAdminSettingsOpen(false)} className="px-5 py-2.5 rounded-full text-slate-600 font-bold bg-slate-200 hover:bg-slate-300 text-sm transition-colors">ยกเลิก</button>
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md text-sm transition-colors">{isSaving ? 'บันทึก...' : 'บันทึกการตั้งค่า'}</button>
            </div>
          </motion.form>
        </div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {canManage && isAdminMapOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.form onSubmit={handleSaveMapEdit} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2rem] w-full max-w-sm flex flex-col shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-extrabold text-slate-800">
                {mapForm.type === 'year' ? '✏️ แก้ไขชั้นปี' : mapForm.type === 'term' ? '✏️ แก้ไขภาคเรียน' : '✏️ แก้ไขลำดับวิชาในเทอม'}
              </h2>
              <button type="button" onClick={() => setIsAdminMapOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
            </div>
            
            <div className="p-6 space-y-4 bg-slate-50/30">
              {mapForm.type === 'year' && (
                <>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ชั้นปีที่ (ตัวเลข)</label><input type="number" value={mapForm.year_number || ''} onChange={e => setMapForm({...mapForm, year_number: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ลำดับการแสดงผล</label><input type="number" value={mapForm.sort_order || 1} onChange={e => setMapForm({...mapForm, sort_order: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                </>
              )}

              {mapForm.type === 'term' && (
                <>
                  <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อภาคเรียน *</label><input type="text" value={mapForm.title || ''} onChange={e => setMapForm({...mapForm, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-[11px] font-bold text-slate-700 mb-1">รวมหน่วยกิต</label><input type="number" value={mapForm.total_credits || 0} onChange={e => setMapForm({...mapForm, total_credits: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                    <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ลำดับการแสดงผล</label><input type="number" value={mapForm.sort_order || 1} onChange={e => setMapForm({...mapForm, sort_order: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">รูปแบบแผนการเรียน</label>
                    <select value={mapForm.term_plan || 'all'} onChange={e => setMapForm({...mapForm, term_plan: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white">
                      <option value="all">เรียนทุกแผน</option><option value="normal">เฉพาะโครงการปกติ</option><option value="coop">เฉพาะสหกิจศึกษา</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">เป็นภาคฤดูร้อน?</label>
                    <select value={mapForm.is_summer || false} onChange={e => setMapForm({...mapForm, is_summer: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white">
                      <option value={false}>ไม่ใช่</option><option value={true}>ใช่ (ฤดูร้อน)</option>
                    </select>
                  </div>
                </>
              )}

              {mapForm.type === 'courseMap' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">รหัสวิชา</label>
                    <input type="text" value={mapForm.course_id || ''} disabled className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-100 text-slate-500 font-mono" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">ลำดับการแสดงผล</label>
                    <input type="number" value={mapForm.sort_order || 1} onChange={e => setMapForm({...mapForm, sort_order: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm" />
                  </div>
                </>
              )}
            </div>
            
            <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
              <button type="button" onClick={() => setIsAdminMapOpen(false)} className="px-5 py-2.5 rounded-full text-slate-600 font-bold bg-slate-200 hover:bg-slate-300 text-sm transition-colors">ยกเลิก</button>
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md text-sm transition-colors">{isSaving ? 'บันทึก...' : 'บันทึก'}</button>
            </div>
          </motion.form>
        </div>
      )}
      </AnimatePresence>

    </div>
  );
}