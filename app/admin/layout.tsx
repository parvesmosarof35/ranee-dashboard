"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/sidebar";
import MainHeader from "./components/main-header";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";
import { textPrimary } from "@/contexts/theme";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Authentication Guard
  useEffect(() => {
    // Small delay to allow redux-persist to rehydrate
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push("/auth");
      } else {
        setIsAuthChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  // Ensure: initially closed on mobile, open on desktop (lg: 1024px)
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(min-width: 1024px)");
    
    // Initial State
    setIsSidebarOpen(mql.matches);

    const updateOpenState = (e: MediaQueryListEvent) => {
        setIsSidebarOpen(e.matches);
    };

    mql.addEventListener("change", updateOpenState);
    return () => mql.removeEventListener("change", updateOpenState);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Auto-close sidebar on route change when on mobile
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  if (isAuthChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <Loader2 className={`w-12 h-12 animate-spin ${textPrimary} mx-auto transition-all`} />
          <p className="mt-4 text-gray-500 font-medium">Verifying sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen relative overflow-hidden bg-white">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-40 lg:hidden"
        />
      )}
      
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-col w-full overflow-hidden my-5 h-[calc(100vh-2.5rem)]">
        <MainHeader toggleSidebar={toggleSidebar} />
        <main className="pt-5 px-5 bg-white flex-1 overflow-auto">
            {children}
        </main>
      </div>
    </div>
  );
}
