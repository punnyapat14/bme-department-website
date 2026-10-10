import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import bmeLogo from '../assets/bme_community.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();

  // 📌 State สำหรับเปิด-ปิดเมนูบนมือถือ และเมนูย่อย (ใช้ร่วมกันทั้ง Desktop Click & Mobile)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [desktopDropdown, setDesktopDropdown] = useState(null);
  const navRef = useRef(null);

  // ปิดเมนูทั้งหมดอัตโนมัติเมื่อมีการเปลี่ยนหน้า
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenSubMenu(null);
    setDesktopDropdown(null);
  }, [location.pathname]);

  // ปิดเมนู Dropdown เมื่อคลิกพื้นที่ว่างข้างนอก (รองรับ Safari และทุกเบราว์เซอร์)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setDesktopDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const toggleSubMenu = (menuName) => {
    setOpenSubMenu(openSubMenu === menuName ? null : menuName);
  };

  const toggleDesktopDropdown = (menuName) => {
    setDesktopDropdown(desktopDropdown === menuName ? null : menuName);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    return isActive 
      ? "flex items-center h-full border-t-2 border-red-600 text-purple-900 font-bold px-3 pt-1 transition-colors whitespace-nowrap" 
      : "flex items-center h-full border-t-2 border-transparent text-gray-700 hover:text-purple-700 hover:border-purple-300 px-3 pt-1 transition-colors font-medium whitespace-nowrap";
  };

  // คลาสสำหรับกล่อง Dropdown บน Desktop (รองรับทั้ง Hover และ Click)
  const getDropdownBoxClass = (menuName) => {
    const isOpen = desktopDropdown === menuName;
    return `absolute top-full left-0 w-56 bg-[#1f1f1f] rounded-b-xl shadow-xl shadow-purple-900/10 transition-all duration-200 transform origin-top border-t-[3px] border-red-600 overflow-hidden z-[110] ${
      isOpen 
        ? 'opacity-100 visible translate-y-0 pointer-events-auto' 
        : 'opacity-0 invisible -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto'
    }`;
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
    <header ref={navRef} className="w-full flex flex-col shadow-sm sticky top-0 z-[100] font-sans bg-white">
      {/* ---------------- แถบบน: โลโก้, ภาษา, ล็อกอิน ---------------- */}
      <div className="bg-slate-50 border-b border-gray-200 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center gap-2">
          
          <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
            <img src={bmeLogo} alt="BME Community Logo" className="h-8 sm:h-10 w-auto" />
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
            <div className="flex items-center gap-0.5 sm:gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
              <button type="button" onClick={() => changeLanguage('th')} className={`w-7 sm:w-9 h-6 sm:h-7 flex items-center justify-center rounded ${language === 'th' ? 'bg-gray-100 shadow-inner ring-1 ring-gray-200' : 'hover:bg-gray-50'}`} title="ภาษาไทย">
                <img src="https://flagcdn.com/w40/th.png" alt="TH" className="w-5 sm:w-6 h-3.5 sm:h-4 object-cover rounded-[2px] shadow-sm" />
              </button>
              <button type="button" onClick={() => changeLanguage('en')} className={`w-7 sm:w-9 h-6 sm:h-7 flex items-center justify-center rounded ${language === 'en' ? 'bg-gray-100 shadow-inner ring-1 ring-gray-200' : 'hover:bg-gray-50'}`} title="English">
                <img src="https://flagcdn.com/w40/us.png" alt="EN" className="w-5 sm:w-6 h-3.5 sm:h-4 object-cover rounded-[2px] shadow-sm" />
              </button>
              <button type="button" onClick={() => changeLanguage('zh')} className={`w-7 sm:w-9 h-6 sm:h-7 flex items-center justify-center rounded ${language === 'zh' ? 'bg-gray-100 shadow-inner ring-1 ring-gray-200' : 'hover:bg-gray-50'}`} title="中文">
                <img src="https://flagcdn.com/w40/cn.png" alt="ZH" className="w-5 sm:w-6 h-3.5 sm:h-4 object-cover rounded-[2px] shadow-sm" />
              </button>
            </div>

            <div className="hidden sm:block h-6 w-px bg-gray-300"></div>

            {/* โซน User */}
            <div className="hidden sm:flex items-center gap-2 md:gap-3">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-xs md:text-sm font-medium text-purple-900 border border-purple-900 px-3 md:px-4 py-1.5 rounded hover:bg-purple-50 transition whitespace-nowrap">{t[language].profile}</Link>
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
              aria-label="Toggle Menu"
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

      {/* ---------------- แถบล่าง: เมนูสำหรับหน้าจอคอม (รองรับทั้ง Click & Hover ทุกเบราว์เซอร์) ---------------- */}
      <div className="hidden lg:block bg-white relative z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-12 flex justify-start items-center gap-5 xl:gap-7 text-sm">
          
          <Link to="/" className={getLinkClass('/')}>{t[language].home}</Link>

          {/* 1. เมนู Dropdown: เกี่ยวกับสาขาวิชา */}
          <div className="relative group h-12 flex items-center" onMouseLeave={() => setDesktopDropdown(null)}>
            <button 
              type="button"
              onClick={() => toggleDesktopDropdown('about')}
              className={`flex items-center h-full border-t-2 border-transparent text-gray-700 group-hover:text-purple-700 group-hover:border-purple-300 px-3 pt-1 transition-colors font-medium whitespace-nowrap cursor-pointer focus:outline-none ${location.pathname.startsWith('/about') ? 'border-red-600 text-purple-900 font-bold' : ''}`}
            >
              {t[language].about}
              <svg className={`w-3.5 h-3.5 ml-1.5 mt-0.5 text-gray-400 group-hover:text-purple-600 transition-transform duration-300 ${desktopDropdown === 'about' ? '-rotate-180 text-purple-600' : 'group-hover:-rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className={getDropdownBoxClass('about')}>
              <div className="flex flex-col py-2">
                <Link to="/about/department" onClick={() => setDesktopDropdown(null)} className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].aboutDept}</Link>
                <Link to="/about/personnel" onClick={() => setDesktopDropdown(null)} className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].personnel}</Link>
                <Link to="/about/symbols" onClick={() => setDesktopDropdown(null)} className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].symbols}</Link>
                <Link to="/about/songs" onClick={() => setDesktopDropdown(null)} className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].songs}</Link>
              </div>
            </div>
          </div>

          <Link to="/admission" className={getLinkClass('/admission')}>{t[language].admission}</Link>
          <Link to="/events" className={getLinkClass('/events')}>{t[language].events}</Link>
          
          {/* 2. เมนู Dropdown: บริการนักศึกษา */}
          <div className="relative group h-12 flex items-center" onMouseLeave={() => setDesktopDropdown(null)}>
            <button 
              type="button"
              onClick={() => toggleDesktopDropdown('services')}
              className={`flex items-center h-full border-t-2 border-transparent text-gray-700 group-hover:text-purple-700 group-hover:border-purple-300 px-3 pt-1 transition-colors font-medium whitespace-nowrap cursor-pointer focus:outline-none ${location.pathname.startsWith('/student-services') ? 'border-red-600 text-purple-900 font-bold' : ''}`}
            >
              {t[language].services}
              <svg className={`w-3.5 h-3.5 ml-1.5 mt-0.5 text-gray-400 group-hover:text-purple-600 transition-transform duration-300 ${desktopDropdown === 'services' ? '-rotate-180 text-purple-600' : 'group-hover:-rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className={getDropdownBoxClass('services')}>
              <div className="flex flex-col py-2">
                <Link to="/student-services/calendar" onClick={() => setDesktopDropdown(null)} className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].academicCalendar}</Link>
                <Link to="/student-services/web" onClick={() => setDesktopDropdown(null)} className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].webServices}</Link>
              </div>
            </div>
          </div>
          
          {/* 3. เมนู Dropdown: แผนการเรียน */}
          <div className="relative group h-12 flex items-center" onMouseLeave={() => setDesktopDropdown(null)}>
            <button 
              type="button"
              onClick={() => toggleDesktopDropdown('studyPlan')}
              className={`flex items-center h-full border-t-2 border-transparent text-gray-700 group-hover:text-purple-700 group-hover:border-purple-300 px-3 pt-1 transition-colors font-medium whitespace-nowrap cursor-pointer focus:outline-none ${(location.pathname === '/curriculum' || location.pathname === '/flow') ? 'border-red-600 text-purple-900 font-bold' : ''}`}
            >
              {t[language].studyPlan}
              <svg className={`w-3.5 h-3.5 ml-1.5 mt-0.5 text-gray-400 group-hover:text-purple-600 transition-transform duration-300 ${desktopDropdown === 'studyPlan' ? '-rotate-180 text-purple-600' : 'group-hover:-rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className={getDropdownBoxClass('studyPlan')}>
              <div className="flex flex-col py-2">
                <Link to="/curriculum" onClick={() => setDesktopDropdown(null)} className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].curriculumMap}</Link>
                <Link to="/flow" onClick={() => setDesktopDropdown(null)} className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].flowSimulator}</Link>
              </div>
            </div>
          </div>

          {/* 4. เมนู Dropdown: ศิษย์เก่าสัมพันธ์ */}
          <div className="relative group h-12 flex items-center" onMouseLeave={() => setDesktopDropdown(null)}>
            <button 
              type="button"
              onClick={() => toggleDesktopDropdown('alumni')}
              className={`flex items-center h-full border-t-2 border-transparent text-gray-700 group-hover:text-purple-700 group-hover:border-purple-300 px-3 pt-1 transition-colors font-medium whitespace-nowrap cursor-pointer focus:outline-none ${location.pathname.startsWith('/alumni') ? 'border-red-600 text-purple-900 font-bold' : ''}`}
            >
              {t[language].alumni}
              <svg className={`w-3.5 h-3.5 ml-1.5 mt-0.5 text-gray-400 group-hover:text-purple-600 transition-transform duration-300 ${desktopDropdown === 'alumni' ? '-rotate-180 text-purple-600' : 'group-hover:-rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className={getDropdownBoxClass('alumni')}>
              <div className="flex flex-col py-2">
                <Link to="/alumni/database" onClick={() => setDesktopDropdown(null)} className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].alumniSystem}</Link>
                <Link to="/alumni/relations" onClick={() => setDesktopDropdown(null)} className="px-5 py-3 text-gray-300 hover:bg-purple-900 hover:text-white text-sm font-medium transition-colors">{t[language].alumniRelations}</Link>
              </div>
            </div>
          </div>

          <Link to="/shop" className={getLinkClass('/shop')}>{t[language].shop}</Link>
          <Link to="/contact" className={getLinkClass('/contact')}>{t[language].contact}</Link>
          
        </div>
      </div>

      {/* ---------------- เมนูสำหรับมือถือและแท็บเล็ต (Mobile Menu Drawer) ---------------- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-4 space-y-2 relative z-[110]">
          
          <Link to="/" className="block px-4 py-2.5 rounded-lg font-bold text-gray-800 hover:bg-purple-50 hover:text-purple-700">{t[language].home}</Link>

          {/* Mobile Dropdown 1: เกี่ยวกับสาขาวิชา */}
          <div>
            <button type="button" onClick={() => toggleSubMenu('about')} className="w-full flex justify-between items-center px-4 py-2.5 rounded-lg font-bold text-gray-800 hover:bg-purple-50 hover:text-purple-700">
              <span>{t[language].about}</span>
              <svg className={`w-4 h-4 transition-transform ${openSubMenu === 'about' ? 'rotate-180 text-purple-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {openSubMenu === 'about' && (
              <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg mt-1">
                <Link to="/about/department" className="block px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50/50">{t[language].aboutDept}</Link>
                <Link to="/about/personnel" className="block px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50/50">{t[language].personnel}</Link>
                <Link to="/about/symbols" className="block px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50/50">{t[language].symbols}</Link>
                <Link to="/about/songs" className="block px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50/50">{t[language].songs}</Link>
              </div>
            )}
          </div>

          <Link to="/admission" className="block px-4 py-2.5 rounded-lg font-bold text-gray-800 hover:bg-purple-50 hover:text-purple-700">{t[language].admission}</Link>
          <Link to="/events" className="block px-4 py-2.5 rounded-lg font-bold text-gray-800 hover:bg-purple-50 hover:text-purple-700">{t[language].events}</Link>

          {/* Mobile Dropdown 2: บริการนักศึกษา */}
          <div>
            <button type="button" onClick={() => toggleSubMenu('services')} className="w-full flex justify-between items-center px-4 py-2.5 rounded-lg font-bold text-gray-800 hover:bg-purple-50 hover:text-purple-700">
              <span>{t[language].services}</span>
              <svg className={`w-4 h-4 transition-transform ${openSubMenu === 'services' ? 'rotate-180 text-purple-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {openSubMenu === 'services' && (
              <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg mt-1">
                <Link to="/student-services/calendar" className="block px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50/50">{t[language].academicCalendar}</Link>
                <Link to="/student-services/web" className="block px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50/50">{t[language].webServices}</Link>
              </div>
            )}
          </div>

          {/* Mobile Dropdown 3: แผนการเรียน */}
          <div>
            <button type="button" onClick={() => toggleSubMenu('studyPlan')} className="w-full flex justify-between items-center px-4 py-2.5 rounded-lg font-bold text-gray-800 hover:bg-purple-50 hover:text-purple-700">
              <span>{t[language].studyPlan}</span>
              <svg className={`w-4 h-4 transition-transform ${openSubMenu === 'studyPlan' ? 'rotate-180 text-purple-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {openSubMenu === 'studyPlan' && (
              <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg mt-1">
                <Link to="/curriculum" className="block px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50/50">{t[language].curriculumMap}</Link>
                <Link to="/flow" className="block px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50/50">{t[language].flowSimulator}</Link>
              </div>
            )}
          </div>

          {/* Mobile Dropdown 4: ศิษย์เก่าสัมพันธ์ */}
          <div>
            <button type="button" onClick={() => toggleSubMenu('alumni')} className="w-full flex justify-between items-center px-4 py-2.5 rounded-lg font-bold text-gray-800 hover:bg-purple-50 hover:text-purple-700">
              <span>{t[language].alumni}</span>
              <svg className={`w-4 h-4 transition-transform ${openSubMenu === 'alumni' ? 'rotate-180 text-purple-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {openSubMenu === 'alumni' && (
              <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg mt-1">
                <Link to="/alumni/database" className="block px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50/50">{t[language].alumniSystem}</Link>
                <Link to="/alumni/relations" className="block px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50/50">{t[language].alumniRelations}</Link>
              </div>
            )}
          </div>

          <Link to="/shop" className="block px-4 py-2.5 rounded-lg font-bold text-gray-800 hover:bg-purple-50 hover:text-purple-700">{t[language].shop}</Link>
          <Link to="/contact" className="block px-4 py-2.5 rounded-lg font-bold text-gray-800 hover:bg-purple-50 hover:text-purple-700">{t[language].contact}</Link>

          {/* ปุ่ม Login/Register สำหรับจอมือถือเล็ก */}
          <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-2 sm:hidden">
            {user ? (
              <>
                <Link to="/dashboard" className="w-full text-center text-sm font-bold text-purple-900 border border-purple-900 py-2.5 rounded-lg hover:bg-purple-50">{t[language].profile}</Link>
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
      )}
    </header>
  );
}