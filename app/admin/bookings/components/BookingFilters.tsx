"use client";

import { DebouncedInput } from "@/components/ui/debounced-input";
import { Search } from "lucide-react";

interface BookingFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterConsultant: string;
    setFilterConsultant: (id: string) => void;
    filterStatus: string;
    setFilterStatus: (status: string) => void;
    setPage: (page: number) => void;
    consultants: any[];
}

export function BookingFilters({
    searchTerm,
    setSearchTerm,
    filterConsultant,
    setFilterConsultant,
    filterStatus,
    setFilterStatus,
    setPage,
    consultants,
}: BookingFiltersProps) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">


            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap md:flex-nowrap">
                <select
                    className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-full md:w-auto"
                    value={filterConsultant}
                    onChange={(e) => {
                        setFilterConsultant(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Consultants</option>
                    {consultants.map((con: any) => (
                        <option key={con._id} value={con._id}>
                            {con.fullname || con.name || con.email}
                        </option>
                    ))}
                </select>

                <select
                    className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-full md:w-auto"
                    value={filterStatus}
                    onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Statuses</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Unpaid</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
        </div>
    );
}
