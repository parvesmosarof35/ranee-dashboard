import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "@/store/authSlice";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  user: null as any,
  isAuthenticated: false,
  login: () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const login = () => {
    // Login is handled by SignInPage directly via API and dispatch
  };

  const logout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("persist:auth"); // Ensure persist storage is cleared
    router.push("/auth");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);