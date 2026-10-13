import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { supabase } from '../supabaseClient'; 

import { AuroraBackground, SectionBanner } from '../components/ThemeElements';
import ThailandAlumniMap from '../components/ThailandAlumniMap';

import bmeAlumniBar from '../assets/bme_alumni_bar.png';
import bmeLogo from '../assets/bme_Logo.png';

import bmeMascot from '../assets/bme_mascot.png';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('th-TH', options);
};

// ==========================================
// 📌 Components ย่อย
// ==========================================
const FadeInSection = ({ children, delay = "0s", className = "" }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setVisible(true); });
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

const LightHolographicBeams = () => (
  <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none opacity-80 z-0">
    <style>{`
      @keyframes holo-sweep {
        0% { transform: translateX(-150%) skewX(-20deg); }
        100% { transform: translateX(250%) skewX(-20deg); }
      }
      .holo-beam-base { position: absolute; top: -20%; bottom: -20%; filter: blur(20px); }
      .holo-beam-1 { width: 60%; background: linear-gradient(90deg, transparent 0%, rgba(200, 180, 255, 0.25) 30%, rgba(160, 210, 255, 0.2) 50%, rgba(255, 180, 210, 0.25) 70%, transparent 100%); animation: holo-sweep 8s infinite ease-in-out; }
      .holo-beam-2 { width: 40%; background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(220, 230, 255, 0.3) 60%, transparent 100%); animation: holo-sweep 6s infinite linear; animation-delay: 2.5s; }
    `}</style>
    <div className="holo-beam-base holo-beam-1"></div>
    <div className="holo-beam-base holo-beam-2"></div>
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjYpIi8+PC9zdmc+')] opacity-40 mix-blend-overlay"></div>
  </div>
);

// 📌 กลับมาแล้ว! Component: Aurora Background (สำหรับ CTA)
const CTA_AuroraBackground = ({ children }) => {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`, size: `${Math.random() * 2 + 1}px`
    }));
  }, []);

  return (
    <div className="relative overflow-hidden w-full h-full">
      <style>{`
        @keyframes cta-pulse {
          0% { transform: scale(1) translate(0, 0); opacity: 0.5; }
          100% { transform: scale(1.2) translate(5%, 5%); opacity: 0.8; }
        }
        @keyframes twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
      `}</style>
      
      {stars.map(star => (
        <div key={star.id} className="absolute bg-white rounded-full"
          style={{ left: star.left, top: star.top, width: star.size, height: star.size, animation: `twinkle 4s infinite`, animationDelay: star.animationDelay }}
        />
      ))}
      <div className="absolute -top-[30%] -left-[20%] w-[120%] h-[120%] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 60%)', animation: 'cta-pulse 8s ease-in-out infinite alternate' }} />
      <div className="absolute -bottom-[30%] -right-[20%] w-[120%] h-[120%] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 60%)', animation: 'cta-pulse 8s ease-in-out infinite alternate-reverse' }} />
      
      <div className="relative z-10 p-10 md:p-16 text-center flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

const MascotGreeting = () => {
  return (
    <div className="absolute -bottom-2 -right-6 md:-bottom-2 md:-right-8 lg:-bottom-4 lg:-right-12 xl:-bottom-4 xl:-right-14 z-[100] w-24 sm:w-28 md:w-32 lg:w-36 xl:w-44 cursor-pointer hover:-translate-y-2 transition-all duration-500 pointer-events-auto hidden sm:block group">
      
      <style>{`
        /* อะนิเมชันลอยขึ้นลงเบาๆ ของกล่องข้อความ */
        @keyframes bubble-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        /* อะนิเมชันเด้งขึ้นมาเมื่อเริ่มโหลดหน้าเว็บ */
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.5) translateY(15px); }
          70% { transform: scale(1.08) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .animate-bubble-in {
          animation: pop-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.2) forwards, 
                     bubble-float 3.5s ease-in-out 0.6s infinite;
        }
      `}</style>
      
      {/* เพิ่ม drop-shadow ให้ตัวน้องดูลอยเด่นขึ้นมาจากการ์ด */}
      <div className="relative w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)]">
        
        <img src={bmeMascot} alt="BME Mascot" className="w-full block" />
        
        {/* กล่องคำพูด (Speech Bubble) – ปรับให้อ่านง่ายและอยู่ในตำแหน่งที่สวยงามพอดีข้างแก้ม */}
        <div className="absolute top-[12%] md:top-[16%] right-[90%] sm:right-[92%] bg-white text-purple-700 text-sm sm:text-base md:text-lg font-black px-5 py-3 rounded-[1.25rem] shadow-[0_15px_25px_rgba(147,51,234,0.25)] border-2 border-purple-100 animate-bubble-in pointer-events-none z-10 w-max flex items-center gap-1.5">
          <span>สวัสดีครับ! 👋</span>
          
          {/* หางลูกโป่งข้อความ */}
          <div className="absolute top-[50%] -right-[7px] -translate-y-1/2 w-3.5 h-3.5 bg-white border-t-2 border-r-2 border-purple-100 transform rotate-45"></div>
        </div>

      </div>
    </div>
  );
};

const WelcomeMask = ({ textScale, textOpacity, overlayOpacity, overlayPointer }) => (
  <motion.div style={{ opacity: overlayOpacity, pointerEvents: overlayPointer }} className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden">
    <style>{`
      .aurora-mask-bg {
        --aurora-white: #ffffff; --aurora-transparent: rgba(255,255,255,0);
        --aurora-c1: #c084fc; --aurora-c2: #fb7185; --aurora-c3: #818cf8; --aurora-c4: #f472b6; --aurora-c5: #a78bfa; 
        --light-gradient: repeating-linear-gradient(100deg, var(--aurora-white) 0%, var(--aurora-white) 7%, var(--aurora-transparent) 10%, var(--aurora-transparent) 12%, var(--aurora-white) 16%);
        --aurora-bg: repeating-linear-gradient(100deg, var(--aurora-c1) 10%, var(--aurora-c2) 15%, var(--aurora-c3) 20%, var(--aurora-c4) 25%, var(--aurora-c5) 30%);
        background-image: var(--light-gradient), var(--aurora-bg); background-size: 300% 200%; background-position: 50% 50%, 50% 50%;
        filter: blur(14px); mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%); -webkit-mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);
      }
      .aurora-mask-bg::after { content: ""; position: absolute; inset: 0; background-image: var(--light-gradient), var(--aurora-bg); background-size: 200% 100%; background-attachment: fixed; mix-blend-mode: normal; opacity: 0.5; animation: aurora-animation 60s linear infinite; }
      @keyframes aurora-animation { 0% { background-position: 50% 50%, 50% 50%; } 100% { background-position: 350% 50%, 350% 50%; } }
    `}</style>
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -inset-[10px] opacity-70 will-change-transform aurora-mask-bg"></div>
    </div>
    <motion.div style={{ scale: textScale, opacity: textOpacity }} className="relative w-full max-w-6xl mx-auto h-full flex flex-col items-center justify-center will-change-transform transform-gpu z-10 px-6">
      
      <motion.div animate={{ y: ["0px", "-12px", "0px"], rotate: [-2, 1, -2] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[16%] left-[6%] lg:left-[10%] hidden md:flex items-center gap-3.5 px-4 py-3 bg-white/85 backdrop-blur-xl rounded-2xl border border-purple-100 shadow-[0_12px_35px_rgba(147,51,234,0.12)]">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
        </div>
        <div className="text-left pr-1">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600">Vital Signals</p>
          <p className="text-xs font-black text-slate-800">Medical Devices</p>
        </div>
      </motion.div>

      <motion.div animate={{ y: ["0px", "12px", "0px"], rotate: [2, -1, 2] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[16%] right-[6%] lg:right-[10%] hidden md:flex items-center gap-3.5 px-4 py-3 bg-white/85 backdrop-blur-xl rounded-2xl border border-rose-100 shadow-[0_12px_35px_rgba(225,29,72,0.12)]">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-sm shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
        </div>
        <div className="text-left pr-1">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-rose-600">Smart Health</p>
          <p className="text-xs font-black text-slate-800">AI & Robotics</p>
        </div>
      </motion.div>

      <motion.div animate={{ y: ["0px", "10px", "0px"], rotate: [-1, 2, -1] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[20%] left-[8%] lg:left-[12%] hidden md:flex items-center gap-3.5 px-4 py-3 bg-white/85 backdrop-blur-xl rounded-2xl border border-indigo-100 shadow-[0_12px_35px_rgba(79,70,229,0.12)]">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>
        <div className="text-left pr-1">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">Safety & Standard</p>
          <p className="text-xs font-black text-slate-800">Clinical Engineering</p>
        </div>
      </motion.div>

      <motion.div animate={{ y: ["0px", "-10px", "0px"], rotate: [1, -2, 1] }} transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[20%] right-[8%] lg:right-[12%] hidden md:flex items-center gap-3.5 px-4 py-3 bg-white/85 backdrop-blur-xl rounded-2xl border border-teal-100 shadow-[0_12px_35px_rgba(13,148,136,0.12)]">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        </div>
        <div className="text-left pr-1">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-teal-600">Research & Lab</p>
          <p className="text-xs font-black text-slate-800">Bio-Innovation</p>
        </div>
      </motion.div>

      <div className="mb-3 md:mb-4 z-20"><img src={bmeAlumniBar} alt="BME Alumni Logo" className="h-6 md:h-8 lg:h-10 w-auto object-contain drop-shadow-sm opacity-85" /></div>
      <div className="text-[22vw] sm:text-[20vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-purple-700 to-rose-600 relative leading-none text-center drop-shadow-lg z-20 select-none">BME</div>
      <div className="mt-8 text-center flex flex-col items-center gap-1.5 z-20">
        <p className="text-base md:text-lg font-bold text-slate-900 tracking-wide mb-1">วิศวกรรมชีวการแพทย์ <span className="mx-2 text-slate-300">|</span> Biomedical Engineering</p>
        <h2 className="text-lg md:text-xl font-extrabold text-slate-900">มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ</h2>
        <p className="text-xs md:text-sm text-slate-600 font-semibold tracking-wide">King Mongkut's University of Technology North Bangkok</p>
      </div>
    </motion.div>
    <div className="absolute bottom-10 text-slate-400 font-bold uppercase tracking-widest text-sm z-20 animate-bounce">เลื่อนลงเพื่อเข้าสู่หน้าเว็บ ↓</div>
  </motion.div>
);

const DestinationCard = ({ imageUrl, title, subtitle, stats, themeColor }) => (
  <div className="relative w-full h-[400px] md:h-[450px] overflow-hidden rounded-3xl group cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition-all duration-500" style={{ '--theme-color': themeColor }}>
    <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
    <div className="absolute inset-0 transition-opacity duration-500" style={{ background: `linear-gradient(to top, hsl(var(--theme-color) / 0.9) 0%, hsl(var(--theme-color) / 0.4) 50%, transparent 100%)` }} />
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(to top, hsl(var(--theme-color) / 0.95) 0%, hsl(var(--theme-color) / 0.8) 100%)` }} />
    <div className="absolute inset-0 p-8 flex flex-col justify-end">
      <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
        <h3 className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tighter drop-shadow-md">{title}</h3>
        <p className="text-white/80 font-bold text-lg drop-shadow-md mb-2">{subtitle}</p>
        <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden mt-4">
          <p className="text-white/95 text-sm md:text-base font-medium leading-relaxed">{stats}</p>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// 📌 Component หลัก (Main Content)
// ==========================================
const MainContent = () => {
  const [content, setContent] = useState({});
  const [features, setFeatures] = useState([]);
  const [events, setEvents] = useState([]);
  const [alumniStats, setAlumniStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { data: homeData } = await supabase.from('home_content').select('*').single();
      if (homeData) setContent(homeData);

      const { data: featureData } = await supabase.from('home_features').select('*').order('sort_order', { ascending: true });
      if (featureData) setFeatures(featureData);

      const { data: eventData } = await supabase.from('events').select('*').order('event_date', { ascending: false }).limit(4);
      if (eventData) setEvents(eventData);

      const { data: alumniData } = await supabase.from('alumni').select('work_province');
      if (alumniData) {
        const provinceCount = alumniData.reduce((acc, curr) => {
          const prov = curr.work_province;
          if (prov) acc[prov] = (acc[prov] || 0) + 1;
          return acc;
        }, {});
        setAlumniStats(provinceCount);
      }
    };
    fetchData();
  }, []);

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(147,51,234,0.08)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden";
  const sectionWrapperGlass = "rounded-[2.5rem] md:rounded-[3rem] bg-white/55 backdrop-blur-2xl border border-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8 md:p-12 relative overflow-hidden";

  return (
    <div className="relative z-10 w-full pb-32 px-4 md:px-6"> 
      <div className="max-w-[1250px] mx-auto flex flex-col gap-16 md:gap-20 pt-4"> 
        
        {/* ================= HERO & STATS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <FadeInSection delay="0.1s" className="lg:col-span-2">
            {/* 🟢 เพิ่ม div relative คลุมตรงนี้ */}
            <div className="relative h-full w-full">
              
              {/* ตัวการ์ดเดิม (ที่มี bentoGlass) */}
              <div className={`p-10 md:p-16 flex flex-col justify-center text-center items-center h-full ${bentoGlass}`}>
                <LightHolographicBeams />
                <img src={bmeLogo} alt="BME Logo" className="h-20 md:h-28 lg:h-32 w-auto mb-6 md:mb-8 z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]" />
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.2] text-slate-900 mb-4 z-10">
                  {content.hero_title || "สาขาวิชาวิศวกรรมชีวการแพทย์"}<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-700 to-rose-600">{content.hero_highlight || "Biomedical Engineering"}</span>
                </h1>
                <p className="text-slate-600 font-medium max-w-2xl text-lg md:text-xl mb-10 leading-relaxed z-10">
                  {content.hero_desc}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 z-10">
                  <Link to="/about/department" className="bg-[#0f172a] text-white px-8 py-3.5 rounded-2xl font-bold text-center text-lg hover:bg-purple-900 hover:shadow-[0_8px_25px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 transition-all duration-300 shadow-md">เกี่ยวกับสาขาวิชา</Link>
                  <Link to="/alumni/database" className="bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-2xl font-bold text-center text-lg hover:text-slate-900 hover:bg-slate-50 hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 shadow-sm">ทำเนียบศิษย์เก่า</Link>
                </div>
              </div>

              {/* 🟢 เรียกใช้ MascotGreeting ให้อยู่ระดับเดียวกับการ์ด */}
              <MascotGreeting />
              
            </div>
          </FadeInSection>

          <FadeInSection delay="0.2s" className="h-full">
            <div className={`p-10 md:p-14 flex flex-col justify-center items-center text-center h-full ${bentoGlass}`}>
              <LightHolographicBeams />
              <div className="w-14 h-14 bg-purple-100/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-inner z-10 border border-purple-200/50">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4 z-10">{content.stats1_title}</h2>
              <p className="text-lg text-slate-700 font-medium leading-relaxed mb-8 max-w-sm mx-auto z-10">{content.stats1_desc}</p>
              <Link to="/about/department" className="px-6 py-2.5 rounded-full border border-slate-300 bg-white/50 backdrop-blur-md text-slate-700 text-sm font-bold hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2 z-10">เกี่ยวกับสาขาวิชา &rarr;</Link>
            </div>
          </FadeInSection>

          <FadeInSection delay="0.3s" className="h-full">
            <div className={`p-10 md:p-14 flex flex-col justify-center items-center text-center h-full ${bentoGlass}`}>
              <LightHolographicBeams />
              <div className="w-14 h-14 bg-indigo-100/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-inner z-10 border border-indigo-200/50">
                <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4 z-10">{content.stats2_title}</h2>
              <p className="text-lg text-slate-700 font-medium leading-relaxed mb-8 max-w-sm mx-auto z-10">{content.stats2_desc}</p>
              <Link to="/curriculum" className="px-6 py-2.5 rounded-full border border-slate-300 bg-white/50 backdrop-blur-md text-slate-700 text-sm font-bold hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2 z-10">ข้อมูลหลักสูตร &rarr;</Link>
            </div>
          </FadeInSection>
        </div>

        {/* ================= MOTTO ================= */}
        <section className="py-2">
          <FadeInSection delay="0.2s">
            <div className="w-full rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-[#f3f4f6] p-8 sm:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-white">
              <LightHolographicBeams />
              <div className="relative z-30 flex flex-col items-center gap-2">
                <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-800 drop-shadow-sm sm:whitespace-nowrap">{content.motto_th}</h2>
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-500 tracking-wide mt-1">{content.motto_en}</h3>
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* ================= ทำไมต้อง BME KMUTNB ================= */}
        <section>
          <FadeInSection>
            <div className={sectionWrapperGlass}>
              <div className="max-w-4xl mx-auto"><SectionBanner text="ทำไมต้อง BME KMUTNB" variant="website" /></div>
              <div className="text-center max-w-2xl mx-auto mb-10 mt-6">
                <p className="text-slate-600 text-base sm:text-lg md:text-xl font-medium">ความแตกต่างที่ทำให้บัณฑิตของเราพร้อมตอบโจทย์ภาคอุตสาหกรรมและการแพทย์ทั่วประเทศ</p>
              </div>

              {/* การ์ด 4 ด้าน */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {features.map((feature, idx) => (
                  <FadeInSection key={feature.id} delay={`${idx * 0.1}s`} className="h-full">
                    <DestinationCard imageUrl={feature.image_url} title={feature.title} subtitle={feature.subtitle} stats={feature.description} themeColor={feature.theme_color} />
                  </FadeInSection>
                ))}
              </div>

              <FadeInSection delay="0.25s">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/80 backdrop-blur-xl rounded-[2.25rem] p-6 sm:p-8 md:p-10 border border-purple-100/80 shadow-sm">
                  <div className="lg:col-span-5 flex flex-col justify-center space-y-5">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-extrabold uppercase tracking-wider w-fit">🌟 Nationwide Alumni Network</span>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">เครือข่ายรุ่นพี่ศิษย์เก่า<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-rose-600">กระจายตัวทำงานทั่วประเทศ</span></h3>
                    <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">บัณฑิตจากสาขาวิชาวิศวกรรมชีวการแพทย์ มจพ. ได้รับความไว้วางใจจากโรงพยาบาลรัฐ เอกชน และบริษัทเครื่องมือแพทย์ชั้นนำระดับสากล โดยปฏิบัติงานและรับผิดชอบดูแลพื้นที่ครอบคลุมทั่วทุกภูมิภาคของประเทศไทย</p>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-100"><p className="text-2xl font-black text-purple-900">ทั่วทุกภาค</p><p className="text-xs font-bold text-purple-700 mt-0.5">โรงพยาบาล & บริษัทชั้นนำ</p></div>
                      <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-100"><p className="text-2xl font-black text-rose-900">สายงานตรง</p><p className="text-xs font-bold text-rose-700 mt-0.5">Service, Specialist, Sales, R&D</p></div>
                    </div>
                    <div className="pt-2"><Link to="/alumni/database" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-purple-800 transition-all shadow-md hover:-translate-y-0.5">สำรวจทำเนียบศิษย์เก่าทั้งหมด<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></Link></div>
                  </div>
                  <div className="lg:col-span-7">
                    <ThailandAlumniMap provinceData={alumniStats} />
                  </div>
                </div>
              </FadeInSection>
            </div>
          </FadeInSection>
        </section>

        {/* ================= EVENTS ================= */}
        <section>
          <FadeInSection>
            <div className={sectionWrapperGlass}>
              <div className="max-w-4xl mx-auto"><SectionBanner text="อัปเดตข้อมูลล่าสุด" variant="calendar" /></div>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 px-2 mt-6">
                <p className="text-slate-600 font-medium text-base sm:text-lg">ติดตามข่าวสาร ประชาสัมพันธ์ และความเคลื่อนไหวจากเครือข่าย BME KMUTNB</p>
                <Link to="/events" className="text-slate-800 font-bold hover:bg-slate-900 hover:text-white transition-colors flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-md rounded-xl border border-slate-200 text-sm shadow-sm shrink-0">ดูทั้งหมด<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></Link>
              </div>

              <div className="grid md:grid-cols-2 gap-5 md:gap-6">
                {events.length > 0 ? events.map((event, i) => (
                  <FadeInSection key={event.id} delay={`${i * 0.1}s`} className="h-full">
                    <Link to={`/events/${event.id}`} className={`flex flex-col p-5 group ${bentoGlass} h-full`}>
                      <div className="h-64 bg-slate-200/50 rounded-[1.5rem] relative overflow-hidden mb-6 border border-white/80 shadow-inner shrink-0">
                         {event.cover_image ? (
                           <img src={event.cover_image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-slate-400 text-xl font-bold group-hover:scale-110 transition-transform duration-700 ease-out relative z-10">ภาพประกอบกิจกรรม</div>
                         )}
                      </div>
                      <div className="px-3 pb-3 flex flex-col flex-grow">
                        <p className="text-xs font-medium text-indigo-600/80 mb-2 tracking-wide uppercase">{formatDate(event.event_date)}</p>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-800 transition-colors leading-snug line-clamp-2">{event.title}</h3>
                        <p className="text-slate-500 font-normal text-sm md:text-base line-clamp-2 mt-auto">{event.description || 'คลิกเพื่อดูรายละเอียดเนื้อหากิจกรรม ข่าวสาร และการลงทะเบียนเข้าร่วมงานได้ที่นี่'}</p>
                      </div>
                    </Link>
                  </FadeInSection>
                )) : (
                  <div className="col-span-2 text-center text-slate-500 py-10 font-medium">ยังไม่มีข้อมูลข่าวสารในขณะนี้</div>
                )}
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* ================= CTA (Aurora Background) ================= */}
        <section>
          <FadeInSection>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-800 shadow-[0_15px_50px_rgba(0,0,0,0.3)] w-full p-[2px]">
              <div className="relative w-full h-full rounded-[calc(2.5rem-2px)] overflow-hidden bg-[#0a0a0a] z-10 flex flex-col">
                
                {/* 📌 เรียกใช้ CTA_AuroraBackground ครอบข้อความ */}
                <CTA_AuroraBackground>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-gray-50 to-gray-400 tracking-tight leading-tight mb-6">
                    {content.cta_title || "สร้างเครือข่ายด้วยกัน"}
                  </h2>
                  <p className="text-lg md:text-xl text-gray-300 font-medium mb-12 leading-relaxed max-w-3xl mx-auto">
                    {content.cta_desc || "ระบบจัดการและบริการสำหรับ นักศึกษาปัจจุบัน และ ศิษย์เก่า ประจำสาขาวิชา เพื่อเชื่อมต่อความสัมพันธ์ เข้าถึงเครื่องมือจำลองแผนการเรียน และปลดล็อกเมนูบริการพิเศษที่เข้าถึงได้เฉพาะสมาชิกเท่านั้น"}
                  </p>
                  <Link to="/login" className="inline-block bg-white text-[#0f172a] px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    เข้าสู่ระบบ / สมัครสมาชิก
                  </Link>
                </CTA_AuroraBackground>

              </div>
            </div>
          </FadeInSection>
        </section>

      </div>
    </div>
  );
};

// ==========================================
// 📌 5. Component ตัวแม่ (Home)
// ==========================================
export default function Home() {
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("bme_visited")) setIsFirstVisit(false);
  }, []);

  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { stiffness: 100, damping: 30, mass: 0.1 });

  useEffect(() => {
    return scrollY.on("change", (val) => {
      if (val > 400 && isFirstVisit) sessionStorage.setItem("bme_visited", "true");
    });
  }, [scrollY, isFirstVisit]);

  const textScale = useTransform(smoothY, [0, 400], [1, 15]);
  const textOpacity = useTransform(smoothY, [50, 250], [1, 0]); 
  const overlayOpacity = useTransform(smoothY, [200, 500], [1, 0]);
  const overlayPointer = useTransform(scrollY, y => y > 300 ? "none" : "auto");

 if (!isFirstVisit) {
    return (
      <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-24">
        <AuroraBackground />
        <MainContent />
        <MascotGreeting /> {/* <--- เพิ่มตรงนี้ */}
      </div>
    );
  }

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen">
      <AuroraBackground />
      <div className="h-[90vh] w-full" />
      <MainContent />
      <WelcomeMask textScale={textScale} textOpacity={textOpacity} overlayOpacity={overlayOpacity} overlayPointer={overlayPointer} />
      <MascotGreeting /> {/* <--- เพิ่มตรงนี้ด้วย */}
    </div>
  );
}