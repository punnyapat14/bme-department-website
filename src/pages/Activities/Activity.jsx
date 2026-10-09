import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ActivityFeedRenderer from '../../components/Activities/ActivityFeedRenderer';
import { AuroraBackground, SectionBanner } from '../../components/ThemeElements';

// 📌 ฐานข้อมูลจำลอง (Mock Database) รวบรวมทุกกิจกรรมไว้ที่นี่ที่เดียว
// ในอนาคตคุณสามารถย้ายก้อนนี้ไปไว้ใน Backend (Supabase) ได้เลย
const ACTIVITIES_DB = {
  'openhouse': {
    bannerLine1: 'BME',
    bannerLine2: 'OPEN HOUSE',
    variant: 'website',
    title: 'BME OPEN HOUSE',
    subtitle: 'กิจกรรมเปิดบ้านวิศวกรรมชีวการแพทย์',
    blocks: [
      { type: 'header', content: 'ประมวลภาพ BME Open House ประจำปีการศึกษา 2566' },
      { type: 'paragraph', content: 'กิจกรรมจัดขึ้นเพื่อเปิดโอกาสให้นักเรียนระดับมัธยมศึกษาตอนปลาย ได้สัมผัสบรรยากาศการเรียนการสอน เยี่ยมชมห้องปฏิบัติการ และร่วมกิจกรรม Workshop สนุกๆ' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800', caption: 'บรรยากาศการแนะนำหลักสูตรให้น้องๆ มัธยม' },
      { type: 'subheader', content: 'กิจกรรมภายในงาน' },
      { type: 'paragraph', content: '1. แนะนำหลักสูตรและเส้นทางอาชีพ\n2. พาชมห้องปฏิบัติการทางวิศวกรรมชีวการแพทย์\n3. Workshop การวัดสัญญาณชีพ\n4. ถาม-ตอบ กับรุ่นพี่ BME' },
      { type: 'link', content: 'ดูรูปภาพกิจกรรมแบบเต็มความละเอียด', url: '#' }
    ]
  },
  'volunteer': {
    bannerLine1: 'ค่าย',
    bannerLine2: 'จิตอาสา',
    variant: 'calendar',
    title: 'ค่ายจิตอาสา BME',
    subtitle: 'โครงการออกค่ายพัฒนาชุมชนและสร้างสาธารณประโยชน์',
    blocks: [
      { type: 'header', content: 'โครงการค่ายจิตอาสา BME สานฝันปันน้ำใจ ครั้งที่ 5' },
      { type: 'paragraph', content: 'วิศวกรรมชีวการแพทย์ ไม่ได้มุ่งเน้นแค่การสร้างนวัตกรรมเพื่อสุขภาพ แต่เรายังปลูกฝังจิตสำนึกทำเพื่อส่วนรวม ค่ายนี้เราเดินทางไปพัฒนาโรงเรียนในพื้นที่ห่างไกล ทาสีอาคาร ซ่อมแซมระบบไฟฟ้า' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800', caption: 'ภาพน้องๆ และชาวค่ายร่วมกันทำกิจกรรม' },
      { type: 'subheader', content: 'สิ่งที่ได้รับจากการออกค่าย' },
      { type: 'paragraph', content: 'นอกจากช่วยเหลือสังคมแล้ว ยังเป็นการละลายพฤติกรรม สร้างความสามัคคี ฝึกทำงานเป็นทีม และการแก้ปัญหาเฉพาะหน้า' }
    ]
  },
  'bmesat': {
    bannerLine1: 'กีฬา',
    bannerLine2: 'BMESAT',
    variant: 'exam',
    title: 'กีฬา BMESAT',
    subtitle: 'การแข่งขันกีฬาสานสัมพันธ์วิศวกรรมชีวการแพทย์แห่งประเทศไทย',
    blocks: [
      { type: 'header', content: 'การแข่งขันกีฬาสานสัมพันธ์ (BMESAT Games)' },
      { type: 'paragraph', content: 'มหกรรมกีฬาเพื่อสานสัมพันธ์ระหว่างนักศึกษา BME จากหลากหลายสถาบันทั่วประเทศ ส่งเสริมสุขภาพพลานามัยและสร้างเครือข่ายวิชาชีพ (Connection)' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=800', caption: 'นักกีฬาจากสถาบันต่างๆ เข้าร่วมการแข่งขัน' },
      { type: 'subheader', content: 'ชนิดกีฬาที่มีการแข่งขัน' },
      { type: 'paragraph', content: '• ฟุตซอล\n• บาสเกตบอล\n• วอลเลย์บอล\n• E-Sports (RoV, Valorant)\n• กีฬาฮาเฮ (แชร์บอล, ชักเย่อ)' },
      { type: 'link', content: 'ติดตามผลการแข่งขันที่เพจ BMESAT', url: '#' }
    ]
  }
};

export default function Activity() {
  // 📌 useParams ดึงค่า ID จาก URL เช่น /activities/openhouse จะได้ activityId = 'openhouse'
  const { activityId } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);

    // จำลองการ Fetch Data จากฐานข้อมูลโดยใช้ activityId เป็นตัวค้นหา
    setTimeout(() => {
      const activityData = ACTIVITIES_DB[activityId];
      if (activityData) {
        setData(activityData);
      } else {
        // ถ้าระบุ URL มั่วๆ มา (ไม่เจอใน DB) ให้เด้งกลับไปหน้าแรกกิจกรรม
        navigate('/activities');
      }
      setIsLoading(false);
    }, 500); // จำลองเวลาโหลด 0.5 วินาที
  }, [activityId, navigate]);

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50";

  // หากข้อมูลยังโหลดไม่เสร็จ หรือหาไม่เจอ
  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-[#fdfcff] pt-24 pb-32 flex justify-center">
         <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
            <p className="text-slate-400 font-bold">กำลังโหลดข้อมูลกิจกรรม...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />
      
      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">
        {/* Breadcrumbs นำทาง */}
        <div className="mb-6 flex items-center text-sm font-bold text-slate-500 bg-white/60 px-4 py-2 rounded-full w-max backdrop-blur-md shadow-sm border border-white">
          <Link to="/activities" className="hover:text-purple-600 transition-colors">กิจกรรมสาขาวิชา</Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-800">{data.title}</span>
        </div>

        <div className={`p-8 md:p-12 mb-16 ${bentoGlass}`}>
          {/* แบนเนอร์จะเปลี่ยนรูปทรง สี และข้อความไปตามข้อมูลที่ถูกเลือก */}
          <SectionBanner line1={data.bannerLine1} line2={data.bannerLine2} variant={data.variant} />
          
          <div className="mt-8 border-t border-slate-100 pt-8">
             {/* ตัวเรนเดอร์เนื้อหาจาก Blocks (ระบบเดียวกับ Google Sites) */}
             <ActivityFeedRenderer blocks={data.blocks} />
          </div>
        </div>
      </div>
    </div>
  );
}