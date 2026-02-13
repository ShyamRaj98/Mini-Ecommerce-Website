import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Load user from localStorage + fetch fresh profile
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("userInfo");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        try {
          const { data } = await api.get("/auth/profile");

          const updatedUser = { ...parsedUser, ...data };

          setUser(updatedUser);
          localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        } catch (error) {
          console.log("Profile refresh failed");
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // 🔥 Register
  const register = async (email, password) => {
    const { data } = await api.post("/auth/register", {
      email,
      password,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
    setUser(data);
    navigate("/");
  };

  // 🔥 Login
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
    setUser(data);
    navigate("/");
  };

  // 🔥 Logout
  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  // 🔥 Update user (for profile edit page)
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        register,
        login,
        logout,
        updateUser,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
