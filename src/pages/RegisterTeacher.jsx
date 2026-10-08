import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RegisterTeacher() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    prefix: '',
    otherPrefix: '',
    fullName: '',
    nickname: '',
    phone: '',
    dob: '',
    department: 'สาขาวิชาวิศวกรรมชีวการแพทย์ (BME)',
    academicPosition: '',
    adminPosition: '',
    officeRoom: '',
    researchInterests: '',
    scholarLink: '',
    profilePic: null,
  });

  const [visibility, setVisibility] = useState({
    email: true,
    dob: false,
    fullName: true,
    nickname: true,
    phone: true,
    department: true,
    academicPosition: true,
    adminPosition: true,
    officeRoom: true,
    researchInterests: true,
    scholarLink: true
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
      alert("กรุณายอมรับข้อตกลงและนโยบายความเป็นส่วนตัว");
      return;
    }

    console.log('Teacher Form Data:', formData);
    console.log('Visibility Settings:', visibility);
    alert('ส่งข้อมูลลงทะเบียนเรียบร้อยแล้ว! กรุณารอผู้ดูแลระบบตรวจสอบและอนุมัติบัญชีของท่าน');
  };

  const FieldHeader = ({ label, fieldName, required }) => (
    <div className="flex justify-between items-end mb-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {fieldName && (
        <label className="inline-flex items-center cursor-pointer group">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={visibility[fieldName]} 
            onChange={() => handleVisibilityToggle(fieldName)} 
          />
          <div className="relative w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-red-600"></div>
          <span className={`ml-2 text-[10px] sm:text-[11px] font-medium transition-colors ${visibility[fieldName] ? 'text-red-700' : 'text-gray-400'}`}>
            {visibility[fieldName] ? 'แสดง' : 'ซ่อน'}
          </span>
        </label>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-red-950 via-black to-black text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-700/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 mb-4 bg-white/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-medium tracking-widest text-red-100 uppercase">Administrator Mode</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">ลงทะเบียนบุคลากร / คณาจารย์</h1>
          <p className="text-red-200/80 font-light text-sm md:text-base leading-relaxed">
            สร้างบัญชีสำหรับคณาจารย์เพื่อจัดการเว็บไซต์และให้ข้อมูลแก่นักศึกษา<br/>
            บัญชีของท่านจะสามารถเข้าใช้งานและได้รับสิทธิ์ผู้ดูแลระบบ หลังจากได้รับการตรวจสอบและอนุมัติแล้ว
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-red-900/10 border border-red-50">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* 1. ข้อมูลบัญชีผู้ใช้ */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
                <span className="w-2 h-6 bg-gradient-to-b from-red-600 to-red-400 rounded-full"></span>
                ข้อมูลบัญชี (Account Info)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <FieldHeader label="อีเมลบุคลากร (@kmutnb.ac.th)" fieldName="email" required />
                  <input type="email" name="email" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500/50 outline-none font-light" placeholder="teacher@kmutnb.ac.th" />
                </div>
                <div>
                  <FieldHeader label="รหัสผ่าน" required />
                  <input type="password" name="password" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500/50 outline-none font-light" placeholder="ตั้งรหัสผ่าน (6 ตัวอักษรขึ้นไป)" />
                </div>
                <div>
                  <FieldHeader label="ยืนยันรหัสผ่าน" required />
                  <input type="password" name="confirmPassword" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500/50 outline-none font-light" placeholder="กรอกรหัสผ่านอีกครั้ง" />
                </div>
              </div>
            </div>

            {/* 2. ข้อมูลส่วนตัวอาจารย์ */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
                <span className="w-2 h-6 bg-gradient-to-b from-red-600 to-red-400 rounded-full"></span>
                ข้อมูลส่วนตัว (Personal Info)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="md:col-span-1 flex flex-col gap-3">
                  <div>
                    <FieldHeader label="คำนำหน้าทางวิชาการ" required />
                    <select name="prefix" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500/50 outline-none font-light cursor-pointer">
                      <option value="">- เลือก -</option>
                      <option value="อ.">อ.</option>
                      <option value="อ.ดร.">อ.ดร.</option>
                      <option value="ผศ.">ผศ.</option>
                      <option value="ผศ.ดร.">ผศ.ดร.</option>
                      <option value="รศ.">รศ.</option>
                      <option value="รศ.ดร.">รศ.ดร.</option>
                      <option value="ศ.">ศ.</option>
                      <option value="ศ.ดร.">ศ.ดร.</option>
                      <option value="อื่นๆ">อื่นๆ (โปรดระบุ)</option>
                    </select>
                  </div>
                  {formData.prefix === 'อื่นๆ' && (
                    <div>
                      <input type="text" name="otherPrefix" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500/50 outline-none font-light" placeholder="โปรดระบุคำนำหน้า" />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <FieldHeader label="ชื่อ-นามสกุล" fieldName="fullName" required />
                  <input type="text" name="fullName" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500/50 outline-none font-light" placeholder="ไม่ต้องใส่คำนำหน้าชื่อ" />
                </div>

                <div>
                  <FieldHeader label="ชื่อเล่น" fieldName="nickname" required />
                  <input type="text" name="nickname" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500/50 outline-none font-light" placeholder="ชื่อเล่น" />
                </div>

                <div>
                  <FieldHeader label="วันเดือนปีเกิด" fieldName="dob" required />
                  <input type="date" name="dob" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500/50 outline-none font-light text-gray-700" />
                </div>

                <div>
                  <FieldHeader label="เบอร์โทรศัพท์ / เบอร์โต๊ะ" fieldName="phone" required />
                  <input type="tel" name="phone" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500/50 outline-none font-light" placeholder="08X-XXX-XXXX หรือ เบอร์ต่อ" />
                </div>
              </div>
            </div>

            {/* 3. ข้อมูลการทำงาน/วิชาการ */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
                <span className="w-2 h-6 bg-gradient-to-b from-red-600 to-red-400 rounded-full"></span>
                ข้อมูลการปฏิบัติงาน (Professional Info)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2">
                  <FieldHeader label="สังกัดภาควิชา / สาขา" fieldName="department" required />
                  <input type="text" name="department" required value={formData.department} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500/50 outline-none font-light" />
                </div>

                <div>
                  <FieldHeader label="ตำแหน่งบริหาร (ถ้ามี)" fieldName="adminPosition" />
                  <input type="text" name="adminPosition" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500/50 outline-none font-light" placeholder="เช่น หัวหน้าภาควิชา, ประธานหลักสูตร" />
                </div>
                
                <div>
                  <FieldHeader label="ห้องพักอาจารย์ / อาคาร" fieldName="officeRoom" required />
                  <input type="text" name="officeRoom" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500/50 outline-none font-light" placeholder="เช่น อาคาร 78 ชั้น 4 ห้อง ..." />
                </div>

                <div className="md:col-span-2">
                  <FieldHeader label="รายวิชาที่สอน / งานวิจัยที่สนใจ (Research Interests)" fieldName="researchInterests" />
                  <input type="text" name="researchInterests" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500/50 outline-none font-light" placeholder="เช่น Medical Imaging, Embedded Systems in Healthcare" />
                </div>

                <div className="md:col-span-2">
                  <FieldHeader label="ลิงก์ผลงานวิจัย (Google Scholar / ResearchGate)" fieldName="scholarLink" />
                  <input type="url" name="scholarLink" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500/50 outline-none font-light text-red-700" placeholder="https://scholar.google.com/citations?user=..." />
                </div>
              </div>
            </div>

            {/* 4. อัปโหลดรูปภาพ */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
                <span className="w-2 h-6 bg-gradient-to-b from-red-600 to-red-400 rounded-full"></span>
                รูปภาพโปรไฟล์ (Profile Picture)
              </h2>
              <div className="bg-red-50/30 p-5 rounded-2xl border border-red-100 border-dashed">
                <label className="block text-sm font-medium text-red-900 mb-1">รูปโปรไฟล์ <span className="text-red-500">*</span></label>
                <p className="text-xs text-red-600 mb-3 font-light">
                  • รูปชุดครุย หรือ รูปสวมสูทสุภาพ (ขนาดไม่เกิน 2MB)<br/>
                  • นามสกุล .jpg, .png, .webp
                </p>
                <input type="file" name="profilePic" accept="image/jpeg, image/png, image/webp" required onChange={handleChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-red-100 file:text-red-700 hover:file:bg-red-200 transition" />
              </div>
            </div>

            {/* 5. PDPA Consent & Submit */}
            <div className="pt-6 border-t border-gray-100">
              <div className="bg-gradient-to-r from-gray-50 to-red-50/30 p-6 md:p-8 rounded-2xl border border-red-100 mb-8">
                <label className="flex items-start cursor-pointer gap-4 group">
                  <div className="flex-shrink-0 mt-0.5">
                    <input 
                      type="checkbox" 
                      required 
                      checked={acceptedTerms} 
                      onChange={(e) => setAcceptedTerms(e.target.checked)} 
                      className="w-5 h-5 text-red-600 bg-white border-gray-300 rounded focus:ring-red-500 focus:ring-2 transition cursor-pointer" 
                    />
                  </div>
                  <div className="text-sm text-gray-700 font-medium leading-relaxed">
                    ข้าพเจ้าขอยืนยันว่าข้อมูลข้างต้นเป็นความจริง และยินยอมให้ BME Community จัดเก็บและแสดงผลข้อมูลนี้ในทำเนียบบุคลากร ตลอดจนใช้สิทธิ์ผู้ดูแลระบบ (Admin) เพื่อจัดการข้อมูลและข่าวสารของสาขาวิชาอย่างเหมาะสม โดยข้าพเจ้ารับทราบว่าบัญชีจะเข้าใช้งานได้เมื่อได้รับการอนุมัติแล้ว <span className="text-red-500">*</span>
                  </div>
                </label>
              </div>

              <div className="text-center">
                <button 
                  type="submit" 
                  disabled={!acceptedTerms}
                  className={`w-full md:w-auto font-medium py-3.5 px-12 rounded-xl transition-all duration-300 text-lg shadow-lg ${acceptedTerms ? 'bg-gradient-to-r from-red-800 to-red-600 text-white hover:from-red-700 hover:to-red-500 shadow-red-900/20' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
                >
                  ลงทะเบียนบุคลากร
                </button>
                <p className="mt-6 text-sm text-gray-500">
                  มีบัญชีอยู่แล้ว? <Link to="/login" className="text-red-700 hover:text-red-900 font-medium transition">เข้าสู่ระบบที่นี่</Link>
                </p>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}