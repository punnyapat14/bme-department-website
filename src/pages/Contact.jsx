import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  // สร้าง State สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'สอบถามข้อมูลทั่วไป',
    message: ''
  });
  
  const [status, setStatus] = useState(''); // เก็บสถานะ: 'submitting', 'success', 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    // ใส่รหัส Access Key ที่ได้จากอีเมลตรงนี้
    const accessKey = "ใ98a01654-3397-4dad-aaf8-1c6dd49152db"; 
    
    const data = {
      access_key: accessKey,
      subject: `ติดต่อจากเว็บไซต์ BME (หัวข้อ: ${formData.subject})`,
      from_name: formData.name,
      ...formData
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        setStatus('success');
        // ล้างข้อมูลฟอร์มเมื่อส่งสำเร็จ
        setFormData({ name: '', phone: '', email: '', subject: 'สอบถามข้อมูลทั่วไป', message: '' });
        // ปิดแจ้งเตือนสำเร็จหลังผ่านไป 5 วินาที
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-950 via-black to-black text-white pt-16 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-light">
            <Link to="/" className="hover:text-white transition">หน้าหลัก</Link>
            <span>›</span>
            <span className="text-red-400">ติดต่อเรา</span>
          </div>
          <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 mb-6 bg-white/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-medium tracking-widest text-purple-100 uppercase">Contact Us</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4">ติดต่อเรา</h1>
          <p className="text-purple-200/70 font-light max-w-2xl text-lg">
            มีคำถาม ข้อเสนอแนะ หรือต้องการร่วมกิจกรรม? ทีมงานสาขาวิชาและเครือข่ายศิษย์เก่า BME มจพ. ยินดีให้บริการและตอบกลับโดยเร็วที่สุด
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-20">
        {/* Top Info Cards (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-16 mb-12">
          
          {/* Card 1: Phone */}
          <div className="bg-white p-6 rounded-2xl shadow-xl shadow-purple-900/5 flex items-center gap-4 border border-purple-50 group hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 flex-shrink-0 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-gray-500 mb-1">โทรหาเรา</p>
              <p className="font-medium text-gray-900 truncate">02-555-2000 Ext. 4402</p>
            </div>
          </div>
          
          {/* Card 2: Email */}
          <div className="bg-white p-6 rounded-2xl shadow-xl shadow-purple-900/5 flex items-center gap-4 border border-purple-50 group hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 flex-shrink-0 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-gray-500 mb-1">ส่งอีเมล</p>
              <a href="mailto:bme.kmutnb.th@gmail.com" className="font-medium text-gray-900 hover:text-red-600 transition truncate block">bme.kmutnb.th@gmail...</a>
            </div>
          </div>

          {/* Card 3: Facebook */}
          <div className="bg-white p-6 rounded-2xl shadow-xl shadow-purple-900/5 flex items-center gap-4 border border-purple-50 group hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 flex-shrink-0 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-gray-500 mb-1">Facebook</p>
              <a href="https://www.facebook.com/search/top?q=bme.kmutnb" target="_blank" rel="noreferrer" className="font-medium text-gray-900 hover:text-red-600 transition truncate block">BME KMUTNB</a>
            </div>
          </div>

          {/* Card 4: Instagram */}
          <div className="bg-white p-6 rounded-2xl shadow-xl shadow-purple-900/5 flex items-center gap-4 border border-purple-50 group hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 flex-shrink-0 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path></svg>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-gray-500 mb-1">Instagram</p>
              <a href="https://www.instagram.com/bme.kmutnb/" target="_blank" rel="noreferrer" className="font-medium text-gray-900 hover:text-red-600 transition truncate block">@bme.kmutnb</a>
            </div>
          </div>

        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Left: Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-3xl shadow-lg shadow-purple-900/5 border border-purple-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ส่งข้อความถึงเรา</h2>
            <p className="text-gray-500 font-light mb-8 text-sm">กรอกแบบฟอร์มด้านล่าง แล้วเราจะติดต่อกลับภายใน 1-2 วันทำการ</p>
            
            {/* แสดงข้อความสถานะ */}
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ส่งข้อความสำเร็จ! เราจะรีบติดต่อกลับโดยเร็วที่สุด
              </div>
            )}
            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                เกิดข้อผิดพลาดในการส่งข้อความ โปรดลองใหม่อีกครั้ง
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-purple-500/50 outline-none font-light transition-all" placeholder="กรอกชื่อ-นามสกุล" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-purple-500/50 outline-none font-light transition-all" placeholder="08X-XXX-XXXX" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-purple-500/50 outline-none font-light transition-all" placeholder="you@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">หัวข้อ</label>
                <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-purple-500/50 outline-none font-light transition-all appearance-none cursor-pointer">
                  <option value="สอบถามข้อมูลทั่วไป">สอบถามข้อมูลทั่วไป</option>
                  <option value="งานเครือข่ายศิษย์เก่า">งานเครือข่ายศิษย์เก่า</option>
                  <option value="เสนอความร่วมมือ / ฝึกงาน">เสนอความร่วมมือ / ฝึกงาน</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ข้อความ <span className="text-red-500">*</span></label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-purple-500/50 outline-none font-light transition-all resize-none" placeholder="พิมพ์ข้อความของคุณที่นี่..."></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={status === 'submitting'}
                // เพิ่มคำว่า group เข้าไปใน className เพื่อทำเอฟเฟกต์ตอน hover
                className={`group bg-gradient-to-r from-gray-900 to-black text-white font-medium py-3.5 px-8 rounded-xl transition-all duration-500 shadow-md shadow-purple-900/20 mt-2 flex items-center justify-center gap-2 w-full md:w-auto ${status === 'submitting' ? 'opacity-70 cursor-not-allowed' : 'hover:from-purple-700 hover:to-red-600'}`}
              >
                {status === 'submitting' ? 'กำลังส่งข้อความ...' : 'ส่งข้อความ'}
                {status !== 'submitting' && (
                  <svg 
                    // ปรับขนาดเป็น w-5 h-5 และใส่เอฟเฟกต์ขยับ (translate) ตอนเอาเมาส์ชี้
                    className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    viewBox="0 0 24 24"
                  >
                    {/* วาดรูปจรวดกระดาษแบบคลาสสิก */}
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                )}
              </button>
            </form>
          </div>

          {/* Right: Info Cards */}
          <div className="flex flex-col gap-6">
            
            {/* Location Card */}
            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-purple-900/5 border border-purple-50">
              <div className="w-10 h-10 bg-purple-900 text-white rounded-xl flex items-center justify-center mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">สถานที่ตั้ง</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-light mb-4">
                ชั้น 4 อาคาร 78 สาขาวิชาวิศวกรรมชีวการแพทย์ ภาควิชาฟิสิกส์อุตสาหกรรมและอุปกรณ์การแพทย์<br/>
                คณะวิทยาศาสตร์ประยุกต์ มจพ.<br/>
                1518 ถ.ประชาราษฎร์สาย 1 แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800
              </p>
              <a href="https://maps.app.goo.gl/4oBh1212QB1ytGQMA" target="_blank" rel="noreferrer" className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1 transition">
                ดูแผนที่ <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
            </div>

            {/* Operating Hours Card (Dark) */}
            <div className="bg-gradient-to-br from-purple-950 to-gray-900 p-8 rounded-3xl shadow-lg border border-purple-800/50 text-white">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 className="font-bold text-lg">เวลาทำการ</h3>
              </div>
              <div className="space-y-4 text-sm font-light">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-purple-100">จันทร์ – ศุกร์</span>
                  <span className="font-medium">09:00 – 16:00</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-purple-100">เสาร์ – อาทิตย์</span>
                  <span className="text-red-400 font-medium">ปิดทำการ</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Map Full Width Card */}
        <div className="bg-white p-2 rounded-3xl shadow-lg shadow-purple-900/5 border border-purple-50">
          <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">ค้นหาเส้นทาง</h3>
                <p className="text-xs text-gray-500 font-light">BME KMUTNB</p>
              </div>
            </div>
            <a href="https://maps.app.goo.gl/4oBh1212QB1ytGQMA" target="_blank" rel="noreferrer" className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-red-700 transition shadow-md shadow-red-600/20 flex items-center gap-2">
              เปิดใน Google Maps
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          </div>
          <div className="w-full h-96 rounded-2xl overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.3315808796853!2d100.51179781527588!3d13.824514590300645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29b79b292f759%3A0xc3cf961fb224db!2sKing%20Mongkut&#39;s%20University%20of%20Technology%20North%20Bangkok%20(KMUTNB)!5e0!3m2!1sen!2sth!4v1650000000000!5m2!1sen!2sth" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="KMUTNB Map"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}