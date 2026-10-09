import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AuroraBackground, SectionBanner } from '../../components/ThemeElements';

// 📌 นำเข้ารูปโลโก้เพื่อทำเป็นโลโก้บนการ์ด
import imgKmutnbSeal from '../../assets/Symbol/KMUTNB_Logo.png';
import imgAppliedScience from '../../assets/Symbol/AppliedScience_Logo.png';

// ==========================================
// 📌 ข้อมูลบทเพลงทั้งหมด (แยกประเภท มหาวิทยาลัย / คณะ)
// ==========================================
const SONGS = [
  // --- กลุ่มเพลงมหาวิทยาลัย ---
  {
    title: 'เพลงประจำสถาบันเทคโนโลยีพระจอมเกล้า',
    category: 'university',
    icon: imgKmutnbSeal,
    lyrics: `สถาบันเทคโนโลยีพระจอมเกล้าฯ
ถิ่นของเราเลิศหรูพริ้งเพรา มิเคยอับเฉา
ถิ่นเราวิไล เด่นเหนือใคร แม้นามนั้นไซร้ พระราชทาน
เป็นมิ่งขวัญ ให้เราสำคัญ สถาบันเด่นดี
เราสายเลือดเดียวกัน เหมือนน้องพี่กันในทุกที่
เราภูมิใจแห่งเลือดเทคโนโลยี ที่เราน้องพี่พากเพียร
มั่นหมายเรียน พากเพียรทั่วหน้าหมายพาก้าวไป
ไม่ท้อใจอนาคตไกล ชีวิตสดใส ภูมิใจชื่นชม
สถาบันเทคโนโลยีพระจอมเกล้าฯ
สถาบันเลิศล้ำของเรานั้นเรืองรุ่งเนาว์ เด่นในสังคม
สถาบันที่ชนชื่นชมนิยมทั่วกัน
ชื่อขจรเกียรติก้องสำคัญ มั่นคงศักดิ์ศรี
เราสาบานไว้มั่น รักประเทศนั้นเท่าชีวี
ดวงวิญญาณแห่งเราเทคโนโลยี จงรักภักดีราชันย์
ศาสน์สำคัญ พุทธธรรมจำมั่นไว้ในดวงใจ
ศักดิ์ศรีนามแห่งดวงฤทัย สมนามเกริกไกร พระจอมเกล้าเอย`
  },
  {
    title: 'เพลงลูกพระจอม',
    category: 'university',
    icon: imgKmutnbSeal,
    lyrics: `นามพระจอมเกริกฟ้า
มิ่งมหามงกุฎดังตะวันส่องแสงตระการ
แดนสยามรุ่งเรืองไพศาล
ด้วยพระปรีชาญาณเอกองค์
จอมเกล้าจอมกษัตริย์ไทย
หยาดเย็นน้ำพระทัยดัง
หยาดฝนจากฟ้าโปรยลง
ทรงอุทิศพระองค์สร้างไทยให้ยืนยง
ข้าขอน้อมบังคมบัวบาท

* พระบิดาแห่งวิทยาศาสตร์ของไทย
ธ บำรุงศาสตร์ศิลป์ค้ำจุนด้วยแสงธรรม
พระเกียรติลือนาม สยามสง่าล้ำ
จักจดจำ ไม่รู้เลือน

** ลูกพระจอมฯ พร้อมใจถวายสัตย์
ปฏิญาณ ด้วยมนัส
ธำรงแสงแห่งความดี
ลูกพระจอมฯ เทิดเกียรติภูมิศักดิ์ศรี
สรรสร้างด้วยมือเรานี้
ให้ไทยก้าวไกลทวี เลือดเนื้อเรานี้
ลูกพระจอมฯ
(ซ้ำ * / ** / **)`
  },
  {
    title: 'เพลงเทคไทย-เยอรมัน สังสรรค์',
    category: 'university',
    icon: imgKmutnbSeal,
    lyrics: `(*) ผองศิษย์เทคนิค รื่นระริกสราญ
ยิ้มเบิกบาน หวานอารมณ์
พบแต่มวลมิตร ชื่นชีวิตน่าชม
ชื่นชีวิตน่าชม ล้วนรื่นรมย์
ล้วนรื่นรมย์ สมอุรา
ไทยเยอรมันชื่อนี้ พร้อมไมตรีเลิศดีหนักหนา
เพราะศรัทธา รักค่าสัมพันธ์
พวกเราต่างไว้ชื่อลือชา แหล่งศึกษาร่วมกัน
ทุกเมื่อวัน ฝันเฟื่องไกล

( ซ้ำ * )

(**) ไทยเยอรมันชื่อหอม เหมือนพะยอมไม่ว่าทางไหน
หอมจิตใจ ปองใฝ่วิชา
สถาบันเทคนิคเรานี้ ชื่อเป็นศรีศรัทธา
มะสิมา ไว้ชื่อเรา

( ซ้ำ * และ ** )`
  },
  {
    title: 'เพลงแสดดำ',
    category: 'university',
    icon: imgKmutnbSeal,
    lyrics: `* แสดดำเรืองรองผ่องสง่า
ชาวประชาร่วมรักสมัครสมาน
เด่นและหรูในหมู่วิทยาการ
ถิ่นตระการนามกระเดื่องเลื่องลือไกล
แสดเรารักเราชอบไม่มีเหมือน
ดำประเทืองช่วยกระเตื้องงามวิไล
สะบัดพริ้วริ้วระรื่นแสนชื่นใจ
รักกันไว้เราก็เลือดสีสดดำ
(ซ้ำ *)`
  },
  {
    title: 'เพลงบางซ่อน',
    category: 'university',
    icon: imgKmutnbSeal,
    lyrics: `บางซ่อนบางนี้ไซร้ มิได้ซ่อนบางพราง
เพราะนามบาง ยินทุกทางทั่วไป
เทคนิคไทยเยอรมัน นี่นั่นบันลือไกล
เร้นปานใด ไยเหมือนนามบางซ่อน
อาศัยถิ่นนี้ อันสมค่าขจร
มาขอวอน บางซ่อนมีวิชา
บางซ่อนบางสอนวิทย์ สมจิตดังปองมา
สมวิญญาณ์ มีวิชาทางช่าง
บางซ่อนบางนี้ไซร้ มิได้ซ่อนบางพราง
เพราะนามบาง ยินทุกทางทั่วไป
บางซ่อนบางนี้นั้น ล้วนมั่นความภูมิใจ
วิชาใด เรารับไปเสริมสร้าง
เรานี้นี่หรือ มีฝีมือนามสมชื่อตามบาง
เราสมบาง สมช่างไทยเยอรมัน
บางซ่อนบางสอนรัก รักปักทรวงนิรันดร์
ทุกชีวัน รวมสัมพันธ์บางซ่อน`
  },
  
  // --- กลุ่มเพลงคณะ ---
  {
    title: 'เพลงมาร์ชคณะวิทยาศาสตร์ประยุกต์',
    category: 'faculty',
    icon: imgAppliedScience,
    lyrics: `เราคือคณะวิทยาศาสตร์ประยุกต์
มุ่งเชิงรุก เทคโนโลยีทันสมัย
สร้างสรรค์ส่งเสริมพัฒนาก้าวไกล
เพื่อประเทศได้เจริญรุ่งเรือง
อะตอม คือสัญลักษณ์รวมศรัทธา
ก้าวล้ำนำหน้าเป็นสื่อนำพาชาติฟูเฟื่อง
มาอยู่รวมกันด้วยความผูกพันสีเหลือง
ส่องแสงประเทือง ร้องดวงใจให้เราฉลาด
สถาบันเทคโนโลยีพระจอมเกล้า
พระจอมเหนือ มีคณะเราเปรื่องปราชญ์
ค้นคว้า ทดลอง วิจัย วิทยาศาสตร์
พัฒนาชาติก้าวล้ำนำไทย
เราคือพลังสร้างสรรค์ที่แข็งแกร่ง
ต้นประดู่แดง สื่อนำแสงสีสดใส
* วิทยาศาสตร์ประยุกต์อันกว้างไกล
ร้อยดวงใจทันสมัยนำไทยเจริญ
(ซ้ำ *)`
  },
  {
    title: 'เพลงวิทยารวมใจ',
    category: 'faculty',
    icon: imgAppliedScience,
    lyrics: `ลูกพระจอมเกล้าไม่มีเรา มีเขาหรือใคร
ใต้ร่มไม้สัญลักษณ์คือ “ประดู่แดง”
ดั่ง “อะตอม” เป็นสื่อนำความร้อนแรง
สู่ลูกพระจอมเกล้าแห่งสถาบัน
โลกประยุกต์ ศาสตร์แสง แห่งวิทยา
ร่วมพัฒนา ร่วมแรง ร่วมใจผูกพัน
สัจธรรม คงอยู่ประจำ นิรันดร์
จุดความฝันให้เรา ร่วมประสานใจ
(ญ) ต่างดื่มกันมา สมอุรา เมื่อเราเจอกัน
ใต้ฟ้าสถาบัน รักผูกพันกับใจเธอไหม
(ช) ร่วมตั้งความหวัง ปณิธานมุ่งหน้าต่อไป
มองอนาคตไกล สร้างโลกสดใสใต้ชื่อสถาบัน`
  }
];

// ==========================================
// 📌 Component: กราฟิกตกแต่งภายในการ์ด (ลายก้อนเมฆและท้องฟ้า)
// ==========================================
const CardCloudDecoration = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-[2rem]">
    {/* พื้นหลังไล่สีโทนฟ้า-ครีม */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#e0f2fe] via-[#f0f9ff] to-[#fdfcf6] opacity-90"></div>
    {/* ก้อนเมฆบนซ้าย */}
    <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/80 blur-[25px] rounded-full"></div>
    {/* ก้อนเมฆบนขวา */}
    <div className="absolute top-12 -right-16 w-56 h-56 bg-white/70 blur-[35px] rounded-full"></div>
    {/* ก้อนเมฆด้านล่างสุด */}
    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120%] h-40 bg-white/90 blur-[20px] rounded-t-[100%]"></div>
  </div>
);

// ==========================================
// 📌 Component: ไอคอนฝูงนกบิน
// ==========================================
const BirdFlock = () => (
  <svg className="absolute top-8 right-8 w-14 h-14 text-amber-700/40 opacity-80 z-10" viewBox="0 0 100 100" fill="currentColor">
    <path d="M70.5,30.5 C68,28 65,27.5 62.5,29 C65,30.5 66.5,33 66.5,35.5 C66.5,33 68,30.5 70.5,30.5 Z" />
    <path d="M85.5,40.5 C83,38 80,37.5 77.5,39 C80,40.5 81.5,43 81.5,45.5 C81.5,43 83,40.5 85.5,40.5 Z" />
    <path d="M55.5,45.5 C53,43 50,42.5 47.5,44 C50,45.5 51.5,48 51.5,50.5 C51.5,48 53,45.5 55.5,45.5 Z" />
  </svg>
);

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
// 📌 Component: การ์ดเนื้อเพลงที่มีลูกเล่นกราฟิก
// ==========================================
const SongCard = ({ title, category, lyrics, icon }) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.01 }}
    transition={{ duration: 0.3 }}
    className="break-inside-avoid mb-8 rounded-[2rem] bg-white border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(14,165,233,0.15)] relative overflow-hidden group"
  >
    {/* กราฟิกเมฆ ท้องฟ้า และฝูงนก ภายในการ์ด */}
    <CardCloudDecoration />
    <BirdFlock />
    
    <div className="p-8 relative z-20">
      <div className="flex flex-col items-center pb-6 mb-6 relative">
        {/* ขีดเส้นใต้ตกแต่งหัวข้อ */}
        <div className="absolute bottom-0 w-32 h-[1px] bg-gradient-to-r from-transparent via-sky-300 to-transparent"></div>
        
        {/* โลโก้ด้านบน */}
        <div className="w-16 h-16 rounded-full bg-white shadow-md border border-slate-100 p-1 mb-4 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
          <img src={icon} alt="Logo" className="w-full h-full object-contain" />
        </div>
        
        {/* ชื่อเพลง */}
        <div className="flex items-center gap-3 w-full justify-center">
          <div className="h-1 w-4 bg-slate-800 rounded-full opacity-60"></div>
          <h3 className="text-xl md:text-2xl font-black text-slate-800 text-center tracking-tight drop-shadow-sm">{title}</h3>
          <div className="h-1 w-4 bg-slate-800 rounded-full opacity-60"></div>
        </div>
      </div>

      <div className="text-center space-y-2">
        {lyrics.split('\n').map((line, idx) => {
          const isHighlight = line.startsWith('(') || line.startsWith('*');
          return (
            <p key={idx} className={`text-[15px] leading-relaxed transition-colors ${line === '' ? 'h-4' : ''} ${isHighlight ? 'text-blue-800 font-bold italic' : 'text-slate-700 font-medium'}`}>
              {line}
            </p>
          );
        })}
      </div>
    </div>
  </motion.div>
);

export default function Songs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const universitySongs = SONGS.filter(s => s.category === 'university');
  const facultySongs = SONGS.filter(s => s.category === 'faculty');

  return (
    <div className="relative font-sans text-slate-900 min-h-screen pt-16 pb-32">
      {/* 📌 ใช้พื้นหลังตีมหลักของเว็บไซต์ */}
      <AuroraBackground />

      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">

        {/* ---------------- Header ---------------- */}
        <FadeInSection delay="0.1s">
          <div className="text-center max-w-4xl mx-auto pt-2 pb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
              บทเพลงประจำสถาบัน
            </h1>
            <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
              ศูนย์รวมเนื้อเพลงประจำมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ และคณะวิทยาศาสตร์ประยุกต์
            </p>
          </div>
        </FadeInSection>

        {/* ---------------- 1. บทเพลงมหาวิทยาลัย ---------------- */}
        <div className="rounded-[3rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-sm p-6 md:p-10 mb-16">
          <FadeInSection delay="0.2s">
            <div className="mb-10 max-w-4xl mx-auto">
              <SectionBanner line1="บทเพลง" line2="มหาวิทยาลัย" variant="website" />
            </div>
            
            {/* 📌 ใช้ columns ในการจัดหน้าแบบ Masonry เพื่อให้การ์ดต่อกันสวยงาม */}
            <div className="columns-1 lg:columns-2 gap-8 max-w-6xl mx-auto">
              {universitySongs.map((song, idx) => (
                <SongCard key={idx} {...song} />
              ))}
            </div>
          </FadeInSection>
        </div>

        {/* ---------------- 2. บทเพลงคณะวิทยาศาสตร์ประยุกต์ ---------------- */}
        <div className="rounded-[3rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-sm p-6 md:p-10 mb-16">
          <FadeInSection delay="0.3s">
            <div className="mb-10 max-w-4xl mx-auto">
              <SectionBanner line1="บทเพลง" line2="ประจำคณะ" variant="calendar" />
            </div>
            
            <div className="columns-1 lg:columns-2 gap-8 max-w-6xl mx-auto">
              {facultySongs.map((song, idx) => (
                <SongCard key={idx} {...song} />
              ))}
            </div>
          </FadeInSection>
        </div>

      </div>
    </div>
  );
}