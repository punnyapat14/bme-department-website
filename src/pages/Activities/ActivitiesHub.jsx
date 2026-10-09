import React, { useEffect } from 'react';
import ActivityCard from '../../components/Activities/ActivityCard';
import ActivityFeedRenderer from '../../components/Activities/ActivityFeedRenderer';
import { AuroraBackground, SectionBanner } from '../../components/ThemeElements';

const LATEST_UPDATES = [
  { type: 'header', content: 'ข่าวสารกิจกรรมล่าสุด' },
  { type: 'paragraph', content: 'ยินดีต้อนรับสู่ศูนย์รวมกิจกรรมสาขาวิชาวิศวกรรมชีวการแพทย์ (BME) สามารถคลิกเลือกหมวดหมู่กิจกรรมด้านบนเพื่อดูภาพบรรยากาศและรายละเอียดการจัดงานได้เลยครับ' },
  { type: 'image', url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800', caption: 'บรรยากาศกิจกรรมร่วมกันของชาว BME' }
];

export default function ActivitiesHub() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50";

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />
      
      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">
        <div className="text-center max-w-4xl mx-auto pt-2 pb-10">
          <span className="inline-block py-1 px-4 rounded-full bg-purple-100/60 backdrop-blur-sm text-purple-700 text-[11px] font-bold tracking-widest uppercase mb-4 shadow-sm">
            BME Activities
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
            กิจกรรมสาขาวิชา
          </h1>
          <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
            รวมภาพบรรยากาศ โครงการ และกิจกรรมทั้งหมดของวิศวกรรมชีวการแพทย์
          </p>
        </div>

        <div className={`p-8 md:p-12 mb-16 ${bentoGlass}`}>
          <SectionBanner line1="หมวดหมู่" line2="กิจกรรม" variant="website" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 mt-8">
            <ActivityCard 
              title="BME OPEN HOUSE" 
              description="กิจกรรมเปิดบ้านแนะนำสาขาวิชา สำหรับน้องๆ มัธยมศึกษา"
              to="/activities/openhouse" colorFrom="from-purple-500" colorTo="to-indigo-600"
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>}
            />
            <ActivityCard 
              title="ค่ายจิตอาสา" 
              description="โครงการออกค่ายพัฒนาชุมชนและสร้างสาธารณประโยชน์"
              to="/activities/volunteer" colorFrom="from-rose-500" colorTo="to-orange-500"
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>}
            />
            <ActivityCard 
              title="กีฬา BMESAT" 
              description="การแข่งขันกีฬาสานสัมพันธ์วิศวกรรมชีวการแพทย์แห่งประเทศไทย"
              to="/activities/bmesat" colorFrom="from-blue-500" colorTo="to-cyan-500"
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
            />
          </div>

          <div className="border-t border-slate-100 pt-8 mt-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">อัปเดตล่าสุด</h3>
            <ActivityFeedRenderer blocks={LATEST_UPDATES} />
          </div>
        </div>
      </div>
    </div>
  );
}