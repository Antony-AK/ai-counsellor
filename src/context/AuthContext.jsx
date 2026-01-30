import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);   // 👈 NEW

  // const apiUrl = "https://ai-counsellor-backend-production-6d05.up.railway.app"
    const apiUrl = "http://localhost:5000"


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const data = res.data;

        // ✅ NORMALIZE USER OBJECT
        setUser({
          ...data,
          applicationStage: data.applicationStage 
        });
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);


  const login = async (email, password) => {
    const res = await axios.post(`${apiUrl}/auth/login`, { email, password });
    localStorage.setItem("token", res.data.token);
    setUser({
      ...res.data.user,
      applicationStage: res.data.user.applicationStage 
    });
  };

  const signup = async (name, email, password) => {
    const res = await axios.post(`${apiUrl}/auth/signup`, { name, email, password });
    localStorage.setItem("token", res.data.token);
    setUser({
      ...res.data.user,
      applicationStage: res.data.user.applicationStage 
    });
  };

  const saveOnboarding = async (form) => {
    const token = localStorage.getItem("token");

    // 🔥 Freeze preferredCountries so React or Axios cannot mutate it
    const payload = {
      ...form,
      preferredCountries: [...form.preferredCountries]  // deep copy
    };


    await axios.put(`${apiUrl}/auth/onboarding`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Fetch fresh user after backend recalculates universities
    const res = await axios.get(`${apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setUser({
      ...res.data,
      applicationStage: res.data.applicationStage 
    });
  };


  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, saveOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
