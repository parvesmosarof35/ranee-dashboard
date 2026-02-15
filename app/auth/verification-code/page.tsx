"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { buttonbg, textPrimary } from "@/contexts/theme";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { useVerifyEmailMutation } from "@/store/api/authApi";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { setUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";

function VerificationCode() {
  const [code, setCode] = useState(new Array(6).fill(""));
  const router = useRouter();
  const dispatch = useDispatch();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error("Email not found. Please try again.");
      router.push("/auth/forget-password");
    }
  }, [router]);

  const handleChange = (value: string, index: number) => {
    if (!isNaN(Number(value))) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  const handleVerifyCode = async () => {
    const verificationCode = parseInt(code.join(""));
    try {
      const res = await verifyEmail({ verificationCode }).unwrap();

      if (res?.success && res.data?.accessToken) {
        const token = res.data.accessToken;
        const user = jwtDecode(token);

        dispatch(setUser({ user, token }));
        toast.success(res.message || "Email verified successfully");
        sessionStorage.setItem("resetToken", token);
        router.push(`/auth/reset-password`);
      } else {
        toast.error("Verification successful but token missing.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Verification failed");
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
              Verification code
            </h2>
            <p className="text-center text-gray-500 mb-5">
              Enter the code sent to {email}
            </p>

            <div className="space-y-5">
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    className="shadow-xs w-12 h-12 text-2xl text-center border border-[#6A6D76] text-[#0d0d0d] rounded-lg focus:outline-none"
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-center items-center my-5">
              <div className="w-1/3 mt-5">
                <AnimatedButton
                  text={isLoading ? "Verifying..." : "Verify Code"}
                  onClick={handleVerifyCode}
                  type="button"
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
            </div>
            <p className="text-[#6A6D76] text-center mb-10">
              You have not received the email?{" "}
              <span className={`${textPrimary} cursor-pointer`}> Resend</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationCode;
