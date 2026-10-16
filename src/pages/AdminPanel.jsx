import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 📌 State สำหรับภาพรวมสถิติ
  const [stats, setStats] = useState({ alumni: 0, student: 0, news: 0 });

  // 📌 State สำหรับจัดการผู้ใช้งาน
  const [users, setUsers] = useState([]);
  const [userFilter, setUserFilter] = useState('all'); // all, student, alumni, admin
  const [editingUser, setEditingUser] = useState(null); // เก็บข้อมูลผู้ใช้ที่กำลังกดแก้ไข

  // 📌 State สำหรับจัดการเนื้อหาเว็บไซต์
  const [siteContent, setSiteContent] = useState({
    id: 1,
    hero_title: 'BME Community',
    hero_subtitle: 'เครือข่ายนักศึกษาและศิษย์เก่า ภาควิชาวิศวกรรมชีวการแพทย์',
    contact_email: 'bme.kmutnb.th@gmail.com',
    contact_phone: '02-555-2000 ต่อ 4402'
  });

  // โหลดข้อมูลเมื่อเปลี่ยนแท็บ
  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'content') fetchSiteContent();
  }, [activeTab, userFilter]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // ==========================================
  // ฟังก์ชัน: 1. ดึงสถิติจริงจากฐานข้อมูล
  // ==========================================
  const fetchStats = async () => {
    setLoading(true);
    try {
      // นับจำนวนศิษย์เก่า
      const { count: alumniCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'alumni');
      // นับจำนวนนักศึกษา
      const { count: studentCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');
      // นับจำนวนข่าวสาร
      const { count: newsCount } = await supabase.from('news').select('*', { count: 'exact', head: true });

      setStats({
        alumni: alumniCount || 0,
        student: studentCount || 0,
        news: newsCount || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ฟังก์ชัน: 2. จัดการผู้ใช้งาน (แบ่งหมวด + แก้ไข)
  // ==========================================
  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase.from('profiles').select('*');
      if (userFilter !== 'all') {
        query = query.eq('role', userFilter);
      }
      
      const { data, error } = await query.order('full_name', { ascending: true });
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      showMessage('error', 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้ (ตรวจสอบว่ามีตาราง profiles หรือยัง)');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('profiles').update({
        full_name: editingUser.full_name,
        role: editingUser.role,
        status: editingUser.status
      }).eq('id', editingUser.id);

      if (error) throw error;
      showMessage('success', 'อัปเดตข้อมูลผู้ใช้งานสำเร็จ');
      setEditingUser(null);
      fetchUsers(); // รีเฟรชตาราง
    } catch (error) {
      showMessage('error', 'เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
    }
  };

  // ==========================================
  // ฟังก์ชัน: 3. จัดการเนื้อหาเว็บไซต์
  // ==========================================
  const fetchSiteContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (data) setSiteContent(data);
    } catch (error) {
      console.error("Error fetching site content (It's normal if table doesn't exist yet):", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSiteContent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('site_settings').upsert({
        id: 1, // บังคับให้เป็น id 1 เสมอ
        ...siteContent
      });

      if (error) throw error;
      showMessage('success', 'บันทึกเนื้อหาหน้าเว็บเรียบร้อยแล้ว');
    } catch (error) {
      showMessage('error', 'เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-10 px-4 font-sans">
      <div className="max-w-7xl mx-auto relative">
        
        {/* แจ้งเตือน Alert */}
        {message.text && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl shadow-lg font-bold flex items-center gap-2 animate-[fadeIn_0.3s_ease-out] ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        {/* ---------------- Header แอดมิน ---------------- */}
        <div className="bg-gradient-to-r from-red-600 via-purple-700 to-black rounded-3xl p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold mb-2">⚙️ ระบบจัดการหลังบ้าน (Admin Panel)</h1>
            <p className="text-purple-200 font-light">จัดการข้อมูลศิษย์เก่า ข่าวสาร และการตั้งค่าระบบ BME Community</p>
          </div>
          <Link to="/profile" className="relative z-10 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-2.5 rounded-xl font-bold transition-all border border-white/30 shadow-lg">
            กลับไปหน้าโปรไฟล์
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ---------------- เมนูด้านซ้าย (Sidebar) ---------------- */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2 lg:sticky lg:top-28">
              <button onClick={() => setActiveTab('dashboard')} className={`text-left px-5 py-3.5 rounded-xl font-bold transition-all flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-purple-100 text-purple-800 shadow-inner' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span>📊</span> ภาพรวมระบบ
              </button>
              <button onClick={() => setActiveTab('users')} className={`text-left px-5 py-3.5 rounded-xl font-bold transition-all flex items-center gap-3 ${activeTab === 'users' ? 'bg-purple-100 text-purple-800 shadow-inner' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span>👥</span> ข้อมูลผู้ใช้งาน
              </button>
              <button onClick={() => setActiveTab('content')} className={`text-left px-5 py-3.5 rounded-xl font-bold transition-all flex items-center gap-3 ${activeTab === 'content' ? 'bg-purple-100 text-purple-800 shadow-inner' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span>📝</span> แก้ไขเนื้อหาหน้าเว็บ
              </button>
            </div>
          </div>

          {/* ---------------- พื้นที่แสดงเนื้อหา (Content Area) ---------------- */}
          <div className="lg:w-3/4">
            
            {/* แท็บ: 1. ภาพรวม (Dashboard) */}
            {activeTab === 'dashboard' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-[fadeIn_0.3s_ease-out]">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span> ภาพรวมสถิติระบบ
                </h2>
                
                {loading ? <p className="text-gray-400">กำลังดึงข้อมูล...</p> : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 shadow-sm">
                      <p className="text-sm font-bold text-purple-600 mb-2">ศิษย์เก่าในระบบ</p>
                      <p className="text-4xl font-extrabold text-gray-900">{stats.alumni} <span className="text-lg text-gray-500 font-normal">คน</span></p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
                      <p className="text-sm font-bold text-blue-600 mb-2">นักศึกษาปัจจุบัน</p>
                      <p className="text-4xl font-extrabold text-gray-900">{stats.student} <span className="text-lg text-gray-500 font-normal">คน</span></p>
                    </div>
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm">
                      <p className="text-sm font-bold text-red-600 mb-2">ข่าวสารที่เผยแพร่</p>
                      <p className="text-4xl font-extrabold text-gray-900">{stats.news} <span className="text-lg text-gray-500 font-normal">โพสต์</span></p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* แท็บ: 2. จัดการผู้ใช้งาน */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span> การจัดการผู้ใช้งาน
                  </h2>
                </div>

                {/* ตัวกรองผู้ใช้งาน */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[{ id: 'all', label: 'ทั้งหมด' }, { id: 'student', label: 'นักศึกษา' }, { id: 'alumni', label: 'ศิษย์เก่า' }, { id: 'admin', label: 'อาจารย์ / แอดมิน' }].map(f => (
                    <button 
                      key={f.id} 
                      onClick={() => setUserFilter(f.id)} 
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${userFilter === f.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                        <th className="p-4 font-bold">ชื่อ-นามสกุล</th>
                        <th className="p-4 font-bold">อีเมล</th>
                        <th className="p-4 font-bold">ประเภท</th>
                        <th className="p-4 font-bold">สถานะ</th>
                        <th className="p-4 font-bold text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="5" className="p-8 text-center text-gray-400">กำลังโหลดข้อมูล...</td></tr>
                      ) : users.length === 0 ? (
                        <tr><td colSpan="5" className="p-8 text-center text-gray-400">ไม่พบข้อมูลในหมวดหมู่นี้</td></tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                            <td className="p-4 font-bold text-gray-800">{u.full_name || '-'}</td>
                            <td className="p-4 text-sm text-gray-600">{u.email}</td>
                            <td className="p-4 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'alumni' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                {u.role?.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-green-600 font-bold">{u.status || 'ปกติ'}</td>
                            <td className="p-4 text-center">
                              <button onClick={() => setEditingUser(u)} className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-200 transition">ตรวจสอบ/แก้ไข</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* แท็บ: 3. แก้ไขเนื้อหาเว็บไซต์ */}
            {activeTab === 'content' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-[fadeIn_0.3s_ease-out]">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span> แก้ไขเนื้อหาเว็บไซต์
                </h2>
                
                <form onSubmit={handleSaveSiteContent} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">พาดหัวแบนเนอร์หลัก (Hero Title)</label>
                      <input type="text" value={siteContent.hero_title} onChange={(e) => setSiteContent({...siteContent, hero_title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">คำอธิบายแบนเนอร์ (Hero Subtitle)</label>
                      <textarea value={siteContent.hero_subtitle} onChange={(e) => setSiteContent({...siteContent, hero_subtitle: e.target.value})} rows="2" className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">อีเมลติดต่อกลาง</label>
                        <input type="email" value={siteContent.contact_email} onChange={(e) => setSiteContent({...siteContent, contact_email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">เบอร์โทรศัพท์ติดต่อกลาง</label>
                        <input type="text" value={siteContent.contact_phone} onChange={(e) => setSiteContent({...siteContent, contact_phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
                      </div>
                    </div>
                  </div>
                  
                  <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                    {loading ? 'กำลังบันทึก...' : '💾 บันทึกเนื้อหาเว็บไซต์'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ---------------- Modal แก้ไขข้อมูลผู้ใช้ ---------------- */}
      {editingUser && (
        <div className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <h2 className="text-2xl font-bold mb-6 border-b pb-4">✏️ แก้ไขข้อมูลผู้ใช้</h2>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                <input type="text" value={editingUser.full_name || ''} onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">อีเมล (ดูได้อย่างเดียว)</label>
                <input type="text" value={editingUser.email} disabled className="w-full px-4 py-2 border rounded-xl bg-gray-100 text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">ประเภทผู้ใช้งาน (Role)</label>
                <select value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value})} className="w-full px-4 py-2 border rounded-xl">
                  <option value="student">นักศึกษา</option>
                  <option value="alumni">ศิษย์เก่า</option>
                  <option value="admin">อาจารย์/แอดมิน</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">สถานะ</label>
                <select value={editingUser.status || 'ปกติ'} onChange={(e) => setEditingUser({...editingUser, status: e.target.value})} className="w-full px-4 py-2 border rounded-xl">
                  <option value="ปกติ">ปกติ (ใช้งานได้)</option>
                  <option value="ระงับการใช้งาน">ระงับการใช้งาน</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">ยกเลิก</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">บันทึกข้อมูล</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}