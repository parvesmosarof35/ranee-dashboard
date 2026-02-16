"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { Pagination } from "@/components/ui/pagination";

interface BookingTableProps {
    bookings: any[];
    isLoading: boolean;
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    page: number;
    setPage: (page: number) => void;
}

export function BookingTable({
    bookings,
    isLoading,
    meta,
    page,
    setPage,
}: BookingTableProps) {
    if (isLoading) {
        return <div className="text-center py-10">Loading bookings...</div>;
    }

    /*
     * We need to handle pagination manually since the Pagination component 
     * from shadcn might differ in implementation.
     * Assuming a simple pagination usage based on the meta data.
     */

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="w-[250px]">Service</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Consultant</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                                    No bookings found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            bookings.map((booking) => (
                                <TableRow key={booking._id} className="hover:bg-gray-50/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-100">
                                                <Avatar className="h-full w-full rounded-none">
                                                    <AvatarImage
                                                        src={booking.service?.imgs?.[0] || ""}
                                                        alt={booking.service?.title}
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback className="rounded-none bg-gray-100">
                                                        {booking.service?.title?.charAt(0) || "S"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-gray-900 line-clamp-1">
                                                    {booking.service?.title || "Unknown Service"}
                                                </span>
                                                <Badge variant="outline" className="w-fit text-[10px] px-1.5 py-0 h-5 font-normal text-gray-500 border-gray-200">
                                                    {booking.service?.availability_type || "N/A"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">
                                                {booking.user?.name || booking.user?.email || "User"}
                                            </span>
                                            {booking.user?.name && (
                                                <span className="text-xs text-gray-500">
                                                    {booking.user?.email}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">
                                                {booking.consultant?.fullname || booking.consultant?.name || booking.consultant?.email || "Consultant"}
                                            </span>
                                            {(booking.consultant?.fullname || booking.consultant?.name) && (
                                                <span className="text-xs text-gray-500">
                                                    {booking.consultant?.email}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm text-gray-600">
                                            <span>
                                                {booking.date
                                                    ? new Date(booking.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })
                                                    : "N/A"
                                                }
                                            </span>
                                            <span className="text-xs text-gray-400">{booking.slot_time}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={booking.payment_status === "Paid" ? "default" : "secondary"}
                                            className={
                                                booking.payment_status === "Paid"
                                                    ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shadow-none"
                                                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200 shadow-none"
                                            }
                                        >
                                            {booking.payment_status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium text-gray-900">
                                            ${booking.service?.price}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {/* Using meeting type or creating a derived status if needed */}
                                        <div className="text-sm text-gray-600">
                                            {booking.meeting_type}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {meta.totalPage > 1 && (
                <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                        Page {meta.page} of {meta.totalPage}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(Math.min(meta.totalPage, page + 1))}
                            disabled={page === meta.totalPage}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
