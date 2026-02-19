"use client";

import { useState, useEffect } from "react";
import { buttonbg, textPrimary, textSecondarygray } from "@/contexts/theme";
import { useAuth } from "@/contexts/auth-context";
import { useGetAllServicesQuery } from "@/store/api/serviceApi";
import { useGetAllCategoriesQuery } from "@/store/api/categoryApi";

// Components
import { ConsultantServiceFilters } from "./components/ConsultantServiceFilters";
import { ConsultantServiceTable } from "./components/ConsultantServiceTable";
import { ServiceDetailsModal } from "../../service/components/ServiceDetailsModal";

export default function ConsultantServicesPage() {
    const { user } = useAuth();
    
    // State for filtering and pagination
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterType, setFilterType] = useState(""); // Online, Offline, Both
    const [filterSort, setFilterSort] = useState(""); // newest, oldest, price_low, price_high

    // State for view mode
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");

    // State for details view
    const [selectedService, setSelectedService] = useState<any>(null);

    // Initialize viewMode from localStorage
    useEffect(() => {
        const savedViewMode = localStorage.getItem("consultantServiceViewMode");
        if (savedViewMode === "grid" || savedViewMode === "list") {
            setViewMode(savedViewMode);
        }
    }, []);

    // Save viewMode to localStorage whenever it changes
    const handleViewModeChange = (mode: "list" | "grid") => {
        setViewMode(mode);
        localStorage.setItem("consultantServiceViewMode", mode);
    };

    // Prepare API params based on filters
    const queryParams: any = { 
        page, 
        limit, 
        searchTerm,
        instructor_id: user?._id // Filter by current consultant
    };

    if (filterCategory && filterCategory !== "All Categories") queryParams.category_id = filterCategory;
    if (filterType && filterType !== "All Types") queryParams.type = filterType;

    if (filterSort === "newest") queryParams.time = "newest";
    if (filterSort === "oldest") queryParams.time = "oldest";
    if (filterSort === "price_low") queryParams.price = "lowest";
    if (filterSort === "price_high") queryParams.price = "highest";

    // API Hooks
    // Skip fetching if user is not loaded yet to avoid unnecessary calls with undefined instructor_id
    const { data: servicesData, isLoading: isLoadingServices } = useGetAllServicesQuery(queryParams, {
        skip: !user?._id
    });
    const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 100 });

    const services = servicesData?.data || [];
    const meta = servicesData?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };
    const categories = categoriesData?.data || [];

    const handleView = (service: any) => {
        setSelectedService(service);
    };

    const closeViewModal = () => {
        setSelectedService(null);
    };

    return (
        <div className="w-full mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold ${textPrimary}`}>My Services</h1>
                    <p className={`${textSecondarygray} mt-1`}>View and manage your consultation services.</p>
                </div>
            </div>

            {/* Filters Bar */}
            <ConsultantServiceFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterType={filterType}
                setFilterType={setFilterType}
                filterSort={filterSort}
                setFilterSort={setFilterSort}
                setPage={setPage}
                categories={categories}
                viewMode={viewMode}
                setViewMode={handleViewModeChange}
            />

            {/* Service Table / List */}
            <ConsultantServiceTable
                services={services}
                isLoading={isLoadingServices}
                meta={meta}
                page={page}
                setPage={setPage}
                onView={handleView}
                viewMode={viewMode}
            />

            {/* Service Details Modal */}
            <ServiceDetailsModal
                service={selectedService}
                onClose={closeViewModal}
            />
        </div>
    );
}
