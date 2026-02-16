"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, Trash2, Info } from "lucide-react";
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

interface ServiceTableProps {
    services: any[];
    isLoading: boolean;
    meta: any;
    page: number;
    setPage: (page: number) => void;
    onView: (service: any) => void;
    onEdit: (service: any) => void;
    onDelete: (id: string) => void;
    viewMode: "list" | "grid";
}

export function ServiceTable({
    services,
    isLoading,
    meta,
    page,
    setPage,
    onView,
    onEdit,
    onDelete,
    viewMode,
}: ServiceTableProps) {
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

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">Existing Services</h2>
                    <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-orange-100 px-3 py-1">
                        Total: {meta.total}
                    </Badge>
                </div>

                {viewMode === "list" ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead>Service Info</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Availability</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                            No services found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    services.map((service: any) => (
                                        <TableRow key={service._id} className="hover:bg-gray-50/50 border-b-gray-100 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {service.imgs && service.imgs[0] ? (
                                                        <img src={service.imgs[0]} alt={service.title} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                    )}
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-gray-800">{service.title}</p>
                                                            {service.isFeatured && (
                                                                <Badge className="text-[10px] h-4 px-1 bg-yellow-400 text-yellow-900 border-yellow-500">
                                                                    Featured
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500">{service.duration} mins • {service.consultant_ids?.length || 0} consultants</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-normal border-gray-200 text-gray-600 bg-white shadow-sm">
                                                    {service.category_id?.name || "N/A"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${service.availability_type === 'Online' ? 'bg-green-100 text-green-700' :
                                                    service.availability_type === 'Offline' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-purple-100 text-purple-700'
                                                    }`}>
                                                    {service.availability_type}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-700">${service.price}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => onView(service)} className="hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                                        <Info className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => onEdit(service)} className="hover:bg-green-50 hover:text-green-600 transition-colors">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => onDelete(service._id)} className="hover:bg-red-50 hover:text-red-600 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                No services found matching your criteria.
                            </div>
                        ) : (
                            services.map((service: any) => (
                                <div key={service._id} className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
                                    <div className="relative h-40 bg-gray-100">
                                        {service.imgs && service.imgs[0] ? (
                                            <img src={service.imgs[0]} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                        {service.isFeatured && (
                                            <Badge className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 border-yellow-500 shadow-sm">
                                                Featured
                                            </Badge>
                                        )}
                                        <div className="absolute bottom-2 left-2">
                                            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-800 border-none shadow-sm font-semibold">
                                                ${service.price}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <Badge variant="outline" className="text-[10px] text-gray-500 border-gray-200 mb-1">
                                                    {service.category_id?.name || "Uncategorized"}
                                                </Badge>
                                                <h3 className="font-bold text-gray-800 line-clamp-1" title={service.title}>{service.title}</h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-50">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${service.availability_type === 'Online' ? 'bg-green-100 text-green-700' :
                                                service.availability_type === 'Offline' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-purple-100 text-purple-700'
                                                }`}>
                                                {service.availability_type}
                                            </span>
                                            <span className="text-xs text-gray-400 ml-auto">{service.duration} mins</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-gray-50/50 border-t border-gray-100 flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => onView(service)} className="flex-1 hover:bg-white hover:border-blue-200 hover:text-blue-600 text-xs">
                                            <Info className="h-3 w-3 mr-1.5" /> Details
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => onEdit(service)} className="flex-1 hover:bg-white hover:border-green-200 hover:text-green-600 text-xs">
                                            <Edit className="h-3 w-3 mr-1.5" /> Edit
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => onDelete(service._id)} className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 w-8 h-8">
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Pagination is always visible outside the conditional rendering blocks */}
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
