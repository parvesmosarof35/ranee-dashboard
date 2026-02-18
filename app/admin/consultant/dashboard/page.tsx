"use client";

import {
    useGetConsultantTotalServicesQuery,
    useGetConsultantTotalClientsQuery,
    useGetConsultantTotalEarningsQuery,
    useGetConsultantServedClientsQuery,
} from "@/store/api/dashboardStatsApi";
import { useAuth } from "@/contexts/auth-context";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { buttonbg, textSecondarygray } from "@/contexts/theme";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ConsultantDashboard() {
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    // Fetch Stats
    const { data: servicesData, isLoading: servicesLoading } = useGetConsultantTotalServicesQuery(undefined);
    const { data: clientsData, isLoading: clientsLoading } = useGetConsultantTotalClientsQuery(undefined);
    const { data: earningsData, isLoading: earningsLoading } = useGetConsultantTotalEarningsQuery(undefined);

    // Fetch Served Clients with Pagination
    const { data: servedClientsData, isLoading: tableLoading } = useGetConsultantServedClientsQuery({ page: currentPage, limit });

    const stats = {
        totalServices: servicesData?.data?.totalServices || 0,
        totalClients: clientsData?.data?.totalClients || 0,
        totalEarnings: earningsData?.data?.totalEarnings || 0,
    };

    const servedClients = servedClientsData?.data || [];
    const meta = servedClientsData?.meta || { totalPage: 1 };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= meta.totalPage) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.fullname || "Consultant"}!</h1>
                <p className="text-gray-500 mt-2">Here is your dashboard overview.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Total Services</h3>
                    <p className="text-3xl font-bold text-[#F96803] mt-2">
                        {servicesLoading ? "..." : stats.totalServices}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Total Clients</h3>
                    <p className="text-3xl font-bold text-[#F96803] mt-2">
                        {clientsLoading ? "..." : stats.totalClients}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Total Earnings</h3>
                    <p className="text-3xl font-bold text-[#F96803] mt-2">
                        {earningsLoading ? "..." : `$${stats.totalEarnings.toLocaleString()}`}
                    </p>
                </div>
            </div>

            {/* Served Clients Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className={`p-5 ${buttonbg} text-white`}>
                    <h2 className="text-xl font-bold">Served Clients</h2>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-gray-100 hover:bg-transparent">
                                <TableHead className="text-black font-semibold pl-6">S.ID</TableHead>
                                <TableHead className="text-black font-semibold">Client Name</TableHead>
                                <TableHead className="text-black font-semibold">Email</TableHead>
                                <TableHead className="text-black font-semibold">Phone</TableHead>
                                <TableHead className="text-black font-semibold">Service</TableHead>
                                <TableHead className="text-black font-semibold">Price</TableHead>
                                <TableHead className="text-black font-semibold">Booking Date</TableHead>
                                <TableHead className="text-black font-semibold pr-6">Slot Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tableLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">Loading clients...</TableCell>
                                </TableRow>
                            ) : servedClients.length > 0 ? (
                                servedClients.map((client: any, index: number) => (
                                    <TableRow key={index} className="hover:bg-gray-50 border-b border-gray-100">
                                        <TableCell className="font-medium text-gray-600 pl-6">{client.serialId || index + 1}</TableCell>
                                        <TableCell className="font-medium text-gray-900">{client.clientName}</TableCell>
                                        <TableCell className="text-gray-600">{client.clientEmail}</TableCell>
                                        <TableCell className="text-gray-600">{client.clientPhone}</TableCell>
                                        <TableCell className="text-gray-600">{client.serviceName}</TableCell>
                                        <TableCell className="text-gray-900 font-semibold">${client.servicePrice}</TableCell>
                                        <TableCell className="text-gray-600">{client.bookingDate}</TableCell>
                                        <TableCell className="text-gray-600 pr-6">{client.slotTime}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">No served clients found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {meta.totalPage > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                            Page {currentPage} of {meta.totalPage}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === meta.totalPage}
                                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${currentPage === meta.totalPage ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
