import { createContext, useState, useContext } from 'react';

// สร้าง Context
const LanguageContext = createContext();

// สร้าง Provider เพื่อครอบแอปพลิเคชัน
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('th'); // ค่าเริ่มต้นเป็นภาษาไทย

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// สร้าง Hook ไว้ให้หน้าอื่นๆ ดึงไปใช้ง่ายๆ
export const useLanguage = () => useContext(LanguageContext);