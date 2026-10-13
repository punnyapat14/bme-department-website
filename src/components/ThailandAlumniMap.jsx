import React, { useState, useEffect, useMemo } from 'react';

const PROVINCE_TH_MAP = {
  "Bangkok": "กรุงเทพมหานคร",
  "Bangkok Metropolis": "กรุงเทพมหานคร",
  "Krung Thep Maha Nakhon": "กรุงเทพมหานคร",
  "Samut Prakan": "สมุทรปราการ",
  "Nonthaburi": "นนทบุรี",
  "Pathum Thani": "ปทุมธานี",
  "Phra Nakhon Si Ayutthaya": "พระนครศรีอยุธยา",
  "Ang Thong": "อ่างทอง",
  "Lop Buri": "ลพบุรี",
  "Sing Buri": "สิงห์บุรี",
  "Chai Nat": "ชัยนาท",
  "Saraburi": "สระบุรี",
  "Chon Buri": "ชลบุรี",
  "Rayong": "ระยอง",
  "Chanthaburi": "จันทบุรี",
  "Trat": "ตราด",
  "Chachoengsao": "ฉะเชิงเทรา",
  "Prachin Buri": "ปราจีนบุรี",
  "Nakhon Nayok": "นครนายก",
  "Sa Kaeo": "สระแก้ว",
  "Nakhon Ratchasima": "นครราชสีมา",
  "Buri Ram": "บุรีรัมย์",
  "Surin": "สุรินทร์",
  "Si Sa Ket": "ศรีสะเกษ",
  "Ubon Ratchathani": "อุบลราชธานี",
  "Yasothon": "ยโสธร",
  "Chaiyaphum": "ชัยภูมิ",
  "Amnat Charoen": "อำนาจเจริญ",
  "Bueng Kan": "บึงกาฬ",
  "Nong Bua Lam Phu": "หนองบัวลำภู",
  "Khon Kaen": "ขอนแก่น",
  "Udon Thani": "อุดรธานี",
  "Loei": "เลย",
  "Nong Khai": "หนองคาย",
  "Maha Sarakham": "มหาสารคาม",
  "Roi Et": "ร้อยเอ็ด",
  "Kalasin": "กาฬสินธุ์",
  "Sakon Nakhon": "สกลนคร",
  "Nakhon Phanom": "นครพนม",
  "Mukdahan": "มุกดาหาร",
  "Chiang Mai": "เชียงใหม่",
  "Lamphun": "ลำพูน",
  "Lampang": "ลำปาง",
  "Uttaradit": "อุตรดิตถ์",
  "Phrae": "แพร่",
  "Nan": "น่าน",
  "Phayao": "พะเยา",
  "Chiang Rai": "เชียงราย",
  "Mae Hong Son": "แม่ฮ่องสอน",
  "Nakhon Sawan": "นครสวรรค์",
  "Uthai Thani": "อุทัยธานี",
  "Kamphaeng Phet": "กำแพงเพชร",
  "Tak": "ตาก",
  "Sukhothai": "สุโขทัย",
  "Phitsanulok": "พิษณุโลก",
  "Phichit": "พิจิตร",
  "Phetchabun": "เพชรบูรณ์",
  "Ratchaburi": "ราชบุรี",
  "Kanchanaburi": "กาญจนบุรี",
  "Suphan Buri": "สุพรรณบุรี",
  "Nakhon Pathom": "นครปฐม",
  "Samut Sakhon": "สมุทรสาคร",
  "Samut Songkhram": "สมุทรสงคราม",
  "Phetchaburi": "เพชรบุรี",
  "Prachuap Khiri Khan": "ประจวบคีรีขันธ์",
  "Nakhon Si Thammarat": "นครศรีธรรมราช",
  "Krabi": "กระบี่",
  "Phangnga": "พังงา",
  "Phang Nga": "พังงา",
  "Phuket": "ภูเก็ต",
  "Surat Thani": "สุราษฎร์ธานี",
  "Ranong": "ระนอง",
  "Chumphon": "ชุมพร",
  "Songkhla": "สงขลา",
  "Satun": "สตูล",
  "Trang": "ตรัง",
  "Phatthalung": "พัทลุง",
  "Pattani": "ปัตตานี",
  "Yala": "ยะลา",
  "Narathiwat": "นราธิวาส"
};

const MAP_WIDTH = 520;
const MAP_HEIGHT = 960;
const PADDING = 24;
const LON_MIN = 97.3;
const LON_MAX = 105.7;
const LAT_MIN = 5.6;
const LAT_MAX = 20.5;

const projectPoint = ([lon, lat]) => {
  const x = PADDING + ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * (MAP_WIDTH - PADDING * 2);
  const y = PADDING + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (MAP_HEIGHT - PADDING * 2);
  return [x, y];
};

const ringToPath = (ring) => {
  if (!ring || ring.length === 0) return '';
  return (
    ring
      .map((pt, i) => {
        const [x, y] = projectPoint(pt);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ') + ' Z'
  );
};

// คำนวณทั้ง SVG Path และจุดกึ่งกลาง + ขอบเขต (Bounding Box) ของแต่ละจังหวัดเพื่อใช้ซูมอัตโนมัติ
const analyzeGeometry = (geometry) => {
  if (!geometry) return { path: '', cx: MAP_WIDTH / 2, cy: MAP_HEIGHT / 2, scale: 1 };

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const collectPoints = (ring) => {
    ring.forEach((pt) => {
      const [x, y] = projectPoint(pt);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });
  };

  let path = '';
  if (geometry.type === 'Polygon') {
    geometry.coordinates.forEach(collectPoints);
    path = geometry.coordinates.map(ringToPath).join(' ');
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach((poly) => poly.forEach(collectPoints));
    path = geometry.coordinates.map((poly) => poly.map(ringToPath).join(' ')).join(' ');
  }

  const cx = Number.isFinite(minX) ? (minX + maxX) / 2 : MAP_WIDTH / 2;
  const cy = Number.isFinite(minY) ? (minY + maxY) / 2 : MAP_HEIGHT / 2;
  const bw = Math.max(25, maxX - minX);
  const bh = Math.max(25, maxY - minY);

  // คำนวณระดับการซูมที่เหมาะสมกับขนาดจังหวัด (จำกัดไว้ระหว่าง 2.2x ถึง 4.2x)
  const autoScale = Math.min(4.2, Math.max(2.4, Math.min(MAP_WIDTH / (bw * 2.2), MAP_HEIGHT / (bh * 2.2))));

  return { path, cx, cy, autoScale };
};

const COLOR_LEVELS = [
  { label: '0 คน', fill: '#f1f5f9' },
  { label: '1 คน', fill: '#d8b4fe' },
  { label: '2-3 คน', fill: '#a855f7' },
  { label: '4-7 คน', fill: '#7e22ce' },
  { label: '8+ คน', fill: '#be123c' },
];

const getProvinceColor = (count) => {
  if (!count || count <= 0) return '#f1f5f9';
  if (count === 1) return '#d8b4fe';
  if (count <= 3) return '#a855f7';
  if (count <= 7) return '#7e22ce';
  return '#be123c';
};

export default function ThailandAlumniMap({ provinceData = {}, onSelectProvince }) {
  const [geoData, setGeoData] = useState(null);
  const [loadingMap, setLoadingMap] = useState(true);
  const [hoveredProvince, setHoveredProvince] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);

  // 📌 State สำหรับควบคุมการซูมและจุดโฟกัสบนแผนที่
  const [zoom, setZoom] = useState(1);
  const [focusCenter, setFocusCenter] = useState({ x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 });

  useEffect(() => {
    let isMounted = true;
    const loadGeoJson = async () => {
      try {
        const res = await fetch('https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json');
        const json = await res.json();
        if (isMounted) setGeoData(json);
      } catch (err) {
        console.error('Error loading Thailand map GeoJSON:', err);
      } finally {
        if (isMounted) setLoadingMap(false);
      }
    };
    loadGeoJson();
    return () => { isMounted = false; };
  }, []);

  const provinces = useMemo(() => {
    const features = geoData?.features || [];
    return features.map((feature, idx) => {
      const nameEN = feature?.properties?.name || `Province-${idx}`;
      const nameTH = PROVINCE_TH_MAP[nameEN] || nameEN;
      const count = Number(provinceData[nameTH] ?? provinceData[nameEN] ?? 0) || 0;
      const { path, cx, cy, autoScale } = analyzeGeometry(feature.geometry);

      return {
        id: nameEN,
        nameEN,
        nameTH,
        count,
        path,
        cx,
        cy,
        autoScale,
        fill: getProvinceColor(count),
      };
    });
  }, [geoData, provinceData]);

  const stats = useMemo(() => {
    const sorted = [...provinces].sort((a, b) => b.count - a.count);
    const activeProvinces = sorted.filter((p) => p.count > 0);
    return { activeProvinces, sorted };
  }, [provinces]);

  const activeInfo = hoveredProvince || selectedProvince || stats.activeProvinces[0] || null;

  // 📌 เมื่อคลิกเลือกจังหวัด ให้ซูมเข้าไปยังพิกัดจังหวัดนั้นอัตโนมัติ (หากคลิกซ้ำให้ซูมออกกลับค่าเริ่มต้น)
  const handleProvinceClick = (prov) => {
    const isSame = selectedProvince?.id === prov.id;
    const next = isSame ? null : prov;
    setSelectedProvince(next);

    if (next) {
      setZoom(next.autoScale || 2.8);
      setFocusCenter({ x: next.cx, y: next.cy });
    } else {
      setZoom(1);
      setFocusCenter({ x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 });
    }

    if (onSelectProvince) onSelectProvince(next);
  };

  // ปุ่มกดซูมเข้า / ซูมออก / รีเซ็ต
  const handleZoomIn = () => setZoom((z) => Math.min(5, +(z + 0.6).toFixed(1)));
  const handleZoomOut = () => {
    setZoom((z) => {
      const nextZ = Math.max(1, +(z - 0.6).toFixed(1));
      if (nextZ === 1) setFocusCenter({ x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 });
      return nextZ;
    });
  };
  const handleResetZoom = () => {
    setSelectedProvince(null);
    setZoom(1);
    setFocusCenter({ x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 });
    if (onSelectProvince) onSelectProvince(null);
  };

  // คำนวณ SVG Transform เพื่อให้ซูมไปยังจุดกึ่งกลางของจังหวัดที่เลือกได้อย่างนุ่มนวล
  const svgTransform = `translate(${MAP_WIDTH / 2}, ${MAP_HEIGHT / 2}) scale(${zoom}) translate(${-focusCenter.x}, ${-focusCenter.y})`;

  return (
    <div className="bg-white/95 border border-slate-100 shadow-lg rounded-[2rem] p-5 sm:p-7 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
            พื้นที่ปฏิบัติงานศิษย์เก่า (Thailand Map)
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            คลิกจังหวัดเพื่อซูมดูพื้นที่และกรองรายชื่อด้านล่าง
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-extrabold shrink-0">
          กระจายตัว {stats.activeProvinces.length} จังหวัด
        </span>
      </div>

      {/* โครงสร้างภายใน: ซ้าย แผนที่ซูมได้ | ขวา อันดับจังหวัด */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch my-auto">
        
        {/* ฝั่งซ้าย: กล่องแผนที่ SVG พร้อมปุ่มควบคุมการซูม */}
        <div className="sm:col-span-6 flex flex-col justify-between bg-gradient-to-b from-slate-50/90 to-purple-50/30 rounded-2xl p-3 border border-slate-100 relative overflow-hidden min-h-[340px]">
          
          {/* ป้ายชื่อจังหวัดด้านบนแผนที่ */}
          {activeInfo && (
            <div className="relative z-10 w-full flex items-center justify-between bg-white/95 backdrop-blur-xs px-3 py-2 rounded-xl border border-slate-200/80 mb-2 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: activeInfo.fill }} />
                <span className="text-xs font-extrabold text-slate-900 truncate">{activeInfo.nameTH}</span>
              </div>
              <span className="text-[11px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                {activeInfo.count} คน
              </span>
            </div>
          )}

          {/* ปุ่มควบคุมการซูมมุมขวาล่างของแผนที่ */}
          <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-md">
            <button
              type="button"
              onClick={handleZoomIn}
              title="ซูมเข้า"
              className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-purple-100 text-slate-700 hover:text-purple-800 font-black text-sm flex items-center justify-center transition-colors cursor-pointer"
            >
              +
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              title="ซูมออก"
              className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-purple-100 text-slate-700 hover:text-purple-800 font-black text-sm flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
            >
              −
            </button>
            {(zoom > 1 || selectedProvince) && (
              <button
                type="button"
                onClick={handleResetZoom}
                title="รีเซ็ตขนาดแผนที่"
                className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-[10px] flex items-center justify-center transition-colors cursor-pointer"
              >
                ↺
              </button>
            )}
          </div>

          {/* ป้ายบอกระดับการซูมมุมซ้ายล่าง */}
          {zoom > 1 && (
            <span className="absolute bottom-3 left-3 z-20 px-2.5 py-1 rounded-lg bg-slate-900/75 text-white text-[10px] font-bold backdrop-blur-xs">
              ซูม {zoom.toFixed(1)}x
            </span>
          )}

          {/* ตัวแผนที่ SVG */}
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            {loadingMap ? (
              <div className="h-[300px] flex items-center justify-center text-xs font-bold text-slate-400 animate-pulse">
                กำลังโหลดแผนที่...
              </div>
            ) : (
              <svg
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                className="w-full max-h-[320px] h-auto drop-shadow-xs select-none"
              >
                <g
                  transform={svgTransform}
                  style={{ transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)' }}
                >
                  {provinces.map((prov) => {
                    const isHovered = hoveredProvince?.id === prov.id;
                    const isSelected = selectedProvince?.id === prov.id;
                    return (
                      <path
                        key={prov.id}
                        d={prov.path}
                        fill={isHovered || isSelected ? '#f43f5e' : prov.fill}
                        stroke={isHovered || isSelected ? '#881337' : '#ffffff'}
                        strokeWidth={(isHovered || isSelected ? 2 : 0.9) / Math.sqrt(zoom)}
                        className="transition-colors duration-150 cursor-pointer"
                        onMouseEnter={() => setHoveredProvince(prov)}
                        onMouseLeave={() => setHoveredProvince(null)}
                        onClick={() => handleProvinceClick(prov)}
                      >
                        <title>{`${prov.nameTH}: ${prov.count} คน`}</title>
                      </path>
                    );
                  })}
                </g>
              </svg>
            )}
          </div>
        </div>

        {/* ฝั่งขวา: ลิสต์อันดับจังหวัด (คลิกแล้วแผนที่ซูมเข้าหาจังหวัดนั้นทันที) */}
        <div className="sm:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                ลำดับจังหวัดที่มีศิษย์เก่าปฏิบัติงาน
              </p>
              {selectedProvince && (
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  ซูมออกทั้งหมด
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[310px] overflow-y-auto pr-1">
              {stats.activeProvinces.map((prov, i) => {
                const isSelected = selectedProvince?.id === prov.id;
                return (
                  <button
                    key={prov.id}
                    type="button"
                    onMouseEnter={() => setHoveredProvince(prov)}
                    onMouseLeave={() => setHoveredProvince(null)}
                    onClick={() => handleProvinceClick(prov)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 border-rose-300 shadow-2xs ring-1 ring-rose-200'
                        : 'bg-slate-50/70 hover:bg-purple-50/60 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-5 h-5 rounded-md text-[10px] font-black flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: prov.fill }}
                      >
                        {i + 1}
                      </span>
                      <div className="truncate">
                        <span className="text-xs sm:text-sm font-extrabold text-slate-800 block truncate">
                          {prov.nameTH}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block truncate">
                          {prov.nameEN}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-purple-700 bg-white px-2.5 py-0.5 rounded-full border border-purple-100 shrink-0 ml-2">
                      {prov.count} คน
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* คำอธิบายระดับสี */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4 mt-4 border-t border-slate-100">
        {COLOR_LEVELS.map((lvl) => (
          <div key={lvl.label} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200/60">
            <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: lvl.fill }} />
            <span>{lvl.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}