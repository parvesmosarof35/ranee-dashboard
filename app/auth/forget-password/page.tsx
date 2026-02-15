"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { buttonbg, textPrimary } from "@/contexts/theme";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { useForgotPasswordMutation } from "@/store/api/authApi";
import { toast } from "sonner";

function ForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();
      if (res?.success) {
        toast.success(res.message || "Verification code sent to your email");
        sessionStorage.setItem("resetEmail", email);
        router.push("/auth/verification-code");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send verification code");
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5">
      <div className="container mx-auto">
        <div className="flex  justify-center items-center ">
          <div className="w-full md:w-1/2 lg:w-1/2 p-5 md:px-[100px] md:py-[200px] bg-white  shadow-[0px_10px_20px_rgba(0,0,0,0.2)] rounded-2xl">
            <div className="flex justify-center items-center">
              <Image className="mx-auto my-5" src="/logo.png" alt="Logo" width={200} height={200} />
            </div>
            <h2 className={`text-2xl  font-bold text-center mb-5 ${textPrimary}`}>
              Forgot password ?
            </h2>
            <form className="space-y-5" onSubmit={handleSendCode}>
              <div>
                <label className={`text-xl ${textPrimary} mb-2 font-bold`}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5 placeholder:text-xl"
                  required
                />
              </div>

              <div className="flex justify-center items-center">
                <div className="w-1/3 mt-5">
                  <AnimatedButton
                    text={isLoading ? "Sending..." : "Send Code"}
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

export default ForgetPassword;
