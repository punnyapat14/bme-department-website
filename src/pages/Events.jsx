import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 📌 นำเข้า Component พื้นหลังและแบนเนอร์
import { AuroraBackground, SectionBanner } from '../components/ThemeElements';

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
// 📌 ข้อมูล Mock Data (ข่าวสารและกิจกรรม)
// ==========================================
const ALL_EVENTS = [
  { id: 1, category: 'กิจกรรม', date: '25 พฤศจิกายน 2026', title: 'โครงการคืนสู่เหย้า 12 ปี BME Connext', desc: 'เชิญชวนศิษย์เก่าและศิษย์ปัจจุบันร่วมงานฉลองครบรอบ 12 ปี BME มจพ. พบปะสังสรรค์ แลกเปลี่ยนประสบการณ์กับเครือข่ายวิชาชีพ', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop' },
  { id: 2, category: 'วิชาการ', date: '18 พฤศจิกายน 2026', title: 'ประกาศผลการสอบคัดเลือก TCAS รอบที่ 1 Portfolio', desc: 'ตรวจสอบรายชื่อผู้ผ่านการคัดเลือกเข้าศึกษาต่อในระดับปริญญาตรี ประจำปีการศึกษา 2570', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop' },
  { id: 3, category: 'วิชาการ', date: '10 พฤศจิกายน 2026', title: 'สัมมนาพิเศษ: ทิศทางวิศวกรรมการแพทย์ยุค AI', desc: 'สัมมนาให้ความรู้เกี่ยวกับการนำเทคโนโลยีปัญญาประดิษฐ์มาปรับใช้ในเครื่องมือแพทย์', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop' },
  { id: 4, category: 'วิชาการ', date: '5 พฤศจิกายน 2026', title: 'คณาจารย์ภาควิชาคว้ารางวัลนักวิจัยดีเด่นประจำปี', desc: 'ขอแสดงความยินดีกับคณาจารย์ภาควิชาที่ได้รับรางวัลนักวิจัยดีเด่นระดับมหาวิทยาลัย', image: 'https://images.unsplash.com/photo-1507676184212-d0330a156f48?q=80&w=800&auto=format&fit=crop' },
  { id: 5, category: 'กิจกรรม', date: '1 พฤศจิกายน 2026', title: 'กิจกรรมจิตอาสา BME: ซ่อมบำรุงเครื่องมือแพทย์ชุมชน', desc: 'นักศึกษา BME ร่วมกันลงพื้นที่ตรวจสอบและซ่อมบำรุงเครื่องมือแพทย์ให้กับโรงพยาบาลส่งเสริมสุขภาพตำบล', image: 'https://images.unsplash.com/photo-1593113565214-061c5cbbfbe2?q=80&w=800&auto=format&fit=crop' },
  { id: 6, category: 'กิจกรรม', date: '28 ตุลาคม 2026', title: 'Workshop ปฏิบัติการ: การสอบเทียบเครื่องมือวัดชีพจร', desc: 'โครงการฝึกอบรมเชิงปฏิบัติการ การสอบเทียบและบำรุงรักษาเครื่องมือวัดทางการแพทย์', image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=800&auto=format&fit=crop' },
];

const UPCOMING_TIMELINE = [
  { date: '10 ต.ค. 26', title: 'โครงการคืนสู่เหย้า 12 ปี BME Connext', isMajor: true },
  { date: '15 ต.ค. 26', title: 'ปฐมนิเทศนักศึกษาฝึกงาน', isMajor: false },
  { date: '20 ต.ค. 26', title: 'เปิดรับสมัคร TCAS รอบ 2 (โควตา)', isMajor: false },
  { date: '5 พ.ย. 26', title: 'สัมมนา: อนาคตอุตสาหกรรมการแพทย์ไทย', isMajor: false },
];

// ==========================================
// 📌 Component: การ์ดข่าวย่อย (Mini Card)
// ==========================================
const EventCard = ({ event }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3 }}
    className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm hover:shadow-[0_15px_30px_rgba(147,51,234,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
  >
    <div className="h-48 bg-slate-100 overflow-hidden relative group cursor-pointer shrink-0">
      <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-800 shadow-sm">
        {event.category}
      </span>
    </div>
    
    <div className="p-6 flex flex-col flex-1">
      <p className="text-[12px] font-semibold text-slate-500 mb-2">{event.date}</p>
      <h3 className="text-[16px] font-extrabold text-slate-900 leading-snug mb-3 line-clamp-2 hover:text-indigo-700 transition-colors cursor-pointer">
        {event.title}
      </h3>
      <p className="text-[13px] text-slate-600 mb-4 line-clamp-2 leading-relaxed">{event.desc}</p>
      <div className="mt-auto">
        <button className="text-[12px] font-bold text-slate-800 hover:text-indigo-800 transition-colors flex items-center gap-1 group">
          อ่านต่อ 
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </button>
      </div>
    </div>
  </motion.div>
);

// ==========================================
// 📌 Main Events Component
// ==========================================
export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1. ดึงข่าวล่าสุดแค่ 1 ข่าว
  const latestEvent = ALL_EVENTS[0];
  
  // 2. ฟิลเตอร์ข่าวตามคำค้นหา (Search)
  const searchFilter = (e) => {
    if (!searchTerm) return true;
    return e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.desc.toLowerCase().includes(searchTerm.toLowerCase());
  };

  // 3. กรองข้อมูลข่าววิชาการและกิจกรรม 
  const academicEvents = ALL_EVENTS.filter(e => e.category === 'วิชาการ' && e.id !== latestEvent.id && searchFilter(e));
  const activityEvents = ALL_EVENTS.filter(e => e.category === 'กิจกรรม' && e.id !== latestEvent.id && searchFilter(e));

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(147,51,234,0.08)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden";
  const miniBentoGlass = "rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm hover:shadow-[0_15px_30px_rgba(147,51,234,0.08)] transition-all duration-300";

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />

      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">
        
        {/* ---------------- Header Section ---------------- */}
        <FadeInSection delay="0.1s">
          <div className="text-center max-w-4xl mx-auto pt-2 pb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
              ข่าวสารประชาสัมพันธ์
            </h1>
            <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
              อัปเดตกิจกรรมล่าสุดของสาขาวิชา การรวมตัวของศิษย์เก่า <br className="hidden md:block"/>
              และข่าวสารสำคัญทางด้านวิชาการจากวิศวกรรมชีวการแพทย์ มจพ.
            </p>
          </div>
        </FadeInSection>

        {/* ---------------- Layout แบบ 2 คอลัมน์ ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* 📌 คอลัมน์ซ้าย: เนื้อหาข่าวสาร (2/3) */}
          <div className="lg:col-span-2 flex flex-col gap-12">
            
            {/* --- 1. ข่าวประชาสัมพันธ์ล่าสุด (แค่ 1 ข่าว) --- */}
            <FadeInSection delay="0.2s">
              <div className="mb-6"><SectionBanner text="ข่าวประชาสัมพันธ์ล่าสุด" variant="exam" /></div>
              
              <div className={`flex flex-col md:flex-row w-full ${bentoGlass}`}>
                <div className="md:w-5/12 bg-slate-100 relative overflow-hidden min-h-[280px] flex-shrink-0 z-10 group cursor-pointer border-b md:border-b-0 md:border-r border-slate-200">
                  <img src={latestEvent.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Latest Event" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent mix-blend-multiply"></div>
                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md text-slate-900 text-center px-4 py-2 rounded-xl shadow-lg border border-white/50">
                    <span className="block text-sm font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-br from-slate-800 to-indigo-800">NEW!</span>
                  </div>
                </div>

                <div className="p-8 md:p-10 md:w-7/12 flex flex-col justify-center relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex h-2.5 w-2.5 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span></span>
                    <span className="text-slate-500 font-extrabold text-[11px] tracking-widest uppercase">{latestEvent.date}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 leading-snug cursor-pointer hover:text-indigo-700 transition-colors">{latestEvent.title}</h2>
                  <p className="text-slate-600 mb-8 font-medium leading-relaxed text-[15px] line-clamp-3">{latestEvent.desc}</p>
                  <button className="bg-slate-800 text-white border border-slate-700 py-3 px-8 rounded-xl w-fit hover:bg-slate-900 transition-all font-bold text-[13px] flex items-center gap-2 mt-auto">
                    อ่านรายละเอียด <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </div>
              </div>
            </FadeInSection>

            {/* --- 📌 เพิ่มช่องค้นหาข่าว (Search Box) --- */}
            <FadeInSection delay="0.25s">
              <div className="relative group max-w-full">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="ค้นหาประกาศ ข่าวสาร หรือกิจกรรม..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-12 pr-6 py-4 bg-white/70 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white text-base font-medium transition-all border border-slate-200" 
                />
              </div>
            </FadeInSection>

            {/* --- 2. ข่าวประชาสัมพันธ์วิชาการ --- */}
            <FadeInSection delay="0.3s">
              <div className="mb-6"><SectionBanner text="ข่าวประชาสัมพันธ์วิชาการ" variant="website" /></div>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {academicEvents.length > 0 ? (
                    academicEvents.map(event => <EventCard key={event.id} event={event} />)
                  ) : (
                    <motion.div layout className="col-span-2 py-10 text-center text-slate-500 font-medium bg-white/40 rounded-3xl border border-white/60">ไม่พบข้อมูลข่าววิชาการที่ค้นหา</motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              {/* ปุ่มโหลดเพิ่ม (UI จำลอง) */}
              {academicEvents.length > 0 && (
                <div className="mt-6 text-center">
                  <button className="text-[13px] font-bold text-slate-600 hover:text-indigo-600 bg-white/60 border border-slate-200 px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all">ดูข่าววิชาการเพิ่มเติม</button>
                </div>
              )}
            </FadeInSection>

            {/* --- 3. ข่าวประชาสัมพันธ์กิจกรรม --- */}
            <FadeInSection delay="0.4s">
              <div className="mb-6"><SectionBanner text="ข่าวประชาสัมพันธ์กิจกรรม" variant="calendar" /></div>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {activityEvents.length > 0 ? (
                    activityEvents.map(event => <EventCard key={event.id} event={event} />)
                  ) : (
                    <motion.div layout className="col-span-2 py-10 text-center text-slate-500 font-medium bg-white/40 rounded-3xl border border-white/60">ไม่พบข้อมูลกิจกรรมที่ค้นหา</motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              {/* ปุ่มโหลดเพิ่ม (UI จำลอง) */}
              {activityEvents.length > 0 && (
                <div className="mt-6 text-center">
                  <button className="text-[13px] font-bold text-slate-600 hover:text-rose-600 bg-white/60 border border-slate-200 px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all">ดูกิจกรรมเพิ่มเติม</button>
                </div>
              )}
            </FadeInSection>

          </div>

          {/* 📌 คอลัมน์ขวา: Sidebar (1/3) */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <div className="sticky top-24 flex flex-col gap-8">
              
              {/* ปฏิทินกิจกรรมแบบย่อ (Upcoming Timeline) */}
              <div className={`p-8 ${miniBentoGlass}`}>
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200/60">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 border border-slate-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <h3 className="text-[18px] font-extrabold text-slate-900">กำหนดการเร็วๆ นี้</h3>
                </div>

                <div className="relative pl-6 before:absolute before:inset-0 before:left-[5px] before:w-0.5 before:bg-slate-200 before:h-full">
                  {UPCOMING_TIMELINE.map((item, idx) => (
                    <div key={idx} className="relative mb-6 last:mb-0">
                      <div className={`absolute -left-[27.5px] top-1 w-3.5 h-3.5 rounded-full ring-4 ring-white ${item.isMajor ? 'bg-rose-500' : 'bg-slate-400'}`}></div>
                      <div>
                        <p className="text-[12px] font-bold text-slate-500 mb-0.5">{item.date}</p>
                        <p className={`text-[14px] leading-snug ${item.isMajor ? 'font-extrabold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 📌 เปลี่ยนให้ชี้ไปหน้า /services (หรือหน้าปฏิทินที่มีอยู่แล้ว) */}
                <a href="/services" className="w-full mt-8 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors flex justify-center items-center">
                  ดูปฏิทินการศึกษาทั้งหมด
                </a>
              </div>

              {/* แบนเนอร์ติดต่อสอบถาม (Mini CTA) */}
              <div className={`p-8 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl shadow-[0_10px_30px_rgba(15,23,42,0.2)] relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[30px]"></div>
                <h3 className="text-[18px] font-extrabold mb-2 relative z-10">สอบถามข้อมูลเพิ่มเติม</h3>
                <p className="text-[13px] text-slate-300 mb-6 font-medium leading-relaxed relative z-10">
                  หากมีข้อสงสัยเกี่ยวกับกิจกรรม ข่าวสาร หรือหลักสูตร สามารถติดต่อภาควิชาได้โดยตรง
                </p>
                <a href="/contact" className="flex items-center justify-center gap-2 w-full bg-white hover:bg-slate-100 text-slate-900 py-3 rounded-xl font-bold text-[13px] transition-all duration-300 relative z-10 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  ติดต่อสอบถาม
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}