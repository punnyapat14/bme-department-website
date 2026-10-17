import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground, SectionBanner } from '../components/ThemeElements';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from "../supabaseClient";

// ==========================================
// 📌 ค่าคงที่สำหรับสไตล์
// ==========================================
const CAT_STYLE = {
  'เสื้อ & แฟชั่น': { emoji: '👕', grad: 'from-purple-400 to-indigo-400', chip: 'bg-purple-50 text-purple-700 border-purple-200' },
  'แก้ว & ขวดน้ำ': { emoji: '🥤', grad: 'from-rose-400 to-orange-300', chip: 'bg-rose-50 text-rose-700 border-rose-200' },
  'เครื่องเขียน': { emoji: '✏️', grad: 'from-amber-300 to-yellow-300', chip: 'bg-amber-50 text-amber-700 border-amber-200' },
  'ของที่ระลึก': { emoji: '🎁', grad: 'from-teal-400 to-emerald-300', chip: 'bg-teal-50 text-teal-700 border-teal-200' },
  'อื่นๆ': { emoji: '✨', grad: 'from-sky-400 to-blue-300', chip: 'bg-sky-50 text-sky-700 border-sky-200' },
};

const SOCIAL_TONES = [
  { label: '📘 Facebook (สีน้ำเงิน)', value: 'bg-[#1877F2]' },
  { label: '📸 Instagram (สีรุ้ง)', value: 'bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-500' },
  { label: '💬 Line (สีเขียว)', value: 'bg-[#00B900]' },
  { label: '✖️ X / Twitter (สีดำ)', value: 'bg-black' },
  { label: '🌐 Website (สีเทา)', value: 'bg-slate-700' }
];

const BADGES = ['', 'ใหม่', 'ขายดี', 'พรีออเดอร์', 'จำนวนจำกัด'];

const EMPTY_PRODUCT_FORM = { id: '', name: '', price: '', category: '', sale_period: '', status: 'open', badge: '', description: '', image_url: '', buy_url: '', is_visible: true };

// ==========================================
// 📌 Components ปุ่มจัดการ UI (แอดมิน)
// ==========================================

// 🔵🔴 ปุ่ม แก้ไข(น้ำเงิน) / ลบ(แดง) บนตัวการ์ดต่างๆ
const ActionButtons = ({ onEdit, onDelete, positionClass = "absolute top-3 right-3", hideDelete = false }) => (
  <div className={`${positionClass} flex gap-1.5 z-30`}>
    {onEdit && (
      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }} className="w-8 h-8 flex items-center justify-center bg-[#3b82f6] text-white rounded-[0.65rem] shadow-sm hover:bg-blue-600 transition-colors cursor-pointer" title="แก้ไข">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      </button>
    )}
    {!hideDelete && onDelete && (
      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} className="w-8 h-8 flex items-center justify-center bg-[#ef4444] text-white rounded-[0.65rem] shadow-sm hover:bg-rose-600 transition-colors cursor-pointer" title="ลบทิ้ง">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>
    )}
  </div>
);

// ⚪ ปุ่มแก้ไขแบนเนอร์สีเทา
const BannerEditButton = ({ onClick, title = "แก้ไข" }) => (
  <button onClick={onClick} title={title} className="w-9 h-9 bg-white border border-slate-200 text-slate-500 hover:text-[#3b82f6] hover:border-blue-300 rounded-[0.8rem] shadow-sm transition-all cursor-pointer flex items-center justify-center shrink-0">
     <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
  </button>
);

// ⚫ ปุ่มเพิ่มข้อมูลสีดำ
const AddButton = ({ onClick, text }) => (
  <button onClick={onClick} className="px-4 py-2 h-9 bg-[#0f172a] text-white rounded-[0.8rem] text-xs font-bold shadow-sm hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shrink-0">
     <span className="text-sm font-normal leading-none">+</span> {text}
  </button>
);

// 📌 ฟังก์ชันดึงไอคอน Social Media
const getSocialIcon = (label) => {
  const lower = String(label).toLowerCase();
  if (lower.includes('facebook') || lower.includes('fb')) {
    return <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
  }
  if (lower.includes('instagram') || lower.includes('ig')) {
    return <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
  }
  if (lower.includes('line')) {
    return <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.961 8.875 9.539 9.596.903.155 1.25.466 1.439.816.146.269.213.623.111 1.233-.062.368-.293 1.764-.356 2.146-.089.544-.38 1.722 1.503.929 1.882-.793 10.155-5.968 11.233-9.614C23.765 13.882 24 12.181 24 10.304zm-14.887 3.39h-2.583a.47.47 0 01-.47-.47V7.126c0-.26.21-.47.47-.47h2.583c.26 0 .47.21.47.47v5.628c0 .26-.21.47-.47.47zm3.189 0h-1.077a.47.47 0 01-.47-.47V7.126c0-.26.21-.47.47-.47h1.077c.26 0 .47.21.47.47v5.628c0 .26-.21.47-.47.47zm5.556 0h-2.322a.47.47 0 01-.47-.47v-1.782h-1.638v1.782c0 .26-.21.47-.47.47h-1.076a.47.47 0 01-.47-.47V7.126c0-.26.21-.47.47-.47h1.076c.26 0 .47.21.47.47v1.783h1.638V7.126c0-.26.21-.47.47-.47h2.322c.26 0 .47.21.47.47v5.628c0 .26-.21.47-.47.47z"/></svg>;
  }
  return <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>;
};

// ==========================================
// 📌 Helper Functions
// ==========================================
const formatPrice = (n) => {
  if (n === '' || n === null || n === undefined) return '-';
  const num = Number(String(n).replace(/,/g, ''));
  return Number.isNaN(num) ? String(n) : `฿${num.toLocaleString('th-TH')}`;
};

const formatImageUrl = (url) => {
  if (!url) return '';
  const trimmed = String(url).trim();
  const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) || trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) { return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1000`; }
  return trimmed;
};

const ProductVisual = ({ product, className = 'h-48' }) => {
  const style = CAT_STYLE[product.category] || CAT_STYLE['อื่นๆ'];
  const imgSrc = formatImageUrl(product.image_url);

  return imgSrc ? (
    <img src={imgSrc} alt={product.name} referrerPolicy="no-referrer" className={`w-full ${className} object-cover`} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
  ) : (
    <div className={`w-full ${className} bg-gradient-to-br ${style.grad} flex items-center justify-center relative overflow-hidden`}>
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/25"></div>
      <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/20"></div>
      <span className="text-6xl drop-shadow-md relative z-10">{style.emoji}</span>
    </div>
  );
};

export default function Shop() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({ page_title: 'กำลังโหลด...', page_subtitle: '', categories: ['อื่นๆ'], order_steps: [], social_links: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('ทั้งหมด');

  // ⚙️ States สำหรับ Admin
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);
  const [uploadFile, setUploadFile] = useState(null);

  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [settingsModalType, setSettingsModalType] = useState('header'); 
  const [settingsForm, setSettingsForm] = useState({});

  const [jsonModalState, setJsonModalState] = useState({ isOpen: false, field: '', index: -1, data: {} });

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 🔒 ตรวจสอบสิทธิ์แบบครอบคลุม
  const canManageShop = useMemo(() => {
    if (!user) return false;
    const role = String(user.role || '').toLowerCase();
    const metaRole = String(user.user_metadata?.role || '').toLowerCase();
    const email = String(user.email || '').toLowerCase();
    return (
      ['admin', 'faculty', 'teacher', 'staff', 'instructor'].includes(role) ||
      ['admin', 'faculty', 'teacher', 'staff', 'instructor'].includes(metaRole) ||
      user.isAdmin === true ||
      email.endsWith('@sci.kmutnb.ac.th') || email.endsWith('@email.kmutnb.ac.th') || email === 'bme.kmutnb.th@gmail.com'
    );
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    setLoading(true);
    try {
      const { data: settingsData } = await supabase.from('shop_settings').select('*').eq('id', 1).single();
      if (settingsData) setSettings(settingsData);

      const { data: productsData } = await supabase.from('shop_products').select('*').order('created_at', { ascending: false });
      if (productsData) setProducts(productsData);
    } catch (err) {
      console.error('Fetch shop error:', err);
    } finally {
      setLoading(false);
    }
  };

  const visibleProducts = useMemo(() => {
    return products.filter((p) => {
      if (!canManageShop && !p.is_visible) return false;
      const matchCat = activeCat === 'ทั้งหมด' || p.category === activeCat;
      const q = search.trim().toLowerCase();
      const matchSearch = !q || String(p.name || '').toLowerCase().includes(q) || String(p.description || '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, canManageShop, activeCat, search]);

  const stats = useMemo(() => ({
    total: products.length,
    open: products.filter((p) => p.status === 'open').length,
    closed: products.filter((p) => p.status === 'closed').length,
  }), [products]);

  // ==========================================
  // 📌 ฟังก์ชันจัดการสินค้า (แอดมิน)
  // ==========================================
  const openCreateProduct = () => {
    setUploadFile(null);
    setProductForm({ ...EMPTY_PRODUCT_FORM, category: settings.categories[0] || 'อื่นๆ' });
    setFormError('');
    setShowProductForm(true);
  };

  const openEditProduct = (p) => {
    setUploadFile(null);
    setProductForm({
      id: p.id, name: p.name || '', price: String(p.price ?? ''), category: p.category || settings.categories[0],
      sale_period: p.sale_period || '', status: p.status, badge: p.badge || '', description: p.description || '',
      image_url: p.image_url || '', buy_url: p.buy_url || '', is_visible: Boolean(p.is_visible)
    });
    setFormError('');
    setShowProductForm(true);
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };
  
  const uploadImageToSupabase = async (file) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `shop_${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
    const { error } = await supabase.storage.from('images').upload(`shop/${fileName}`, file);
    if (error) throw error;
    const { data } = supabase.storage.from('images').getPublicUrl(`shop/${fileName}`);
    return data.publicUrl;
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    if (!canManageShop) return;
    if (!productForm.name.trim()) return setFormError('กรุณากรอกชื่อสินค้า');
    if (productForm.price === '' || Number(productForm.price) < 0) return setFormError('กรุณากรอกราคาให้ถูกต้อง');

    setSubmitting(true);
    try {
      let finalImgUrl = productForm.image_url;
      if (uploadFile) {
        const uploadedUrl = await uploadImageToSupabase(uploadFile);
        if (uploadedUrl) finalImgUrl = uploadedUrl;
      }

      const payload = {
        name: productForm.name.trim(), price: Number(productForm.price), category: productForm.category,
        sale_period: productForm.sale_period.trim(), status: productForm.status, badge: productForm.badge,
        description: productForm.description.trim(), image_url: finalImgUrl.trim(), buy_url: productForm.buy_url.trim(),
        is_visible: productForm.is_visible
      };

      if (productForm.id) {
        await supabase.from('shop_products').update(payload).eq('id', productForm.id);
      } else {
        await supabase.from('shop_products').insert([payload]);
      }
      setShowProductForm(false);
      fetchShopData();
    } catch (err) { setFormError('เกิดข้อผิดพลาดในการบันทึกข้อมูล'); }
    finally { setSubmitting(false); }
  };

  const deleteProduct = async (id, name) => {
    if (!canManageShop) return;
    if (!window.confirm(`ยืนยันการลบทิ้งสินค้า: "${name}" ?\nข้อมูลจะหายไปจากระบบถาวร`)) return;
    try {
      await supabase.from('shop_products').delete().eq('id', id);
      fetchShopData();
    } catch (err) { alert('ไม่สามารถลบสินค้าได้'); }
  };

  // ==========================================
  // 📌 ฟังก์ชันจัดการตั้งค่าหน้าเว็บ (แอดมิน)
  // ==========================================
  const openSettings = (type) => {
    setSettingsModalType(type);
    setSettingsForm({
      page_title: settings.page_title,
      page_subtitle: settings.page_subtitle,
      categoriesText: settings.categories.join(', '), 
      orderStepsText: settings.order_steps.join('\n') 
    });
    setFormError('');
    setShowSettingsForm(true);
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    if (!canManageShop) return;
    setSubmitting(true);
    try {
      const catsArray = settingsForm.categoriesText.split(',').map(c => c.trim()).filter(Boolean);
      const stepsArray = settingsForm.orderStepsText.split('\n').map(s => s.trim()).filter(Boolean);

      const payload = {
        page_title: settingsForm.page_title,
        page_subtitle: settingsForm.page_subtitle,
        categories: catsArray,
        order_steps: stepsArray
      };

      await supabase.from('shop_settings').update(payload).eq('id', 1);
      setShowSettingsForm(false);
      fetchShopData(); 
    } catch (err) { setFormError('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า'); }
    finally { setSubmitting(false); }
  };

  // จัดการ JSON (โซเชียลมีเดีย)
  const openJsonModal = (index = -1) => {
    let initialData = { label: '', value: '', href: '', tone: 'bg-[#1877F2]' };
    if (index >= 0 && settings.social_links[index]) {
      initialData = { ...settings.social_links[index] };
    }
    setJsonModalState({ isOpen: true, field: 'social_links', index, data: initialData });
  };

  const saveJsonItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { index, data } = jsonModalState;
      let newArray = [...(settings.social_links || [])];
      if (index >= 0) newArray[index] = data;
      else newArray.push(data);

      await supabase.from('shop_settings').update({ social_links: newArray }).eq('id', 1);
      setSettings({ ...settings, social_links: newArray });
      setJsonModalState({ isOpen: false, field: '', index: -1, data: {} });
    } catch (err) { alert('บันทึกไม่สำเร็จ'); }
    finally { setSubmitting(false); }
  };

  const deleteJsonItem = async (index) => {
    if (!window.confirm('ยืนยันการลบทิ้งช่องทางติดต่อนี้?')) return;
    try {
      let newArray = [...(settings.social_links || [])];
      newArray.splice(index, 1);
      await supabase.from('shop_settings').update({ social_links: newArray }).eq('id', 1);
      setSettings({ ...settings, social_links: newArray });
    } catch (err) { alert('ลบไม่สำเร็จ'); }
  };

  const bentoGlass = 'rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden';

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />

      {/* 📌 ปรับ max-w ให้ไม่กว้างจนเกินไปเหมือนหน้าอื่นๆ */}
      <div className="relative z-10 max-w-[1100px] mx-auto px-4 md:px-6 pt-2">

        {/* ---------------- Header ---------------- */}
        <div className="text-center max-w-4xl mx-auto pt-2 pb-8 relative">
          
          {/* ⚙️ ปุ่มแก้ไข Header (ปุ่มสีน้ำเงินทรงสี่เหลี่ยม เหมือนหน้าอื่นๆ) */}
          {canManageShop && (
             <button onClick={() => openSettings('header')} className="absolute top-0 right-0 md:-right-8 w-11 h-11 bg-[#3b82f6] text-white rounded-2xl shadow-sm hover:bg-blue-600 flex items-center justify-center cursor-pointer z-20 transition-all">
               <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
             </button>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
            {settings.page_title}
          </h1>
          <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl whitespace-pre-line">
            {settings.page_subtitle}
          </p>
        </div>

        {/* ---------------- แผงสรุปข้อมูลสำหรับแอดมิน ---------------- */}
        {canManageShop && (
          <div className={`p-6 md:p-8 mb-10 ${bentoGlass} border-purple-200`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-400 rounded-full"></span>
                  ระบบจัดการร้านค้า (แอดมิน)
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1">ข้อมูลทั้งหมดเชื่อมต่อกับระบบฐานข้อมูลเรียลไทม์</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-5 mt-5">
              {[
                { label: 'สินค้าทั้งหมด', value: stats.total, tone: 'bg-purple-50 text-purple-700 border-purple-100' },
                { label: 'กำลังเปิดขาย', value: stats.open, tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                { label: 'ปิดการขายแล้ว', value: stats.closed, tone: 'bg-rose-50 text-rose-700 border-rose-100' },
              ].map((s) => (
                <div key={s.label} className={`rounded-2xl border p-4 text-center ${s.tone}`}>
                  <p className="text-2xl md:text-3xl font-black">{s.value}</p>
                  <p className="text-[11px] md:text-xs font-bold mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- Section 1: รายละเอียดร้านค้า ---------------- */}
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          
          {/* 📌 นำเส้นขอบ (border-b) ด้านล่างออกเพื่อให้แบนเนอร์ไม่ดูกว้างเกินไป */}
          <div className="flex justify-between items-center mb-8 relative">
            <div className="flex-1 pr-4">
               <SectionBanner text="รายละเอียดร้านค้า" variant="website" />
            </div>
            {/* ⚙️ ปุ่มสีเทา/ดำ ข้างแบนเนอร์รายละเอียดร้านค้า */}
            {canManageShop && (
              <div className="flex items-center gap-2 shrink-0">
                <BannerEditButton onClick={() => alert('ส่วนนี้จำลอง UI การแก้ไขรายละเอียดร้านค้า')} title="แก้ไขรายละเอียด" />
                <AddButton onClick={() => alert('ส่วนนี้จำลอง UI การเพิ่มรายละเอียด')} text="เพิ่มข้อมูล" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: '📝', title: 'สั่งซื้อผ่านฟอร์มออนไลน์', desc: 'คลิกปุ่มสั่งซื้อที่รายการสินค้าเพื่อเข้าสู่หน้าสั่งซื้อ', tone: 'from-purple-50 to-indigo-50 border-purple-100' },
              { icon: '📦', title: 'รับสินค้าที่ภาควิชา / จัดส่ง', desc: 'เลือกรับสินค้าที่สาขา หรือเลือกบริการจัดส่ง', tone: 'from-rose-50 to-orange-50 border-rose-100' },
              { icon: '🎓', title: 'สนับสนุนกิจกรรมสาขา', desc: 'รายได้นำไปใช้จัดกิจกรรมนักศึกษาและเครือข่ายศิษย์เก่า', tone: 'from-teal-50 to-emerald-50 border-teal-100' },
            ].map((item) => (
              <div key={item.title} className={`relative rounded-[2rem] border bg-gradient-to-br ${item.tone} p-6 shadow-sm`}>
                {/* 📌 ปุ่ม กล่องน้ำเงิน/แดง บนตัวการ์ดรายละเอียด */}
                {canManageShop && (
                  <ActionButtons positionClass="absolute top-4 right-4" onEdit={() => alert('แก้ไขข้อมูล')} onDelete={() => alert('ลบข้อมูลนี้')} />
                )}
                
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-black text-slate-800 mb-1.5 pr-14">{item.title}</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- Section 2: รายการสินค้า ---------------- */}
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          
          <div className="flex justify-between items-center mb-8 relative">
            <div className="flex-1 pr-4">
              <SectionBanner text="รายการสินค้า" variant="exam" />
            </div>
            {/* ⚙️ ปุ่มสีเทา/ดำ ข้างแบนเนอร์รายการสินค้า */}
            {canManageShop && (
              <div className="flex items-center gap-2 shrink-0">
                <BannerEditButton onClick={() => openSettings('categories')} title="ตั้งค่าหมวดหมู่" />
                <AddButton onClick={openCreateProduct} text="เพิ่มสินค้า" />
              </div>
            )}
          </div>

          <div className="max-w-xl mx-auto relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400 focus-within:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input type="text" placeholder="ค้นหาสินค้า..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-white/90 backdrop-blur-md shadow-sm rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base font-medium transition-all border border-slate-100" />
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {['ทั้งหมด', ...(settings.categories || [])].map((cat) => (
              <button key={cat} onClick={() => setActiveCat(cat)} className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 shadow-sm cursor-pointer ${activeCat === cat ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-105' : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900'}`}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-[2rem] bg-slate-100 h-96 animate-pulse" />
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🛍️</p>
              <p className="text-lg font-black text-slate-800">ไม่มีรายการสินค้า</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProducts.map((p) => {
                const style = CAT_STYLE[p.category] || CAT_STYLE['อื่นๆ'];
                const isClosed = p.status === 'closed';

                return (
                  <motion.div key={p.id} layout whileHover={{ y: -6 }} className={`relative rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col ${!p.is_visible ? 'opacity-60 grayscale-[30%]' : ''}`}>
                    
                    {/* 📌 ปุ่ม กล่องน้ำเงิน/แดง บนตัวการ์ดสินค้า */}
                    {canManageShop && (
                      <ActionButtons onEdit={() => openEditProduct(p)} onDelete={() => deleteProduct(p.id, p.name)} positionClass="absolute top-2 right-2" />
                    )}
                    
                    <div className="relative">
                      <ProductVisual product={p} />
                      {p.badge && <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[11px] font-black text-rose-600 shadow-sm">{p.badge}</span>}
                      {!canManageShop && (
                        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-extrabold shadow-sm ${isClosed ? 'bg-slate-900/85 text-white' : 'bg-emerald-500/95 text-white'}`}>
                          {isClosed ? 'ปิดการขาย' : 'เปิดการขาย'}
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-2.5">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${style.chip}`}>{p.category}</span>
                        {!p.is_visible && <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">ซ่อนจากเว็บ</span>}
                      </div>

                      <h3 className="text-base font-black text-slate-800 leading-snug mb-1.5">{p.name}</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3 mb-3">{p.description}</p>

                      {p.sale_period && (
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl mb-4 border border-slate-100">
                          <span className="truncate">{p.sale_period}</span>
                        </div>
                      )}

                      <div className="mt-auto">
                        <div className="flex items-end justify-between mb-3">
                          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-rose-500">
                            {formatPrice(p.price)}
                          </p>
                        </div>

                        {!isClosed && p.buy_url ? (
                          <a href={p.buy_url} target="_blank" rel="noreferrer" className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-rose-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center">
                            ไปที่หน้าสั่งซื้อสินค้า
                          </a>
                        ) : (
                          <button disabled className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-300 cursor-not-allowed">
                            {isClosed ? 'ปิดการขายแล้ว' : 'ยังไม่มีลิงก์สั่งซื้อ'}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ---------------- Section 3: วิธีสั่งซื้อและติดต่อ ---------------- */}
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          
          <div className="flex justify-between items-center mb-8 relative">
            <div className="flex-1 pr-4">
              <SectionBanner text="วิธีสั่งซื้อและติดต่อ" variant="social" />
            </div>
            {/* ⚙️ ปุ่มสีเทา/ดำ ข้างแบนเนอร์ติดต่อ */}
            {canManageShop && (
              <div className="flex items-center gap-2 shrink-0">
                <BannerEditButton onClick={() => alert('ตั้งค่าหน้าติดต่อ')} title="ตั้งค่ารวม" />
                <AddButton onClick={() => alert('เพิ่มข้อมูลส่วนนี้')} text="เพิ่มข้อมูล" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* ขั้นตอนการสั่งซื้อ */}
            <div className="rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-400 rounded-full"></span> ขั้นตอนการสั่งซื้อ
                </h3>
                {/* ⚙️ ปุ่มเทา/ดำ สำหรับหัวข้อขั้นตอน */}
                {canManageShop && (
                  <div className="flex items-center gap-2">
                     <BannerEditButton onClick={() => openSettings('steps')} title="แก้ไขขั้นตอนทั้งหมด" />
                     <AddButton onClick={() => alert('เพิ่มขั้นตอนใหม่')} text="เพิ่มขั้นตอน" />
                  </div>
                )}
              </div>
              
              <ul className="space-y-3">
                {(settings.order_steps || []).map((step, i) => (
                  <li key={i} className="flex items-center gap-4 p-3.5 bg-white rounded-2xl shadow-sm border border-slate-100 relative pr-24">
                    <span className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-rose-400 text-white text-[13px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed flex-1">{step}</p>
                    
                    {/* 📌 ปุ่ม น้ำเงิน/แดง จัดชิดขวาในการ์ดย่อย */}
                    {canManageShop && (
                      <ActionButtons positionClass="absolute top-1/2 -translate-y-1/2 right-3" onEdit={() => openSettings('steps')} onDelete={() => alert('ลบขั้นตอนนี้')} />
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* ช่องทางการติดต่อ */}
            <div className="rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-rose-400 rounded-full"></span> ช่องทางติดต่อ
                </h3>
                {/* ⚙️ ปุ่มเทา/ดำ สำหรับหัวข้อช่องทางติดต่อ */}
                {canManageShop && (
                  <div className="flex items-center gap-2">
                     <BannerEditButton onClick={() => alert('ตั้งค่าช่องทางติดต่อรวม')} title="ตั้งค่าช่องทาง" />
                     <AddButton onClick={() => openJsonModal()} text="เพิ่มช่องทาง" />
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {(settings.social_links || []).map((c, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3.5 bg-white rounded-2xl shadow-sm border border-slate-100 relative pr-24">
                    <a href={c.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity">
                      
                      {/* 📌 เปลี่ยนมาใช้ไอคอน SVG ของจริง แทนตัวอักษร */}
                      <span className={`w-10 h-10 rounded-full ${c.tone} text-white flex items-center justify-center shrink-0`}>
                        {getSocialIcon(c.label)}
                      </span>
                      
                      <div>
                        <span className="block text-sm font-black text-slate-800 leading-tight mb-0.5">{c.label}</span>
                        <span className="block text-[11px] font-medium text-slate-500 leading-tight">{c.value}</span>
                      </div>
                    </a>
                    
                    {/* 📌 ปุ่ม น้ำเงิน/แดง จัดชิดขวาในการ์ดย่อย */}
                    {canManageShop && (
                      <ActionButtons positionClass="absolute top-1/2 -translate-y-1/2 right-3" onEdit={() => openJsonModal(idx)} onDelete={() => deleteJsonItem(idx)} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 🔒 Modal 1: ฟอร์มจัดการสินค้า (สำหรับแอดมิน) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {canManageShop && showProductForm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowProductForm(false)} />
            <motion.form onSubmit={saveProduct} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl z-10">
              
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-black text-slate-900">{productForm.id ? '✏️ แก้ไขข้อมูลสินค้า' : '✨ เพิ่มสินค้าใหม่'}</h3>
                <button type="button" onClick={() => setShowProductForm(false)} className="text-slate-400 hover:text-rose-600 bg-slate-50 w-8 h-8 rounded-full cursor-pointer flex justify-center items-center">✕</button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อสินค้า *</label>
                  <input name="name" required value={productForm.name} onChange={handleProductChange} className="w-full p-3 border border-slate-200 rounded-xl text-sm" placeholder="เช่น เสื้อช็อป BME" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ราคา (บาท) *</label>
                  <input type="number" required name="price" value={productForm.price} onChange={handleProductChange} className="w-full p-3 border border-slate-200 rounded-xl text-sm" placeholder="เช่น 250" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">สถานะ</label>
                  <select name="status" value={productForm.status} onChange={handleProductChange} className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white cursor-pointer">
                    <option value="open">เปิดการขาย</option>
                    <option value="closed">ปิดการขาย</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">หมวดหมู่</label>
                  <select name="category" value={productForm.category} onChange={handleProductChange} className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white cursor-pointer">
                    {settings.categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ป้ายกำกับพิเศษ (สีแดงมุมการ์ด)</label>
                  <select name="badge" value={productForm.badge} onChange={handleProductChange} className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white cursor-pointer">
                    {BADGES.map((b) => <option key={b} value={b}>{b || '-- ไม่มีป้าย --'}</option>)}
                  </select>
                </div>
                
                <div className="md:col-span-2 border border-slate-200 p-4 rounded-xl bg-slate-50 mt-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-2">อัปโหลดรูปภาพสินค้า (แนะนำ 1:1)</label>
                  <input type="file" accept="image/*" onChange={e => setUploadFile(e.target.files[0])} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 cursor-pointer" />
                  <div className="mt-3">
                    <label className="text-[11px] font-bold text-slate-600">หรือวางลิงก์รูปภาพ (Google Drive URL)</label>
                    <input name="image_url" value={productForm.image_url} onChange={handleProductChange} placeholder="https://..." className="w-full mt-1 p-3 border border-slate-200 rounded-xl text-sm bg-white" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ระยะเวลาการขาย (แสดงให้ลูกค้าเห็น)</label>
                  <input name="sale_period" value={productForm.sale_period} onChange={handleProductChange} placeholder="เช่น 1 - 31 ส.ค. 69" className="w-full p-3 border border-slate-200 rounded-xl text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ลิงก์สำหรับสั่งซื้อ (Google Form, Line Shop ฯลฯ)</label>
                  <input name="buy_url" type="url" value={productForm.buy_url} onChange={handleProductChange} placeholder="วางลิงก์หน้าสั่งซื้อ" className="w-full p-3 border border-slate-200 rounded-xl text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">รายละเอียดสินค้าเพิ่มเติม</label>
                  <textarea name="description" rows="3" value={productForm.description} onChange={handleProductChange} className="w-full p-3 border border-slate-200 rounded-xl text-sm" placeholder="ไซส์ สี หรือรายละเอียดจัดส่ง..." />
                </div>
                
                <div className="md:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer w-full">
                    <input type="checkbox" checked={productForm.is_visible} onChange={(e) => setProductForm((p) => ({ ...p, is_visible: e.target.checked }))} className="w-5 h-5 rounded text-purple-600 cursor-pointer" />
                    <span className="text-sm font-bold text-slate-700">แสดงสินค้านี้บนเว็บ <span className="text-xs text-slate-400 font-normal">(ถ้าเอาติ๊กออก ลูกค้าจะไม่เห็นสินค้านี้)</span></span>
                  </label>
                </div>
                {formError && <p className="md:col-span-2 text-rose-600 font-bold text-sm bg-rose-50 p-2 rounded-lg text-center">{formError}</p>}
              </div>

              <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
                <button type="button" onClick={() => setShowProductForm(false)} className="px-5 py-2.5 rounded-full text-slate-600 font-bold bg-slate-200 hover:bg-slate-300 text-sm transition-colors cursor-pointer">ยกเลิก</button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md text-sm transition-colors cursor-pointer">{submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 🔒 Modal 2: ฟอร์มตั้งค่าหน้าเว็บแบบแยกส่วน (Text Settings) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {canManageShop && showSettingsForm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowSettingsForm(false)} />
            <motion.form
              onSubmit={saveSettings}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 bg-white w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden rounded-[2rem] shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center p-5 border-b border-slate-100 shrink-0">
                <h3 className="text-lg font-black text-slate-900">
                  {settingsModalType === 'header' ? '✏️ แก้ไขข้อความส่วนหัว' :
                   settingsModalType === 'categories' ? '✏️ ตั้งค่าหมวดหมู่สินค้า' :
                   settingsModalType === 'steps' ? '✏️ แก้ไขขั้นตอนสั่งซื้อ' : 'ตั้งค่า'}
                </h3>
                <button type="button" onClick={() => setShowSettingsForm(false)} className="text-slate-400 hover:text-rose-600 bg-slate-50 w-8 h-8 rounded-full flex justify-center items-center cursor-pointer">✕</button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {settingsModalType === 'header' && (
                  <>
                    <div><label className="block text-[11px] font-bold text-slate-700 mb-1">หัวข้อหลักบนสุด (H1)</label><input value={settingsForm.page_title} onChange={(e) => setSettingsForm(s => ({ ...s, page_title: e.target.value }))} className="w-full p-3 border border-slate-200 rounded-xl text-sm" /></div>
                    <div><label className="block text-[11px] font-bold text-slate-700 mb-1">คำอธิบายใต้หัวข้อหลัก</label><textarea rows="3" value={settingsForm.page_subtitle} onChange={(e) => setSettingsForm(s => ({ ...s, page_subtitle: e.target.value }))} className="w-full p-3 border border-slate-200 rounded-xl text-sm whitespace-pre-line" /></div>
                  </>
                )}

                {settingsModalType === 'categories' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">พิมพ์หมวดหมู่สินค้า (คั่นแต่ละชื่อด้วยลูกน้ำ ",")</label>
                    <textarea rows="4" value={settingsForm.categoriesText} onChange={(e) => setSettingsForm(s => ({ ...s, categoriesText: e.target.value }))} className="w-full p-3 border border-slate-200 rounded-xl text-sm" placeholder="เสื้อ & แฟชั่น, แก้ว & ขวดน้ำ, เครื่องเขียน, ของที่ระลึก, อื่นๆ" />
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">💡 หมายเหตุ: หากต้องการให้การ์ดมีไอคอนสีสวยๆ ควรตั้งชื่อหมวดหมู่ตามนี้: เสื้อ & แฟชั่น, แก้ว & ขวดน้ำ, เครื่องเขียน, ของที่ระลึก, อื่นๆ</p>
                  </div>
                )}

                {settingsModalType === 'steps' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">ขั้นตอนการสั่งซื้อ (ขึ้นบรรทัดใหม่ = ขั้นตอนใหม่)</label>
                    <textarea rows="6" value={settingsForm.orderStepsText} onChange={(e) => setSettingsForm(s => ({ ...s, orderStepsText: e.target.value }))} className="w-full p-3 border border-slate-200 rounded-xl text-sm whitespace-pre-line" placeholder="ขั้นตอนที่ 1...&#10;ขั้นตอนที่ 2..." />
                  </div>
                )}
              </div>

              <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
                <button type="button" onClick={() => setShowSettingsForm(false)} className="px-5 py-2.5 rounded-full text-slate-600 font-bold bg-slate-200 hover:bg-slate-300 text-sm cursor-pointer transition-colors">ยกเลิก</button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md text-sm cursor-pointer transition-colors">{submitting ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 🔒 Modal 3: ฟอร์มจัดการช่องทางโซเชียล */}
      {/* ========================================================= */}
      <AnimatePresence>
      {canManageShop && jsonModalState.isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setJsonModalState({ isOpen: false, field: '', index: -1, data: {} })} />
          <motion.form onSubmit={saveJsonItem} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2rem] w-full max-w-md flex flex-col shadow-2xl relative z-10">
            
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-extrabold text-slate-900">
                {jsonModalState.index >= 0 ? '✏️ แก้ไขช่องทางติดต่อ' : '✨ เพิ่มช่องทางติดต่อ'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อช่องทาง (เช่น Facebook)</label><input required className="w-full p-3 border border-slate-200 rounded-xl text-sm" value={jsonModalState.data.label || ''} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, label: e.target.value}}))} placeholder="ชื่อแพลตฟอร์ม" /></div>
              <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อเพจ / ชื่อผู้ใช้ (เช่น @bme.kmutnb)</label><input required className="w-full p-3 border border-slate-200 rounded-xl text-sm" value={jsonModalState.data.value || ''} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, value: e.target.value}}))} placeholder="ไอดีหรือชื่อเพจ" /></div>
              <div><label className="block text-[11px] font-bold text-slate-700 mb-1">ลิงก์ URL ปลายทาง</label><input required type="url" className="w-full p-3 border border-slate-200 rounded-xl text-sm" value={jsonModalState.data.href || ''} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, href: e.target.value}}))} placeholder="https://..." /></div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">สีโลโก้และพื้นหลัง</label>
                <select className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white cursor-pointer" value={jsonModalState.data.tone || 'bg-slate-700'} onChange={e => setJsonModalState(prev => ({...prev, data: {...prev.data, tone: e.target.value}}))}>
                  {SOCIAL_TONES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
            
            <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0 rounded-b-[2rem]">
              <button type="button" onClick={() => setJsonModalState({ isOpen: false, field: '', index: -1, data: {} })} className="px-5 py-2.5 rounded-full text-slate-600 font-bold bg-slate-200 hover:bg-slate-300 text-sm cursor-pointer transition-colors">ยกเลิก</button>
              <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md text-sm cursor-pointer transition-colors">{submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</button>
            </div>
          </motion.form>
        </div>
      )}
      </AnimatePresence>

    </div>
  );
}