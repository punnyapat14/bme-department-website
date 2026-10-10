import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 📌 นำเข้า Component พื้นหลังและแบนเนอร์จาก ThemeElements
import { AuroraBackground, SectionBanner } from "../../components/ThemeElements";

// 📌 นำเข้ารูปโลโก้จากโฟลเดอร์ assets 
import kmutnbLogo from "../../assets/Symbol/KMUTNB_Logo.png";
import appliedScienceLogo from "../../assets/Symbol/AppliedScience_Logo.png";
import imiLogo from "../../assets/Symbol/IMI_Logo.png";

// 📌 นำเข้ารูปภาพห้องปฏิบัติการ
import lab01 from '../../assets/Lab/Lab01.jpg';
import lab02 from '../../assets/Lab/Lab02.jpg';
import lab03 from '../../assets/Lab/Lab03.jpg';
import lab04 from '../../assets/Lab/Lab04.jpg';
import lab05 from '../../assets/Lab/Lab05.jpg'; 
import lab06 from '../../assets/Lab/Lab06.jpg';

// ==========================================
// 📌 Component: ระบบ Fade-in เวลาเลื่อนจอ
// ==========================================
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
// 📌 Component: Light Holographic Beams (ลำแสงตกแต่งการ์ด)
// ==========================================
const LightHolographicBeams = () => {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none opacity-80 z-0">
      <style>{`
        @keyframes holo-sweep {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
        .holo-beam-base {
          position: absolute;
          top: -20%;
          bottom: -20%;
          filter: blur(20px); 
        }
        .holo-beam-1 {
          width: 60%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(200, 180, 255, 0.25) 30%, 
            rgba(160, 210, 255, 0.2) 50%,  
            rgba(255, 180, 210, 0.25) 70%, 
            transparent 100%
          );
          animation: holo-sweep 8s infinite ease-in-out;
        }
        .holo-beam-2 {
          width: 40%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.6) 40%, 
            rgba(255, 255, 255, 0.8) 50%, 
            rgba(220, 230, 255, 0.3) 60%, 
            transparent 100%
          );
          animation: holo-sweep 6s infinite linear;
          animation-delay: 2.5s;
        }
      `}</style>
      <div className="holo-beam-base holo-beam-1"></div>
      <div className="holo-beam-base holo-beam-2"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjYpIi8+PC9zdmc+')] opacity-40 mix-blend-overlay"></div>
    </div>
  );
};


export default function Department() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(147,51,234,0.08)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden";

  // 📌 ข้อมูลรูปภาพห้องปฏิบัติการ
  const labImages = [lab01, lab02, lab03, lab04, lab05, lab06];
  const [currentLabIdx, setCurrentLabIdx] = useState(0);

  const nextLab = () => setCurrentLabIdx((prev) => (prev + 1) % labImages.length);
  const prevLab = () => setCurrentLabIdx((prev) => (prev - 1 + labImages.length) % labImages.length);

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      {/* 📌 ดึง Component AuroraBackground มาจาก ThemeElements */}
      <AuroraBackground />
      
      <div className="relative z-10 w-full px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-10 md:gap-14 pt-2">

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

          {/* ---------------- 1. รายละเอียดหลักสูตร & แนวทางสาขาวิชา ---------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <FadeInSection delay="0.2s" className="h-full">
              <div className={`p-10 md:p-14 flex flex-col h-full ${bentoGlass}`}>
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
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">ชื่อหลักสูตร</p>
                    <p className="text-lg font-extrabold text-slate-900 mb-1">วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมชีวการแพทย์</p>
                    <p className="text-[14px] text-slate-600 font-medium">Bachelor of Engineering Program in Biomedical Engineering</p>
                  </div>
                  <div className="bg-white/70 backdrop-blur-md rounded-[1.5rem] p-6 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">ชื่อปริญญา</p>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-lg font-extrabold text-slate-900 truncate">วิศวกรรมศาสตรบัณฑิต (วิศวกรรมชีวการแพทย์)</p>
                      <span className="text-slate-800 font-bold bg-slate-100 px-3 py-0.5 rounded-lg text-xs border border-slate-200 shrink-0">วศ.บ.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] text-slate-600 font-medium truncate">Bachelor of Engineering (Biomedical Engineering)</p>
                      <span className="text-slate-800 font-bold text-[14px] shrink-0">B.Eng.</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="bg-white/70 backdrop-blur-md rounded-[1.5rem] p-6 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex-1">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">รูปแบบหลักสูตร</p>
                      <p className="text-[16px] font-extrabold text-slate-900 mb-1">หลักสูตรระดับปริญญาตรี 4 ปี</p>
                      <p className="text-[13px] text-slate-600 leading-relaxed font-medium">(จัดการเรียนการสอนในรูปแบบเสริมทักษะภาษาอังกฤษ ไม่น้อยกว่าร้อยละ 20 ของจำนวนหน่วยกิตรวม)</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-900 rounded-[1.5rem] p-6 flex flex-col justify-center items-center text-center shadow-lg sm:w-[160px] border border-indigo-700/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/20 rounded-full blur-[20px]"></div>
                      <p className="text-[11px] font-bold text-indigo-200 uppercase tracking-widest mb-2 relative z-10">หน่วยกิตรวม</p>
                      <p className="text-[48px] font-black text-white leading-none tracking-tighter relative z-10">146</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay="0.3s" className="h-full">
              <div className={`p-10 md:p-14 flex flex-col h-full ${bentoGlass}`}>
                <LightHolographicBeams />
                <div className="absolute left-0 top-20 bottom-20 w-1.5 bg-gradient-to-b from-rose-400 to-purple-500 rounded-r-lg z-10"></div>
                <div className="flex items-center gap-4 mb-8 pl-2 z-10 relative">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-800 shadow-inner border border-slate-200">
                    <svg className="w-7 h-7 animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">แนวทางสาขาวิชา</h2>
                </div>
                <div className="flex flex-col flex-1 pl-2 z-10 relative">
                  <div className="mb-10 bg-white/70 backdrop-blur-md rounded-[1.5rem] p-6 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">ปรัชญาสาขาวิชา</p>
                    <p className="text-[18px] font-extrabold text-slate-900 leading-relaxed italic">
                      "ผลิตบุคลากรที่มีความรู้ ความสามารถด้านวิศวกรรมชีวการแพทย์เพื่อพัฒนาคน พัฒนาเทคโนโลยีทางด้านการรักษาพยาบาล และการดูแลสุขภาพ"
                    </p>
                  </div>
                  <div className="bg-white/70 backdrop-blur-md rounded-[1.5rem] p-8 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-5">วัตถุประสงค์หลัก</p>
                    <ul className="space-y-6">
                      <li className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[12px] shrink-0 mt-0.5 shadow-sm">1</div>
                        <p className="text-[15px] text-slate-700 font-medium leading-relaxed">ผลิตบัณฑิตในสาขาวิชาวิศวกรรมชีวการแพทย์ที่มีความรู้ ความสามารถทั้งทางด้านทฤษฎีและปฏิบัติ เพื่อสอดคล้องกับความต้องการของภาครัฐ สถานพยาบาลและอุตสาหกรรม</p>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[12px] shrink-0 mt-0.5 shadow-sm">2</div>
                        <p className="text-[15px] text-slate-700 font-medium leading-relaxed">ผลิตบัณฑิตที่มีความสามารถในด้านงานนวัตกรรมและวิจัยทางด้านวิศวกรรมชีวการแพทย์ขั้นพื้นฐาน</p>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[12px] shrink-0 mt-0.5 shadow-sm">3</div>
                        <p className="text-[15px] text-slate-700 font-medium leading-relaxed">ผลิตบัณฑิตที่มีคุณธรรมและจริยธรรมทั้งด้านการประกอบอาชีพและสังคม</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>

          {/* ---------------- 2. สังกัดหน่วยงาน ---------------- */}
          <section>
            <FadeInSection delay="0.2s">
              {/* 📌 ใช้ SectionBanner จาก ThemeElements.jsx */}
              <div className="mb-10 max-w-4xl mx-auto">
                <SectionBanner text="หน่วยงานต้นสังกัด" variant="website" />
              </div>
            </FadeInSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FadeInSection delay="0.2s" className="h-full">
                <div className={`p-8 md:p-10 flex flex-col items-center text-center h-full ${bentoGlass}`}>
                  <LightHolographicBeams />
                  <img src={kmutnbLogo} alt="KMUTNB Logo" className="w-24 h-24 object-contain mb-6 drop-shadow-sm z-10" />
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 z-10">มหาวิทยาลัย</p>
                  <p className="text-[17px] font-extrabold text-slate-900 leading-snug mb-2 z-10">มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ</p>
                  <p className="text-[13px] font-medium text-slate-600 z-10">King Mongkut's University of Technology North Bangkok</p>
                </div>
              </FadeInSection>
              <FadeInSection delay="0.3s" className="h-full">
                <div className={`p-8 md:p-10 flex flex-col items-center text-center h-full ${bentoGlass}`}>
                  <LightHolographicBeams />
                  <img src={appliedScienceLogo} alt="Applied Science Logo" className="w-24 h-24 object-contain mb-6 drop-shadow-sm z-10" />
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 z-10">คณะ</p>
                  <p className="text-[17px] font-extrabold text-slate-900 leading-snug mb-2 z-10">คณะวิทยาศาสตร์ประยุกต์</p>
                  <p className="text-[13px] font-medium text-slate-600 z-10">Faculty of Applied Science</p>
                </div>
              </FadeInSection>
              <FadeInSection delay="0.4s" className="h-full">
                <div className={`p-8 md:p-10 flex flex-col items-center text-center h-full ${bentoGlass}`}>
                  <LightHolographicBeams />
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-1.5 mb-6 shadow-sm border border-slate-100 z-10">
                    <img src={imiLogo} alt="IMI Department Logo" className="w-full h-full object-contain rounded-full" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 z-10">ภาควิชา</p>
                  <p className="text-[17px] font-extrabold text-slate-900 leading-snug mb-2 z-10">ภาควิชาฟิสิกส์อุตสาหกรรมและอุปกรณ์การแพทย์</p>
                  <p className="text-[13px] font-medium text-slate-600 z-10">Department of Industrial Physics and Medical Instrumentation</p>
                </div>
              </FadeInSection>
            </div>
          </section>

          {/* ---------------- 3. การแบ่งกลุ่มสาขาวิชา (Specializations) ---------------- */}
          <section>
            <FadeInSection delay="0.2s">
              {/* 📌 ใช้ SectionBanner จาก ThemeElements.jsx */}
              <div className="mb-10 max-w-4xl mx-auto">
                <SectionBanner text="การแบ่งกลุ่มสาขาวิชา" variant="calendar" />
              </div>
            </FadeInSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FadeInSection delay="0.2s" className="h-full">
                <div className={`p-8 md:p-10 h-full ${bentoGlass}`}>
                  <LightHolographicBeams />
                  <div className="w-14 h-14 bg-slate-100 backdrop-blur-sm text-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-200 z-10 relative">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <h3 className="text-[20px] font-extrabold text-slate-900 mb-1 z-10 relative">วิศวกรรมคลินิก</h3>
                  <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4 z-10 relative">Clinical Engineering</p>
                  <p className="text-[15px] text-slate-600 leading-relaxed font-medium z-10 relative">
                    มุ่งเน้นการบริหารจัดการ บำรุงรักษา และตรวจสอบมาตรฐานความปลอดภัยของเครื่องมือและอุปกรณ์การแพทย์ในสถานพยาบาล เพื่อให้พร้อมใช้งานอย่างมีประสิทธิภาพสูงสุด
                  </p>
                </div>
              </FadeInSection>

              <FadeInSection delay="0.3s" className="h-full">
                <div className={`p-8 md:p-10 h-full ${bentoGlass}`}>
                  <LightHolographicBeams />
                  <div className="w-14 h-14 bg-slate-100 backdrop-blur-sm text-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-200 z-10 relative">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  </div>
                  <h3 className="text-[20px] font-extrabold text-slate-900 mb-1 z-10 relative">วิศวกรรมโรงพยาบาล</h3>
                  <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4 z-10 relative">Hospital Engineering</p>
                  <p className="text-[15px] text-slate-600 leading-relaxed font-medium z-10 relative">
                    มุ่งเน้นการออกแบบ ควบคุม และบริหารจัดการระบบสนับสนุนภายในโรงพยาบาล เช่น ระบบก๊าซทางการแพทย์ ระบบปรับอากาศ คลีนรูม และมาตรฐานอาคารสถานพยาบาล
                  </p>
                </div>
              </FadeInSection>

              <FadeInSection delay="0.4s" className="h-full">
                <div className={`p-8 md:p-10 h-full ${bentoGlass}`}>
                  <LightHolographicBeams />
                  <div className="w-14 h-14 bg-slate-100 backdrop-blur-sm text-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-200 z-10 relative">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                  </div>
                  <h3 className="text-[20px] font-extrabold text-slate-900 mb-1 z-10 relative">นวัตกรรมชีวการแพทย์</h3>
                  <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4 z-10 relative">Biomedical Innovation</p>
                  <p className="text-[15px] text-slate-600 leading-relaxed font-medium z-10 relative">
                    มุ่งเน้นการวิจัยและพัฒนา การออกแบบอุปกรณ์การแพทย์อัจฉริยะ การประยุกต์ใช้ AI และเทคโนโลยีซอฟต์แวร์ เพื่อสร้างสรรค์นวัตกรรมใหม่ทางการแพทย์และสุขภาพ
                  </p>
                </div>
              </FadeInSection>
            </div>
          </section>

          {/* ---------------- 4. ห้องปฏิบัติการและสิ่งอำนวยความสะดวก (Facilities & Laboratories) ---------------- */}
          <section>
            <FadeInSection delay="0.2s">
              {/* 📌 ใช้ SectionBanner จาก ThemeElements.jsx */}
              <div className="mb-10 max-w-4xl mx-auto">
                <SectionBanner text="ห้องปฏิบัติการและสิ่งอำนวยความสะดวก" variant="exam" />
              </div>
            </FadeInSection>

            <FadeInSection delay="0.3s">
              <div className={`p-4 md:p-8 ${bentoGlass}`}>
                {/* 📌 Carousel แบบง่ายๆ ใช้ State เลื่อนภาพ */}
                <div className="relative w-full h-[300px] md:h-[500px] rounded-[1.5rem] overflow-hidden bg-slate-900">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentLabIdx}
                      src={labImages[currentLabIdx]}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt={`Lab Facility ${currentLabIdx + 1}`}
                    />
                  </AnimatePresence>
                  
                  {/* ปุ่มกดซ้าย-ขวา */}
                  <button onClick={prevLab} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-colors z-10 border border-white/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <button onClick={nextLab} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-colors z-10 border border-white/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                  </button>

                  {/* ตัวบอกตำแหน่งภาพ (Dots) */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/40 px-3 py-2 rounded-full backdrop-blur-sm">
                    {labImages.map((_, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setCurrentLabIdx(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentLabIdx === idx ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </FadeInSection>
          </section>

          {/* ---------------- 5. ภาพรวมการเรียนการสอน (Timeline) ---------------- */}
          <section>
            <FadeInSection delay="0.2s">
              <div className={`p-10 md:p-16 text-center ${bentoGlass}`}>
                <LightHolographicBeams />
                
                {/* 📌 ใช้ SectionBanner จาก ThemeElements.jsx */}
                <div className="mb-14 z-10 relative max-w-4xl mx-auto">
                  <SectionBanner text="ภาพรวมการเรียนการสอน" variant="scholarship" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative max-w-5xl mx-auto z-10">
                  <div className="hidden md:block absolute top-[36px] left-[12.5%] right-[12.5%] h-1 bg-slate-200/60 -z-10 rounded-full"></div>

                  {[
                    { year: 1, title: 'ปูพื้นฐาน', desc: 'เรียนรู้รายวิชาพื้นฐานทางคณิตศาสตร์ วิทยาศาสตร์ และวิศวกรรมพื้นฐาน', summer: 'ฝึกทักษะเชิงช่าง', ringColor: 'border-slate-200' },
                    { year: 2, title: 'เสริมแกนหลัก', desc: 'ชำนาญรายวิชาวิศวกรรม ปูพื้นฐานเข้าสู่วิศวกรรมชีวการแพทย์', summer: 'ซ่อมเครื่องมือแพทย์', ringColor: 'border-slate-200' },
                    { year: 3, title: 'เจาะลึกสายงาน', desc: 'เสริมความชำนาญตามกลุ่มวิชาชีพเลือกที่สนใจ (คลินิก, โรงพยาบาล, นวัตกรรม)', summer: 'ฝึกงาน / สหกิจศึกษา', ringColor: 'border-slate-200' },
                    { year: 4, title: 'ประสบการณ์จริง', desc: 'เตรียมความพร้อมเข้าสู่อุตสาหกรรม ปฏิบัติงานสหกิจศึกษา และทำโครงงานพิเศษ', finish: true }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center relative z-10">
                      
                      <div className={`w-16 h-16 text-2xl font-black rounded-3xl flex items-center justify-center mb-6 shadow-sm transition-all duration-300 ${
                        item.finish 
                          ? 'bg-gradient-to-br from-slate-800 to-indigo-900 text-white shadow-[0_8px_20px_rgba(49,46,129,0.25)] border border-slate-700' 
                          : `bg-white/80 backdrop-blur-md border-4 ${item.ringColor} text-slate-800 shadow-[0_0_15px_rgba(0,0,0,0.03)] hover:scale-110`
                      }`}>
                        {item.year}
                      </div>
                      
                      <h3 className="font-extrabold text-[18px] mb-3 text-slate-900">
                        ปีที่ {item.year}: {item.title}
                      </h3>
                      
                      <p className="text-[14px] text-slate-600 leading-relaxed font-medium mb-6 px-2">
                        {item.desc}
                      </p>
                      
                      {item.summer && (
                        <div className="mt-auto w-full">
                          <p className="text-[12px] font-bold text-slate-700 flex items-center justify-center gap-2 border border-slate-200/80 bg-white/80 backdrop-blur-sm rounded-xl py-2 px-3 shadow-sm hover:border-slate-300 transition-colors">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_5px_rgba(244,63,94,0.5)]"></span> ฤดูร้อน: {item.summer}
                          </p>
                        </div>
                      )}
                      
                      {item.finish && (
                        <div className="mt-auto w-full">
                          <p className="text-[12px] font-bold text-white bg-gradient-to-r from-slate-800 to-indigo-900 border border-slate-700 rounded-xl py-2 px-3 shadow-sm shadow-indigo-900/20">
                            🎓 สำเร็จการศึกษา
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>
          </section>

          {/* ---------------- 6. โอกาสทางวิชาชีพ (Career Opportunities) ---------------- */}
          <section>
            <FadeInSection delay="0.2s">
              {/* 📌 ใช้ SectionBanner จาก ThemeElements.jsx */}
              <div className="mb-10 max-w-4xl mx-auto">
                <SectionBanner text="โอกาสทางวิชาชีพ" variant="website" />
              </div>
            </FadeInSection>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: 'วิศวกรคลินิก', sub: 'Clinical Engineer', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                { title: 'ผู้เชี่ยวชาญผลิตภัณฑ์', sub: 'Product Specialist', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                { title: 'วิศวกรวิจัยและพัฒนา', sub: 'R&D Engineer', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
                { title: 'วิศวกรซ่อมบำรุง', sub: 'Service Engineer', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
              ].map((career, idx) => (
                <FadeInSection key={idx} delay={`${idx * 0.1}s`} className="h-full">
                  <div className={`p-6 md:p-8 flex flex-col items-center text-center h-full ${bentoGlass} hover:-translate-y-2`}>
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-800 mb-5 shadow-sm border border-slate-200">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={career.icon}></path></svg>
                    </div>
                    <h3 className="text-[16px] font-extrabold text-slate-900 mb-1">{career.title}</h3>
                    <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">{career.sub}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}