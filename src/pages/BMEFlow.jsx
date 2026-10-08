import React, { useState, useMemo, useEffect } from 'react';

// 📌 ดึงข้อมูลจากไฟล์ Data มาใช้ทั้งหมด
import { COURSE_LIST, GRADE_POINTS, YEARLY_PLAN } from '../data/curriculumData';

// 📌 ฟังก์ชันสำหรับจัดเรียนวิชาเริ่มต้น (Default State) ป้องกันข้อมูลพัง
const generateDefaultPlanState = (targetPlan) => {
  const defaultState = [];
  if (!YEARLY_PLAN) return defaultState; // ป้องกัน YEARLY_PLAN ไม่มีค่า

  YEARLY_PLAN.forEach((yearItem, yIdx) => {
    const yearNum = yIdx + 1;
    const terms = yearItem.terms || [];
    
    // กรองเอาเฉพาะเทอมที่แสดงผลตามแผน (โครงการปกติ หรือ สหกิจ)
    const visibleTerms = terms.filter(term => term.plan === 'all' || term.plan === targetPlan);

    visibleTerms.forEach((term, tIdx) => {
      const termTitle = String(term.title || '');
      let termNum;
      if (term.isSummer || termTitle.includes('ฤดูร้อน')) {
        termNum = 3;
      } else if (termTitle.includes('สหกิจศึกษา') && !termTitle.includes('ที่ 1') && !termTitle.includes('ที่ 2')) {
        termNum = 4;
      } else if (termTitle.includes('ที่ 1') || termTitle.includes('เทอม 1')) {
        termNum = 1;
      } else if (termTitle.includes('ที่ 2') || termTitle.includes('เทอม 2')) {
        termNum = 2;
      } else {
        termNum = tIdx + 1; 
      }

      const semesterId = `y${yearNum}s${termNum}`;
      const courses = term.courses || [];

      // จับวิชาทั้งหมดในเทอมนั้นๆ ลง Default State
      courses.forEach((c) => {
        const courseIdStr = String(c.id || '');
        const masterData = (COURSE_LIST || []).find(master => String(master.id) === courseIdStr);
        const rawName = masterData ? masterData.nameTH : (c.name || '');
        const nameTH = String(rawName).replace('*', ''); // ป้องกัน .replace พัง

        defaultState.push({
          uid: `${courseIdStr}-${semesterId}-${Date.now()}-${Math.random()}`, 
          id: courseIdStr,
          nameTH: nameTH, 
          nameEN: masterData ? masterData.nameEN || '' : '',
          creditText: masterData ? masterData.creditText : c.credit, 
          semesterId: semesterId,
          grade: 'ยังไม่ระบุ'
        });
      });
    });
  });
  return defaultState;
};

export default function BMEFlow() {
  const [activePlan, setActivePlan] = useState('normal'); 
  const [myPlan, setMyPlan] = useState(() => generateDefaultPlanState('normal'));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetSemester, setTargetSemester] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setMyPlan(generateDefaultPlanState(activePlan));
  }, [activePlan]);

  const handleCustomDetailChange = (uid, field, value) => {
    setMyPlan(prev => prev.map(c => c.uid === uid ? { ...c, [field]: value } : c));
  };

  // 📌 คำนวณ GPAX และ หน่วยกิตโดยละเอียด (ป้องกันข้อมูล NaN หรือ Undefined)
  const computedData = useMemo(() => {
    let passedCredits = 0;
    let totalEnrolledCredits = 0;
    let pendingCredits = 0;
    let qualityPoints = 0;
    let gradedCredits = 0;

    const planWithDetails = myPlan.map(instance => {
      const courseIdStr = String(instance.id || '');
      const masterData = (COURSE_LIST || []).find(c => String(c.id) === courseIdStr);
      
      // ดึงตัวเลขหน่วยกิตอย่างปลอดภัย
      const creditStr = String(instance.creditText || '0');
      const creditNumber = parseInt(creditStr.split('(')[0].replace(/\D/g, '')) || 0;
      
      totalEnrolledCredits += creditNumber;

      if (!instance.grade || instance.grade === 'ยังไม่ระบุ') {
        pendingCredits += creditNumber;
      }

      const safeGradePoints = GRADE_POINTS || {};
      const points = safeGradePoints[instance.grade];
      if (points !== undefined && points !== null) { 
        qualityPoints += (creditNumber * points);
        gradedCredits += creditNumber;
        if (points > 0) passedCredits += creditNumber; 
      }

      return {
        ...instance,
        credit: creditNumber,
        prereq: masterData ? (Array.isArray(masterData.prereq) ? masterData.prereq : []) : [],
        isEng: String(instance.nameTH || '').includes('*')
      };
    });

    const gpax = gradedCredits > 0 ? (qualityPoints / gradedCredits).toFixed(2) : '0.00';
    
    let currentYear = 1;
    if (myPlan.length > 0) {
      const years = myPlan.map(c => parseInt(String(c.semesterId || '').replace('y', '').split('s')[0]) || 1);
      currentYear = Math.max(...years);
    }

    return { planWithDetails, gpax, passedCredits, totalEnrolledCredits, pendingCredits, currentYear };
  }, [myPlan]);

  const handleGradeChange = (uid, newGrade) => {
    setMyPlan(prev => prev.map(c => c.uid === uid ? { ...c, grade: newGrade } : c));
  };

  const handleRemoveCourse = (uid) => {
    if (window.confirm('คุณต้องการนำรายวิชานี้ออกจากแผนการเรียนจำลองหรือไม่?')) {
      setMyPlan(prev => prev.filter(c => c.uid !== uid));
    }
  };

  const openCourseModal = (semanticSemesterId, termTitle) => {
    setTargetSemester({ id: semanticSemesterId, title: termTitle });
    setSearchQuery('');
    setIsModalOpen(true);
  };

  const handleAddCourse = (course) => {
    let coursesToAdd = [{ ...course, uid: `${course.id}-${Date.now()}`, semesterId: targetSemester.id, grade: 'ยังไม่ระบุ' }];
    setMyPlan(prev => [...prev, ...coursesToAdd]);
    setIsModalOpen(false);
  };

  // 📌 ค้นหาวิชา (ป้องกัน Text Case Error)
  const filteredCourses = useMemo(() => {
    if (!COURSE_LIST) return [];
    return COURSE_LIST.filter(c => {
      const isAlreadyInPlan = myPlan.some(p => String(p.id) === String(c.id));
      if (isAlreadyInPlan) return false;

      const searchLower = String(searchQuery || '').toLowerCase();
      const idStr = String(c.id || '').toLowerCase();
      const nameTHStr = String(c.nameTH || '').toLowerCase();
      const nameENStr = String(c.nameEN || '').toLowerCase();

      return idStr.includes(searchLower) || 
             nameTHStr.includes(searchLower) || 
             nameENStr.includes(searchLower);
    });
  }, [myPlan, searchQuery]);

  const TOTAL_REQUIRED_CREDITS = 146;
  const MAX_STUDY_YEARS = 8;
  const STANDARD_STUDY_YEARS = 4;
  const safeGradePointsKeys = Object.keys(GRADE_POINTS || {}).filter(g => g !== 'ยังไม่ระบุ');

  return (
    <div className="bg-[#f4f6fa] min-h-screen pb-20 font-sans text-slate-800">
      
      {/* ---------------- Header Section ---------------- */}
      <div className="bg-white border-b border-slate-200/80 pt-16 pb-12 px-6 text-center relative shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-purple-700 to-black"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold tracking-widest uppercase mb-4 border border-purple-100">
            Curriculum Simulator
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 leading-tight">
            จำลองแผนการเรียน (BME Flow Simulator)
          </h1>
          <p className="font-light text-slate-500 text-sm md:text-base leading-relaxed mb-6">
            หลักสูตรวิศวกรรมชีวการแพทย์ ฉบับปรับปรุง พ.ศ. 2567<br className="hidden md:block"/>
            ทดลองจัดแผนการเรียนเพื่อดู <span className="font-bold text-purple-700">GPAX</span> และขีดจำกัดหน่วยกิตตาม <strong className="underline">หลักสูตรที่ถูกต้อง</strong>
          </p>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 mt-10 flex flex-col gap-10">
        
        {/* ---------------- 📌 1. Dashboard สรุปผล ---------------- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-2">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
            สรุปผลการจัดแผนการเรียน
          </h2>
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-full md:w-auto mt-4 md:mt-0">
            <button 
              onClick={() => setActivePlan('normal')} 
              className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${activePlan === 'normal' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              โครงการปกติ
            </button>
            <button 
              onClick={() => setActivePlan('coop')} 
              className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${activePlan === 'coop' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              โครงการสหกิจศึกษา
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4 w-full">
          {/* Card 1: หน่วยกิต */}
          <div className="rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex flex-col border border-slate-200">
            <div className="bg-[#f05d43] text-white font-bold py-3.5 px-6 text-lg tracking-wide">หน่วยกิต</div>
            <div className="bg-[#f4f6f9] p-6 flex-1 flex flex-col">
              <div className="flex justify-between mb-3 text-[#f05d43] font-medium"><span>หน่วยกิตขั้นต่ำ</span><span>: {TOTAL_REQUIRED_CREDITS}</span></div>
              <div className="flex justify-between mb-3 text-[#f05d43] font-medium"><span>หน่วยกิตที่ลง</span><span>: {computedData.totalEnrolledCredits}</span></div>
              <div className="flex justify-between mb-3 text-[#f05d43] font-medium"><span>หน่วยกิตที่ผ่าน</span><span>: {computedData.passedCredits}</span></div>
              <div className="flex justify-between mb-5 text-[#f05d43] font-medium"><span>หน่วยกิตที่รอ</span><span>: {computedData.pendingCredits}</span></div>
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-200">
                <span className="text-[#f05d43] font-bold">ผลการตรวจสอบ</span>
                {computedData.passedCredits >= TOTAL_REQUIRED_CREDITS ? (
                  <div className="w-8 h-8 rounded-full bg-[#20d289] text-white flex items-center justify-center shadow-md"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#cc0033] text-white flex items-center justify-center shadow-md"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg></div>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: ปีที่เรียน */}
          <div className="rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex flex-col border border-slate-700">
            <div className="bg-[#4a5a73] text-white font-bold py-3.5 px-6 text-lg tracking-wide">ปีที่เรียน</div>
            <div className="bg-[#5c6e8a] p-6 flex-1 flex flex-col text-white">
              <div className="flex justify-between mb-3 font-medium"><span>ปีที่เรียนสูงสุด</span><span>: {MAX_STUDY_YEARS}</span></div>
              <div className="flex justify-between mb-3 font-medium"><span>ปีที่เรียน</span><span>: {STANDARD_STUDY_YEARS}</span></div>
              <div className="flex justify-between mb-5 font-medium"><span>ชั้นปี</span><span>: {computedData.currentYear}</span></div>
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/20">
                <span className="font-bold">ผลการตรวจสอบ</span>
                {computedData.currentYear <= MAX_STUDY_YEARS ? (
                  <div className="w-8 h-8 rounded-full bg-[#20d289] text-white flex items-center justify-center shadow-md"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#cc0033] text-white flex items-center justify-center shadow-md"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg></div>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: GPAX */}
          <div className="rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex flex-col border border-slate-700">
            <div className="bg-[#4a5a73] text-white font-bold py-3.5 px-6 text-lg tracking-wide">GPAX</div>
            <div className="bg-[#5c6e8a] p-6 flex-1 flex flex-col text-white">
              <div className="flex justify-between mb-3 font-medium"><span>GPAX ขั้นต่ำ</span><span>: 2.00</span></div>
              <div className="flex justify-between mb-5 font-medium"><span>GPAX</span><span>: {computedData.gpax}</span></div>
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/20">
                <span className="font-bold">ผลการตรวจสอบ</span>
                {parseFloat(computedData.gpax) >= 2.00 ? (
                  <div className="w-8 h-8 rounded-full bg-[#20d289] text-white flex items-center justify-center shadow-md"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#cc0033] text-white flex items-center justify-center shadow-md"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- 📌 2. แผนการศึกษาแยกตามเทอม ---------------- */}
        <section className="mb-10 flex flex-col gap-10">
          {(YEARLY_PLAN || []).map((yearItem, yIdx) => {
            const yearNum = yIdx + 1;
            const terms = yearItem.terms || [];
            
            const visibleTerms = terms.filter(term => term.plan === 'all' || term.plan === activePlan);
            if (visibleTerms.length === 0) return null;

            return (
              <div key={yIdx} className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200/80">
                <h3 className="text-xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-white">{yearNum}</div>
                  {yearItem.year}
                </h3>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {visibleTerms.map((term, tIdx) => {
                    const termTitle = String(term.title || '');
                    let termNum;
                    if (term.isSummer || termTitle.includes('ฤดูร้อน')) {
                      termNum = 3;
                    } else if (termTitle.includes('สหกิจศึกษา') && !termTitle.includes('ที่ 1') && !termTitle.includes('ที่ 2')) {
                      termNum = 4;
                    } else if (termTitle.includes('ที่ 1') || termTitle.includes('เทอม 1')) {
                      termNum = 1;
                    } else if (termTitle.includes('ที่ 2') || termTitle.includes('เทอม 2')) {
                      termNum = 2;
                    } else {
                      termNum = tIdx + 1;
                    }
                    
                    const semanticSemesterId = `y${yearNum}s${termNum}`;
                    
                    const coursesInTerm = computedData.planWithDetails.filter(c => c.semesterId === semanticSemesterId);
                    const enrolledCredits = coursesInTerm.reduce((sum, c) => sum + c.credit, 0);

                    // คำนวณเกณฑ์อย่างปลอดภัย
                    const limit = term.isSummer || termTitle.includes('ฤดูร้อน') ? 9 : 22;
                    const hasInternship = coursesInTerm.some(c => String(c.nameTH || '').includes('สหกิจ') || String(c.nameTH || '').includes('ฝึกงาน'));
                    
                    const isOverLimit = enrolledCredits > limit;
                    const isUnderCredit = enrolledCredits > 0 && enrolledCredits < 9 && !term.isSummer && !termTitle.includes('ฤดูร้อน') && !hasInternship;
                    
                    return (
                      <div key={semanticSemesterId} className={`rounded-2xl border ${isOverLimit || isUnderCredit ? 'border-red-300 bg-red-50/50 shadow-lg shadow-red-500/10' : term.isSummer || termTitle.includes('ฤดูร้อน') ? 'border-dashed border-slate-300 bg-slate-50/50' : 'border-slate-200'} p-5 flex flex-col`}>
                        
                        <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                          <h4 className="font-bold text-[15px] text-slate-800 tracking-tight">{term.title}</h4>
                          <div className="text-right whitespace-nowrap">
                            <div className={`text-[12px] font-extrabold ${isOverLimit || isUnderCredit ? 'text-red-600' : 'text-green-600'}`}>
                              รวม {enrolledCredits} <span className="font-medium text-slate-400">/ {limit} นก.</span>
                            </div>
                            {isOverLimit && <div className="text-[10px] font-bold text-red-500">เกินเกณฑ์ ({limit})</div>}
                            {isUnderCredit && <div className="text-[10px] font-bold text-red-500">ต่ำกว่าเกณฑ์ (9)</div>}
                          </div>
                        </div>
                        
                        {(isOverLimit || isUnderCredit) && (
                          <div className="bg-red-100 border border-red-200 text-red-800 rounded-xl p-3 mb-4 flex gap-2.5 items-start shadow-sm">
                            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <div className="text-[11px] font-bold leading-relaxed">
                              <strong className="font-bold tracking-wide">แจ้งเตือน:</strong> หน่วยกิต{isOverLimit ? 'เกิน' : 'ต่ำกว่า'}เกณฑ์ที่หลักสูตรกำหนด <br/>
                              ต้องดำเนินการยื่นคำร้องขอลงทะเบียน{isOverLimit ? 'สูง' : 'ต่ำ'}กว่าเกณฑ์ ที่ระบบ REG
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col gap-3 flex-1 mb-4">
                          {coursesInTerm.map(c => {
                            const nameTHStr = String(c.nameTH || '');
                            const idStr = String(c.id || '');
                            const isElectivePlaceholder = nameTHStr.includes('วิชาเลือก') || idStr.includes('XXX') || idStr.includes('XXXX');

                            return (
                              <div key={c.uid} className={`bg-white rounded-xl border p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-3 relative hover:shadow-md transition-shadow ${c.grade === 'ยังไม่ระบุ' ? 'border-amber-200' : 'border-slate-100'}`}>
                                
                                <div className="flex justify-between items-start gap-2 pr-6">
                                  <div className="flex-1">
                                    <div className="text-[10px] font-mono text-purple-600 font-bold tracking-wider mb-0.5">{c.customCode || c.id}</div>
                                    <div className="text-[13.5px] font-bold text-slate-900 leading-snug">{c.customNameTH || c.nameTH}</div>
                                    {(c.customNameEN || c.nameEN) && <div className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5 opacity-80">{c.customNameEN || c.nameEN}</div>}
                                  </div>
                                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0 pt-0.5">
                                    <span className="text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg whitespace-nowrap shadow-inner">{c.creditText}</span>
                                    {c.isEng && <span className="text-[8px] font-black bg-slate-800 text-white px-1.5 py-0.5 rounded tracking-widest shadow-sm">ENG</span>}
                                  </div>
                                </div>

                                {Array.isArray(c.prereq) && c.prereq.length > 0 && (
                                  <div className="absolute top-4 -left-3" title={`ต้องผ่านวิชาบังคับก่อน: ${c.prereq.join(', ')}`}>
                                    <div className="w-6 h-6 rounded-full bg-orange-100 border-2 border-orange-300 text-orange-700 flex items-center justify-center shadow-lg">
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    </div>
                                  </div>
                                )}

                                {isElectivePlaceholder && (
                                  <div className="mt-1 pt-2 pb-1 border-t border-slate-100 flex flex-col gap-1.5">
                                    <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mb-0.5">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                      กรอกข้อมูลวิชาที่เลือกลงเรียน:
                                    </div>
                                    <input 
                                      type="text" 
                                      placeholder="รหัสวิชา (ถ้ามี)..." 
                                      value={c.customCode || ''} 
                                      onChange={(e) => handleCustomDetailChange(c.uid, 'customCode', e.target.value)}
                                      className="text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 outline-none focus:border-purple-400 w-full placeholder:text-slate-300 font-mono"
                                    />
                                    <input 
                                      type="text" 
                                      placeholder="ชื่อวิชา (ภาษาไทย)..." 
                                      value={c.customNameTH || ''} 
                                      onChange={(e) => handleCustomDetailChange(c.uid, 'customNameTH', e.target.value)}
                                      className="text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 outline-none focus:border-purple-400 w-full placeholder:text-slate-300"
                                    />
                                    <input 
                                      type="text" 
                                      placeholder="ชื่อวิชา (ภาษาอังกฤษ)..." 
                                      value={c.customNameEN || ''} 
                                      onChange={(e) => handleCustomDetailChange(c.uid, 'customNameEN', e.target.value)}
                                      className="text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 outline-none focus:border-purple-400 w-full placeholder:text-slate-300"
                                    />
                                  </div>
                                )}

                                <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center mt-1 gap-2">
                                  <select 
                                    value={c.grade} 
                                    onChange={(e) => handleGradeChange(c.uid, e.target.value)}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-200 shadow-inner appearance-none pr-8 relative ${c.grade === 'ยังไม่ระบุ' ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-white text-slate-700 border border-slate-200'}`}
                                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em'}}
                                  >
                                    <option value="ยังไม่ระบุ">กรอกเกรด</option>
                                    {safeGradePointsKeys.map(grade => (
                                      <option key={grade} value={grade}>{grade}</option>
                                    ))}
                                  </select>
                                  
                                  <button 
                                    onClick={() => handleRemoveCourse(c.uid)}
                                    className="text-[11px] font-bold text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                                  >
                                    นำออก
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="mt-auto pt-3 border-t border-slate-100">
                          <button 
                            onClick={() => openCourseModal(semanticSemesterId, term.title)}
                            className="w-full py-3 rounded-xl text-center text-[13px] font-bold shadow-md transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                            เพิ่มรายวิชา
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

      </div>

      {/* ---------------- Modal ค้นหาและเลือกวิชา ---------------- */}
      {isModalOpen && targetSemester && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-3xl rounded-[2rem] overflow-hidden relative z-10 shadow-2xl flex flex-col max-h-[85vh] animate-[popUpFade_0.2s_ease-out]">
            
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <span className="w-2 h-6 bg-purple-600 rounded-full"></span>
                  เลือกวิชาเรียนลงใน {targetSemester.title}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 bg-white rounded-full p-1.5 shadow-sm border border-slate-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                  type="text"
                  placeholder="พิมพ์ค้นหารหัสวิชา, ชื่อภาษาไทย หรือ English name..."
                  className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-700 font-medium shadow-sm transition"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-100/50">
              <div className="flex flex-col gap-3">
                {filteredCourses.map(course => {
                  const prereqArr = Array.isArray(course.prereq) ? course.prereq : [];
                  const isEngFlag = String(course.nameTH || '').includes('*');

                  return (
                    <div 
                      key={course.id} 
                      onClick={() => handleAddCourse(course)}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-purple-400 hover:shadow-md cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div>
                        <div className="font-mono text-xs font-bold text-purple-600 mb-1 flex flex-wrap items-center gap-2">
                          {course.id}
                          {prereqArr.length > 0 && <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded text-[9px] border border-orange-200">มีตัวต่อ</span>}
                          {course.coreq && <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[9px] border border-indigo-200">มีวิชาเรียนควบ</span>}
                          {isEngFlag && <span className="bg-slate-800 text-white px-1.5 py-0.5 rounded text-[9px] tracking-widest">ENG</span>}
                        </div>
                        <div className="text-[14px] font-bold text-slate-800 leading-snug group-hover:text-purple-700">{String(course.nameTH || '').replace('*','')}</div>
                        <div className="text-[12px] text-slate-500 font-medium">{course.nameEN}</div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">{course.creditText || `${course.credit || 0} นก.`}</span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredCourses.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="text-sm font-medium">ไม่พบวิชาที่ค้นหา หรือวิชานี้ถูกจัดลงตารางไปแล้ว</p>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}

      <style>{`
        @keyframes popUpFade {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}