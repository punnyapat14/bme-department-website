import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 📌 1. เพิ่ม State สำหรับเก็บข้อมูลให้ครบทุก Role รวมถึงแอดมิน
  const [formData, setFormData] = useState({
    email: '',
    role: '',
    prefix: '',
    full_name: '',
    nickname: '',
    phone: '',
    profile_pic_url: '',
    facebook: '',
    line_id: '',
    
    // ของ Alumni
    company: '',
    job_category: '',
    
    // ของ Admin
    academic_position: '',
    admin_position: '',
    office_room: '',
    academic_works: '',
    internal_phone: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (user) {
        const meta = user.user_metadata || {};
        setFormData({
          email: user.email || '',
          role: meta.role || 'alumni',
          prefix: meta.prefix || '',
          full_name: meta.full_name || '',
          nickname: meta.nickname || '',
          phone: meta.phone || '',
          profile_pic_url: meta.profile_pic_url || '',
          facebook: meta.facebook || '',
          line_id: meta.line_id || '',
          
          company: meta.company || '',
          job_category: meta.job_category || '',
          
          // 📌 ดึงข้อมูลของแอดมินมาแสดง
          academic_position: meta.academic_position || '',
          admin_position: meta.admin_position || '',
          office_room: meta.office_room || '',
          academic_works: meta.academic_works || '',
          internal_phone: meta.internal_phone || ''
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'ไม่สามารถดึงข้อมูลได้: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      // 📌 2. ส่งข้อมูลที่แก้ไขกลับไปอัปเดตที่ Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          prefix: formData.prefix,
          full_name: formData.full_name,
          nickname: formData.nickname,
          phone: formData.phone,
          profile_pic_url: formData.profile_pic_url,
          facebook: formData.facebook,
          line_id: formData.line_id,
          
          company: formData.company,
          job_category: formData.job_category,
          
          // อัปเดตข้อมูลแอดมิน
          academic_position: formData.academic_position,
          admin_position: formData.admin_position,
          office_room: formData.office_room,
          academic_works: formData.academic_works,
          internal_phone: formData.internal_phone
        }
      });

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'บันทึกข้อมูลสำเร็จเรียบร้อย!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'เกิดข้อผิดพลาด: ' + error.message });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // คอมโพเนนต์ย่อยสำหรับช่องกรอกข้อมูล
  const ProfileField = ({ label, name, value, type = "text", placeholder, isTextArea = false }) => (
    <div className="mb-4">
      <label className="block text-sm font-bold text-gray-500 mb-1">{label}</label>
      {isEditing ? (
        isTextArea ? (
          <textarea
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            rows="3"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
          />
        )
      ) : (
        <div className="px-4 py-2.5 bg-white border border-transparent rounded-xl text-gray-900 font-medium shadow-sm min-h-[44px]">
          {value || <span className="text-gray-400 italic">ไม่ได้ระบุข้อมูล</span>}
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center bg-[#f8f9fc]"><div className="w-10 h-10 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-10 px-4 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {message.text && (
          <div className={`p-4 rounded-2xl shadow-sm text-sm font-bold flex items-center transition-all ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-700 via-red-500 to-purple-700"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full border-4 border-purple-100 shadow-md overflow-hidden bg-gray-200 flex-shrink-0">
                {formData.profile_pic_url ? (
                  <img src={formData.profile_pic_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold">
                    {formData.full_name ? formData.full_name.charAt(0) : '?'}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-2xl font-extrabold text-gray-900">
                {formData.prefix} {formData.full_name} {formData.nickname && `(${formData.nickname})`}
              </h1>
              <p className="text-purple-600 font-bold mt-1 uppercase tracking-wider text-sm">
                {formData.role === 'alumni' ? '🎓 ศิษย์เก่า (Alumni)' : formData.role === 'student' ? '📚 นักศึกษาปัจจุบัน' : '👨‍🏫 อาจารย์ / แอดมิน'}
              </p>
              <p className="text-gray-500 text-sm mt-1">{formData.email}</p>
            </div>
          </div>

          <div className="flex-shrink-0">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)} 
                className="px-6 py-2.5 bg-purple-100 text-purple-700 hover:bg-purple-200 font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
              >
                ✏️ แก้ไขโปรไฟล์
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => { setIsEditing(false); fetchUserProfile(); }} 
                  disabled={saving}
                  className="px-6 py-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold rounded-xl transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="px-6 py-2.5 bg-purple-700 text-white hover:bg-purple-800 hover:shadow-lg font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  {saving ? 'กำลังบันทึก...' : '💾 บันทึกข้อมูล'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* ข้อมูลส่วนตัว (แสดงทุกคน) */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 transition-all hover:shadow-lg h-fit">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
              <span className="w-1.5 h-6 bg-red-500 rounded-full"></span> ข้อมูลส่วนบุคคล
            </h2>
            <div className="space-y-2">
              <ProfileField label="คำนำหน้า" name="prefix" value={formData.prefix} placeholder="เช่น นาย, นางสาว, ดร." />
              <ProfileField label="ชื่อ-นามสกุล" name="full_name" value={formData.full_name} placeholder="เช่น สมชาย ใจดี" />
              <ProfileField label="ชื่อเล่น" name="nickname" value={formData.nickname} placeholder="เช่น ชาย" />
              <ProfileField label="URL รูปโปรไฟล์" name="profile_pic_url" value={formData.profile_pic_url} placeholder="https://..." />
            </div>
          </div>

          <div className="space-y-6">
            
            {/* 📌 3. การ์ดข้อมูลการทำงาน (แยกตาม Role) */}
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 transition-all hover:shadow-lg">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
                <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span> ข้อมูลการทำงาน
              </h2>
              
              {/* ถ้าเป็น ศิษย์เก่า */}
              {formData.role === 'alumni' && (
                <>
                  <ProfileField label="สายงาน" name="job_category" value={formData.job_category} placeholder="ระบุสายงาน" />
                  <ProfileField label="องค์กร / บริษัท" name="company" value={formData.company} placeholder="เช่น รพ.ศิริราช" />
                </>
              )}

              {/* 📌 ถ้าเป็น แอดมิน/อาจารย์ */}
              {formData.role === 'admin' && (
                <>
                  <ProfileField label="ตำแหน่งทางวิชาการ" name="academic_position" value={formData.academic_position} placeholder="เช่น รองศาสตราจารย์" />
                  <ProfileField label="ตำแหน่งบริหาร (ถ้ามี)" name="admin_position" value={formData.admin_position} placeholder="เช่น หัวหน้าภาควิชา" />
                  <ProfileField label="ห้องพักอาจารย์" name="office_room" value={formData.office_room} placeholder="เช่น 78-601" />
                  <ProfileField label="ผลงานวิชาการ" name="academic_works" value={formData.academic_works} placeholder="ระบุผลงานวิชาการที่โดดเด่น" isTextArea={true} />
                </>
              )}
            </div>

            {/* ข้อมูลการติดต่อ (แสดงทุกคน) */}
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 transition-all hover:shadow-lg">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span> ช่องทางการติดต่อ
              </h2>
              <ProfileField label="เบอร์โทรศัพท์" name="phone" value={formData.phone} placeholder="08x-xxx-xxxx" />
              
              {/* เพิ่มเบอร์ภายในสำหรับแอดมิน */}
              {formData.role === 'admin' && (
                <ProfileField label="เบอร์โทรภายในมหาวิทยาลัย" name="internal_phone" value={formData.internal_phone} placeholder="เช่น 1234" />
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <ProfileField label="Line ID" name="line_id" value={formData.line_id} placeholder="ID Line" />
                <ProfileField label="Facebook" name="facebook" value={formData.facebook} placeholder="ชื่อ Facebook" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}