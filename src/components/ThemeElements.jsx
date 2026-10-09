import React from 'react';
import { motion } from 'framer-motion';

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

export const SectionBanner = ({ line1, line2, variant = "website" }) => {
  const config = {
    calendar: { bgs: ['bg-[#3b82f6]', 'bg-[#f59e0b]', 'bg-[#10b981]', 'bg-[#8b5cf6]', 'bg-[#ec4899]', 'bg-[#0ea5e9]'], text: 'bg-[#eff6ff] text-[#1e3a8a]' },
    website: { bgs: ['bg-[#a16dd1]', 'bg-[#01aa3a]', 'bg-[#f9703d]', 'bg-[#c5e9e7]', 'bg-[#df3470]', 'bg-[#dced11]'], text: 'bg-[#fdf4ff] text-[#4a044e]' },
    exam: { bgs: ['bg-rose-500', 'bg-teal-500', 'bg-indigo-500', 'bg-amber-400', 'bg-fuchsia-500', 'bg-sky-400'], text: 'bg-rose-50 text-rose-950' }
  };
  const theme = config[variant] || config.website;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} whileHover={{ scale: 1.01 }} transition={{ duration: 0.4 }} className="w-full mx-auto mb-10 flex flex-col gap-2 md:gap-3 cursor-default">
      <div className="flex gap-2 md:gap-3 h-16 md:h-20 w-full">
        <div className={`${theme.bgs[0]} rounded-xl md:rounded-3xl w-[20%] md:w-[24%] flex items-center justify-center shadow-sm overflow-hidden`}>
           {variant === 'exam' && <div className="w-4 h-10 md:h-12 bg-white/90 rounded-full rotate-12"></div>}
           {variant === 'calendar' && <div className="flex gap-1.5 md:gap-2"><div className="w-2.5 md:w-3 h-8 md:h-10 bg-white/90 rounded-full"></div><div className="w-2.5 md:w-3 h-8 md:h-10 bg-white/90 rounded-full"></div></div>}
           {variant === 'website' && <div className="flex gap-1.5 md:gap-2"><div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-white/90 rounded-full"></div><div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-white/90 rounded-full"></div><div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-white/90 rounded-full"></div></div>}
        </div>
        <div className={`${theme.text} rounded-xl md:rounded-3xl flex-1 flex items-center justify-center shadow-sm`}>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">{line1}</h2>
        </div>
        <div className={`${theme.bgs[1]} rounded-xl md:rounded-3xl w-[18%] md:w-[20%] flex items-center justify-center shadow-sm overflow-hidden`}>
          {variant === 'exam' && <div className="w-8 h-8 md:w-10 md:h-10 bg-white/90 rounded-full"></div>}
          {variant === 'calendar' && <div className="w-8 h-8 md:w-10 md:h-10 bg-white/90 rounded-xl"></div>}
          {variant === 'website' && <div className="w-8 h-8 md:w-10 md:h-10 border-[4px] md:border-[5px] border-white/90 rounded-full"></div>}
        </div>
      </div>
      <div className="flex gap-2 md:gap-3 h-16 md:h-20 w-full">
        <div className={`${theme.bgs[2]} rounded-xl md:rounded-3xl w-[20%] md:w-[24%] flex items-center justify-center shadow-sm overflow-hidden relative`}>
          {variant === 'exam' && <div className="w-8 h-8 md:w-10 md:h-10 bg-white/90 rotate-45 rounded-sm"></div>}
          {variant === 'calendar' && <div className="absolute inset-0 opacity-30 md:opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '12px 12px' }}></div>}
          {variant === 'website' && <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-12 md:h-12 fill-white/80"><circle cx="35" cy="35" r="22" /><circle cx="65" cy="35" r="22" /><circle cx="35" cy="65" r="22" /><circle cx="65" cy="65" r="22" /></svg>}
        </div>
        <div className={`${theme.text} rounded-xl md:rounded-3xl flex-1 flex items-center justify-center shadow-sm`}>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">{line2}</h2>
        </div>
        <div className={`${theme.bgs[3]} rounded-xl md:rounded-3xl w-[12%] md:w-[15%] flex items-center justify-center shadow-sm overflow-hidden`}>
           {variant === 'exam' && <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-white/90 rounded-full border-dashed"></div>}
           {variant === 'calendar' && <div className="w-6 h-6 md:w-8 md:h-8 bg-white/90 rounded-lg rotate-12"></div>}
           {variant === 'website' && <div className="relative w-6 h-6 md:w-8 md:h-8"><div className="absolute top-1/2 left-0 w-full h-1.5 md:h-2 bg-white/90 -translate-y-1/2 rounded-full"></div><div className="absolute left-1/2 top-0 h-full w-1.5 md:w-2 bg-white/90 -translate-x-1/2 rounded-full"></div></div>}
        </div>
        <div className={`${theme.bgs[4]} rounded-xl md:rounded-3xl w-[12%] md:w-[15%] relative overflow-hidden shadow-sm hidden sm:block`}>
          {variant === 'exam' && <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/40"></div>}
          {variant === 'calendar' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[40%] bg-white/30 rotate-45"></div>}
          {variant === 'website' && <><div className="absolute -top-[30%] -left-[30%] w-[70%] h-[70%] bg-white/30 rounded-full"></div><div className="absolute -bottom-[30%] -right-[30%] w-[70%] h-[70%] bg-white/30 rounded-full"></div></>}
        </div>
      </div>
    </motion.div>
  );
};