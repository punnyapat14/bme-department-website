import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // เคลียร์แจ้งเตือนเมื่อเริ่มพิมพ์ใหม่
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 📌 คำสั่งเชื่อมต่อ Supabase สำหรับเข้าสู่ระบบ
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // ดักจับ Error ที่พบบ่อยเพื่อแปลเป็นภาษาไทย
        if (error.message === 'Invalid login credentials') {
          throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
        if (error.message === 'Email not confirmed') {
          throw new Error('กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ (เช็คในกล่องจดหมาย)');
        }
        throw error;
      }

      // เข้าสู่ระบบสำเร็จ
      navigate('/'); // เปลี่ยนไปหน้า Home หรือ Dashboard ที่ต้องการ

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-4 md:p-6 font-sans relative overflow-hidden">
      
      {/* 🎨 Background Blur Effect (ตีมเดียวกับหน้า Register) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 fixed">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-200/50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-red-100/60 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-xl shadow-purple-900/5 border border-gray-100 overflow-hidden flex flex-col md:flex-row relative z-10">
        
        {/* ---------------- 1. ด้านซ้าย (แบนเนอร์ตกแต่ง) ---------------- */}
        <div className="md:w-5/12 bg-gradient-to-br from-purple-800 via-purple-900 to-black p-10 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <Link to="/" className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 hover:bg-white/20 transition mb-12 shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </Link>
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">
              BME <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">Community</span>
            </h2>
            <p className="text-purple-200 font-light text-sm leading-relaxed">
              เครือข่ายนักศึกษาและศิษย์เก่า ภาควิชาวิศวกรรมชีวการแพทย์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
            </p>
          </div>
          
          <div className="relative z-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg">
              <p className="text-sm font-medium text-purple-100 leading-relaxed">
                "ยินดีต้อนรับกลับมา! เชื่อมต่อกับเพื่อนๆ ศิษย์เก่า และเข้าถึงบริการสำหรับชาว BME"
              </p>
            </div>
          </div>
        </div>

        {/* ---------------- 2. ด้านขวา (ฟอร์มเข้าสู่ระบบ) ---------------- */}
        <div className="md:w-7/12 p-8 md:p-14 lg:p-16 flex flex-col justify-center bg-white relative">
          
          {/* เส้นขอบสีด้านบน สำหรับมือถือ */}
          <div className="md:hidden absolute top-0 left-0 bg-gradient-to-r from-purple-700 via-red-500 to-purple-700 h-2 w-full"></div>

          {/* ปุ่มกลับหน้าแรก (สำหรับมือถือ) */}
          <Link to="/" className="md:hidden absolute top-6 left-6 text-gray-400 hover:text-purple-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </Link>

          <div className="text-center mb-10 mt-8 md:mt-0">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              เข้าสู่ระบบ
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              กรุณากรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งานระบบ
            </p>
          </div>

          {/* 📌 แจ้งเตือนข้อผิดพลาด */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm font-medium flex items-start gap-3 shadow-sm">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <span>{error}</span>
            </div>
          )}

          {/* 📌 Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">อีเมลเข้าสู่ระบบ</label>
              <input 
                type="email" 
                name="email" 
                required 
                value={formData.email} 
                onChange={handleChange} 
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" 
                placeholder="อีเมลของคุณ" 
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">รหัสผ่าน</label>
                <Link to="/forgot-password" className="text-sm font-bold text-purple-600 hover:text-red-500 transition-colors">ลืมรหัสผ่าน?</Link>
              </div>
              <input 
                type="password" 
                name="password" 
                required 
                value={formData.password} 
                onChange={handleChange} 
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`mt-6 w-full font-bold py-4 rounded-2xl transition-all duration-300 text-lg shadow-lg flex justify-center items-center gap-2 ${loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-purple-700 to-red-600 text-white hover:from-purple-800 hover:to-red-700 transform hover:-translate-y-1'}`}
            >
              {loading ? (
                <svg className="animate-spin h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                'เข้าสู่ระบบ'
              )}
            </button>
          </form>

          {/* 📌 ลิงก์ไปหน้าสมัครสมาชิก */}
          <div className="mt-10 text-center text-sm font-medium text-gray-500">
            ยังไม่มีบัญชีผู้ใช้งาน?
            <Link 
              to="/register" 
              className="text-purple-600 font-bold hover:text-red-500 transition-colors underline underline-offset-4 ml-2"
            >
              สมัครสมาชิกที่นี่
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}