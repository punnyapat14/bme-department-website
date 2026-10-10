import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ==========================================
// 📌 Component: พื้นหลังแสงออโรร่า
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
    <motion.div animate={{ x: ["0%", "2%", "-2%", "0%"], y: ["0%", "-2%", "2%", "0%"] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-300/10 blur-[100px]" />
    <motion.div animate={{ x: ["0%", "-2%", "2%", "0%"], y: ["0%", "2%", "-2%", "0%"] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-rose-200/10 blur-[100px]" />
  </div>
);

// ==========================================
// 📌 Component: ป้ายแบนเนอร์
// ==========================================
export const SectionBanner = ({ text }) => {
  // 🎨 พื้นหลังสีม่วงอ่อน
  const bgColor = "bg-[#bba8ff]"; 

  // ☁️ คลาสสไตล์ก้อนเมฆนูน 
  const cloudStyle = `${bgColor} rounded-full absolute shadow-[inset_6px_6px_25px_rgba(255,255,255,0.6),_0px_5px_15px_rgba(0,0,0,0.05)]`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ scale: 1.015, y: -2 }}
      transition={{ duration: 0.4 }}
      className={`relative w-full mx-auto mb-12 h-20 md:h-24 rounded-[1.25rem] md:rounded-[2rem] overflow-hidden flex items-center justify-center cursor-default ${bgColor} shadow-[0_8px_30px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)] group`}
    >
      {/* 🌟 1. เลเยอร์ก้อนเมฆนูน (Puffy Blobs) */}
      <div className={`-bottom-10 -left-6 w-28 h-28 md:w-36 md:h-36 ${cloudStyle}`} />
      <div className={`-bottom-16 left-[15%] w-48 h-48 md:w-64 md:h-64 ${cloudStyle}`} />
      <div className={`-bottom-20 right-[15%] w-56 h-56 md:w-72 md:h-72 ${cloudStyle}`} />
      <div className={`-bottom-12 -right-8 w-32 h-32 md:w-40 md:h-40 ${cloudStyle}`} />
      <div className={`-top-12 left-[45%] w-24 h-24 md:w-32 md:h-32 ${cloudStyle} opacity-60`} />

      {/* ✨ 2. เลเยอร์โฮโลแกรม/เมทาลิก (Animated Holographic Overlay) */}
      <motion.div 
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 10, ease: "linear", repeat: Infinity }}
        className="absolute inset-0 mix-blend-overlay opacity-60"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,107,254,0.4) 25%, rgba(0,249,248,0.3) 50%, rgba(255,255,255,0.8) 75%, rgba(255,255,255,0) 100%)",
          backgroundSize: "200% 200%"
        }}
      />
      
      {/* ✨ 3. เคลือบกระจกมันวาว (Glossy Reflection) */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent rounded-t-[2rem] pointer-events-none" />

      {/* 📝 4. ข้อความตรงกลาง (เปลี่ยนสีข้อความให้เข้มขึ้น และใส่เงาเรืองแสงสีขาว) */}
      <h2 className="relative z-10 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#2d1b69] drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)] px-6 text-center truncate">
        {text}
      </h2>
      
      {/* 💫 5. แสงสะท้อนวิ่งผ่านตลอดเวลา (Continuous Light Sweep) */}
      <motion.div
        animate={{ left: ["-100%", "200%", "200%"] }}
        transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
        className="absolute top-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-12 z-20 pointer-events-none"
      />
    </motion.div>
  );
};