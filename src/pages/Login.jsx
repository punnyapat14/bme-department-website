import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  
  // States สำหรับสลับหน้าและประเภทผู้ใช้
  const [isLogin, setIsLogin] = useState(true); // true = เข้าสู่ระบบ, false = สมัครสมาชิก
  const [userRole, setUserRole] = useState('student'); // 'student' หรือ 'alumni'

  // States สำหรับฟอร์ม
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    firstName: '',
    lastName: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // เคลียร์แจ้งเตือนเมื่อเริ่มพิมพ์ใหม่
  };

  // 📌 ฟังก์ชันตรวจสอบอีเมลมหาวิทยาลัย
  const isValidUniversityEmail = (email) => {
    // รองรับอีเมลนักศึกษาและบุคลากรของ มจพ.
    const validDomains = ['@kmutnb.ac.th', '@email.kmutnb.ac.th', '@sci.kmutnb.ac.th'];
    return validDomains.some(domain => email.toLowerCase().endsWith(domain));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. ตรวจสอบเงื่อนไขอีเมลสำหรับนักศึกษา
    if (userRole === 'student') {
      if (!isValidUniversityEmail(formData.email)) {
        setError('สำหรับนักศึกษาปัจจุบัน กรุณาใช้อีเมลของมหาวิทยาลัยเท่านั้น (เช่น @email.kmutnb.ac.th)');
        return;
      }
    }

    // 2. ตรวจสอบการสมัครสมาชิก (รหัสผ่านตรงกันไหม)
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    // 3. จำลองการส่งข้อมูล (ตรงนี้สามารถนำไปต่อกับ Firebase/Supabase ได้เลย)
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // สมมติว่าล็อกอินสำเร็จ ให้เด้งไปหน้าแรก
      alert(isLogin ? 'เข้าสู่ระบบสำเร็จ!' : 'สร้างบัญชีสำเร็จ!');
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] flex items-center justify-center p-4 md:p-6 font-sans">
      
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-xl border border-slate-200/80 overflow-hidden flex flex-col md:flex-row">
        
        {/* ---------------- 1. ด้านซ้าย (แบนเนอร์ตกแต่ง) ---------------- */}
        <div className="md:w-5/12 bg-gradient-to-br from-purple-900 via-purple-950 to-black p-10 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <Link to="/" className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 hover:bg-white/20 transition mb-12">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </Link>
            <h2 className="text-3xl font-extrabold mb-4 leading-tight">
              BME <br/>Community
            </h2>
            <p className="text-purple-200 font-light text-sm leading-relaxed">
              เครือข่ายนักศึกษาและศิษย์เก่า ภาควิชาวิศวกรรมชีวการแพทย์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
            </p>
          </div>
          
          <div className="relative z-10">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <p className="text-sm font-medium text-purple-100">
                "{isLogin ? 'ยินดีต้อนรับกลับมา! เชื่อมต่อกับเพื่อนๆ และเข้าถึงบริการสำหรับชาว BME' : 'ร่วมเป็นส่วนหนึ่งของเครือข่าย BME เพื่อรับข่าวสารและสิทธิพิเศษ'}"
              </p>
            </div>
          </div>
        </div>

        {/* ---------------- 2. ด้านขวา (ฟอร์มเข้าสู่ระบบ/สมัครสมาชิก) ---------------- */}
        <div className="md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
          
          {/* ปุ่มกลับหน้าแรก (สำหรับมือถือ) */}
          <Link to="/" className="md:hidden absolute top-6 left-6 text-slate-400 hover:text-purple-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
              {isLogin ? 'เข้าสู่ระบบ' : 'สร้างบัญชีผู้ใช้'}
            </h2>
            <p className="text-slate-500 text-sm">
              {isLogin ? 'กรุณาเลือกประเภทผู้ใช้งานและกรอกข้อมูลของคุณ' : 'สมัครสมาชิกเพื่อเข้าถึงฟีเจอร์จัดแผนการเรียนและอื่นๆ'}
            </p>
          </div>

          {/* 📌 ปุ่มเลือกประเภทผู้ใช้งาน (Student / Alumni) */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl mb-8 shadow-inner border border-slate-200">
            <button
              type="button"
              onClick={() => { setUserRole('student'); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${userRole === 'student' ? 'bg-white text-purple-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >
              นักศึกษาปัจจุบัน
            </button>
            <button
              type="button"
              onClick={() => { setUserRole('alumni'); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${userRole === 'alumni' ? 'bg-white text-purple-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >
              ศิษย์เก่า (Alumni)
            </button>
          </div>

          {/* 📌 แจ้งเตือนข้อผิดพลาด */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm font-medium flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <span>{error}</span>
            </div>
          )}

          {/* 📌 Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* ฟิลด์เพิ่มเติมกรณี "สมัครสมาชิก" */}
            {!isLogin && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">ชื่อ</label>
                  <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition" placeholder="ชื่อจริง" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">นามสกุล</label>
                  <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition" placeholder="นามสกุล" />
                </div>
              </div>
            )}

            {/* ฟิลด์รหัสนักศึกษา (แสดงเฉพาะฝั่งนักศึกษา) */}
            {userRole === 'student' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">รหัสนักศึกษา</label>
                <input type="text" name="studentId" required={userRole === 'student'} value={formData.studentId} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition" placeholder="รหัสนักศึกษา 13 หลัก" />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                อีเมล {userRole === 'student' && <span className="text-purple-600 normal-case ml-1">(เฉพาะอีเมลของมหาวิทยาลัย)</span>}
              </label>
              <input 
                type="email" 
                name="email" 
                required 
                value={formData.email} 
                onChange={handleChange} 
                className={`w-full bg-slate-50 border text-slate-800 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 transition ${userRole === 'student' && formData.email && !isValidUniversityEmail(formData.email) ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-purple-500 focus:ring-purple-200'}`} 
                placeholder={userRole === 'student' ? 's6xxxxxxxxxxx@email.kmutnb.ac.th' : 'your-email@example.com'} 
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">รหัสผ่าน</label>
                {isLogin && <a href="#" className="text-xs font-medium text-purple-600 hover:text-purple-800 transition">ลืมรหัสผ่าน?</a>}
              </div>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition" placeholder="••••••••" />
            </div>

            {/* ฟิลด์ยืนยันรหัสผ่าน (เฉพาะตอนสมัครสมาชิก) */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">ยืนยันรหัสผ่าน</label>
                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition" placeholder="••••••••" />
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-4 w-full bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/30 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                isLogin ? 'เข้าสู่ระบบ' : 'สร้างบัญชี'
              )}
            </button>
          </form>

          {/* 📌 สลับระหว่างหน้า Login / Register */}
          <div className="mt-8 text-center text-sm font-medium text-slate-600">
            {isLogin ? 'ยังไม่มีบัญชีใช่หรือไม่? ' : 'มีบัญชีผู้ใช้งานอยู่แล้ว? '}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-purple-600 font-bold hover:text-purple-800 hover:underline transition ml-1"
            >
              {isLogin ? 'สมัครสมาชิกที่นี่' : 'เข้าสู่ระบบ'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}