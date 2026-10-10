import { useState, useEffect } from 'react';
import { AuroraBackground, SectionBanner } from '../../components/ThemeElements';

// ข้อมูลจำลอง (Mock Data) สำหรับศิษย์เก่า
const mockAlumniData = [
  {
    id: 1,
    generation: "1",
    name: "นายปุญญพัฒน์ หล่าบุตรศรี",
    age: 21,
    faculty: "คณะวิทยาศาสตร์ประยุกต์ มจพ.",
    field: "วิศวกรรมชีวการแพทย์",
    category: "Software & AI",
    position: "AI Developer / Web Developer",
    company: "WelTech Medical",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&q=80",
    degree: "วท.บ. วิศวกรรมชีวการแพทย์",
    description: "ผมมีความสนใจและเชี่ยวชาญด้านการพัฒนา Web Application แบบ Full-stack รวมถึงการประยุกต์ใช้ AI และ Machine Learning ในวงการแพทย์ ผลงานที่ภาคภูมิใจคือการพัฒนาแอปพลิเคชัน WelTech ซึ่งใช้โมเดล YOLO ในการตรวจจับและจำแนกเซลล์เม็ดเลือดแบบอัตโนมัติ นอกจากนี้ผมยังมีประสบการณ์ในการทำระบบ IoT และ Embedded Systems สำหรับอุปกรณ์ทางการแพทย์อีกด้วย และได้เข้าร่วมงานคืนสู่เหย้า 12 ปี BME Connext ในฐานะศิษย์เก่าระดับ VIP รหัสบัตร bb878b43-0796-4130-88de-effb07eba2c7",
    quote: "เทคโนโลยีที่ดี คือเทคโนโลยีที่สร้างผลลัพธ์ที่มีความหมายต่อชีวิตผู้คน ผมภูมิใจที่ได้นำความรู้ทางวิศวกรรมชีวการแพทย์มาพัฒนาซอฟต์แวร์ที่ช่วยยกระดับวงการสาธารณสุข",
    publishedDate: "26/09/2026 12:50 pm"
  },
  {
    id: 2,
    generation: "2",
    name: "คุณสมรักษ์ สารภี",
    age: 32,
    faculty: "คณะวิทยาศาสตร์ประยุกต์ มจพ.",
    field: "วิศวกรรมชีวการแพทย์",
    category: "Healthcare Service",
    position: "นักวิชาการสาธารณสุขชำนาญการ",
    company: "องค์การบริหารส่วนตำบลเกาะแก้ว",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fit=crop&w=300&q=80",
    degree: "วท.บ. วิศวกรรมชีวการแพทย์",
    description: "รับผิดชอบงานด้านการสาธารณสุขในระดับชุมชน โดยนำความรู้ด้านอุปกรณ์การแพทย์มาประยุกต์ใช้ในการดูแลผู้ป่วยติดเตียงและผู้สูงอายุในพื้นที่...",
    quote: "การทำงานในชุมชนทำให้เห็นคุณค่าของอุปกรณ์ทางการแพทย์ที่ใช้งานง่ายและเข้าถึงได้จริง",
    publishedDate: "15/08/2026 09:30 am"
  },
  {
    id: 3,
    generation: "1",
    name: "คุณวิสูจน์ อ่อนละออ",
    age: 47,
    faculty: "คณะวิทยาศาสตร์ประยุกต์ มจพ.",
    field: "วิศวกรรมชีวการแพทย์",
    category: "Manufacturing & Industry",
    position: "รองผู้จัดการทั่วไป",
    company: "บริษัท โตโยต้า มอเตอร์ เอเชีย (ประเทศไทย) จำกัด",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?fit=crop&w=300&q=80",
    degree: "วท.บ. วิศวกรรมชีวการแพทย์",
    description: "ดูแลภาพรวมของสายการผลิตและนำระบบอัตโนมัติมาประยุกต์ใช้ในโรงงานอุตสาหกรรม...",
    quote: "วิศวกรรมชีวการแพทย์สอนให้เราคิดอย่างเป็นระบบ ซึ่งสามารถประยุกต์ใช้ได้กับทุกอุตสาหกรรม",
    publishedDate: "02/09/2026 14:15 pm"
  }
];

// สไตล์กลางที่ใช้ร่วมกับหน้าอื่น
const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden";
const subCard = "bg-slate-50/60 rounded-[2rem] border border-slate-100 shadow-sm";

// สีป้ายหมวดหมู่ (วนสีตามลำดับ)
const categoryStyles = [
  'bg-purple-50 text-purple-700 border-purple-200',
  'bg-rose-50 text-rose-700 border-rose-200',
  'bg-indigo-50 text-indigo-700 border-indigo-200',
  'bg-amber-50 text-amber-700 border-amber-200',
  'bg-teal-50 text-teal-700 border-teal-200',
];
const getCategoryStyle = (category) => {
  let hash = 0;
  for (let i = 0; i < category.length; i++) hash += category.charCodeAt(i);
  return categoryStyles[hash % categoryStyles.length];
};

export default function Directory() {
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedAlumni]);

  // กรองข้อมูลตามคำค้นหา (ชื่อ หรือ หมวดหมู่)
  const filteredAlumni = mockAlumniData.filter(alumni =>
    alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumni.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ---------------------------------------------------------------------------
  // ส่วนที่ 1: ตารางแสดงรายชื่อศิษย์เก่า (Directory Table)
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

            {/* ช่องค้นหา */}
            <div className="max-w-xl mx-auto relative group mb-8 mt-6">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input
                type="text"
                placeholder="ค้นหาชื่อ, สายอาชีพ..."
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
              <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">{filteredAlumni.length} คน</span>
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
                      <th className="px-6 py-4 text-left text-xs font-bold tracking-wider">Faculty / Institute</th>
                      <th className="px-6 py-4 text-left text-xs font-bold tracking-wider">Fields</th>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{alumni.faculty}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{alumni.field}</td>
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