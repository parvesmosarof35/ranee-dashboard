"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, Mail, Phone, User, Lock, Save, Edit2, ShieldCheck, MapPin, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  buttonbg,
  activeTabClass,
  textPrimary,
  textSecondarygray,
  activeTabBG
} from "@/contexts/theme";
import { useGetMyProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from "@/store/api/authApi";
import { getImageUrl } from "@/store/config/envConfig";
import { useAuth } from "@/contexts/auth-context";

export default function ProfilePage() {
  const { data: profileData } = useGetMyProfileQuery({});
  const { user: authUser } = useAuth();
  const user = profileData?.data || authUser;
  const [activeTab, setActiveTab] = useState("edit-profile");

  return (
    <div className="flex-1 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0D0D0D]">Profile Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <Card className="border-border/40 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-4 group">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-50 relative flex items-center justify-center">
                  {user?.photo ? (
                    <Image
                      src={getImageUrl(user.photo)}
                      alt="Profile"
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <span className="text-4xl font-bold text-gray-400">{user?.fullname?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                {/* <div className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera className={`w-4 h-4 ${textPrimary}`} />
                </div> */}
              </div>

              <h3 className={`text-xl font-bold ${textSecondarygray} mb-1`}>{user?.fullname || "Admin User"}</h3>
              {/* <div className={`px-3 py-1 rounded-full bg-opacity-10 ${activeTabBG} ${textSecondarygray} bg-opacity-10 text-xs font-medium uppercase tracking-wider mb-4`}>
                <span className="text-[#2E6F65]">{user?.role || "Administrator"}</span>
              </div> */}

              <div className="w-full space-y-4 mt-4">
                <div className="flex items-center justify-between text-sm border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Role</span>
                  <span className="text-gray-900 font-medium capitalize">
                    {user?.role}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Joined</span>
                  <span className="font-medium text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-8 xl:col-span-9">
          <Tabs defaultValue="edit-profile" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start h-auto p-1 bg-gray-100/50 rounded-lg mb-6 gap-1">
              <TabsTrigger
                value="edit-profile"
                className={`flex-1 sm:flex-none data-[state=active]:shadow-sm px-6 py-2.5 rounded-md transition-all gap-2 ${activeTabClass}`}
              >
                <User className="w-4 h-4" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger
                value="change-password"
                className={`flex-1 sm:flex-none data-[state=active]:shadow-sm px-6 py-2.5 rounded-md transition-all gap-2 ${activeTabClass}`}
              >
                <ShieldCheck className="w-4 h-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <div className="bg-white border border-gray-200/60 rounded-xl shadow-sm overflow-hidden">
              <TabsContent value="edit-profile" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
                <EditProfileForm user={user} />
              </TabsContent>

              <TabsContent value="change-password" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
                <ChangePasswordForm />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components (Forms) ---

function EditProfileForm({ user }: { user: any }) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullname: "",
    phoneNumber: "",
    email: "",
    address: "",
    gender: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || "",
        address: user.address || "",
        gender: user.gender || "",
      });
      if (user.photo) {
        setImagePreview(getImageUrl(user.photo));
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullname.trim()) {
      toast.error("Validation Error", { description: "Name is required" });
      return;
    }

    try {
      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("address", formData.address);
      data.append("gender", formData.gender);
      if (selectedFile) {
        data.append("file", selectedFile);
      }

      const res = await updateProfile(data).unwrap();
      if (res.success) {
        toast.success("Profile Updated", { description: "Your profile details have been saved." });
      }

    } catch (error: any) {
      toast.error(error?.data?.message || "Update Failed");
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-500">Update your personal details and public profile information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Image Upload */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
            {imagePreview ? (
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                className="pl-10 focus-visible:ring-[#F3AB0C] border-gray-200 bg-gray-50/30"
                placeholder="Enter full name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Contact Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="pl-10 focus-visible:ring-[#F3AB0C] border-gray-200 bg-gray-50/30"
                placeholder="Enter contact number"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                value={formData.email}
                disabled
                className="pl-10 bg-gray-100/50 text-gray-500 border-gray-200 cursor-not-allowed"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Gender</Label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#F3AB0C] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <textarea
              name="address"
              rows={3}
              className="w-full min-h-[80px] rounded-md border border-gray-200 bg-gray-50/30 pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3AB0C] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter your address..."
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <Button
            type="submit"
            disabled={isLoading}
            className={`${buttonbg} min-w-[120px] shadow-sm`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ChangePasswordForm() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [formData, setFormData] = useState({ oldpassword: "", newpassword: "", confirmpassword: "" });

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.oldpassword || !formData.newpassword || !formData.confirmpassword) {
      toast.error("Validation Error", { description: "All fields are required" });
      return;
    }
    if (formData.newpassword !== formData.confirmpassword) {
      toast.error("Validation Error", { description: "Passwords do not match" });
      return;
    }

    try {
      console.log("Submitting Password Change:", { oldpassword: formData.oldpassword, newpassword: formData.newpassword });
      const res = await changePassword({
        oldpassword: formData.oldpassword,
        newpassword: formData.newpassword
      }).unwrap();

      if (res.success) {
        toast.success("Security Updated", { description: "Password changed successfully." });
        setFormData({ oldpassword: "", newpassword: "", confirmpassword: "" });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
        <p className="text-sm text-gray-500">Ensure your account is secure by using a strong password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type={showOldPass ? "text" : "password"}
                name="oldpassword"
                value={formData.oldpassword}
                onChange={handleChange}
                className="pl-10 pr-10 focus-visible:ring-[#F3AB0C] border-gray-200 bg-gray-50/30"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowOldPass(!showOldPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Separator className="my-2 bg-gray-100" />

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type={showNewPass ? "text" : "password"}
                name="newpassword"
                value={formData.newpassword}
                onChange={handleChange}
                className="pl-10 pr-10 focus-visible:ring-[#F3AB0C] border-gray-200 bg-gray-50/30"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type={showConfirmPass ? "text" : "password"}
                name="confirmpassword"
                value={formData.confirmpassword}
                onChange={handleChange}
                className="pl-10 pr-10 focus-visible:ring-[#F3AB0C] border-gray-200 bg-gray-50/30"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <Button
            type="submit"
            disabled={isLoading}
            className={`${buttonbg} min-w-[140px] shadow-sm`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Updating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Update Password
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
