import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
// ปิดการใช้งาน supabase ชั่วคราวเพื่อใช้ Mock Auth
// import { supabase } from '../services/supabase'; 
import bmeLogo from '../assets/bme_community.png';

export default function Navbar() {
  const { user, logout } = useAuth(); // ดึง user และ logout ออกมาจาก Context
  const location = useLocation();
  const navigate = useNavigate(); // ใช้เพื่อเปลี่ยนหน้าหลัง logout
  
  const { language, changeLanguage } = useLanguage();

  const handleLogout = async () => {
    // ใช้ logout จาก AuthContext แทน supabase.auth.signOut()
    await logout();
    navigate('/'); // เด้งกลับไปหน้าแรกหลังจากออกจากระบบ
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    return isActive 
      ? "flex items-center h-full border-t-2 border-red-600 text-purple-900 font-bold px-3 pt-1 transition-colors whitespace-nowrap" 
      : "flex items-center h-full border-t-2 border-transparent text-gray-700 hover:text-purple-700 hover:border-purple-300 px-3 pt-1 transition-colors font-medium whitespace-nowrap";
  };

  const t = {
    th: {
      home: 'หน้าแรก', about: 'เกี่ยวกับสาขาวิชา', events: 'ข่าวสารและกิจกรรม', services: 'บริการนักศึกษา',
      alumni: 'ศิษย์เก่าสัมพันธ์', shop: 'ร้านค้าสาขาวิชา', contact: 'ติดต่อเรา',
      login: 'เข้าสู่ระบบ', register: 'ลงทะเบียนศิษย์เก่า', logout: 'ออกจากระบบ', profile: 'โปรไฟล์',
      studyPlan: 'แผนการเรียน', curriculumMap: 'แผนผังการเรียน', flowSimulator: 'จัดแผนการเรียน',
      // เมนูย่อย เกี่ยวกับสาขาวิชา
      aboutDept: 'สาขาวิชา', personnel: 'บุคคลากร', symbols: 'สัญลักษณ์และแบรนด์', songs: 'บทเพลง',
      // เมนูย่อย บริการนักศึกษา
      academicCalendar: 'ปฏิทินการศึกษา', webServices: 'เว็บไซต์และการบริการ',
      // เมนูย่อย ศิษย์เก่าสัมพันธ์
      alumniSystem: 'ระบบข้อมูลศิษย์เก่า', alumniRelations: 'ศิษย์เก่าสัมพันธ์',
      // เมนูใหม่
      admission: 'สมัครเรียน'
    },
    en: {
      home: 'Home', about: 'About Us', events: 'News & Events', services: 'Student Services',
      alumni: 'Alumni Relations', shop: 'Shop', contact: 'Contact Us',
      login: 'Login', register: 'Register', logout: 'Logout', profile: 'Profile',
      studyPlan: 'Study Plan', curriculumMap: 'Curriculum Map', flowSimulator: 'Plan Simulator',
      aboutDept: 'Department', personnel: 'Personnel', symbols: 'Symbols & Branding', songs: 'Songs',
      academicCalendar: 'Academic Calendar', webServices: 'Websites & Services',
      alumniSystem: 'Alumni Database', alumniRelations: 'Alumni Relations',
      admission: 'Admission'
    },
    zh: {
      home: '首页', about: '关于部门', events: '新闻与活动', services: '学生服务',
      alumni: '校友关系', shop: '商店', contact: '联系我们',
      login: '登录', register: '注册', logout: '登出', profile: '个人资料',
      studyPlan: '学习计划', curriculumMap: '课程图', flowSimulator: '计划模拟器',
      aboutDept: '部门', personnel: '人员', symbols: '标志与品牌', songs: '歌曲',
      academicCalendar: '校历', webServices: '网站与服务',
      alumniSystem: '校友数据库', alumniRelations: '校友关系',
      admission: '入学申请'
    }
  };

  return (
    <header className="w-full flex flex-col shadow-sm sticky top-0 z-50 font-sans">
      
      <div className="bg-slate-50 border-b border-gray-200 relative z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          
          <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
            <img src={bmeLogo} alt="BME Community Logo" className="h-10 w-auto" />
          </Link>
          
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* โซนช่องทางติดต่อ */}
            <div className="hidden md:flex items-center gap-3 text-purple-800">
              <a href="mailto:bme.kmutnb.th@gmail.com" className="hover:text-red-600 transition p-1" title="ส่งอีเมล">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </a>
              <a href="https://www.facebook.com/search/top?q=bme.kmutnb" target="_blank" rel="noreferrer" className="hover:text-red-600 transition p-1" title="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
              </a>
              <a href="https://www.instagram.com/bme.kmutnb/" target="_blank" rel="noreferrer" className="hover:text-red-600 transition p-1" title="Instagram">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>

            <div className="hidden md:block h-6 w-px bg-gray-300"></div>

            {/* โซนเปลี่ยนภาษา */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
              <button onClick={() => changeLanguage('th')} className={`w-9 h-7 flex items-center justify-center rounded ${language === 'th' ? 'bg-gray-100 shadow-inner ring-1 ring-gray-200' : 'hover:bg-gray-50'}`} title="ภาษาไทย">
                <img src="https://flagcdn.com/w40/th.png" alt="TH" className="w-6 h-4 object-cover rounded-[2px] shadow-sm" />
              </button>
              <button onClick={() => changeLanguage('en')} className={`w-9 h-7 flex items-center justify-center rounded ${language === 'en' ? 'bg-gray-100 shadow-inner ring-1 ring-gray-200' : 'hover:bg-gray-50'}`} title="English">
                <img src="https://flagcdn.com/w40/us.png" alt="EN" className="w-6 h-4 object-cover rounded-[2px] shadow-sm" />
              </button>
              <button onClick={() => changeLanguage('zh')} className={`w-9 h-7 flex items-center justify-center rounded ${language === 'zh' ? 'bg-gray-100 shadow-inner ring-1 ring-gray-200' : 'hover:bg-gray-50'}`} title="中文">
                <img src="https://flagcdn.com/w40/cn.png" alt="ZH" className="w-6 h-4 object-cover rounded-[2px] shadow-sm" />
              </button>
            </div>

            <div className="h-6 w-px bg-gray-300"></div>

            {/* โซน User */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-sm font-medium text-purple-900 border border-purple-900 px-4 py-1.5 rounded hover:bg-purple-50 transition">{t[language].profile}</Link>
                  <button onClick={handleLogout} className="text-sm font-medium bg-gray-800 text-white px-4 py-1.5 rounded hover:bg-red-600 transition shadow-sm">{t[language].logout}</button>
                </>
              ) : (
                <>
                  <Link to="/register" className="hidden sm:inline-block text-sm font-medium text-purple-900 border border-purple-900 px-4 py-1.5 rounded hover:bg-purple-50 transition">{t[language].register}</Link>
                  <Link to="/login" className="text-sm font-medium bg-gradient-to-r from-purple-900 to-black text-white px-5 py-1.5 rounded hover:from-purple-800 hover:to-red-700 transition shadow-md shadow-purple-900/20">{t[language].login}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white relative z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-12 flex justify-start items-center gap-2 md:gap-6 overflow-x-auto md:overflow-visible text-sm hide-scrollbar">
          
          <Link to="/" className={getLinkClass('/')}>{t[language].home}</Link>

          {/* 1. เมนู Dropdown: เกี่ยวกับสาขาวิชา */}
          <div className="relative group h-12 flex items-center">
            <button className={`flex items-center h-full border-t-2 border-transparent text-gray-700 group-hover:text-purple-700 group-hover:border-purple-300 px-3 pt-1 transition-colors font-medium whitespace-nowrap cursor-pointer ${location.pathname.startsWith('/about') ? 'border-red-600 text-purple-900 font-bold' : ''}`}>
              {t[language].about}
              <svg className="w-3.5 h-3.5 ml-1.5 mt-0.5 text-gray-400 group-hover:text-purple-600 transition-transform duration-300 group-hover:-rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className="absolute top-full left-0 w-56 bg-[#1f1f1f] rounded-b-xl shadow-xl shadow-purple-900/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover:translate-y-0 border-t-[3px] border-red-600 overflow-hidden z-50">
              <div className="flex flex-col py-2">
                <Link to="/about/department" className="px-5 py-3.5 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].aboutDept}</Link>
                <Link to="/about/personnel" className="px-5 py-3.5 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].personnel}</Link>
                <Link to="/about/symbols" className="px-5 py-3.5 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].symbols}</Link>
                <Link to="/about/songs" className="px-5 py-3.5 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].songs}</Link>
              </div>
            </div>
          </div>

          {/* เมนู สมัครเรียน */}
          <Link to="/admission" className={getLinkClass('/admission')}>{t[language].admission}</Link>

          {/* เมนู ข่าวสารและกิจกรรม */}
          <Link to="/events" className={getLinkClass('/events')}>{t[language].events}</Link>
          
          {/* 2. เมนู Dropdown: บริการนักศึกษา */}
          <div className="relative group h-12 flex items-center">
            <button className={`flex items-center h-full border-t-2 border-transparent text-gray-700 group-hover:text-purple-700 group-hover:border-purple-300 px-3 pt-1 transition-colors font-medium whitespace-nowrap cursor-pointer ${location.pathname.startsWith('/student-services') ? 'border-red-600 text-purple-900 font-bold' : ''}`}>
              {t[language].services}
              <svg className="w-3.5 h-3.5 ml-1.5 mt-0.5 text-gray-400 group-hover:text-purple-600 transition-transform duration-300 group-hover:-rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className="absolute top-full left-0 w-56 bg-[#1f1f1f] rounded-b-xl shadow-xl shadow-purple-900/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover:translate-y-0 border-t-[3px] border-red-600 overflow-hidden z-50">
              <div className="flex flex-col py-2">
                <Link to="/student-services/calendar" className="px-5 py-3.5 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].academicCalendar}</Link>
                <Link to="/student-services/web" className="px-5 py-3.5 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].webServices}</Link>
              </div>
            </div>
          </div>
          
          {/* 3. เมนู Dropdown: แผนการเรียน */}
          <div className="relative group h-12 flex items-center">
            <button className={`flex items-center h-full border-t-2 border-transparent text-gray-700 group-hover:text-purple-700 group-hover:border-purple-300 px-3 pt-1 transition-colors font-medium whitespace-nowrap cursor-pointer ${(location.pathname === '/curriculum' || location.pathname === '/flow') ? 'border-red-600 text-purple-900 font-bold' : ''}`}>
              {t[language].studyPlan}
              <svg className="w-3.5 h-3.5 ml-1.5 mt-0.5 text-gray-400 group-hover:text-purple-600 transition-transform duration-300 group-hover:-rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className="absolute top-full left-0 w-56 bg-[#1f1f1f] rounded-b-xl shadow-xl shadow-purple-900/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover:translate-y-0 border-t-[3px] border-red-600 overflow-hidden z-50">
              <div className="flex flex-col py-2">
                <Link to="/curriculum" className="px-5 py-3.5 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].curriculumMap}</Link>
                <Link to="/flow" className="px-5 py-3.5 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].flowSimulator}</Link>
              </div>
            </div>
          </div>

          {/* 4. เมนู Dropdown: ศิษย์เก่าสัมพันธ์ */}
          <div className="relative group h-12 flex items-center">
            <button className={`flex items-center h-full border-t-2 border-transparent text-gray-700 group-hover:text-purple-700 group-hover:border-purple-300 px-3 pt-1 transition-colors font-medium whitespace-nowrap cursor-pointer ${location.pathname.startsWith('/alumni') ? 'border-red-600 text-purple-900 font-bold' : ''}`}>
              {t[language].alumni}
              <svg className="w-3.5 h-3.5 ml-1.5 mt-0.5 text-gray-400 group-hover:text-purple-600 transition-transform duration-300 group-hover:-rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className="absolute top-full left-0 w-56 bg-[#1f1f1f] rounded-b-xl shadow-xl shadow-purple-900/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover:translate-y-0 border-t-[3px] border-red-600 overflow-hidden z-50">
              <div className="flex flex-col py-2">
                <Link to="/alumni/database" className="px-5 py-3.5 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].alumniSystem}</Link>
                <Link to="/alumni/relations" className="px-5 py-3.5 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].alumniRelations}</Link>
              </div>
            </div>
          </div>

          {/* เมนู ร้านค้าสาขาวิชา และ ติดต่อเรา */}
          <Link to="/shop" className={getLinkClass('/shop')}>{t[language].shop}</Link>
          <Link to="/contact" className={getLinkClass('/contact')}>{t[language].contact}</Link>
          
        </div>
      </div>
    </header>
  );
}