import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // สถานะจำลอง: ให้เริ่มต้นด้วย null (ยังไม่ล็อกอิน)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // จำลองเวลาโหลดข้อมูล 0.5 วินาที ตอนเปิดเว็บ
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // ฟังก์ชันจำลองการเข้าสู่ระบบ
  const mockLogin = (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // จำลองข้อมูล User ที่ล็อกอินสำเร็จ
        setUser({ id: 'mock-uuid-1234', email: email });
        resolve({ error: null });
      }, 800); // ดีเลย์ 0.8 วิ ให้ดูสมจริง
    });
  };

  // ฟังก์ชันจำลองการออกจากระบบ
  const mockLogout = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser(null);
        resolve({ error: null });
      }, 500);
    });
  };

  const value = {
    user,
    loading,
    login: mockLogin,
    logout: mockLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};