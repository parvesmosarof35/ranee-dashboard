import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShieldCheck, Trash2, UserPlus, Loader2, Eye, EyeOff } from "lucide-react";
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
import { buttonbg, textPrimary, textSecondarygray } from "@/contexts/theme";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useCreateAdminMutation, useGetAllAdminsQuery, useDeleteAdminMutation } from "@/store/api/adminApi";
import Swal from "sweetalert2";

export default function CreateAdminPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    // API Hooks
    const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
    const { data: adminsData, isLoading: isLoadingAdmins } = useGetAllAdminsQuery({});
    const [deleteAdmin] = useDeleteAdminMutation();

    // State
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Handle potential data structures or empty states
    console.log("adminsData:", adminsData);
    const admins = Array.isArray(adminsData?.data) ? adminsData.data : (Array.isArray(adminsData) ? adminsData : []);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth");
        } else if (user && user.role !== "superAdmin") {
            router.push("/admin/dashboard");
        }
    }, [isAuthenticated, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const payload = {
            fullname: formData.fullname,
            email: formData.email,
            password: formData.password,
            isVerify: true,
            role: "admin",
        };

        try {
            await createAdmin(payload).unwrap();
            toast.success("New admin created successfully!");
            setFormData({
                fullname: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create admin");
        }
    };

    const handleDelete = async (id: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteAdmin(id).unwrap();
                    Swal.fire({
                        title: "Deleted!",
                        text: "Admin has been deleted.",
                        icon: "success"
                    });
                } catch (error: any) {
                    Swal.fire({
                        title: "Error!",
                        text: error?.data?.message || "Failed to delete admin",
                        icon: "error"
                    });
                }
            }
        });
    };

    if (!user || user.role !== "superAdmin") return null;

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

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullname" className="text-gray-700 font-medium">Full Name</Label>
                                        <Input
                                            id="fullname"
                                            placeholder="John Doe"
                                            value={formData.fullname}
                                            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
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
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    required
                                                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    required
                                                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className={`w-full h-12 text-base font-semibold shadow-md mt-2 ${buttonbg}`}
                                    disabled={isCreating}
                                >
                                    {isCreating ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
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
                                <p className={`text-sm ${textSecondarygray} mt-1`}>Manage current admin roles and permissions</p>
                            </div>
                            <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-orange-100 px-3 py-1">
                                Total: {admins.length}
                            </Badge>
                        </div>

                        <div className="flex-1 overflow-auto">
                            {isLoadingAdmins ? (
                                <div className="flex items-center justify-center h-40">
                                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                                </div>
                            ) : (
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
                                        {admins.map((admin: any) => (
                                            <TableRow key={admin._id} className="hover:bg-gray-50/50 border-b-gray-100 transition-colors">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-gray-400 to-gray-600 shadow-sm`}>
                                                            {admin.fullname?.charAt(0) || admin.name?.charAt(0) || "A"}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-800">{admin.fullname || admin.name}</p>
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
                                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${!admin.isBlocked
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-red-50 text-red-700 border-red-200'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${!admin.isBlocked ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                        {!admin.isBlocked ? "Active" : "Blocked"}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-lg"
                                                            onClick={() => handleDelete(admin._id)}
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
                            )}
                        </div>

                        {/* Pagination - Placeholder */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#" className="hover:bg-white hover:shadow-sm" />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#" isActive className={`shadow-sm ${buttonbg} border-none`}>1</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext href="#" className="hover:bg-white hover:shadow-sm" />
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
