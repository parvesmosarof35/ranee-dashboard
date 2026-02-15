"use client";

import { useState } from "react";
import { Eye, EyeOff, ChevronLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { buttonbg, textPrimary } from "@/contexts/theme";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { useChangePasswordMutation } from "@/store/api/authApi";
import { toast } from "sonner";

export default function ChangePasswordPage() {
    const router = useRouter();
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const [oldpassword, setOldpassword] = useState("");
    const [newpassword, setNewpassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newpassword !== confirmpassword) {
            toast.error("New passwords do not match");
            return;
        }

        try {
            console.log("Submitting Password Change:", { oldpassword, newpassword });
            const res = await changePassword({ oldpassword, newpassword }).unwrap();
            if (res?.success) {
                toast.success(res.message || "Password changed successfully");
                router.push("/admin/settings");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to change password");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Change Password</h1>
                <div className="w-10"></div> {/* Spacer for alignment */}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">

                    {/* Old Password */}
                    <div className="w-full">
                        <label className={`text-base ${textPrimary} mb-2 font-semibold block`}>
                            Old Password
                        </label>
                        <div className="w-full relative">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                value={oldpassword}
                                onChange={(e) => setOldpassword(e.target.value)}
                                placeholder="Enter your old password"
                                className="w-full px-5 py-3 border border-[#6A6D76] rounded-md outline-none focus:border-blue-500 transition-colors"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="w-full">
                        <label className={`text-base ${textPrimary} mb-2 font-semibold block`}>
                            New Password
                        </label>
                        <div className="w-full relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newpassword}
                                onChange={(e) => setNewpassword(e.target.value)}
                                placeholder="**********"
                                className="w-full px-5 py-3 border border-[#6A6D76] rounded-md outline-none focus:border-blue-500 transition-colors"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="w-full">
                        <label className={`text-base ${textPrimary} mb-2 font-semibold block`}>
                            Confirm New Password
                        </label>
                        <div className="w-full relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmpassword}
                                onChange={(e) => setConfirmpassword(e.target.value)}
                                placeholder="**********"
                                className="w-full px-5 py-3 border border-[#6A6D76] rounded-md outline-none focus:border-blue-500 transition-colors"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <AnimatedButton
                            text={isLoading ? "Updating..." : "Update Password"}
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
