import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (user && token) {
      try {
        const userParsed = JSON.parse(user);
        if (userParsed && typeof userParsed === "object") {
          setUser(userParsed);
          setToken(token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          // Invalid user data, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("user");
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
    // if (token) {
    //   verifyToken(token);
    // }
  }, []);

  // const verifyToken = async (token: string) => {
  //   try {
  //     const res = await axios.get("/auth/verify", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setUser(res.data.user);
  //     setToken(token)
  //   } catch (error) {
  //     localStorage.removeItem('token');
  //     setToken(null);
  //     setUser(null);
  //     console.log('can not verify token', error)
  //   }
  // };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post("/api/auth/login", { email, password });
       console.log("Login response:", res.data);
      const { token, user } = res.data;
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      setUser(user);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      toast.success("Login Successful!");
      navigate("/");
    } catch (error) {
      console.log("Login failed", error);
    } finally {
       setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    username?: string
  ) => {
    try {
      const res = await axios.post("/api/auth/register", {
        email,
        username,
        password,
      });
      console.log("Server response:", res.data);
      const { token, user } = res.data;
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      setUser(user);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      console.log("Registration failed.", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
