import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground, SectionBanner } from '../components/ThemeElements';
import { useAuth } from '../contexts/AuthContext';

// ==========================================
// 📌 ตั้งค่า URL ของ Google Apps Script Web App
// ==========================================
const GOOGLE_SHEET_API_URL = import.meta.env.VITE_SHOP_API_URL || 'https://script.google.com/macros/s/AKfycbxMFtshOEkP3BK7NViM9Os6TkPUqWeoHm0TmF_zxBejVZ7GMp7HQnXsVK2Bmqm8Yuc/exec';

// ==========================================
// 📌 ค่าคงที่และสไตล์หมวดหมู่
// ==========================================
const CATEGORIES = ['เสื้อ & แฟชั่น', 'แก้ว & ขวดน้ำ', 'เครื่องเขียน', 'ของที่ระลึก', 'อื่นๆ'];

const CAT_STYLE = {
  'เสื้อ & แฟชั่น': { emoji: '👕', grad: 'from-purple-400 to-indigo-400', chip: 'bg-purple-50 text-purple-700 border-purple-200' },
  'แก้ว & ขวดน้ำ': { emoji: '🥤', grad: 'from-rose-400 to-orange-300', chip: 'bg-rose-50 text-rose-700 border-rose-200' },
  'เครื่องเขียน': { emoji: '✏️', grad: 'from-amber-300 to-yellow-300', chip: 'bg-amber-50 text-amber-700 border-amber-200' },
  'ของที่ระลึก': { emoji: '🎁', grad: 'from-teal-400 to-emerald-300', chip: 'bg-teal-50 text-teal-700 border-teal-200' },
  'อื่นๆ': { emoji: '✨', grad: 'from-sky-400 to-blue-300', chip: 'bg-sky-50 text-sky-700 border-sky-200' },
};

const BADGES = ['', 'ใหม่', 'ขายดี', 'พรีออเดอร์', 'จำนวนจำกัด'];

const EMPTY_FORM = {
  id: '',
  name: '',
  price: '',
  category: CATEGORIES[0],
  salePeriod: '',
  status: 'open', // 'open' = เปิดการขาย, 'closed' = ปิดการขาย
  badge: '',
  desc: '',
  image: '',
  buyUrl: '',
  visible: true
};

const formatPrice = (n) => {
  if (n === '' || n === null || n === undefined) return '-';
  const num = Number(String(n).replace(/,/g, ''));
  return Number.isNaN(num) ? String(n) : `฿${num.toLocaleString('th-TH')}`;
};

// 📌 ฟังก์ชันแปลงลิงก์ Google Drive ปกติ ให้เป็นลิงก์แสดงรูปภาพโดยตรง
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
// 📌 Component: รูปสินค้า (ถ้าไม่มีรูปจะใช้ไล่สี + อีโมจิตามหมวด)
// ==========================================
const ProductVisual = ({ product, className = 'h-48' }) => {
  const style = CAT_STYLE[product.category] || CAT_STYLE['อื่นๆ'];
  const imgSrc = formatImageUrl(product.image);

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

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('ทั้งหมด');

  // --- โหมดแอดมิน/อาจารย์ ---
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 🔒 ตรวจสอบสิทธิ์: เฉพาะแอดมินหรืออาจารย์ที่ล็อกอินแล้วเท่านั้น
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

  // 📌 ดึงข้อมูลสินค้าจาก Google Sheet (แท็บ Shop)
  const fetchShopData = async () => {
    try {
      setLoading(true);
      setError('');

      if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.includes('ใส่_WEB_APP_URL')) {
        setError('กรุณาตั้งค่า Web App URL ของ Google Sheet ในไฟล์โค้ดก่อนใช้งาน');
        setLoading(false);
        return;
      }

      const sep = GOOGLE_SHEET_API_URL.includes('?') ? '&' : '?';
      const response = await fetch(`${GOOGLE_SHEET_API_URL}${sep}sheet=Shop`);
      if (!response.ok) throw new Error('ไม่สามารถเชื่อมต่อฐานข้อมูลได้');

      const result = await response.json();
      const rows = Array.isArray(result) ? result : (result.data || []);

      // แปลงค่า boolean ของ visible ให้ถูกต้อง
      const normalized = rows.map((r) => ({
        ...r,
        visible: String(r.visible).toLowerCase() !== 'false' && String(r.visible) !== '0',
        status: String(r.status || 'open').toLowerCase() === 'closed' ? 'closed' : 'open'
      }));
      setProducts(normalized);
    } catch (err) {
      console.error('Fetch shop error:', err);
      setError('ไม่สามารถโหลดข้อมูลร้านค้าได้ในขณะนี้');
    } finally {
      setLoading(false);
    }
  };

  // ---------- กรองสินค้าที่แสดงผล ----------
  const visibleProducts = useMemo(() => {
    return products.filter((p) => {
      if (!canManageShop && !p.visible) return false;
      const matchCat = activeCat === 'ทั้งหมด' || p.category === activeCat;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        String(p.name || '').toLowerCase().includes(q) ||
        String(p.desc || '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, canManageShop, activeCat, search]);

  const stats = useMemo(() => ({
    total: products.length,
    open: products.filter((p) => p.status === 'open').length,
    closed: products.filter((p) => p.status === 'closed').length,
  }), [products]);

  // ---------- แอดมิน: จัดการสินค้า ----------
  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      id: p.id || '',
      name: p.name || '',
      price: String(p.price ?? ''),
      category: p.category || CATEGORIES[0],
      salePeriod: p.salePeriod || '',
      status: p.status === 'closed' ? 'closed' : 'open',
      badge: p.badge || '',
      desc: p.desc || '',
      image: p.image || '',
      buyUrl: p.buyUrl || '',
      visible: Boolean(p.visible)
    });
    setFormError('');
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    if (!canManageShop) return;
    if (!form.name.trim()) return setFormError('กรุณากรอกชื่อสินค้า');
    if (form.price === '' || Number(form.price) < 0) return setFormError('กรุณากรอกราคาให้ถูกต้อง');

    const payload = {
      ...form,
      id: editingId ? editingId : Date.now().toString(),
      name: form.name.trim(),
      desc: form.desc.trim(),
      salePeriod: form.salePeriod.trim(),
      image: form.image.trim(),
      buyUrl: form.buyUrl.trim(),
      price: Number(form.price),
      visible: form.visible ? 'TRUE' : 'FALSE'
    };

    try {
      setSubmitting(true);
      await fetch(GOOGLE_SHEET_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          sheet: 'Shop',
          action: editingId ? 'update' : 'create',
          data: payload
        })
      });

      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      await fetchShopData();
    } catch (err) {
      console.error('Save shop error:', err);
      setFormError('เกิดข้อผิดพลาดในการบันทึกข้อมูลลง Google Sheet');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (p) => {
    if (!canManageShop) return;
    if (!window.confirm(`ยืนยันการลบ "${p.name}" ออกจากฐานข้อมูลร้านค้า?`)) return;

    try {
      await fetch(GOOGLE_SHEET_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          sheet: 'Shop',
          action: 'delete',
          id: p.id
        })
      });
      await fetchShopData();
    } catch (err) {
      console.error('Delete product error:', err);
      alert('ไม่สามารถลบสินค้าได้');
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

        {/* ---------------- Header ---------------- */}
        <div className="text-center max-w-4xl mx-auto pt-2 pb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-rose-600 drop-shadow-sm">
            ร้านค้าสาขาวิชา BME
          </h1>
          <p className="font-medium text-slate-600 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
            เสื้อ แก้วน้ำ เครื่องเขียน และของที่ระลึกจากสาขาวิศวกรรมชีวการแพทย์ รายได้นำไปสนับสนุนกิจกรรมของสาขา
          </p>

          {/* 🔒 ปุ่มเพิ่มสินค้าใหม่ (แสดงเฉพาะแอดมิน/อาจารย์ที่ล็อกอินแล้ว) */}
          {canManageShop && (
            <div className="flex justify-center mt-7">
              <button
                onClick={openCreate}
                className="px-6 py-3 rounded-full text-sm font-bold text-white bg-slate-900 hover:bg-purple-700 shadow-md shadow-slate-900/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                + เพิ่มสินค้าลงฐานข้อมูล
              </button>
            </div>
          )}
        </div>

        {/* ---------------- แผงสรุปข้อมูลสำหรับแอดมิน/อาจารย์ ---------------- */}
        {canManageShop && (
          <div className={`p-6 md:p-8 mb-10 ${bentoGlass} border-purple-200`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-400 rounded-full"></span>
                  ระบบจัดการร้านค้า (สำหรับแอดมิน / อาจารย์)
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  ข้อมูลเชื่อมตรงกับ Google Sheet แท็บ Shop สามารถเพิ่ม แก้ไขสถานะเปิด/ปิดการขาย หรือใส่ลิงก์ Google Form ได้ทันที
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

        {/* ---------------- สถานะ Error ---------------- */}
        {!loading && error && (
          <div className="max-w-2xl mx-auto mb-10 p-6 rounded-3xl bg-amber-50 border border-amber-200 text-center">
            <p className="font-bold text-amber-800">{error}</p>
          </div>
        )}

        {/* ---------------- Section 1: ข้อมูลร้าน ---------------- */}
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          <SectionBanner text="รายละเอียดร้านค้า" variant="website" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
            {[
              { icon: '📝', title: 'สั่งซื้อผ่านฟอร์มออนไลน์', desc: 'คลิกปุ่มสั่งซื้อที่รายการสินค้าเพื่อเข้าสู่หน้า Google Form หรือเว็บไซต์สั่งซื้อของแต่ละโครงการ', tone: 'from-purple-50 to-indigo-50 border-purple-100' },
              { icon: '📦', title: 'รับสินค้าที่ภาควิชา / จัดส่ง', desc: 'เลือกรับสินค้าที่ห้องสาขาวิชา หรือเลือกบริการจัดส่งตามเงื่อนไขที่ระบุในฟอร์มสั่งซื้อ', tone: 'from-rose-50 to-orange-50 border-rose-100' },
              { icon: '🎓', title: 'สนับสนุนกิจกรรมสาขา', desc: 'รายได้หลังหักต้นทุนนำไปใช้จัดกิจกรรมนักศึกษา ค่ายอาสา และเครือข่ายศิษย์เก่า BME', tone: 'from-teal-50 to-emerald-50 border-teal-100' },
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

          {/* ค้นหา + หมวดหมู่ */}
          <div className="max-w-xl mx-auto relative group mb-6 mt-8">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              placeholder="ค้นหาสินค้า เช่น เสื้อ, แก้วน้ำ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white/90 backdrop-blur-md shadow-sm rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base font-medium transition-all border border-slate-100"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {['ทั้งหมด', ...CATEGORIES].map((cat) => (
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
              <p className="text-lg font-black text-slate-800">ยังไม่มีรายการสินค้าในหมวดหมู่นี้</p>
              <p className="text-sm text-slate-500 font-medium mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleProducts.map((p, idx) => {
                const style = CAT_STYLE[p.category] || CAT_STYLE['อื่นๆ'];
                const isClosed = p.status === 'closed';

                return (
                  <motion.div
                    key={p.id || idx}
                    layout
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.25 }}
                    className={`relative rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col ${!p.visible ? 'opacity-60' : ''}`}
                  >
                    <div className="relative">
                      <ProductVisual product={p} />

                      {/* ป้ายกำกับ (Badge) */}
                      {p.badge && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[11px] font-black text-rose-600 shadow-sm">
                          {p.badge}
                        </span>
                      )}

                      {/* ป้ายสถานะ เปิดการขาย / ปิดการขาย */}
                      <span
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-extrabold shadow-sm ${
                          isClosed
                            ? 'bg-slate-900/85 text-white'
                            : 'bg-emerald-500/95 text-white'
                        }`}
                      >
                        {isClosed ? 'ปิดการขาย' : 'เปิดการขาย'}
                      </span>

                      {isClosed && (
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                          <span className="px-5 py-2 rounded-full bg-white text-sm font-black text-slate-800 shadow-md">
                            ปิดการขายแล้ว
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-2.5">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${style.chip}`}>
                          {p.category}
                        </span>
                        {!p.visible && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            ซ่อนจากหน้าเว็บ
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-black text-slate-800 leading-snug mb-1.5">{p.name}</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3 mb-3">{p.desc}</p>

                      {/* วัน-เวลาที่เปิดขาย */}
                      {p.salePeriod && (
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl mb-4 border border-slate-100">
                          <svg className="w-3.5 h-3.5 text-purple-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          <span className="truncate">{p.salePeriod}</span>
                        </div>
                      )}

                      <div className="mt-auto">
                        <div className="flex items-end justify-between mb-3">
                          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-rose-500">
                            {formatPrice(p.price)}
                          </p>
                          <p className={`text-[11px] font-bold ${isClosed ? 'text-rose-500' : 'text-emerald-600'}`}>
                            {isClosed ? 'สิ้นสุดระยะเวลา' : 'พร้อมสั่งซื้อ'}
                          </p>
                        </div>

                        {/* ปุ่มกดลิงก์ไปยังหน้าสั่งซื้อ (Google Form / Google Sites) */}
                        {!isClosed && p.buyUrl ? (
                          <a
                            href={p.buyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-rose-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>ไปที่หน้าสั่งซื้อสินค้า</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </a>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-300 cursor-not-allowed"
                          >
                            {isClosed ? 'ปิดการขาย' : 'ยังไม่มีลิงก์สั่งซื้อ'}
                          </button>
                        )}

                        {/* ปุ่มจัดการเฉพาะแอดมิน/อาจารย์ */}
                        {canManageShop && (
                          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                            <button
                              onClick={() => openEdit(p)}
                              className="py-2 rounded-lg text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100"
                            >
                              แก้ไขข้อมูล
                            </button>
                            <button
                              onClick={() => deleteProduct(p)}
                              className="py-2 rounded-lg text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100"
                            >
                              ลบ
                            </button>
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

        {/* ---------------- Section 3: วิธีสั่งซื้อ / ติดต่อ ---------------- */}
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          <SectionBanner text="วิธีสั่งซื้อและติดต่อ" variant="social" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="rounded-[2rem] bg-slate-50/60 border border-slate-100 shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-400 rounded-full"></span> ขั้นตอนการสั่งซื้อ
              </h3>
              <ol className="space-y-4">
                {[
                  'เลือกสินค้าที่สถานะ "เปิดการขาย" แล้วกดปุ่ม "ไปที่หน้าสั่งซื้อสินค้า"',
                  'ระบบจะพาท่านไปยังหน้าฟอร์มสั่งซื้อ (Google Form หรือ Google Sites ของโครงการนั้น)',
                  'กรอกรายละเอียด ขนาด/ไซซ์ จำนวน และแนบหลักฐานการโอนเงินในฟอร์ม',
                  'รอรับการยืนยันและนัดรับสินค้าที่ภาควิชา หรือจัดส่งตามที่ระบุไว้',
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-rose-400 text-white text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[2rem] bg-slate-50/60 border border-slate-100 shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-rose-400 rounded-full"></span> ช่องทางติดต่อสอบถามร้านค้า
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Facebook', value: 'facebook.com/bme.kmutnb', href: 'https://www.facebook.com/bme.kmutnb', tone: 'bg-[#1877F2]' },
                  { label: 'Instagram', value: '@bme.kmutnb', href: 'https://www.instagram.com/bme.kmutnb/', tone: 'bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-500' },
                ].map((c) => (
                  <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200/70 shadow-sm hover:shadow-md hover:border-purple-300 transition-all">
                    <span className={`w-9 h-9 rounded-full ${c.tone} text-white text-xs font-black flex items-center justify-center`}>{c.label[0]}</span>
                    <span>
                      <span className="block text-sm font-black text-slate-800">{c.label}</span>
                      <span className="block text-xs font-medium text-slate-500">{c.value}</span>
                    </span>
                  </a>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-4 italic">
                หากมีข้อสงสัยเกี่ยวกับสถานะคำสั่งซื้อหรือรอบการจัดส่ง สามารถทักสอบถามผ่านเพจสาขาวิชาได้โดยตรง
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- 🔒 ฟอร์มเพิ่ม/แก้ไขสินค้า (เฉพาะแอดมิน/อาจารย์) ---------------- */}
      <AnimatePresence>
        {canManageShop && showForm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowForm(false)} />
            <motion.form
              onSubmit={saveProduct}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative z-10 bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
                <h3 className="text-lg font-black text-slate-900">{editingId ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่ลง Google Sheet'}</h3>
                <button type="button" onClick={() => setShowForm(false)} aria-label="ปิดฟอร์ม" className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-200 p-2 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* ตัวอย่างรูปและช่องวางลิงก์รูปภาพ */}
                <div className="md:col-span-2 space-y-2">
                  <label className={labelClass}>ลิงก์รูปสินค้า (รองรับลิงก์แชร์จาก Google Drive หรือ Image URL)</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                      <ProductVisual product={{ ...form, name: form.name || 'ตัวอย่าง' }} className="h-28" />
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      <input
                        name="image"
                        value={form.image}
                        onChange={handleFormChange}
                        className={inputClass}
                        placeholder="วางลิงก์รูปจาก Google Drive หรือ https://..."
                      />
                      {form.image && (
                        <button type="button" onClick={() => setForm((prev) => ({ ...prev, image: '' }))} className="text-xs font-bold text-rose-500 hover:text-rose-700">
                          ลบลิงก์รูป (ใช้ภาพไอคอนตามหมวดหมู่แทน)
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className={labelClass}>ชื่อสินค้า *</label>
                  <input name="name" required value={form.name} onChange={handleFormChange} className={inputClass} placeholder="เช่น เสื้อโปโล BME Alumni" />
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>ราคา (บาท) *</label>
                  <input type="number" min="0" required name="price" value={form.price} onChange={handleFormChange} className={inputClass} placeholder="เช่น 390" />
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>สถานะการขาย</label>
                  <select name="status" value={form.status} onChange={handleFormChange} className={inputClass}>
                    <option value="open">เปิดการขาย (ขายอยู่)</option>
                    <option value="closed">ปิดการขาย</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>หมวดหมู่</label>
                  <select name="category" value={form.category} onChange={handleFormChange} className={inputClass}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>ป้ายกำกับพิเศษ</label>
                  <select name="badge" value={form.badge} onChange={handleFormChange} className={inputClass}>
                    {BADGES.map((b) => <option key={b} value={b}>{b || 'ไม่มีป้าย'}</option>)}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className={labelClass}>ช่วงวัน-เวลาที่เปิดขาย</label>
                  <input
                    name="salePeriod"
                    value={form.salePeriod}
                    onChange={handleFormChange}
                    className={inputClass}
                    placeholder="เช่น เปิดพรีออเดอร์ 1 - 31 ต.ค. 2569 หรือ ขายตลอดปี"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className={labelClass}>ลิงก์สั่งซื้อสินค้า (Google Form / Google Sites / Line OA)</label>
                  <input
                    type="url"
                    name="buyUrl"
                    value={form.buyUrl}
                    onChange={handleFormChange}
                    className={inputClass}
                    placeholder="https://forms.gle/... หรือ https://sites.google.com/..."
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className={labelClass}>รายละเอียดการขาย / รายละเอียดสินค้า</label>
                  <textarea
                    name="desc"
                    value={form.desc}
                    onChange={handleFormChange}
                    rows="3"
                    className={`${inputClass} resize-none`}
                    placeholder="เนื้อผ้า ขนาด ไซซ์ รอบจัดส่ง หรือรายละเอียดอื่น ๆ"
                  />
                </div>

                <label className="md:col-span-2 flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.visible}
                    onChange={(e) => setForm((prev) => ({ ...prev, visible: e.target.checked }))}
                    className="w-5 h-5 accent-purple-600"
                  />
                  <span className="text-sm font-bold text-slate-700">แสดงสินค้านี้บนหน้าเว็บไซต์</span>
                </label>

                {formError && (
                  <p className="md:col-span-2 text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5">
                    {formError}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 p-5 border-t border-slate-100 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm">
                  ยกเลิก
                </button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900 hover:bg-purple-700 shadow-md transition-all disabled:opacity-50">
                  {submitting ? 'กำลังบันทึก...' : editingId ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}