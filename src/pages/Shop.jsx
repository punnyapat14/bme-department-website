import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground, SectionBanner } from '../components/ThemeElements';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from "../supabaseClient";

// ==========================================
// 📌 ค่าคงที่สำหรับสไตล์ (สไตล์ของหมวดหมู่หลัก)
// ==========================================
const CAT_STYLE = {
  'เสื้อ & แฟชั่น': { emoji: '👕', grad: 'from-purple-400 to-indigo-400', chip: 'bg-purple-50 text-purple-700 border-purple-200' },
  'แก้ว & ขวดน้ำ': { emoji: '🥤', grad: 'from-rose-400 to-orange-300', chip: 'bg-rose-50 text-rose-700 border-rose-200' },
  'เครื่องเขียน': { emoji: '✏️', grad: 'from-amber-300 to-yellow-300', chip: 'bg-amber-50 text-amber-700 border-amber-200' },
  'ของที่ระลึก': { emoji: '🎁', grad: 'from-teal-400 to-emerald-300', chip: 'bg-teal-50 text-teal-700 border-teal-200' },
  'อื่นๆ': { emoji: '✨', grad: 'from-sky-400 to-blue-300', chip: 'bg-sky-50 text-sky-700 border-sky-200' },
};

const BADGES = ['', 'ใหม่', 'ขายดี', 'พรีออเดอร์', 'จำนวนจำกัด'];

const EMPTY_PRODUCT_FORM = {
  id: '',
  name: '',
  price: '',
  category: '', // จะถูกเซ็ตค่าเริ่มต้นตอนเปิดฟอร์ม
  sale_period: '',
  status: 'open',
  badge: '',
  description: '',
  image_url: '',
  buy_url: '',
  is_visible: true
};

const formatPrice = (n) => {
  if (n === '' || n === null || n === undefined) return '-';
  const num = Number(String(n).replace(/,/g, ''));
  return Number.isNaN(num) ? String(n) : `฿${num.toLocaleString('th-TH')}`;
};

// 📌 ฟังก์ชันแปลงลิงก์ Google Drive
const formatImageUrl = (url) => {
  if (!url) return '';
  const trimmed = String(url).trim();
  const driveMatch =
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1000`;
  }
  return trimmed;
};

// ==========================================
// 📌 Component: รูปสินค้า
// ==========================================
const ProductVisual = ({ product, className = 'h-48' }) => {
  const style = CAT_STYLE[product.category] || CAT_STYLE['อื่นๆ'];
  const imgSrc = formatImageUrl(product.image_url);

  return imgSrc ? (
    <img
      src={imgSrc}
      alt={product.name}
      referrerPolicy="no-referrer"
      className={`w-full ${className} object-cover`}
      onError={(e) => { e.currentTarget.style.display = 'none'; }}
    />
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

  // 📦 State ของข้อมูลร้านค้า
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({
    page_title: 'กำลังโหลด...',
    page_subtitle: '',
    categories: ['อื่นๆ'],
    order_steps: [],
    social_links: []
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('ทั้งหมด');

  // ⚙️ State จัดการสินค้า
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);

  // ⚙️ State จัดการตั้งค่าร้านค้า (แอดมิน)
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [settingsForm, setSettingsForm] = useState({});

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 🔒 ตรวจสอบสิทธิ์
  const canManageShop = Boolean(
    user && (
      ['admin', 'faculty', 'teacher', 'staff', 'instructor'].includes(String(user.role || '').toLowerCase()) ||
      user.isAdmin === true ||
      String(user.email || '').endsWith('@sci.kmutnb.ac.th') ||
      String(user.email || '').toLowerCase() === 'bme.kmutnb.th@gmail.com'
    )
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchShopData();
  }, []);

  // 📌 ดึงข้อมูลจาก Supabase
  const fetchShopData = async () => {
    setLoading(true);
    try {
      // ดึงการตั้งค่า
      const { data: settingsData, error: settingsError } = await supabase
        .from('shop_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (!settingsError && settingsData) {
        setSettings(settingsData);
      }

      // ดึงสินค้า
      const { data: productsData, error: productsError } = await supabase
        .from('shop_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (err) {
      console.error('Fetch shop error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- กรองสินค้า ----------
  const visibleProducts = useMemo(() => {
    return products.filter((p) => {
      if (!canManageShop && !p.is_visible) return false;
      const matchCat = activeCat === 'ทั้งหมด' || p.category === activeCat;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        String(p.name || '').toLowerCase().includes(q) ||
        String(p.description || '').toLowerCase().includes(q);
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
    setEditingId(null);
    setProductForm({ ...EMPTY_PRODUCT_FORM, category: settings.categories[0] || 'อื่นๆ' });
    setFormError('');
    setShowProductForm(true);
  };

  const openEditProduct = (p) => {
    setEditingId(p.id);
    setProductForm({
      id: p.id,
      name: p.name || '',
      price: String(p.price ?? ''),
      category: p.category || settings.categories[0],
      sale_period: p.sale_period || '',
      status: p.status,
      badge: p.badge || '',
      description: p.description || '',
      image_url: p.image_url || '',
      buy_url: p.buy_url || '',
      is_visible: Boolean(p.is_visible)
    });
    setFormError('');
    setShowProductForm(true);
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    if (!canManageShop) return;
    if (!productForm.name.trim()) return setFormError('กรุณากรอกชื่อสินค้า');
    if (productForm.price === '' || Number(productForm.price) < 0) return setFormError('กรุณากรอกราคาให้ถูกต้อง');

    const payload = {
      name: productForm.name.trim(),
      price: Number(productForm.price),
      category: productForm.category,
      sale_period: productForm.sale_period.trim(),
      status: productForm.status,
      badge: productForm.badge,
      description: productForm.description.trim(),
      image_url: productForm.image_url.trim(),
      buy_url: productForm.buy_url.trim(),
      is_visible: productForm.is_visible
    };

    setSubmitting(true);
    try {
      if (editingId) {
        const { error } = await supabase.from('shop_products').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('shop_products').insert([payload]);
        if (error) throw error;
      }
      setShowProductForm(false);
      fetchShopData();
    } catch (err) {
      console.error('Save product error:', err);
      setFormError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (id, name) => {
    if (!canManageShop) return;
    if (!window.confirm(`ยืนยันการลบ "${name}" ?\nข้อมูลจะถูกลบออกจากฐานข้อมูลถาวร`)) return;

    try {
      await supabase.from('shop_products').delete().eq('id', id);
      fetchShopData();
    } catch (err) {
      console.error('Delete error:', err);
      alert('ไม่สามารถลบสินค้าได้');
    }
  };

  // ==========================================
  // 📌 ฟังก์ชันจัดการตั้งค่าหน้าเว็บ (แอดมิน)
  // ==========================================
  const openSettings = () => {
    setSettingsForm({
      page_title: settings.page_title,
      page_subtitle: settings.page_subtitle,
      categoriesText: settings.categories.join(', '), // แปลง Array เป็น Text เพื่อให้แก้ไขง่าย
      orderStepsText: settings.order_steps.join('\n') // ขั้นตอนแยกด้วยการขึ้นบรรทัดใหม่
    });
    setFormError('');
    setShowSettingsForm(true);
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    if (!canManageShop) return;

    // แปลง Text กลับเป็น Array
    const catsArray = settingsForm.categoriesText.split(',').map(c => c.trim()).filter(Boolean);
    const stepsArray = settingsForm.orderStepsText.split('\n').map(s => s.trim()).filter(Boolean);

    const payload = {
      page_title: settingsForm.page_title,
      page_subtitle: settingsForm.page_subtitle,
      categories: catsArray,
      order_steps: stepsArray
    };

    setSubmitting(true);
    try {
      const { error } = await supabase.from('shop_settings').update(payload).eq('id', 1);
      if (error) throw error;
      
      setShowSettingsForm(false);
      fetchShopData(); // โหลดข้อมูลใหม่เพื่ออัปเดตหน้าเว็บ
    } catch (err) {
      console.error('Save settings error:', err);
      setFormError('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- สไตล์กลาง ----------
  const bentoGlass = 'rounded-[2.5rem] bg-white/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden';
  const inputClass = 'w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-300/60 transition-all font-medium text-slate-900';
  const labelClass = 'text-sm font-semibold text-slate-500';

  return (
    <div className="relative font-sans text-slate-900 bg-[#fdfcff] min-h-screen pt-16 pb-32">
      <AuroraBackground />

      <div className="relative z-10 max-w-[1250px] mx-auto px-4 md:px-6 pt-2">

        {/* ---------------- Header (ดึงจาก Settings) ---------------- */}
        <div className="text-center max-w-4xl mx-auto pt-2 pb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
            {settings.page_title}
          </h1>
          <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl whitespace-pre-line">
            {settings.page_subtitle}
          </p>

          {/* 🔒 ปุ่มเครื่องมือแอดมิน */}
          {canManageShop && (
            <div className="flex flex-wrap justify-center gap-3 mt-7">
              <button
                onClick={openCreateProduct}
                className="px-6 py-3 rounded-full text-sm font-bold text-white bg-slate-900 hover:bg-purple-700 shadow-md shadow-slate-900/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                + เพิ่มสินค้าใหม่
              </button>
              <button
                onClick={openSettings}
                className="px-6 py-3 rounded-full text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                ⚙️ ตั้งค่าข้อความบนเว็บ
              </button>
            </div>
          )}
        </div>

        {/* ---------------- แผงสรุปข้อมูลสำหรับแอดมิน ---------------- */}
        {canManageShop && (
          <div className={`p-6 md:p-8 mb-10 ${bentoGlass} border-purple-200`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-400 rounded-full"></span>
                  ระบบจัดการร้านค้า
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  ข้อมูลทั้งหมดเชื่อมต่อกับระบบฐานข้อมูล (Supabase) เรียลไทม์
                </p>
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

        {/* ---------------- Section 1: รายละเอียด ---------------- */}
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          <SectionBanner text="รายละเอียดร้านค้า" variant="website" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
            {[
              { icon: '📝', title: 'สั่งซื้อผ่านฟอร์มออนไลน์', desc: 'คลิกปุ่มสั่งซื้อที่รายการสินค้าเพื่อเข้าสู่หน้าสั่งซื้อ', tone: 'from-purple-50 to-indigo-50 border-purple-100' },
              { icon: '📦', title: 'รับสินค้าที่ภาควิชา / จัดส่ง', desc: 'เลือกรับสินค้าที่สาขา หรือเลือกบริการจัดส่ง', tone: 'from-rose-50 to-orange-50 border-rose-100' },
              { icon: '🎓', title: 'สนับสนุนกิจกรรมสาขา', desc: 'รายได้นำไปใช้จัดกิจกรรมนักศึกษาและเครือข่ายศิษย์เก่า', tone: 'from-teal-50 to-emerald-50 border-teal-100' },
            ].map((item) => (
              <div key={item.title} className={`rounded-[2rem] border bg-gradient-to-br ${item.tone} p-6 shadow-sm`}>
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-black text-slate-800 mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- Section 2: รายการสินค้า ---------------- */}
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          <SectionBanner text="รายการสินค้า" variant="exam" />

          {/* ค้นหา + หมวดหมู่ (ดึงจากฐานข้อมูล) */}
          <div className="max-w-xl mx-auto relative group mb-6 mt-8">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white/90 backdrop-blur-md shadow-sm rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base font-medium transition-all border border-slate-100"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {['ทั้งหมด', ...(settings.categories || [])].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 shadow-sm ${activeCat === cat ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-105' : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* กริดสินค้า */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="rounded-[2rem] bg-slate-100 h-96 animate-pulse" />
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🛍️</p>
              <p className="text-lg font-black text-slate-800">ไม่มีรายการสินค้า</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleProducts.map((p) => {
                const style = CAT_STYLE[p.category] || CAT_STYLE['อื่นๆ'];
                const isClosed = p.status === 'closed';

                return (
                  <motion.div
                    key={p.id}
                    layout
                    whileHover={{ y: -6 }}
                    className={`relative rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col ${!p.is_visible ? 'opacity-60 grayscale-[30%]' : ''}`}
                  >
                    <div className="relative">
                      <ProductVisual product={p} />
                      {p.badge && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[11px] font-black text-rose-600 shadow-sm">
                          {p.badge}
                        </span>
                      )}
                      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-extrabold shadow-sm ${isClosed ? 'bg-slate-900/85 text-white' : 'bg-emerald-500/95 text-white'}`}>
                        {isClosed ? 'ปิดการขาย' : 'เปิดการขาย'}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-2.5">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${style.chip}`}>
                          {p.category}
                        </span>
                        {!p.is_visible && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">ซ่อน</span>
                        )}
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
                            {isClosed ? 'ปิดการขาย' : 'ยังไม่มีลิงก์สั่งซื้อ'}
                          </button>
                        )}

                        {canManageShop && (
                          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                            <button onClick={() => openEditProduct(p)} className="py-2 rounded-lg text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100">แก้ไข</button>
                            <button onClick={() => deleteProduct(p.id, p.name)} className="py-2 rounded-lg text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100">ลบ</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ---------------- Section 3: วิธีสั่งซื้อ (ดึงจากฐานข้อมูล) ---------------- */}
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          <SectionBanner text="วิธีสั่งซื้อและติดต่อ" variant="social" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="rounded-[2rem] bg-slate-50/60 border border-slate-100 shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-400 rounded-full"></span> ขั้นตอนการสั่งซื้อ
              </h3>
              <ol className="space-y-4">
                {(settings.order_steps || []).map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-rose-400 text-white text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[2rem] bg-slate-50/60 border border-slate-100 shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-rose-400 rounded-full"></span> ช่องทางติดต่อ
              </h3>
              <div className="space-y-3">
                {(settings.social_links || []).map((c, idx) => (
                  <a key={idx} href={c.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200/70 shadow-sm hover:border-purple-300">
                    <span className={`w-9 h-9 rounded-full ${c.tone} text-white text-xs font-black flex items-center justify-center`}>{c.label[0]}</span>
                    <span>
                      <span className="block text-sm font-black text-slate-800">{c.label}</span>
                      <span className="block text-xs font-medium text-slate-500">{c.value}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 🔒 Modal: ฟอร์มจัดการสินค้า (สำหรับแอดมิน) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {canManageShop && showProductForm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowProductForm(false)} />
            <motion.form
              onSubmit={saveProduct}
              initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative z-10 bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
                <h3 className="text-lg font-black text-slate-900">{editingId ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}</h3>
                <button type="button" onClick={() => setShowProductForm(false)} className="text-slate-400 hover:text-slate-700 bg-slate-50 p-2 rounded-full">✕</button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="md:col-span-2 space-y-1">
                  <label className={labelClass}>ชื่อสินค้า *</label>
                  <input name="name" required value={productForm.name} onChange={handleProductChange} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>ราคา (บาท) *</label>
                  <input type="number" required name="price" value={productForm.price} onChange={handleProductChange} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>สถานะ</label>
                  <select name="status" value={productForm.status} onChange={handleProductChange} className={inputClass}>
                    <option value="open">เปิดการขาย</option>
                    <option value="closed">ปิดการขาย</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>หมวดหมู่</label>
                  <select name="category" value={productForm.category} onChange={handleProductChange} className={inputClass}>
                    {settings.categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>ป้ายกำกับพิเศษ</label>
                  <select name="badge" value={productForm.badge} onChange={handleProductChange} className={inputClass}>
                    {BADGES.map((b) => <option key={b} value={b}>{b || 'ไม่มีป้าย'}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className={labelClass}>ลิงก์รูปภาพ (Google Drive หรือ Image URL)</label>
                  <input name="image_url" value={productForm.image_url} onChange={handleProductChange} className={inputClass} />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className={labelClass}>ระยะเวลาการขาย</label>
                  <input name="sale_period" value={productForm.sale_period} onChange={handleProductChange} className={inputClass} />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className={labelClass}>ลิงก์สำหรับสั่งซื้อ (Google Form ฯลฯ)</label>
                  <input name="buy_url" value={productForm.buy_url} onChange={handleProductChange} className={inputClass} />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className={labelClass}>รายละเอียด</label>
                  <textarea name="description" rows="3" value={productForm.description} onChange={handleProductChange} className={inputClass} />
                </div>
                <label className="md:col-span-2 flex items-center gap-3">
                  <input type="checkbox" checked={productForm.is_visible} onChange={(e) => setProductForm((p) => ({ ...p, is_visible: e.target.checked }))} className="w-5 h-5" />
                  <span className="text-sm font-bold text-slate-700">แสดงสินค้านี้บนเว็บ</span>
                </label>
                {formError && <p className="md:col-span-2 text-rose-600 font-bold">{formError}</p>}
              </div>
              <div className="p-5 border-t border-slate-100 flex justify-end gap-2 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setShowProductForm(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 bg-slate-100">ยกเลิก</button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-purple-600">บันทึก</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 🔒 Modal: ฟอร์มตั้งค่าหน้าเว็บ (สำหรับแอดมิน) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {canManageShop && showSettingsForm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowSettingsForm(false)} />
            <motion.form
              onSubmit={saveSettings}
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="relative z-10 bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
                <h3 className="text-lg font-black text-slate-900">⚙️ ตั้งค่าข้อความบนหน้าเว็บ</h3>
                <button type="button" onClick={() => setShowSettingsForm(false)} className="text-slate-400 hover:text-slate-700 bg-slate-50 p-2 rounded-full">✕</button>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-1">
                  <label className={labelClass}>หัวข้อหลัก (H1)</label>
                  <input value={settingsForm.page_title} onChange={(e) => setSettingsForm(s => ({ ...s, page_title: e.target.value }))} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>คำอธิบายใต้หัวข้อหลัก</label>
                  <textarea rows="2" value={settingsForm.page_subtitle} onChange={(e) => setSettingsForm(s => ({ ...s, page_subtitle: e.target.value }))} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>หมวดหมู่สินค้า (คั่นด้วยลูกน้ำ ",")</label>
                  <textarea rows="2" value={settingsForm.categoriesText} onChange={(e) => setSettingsForm(s => ({ ...s, categoriesText: e.target.value }))} className={inputClass} placeholder="เสื้อ, แก้ว, ของที่ระลึก" />
                  <p className="text-[11px] text-slate-400 mt-1">* หากต้องการให้มีไอคอนสีสวยๆ ควรใช้ชื่อหมวดหมู่ให้ตรงกับโค้ดที่มีอยู่</p>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>ขั้นตอนการสั่งซื้อ (1 บรรทัด = 1 ขั้นตอน)</label>
                  <textarea rows="4" value={settingsForm.orderStepsText} onChange={(e) => setSettingsForm(s => ({ ...s, orderStepsText: e.target.value }))} className={inputClass} placeholder="ขั้นตอนที่ 1...&#10;ขั้นตอนที่ 2..." />
                </div>
                {formError && <p className="text-rose-600 font-bold text-sm">{formError}</p>}
              </div>

              <div className="p-5 border-t border-slate-100 flex justify-end gap-2 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setShowSettingsForm(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 bg-slate-100">ยกเลิก</button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900">บันทึกการตั้งค่า</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}