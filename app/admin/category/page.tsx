"use client";

import { useState, useRef, useEffect } from "react";
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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Trash2,
    Edit,
    Plus,
    Loader2,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { activeTabBG, buttonbg, textPrimary } from "@/contexts/theme";
import { useGetAllCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation, useUpdateCategoryMutation } from "@/store/api/categoryApi";
import { toast } from "sonner";
import Swal from "sweetalert2";

// Types
type Category = {
    _id: string;
    name: string;
    description: string;
    img: string;
    createdAt: string;
    updatedAt: string;
};

export default function CategoryPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    // State
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("not required");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Queries
    const { data: categoriesData, isLoading } = useGetAllCategoriesQuery({ page, limit });
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const categories: Category[] = categoriesData?.data || [];
    const meta = categoriesData?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth");
        } else if (user && (user.role !== "admin" && user.role !== "superAdmin")) {
            router.push("/");
        }
    }, [isAuthenticated, user, router]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setName("");
        setDescription("not required");
        setImagePreview(null);
        setEditId(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleEdit = (category: Category) => {
        setEditId(category._id);
        setName(category.name);
        setDescription(category.description || "not required");
        setImagePreview(category.img);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!name) {
            toast.error("Category name is required");
            return;
        }

        const formData = new FormData();
        const data = {
            name,
            description
        };
        formData.append("data", JSON.stringify(data));
        
        if (fileInputRef.current?.files?.[0]) {
            formData.append("file", fileInputRef.current.files[0]);
        }

        try {
            if (editId) {
                await updateCategory({ id: editId, data: formData }).unwrap();
                toast.success("Category updated successfully");
            } else {
                await createCategory(formData).unwrap();
                toast.success("Category created successfully");
            }
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to ${editId ? 'update' : 'create'} category`);
            console.error("Save category error:", error);
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
                    await deleteCategory(id).unwrap();
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your category has been deleted.",
                        icon: "success"
                    });
                } catch (error: any) {
                    Swal.fire({
                        title: "Error!",
                        text: error?.data?.message || "Failed to delete category",
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
                <h1 className="text-2xl font-bold text-white">Categories</h1>
                <Button
                    onClick={handleAdd}
                    className={`bg-white ${textPrimary} hover:bg-white/90 font-bold w-full md:w-auto`}
                >
                    + Add Category
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
                                    <TableRow className="">
                                        <TableHead className={`font-semibold text-base py-5 ${textPrimary} pl-6`}>S.ID</TableHead>
                                        <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Image</TableHead>
                                        <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Category Name</TableHead>
                                        <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Description</TableHead>
                                        <TableHead className={`font-semibold text-base py-5 ${textPrimary} text-right pr-6`}>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.map((cat, i) => (
                                        <TableRow key={cat._id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                            <TableCell className="font-medium text-gray-600 py-4 pl-6">{((page - 1) * limit + i + 1).toString().padStart(2, '0')}</TableCell>
                                            <TableCell className="py-4">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-gray-100 border border-gray-200">
                                                    {cat.img ? (
                                                        <Image
                                                            src={cat.img}
                                                            alt={cat.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <span className="text-xs">No Img</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-900 font-medium py-4">{cat.name}</TableCell>
                                            <TableCell className="text-gray-600 py-4 max-w-xs truncate">{cat.description}</TableCell>
                                            <TableCell className="py-4 pr-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button 
                                                        onClick={() => handleDelete(cat._id)}
                                                        className="text-red-500 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEdit(cat)}
                                                        className="text-gray-800 hover:text-black transition-colors"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {categories.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                                                No categories found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-gray-100 mt-auto">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious 
                                            href="#" 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page > 1) setPage(p => p - 1);
                                            }}
                                            className={`${page <= 1 ? "pointer-events-none opacity-50" : ""} text-gray-500 hover:text-[#2E6F65]`} 
                                        />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink 
                                            href="#" 
                                            isActive 
                                            className={`${activeTabBG} text-white hover:bg-[#2E6F65]/90 hover:text-white border-0`}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext 
                                            href="#" 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page < meta.totalPage) setPage(p => p + 1);
                                            }}
                                            className={`${page >= meta.totalPage ? "pointer-events-none opacity-50" : ""} text-gray-500 hover:text-[#2E6F65]`} 
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </>
                )}
            </div>

            {/* Add/Edit Category Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-in fade-in zoom-in duration-200 space-y-6">
                        <div className="text-center">
                            <h2 className={`text-2xl font-bold ${textPrimary}`}>{editId ? "Edit Category" : "Add Category"}</h2>
                            <p className="text-sm text-gray-500 mt-1">{editId ? "Update category details." : "Create a new category for the platform."}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Category Name</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Fitness"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description (Optional)</Label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter description..."
                                    className="min-h-[80px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Category Image</Label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-32 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors relative overflow-hidden"
                                >
                                    {imagePreview ? (
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-500">
                                            <Plus className="w-8 h-8 text-gray-400" />
                                            <span className="text-xs font-medium">Click to upload image</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
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
                                    editId ? "Update Category" : "Save Category"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
