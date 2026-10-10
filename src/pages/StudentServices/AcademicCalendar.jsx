import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 📌 นำเข้า Component พื้นหลังและแบนเนอร์จาก ThemeElements
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

export default function AcademicCalendar() {
  // ==========================================
  // 📌 ข้อมูลปฏิทินการศึกษา
  // ==========================================
  const CALENDAR_DATA = {
    '1/2569': {
      academic: [
        { date: '8 - 15 มิ.ย. 2569', event: 'พบอาจารย์ที่ปรึกษา และลงทะเบียนวิชาเรียน' },
        { date: '22 มิ.ย. 2569', event: 'เปิดภาคการศึกษาและเริ่มเรียน' },
        { date: '6 ก.ค. 2569', event: 'วันสุดท้ายของการลงทะเบียนช้ากว่ากำหนด / รักษาสภาพ' },
        { date: '17 - 23 ส.ค. 2569', event: 'ช่วงเวลาการสอบกลางภาคเรียน' },
        { date: '11 ต.ค. 2569', event: 'วันสุดท้ายของการเรียน' },
        { date: '19 ต.ค. - 1 พ.ย. 2569', event: 'ช่วงเวลาการสอบประจำภาคเรียน' },
        { date: '1 พ.ย. 2569', event: 'วันปิดภาคการศึกษา' }
      ],
      registration: [
        { date: '25 - 27 พ.ค. 2569', target: 'ระดับ ปวช.' },
        { date: '8 มิ.ย. 2569', target: 'นักศึกษาชั้นปีที่ 2' },
        { date: '9 มิ.ย. 2569', target: 'นักศึกษาชั้นปีที่ 3' },
        { date: '10 มิ.ย. 2569', target: 'นักศึกษาชั้นปีที่ 4' },
        { date: '11 มิ.ย. 2569', target: 'นักศึกษาชั้นปีที่ 5' },
        { date: '12 - 15 มิ.ย. 2569', target: 'นักศึกษาตกค้าง และผู้ที่ยังไม่ได้ลงทะเบียน' }
      ]
    },
    '2/2569': {
      academic: [
        { date: '9 - 16 พ.ย. 2569', event: 'พบอาจารย์ที่ปรึกษา และลงทะเบียนวิชาเรียน' },
        { date: '23 พ.ย. 2569', event: 'เปิดภาคการศึกษาและเริ่มเรียน' },
        { date: '8 ธ.ค. 2569', event: 'วันสุดท้ายของการลงทะเบียนช้ากว่ากำหนด / รักษาสภาพ' },
        { date: '18 - 24 ม.ค. 2570', event: 'ช่วงเวลาการสอบกลางภาคเรียน' },
        { date: '14 มี.ค. 2570', event: 'วันสุดท้ายของการเรียน' },
        { date: '15 - 28 มี.ค. 2570', event: 'ช่วงเวลาการสอบประจำภาคเรียน' },
        { date: '28 มี.ค. 2570', event: 'วันปิดภาคการศึกษา' }
      ],
      registration: [
        { date: '26 - 28 ต.ค. 2569', target: 'ระดับ ปวช.' },
        { date: '16 พ.ย. 2569', target: 'นักศึกษาชั้นปีที่ 1' },
        { date: '17 พ.ย. 2569', target: 'นักศึกษาชั้นปีที่ 2' },
        { date: '18 พ.ย. 2569', target: 'นักศึกษาชั้นปีที่ 3' },
        { date: '19 พ.ย. 2569', target: 'นักศึกษาชั้นปีที่ 4 และบัณฑิตศึกษา' },
        { date: '20 พ.ย. 2569', target: 'นักศึกษาชั้นปีที่ 5 และบัณฑิตศึกษา' }
      ]
    }
  };

  const [activeSemester, setActiveSemester] = useState('1/2569');

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
        <FadeInSection delay="0.1s">
          <div className="text-center max-w-4xl mx-auto pt-2 pb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
              ปฏิทินการศึกษา
            </h1>
            <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
              กำหนดการสำคัญและตารางการลงทะเบียนเรียน ประจำปีการศึกษา 2569
            </p>
          </div>
        </FadeInSection>

        {/* ---------------- ส่วนเนื้อหาหลัก ---------------- */}
        <FadeInSection delay="0.2s">
          <div className={`p-6 md:p-10 lg:p-12 mb-16 ${bentoGlass}`}>
            
            {/* 📌 ใช้ SectionBanner จาก ThemeElements */}
            <div className="mb-8 w-full">
              <SectionBanner text="กำหนดการและวันลงทะเบียน" variant="calendar" />
            </div>

            {/* 📌 ปุ่มสลับเทอม (Tab Switcher) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 border-b border-slate-200/60 pb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">ปีการศึกษา 2569</h2>
                <p className="text-slate-500 text-sm md:text-base font-medium mt-1.5">ระดับปริญญาตรี และบัณฑิตศึกษา (มจพ. กรุงเทพฯ)</p>
              </div>
              <div className="flex bg-slate-100/80 p-1.5 rounded-2xl shadow-sm shrink-0">
                {Object.keys(CALENDAR_DATA).map((term) => (
                  <button 
                    key={term} 
                    onClick={() => setActiveSemester(term)} 
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeSemester === term ? 'bg-white text-purple-700 shadow-[0_2px_10px_rgba(0,0,0,0.05)]' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    ภาคเรียนที่ {term}
                  </button>
                ))}
              </div>
            </div>

            {/* 📌 ตารางข้อมูล (มี AnimatePresence เวลากดสลับเทอม) */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeSemester}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
              >
                {/* ตารางที่ 1: กำหนดการสำคัญ */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">กำหนดการทางวิชาการ</h3>
                  </div>
                  
                  <div className="bg-slate-50/70 rounded-[1.5rem] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-slate-100">
                    <table className="w-full text-left text-sm md:text-[15px]">
                      <thead className="bg-slate-100/80 border-b border-slate-200/80 text-slate-700">
                        <tr>
                          <th className="py-4 px-5 font-bold w-[45%]">วัน/เดือน/ปี</th>
                          <th className="py-4 px-5 font-bold">กิจกรรม</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/80">
                        {CALENDAR_DATA[activeSemester].academic.map((item, index) => (
                          <tr key={index} className="hover:bg-white transition-colors duration-200">
                            <td className="py-3.5 px-5 font-semibold text-slate-800 leading-snug">{item.date}</td>
                            <td className="py-3.5 px-5 text-slate-600 font-medium leading-relaxed">{item.event}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ตารางที่ 2: กำหนดการลงทะเบียน */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">กำหนดการลงทะเบียนเรียน</h3>
                  </div>
                  
                  <div className="bg-slate-50/70 rounded-[1.5rem] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-slate-100">
                    <table className="w-full text-left text-sm md:text-[15px]">
                      <thead className="bg-slate-100/80 border-b border-slate-200/80 text-slate-700">
                        <tr>
                          <th className="py-4 px-5 font-bold w-[45%]">วัน/เดือน/ปี</th>
                          <th className="py-4 px-5 font-bold">กลุ่มนักศึกษา</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/80">
                        {CALENDAR_DATA[activeSemester].registration.map((item, index) => (
                          <tr key={index} className="hover:bg-white transition-colors duration-200">
                            <td className="py-3.5 px-5 font-bold text-indigo-600 leading-snug">{item.date}</td>
                            <td className="py-3.5 px-5 text-slate-700 font-medium leading-relaxed">{item.target}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* 📌 กล่องหมายเหตุ */}
                  <div className="mt-6 bg-amber-50 border border-amber-200/60 rounded-2xl p-5 flex items-start gap-3 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-800 mb-1">ข้อควรระวังในการลงทะเบียน</p>
                      <p className="text-[13px] text-amber-700/80 leading-relaxed font-medium">
                        นักศึกษาต้องลงทะเบียนผ่านระบบ REG ด้วยตนเอง และชำระเงินตามช่วงวัน-เวลาที่กำหนด <strong className="text-amber-800">หากพ้นกำหนดจะต้องเสียค่าปรับลงทะเบียนล่าช้าตามระเบียบมหาวิทยาลัย</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ---------------- 📌 ปุ่ม Call-to-Action ---------------- */}
            <div className="mt-12 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://acdserv.kmutnb.ac.th/academic-calendar" 
                target="_blank" 
                rel="noreferrer" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                ดาวน์โหลดปฏิทิน (PDF)
              </a>
              <a 
                href="https://reg2.kmutnb.ac.th/registrar/" 
                target="_blank" 
                rel="noreferrer" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                เข้าระบบลงทะเบียน (REG)
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </a>
            </div>

          </div>
        </FadeInSection>
      </div>
    </div>
  );
}