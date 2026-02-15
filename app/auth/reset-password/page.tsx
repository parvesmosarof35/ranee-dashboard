"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { buttonbg, textPrimary } from "@/contexts/theme";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { useResetPasswordMutation } from "@/store/api/authApi";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { UserRole } from "@/types";

interface CustomJwtPayload {
  id: string;
  role: UserRole;
  email: string;
  iat: number;
  exp: number;
}

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("resetToken");
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        if (decoded?.id) {
          setUserId(decoded.id);
        } else {
          toast.error("Invalid token. Please try again.");
          router.push("/auth/forget-password");
        }
      } catch (error) {
        toast.error("Invalid token. Please try again.");
        router.push("/auth/forget-password");
      }
    } else {
      toast.error("Session expired. Please try again.");
      router.push("/auth/forget-password");
    }
  }, [router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!userId) {
      toast.error("User not identified");
      return;
    }

    try {
      const res = await resetPassword({ userId, password }).unwrap();
      if (res?.success) {
        toast.success("Password reset successfully");
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("resetToken");
        router.push("/auth");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5">
      <div className="container mx-auto">
        <div className="flex  justify-center items-center">
          <div className="w-full lg:w-1/2 bg-white p-5 md:px-18 md:py-28 shadow-[0px_10px_20px_rgba(0,0,0,0.2)] rounded-2xl">
            <div className="flex justify-center items-center">
              <Image className="mx-auto my-5" src="/logo.png" alt="Logo" width={200} height={200} />
            </div>
            <h2 className={`text-2xl  font-bold text-center mb-5 ${textPrimary}`}>
              Set a new password
            </h2>
            <p className={`text-[#6A6D76] text-center mb-10 `}>
              Create a new password. Ensure it differs from previous ones for
              security
            </p>
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div className="w-full">
                <label className={`text-xl ${textPrimary} mb-2 font-bold`}>
                  New Password
                </label>
                <div className="w-full relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="**********"
                    className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5 placeholder:text-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 bottom-4 flex items-center text-[#6A6D76]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="w-full">
                <label className={`text-xl ${textPrimary} mb-2 font-bold`}>
                  Confirm New Password
                </label>
                <div className="w-full relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="**********"
                    className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5 placeholder:text-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 bottom-4 flex items-center text-[#6A6D76]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-1/3 mt-5">
                  <AnimatedButton
                    text={isLoading ? "Updating..." : "Update Password"}
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
