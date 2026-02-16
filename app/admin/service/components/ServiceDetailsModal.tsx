"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";

interface ServiceDetailsModalProps {
    service: any;
    onClose: () => void;
}

export function ServiceDetailsModal({ service, onClose }: ServiceDetailsModalProps) {
    if (!service) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 relative">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 text-black backdrop-blur-md rounded-full"
                >
                    <X className="w-5 h-5" />
                </Button>

                <div className="relative h-48 bg-gray-100">
                    {service.imgs && service.imgs[0] ? (
                        <img src={service.imgs[0]} alt={service.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image Available
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 pt-12">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-bold text-white">{service.title}</h2>
                            {service.isFeatured && (
                                <Badge className="bg-yellow-400 text-yellow-900 border-yellow-500 hover:bg-yellow-500">
                                    Featured
                                </Badge>
                            )}
                        </div>
                        <p className="text-white/80 text-sm">{service.category_id?.name || "Uncategorized"}</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Price</span>
                            <span className="text-2xl font-bold text-green-600">${service.price}</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Duration</span>
                            <span className="text-xl font-semibold text-gray-800">{service.duration} min</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm text-gray-500 uppercase font-semibold tracking-wider mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                            {service.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                            <span className="text-xs text-blue-500 uppercase font-bold block mb-1">Availability</span>
                            <Badge variant="outline" className="bg-white text-blue-700 border-blue-200">
                                {service.availability_type}
                            </Badge>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                            <span className="text-xs text-purple-500 uppercase font-bold block mb-1">Consultants</span>
                            <div className="flex -space-x-2 overflow-hidden">
                                {service.consultant_ids?.length > 0 ? (
                                    service.consultant_ids.map((cid: string, i: number) => (
                                        <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600" title={cid}>
                                            C
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-sm text-gray-600">None</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Custom Slots / Weekends */}
                    {(service.custom_slots?.length > 0 || service.weekends?.length > 0) && (
                        <div className="border-t border-gray-100 pt-4 space-y-3">
                            {service.weekends?.length > 0 && (
                                <div>
                                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Weekends (Days Off)</span>
                                    <div className="flex flex-wrap gap-1">
                                        {service.weekends.map((day: string) => (
                                            <Badge key={day} variant="secondary" className="bg-gray-100 text-gray-700">
                                                {day}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {service.custom_slots?.length > 0 && (
                                <div>
                                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Custom Slots</span>
                                    <div className="flex flex-wrap gap-1">
                                        {service.custom_slots.map((slot: any) => (
                                            <Badge key={slot.start_time || slot} variant="secondary" className="bg-gray-100 text-gray-700">
                                                {slot.start_time || slot}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Unavailable Dates/Slots */}
                    {(service.unavailable_dates?.length > 0 || service.unavailable_slots_of_date?.length > 0) && (
                        <div className="border-t border-gray-100 pt-4 space-y-3">
                            {service.unavailable_dates?.length > 0 && (
                                <div>
                                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Unavailable Dates</span>
                                    <div className="flex flex-wrap gap-1">
                                        {service.unavailable_dates.map((date: string) => (
                                            <Badge key={date} variant="outline" className="text-red-600 border-red-200 bg-red-50">
                                                {new Date(date).toLocaleDateString()}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {service.unavailable_slots_of_date?.length > 0 && (
                                <div>
                                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Unavailable Slots</span>
                                    <div className="space-y-2">
                                        {service.unavailable_slots_of_date.map((item: any, idx: number) => (
                                            <div key={idx} className="bg-gray-50 p-2 rounded border border-gray-100 text-sm">
                                                <div className="font-semibold text-gray-700">{new Date(item.date).toLocaleDateString()}</div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {item.slots.map((slot: string) => (
                                                        <span key={slot} className="text-xs bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600">
                                                            {slot}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <Button onClick={onClose} className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-xl py-6">
                        Close Details
                    </Button>
                </div>
            </div>
        </div>
    );
}
