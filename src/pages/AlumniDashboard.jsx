import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import bmeLogoBar from '../assets/bme_alumni_bar.png'; 

export default function AlumniDashboard() {
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showCardModal, setShowCardModal] = useState(false);

  const coverImageInputRef = useRef(null);
  const profileImageInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    role: 'alumni', 
    generation: '09', 
    specialization: '03', 
    runningNumber: '0042', 
    memberSince: '2026',
    expiryDate: 'ตลอดชีพ',
    studentId: '6304000000000',
    prefix: 'นาย',
    firstName: 'ปุญญพัฒน์',
    lastName: 'หล่าบุตรศรี',
    nickname: 'ปั้น',
    dob: '2000-01-01',
    email: 'punyapat@example.com',
    phone: '080-000-0000',
    lineId: 'punyapat.line',
    facebook: 'Punyapat Lhabutsi',
    instagram: '@punyapat',
    linkedin: 'https://linkedin.com/in/punyapat',
    
    jobCategory: 'นักวิจัย/พัฒนา (R&D)',
    position: 'AI & Web Developer',
    company: 'WelTech Medical Co., Ltd.',
    workLocation: 'กรุงเทพมหานคร',
    expertise: 'Artificial Intelligence, Medical Software, Full-Stack React',
    motto: 'Innovating Healthcare for better life', 
    
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?fit=crop&w=1200&q=80',
  });

  const formattedMemberId = `BME ${String(profileData.generation).padStart(2, '0')}-${profileData.specialization}-${String(profileData.runningNumber).padStart(4, '0')}`;

  const getSpecializationName = (code) => {
    switch(code) {
      case '01': return 'วิศวกรรมคลินิก';
      case '02': return 'วิศวกรรมโรงพยาบาล';
      case '03': return 'นวัตกรรมทางวิศวกรรมชีวการแพทย์';
      default: return 'ไม่ระบุสาขา';
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("ขนาดรูปภาพต้องไม่เกิน 2MB");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      if (type === 'cover') setProfileData(prev => ({ ...prev, coverImage: imageUrl }));
      else if (type === 'profile') setProfileData(prev => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('บันทึกข้อมูลเรียบร้อยแล้ว');
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 disabled:bg-gray-50/80 disabled:text-gray-600 disabled:border-gray-100 disabled:cursor-not-allowed transition-all font-light text-gray-900";

  // ฟังก์ชันสำหรับจำลองลายเส้นคลื่นแบบในรูปอ้างอิง
  const WavePattern = () => (
    <svg className="absolute inset-0 w-full h-full opacity-30 mix-blend-overlay pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 320">
      <path fill="none" stroke="#ffffff" strokeWidth="2" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128"></path>
      <path fill="none" stroke="#ffffff" strokeWidth="1.5" d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,133.3C672,139,768,181,864,192C960,203,1056,181,1152,154.7C1248,128,1344,96,1392,80L1440,64"></path>
      <path fill="none" stroke="#ffffff" strokeWidth="1" d="M0,256L48,240C96,224,192,192,288,186.7C384,181,480,203,576,218.7C672,235,768,245,864,240C960,235,1056,213,1152,192C1248,171,1344,149,1392,138.7L1440,128"></path>
      <path fill="none" stroke="#ffffff" strokeWidth="2.5" d="M0,64L48,80C96,96,192,128,288,154.7C384,181,480,203,576,181.3C672,160,768,96,864,85.3C960,75,1056,117,1152,128C1248,139,1344,117,1392,106.7L1440,96"></path>
      <path fill="none" stroke="#ffffff" strokeWidth="1.5" d="M0,288L48,272C96,256,192,224,288,208C384,192,480,192,576,197.3C672,203,768,213,864,229.3C960,245,1056,267,1152,250.7C1248,235,1344,181,1392,154.7L1440,128"></path>
    </svg>
  );

  return (
    <div className="bg-[#f8f9fc] min-h-screen pb-20 font-sans">
      
      {/* ---------------- 1. Cover Photo Area ---------------- */}
      <div className="h-[220px] md:h-[300px] w-full relative group bg-gray-900 border-b border-gray-200">
        <img src={profileData.coverImage} alt="Cover" className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/40 transition-colors"></div>
        
        {isEditing && (
          <>
            <input type="file" accept="image/*" className="hidden" ref={coverImageInputRef} onChange={(e) => handleImageUpload(e, 'cover')} />
            <button 
              onClick={() => coverImageInputRef.current.click()}
              className="absolute top-6 right-6 bg-white/30 backdrop-blur-md hover:bg-white/50 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-md border border-white/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
              แก้ไขรูปปก
            </button>
          </>
        )}
      </div>

      {/* ---------------- 2. Main Layout (2 Columns) ---------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-16 md:-mt-24">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          {/* ================= คอลัมน์ซ้าย (65%) ================= */}
          <div className="w-full lg:w-[65%] flex flex-col gap-6">
            
            {/* --- Section A: ข้อมูลส่วนตัวด้านบน --- */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 border-b border-gray-100 pb-6 mb-2">
                
                {/* Avatar */}
                <div className="relative group w-32 h-32 md:w-36 md:h-36 rounded-full border-[5px] border-white bg-gray-100 shadow-xl flex-shrink-0 -mt-16 md:-mt-20 z-20">
                  <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  {isEditing && (
                    <>
                      <input type="file" accept="image/*" className="hidden" ref={profileImageInputRef} onChange={(e) => handleImageUpload(e, 'profile')} />
                      <div onClick={() => profileImageInputRef.current.click()} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
                      </div>
                    </>
                  )}
                  <div className="absolute bottom-1 right-1 w-10 h-10 rounded-full border-[3px] border-white bg-red-600 flex items-center justify-center text-white shadow-md">
                    <span className="text-sm font-bold">{String(profileData.generation).padStart(2, '0')}</span>
                  </div>
                </div>

                {/* ข้อมูลชื่อและตำแหน่ง */}
                <div className="flex-grow text-center sm:text-left pt-2 sm:pt-4">
                  <h1 className="text-2xl md:text-3xl lg:text-[1.8rem] font-extrabold text-gray-900 tracking-tight mb-2 flex flex-wrap items-end justify-center sm:justify-start gap-2">
                    <span className="whitespace-nowrap">{profileData.firstName} {profileData.lastName}</span>
                    <span className="text-lg md:text-xl text-gray-500 font-medium whitespace-nowrap">({profileData.nickname})</span>
                  </h1>
                  <p className="text-purple-700 font-bold text-base md:text-lg mb-1">{getSpecializationName(profileData.specialization)}</p>
                  <p className="text-gray-500 font-light text-sm md:text-base">
                    {profileData.position} <span className="mx-2 text-gray-300">|</span> {profileData.company}
                  </p>
                </div>

                {/* ปุ่ม Action ชิดขวา */}
                <div className="flex-shrink-0 mt-4 sm:mt-4 sm:ml-auto">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200">ยกเลิก</button>
                      <button onClick={handleSave} className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-700 to-red-600 shadow-md transition-all flex items-center gap-2 transform hover:-translate-y-0.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> บันทึก
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 rounded-xl font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all flex items-center gap-2 shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg> แก้ไขโปรไฟล์
                    </button>
                  )}
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-8 overflow-x-auto hide-scrollbar pt-2">
                {['general', 'work'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-2 font-bold text-[15px] transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-purple-800' : 'text-gray-500 hover:text-gray-800'}`}
                  >
                    {tab === 'general' && 'ข้อมูลส่วนตัว'}
                    {tab === 'work' && 'ประวัติการทำงาน'}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-700 rounded-t-md"></div>}
                  </button>
                ))}
              </div>
            </div>

            {/* --- Section B: ฟอร์มแก้ไขข้อมูล --- */}
            <div>
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span> ข้อมูลส่วนบุคคล
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-500">คำนำหน้า</label>
                        <select name="prefix" value={profileData.prefix} onChange={handleChange} disabled={!isEditing} className={inputClass}>
                          <option value="นาย">นาย</option>
                          <option value="นาง">นาง</option>
                          <option value="นางสาว">นางสาว</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-500">ชื่อจริง</label>
                        <input type="text" name="firstName" value={profileData.firstName} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-500">นามสกุล</label>
                        <input type="text" name="lastName" value={profileData.lastName} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-500">ชื่อเล่น</label>
                        <input type="text" name="nickname" value={profileData.nickname} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-500">วัน/เดือน/ปีเกิด</label>
                        <input type="date" name="dob" value={profileData.dob} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-500">รหัสนักศึกษา</label>
                        <input type="text" name="studentId" value={profileData.studentId} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-500">BME รุ่นที่</label>
                        <input type="number" name="generation" value={profileData.generation} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-500">กลุ่มสาขาวิชาเชี่ยวชาญ</label>
                        <select name="specialization" value={profileData.specialization} onChange={handleChange} disabled={!isEditing} className={inputClass}>
                          <option value="01">01 - วิศวกรรมคลินิก</option>
                          <option value="02">02 - วิศวกรรมโรงพยาบาล</option>
                          <option value="03">03 - นวัตกรรมทางวิศวกรรมชีวการแพทย์</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-red-500 rounded-full"></span> ช่องทางการติดต่อและโซเชียลมีเดีย
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-500">อีเมลส่วนตัว</label>
                        <input type="email" name="email" value={profileData.email} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-500">เบอร์โทรศัพท์</label>
                        <input type="tel" name="phone" value={profileData.phone} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-500">Line ID</label>
                        <input type="text" name="lineId" value={profileData.lineId} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-500">Facebook</label>
                        <input type="text" name="facebook" value={profileData.facebook} onChange={handleChange} disabled={!isEditing} className={inputClass} placeholder="ชื่อเฟสบุ๊ค หรือ ลิงก์" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-500">Instagram</label>
                        <input type="text" name="instagram" value={profileData.instagram} onChange={handleChange} disabled={!isEditing} className={inputClass} placeholder="@username" />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-500">LinkedIn URL</label>
                        <input type="url" name="linkedin" value={profileData.linkedin} onChange={handleChange} disabled={!isEditing} className={inputClass} placeholder="https://linkedin.com/in/..." />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'work' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span> ข้อมูลการทำงานและวิสัยทัศน์
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-500">หมวดที่ทำงาน</label>
                      <select name="jobCategory" value={profileData.jobCategory} onChange={handleChange} disabled={!isEditing} className={inputClass}>
                        <option value="วิศวกรบริการ (Service Engineer)">วิศวกรบริการ (Service Engineer)</option>
                        <option value="ผู้เชี่ยวชาญผลิตภัณฑ์ (Product Specialist)">ผู้เชี่ยวชาญผลิตภัณฑ์ (Product Specialist)</option>
                        <option value="วิศวกรโรงพยาบาล (Hospital Engineer)">วิศวกรโรงพยาบาล (Hospital Engineer)</option>
                        <option value="นักวิจัย/พัฒนา (R&D)">นักวิจัย/พัฒนา (R&D)</option>
                        <option value="ฝ่ายขาย (Sale)">ฝ่ายขาย (Sale)</option>
                        <option value="ประกอบธุรกิจส่วนตัว">ประกอบธุรกิจส่วนตัว</option>
                        <option value="ศึกษาต่อ">ศึกษาต่อ</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-500">ตำแหน่งงาน (Position)</label>
                      <input type="text" name="position" value={profileData.position} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-500">บริษัท / องค์กร</label>
                      <input type="text" name="company" value={profileData.company} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-500">จังหวัดที่ทำงาน</label>
                      <input type="text" name="workLocation" value={profileData.workLocation} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-500">ความเชี่ยวชาญ / ทักษะ</label>
                      <textarea name="expertise" value={profileData.expertise} onChange={handleChange} disabled={!isEditing} rows="2" className={`${inputClass} resize-none`} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-500">คติในการทำงาน / ข้อความแนะนำตัว (Motto)</label>
                      <textarea name="motto" value={profileData.motto} onChange={handleChange} disabled={!isEditing} rows="3" className={`${inputClass} resize-none`} placeholder="สโลแกนนี้จะปรากฏใต้ชื่อคุณในทำเนียบศิษย์เก่า" />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* ================= คอลัมน์ขวา (35%) : นามบัตรดิจิทัล แบบ Premium Zenith Black ================= */}
          <div className="w-full lg:w-[35%] sticky top-24 mb-10">
            
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col items-center">
              
              <h2 className="text-lg font-bold text-gray-900 w-full mb-4 border-l-4 border-purple-600 pl-3">บัตรสมาชิก BME</h2>
              
              {/* 📌 ตัวบัตร (Premium Zenith Black Theme สไตล์ขอบเงิน) */}
              <div className="w-full aspect-[1.586/1] rounded-[1.25rem] p-[3px] bg-gradient-to-br from-gray-300 via-white to-gray-400 shadow-2xl transform hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 group relative">
                
                {/* ขอบเงิน (Silver Border) สร้างด้วย padding ด้านบน แล้วตัวเนื้อบัตรอยู่ด้านใน */}
                <div className="w-full h-full rounded-[1.1rem] overflow-hidden relative bg-[#1c1c1c] text-white flex flex-col justify-between p-5">
                  
                  {/* 📌 ลายคลื่นแบบบัตร UOB Zenith */}
                  <WavePattern />

                  {/* แสง Glow มุมขวาบนและซ้ายล่าง */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-400/20 blur-[30px] rounded-full z-0"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gray-600/20 blur-[30px] rounded-full z-0"></div>

                  {/* แสง Glare วิ่งพาดผ่านบัตรตอน Hover */}
                  <div className="absolute top-0 right-0 w-[200%] h-[200%] bg-gradient-to-bl from-white/20 via-transparent to-transparent transform -rotate-45 translate-x-1/4 -translate-y-1/4 opacity-30 z-0"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out z-20 pointer-events-none"></div>

                  {/* ส่วนหัวบัตร (ซ้าย: BME, ขวา: รูปโปรไฟล์) */}
                  <div className="flex justify-between items-start relative z-10 w-full">
                    <div>
                      <h2 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 leading-none drop-shadow-sm uppercase">BME <span className="font-light text-[12px] opacity-70">Alumni</span></h2>
                    </div>
                    {/* ไอคอนชิปการ์ด (Smart Chip สีเงิน) */}
                    <div className="w-10 h-8 rounded bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-500 flex flex-col justify-evenly px-1 py-0.5 opacity-90 shadow-sm relative overflow-hidden">
                      <div className="absolute inset-0 border border-gray-400 m-1 rounded-sm"></div>
                      <div className="w-full h-px bg-gray-400/50"></div>
                      <div className="w-full h-px bg-gray-400/50"></div>
                      <div className="w-full h-px bg-gray-400/50"></div>
                    </div>
                  </div>

                  {/* กลาง: รูปโปรไฟล์ และ เลขบัตร */}
                  <div className="relative z-10 flex items-center justify-between w-full mt-2">
                    <div className="text-[1.1rem] sm:text-[1.2rem] md:text-[1.3rem] font-bold tracking-[0.1em] sm:tracking-[0.15em] font-mono text-gray-100 drop-shadow-md">
                      {formattedMemberId}
                    </div>
                    <div className="w-11 h-11 rounded-full border-[1.5px] border-gray-400/80 p-[2px] bg-gradient-to-br from-gray-600 to-gray-800 shadow-lg overflow-hidden">
                      <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    </div>
                  </div>

                  {/* ล่าง: ข้อมูล */}
                  <div className="flex justify-between items-end relative z-10 w-full">
                    <div>
                      <div className="text-[9px] text-gray-400 font-medium mb-0.5 uppercase tracking-widest font-mono">Cardholder Name</div>
                      <div className="font-bold text-sm leading-tight text-gray-100 uppercase tracking-wide">{profileData.firstName} {profileData.lastName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[10px] leading-tight text-gray-300 uppercase tracking-widest">ALUMNI</div>
                    </div>
                  </div>

                </div>
              </div>

              <button 
                onClick={() => setShowCardModal(true)}
                className="mt-6 w-full py-3 bg-white border border-gray-200 text-gray-700 hover:text-purple-700 hover:border-purple-300 font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                แสดงบัตรสแกน (บาร์โค้ด)
              </button>
            </div>

            <div className="mt-4 p-5 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-start gap-3 shadow-sm">
              <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                บัตรสมาชิกดิจิทัลนี้ใช้เพื่อรับสิทธิ์ส่วนลดร้านค้าเครือข่าย และเป็นตั๋วสแกนเข้างานศิษย์เก่าของภาควิชา
              </p>
            </div>
            
          </div>

        </div>
      </div>

      {/* ---------------- 3. Modal บัตรเต็มจอ (โชว์บาร์โค้ด - ธีม Zenith Black) ---------------- */}
      {showCardModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" onClick={() => setShowCardModal(false)}></div>
          
          <div className="bg-white w-full max-w-[480px] rounded-[2rem] overflow-hidden relative z-10 shadow-2xl animate-[popUpFade_0.3s_ease-out] border border-gray-100">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">สแกนบัตรสมาชิก</h3>
              <button onClick={() => setShowCardModal(false)} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-200 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-6 bg-gray-50 flex flex-col items-center">
              
              {/* บัตรสีดำด้าน ขอบเงิน ใน Modal */}
              <div className="w-full aspect-[1.586/1] rounded-[1.5rem] p-[3px] bg-gradient-to-br from-gray-300 via-white to-gray-400 shadow-[0_20px_40px_rgba(0,0,0,0.4)] group">
                <div className="w-full h-full rounded-[1.3rem] overflow-hidden relative bg-[#1c1c1c] text-white flex flex-col justify-between p-6 md:p-8">
                  
                  <WavePattern />
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-gray-400/20 blur-[50px] rounded-full z-0"></div>
                  <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gray-600/20 blur-[50px] rounded-full z-0"></div>

                  <div className="flex justify-between items-start relative z-10 w-full">
                    <div>
                      <h2 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 leading-none drop-shadow-sm uppercase">BME <span className="font-light text-[14px] opacity-70">Alumni</span></h2>
                    </div>
                    {/* ไอคอนชิปการ์ด */}
                    <div className="w-12 h-10 rounded-md bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-500 flex flex-col justify-evenly px-1 py-0.5 opacity-90 shadow-sm relative overflow-hidden">
                      <div className="absolute inset-0 border border-gray-400 m-1 rounded-sm"></div>
                      <div className="w-full h-px bg-gray-400/50"></div>
                      <div className="w-full h-px bg-gray-400/50"></div>
                      <div className="w-full h-px bg-gray-400/50"></div>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between w-full mt-4">
                    <div className="text-[20px] sm:text-[24px] md:text-[28px] font-bold tracking-[0.1em] sm:tracking-[0.15em] font-mono text-gray-100 drop-shadow-md">
                      {formattedMemberId}
                    </div>
                    <div className="w-14 h-14 rounded-full border-[2px] border-gray-400/80 p-[2px] bg-gradient-to-br from-gray-600 to-gray-800 shadow-lg overflow-hidden">
                      <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    </div>
                  </div>

                  <div className="flex justify-between items-end relative z-10 w-full">
                    <div>
                      <div className="text-[10px] text-gray-400 font-medium mb-0.5 uppercase tracking-widest font-mono">Cardholder Name</div>
                      <div className="font-bold text-lg leading-tight text-gray-100 uppercase tracking-wide">{profileData.firstName} {profileData.lastName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[12px] leading-tight text-gray-300 uppercase tracking-widest">ALUMNI</div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="w-full bg-white rounded-xl p-5 mt-6 border border-gray-200 flex flex-col items-center shadow-sm">
                <div className="w-full h-16 flex gap-[2px] justify-center items-end overflow-hidden mb-3 px-6 opacity-80">
                  {[...Array(45)].map((_, i) => (
                    <div key={i} className="bg-black" style={{ width: `${Math.random() * 4 + 1}px`, height: `${Math.random() * 20 + 80}%` }}></div>
                  ))}
                </div>
                <div className="text-[15px] font-mono tracking-[0.25em] text-gray-700 font-bold mb-3">
                  {formattedMemberId}
                </div>
                <p className="text-xs text-gray-400 font-light">แสดงบาร์โค้ดนี้เพื่อสแกนยืนยันตัวตน ณ จุดลงทะเบียน</p>
              </div>

            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popUpFade {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}