import { useState } from 'react';

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
    description: "ผมมีความสนใจและเชี่ยวชาญด้านการพัฒนา Web Application แบบ Full-stack รวมถึงการประยุกต์ใช้ AI และ Machine Learning ในวงการแพทย์ ผลงานที่ภาคภูมิใจคือการพัฒนาแอปพลิเคชัน WelTech ซึ่งใช้โมเดล YOLO ในการตรวจจับและจำแนกเซลล์เม็ดเลือดแบบอัตโนมัติ นอกจากนี้ผมยังมีประสบการณ์ในการทำระบบ IoT และ Embedded Systems สำหรับอุปกรณ์ทางการแพทย์อีกด้วย",
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

export default function Directory() {
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      <div className="bg-gray-50 min-h-screen py-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 border-l-4 border-red-600 pl-4">BME Alumni Directory</h1>
              <p className="text-gray-500 mt-2 pl-5 font-light">ทำเนียบเครือข่ายศิษย์เก่า สาขาวิชาวิศวกรรมชีวการแพทย์</p>
            </div>
            
            <div className="relative w-full md:w-72">
              <input 
                type="text" 
                placeholder="ค้นหาชื่อ, สายอาชีพ..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 shadow-sm"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* หัวตาราง (สีน้ำเงินเข้มตามรูป Reference) */}
                <thead className="bg-[#1e4b85] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider">Class of</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider">Age</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider">Faculty / Institute</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider">Fields</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider">Title/Company</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredAlumni.map((alumni) => (
                    <tr key={alumni.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">BME {alumni.generation}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* เมื่อคลิกชื่อ จะกำหนดค่า selectedAlumni เพื่อเปลี่ยนหน้าไปแสดงโปรไฟล์ */}
                        <button 
                          onClick={() => setSelectedAlumni(alumni)}
                          className="text-[#1e4b85] hover:text-red-600 font-medium transition-colors text-sm cursor-pointer text-left"
                        >
                          {alumni.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alumni.age || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1e4b85]">{alumni.faculty}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1e4b85]">{alumni.field}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1e4b85]">{alumni.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 min-w-[200px]">
                        <span className="font-medium text-gray-800 block">{alumni.position}</span>
                        <span className="text-gray-500 text-xs mt-0.5 block">{alumni.company}</span>
                      </td>
                    </tr>
                  ))}
                  {filteredAlumni.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">ไม่พบข้อมูลศิษย์เก่าที่คุณค้นหา</td>
                    </tr>
                  )}
                </tbody>
              </table>
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
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* ส่วนหัวสีน้ำเงินเข้ม */}
      <div className="bg-[#1e4b85] pt-8 pb-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* ปุ่มย้อนกลับ */}
          <button 
            onClick={() => setSelectedAlumni(null)}
            className="flex items-center text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors border border-white/20 rounded-full px-4 py-1.5 w-fit hover:bg-white/10"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            ย้อนกลับไปหน้า Alumni Directory
          </button>
          
          <div className="ml-0 lg:ml-[340px]">
            <span className="bg-[#f2a900] text-[#1e4b85] text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
              {selectedAlumni.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-2">
              {selectedAlumni.name}
            </h1>
            <p className="text-xl text-blue-100 font-light">
              {selectedAlumni.position}
            </p>
          </div>
        </div>
      </div>

      {/* ส่วนข้อมูลหลัก */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* คอลัมน์ซ้าย: รูปภาพและ Quick Fact */}
          <div className="w-full lg:w-80 flex-shrink-0">
            {/* กรอบรูปภาพ */}
            <div className="bg-white p-2 shadow-lg rounded-lg mb-6">
              <img 
                src={selectedAlumni.image} 
                alt={selectedAlumni.name} 
                className="w-full h-80 object-cover rounded bg-gray-100"
              />
            </div>

            {/* BME Quick Fact (กล่องสีเทาอ่อน) */}
            <div className="bg-slate-100 p-6 rounded-lg border border-slate-200">
              <h3 className="text-gray-400 font-bold mb-6 tracking-wide uppercase text-sm">BME Quick Fact</h3>
              
              <div className="space-y-5">
                <div className="flex justify-between items-end border-b border-gray-200 pb-2">
                  <div className="text-xs text-gray-500">
                    Field:<br/>
                    <span className="text-sm font-semibold text-gray-800">{selectedAlumni.field}</span>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    Class of:<br/>
                    <span className="text-2xl font-bold text-[#1e4b85]">BME {selectedAlumni.generation}</span>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-2">
                  <p className="text-xs text-gray-500 mb-1">Faculty / Institute:</p>
                  <p className="text-sm font-medium text-gray-800">{selectedAlumni.faculty}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Degree:</p>
                  <p className="text-sm font-medium text-gray-800">{selectedAlumni.degree}</p>
                </div>
              </div>
            </div>
          </div>

          {/* คอลัมน์ขวา: รายละเอียด (Description & Quote) */}
          <div className="flex-grow bg-white p-8 md:p-10 shadow-lg rounded-lg mt-0 lg:mt-24 border border-gray-100">
            <div className="mb-8">
              <p className="text-gray-500 mb-1">Age {selectedAlumni.age}</p>
              <p className="text-gray-500 mb-1">{selectedAlumni.company}</p>
              <p className="text-gray-500 mb-4">{selectedAlumni.position}</p>
              
              <h2 className="text-3xl font-bold text-[#1e4b85] mb-2">{selectedAlumni.name}</h2>
              <p className="text-gray-700">{selectedAlumni.position} :</p>
            </div>

            <div className="prose max-w-none text-gray-600 font-light leading-relaxed space-y-6">
              <p>{selectedAlumni.description}</p>
              
              {/* โควทคำพูด */}
              {selectedAlumni.quote && (
                <div className="border-l-4 border-red-500 pl-6 py-2 my-8 bg-red-50/50 rounded-r-lg">
                  <p className="italic text-gray-800 font-medium text-lg mb-2">"{selectedAlumni.quote}"</p>
                  <p className="text-sm text-gray-500">- Proud to be BME Alumni by {selectedAlumni.name}</p>
                </div>
              )}
            </div>

            <div className="mt-8">
              <a href="#" className="text-red-500 hover:text-red-700 font-medium text-sm">#BME_KMUTNB_NotableAlumni</a>
            </div>

            {/* ส่วนล่างสุด: วันที่และปุ่มแชร์ */}
            <div className="mt-16 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">Published on: {selectedAlumni.publishedDate}</p>
              
              <div className="flex gap-2">
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium text-sm transition-colors border border-gray-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  Copy link
                </button>
                <button className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-[#1DA1F2] hover:text-white text-gray-600 rounded transition-colors border border-gray-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>
                </button>
                <button className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-[#1877F2] hover:text-white text-gray-600 rounded transition-colors border border-gray-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
                </button>
                <button className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-[#0A66C2] hover:text-white text-gray-600 rounded transition-colors border border-gray-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
}