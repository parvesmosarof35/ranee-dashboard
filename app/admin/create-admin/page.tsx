"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShieldCheck, Trash2, Camera, Upload, UserPlus } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { buttonbg, textPrimary, textSecondarygray, borderPrimary } from "@/contexts/theme";

// Mock Data for Existing Admins
const initialAdmins = [
    { id: 1, name: "Super Admin", email: "admin@example.com", role: "Super Admin", status: "Active" },
    { id: 2, name: "John Doe", email: "john.admin@example.com", role: "Admin", status: "Active" },
    { id: 3, name: "Jane Smith", email: "jane.admin@example.com", role: "Editor", status: "Inactive" },
    { id: 4, name: "Mike Manager", email: "mike@example.com", role: "Manager", status: "Active" },
    { id: 5, name: "Sarah Support", email: "sarah@example.com", role: "Support", status: "Active" },
];

export default function CreateAdminPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: null as string | null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [admins, setAdmins] = useState(initialAdmins);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            setIsSubmitting(false);
            return;
        }

        // Mock API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("New admin created successfully!");
            // Add new admin to the list mock
            const newAdmin = {
                id: Date.now(),
                name: formData.fullName,
                email: formData.email,
                role: "Admin",
                status: "Active"
            };
            setAdmins([...admins, newAdmin]);
            setFormData({ fullName: "", email: "", password: "", confirmPassword: "", image: null });
        }, 1500);
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this admin?")) {
            setAdmins(admins.filter(admin => admin.id !== id));
            toast.success("Admin deleted successfully");
        }
    };

    const primaryColorHex = "#F3AB0C"; // Derived from theme for inline styles if needed

    return (
        <div className="w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${textPrimary}`}>Admin Management</h1>
                    <p className={`${textSecondarygray} mt-1`}>Create manage and oversee administrative accounts.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Create Admin Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
                        <div className={`p-6 border-b border-gray-100 bg-gray-50/50`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${buttonbg} shadow-md`}>
                                    <UserPlus className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-800">Add New Admin</h2>
                            </div>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Image Upload */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                       
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
                                        <Input
                                            id="fullName"
                                            placeholder="e.g. John Doe"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            required
                                            className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                required
                                                className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                required
                                                className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className={`w-full h-12 text-base font-semibold shadow-md mt-2 ${buttonbg}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating Account...
                                        </span>
                                    ) : (
                                        "Create Admin Account"
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Column: Existing Admins List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Existing Administrators</h2>
                                <p className={`text-sm ${textSecondarygray}`}>Manage current admin roles and permissions</p>
                            </div>
                            <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-orange-100 px-3 py-1">
                                Total: {admins.length}
                            </Badge>
                        </div>

                        <div className="flex-1 overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b-gray-100">
                                        <TableHead className="font-semibold text-gray-600">Admin Details</TableHead>
                                        <TableHead className="font-semibold text-gray-600">Role</TableHead>
                                        <TableHead className="font-semibold text-gray-600">Status</TableHead>
                                        <TableHead className="text-right font-semibold text-gray-600">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {admins.map((admin) => (
                                        <TableRow key={admin.id} className="hover:bg-gray-50/50 border-b-gray-100 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-gray-400 to-gray-600 shadow-sm`}>
                                                        {admin.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{admin.name}</p>
                                                        <p className="text-xs text-gray-500">{admin.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-medium border-gray-200 text-gray-600 bg-white shadow-sm">
                                                    {admin.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${admin.status === 'Active'
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-gray-100 text-gray-600 border-gray-200'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${admin.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                    {admin.status}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-lg"
                                                        onClick={() => handleDelete(admin.id)}
                                                        title="Delete Admin"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#" onClick={(e) => e.preventDefault()} className="hover:bg-white hover:shadow-sm" />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#" isActive onClick={(e) => e.preventDefault()} className={`shadow-sm ${buttonbg} border-none`}>1</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#" onClick={(e) => e.preventDefault()} className="hover:bg-white hover:shadow-sm">2</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#" onClick={(e) => e.preventDefault()} className="hover:bg-white hover:shadow-sm">3</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext href="#" onClick={(e) => e.preventDefault()} className="hover:bg-white hover:shadow-sm" />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
