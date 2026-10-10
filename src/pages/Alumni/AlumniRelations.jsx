import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 📌 นำเข้า Component พื้นหลังและแบนเนอร์จาก ThemeElements
import { AuroraBackground, SectionBanner } from '../../components/ThemeElements';

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
// 📌 ข้อมูลจำลอง (Mock Data)
// ==========================================
const ALUMNI_MESSAGES = [
  {
    id: 1,
    name: "รุ่นพี่ BME 01",
    role: "Senior Clinical Engineer",
    message: "ช่วงเรียนอาจจะเหนื่อยกับการทำโปรเจกต์และการสอบ แต่เชื่อเถอะว่าความรู้ทั้งด้านวิศวะและการแพทย์ที่ได้จากที่นี่ จะทำให้เราโดดเด่นและเป็นที่ต้องการของตลาดงานแน่นอน เป็นกำลังใจให้น้องๆ ทุกคนครับ",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?fit=crop&w=150&q=80"
  },
  {
    id: 2,
    name: "รุ่นพี่ BME 04",
    role: "AI Healthcare Developer",
    message: "ทักษะด้าน Software และ AI กำลังเปลี่ยนโลกสาธารณสุข อยากให้น้องๆ ตั้งใจเก็บเกี่ยวประสบการณ์จากการทำโปรเจกต์ให้เยอะๆ อย่ากลัวที่จะลองเทคโนโลยีใหม่ๆ โลกการทำงานจริงสนุกกว่าที่คิด!",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fit=crop&w=150&q=80"
  },
  {
    id: 3,
    name: "รุ่นพี่ BME 07",
    role: "Product Specialist",
    message: "Connection ในสายงานนี้สำคัญมาก งานกิจกรรมสาขาหรือชมรมเป็นจุดเริ่มต้นที่ดีในการทำความรู้จักเพื่อนและพี่ๆ พยายามสื่อสารให้เก่ง เพราะวิศวกรชีวการแพทย์ต้องคุยกับทั้งหมอและโปรแกรมเมอร์ให้รู้เรื่อง",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=150&q=80"
  }
];

export default function AlumniRelations() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden";

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />

      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">

        {/* ---------------- Header Section ---------------- */}
        <FadeInSection delay="0.1s">
          <div className="text-center max-w-4xl mx-auto pt-2 pb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
              ศิษย์เก่าสัมพันธ์
            </h1>
            <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
              พื้นที่เชื่อมโยงเครือข่ายวิศวกรรมชีวการแพทย์ มจพ. สานสัมพันธ์รุ่นพี่รุ่นน้อง และร่วมเป็นส่วนหนึ่งในการพัฒนาภาควิชา
            </p>
          </div>
        </FadeInSection>

        {/* ---------------- 📌 1. ไฮไลท์กิจกรรมสานสัมพันธ์ (Highlight Event) ---------------- */}
        <FadeInSection delay="0.2s">
          <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
            <SectionBanner text="กิจกรรมสานสัมพันธ์" variant="social" />

            <div className="mt-8 flex flex-col lg:flex-row bg-slate-900 rounded-[2rem] overflow-hidden shadow-xl border border-slate-800 relative group">
              {/* รูปภาพกิจกรรม */}
              <div className="w-full lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop" 
                  alt="BME Connext" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" 
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
                <div className="absolute top-6 left-6 bg-rose-500 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-md">
                  Upcoming Event
                </div>
              </div>

              {/* ข้อมูลกิจกรรม */}
              <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-10">
                <h3 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                  12th Anniversary<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-400">BME Connext</span>
                </h3>
                <p className="text-slate-300 font-medium mb-6 mt-4 leading-relaxed text-sm md:text-base">
                  ขอเชิญศิษย์เก่าและศิษย์ปัจจุบันร่วมงานฉลองครบรอบ 12 ปี วิศวกรรมชีวการแพทย์ มจพ. ร่วมพบปะสังสรรค์ แลกเปลี่ยนประสบการณ์กับเครือข่ายวิชาชีพ พร้อมชมการแสดงดนตรีและรับประทานอาหารเย็นร่วมกัน
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-slate-200 text-sm font-medium">
                    <svg className="w-5 h-5 mr-3 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    วันเสาร์ที่ 10 ตุลาคม 2569 | เวลา 17:00 - 22:00 น.
                  </div>
                  <div className="flex items-center text-slate-200 text-sm font-medium">
                    <svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    ห้องแกรนด์บอลรูม สโมสรกรมยุทธบริการทหาร กรุงเทพมหานคร
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <a href="/alumni" className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all text-center text-sm flex-1 hover:-translate-y-0.5">
                    ลงทะเบียนเข้าร่วมงาน
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all text-center text-sm backdrop-blur-md flex-1">
                    ดูภาพบรรยากาศปีที่ผ่านมา
                  </a>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* ---------------- 📌 2. บริการและเครือข่ายศิษย์เก่า (Services) ---------------- */}
        <FadeInSection delay="0.3s">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* กล่องที่ 1: ทำเนียบศิษย์เก่า */}
            <a href="/alumni" className={`p-8 ${bentoGlass} group hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col justify-between block`}>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">ทำเนียบศิษย์เก่า (Directory)</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">ค้นหาและเชื่อมต่อกับรุ่นพี่เครือข่ายวิศวกรรมชีวการแพทย์ในสายอาชีพต่างๆ พร้อมเปิดใช้งานบัตรสมาชิกดิจิทัล</p>
              <div className="text-purple-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                เข้าสู่ระบบศิษย์เก่า <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </div>
            </a>

            {/* กล่องที่ 2: ร่วมพัฒนาภาควิชา */}
            <div className={`p-8 ${bentoGlass} group hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col justify-between`}>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">ร่วมเป็นส่วนหนึ่งของการพัฒนา</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">เปิดรับหน่วยงานของศิษย์เก่าในการเป็นวิทยากรพิเศษ เสนอสถานที่ฝึกงาน สหกิจศึกษา หรือสนับสนุนทุนวิจัยให้รุ่นน้อง</p>
              <a href="/contact" className="text-emerald-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                ติดต่อภาควิชา <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </a>
            </div>

            {/* กล่องที่ 3: เอกสารและหลักฐาน */}
            <div className={`p-8 ${bentoGlass} group hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col justify-between`}>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">บริการขอเอกสารสำคัญ</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">ระบบบริการขอดูผลการศึกษา Transcript เอกสารรับรองจบ และรับเอกสารผ่านช่องทางออนไลน์จากกองบริการการศึกษา</p>
              <a href="https://reg2.kmutnb.ac.th/registrar/" target="_blank" rel="noreferrer" className="text-amber-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                เข้าสู่ระบบ REG <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </a>
            </div>

          </div>
        </FadeInSection>

        {/* ---------------- 📌 3. จากพี่สู่น้อง (Messages to Juniors) ---------------- */}
        <FadeInSection delay="0.4s">
          <div className={`p-6 md:p-10 mb-12 ${bentoGlass} border border-slate-50`}>
            <SectionBanner text="ฝากข้อความถึงรุ่นน้อง" variant="scholarship" />
            
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {ALUMNI_MESSAGES.map((msg) => (
                <motion.div 
                  key={msg.id} 
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col relative"
                >
                  <svg className="absolute top-6 right-6 w-12 h-12 text-amber-100 opacity-60" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                  
                  <p className="text-slate-600 font-medium leading-relaxed mb-8 relative z-10 italic">
                    "{msg.message}"
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto border-t border-slate-100 pt-5 relative z-10">
                    <img src={msg.image} alt={msg.name} className="w-12 h-12 rounded-full object-cover border-2 border-amber-100 bg-slate-50" />
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">{msg.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{msg.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="bg-amber-100/50 hover:bg-amber-100 text-amber-700 font-bold py-2.5 px-6 rounded-full text-sm transition-colors border border-amber-200/60 shadow-sm">
                + ร่วมเขียนข้อความถึงรุ่นน้อง
              </button>
            </div>
          </div>
        </FadeInSection>

      </div>
    </div>
  );
}