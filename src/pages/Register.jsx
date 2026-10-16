import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../supabaseClient";

// รายชื่อ 77 จังหวัด
const provinces = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท", 
  "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม", "นครราชสีมา", 
  "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", 
  "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", 
  "แพร่", "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี", 
  "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร", 
  "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง", 
  "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี", "อุบลราชธานี"
];

// 10 สายงานจากภาพอ้างอิง
const jobCategories = [
  "วิศวกรชีวการแพทย์ (BIOMEDICAL ENGINEER)",
  "นักอุปกรณ์ชีวการแพทย์ (BIOMEDICAL INSTRUMENTATION SPECIALIST)",
  "ผู้เชี่ยวชาญด้านผลิตภัณฑ์ (PRODUCT / APPLICATION SPECIALIST)",
  "วิศวกรฝ่ายขาย (MEDICAL SALES ENGINEER)",
  "วิศวกรบริการเทคนิค (TECHNICAL SERVICE ENGINEER)",
  "นักวิเคราะห์ข้อมูลทางการแพทย์ (MEDICAL DATA ANALYST)",
  "นักพัฒนาและวิเคราะห์ระบบสารสนเทศในโรงพยาบาลฯ (HOSPITAL INFORMATION SYSTEM (HIS) DEVELOPER & ANALYST)",
  "นักวิจัยและนวัตกรทางการแพทย์ (MEDICAL RESEARCHER & INNOVATOR)",
  "ผู้ประกอบการหรือสตาร์ทอัพทางด้านการแพทย์ (MEDICAL TECH ENTREPRENEUR & STARTUP)",
  "ประกอบอาชีพอิสระ หรือประกอบอาชีพอื่นๆ ที่เกี่ยวข้อง (FREELANCE & RELATED ENGINEERING PROFESSIONS)"
];

export default function Register() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [role, setRole] = useState('alumni');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showPdpaModal, setShowPdpaModal] = useState(false);

  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    prefix: '', otherPrefix: '', fullName: '', nickname: '', dob: '', 
    phone: '', lineId: '', facebook: '', instagram: '', linkedin: '', otherContact: '',
    
    // Alumni
    generation: '', studentId: '', specialization: '01', jobCategory: '', 
    company: '', workLocation: '', expertise: '', motto: '',
    profilePicUrl: '', businessCardUrl: '',
    
    // Student
    currentYear: '', enrollmentYear: '',
    
    // Admin
    academicPosition: '', adminPosition: '', officeRoom: '', academicWorks: '', internalPhone: ''
  });

  const [visibility, setVisibility] = useState({
    email: true, dob: false, fullName: true, nickname: true, generation: true, studentId: false, 
    jobCategory: true, company: true, workLocation: true, expertise: true, motto: true, 
    phone: false, lineId: false, facebook: true, instagram: true, linkedin: true, otherContact: true,
    currentYear: true, enrollmentYear: true,
    academicPosition: true, adminPosition: true, officeRoom: true, academicWorks: true, internalPhone: true
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVisibilityToggle = (field) => {
    setVisibility({ ...visibility, [field]: !visibility[field] });
  };

  // เช็คความแข็งแกร่งรหัสผ่าน
  const calculatePasswordStrength = (pw) => {
    let score = 0;
    if (pw.length >= 6) score += 1;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score += 1;
    return score; // 0-4
  };
  const pwScore = calculatePasswordStrength(formData.password);
  const strengthColors = ['bg-gray-200', 'bg-red-500', 'bg-orange-500', 'bg-yellow-400', 'bg-green-500'];
  const strengthLabels = ['ต่ำเกินไป', 'อ่อน', 'ปานกลาง', 'ดี', 'แข็งแกร่ง'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) return alert("กรุณายอมรับข้อตกลงก่อนลงทะเบียน");
    if (formData.password !== formData.confirmPassword) return alert("รหัสผ่านไม่ตรงกัน!");
    if (formData.password.length < 6) return alert("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");

    if (role === 'student' || role === 'admin') {
      const emailDomain = formData.email.split('@')[1]?.toLowerCase();
      if (emailDomain !== 'email.kmutnb.ac.th' && emailDomain !== 'sci.kmutnb.ac.th') {
        return alert("นักศึกษาและอาจารย์ ต้องใช้อีเมล @email.kmutnb.ac.th หรือ @sci.kmutnb.ac.th เท่านั้น");
      }
    }

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: role,
            prefix: formData.prefix === 'อื่นๆ' ? formData.otherPrefix : formData.prefix,
            full_name: formData.fullName,
            nickname: formData.nickname,
            dob: formData.dob || null,
            phone: formData.phone,
            other_contact: formData.otherContact,
            profile_pic_url: formData.profilePicUrl,
            visibility: visibility,
            
            // ข้อมูลศิษย์เก่า
            generation: role !== 'admin' ? formData.generation : null,
            student_id: role !== 'admin' ? formData.studentId : null,
            specialization: role === 'alumni' ? formData.specialization : null,
            job_category: role === 'alumni' ? formData.jobCategory : null,
            company: role === 'alumni' ? formData.company : null,
            work_location: role === 'alumni' ? formData.workLocation : null,
            expertise: role === 'alumni' ? formData.expertise : null,
            motto: role === 'alumni' ? formData.motto : null,
            line_id: formData.lineId, facebook: formData.facebook, instagram: formData.instagram, linkedin: formData.linkedin, business_card_url: formData.businessCardUrl,

            // ข้อมูลนักศึกษา
            current_year: role === 'student' ? formData.currentYear : null,
            enrollment_year: role === 'student' ? formData.enrollmentYear : null,

            // ข้อมูลอาจารย์/แอดมิน
            academic_position: role === 'admin' ? formData.academicPosition : null,
            admin_position: role === 'admin' ? formData.adminPosition : null,
            office_room: role === 'admin' ? formData.officeRoom : null,
            academic_works: role === 'admin' ? formData.academicWorks : null,
            internal_phone: role === 'admin' ? formData.internalPhone : null,
          }
        }
      });

      if (authError) throw authError;
      setSuccessMsg(`ส่งลิงก์ยืนยันไปที่ ${formData.email} แล้ว กรุณาตรวจสอบอีเมลของคุณ`);
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ⭐️ คอมโพเนนต์ปุ่ม Toggle เปิด-ปิด ดีไซน์ใหม่ สวยงาม พรีเมียม ⭐️
  const FieldHeader = ({ label, fieldName, required }) => (
    <div className="flex justify-between items-end mb-2">
      <label className="block text-sm font-bold text-gray-700">{label} {required && <span className="text-red-500 ml-1">*</span>}</label>
      {fieldName && (
        <label className="relative inline-flex items-center cursor-pointer group select-none hover:opacity-90 transition-opacity">
          <input type="checkbox" className="sr-only peer" checked={visibility[fieldName]} onChange={() => handleVisibilityToggle(fieldName)} />
          
          {/* กรอบสวิตช์ (Track) */}
          <div className="w-[76px] h-8 bg-gray-200 rounded-full peer-checked:bg-purple-600 transition-colors duration-500 shadow-inner border border-gray-300 peer-checked:border-purple-600 overflow-hidden relative">
            
            {/* ข้อความ "ซ่อน" (แสดงเมื่อปิด) */}
            <span className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 transition-all duration-500 ${
              visibility[fieldName] ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
            }`}>
              ซ่อน
            </span>

            {/* ข้อความ "แสดง" (แสดงเมื่อเปิด) */}
            <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white transition-all duration-500 ${
              visibility[fieldName] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              แสดง
            </span>
          </div>

          {/* วงกลมสวิตช์ (Thumb) */}
          <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] peer-checked:translate-x-[44px]">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* ไอคอน ตา (เปิด) */}
              <svg className={`absolute w-3.5 h-3.5 text-purple-600 transition-all duration-500 ${visibility[fieldName] ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path fillRule="evenodd" clipRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" />
              </svg>

              {/* ไอคอน แม่กุญแจ (ปิด) */}
              <svg className={`absolute w-3 h-3 text-gray-500 transition-all duration-500 ${visibility[fieldName] ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" />
              </svg>
            </div>
          </div>
          
        </label>
      )}
    </div>
  );

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400";

  if (successMsg) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-6"><div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full text-center"><h2 className="text-3xl font-extrabold mb-4">ตรวจสอบอีเมล</h2><p className="mb-8">{successMsg}</p><Link to="/login" className="block w-full py-4 rounded-xl bg-purple-700 text-white font-bold">ไปหน้าเข้าสู่ระบบ</Link></div></div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center py-12 px-4 relative font-sans">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-xl border border-gray-100 relative z-10 overflow-hidden my-6">
        <div className="bg-gradient-to-r from-purple-700 via-red-500 to-purple-700 h-2 w-full"></div>
        <div className="p-8 md:p-14">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">สร้างบัญชีผู้ใช้งาน</h1>
            <p className="text-gray-500 text-sm">เลือกประเภทบัญชี เพื่อเข้าสู่เครือข่าย BME Community</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[{ id: 'alumni', label: '🎓 ศิษย์เก่า (Alumni)' }, { id: 'student', label: '📚 นักศึกษาปัจจุบัน' }, { id: 'admin', label: '👨‍🏫 อาจารย์ / แอดมิน' }].map((r) => (
              <button key={r.id} type="button" onClick={() => setRole(r.id)} className={`px-6 py-4 rounded-2xl border-2 font-bold transition-all w-full sm:w-auto flex-1 ${role === r.id ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-md scale-[1.02]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{r.label}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Account Info */}
            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><span className="w-1.5 h-6 bg-purple-600 rounded-full"></span> ข้อมูลบัญชี</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <FieldHeader label="อีเมลเข้าสู่ระบบ" fieldName="email" required />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder={role === 'alumni' ? "เช่น example@gmail.com" : "เช่น s6xxxxxxxxxxx@email.kmutnb.ac.th"} />
                  {(role === 'student' || role === 'admin') && <p className="text-xs text-red-500 mt-2 font-bold">ต้องใช้อีเมล @email.kmutnb.ac.th หรือ @sci.kmutnb.ac.th เท่านั้น</p>}
                </div>
                <div>
                  <FieldHeader label="รหัสผ่าน (ขั้นต่ำ 6 ตัวอักษร)" required />
                  <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} className={inputClass} placeholder="••••••••" />
                  {/* แถบวัดรหัสผ่าน */}
                  {formData.password && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden flex gap-1">
                        {[1,2,3,4].map(i => <div key={i} className={`h-full flex-1 transition-colors duration-300 ${pwScore >= i ? strengthColors[pwScore] : 'bg-transparent'}`}></div>)}
                      </div>
                      <span className={`text-[10px] font-bold ${strengthColors[pwScore].replace('bg-', 'text-')}`}>{strengthLabels[pwScore]}</span>
                    </div>
                  )}
                </div>
                <div>
                  <FieldHeader label="ยืนยันรหัสผ่าน" required />
                  <input type="password" name="confirmPassword" required minLength="6" value={formData.confirmPassword} onChange={handleChange} className={inputClass} placeholder="••••••••" />
                </div>
              </div>
            </div>

            {/* 2. Personal Info */}
            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><span className="w-1.5 h-6 bg-red-500 rounded-full"></span> ข้อมูลส่วนบุคคล</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <FieldHeader label="คำนำหน้า" required />
                  <select name="prefix" required value={formData.prefix} onChange={handleChange} className={inputClass}>
                    <option value="">-- เลือก --</option><option value="นาย">นาย</option><option value="นาง">นาง</option><option value="นางสาว">นางสาว</option>
                    {role === 'admin' && <><option value="อ.ดร.">อ.ดร.</option><option value="ผศ.ดร.">ผศ.ดร.</option><option value="รศ.ดร.">รศ.ดร.</option><option value="ศ.ดร.">ศ.ดร.</option></>}
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>
                <div className="md:col-span-2"><FieldHeader label="ชื่อ-นามสกุล" fieldName="fullName" required /><input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className={inputClass} placeholder="เช่น สมชาย ใจดี" /></div>
                <div><FieldHeader label="ชื่อเล่น" fieldName="nickname" required={role !== 'admin'} /><input type="text" name="nickname" required={role !== 'admin'} value={formData.nickname} onChange={handleChange} className={inputClass} placeholder="เช่น ชาย" /></div>
                {(role === 'alumni' || role === 'student') && (<div><FieldHeader label="วันเดือนปีเกิด" fieldName="dob" required /><input type="date" name="dob" required value={formData.dob} onChange={handleChange} className={inputClass} /></div>)}
              </div>
            </div>

            {/* 3. Academic Info */}
            {(role === 'student' || role === 'alumni') && (
              <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><span className="w-1.5 h-6 bg-blue-500 rounded-full"></span> ข้อมูลการศึกษา</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><FieldHeader label="BME รุ่นที่" fieldName="generation" required /><input type="number" name="generation" required value={formData.generation} onChange={handleChange} className={inputClass} placeholder="เช่น 15" /></div>
                  <div><FieldHeader label="รหัสนักศึกษา" fieldName="studentId" required /><input type="text" name="studentId" required maxLength="13" value={formData.studentId} onChange={handleChange} className={inputClass} placeholder="เช่น 640xxxxxxxxxx" /></div>
                  {role === 'alumni' && (<div className="md:col-span-2"><FieldHeader label="กลุ่มสาขาวิชาเชี่ยวชาญ (ตอนเรียน)" required /><select name="specialization" required value={formData.specialization} onChange={handleChange} className={inputClass}><option value="01">01 - วิศวกรรมคลินิก</option><option value="02">02 - วิศวกรรมโรงพยาบาล</option><option value="03">03 - นวัตกรรมทางวิศวกรรมชีวการแพทย์</option></select></div>)}
                  {role === 'student' && (
                    <>
                      <div><FieldHeader label="ปีการศึกษาที่เข้าศึกษา" fieldName="enrollmentYear" required /><input type="number" name="enrollmentYear" required value={formData.enrollmentYear} onChange={handleChange} className={inputClass} placeholder="เช่น 2566" /></div>
                      <div><FieldHeader label="ชั้นปีที่กำลังศึกษา" fieldName="currentYear" required /><select name="currentYear" required value={formData.currentYear} onChange={handleChange} className={inputClass}><option value="">-- เลือกชั้นปี --</option><option value="ปี 1">ปี 1</option><option value="ปี 2">ปี 2</option><option value="ปี 3">ปี 3</option><option value="ปี 4">ปี 4</option></select></div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* 4A. Alumni Work */}
            {role === 'alumni' && (
              <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><span className="w-1.5 h-6 bg-amber-500 rounded-full"></span> ข้อมูลการทำงาน</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2"><FieldHeader label="หมวดที่ทำงาน (10 สายงาน)" fieldName="jobCategory" required /><select name="jobCategory" required value={formData.jobCategory} onChange={handleChange} className={inputClass}><option value="">-- เลือกสายงาน --</option>{jobCategories.map(job => <option key={job} value={job}>{job}</option>)}</select></div>
                  <div><FieldHeader label="องค์กร / บริษัท" fieldName="company" required /><input type="text" name="company" required value={formData.company} onChange={handleChange} className={inputClass} placeholder="เช่น รพ.ศิริราช หรือ บริษัท เอบีซี จำกัด" /></div>
                  <div><FieldHeader label="จังหวัดที่ทำงาน" fieldName="workLocation" /><select name="workLocation" value={formData.workLocation} onChange={handleChange} className={inputClass}><option value="">-- เลือกจังหวัด --</option>{provinces.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                  <div className="md:col-span-2"><FieldHeader label="ความเชี่ยวชาญเฉพาะด้าน (Expertise)" fieldName="expertise" /><input type="text" name="expertise" value={formData.expertise} onChange={handleChange} className={inputClass} placeholder="เช่น ซ่อมบำรุงเครื่องช่วยหายใจ, เขียนโปรแกรม HIS" /></div>
                  <div className="md:col-span-2"><FieldHeader label="คติในการทำงาน" fieldName="motto" /><textarea name="motto" value={formData.motto} onChange={handleChange} rows="2" className={inputClass} placeholder="เช่น ความพยายามอยู่ที่ไหน ความสำเร็จอยู่ที่นั่น" /></div>
                </div>
              </div>
            )}

            {/* 4B. Admin Work */}
            {role === 'admin' && (
              <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><span className="w-1.5 h-6 bg-amber-500 rounded-full"></span> ข้อมูลการทำงาน</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><FieldHeader label="ตำแหน่งทางวิชาการ" fieldName="academicPosition" /><input type="text" name="academicPosition" value={formData.academicPosition} onChange={handleChange} className={inputClass} placeholder="เช่น รองศาสตราจารย์" /></div>
                  <div><FieldHeader label="ตำแหน่งบริหาร (ถ้ามี)" fieldName="adminPosition" /><input type="text" name="adminPosition" value={formData.adminPosition} onChange={handleChange} className={inputClass} placeholder="เช่น หัวหน้าภาควิชา" /></div>
                  <div><FieldHeader label="ห้องพักอาจารย์ (Office Room)" fieldName="officeRoom" /><input type="text" name="officeRoom" value={formData.officeRoom} onChange={handleChange} className={inputClass} placeholder="เช่น 78-601" /></div>
                  <div className="md:col-span-2"><FieldHeader label="ผลงานวิชาการ (Academic Works)" fieldName="academicWorks" /><textarea name="academicWorks" value={formData.academicWorks} onChange={handleChange} rows="3" className={inputClass} placeholder="ระบุผลงานวิชาการที่โดดเด่น หรืองานวิจัยที่เชี่ยวชาญ..." /></div>
                </div>
              </div>
            )}

            {/* 5. Contacts */}
            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span> ช่องทางการติดต่อ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><FieldHeader label="เบอร์โทรศัพท์" fieldName="phone" required={role !== 'admin'} /><input type="tel" name="phone" required={role !== 'admin'} value={formData.phone} onChange={handleChange} className={inputClass} placeholder="เช่น 0812345678" /></div>
                {role === 'admin' && <div><FieldHeader label="เบอร์โทรภายในมหาวิทยาลัย" fieldName="internalPhone" /><input type="tel" name="internalPhone" value={formData.internalPhone} onChange={handleChange} className={inputClass} placeholder="เช่น 1234" /></div>}
                <div><FieldHeader label="Line ID" fieldName="lineId" /><input type="text" name="lineId" value={formData.lineId} onChange={handleChange} className={inputClass} placeholder="เช่น mylineid123" /></div>
                <div><FieldHeader label="Facebook" fieldName="facebook" /><input type="text" name="facebook" value={formData.facebook} onChange={handleChange} className={inputClass} placeholder="เช่น Somchai Jaidee" /></div>
                <div><FieldHeader label="Instagram" fieldName="instagram" /><input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className={inputClass} placeholder="เช่น somchai.ig" /></div>
                <div className="md:col-span-2"><FieldHeader label="LinkedIn URL" fieldName="linkedin" /><input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className={inputClass} placeholder="เช่น https://www.linkedin.com/in/somchai" /></div>
                <div className="md:col-span-2"><FieldHeader label="ช่องทางการติดต่ออื่นๆ" fieldName="otherContact" /><input type="text" name="otherContact" value={formData.otherContact} onChange={handleChange} className={inputClass} placeholder="เช่น Twitter, Website ส่วนตัว ฯลฯ" /></div>
              </div>
            </div>

            {/* 6. Uploads */}
            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><span className="w-1.5 h-6 bg-purple-600 rounded-full"></span> รูปภาพ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={role === 'student' ? 'md:col-span-2' : ''}><label className="block text-sm font-bold mb-1 text-gray-700">ลิงก์รููปโปรไฟล์ URL</label><input type="url" name="profilePicUrl" value={formData.profilePicUrl} onChange={handleChange} className={inputClass} placeholder="เช่น https://example.com/profile.jpg" /></div>
                {(role === 'alumni' || role === 'admin') && <div><label className="block text-sm font-bold mb-1 text-gray-700">รููปนามบัตร URL</label><input type="url" name="businessCardUrl" value={formData.businessCardUrl} onChange={handleChange} className={inputClass} placeholder="เช่น https://example.com/card.jpg" /></div>}
              </div>
            </div>

            {/* 7. Submit & PDPA */}
            <div className="pt-4">
              <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100 mb-8">
                <label className="flex items-start cursor-pointer gap-4">
                  <input type="checkbox" required checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="w-5 h-5 mt-0.5 text-purple-600 rounded focus:ring-purple-500" />
                  <div className="text-sm text-gray-700 leading-relaxed">
                    ข้าพเจ้าได้อ่านและทำความเข้าใจ <button type="button" onClick={() => setShowPdpaModal(true)} className="text-purple-700 font-bold underline hover:text-purple-900 transition-colors">นโยบายความเป็นส่วนตัว (PDPA)</button> แล้ว และยินยอมให้จัดเก็บข้อมูล <span className="text-red-500">*</span>
                  </div>
                </label>
              </div>
              <button type="submit" disabled={!acceptedTerms || loading} className={`w-full font-bold py-4 rounded-2xl text-lg transition-all duration-300 ${acceptedTerms && !loading ? 'bg-purple-700 text-white hover:bg-purple-800 shadow-lg hover:shadow-xl hover:-translate-y-1' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนสร้างบัญชี'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* PDPA Modal */}
      {showPdpaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 max-h-[80vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">นโยบายความเป็นส่วนตัว (PDPA)</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              (ใส่รายละเอียดนโยบายความเป็นส่วนตัวของ BME Community ที่นี่...) <br/><br/>
              ทางเราจะเก็บรักษาข้อมูลของท่านไว้อย่างปลอดภัย และใช้เพื่อประโยชน์ในการติดต่อสื่อสารภายในเครือข่ายศิษย์เก่าและนักศึกษาเท่านั้น
            </p>
            <button onClick={() => setShowPdpaModal(false)} className="w-full py-3 bg-purple-100 text-purple-800 font-bold rounded-xl hover:bg-purple-200 transition-colors">ปิดหน้าต่าง</button>
          </div>
        </div>
      )}
    </div>
  );
}