import React, { useEffect, useState, useRef } from 'react';

// 📌 นำเข้ารูปโลโก้โซเชียลมีเดีย
import imiLogo from '../assets/IMI_Logo.png';
import bmeFamilyLogo from '../assets/bme_family.png';
import techXLogo from '../assets/TECH X CLUB.png';

// 📌 นำเข้ารูปภาพบริการจากโฟลเดอร์ assets/Website (.png)
import imgREG from '../assets/Website/REG.png';
import imgACD from '../assets/Website/ACD.png';
import imgKMUTNB from '../assets/Website/KMUTNB.png';
import imgApplied from '../assets/Website/Applied.png';
import imgIMIAffair from '../assets/Website/IMI_Affair.png';
import imgICITService from '../assets/Website/ICIT_Service.png';
import imgAccount from '../assets/Website/Account.png';
import imgSoftware from '../assets/Website/Software.png';
import imgDigitaltest from '../assets/Website/Digitaltest.png';
import imgLibrary from '../assets/Website/Library.png';
import imgKRoom from '../assets/Website/K_Room.png';
import imgSmartRoom from '../assets/Website/Smart_Room.png';
import imgMOOC from '../assets/Website/MOOC.png';
import imgPhyLab from '../assets/Website/Phy_Lab.png';
import imgCEM from '../assets/Website/CEM.png';
import imgMap from '../assets/Website/Map.png';
import imgKMUTNB2 from '../assets/Website/KMUTNB2.png'; 

// ==========================================
// 📌 ข้อมูลกลุ่มบริการนักศึกษา
// ==========================================
const SERVICE_GROUPS = [
  {
    title: 'ส่วนกลางและระบบการศึกษา',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>,
    color: 'from-purple-500 to-indigo-600',
    glowColor: 'bg-purple-500/25',
    items: [
      { name: 'เว็บไซต์มหาวิทยาลัย', url: 'https://www.kmutnb.ac.th/', short: 'KMUTNB', img: imgKMUTNB, tags: ['มอ', 'มจพ', 'kmutnb', 'main'] },
      { name: 'เว็บไซต์คณะวิทยาศาสตร์ประยุกต์', url: 'http://www.sci.kmutnb.ac.th/', short: 'SCI', img: imgApplied, tags: ['คณะ', 'วิทย์', 'sci'] },
      { name: 'เว็บไซต์กองบริการการศึกษา', url: 'https://acdserv.kmutnb.ac.th/home', short: 'ACD', img: imgACD, tags: ['กองบริการ', 'acd', 'ปฏิทิน'] },
      { name: 'เว็บไซต์บริการการศึกษา (REG)', url: 'https://reg2.kmutnb.ac.th/registrar/', short: 'REG', img: imgREG, tags: ['ลงทะเบียน', 'เกรด', 'reg', 'ทะเบียน'] },
      { name: 'เว็บไซต์บริการเรียนออนไลน์', url: 'https://kmutnbmooc.com/', short: 'MOOC', img: imgMOOC, tags: ['เรียนออนไลน์', 'mooc', 'คอร์ส'] },
      { name: 'บริการสอบสมรรถนะดิจิทัล', url: 'https://dl.kmutnb.ac.th/', short: 'DL', img: imgDigitaltest, tags: ['สอบ', 'ดิจิทัล', 'dl', 'คอม'] },
      { name: 'สอบวัดระดับภาษาอังกฤษ', url: 'https://cem.kmutnb.ac.th/', short: 'CEM', img: imgCEM, tags: ['สอบ', 'อังกฤษ', 'cem', 'eng'] },
      { name: 'กองทุนกู้ยืมเพื่อการศึกษา (กยศ.)', url: 'https://sa.op.kmutnb.ac.th/studentloan/', short: 'กยศ', img: imgKMUTNB2, tags: ['กยศ', 'กู้', 'ทุน', 'loan'] }
    ]
  },
  {
    title: 'เทคโนโลยีและซอฟต์แวร์',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>,
    color: 'from-blue-500 to-cyan-500',
    glowColor: 'bg-cyan-500/25',
    items: [
      { name: 'เว็บไซต์บริการบัญชี', url: 'https://account.kmutnb.ac.th/web/', short: 'ACC', img: imgAccount, tags: ['บัญชี', 'account', 'รหัส', 'เปลี่ยนรหัส'] },
      { name: 'เว็บไซต์ซอฟต์แวร์สำหรับการเรียน', url: 'https://software.kmutnb.ac.th/', short: 'SOFT', img: imgSoftware, tags: ['ซอฟต์แวร์', 'โปรแกรม', 'software', 'โหลด'] },
      { name: 'เว็บไซต์ช่องทางบริการ ICIT', url: 'https://icit.kmutnb.ac.th/services-all/?category=student&subcategory=all', short: 'ICIT', img: imgICITService, tags: ['ไอที', 'icit', 'เน็ต', 'แจ้งซ่อม'] }
    ]
  },
  {
    title: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>,
    color: 'from-emerald-400 to-teal-500',
    glowColor: 'bg-emerald-500/25',
    items: [
      { name: 'เว็บไซต์บริการห้อง K-Room', url: 'https://k-room.icit.kmutnb.ac.th/web/room/list-room', short: 'K-RM', img: imgKRoom, tags: ['จองห้อง', 'k-room', 'ติว'] },
      { name: 'เว็บไซต์บริการห้อง Smart Room', url: 'https://smartroom.lib.kmutnb.ac.th/', short: 'S-RM', img: imgSmartRoom, tags: ['จองห้อง', 'smart', 'ประชุม'] },
      { name: 'เว็บไซต์บริการห้องสมุดกลาง', url: 'https://library.kmutnb.ac.th/', short: 'LIB', img: imgLibrary, tags: ['ห้องสมุด', 'หอสมุด', 'lib', 'หนังสือ'] },
      { name: 'เว็บไซต์ห้องปฏิบัติการฟิสิกส์', url: 'https://sites.google.com/sci.kmutnb.ac.th/physclass/home', short: 'PHYS', img: imgPhyLab, tags: ['แล็บ', 'lab', 'ฟิสิกส์', 'phys'] },
      { name: 'กิจกรรมนักศึกษาภาควิชา IMI', url: 'https://sites.google.com/sci.kmutnb.ac.th/imi-student-affairs/', short: 'IMI', img: imgIMIAffair, tags: ['กิจกรรม', 'act', 'ชมรม'] },
      { name: 'เว็บไซต์บริการแผนที่มหาวิทยาลัย', url: 'https://green.kmutnb.ac.th/kmutnb-map/', short: 'MAP', img: imgMap, tags: ['แผนที่', 'map', 'ตึก', 'อาคาร'] }
    ]
  }
];

// ==========================================
// 📌 ข้อมูลโซเชียลมีเดียที่เกี่ยวข้อง (Facebook & IG)
// ==========================================
const socialLinks = [
  { name: "กลุ่มประชาสัมพันธ์ภาควิชา IMI", url: "https://www.facebook.com/groups/548676885237879", desc: "ข่าวสารส่วนกลางจากภาควิชาฟิสิกส์อุตสาหกรรมฯ", logo: imiLogo },
  { name: "BME Family", url: "https://www.facebook.com/share/g/1W6UBZsTxz/", desc: "กลุ่มหลักสำหรับนักศึกษา ศิษย์เก่า และคณาจารย์ BME", logo: bmeFamilyLogo },
  { name: "BME Tech X", url: "https://www.facebook.com/share/g/14v7cSeNjuB/", desc: "รวมข่าวสารการแข่งขัน สัมมนา และเทคโนโลยี", logo: techXLogo }
];

const facebookPages = [
  { name: "มหาวิทยาลัย (KMUTNB)", url: "https://www.facebook.com/KMUTNBofficial" },
  { name: "คณะวิทยาศาสตร์ประยุกต์", url: "https://www.facebook.com/PR.AppSci.KMUTNB" },
  { name: "ภาควิชา IMI", url: "https://www.facebook.com/profile.php?id=61576770303605" },
  { name: "สาขาวิชา BME", url: "https://www.facebook.com/bme.kmutnb" },
  { name: "องค์การนักศึกษา มจพ.", url: "https://www.facebook.com/SO.KMUTNB" },
  { name: "สภานักศึกษา มจพ.", url: "https://www.facebook.com/sc.kmutnb" },
  { name: "กองกิจการนักศึกษา มจพ.", url: "https://www.facebook.com/KMUTNBstudentaffairs" },
  { name: "กลุ่มงานกิจกรรมนักศึกษา มจพ.", url: "https://www.facebook.com/KMUTNBstuact" },
  { name: "สโมสรนักศึกษาคณะวิทยาศาสตร์ประยุกต์", url: "https://www.facebook.com/kmutnb.sciclub" }
];

const instagramPages = [
  { name: "คณะวิทยาศาสตร์ประยุกต์", url: "https://www.instagram.com/prsciadmin/" },
  { name: "ภาควิชา IMI", url: "https://www.instagram.com/imi.kmutnb/" },
  { name: "สาขาวิชา BME", url: "https://www.instagram.com/bme.kmutnb/" },
  { name: "องค์การนักศึกษา มจพ.", url: "https://www.instagram.com/so.kmutnb/" },
  { name: "สภานักศึกษา มจพ.", url: "https://www.instagram.com/sc.kmutnb/" },
  { name: "กลุ่มงานกิจกรรมนักศึกษา", url: "https://www.instagram.com/kmutnbstuact/" },
  { name: "สโมสรนักศึกษาคณะวิทย์ฯ", url: "https://www.instagram.com/smoapsci.kmutnb/" }
];

export default function StudentServices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (scrollRef.current) observer.observe(scrollRef.current);
    return () => observer.disconnect();
  }, []);

  const isMatch = (item, searchLower) => {
    if (item.tags) {
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.short.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    // สำหรับ FB/IG pages ที่ไม่มี tags
    return item.name.toLowerCase().includes(searchLower);
  };

  return (
    <div className="bg-[#f4f6fa] min-h-screen pb-24 font-sans text-slate-800">
      
      {/* 📌 Custom CSS Animations */}
      <style>
        {`
          @keyframes fadeSlideUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 15px rgba(168,85,247,0.4); }
            50% { box-shadow: 0 0 30px rgba(244,63,94,0.6); border-color: rgba(244,63,94,0.5); }
          }
          @keyframes shineEffect {
            100% { left: 200%; }
          }
          .animate-card {
            animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
          .animate-glow {
            animation: glowPulse 3s infinite;
          }
          .hover-shine:hover::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent);
            transform: skewX(-20deg);
            animation: shineEffect 1s forwards;
            pointer-events: none;
            z-index: 10;
          }
        `}
      </style>

      {/* ---------------- Header Section ---------------- */}
      <div className="bg-gradient-to-b from-[#090211] via-[#1b0834] to-[#0f041c] text-white pt-24 pb-32 px-6 text-center relative border-b-4 border-[#581c87] overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] z-0 opacity-50"></div>
        
        <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-[#be185d]/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] bg-[#7e22ce]/25 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '5s' }}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-6 py-2 rounded-full mb-8 border border-[#a855f7]/40 animate-glow">
            <span className="w-2 h-2 rounded-full bg-[#f43f5e] animate-ping"></span>
            <span className="text-xs font-bold tracking-widest text-[#e9d5ff] uppercase">One-Stop Service</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-2xl">
            <span className="text-white">ศูนย์รวมเว็บไซต์</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#f43f5e] to-[#c084fc] bg-[length:200%_auto] animate-[pulse_4s_ease-in-out_infinite]">และบริการนักศึกษา</span>
          </h1>
          <p className="text-[#d8b4fe] font-light text-base md:text-lg leading-relaxed max-w-2xl mx-auto opacity-90 mb-12">
            รวบรวมลิงก์บริการและระบบสารสนเทศทั้งหมดของมหาวิทยาลัย คณะ และสาขาวิชา เพื่ออำนวยความสะดวกแก่นักศึกษา BME แบบครบจบในหน้าเดียว
          </p>

          <div className="max-w-2xl mx-auto relative group z-20">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-gray-400 group-focus-within:text-[#f43f5e] transition-colors duration-300 transform group-focus-within:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input 
              type="text" 
              placeholder="ค้นหาบริการ หรือ เพจที่ต้องการ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-12 py-4.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f43f5e] focus:bg-white/20 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:bg-white/15 text-lg"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-300 hover:text-[#f43f5e] transform hover:scale-110 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* แถบประกาศสำคัญ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-30 transform hover:scale-[1.01] transition-transform duration-300">
        <div className="bg-gradient-to-r from-[#581c87] via-[#9d174d] to-[#581c87] bg-[length:200%_200%] animate-[pulse_5s_ease-in-out_infinite] rounded-2xl shadow-2xl p-1 flex items-center justify-between">
          <div className="bg-[#11051f]/90 w-full rounded-xl px-5 py-3.5 flex items-center gap-4 text-white overflow-hidden backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-2 flex-shrink-0 bg-gradient-to-r from-red-600 to-pink-600 px-4 py-1.5 rounded-full border border-red-400/50 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
              <svg className="w-4 h-4 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span className="text-xs font-bold tracking-widest uppercase">ประกาศด่วน</span>
            </div>
            <marquee className="text-sm font-medium tracking-wide flex-grow text-[#e9d5ff]">
              แจ้งกำหนดการประเมินการสอนและลงทะเบียนเรียน ภาคเรียนที่ 2/2569 สามารถตรวจสอบตารางได้ที่เมนู "เว็บไซต์บริการการศึกษา (REG)" | 
              ขอเชิญชวนนักศึกษาเข้าร่วมกิจกรรม BME Tech X Seminar ในวันที่ 15 พ.ย. นี้
            </marquee>
          </div>
        </div>
      </div>

      {/* ---------------- Main Content - การ์ดรูประบบ ---------------- */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 mt-16 relative z-20">
        {SERVICE_GROUPS.map((group, groupIdx) => {
          const filteredItems = group.items.filter(item => isMatch(item, searchTerm.toLowerCase()));
          if (filteredItems.length === 0) return null;
          return (
            <div key={groupIdx} className="mb-20">
              <div className="flex items-center gap-4 mb-10 animate-card" style={{ animationDelay: `${groupIdx * 0.1}s` }}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${group.color} flex-shrink-0`}>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">{group.icon}</svg>
                </div>
                <h2 className="text-[22px] md:text-[24px] font-extrabold text-slate-800 tracking-tight whitespace-nowrap">{group.title}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent ml-2 md:ml-4"></div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-10">
                {filteredItems.map((item, itemIdx) => (
                  <a 
                    key={item.name}
                    href={item.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="animate-card block relative group transition-all duration-500 transform hover:-translate-y-3 w-[160px] sm:w-[180px] md:w-[210px] flex-shrink-0"
                    style={{ animationDelay: `${(groupIdx * 0.1) + (itemIdx * 0.05)}s` }}
                  >
                    <div className={`absolute inset-0 ${group.glowColor} rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
                    <div className="relative w-full h-auto z-10 transition-all duration-500 group-hover:drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]">
                      <img 
                        src={item.img} 
                        alt={item.short} 
                        className="w-full h-auto object-contain block mix-blend-multiply" 
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------- เครือข่ายโซเชียลมีเดียหลัก ---------------- */}
      <div ref={scrollRef} className={`max-w-[1300px] mx-auto px-4 sm:px-6 mt-8 mb-16 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-24 scale-95'}`}>
        
        {/* กลุ่มหลัก BME */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-14 border border-slate-100 shadow-[0_20px_50px_rgba(88,28,135,0.04)] relative overflow-hidden group mb-12">
          <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-[0.05] group-hover:rotate-12 transition-all duration-1000 pointer-events-none">
            <svg className="w-[300px] h-[300px] text-purple-800" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-500 mb-4 inline-block">ช่องทางโซเชียลมีเดียหลัก</h2>
              <p className="text-slate-500 font-light text-base md:text-lg max-w-2xl mx-auto">
                ติดตามข่าวสาร กิจกรรม และพูดคุยแลกเปลี่ยนความรู้ภายในเครือข่าย BME
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {socialLinks.map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-gradient-to-b from-purple-50/50 to-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-purple-500/10 border border-purple-100/50 hover:border-purple-300/50 transition-all duration-500 transform hover:-translate-y-2 flex flex-col items-center text-center group/card"
                >
                  <div className="w-24 h-24 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-6 group-hover/card:scale-110 transition-transform duration-500 p-3 shadow-md group-hover/card:shadow-lg group-hover/card:border-purple-200">
                    <img src={social.logo} alt={social.name} className="w-full h-full object-contain filter drop-shadow-sm group-hover/card:drop-shadow-md transition-all mix-blend-multiply" />
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-[17px] mb-2 group-hover/card:text-purple-700 transition-colors">{social.name}</h3>
                  <p className="text-[13px] text-slate-500 font-light leading-relaxed mb-6">{social.desc}</p>
                  
                  <div className="mt-auto px-6 py-2.5 bg-slate-50 group-hover/card:bg-gradient-to-r group-hover/card:from-purple-600 group-hover/card:to-pink-500 rounded-full border border-slate-200 group-hover/card:border-transparent flex items-center text-[13px] font-bold text-slate-500 group-hover/card:text-white transition-all duration-300">
                    เข้าสู่กลุ่ม <svg className="w-4 h-4 ml-1.5 opacity-0 -translate-x-3 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- 📌 รวมเพจ Facebook และ IG (ดีไซน์หรูหราอลังการ ไร้การตัดคำ) ---------------- */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-8 md:p-14 border border-white shadow-[0_20px_60px_rgba(0,0,0,0.02)] relative overflow-hidden">
          {/* Decorative background gradients */}
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-gradient-to-bl from-pink-200/40 to-transparent rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-gradient-to-tr from-blue-200/40 to-transparent rounded-full blur-[80px] pointer-events-none"></div>

          <div className="text-center mb-14 relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 tracking-tight">เพจหน่วยงานและกิจกรรม</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-5"></div>
            <p className="text-slate-500 font-medium text-[15px] md:text-lg">ติดตามข้อมูลข่าวสารจากส่วนกลางและสโมสรนักศึกษา</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 relative z-10">
            
            {/* 🟦 ฝั่ง Facebook */}
            {facebookPages.filter(p => isMatch(p, searchTerm.toLowerCase())).length > 0 && (
              <div className="bg-white/50 border border-blue-100/60 rounded-[2.5rem] p-6 md:p-8 flex flex-col h-full shadow-[0_8px_30px_rgba(24,119,242,0.03)] backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-[#1877F2] shadow-lg shadow-blue-500/20 flex items-center justify-center text-white">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-[24px] tracking-tight">Facebook Pages</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 content-start">
                  {facebookPages.filter(p => isMatch(p, searchTerm.toLowerCase())).map((page, idx) => (
                    <a key={idx} href={page.url} target="_blank" rel="noreferrer" className="group flex items-center p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-300 hover:shadow-[0_15px_35px_rgba(24,119,242,0.12)] transition-all duration-500 transform hover:-translate-y-1.5 overflow-hidden hover-shine relative h-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      
                      <div className="relative z-10 flex-shrink-0 w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-[#1877F2] mr-4 shadow-sm border border-slate-100 group-hover:bg-[#1877F2] group-hover:text-white transition-colors duration-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </div>
                      
                      <div className="relative z-10 flex-1 pr-2">
                        {/* ปลดล็อก line-clamp แสดงข้อความเต็ม 100% */}
                        <span className="font-extrabold text-slate-700 text-[14.5px] leading-snug group-hover:text-[#1877F2] transition-colors whitespace-normal block">
                          {page.name}
                        </span>
                      </div>

                      <div className="relative z-10 flex-shrink-0 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-blue-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 📸 ฝั่ง Instagram */}
            {instagramPages.filter(p => isMatch(p, searchTerm.toLowerCase())).length > 0 && (
              <div className="bg-white/50 border border-pink-100/60 rounded-[2.5rem] p-6 md:p-8 flex flex-col h-full shadow-[0_8px_30px_rgba(236,72,153,0.03)] backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 shadow-lg shadow-pink-500/20 flex items-center justify-center text-white">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-[24px] tracking-tight">Instagram</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 content-start">
                  {instagramPages.filter(p => isMatch(p, searchTerm.toLowerCase())).map((page, idx) => (
                    <a key={idx} href={page.url} target="_blank" rel="noreferrer" className="group flex items-center p-4 bg-white rounded-2xl border border-slate-100 hover:border-pink-300 hover:shadow-[0_15px_35px_rgba(236,72,153,0.12)] transition-all duration-500 transform hover:-translate-y-1.5 overflow-hidden hover-shine relative h-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-50/0 to-pink-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      
                      <div className="relative z-10 flex-shrink-0 w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-pink-500 mr-4 shadow-sm border border-slate-100 group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-pink-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-500 group-hover:border-transparent">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      </div>
                      
                      <div className="relative z-10 flex-1 pr-2">
                        {/* ปลดล็อก line-clamp แสดงข้อความเต็ม 100% */}
                        <span className="font-extrabold text-slate-700 text-[14.5px] leading-snug group-hover:text-pink-600 transition-colors whitespace-normal block">
                          {page.name}
                        </span>
                      </div>

                      <div className="relative z-10 flex-shrink-0 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-pink-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>

    </div>
  );
}