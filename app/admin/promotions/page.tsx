"use client";

import { useState } from "react";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  Image as ImageIcon,
  X,
  Upload
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  buttonbg, 
  textSecondarygray, 
  activeTabClass,
} from "@/contexts/theme";
import {
  useGetWebsitePromotionsQuery,
  useCreateWebsitePromotionMutation,
  useUpdateWebsitePromotionMutation,
  useDeleteWebsitePromotionMutation,
  useGetProductPromotionsQuery,
  useCreateProductPromotionMutation,
  useUpdateProductPromotionMutation,
  useDeleteProductPromotionMutation,
  useGetVendorsPromotionsQuery,
  useCreateVendorsPromotionMutation,
  useUpdateVendorsPromotionMutation,
  useDeleteVendorsPromotionMutation,
} from "@/store/api/promotionApi";
import Swal from "sweetalert2";

// promotion type enum
type PromotionType = "website" | "product" | "vendors";

interface Promotion {
  _id: string;
  title: string;
  description: string;
  link: string;
  img: string;
}

export default function PromotionsPage() {
    const [activeTab, setActiveTab] = useState<PromotionType>("website");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
    
    // Website Hooks
    const { data: websiteData, isLoading: isWebsiteLoading } = useGetWebsitePromotionsQuery(undefined);
    const [createWebsite] = useCreateWebsitePromotionMutation();
    const [updateWebsite] = useUpdateWebsitePromotionMutation();
    const [deleteWebsite] = useDeleteWebsitePromotionMutation();

    // Product Hooks
    const { data: productData, isLoading: isProductLoading } = useGetProductPromotionsQuery(undefined);
    const [createProduct] = useCreateProductPromotionMutation();
    const [updateProduct] = useUpdateProductPromotionMutation();
    const [deleteProduct] = useDeleteProductPromotionMutation();

    // Vendors Hooks
    const { data: vendorsData, isLoading: isVendorsLoading } = useGetVendorsPromotionsQuery(undefined);
    const [createVendors] = useCreateVendorsPromotionMutation();
    const [updateVendors] = useUpdateVendorsPromotionMutation();
    const [deleteVendors] = useDeleteVendorsPromotionMutation();

    const promotions = {
        website: websiteData?.data || [],
        product: productData?.data || [],
        vendors: vendorsData?.data || [],
    };

    const handleOpenModal = (promotion: Promotion | null = null) => {
        setEditingPromotion(promotion);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingPromotion(null);
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This promotion will be moved to trash!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#F96803",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                if (activeTab === "website") await deleteWebsite(id).unwrap();
                else if (activeTab === "product") await deleteProduct(id).unwrap();
                else if (activeTab === "vendors") await deleteVendors(id).unwrap();
                Swal.fire("Deleted!", "Promotion has been deleted.", "success");
            } catch (error: any) {
                Swal.fire("Error", error?.data?.message || "Failed to delete promotion", "error");
            }
        }
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                   <h1 className="text-2xl font-bold text-gray-900">Promotions Management</h1>
                   <p className={textSecondarygray}>Manage your website, product and vendor promotions here.</p>
                </div>
                <Button onClick={() => handleOpenModal()} className={`${buttonbg} rounded-xl px-6 py-6 shadow-lg hover:scale-[1.02] transition-all`}>
                    <Plus className="w-5 h-5 mr-2" />
                    Add Promotion
                </Button>
            </div>

            <Tabs defaultValue="website" onValueChange={(v) => setActiveTab(v as PromotionType)} className="w-full">
                <TabsList className="bg-white border p-1.5 rounded-2xl mb-8 shadow-sm inline-flex w-full md:w-auto h-auto">
                    <TabsTrigger value="website" className={`${activeTabClass} rounded-xl px-8 py-2.5 font-semibold transition-all`}>Website</TabsTrigger>
                    <TabsTrigger value="product" className={`${activeTabClass} rounded-xl px-8 py-2.5 font-semibold transition-all`}>Product</TabsTrigger>
                    <TabsTrigger value="vendors" className={`${activeTabClass} rounded-xl px-8 py-2.5 font-semibold transition-all`}>Vendors</TabsTrigger>
                </TabsList>

                <TabsContent value="website" className="mt-0">
                    <PromotionsTable 
                        data={promotions.website} 
                        isLoading={isWebsiteLoading} 
                        onEdit={handleOpenModal} 
                        onDelete={handleDelete} 
                    />
                </TabsContent>
                <TabsContent value="product" className="mt-0">
                    <PromotionsTable 
                         data={promotions.product} 
                         isLoading={isProductLoading} 
                         onEdit={handleOpenModal} 
                         onDelete={handleDelete} 
                    />
                </TabsContent>
                <TabsContent value="vendors" className="mt-0">
                    <PromotionsTable 
                         data={promotions.vendors} 
                         isLoading={isVendorsLoading} 
                         onEdit={handleOpenModal} 
                         onDelete={handleDelete} 
                    />
                </TabsContent>
            </Tabs>

            {isModalOpen && (
                <PromotionModal 
                    type={activeTab}
                    promotion={editingPromotion}
                    onClose={handleCloseModal}
                    mutations={{
                        createWebsite, updateWebsite,
                        createProduct, updateProduct,
                        createVendors, updateVendors
                    }}
                />
            )}
        </div>
    );
}

// Table Component
function PromotionsTable({ data, isLoading, onEdit, onDelete }: any) {
    if (isLoading) return (
        <div className="bg-white border rounded-2xl p-20 flex flex-col items-center justify-center space-y-4 shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            <p className="text-gray-500 font-medium">Fetching promotions...</p>
        </div>
    );
    
    if (!data.length) return (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-20 text-center space-y-4 shadow-sm animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <ImageIcon className="w-10 h-10 text-orange-400" />
            </div>
            <div className="max-w-xs mx-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-1">No promotions yet</h3>
                <p className="text-gray-500 text-sm">Click the "Add Promotion" button to get started with your first promotion.</p>
            </div>
        </div>
    );

    return (
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
                            <TableHead className="w-[120px] py-4 pl-6 text-gray-900 font-bold">Image</TableHead>
                            <TableHead className="py-4 text-gray-900 font-bold">Details</TableHead>
                            <TableHead className="hidden md:table-cell py-4 text-gray-900 font-bold">Link</TableHead>
                            <TableHead className="text-right py-4 pr-6 text-gray-900 font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((promo: Promotion) => (
                            <TableRow key={promo._id} className="hover:bg-gray-50/80 transition-colors border-b border-gray-50 last:border-0">
                                <TableCell className="py-4 pl-6">
                                    <div className="group relative w-16 h-16 rounded-xl bg-gray-100 overflow-hidden border border-gray-100 shadow-sm transition-transform hover:scale-105">
                                        <img src={promo.img} alt="" className="w-full h-full object-cover" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="font-bold text-gray-900 text-base">{promo.title}</div>
                                    <div className="text-sm text-gray-500 line-clamp-1 max-w-[280px] mt-0.5">{promo.description}</div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell py-4">
                                    <a 
                                        href={promo.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold hover:bg-blue-100 transition-colors"
                                    >
                                        Visit Link <ExternalLink className="w-3 h-3 ml-1.5" />
                                    </a>
                                </TableCell>
                                <TableCell className="text-right py-4 pr-6">
                                    <div className="flex justify-end gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => onEdit(promo)} 
                                            className="h-10 w-10 text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                                        >
                                            <Pencil className="w-4.5 h-4.5" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => onDelete(promo._id)} 
                                            className="h-10 w-10 text-red-600 hover:bg-red-50 rounded-full transition-all"
                                        >
                                            <Trash2 className="w-4.5 h-4.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// Modal Component
function PromotionModal({ type, promotion, onClose, mutations }: any) {
    const isEditing = !!promotion;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: promotion?.title || "",
        description: promotion?.description || "",
        link: promotion?.link || "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(promotion?.img || "");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const dataObj = { ...formData };
        const formDataPayload = new FormData();
        formDataPayload.append("data", JSON.stringify(dataObj));
        if (selectedFile) {
            formDataPayload.append("file", selectedFile);
        }

        try {
            if (isEditing) {
                if (type === "website") await mutations.updateWebsite({ id: promotion._id, data: formDataPayload }).unwrap();
                else if (type === "product") await mutations.updateProduct({ id: promotion._id, data: formDataPayload }).unwrap();
                else if (type === "vendors") await mutations.updateVendors({ id: promotion._id, data: formDataPayload }).unwrap();
                Swal.fire("Updated!", "Promotion has been updated successfully.", "success");
            } else {
                if (type === "website") await mutations.createWebsite(formDataPayload).unwrap();
                else if (type === "product") await mutations.createProduct(formDataPayload).unwrap();
                else if (type === "vendors") await mutations.createVendors(formDataPayload).unwrap();
                Swal.fire("Created!", "New promotion has been created successfully.", "success");
            }
            onClose();
        } catch (error: any) {
            Swal.fire("Error", error?.data?.message || "Something went wrong while saving the promotion.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in duration-300">
                <div className={`p-8 ${buttonbg} text-white flex justify-between items-center relative overflow-hidden`}>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase">{isEditing ? "Edit Promotion" : "Create Promotion"}</h2>
                        <p className="text-white/80 text-xs font-semibold mt-1 uppercase tracking-widest">{type} Section</p>
                    </div>
                    <button onClick={onClose} className="hover:rotate-90 transition-transform bg-white/20 p-2 rounded-full backdrop-blur-sm z-10">
                        <X className="w-5 h-5" />
                    </button>
                    {/* Decorative Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-5">
                       <Label className="text-xs font-black uppercase tracking-widest text-gray-400 pl-1">Visual Asset</Label>
                        <div className="group relative flex flex-col items-center justify-center p-2 border-2 border-dashed border-gray-200 rounded-[1.5rem] bg-gray-50/50 hover:border-orange-300 hover:bg-orange-50/30 transition-all cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                            {previewUrl ? (
                                <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md">
                                   <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity backdrop-blur-[2px]">
                                       <Upload className="w-8 h-8 mb-2 animate-bounce" /> 
                                       <span className="font-bold text-sm uppercase tracking-tighter">Replace Creative</span>
                                   </div>
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="w-8 h-8 text-orange-400" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 uppercase tracking-tighter">Drop your creative here</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Recommended: 1200x630 (PNG/JPG)</p>
                                </div>
                            )}
                            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-gray-400 pl-1">Headline</Label>
                                <Input 
                                    id="title" 
                                    required 
                                    value={formData.title} 
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. SUMMER DISCOVERY"
                                    className="h-12 border-gray-100 rounded-xl focus:ring-orange-500 bg-gray-50/50 font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="link" className="text-xs font-black uppercase tracking-widest text-gray-400 pl-1">Redirect URL</Label>
                                <Input 
                                    id="link" 
                                    type="url" 
                                    required 
                                    value={formData.link} 
                                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                                    placeholder="https://renee.com/promotion"
                                    className="h-12 border-gray-100 rounded-xl focus:ring-orange-500 bg-gray-50/50 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-gray-400 pl-1">Supporting Copy</Label>
                            <Textarea 
                                id="description" 
                                value={formData.description} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Write a compelling description for this promotion..."
                                className="min-h-[120px] border-gray-100 rounded-2xl focus:ring-orange-500 bg-gray-50/50 p-4 resize-none font-medium text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 rounded-xl font-bold border-gray-200 text-gray-500 hover:bg-gray-50">Cancel</Button>
                        <Button type="submit" disabled={loading} className={`flex-1 h-12 rounded-xl font-extrabold uppercase tracking-tighter shadow-lg hover:shadow-orange-200 transition-all ${buttonbg}`}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {isEditing ? "Update Promotion" : "Publish Now"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
