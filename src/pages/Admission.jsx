import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// 📌 นำเข้า Component พื้นหลังและแบนเนอร์จาก ThemeElements
import { AuroraBackground, SectionBanner } from '../components/ThemeElements';

// 📌 นำเข้ารูปภาพกราฟิกการรับสมัคร
import admissionImg from '../assets/admission.jpg';

// ==========================================
// 📌 ข้อมูลลิงก์ที่เกี่ยวข้องกับการรับสมัคร
// ==========================================
const ADMISSION_LINKS = [
  { title: 'ตรวจสอบคุณวุฒิก่อนสมัคร', url: 'https://stdadmis2.kmutnb.ac.th/Information/GradCondCheck', color: 'from-blue-500 to-cyan-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'ระเบียบการรับสมัคร', url: 'https://www.admission.kmutnb.ac.th/apply/round', color: 'from-rose-500 to-orange-500', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { title: 'ค่าใช้จ่ายในการศึกษา', url: 'https://www.admission.kmutnb.ac.th/payment', color: 'from-emerald-500 to-teal-500', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'ประกาศรายชื่อผู้มีสิทธิ์สอบ', url: 'https://www.admission.kmutnb.ac.th/announce/list-eligible-candidates', color: 'from-purple-500 to-indigo-500', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { title: 'ประกาศผลสอบคัดเลือก', url: 'https://www.admission.kmutnb.ac.th/announce/entrance-exam', color: 'from-amber-500 to-orange-500', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
  { title: 'ประกาศรายชื่อผู้ยืนยันสิทธิ์', url: 'https://www.admission.kmutnb.ac.th/announce/assert', color: 'from-pink-500 to-rose-500', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  { title: 'ดาวน์โหลดเอกสาร/แบบฟอร์ม', url: 'https://www.admission.kmutnb.ac.th/download', color: 'from-slate-600 to-slate-800', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
  { title: 'ระบบ TCAS ส่วนกลาง (ทปอ.)', url: 'https://www.mytcas.com/', color: 'from-blue-600 to-indigo-700', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' }
];

export default function Admission() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden";

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      {/* 📌 ใช้พื้นหลังตีมหลักของเว็บไซต์ */}
      <AuroraBackground />

      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">

        {/* ---------------- Header Section ---------------- */}
        <div className="text-center max-w-4xl mx-auto pt-8 pb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600">
              สมัครเรียน (Admission)
            </h1>
            <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
              ข้อมูลการรับสมัครนักศึกษาใหม่ โครงการรับตรง และระบบ TCAS เพื่อเข้าศึกษาต่อในสาขาวิชาวิศวกรรมชีวการแพทย์
            </p>
          </motion.div>
        </div>

        {/* ---------------- 1. ภาพกราฟิกการรับสมัคร ---------------- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className={`p-6 md:p-10 mb-16 ${bentoGlass} group relative`}
        >
          {/* Watermark Logo */}
          <div className="absolute -right-16 -bottom-16 opacity-[0.03] group-hover:scale-105 transition-transform duration-700 pointer-events-none">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[30rem] h-[30rem]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
          </div>
            
          <div className="flex flex-col items-center relative z-10">
            {/* 📌 ใช้ SectionBanner แทน Header */}
            <div className="mb-10 w-full max-w-4xl">
              <SectionBanner text="ประกาศการรับสมัครนักศึกษาใหม่" variant="exam" />
            </div>

            <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.12)] border-8 border-white group-hover:shadow-[0_20px_50px_rgba(225,29,72,0.15)] transition-shadow duration-500">
               {/* Overlay Download Button */}
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-20">
                   <a 
                       href={admissionImg} 
                       download="KMUTNB_Admission.jpg"
                       className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-full font-bold text-sm shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all"
                   >
                       <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                       ดาวน์โหลดประกาศ
                   </a>
               </div>
              <img src={admissionImg} alt="กราฟิกการเปิดรับสมัครนักศึกษา" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            
            <div className="mt-10 text-center">
              <a href="https://www.admission.kmutnb.ac.th/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-rose-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                เข้าสู่เว็บไซต์รับสมัครนักศึกษา (ส่วนกลาง)
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </a>
            </div>
          </div>
        </motion.div>
        
        {/* ---------------- 1.5 ข้อมูลรับสมัครเฉพาะสาขาวิชา BME ---------------- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className={`p-8 md:p-12 mb-16 ${bentoGlass}`}
        >
          {/* 📌 ใช้ SectionBanner แทน Header */}
          <div className="mb-10 w-full max-w-4xl mx-auto">
            <SectionBanner text="ข้อมูลรับสมัครสาขาวิชาวิศวกรรมชีวการแพทย์" variant="scholarship" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. คุณสมบัติผู้สมัคร */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50/30 rounded-3xl p-6 shadow-sm border border-blue-100 flex flex-col hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center mb-4 shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">คุณสมบัติผู้สมัคร</h3>
              <ul className="space-y-2 text-sm text-slate-600 font-medium flex-1">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">▪</span>
                  สำเร็จการศึกษาระดับ ม.6 แผนการเรียน วิทย์-คณิต
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">▪</span>
                  หรือเทียบเท่า (ตามประกาศรับสมัครของมหาวิทยาลัย)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">▪</span>
                  GPAX ขั้นต่ำตามที่ระบุในแต่ละรอบการรับสมัคร
                </li>
              </ul>
            </div>

            {/* 2. รอบที่เปิดรับ (TCAS) */}
            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50/30 rounded-3xl p-6 shadow-sm border border-purple-100 flex flex-col hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center mb-4 shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">รอบที่เปิดรับ (TCAS)</h3>
              <ul className="space-y-2 text-sm text-slate-600 font-medium flex-1">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-purple-600">รอบ 1:</span> Portfolio (แฟ้มสะสมผลงาน)
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-purple-600">รอบ 2:</span> Quota (โควตาพื้นที่/โรงเรียนเครือข่าย)
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-purple-600">รอบ 3:</span> Admission (คะแนน TGAT/TPAT/A-Level)
                </li>
              </ul>
            </div>

            {/* 3. ค่าธรรมเนียมการศึกษา */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 rounded-3xl p-6 shadow-sm border border-emerald-100 flex flex-col hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">ค่าธรรมเนียมการศึกษา</h3>
              <div className="flex-1 flex flex-col justify-center mb-4">
                <p className="text-3xl font-black text-emerald-600 tracking-tight">28,000<span className="text-base font-bold text-slate-500 ml-1">บาท</span></p>
                <p className="text-xs text-slate-500 mt-1 font-medium">ต่อภาคการศึกษา (โดยประมาณ)</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---------------- 2. สรุปขั้นตอนการสมัคร ---------------- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className={`p-8 md:p-12 mb-16 ${bentoGlass}`}
        >
          {/* 📌 ใช้ SectionBanner แทน Header */}
          <div className="mb-6 w-full max-w-4xl mx-auto">
            <SectionBanner text="สรุปขั้นตอนการสมัครเข้าศึกษา" variant="calendar" />
          </div>
          
          <div className="text-center mb-10">
            <p className="text-slate-500 font-medium">ผ่านระบบการรับสมัครนักศึกษาออนไลน์ มจพ.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50/30 rounded-2xl p-6 border-t-4 border-amber-400 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center font-black text-lg mb-4 shadow-sm">1</div>
              <h3 className="font-bold text-slate-800 mb-2">อ่านข้อมูลการรับสมัคร</h3>
              <p className="text-sm text-slate-600 leading-relaxed">จากประกาศรับสมัครของคณะ/วิทยาลัย หรือระเบียบการรับสมัครอย่างละเอียด</p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50/30 rounded-2xl p-6 border-t-4 border-teal-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-black text-lg mb-4 shadow-sm">2</div>
              <h3 className="font-bold text-slate-800 mb-2">สร้างบัญชีผู้ใช้งานและลงทะเบียน</h3>
              <p className="text-sm text-slate-600 leading-relaxed">ผู้สมัครลงทะเบียนได้เพียง 1 ครั้งเท่านั้น และต้องจำรหัสผ่านให้ได้เพื่อใช้เข้าสู่ระบบ</p>
            </div>

            {/* Step 3 */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50/30 rounded-2xl p-6 border-t-4 border-emerald-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-lg mb-4 shadow-sm">3</div>
              <h3 className="font-bold text-slate-800 mb-2">กรอกข้อมูลการสมัคร</h3>
              <p className="text-sm text-slate-600 leading-relaxed">กรอกข้อมูลให้ครบถ้วน ตรงตามความเป็นจริง และให้ตรวจสอบความถูกต้องก่อนบันทึกข้อมูล</p>
            </div>

            {/* Step 4 */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50/30 rounded-2xl p-6 border-t-4 border-yellow-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center font-black text-lg mb-4 shadow-sm">4</div>
              <h3 className="font-bold text-slate-800 mb-2">ชำระเงินค่าสมัคร</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-2">พิมพ์ใบแจ้งการชำระเงิน หรือสแกน QR Code เพื่อชำระผ่านช่องทาง:</p>
              <ul className="text-[13px] text-slate-500 list-disc pl-4 space-y-1">
                <li>Mobile Banking ทุกธนาคาร</li>
                <li>เคาน์เตอร์ธนาคารกรุงไทย</li>
                <li>ตู้ ATM ธนาคารกรุงไทย</li>
              </ul>
            </div>

            {/* Step 5 */}
            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50/30 rounded-2xl p-6 border-t-4 border-purple-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-black text-lg mb-4 shadow-sm">5</div>
              <h3 className="font-bold text-slate-800 mb-2">ตรวจสอบสถานะการชำระเงิน</h3>
              <p className="text-sm text-slate-600 leading-relaxed">สามารถตรวจสอบสถานะการสมัคร หลังจากชำระเงินแล้ว 3 วันทำการถัดไป นับจากวันที่ชำระเงิน</p>
            </div>

            {/* Step 6 */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50/30 rounded-2xl p-6 border-t-4 border-rose-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-black text-lg mb-4 shadow-sm">6</div>
              <h3 className="font-bold text-slate-800 mb-2">พิมพ์ใบหลักฐานแสดงการสมัคร</h3>
              <p className="text-sm text-slate-600 leading-relaxed">เพื่อใช้เป็นหลักฐานในวันสอบสัมภาษณ์ หรือสอบข้อเขียน (เลขที่สมัคร, เลขที่นั่งสอบ, สถานที่สอบ)</p>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5 text-center shadow-sm">
            <p className="text-sm font-bold text-blue-800">
              📌 เฉพาะผู้สมัครระดับปริญญาตรีหลักสูตร 4 ปี / 5 ปี ทุกคน จะต้องลงทะเบียนใช้งานระบบ TCAS ของ ทปอ.
              เพื่อยืนยันตัวตนและใช้ในการยืนยันสิทธิ์เข้ามหาวิทยาลัย ที่เว็บไซต์ <a href="https://student.mytcas.com/" target="_blank" rel="noreferrer" className="underline hover:text-blue-600">student.mytcas.com</a>
            </p>
          </div>
        </motion.div>

        {/* ---------------- 3. ลิงก์ที่เกี่ยวข้อง (Quick Links) ---------------- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className={`p-8 md:p-12 mb-16 ${bentoGlass}`}
        >
          {/* 📌 ใช้ SectionBanner แทน Header */}
          <div className="mb-10 w-full max-w-4xl mx-auto">
            <SectionBanner text="ระบบและข้อมูลที่เกี่ยวข้อง" variant="website" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ADMISSION_LINKS.map((link, idx) => (
              <a 
                key={idx} 
                href={link.url} 
                target="_blank" 
                rel="noreferrer"
                className="group relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} text-white flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon}></path></svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-purple-700 transition-colors">{link.title}</h3>
                </div>
                <div className="text-slate-300 group-hover:text-purple-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* ---------------- 4. ข้อมูลติดต่อ ---------------- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className={`p-8 md:p-12 mb-8 ${bentoGlass}`}
        >
          {/* 📌 ใช้ SectionBanner แทน Header */}
          <div className="mb-10 w-full max-w-4xl mx-auto">
            <SectionBanner text="ติดต่อสอบถามข้อมูล" variant="website" />
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-extrabold text-slate-800 mb-4">กลุ่มงานรับเข้าศึกษา กองบริการการศึกษา สำนักงานอธิการบดี</h3>
              
              <div className="space-y-4 text-slate-600 text-sm font-medium">
                <div className="flex items-start gap-3 justify-center md:justify-start">
                  <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <p>ชั้น 2 อาคาร TGGS มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ<br/>1518 ถนนประชาราษฎร์ 1 แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800</p>
                </div>
                
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  <p>โทร : +66 2 555-2000 ต่อ 1626, 1627</p>
                </div>

                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                  <p>แฟกซ์ : +66 2 555-2171</p>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <a 
                href="https://www.facebook.com/admission.kmutnb" 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-col items-center gap-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 p-6 rounded-2xl transition-colors text-center"
              >
                <svg className="w-12 h-12 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Admission.KMUTNB</p>
                  <p className="text-xs text-slate-500 mt-1">กลุ่มงานรับเข้าศึกษา มจพ.</p>
                </div>
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}