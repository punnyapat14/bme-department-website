import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import bmeLogo from '../assets/bme_community.png';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenSubMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSubMenu = (menuName) => {
    setOpenSubMenu(openSubMenu === menuName ? null : menuName);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    return isActive 
      ? "flex items-center h-full border-b-2 border-red-600 text-purple-900 font-bold px-3 transition-colors whitespace-nowrap" 
      : "flex items-center h-full border-b-2 border-transparent text-gray-700 hover:text-purple-700 hover:border-purple-300 px-3 transition-colors font-medium whitespace-nowrap";
  };

  const t = {
    th: {
      home: 'หน้าแรก', about: 'เกี่ยวกับสาขาวิชา', events: 'ข่าวสารและกิจกรรม', services: 'บริการนักศึกษา',
      alumni: 'ศิษย์เก่าสัมพันธ์', shop: 'ร้านค้าสาขาวิชา', contact: 'ติดต่อเรา',
      login: 'เข้าสู่ระบบ', register: 'ลงทะเบียนศิษย์เก่า', logout: 'ออกจากระบบ', profile: 'โปรไฟล์',
      studyPlan: 'แผนการเรียน', curriculumMap: 'แผนผังการเรียน', flowSimulator: 'จัดแผนการเรียน',
      aboutDept: 'สาขาวิชา', personnel: 'บุคลากร', symbols: 'สัญลักษณ์และแบรนด์', songs: 'บทเพลง',
      academicCalendar: 'ปฏิทินการศึกษา', webServices: 'เว็บไซต์และการบริการ',
      alumniSystem: 'ระบบข้อมูลศิษย์เก่า', alumniRelations: 'ศิษย์เก่าสัมพันธ์',
      admission: 'สมัครเรียน', adminPanel: 'จัดการระบบ (Admin)'
    },
    en: {
      home: 'Home', about: 'About Us', events: 'News & Events', services: 'Student Services',
      alumni: 'Alumni Relations', shop: 'Shop', contact: 'Contact Us',
      login: 'Login', register: 'Register', logout: 'Logout', profile: 'Profile',
      studyPlan: 'Study Plan', curriculumMap: 'Curriculum Map', flowSimulator: 'Plan Simulator',
      aboutDept: 'Department', personnel: 'Personnel', symbols: 'Symbols & Branding', songs: 'Songs',
      academicCalendar: 'Academic Calendar', webServices: 'Websites & Services',
      alumniSystem: 'Alumni Database', alumniRelations: 'Alumni Relations',
      admission: 'Admission', adminPanel: 'Admin Panel'
    },
    zh: {
      home: '首页', about: '关于部门', events: '新闻与活动', services: '学生服务',
      alumni: '校友关系', shop: '商店', contact: '联系我们',
      login: '登录', register: '注册', logout: '登出', profile: '个人资料',
      studyPlan: '学习计划', curriculumMap: '课程图', flowSimulator: '计划模拟器',
      aboutDept: '部门', personnel: '人员', symbols: '标志与品牌', songs: '歌曲',
      academicCalendar: '校历', webServices: '网站与服务',
      alumniSystem: '校友数据库', alumniRelations: '校友关系',
      admission: '入学申请', adminPanel: '管理系统'
    }
  };

  return (
    <header 
      className={`w-full flex flex-col fixed top-0 left-0 z-[100] font-sans transition-all duration-300 ${
        isScrolled ? 'shadow-md bg-white/95 backdrop-blur-sm' : 'shadow-sm bg-white'
      }`}
    >
      {/* ---------------- แถบบน: โลโก้, ภาษา, ล็อกอิน ---------------- */}
      <div className="border-b border-gray-200 relative z-50">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center gap-2 transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}>
          
          <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
            <img src={bmeLogo} alt="BME Community Logo" className={`w-auto transition-all duration-300 ${isScrolled ? 'h-7 sm:h-8' : 'h-8 sm:h-10'}`} />
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            
            {/* โซนช่องทางติดต่อ */}
            <div className="hidden lg:flex items-center gap-3 text-purple-800">
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

            <div className="hidden lg:block h-6 w-px bg-gray-300"></div>

            {/* โซนเปลี่ยนภาษา */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-1 shadow-sm">
              {['th', 'en', 'zh'].map((lang) => (
                <button 
                  key={lang}
                  type="button" 
                  onClick={() => changeLanguage(lang)} 
                  className={`w-7 sm:w-9 h-6 sm:h-7 flex items-center justify-center rounded transition-colors ${language === lang ? 'bg-gray-100 shadow-inner ring-1 ring-gray-200' : 'hover:bg-gray-50'}`}
                >
                  <img src={`https://flagcdn.com/w40/${lang === 'en' ? 'us' : lang === 'zh' ? 'cn' : 'th'}.png`} alt={lang.toUpperCase()} className="w-5 sm:w-6 h-3.5 sm:h-4 object-cover rounded-[2px] shadow-sm" />
                </button>
              ))}
            </div>

            <div className="hidden sm:block h-6 w-px bg-gray-300"></div>

            {/* โซน User */}
            <div className="hidden sm:flex items-center gap-2 md:gap-3">
              {user ? (
                <>
                  <Link to="/profile" className="text-xs md:text-sm font-medium text-purple-900 border border-purple-900 px-3 md:px-4 py-1.5 rounded hover:bg-purple-50 transition whitespace-nowrap">{t[language].profile}</Link>
                  <button type="button" onClick={handleLogout} className="text-xs md:text-sm font-medium bg-gray-800 text-white px-3 md:px-4 py-1.5 rounded hover:bg-red-600 transition shadow-sm whitespace-nowrap">{t[language].logout}</button>
                </>
              ) : (
                <>
                  <Link to="/register" className="hidden md:inline-block text-xs md:text-sm font-medium text-purple-900 border border-purple-900 px-3 md:px-4 py-1.5 rounded hover:bg-purple-50 transition whitespace-nowrap">{t[language].register}</Link>
                  <Link to="/login" className="text-xs md:text-sm font-medium bg-gradient-to-r from-purple-900 to-black text-white px-4 md:px-5 py-1.5 rounded hover:from-purple-800 hover:to-red-700 transition shadow-md shadow-purple-900/20 whitespace-nowrap">{t[language].login}</Link>
                </>
              )}
            </div>

            {/* ปุ่ม Hamburger Menu */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* ---------------- แถบล่าง: เมนูสำหรับหน้าจอคอม ---------------- */}
      <div className="hidden lg:block relative z-40 border-b border-gray-100 bg-transparent">
        {/* 📌 แก้ไขให้เป็น justify-center และปรับ gap ให้พอดีขึ้น */}
        <div className="max-w-7xl mx-auto px-6 h-12 flex justify-center items-center gap-3 lg:gap-5 xl:gap-7 text-sm">
          
          <Link to="/" className={getLinkClass('/')}>{t[language].home}</Link>

          {/* เมนู Dropdown: เกี่ยวกับสาขาวิชา */}
          <div className="relative group h-full flex items-center cursor-pointer">
            <span className={`flex items-center h-full border-b-2 border-transparent text-gray-700 group-hover:text-purple-700 group-hover:border-purple-300 px-3 transition-colors font-medium whitespace-nowrap ${location.pathname.startsWith('/about') ? 'border-red-600 text-purple-900 font-bold' : ''}`}>
              {t[language].about}
              <svg className="w-3.5 h-3.5 ml-1.5 text-gray-400 group-hover:text-purple-600 group-hover:-rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
            <div className="absolute top-full left-0 w-56 bg-[#1f1f1f] rounded-b-xl shadow-xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-[110] border-t-[3px] border-red-600 overflow-hidden">
              <div className="flex flex-col py-2">
                <Link to="/about/department" className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].aboutDept}</Link>
                <Link to="/about/personnel" className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].personnel}</Link>
                <Link to="/about/symbols" className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].symbols}</Link>
                <Link to="/about/songs" className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].songs}</Link>
              </div>
            </div>
          </div>

          <Link to="/admission" className={getLinkClass('/admission')}>{t[language].admission}</Link>
          <Link to="/events" className={getLinkClass('/events')}>{t[language].events}</Link>
          
          {/* เมนู Dropdown: บริการนักศึกษา */}
          <div className="relative group h-full flex items-center cursor-pointer">
            <span className={`flex items-center h-full border-b-2 border-transparent text-gray-700 group-hover:text-purple-700 group-hover:border-purple-300 px-3 transition-colors font-medium whitespace-nowrap ${location.pathname.startsWith('/student-services') ? 'border-red-600 text-purple-900 font-bold' : ''}`}>
              {t[language].services}
              <svg className="w-3.5 h-3.5 ml-1.5 text-gray-400 group-hover:text-purple-600 group-hover:-rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
            <div className="absolute top-full left-0 w-56 bg-[#1f1f1f] rounded-b-xl shadow-xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-[110] border-t-[3px] border-red-600 overflow-hidden">
              <div className="flex flex-col py-2">
                <Link to="/student-services/calendar" className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].academicCalendar}</Link>
                <Link to="/student-services/web" className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].webServices}</Link>
              </div>
            </div>
          </div>
          
          {/* เมนู Dropdown: แผนการเรียน */}
          <div className="relative group h-full flex items-center cursor-pointer">
            <span className={`flex items-center h-full border-b-2 border-transparent text-gray-700 group-hover:text-purple-700 group-hover:border-purple-300 px-3 transition-colors font-medium whitespace-nowrap ${(location.pathname === '/curriculum' || location.pathname === '/flow') ? 'border-red-600 text-purple-900 font-bold' : ''}`}>
              {t[language].studyPlan}
              <svg className="w-3.5 h-3.5 ml-1.5 text-gray-400 group-hover:text-purple-600 group-hover:-rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
            <div className="absolute top-full left-0 w-56 bg-[#1f1f1f] rounded-b-xl shadow-xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-[110] border-t-[3px] border-red-600 overflow-hidden">
              <div className="flex flex-col py-2">
                <Link to="/curriculum" className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].curriculumMap}</Link>
                <Link to="/flow" className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].flowSimulator}</Link>
              </div>
            </div>
          </div>

          {/* เมนู Dropdown: ศิษย์เก่าสัมพันธ์ */}
          {user && (
            <div className="relative group h-full flex items-center cursor-pointer">
              <span className={`flex items-center h-full border-b-2 border-transparent text-gray-700 group-hover:text-purple-700 group-hover:border-purple-300 px-3 transition-colors font-medium whitespace-nowrap ${location.pathname.startsWith('/alumni') ? 'border-red-600 text-purple-900 font-bold' : ''}`}>
                {t[language].alumni}
                <svg className="w-3.5 h-3.5 ml-1.5 text-gray-400 group-hover:text-purple-600 group-hover:-rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </span>
              <div className="absolute top-full left-0 w-56 bg-[#1f1f1f] rounded-b-xl shadow-xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-[110] border-t-[3px] border-red-600 overflow-hidden">
                <div className="flex flex-col py-2">
                  <Link to="/alumni/database" className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].alumniSystem}</Link>
                  <Link to="/alumni/relations" className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].alumniRelations}</Link>
                </div>
              </div>
            </div>
          )}

          <Link to="/shop" className={getLinkClass('/shop')}>{t[language].shop}</Link>
          <Link to="/contact" className={getLinkClass('/contact')}>{t[language].contact}</Link>
          
          {/* 📌 นำ ml-auto ออก เพื่อไม่ให้เกิดช่องว่างกว้างๆ ผิดปกติ */}
          {user && role === 'admin' && (
            <Link to="/admin" className="flex items-center h-full border-b-2 border-transparent text-red-600 hover:text-red-800 hover:border-red-400 px-3 transition-colors font-bold whitespace-nowrap">
              ⚙️ {t[language].adminPanel}
            </Link>
          )}

        </div>
      </div>

      {/* ---------------- เมนูสำหรับมือถือและแท็บเล็ต ---------------- */}
      <div 
        className={`lg:hidden bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xl overflow-y-auto transition-all duration-300 origin-top absolute top-full left-0 w-full z-[110] ${
          isMobileMenuOpen ? 'max-h-[calc(100vh-4rem)] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          
          <Link to="/" className="block px-4 py-2.5 rounded-lg font-bold text-gray-800 hover:bg-purple-50 hover:text-purple-700">{t[language].home}</Link>

          {[
            { id: 'about', label: t[language].about, links: [
              { path: '/about/department', label: t[language].aboutDept },
              { path: '/about/personnel', label: t[language].personnel },
              { path: '/about/symbols', label: t[language].symbols },
              { path: '/about/songs', label: t[language].songs }
            ]},
            { id: 'services', label: t[language].services, links: [
              { path: '/student-services/calendar', label: t[language].academicCalendar },
              { path: '/student-services/web', label: t[language].webServices }
            ]},
            { id: 'studyPlan', label: t[language].studyPlan, links: [
              { path: '/curriculum', label: t[language].curriculumMap },
              { path: '/flow', label: t[language].flowSimulator }
            ]},
            ...(user ? [{ id: 'alumni', label: t[language].alumni, links: [
              { path: '/alumni/database', label: t[language].alumniSystem },
              { path: '/alumni/relations', label: t[language].alumniRelations }
            ]}] : [])
          ].map((menu) => (
            <div key={menu.id}>
              <button type="button" onClick={() => toggleSubMenu(menu.id)} className="w-full flex justify-between items-center px-4 py-2.5 rounded-lg font-bold text-gray-800 hover:bg-purple-50 hover:text-purple-700">
                <span>{menu.label}</span>
                <svg className={`w-4 h-4 transition-transform ${openSubMenu === menu.id ? 'rotate-180 text-purple-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {openSubMenu === menu.id && (
                <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-50/50 rounded-lg mt-1">
                  {menu.links.map(link => (
                    <Link key={link.path} to={link.path} className="block px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50/80">{link.label}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link to="/admission" className="block px-4 py-2.5 rounded-lg font-bold text-gray-800 hover:bg-purple-50 hover:text-purple-700">{t[language].admission}</Link>
          <Link to="/events" className="block px-4 py-2.5 rounded-lg font-bold text-gray-800 hover:bg-purple-50 hover:text-purple-700">{t[language].events}</Link>
          <Link to="/shop" className="block px-4 py-2.5 rounded-lg font-bold text-gray-800 hover:bg-purple-50 hover:text-purple-700">{t[language].shop}</Link>
          <Link to="/contact" className="block px-4 py-2.5 rounded-lg font-bold text-gray-800 hover:bg-purple-50 hover:text-purple-700">{t[language].contact}</Link>

          {user && role === 'admin' && (
            <Link to="/admin" className="block px-4 py-2.5 rounded-lg font-bold text-red-600 bg-red-50 hover:bg-red-100">⚙️ {t[language].adminPanel}</Link>
          )}

          <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-2 sm:hidden">
            {user ? (
              <>
                <Link to="/profile" className="w-full text-center text-sm font-bold text-purple-900 border border-purple-900 py-2.5 rounded-lg hover:bg-purple-50">{t[language].profile}</Link>
                <button type="button" onClick={handleLogout} className="w-full text-center text-sm font-bold bg-gray-800 text-white py-2.5 rounded-lg hover:bg-red-600">{t[language].logout}</button>
              </>
            ) : (
              <>
                <Link to="/register" className="w-full text-center text-sm font-bold text-purple-900 border border-purple-900 py-2.5 rounded-lg hover:bg-purple-50">{t[language].register}</Link>
                <Link to="/login" className="w-full text-center text-sm font-bold bg-gradient-to-r from-purple-900 to-black text-white py-2.5 rounded-lg">{t[language].login}</Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}