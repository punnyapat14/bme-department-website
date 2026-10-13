import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground, SectionBanner } from '../../components/ThemeElements';
import ThailandAlumniMap from '../../components/ThailandAlumniMap';

// ==========================================
// 📌 หมวดหมู่สายอาชีพหลักของศิษย์เก่า BME + สี HSL สำหรับ Donut Chart
// ==========================================
const CAREER_CATEGORIES = [
  {
    key: 'วิศวกรซ่อมบำรุง (Service Engineer)',
    shortLabel: 'วิศวกรซ่อมบำรุง / บริการ',
    subLabel: 'Service & Maintenance Engineer',
    color: 'hsl(262.1 83.3% 57.8%)', // สีม่วง
    chip: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    key: 'ผู้เชี่ยวชาญผลิตภัณฑ์ (Product Specialist)',
    shortLabel: 'ผู้เชี่ยวชาญผลิตภัณฑ์',
    subLabel: 'Product / Application Specialist',
    color: 'hsl(346.8 77.2% 49.8%)', // สีชมพูเข้ม/โรส
    chip: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    key: 'ฝ่ายขายเครื่องมือแพทย์ (Medical Sales)',
    shortLabel: 'เซลส์ขายเครื่องมือแพทย์',
    subLabel: 'Medical Sales Engineer',
    color: 'hsl(37.7 92.1% 50.2%)', // สีส้มอมเหลือง
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    key: 'นักวิจัยและพัฒนา (R&D / AI & Software)',
    shortLabel: 'นักวิจัยและพัฒนา / AI',
    subLabel: 'R&D / Medical Software & AI',
    color: 'hsl(214.7 95% 45%)', // สีน้ำเงิน
    chip: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    key: 'วิศวกรโรงพยาบาล (Hospital Engineer)',
    shortLabel: 'วิศวกรโรงพยาบาล / คลินิก',
    subLabel: 'Hospital / Clinical Engineer',
    color: 'hsl(160.1 84.1% 39.4%)', // สีเขียวอมฟ้า
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    key: 'อื่นๆ (ศึกษาต่อ / ธุรกิจ / อุตสาหกรรม)',
    shortLabel: 'สายงานอื่นๆ / ศึกษาต่อ',
    subLabel: 'Further Study / Industry / Business',
    color: 'hsl(215.4 16.3% 56.9%)', // สีเทาอมฟ้า
    chip: 'bg-slate-100 text-slate-700 border-slate-200',
  },
];

// ==========================================
// 📌 Component: Interactive Donut Chart (ฝังในไฟล์เดียวพร้อมใช้งาน)
// ==========================================
const DonutChart = ({
  data,
  size = 260,
  strokeWidth = 32,
  animationDuration = 1.1,
  animationDelayPerSegment = 0.06,
  hoveredLabel,
  selectedLabel,
  onSegmentHover,
  onSegmentClick,
  centerContent,
}) => {
  const radius = (size - strokeWidth) / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let accumulatedValue = 0;

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 overflow-visible">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />

        {data.map((segment, index) => {
          if (segment.value <= 0 || total <= 0) return null;

          const percentage = segment.value / total;
          const dashLength = percentage * circumference;
          const gap = data.filter((d) => d.value > 0).length > 1 ? 3 : 0;
          const visibleStroke = Math.max(0, dashLength - gap);
          const strokeDashoffset = -((accumulatedValue / total) * circumference);

          accumulatedValue += segment.value;

          const isHovered = hoveredLabel === segment.label;
          const isSelected = selectedLabel === segment.key;
          const isDimmed = (hoveredLabel && !isHovered) || (!hoveredLabel && selectedLabel !== 'ALL' && !isSelected);

          return (
            <motion.circle
              key={segment.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={segment.color}
              strokeLinecap="butt"
              initial={{ strokeDasharray: `0 ${circumference}`, strokeDashoffset }}
              animate={{
                strokeDasharray: `${visibleStroke} ${circumference}`,
                strokeDashoffset,
                strokeWidth: isHovered || isSelected ? strokeWidth + 7 : strokeWidth,
                opacity: isDimmed ? 0.45 : 1,
              }}
              transition={{
                strokeDasharray: {
                  duration: animationDuration,
                  delay: index * animationDelayPerSegment,
                  ease: "easeOut",
                },
                strokeWidth: { duration: 0.2 },
                opacity: { duration: 0.2 },
              }}
              className="cursor-pointer"
              onMouseEnter={() => onSegmentHover && onSegmentHover(segment.label)}
              onMouseLeave={() => onSegmentHover && onSegmentHover(null)}
              onClick={() => onSegmentClick && onSegmentClick(segment.key)}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-8">
        {centerContent}
      </div>
    </div>
  );
};

// ==========================================
// 📌 ข้อมูลศิษย์เก่า (เพิ่มฟิลด์ province สำหรับแสดงผลบนแผนที่ประเทศไทย)
// ==========================================
const mockAlumniData = [
  {
    id: 1,
    generation: "1",
    name: "นายปุญญพัฒน์ หล่าบุตรศรี",
    age: 21,
    province: "กรุงเทพมหานคร",
    faculty: "คณะวิทยาศาสตร์ประยุกต์ มจพ.",
    field: "วิศวกรรมชีวการแพทย์",
    category: "นักวิจัยและพัฒนา (R&D / AI & Software)",
    position: "AI Developer / Web Developer",
    company: "WelTech Medical",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&q=80",
    degree: "วท.บ. วิศวกรรมชีวการแพทย์",
    description: "ผมมีความสนใจและเชี่ยวชาญด้านการพัฒนา Web Application แบบ Full-stack รวมถึงการประยุกต์ใช้ AI และ Machine Learning ในวงการแพทย์ ผลงานที่ภาคภูมิใจคือการพัฒนาแอปพลิเคชัน WelTech ซึ่งใช้โมเดล YOLO ในการตรวจจับและจำแนกเซลล์เม็ดเลือดแบบอัตโนมัติ นอกจากนี้ผมยังมีประสบการณ์ในการทำระบบ IoT และ Embedded Systems สำหรับอุปกรณ์ทางการแพทย์อีกด้วย",
    quote: "เทคโนโลยีที่ดี คือเทคโนโลยีที่สร้างผลลัพธ์ที่มีความหมายต่อชีวิตผู้คน ผมภูมิใจที่ได้นำความรู้ทางวิศวกรรมชีวการแพทย์มาพัฒนาซอฟต์แวร์ที่ช่วยยกระดับวงการสาธารณสุข",
    publishedDate: "26/09/2026 12:50 pm"
  },
  {
    id: 2,
    generation: "2",
    name: "คุณสมรักษ์ สารภี",
    age: 32,
    province: "ภูเก็ต",
    faculty: "คณะวิทยาศาสตร์ประยุกต์ มจพ.",
    field: "วิศวกรรมชีวการแพทย์",
    category: "วิศวกรโรงพยาบาล (Hospital Engineer)",
    position: "วิศวกรชีวการแพทย์ชำนาญการ",
    company: "โรงพยาบาลศูนย์การแพทย์",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fit=crop&w=300&q=80",
    degree: "วท.บ. วิศวกรรมชีวการแพทย์",
    description: "ดูแลระบบบริหารจัดการเครื่องมือแพทย์ภายในโรงพยาบาล วางแผนการบำรุงรักษาเชิงป้องกัน (PM) และสอบเทียบเครื่องมือแพทย์ให้พร้อมใช้งานอย่างปลอดภัย...",
    quote: "ความแม่นยำและพร้อมใช้งานของเครื่องมือแพทย์ คือหัวใจสำคัญของความปลอดภัยของผู้ป่วย",
    publishedDate: "15/08/2026 09:30 am"
  },
  {
    id: 3,
    generation: "1",
    name: "คุณวิสูจน์ อ่อนละออ",
    age: 35,
    province: "สมุทรปราการ",
    faculty: "คณะวิทยาศาสตร์ประยุกต์ มจพ.",
    field: "วิศวกรรมชีวการแพทย์",
    category: "อื่นๆ (ศึกษาต่อ / ธุรกิจ / อุตสาหกรรม)",
    position: "รองผู้จัดการทั่วไป",
    company: "บริษัท โตโยต้า มอเตอร์ เอเชีย (ประเทศไทย) จำกัด",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?fit=crop&w=300&q=80",
    degree: "วท.บ. วิศวกรรมชีวการแพทย์",
    description: "ดูแลภาพรวมของสายการผลิตและนำระบบอัตโนมัติมาประยุกต์ใช้ในโรงงานอุตสาหกรรม...",
    quote: "วิศวกรรมชีวการแพทย์สอนให้เราคิดอย่างเป็นระบบ ซึ่งสามารถประยุกต์ใช้ได้กับทุกอุตสาหกรรม",
    publishedDate: "02/09/2026 14:15 pm"
  },
  {
    id: 4,
    generation: "3",
    name: "คุณกิตติพงศ์ วงศ์สวัสดิ์",
    age: 29,
    province: "เชียงใหม่",
    faculty: "คณะวิทยาศาสตร์ประยุกต์ มจพ.",
    field: "วิศวกรรมชีวการแพทย์",
    category: "วิศวกรซ่อมบำรุง (Service Engineer)",
    position: "Senior Field Service Engineer",
    company: "Siemens Healthineers Thailand",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=300&q=80",
    degree: "วท.บ. วิศวกรรมชีวการแพทย์",
    description: "รับผิดชอบงานติดตั้ง ซ่อมบำรุง และสอบเทียบเครื่องตรวจวินิจฉัยทางรังสีวิทยาและเครื่อง MRI ให้กับโรงพยาบาลชั้นนำในเขตภาคเหนือ...",
    quote: "การแก้ปัญหาหน้างานอย่างรวดเร็วและแม่นยำ ช่วยให้โรงพยาบาลดูแลผู้ป่วยได้อย่างต่อเนื่อง",
    publishedDate: "10/09/2026 11:20 am"
  },
  {
    id: 5,
    generation: "4",
    name: "คุณพิมพ์ชนก รัตนากร",
    age: 28,
    province: "กรุงเทพมหานคร",
    faculty: "คณะวิทยาศาสตร์ประยุกต์ มจพ.",
    field: "วิศวกรรมชีวการแพทย์",
    category: "ผู้เชี่ยวชาญผลิตภัณฑ์ (Product Specialist)",
    position: "Senior Product Specialist (Ultrasound)",
    company: "GE HealthCare Thailand",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?fit=crop&w=300&q=80",
    degree: "วท.บ. วิศวกรรมชีวการแพทย์",
    description: "ให้คำปรึกษา สาธิตการใช้งาน และอบรมทีมแพทย์และพยาบาลในการใช้อุปกรณ์อัลตราซาวนด์ทางการแพทย์ขั้นสูง...",
    quote: "การเป็นตัวกลางเชื่อมโยงเทคโนโลยีซับซ้อนให้บุคลากรทางการแพทย์ใช้งานได้เต็มประสิทธิภาพคืองานที่ท้าทายและภูมิใจ",
    publishedDate: "18/09/2026 16:00 pm"
  },
  {
    id: 6,
    generation: "5",
    name: "คุณธนภัทร เจริญผล",
    age: 27,
    province: "ขอนแก่น",
    faculty: "คณะวิทยาศาสตร์ประยุกต์ มจพ.",
    field: "วิศวกรรมชีวการแพทย์",
    category: "ฝ่ายขายเครื่องมือแพทย์ (Medical Sales)",
    position: "Medical Equipment Sales Executive",
    company: "DKSH (Thailand) Limited",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=300&q=80",
    degree: "วท.บ. วิศวกรรมชีวการแพทย์",
    description: "ดูแลการขายและวางแผนโซลูชันเครื่องมือแพทย์สำหรับห้องผ่าตัดและหอผู้ป่วยวิกฤต (ICU) ให้แก่โรงพยาบาลรัฐและเอกชนในเขตภาคตะวันออกเฉียงเหนือ...",
    quote: "พื้นฐานทางวิศวกรรมทำให้เราเข้าใจสินค้าอย่างลึกซึ้ง และแนะนำโซลูชันที่ตอบโจทย์โรงพยาบาลได้ตรงจุด",
    publishedDate: "21/09/2026 10:15 am"
  },
  {
    id: 7,
    generation: "6",
    name: "คุณณัฐวุฒิ ศรีสุวรรณ",
    age: 25,
    province: "นนทบุรี",
    faculty: "คณะวิทยาศาสตร์ประยุกต์ มจพ.",
    field: "วิศวกรรมชีวการแพทย์",
    category: "วิศวกรซ่อมบำรุง (Service Engineer)",
    position: "Biomedical Service Engineer",
    company: "PCL Holding Co., Ltd.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=300&q=80",
    degree: "วท.บ. วิศวกรรมชีวการแพทย์",
    description: "ดูแลงานซ่อมบำรุงและวิเคราะห์การทำงานของเครื่องตรวจวิเคราะห์ทางห้องปฏิบัติการทางการแพทย์ (In-vitro Diagnostics Analyzer)...",
    quote: "ทุกการซ่อมบำรุงและสอบเทียบที่แม่นยำ คือความมั่นใจของผลตรวจทางห้องปฏิบัติการ",
    publishedDate: "25/09/2026 13:40 pm"
  },
  {
    id: 8,
    generation: "6",
    name: "คุณลลิตา เกียรติสกุล",
    age: 25,
    province: "ชลบุรี",
    faculty: "คณะวิทยาศาสตร์ประยุกต์ มจพ.",
    field: "วิศวกรรมชีวการแพทย์",
    category: "ผู้เชี่ยวชาญผลิตภัณฑ์ (Product Specialist)",
    position: "Application Specialist",
    company: "Medtronic Thailand",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=300&auto=format&fit=crop",
    degree: "วท.บ. วิศวกรรมชีวการแพทย์",
    description: "สนับสนุนข้อมูลทางเทคนิคและการใช้งานอุปกรณ์การแพทย์ในห้องผ่าตัดร่วมกับศัลยแพทย์ผู้เชี่ยวชาญในพื้นที่ภาคตะวันออก...",
    quote: "ความรู้จากห้องเรียน BME ทำให้เราพร้อมทำงานร่วมกับทีมแพทย์ในระดับสากล",
    publishedDate: "28/09/2026 15:10 pm"
  }
];

// สไตล์กลางที่ใช้ร่วมกับหน้าอื่น
const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden";
const subCard = "bg-slate-50/60 rounded-[2rem] border border-slate-100 shadow-sm";

const getCategoryStyle = (category) => {
  const found = CAREER_CATEGORIES.find((c) => c.key === category);
  return found ? found.chip : 'bg-slate-100 text-slate-700 border-slate-200';
};

export default function Directory() {
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState('ALL');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedAlumni]);

  // 📌 คำนวณข้อมูลสำหรับ DonutChart (สัดส่วนสายอาชีพ)
  const chartData = useMemo(() => {
    const knownKeys = CAREER_CATEGORIES.map((c) => c.key);

    return CAREER_CATEGORIES.map((cat) => {
      let value = 0;
      if (cat.key.startsWith('อื่นๆ')) {
        value = mockAlumniData.filter(
          (a) => a.category === cat.key || !knownKeys.includes(a.category)
        ).length;
      } else {
        value = mockAlumniData.filter((a) => a.category === cat.key).length;
      }
      return {
        ...cat,
        label: cat.shortLabel,
        value,
      };
    });
  }, []);

  // 📌 คำนวณจำนวนศิษย์เก่าแยกตามจังหวัด สำหรับส่งให้ ThailandAlumniMap
  const provinceCounts = useMemo(() => {
    return mockAlumniData.reduce((acc, alumni) => {
      const prov = (alumni.province || '').trim();
      if (prov) {
        acc[prov] = (acc[prov] || 0) + 1;
      }
      return acc;
    }, {});
  }, []);

  const totalAlumniCount = useMemo(
    () => chartData.reduce((sum, d) => sum + d.value, 0),
    [chartData]
  );

  // หา Segment ที่กำลังถูกชี้ (Hover) หรือกำลังถูกคลิกเลือกกรอง (Selected)
  const activeSegment = useMemo(() => {
    if (hoveredSegment) {
      return chartData.find((s) => s.label === hoveredSegment) || null;
    }
    if (selectedCategoryFilter !== 'ALL') {
      return chartData.find((s) => s.key === selectedCategoryFilter) || null;
    }
    return null;
  }, [hoveredSegment, selectedCategoryFilter, chartData]);

  const displayValue = activeSegment ? activeSegment.value : totalAlumniCount;
  const displayLabel = activeSegment ? activeSegment.label : "ศิษย์เก่าทั้งหมด";
  const displayPercentage =
    activeSegment && totalAlumniCount > 0
      ? (activeSegment.value / totalAlumniCount) * 100
      : 100;

  // 📌 กรองข้อมูลตารางตามคำค้นหา + สายอาชีพ (DonutChart) + จังหวัด (ThailandAlumniMap)
  const filteredAlumni = useMemo(() => {
    return mockAlumniData.filter((alumni) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        alumni.name.toLowerCase().includes(q) ||
        alumni.category.toLowerCase().includes(q) ||
        alumni.position.toLowerCase().includes(q) ||
        alumni.company.toLowerCase().includes(q) ||
        (alumni.province || '').toLowerCase().includes(q);

      const matchCat =
        selectedCategoryFilter === 'ALL' || alumni.category === selectedCategoryFilter;

      const matchProv =
        selectedProvinceFilter === 'ALL' ||
        alumni.province === selectedProvinceFilter;

      return matchSearch && matchCat && matchProv;
    });
  }, [searchTerm, selectedCategoryFilter, selectedProvinceFilter]);

  const handleToggleCategory = (categoryKey) => {
    setSelectedCategoryFilter((prev) => (prev === categoryKey ? 'ALL' : categoryKey));
  };

  const handleSelectProvinceFromMap = (provObj) => {
    if (!provObj) {
      setSelectedProvinceFilter('ALL');
    } else {
      setSelectedProvinceFilter(provObj.nameTH);
    }
  };

  // ---------------------------------------------------------------------------
  // ส่วนที่ 1: ตารางแสดงรายชื่อศิษย์เก่า + Donut Chart + แผนที่ประเทศไทย
  // ---------------------------------------------------------------------------
  if (!selectedAlumni) {
    return (
      <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
        <AuroraBackground />

        <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">

          {/* Header */}
          <div className="text-center max-w-4xl mx-auto pt-2 pb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
              BME Alumni Directory
            </h1>
            <p className="font-medium text-slate-600 text-lg leading-relaxed mx-auto max-w-2xl">
              ทำเนียบเครือข่ายศิษย์เก่า สาขาวิชาวิศวกรรมชีวการแพทย์
            </p>
          </div>

          <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
            
            <SectionBanner text="ทำเนียบศิษย์เก่า" variant="website" />

            {/* ================= 🍩 1. การ์ดสถิติ Donut Chart (สัดส่วนสายอาชีพ) ================= */}
            <div className="my-8 bg-white/95 border border-slate-100 shadow-lg rounded-[2rem] p-6 md:p-10 max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
                  สัดส่วนสายอาชีพศิษย์เก่า (Career Breakdown)
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  เลื่อนเมาส์ชี้เพื่อดูสัดส่วน หรือคลิกที่รายการเพื่อกรองรายชื่อในตาราง
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* ฝั่งซ้าย: วงกลม Donut Chart */}
                <div className="md:col-span-5 flex items-center justify-center">
                  <DonutChart
                    data={chartData}
                    size={240}
                    strokeWidth={30}
                    animationDuration={1.2}
                    animationDelayPerSegment={0.05}
                    hoveredLabel={hoveredSegment}
                    selectedLabel={selectedCategoryFilter}
                    onSegmentHover={setHoveredSegment}
                    onSegmentClick={handleToggleCategory}
                    centerContent={
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={displayLabel}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2, ease: "circOut" }}
                          className="flex flex-col items-center justify-center text-center"
                        >
                          <p className="text-slate-500 text-xs font-bold truncate max-w-[140px]">
                            {displayLabel}
                          </p>
                          <p className="text-4xl font-black text-slate-900 my-0.5">
                            {displayValue}
                          </p>
                          {activeSegment ? (
                            <p
                              className="text-sm font-extrabold"
                              style={{ color: activeSegment.color }}
                            >
                              [{displayPercentage.toFixed(0)}%]
                            </p>
                          ) : (
                            <p className="text-xs font-bold text-slate-400">
                              คนในระบบ
                            </p>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    }
                  />
                </div>

                {/* ฝั่งขวา: รายการ Legend แต่ละสายอาชีพ */}
                <div className="md:col-span-7 flex flex-col space-y-2 w-full pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-8">
                  {chartData.map((segment, index) => {
                    const pct = totalAlumniCount > 0 ? ((segment.value / totalAlumniCount) * 100).toFixed(0) : 0;
                    const isHovered = hoveredSegment === segment.label;
                    const isSelected = selectedCategoryFilter === segment.key;

                    return (
                      <motion.div
                        key={segment.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.08, duration: 0.35 }}
                        onMouseEnter={() => setHoveredSegment(segment.label)}
                        onMouseLeave={() => setHoveredSegment(null)}
                        onClick={() => handleToggleCategory(segment.key)}
                        className={`flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                          isSelected
                            ? 'bg-purple-50/90 border-purple-300 shadow-sm'
                            : isHovered
                            ? 'bg-slate-100/80 border-slate-200'
                            : 'bg-transparent border-transparent hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <span
                            className="h-3.5 w-3.5 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: segment.color }}
                          />
                          <div className="truncate">
                            <span className="text-sm font-bold text-slate-800 block truncate">
                              {segment.label}
                            </span>
                            <span className="text-[11px] font-medium text-slate-400 block truncate">
                              {segment.subLabel}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 ml-3">
                          <span className="text-xs font-bold text-slate-400">
                            ({pct}%)
                          </span>
                          <span className="text-sm font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full min-w-[44px] text-center">
                            {segment.value} คน
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}

                  {selectedCategoryFilter !== 'ALL' && (
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedCategoryFilter('ALL')}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                      >
                        แสดงทุกสายอาชีพทั้งหมด ({totalAlumniCount} คน)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ================= 🗺️ 2. แผนที่ประเทศไทยแสดงการกระจายตัวของศิษย์เก่า ================= */}
            <div className="my-10">
              <ThailandAlumniMap
                provinceData={provinceCounts}
                onSelectProvince={handleSelectProvinceFromMap}
              />
            </div>

            {/* แถบแสดงสถานะตัวกรอง (เมื่อมีการเลือกสายอาชีพ หรือ เลือกจังหวัดจากแผนที่) */}
            {(selectedCategoryFilter !== 'ALL' || selectedProvinceFilter !== 'ALL') && (
              <div className="max-w-3xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 bg-purple-50/90 border border-purple-200 rounded-2xl px-5 py-3 shadow-2xs">
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-purple-900">
                  <span>กำลังกรองรายชื่อ:</span>
                  {selectedCategoryFilter !== 'ALL' && (
                    <span className="px-3 py-1 rounded-full bg-white border border-purple-200 text-purple-700">
                      สายงาน: {selectedCategoryFilter}
                    </span>
                  )}
                  {selectedProvinceFilter !== 'ALL' && (
                    <span className="px-3 py-1 rounded-full bg-white border border-rose-200 text-rose-700">
                      จังหวัด: {selectedProvinceFilter}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategoryFilter('ALL');
                    setSelectedProvinceFilter('ALL');
                  }}
                  className="text-xs font-black text-rose-600 hover:text-rose-700 bg-white px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs cursor-pointer"
                >
                  ล้างตัวกรองทั้งหมด ✕
                </button>
              </div>
            )}

            {/* ช่องค้นหา */}
            <div className="max-w-xl mx-auto relative group mb-8 mt-6">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input
                type="text"
                placeholder="ค้นหาชื่อ, สายอาชีพ, จังหวัด หรือบริษัท..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/90 backdrop-blur-md shadow-sm rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base font-medium transition-all border border-slate-100"
              />
            </div>

            {/* จำนวนผลลัพธ์ */}
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-400 rounded-full"></span>
                รายชื่อศิษย์เก่า
              </h2>
              <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                {filteredAlumni.length} คน
              </span>
            </div>

            {/* ตาราง */}
            <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-slate-900 via-purple-900 to-rose-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold tracking-wider">Class of</th>
                      <th className="px-6 py-4 text-left text-xs font-bold tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold tracking-wider">Age</th>
                      <th className="px-6 py-4 text-left text-xs font-bold tracking-wider">Province</th>
                      <th className="px-6 py-4 text-left text-xs font-bold tracking-wider">Faculty / Institute</th>
                      <th className="px-6 py-4 text-left text-xs font-bold tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-bold tracking-wider">Title/Company</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAlumni.map((alumni) => (
                      <tr key={alumni.id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-rose-400 text-white text-xs font-bold shadow-sm">BME {alumni.generation}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedAlumni(alumni)}
                            className="text-slate-900 hover:text-purple-700 font-bold transition-colors text-sm cursor-pointer text-left"
                          >
                            {alumni.name}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{alumni.age || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                            📍 {alumni.province || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{alumni.faculty}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full border text-[11px] font-bold ${getCategoryStyle(alumni.category)}`}>{alumni.category}</span>
                        </td>
                        <td className="px-6 py-4 text-sm min-w-[220px]">
                          <span className="font-bold text-slate-800 block">{alumni.position}</span>
                          <span className="text-slate-500 text-xs mt-0.5 block font-medium">{alumni.company}</span>
                        </td>
                      </tr>
                    ))}
                    {filteredAlumni.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-6 py-10 text-center text-slate-500 font-medium">ไม่พบข้อมูลศิษย์เก่าที่คุณค้นหา</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // ส่วนที่ 2: หน้าโปรไฟล์ส่วนตัว (Alumni Profile Detail)
  // ---------------------------------------------------------------------------
  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />

      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">

        {/* ปุ่มย้อนกลับ */}
        <button
          onClick={() => setSelectedAlumni(null)}
          className="flex items-center text-slate-700 hover:text-white hover:bg-slate-900 mb-6 text-sm font-bold transition-all bg-white/80 backdrop-blur-md border border-slate-200 rounded-full px-5 py-2 w-fit shadow-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          ย้อนกลับไปหน้า Alumni Directory
        </button>

        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          <SectionBanner text="โปรไฟล์ศิษย์เก่า" variant="exam" />

          {/* หัวข้อชื่อและตำแหน่ง */}
          <div className="text-center mb-10 mt-6">
            <span className={`inline-block px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider mb-4 ${getCategoryStyle(selectedAlumni.category)}`}>
              {selectedAlumni.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 mb-3">
              {selectedAlumni.name}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 font-medium">{selectedAlumni.position}</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* คอลัมน์ซ้าย: รูปภาพและ Quick Fact */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
              <div className="bg-white p-2 shadow-lg rounded-[2rem] border border-slate-100">
                <img
                  src={selectedAlumni.image}
                  alt={selectedAlumni.name}
                  className="w-full h-80 object-cover rounded-[1.6rem] bg-slate-100"
                />
              </div>

              <div className={`${subCard} p-6`}>
                <h3 className="text-sm font-black text-slate-800 mb-6 tracking-wide uppercase flex items-center gap-3">
                  <span className="w-1.5 h-5 bg-gradient-to-b from-purple-500 to-indigo-400 rounded-full"></span>
                  BME Quick Fact
                </h3>

                <div className="space-y-5">
                  <div className="flex justify-between items-end border-b border-slate-200 pb-3">
                    <div className="text-xs text-slate-500 font-medium">
                      Field:<br />
                      <span className="text-sm font-bold text-slate-800">{selectedAlumni.field}</span>
                    </div>
                    <div className="text-xs text-slate-500 text-right font-medium">
                      Class of:<br />
                      <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-rose-500">BME {selectedAlumni.generation}</span>
                    </div>
                  </div>

                  <div className="border-b border-slate-200 pb-3">
                    <p className="text-xs text-slate-500 mb-1 font-medium">Faculty / Institute:</p>
                    <p className="text-sm font-bold text-slate-800">{selectedAlumni.faculty}</p>
                  </div>

                  <div className="border-b border-slate-200 pb-3">
                    <p className="text-xs text-slate-500 mb-1 font-medium">Province / Area:</p>
                    <p className="text-sm font-bold text-slate-800">📍 {selectedAlumni.province || '-'}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1 font-medium">Degree:</p>
                    <p className="text-sm font-bold text-slate-800">{selectedAlumni.degree}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* คอลัมน์ขวา: รายละเอียด */}
            <div className={`${subCard} flex-grow p-8 md:p-10 w-full`}>
              <div className="mb-8">
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600 shadow-sm">Age {selectedAlumni.age}</span>
                  {selectedAlumni.province && (
                    <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-bold text-purple-700 shadow-sm">
                      📍 {selectedAlumni.province}
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600 shadow-sm">{selectedAlumni.company}</span>
                </div>

                <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{selectedAlumni.name}</h2>
                <p className="text-purple-700 font-bold">{selectedAlumni.position}</p>
              </div>

              <div className="text-slate-600 font-medium leading-relaxed space-y-6">
                <p>{selectedAlumni.description}</p>

                {/* โควทคำพูด */}
                {selectedAlumni.quote && (
                  <div className="border-l-4 border-rose-400 pl-6 py-4 my-8 bg-gradient-to-r from-rose-50 to-purple-50/60 rounded-r-2xl">
                    <p className="italic text-slate-800 font-semibold text-lg mb-2">"{selectedAlumni.quote}"</p>
                    <p className="text-sm text-slate-500">Proud to be BME Alumni by {selectedAlumni.name}</p>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <a href="#" className="text-rose-500 hover:text-rose-700 font-bold text-sm">#BME_KMUTNB_NotableAlumni</a>
              </div>

              {/* วันที่และปุ่มแชร์ */}
              <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-slate-400 font-medium">Published on: {selectedAlumni.publishedDate}</p>

                <div className="flex gap-2">
                  <button className="flex items-center gap-2 bg-slate-900 hover:-translate-y-0.5 text-white px-4 py-2 rounded-full font-bold text-xs transition-all shadow-md shadow-slate-900/20">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    Copy link
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center bg-white hover:bg-[#1DA1F2] hover:text-white text-slate-600 rounded-full transition-colors border border-slate-200 shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center bg-white hover:bg-[#1877F2] hover:text-white text-slate-600 rounded-full transition-colors border border-slate-200 shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center bg-white hover:bg-[#0A66C2] hover:text-white text-slate-600 rounded-full transition-colors border border-slate-200 shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}