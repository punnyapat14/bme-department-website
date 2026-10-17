import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient'; 

import { AuroraBackground, SectionBanner } from '../components/ThemeElements';
import ThailandAlumniMap from '../components/ThailandAlumniMap';

import bmeAlumniBar from '../assets/BME_WebBar.png';
import bmeLogo from '../assets/bme_Logo.png';
import bmeMascot from '../assets/bme_mascot.png';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('th-TH', options);
};

// ==========================================
// 📌 Components ย่อย (คงเดิม)
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
        @keyframes bubble-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
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
      
      <div className="relative w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)]">
        <img src={bmeMascot} alt="BME Mascot" className="w-full block" />
        <div className="absolute top-[12%] md:top-[16%] right-[90%] sm:right-[92%] bg-white text-purple-700 text-sm sm:text-base md:text-lg font-black px-5 py-3 rounded-[1.25rem] shadow-[0_15px_25px_rgba(147,51,234,0.25)] border-2 border-purple-100 animate-bubble-in pointer-events-none z-10 w-max flex items-center gap-1.5">
          <span>สวัสดีครับ! 👋</span>
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

// 📌 Component: EditButton (ปุ่มดินสอสำหรับ Admin)
const EditButton = ({ onClick, className = "" }) => (
  <button 
    onClick={onClick}
    className={`absolute z-30 p-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition-colors ${className}`}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
  </button>
);

const DestinationCard = ({ feature, isAdmin, onEdit }) => (
  <div className="relative w-full h-[400px] md:h-[450px] overflow-hidden rounded-3xl group cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition-all duration-500" style={{ '--theme-color': feature.theme_color }}>
    {isAdmin && (
      <EditButton onClick={() => onEdit(feature, 'feature')} className="top-4 right-4 opacity-0 group-hover:opacity-100" />
    )}
    <img src={feature.image_url || 'https://via.placeholder.com/800x600'} alt={feature.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
    <div className="absolute inset-0 transition-opacity duration-500" style={{ background: `linear-gradient(to top, hsl(var(--theme-color) / 0.9) 0%, hsl(var(--theme-color) / 0.4) 50%, transparent 100%)` }} />
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(to top, hsl(var(--theme-color) / 0.95) 0%, hsl(var(--theme-color) / 0.8) 100%)` }} />
    <div className="absolute inset-0 p-8 flex flex-col justify-end">
      <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
        <h3 className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tighter drop-shadow-md">{feature.title}</h3>
        <p className="text-white/80 font-bold text-lg drop-shadow-md mb-2">{feature.subtitle}</p>
        <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden mt-4">
          <p className="text-white/95 text-sm md:text-base font-medium leading-relaxed">{feature.description}</p>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// 📌 Component หลัก (Main Content)
// ==========================================
const MainContent = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [content, setContent] = useState({});
  const [features, setFeatures] = useState([]);
  const [events, setEvents] = useState([]);
  const [alumniStats, setAlumniStats] = useState({});

  // 📌 Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('content'); // 'content' หรือ 'feature'
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // เช็คเพิ่มเติมด้วยว่า role เป็น admin หรือไม่ (ถ้ามีเก็บใน profiles)
      // สมมติว่าล็อกอินได้คือ Admin ชั่วคราว (ควรปรับใช้การเช็ค Role จริง)
      if (session) setIsAdmin(true); 
    };

    const fetchData = async () => {
      const { data: homeData } = await supabase.from('home_content').select('*').eq('id', 1).single();
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
    checkAdmin();
    fetchData();
  }, []);

  // 📌 เปิด Modal
  const handleOpenModal = (data, type) => {
    setModalType(type);
    setFormData(data || {});
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `features/${fileName}`;

    try {
      const { error } = await supabase.storage.from('images').upload(filePath, file);
      if (error) throw error;
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setFormData({ ...formData, image_url: data.publicUrl });
    } catch (error) {
      alert('อัปโหลดรูปภาพไม่สำเร็จ');
    } finally {
      setIsUploading(false);
    }
  };

  // 📌 บันทึกข้อมูล
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (modalType === 'content') {
        const { error } = await supabase.from('home_content').update(formData).eq('id', 1);
        if (error) throw error;
        setContent(formData);
      } else if (modalType === 'feature') {
        const { error } = await supabase.from('home_features').update(formData).eq('id', formData.id);
        if (error) throw error;
        setFeatures(features.map(f => f.id === formData.id ? formData : f));
      }
      setIsModalOpen(false);
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(147,51,234,0.08)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group/bento";
  const sectionWrapperGlass = "rounded-[2.5rem] md:rounded-[3rem] bg-white/55 backdrop-blur-2xl border border-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8 md:p-12 relative overflow-hidden";

  return (
    <div className="relative z-10 w-full pb-32 px-4 md:px-6"> 
      <div className="max-w-[1250px] mx-auto flex flex-col gap-16 md:gap-20 pt-4"> 
        
        {/* ================= HERO & STATS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          <FadeInSection delay="0.1s" className="lg:col-span-2">
            <div className="relative h-full w-full">
              <div className={`p-10 md:p-16 flex flex-col justify-center text-center items-center h-full ${bentoGlass}`}>
                {isAdmin && <EditButton onClick={() => handleOpenModal(content, 'content')} className="top-4 right-4 opacity-0 group-hover/bento:opacity-100" />}
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
              <MascotGreeting />
            </div>
          </FadeInSection>

          <FadeInSection delay="0.2s" className="h-full">
            <div className={`p-10 md:p-14 flex flex-col justify-center items-center text-center h-full ${bentoGlass}`}>
              {isAdmin && <EditButton onClick={() => handleOpenModal(content, 'content')} className="top-4 right-4 opacity-0 group-hover/bento:opacity-100" />}
              <LightHolographicBeams />
              <div className="w-14 h-14 bg-purple-100/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-inner z-10 border border-purple-200/50">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4 z-10">{content.stats1_title}</h2>
              <p className="text-lg text-slate-700 font-medium leading-relaxed mb-8 max-w-sm mx-auto z-10">{content.stats1_desc}</p>
            </div>
          </FadeInSection>

          <FadeInSection delay="0.3s" className="h-full">
            <div className={`p-10 md:p-14 flex flex-col justify-center items-center text-center h-full ${bentoGlass}`}>
              {isAdmin && <EditButton onClick={() => handleOpenModal(content, 'content')} className="top-4 right-4 opacity-0 group-hover/bento:opacity-100" />}
              <LightHolographicBeams />
              <div className="w-14 h-14 bg-indigo-100/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-inner z-10 border border-indigo-200/50">
                <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4 z-10">{content.stats2_title}</h2>
              <p className="text-lg text-slate-700 font-medium leading-relaxed mb-8 max-w-sm mx-auto z-10">{content.stats2_desc}</p>
            </div>
          </FadeInSection>
        </div>

        {/* ================= MOTTO ================= */}
        <section className="py-2">
          <FadeInSection delay="0.2s">
            <div className="w-full rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-[#f3f4f6] p-8 sm:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-white group/motto">
              {isAdmin && <EditButton onClick={() => handleOpenModal(content, 'content')} className="top-4 right-4 opacity-0 group-hover/motto:opacity-100" />}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {features.map((feature, idx) => (
                  <FadeInSection key={feature.id} delay={`${idx * 0.1}s`} className="h-full">
                    <DestinationCard feature={feature} isAdmin={isAdmin} onEdit={handleOpenModal} />
                  </FadeInSection>
                ))}
              </div>
              {/* ... (ส่วนแผนที่ คงเดิม) ... */}
            </div>
          </FadeInSection>
        </section>

        {/* ================= CTA (Aurora Background) ================= */}
        <section>
          <FadeInSection>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-800 shadow-[0_15px_50px_rgba(0,0,0,0.3)] w-full p-[2px] group/cta">
              {isAdmin && <EditButton onClick={() => handleOpenModal(content, 'content')} className="top-4 right-4 opacity-0 group-hover/cta:opacity-100" />}
              <div className="relative w-full h-full rounded-[calc(2.5rem-2px)] overflow-hidden bg-[#0a0a0a] z-10 flex flex-col">
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

      {/* ================= Admin Edit Modal ================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto z-10">
              
              <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">
                ✏️ แก้ไขข้อมูล {modalType === 'content' ? 'เนื้อหาหลัก' : 'การ์ดจุดเด่น'}
              </h2>

              <div className="space-y-4">
                {modalType === 'content' ? (
                  <>
                    <h3 className="font-bold text-purple-600 bg-purple-50 p-2 rounded-lg">หมวด Hero Section</h3>
                    <div><label className="block text-sm font-bold mb-1">หัวข้อหลัก</label><input type="text" name="hero_title" value={formData.hero_title || ''} onChange={handleChange} className="w-full p-3 border rounded-xl" /></div>
                    <div><label className="block text-sm font-bold mb-1">ข้อความเน้น (Highlight)</label><input type="text" name="hero_highlight" value={formData.hero_highlight || ''} onChange={handleChange} className="w-full p-3 border rounded-xl" /></div>
                    <div><label className="block text-sm font-bold mb-1">คำอธิบาย</label><textarea name="hero_desc" value={formData.hero_desc || ''} onChange={handleChange} rows="3" className="w-full p-3 border rounded-xl resize-none"></textarea></div>
                    
                    <h3 className="font-bold text-purple-600 bg-purple-50 p-2 rounded-lg mt-6">หมวดสถิติ 1</h3>
                    <div><label className="block text-sm font-bold mb-1">หัวข้อสถิติ 1</label><input type="text" name="stats1_title" value={formData.stats1_title || ''} onChange={handleChange} className="w-full p-3 border rounded-xl" /></div>
                    <div><label className="block text-sm font-bold mb-1">คำอธิบายสถิติ 1</label><textarea name="stats1_desc" value={formData.stats1_desc || ''} onChange={handleChange} rows="2" className="w-full p-3 border rounded-xl resize-none"></textarea></div>

                    <h3 className="font-bold text-purple-600 bg-purple-50 p-2 rounded-lg mt-6">หมวดสถิติ 2</h3>
                    <div><label className="block text-sm font-bold mb-1">หัวข้อสถิติ 2</label><input type="text" name="stats2_title" value={formData.stats2_title || ''} onChange={handleChange} className="w-full p-3 border rounded-xl" /></div>
                    <div><label className="block text-sm font-bold mb-1">คำอธิบายสถิติ 2</label><textarea name="stats2_desc" value={formData.stats2_desc || ''} onChange={handleChange} rows="2" className="w-full p-3 border rounded-xl resize-none"></textarea></div>

                    <h3 className="font-bold text-purple-600 bg-purple-50 p-2 rounded-lg mt-6">หมวด Motto (คติพจน์)</h3>
                    <div><label className="block text-sm font-bold mb-1">Motto (ภาษาไทย)</label><input type="text" name="motto_th" value={formData.motto_th || ''} onChange={handleChange} className="w-full p-3 border rounded-xl" /></div>
                    <div><label className="block text-sm font-bold mb-1">Motto (English)</label><input type="text" name="motto_en" value={formData.motto_en || ''} onChange={handleChange} className="w-full p-3 border rounded-xl" /></div>

                    <h3 className="font-bold text-purple-600 bg-purple-50 p-2 rounded-lg mt-6">หมวด Call to Action (ส่วนล่างสุด)</h3>
                    <div><label className="block text-sm font-bold mb-1">หัวข้อ CTA</label><input type="text" name="cta_title" value={formData.cta_title || ''} onChange={handleChange} className="w-full p-3 border rounded-xl" /></div>
                    <div><label className="block text-sm font-bold mb-1">คำอธิบาย CTA</label><textarea name="cta_desc" value={formData.cta_desc || ''} onChange={handleChange} rows="3" className="w-full p-3 border rounded-xl resize-none"></textarea></div>
                  </>
                ) : (
                  <>
                    {/* ฟอร์มสำหรับการ์ด Feature */}
                    <div><label className="block text-sm font-bold mb-1">พาดหัวใหญ่ (Title)</label><input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full p-3 border rounded-xl" /></div>
                    <div><label className="block text-sm font-bold mb-1">พาดหัวย่อย (Subtitle)</label><input type="text" name="subtitle" value={formData.subtitle || ''} onChange={handleChange} className="w-full p-3 border rounded-xl" /></div>
                    <div><label className="block text-sm font-bold mb-1">รายละเอียด (Description)</label><textarea name="description" value={formData.description || ''} onChange={handleChange} rows="4" className="w-full p-3 border rounded-xl resize-none"></textarea></div>
                    
                    <div className="border p-4 rounded-xl bg-slate-50 mt-4">
                      <label className="block text-sm font-bold mb-2">เปลี่ยนรูปภาพพื้นหลัง</label>
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700" />
                      {isUploading && <p className="text-sm text-purple-600 mt-2">กำลังอัปโหลด...</p>}
                      {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-3 h-32 object-cover rounded-lg border" />}
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100">ยกเลิก</button>
                <button onClick={handleSave} disabled={isSaving || isUploading} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md">
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
      </div>
    );
  }

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen">
      <AuroraBackground />
      <div className="h-[90vh] w-full" />
      <MainContent />
      <WelcomeMask textScale={textScale} textOpacity={textOpacity} overlayOpacity={overlayOpacity} overlayPointer={overlayPointer} />
    </div>
  );
}