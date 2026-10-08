import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  // ดึงหน้าไปบนสุดเมื่อโหลด
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    prefix: '', 
    otherPrefix: '', 
    fullName: '',
    nickname: '',
    dob: '', 
    generation: '',
    specialization: '01', 
    studentId: '',
    
    // ข้อมูลการทำงานและคติประจำใจ
    jobCategory: '',
    otherJobCategory: '',
    position: '',
    company: '',
    workLocation: '',
    expertise: '',
    motto: '', 
    
    // ช่องทางการติดต่อ (Contact & Social)
    phone: '',
    lineId: '', 
    facebook: '', 
    instagram: '', 
    linkedin: '',
    
    profilePic: null,
    businessCard: null
  });

  const [visibility, setVisibility] = useState({
    email: true,
    dob: false,
    fullName: true,
    nickname: true,
    generation: true,
    studentId: false,
    jobCategory: true,
    position: true,
    company: true,
    workLocation: true,
    expertise: true,
    motto: true,
    phone: false, 
    lineId: false, 
    facebook: true, 
    instagram: true, 
    linkedin: true
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (file && file.size > 2097152) {
        alert("ขนาดไฟล์ใหญ่เกินไป กรุณาอัปโหลดไฟล์ขนาดไม่เกิน 2MB");
        e.target.value = ''; 
        return;
      }
      setFormData({ ...formData, [name]: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleVisibilityToggle = (field) => {
    setVisibility({ ...visibility, [field]: !visibility[field] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert("กรุณายอมรับข้อตกลงและนโยบายความเป็นส่วนตัวก่อนลงทะเบียน");
      return;
    }
    console.log('Form Data:', formData);
    console.log('Visibility Settings:', visibility);
    alert('เตรียมพร้อมบันทึกข้อมูลลงฐานข้อมูล!');
  };

  // คอมโพเนนต์ Label + ปุ่มแสดง/ซ่อนแบบ Light Theme
  const FieldHeader = ({ label, fieldName, required }) => (
    <div className="flex justify-between items-end mb-2">
      <label className="block text-sm font-bold text-gray-700">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {fieldName && (
        <label className="inline-flex items-center cursor-pointer group">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={visibility[fieldName]} 
            onChange={() => handleVisibilityToggle(fieldName)} 
          />
          <div className="relative w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-purple-600 shadow-inner border border-gray-300 peer-checked:border-purple-600"></div>
          <span className={`ml-2 text-[10px] sm:text-[11px] font-bold transition-colors ${visibility[fieldName] ? 'text-purple-700' : 'text-gray-400'}`}>
            {visibility[fieldName] ? 'แสดง' : 'ซ่อน'}
          </span>
        </label>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Background Decor (Light Theme) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 fixed">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-200/50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-red-100/60 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMikiLz48L3N2Zz4=')] z-0"></div>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-xl shadow-purple-900/5 border border-gray-100 relative z-10 overflow-hidden my-6">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-purple-700 via-red-500 to-purple-700 h-2 w-full"></div>
        
        <div className="p-8 md:p-14">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-bold tracking-widest uppercase mb-4 border border-purple-100">BME Alumni Network</div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">ลงทะเบียนศิษย์เก่า</h1>
            <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              สร้างบัญชีเพื่อรับหมายเลขสมาชิก และเปิดโปรไฟล์ในเครือข่าย BME Alumni <br className="hidden md:block"/>
              คุณสามารถเลือก <span className="font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700 border border-gray-200">เปิด/ซ่อน</span> ข้อมูลส่วนตัวแต่ละช่องให้ผู้อื่นเห็นได้ตามต้องการ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* 1. ข้อมูลบัญชีผู้ใช้ */}
            <div className="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                ข้อมูลบัญชี (Account Info)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="md:col-span-2">
                  <FieldHeader label="อีเมลส่วนตัว" fieldName="email" required />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" placeholder="ใช้สำหรับเข้าสู่ระบบและรับข่าวสาร" />
                </div>
                <div>
                  <FieldHeader label="รหัสผ่าน" required />
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" placeholder="ตั้งรหัสผ่าน (6 ตัวอักษรขึ้นไป)" />
                </div>
                <div>
                  <FieldHeader label="ยืนยันรหัสผ่าน" required />
                  <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" placeholder="กรอกรหัสผ่านอีกครั้ง" />
                </div>
              </div>
            </div>

            {/* 2. ข้อมูลส่วนตัว */}
            <div className="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
                ข้อมูลส่วนบุคคล (Personal Info)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                
                <div className="md:col-span-1 flex flex-col gap-3">
                  <div>
                    <FieldHeader label="คำนำหน้า" required />
                    <select name="prefix" required value={formData.prefix} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer">
                      <option value="">- เลือก -</option>
                      <option value="นาย">นาย</option>
                      <option value="นาง">นาง</option>
                      <option value="นางสาว">นางสาว</option>
                      <option value="อื่นๆ">อื่นๆ (โปรดระบุ)</option>
                    </select>
                  </div>
                  {formData.prefix === 'อื่นๆ' && (
                    <div>
                      <input type="text" name="otherPrefix" required value={formData.otherPrefix} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 transition-all placeholder-gray-400" placeholder="โปรดระบุ" />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <FieldHeader label="ชื่อ-นามสกุล" fieldName="fullName" required />
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" placeholder="สมชาย ใจดี" />
                </div>

                <div>
                  <FieldHeader label="ชื่อเล่น" fieldName="nickname" required />
                  <input type="text" name="nickname" required value={formData.nickname} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" placeholder="ชื่อเล่น" />
                </div>

                <div>
                  <FieldHeader label="วันเดือนปีเกิด" fieldName="dob" required />
                  <input type="date" name="dob" required value={formData.dob} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" />
                </div>

                <div>
                  <FieldHeader label="BME รุ่นที่" fieldName="generation" required />
                  <input type="number" name="generation" required min="1" max="99" value={formData.generation} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" placeholder="เช่น 1, 2, 3" />
                </div>

                <div className="md:col-span-2">
                  <FieldHeader label="กลุ่มสาขาวิชาเชี่ยวชาญ" required />
                  <select name="specialization" required value={formData.specialization} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer">
                    <option value="01">01 - วิศวกรรมคลินิก</option>
                    <option value="02">02 - วิศวกรรมโรงพยาบาล</option>
                    <option value="03">03 - นวัตกรรมทางวิศวกรรมชีวการแพทย์</option>
                  </select>
                </div>

                <div className="md:col-span-1">
                  <FieldHeader label="รหัสนักศึกษา" fieldName="studentId" required />
                  <input type="text" name="studentId" required maxLength="13" value={formData.studentId} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" placeholder="6304000000000" />
                </div>

              </div>
            </div>

            {/* 3. ข้อมูลการทำงานและคติประจำใจ */}
            <div className="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                ข้อมูลการทำงานและวิสัยทัศน์ (Professional Info)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                <div className="flex flex-col gap-3">
                  <div>
                    <FieldHeader label="หมวดที่ทำงาน" fieldName="jobCategory" required />
                    <select name="jobCategory" required value={formData.jobCategory} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer">
                      <option value="">-- เลือกหมวดหมู่ --</option>
                      <option value="วิศวกรบริการ (Service Engineer)">วิศวกรบริการ (Service Engineer)</option>
                      <option value="ผู้เชี่ยวชาญผลิตภัณฑ์ (Product Specialist)">ผู้เชี่ยวชาญผลิตภัณฑ์ (Product Specialist)</option>
                      <option value="วิศวกรโรงพยาบาล (Hospital Engineer)">วิศวกรโรงพยาบาล (Hospital Engineer)</option>
                      <option value="นักวิจัย/พัฒนา (R&D)">นักวิจัย/พัฒนา (R&D)</option>
                      <option value="ฝ่ายขาย (Sale)">ฝ่ายขาย (Sale)</option>
                      <option value="ประกอบธุรกิจส่วนตัว">ประกอบธุรกิจส่วนตัว</option>
                      <option value="ศึกษาต่อ">ศึกษาต่อ</option>
                      <option value="อื่นๆ">อื่นๆ (โปรดระบุ)</option>
                    </select>
                  </div>
                  {formData.jobCategory === 'อื่นๆ' && (
                    <div>
                      <input type="text" name="otherJobCategory" required value={formData.otherJobCategory} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 transition-all placeholder-gray-400" placeholder="โปรดระบุ" />
                    </div>
                  )}
                </div>

                <div>
                  <FieldHeader label="ตำแหน่งงาน (Position)" fieldName="position" />
                  <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" placeholder="เช่น Senior Engineer" />
                </div>
                
                <div>
                  <FieldHeader label="องค์กร / บริษัท" fieldName="company" required />
                  <input type="text" name="company" required value={formData.company} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" placeholder="ชื่อองค์กร / โรงพยาบาล" />
                </div>

                <div>
                  <FieldHeader label="จังหวัดที่ทำงาน" fieldName="workLocation" />
                  <input type="text" name="workLocation" value={formData.workLocation} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" placeholder="เช่น กรุงเทพมหานคร" />
                </div>

                <div className="md:col-span-2">
                  <FieldHeader label="ความเชี่ยวชาญเฉพาะด้าน (Skills & Expertise)" fieldName="expertise" />
                  <input type="text" name="expertise" value={formData.expertise} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" placeholder="เช่น ISO 13485, AI in Healthcare" />
                </div>

                <div className="md:col-span-2">
                  <FieldHeader label="คติในการทำงาน / ข้อความแนะนำตัว" fieldName="motto" />
                  <textarea name="motto" value={formData.motto} onChange={handleChange} rows="2" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400 resize-none" placeholder="สโลแกนนี้จะปรากฏใต้ชื่อคุณในทำเนียบศิษย์เก่า" />
                </div>
              </div>
            </div>

            {/* 4. ช่องทางการติดต่อ */}
            <div className="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
                ช่องทางการติดต่อ (Contact & Social)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                <div>
                  <FieldHeader label="เบอร์โทรศัพท์" fieldName="phone" required />
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" placeholder="080-000-0000" />
                </div>

                <div>
                  <FieldHeader label="Line ID" fieldName="lineId" />
                  <input type="text" name="lineId" value={formData.lineId} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" placeholder="Line ID ของคุณ" />
                </div>

                <div className="md:col-span-2">
                  <FieldHeader label="LinkedIn URL" fieldName="linkedin" />
                  <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" placeholder="https://linkedin.com/in/..." />
                </div>

                <div>
                  <FieldHeader label="Facebook" fieldName="facebook" />
                  <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" placeholder="ชื่อ Facebook หรือ URL" />
                </div>

                <div>
                  <FieldHeader label="Instagram" fieldName="instagram" />
                  <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" placeholder="@username" />
                </div>

              </div>
            </div>

            {/* 5. อัปโหลดรูปภาพ */}
            <div className="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                รูปภาพและเอกสาร (Uploads)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-white p-5 rounded-2xl border-2 border-purple-200 border-dashed hover:border-purple-400 transition-colors">
                  <label className="block text-sm font-bold text-gray-900 mb-1">รูปโปรไฟล์ (Profile Picture) <span className="text-red-500">*</span></label>
                  <p className="text-xs text-gray-500 mb-4 font-light">
                    • ขนาดไม่เกิน 2MB (สัดส่วน 1:1 จัตุรัส)<br/>
                    • นามสกุล .jpg, .png, .webp
                  </p>
                  <input type="file" name="profilePic" accept="image/jpeg, image/png, image/webp" required onChange={handleChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-colors cursor-pointer" />
                </div>
                
                <div className="bg-white p-5 rounded-2xl border-2 border-gray-200 border-dashed hover:border-gray-300 transition-colors">
                  <label className="block text-sm font-bold text-gray-900 mb-1">รูปนามบัตร (Business Card)</label>
                  <p className="text-xs text-gray-500 mb-4 font-light">
                    • ขนาดไม่เกิน 2MB (แนวนอน)<br/>
                    • นามสกุล .jpg, .png, .webp
                  </p>
                  <input type="file" name="businessCard" accept="image/jpeg, image/png, image/webp" onChange={handleChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-colors cursor-pointer" />
                </div>

              </div>
            </div>

            {/* 6. PDPA Consent & Submit */}
            <div className="pt-4">
              <div className="bg-purple-50/50 p-6 md:p-8 rounded-3xl border border-purple-100 mb-8">
                <div className="mb-6 pb-6 border-b border-purple-100">
                  <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    นโยบายการคุ้มครองข้อมูลส่วนบุคคล (PDPA)
                  </h3>
                  
                  <div className="text-sm text-gray-700 font-light leading-relaxed h-48 overflow-y-auto pr-4 bg-white p-5 rounded-2xl border border-purple-100 shadow-sm custom-scrollbar">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">1. ผู้ควบคุมข้อมูลส่วนบุคคล</h4>
                        <p>ผู้ควบคุมข้อมูลคือ ทีมงาน BME Community สาขาวิศวกรรมชีวการแพทย์ คณะวิทยาศาสตร์ประยุกต์ มจพ.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">2. ข้อมูลที่เก็บและเหตุผลที่ต้องใช้</h4>
                        <p>ใช้ในการตรวจสอบสิทธิ์ความเป็นศิษย์เก่า สร้างช่องทางในการติดต่อเครือข่าย จัดกลุ่มเครือข่ายวิชาชีพ แลกเปลี่ยนประสบการณ์ และวิเคราะห์สถิติภาพรวมของสาขา</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">3. สิทธิของเจ้าของข้อมูล</h4>
                        <p>การแสดงผลข้อมูลส่วนตัวในทำเนียบสาธารณะ ใช้ตาม <strong>ฐานความยินยอม (Consent)</strong> ซึ่งผู้สมัครสามารถใช้ฟังก์ชัน "แสดง/ซ่อน" ข้อมูลแต่ละส่วนได้ทุกเมื่อ และแก้ไขได้ตลอดเวลา</p>
                      </div>
                    </div>
                  </div>
                </div>

                <label className="flex items-start cursor-pointer gap-4 group">
                  <div className="flex-shrink-0 mt-0.5">
                    <input 
                      type="checkbox" 
                      required 
                      checked={acceptedTerms} 
                      onChange={(e) => setAcceptedTerms(e.target.checked)} 
                      className="w-5 h-5 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500 focus:ring-2 transition cursor-pointer" 
                    />
                  </div>
                  <div className="text-sm text-gray-700 font-medium leading-relaxed">
                    ข้าพเจ้าได้อ่านและทำความเข้าใจนโยบายการคุ้มครองข้อมูลส่วนบุคคลแล้ว และ <span className="text-purple-700 font-bold">ยินยอม</span> ให้ BME Community จัดเก็บและใช้งานข้อมูลของข้าพเจ้า <span className="text-red-500">*</span>
                  </div>
                </label>
              </div>

              <div className="text-center">
                <button 
                  type="submit" 
                  disabled={!acceptedTerms}
                  className={`w-full md:w-auto font-bold py-4 px-14 rounded-2xl transition-all duration-300 text-lg shadow-lg ${acceptedTerms ? 'bg-gradient-to-r from-purple-700 to-red-600 text-white hover:from-purple-800 hover:to-red-700 hover:shadow-purple-900/30 transform hover:-translate-y-1' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
                >
                  ลงทะเบียนสร้างโปรไฟล์
                </button>
                <p className="mt-8 text-sm text-gray-500">
                  มีบัญชีอยู่แล้ว? <Link to="/login" className="text-purple-600 font-bold hover:text-red-500 transition-colors underline underline-offset-4">เข้าสู่ระบบที่นี่</Link>
                </p>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}