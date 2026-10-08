import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 📌 นำเข้ารูปโลโก้โซเชียลมีเดีย
import imiLogo from '../assets/IMI_Logo.png';
import bmeFamilyLogo from '../assets/bme_family.png';
import techXLogo from '../assets/TECH X CLUB.png';

// 📌 นำเข้ารูปภาพบริการจากโฟลเดอร์ assets/Website (.png / .jpg)
import imgREG from '../assets/Website/REG.png';
import imgACD from '../assets/Website/ACD.png';
import imgKMUTNB from '../assets/Website/KMUTNB.png';
import imgApplied from '../assets/Website/Applied.png';
import imgIMIAffair from '../assets/Website/IMI_Affairs.png'; 
import imgICITService from '../assets/Website/Service.png'; 
import imgAccount from '../assets/Website/Account.png';
import imgSoftware from '../assets/Website/Software.png';
import imgDigitaltest from '../assets/Website/Digitaltest.png';
import imgLibrary from '../assets/Website/Library.png';
import imgKRoom from '../assets/Website/K_room.png'; 
import imgSmartRoom from '../assets/Website/Smart_room.png'; 
import imgMOOC from '../assets/Website/Mooc.png'; 
import imgPhyLab from '../assets/Website/Phy_lab.png'; 
import imgCEM from '../assets/Website/CEM.png';
import imgKMUTNB2 from '../assets/Website/KMUTNB2.png'; 
import imgMAP160 from '../assets/Website/MAP160.jpg'; 

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
  { 
    faculty: 'คณะวิทยาศาสตร์ประยุกต์', 
    url: 'http://www.scibase.kmutnb.ac.th/examroom/datatrain.html', 
    color: 'text-amber-600', 
    bg: 'bg-amber-50 border-amber-200/60',
    hover: 'hover:border-amber-400 hover:shadow-amber-100'
  },
  { 
    faculty: 'คณะวิศวกรรมศาสตร์', 
    url: 'https://www.eng.kmutnb.ac.th/eservice/exam/seating', 
    color: 'text-red-600', 
    bg: 'bg-red-50 border-red-200/60',
    hover: 'hover:border-red-400 hover:shadow-red-100'
  },
  { 
    faculty: 'คณะครุศาสตร์อุตสาหกรรม', 
    url: 'https://exam.fte.kmutnb.ac.th/search/name', 
    color: 'text-blue-600', 
    bg: 'bg-blue-50 border-blue-200/60',
    hover: 'hover:border-blue-400 hover:shadow-blue-100'
  },
  { 
    faculty: 'คณะพัฒนาอุตสาหกรรม', 
    url: 'https://bidkmutnbexam.my.canva.site/dagzyw5euag', 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50 border-emerald-200/60',
    hover: 'hover:border-emerald-400 hover:shadow-emerald-100'
  }
];

// ==========================================
// 📌 ข้อมูลเว็บไซต์บริการทั้งหมด (แบ่ง 3 หมวดหมู่หลัก)
// ==========================================
const ALL_SERVICES = [
  // 1. ส่วนกลางและระบบการศึกษา
  { name: 'เว็บไซต์มหาวิทยาลัย', short: 'KMUTNB', category: 'ส่วนกลางและระบบการศึกษา', url: 'https://www.kmutnb.ac.th/', img: imgKMUTNB, desc: 'ข่าวสารและข้อมูลทางการของมหาวิทยาลัย', color: 'from-orange-500 to-amber-500', glow: 'rgba(249,115,22,0.3)' },
  { name: 'คณะวิทยาศาสตร์ประยุกต์', short: 'SCI', category: 'ส่วนกลางและระบบการศึกษา', url: 'http://www.sci.kmutnb.ac.th/', img: imgApplied, desc: 'เว็บไซต์หลักคณะวิทยาศาสตร์ประยุกต์', color: 'from-amber-500 to-yellow-500', glow: 'rgba(245,158,11,0.3)' },
  { name: 'กองบริการการศึกษา', short: 'ACD', category: 'ส่วนกลางและระบบการศึกษา', url: 'https://acdserv.kmutnb.ac.th/home', img: imgACD, desc: 'ปฏิทินการศึกษา ข้อมูลหลักสูตร และระเบียบ', color: 'from-rose-500 to-red-600', glow: 'rgba(244,63,94,0.3)' },
  { name: 'บริการการศึกษา (REG)', short: 'REG', category: 'ส่วนกลางและระบบการศึกษา', url: 'https://reg2.kmutnb.ac.th/registrar/', img: imgREG, desc: 'ลงทะเบียนเรียน ตรวจสอบเกรด ตารางสอน', color: 'from-emerald-500 to-teal-600', glow: 'rgba(16,185,129,0.3)' },
  { name: 'บริการเรียนออนไลน์', short: 'MOOC', category: 'ส่วนกลางและระบบการศึกษา', url: 'https://kmutnbmooc.com/', img: imgMOOC, desc: 'คอร์สเรียนออนไลน์สะสมหน่วยกิตและเสริมทักษะ', color: 'from-amber-500 to-orange-600', glow: 'rgba(245,158,11,0.3)' },
  { name: 'สอบสมรรถนะดิจิทัล', short: 'DL', category: 'ส่วนกลางและระบบการศึกษา', url: 'https://dl.kmutnb.ac.th/', img: imgDigitaltest, desc: 'ทดสอบทักษะความรู้ดิจิทัลตามเกณฑ์มหาวิทยาลัย', color: 'from-blue-500 to-cyan-500', glow: 'rgba(59,130,246,0.3)' },
  { name: 'สอบวัดระดับภาษาอังกฤษ', short: 'CEM', category: 'ส่วนกลางและระบบการศึกษา', url: 'https://cem.kmutnb.ac.th/', img: imgCEM, desc: 'ศูนย์ทดสอบทางภาษาและพัฒนาสื่อดิจิทัล', color: 'from-indigo-500 to-purple-600', glow: 'rgba(99,102,241,0.3)' },
  { name: 'กองทุนกู้ยืมเพื่อการศึกษา (กยศ.)', short: 'กยศ', category: 'ส่วนกลางและระบบการศึกษา', url: 'https://sa.op.kmutnb.ac.th/studentloan/', img: imgKMUTNB2, desc: 'ข้อมูลทุนการศึกษาและเงินกู้ยืมเพื่อการศึกษา', color: 'from-pink-500 to-rose-500', glow: 'rgba(236,72,153,0.3)' },

  // 2. เทคโนโลยีและซอฟต์แวร์
  { name: 'บริการบัญชีผู้ใช้งาน', short: 'ACC', category: 'เทคโนโลยีและซอฟต์แวร์', url: 'https://account.kmutnb.ac.th/web/', img: imgAccount, desc: 'เปลี่ยนรหัสผ่าน จัดการอีเมล และบัญชีไอที', color: 'from-sky-500 to-blue-600', glow: 'rgba(14,165,233,0.3)' },
  { name: 'ซอฟต์แวร์สำหรับการเรียน', short: 'SOFT', category: 'เทคโนโลยีและซอฟต์แวร์', url: 'https://software.kmutnb.ac.th/', img: imgSoftware, desc: 'ดาวน์โหลดลิขสิทธิ์ Windows, Office, MATLAB', color: 'from-blue-600 to-indigo-600', glow: 'rgba(37,99,235,0.3)' },
  { name: 'ช่องทางบริการ ICIT', short: 'ICIT', category: 'เทคโนโลยีและซอฟต์แวร์', url: 'https://icit.kmutnb.ac.th/services-all/?category=student&subcategory=all', img: imgICITService, desc: 'แจ้งซ่อมอุปกรณ์ บริการเครือข่าย Wi-Fi มหาวิทยาลัย', color: 'from-cyan-500 to-teal-500', glow: 'rgba(6,182,212,0.3)' },

  // 3. ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม
  { name: 'บริการห้อง K-Room', short: 'K-RM', category: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม', url: 'https://k-room.icit.kmutnb.ac.th/web/room/list-room', img: imgKRoom, desc: 'จองห้องค้นคว้ากลุ่ม ติวหนังสือ และทำงานร่วมกัน', color: 'from-indigo-500 to-violet-600', glow: 'rgba(99,102,241,0.3)' },
  { name: 'บริการห้อง Smart Room', short: 'S-RM', category: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม', url: 'https://smartroom.lib.kmutnb.ac.th/', img: imgSmartRoom, desc: 'ห้องประชุมอัจฉริยะ พร้อมอุปกรณ์มัลติมีเดีย', color: 'from-purple-500 to-fuchsia-600', glow: 'rgba(168,85,247,0.3)' },
  { name: 'หอสมุดกลาง มจพ.', short: 'LIB', category: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม', url: 'https://library.kmutnb.ac.th/', img: imgLibrary, desc: 'สืบค้นหนังสือ ฐานข้อมูลงานวิจัย และพื้นที่อ่านหนังสือ', color: 'from-amber-600 to-red-600', glow: 'rgba(217,119,6,0.3)' },
  { name: 'ห้องปฏิบัติการฟิสิกส์', short: 'PHYS', category: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม', url: 'https://sites.google.com/sci.kmutnb.ac.th/physclass/home', img: imgPhyLab, desc: 'คู่มือการทดลอง เอกสารแล็บฟิสิกส์ทั่วไป', color: 'from-emerald-500 to-green-600', glow: 'rgba(16,185,129,0.3)' },
  { name: 'กิจกรรมนักศึกษาภาควิชา IMI', short: 'IMI', category: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม', url: 'https://sites.google.com/sci.kmutnb.ac.th/imi-student-affairs/', img: imgIMIAffair, desc: 'ประชาสัมพันธ์กิจกรรมและชั่วโมงกิจกรรมนักศึกษา', color: 'from-rose-500 to-purple-600', glow: 'rgba(244,63,94,0.3)' }
];

const SERVICE_GROUPS = [
  {
    id: 'ส่วนกลางและระบบการศึกษา',
    title: 'ส่วนกลางและระบบการศึกษา',
    desc: 'ระบบบริการการศึกษา ปฏิทินการศึกษา ทุน และเว็บไซต์ทางการ',
    iconColor: 'bg-orange-50 text-orange-600 border-orange-200',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    )
  },
  {
    id: 'เทคโนโลยีและซอฟต์แวร์',
    title: 'เทคโนโลยีและซอฟต์แวร์',
    desc: 'บริการบัญชีไอที ซอฟต์แวร์ลิขสิทธิ์ และระบบแจ้งซ่อมเครือข่าย ICIT',
    iconColor: 'bg-sky-50 text-sky-600 border-sky-200',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม',
    title: 'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม',
    desc: 'จองห้องค้นคว้ากลุ่ม ห้องอัจฉริยะ หอสมุด และสารสนเทศกิจกรรมนักศึกษา',
    iconColor: 'bg-purple-50 text-purple-600 border-purple-200',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
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

  const categories = [
    'ทั้งหมด',
    'ส่วนกลางและระบบการศึกษา',
    'เทคโนโลยีและซอฟต์แวร์',
    'ทรัพยากร พื้นที่เรียนรู้ และกิจกรรม'
  ];

  const visibleGroups = SERVICE_GROUPS.filter(
    group => activeTab === 'ทั้งหมด' || activeTab === group.id
  );

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

  const totalResults = ALL_SERVICES.filter(item => {
    const matchCategory = activeTab === 'ทั้งหมด' || item.category === activeTab;
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.short.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  }).length;

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(147,51,234,0.08)] transition-all duration-500 relative overflow-hidden";

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />

      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">

        {/* ---------------- Header Section ---------------- */}
        <div className="text-center max-w-4xl mx-auto pt-2 pb-10">
          <span className="inline-block py-1 px-4 rounded-full bg-purple-100/60 backdrop-blur-sm text-purple-700 text-[11px] font-bold tracking-widest uppercase mb-4 border border-purple-200 shadow-sm">
            One-Stop Service
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
            ศูนย์รวมเว็บไซต์บริการนักศึกษา
          </h1>
          <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
            รวบรวมลิงก์บริการและระบบสารสนเทศทั้งหมดของมหาวิทยาลัย คณะ และสาขาวิชา เลื่อนเลือกใช้งานได้ครบจบในที่เดียว
          </p>
        </div>

        {/* ---------------- 📌 ปฏิทินการศึกษาและการลงทะเบียน ---------------- */}
        <div className={`p-6 md:p-10 mb-16 ${bentoGlass}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-slate-200/60 pb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                📅 ปฏิทินการศึกษาและลงทะเบียนเรียน
              </h2>
              <p className="text-slate-500 text-sm md:text-base font-medium mt-1.5">
                ระดับอนุปริญญา ปริญญาตรี และบัณฑิตศึกษา (ปีการศึกษา 2569)
              </p>
            </div>

            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50 shrink-0">
              {['1/2569', '2/2569'].map((term) => (
                <button
                  key={term}
                  onClick={() => setActiveSemester(term)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeSemester === term
                      ? 'bg-white text-purple-700 shadow-sm border border-slate-200/50'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  ภาคเรียนที่ {term}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">กำหนดการสำคัญ</h3>
              </div>
              <div className="bg-slate-50/70 rounded-2xl border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100/50 border-b border-slate-200/80 text-slate-700">
                    <tr>
                      <th className="py-3.5 px-4 font-bold w-[45%]">วัน/เดือน/ปี</th>
                      <th className="py-3.5 px-4 font-bold">กิจกรรม</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {CALENDAR_DATA[activeSemester].academic.map((item, index) => (
                      <tr key={index} className="hover:bg-white transition-colors duration-200">
                        <td className="py-3 px-4 font-semibold text-slate-800">{item.date}</td>
                        <td className="py-3 px-4 text-slate-600 font-medium">{item.event}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">กำหนดการลงทะเบียนเรียน</h3>
              </div>
              <div className="bg-slate-50/70 rounded-2xl border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100/50 border-b border-slate-200/80 text-slate-700">
                    <tr>
                      <th className="py-3.5 px-4 font-bold w-[45%]">วัน/เดือน/ปี</th>
                      <th className="py-3.5 px-4 font-bold">กลุ่มนักศึกษา</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {CALENDAR_DATA[activeSemester].registration.map((item, index) => (
                      <tr key={index} className="hover:bg-white transition-colors duration-200">
                        <td className="py-3 px-4 font-semibold text-indigo-700">{item.date}</td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{item.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-500 mt-4 px-2 italic">
                * นักศึกษาต้องลงทะเบียนผ่านระบบ REG (reg.kmutnb.ac.th) ด้วยตนเอง และชำระเงินตามช่วงวัน-เวลาที่กำหนดเท่านั้น
              </p>
            </div>
          </div>
        </div>

        {/* ---------------- ช่องค้นหา และ Filter เว็บไซต์ ---------------- */}
        <div className="text-center max-w-4xl mx-auto pb-10">
          <div className="max-w-xl mx-auto relative group mb-8">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="ค้นหาบริการที่ต้องการ เช่น REG, ICIT, ทุน กยศ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm text-base font-medium transition-all"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 shadow-sm ${
                  activeTab === cat
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-105'
                    : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ---------------- 📌 เว็บไซต์ที่เกี่ยวข้อง ---------------- */}
        <div className="mb-12">
          <div className="space-y-12">
            {visibleGroups.map((group) => {
              const services = getFilteredItems(group.id);
              if (services.length === 0) return null;

              return (
                <div 
                  key={group.id} 
                  className="rounded-[2.5rem] bg-white/80 backdrop-blur-xl border border-slate-200/70 p-6 md:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-100">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs ${group.iconColor}`}>
                        {group.icon}
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                          {group.title}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-500 font-medium">
                          {group.desc}
                        </p>
                      </div>
                    </div>
                    <span className="self-start sm:self-center px-3.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                      {services.length} บริการ
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((item, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -6, scale: 1.02 }}
                        transition={{ duration: 0.25 }}
                        className="relative rounded-2xl bg-white border border-slate-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.04)] overflow-hidden group flex flex-col p-5"
                        style={{ boxShadow: `0 12px 30px -5px ${item.glow}` }}
                      >
                        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${item.color}`}></div>
                        <div className="flex justify-between items-center mb-4 pt-1">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {item.short}
                          </span>
                        </div>
                        <div className="relative w-28 h-28 mx-auto mb-4 flex items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
                          <img src={item.img} alt={item.name} className="w-full h-full object-contain mix-blend-multiply drop-shadow-xs" />
                        </div>
                        <div className="text-center flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-base font-black text-slate-900 mb-1.5 leading-snug group-hover:text-purple-700 transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-2 mb-5">
                              {item.desc}
                            </p>
                          </div>
                          <a href={item.url} target="_blank" rel="noreferrer" className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${item.color} shadow-sm flex items-center justify-center gap-2 hover:shadow-md transition-all active:scale-95`}>
                            เข้าสู่เว็บไซต์ 
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}

            {totalResults === 0 && (
              <div className="w-full py-20 text-center rounded-[2.5rem] bg-white/70 border border-slate-200/80">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-slate-500 font-bold text-base">ไม่พบบริการที่คุณค้นหา</p>
                <p className="text-slate-400 text-xs mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่นดูอีกครั้ง</p>
              </div>
            )}
          </div>
        </div>

        {/* ---------------- 📌 ระบบเช็คที่นั่งสอบ ---------------- */}
        <div className={`p-8 md:p-10 mb-20 ${bentoGlass}`}>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 pb-5 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200 shadow-sm shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">ระบบเช็คที่นั่งสอบ</h3>
              <p className="text-sm text-slate-500 font-medium">ตรวจสอบห้องสอบ เลขที่นั่งสอบ และตารางสอบแยกตามคณะ</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EXAM_SEATING_LINKS.map((item, idx) => (
              <a 
                key={idx} 
                href={item.url} 
                target="_blank" 
                rel="noreferrer"
                className={`flex flex-col justify-between p-5 rounded-2xl border bg-white shadow-sm transition-all duration-300 group ${item.hover}`}
              >
                <div className="mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${item.bg} ${item.color}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <h4 className="text-base font-bold text-slate-800 leading-snug group-hover:text-slate-900">{item.faculty}</h4>
                </div>
                <div className="flex items-center text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
                  ตรวจสอบที่นั่งสอบ
                  <svg className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ---------------- 📌 แผนที่มหาวิทยาลัย ---------------- */}
        <div className={`p-8 md:p-14 mb-20 ${bentoGlass}`}>
          <div className="text-center mb-8 relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">แผนที่มหาวิทยาลัย</h2>
            <p className="text-slate-600 font-medium text-base md:text-lg max-w-2xl mx-auto">
              แผนผังอาคารเรียนและจุดสำคัญภายในมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
            </p>
          </div>
          <div className="relative w-full overflow-hidden rounded-3xl border-4 border-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] group cursor-pointer bg-slate-50">
            <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
            <img src={imgMAP160} alt="KMUTNB Map" className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <a href={imgMAP160} target="_blank" rel="noreferrer" className="bg-white/95 backdrop-blur-md text-slate-900 px-6 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 hover:bg-slate-900 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                คลิกดูภาพแผนที่ขนาดเต็ม
              </a>
            </div>
          </div>
        </div>

        {/* ---------------- 📌 เพจหน่วยงานและกิจกรรม (ปรับปรุงใหม่ตามต้นแบบ) ---------------- */}
        <div className="bg-white rounded-[3rem] p-8 md:p-14 border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.04)] relative overflow-hidden">
          
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">เพจหน่วยงานและกิจกรรม</h2>
            <p className="text-slate-500 font-medium text-base">ติดตามข้อมูลข่าวสารจากส่วนกลาง คณะ และสโมสรนักศึกษา</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 relative z-10">
            
            {/* 🟦 ฝั่ง Facebook */}
            <div className="bg-slate-50/50 rounded-[2.5rem] p-6 md:p-10 border border-slate-100/80">
              <div className="flex items-center gap-3.5 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <h3 className="font-extrabold text-slate-900 text-xl md:text-2xl">Facebook Pages</h3>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {facebookPages.map((page, idx) => (
                  <a key={idx} href={page.url} target="_blank" rel="noreferrer" 
                     className="flex items-center px-5 py-3.5 bg-white rounded-full border border-slate-200/70 shadow-sm hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 group transform hover:-translate-y-1">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white mr-3 shadow-md shadow-[#1877F2]/20">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </div>
                    <span className="font-bold text-slate-700 text-xs sm:text-sm group-hover:text-[#1877F2] transition-colors leading-tight line-clamp-2">
                      {page.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* 📸 ฝั่ง Instagram */}
            <div className="bg-slate-50/50 rounded-[2.5rem] p-6 md:p-10 border border-slate-100/80">
              <div className="flex items-center gap-3.5 mb-8">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <h3 className="font-extrabold text-slate-900 text-xl md:text-2xl">Instagram</h3>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {instagramPages.map((page, idx) => (
                  <a key={idx} href={page.url} target="_blank" rel="noreferrer" 
                     className="flex items-center px-5 py-3.5 bg-white rounded-full border border-slate-200/70 shadow-sm hover:border-pink-400 hover:shadow-md hover:shadow-pink-500/10 transition-all duration-300 group transform hover:-translate-y-1">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-500 flex items-center justify-center text-white mr-3 shadow-md shadow-pink-500/20">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </div>
                    <span className="font-bold text-slate-700 text-xs sm:text-sm group-hover:text-pink-600 transition-colors leading-tight line-clamp-2">
                      {page.name}
                    </span>
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