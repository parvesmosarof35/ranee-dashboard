"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Trash2,
    Edit,
    Loader2,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { buttonbg, textPrimary } from "@/contexts/theme";
import { 
    useGetAllDiscountsQuery, 
    useCreateDiscountMutation, 
    useDeleteDiscountMutation, 
    useUpdateDiscountMutation 
} from "@/store/api/discountApi";
import { toast } from "sonner";
import Swal from "sweetalert2";

// Types
type Discount = {
    _id: string;
    title: string;
    description: string;
    useablecode: string;
    maxusetimes?: number;
    limitPerUser: number;
    percentage: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export default function DiscountPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    // State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        useablecode: "",
        maxusetimes: 100,
        limitPerUser: 1,
        percentage: 0,
        isActive: true,
    });

    // Queries
    const { data: discountsData, isLoading } = useGetAllDiscountsQuery({});
    const [createDiscount, { isLoading: isCreating }] = useCreateDiscountMutation();
    const [updateDiscount, { isLoading: isUpdating }] = useUpdateDiscountMutation();
    const [deleteDiscount] = useDeleteDiscountMutation();
    
    const discounts: Discount[] = discountsData?.data || [];

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth");
        } else if (user && (user.role !== "admin" && user.role !== "superAdmin")) {
            router.push("/");
        }
    }, [isAuthenticated, user, router]);

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            useablecode: "",
            maxusetimes: 100,
            limitPerUser: 1,
            percentage: 0,
            isActive: true,
        });
        setEditId(null);
    };

    const handleEdit = (discount: Discount) => {
        setEditId(discount._id);
        setFormData({
            title: discount.title,
            description: discount.description,
            useablecode: discount.useablecode,
            maxusetimes: discount.maxusetimes || 100,
            limitPerUser: discount.limitPerUser,
            percentage: discount.percentage,
            isActive: discount.isActive,
        });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.useablecode || formData.percentage <= 0) {
            toast.error("Please fill in all required fields (Title, Code, and Percentage > 0)");
            return;
        }

        try {
            if (editId) {
                await updateDiscount({ id: editId, ...formData }).unwrap();
                toast.success("Discount updated successfully");
            } else {
                await createDiscount(formData).unwrap();
                toast.success("Discount created successfully");
            }
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to ${editId ? 'update' : 'create'} discount`);
            console.error("Save discount error:", error);
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
                    await deleteDiscount(id).unwrap();
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your discount has been deleted.",
                        icon: "success"
                    });
                } catch (error: any) {
                    Swal.fire({
                        title: "Error!",
                        text: error?.data?.message || "Failed to delete discount",
                        icon: "error"
                    });
                }
            }
        });
    };

    if (!user || (user.role !== "admin" && user.role !== "superAdmin")) return null;

    const isSaving = isCreating || isUpdating;

    return (
        <div className="min-h-screen bg-transparent space-y-4">
            {/* Header */}
            <div className={`${buttonbg} rounded-t-xl p-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4`}>
                <h1 className="text-2xl font-bold text-white">Discount Management</h1>
                <Button
                    onClick={handleAdd}
                    className={`bg-white ${textPrimary} hover:bg-white/90 font-bold w-full md:w-auto`}
                >
                    + Add Discount
                </Button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 overflow-hidden -mt-4 relative z-10 min-h-[500px] flex flex-col p-5">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[#2E6F65]" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-white">
                                    <TableRow>
                                        <TableHead className={`font-semibold text-base py-5 ${textPrimary} pl-6`}>S.ID</TableHead>
                                        <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Title</TableHead>
                                        <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Code</TableHead>
                                        <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Percentage</TableHead>
                                        <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Usage</TableHead>
                                        <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Status</TableHead>
                                        <TableHead className={`font-semibold text-base py-5 ${textPrimary} text-right pr-6`}>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {discounts.map((discount, i) => (
                                        <TableRow key={discount._id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                            <TableCell className="font-medium text-gray-600 py-4 pl-6">{(i + 1).toString().padStart(2, '0')}</TableCell>
                                            <TableCell className="text-gray-900 font-medium py-4">{discount.title}</TableCell>
                                            <TableCell className="text-gray-900 font-bold py-4">
                                                <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                                    {discount.useablecode}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-gray-600 py-4">{discount.percentage}%</TableCell>
                                            <TableCell className="text-gray-600 py-4">
                                                {discount.maxusetimes || '∞'} max / {discount.limitPerUser} per user
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {discount.isActive ? (
                                                    <div className="flex items-center gap-1 text-green-600">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span className="text-sm font-medium">Active</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-red-500">
                                                        <XCircle className="w-4 h-4" />
                                                        <span className="text-sm font-medium">Inactive</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-4 pr-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button 
                                                        onClick={() => handleDelete(discount._id)}
                                                        className="text-red-500 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEdit(discount)}
                                                        className="text-gray-800 hover:text-black transition-colors"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {discounts.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                                                No discounts found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}
            </div>

            {/* Add/Edit Discount Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 animate-in fade-in zoom-in duration-200 space-y-6 my-8">
                        <div className="text-center">
                            <h2 className={`text-2xl font-bold ${textPrimary}`}>{editId ? "Edit Discount" : "Add Discount"}</h2>
                            <p className="text-sm text-gray-500 mt-1">{editId ? "Update discount details." : "Create a new discount for users."}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <Label>Title *</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Grand Opening Sale"
                                />
                            </div>

                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter description..."
                                    className="min-h-[80px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Discount Code *</Label>
                                <Input
                                    value={formData.useablecode}
                                    onChange={(e) => setFormData({ ...formData, useablecode: e.target.value.toUpperCase() })}
                                    placeholder="e.g. RENEE25"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Percentage (%) *</Label>
                                <Input
                                    type="number"
                                    value={formData.percentage}
                                    onChange={(e) => setFormData({ ...formData, percentage: Number(e.target.value) })}
                                    placeholder="e.g. 25"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Max Usage Times</Label>
                                <Input
                                    type="number"
                                    value={formData.maxusetimes}
                                    onChange={(e) => setFormData({ ...formData, maxusetimes: Number(e.target.value) })}
                                    placeholder="100"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Limit Per User</Label>
                                <Input
                                    type="number"
                                    value={formData.limitPerUser}
                                    onChange={(e) => setFormData({ ...formData, limitPerUser: Number(e.target.value) })}
                                    placeholder="1"
                                />
                            </div>

                            <div className="flex items-center space-x-2 pt-4">
                                <Switch
                                    id="is-active"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                                <Label htmlFor="is-active">Is Active</Label>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    resetForm();
                                }}
                                variant="outline"
                                className={`flex-1 ${textPrimary} border-gray-200 hover:bg-gray-50`}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button
                                className={`flex-1 ${buttonbg}`}
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    editId ? "Update Discount" : "Save Discount"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
