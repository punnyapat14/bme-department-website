import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 📌 นำเข้ารูปภาพจาก assets ทั่วไป (แก้ Path เป็น ../../ แล้ว)
import imgREG from '../../assets/Website/REG.png';
import imgACD from '../../assets/Website/ACD.png';
import imgKMUTNB from '../../assets/Website/KMUTNB.png';
import imgApplied from '../../assets/Website/Applied.png';
import imgIMIAffair from '../../assets/Website/IMI_Affairs.png'; 
import imgKRoom from '../../assets/Website/K_room.png'; 
import imgSmartRoom from '../../assets/Website/Smart_room.png'; 
import imgMOOC from '../../assets/Website/Mooc.png'; 
import imgPhyLab from '../../assets/Website/Phy_lab.png'; 
import imgCEM from '../../assets/Website/CEM.png';
import imgKMUTNB2 from '../../assets/Website/KMUTNB2.png'; 
import imgLibrary from '../../assets/Website/Library.png';
import imgDigitaltest from '../../assets/Website/Digitaltest.png';
import imgMAP160 from '../../assets/Website/MAP160.jpg'; 

// 📌 นำเข้ารูปภาพบริการซอฟต์แวร์ (แก้ Path เป็น ../../ แล้ว)
import imgAdobe from '../../assets/Software/Adobe.png';
import imgAzer from '../../assets/Software/Azer.png';
import imgEset from '../../assets/Software/eset.png';
import imgFoxis from '../../assets/Software/Foxis.png';
import imgMatlab from '../../assets/Software/Matlab.png';
import imgMs365 from '../../assets/Software/ms365.png';
import imgSolid from '../../assets/Software/Solid.png';
import imgWorkSpace from '../../assets/Software/WorkSpace.png';
import imgIcitService from '../../assets/Software/ICIT_Service.png';
import imgServiceLogo from '../../assets/Software/Service.png';

// 📌 นำเข้ารูปภาพสำหรับบริการสุขภาพและบัตรนักศึกษา (แก้ Path เป็น ../../ แล้ว)
import imgHealthLogo from '../../assets/Health_logo.jpg';
import imgHealthTable from '../../assets/HealthTable.jpg';
import imgInsure from '../../assets/Insure.png';
import imgBookBank from '../../assets/BookBank.png';
import imgStudentCard from '../../assets/StudentCard.png';

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

// ==========================================
// 📌 ข้อมูลระบบเช็คที่นั่งสอบแยกคณะ
// ==========================================
const EXAM_SEATING_LINKS = [
  { faculty: 'คณะวิทยาศาสตร์ประยุกต์', url: 'http://www.scibase.kmutnb.ac.th/examroom/datatrain.html', iconColor: 'text-amber-500 bg-amber-50', hoverColor: 'hover:bg-amber-50/60' },
  { faculty: 'คณะวิศวกรรมศาสตร์', url: 'https://www.eng.kmutnb.ac.th/eservice/exam/seating', iconColor: 'text-rose-500 bg-rose-50', hoverColor: 'hover:bg-rose-50/60' },
  { faculty: 'คณะครุศาสตร์อุตสาหกรรม', url: 'https://exam.fte.kmutnb.ac.th/search/name', iconColor: 'text-blue-500 bg-blue-50', hoverColor: 'hover:bg-blue-50/60' },
  { faculty: 'คณะพัฒนาอุตสาหกรรม', url: 'https://bidkmutnbexam.my.canva.site/dagzyw5euag', iconColor: 'text-emerald-500 bg-emerald-50', hoverColor: 'hover:bg-emerald-50/60' }
];

// ==========================================
// 📌 ข้อมูลเว็บไซต์บริการทั้งหมด
// ==========================================
const ALL_SERVICES = [
  { name: 'เว็บไซต์มหาวิทยาลัย', short: 'KMUTNB', category: 'ส่วนกลางและระบบการศึกษา', url: 'https://www.kmutnb.ac.th/', img: imgKMUTNB, desc: 'ข่าวสารและข้อมูลทางการของมหาวิทยาลัย', color: 'from-orange-500 to-amber-500', glow: 'rgba(249,115,22,0.3)' },
  { name: 'คณะวิทยาศาสตร์ประยุกต์', short: 'SCI', category: 'ส่วนกลางและระบบการศึกษา', url: 'http://www.sci.kmutnb.ac.th/', img: imgApplied, desc: 'เว็บไซต์หลักคณะวิทยาศาสตร์ประยุกต์', color: 'from-amber-500 to-yellow-500', glow: 'rgba(245,158,11,0.3)' },
  { name: 'กองบริการการศึกษา', short: 'ACD', category: 'ส่วนกลางและระบบการศึกษา', url: 'https://acdserv.kmutnb.ac.th/home', img: imgACD, desc: 'ปฏิทินการศึกษา ข้อมูลหลักสูตร และระเบียบ', color: 'from-rose-500 to-red-600', glow: 'rgba(244,63,94,0.3)' },
  { name: 'บริการการศึกษา (REG)', short: 'REG', category: 'ส่วนกลางและระบบการศึกษา', url: 'https://reg2.kmutnb.ac.th/registrar/', img: imgREG, desc: 'ลงทะเบียนเรียน ตรวจสอบเกรด ตารางสอน', color: 'from-emerald-500 to-teal-600', glow: 'rgba(16,185,129,0.3)' },
  { name: 'บริการเรียนออนไลน์', short: 'MOOC', category: 'ส่วนกลางและระบบการศึกษา', url: 'https://kmutnbmooc.com/', img: imgMOOC, desc: 'คอร์สเรียนออนไลน์สะสมหน่วยกิตและเสริมทักษะ', color: 'from-amber-500 to-orange-600', glow: 'rgba(245,158,11,0.3)' },
  { name: 'สอบสมรรถนะดิจิทัล', short: 'DL', category: 'ส่วนกลางและระบบการศึกษา', url: 'https://dl.kmutnb.ac.th/', img: imgDigitaltest, desc: 'ทดสอบทักษะความรู้ดิจิทัลตามเกณฑ์มหาวิทยาลัย', color: 'from-blue-500 to-cyan-500', glow: 'rgba(59,130,246,0.3)' },
  { name: 'สอบวัดระดับภาษาอังกฤษ', short: 'CEM', category: 'ส่วนกลางและระบบการศึกษา', url: 'https://cem.kmutnb.ac.th/', img: imgCEM, desc: 'ศูนย์ทดสอบทางภาษาและพัฒนาสื่อดิจิทัล', color: 'from-indigo-500 to-purple-600', glow: 'rgba(99,102,241,0.3)' },
  { name: 'กองทุนกู้ยืมเพื่อการศึกษา (กยศ.)', short: 'กยศ', category: 'ส่วนกลางและระบบการศึกษา', url: 'https://sa.op.kmutnb.ac.th/studentloan/', img: imgKMUTNB2, desc: 'ข้อมูลทุนการศึกษาและเงินกู้ยืมเพื่อการศึกษา', color: 'from-pink-500 to-rose-500', glow: 'rgba(236,72,153,0.3)' },

  { name: 'บริการห้อง K-Room', short: 'K-RM', category: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม', url: 'https://k-room.icit.kmutnb.ac.th/web/room/list-room', img: imgKRoom, desc: 'จองห้องค้นคว้ากลุ่ม ติวหนังสือ และทำงานร่วมกัน', color: 'from-indigo-500 to-violet-600', glow: 'rgba(99,102,241,0.3)' },
  { name: 'บริการห้อง Smart Room', short: 'S-RM', category: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม', url: 'https://smartroom.lib.kmutnb.ac.th/', img: imgSmartRoom, desc: 'ห้องประชุมอัจฉริยะ พร้อมอุปกรณ์มัลติมีเดีย', color: 'from-purple-500 to-fuchsia-600', glow: 'rgba(168,85,247,0.3)' },
  { name: 'หอสมุดกลาง มจพ.', short: 'LIB', category: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม', url: 'https://library.kmutnb.ac.th/', img: imgLibrary, desc: 'สืบค้นหนังสือ ฐานข้อมูลงานวิจัย และพื้นที่อ่านหนังสือ', color: 'from-amber-600 to-red-600', glow: 'rgba(217,119,6,0.3)' },
  { name: 'ห้องปฏิบัติการฟิสิกส์', short: 'PHYS', category: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม', url: 'https://sites.google.com/sci.kmutnb.ac.th/physclass/home', img: imgPhyLab, desc: 'คู่มือการทดลอง เอกสารแล็บฟิสิกส์ทั่วไป', color: 'from-emerald-500 to-green-600', glow: 'rgba(16,185,129,0.3)' },
  { name: 'กิจกรรมนักศึกษาภาควิชา IMI', short: 'IMI', category: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม', url: 'https://sites.google.com/sci.kmutnb.ac.th/imi-student-affairs/', img: imgIMIAffair, desc: 'ประชาสัมพันธ์กิจกรรมและชั่วโมงกิจกรรมนักศึกษา', color: 'from-rose-500 to-purple-600', glow: 'rgba(244,63,94,0.3)' }
];

const SERVICE_GROUPS = [
  {
    id: 'ส่วนกลางและระบบการศึกษา', title: 'ส่วนกลางและระบบการศึกษา', desc: 'ระบบบริการการศึกษา ปฏิทินการศึกษา ทุน และเว็บไซต์ทางการ',
    iconColor: 'bg-orange-50 text-orange-600 border-orange-200',
    icon: ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg> )
  },
  {
    id: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม', title: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม', desc: 'จองห้องค้นคว้ากลุ่ม ห้องอัจฉริยะ หอสมุด และสารสนเทศกิจกรรมนักศึกษา',
    iconColor: 'bg-purple-50 text-purple-600 border-purple-200',
    icon: ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> )
  }
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

// ==========================================
// 📌 Component: Section Banner (ปรับให้กว้างเต็มกรอบและมีหลายสีสัน)
// ==========================================
const SectionBanner = ({ line1, line2, variant = "website" }) => {
  // สร้างธีมสีและสไตล์ที่ต่างกันสำหรับแต่ละ Section
  const config = {
    calendar: {
      bgs: ['bg-[#3b82f6]', 'bg-[#f59e0b]', 'bg-[#10b981]', 'bg-[#8b5cf6]', 'bg-[#ec4899]', 'bg-[#0ea5e9]'],
      text: 'bg-white text-slate-800'
    },
    website: { 
      bgs: ['bg-[#a16dd1]', 'bg-[#01aa3a]', 'bg-[#f9703d]', 'bg-[#c5e9e7]', 'bg-[#df3470]', 'bg-[#dced11]'],
      text: 'bg-[#f1ede3] text-[#343330]'
    },
    exam: {
      bgs: ['bg-rose-500', 'bg-teal-500', 'bg-indigo-500', 'bg-amber-400', 'bg-fuchsia-500', 'bg-sky-400'],
      text: 'bg-rose-50/90 text-rose-950'
    },
    scholarship: {
      bgs: ['bg-amber-500', 'bg-orange-500', 'bg-yellow-400', 'bg-red-400', 'bg-pink-400', 'bg-emerald-400'],
      text: 'bg-amber-50 text-amber-950'
    },
    service: {
      bgs: ['bg-indigo-600', 'bg-cyan-500', 'bg-blue-500', 'bg-teal-400', 'bg-purple-500', 'bg-sky-300'],
      text: 'bg-indigo-50 text-indigo-950'
    },
    social: {
      bgs: ['bg-pink-500', 'bg-blue-500', 'bg-violet-500', 'bg-rose-400', 'bg-fuchsia-400', 'bg-amber-400'],
      text: 'bg-pink-50 text-pink-950'
    }
  };

  const theme = config[variant] || config.website;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.4 }}
      // เปลี่ยนเป็น w-full เพื่อให้ยืดเต็มขอบซ้ายขวาพอดีกับการ์ดด้านล่าง
      className="w-full mx-auto mb-10 flex flex-col gap-2 md:gap-3 cursor-default"
    >
      {/* 🟢 แถวที่ 1 */}
      <div className="flex gap-2 md:gap-3 h-16 md:h-24 w-full">
        {/* Shape 1 */}
        <div className={`${theme.bgs[0]} rounded-xl md:rounded-3xl w-[20%] md:w-[24%] flex items-center justify-center gap-1.5 md:gap-3 shadow-sm overflow-hidden`}>
          {variant === 'website' && <><div className="w-3.5 h-3.5 md:w-6 md:h-6 rounded-full bg-white/90"></div><div className="w-3.5 h-3.5 md:w-6 md:h-6 rounded-full bg-white/90"></div><div className="w-3.5 h-3.5 md:w-6 md:h-6 rounded-full bg-white/90"></div></>}
          {variant === 'calendar' && <div className="flex gap-1 md:gap-2"><div className="w-2 h-8 md:w-4 md:h-12 bg-white/90 rounded-sm"></div><div className="w-2 h-8 md:w-4 md:h-12 bg-white/90 rounded-sm"></div></div>}
          {variant === 'exam' && <><div className="w-2 h-8 md:w-4 md:h-12 bg-white/90 rounded-full rotate-45"></div><div className="w-2 h-8 md:w-4 md:h-12 bg-white/90 rounded-full -rotate-45"></div></>}
          {variant === 'scholarship' && <div className="w-8 h-8 md:w-14 md:h-14 bg-white/90 rounded-full flex items-center justify-center"><div className="w-4 h-4 md:w-6 md:h-6 bg-amber-500 rounded-full"></div></div>}
          {variant === 'service' && <div className="w-8 h-8 md:w-12 md:h-12 border-4 md:border-8 border-white/90 rounded-xl"></div>}
          {variant === 'social' && <div className="w-8 h-8 md:w-12 md:h-12 bg-white/90 rounded-full rounded-bl-none"></div>}
        </div>

        {/* Text 1 */}
        <div className={`${theme.text} rounded-xl md:rounded-3xl flex-1 flex items-center justify-center shadow-sm`}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight">{line1}</h2>
        </div>

        {/* Shape 2 */}
        <div className={`${theme.bgs[1]} rounded-xl md:rounded-3xl w-[18%] md:w-[20%] flex items-center justify-center shadow-sm overflow-hidden`}>
          {variant === 'website' && <div className="w-5 h-5 md:w-8 md:h-8 bg-white/90 rotate-45 rounded-sm"></div>}
          {variant === 'calendar' && <div className="w-8 h-8 md:w-12 md:h-12 bg-white/90 rounded-full"></div>}
          {variant === 'exam' && <div className="w-6 h-6 md:w-10 md:h-10 border-4 md:border-8 border-white/90 rounded-full"></div>}
          {variant === 'scholarship' && <div className="w-0 h-0 border-l-[10px] border-l-transparent border-b-[20px] border-b-white/90 border-r-[10px] border-r-transparent md:border-l-[15px] md:border-b-[30px] md:border-r-[15px]"></div>}
          {variant === 'service' && <div className="w-6 h-6 md:w-10 md:h-10 bg-white/90 rounded-full"></div>}
          {variant === 'social' && <div className="w-6 h-6 md:w-10 md:h-10 bg-white/90 rounded-lg rotate-12"></div>}
        </div>
      </div>

      {/* 🟢 แถวที่ 2 */}
      <div className="flex gap-2 md:gap-3 h-16 md:h-24 w-full">
        {/* Shape 3 */}
        <div className={`${theme.bgs[2]} rounded-xl md:rounded-3xl w-[20%] md:w-[24%] flex items-center justify-center shadow-sm overflow-hidden relative`}>
          {variant === 'website' && <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-12 md:h-12 fill-[#b3e5e4]"><circle cx="35" cy="35" r="22" /><circle cx="65" cy="35" r="22" /><circle cx="35" cy="65" r="22" /><circle cx="65" cy="65" r="22" /></svg>}
          {variant === 'calendar' && <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '12px 12px' }}></div>}
          {variant === 'exam' && <div className="w-8 h-8 md:w-12 md:h-12 bg-white/90 rotate-45"></div>}
          {variant === 'scholarship' && <><div className="absolute top-0 left-0 w-1/2 h-full bg-white/20"></div><div className="w-6 h-6 md:w-10 md:h-10 bg-white/90 rounded-full relative z-10"></div></>}
          {variant === 'service' && <div className="flex gap-1.5 md:gap-2.5"><div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-white/90 rounded-full"></div><div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-white/90 rounded-full"></div><div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-white/90 rounded-full"></div></div>}
          {variant === 'social' && <div className="w-6 h-6 md:w-10 md:h-10 border-4 md:border-[6px] border-white/90 rotate-45"></div>}
        </div>

        {/* Text 2 */}
        <div className={`${theme.text} rounded-xl md:rounded-3xl flex-1 flex items-center justify-center shadow-sm`}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight">{line2}</h2>
        </div>

        {/* Shape 4 */}
        <div className={`${theme.bgs[3]} rounded-xl md:rounded-3xl w-[12%] md:w-[15%] flex items-center justify-center shadow-sm overflow-hidden`}>
          {variant === 'website' && <svg viewBox="0 0 100 100" className="w-6 h-6 md:w-10 md:h-10 fill-[#00aa38]"><path d="M50 5 L58 22 L76 15 L78 33 L95 38 L82 50 L95 62 L78 67 L76 85 L58 78 L50 95 L42 78 L24 85 L22 67 L5 62 L18 50 L5 38 L22 33 L24 15 L42 22 Z"/></svg>}
          {variant === 'calendar' && <div className="w-6 h-6 md:w-10 md:h-10 bg-white/90 rounded-xl rotate-12"></div>}
          {variant === 'exam' && <div className="w-full h-2 md:h-4 bg-white/90 rotate-45 scale-150"></div>}
          {variant === 'scholarship' && <div className="w-6 h-6 md:w-10 md:h-10 bg-white/90 rounded-lg rotate-45"></div>}
          {variant === 'service' && <div className="w-6 h-6 md:w-10 md:h-10 border-4 md:border-[6px] border-white/90 rounded-full border-dashed"></div>}
          {variant === 'social' && <div className="flex flex-col gap-1 md:gap-2"><div className="w-6 md:w-10 h-1 md:h-1.5 bg-white/90 rounded-full"></div><div className="w-4 md:w-6 h-1 md:h-1.5 bg-white/90 rounded-full"></div></div>}
        </div>

        {/* Shape 5 */}
        <div className={`${theme.bgs[4]} rounded-xl md:rounded-3xl w-[12%] md:w-[15%] relative overflow-hidden shadow-sm`}>
           {variant === 'website' && <><div className="absolute -top-[40%] -left-[40%] w-[80%] h-[80%] bg-white/90 rounded-full"></div><div className="absolute -top-[40%] -right-[40%] w-[80%] h-[80%] bg-white/90 rounded-full"></div><div className="absolute -bottom-[40%] -left-[40%] w-[80%] h-[80%] bg-white/90 rounded-full"></div><div className="absolute -bottom-[40%] -right-[40%] w-[80%] h-[80%] bg-white/90 rounded-full"></div><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[55%] bg-white/90 rounded-full"></div></>}
           {variant === 'calendar' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[50%] bg-white/20 rotate-45"></div>}
           {variant === 'exam' && <div className="absolute -right-4 -bottom-4 w-12 h-12 md:w-20 md:h-20 bg-white/30 rounded-full"></div>}
           {variant === 'scholarship' && <><div className="absolute left-0 top-0 w-1/2 h-full bg-white/90 rounded-r-full"></div></>}
           {variant === 'service' && <div className="absolute inset-2 md:inset-4 bg-white/90 rounded-sm md:rounded-lg"></div>}
           {variant === 'social' && <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] border-[6px] md:border-[12px] border-white/30 rounded-full"></div>}
        </div>

        {/* Shape 6 (ซ่อนในจอมือถือขนาดเล็ก) */}
        <div className={`${theme.bgs[5]} rounded-xl md:rounded-3xl w-[10%] md:w-[12%] relative overflow-hidden shadow-sm hidden sm:block`}>
           {variant === 'website' && <><div className="absolute top-[-10%] -left-[60%] w-[110%] h-[120%] bg-white/90 rounded-[50%]"></div><div className="absolute top-[-10%] -right-[60%] w-[110%] h-[120%] bg-white/90 rounded-[50%]"></div></>}
           {variant === 'calendar' && <div className="absolute inset-0 flex items-center justify-center"><div className="w-3 h-3 md:w-5 md:h-5 bg-white/90 rounded-full"></div></div>}
           {variant === 'exam' && <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[30px] md:border-l-[50px] border-l-transparent border-b-[30px] md:border-b-[50px] border-b-white/90"></div>}
           {variant === 'scholarship' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 border-[3px] border-white/90 rounded-sm rotate-45"></div>}
           {variant === 'service' && <div className="w-full h-full bg-white/20"></div>}
           {variant === 'social' && <div className="absolute bottom-0 w-full h-1/2 bg-white/90 rounded-t-full"></div>}
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// 📌 Component: พื้นหลังแสงออโรร่า
// ==========================================
const AuroraBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#fcfbfe] overflow-hidden pointer-events-none">
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
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
    <motion.div animate={{ x: ["0%", "2%", "-2%", "0%"], y: ["0%", "-2%", "2%", "0%"] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-300/10 blur-[100px]" />
    <motion.div animate={{ x: ["0%", "-2%", "2%", "0%"], y: ["0%", "2%", "-2%", "0%"] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-rose-200/10 blur-[100px]" />
  </div>
);

export default function StudentServices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ทั้งหมด');
  const [activeSemester, setActiveSemester] = useState('1/2569');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ['ทั้งหมด', 'ส่วนกลางและระบบการศึกษา', 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม'];

  const visibleGroups = SERVICE_GROUPS.filter(group => activeTab === 'ทั้งหมด' || activeTab === group.id);

  const getFilteredItems = (categoryId) => {
    return ALL_SERVICES.filter(item => {
      const matchCategory = item.category === categoryId;
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.short.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  };

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 relative overflow-hidden";

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />

      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">

        {/* ---------------- Header Section ---------------- */}
        <div className="text-center max-w-4xl mx-auto pt-2 pb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
            ศูนย์รวมเว็บไซต์บริการนักศึกษา
          </h1>
          <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
            รวบรวมลิงก์บริการและระบบสารสนเทศทั้งหมดของมหาวิทยาลัย คณะ และสาขาวิชา เลื่อนเลือกใช้งานได้ครบจบในที่เดียว
          </p>
        </div>

        {/* ---------------- 📌 ปฏิทินการศึกษาและการลงทะเบียน (เพิ่มแบนเนอร์ใหม่) ---------------- */}
        <div className={`p-6 md:p-10 mb-16 ${bentoGlass} border border-slate-50`}>
          {/* เพิ่ม Banner เข้ามาใน Section นี้ */}
          <SectionBanner line1="ปฏิทิน" line2="การศึกษา" variant="calendar" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 mt-4 border-b border-slate-200/60 pb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">กำหนดการและวันลงทะเบียนเรียน</h2>
              <p className="text-slate-500 text-sm md:text-base font-medium mt-1.5">ระดับอนุปริญญา ปริญญาตรี และบัณฑิตศึกษา (ปีการศึกษา 2569)</p>
            </div>
            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl shadow-sm shrink-0">
              {['1/2569', '2/2569'].map((term) => (
                <button key={term} onClick={() => setActiveSemester(term)} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeSemester === term ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  ภาคเรียนที่ {term}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
                <h3 className="text-xl font-bold text-slate-900">กำหนดการสำคัญ</h3>
              </div>
              <div className="bg-slate-50/70 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100/50 border-b border-slate-200/80 text-slate-700"><tr><th className="py-3.5 px-4 font-bold w-[45%]">วัน/เดือน/ปี</th><th className="py-3.5 px-4 font-bold">กิจกรรม</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">{CALENDAR_DATA[activeSemester].academic.map((item, index) => (<tr key={index} className="hover:bg-white transition-colors duration-200"><td className="py-3 px-4 font-semibold text-slate-800">{item.date}</td><td className="py-3 px-4 text-slate-600 font-medium">{item.event}</td></tr>))}</tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>
                <h3 className="text-xl font-bold text-slate-900">กำหนดการลงทะเบียนเรียน</h3>
              </div>
              <div className="bg-slate-50/70 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100/50 border-b border-slate-200/80 text-slate-700"><tr><th className="py-3.5 px-4 font-bold w-[45%]">วัน/เดือน/ปี</th><th className="py-3.5 px-4 font-bold">กลุ่มนักศึกษา</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">{CALENDAR_DATA[activeSemester].registration.map((item, index) => (<tr key={index} className="hover:bg-white transition-colors duration-200"><td className="py-3 px-4 font-semibold text-indigo-700">{item.date}</td><td className="py-3 px-4 text-slate-700 font-medium">{item.target}</td></tr>))}</tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-500 mt-4 px-2 italic">* นักศึกษาต้องลงทะเบียนผ่านระบบ REG (reg.kmutnb.ac.th) ด้วยตนเอง และชำระเงินตามช่วงวัน-เวลาที่กำหนดเท่านั้น</p>
            </div>
          </div>
        </div>

        {/* ---------------- ช่องค้นหา และ Filter เว็บไซต์ ---------------- */}
        <div className="text-center max-w-4xl mx-auto pb-10">
          <div className="max-w-xl mx-auto relative group mb-8">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><svg className="w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
            <input type="text" placeholder="ค้นหาบริการที่ต้องการ เช่น REG, ทุน กยศ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-12 py-3.5 bg-white/90 backdrop-blur-md shadow-sm rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base font-medium transition-all border border-slate-100" />
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {categories.map((cat) => (<button key={cat} onClick={() => setActiveTab(cat)} className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 shadow-sm ${activeTab === cat ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-105' : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900'}`}>{cat}</button>))}
          </div>
        </div>

        {/* ---------------- 📌 1. เว็บไซต์ที่เกี่ยวข้อง ---------------- */}
        <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50`}>
          <SectionBanner line1="เว็บไซต์" line2="บริการ" variant="website" />
          
          <div className="space-y-12 mt-10">
            {visibleGroups.map((group) => {
              const services = getFilteredItems(group.id);
              if (services.length === 0) return null;
              return (
                <div key={group.id} className="pt-4 first:pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${group.iconColor}`}>{group.icon}</div>
                      <div><h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">{group.title}</h3><p className="text-xs md:text-sm text-slate-500 font-medium">{group.desc}</p></div>
                    </div>
                    <span className="self-start sm:self-center px-3.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">{services.length} บริการ</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((item, idx) => (
                      <motion.div key={idx} whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.25 }} className="relative rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden group flex flex-col p-5">
                        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.color}`}></div>
                        <div className="flex justify-between items-center mb-4 pt-1"><span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">{item.short}</span></div>
                        <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center p-3 rounded-2xl bg-slate-50 shadow-inner group-hover:scale-105 transition-transform duration-500"><img src={item.img} alt={item.name} className="w-full h-full object-contain mix-blend-multiply drop-shadow-xs" /></div>
                        <div className="text-center flex-1 flex flex-col justify-between">
                          <div><h4 className="text-sm font-black text-slate-800 mb-1.5 leading-snug group-hover:text-purple-700 transition-colors">{item.name}</h4><p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2 mb-5">{item.desc}</p></div>
                          <a href={item.url} target="_blank" rel="noreferrer" className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${item.color} shadow-sm flex items-center justify-center gap-2 hover:shadow-md transition-all active:scale-95`}>เข้าสู่เว็บไซต์ <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------- 📌 2. ระบบเช็คที่นั่งสอบ ---------------- */}
        <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50`}>
          <SectionBanner line1="ระบบเช็ค" line2="ที่นั่งสอบ" variant="exam" />
          
          <div className="mt-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 pb-5 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-sm shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">เลือกคณะเพื่อตรวจสอบ</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">ตรวจสอบห้องสอบ เลขที่นั่งสอบ และตารางสอบ</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {EXAM_SEATING_LINKS.map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`flex flex-col justify-between p-5 rounded-2xl bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] transform hover:-translate-y-1 transition-all duration-300 group ${item.hoverColor}`}
                >
                  <div className="mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${item.iconColor}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-slate-900">{item.faculty}</h4>
                  </div>
                  <div className="flex items-center text-[11px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
                    ตรวจสอบที่นั่งสอบ 
                    <svg className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- 📌 3. ทุนการศึกษา ---------------- */}
        <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50`}>
          <SectionBanner line1="ทุน" line2="การศึกษา" variant="scholarship" />
          
          <div className="mt-8 flex flex-col lg:flex-row gap-10 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-100/60 text-amber-700 text-[11px] font-black uppercase mb-5 shadow-sm tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path></svg>
                Scholarships & Opportunities
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                โอกาสและทุนการศึกษา
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                มหาวิทยาลัยและคณะวิทยาศาสตร์ประยุกต์ เล็งเห็นถึงความสำคัญของการเข้าถึงโอกาสทางการศึกษา จึงได้จัดสรร <strong>ทุนการศึกษาหลากหลายประเภท</strong> ทั้งจากงบประมาณภายในและหน่วยงานภายนอก เพื่อครอบคลุมความต้องการทุกรูปแบบ ได้แก่ <strong>ทุนเรียนดี ทุนช่วยเหลือผู้ขาดแคลนทุนทรัพย์ ทุนสร้างชื่อเสียง และทุนส่งเสริมกิจกรรม</strong> ให้นักศึกษาพัฒนาศักยภาพของตนเองได้อย่างเต็มที่
              </p>
            </div>
            
            <div className="w-full lg:w-[50%] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.a 
                whileHover={{ y: -5 }}
                href="https://sa.op.kmutnb.ac.th/scholarship/" 
                target="_blank" rel="noreferrer"
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(245,158,11,0.15)] hover:border-amber-200 transition-all group flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.315 48.315 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"></path></svg>
                </div>
                <h4 className="text-base font-black text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">ทุนระดับมหาวิทยาลัย</h4>
                <p className="text-[11px] text-slate-500 font-medium">ติดตามประกาศทุนจาก กองกิจการนักศึกษา มจพ.</p>
              </motion.a>
              
              <motion.a 
                whileHover={{ y: -5 }}
                href="http://sci.kmutnb.ac.th/content/section/10/1/%E0%B8%97%E0%B8%B8%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2" 
                target="_blank" rel="noreferrer"
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(244,63,94,0.15)] hover:border-rose-200 transition-all group flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-red-100 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"></path></svg>
                </div>
                <h4 className="text-base font-black text-slate-800 mb-2 group-hover:text-rose-600 transition-colors">ทุนระดับคณะ</h4>
                <p className="text-[11px] text-slate-500 font-medium">ประกาศทุนเฉพาะนักศึกษา คณะวิทยาศาสตร์ประยุกต์</p>
              </motion.a>
            </div>
          </div>
        </div>

        {/* ---------------- 📌 4. บริการและสวัสดิการ ---------------- */}
        <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50`}>
          <SectionBanner line1="บริการ" line2="สวัสดิการ" variant="service" />
          
          {/* 4.1 บริการสำนักคอมพิวเตอร์ มจพ. (ICIT Service) */}
          <div className="mt-10 mb-12">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#293896] shadow-lg p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-800/50">
              <div className="absolute inset-0 bg-blue-500/10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
              <div className="relative z-10 flex-1 max-w-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-md">
                    <img src={imgServiceLogo} alt="ICIT Logo" className="w-full h-full object-contain" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">ICIT Service</h2>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-blue-200 mb-3">บริการสำนักคอมพิวเตอร์และเทคโนโลยีสารสนเทศ</h3>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-6">
                  สำนักคอมพิวเตอร์และเทคโนโลยีสารสนเทศ (ICIT) มุ่งมั่นให้บริการด้านระบบสารสนเทศ เครือข่ายอินเทอร์เน็ต และซอฟต์แวร์ลิขสิทธิ์ระดับมาตรฐานสากล เพื่อสนับสนุนและยกระดับศักยภาพด้านการเรียนการสอน การวิจัย และการปฏิบัติงานของนักศึกษาและบุคลากรภายในมหาวิทยาลัยให้มีประสิทธิภาพสูงสุด
                </p>
                <a href="https://icit.kmutnb.ac.th/services-all/?category=student&subcategory=all" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white text-[#293896] px-5 py-3 rounded-full font-bold text-xs hover:bg-blue-50 transition-colors shadow-md transform hover:-translate-y-1 duration-300">
                  ไปที่งานบริการของ ICIT มจพ.
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
              </div>
              <div className="relative z-10 w-full md:w-[40%] flex justify-center items-center">
                  <img src={imgIcitService} alt="ICIT Options" className="w-full max-w-[350px] object-cover rounded-[1.5rem] shadow-[0_10px_25px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-500 border-4 border-white/10" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* ซอฟต์แวร์ลิขสิทธิ์ */}
              <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">บริการซอฟต์แวร์ลิขสิทธิ์</h3>
                  </div>
                  <a href="https://software.kmutnb.ac.th/" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition">ดาวน์โหลด</a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-auto">
                  {[
                    { name: 'Adobe', src: imgAdobe }, { name: 'Microsoft 365', src: imgMs365 },
                    { name: 'MATLAB', src: imgMatlab }, { name: 'ESET Endpoint Security', src: imgEset },
                    { name: 'Azure Dev Tools', src: imgAzer }, { name: 'SolidWorks', src: imgSolid },
                    { name: 'Google Workspace', src: imgWorkSpace }, { name: 'Foxit PDF', src: imgFoxis }
                  ].map((sw, i) => (
                    <motion.a href="https://software.kmutnb.ac.th/" target="_blank" rel="noreferrer" key={i} whileHover={{ y: -3, scale: 1.05 }} className="flex items-center justify-center rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden transition-all h-20 group">
                      <img src={sw.src} alt={sw.name} title={sw.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* บริการเครือข่าย Wi-Fi */}
              <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">บริการเครือข่ายไร้สาย</h3>
                  </div>
                  <a href="https://icit.kmutnb.ac.th/services/wi-fi/" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full hover:bg-teal-100 transition">คู่มือใช้งาน</a>
                </div>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-700">@KMUTNB</span>
                      <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-700">@KMUTNB by AIS / TRUE</span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 mb-1">กรอก User / Password ของ ICIT Account</p>
                    <p className="text-[10px] text-rose-500">* Windows 8+ และ Mac OS X เชื่อมต่อได้ทันทีโดยไม่ต้องตั้งค่าเพิ่ม</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-700">eduroam</span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <p><span className="font-bold">User:</span> s6123456789012@kmutnb.ac.th (รหัสนศ.@kmutnb.ac.th)</p>
                      <p><span className="font-bold">Pass:</span> รหัสผ่าน ICIT Account</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* บริการ IT Clinic & Hosting */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* IT Clinic */}
              <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">บริการ IT Clinic</h3>
                  </div>
                  <a href="https://it-clinic.icit.kmutnb.ac.th/" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100 transition">ติดต่อใช้บริการ</a>
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="bg-white p-3 rounded-xl border border-purple-100 text-center shadow-sm flex-1">
                    <p className="text-[10px] text-purple-700 font-bold">นักศึกษา</p>
                    <p className="text-xl font-black text-slate-800">150 <span className="text-[10px] font-normal">บาท</span></p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-pink-100 text-center shadow-sm flex-1">
                    <p className="text-[10px] text-pink-700 font-bold">บุคลากร</p>
                    <p className="text-xl font-black text-slate-800">200 <span className="text-[10px] font-normal">บาท</span></p>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm text-[10px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600"><tr><th className="py-2 px-3 font-bold">Software</th><th className="py-2 px-3 text-center">ส่วนตัว</th><th className="py-2 px-3 text-center">มจพ.</th></tr></thead>
                    <tbody className="divide-y divide-slate-100 text-slate-500">
                      <tr><td className="py-1.5 px-3 truncate max-w-[120px]">OS, Office, Antivirus</td><td className="py-1.5 px-3 text-center text-emerald-500">YES</td><td className="py-1.5 px-3 text-center text-emerald-500">YES</td></tr>
                      <tr><td className="py-1.5 px-3 truncate max-w-[120px]">Adobe, SolidWorks</td><td className="py-1.5 px-3 text-center text-emerald-500">YES</td><td className="py-1.5 px-3 text-center text-emerald-500">YES</td></tr>
                      <tr><td className="py-1.5 px-3 truncate max-w-[120px]">Microsoft Ed (นอกเหนือ Office)</td><td className="py-1.5 px-3 text-center text-emerald-500">YES</td><td className="py-1.5 px-3 text-center text-slate-300">NO</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hosting */}
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-900 to-slate-900 p-6 shadow-sm border border-slate-700 flex flex-col justify-center">
                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/10 border border-white/20 text-cyan-300 text-[9px] font-bold tracking-widest uppercase mb-3 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    Web & Database
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">บริการโฮสติ้ง</h3>
                  <p className="text-slate-300 text-xs leading-relaxed mb-5 line-clamp-3">
                    สนับสนุนพื้นที่สำหรับพัฒนาเว็บไซต์ (Web Hosting) และระบบฐานข้อมูล สำหรับนักศึกษาเพื่อผลักดันการเรียนการสอนและงานวิจัย
                  </p>
                  <a href="https://websupport.icit.kmutnb.ac.th/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xs shadow-md transform hover:-translate-y-0.5 transition-all">
                    ขอใช้บริการ <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 4.2 บัญชีธนาคารและบัตรนักศึกษา */}
          <div className="mt-12">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f8f9ff] to-[#f1f5f9] shadow-md border border-slate-200/60 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="relative z-10 flex-1 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-100/60 text-blue-700 text-[10px] font-black uppercase mb-4 shadow-sm tracking-wider">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                  Bank Account & ID Card
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] tracking-tight mb-4 leading-snug">
                  บัญชีธนาคารและบัตรประจำตัวนักศึกษา
                </h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6">
                  นักศึกษาใหม่ทุกคนจะต้อง <strong className="text-blue-800">เปิดบัญชีกับธนาคารกรุงเทพ สาขามจพ.</strong> เพื่อทำบัตรประจำตัวนักศึกษา ซึ่งจะพ่วงฟังก์ชันบัตรกดเงินสด (ATM) ในตัว
                </p>
                <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-100/60 flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-600 shrink-0"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></span>
                  <p className="text-[11px] text-slate-700 font-medium">โปรดติดตามกำหนดการนัดหมายเปิดบัญชี และรับบัตรตามประกาศมหาวิทยาลัย</p>
                </div>
              </div>
              
              <div className="relative z-10 w-full md:w-[45%] flex justify-center items-center h-48 mt-4 md:mt-0">
                  <motion.div animate={{ y: [3, -3, 3] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute z-10 right-[5%] sm:right-[15%] top-[5%] shadow-lg rounded-r-2xl rounded-l-md rotate-6 w-32 sm:w-40 h-44 sm:h-52 bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] border-l-[10px] border-[#0f172a] p-4 flex flex-col items-center justify-center text-white">
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 mb-2 flex items-center justify-center"><div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-white/40"></div></div></div>
                    <h4 className="text-[9px] sm:text-[10px] font-black tracking-widest mb-1 opacity-90">ธนาคารกรุงเทพ</h4>
                    <div className="w-10 h-[1px] bg-white/30 mb-2"></div>
                    <p className="text-[8px] sm:text-[10px] text-center opacity-90 font-medium">บัญชีสะสมทรัพย์</p>
                  </motion.div>

                  <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute z-20 left-[5%] sm:left-[10%] bottom-[5%] shadow-xl rounded-[1rem] -rotate-3 w-56 sm:w-64 h-36 sm:h-40 bg-white border border-slate-200 p-4 flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500"></div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100 shrink-0"><span className="text-[7px] text-rose-600 font-black">มจพ</span></div>
                      <div className="leading-tight"><p className="text-[8px] font-extrabold text-slate-800">มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ</p></div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="w-9 h-7 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-500 border border-yellow-600/50 p-1"><div className="w-full h-[1px] bg-yellow-700/30"></div></div>
                      <div className="w-10 h-12 bg-slate-100 border border-slate-200 rounded-md flex items-end justify-center pb-1"><svg className="w-6 h-6 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
                    </div>
                    <div className="mt-1"><p className="text-xs font-mono font-bold text-slate-800 tracking-widest">6501001234567</p></div>
                  </motion.div>
              </div>
            </div>
          </div>

          {/* 4.3 ศูนย์บริการสุขภาพ มจพ. */}
          <div className="mt-12">
            <div className="bg-slate-50/50 rounded-[2rem] border border-slate-100 p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden p-1 border border-slate-200">
                    <img src={imgHealthLogo} alt="Health Center" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">ศูนย์บริการสุขภาพ มจพ.</h3>
                    <p className="text-xs md:text-sm text-slate-500 font-medium">คลินิกเวชกรรม คลินิกสุขภาพจิต และประกันอุบัติเหตุ</p>
                  </div>
                </div>
                <a href="https://sa.op.kmutnb.ac.th/healthcenter/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-full font-bold text-xs hover:bg-emerald-100 transition-colors shadow-sm">
                  เว็บไซต์ศูนย์สุขภาพ <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div>
                    <h4 className="text-lg font-bold text-slate-800">เวลาทำการคลินิก</h4>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 group">
                    <img src={imgHealthTable} alt="ตารางแพทย์" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <a href={imgHealthTable} target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-3 py-1.5 rounded-full font-bold text-xs shadow-md flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg> ขยายรูป</a>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">ตรวจรักษาโรคทั่วไป จ่ายยา และให้คำปรึกษาด้านสุขภาพจิต (ฟรี)</p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div>
                    <h4 className="text-lg font-bold text-slate-800">ประกันอุบัติเหตุ</h4>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 group">
                    <img src={imgInsure} alt="ประกัน" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <a href={imgInsure} target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-3 py-1.5 rounded-full font-bold text-xs shadow-md flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg> ขยายรูป</a>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">ความคุ้มครองอุบัติเหตุประจำปีการศึกษา 2569</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4.4 แผนที่มหาวิทยาลัย */}
          <div className="mt-12 bg-slate-50/50 rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold text-slate-800 mb-1 tracking-tight">แผนที่มหาวิทยาลัย</h2>
              <p className="text-slate-500 font-medium text-xs md:text-sm">แผนผังอาคารเรียนและจุดสำคัญภายในมหาวิทยาลัย</p>
            </div>
            <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm group">
              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
              <img src={imgMAP160} alt="KMUTNB Map" className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <a href={imgMAP160} target="_blank" rel="noreferrer" className="bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2 rounded-full font-bold text-xs shadow-md flex items-center gap-1.5 hover:bg-slate-900 hover:text-white transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                  ดูภาพขนาดเต็ม
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ---------------- 📌 5. เพจหน่วยงานและกิจกรรม ---------------- */}
        <div className={`p-8 md:p-12 mb-16 ${bentoGlass} border border-slate-50`}>
          <SectionBanner line1="เพจ" line2="หน่วยงาน" variant="social" />
          
          <div className="text-center mb-10 mt-6 relative z-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">ช่องทางติดตามข่าวสาร</h2>
            <p className="text-slate-500 font-medium text-sm">เพจหน่วยงาน คณะ และกิจกรรมนักศึกษา</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            {/* 🟦 Facebook */}
            <div className="bg-slate-50/50 rounded-[2rem] p-6 md:p-8 border border-slate-100/80">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <h3 className="font-extrabold text-slate-800 text-xl">Facebook</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {facebookPages.map((page, idx) => (
                  <a key={idx} href={page.url} target="_blank" rel="noreferrer" className="flex items-center px-4 py-3 bg-white rounded-xl border border-slate-200/70 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1877F2] flex items-center justify-center text-white mr-3"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></div>
                    <span className="font-bold text-slate-700 text-[11px] sm:text-xs group-hover:text-[#1877F2] line-clamp-2">{page.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* 📸 Instagram */}
            <div className="bg-slate-50/50 rounded-[2rem] p-6 md:p-8 border border-slate-100/80">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </div>
                <h3 className="font-extrabold text-slate-800 text-xl">Instagram</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {instagramPages.map((page, idx) => (
                  <a key={idx} href={page.url} target="_blank" rel="noreferrer" className="flex items-center px-4 py-3 bg-white rounded-xl border border-slate-200/70 shadow-sm hover:border-pink-400 hover:shadow-md transition-all group">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-500 flex items-center justify-center text-white mr-3"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></div>
                    <span className="font-bold text-slate-700 text-[11px] sm:text-xs group-hover:text-pink-600 line-clamp-2">{page.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}