import React, { useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion } from 'framer-motion';
import bmeFlowImage from '../assets/bme_flow.png'; 

// 📌 ดึงข้อมูลจากไฟล์ Data (ดึง COURSE_LIST มาเพื่อหาข้อมูลตัวต่อและชื่อภาษาอังกฤษ)
import { CURRICULUM_CATEGORIES, YEARLY_PLAN, COURSE_LIST } from '../data/curriculumData';

// ==========================================
// 📌 Component: พื้นหลังแสงออโรร่า (Theme หลัก)
// ==========================================
const AuroraBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#fdfcff] overflow-hidden pointer-events-none">
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
// 📌 Component: Section Banner (ป้ายแบนเนอร์แบ่งหมวดแบบหลากหลายรูปทรง)
// ==========================================
const SectionBanner = ({ line1, line2, variant = "website" }) => {
  const config = {
    calendar: { bgs: ['bg-[#3b82f6]', 'bg-[#f59e0b]', 'bg-[#10b981]', 'bg-[#8b5cf6]', 'bg-[#ec4899]', 'bg-[#0ea5e9]'], text: 'bg-[#eff6ff] text-[#1e3a8a]' },
    website: { bgs: ['bg-[#a16dd1]', 'bg-[#01aa3a]', 'bg-[#f9703d]', 'bg-[#c5e9e7]', 'bg-[#df3470]', 'bg-[#dced11]'], text: 'bg-[#fdf4ff] text-[#4a044e]' },
    exam: { bgs: ['bg-rose-500', 'bg-teal-500', 'bg-indigo-500', 'bg-amber-400', 'bg-fuchsia-500', 'bg-sky-400'], text: 'bg-rose-50 text-rose-950' }
  };
  const theme = config[variant] || config.website;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} whileHover={{ scale: 1.01 }} transition={{ duration: 0.4 }} className="w-full mx-auto mb-10 flex flex-col gap-2 md:gap-3 cursor-default">
      {/* 🟢 แถวที่ 1 */}
      <div className="flex gap-2 md:gap-3 h-16 md:h-20 w-full">
        <div className={`${theme.bgs[0]} rounded-xl md:rounded-3xl w-[20%] md:w-[24%] flex items-center justify-center shadow-sm overflow-hidden`}>
           {variant === 'exam' && <div className="w-4 h-10 md:h-12 bg-white/90 rounded-full rotate-12"></div>}
           {variant === 'calendar' && <div className="flex gap-1.5 md:gap-2"><div className="w-2.5 md:w-3 h-8 md:h-10 bg-white/90 rounded-full"></div><div className="w-2.5 md:w-3 h-8 md:h-10 bg-white/90 rounded-full"></div></div>}
           {variant === 'website' && <div className="flex gap-1.5 md:gap-2"><div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-white/90 rounded-full"></div><div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-white/90 rounded-full"></div><div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-white/90 rounded-full"></div></div>}
        </div>
        <div className={`${theme.text} rounded-xl md:rounded-3xl flex-1 flex items-center justify-center shadow-sm`}>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">{line1}</h2>
        </div>
        <div className={`${theme.bgs[1]} rounded-xl md:rounded-3xl w-[18%] md:w-[20%] flex items-center justify-center shadow-sm overflow-hidden`}>
          {variant === 'exam' && <div className="w-8 h-8 md:w-10 md:h-10 bg-white/90 rounded-full"></div>}
          {variant === 'calendar' && <div className="w-8 h-8 md:w-10 md:h-10 bg-white/90 rounded-xl"></div>}
          {variant === 'website' && <div className="w-8 h-8 md:w-10 md:h-10 border-[4px] md:border-[5px] border-white/90 rounded-full"></div>}
        </div>
      </div>

      {/* 🟢 แถวที่ 2 */}
      <div className="flex gap-2 md:gap-3 h-16 md:h-20 w-full">
        <div className={`${theme.bgs[2]} rounded-xl md:rounded-3xl w-[20%] md:w-[24%] flex items-center justify-center shadow-sm overflow-hidden relative`}>
          {variant === 'exam' && <div className="w-8 h-8 md:w-10 md:h-10 bg-white/90 rotate-45 rounded-sm"></div>}
          {variant === 'calendar' && <div className="absolute inset-0 opacity-30 md:opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '12px 12px' }}></div>}
          {variant === 'website' && <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-12 md:h-12 fill-white/80"><circle cx="35" cy="35" r="22" /><circle cx="65" cy="35" r="22" /><circle cx="35" cy="65" r="22" /><circle cx="65" cy="65" r="22" /></svg>}
        </div>
        <div className={`${theme.text} rounded-xl md:rounded-3xl flex-1 flex items-center justify-center shadow-sm`}>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">{line2}</h2>
        </div>
        <div className={`${theme.bgs[3]} rounded-xl md:rounded-3xl w-[12%] md:w-[15%] flex items-center justify-center shadow-sm overflow-hidden`}>
           {variant === 'exam' && <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-white/90 rounded-full border-dashed"></div>}
           {variant === 'calendar' && <div className="w-6 h-6 md:w-8 md:h-8 bg-white/90 rounded-lg rotate-12"></div>}
           {variant === 'website' && <div className="relative w-6 h-6 md:w-8 md:h-8"><div className="absolute top-1/2 left-0 w-full h-1.5 md:h-2 bg-white/90 -translate-y-1/2 rounded-full"></div><div className="absolute left-1/2 top-0 h-full w-1.5 md:w-2 bg-white/90 -translate-x-1/2 rounded-full"></div></div>}
        </div>
        <div className={`${theme.bgs[4]} rounded-xl md:rounded-3xl w-[12%] md:w-[15%] relative overflow-hidden shadow-sm hidden sm:block`}>
          {variant === 'exam' && <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/40"></div>}
          {variant === 'calendar' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[40%] bg-white/30 rotate-45"></div>}
          {variant === 'website' && <><div className="absolute -top-[30%] -left-[30%] w-[70%] h-[70%] bg-white/30 rounded-full"></div><div className="absolute -bottom-[30%] -right-[30%] w-[70%] h-[70%] bg-white/30 rounded-full"></div></>}
        </div>
      </div>
    </motion.div>
  );
};

export default function Curriculum() {
  const [activePlan, setActivePlan] = useState('normal'); 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getColorClasses = (colorName) => {
    switch(colorName) {
      case 'pink': return 'bg-[#fff0f5]/80 border-[#fbcfe8] text-[#be185d]';
      case 'orange': return 'bg-[#fff7ed]/80 border-[#fed7aa] text-[#c2410c]';
      case 'yellow': return 'bg-[#fefce8]/80 border-[#fef08a] text-[#854d0e]';
      case 'green': return 'bg-[#f0fdf4]/80 border-[#bbf7d0] text-[#15803d]';
      case 'gray': return 'bg-[#f8fafc]/80 border-[#cbd5e1] text-[#334155]';
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
      default: return 'bg-gradient-to-r from-purple-700 to-purple-500';
    }
  };

  // 📌 ฟังก์ชันสำหรับดึงข้อมูลเชิงลึกของวิชาจาก COURSE_LIST
  const getFullCourseInfo = (courseId, fallbackName, fallbackCredit) => {
    const fullInfo = COURSE_LIST.find(c => c.id === courseId);
    return {
      id: courseId,
      nameTH: fullInfo ? fullInfo.nameTH : fallbackName.replace('*', ''),
      nameEN: fullInfo ? fullInfo.nameEN : '',
      creditText: fullInfo ? fullInfo.creditText : fallbackCredit,
      prereq: fullInfo ? fullInfo.prereq : [],
      coreq: fullInfo ? fullInfo.coreq : null,
      isEng: fullInfo ? fullInfo.isEng : fallbackName.includes('*')
    };
  };

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 relative overflow-hidden";

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 pt-2">
        
        {/* ---------------- Header Section ---------------- */}
        <div className="text-center max-w-4xl mx-auto pt-2 pb-10">
          <span className="inline-block py-1 px-4 rounded-full bg-purple-100/60 backdrop-blur-sm text-purple-700 text-[11px] font-bold tracking-widest uppercase mb-4 shadow-sm">
            Curriculum Map
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
            แผนผังและโครงสร้างหลักสูตร
          </h1>
          <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl mb-3">
            หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมชีวการแพทย์ (ฉบับปรับปรุง พ.ศ. 2567)
          </p>
          <p className="font-medium text-slate-600 text-sm md:text-base leading-relaxed mx-auto mb-8">
            หน่วยกิตรวมตลอดหลักสูตร: <span className="font-bold text-purple-700">146 หน่วยกิต</span>
          </p>
          
          <div className="flex justify-center">
            <a href="/flow" className="text-sm font-bold bg-white text-purple-700 hover:bg-purple-600 hover:text-white border border-purple-200 hover:border-purple-600 shadow-md px-8 py-3.5 rounded-full transition-all flex items-center gap-2 transform hover:-translate-y-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              ไปยังระบบจำลองแผนการเรียน
            </a>
          </div>
        </div>

        {/* ---------------- 📌 1. แผนผังการเรียน (Image Viewer with Smooth Zoom) ---------------- */}
        <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50`}>
          <SectionBanner line1="แผนผัง" line2="การเรียน" variant="exam" />

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 mt-8 border-b border-slate-100 pb-4 px-2">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
              <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              BME Flowchart
            </h3>
            <div className="mt-3 md:mt-0 text-xs font-medium text-slate-500 flex items-center gap-2 bg-slate-50/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
              <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
              ใช้ Scroll เพื่อซูมอย่างสมดุล หรือคลิกค้างเพื่อลากเลื่อน
            </div>
          </div>
          
          <div className="w-full rounded-[1.5rem] overflow-hidden border-2 border-slate-100 bg-slate-50 relative group">
            <TransformWrapper 
              initialScale={1} 
              minScale={0.8} 
              maxScale={3} 
              wheel={{ step: 0.05, smoothStep: 0.005 }} 
              centerOnInit={true}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="absolute bottom-6 right-6 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl px-3 py-2 rounded-2xl opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={() => zoomIn(0.2)} className="w-9 h-9 bg-slate-100 hover:bg-purple-600 hover:text-white rounded-xl flex items-center justify-center text-slate-700 font-bold transition-all text-sm">+</button>
                    <button onClick={() => zoomOut(0.2)} className="w-9 h-9 bg-slate-100 hover:bg-purple-600 hover:text-white rounded-xl flex items-center justify-center text-slate-700 font-bold transition-all text-sm">-</button>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                    <button onClick={() => resetTransform()} className="px-3 h-9 bg-slate-100 hover:bg-slate-800 hover:text-white rounded-xl flex items-center justify-center text-slate-700 text-xs font-bold transition-all">Reset</button>
                  </div>

                  <TransformComponent wrapperClass="!w-full !h-auto min-h-[500px] cursor-grab active:cursor-grabbing flex items-center justify-center">
                    <img 
                      src={bmeFlowImage} 
                      alt="BME Curriculum Flowchart" 
                      className="w-full h-auto object-contain max-h-[850px] select-none mix-blend-multiply" 
                      draggable="false" 
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>
        </div>

        {/* ---------------- 📌 2. แผนการศึกษาแยกตามชั้นปี ---------------- */}
        <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50`}>
          <SectionBanner line1="แผนการเรียน" line2="แต่ละชั้นปี" variant="calendar" />

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
            {YEARLY_PLAN.map((yearItem, yIdx) => {
              const visibleTerms = yearItem.terms.filter(term => term.plan === 'all' || term.plan === activePlan);
              if (visibleTerms.length === 0) return null;

              return (
                <div key={yIdx} className="bg-slate-50/50 rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-8 py-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg shadow-sm">{yIdx + 1}</div>
                    <h3 className="text-xl font-extrabold tracking-wide">{yearItem.year}</h3>
                  </div>

                  <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {visibleTerms.map((term, tIdx) => (
                      <div key={tIdx} className={`rounded-[1.5rem] border ${term.plan === 'coop' ? 'border-indigo-200 bg-indigo-50/30 shadow-[0_4px_15px_rgba(79,70,229,0.05)]' : term.isSummer ? 'border-dashed border-slate-300 bg-white' : 'border-slate-200 bg-white shadow-sm'} overflow-hidden flex flex-col hover:shadow-md transition-shadow`}>
                        <div className={`px-5 py-4 border-b flex justify-between items-center ${term.plan === 'coop' ? 'bg-indigo-100/50 border-indigo-100 text-indigo-900' : term.isSummer ? 'bg-slate-50 border-slate-100 text-slate-700' : 'bg-slate-50/80 border-slate-100 text-slate-800'}`}>
                          <h4 className="font-extrabold text-[15px] flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full ${term.plan === 'coop' ? 'bg-indigo-500' : 'bg-purple-500'}`}></span>
                             {term.title}
                          </h4>
                          {!term.isSummer && (
                            <span className="text-[12px] font-black bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 shadow-sm">รวม {term.totalCredits} นก.</span>
                          )}
                        </div>
                        
                        <div className="p-5 flex flex-col gap-2.5 flex-1">
                          {term.courses.map((c, cIdx) => {
                            const info = getFullCourseInfo(c.id, c.name, c.credit);
                            return (
                              <div key={cIdx} className="flex justify-between items-start gap-3 border-b border-slate-100 last:border-0 pb-3 mb-1 last:pb-0 last:mb-0 hover:bg-slate-50 p-2 rounded-xl transition-colors">
                                <div>
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------- 📌 3. รายละเอียดโครงสร้างหลักสูตร (หมวดวิชาทั้งหมด) ---------------- */}
        <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50`}>
          <SectionBanner line1="โครงสร้าง" line2="รายวิชา" variant="website" />
          
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3 mb-8 mt-8 px-2 tracking-tight">
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            หมวดหมู่รายวิชาทั้งหมด
          </h3>

          <div className="flex flex-col gap-10">
            {CURRICULUM_CATEGORIES.categories.map((category) => (
              <div key={category.id} className={`rounded-[2rem] overflow-hidden border ${getColorClasses(category.color)} shadow-sm transition-all hover:shadow-md backdrop-blur-md`}>
                
                {/* Category Header */}
                <div className={`${getHeaderColor(category.color)} text-white p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
                  <h3 className="text-xl md:text-2xl font-black tracking-tight">{category.title}</h3>
                  <div className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap border border-white/20 shadow-sm">
                    รวม {category.totalCredits} หน่วยกิต
                  </div>
                </div>

                {/* Sub Categories & Courses */}
                <div className="p-6 md:p-8 flex flex-col gap-10">
                  {category.subCategories.map((sub, idx) => (
                    <div key={idx}>
                      <div className="flex items-center gap-3 mb-2 border-b border-current pb-2 opacity-80">
                         <h4 className="text-[16px] font-extrabold">{sub.title}</h4>
                      </div>
                      
                      {sub.description && <p className="text-[13px] mb-5 font-medium opacity-70">{sub.description}</p>}
                      
                      {/* Grid Layout for Courses */}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-4">
                        {sub.courses.map((c, i) => {
                          const info = getFullCourseInfo(c.id, c.name, c.credit);
                          return (
                            <div key={i} className="bg-white/90 backdrop-blur-sm rounded-[1.25rem] p-5 border border-slate-200/60 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
                              
                              <div className="flex justify-between items-start gap-2">
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

                              {/* แสดงความสัมพันธ์ของวิชา (Prereq / Coreq) */}
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
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}