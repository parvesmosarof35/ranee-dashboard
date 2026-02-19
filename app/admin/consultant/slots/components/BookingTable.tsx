"use client";

import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { buttonbg } from "@/contexts/theme";

interface BookingTableProps {
    bookings: any[];
    isLoading: boolean;
    meta: any;
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
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= meta.totalPage) {
            setPage(newPage);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Paid": return "bg-green-100 text-green-700 border-green-200";
            case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
            case "Failed": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">My Slots</h2>
                    <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-orange-100 px-3 py-1">
                        Total: {meta.total}
                    </Badge>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50">
                                <TableHead>Client</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Meeting Type</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Chat</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                        No bookings found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                bookings.map((booking: any) => (
                                    <TableRow key={booking._id} className="hover:bg-gray-50/50 border-b-gray-100 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {booking.user?.images && booking.user.images[0] ? (
                                                    <img src={booking.user.images[0]} alt={booking.user_details?.name || "User"} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold">
                                                        {(booking.user_details?.name || "U").charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-gray-800 text-sm">{booking.user_details?.name || "Unknown User"}</p>
                                                    <p className="text-xs text-gray-500">{booking.user_details?.email}</p>
                                                    {booking.user_details?.phone && (
                                                        <p className="text-xs text-gray-400">{booking.user_details.phone}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-800 text-sm">{booking.service?.title}</span>
                                                <span className="text-xs text-gray-500">{booking.service?.duration} mins</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-800 text-sm">
                                                    {booking.date ? new Date(booking.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: '2-digit' }) : "N/A"}
                                                </span>
                                                <span className="text-xs text-gray-500">{booking.slot_time}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`font-normal ${booking.meeting_type === 'Online' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                'bg-purple-50 text-purple-600 border-purple-200'
                                                }`}>
                                                {booking.meeting_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`font-medium border ${getStatusColor(booking.payment_status)}`}>
                                                {booking.payment_status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-bold text-gray-700">
                                            ${booking.service?.price}
                                        </TableCell>
                                        <TableCell>
                                            {booking.conversation ? (
                                                <Link href={`/admin/consultant/chat/${booking.conversation}?receiverId=${booking.user?._id}`}>
                                                    <div className={`${buttonbg} text-white px-3 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity inline-block`}>
                                                        Chat
                                                    </div>
                                                </Link>
                                            ) : (
                                                <span className="text-gray-400 text-xs">N/A</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="p-4 flex justify-center">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }}
                                className={page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-white hover:shadow-sm cursor-pointer"}
                            />
                        </PaginationItem>
                        {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((p) => (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    href="#"
                                    isActive={p === page}
                                    onClick={(e) => { e.preventDefault(); handlePageChange(p as number); }}
                                    className={p === page ? `shadow-sm ${buttonbg} border-none text-white` : "hover:bg-white hover:shadow-sm cursor-pointer"}
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }}
                                className={page >= meta.totalPage ? "pointer-events-none opacity-50" : "hover:bg-white hover:shadow-sm cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
