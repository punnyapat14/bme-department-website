import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// 📌 Component: พื้นหลังแสงออโรร่า (Purple/Pastel Theme)
// ==========================================
export const AuroraBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#fdfcff] overflow-hidden pointer-events-none">
    <style>{`
      .aurora-effect {
        --aurora-white: #ffffff;
        --aurora-transparent: rgba(255,255,255,0);
        --aurora-c1: #c084fc; 
        --aurora-c2: #fb7185; 
        --aurora-c3: #818cf8; 
        --aurora-c4: #f472b6; 
        --aurora-c5: #a78bfa; 
        --light-gradient: repeating-linear-gradient(100deg, var(--aurora-white) 0%, var(--aurora-white) 7%, var(--aurora-transparent) 10%, var(--aurora-transparent) 12%, var(--aurora-white) 16%);
        --aurora-bg: repeating-linear-gradient(100deg, var(--aurora-c1) 10%, var(--aurora-c2) 15%, var(--aurora-c3) 20%, var(--aurora-c4) 25%, var(--aurora-c5) 30%);
        background-image: var(--light-gradient), var(--aurora-bg);
        background-size: 300% 200%;
        background-position: 50% 50%, 50% 50%;
        filter: blur(14px); 
      }
    `}</style>
    <motion.div 
      animate={{ x: ["0%", "2%", "-2%", "0%"], y: ["0%", "-2%", "2%", "0%"] }} 
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }} 
      className="absolute -top-[10%] -left-[10%] w-[300px] h-[300px] md:w-[50vw] md:h-[50vw] rounded-full bg-purple-300/15 blur-[80px] md:blur-[100px]" 
    />
    <motion.div 
      animate={{ x: ["0%", "-2%", "2%", "0%"], y: ["0%", "2%", "-2%", "0%"] }} 
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }} 
      className="absolute -bottom-[10%] -right-[10%] w-[300px] h-[300px] md:w-[50vw] md:h-[50vw] rounded-full bg-rose-200/15 blur-[80px] md:blur-[100px]" 
    />
  </div>
);

// ==========================================
// 📌 Component: ป้ายแบนเนอร์ (Purple Holographic Theme)
// ==========================================
export const SectionBanner = ({ text }) => {
  const bgColor = "bg-[#bba8ff]"; 
  const cloudStyle = `${bgColor} rounded-full absolute shadow-[inset_6px_6px_25px_rgba(255,255,255,0.6),_0px_5px_15px_rgba(0,0,0,0.05)] pointer-events-none`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ scale: 1.015, y: -2 }}
      transition={{ duration: 0.4 }}
      className={`relative w-full mx-auto mb-8 md:mb-12 min-h-[4.5rem] sm:min-h-[5rem] md:min-h-[6rem] py-3 px-4 rounded-[1.25rem] md:rounded-[2rem] overflow-hidden flex items-center justify-center cursor-default ${bgColor} shadow-[0_8px_30px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)] group`}
    >
      <div className={`-bottom-10 -left-6 w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 ${cloudStyle}`} />
      <div className={`-bottom-16 left-[12%] sm:left-[15%] w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 ${cloudStyle}`} />
      <div className={`-bottom-20 right-[12%] sm:right-[15%] w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72 ${cloudStyle}`} />
      <div className={`-bottom-12 -right-8 w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 ${cloudStyle}`} />
      <div className={`-top-12 left-[40%] sm:left-[45%] w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 ${cloudStyle} opacity-60`} />

      <motion.div 
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 10, ease: "linear", repeat: Infinity }}
        className="absolute inset-0 mix-blend-overlay opacity-60 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,107,254,0.4) 25%, rgba(0,249,248,0.3) 50%, rgba(255,255,255,0.8) 75%, rgba(255,255,255,0) 100%)",
          backgroundSize: "200% 200%"
        }}
      />
      
      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent rounded-t-[1.25rem] md:rounded-t-[2rem] pointer-events-none" />

      <h2 className="relative z-10 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2d1b69] drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)] px-2 sm:px-6 text-center leading-snug break-words">
        {text}
      </h2>
      
      <motion.div
        animate={{ left: ["-100%", "200%", "200%"] }}
        transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
        className="absolute top-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-12 z-20 pointer-events-none"
      />
    </motion.div>
  );
};

// ==========================================
// 📌 Component: ปุ่มเลื่อนกลับไปด้านบนสุด
// ==========================================
export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900/90 hover:bg-purple-700 text-white shadow-xl shadow-purple-900/20 flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors cursor-pointer group"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// 📌 Component หลัก: Admin Panel 
// ==========================================
export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [userFilter, setUserFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, alumni: 0, student: 0, admin: 0 });

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    if (users.length > 0) {
      setStats({
        total: users.length,
        alumni: users.filter(u => u.role === 'alumni').length,
        student: users.filter(u => u.role === 'student').length,
        admin: users.filter(u => u.role === 'admin').length
      });
    }
  }, [users]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      showMessage('error', 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').update({
        full_name: editingUser.full_name,
        role: editingUser.role,
        status: editingUser.status,
        student_id: editingUser.student_id,
        generation: editingUser.generation,
        phone: editingUser.phone,
        workplace: editingUser.workplace,
        position: editingUser.position,
        address: editingUser.address
      }).eq('id', editingUser.id);
      if (error) throw error;
      showMessage('success', 'บันทึกข้อมูลผู้ใช้งานสำเร็จ');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      showMessage('error', 'ข้อผิดพลาด: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchRole = userFilter === 'all' || u.role === userFilter;
    const matchSearch = (u.full_name || '').includes(searchQuery) || (u.email || '').includes(searchQuery) || (u.student_id || '').includes(searchQuery);
    return matchRole && matchSearch;
  });

  const getPercentage = (count) => stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen relative font-sans text-gray-800">
      <AuroraBackground />
      <ScrollToTopButton />

      <div className="relative z-10 max-w-[1400px] mx-auto py-8 px-4">
        
        {message.text && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl shadow-lg font-bold flex items-center gap-2 animate-[fadeIn_0.3s_ease-out] ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        <div className="flex justify-end mb-4">
          <Link to="/profile" className="bg-white/60 hover:bg-purple-100 text-purple-800 backdrop-blur-md px-6 py-2 rounded-full font-bold transition-all border border-purple-200 shadow-sm flex items-center gap-2">
            <span>🔙</span> กลับหน้าหลัก
          </Link>
        </div>

        <SectionBanner text="ระบบจัดการข้อมูลสมาชิกและสถิติ" />

        {/* ================= Tab Menu ================= */}
        <div className="flex gap-4 mb-6 pb-2">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 border-2 ${activeTab === 'dashboard' ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/20' : 'bg-white/80 text-gray-600 border-transparent hover:bg-white hover:border-purple-300 hover:text-purple-600'}`}
          >
            📊 สถิติและสัดส่วน
          </button>
          <button 
            onClick={() => setActiveTab('users')} 
            className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 border-2 ${activeTab === 'users' ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/20' : 'bg-white/80 text-gray-600 border-transparent hover:bg-white hover:border-purple-300 hover:text-purple-600'}`}
          >
            👥 ข้อมูลบัญชีผู้ใช้งาน
          </button>
        </div>

        {/* ================= Content Area ================= */}
        <div className="animate-[fadeIn_0.3s_ease-out]">
          
          {/* TAB 1: สถิติ */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-1 flex flex-col gap-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 flex flex-col justify-center items-center text-center">
                  <p className="text-gray-500 font-bold mb-2">บัญชีผู้ใช้งานทั้งหมด</p>
                  <p className="text-7xl font-black text-purple-700 drop-shadow-sm">{stats.total}</p>
                  <p className="text-sm text-gray-400 mt-2">คนในระบบ</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-rose-50/90 backdrop-blur-sm rounded-2xl p-5 border border-rose-200 text-center shadow-md">
                    <p className="text-rose-600 font-bold text-sm mb-1">ศิษย์เก่า</p>
                    <p className="text-3xl font-black text-gray-800">{stats.alumni}</p>
                  </div>
                  <div className="bg-indigo-50/90 backdrop-blur-sm rounded-2xl p-5 border border-indigo-200 text-center shadow-md">
                    <p className="text-indigo-600 font-bold text-sm mb-1">นักศึกษา</p>
                    <p className="text-3xl font-black text-gray-800">{stats.student}</p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                <h2 className="text-xl font-bold text-[#2d1b69] mb-8 border-l-4 border-purple-500 pl-3">สัดส่วนประเภทผู้ใช้งาน</h2>
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-gray-700 flex items-center gap-2">🎓 ศิษย์เก่า (Alumni)</span>
                      <span className="font-bold text-lg text-rose-600">{getPercentage(stats.alumni)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                      <div className="bg-gradient-to-r from-rose-400 to-rose-500 h-4 rounded-full transition-all duration-1000" style={{ width: `${getPercentage(stats.alumni)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-gray-700 flex items-center gap-2">📚 นักศึกษา (Student)</span>
                      <span className="font-bold text-lg text-indigo-600">{getPercentage(stats.student)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                      <div className="bg-gradient-to-r from-indigo-400 to-indigo-500 h-4 rounded-full transition-all duration-1000" style={{ width: `${getPercentage(stats.student)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-gray-700 flex items-center gap-2">🛡️ แอดมิน (Admin)</span>
                      <span className="font-bold text-lg text-purple-700">{getPercentage(stats.admin)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-1000" style={{ width: `${getPercentage(stats.admin)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ข้อมูลผู้ใช้งาน */}
          {activeTab === 'users' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/50">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  {[{ id: 'all', label: 'ทั้งหมด' }, { id: 'student', label: 'นักศึกษา' }, { id: 'alumni', label: 'ศิษย์เก่า' }, { id: 'admin', label: 'แอดมิน' }].map(f => (
                    <button 
                      key={f.id} 
                      onClick={() => setUserFilter(f.id)} 
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${userFilter === f.id ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input 
                    type="text" placeholder="ค้นหาชื่อ, รหัส, อีเมล..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-72 px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none shadow-inner"
                  />
                  <span className="absolute right-4 top-2.5 text-gray-400">🔍</span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-purple-100 shadow-sm">
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr className="bg-purple-50/50 border-b border-purple-100 text-[#2d1b69] text-sm">
                      <th className="p-4 font-bold rounded-tl-2xl">ชื่อ-นามสกุล</th>
                      <th className="p-4 font-bold">อีเมล / รหัสนักศึกษา</th>
                      <th className="p-4 font-bold">ประเภท</th>
                      <th className="p-4 font-bold">รุ่น/สถานะ</th>
                      <th className="p-4 font-bold text-center rounded-tr-2xl">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" className="p-10 text-center text-gray-400 font-bold">กำลังโหลดข้อมูล...</td></tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr><td colSpan="5" className="p-10 text-center text-gray-400 font-bold">ไม่พบข้อมูล</td></tr>
                    ) : (
                      filteredUsers.map(u => (
                        <tr key={u.id} className="border-b border-gray-50 hover:bg-purple-50/50 transition-colors">
                          <td className="p-4 font-bold text-gray-800">{u.full_name || '-'}</td>
                          <td className="p-4"><p className="text-sm text-gray-600">{u.email}</p><p className="text-xs text-gray-400">{u.student_id ? `รหัส: ${u.student_id}` : ''}</p></td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'alumni' ? 'bg-rose-100 text-rose-700' : u.role === 'student' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'}`}>
                              {u.role === 'alumni' ? 'ศิษย์เก่า' : u.role === 'student' ? 'นักศึกษา' : 'แอดมิน'}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            <p>{u.generation ? `รุ่น ${u.generation}` : '-'}</p>
                            <p className={`text-xs font-bold ${u.status === 'ระงับการใช้งาน' ? 'text-red-500' : 'text-emerald-500'}`}>{u.status || 'ปกติ'}</p>
                          </td>
                          <td className="p-4 text-center">
                            <button onClick={() => setEditingUser(u)} className="bg-white border-2 border-purple-400 text-purple-600 hover:bg-purple-600 hover:border-purple-600 hover:text-white px-4 py-1.5 rounded-xl text-sm font-bold transition-all shadow-sm">
                              ดู / แก้ไข
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL: แก้ไขข้อมูลผู้ใช้ ================= */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#2d1b69]/40 backdrop-blur-sm" onClick={() => setEditingUser(null)} />
            
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 z-10 max-h-[90vh] overflow-y-auto">
              {/* Header สีม่วงพาสเทลตามธีมแบนเนอร์ */}
              <div className="bg-gradient-to-r from-[#bba8ff] to-[#a78bfa] p-6 text-[#2d1b69] flex justify-between items-center sticky top-0 z-20 shadow-sm">
                <div>
                  <h2 className="text-2xl font-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">✏️ แก้ไขโปรไฟล์ผู้ใช้</h2>
                  <p className="text-sm text-indigo-900 mt-1 font-medium">อัปเดตข้อมูลของ {editingUser.email}</p>
                </div>
                <button onClick={() => setEditingUser(null)} className="text-[#2d1b69] hover:text-white text-3xl font-bold transition-colors">&times;</button>
              </div>

              <form onSubmit={handleSaveUser} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b-2 border-purple-100 pb-2 text-purple-700">📌 ข้อมูลระบบ</h3>
                    <div><label className="block text-sm font-bold mb-1 text-gray-700">อีเมล</label><input type="text" value={editingUser.email} disabled className="w-full px-4 py-2.5 bg-gray-100 border text-gray-500 rounded-xl" /></div>
                    <div><label className="block text-sm font-bold mb-1 text-gray-700">ประเภทผู้ใช้</label><select value={editingUser.role || 'student'} onChange={e => setEditingUser({...editingUser, role: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"><option value="student">นักศึกษา</option><option value="alumni">ศิษย์เก่า</option><option value="admin">แอดมิน</option></select></div>
                    <div><label className="block text-sm font-bold mb-1 text-gray-700">สถานะ</label><select value={editingUser.status || 'ปกติ'} onChange={e => setEditingUser({...editingUser, status: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"><option value="ปกติ">เปิดใช้งาน</option><option value="ระงับการใช้งาน">ระงับการใช้งาน</option></select></div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b-2 border-purple-100 pb-2 text-purple-700">👤 ข้อมูลส่วนตัว</h3>
                    <div><label className="block text-sm font-bold mb-1 text-gray-700">ชื่อ-นามสกุล</label><input type="text" value={editingUser.full_name || ''} onChange={e => setEditingUser({...editingUser, full_name: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="block text-sm font-bold mb-1 text-gray-700">รหัสนักศึกษา</label><input type="text" value={editingUser.student_id || ''} onChange={e => setEditingUser({...editingUser, student_id: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" /></div>
                      <div><label className="block text-sm font-bold mb-1 text-gray-700">รุ่น</label><input type="text" value={editingUser.generation || ''} onChange={e => setEditingUser({...editingUser, generation: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" /></div>
                    </div>
                    <div><label className="block text-sm font-bold mb-1 text-gray-700">เบอร์โทรศัพท์</label><input type="text" value={editingUser.phone || ''} onChange={e => setEditingUser({...editingUser, phone: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" /></div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="font-bold text-lg border-b-2 border-purple-100 pb-2 text-purple-700">🏢 สถานที่ทำงานและที่อยู่</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold mb-1 text-gray-700">บริษัท/สถานที่ทำงาน</label><input type="text" value={editingUser.workplace || ''} onChange={e => setEditingUser({...editingUser, workplace: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" /></div>
                    <div><label className="block text-sm font-bold mb-1 text-gray-700">ตำแหน่งงาน</label><input type="text" value={editingUser.position || ''} onChange={e => setEditingUser({...editingUser, position: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" /></div>
                  </div>
                  <div><label className="block text-sm font-bold mb-1 text-gray-700">ที่อยู่ติดต่อ</label><textarea value={editingUser.address || ''} onChange={e => setEditingUser({...editingUser, address: e.target.value})} rows="2" className="w-full px-4 py-2.5 border rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none" /></div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-purple-50">
                  <button type="button" onClick={() => setEditingUser(null)} className="w-1/3 py-3.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition">ยกเลิก</button>
                  <button type="submit" disabled={loading} className="w-2/3 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-200 transition">💾 บันทึกการเปลี่ยนแปลง</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}