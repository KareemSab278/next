import { createContext, useContext, useState } from "react";

const AuthContext = createContext<any>(null);

export default function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("signed_in_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const signIn = (userData: any) => {
    console.log("[auth] signIn", userData);
    setUser(userData);
    localStorage.setItem("signed_in_user", JSON.stringify(userData));
    console.log("[auth] stored in localStorage", localStorage.getItem("signed_in_user"));
  }

  const signOut = () => {
    if (!localStorage.getItem("signed_in_user")) {
      setUser(null);
      return;
    }
    setUser(null);
    localStorage.removeItem("signed_in_user");
  }

  const sessionValidStatus = (timeStamp: string | null) => {
    if (!timeStamp) return false;
    return new Date(timeStamp) > new Date();
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, sessionValidStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
