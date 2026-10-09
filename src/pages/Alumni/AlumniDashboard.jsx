import { useState, useEffect, useRef } from 'react';
import { AuroraBackground, SectionBanner } from '../../components/ThemeElements';

export default function AlumniDashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showCardModal, setShowCardModal] = useState(false);

  const coverImageInputRef = useRef(null);
  const profileImageInputRef = useRef(null);

  const bentoGlass = "rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden";
  const inputClass = "w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-300/60 disabled:bg-slate-50/80 disabled:text-slate-600 disabled:border-slate-100 disabled:cursor-not-allowed transition-all font-medium text-slate-900";
  const subCard = "bg-slate-50/60 rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8";
  const labelClass = "text-sm font-semibold text-slate-500";

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

  // บาร์โค้ดสร้างครั้งเดียว ไม่เปลี่ยนตอน re-render
  const [barcodeBars] = useState(() =>
    [...Array(45)].map(() => ({ w: Math.random() * 4 + 1, h: Math.random() * 20 + 80 }))
  );

  const getSpecializationName = (code) => {
    switch (code) {
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

  const cameraIcon = (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
  );

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
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />

      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto pt-2 pb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
            ทำเนียบศิษย์เก่า BME
          </h1>
          <p className="font-medium text-slate-600 text-lg leading-relaxed mx-auto max-w-2xl">
            จัดการโปรไฟล์ ข้อมูลการทำงาน และบัตรสมาชิกศิษย์เก่าของคุณ
          </p>
        </div>

        {/* ---------- Section 1: โปรไฟล์ ---------- */}
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          <SectionBanner line1="โปรไฟล์" line2="ศิษย์เก่า" variant="website" />

          {/* Cover */}
          <div className="h-[180px] md:h-[240px] w-full relative group bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
            <img src={profileData.coverImage} alt="Cover" className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-rose-900/30"></div>
            {isEditing && (
              <>
                <input type="file" accept="image/*" className="hidden" ref={coverImageInputRef} onChange={(e) => handleImageUpload(e, 'cover')} />
                <button onClick={() => coverImageInputRef.current.click()} className="absolute top-5 right-5 bg-white/30 backdrop-blur-md hover:bg-white/50 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-md border border-white/20">
                  {cameraIcon("w-4 h-4")} แก้ไขรูปปก
                </button>
              </>
            )}
          </div>

          {/* Profile header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 pb-6 border-b border-slate-100 px-2 md:px-6">
            <div className="relative group w-32 h-32 md:w-36 md:h-36 rounded-full border-[5px] border-white bg-slate-100 shadow-xl flex-shrink-0 -mt-16 md:-mt-20 z-20">
              <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
              {isEditing && (
                <>
                  <input type="file" accept="image/*" className="hidden" ref={profileImageInputRef} onChange={(e) => handleImageUpload(e, 'profile')} />
                  <div onClick={() => profileImageInputRef.current.click()} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    {cameraIcon("w-8 h-8 text-white")}
                  </div>
                </>
              )}
              <div className="absolute bottom-1 right-1 w-10 h-10 rounded-full border-[3px] border-white bg-gradient-to-br from-purple-500 to-rose-500 flex items-center justify-center text-white shadow-md">
                <span className="text-sm font-bold">{String(profileData.generation).padStart(2, '0')}</span>
              </div>
            </div>

            <div className="flex-grow text-center sm:text-left pt-2 sm:pt-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-2 flex flex-wrap items-end justify-center sm:justify-start gap-2">
                <span className="whitespace-nowrap">{profileData.firstName} {profileData.lastName}</span>
                <span className="text-lg md:text-xl text-slate-500 font-medium whitespace-nowrap">({profileData.nickname})</span>
              </h2>
              <p className="text-purple-700 font-bold text-base md:text-lg mb-1">{getSpecializationName(profileData.specialization)}</p>
              <p className="text-slate-500 font-medium text-sm md:text-base">
                {profileData.position} <span className="mx-2 text-slate-300">|</span> {profileData.company}
              </p>
            </div>

            <div className="flex-shrink-0 mt-4 sm:ml-auto">
              {isEditing ? (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 bg-white/80 hover:bg-white border border-slate-200 shadow-sm transition-all">ยกเลิก</button>
                  <button onClick={handleSave} className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900 shadow-md shadow-slate-900/20 transition-all flex items-center gap-2 hover:-translate-y-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg> บันทึก
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900 shadow-md shadow-slate-900/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg> แก้ไขโปรไฟล์
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center pt-6">
            <div className="inline-flex bg-slate-100/80 p-1.5 rounded-2xl shadow-sm">
              {[{ id: 'general', label: 'ข้อมูลส่วนตัว' }, { id: 'work', label: 'ประวัติการทำงาน' }].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- Section 2: ฟอร์ม + บัตร ---------- */}
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          <SectionBanner line1="ข้อมูล" line2="สมาชิก" variant="exam" />

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

            {/* ===== คอลัมน์ซ้าย: ฟอร์ม ===== */}
            <div className="w-full lg:w-[65%]">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className={subCard}>
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-400 rounded-full"></span> ข้อมูลส่วนบุคคล
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                      <div className="space-y-1">
                        <label className={labelClass}>คำนำหน้า</label>
                        <select name="prefix" value={profileData.prefix} onChange={handleChange} disabled={!isEditing} className={inputClass}>
                          <option value="นาย">นาย</option>
                          <option value="นาง">นาง</option>
                          <option value="นางสาว">นางสาว</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>ชื่อจริง</label>
                        <input type="text" name="firstName" value={profileData.firstName} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>นามสกุล</label>
                        <input type="text" name="lastName" value={profileData.lastName} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>ชื่อเล่น</label>
                        <input type="text" name="nickname" value={profileData.nickname} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>วัน/เดือน/ปีเกิด</label>
                        <input type="date" name="dob" value={profileData.dob} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>รหัสนักศึกษา</label>
                        <input type="text" name="studentId" value={profileData.studentId} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>BME รุ่นที่</label>
                        <input type="number" name="generation" value={profileData.generation} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className={labelClass}>กลุ่มสาขาวิชาเชี่ยวชาญ</label>
                        <select name="specialization" value={profileData.specialization} onChange={handleChange} disabled={!isEditing} className={inputClass}>
                          <option value="01">01 - วิศวกรรมคลินิก</option>
                          <option value="02">02 - วิศวกรรมโรงพยาบาล</option>
                          <option value="03">03 - นวัตกรรมทางวิศวกรรมชีวการแพทย์</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className={subCard}>
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-rose-400 rounded-full"></span> ช่องทางการติดต่อและโซเชียลมีเดีย
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <div className="space-y-1">
                        <label className={labelClass}>อีเมลส่วนตัว</label>
                        <input type="email" name="email" value={profileData.email} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>เบอร์โทรศัพท์</label>
                        <input type="tel" name="phone" value={profileData.phone} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className={labelClass}>Line ID</label>
                        <input type="text" name="lineId" value={profileData.lineId} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Facebook</label>
                        <input type="text" name="facebook" value={profileData.facebook} onChange={handleChange} disabled={!isEditing} className={inputClass} placeholder="ชื่อเฟสบุ๊ค หรือ ลิงก์" />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Instagram</label>
                        <input type="text" name="instagram" value={profileData.instagram} onChange={handleChange} disabled={!isEditing} className={inputClass} placeholder="@username" />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className={labelClass}>LinkedIn URL</label>
                        <input type="url" name="linkedin" value={profileData.linkedin} onChange={handleChange} disabled={!isEditing} className={inputClass} placeholder="https://linkedin.com/in/..." />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'work' && (
                <div className={subCard}>
                  <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-400 rounded-full"></span> ข้อมูลการทำงานและวิสัยทัศน์
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-1">
                      <label className={labelClass}>หมวดที่ทำงาน</label>
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
                      <label className={labelClass}>ตำแหน่งงาน (Position)</label>
                      <input type="text" name="position" value={profileData.position} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>บริษัท / องค์กร</label>
                      <input type="text" name="company" value={profileData.company} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>จังหวัดที่ทำงาน</label>
                      <input type="text" name="workLocation" value={profileData.workLocation} onChange={handleChange} disabled={!isEditing} className={inputClass} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className={labelClass}>ความเชี่ยวชาญ / ทักษะ</label>
                      <textarea name="expertise" value={profileData.expertise} onChange={handleChange} disabled={!isEditing} rows="2" className={`${inputClass} resize-none`} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className={labelClass}>คติในการทำงาน / ข้อความแนะนำตัว (Motto)</label>
                      <textarea name="motto" value={profileData.motto} onChange={handleChange} disabled={!isEditing} rows="3" className={`${inputClass} resize-none`} placeholder="สโลแกนนี้จะปรากฏใต้ชื่อคุณในทำเนียบศิษย์เก่า" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ===== คอลัมน์ขวา: บัตรสมาชิก ===== */}
            <div className="w-full lg:w-[35%] lg:sticky lg:top-24">
              <div className={`${subCard} flex flex-col items-center`}>
                <h3 className="text-lg font-black text-slate-800 w-full mb-4 border-l-4 border-purple-500 pl-3">บัตรสมาชิก BME</h3>

                {/* ตัวบัตร */}
                <div className="w-full aspect-[1.586/1] rounded-[1.25rem] p-[3px] bg-gradient-to-br from-gray-300 via-white to-gray-400 shadow-2xl transform hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 group relative">
                  <div className="w-full h-full rounded-[1.1rem] overflow-hidden relative bg-[#1c1c1c] text-white flex flex-col justify-between p-5">
                    <WavePattern />
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-400/20 blur-[30px] rounded-full z-0"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gray-600/20 blur-[30px] rounded-full z-0"></div>
                    <div className="absolute top-0 right-0 w-[200%] h-[200%] bg-gradient-to-bl from-white/20 via-transparent to-transparent transform -rotate-45 translate-x-1/4 -translate-y-1/4 opacity-30 z-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out z-20 pointer-events-none"></div>

                    <div className="flex justify-between items-start relative z-10 w-full">
                      <h2 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 leading-none drop-shadow-sm uppercase">BME <span className="font-light text-[12px] opacity-70">Alumni</span></h2>
                      <div className="w-10 h-8 rounded bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-500 flex flex-col justify-evenly px-1 py-0.5 opacity-90 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 border border-gray-400 m-1 rounded-sm"></div>
                        <div className="w-full h-px bg-gray-400/50"></div>
                        <div className="w-full h-px bg-gray-400/50"></div>
                        <div className="w-full h-px bg-gray-400/50"></div>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between w-full mt-2">
                      <div className="text-[1.1rem] sm:text-[1.2rem] md:text-[1.3rem] font-bold tracking-[0.1em] sm:tracking-[0.15em] font-mono text-gray-100 drop-shadow-md">
                        {formattedMemberId}
                      </div>
                      <div className="w-11 h-11 rounded-full border-[1.5px] border-gray-400/80 p-[2px] bg-gradient-to-br from-gray-600 to-gray-800 shadow-lg overflow-hidden">
                        <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                      </div>
                    </div>

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
                  className="mt-6 w-full py-3 bg-slate-900 text-white font-bold text-sm rounded-full shadow-md shadow-slate-900/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                  แสดงบัตรสแกน (บาร์โค้ด)
                </button>
              </div>

              <div className="mt-4 p-5 bg-white rounded-2xl border border-slate-100 flex items-start gap-3 shadow-sm">
                <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  บัตรสมาชิกดิจิทัลนี้ใช้เพื่อรับสิทธิ์ส่วนลดร้านค้าเครือข่าย และเป็นตั๋วสแกนเข้างานศิษย์เก่าของภาควิชา
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ---------- Modal บัตรเต็มจอ ---------- */}
      {showCardModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowCardModal(false)}></div>

          <div className="bg-white w-full max-w-[480px] rounded-[2rem] overflow-hidden relative z-10 shadow-2xl animate-[popUpFade_0.3s_ease-out] border border-slate-100">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-lg">สแกนบัตรสมาชิก</h3>
              <button onClick={() => setShowCardModal(false)} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-200 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-6 bg-slate-50 flex flex-col items-center">
              <div className="w-full aspect-[1.586/1] rounded-[1.5rem] p-[3px] bg-gradient-to-br from-gray-300 via-white to-gray-400 shadow-[0_20px_40px_rgba(0,0,0,0.4)] group">
                <div className="w-full h-full rounded-[1.3rem] overflow-hidden relative bg-[#1c1c1c] text-white flex flex-col justify-between p-6 md:p-8">
                  <WavePattern />
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-gray-400/20 blur-[50px] rounded-full z-0"></div>
                  <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gray-600/20 blur-[50px] rounded-full z-0"></div>

                  <div className="flex justify-between items-start relative z-10 w-full">
                    <h2 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 leading-none drop-shadow-sm uppercase">BME <span className="font-light text-[14px] opacity-70">Alumni</span></h2>
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

              <div className="w-full bg-white rounded-xl p-5 mt-6 border border-slate-200 flex flex-col items-center shadow-sm">
                <div className="w-full h-16 flex gap-[2px] justify-center items-end overflow-hidden mb-3 px-6 opacity-80">
                  {barcodeBars.map((bar, i) => (
                    <div key={i} className="bg-black" style={{ width: `${bar.w}px`, height: `${bar.h}%` }}></div>
                  ))}
                </div>
                <div className="text-[15px] font-mono tracking-[0.25em] text-slate-700 font-bold mb-3">
                  {formattedMemberId}
                </div>
                <p className="text-xs text-slate-400 font-medium">แสดงบาร์โค้ดนี้เพื่อสแกนยืนยันตัวตน ณ จุดลงทะเบียน</p>
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