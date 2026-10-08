import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
// 📌 Component: พื้นหลังแสงออโรร่า
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
        mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);
        -webkit-mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);
      }
      .aurora-effect::after {
        content: ""; position: absolute; inset: 0;
        background-image: var(--light-gradient), var(--aurora-bg);
        background-size: 200% 100%; background-attachment: fixed;
        mix-blend-mode: normal; opacity: 0.5; 
        animation: aurora-animation 60s linear infinite;
      }
      @keyframes aurora-animation {
        0% { background-position: 50% 50%, 50% 50%; }
        100% { background-position: 350% 50%, 350% 50%; }
      }
    `}</style>
    <motion.div animate={{ x: ["0%", "2%", "-2%", "0%"], y: ["0%", "-2%", "2%", "0%"] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-300/20 blur-[100px]" />
    <motion.div animate={{ x: ["0%", "-2%", "2%", "0%"], y: ["0%", "2%", "-2%", "0%"] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-rose-200/20 blur-[100px]" />
  </div>
);

// ==========================================
// 📌 Component: Light Holographic Beams 
// ==========================================
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
  </div>
);

// ==========================================
// 📌 ฐานข้อมูลข่าวสารและกิจกรรมจำลอง (Mock Data)
// ==========================================
const ALL_EVENTS = [
  { id: 1, category: 'กิจกรรม', date: '25 พฤศจิกายน 2026', title: 'การประกวดนวัตกรรมชีวการแพทย์ BME Innofest 2026', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop' },
  { id: 2, category: 'ข่าวประชาสัมพันธ์', date: '18 พฤศจิกายน 2026', title: 'ประกาศผลการสอบคัดเลือก TCAS รอบที่ 1 Portfolio', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop' },
  { id: 3, category: 'สัมมนา', date: '10 พฤศจิกายน 2026', title: 'สัมมนาพิเศษ: ทิศทางวิศวกรรมการแพทย์ยุค AI', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop' },
  { id: 4, category: 'ข่าวประชาสัมพันธ์', date: '5 พฤศจิกายน 2026', title: 'คณาจารย์ภาควิชาคว้ารางวัลนักวิจัยดีเด่นประจำปี', image: 'https://images.unsplash.com/photo-1507676184212-d0330a156f48?q=80&w=800&auto=format&fit=crop' },
  { id: 5, category: 'กิจกรรม', date: '1 พฤศจิกายน 2026', title: 'กิจกรรมจิตอาสา BME: ซ่อมบำรุงเครื่องมือแพทย์ชุมชน', image: 'https://images.unsplash.com/photo-1593113565214-061c5cbbfbe2?q=80&w=800&auto=format&fit=crop' },
  { id: 6, category: 'สัมมนา', date: '28 ตุลาคม 2026', title: 'Workshop ปฏิบัติการ: การสอบเทียบเครื่องมือวัดชีพจร', image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=800&auto=format&fit=crop' },
];

const UPCOMING_TIMELINE = [
  { date: '10 ต.ค. 26', title: 'โครงการคืนสู่เหย้า 12 ปี BME Connext', isMajor: true },
  { date: '15 ต.ค. 26', title: 'ปฐมนิเทศนักศึกษาฝึกงาน', isMajor: false },
  { date: '20 ต.ค. 26', title: 'เปิดรับสมัคร TCAS รอบ 2 (โควตา)', isMajor: false },
  { date: '5 พ.ย. 26', title: 'สัมมนา: อนาคตอุตสาหกรรมการแพทย์ไทย', isMajor: false },
];

// ==========================================
// 📌 Main Events Component
// ==========================================
export default function Events() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeTab, setActiveTab] = useState('ทั้งหมด');
  const tabs = ['ทั้งหมด', 'ข่าวประชาสัมพันธ์', 'กิจกรรม', 'สัมมนา'];

  const filteredEvents = activeTab === 'ทั้งหมด' 
    ? ALL_EVENTS 
    : ALL_EVENTS.filter(event => event.category === activeTab);

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(147,51,234,0.08)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden";
  const miniBentoGlass = "rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm hover:shadow-[0_15px_30px_rgba(147,51,234,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col";

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-6 pt-2">
        
        {/* ---------------- Header Section ---------------- */}
        <FadeInSection delay="0.1s">
          <div className="text-center max-w-4xl mx-auto pt-2 pb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
              กิจกรรมและข่าวสาร
            </h1>
            <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
              อัปเดตกิจกรรมล่าสุดของสาขาวิชา การรวมตัวของศิษย์เก่า <br className="hidden md:block"/>
              และข่าวสารสำคัญจากวิศวกรรมชีวการแพทย์ มจพ.
            </p>
          </div>
        </FadeInSection>

        {/* ---------------- Hero Event Card (ข่าวเด่น) ---------------- */}
        <FadeInSection delay="0.2s" className="mb-12">
          <div className={`flex flex-col md:flex-row w-full ${bentoGlass}`}>
            <LightHolographicBeams />
            <div className="absolute left-0 top-10 bottom-10 w-1.5 bg-gradient-to-b from-purple-500 to-rose-400 rounded-r-lg z-10 hidden md:block"></div>

            <div className="md:w-5/12 bg-slate-100 relative border-r border-slate-200/60 overflow-hidden min-h-[280px] flex-shrink-0 z-10 group">
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Hero Event" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent mix-blend-multiply"></div>
              
              <div className="absolute top-6 left-6 md:top-8 md:left-8 bg-white/95 backdrop-blur-md text-slate-900 text-center px-6 py-4 rounded-3xl shadow-[0_10px_20px_rgba(0,0,0,0.15)] border border-white/50">
                <span className="block text-4xl font-black mb-1 bg-clip-text text-transparent bg-gradient-to-br from-slate-800 to-indigo-800">10</span>
                <span className="block text-[11px] font-bold tracking-widest uppercase text-slate-500">ต.ค. 2026</span>
              </div>
            </div>

            <div className="p-8 md:p-12 md:w-7/12 flex flex-col justify-center relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <span className="text-slate-800 font-extrabold text-[11px] tracking-widest uppercase">Upcoming Event</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 leading-snug">
                โครงการคืนสู่เหย้า 12 ปี<br/>
                <span className="text-xl md:text-2xl font-bold text-slate-500 mt-1 block">(12th Anniversary BME Connext)</span>
              </h2>
              
              <p className="text-slate-600 mb-8 font-medium leading-relaxed text-[15px]">
                เชิญชวนศิษย์เก่าและศิษย์ปัจจุบันร่วมงานฉลองครบรอบ 12 ปี BME มจพ. พบปะสังสรรค์ แลกเปลี่ยนประสบการณ์กับเครือข่ายวิชาชีพ พร้อมชมการแสดงดนตรีและรับประทานอาหารร่วมกัน
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto mb-8">
                <div className="flex items-center text-[13px] text-slate-700 font-bold bg-white/70 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-sm w-fit">
                  <span className="text-rose-500 mr-2 text-lg">📍</span> สโมสรกรมยุทธบริการทหาร
                </div>
                <div className="flex items-center text-[13px] text-slate-700 font-bold bg-white/70 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-sm w-fit">
                  <span className="text-indigo-500 mr-2 text-lg">⏰</span> 17:00 - 22:00 น.
                </div>
              </div>

              <button className="bg-slate-800 text-white border border-slate-700 py-3 px-8 rounded-xl w-fit hover:bg-slate-900 hover:shadow-[0_8px_20px_rgba(15,23,42,0.2)] hover:-translate-y-0.5 transition-all duration-300 font-bold text-[13px] flex items-center gap-2">
                ดูรายละเอียดเพิ่มเติม
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>
        </FadeInSection>

        {/* ---------------- Filter & Main Content Area (Layout แบบ 2 คอลัมน์) ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* คอลัมน์ซ้าย: ข่าวสารอื่นๆ (2/3) */}
          <div className="lg:col-span-2">
            
            {/* 📌 แถบตัวกรองหมวดหมู่ (Filter Tabs) */}
            <div className="flex flex-wrap gap-3 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-full text-[13px] font-bold transition-all duration-300 shadow-sm border ${
                    activeTab === tab 
                      ? 'bg-slate-800 text-white border-slate-800 shadow-[0_5px_15px_rgba(15,23,42,0.2)]' 
                      : 'bg-white/60 backdrop-blur-sm text-slate-600 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* 📌 กริดข่าวสาร (More Events Grid) */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event) => (
                  <motion.div
                    layout
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className={miniBentoGlass}
                  >
                    <div className="h-48 bg-slate-100 overflow-hidden relative group cursor-pointer">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      
                      {/* Badge หมวดหมู่ */}
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-800 shadow-sm">
                        {event.category}
                      </span>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-[12px] font-semibold text-slate-500 mb-2">{event.date}</p>
                      <h3 className="text-[17px] font-extrabold text-slate-900 leading-snug mb-4 line-clamp-2 hover:text-indigo-700 transition-colors cursor-pointer">
                        {event.title}
                      </h3>
                      
                      <div className="mt-auto">
                        <button className="text-[12px] font-bold text-slate-800 hover:text-indigo-800 transition-colors flex items-center gap-1 group">
                          อ่านต่อ 
                          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredEvents.length === 0 && (
                <div className="col-span-2 py-12 text-center text-slate-500 font-medium">
                  ไม่พบข่าวสารในหมวดหมู่นี้
                </div>
              )}
            </motion.div>
          </div>

          {/* คอลัมน์ขวา: Sidebar (1/3) */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            
            {/* 📌 ปฏิทินกิจกรรมแบบย่อ (Upcoming Timeline) - ดีไซน์ใหม่ให้เป็นระเบียบ */}
            <div className={`p-8 ${miniBentoGlass}`}>
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200/60">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 border border-slate-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">กำหนดการเร็วๆ นี้</h3>
              </div>

              {/* คอนเทนเนอร์หลักของ Timeline (มีเส้นแนวตั้งอยู่ซ้ายสุด) */}
              <div className="relative pl-6 before:absolute before:inset-0 before:left-[5px] before:w-0.5 before:bg-slate-200 before:h-full">
                {UPCOMING_TIMELINE.map((item, idx) => (
                  <div key={idx} className="relative mb-6 last:mb-0">
                    {/* จุดบนเส้น (ซ้ายสุด) */}
                    <div className={`absolute -left-[27.5px] top-1 w-3.5 h-3.5 rounded-full ring-4 ring-white ${item.isMajor ? 'bg-rose-500' : 'bg-slate-400'}`}></div>
                    
                    {/* เนื้อหา (ขยับมาชิดซ้ายให้ตรงกัน) */}
                    <div>
                      <p className="text-[12px] font-bold text-slate-500 mb-0.5">{item.date}</p>
                      <p className={`text-[14px] leading-snug ${item.isMajor ? 'font-extrabold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-8 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors">
                ดูปฏิทินทั้งหมด
              </button>
            </div>

            {/* 📌 แบนเนอร์ติดต่อสอบถาม (Mini CTA) - แก้สีปุ่มให้โดดเด่น */}
            <div className={`p-8 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl shadow-[0_10px_30px_rgba(15,23,42,0.2)] relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[30px]"></div>
              <h3 className="text-xl font-extrabold mb-2 relative z-10">สอบถามข้อมูลเพิ่มเติม</h3>
              <p className="text-[13px] text-slate-300 mb-6 font-medium leading-relaxed relative z-10">
                หากมีข้อสงสัยเกี่ยวกับกิจกรรม ข่าวสาร หรือหลักสูตร สามารถติดต่อภาควิชาได้โดยตรง
              </p>
              
              {/* เปลี่ยนปุ่มเป็นสีขาว ตัวหนังสือสีเข้ม เพื่อให้เด่นชัดและน่ากดขึ้น */}
              <a href="/contact" className="flex items-center justify-center gap-2 w-full bg-white hover:bg-slate-100 text-slate-900 py-3 rounded-xl font-bold text-[13px] transition-all duration-300 relative z-10 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                ติดต่อสอบถาม
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}