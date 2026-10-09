import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground, SectionBanner } from '../components/ThemeElements';

// ==========================================
// 📌 ค่าคงที่และข้อมูลเริ่มต้น
// ==========================================
const CATEGORIES = ['เสื้อ & แฟชั่น', 'แก้ว & ขวดน้ำ', 'เครื่องเขียน', 'ของที่ระลึก', 'อื่นๆ'];

const CAT_STYLE = {
  'เสื้อ & แฟชั่น': { emoji: '👕', grad: 'from-purple-400 to-indigo-400', chip: 'bg-purple-50 text-purple-700 border-purple-200' },
  'แก้ว & ขวดน้ำ': { emoji: '🥤', grad: 'from-rose-400 to-orange-300', chip: 'bg-rose-50 text-rose-700 border-rose-200' },
  'เครื่องเขียน': { emoji: '✏️', grad: 'from-amber-300 to-yellow-300', chip: 'bg-amber-50 text-amber-700 border-amber-200' },
  'ของที่ระลึก': { emoji: '🎁', grad: 'from-teal-400 to-emerald-300', chip: 'bg-teal-50 text-teal-700 border-teal-200' },
  'อื่นๆ': { emoji: '✨', grad: 'from-sky-400 to-blue-300', chip: 'bg-sky-50 text-sky-700 border-sky-200' },
};

const BADGES = ['', 'ใหม่', 'ขายดี', 'จำนวนจำกัด'];

// TODO: เปลี่ยนเป็นดึงข้อมูลจาก supabase (src/services/supabase.js) เมื่อพร้อมเชื่อมฐานข้อมูล
const INITIAL_PRODUCTS = [
  { id: 1, name: 'เสื้อโปโล BME Alumni', price: 390, category: 'เสื้อ & แฟชั่น', stock: 24, badge: 'ขายดี', visible: true, image: '', desc: 'เสื้อโปโลผ้าเนื้อนุ่ม ปักโลโก้สาขาวิศวกรรมชีวการแพทย์ที่อกซ้าย มีไซซ์ S ถึง XXL' },
  { id: 2, name: 'เสื้อยืดคอกลม Heartbeat', price: 290, category: 'เสื้อ & แฟชั่น', stock: 40, badge: 'ใหม่', visible: true, image: '', desc: 'ลายคลื่นหัวใจสกรีนด้านหน้า ผ้าคอตตอน 100% ใส่สบาย ระบายอากาศดี' },
  { id: 3, name: 'กระบอกน้ำเก็บอุณหภูมิ', price: 450, category: 'แก้ว & ขวดน้ำ', stock: 15, badge: '', visible: true, image: '', desc: 'สแตนเลสสองชั้น เก็บเย็นได้ 12 ชั่วโมง ความจุ 750 มล. สลักโลโก้สาขา' },
  { id: 4, name: 'สมุดโน้ตปกแข็ง A5', price: 120, category: 'เครื่องเขียน', stock: 60, badge: '', visible: true, image: '', desc: 'กระดาษถนอมสายตา 100 แกรม 120 หน้า มีริบบิ้นคั่นหน้า' },
  { id: 5, name: 'พวงกุญแจ Stethoscope', price: 79, category: 'ของที่ระลึก', stock: 0, badge: 'ขายดี', visible: true, image: '', desc: 'พวงกุญแจอะคริลิกรูปหูฟังแพทย์ ของที่ระลึกสำหรับน้อง ๆ และศิษย์เก่า' },
  { id: 6, name: 'กระเป๋าผ้า Canvas BME', price: 199, category: 'อื่นๆ', stock: 8, badge: 'จำนวนจำกัด', visible: true, image: '', desc: 'กระเป๋าผ้าแคนวาสหนา ใส่โน้ตบุ๊กและหนังสือได้สบาย' },
];

const EMPTY_FORM = { name: '', price: '', category: CATEGORIES[0], stock: '', badge: '', desc: '', image: '', visible: true };

const formatPrice = (n) => `฿${Number(n).toLocaleString('th-TH')}`;

// ==========================================
// 📌 Component: รูปสินค้า (ถ้าไม่มีรูปจะใช้ไล่สี + อีโมจิตามหมวด)
// ==========================================
const ProductVisual = ({ product, className = 'h-44' }) => {
  const style = CAT_STYLE[product.category] || CAT_STYLE['อื่นๆ'];
  return product.image ? (
    <img src={product.image} alt={product.name} className={`w-full ${className} object-cover`} />
  ) : (
    <div className={`w-full ${className} bg-gradient-to-br ${style.grad} flex items-center justify-center relative overflow-hidden`}>
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/25"></div>
      <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/20"></div>
      <span className="text-6xl drop-shadow-md relative z-10">{style.emoji}</span>
    </div>
  );
};

export default function Shop() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState({}); // { [productId]: qty }
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('ทั้งหมด');
  const [showCart, setShowCart] = useState(false);

  // --- โหมดแอดมิน ---
  // TODO: ผูกกับสิทธิ์จริง เช่น const { user } = useAuth(); const canManage = user?.role === 'admin';
  const canManage = true;
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [announcement, setAnnouncement] = useState('🎉 เปิดรับพรีออเดอร์เสื้อโปโลรุ่นใหม่ ตั้งแต่วันนี้ถึงสิ้นเดือน รับของได้ที่ภาควิชา');
  const [editingAnnouncement, setEditingAnnouncement] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ---------- ค่าที่คำนวณ ----------
  const visibleProducts = useMemo(() => {
    return products.filter((p) => {
      if (!isAdmin && !p.visible) return false;
      const matchCat = activeCat === 'ทั้งหมด' || p.category === activeCat;
      const q = search.trim().toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, isAdmin, activeCat, search]);

  const cartItems = useMemo(
    () => Object.entries(cart).map(([id, qty]) => ({ product: products.find((p) => p.id === Number(id)), qty })).filter((i) => i.product),
    [cart, products]
  );
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.qty * i.product.price, 0);

  const stats = {
    total: products.length,
    soldOut: products.filter((p) => p.stock === 0).length,
    hidden: products.filter((p) => !p.visible).length,
  };

  // ---------- ตะกร้า ----------
  const addToCart = (p) => {
    setCart((prev) => {
      const current = prev[p.id] || 0;
      if (current >= p.stock) return prev;
      return { ...prev, [p.id]: current + 1 };
    });
  };

  const changeQty = (p, delta) => {
    setCart((prev) => {
      const next = (prev[p.id] || 0) + delta;
      const copy = { ...prev };
      if (next <= 0) delete copy[p.id];
      else if (next <= p.stock) copy[p.id] = next;
      return copy;
    });
  };

  const copyOrder = async () => {
    const lines = cartItems.map((i) => `- ${i.product.name} x${i.qty} = ${formatPrice(i.qty * i.product.price)}`);
    const text = `รายการสั่งซื้อจากร้านค้าสาขา BME\n${lines.join('\n')}\nรวมทั้งหมด ${formatPrice(cartTotal)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert(text);
    }
  };

  // ---------- แอดมิน: จัดการสินค้า ----------
  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({ ...p, price: String(p.price), stock: String(p.stock) });
    setFormError('');
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setFormError('ขนาดรูปภาพต้องไม่เกิน 2MB');
      return;
    }
    // TODO: เมื่อเชื่อม supabase ให้อัปโหลดไฟล์ไป Storage แล้วเก็บเป็น URL แทน base64
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const saveProduct = () => {
    if (!form.name.trim()) return setFormError('กรุณากรอกชื่อสินค้า');
    if (form.price === '' || Number(form.price) < 0) return setFormError('กรุณากรอกราคาให้ถูกต้อง');
    const payload = {
      ...form,
      name: form.name.trim(),
      desc: form.desc.trim(),
      price: Number(form.price),
      stock: Math.max(0, Number(form.stock) || 0),
    };
    if (editingId) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...payload, id: editingId } : p)));
    } else {
      setProducts((prev) => [{ ...payload, id: Date.now() }, ...prev]);
    }
    setShowForm(false);
  };

  const deleteProduct = (p) => {
    if (!window.confirm(`ลบ "${p.name}" ออกจากร้านค้า?`)) return;
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[p.id];
      return copy;
    });
  };

  const toggleVisible = (p) => setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, visible: !x.visible } : x)));

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

          <div className="flex flex-wrap justify-center gap-3 mt-7">
            <button
              onClick={() => setShowCart(true)}
              className="relative px-6 py-3 rounded-full text-sm font-bold text-white bg-slate-900 shadow-md shadow-slate-900/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              ตะกร้าสินค้า
              {cartCount > 0 && <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-gradient-to-br from-purple-500 to-rose-500 text-[11px] flex items-center justify-center">{cartCount}</span>}
            </button>

            {canManage && (
              <button
                onClick={() => setIsAdmin((v) => !v)}
                className={`px-6 py-3 rounded-full text-sm font-bold border shadow-sm transition-all ${isAdmin ? 'bg-gradient-to-r from-purple-500 to-rose-400 text-white border-transparent' : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'}`}
              >
                {isAdmin ? 'ออกจากโหมดแอดมิน' : 'โหมดแอดมิน'}
              </button>
            )}
          </div>
        </div>

        {/* ---------------- ประกาศหน้าร้าน (บล็อกข้อความแก้ไขได้ คล้าย Google Sites) ---------------- */}
        <div className="mb-10">
          <div className="rounded-3xl bg-gradient-to-r from-purple-500 via-indigo-400 to-rose-400 p-[2px] shadow-sm">
            <div className="rounded-[1.35rem] bg-white/90 backdrop-blur-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
              {editingAnnouncement ? (
                <>
                  <input
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    className={`${inputClass} flex-1`}
                    placeholder="พิมพ์ประกาศหน้าร้าน เช่น โปรโมชันหรือวันรับของ"
                  />
                  <button onClick={() => setEditingAnnouncement(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900 shrink-0">บันทึกประกาศ</button>
                </>
              ) : (
                <>
                  <p className="flex-1 font-bold text-slate-800 text-sm md:text-base">{announcement || 'ยังไม่มีประกาศ'}</p>
                  {isAdmin && (
                    <button onClick={() => setEditingAnnouncement(true)} className="px-4 py-2 rounded-full text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 shrink-0">แก้ไขประกาศ</button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ---------------- Section 1: ข้อมูลร้าน ---------------- */}
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          <SectionBanner line1="ร้านค้า" line2="สาขา BME" variant="website" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: '📦', title: 'รับสินค้าที่ภาควิชา', desc: 'นัดรับสินค้าที่ห้องสาขาวิชาในวันและเวลาทำการ ไม่มีค่าจัดส่ง', tone: 'from-purple-50 to-indigo-50 border-purple-100' },
              { icon: '💬', title: 'สั่งซื้อผ่านตะกร้า', desc: 'เลือกสินค้า คัดลอกรายการสั่งซื้อ แล้วส่งให้แอดมินยืนยัน', tone: 'from-rose-50 to-orange-50 border-rose-100' },
              { icon: '🎓', title: 'สนับสนุนกิจกรรมสาขา', desc: 'รายได้หลังหักต้นทุนนำไปใช้จัดกิจกรรมนักศึกษาและศิษย์เก่า', tone: 'from-teal-50 to-emerald-50 border-teal-100' },
            ].map((item) => (
              <div key={item.title} className={`rounded-[2rem] border bg-gradient-to-br ${item.tone} p-6 shadow-sm`}>
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-black text-slate-800 mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- แผงควบคุมแอดมิน ---------------- */}
        <AnimatePresence>
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 overflow-hidden"
            >
              <div className={`p-6 md:p-8 ${bentoGlass} border-purple-200`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-400 rounded-full"></span>
                      จัดการร้านค้า
                    </h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">เพิ่ม แก้ไข ซ่อน หรือลบสินค้า การเปลี่ยนแปลงจะแสดงในหน้าร้านทันที</p>
                  </div>
                  <button onClick={openCreate} className="px-6 py-3 rounded-full text-sm font-bold text-white bg-slate-900 shadow-md shadow-slate-900/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8" d="M12 4v16m8-8H4" /></svg>
                    เพิ่มสินค้าใหม่
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 md:gap-5 mt-6">
                  {[
                    { label: 'สินค้าทั้งหมด', value: stats.total, tone: 'bg-purple-50 text-purple-700 border-purple-100' },
                    { label: 'สินค้าหมด', value: stats.soldOut, tone: 'bg-rose-50 text-rose-700 border-rose-100' },
                    { label: 'ซ่อนอยู่', value: stats.hidden, tone: 'bg-slate-100 text-slate-600 border-slate-200' },
                  ].map((s) => (
                    <div key={s.label} className={`rounded-2xl border p-4 text-center ${s.tone}`}>
                      <p className="text-2xl md:text-3xl font-black">{s.value}</p>
                      <p className="text-[11px] md:text-xs font-bold mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------------- Section 2: รายการสินค้า ---------------- */}
        <div className={`p-6 md:p-10 mb-12 ${bentoGlass}`}>
          <SectionBanner line1="สินค้า" line2="ที่ระลึก" variant="calendar" />

          {/* ค้นหา + หมวดหมู่ */}
          <div className="max-w-xl mx-auto relative group mb-6">
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
          {visibleProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🛍️</p>
              <p className="text-lg font-black text-slate-800">ไม่พบสินค้าที่ตรงกับการค้นหา</p>
              <p className="text-sm text-slate-500 font-medium mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleProducts.map((p) => {
                const style = CAT_STYLE[p.category] || CAT_STYLE['อื่นๆ'];
                const soldOut = p.stock === 0;
                const inCart = cart[p.id] || 0;
                return (
                  <motion.div
                    key={p.id}
                    layout
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.25 }}
                    className={`relative rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col ${!p.visible ? 'opacity-60' : ''}`}
                  >
                    <div className="relative">
                      <ProductVisual product={p} />
                      {p.badge && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[11px] font-black text-rose-600 shadow-sm">{p.badge}</span>
                      )}
                      {!p.visible && (
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 text-[11px] font-bold text-white">ซ่อนอยู่</span>
                      )}
                      {soldOut && (
                        <div className="absolute inset-0 bg-slate-900/45 flex items-center justify-center">
                          <span className="px-5 py-2 rounded-full bg-white text-sm font-black text-slate-800">สินค้าหมด</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <span className={`self-start px-2.5 py-0.5 rounded-full border text-[10px] font-bold mb-2.5 ${style.chip}`}>{p.category}</span>
                      <h3 className="text-base font-black text-slate-800 leading-snug mb-1.5">{p.name}</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 mb-4">{p.desc}</p>

                      <div className="mt-auto">
                        <div className="flex items-end justify-between mb-3">
                          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-rose-500">{formatPrice(p.price)}</p>
                          <p className="text-[11px] font-bold text-slate-400">{soldOut ? 'หมดแล้ว' : `เหลือ ${p.stock} ชิ้น`}</p>
                        </div>

                        <button
                          onClick={() => addToCart(p)}
                          disabled={soldOut || inCart >= p.stock}
                          className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-rose-400 shadow-sm hover:shadow-md active:scale-95 transition-all disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed"
                        >
                          {soldOut ? 'สินค้าหมด' : inCart >= p.stock ? 'ครบจำนวนคงเหลือแล้ว' : inCart > 0 ? `เพิ่มในตะกร้า (มี ${inCart})` : 'เพิ่มในตะกร้า'}
                        </button>

                        {isAdmin && (
                          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100">
                            <button onClick={() => openEdit(p)} className="py-2 rounded-lg text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100">แก้ไข</button>
                            <button onClick={() => toggleVisible(p)} className="py-2 rounded-lg text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200">{p.visible ? 'ซ่อน' : 'แสดง'}</button>
                            <button onClick={() => deleteProduct(p)} className="py-2 rounded-lg text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100">ลบ</button>
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
          <SectionBanner line1="วิธีสั่งซื้อ" line2="และติดต่อ" variant="exam" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-[2rem] bg-slate-50/60 border border-slate-100 shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-400 rounded-full"></span> ขั้นตอนการสั่งซื้อ
              </h3>
              <ol className="space-y-4">
                {[
                  'เลือกสินค้าที่ต้องการแล้วกด "เพิ่มในตะกร้า"',
                  'เปิดตะกร้าและกด "คัดลอกรายการสั่งซื้อ"',
                  'ส่งรายการให้แอดมินสาขาทางช่องทางติดต่อด้านขวา',
                  'ชำระเงินตามที่แอดมินแจ้ง แล้วนัดรับสินค้าที่ภาควิชา',
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
                <span className="w-1.5 h-6 bg-rose-400 rounded-full"></span> ช่องทางติดต่อแอดมินร้านค้า
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
              <p className="text-[11px] text-slate-500 mt-4 italic">* ทุกคำสั่งซื้อต้องได้รับการยืนยันจากแอดมินก่อน และสินค้าจำนวนจำกัดตามที่แสดงในหน้าร้าน</p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- ลิ้นชักตะกร้า ---------------- */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCart(false)} />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative z-10 w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-900">ตะกร้าสินค้า ({cartCount})</h3>
                <button onClick={() => setShowCart(false)} aria-label="ปิดตะกร้า" className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-200 p-2 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-5xl mb-4">🛒</p>
                    <p className="font-black text-slate-800">ตะกร้ายังว่างอยู่</p>
                    <p className="text-sm text-slate-500 font-medium mt-1">เลือกสินค้าจากหน้าร้านแล้วกดเพิ่มในตะกร้า</p>
                  </div>
                ) : (
                  cartItems.map(({ product, qty }) => (
                    <div key={product.id} className="flex gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <ProductVisual product={product} className="h-20" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-800 truncate">{product.name}</p>
                        <p className="text-xs font-bold text-purple-700 mb-2">{formatPrice(product.price)}</p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => changeQty(product, -1)} className="w-7 h-7 rounded-full bg-white border border-slate-200 font-black text-slate-700 hover:bg-slate-100">−</button>
                          <span className="w-6 text-center text-sm font-black">{qty}</span>
                          <button onClick={() => changeQty(product, 1)} disabled={qty >= product.stock} className="w-7 h-7 rounded-full bg-white border border-slate-200 font-black text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">+</button>
                        </div>
                      </div>
                      <p className="text-sm font-black text-slate-800 shrink-0">{formatPrice(qty * product.price)}</p>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-5 border-t border-slate-100 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-500">รวมทั้งหมด</span>
                    <span className="text-2xl font-black text-slate-900">{formatPrice(cartTotal)}</span>
                  </div>
                  <button onClick={copyOrder} className="w-full py-3 rounded-full text-sm font-bold text-white bg-slate-900 shadow-md shadow-slate-900/20 hover:-translate-y-0.5 transition-all">
                    {copied ? 'คัดลอกแล้ว ส่งให้แอดมินได้เลย' : 'คัดลอกรายการสั่งซื้อ'}
                  </button>
                  <button onClick={() => setCart({})} className="w-full mt-2 py-2.5 rounded-full text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors">ล้างตะกร้า</button>
                </div>
              )}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------- ฟอร์มเพิ่ม/แก้ไขสินค้า (แอดมิน) ---------------- */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowForm(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative z-10 bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
                <h3 className="text-lg font-black text-slate-900">{editingId ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h3>
                <button onClick={() => setShowForm(false)} aria-label="ปิดฟอร์ม" className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-200 p-2 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* รูปสินค้า */}
                <div className="md:col-span-2 space-y-2">
                  <label className={labelClass}>รูปสินค้า (ไม่เกิน 2MB)</label>
                  <div className="flex items-center gap-4">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                      <ProductVisual product={{ ...form, name: form.name || 'ตัวอย่าง' }} className="h-28" />
                    </div>
                    <div className="space-y-2">
                      <label className="inline-block px-5 py-2.5 rounded-full text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 cursor-pointer">
                        เลือกไฟล์รูปภาพ
                        <input type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
                      </label>
                      {form.image && (
                        <button onClick={() => setForm((prev) => ({ ...prev, image: '' }))} className="block text-xs font-bold text-rose-500 hover:text-rose-700">ลบรูป ใช้ภาพตามหมวดหมู่แทน</button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className={labelClass}>ชื่อสินค้า</label>
                  <input name="name" value={form.name} onChange={handleFormChange} className={inputClass} placeholder="เช่น เสื้อโปโล BME Alumni" />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>ราคา (บาท)</label>
                  <input type="number" min="0" name="price" value={form.price} onChange={handleFormChange} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>จำนวนคงเหลือ</label>
                  <input type="number" min="0" name="stock" value={form.stock} onChange={handleFormChange} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>หมวดหมู่</label>
                  <select name="category" value={form.category} onChange={handleFormChange} className={inputClass}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>ป้ายกำกับ</label>
                  <select name="badge" value={form.badge} onChange={handleFormChange} className={inputClass}>
                    {BADGES.map((b) => <option key={b} value={b}>{b || 'ไม่มีป้าย'}</option>)}
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className={labelClass}>รายละเอียดสินค้า</label>
                  <textarea name="desc" value={form.desc} onChange={handleFormChange} rows="3" className={`${inputClass} resize-none`} placeholder="วัสดุ ขนาด ไซซ์ หรือรายละเอียดอื่น ๆ" />
                </div>
                <label className="md:col-span-2 flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.visible} onChange={(e) => setForm((prev) => ({ ...prev, visible: e.target.checked }))} className="w-5 h-5 accent-purple-600" />
                  <span className="text-sm font-bold text-slate-700">แสดงสินค้านี้ในหน้าร้าน</span>
                </label>

                {formError && <p className="md:col-span-2 text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5">{formError}</p>}
              </div>

              <div className="flex justify-end gap-2 p-5 border-t border-slate-100 sticky bottom-0 bg-white">
                <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm">ยกเลิก</button>
                <button onClick={saveProduct} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900 shadow-md shadow-slate-900/20 hover:-translate-y-0.5 transition-all">
                  {editingId ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
