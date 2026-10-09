import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';

// 📌 1. หมวดหมู่เกี่ยวกับสาขาวิชา (About)
// หมายเหตุ: อย่าลืมเปลี่ยนชื่อไฟล์ About.jsx เดิม เป็น Department.jsx แล้วย้ายไปไว้ในโฟลเดอร์ About
import Department from './pages/About/Department'; 
import Personnel from './pages/About/Personnel';
import Symbols from './pages/About/Symbols';
import Songs from './pages/About/Songs';

// 📌 2. หมวดหมู่สมัครเรียน
import Admission from './pages/Admission';

// 📌 3. หมวดหมู่บริการนักศึกษา (Student Services)
import AcademicCalendar from './pages/StudentServices/AcademicCalendar';
import WebServices from './pages/StudentServices/WebServices'; // (อาจจะใช้ StudentServices.jsx เดิมมาเปลี่ยนชื่อ)

// 📌 4. หมวดหมู่แผนการเรียน (Study)
import Curriculum from './pages/Study/Curriculum';
import BMEFlow from './pages/Study/BMEFlow';

// 📌 5. หมวดหมู่ศิษย์เก่า (Alumni)
import Directory from './pages/Alumni/Directory'; // ใช้เป็น 'ระบบข้อมูลศิษย์เก่า'
import AlumniRelations from './pages/Alumni/AlumniRelations'; // ต้องสร้างไฟล์ใหม่สำหรับ 'ศิษย์เก่าสัมพันธ์'
import AlumniDashboard from './pages/Alumni/AlumniDashboard';

// 📌 6. หมวดหมู่อื่นๆ
import Shop from './pages/Shop';
import Events from './pages/Events';
import Contact from './pages/Contact';

// 📌 7. ระบบสมาชิก (Auth)
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterTeacher from './pages/RegisterTeacher';

// นำเข้าโลโก้สำหรับใช้ใน Footer
import bmeLogoBar from './assets/bme_alumni_bar.png';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                
                {/* --- หมวดหมู่เกี่ยวกับสาขาวิชา --- */}
                <Route path="/about" element={<Navigate to="/about/department" replace />} />
                <Route path="/about/department" element={<Department />} />
                <Route path="/about/personnel" element={<Personnel />} />
                <Route path="/about/symbols" element={<Symbols />} />
                <Route path="/about/songs" element={<Songs />} />

                {/* --- หมวดหมู่สมัครเรียน --- */}
                <Route path="/admission" element={<Admission />} />

                {/* --- หมวดหมู่บริการนักศึกษา --- */}
                <Route path="/student-services" element={<Navigate to="/student-services/web" replace />} />
                <Route path="/student-services/calendar" element={<AcademicCalendar />} />
                <Route path="/student-services/web" element={<WebServices />} />

                {/* --- หมวดหมู่แผนการเรียน --- */}
                <Route path="/curriculum" element={<Curriculum />} />
                <Route path="/flow" element={<BMEFlow />} />

                {/* --- หมวดหมู่ศิษย์เก่า (Alumni) --- */}
                <Route path="/alumni" element={<Navigate to="/alumni/relations" replace />} />
                <Route path="/alumni/database" element={<Directory />} />
                <Route path="/alumni/relations" element={<AlumniRelations />} />

                {/* --- หมวดหมู่อื่นๆ --- */}
                <Route path="/events" element={<Events />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/contact" element={<Contact />} />

                {/* --- หมวดหมู่ Auth และ Dashboard --- */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register-teacher" element={<RegisterTeacher />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <AlumniDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            
            {/* ---------------- Footer Section ---------------- */}
            <footer className="bg-white border-t border-gray-200 pt-16 pb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-purple-700 to-black"></div>
              
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 mb-12">
                  
                  {/* คอลัมน์ 1: โลโก้ และ About */}
                  <div className="md:col-span-5 lg:col-span-4">
                    <img src={bmeLogoBar} alt="BME Alumni Logo" className="h-12 w-auto mb-6" />
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      BME KMUTNB WEBSITE
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-6 font-light">
                      เว็บไซต์บริการสาขาวิชาวิศวกรรมชีวการแพทย์ มจพ.
                    </p>
                    
                    <div className="flex gap-4">
                      <a href="https://www.facebook.com/search/top?q=bme.kmutnb" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1877F2] hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
                      </a>
                      <a href="https://www.instagram.com/bme.kmutnb/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#E4405F] hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      </a>
                      <a href="mailto:bme.kmutnb.th@gmail.com" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-800 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      </a>
                    </div>
                  </div>

                  {/* คอลัมน์ 2: ข้อมูลติดต่อ */}
                  <div className="md:col-span-4 lg:col-span-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 border-l-4 border-red-600 pl-3">
                      ติดต่อสาขาวิชา
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span className="text-sm text-gray-600 font-light leading-relaxed">
                          สาขาวิชาวิศวกรรมชีวการแพทย์ อาคาร 78 ชั้น 4<br/>
                          คณะวิทยาศาสตร์ประยุกต์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ<br/>
                          1518 ถนนประชาราษฎร์ 1 แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        <span className="text-sm text-gray-600 font-light">02-555-2000 ต่อ 4402</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        <span className="text-sm text-gray-600 font-light">bme.kmutnb.th@gmail.com</span>
                      </div>
                    </div>
                  </div>

                  {/* คอลัมน์ 3: ผังเว็บไซต์ (อัปเดตใหม่) */}
                  <div className="md:col-span-3 lg:col-span-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 border-l-4 border-red-600 pl-3">
                      ผังเว็บไซต์
                    </h3>
                    <ul className="space-y-3">
                      <li><a href="/" className="text-sm text-gray-600 font-light hover:text-red-600 transition-colors">หน้าแรก</a></li>
                      <li><a href="/about" className="text-sm text-gray-600 font-light hover:text-red-600 transition-colors">เกี่ยวกับสาขาวิชา</a></li>
                      <li><a href="/admission" className="text-sm text-gray-600 font-light hover:text-red-600 transition-colors">สมัครเรียน</a></li>
                      <li><a href="/events" className="text-sm text-gray-600 font-light hover:text-red-600 transition-colors">ข่าวสารและกิจกรรม</a></li>
                      <li><a href="/alumni" className="text-sm text-gray-600 font-light hover:text-red-600 transition-colors">ศิษย์เก่าสัมพันธ์</a></li>
                      <li><a href="/student-services" className="text-sm text-gray-600 font-light hover:text-red-600 transition-colors">บริการนักศึกษา</a></li>
                      <li><a href="/shop" className="text-sm text-gray-600 font-light hover:text-red-600 transition-colors">ร้านค้าสาขาวิชา</a></li>
                      <li><a href="/contact" className="text-sm text-gray-600 font-light hover:text-red-600 transition-colors">ติดต่อเรา</a></li>
                    </ul>
                  </div>

                </div>

                {/* Bottom Copyright */}
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-xs text-gray-500 font-light text-center md:text-left">
                    © {new Date().getFullYear()} BME KMUTNB. สงวนลิขสิทธิ์.<br/>
                    สาขาวิชาวิศวกรรมชีวการแพทย์ ภาควิชาฟิสิกส์อุตสาหกรรมและอุปกรณ์การแพทย์ คณะวิทยาศาสตร์ประยุกต์ มจพ.
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="text-xs text-gray-500 hover:text-red-600 font-light">นโยบายความเป็นส่วนตัว (PDPA)</a>
                    <span className="text-gray-300">|</span>
                    <a href="#" className="text-xs text-gray-500 hover:text-red-600 font-light">ข้อกำหนดการใช้งาน</a>
                  </div>
                </div>
                
              </div>
            </footer>
            
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}