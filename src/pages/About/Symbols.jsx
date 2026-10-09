import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuroraBackground, SectionBanner } from '../../components/ThemeElements';

// 📌 รูปสัญลักษณ์ (ตรวจนามสกุลไฟล์ให้ตรงกับของจริงในโฟลเดอร์ src/assets/Symbol)
import imgKmutnbSeal from '../../assets/Symbol/KMUTNB_Logo.png';
import imgKmutnbIdentity from '../../assets/Symbol/logo kmutnb final1.png';
import imgLogo67 from '../../assets/Symbol/logo67.png';
import imgAppliedScience from '../../assets/Symbol/AppliedScience_Logo.png';
import imgIMI from '../../assets/Symbol/IMI_Logo.png';
import imgBmeLogo from '../../assets/Symbol/bme_Logo.png';
import imgBmeMascot from '../../assets/Symbol/bme_mascot.png';

// ==========================================
// 📌 สีประจำหน่วยงาน
// ==========================================
const COLORS = {
  university: { name: 'สีแดงหมากสุก', hex: '#AC3520', rgb: '172, 53, 32', cmyk: '5%, 85%, 85%, 30%' },
  faculty: { name: 'สีเหลือง', hex: '#F2A900', rgb: '242, 169, 0', cmyk: null }, 
  department: { name: 'สีม่วง', hex: '#7B2FA0', rgb: '123, 47, 160', cmyk: null }, 
  bme: { name: 'สีแดง', hex: '#D61F26', rgb: '214, 31, 38', cmyk: null }, 
};

const bentoGlass = 'rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden';

// ==========================================
// 📌 Component: การ์ดสัญลักษณ์ พร้อมปุ่มดาวน์โหลด
// ==========================================
const SymbolCard = ({ img, title, tag, desc, accent }) => {
  // ฟังก์ชันสำหรับดาวน์โหลดรูปภาพ
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = img;
    // ตั้งชื่อไฟล์ที่จะเซฟ
    link.download = `${tag}_KMUTNB_Logo`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col relative group"
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: accent }}></div>
      <div className="p-6 flex flex-col items-center text-center flex-1">
        
        {/* รูปภาพและปุ่มดาวน์โหลดแบบ Hover Overlay */}
        <div className="relative w-full h-44 rounded-2xl bg-slate-50 shadow-inner flex items-center justify-center p-5 mb-5 overflow-hidden group/img">
          <img src={img} alt={title} className="max-w-full max-h-full object-contain group-hover/img:scale-105 transition-transform duration-500" />
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2.5 rounded-full font-bold text-xs shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all"
            >
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              ดาวน์โหลดรูปภาพ
            </button>
          </div>
        </div>

        <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold mb-3">{tag}</span>
        <h3 className="text-lg font-black text-slate-800 mb-2 leading-snug">{title}</h3>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
};

// ==========================================
// 📌 Component: ตัวอย่างสี + ปุ่มคัดลอกรหัสสี
// ==========================================
const ColorSwatch = ({ label, color }) => {
  const [copied, setCopied] = useState(false);

  const copyHex = async () => {
    try {
      await navigator.clipboard.writeText(color.hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('คัดลอกรหัสสี', color.hex);
    }
  };

  return (
    <div className="rounded-[2rem] bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="h-28 flex items-end p-4 relative overflow-hidden" style={{ backgroundColor: color.hex }}>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <span className="relative z-10 px-3 py-1 rounded-full bg-white/90 text-[11px] font-black text-slate-800 shadow-sm">{label}</span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-base font-black text-slate-800 mb-3">{color.name}</p>
        <dl className="space-y-1.5 text-xs font-medium text-slate-600 mb-4 flex-1">
          <div className="flex justify-between"><dt className="text-slate-400">HEX</dt><dd className="font-bold">{color.hex}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-400">RGB</dt><dd className="font-bold">{color.rgb}</dd></div>
          {color.cmyk && <div className="flex justify-between"><dt className="text-slate-400">CMYK</dt><dd className="font-bold">{color.cmyk}</dd></div>}
        </dl>
        <button
          onClick={copyHex}
          className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 shadow-sm hover:bg-slate-900 hover:-translate-y-0.5 transition-all mt-auto"
        >
          {copied ? 'คัดลอกสำเร็จแล้ว!' : 'คัดลอกรหัสสี HEX'}
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 📌 Component: กล่องข้อมูลสั้นแบบมีลูกเล่น (FactCard)
// ==========================================
const FactCard = ({ icon, label, value, tone }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ duration: 0.3 }}
    className={`relative overflow-hidden rounded-[2rem] border border-white/60 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-gradient-to-br ${tone} group flex flex-col h-full`}
  >
    {/* Watermark Icon แบบโปร่งแสงด้านหลัง */}
    <div className="absolute -right-4 -bottom-6 text-8xl opacity-10 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 pointer-events-none select-none">
      {icon}
    </div>
    
    <div className="relative z-10 flex flex-col h-full">
      <div className="w-14 h-14 rounded-[1rem] bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-3xl mb-auto group-hover:-translate-y-1 transition-transform duration-300">
        {icon}
      </div>
      <div className="mt-8">
        <p className="text-[12px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
  </motion.div>
);

// ==========================================
// 📌 หัวข้อย่อยภายใน Section
// ==========================================
const SubHeading = ({ children, color = 'from-purple-500 to-indigo-400' }) => (
  <h3 className="text-lg md:text-xl font-black text-slate-800 mb-5 flex items-center gap-3">
    <span className={`w-1.5 h-6 bg-gradient-to-b ${color} rounded-full`}></span>
    {children}
  </h3>
);

export default function Symbols() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />

      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">

        {/* ---------------- Header ---------------- */}
        <div className="text-center max-w-4xl mx-auto pt-2 pb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
            สัญลักษณ์และแบรนด์
          </h1>
          <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
            ตรา สี และสัญลักษณ์ประจำมหาวิทยาลัย คณะ ภาควิชา และสาขาวิชาวิศวกรรมชีวการแพทย์
          </p>
        </div>

        {/* ---------------- 1. มหาวิทยาลัย ---------------- */}
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          <SectionBanner line1="สัญลักษณ์" line2="มหาวิทยาลัย" variant="website" />

          <SubHeading color="from-rose-500 to-red-600">ตราและสัญลักษณ์</SubHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <SymbolCard
              img={imgKmutnbSeal}
              tag="ตรามหาวิทยาลัย"
              title="ตราประจำมหาวิทยาลัย"
              desc="ตราสัญลักษณ์ทางการของมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ"
              accent={COLORS.university.hex}
            />
            <SymbolCard
              img={imgKmutnbIdentity}
              tag="ตราเอกลักษณ์"
              title="ตราเอกลักษณ์มหาวิทยาลัย"
              desc="ตราเอกลักษณ์ที่ใช้ในงานสื่อสารและประชาสัมพันธ์ของมหาวิทยาลัย"
              accent={COLORS.university.hex}
            />
            <SymbolCard
              img={imgLogo67}
              tag="ครบรอบ 67 ปี"
              title="สัญลักษณ์เฉลิมฉลองครบรอบ 67 ปี"
              desc="สัญลักษณ์เฉลิมฉลองวาระครบรอบ 67 ปีของมหาวิทยาลัย"
              accent={COLORS.university.hex}
            />
          </div>

          <SubHeading color="from-amber-400 to-orange-500">สี ต้นไม้ และวันสถาปนา</SubHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ColorSwatch label="สีประจำมหาวิทยาลัย" color={COLORS.university} />
            <FactCard icon="🌳" label="ต้นไม้ประจำมหาวิทยาลัย" value="ต้นประดู่แดง" tone="from-rose-100/50 to-orange-50/50 border-rose-100" />
            <FactCard icon="🎓" label="วันสถาปนามหาวิทยาลัย" value="19 กุมภาพันธ์" tone="from-indigo-100/50 to-purple-50/50 border-indigo-100" />
          </div>
        </div>

        {/* ---------------- 2. คณะวิทยาศาสตร์ประยุกต์ ---------------- */}
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          <SectionBanner line1="สัญลักษณ์" line2="คณะ" variant="calendar" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <SymbolCard
              img={imgAppliedScience}
              tag="ตราคณะ"
              title="ตราคณะวิทยาศาสตร์ประยุกต์"
              desc="ตราสัญลักษณ์ประจำคณะวิทยาศาสตร์ประยุกต์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ"
              accent={COLORS.faculty.hex}
            />
            <ColorSwatch label="สีประจำคณะ" color={COLORS.faculty} />
          </div>
        </div>

        {/* ---------------- 3. ภาควิชา ---------------- */}
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          <SectionBanner line1="สัญลักษณ์" line2="ภาควิชา" variant="exam" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <SymbolCard
              img={imgIMI}
              tag="ตราภาควิชา"
              title="ตราภาควิชาฟิสิกส์อุตสาหกรรมและอุปกรณ์การแพทย์"
              desc="ตราสัญลักษณ์ประจำภาควิชาฟิสิกส์อุตสาหกรรมและอุปกรณ์การแพทย์ (IMI)"
              accent={COLORS.department.hex}
            />
            <ColorSwatch label="สีประจำภาควิชา" color={COLORS.department} />
          </div>
        </div>

        {/* ---------------- 4. สาขาวิชา BME ---------------- */}
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          <SectionBanner line1="สัญลักษณ์" line2="สาขา BME" variant="website" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SymbolCard
              img={imgBmeLogo}
              tag="สัญลักษณ์สาขา"
              title="สัญลักษณ์สาขาวิชาวิศวกรรมชีวการแพทย์"
              desc="สัญลักษณ์ประจำสาขาวิชาวิศวกรรมชีวการแพทย์ (BME)"
              accent={COLORS.bme.hex}
            />
            <SymbolCard
              img={imgBmeMascot}
              tag="มาสคอต"
              title="มาสคอตประจำสาขาวิชา"
              desc="มาสคอตประจำสาขาวิชาวิศวกรรมชีวการแพทย์ ใช้ในงานกิจกรรมและสื่อประชาสัมพันธ์ของสาขา"
              accent={COLORS.bme.hex}
            />
            <ColorSwatch label="สีประจำสาขาวิชา" color={COLORS.bme} />
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500 italic px-4">
          * โปรดใช้ตราและสัญลักษณ์ตามรูปแบบที่มหาวิทยาลัยกำหนด ไม่ดัดแปลงสีหรือสัดส่วนของตรา
        </p>
      </div>
    </div>
  );
}