"use client";

import { useState, useEffect } from "react";
import { textPrimary, textSecondarygray } from "@/contexts/theme";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useGetAllBookingsQuery, useGetAllConsultantsQuery } from "@/store/api/adminApi";

// Components
import { BookingFilters } from "./components/BookingFilters";
import { BookingTable } from "./components/BookingTable";

export default function BookingsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    // State for filtering and pagination
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterConsultant, setFilterConsultant] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    // API Params
    const queryParams: any = { page, limit };
    if (searchTerm) queryParams.searchTerm = searchTerm; // Note: API might not support search yet based on previous conversation, but adding for future or if it does
    if (filterConsultant) queryParams.consultantid = filterConsultant;
    if (filterStatus) queryParams.status = filterStatus;

    // API Hooks
    const { data: bookingsData, isLoading: isLoadingBookings } = useGetAllBookingsQuery(queryParams);
    const { data: consultantsData } = useGetAllConsultantsQuery({ limit: 100 });

    const bookings = bookingsData?.data || [];
    const meta = bookingsData?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };
    const consultants = consultantsData?.data || [];

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
                    <h1 className={`text-3xl font-bold ${textPrimary}`}>Booking Management</h1>
                    <p className={`${textSecondarygray} mt-1`}>View and manage all bookings.</p>
                </div>
            </div>

            {/* Filters Bar */}
            <BookingFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterConsultant={filterConsultant}
                setFilterConsultant={setFilterConsultant}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                setPage={setPage}
                consultants={consultants}
            />

            {/* Booking Table */}
            <BookingTable
                bookings={bookings}
                isLoading={isLoadingBookings}
                meta={meta}
                page={page}
                setPage={setPage}
            />
        </div>
    );
}
