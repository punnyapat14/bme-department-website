import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion'; // 📌 เพิ่ม Framer Motion

// 📌 ดึงข้อมูลจากไฟล์ Data มาใช้ทั้งหมด
import { COURSE_LIST, GRADE_POINTS, YEARLY_PLAN } from '../../data/curriculumData';

// ==========================================
// 📌 Component: พื้นหลังแสงออโรร่า (Theme หลัก)
// ==========================================
const AuroraBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#fcfbfe] overflow-hidden pointer-events-none">
    <style>{`
      .aurora-effect {
        --aurora-white: #ffffff;
        --aurora-transparent: rgba(255,255,255,0);
        --aurora-c1: #c084fc; 
        --aurora-c2: #fb7185; 
        --aurora-c3: #818cf8; 
        --aurora-c4: #f472b6; 
        --aurora-c5: #a78bfa; 
        --light-gradient: repeating-linear-gradient(100deg, var(--aurora-white) 0%, var(--aurora-white) 7%, var(--aurora-transparent) 10%, var(--aurora-transparent) 12%, var(--aurora-white) 16%);
        --aurora-bg: repeating-linear-gradient(100deg, var(--aurora-c1) 10%, var(--aurora-c2) 15%, var(--aurora-c3) 20%, var(--aurora-c4) 25%, var(--aurora-c5) 30%);
        background-image: var(--light-gradient), var(--aurora-bg);
        background-size: 300% 200%;
        background-position: 50% 50%, 50% 50%;
        filter: blur(14px); 
      }
    `}</style>
    <motion.div animate={{ x: ["0%", "2%", "-2%", "0%"], y: ["0%", "-2%", "2%", "0%"] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-300/10 blur-[100px]" />
    <motion.div animate={{ x: ["0%", "-2%", "2%", "0%"], y: ["0%", "2%", "-2%", "0%"] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-rose-200/10 blur-[100px]" />
  </div>
);

// ==========================================
// 📌 Component: Section Banner (ป้ายแบนเนอร์แบ่งหมวด)
// ==========================================
const SectionBanner = ({ line1, line2, variant = "website" }) => {
  const config = {
    calendar: { bgs: ['bg-[#3b82f6]', 'bg-[#f59e0b]', 'bg-[#10b981]', 'bg-[#8b5cf6]', 'bg-[#ec4899]', 'bg-[#0ea5e9]'], text: 'bg-white text-slate-800' },
    website: { bgs: ['bg-[#a16dd1]', 'bg-[#01aa3a]', 'bg-[#f9703d]', 'bg-[#c5e9e7]', 'bg-[#df3470]', 'bg-[#dced11]'], text: 'bg-[#f1ede3] text-[#343330]' },
    exam: { bgs: ['bg-rose-500', 'bg-teal-500', 'bg-indigo-500', 'bg-amber-400', 'bg-fuchsia-500', 'bg-sky-400'], text: 'bg-rose-50/90 text-rose-950' }
  };
  const theme = config[variant] || config.website;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} whileHover={{ scale: 1.01 }} transition={{ duration: 0.4 }} className="w-full mx-auto mb-10 flex flex-col gap-2 md:gap-3 cursor-default">
      <div className="flex gap-2 md:gap-3 h-16 md:h-20 w-full">
        <div className={`${theme.bgs[0]} rounded-xl md:rounded-3xl w-[20%] md:w-[24%] flex items-center justify-center shadow-sm overflow-hidden`}>
           <div className="w-4 h-12 bg-white/90 rounded-sm rotate-12"></div>
        </div>
        <div className={`${theme.text} rounded-xl md:rounded-3xl flex-1 flex items-center justify-center shadow-sm`}>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">{line1}</h2>
        </div>
        <div className={`${theme.bgs[1]} rounded-xl md:rounded-3xl w-[18%] md:w-[20%] flex items-center justify-center shadow-sm overflow-hidden`}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white/90 rounded-full"></div>
        </div>
      </div>
      <div className="flex gap-2 md:gap-3 h-16 md:h-20 w-full">
        <div className={`${theme.bgs[2]} rounded-xl md:rounded-3xl w-[20%] md:w-[24%] flex items-center justify-center shadow-sm overflow-hidden relative`}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white/90 rotate-45 rounded-sm"></div>
        </div>
        <div className={`${theme.text} rounded-xl md:rounded-3xl flex-1 flex items-center justify-center shadow-sm`}>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">{line2}</h2>
        </div>
        <div className={`${theme.bgs[3]} rounded-xl md:rounded-3xl w-[12%] md:w-[15%] flex items-center justify-center shadow-sm overflow-hidden`}>
           <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-white/90 rounded-full border-dashed"></div>
        </div>
        <div className={`${theme.bgs[4]} rounded-xl md:rounded-3xl w-[12%] md:w-[15%] relative overflow-hidden shadow-sm hidden sm:block`}>
          <div className="absolute inset-0 bg-white/30 rounded-full scale-150"></div>
        </div>
      </div>
    </motion.div>
  );
};


// 📌 ฟังก์ชันสำหรับจัดเรียนวิชาเริ่มต้น (Default State) ป้องกันข้อมูลพัง
const generateDefaultPlanState = (targetPlan) => {
  const defaultState = [];
  if (!YEARLY_PLAN) return defaultState; 

  YEARLY_PLAN.forEach((yearItem, yIdx) => {
    const yearNum = yIdx + 1;
    const terms = yearItem.terms || [];
    const visibleTerms = terms.filter(term => term.plan === 'all' || term.plan === targetPlan);

    visibleTerms.forEach((term, tIdx) => {
      const termTitle = String(term.title || '');
      let termNum;
      if (term.isSummer || termTitle.includes('ฤดูร้อน')) { termNum = 3; } 
      else if (termTitle.includes('สหกิจศึกษา') && !termTitle.includes('ที่ 1') && !termTitle.includes('ที่ 2')) { termNum = 4; } 
      else if (termTitle.includes('ที่ 1') || termTitle.includes('เทอม 1')) { termNum = 1; } 
      else if (termTitle.includes('ที่ 2') || termTitle.includes('เทอม 2')) { termNum = 2; } 
      else { termNum = tIdx + 1; }

      const semesterId = `y${yearNum}s${termNum}`;
      const courses = term.courses || [];

      courses.forEach((c) => {
        const courseIdStr = String(c.id || '');
        const masterData = (COURSE_LIST || []).find(master => String(master.id) === courseIdStr);
        const rawName = masterData ? masterData.nameTH : (c.name || '');
        const nameTH = String(rawName).replace('*', ''); 

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

  const computedData = useMemo(() => {
    let passedCredits = 0;
    let totalEnrolledCredits = 0;
    let pendingCredits = 0;
    let qualityPoints = 0;
    let gradedCredits = 0;

    const planWithDetails = myPlan.map(instance => {
      const courseIdStr = String(instance.id || '');
      const masterData = (COURSE_LIST || []).find(c => String(c.id) === courseIdStr);
      
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

  const filteredCourses = useMemo(() => {
    if (!COURSE_LIST) return [];
    return COURSE_LIST.filter(c => {
      const isAlreadyInPlan = myPlan.some(p => String(p.id) === String(c.id));
      if (isAlreadyInPlan) return false;

      const searchLower = String(searchQuery || '').toLowerCase();
      const idStr = String(c.id || '').toLowerCase();
      const nameTHStr = String(c.nameTH || '').toLowerCase();
      const nameENStr = String(c.nameEN || '').toLowerCase();

      return idStr.includes(searchLower) || nameTHStr.includes(searchLower) || nameENStr.includes(searchLower);
    });
  }, [myPlan, searchQuery]);

  const TOTAL_REQUIRED_CREDITS = 146;
  const MAX_STUDY_YEARS = 8;
  const STANDARD_STUDY_YEARS = 4;
  const safeGradePointsKeys = Object.keys(GRADE_POINTS || {}).filter(g => g !== 'ยังไม่ระบุ');

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 relative overflow-hidden";

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />
      
      <div className="relative z-10 max-w-[1500px] mx-auto px-4 md:px-6 pt-2">
        
        {/* ---------------- Header Section ---------------- */}
        <div className="text-center max-w-4xl mx-auto pt-2 pb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
            จำลองแผนการเรียน
          </h1>
          <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl mb-2">
            หลักสูตรวิศวกรรมชีวการแพทย์ ฉบับปรับปรุง พ.ศ. 2567
          </p>
          <p className="text-slate-500 text-sm md:text-base">
            ทดลองจัดแผนการเรียนเพื่อดู <span className="font-bold text-purple-700">GPAX</span> และขีดจำกัดหน่วยกิต
          </p>
        </div>

        {/* ---------------- 📌 1. แผนผังการเรียน (Dashboard สรุปผล) ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12 md:mb-16">
            {/* Card 1: หน่วยกิต */}
            <div className="rounded-[1.5rem] p-6 bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100/60 text-slate-700 shadow-sm relative overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-rose-200/30 blur-2xl"></div>
              <h3 className="text-xl font-black mb-4 border-b border-rose-200/60 pb-3 text-rose-600">หน่วยกิตสะสม</h3>
              <div className="flex-1 space-y-2 font-medium text-sm">
                <div className="flex justify-between text-slate-500"><span>หน่วยกิตขั้นต่ำ</span><span className="font-bold text-slate-700">{TOTAL_REQUIRED_CREDITS}</span></div>
                <div className="flex justify-between text-slate-500"><span>ลงทะเบียนแล้ว</span><span className="font-bold text-slate-700">{computedData.totalEnrolledCredits}</span></div>
                <div className="flex justify-between text-slate-500"><span>สอบผ่านแล้ว</span><span className="font-bold text-emerald-600">{computedData.passedCredits}</span></div>
                <div className="flex justify-between text-slate-500"><span>อยู่ระหว่างศึกษา</span><span className="font-bold text-slate-400">{computedData.pendingCredits}</span></div>
              </div>
              <div className="mt-6 flex justify-between items-center pt-4 border-t border-rose-200/60">
                <span className="font-bold text-sm text-slate-700">สถานะหน่วยกิต</span>
                {computedData.passedCredits >= TOTAL_REQUIRED_CREDITS ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black shadow-sm">ผ่านเกณฑ์</span>
                ) : (
                  <span className="px-3 py-1 bg-white border border-slate-200 text-slate-500 rounded-full text-xs font-black shadow-sm">ยังไม่ครบ</span>
                )}
              </div>
            </div>

            {/* Card 2: ปีที่เรียน */}
            <div className="rounded-[1.5rem] p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/60 text-slate-700 shadow-sm relative overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="absolute bottom-0 right-0 -mr-4 -mb-4 w-24 h-24 rounded-full bg-blue-200/30 blur-xl"></div>
              <h3 className="text-xl font-black mb-4 border-b border-blue-200/60 pb-3 text-blue-600">ระยะเวลาศึกษา</h3>
              <div className="flex-1 space-y-2 font-medium text-sm">
                <div className="flex justify-between text-slate-500"><span>ระยะเวลาตามหลักสูตร</span><span className="font-bold text-slate-700">{STANDARD_STUDY_YEARS} ปี</span></div>
                <div className="flex justify-between text-slate-500"><span>ระยะเวลาสูงสุด</span><span className="font-bold text-slate-700">{MAX_STUDY_YEARS} ปี</span></div>
                <div className="flex justify-between mt-4 text-lg text-slate-600"><span>ชั้นปีปัจจุบัน</span><span className="font-black text-blue-600">ปีที่ {computedData.currentYear}</span></div>
              </div>
              <div className="mt-6 flex justify-between items-center pt-4 border-t border-blue-200/60">
                <span className="font-bold text-sm text-slate-700">สถานะระยะเวลา</span>
                {computedData.currentYear <= MAX_STUDY_YEARS ? (
                  <span className="px-3 py-1 bg-white border border-slate-200 text-slate-500 rounded-full text-xs font-black shadow-sm">ปกติ</span>
                ) : (
                  <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-black shadow-sm">พ้นสภาพ</span>
                )}
              </div>
            </div>

            {/* Card 3: GPAX */}
            <div className="rounded-[1.5rem] p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100/60 text-slate-700 shadow-sm relative overflow-hidden flex flex-col hover:shadow-md transition-shadow">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-purple-200/30 blur-3xl"></div>
              <h3 className="text-xl font-black mb-4 border-b border-purple-200/60 pb-3 text-purple-600">เกรดเฉลี่ยสะสม</h3>
              <div className="flex-1 flex flex-col justify-center items-center py-2 relative z-10">
                <span className="text-6xl font-black tracking-tighter drop-shadow-sm text-purple-700">{computedData.gpax}</span>
                <span className="text-sm font-medium mt-2 text-slate-500">เกณฑ์ขั้นต่ำ 2.00</span>
              </div>
              <div className="mt-4 flex justify-between items-center pt-4 border-t border-purple-200/60 relative z-10">
                <span className="font-bold text-sm text-slate-700">สถานะเกรด</span>
                {parseFloat(computedData.gpax) >= 2.00 ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-black shadow-sm">ปลอดภัย</span>
                ) : parseFloat(computedData.gpax) > 0 ? (
                  <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-black shadow-sm">วิกฤต</span>
                ) : (
                  <span className="px-3 py-1 bg-white border border-slate-200 text-slate-500 rounded-full text-xs font-black shadow-sm">รอประมวลผล</span>
                )}
              </div>
            </div>
          </div>

        {/* ---------------- 📌 2. แผนการเรียนแต่ละชั้นปี ---------------- */}
        <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50`}>
          <div className="mt-10 flex flex-col gap-12">
            {(YEARLY_PLAN || []).map((yearItem, yIdx) => {
              const yearNum = yIdx + 1;
              const terms = yearItem.terms || [];
              const visibleTerms = terms.filter(term => term.plan === 'all' || term.plan === activePlan);
              if (visibleTerms.length === 0) return null;

              return (
                <div key={yIdx} className="bg-slate-50/50 p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <h3 className="text-2xl font-extrabold text-slate-800 mb-8 flex items-center gap-3 border-b border-slate-200 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white shadow-md">{yearNum}</div>
                    {yearItem.year}
                  </h3>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {visibleTerms.map((term, tIdx) => {
                      const termTitle = String(term.title || '');
                      let termNum;
                      if (term.isSummer || termTitle.includes('ฤดูร้อน')) { termNum = 3; } 
                      else if (termTitle.includes('สหกิจศึกษา') && !termTitle.includes('ที่ 1') && !termTitle.includes('ที่ 2')) { termNum = 4; } 
                      else if (termTitle.includes('ที่ 1') || termTitle.includes('เทอม 1')) { termNum = 1; } 
                      else if (termTitle.includes('ที่ 2') || termTitle.includes('เทอม 2')) { termNum = 2; } 
                      else { termNum = tIdx + 1; }
                      
                      const semanticSemesterId = `y${yearNum}s${termNum}`;
                      const coursesInTerm = computedData.planWithDetails.filter(c => c.semesterId === semanticSemesterId);
                      const enrolledCredits = coursesInTerm.reduce((sum, c) => sum + c.credit, 0);

                      const limit = term.isSummer || termTitle.includes('ฤดูร้อน') ? 9 : 22;
                      const hasInternship = coursesInTerm.some(c => String(c.nameTH || '').includes('สหกิจ') || String(c.nameTH || '').includes('ฝึกงาน'));
                      
                      const isOverLimit = enrolledCredits > limit;
                      const isUnderCredit = enrolledCredits > 0 && enrolledCredits < 9 && !term.isSummer && !termTitle.includes('ฤดูร้อน') && !hasInternship;
                      
                      return (
                        <div key={semanticSemesterId} className={`rounded-[1.5rem] border ${isOverLimit || isUnderCredit ? 'border-rose-200 bg-rose-50/30 shadow-[0_4px_15px_rgba(244,63,94,0.05)]' : term.isSummer || termTitle.includes('ฤดูร้อน') ? 'border-dashed border-slate-300 bg-white' : 'border-slate-200 bg-white shadow-sm'} p-6 flex flex-col transition-all hover:shadow-md`}>
                          
                          <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-4">
                            <h4 className="font-extrabold text-[16px] text-slate-800 tracking-tight flex items-center gap-2">
                               <span className="w-2 h-2 rounded-full bg-indigo-500"></span> {term.title}
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
                                <strong className="font-bold">แจ้งเตือน:</strong> หน่วยกิต{isOverLimit ? 'เกิน' : 'ต่ำกว่า'}เกณฑ์กำหนด ต้องดำเนินการยื่นคำร้องขอลงทะเบียน{isOverLimit ? 'สูง' : 'ต่ำ'}กว่าเกณฑ์
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col gap-3.5 flex-1 mb-5">
                            {coursesInTerm.map(c => {
                              const nameTHStr = String(c.nameTH || '');
                              const idStr = String(c.id || '');
                              const isElectivePlaceholder = nameTHStr.includes('วิชาเลือก') || idStr.includes('XXX') || idStr.includes('XXXX');

                              return (
                                <div key={c.uid} className={`rounded-[1rem] border p-4 flex flex-col justify-between gap-3 relative transition-colors ${c.grade === 'ยังไม่ระบุ' ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 shadow-sm hover:border-purple-200'}`}>
                                  
                                  <div className="flex justify-between items-start gap-2 pr-6">
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

                                  {Array.isArray(c.prereq) && c.prereq.length > 0 && (
                                    <div className="absolute top-4 -left-3" title={`ต้องผ่านวิชาบังคับก่อน: ${c.prereq.join(', ')}`}>
                                      <div className="w-6 h-6 rounded-full bg-orange-100 border-2 border-orange-300 text-orange-600 flex items-center justify-center shadow-md">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                      </div>
                                    </div>
                                  )}

                                  {isElectivePlaceholder && (
                                    <div className="mt-2 pt-3 pb-1 border-t border-slate-100 border-dashed flex flex-col gap-2">
                                      <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
                                        <svg className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        ระบุวิชาที่เลือกลงเรียน:
                                      </div>
                                      <input type="text" placeholder="รหัสวิชา (ถ้ามี)..." value={c.customCode || ''} onChange={(e) => handleCustomDetailChange(c.uid, 'customCode', e.target.value)} className="text-[11px] px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-400 focus:bg-white w-full placeholder:text-slate-300 font-mono transition-colors bg-slate-50/50" />
                                      <input type="text" placeholder="ชื่อวิชา (ภาษาไทย)..." value={c.customNameTH || ''} onChange={(e) => handleCustomDetailChange(c.uid, 'customNameTH', e.target.value)} className="text-[11px] px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-400 focus:bg-white w-full placeholder:text-slate-300 transition-colors bg-slate-50/50" />
                                    </div>
                                  )}

                                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center mt-1 gap-2">
                                    <select 
                                      value={c.grade} 
                                      onChange={(e) => handleGradeChange(c.uid, e.target.value)}
                                      className={`text-xs font-bold px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-200 shadow-sm appearance-none pr-8 relative transition-colors ${c.grade === 'ยังไม่ระบุ' ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-slate-800 text-white border border-slate-700'}`}
                                      style={{ backgroundImage: c.grade === 'ยังไม่ระบุ' ? 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23d97706\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")' : 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23ffffff\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em'}}
                                    >
                                      <option value="ยังไม่ระบุ">รอระบุเกรด</option>
                                      {safeGradePointsKeys.map(grade => (
                                        <option key={grade} value={grade}>{grade}</option>
                                      ))}
                                    </select>
                                    
                                    <button onClick={() => handleRemoveCourse(c.uid)} className="text-[11px] font-bold text-slate-400 hover:text-rose-600 px-2 py-1 rounded transition-colors whitespace-nowrap">
                                      นำออก
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="mt-auto pt-4 border-t border-slate-100">
                            <button 
                              onClick={() => openCourseModal(semanticSemesterId, term.title)}
                              className="w-full py-3 rounded-xl text-center text-[13px] font-bold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 bg-slate-100 hover:bg-purple-600 text-slate-600 hover:text-white border border-slate-200 hover:border-purple-600 hover:shadow-lg hover:shadow-purple-600/20"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                              เพิ่มรายวิชาในเทอมนี้
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------------- Modal ค้นหาและเลือกวิชา ---------------- */}
      {isModalOpen && targetSemester && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-3xl rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl flex flex-col max-h-[85vh] animate-[popUpFade_0.2s_ease-out]">
            
            <div className="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                  </div>
                  เลือกวิชาเรียนลงใน {targetSemester.title}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                  type="text"
                  placeholder="พิมพ์ค้นหารหัสวิชา, ชื่อภาษาไทย หรือ English name..."
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none text-slate-700 font-bold shadow-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/50">
              <div className="flex flex-col gap-3">
                {filteredCourses.map(course => {
                  const prereqArr = Array.isArray(course.prereq) ? course.prereq : [];
                  const isEngFlag = String(course.nameTH || '').includes('*');

                  return (
                    <div 
                      key={course.id} 
                      onClick={() => handleAddCourse(course)}
                      className="bg-white p-5 rounded-[1.25rem] border border-slate-200 shadow-sm hover:border-purple-400 hover:shadow-md cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div>
                        <div className="font-mono text-xs font-bold text-purple-600 mb-1.5 flex flex-wrap items-center gap-2">
                          {course.id}
                          {prereqArr.length > 0 && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md text-[9px] border border-orange-200">มีตัวต่อ</span>}
                          {course.coreq && <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md text-[9px] border border-indigo-200">มีวิชาเรียนควบ</span>}
                          {isEngFlag && <span className="bg-slate-800 text-white px-2 py-0.5 rounded-md text-[9px] tracking-widest">ENG</span>}
                        </div>
                        <div className="text-[15px] font-extrabold text-slate-800 leading-snug group-hover:text-purple-700 transition-colors">{String(course.nameTH || '').replace('*','')}</div>
                        <div className="text-[12px] text-slate-500 font-medium mt-0.5">{course.nameEN}</div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">{course.creditText || `${course.credit || 0} นก.`}</span>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all shadow-sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredCourses.length === 0 && (
                  <div className="text-center py-16 text-slate-400">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <p className="text-sm font-bold text-slate-500">ไม่พบวิชาที่ค้นหา</p>
                    <p className="text-xs mt-1">วิชานี้อาจถูกจัดลงตารางไปแล้ว หรือไม่มีในฐานข้อมูล</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popUpFade {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}