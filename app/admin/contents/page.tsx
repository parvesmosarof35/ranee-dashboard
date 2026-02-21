"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Save, Globe, Mail, MapPin, Phone, 
  Facebook, Instagram, Twitter, Linkedin, Youtube, Music2, Send 
} from "lucide-react";
import { buttonbg, textPrimary, textSecondarygray } from "@/contexts/theme";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  useGetSocialMediaLinksQuery, 
  useUpdateSocialMediaLinksMutation 
} from "@/store/api/contactApi";
import { toast } from "sonner";

export default function ContentsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Social Data
  const { data: socialData, isLoading: isSocialLoading } = useGetSocialMediaLinksQuery({});
  const [updateSocialLinks, { isLoading: isUpdating }] = useUpdateSocialMediaLinksMutation();
  const [socialSettings, setSocialSettings] = useState<any>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    } else if (user && (user.role !== "admin" && user.role !== "superAdmin")) {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (socialData?.data) {
      setSocialSettings(socialData.data);
    }
  }, [socialData]);

  const handleSocialChange = (key: string, field: 'url' | 'isActive', value: any) => {
    setSocialSettings((prev: any) => ({
      ...prev,
      [key]: {
        ...(prev[key] || { url: '', isActive: false }),
        [field]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      const { _id, createdAt, updatedAt, __v, ...dataToSave } = socialSettings;
      await updateSocialLinks(dataToSave).unwrap();
      toast.success("Settings updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update settings");
    }
  };

  if (!user || (user.role !== "admin" && user.role !== "superAdmin")) return null;

  return (
    <div className="w-full mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${textPrimary}`}>Site Management</h1>
          <p className={`${textSecondarygray} mt-1`}>Configure your business details and social media presence.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Business Presence</h2>
            <p className="text-sm text-gray-500 mt-1">Configure your public contact details and social media links.</p>
          </div>
          <Button 
            onClick={handleSaveSettings} 
            className={`${buttonbg} flex items-center gap-2`}
            disabled={isUpdating}
          >
            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>

        {isSocialLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-emerald-600">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-gray-500 font-medium">Loading settings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Contact Basics */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b pb-2">Business Details</h3>
              
              <SettingField 
                label="App Name / Business Name" 
                icon={<Globe className="w-4 h-4" />} 
                value={socialSettings?.appName}
                onChange={(f, v) => handleSocialChange('appName', f, v)}
              />

              <SettingField 
                label="Email Address" 
                icon={<Mail className="w-4 h-4" />} 
                value={socialSettings?.email}
                onChange={(f, v) => handleSocialChange('email', f, v)}
              />

              <SettingField 
                label="Phone Number" 
                icon={<Phone className="w-4 h-4" />} 
                value={socialSettings?.phone}
                onChange={(f, v) => handleSocialChange('phone', f, v)}
              />

              <SettingField 
                label="Physical Address" 
                icon={<MapPin className="w-4 h-4" />} 
                value={socialSettings?.address}
                onChange={(f, v) => handleSocialChange('address', f, v)}
              />
              
              <SettingField 
                label="Website URL" 
                icon={<Globe className="w-4 h-4" />} 
                value={socialSettings?.website}
                onChange={(f, v) => handleSocialChange('website', f, v)}
              />
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b pb-2">Social Profiles</h3>
              
              <SettingField 
                label="Facebook" 
                icon={<Facebook className="w-4 h-4" />} 
                value={socialSettings?.facebook}
                onChange={(f, v) => handleSocialChange('facebook', f, v)}
              />

              <SettingField 
                label="Instagram" 
                icon={<Instagram className="w-4 h-4" />} 
                value={socialSettings?.instagram}
                onChange={(f, v) => handleSocialChange('instagram', f, v)}
              />

              <SettingField 
                label="Twitter / X" 
                icon={<Twitter className="w-4 h-4" />} 
                value={socialSettings?.twitter}
                onChange={(f, v) => handleSocialChange('twitter', f, v)}
              />

              <SettingField 
                label="LinkedIn" 
                icon={<Linkedin className="w-4 h-4" />} 
                value={socialSettings?.linkedin}
                onChange={(f, v) => handleSocialChange('linkedin', f, v)}
              />

              <SettingField 
                label="YouTube" 
                icon={<Youtube className="w-4 h-4" />} 
                value={socialSettings?.youtube}
                onChange={(f, v) => handleSocialChange('youtube', f, v)}
              />

              <SettingField 
                label="TikTok" 
                icon={<Music2 className="w-4 h-4" />} 
                value={socialSettings?.tiktok}
                onChange={(f, v) => handleSocialChange('tiktok', f, v)}
              />

              <SettingField 
                label="WhatsApp" 
                icon={<Send className="w-4 h-4" />} 
                value={socialSettings?.whatsapp}
                onChange={(f, v) => handleSocialChange('whatsapp', f, v)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const SettingField = ({ label, icon, value, onChange }: { label: string, icon: React.ReactNode, value: any, onChange: (field: 'url' | 'isActive', val: any) => void }) => {
  return (
    <div className="space-y-2 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{icon}</span>
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase ${value?.isActive ? 'text-green-500' : 'text-gray-300'}`}>
            {value?.isActive ? 'Active' : 'Inactive'}
          </span>
          <Switch 
            checked={value?.isActive || false} 
            onCheckedChange={(checked) => onChange('isActive', checked)}
          />
        </div>
      </div>
      <Input 
        value={value?.url || ''} 
        onChange={(e) => onChange('url', e.target.value)}
        placeholder={`Enter ${label.toLowerCase()}...`}
        className="h-9 text-sm"
      />
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);
