import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ==========================================
// 📌 Component: พื้นหลังแสงออโรร่า
// ==========================================
export const AuroraBackground = () => (
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
// 📌 Component: ป้ายแบนเนอร์
// ==========================================
export const SectionBanner = ({ line1, line2, variant = "website" }) => {
  const config = {
    calendar: { bgs: ['bg-[#3b82f6]', 'bg-[#f59e0b]', 'bg-[#10b981]', 'bg-[#8b5cf6]', 'bg-[#ec4899]', 'bg-[#0ea5e9]'], text: 'bg-[#eff6ff] text-[#1e3a8a]' },
    website: { bgs: ['bg-[#a16dd1]', 'bg-[#01aa3a]', 'bg-[#f9703d]', 'bg-[#c5e9e7]', 'bg-[#df3470]', 'bg-[#dced11]'], text: 'bg-[#fdf4ff] text-[#4a044e]' },
    exam: { bgs: ['bg-rose-500', 'bg-teal-500', 'bg-indigo-500', 'bg-amber-400', 'bg-fuchsia-500', 'bg-sky-400'], text: 'bg-rose-50 text-rose-950' }
  };
  const theme = config[variant] || config.website;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} whileHover={{ scale: 1.01 }} transition={{ duration: 0.4 }} className="w-full mx-auto mb-10 flex flex-col gap-2 md:gap-3 cursor-default">
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
// 📌 ฐานข้อมูลบุคลากร 
// ==========================================
// 1. อาจารย์ประจำสาขาวิชา
const FACULTY_MEMBERS = [
  {
    nameTH: 'รศ.ดร. สุรพันธ์ ยิ้มมั่น',
    nameEN: 'ASSOC.PROF. DR. SURAPUN YIMMAN',
    position: 'อาจารย์ประจำสาขาวิชา',
    edu: 'วศ.ด. (วิศวกรรมไฟฟ้า) สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง',
    email: 'surapun.y@sci.kmutnb.ac.th',
    imgUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop' 
  },
  {
    nameTH: 'ผศ. พยุง เดชอยู่',
    nameEN: 'ASST.PROF. PHAYUNG DESYOO',
    position: 'อาจารย์ประจำสาขาวิชา',
    edu: 'วศ.ม. (วิศวกรรมไฟฟ้า) สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง',
    email: 'phayung.d@sci.kmutnb.ac.th',
    imgUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop' 
  },
  {
    nameTH: 'ผศ. สุดารัตน์ สุนทโรภาส',
    nameEN: 'ASST.PROF. SUDARATH SUNTAROPAS',
    position: 'อาจารย์ประจำสาขาวิชา',
    edu: 'วท.ม. (ฟิสิกส์) มหาวิทยาลัยศิลปากร',
    email: 'sudarath.s@sci.kmutnb.ac.th',
    imgUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop' 
  },
  {
    nameTH: 'รศ.ดร. สุเมธ อ่ำชิต',
    nameEN: 'ASSOC.PROF. DR. SUMET UMCHID',
    position: 'อาจารย์ประจำสาขาวิชา',
    edu: 'Ph.D. (Biomedical Engineering) Drexel University, ประเทศสหรัฐอเมริกา',
    email: 'sumet.u@sci.kmutnb.ac.th',
    imgUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop' 
  },
  {
    nameTH: 'ผศ.ดร. รสจรินทร์ รัตนสุนทร',
    nameEN: 'ASST.PROF. RODJARIN RATTANASOONTORN',
    position: 'อาจารย์ประจำสาขาวิชา',
    edu: 'วศ.ด. (วิศวกรรมไฟฟ้า) สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง',
    email: 'rodjarin.r@sci.kmutnb.ac.th',
    imgUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop' 
  },
  {
    nameTH: 'ผศ.ดร. ธิดารัตน์ หวังคำ',
    nameEN: 'ASST.PROF. DR. THIDARAT WANGKHAM',
    position: 'อาจารย์ประจำสาขาวิชา',
    edu: 'ปร.ด.(ฟิสิกส์) มหาวิทยาลัยมหิดล',
    email: 'thidarat.w@sci.kmutnb.ac.th',
    imgUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop' 
  },
  {
    nameTH: 'อ.ดร. นนท์ปวิธ ภูมิมณี',
    nameEN: 'DR. NONPAWITH PHOOMMANEE',
    position: 'อาจารย์ประจำสาขาวิชา',
    edu: 'Ph.D. (Medical Physics and Bioengineering) University College London สหราชอาณาจักร',
    email: 'nonpawith.p@sci.kmutnb.ac.th',
    imgUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' 
  }
];

// 2. ฝ่ายสนับสนุน
const SUPPORT_STAFF = [
  {
    nameTH: 'นายชาญชัย พรหมลิขิต',
    nameEN: 'MR. CHANCHAI PHROMLIKHIT',
    position: 'บุคลากรฝ่ายสนับสนุน',
    edu: '', // ปล่อยว่างไว้หากยังไม่มีข้อมูล
    email: '',
    imgUrl: '' // ปล่อยว่างเพื่อใช้ไอคอนแทน
  },
  {
    nameTH: 'นายประชารัฐ สัตถาผล',
    nameEN: 'MR. PRACHARAT SATTHAPHON',
    position: 'บุคลากรฝ่ายสนับสนุน',
    edu: '', 
    email: '',
    imgUrl: ''
  }
];

export default function Personnel() {
  
  useEffect(() => {
    // เลื่อนหน้าจอขึ้นบนสุดเมื่อเข้ามาหน้านี้
    window.scrollTo(0, 0);
  }, []);

  // ตัวแปรสไตล์สำหรับการ์ดบุคลากรแต่ละคน
  const personCardGlass = "rounded-[2rem] bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(147,51,234,0.08)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden";
  
  // ตัวแปรสไตล์สำหรับการ์ดใหญ่ (Section Wrapper)
  const sectionWrapperGlass = "rounded-[3rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-sm p-8 md:p-12 mb-16";

  // Component สำหรับเรนเดอร์การ์ดบุคลากรแต่ละคน
  const renderPersonCard = (person, idx) => (
    <FadeInSection key={idx} delay={`${idx * 0.1}s`} className="h-full">
      <div className={`group flex flex-col overflow-hidden h-full ${personCardGlass}`}>
        
        {/* รูปภาพ หรือ ไอคอน */}
        <div className="relative w-full h-72 md:h-[340px] bg-slate-100 overflow-hidden border-b border-slate-100">
          {person.imgUrl ? (
            <img 
              src={person.imgUrl} 
              alt={person.nameEN} 
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-slate-200">
              <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
            </div>
          )}
          <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-white/90 to-transparent"></div>
        </div>
        
        {/* ข้อมูลบุคลากร */}
        <div className="flex flex-col flex-1 p-6 md:p-8 bg-white/50">
          <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{person.nameTH}</h3>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1 mb-4">{person.nameEN}</p>
          <p className="text-[13px] font-bold text-purple-700 mb-4 bg-purple-50 inline-block self-start px-3 py-1 rounded-full">{person.position}</p>
          
          {person.email && (
            <div className="flex flex-col gap-3 mb-6">
              <a href={`mailto:${person.email}`} className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                </div>
                {person.email}
              </a>
            </div>
          )}

          {person.edu && (
            <p className="text-[13px] font-medium text-slate-600 leading-relaxed mb-6 flex-1">
              <span className="font-bold text-slate-800 block mb-1">สำเร็จการศึกษาจาก:</span> 
              {person.edu}
            </p>
          )}

          <div className="flex gap-2 mt-auto w-full pt-4">
            <a href="#" className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-2.5 px-3 rounded-xl text-center font-bold text-[12px] shadow-sm transition-colors flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              ผลงานวิชาการ
            </a>
            <a href="#" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-3 rounded-xl text-center font-bold text-[12px] shadow-sm transition-colors flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              Scholar
            </a>
          </div>
        </div>
      </div>
    </FadeInSection>
  );

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <section>
          
          {/* ---------------- Header Section (ข้อความไล่สีเหมือนหน้าสาขาวิชา) ---------------- */}
          <FadeInSection delay="0.1s">
            <div className="text-center max-w-4xl mx-auto pt-2 pb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
                บุคลากรของสาขาวิชา
              </h1>
              <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
                สาขาวิชาวิศวกรรมชีวการแพทย์ <br/>
                ภาควิชาฟิสิกส์อุตสาหกรรมและอุปกรณ์การแพทย์ คณะวิทยาศาสตร์ประยุกต์ <br className="hidden md:block"/>
                มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
              </p>
            </div>
          </FadeInSection>
          
          {/* ---------------- การ์ดใหญ่ที่ 1: อาจารย์ประจำสาขาวิชา ---------------- */}
          <FadeInSection delay="0.2s">
            <div className={sectionWrapperGlass}>
              
              {/* 📌 แทรก Section Banner เป็นหัวข้อ */}
              <div className="mb-10">
                <SectionBanner line1="อาจารย์ประจำ" line2="สาขาวิชา" variant="website" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {FACULTY_MEMBERS.map((person, idx) => renderPersonCard(person, idx))}
              </div>
            </div>
          </FadeInSection>

          {/* ---------------- การ์ดใหญ่ที่ 2: ฝ่ายสนับสนุน ---------------- */}
          <FadeInSection delay="0.3s">
            <div className={sectionWrapperGlass}>
              
              {/* 📌 แทรก Section Banner เป็นหัวข้อ */}
              <div className="mb-10">
                <SectionBanner line1="บุคลากร" line2="ฝ่ายสนับสนุน" variant="calendar" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {SUPPORT_STAFF.map((person, idx) => renderPersonCard(person, idx))}
              </div>
            </div>
          </FadeInSection>

        </section>
      </div>
    </div>
  );
}