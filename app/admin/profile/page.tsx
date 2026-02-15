"use client";

import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect } from "react";
import { Camera, Mail, Phone, User, Lock, Save, Edit2, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  buttonbg,
  activeTabClass,
  textPrimary,
  textSecondarygray,
  activeTabBG
} from "@/contexts/theme";

export default function ProfilePage() {
  const { user } = useAuth();
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
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-50 relative">
                  <Image
                    src="/caribee.png"
                    alt="Profile"
                    fill
                    className="object-contain p-2"
                    priority
                  />
                </div>
                <div className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera className={`w-4 h-4 ${textPrimary}`} />
                </div>
              </div>

              <h3 className={`text-xl font-bold ${textSecondarygray} mb-1`}>{user?.fullName || "Admin User"}</h3>
              <div className={`px-3 py-1 rounded-full bg-opacity-10 ${activeTabBG} ${textSecondarygray} bg-opacity-10 text-xs font-medium uppercase tracking-wider mb-4`}>
                <span className="text-[#2E6F65]">{user?.role || "Administrator"}</span>
              </div>

              <div className="w-full space-y-4 mt-4">
                <div className="flex items-center justify-between text-sm border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Status</span>
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Joined</span>
                  <span className="font-medium text-gray-900">Oct 24, 2023</span>
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
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    bio: ""
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || "Admin User",
        phone: "+1 (555) 000-0000",
        email: user?.email || "admin@example.com",
        bio: "Senior Administrator managing platform operations."
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Validation Error", { description: "Name is required" });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Profile Updated", { description: "Your profile details have been saved." });
    } catch (error) {
      toast.error("Update Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-500">Update your personal details and public profile information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                name="name"
                value={formData.name}
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
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="pl-10 focus-visible:ring-[#F3AB0C] border-gray-200 bg-gray-50/30"
                placeholder="Enter contact number"
              />
            </div>
          </div>
        </div>

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
          <p className="text-[11px] text-gray-400 pl-1">Email address cannot be changed. Contact support for assistance.</p>
        </div>

        <div className="space-y-2 pt-2">
          <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">About</Label>
          <textarea
            name="bio"
            rows={4}
            className="w-full min-h-[100px] rounded-md border border-gray-200 bg-gray-50/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3AB0C] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Tell us a little about yourself..."
            value={formData.bio}
            onChange={handleInputChange}
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" className="border-gray-200 hover:bg-gray-50 hover:text-gray-900">
            Cancel
          </Button>
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
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("Validation Error", { description: "All fields are required" });
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Validation Error", { description: "Passwords do not match" });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Security Updated", { description: "Password changed successfully." });
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setIsLoading(false);
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
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="pl-10 focus-visible:ring-[#F3AB0C] border-gray-200 bg-gray-50/30"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Separator className="my-2 bg-gray-100" />

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="pl-10 focus-visible:ring-[#F3AB0C] border-gray-200 bg-gray-50/30"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 focus-visible:ring-[#F3AB0C] border-gray-200 bg-gray-50/30"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" className="border-gray-200 hover:bg-gray-50 hover:text-gray-900">
            Cancel
          </Button>
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
