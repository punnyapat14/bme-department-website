import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. เช็คตอนโหลดหน้าเว็บ
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("🔥 [AuthContext] ข้อมูล Session เริ่มต้น:", session); // <--- เพิ่มบรรทัดนี้
      setUser(session?.user ?? null);
      setRole(session?.user?.user_metadata?.role ?? null);
      setLoading(false);
    });

    // 2. เช็คตอนกดล็อกอิน/ล็อกเอาท์
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("⚡ [AuthContext] สถานะเปลี่ยน Event:", _event, session); // <--- เพิ่มบรรทัดนี้
      setUser(session?.user ?? null);
      setRole(session?.user?.user_metadata?.role ?? null);
      setLoading(false);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);