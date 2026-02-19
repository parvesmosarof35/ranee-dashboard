"use client";

import { useState } from "react";
import { buttonbg, textPrimary, textSecondarygray } from "@/contexts/theme";
import { useGetAllBookedDataForConsultantQuery } from "@/store/api/bookingApi";

// Components
import { BookingFilters } from "./components/BookingFilters";
import { BookingTable } from "./components/BookingTable";

export default function ConsultantSlotsPage() {
    // State for filtering and pagination
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");

    // Prepare API params based on filters
    const queryParams: any = { 
        page, 
        limit,
    };

    if (status) queryParams.status = status;
    if (date) queryParams.date = date;

    // API Hook
    const { data: bookingsData, isLoading: isLoadingBookings } = useGetAllBookedDataForConsultantQuery(queryParams);

    const bookings = bookingsData?.data || [];
    const meta = bookingsData?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

    return (
        <div className="w-full mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold ${textPrimary}`}>My Bookings</h1>
                    <p className={`${textSecondarygray} mt-1`}>View and manage your upcoming and past bookings.</p>
                </div>
            </div>

            {/* Filters Bar */}
            <BookingFilters
                status={status}
                setStatus={setStatus}
                date={date}
                setDate={setDate}
                setPage={setPage}
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
