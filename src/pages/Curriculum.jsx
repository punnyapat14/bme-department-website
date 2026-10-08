import React, { useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import bmeFlowImage from '../assets/bme_flow.png'; 

// 📌 ดึงข้อมูลจากไฟล์ Data (ดึง COURSE_LIST มาเพื่อหาข้อมูลตัวต่อและชื่อภาษาอังกฤษ)
import { CURRICULUM_CATEGORIES, YEARLY_PLAN, COURSE_LIST } from '../data/curriculumData';

export default function Curriculum() {
  const [activePlan, setActivePlan] = useState('normal'); 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getColorClasses = (colorName) => {
    switch(colorName) {
      case 'pink': return 'bg-[#fff0f5] border-[#fbcfe8] text-[#be185d]';
      case 'orange': return 'bg-[#fff7ed] border-[#fed7aa] text-[#c2410c]';
      case 'yellow': return 'bg-[#fefce8] border-[#fef08a] text-[#854d0e]';
      case 'green': return 'bg-[#f0fdf4] border-[#bbf7d0] text-[#15803d]';
      case 'gray': return 'bg-[#f8fafc] border-[#cbd5e1] text-[#334155]';
      default: return 'bg-white border-slate-200 text-slate-700';
    }
  };

  const getHeaderColor = (colorName) => {
    switch(colorName) {
      case 'pink': return 'bg-[#d81b60]'; 
      case 'orange': return 'bg-[#f97316]';
      case 'yellow': return 'bg-[#eab308]';
      case 'green': return 'bg-[#059669]'; 
      case 'gray': return 'bg-[#475569]';
      default: return 'bg-purple-600';
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

  return (
    <div className="bg-[#f4f6fa] min-h-screen pb-20 font-sans text-slate-800">
      
      {/* ---------------- Header Section ---------------- */}
      <div className="bg-white border-b border-slate-200/80 pt-16 pb-12 px-6 text-center relative shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-purple-700 to-black"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold tracking-widest uppercase mb-4 border border-purple-100">
            Curriculum Map
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 leading-tight">
            แผนผังโครงสร้างรายวิชา (BME Flow)
          </h1>
          <p className="font-light text-slate-500 text-sm md:text-base leading-relaxed mb-6">
            หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมชีวการแพทย์ (ฉบับปรับปรุง พ.ศ. 2567)<br className="hidden md:block"/>
            หน่วยกิตรวมตลอดหลักสูตร: <span className="font-bold text-purple-700">146 หน่วยกิต</span>
          </p>
          
          <div className="flex justify-center">
            <a href="/flow" className="text-sm font-bold bg-gradient-to-r from-purple-700 to-purple-600 text-white hover:shadow-lg shadow-purple-600/20 px-8 py-3.5 rounded-full transition-all flex items-center gap-2 transform hover:-translate-y-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              ไปยังระบบจำลองแผนการเรียน
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-10 flex flex-col gap-12">
        
        {/* ---------------- 1. แผนผังการเรียน (Image Viewer with Smooth Zoom) ---------------- */}
        <section className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-slate-100 pb-4 px-2">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-to-b from-purple-600 to-red-500 rounded-full"></span>
              แผนผังการเรียน (BME Flowchart)
            </h2>
            <div className="mt-3 md:mt-0 text-xs font-medium text-slate-500 flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
              ใช้ Scroll เพื่อซูมอย่างสมดุล หรือกดปุ่มมุมขวาล่าง / คลิกค้างเพื่อลากเลื่อน
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
                      className="w-full h-auto object-contain max-h-[850px] select-none" 
                      draggable="false" 
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>
        </section>

        {/* ---------------- 2. แผนการศึกษาแยกตามชั้นปี ---------------- */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-2">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-to-b from-purple-600 to-red-500 rounded-full"></span>
              แผนการศึกษา (Study Plan)
            </h2>
            
            <div className="flex bg-slate-100 p-1 rounded-xl mt-4 md:mt-0 shadow-sm border border-slate-200">
              <button 
                onClick={() => setActivePlan('normal')}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activePlan === 'normal' ? 'bg-white text-purple-700 shadow border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
              >
                โครงการปกติ
              </button>
              <button 
                onClick={() => setActivePlan('coop')}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activePlan === 'coop' ? 'bg-indigo-600 text-white shadow border border-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                โครงการสหกิจศึกษา
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {YEARLY_PLAN.map((yearItem, yIdx) => {
              const visibleTerms = yearItem.terms.filter(term => term.plan === 'all' || term.plan === activePlan);
              if (visibleTerms.length === 0) return null;

              return (
                <div key={yIdx} className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200/80 overflow-hidden">
                  <div className="bg-slate-800 text-white px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">{yIdx + 1}</div>
                    <h3 className="text-lg font-bold tracking-wide">{yearItem.year}</h3>
                  </div>

                  <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {visibleTerms.map((term, tIdx) => (
                      <div key={tIdx} className={`rounded-2xl border ${term.plan === 'coop' ? 'border-indigo-200 bg-indigo-50/30' : term.isSummer ? 'border-dashed border-slate-300 bg-slate-50' : 'border-slate-200 bg-white'} overflow-hidden flex flex-col`}>
                        <div className={`px-4 py-3 border-b flex justify-between items-center ${term.plan === 'coop' ? 'bg-indigo-100 border-indigo-200 text-indigo-900' : term.isSummer ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                          <h4 className="font-bold text-[14px]">{term.title}</h4>
                          {!term.isSummer && (
                            <span className="text-[11px] font-bold bg-white px-2 py-0.5 rounded-md border border-current opacity-80">รวม {term.totalCredits} นก.</span>
                          )}
                        </div>
                        
                        <div className="p-4 flex flex-col gap-2 flex-1">
                          {term.courses.map((c, cIdx) => {
                            const info = getFullCourseInfo(c.id, c.name, c.credit);
                            return (
                              <div key={cIdx} className="flex justify-between items-start gap-3 border-b border-slate-100 last:border-0 pb-2 mb-1 last:pb-0 last:mb-0 hover:bg-slate-50/50 p-1.5 rounded-lg transition-colors">
                                <div>
                                  <div className="text-[10px] font-mono text-slate-400 font-bold mb-0.5 tracking-wider">{info.id}</div>
                                  <div className="text-[13px] text-slate-800 font-bold leading-snug">{info.nameTH}</div>
                                  {info.nameEN && <div className="text-[11px] text-slate-500 font-medium leading-snug">{info.nameEN}</div>}
                                </div>
                                <div className="text-[11px] font-bold text-slate-500 whitespace-nowrap pt-1 flex flex-col items-end gap-1">
                                  <div className="flex gap-1">
                                    {info.isEng && <span className="text-[8px] font-black bg-slate-800 text-white px-1.5 py-0.5 rounded tracking-widest shadow-sm">ENG</span>}
                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{info.creditText}</span>
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
        </section>

        {/* ---------------- 3. รายละเอียดโครงสร้างหลักสูตร (หมวดวิชาทั้งหมด) ---------------- */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3 mb-8 px-2">
            <span className="w-2 h-8 bg-gradient-to-b from-purple-600 to-red-500 rounded-full"></span>
            โครงสร้างหลักสูตรและรายวิชาทั้งหมด
          </h2>

          <div className="flex flex-col gap-8">
            {CURRICULUM_CATEGORIES.categories.map((category) => (
              <div key={category.id} className={`rounded-[2rem] overflow-hidden border ${getColorClasses(category.color)} shadow-sm transition-all hover:shadow-md`}>
                
                {/* Category Header */}
                <div className={`${getHeaderColor(category.color)} text-white p-5 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
                  <h3 className="text-lg md:text-xl font-extrabold tracking-tight">{category.title}</h3>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap border border-white/10 shadow-sm">
                    รวม {category.totalCredits} หน่วยกิต
                  </div>
                </div>

                {/* Sub Categories & Courses */}
                <div className="p-5 md:p-8 bg-white/60 flex flex-col gap-10">
                  {category.subCategories.map((sub, idx) => (
                    <div key={idx}>
                      <div className="flex items-center gap-2 mb-2">
                         <div className={`w-1.5 h-4 ${getHeaderColor(category.color)} rounded-full opacity-80`}></div>
                         <h4 className="text-[15px] font-bold text-slate-800">{sub.title}</h4>
                      </div>
                      
                      {sub.description && <p className="text-[13px] text-slate-500 mb-4 ml-3.5 font-light">{sub.description}</p>}
                      
                      {/* Grid Layout for Courses */}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                        {sub.courses.map((c, i) => {
                          const info = getFullCourseInfo(c.id, c.name, c.credit);
                          return (
                            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                              
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex flex-col gap-1">
                                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                    <span className="text-[11px] font-mono text-purple-600 font-bold tracking-wider">{info.id}</span>
                                    {info.isEng && <span className="text-[9px] font-black bg-slate-800 text-white px-1.5 py-0.5 rounded tracking-widest shadow-sm">ENG</span>}
                                    {info.prereq?.length > 0 && <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-200">มีตัวต่อ</span>}
                                    {info.coreq && <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-indigo-200">วิชาควบ</span>}
                                  </div>
                                  <div className="text-[14px] font-bold text-slate-800 leading-snug">{info.nameTH}</div>
                                  {info.nameEN && <div className="text-[11.5px] font-medium text-slate-500 leading-snug">{info.nameEN}</div>}
                                </div>
                                <div className="text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg whitespace-nowrap flex-shrink-0 shadow-sm">
                                  {info.creditText}
                                </div>
                              </div>

                              {/* แสดงความสัมพันธ์ของวิชา (Prereq / Coreq) */}
                              {(info.prereq?.length > 0 || info.coreq) && (
                                <div className="pt-2.5 border-t border-slate-100 flex flex-col gap-1.5 mt-1">
                                  {info.prereq?.length > 0 && (
                                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                                      <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                                      ต้องผ่าน: <span className="font-mono font-medium text-slate-700">{info.prereq.join(', ')}</span>
                                    </div>
                                  )}
                                  {info.coreq && (
                                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                                      <svg className="w-3 h-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                      เรียนควบ: <span className="font-mono font-medium text-slate-700">{info.coreq}</span>
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
        </section>

      </div>
    </div>
  );
}