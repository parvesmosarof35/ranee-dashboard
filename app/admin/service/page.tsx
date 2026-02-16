"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { buttonbg, textPrimary, textSecondarygray } from "@/contexts/theme";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useGetAllServicesQuery, useCreateServiceMutation, useUpdateServiceMutation, useDeleteServiceMutation } from "@/store/api/serviceApi";
import { useGetAllCategoriesQuery } from "@/store/api/categoryApi";
import { useGetAllConsultantsQuery } from "@/store/api/adminApi";
import Swal from "sweetalert2";

// Components
import { ServiceFilters } from "./components/ServiceFilters";
import { ServiceTable } from "./components/ServiceTable";
import { ServiceFormModal } from "./components/ServiceFormModal";
import { ServiceDetailsModal } from "./components/ServiceDetailsModal";

export default function ServiceManagementPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    // State for filtering and pagination
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterType, setFilterType] = useState(""); // Online, Offline, Both
    const [filterSort, setFilterSort] = useState(""); // newest, oldest, price_low, price_high
    const [filterInstructor, setFilterInstructor] = useState("");

    // State for view mode
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");

    // State for form & modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);

    // State for details view
    const [selectedService, setSelectedService] = useState<any>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    // Initialize viewMode from localStorage
    useEffect(() => {
        const savedViewMode = localStorage.getItem("serviceViewMode");
        if (savedViewMode === "grid" || savedViewMode === "list") {
            setViewMode(savedViewMode);
        }
    }, []);

    // Save viewMode to localStorage whenever it changes
    const handleViewModeChange = (mode: "list" | "grid") => {
        setViewMode(mode);
        localStorage.setItem("serviceViewMode", mode);
    };

    // Prepare API params based on filters
    const queryParams: any = { page, limit, searchTerm };

    if (filterCategory && filterCategory !== "All Categories") queryParams.category_id = filterCategory;
    if (filterType && filterType !== "All Types") queryParams.type = filterType;
    if (filterInstructor && filterInstructor !== "All Instructors") queryParams.instructor_id = filterInstructor;

    if (filterSort === "newest") queryParams.time = "newest";
    if (filterSort === "oldest") queryParams.time = "oldest";
    if (filterSort === "price_low") queryParams.price = "lowest";
    if (filterSort === "price_high") queryParams.price = "highest";

    // API Hooks
    const { data: servicesData, isLoading: isLoadingServices, refetch } = useGetAllServicesQuery(queryParams);
    const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 100 });
    const { data: consultantsData } = useGetAllConsultantsQuery({ limit: 100 });

    const [createService, { isLoading: isSubmittingCreate }] = useCreateServiceMutation();
    const [updateService, { isLoading: isSubmittingUpdate }] = useUpdateServiceMutation();
    const [deleteService] = useDeleteServiceMutation();

    const services = servicesData?.data || [];
    const meta = servicesData?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

    const categories = categoriesData?.data || [];
    const consultants = consultantsData?.data || [];

    const handleEdit = (service: any) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
    };

    const handleView = (service: any) => {
        setSelectedService(service);
    };

    const closeViewModal = () => {
        setSelectedService(null);
    };

    const handleSubmit = async (formData: FormData) => {
        try {
            if (editingService) {
                await updateService({ id: editingService._id, formData }).unwrap();
                toast.success("Service updated successfully!");
            } else {
                await createService(formData).unwrap();
                toast.success("Service created successfully!");
                // Reset filters to default to show the new service (assuming new services are shown by default or user wants a clean view)
                setSearchTerm("");
                setFilterCategory("");
                setFilterType("");
                setFilterSort("newest");
                setFilterInstructor("");
                setPage(1);
            }
            handleCloseModal();
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to ${editingService ? "update" : "create"} service`);
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
                    await deleteService(id).unwrap();
                    Swal.fire("Deleted!", "Service has been deleted.", "success");
                    refetch();
                } catch (error: any) {
                    Swal.fire("Error!", error?.data?.message || "Failed to delete service", "error");
                }
            }
        });
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth");
        } else if (user && user.role !== "superAdmin" && user.role !== "admin") {
            router.push("/admin/dashboard");
        }
    }, [isAuthenticated, user, router]);

    return (
        <div className="w-full mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold ${textPrimary}`}>Service Management</h1>
                    <p className={`${textSecondarygray} mt-1`}>Manage services offered on the platform.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setIsModalOpen(true)} className={`${buttonbg} text-white`}>
                        <Plus className="w-4 h-4 mr-2" /> Add New Service
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <ServiceFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterType={filterType}
                setFilterType={setFilterType}
                filterSort={filterSort}
                setFilterSort={setFilterSort}
                filterInstructor={filterInstructor}
                setFilterInstructor={setFilterInstructor}
                setPage={setPage}
                categories={categories}
                consultants={consultants}
                viewMode={viewMode}
                setViewMode={handleViewModeChange}
            />

            {/* Service Table / List */}
            <ServiceTable
                services={services}
                isLoading={isLoadingServices}
                meta={meta}
                page={page}
                setPage={setPage}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                viewMode={viewMode}
            />

            {/* Modal Overlay for Form */}
            <ServiceFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                editingService={editingService}
                categories={categories}
                consultants={consultants}
                onSubmit={handleSubmit}
                isSubmitting={isSubmittingCreate || isSubmittingUpdate}
            />

            {/* Service Details Modal */}
            <ServiceDetailsModal
                service={selectedService}
                onClose={closeViewModal}
            />
        </div>
    );
}
