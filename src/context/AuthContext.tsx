import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  // 🔹 SIGN UP
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const res = await axios.post("http://localhost:4000/api/signup", {
        name: fullName,
        email,
        password,
      });

      if (res.status === 201) {
        console.log("Signup success:", res.data);
      } else {
        throw new Error(res.data.msg || "Signup failed");
      }
    } catch (err: any) {
      console.error(err);
      throw new Error(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          "Signup failed. Please try again."
      );
    }
  };

  // 🔹 SIGN IN
  const signIn = async (email: string, password: string) => {
    try {
      const res = await axios.post("api/login", {
        email,
        password,
      });

      if (res.status === 201) {
        const { token, userDetails } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userDetails));
        setUser(userDetails);
      } else {
        throw new Error(res.data.msg || "Login failed");
      }
    } catch (err: any) {
      console.error(err);
      throw new Error(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          "Login failed. Please try again."
      );
    }
  };

  // 🔹 SIGN OUT
  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
