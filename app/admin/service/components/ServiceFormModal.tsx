"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Check, Calendar, Clock, Loader2 } from "lucide-react";
import { buttonbg } from "@/contexts/theme";
import { toast } from "sonner";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface ServiceFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingService: any | null;
    categories: any[];
    consultants: any[];
    onSubmit: (formData: FormData) => Promise<void>;
    isSubmitting: boolean;
}

export function ServiceFormModal({
    isOpen,
    onClose,
    editingService,
    categories,
    consultants,
    onSubmit,
    isSubmitting
}: ServiceFormModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category_id: "",
        consultant_ids: [] as string[],
        price: 0,
        duration: 60,
        availability_type: "Online",
        custom_slots: [] as { start_time: string }[],
        weekends: [] as string[],
        unavailable_dates: [] as string[],
        unavailable_slots_of_date: [] as { date: string; slots: string[] }[],
        isFeatured: false,
    });

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [tempSlot, setTempSlot] = useState("");
    const [tempUnavailableDate, setTempUnavailableDate] = useState("");
    const [tempUnavailableSlotDate, setTempUnavailableSlotDate] = useState("");
    const [tempUnavailableSlotTime, setTempUnavailableSlotTime] = useState("");

    // Initialize form when editingService changes or modal opens
    useEffect(() => {
        if (isOpen) {
            if (editingService) {
                const formattedUnavailableDates = editingService.unavailable_dates
                    ? editingService.unavailable_dates.map((d: string) => new Date(d).toISOString().split('T')[0])
                    : [];

                const formattedUnavailableSlots = editingService.unavailable_slots_of_date
                    ? editingService.unavailable_slots_of_date.map((item: any) => ({
                        date: new Date(item.date).toISOString().split('T')[0],
                        slots: item.slots
                    }))
                    : [];

                setFormData({
                    title: editingService.title,
                    description: editingService.description,
                    category_id: editingService.category_id?._id || "",
                    consultant_ids: editingService.consultant_ids || [],
                    price: editingService.price,
                    duration: editingService.duration,
                    availability_type: editingService.availability_type,
                    custom_slots: editingService.custom_slots || [],
                    weekends: editingService.weekends || [],
                    unavailable_dates: formattedUnavailableDates,
                    unavailable_slots_of_date: formattedUnavailableSlots,
                    isFeatured: editingService.isFeatured || false,
                });

                // Set existing image as preview if available
                if (editingService.imgs && editingService.imgs.length > 0) {
                    setPreviewUrl(editingService.imgs[0]);
                } else {
                    setPreviewUrl(null);
                }
            } else {
                // Reset form for create mode
                setFormData({
                    title: "",
                    description: "",
                    category_id: "",
                    consultant_ids: [],
                    price: 0,
                    duration: 60,
                    availability_type: "Online",
                    custom_slots: [],
                    weekends: [],
                    unavailable_dates: [],
                    unavailable_slots_of_date: [],
                    isFeatured: false,
                });
                setPreviewUrl(null);
            }
            setFile(null);
            setTempSlot("");
            setTempUnavailableDate("");
            setTempUnavailableSlotDate("");
            setTempUnavailableSlotTime("");
        }
    }, [isOpen, editingService]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreviewUrl(null);
            // If editing and cleared new file, revert to existing image
            if (editingService && editingService.imgs && editingService.imgs.length > 0) {
                setPreviewUrl(editingService.imgs[0]);
            }
        }
    };

    const toggleWeekend = (day: string) => {
        setFormData(prev => {
            const weekends = prev.weekends.includes(day)
                ? prev.weekends.filter(d => d !== day)
                : [...prev.weekends, day];
            return { ...prev, weekends };
        });
    };

    const addCustomSlot = () => {
        if (!tempSlot) return;
        if (formData.custom_slots.some(s => s.start_time === tempSlot)) {
            toast.error("Slot already exists");
            return;
        }
        setFormData(prev => ({
            ...prev,
            custom_slots: [...prev.custom_slots, { start_time: tempSlot }]
        }));
        setTempSlot("");
    };

    const removeCustomSlot = (index: number) => {
        setFormData(prev => ({
            ...prev,
            custom_slots: prev.custom_slots.filter((_, i) => i !== index)
        }));
    };

    const addUnavailableDate = () => {
        if (!tempUnavailableDate) return;
        if (formData.unavailable_dates.includes(tempUnavailableDate)) {
            toast.error("Date already added");
            return;
        }
        setFormData(prev => ({
            ...prev,
            unavailable_dates: [...prev.unavailable_dates, tempUnavailableDate]
        }));
        setTempUnavailableDate("");
    };

    const removeUnavailableDate = (dateToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            unavailable_dates: prev.unavailable_dates.filter(d => d !== dateToRemove)
        }));
    };

    const addUnavailableSlotToDate = () => {
        if (!tempUnavailableSlotDate || !tempUnavailableSlotTime) return;

        setFormData(prev => {
            const existingEntryIndex = prev.unavailable_slots_of_date.findIndex(item => item.date === tempUnavailableSlotDate);

            if (existingEntryIndex >= 0) {
                const existingEntry = prev.unavailable_slots_of_date[existingEntryIndex];
                if (existingEntry.slots.includes(tempUnavailableSlotTime)) {
                    toast.error("Slot already exists for this date");
                    return prev;
                }

                const updatedEntry = {
                    ...existingEntry,
                    slots: [...existingEntry.slots, tempUnavailableSlotTime].sort()
                };

                const newSlotsOfDate = [...prev.unavailable_slots_of_date];
                newSlotsOfDate[existingEntryIndex] = updatedEntry;

                return { ...prev, unavailable_slots_of_date: newSlotsOfDate };
            } else {
                return {
                    ...prev,
                    unavailable_slots_of_date: [...prev.unavailable_slots_of_date, {
                        date: tempUnavailableSlotDate,
                        slots: [tempUnavailableSlotTime]
                    }]
                };
            }
        });
        setTempUnavailableSlotTime("");
    };

    const removeUnavailableSlotFromDate = (dateIndex: number, slotToRemove: string) => {
        setFormData(prev => {
            const newSlotsOfDate = [...prev.unavailable_slots_of_date];
            const updatedSlots = newSlotsOfDate[dateIndex].slots.filter(s => s !== slotToRemove);

            if (updatedSlots.length === 0) {
                newSlotsOfDate.splice(dateIndex, 1);
            } else {
                newSlotsOfDate[dateIndex] = { ...newSlotsOfDate[dateIndex], slots: updatedSlots };
            }

            return { ...prev, unavailable_slots_of_date: newSlotsOfDate };
        });
    };

    const handleSubmitLocal = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = new FormData();
        payload.append("data", JSON.stringify(formData));
        if (file) {
            payload.append("file", file);
        }
        await onSubmit(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 scrollbar-hide">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-800">{editingService ? "Update Service" : "Add New Service"}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5 text-gray-500" />
                    </Button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmitLocal} className="space-y-6">
                        {/* Title & IsFeatured */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Service Title</Label>
                                <Input id="title" placeholder="e.g. Yoga Class" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="border-gray-200 focus:border-blue-500 transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="isFeatured" className="text-sm font-semibold text-gray-700">Is Featured?</Label>
                                <div className="relative">
                                    <select
                                        id="isFeatured"
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-all"
                                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.value === "true" })}
                                        value={formData.isFeatured.toString()}
                                    >
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
                            <Textarea id="description" placeholder="Describe the service..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required className="border-gray-200 focus:border-blue-500 transition-colors min-h-[100px]" />
                        </div>

                        {/* Category & Consultant */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">Category</Label>
                                <div className="relative">
                                    <select
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-all"
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        value={formData.category_id}
                                        required
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {categories.map((cat: any) => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">Consultant</Label>
                                <div className="relative">
                                    <select
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-all"
                                        onChange={(e) => setFormData({ ...formData, consultant_ids: [e.target.value] })}
                                        value={formData.consultant_ids[0] || ""}
                                        required
                                    >
                                        <option value="" disabled>Select Consultant</option>
                                        {consultants.map((con: any) => (
                                            <option key={con._id} value={con._id}>{con.fullname || con.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Price, Duration, Type */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-sm font-semibold text-gray-700">Price ($)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <Input id="price" type="number" min="0" className="pl-7 border-gray-200 focus:border-blue-500 transition-colors" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration" className="text-sm font-semibold text-gray-700">Duration (min)</Label>
                                <Input id="duration" type="number" min="1" className="border-gray-200 focus:border-blue-500 transition-colors" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })} required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">Availability Type</Label>
                                <div className="relative">
                                    <select
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-all"
                                        onChange={(e) => setFormData({ ...formData, availability_type: e.target.value })}
                                        value={formData.availability_type}
                                    >
                                        <option value="Online">Online</option>
                                        <option value="Offline">Offline</option>
                                        <option value="Both">Both</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Custom Slots */}
                        <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <Label className="text-sm font-semibold text-gray-700">Custom Slots</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="time"
                                        className="pl-9 bg-white border-gray-200"
                                        value={tempSlot}
                                        onChange={(e) => setTempSlot(e.target.value)}
                                    />
                                </div>
                                <Button type="button" onClick={addCustomSlot} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Add Slot
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.custom_slots.length === 0 && <span className="text-xs text-gray-400 italic">No custom slots added</span>}
                                {formData.custom_slots.map((slot, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-white border border-gray-200 text-gray-700 pl-2 pr-1 py-1 flex items-center gap-1 shadow-sm">
                                        {slot.start_time}
                                        <button type="button" onClick={() => removeCustomSlot(idx)} className="hover:bg-gray-100 rounded-full p-0.5 transition-colors">
                                            <X className="w-3 h-3 text-red-500" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Weekends Multi-select */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700">Weekends (Days Off)</Label>
                            <div className="flex flex-wrap gap-2">
                                {DAYS_OF_WEEK.map(day => (
                                    <div
                                        key={day}
                                        onClick={() => toggleWeekend(day)}
                                        className={`
                                            px-3 py-1.5 rounded-lg cursor-pointer border text-sm font-medium transition-all select-none flex items-center gap-2
                                            ${formData.weekends.includes(day)
                                                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}
                                        `}
                                    >
                                        {day}
                                        {formData.weekends.includes(day) && <Check className="w-3 h-3" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Unavailable Dates */}
                        <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <Label className="text-sm font-semibold text-gray-700">Unavailable Dates (Full Day)</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="date"
                                        className="pl-9 bg-white border-gray-200"
                                        value={tempUnavailableDate}
                                        onChange={(e) => setTempUnavailableDate(e.target.value)}
                                    />
                                </div>
                                <Button type="button" onClick={addUnavailableDate} size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                                    Add Date
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.unavailable_dates.length === 0 && <span className="text-xs text-gray-400 italic">No unavailable dates added</span>}
                                {formData.unavailable_dates.map((date, idx) => (
                                    <Badge key={idx} variant="outline" className="bg-white text-orange-600 border-orange-200 pl-2 pr-1 py-1 flex items-center gap-1 shadow-sm">
                                        {date}
                                        <button type="button" onClick={() => removeUnavailableDate(date)} className="hover:bg-orange-50 rounded-full p-0.5 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Unavailable Slots of Date */}
                        <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <Label className="text-sm font-semibold text-gray-700">Unavailable Slots by Date</Label>
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="date"
                                        className="pl-9 bg-white border-gray-200"
                                        value={tempUnavailableSlotDate}
                                        onChange={(e) => setTempUnavailableSlotDate(e.target.value)}
                                    />
                                </div>
                                <div className="relative flex-1">
                                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="time"
                                        className="pl-9 bg-white border-gray-200"
                                        value={tempUnavailableSlotTime}
                                        onChange={(e) => setTempUnavailableSlotTime(e.target.value)}
                                    />
                                </div>
                                <Button type="button" onClick={addUnavailableSlotToDate} size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                                    Add Slot
                                </Button>
                            </div>
                            <div className="space-y-2 mt-2">
                                {formData.unavailable_slots_of_date.length === 0 && <span className="text-xs text-gray-400 italic">No unavailable slots by date added</span>}
                                {formData.unavailable_slots_of_date.map((item, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-bold text-gray-700">{item.date}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {item.slots.map((slot, sIdx) => (
                                                <Badge key={sIdx} variant="secondary" className="bg-red-50 text-red-600 border border-red-100 pl-2 pr-1 py-0.5 text-xs flex items-center gap-1">
                                                    {slot}
                                                    <button type="button" onClick={() => removeUnavailableSlotFromDate(idx, slot)} className="hover:bg-red-100 rounded-full p-0.5 transition-colors">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="image" className="text-sm font-semibold text-gray-700">Service Image</Label>

                            {/* Image Preview */}
                            {previewUrl && (
                                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-2 border border-gray-200">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                        onClick={() => {
                                            setFile(null);
                                            setPreviewUrl(null);
                                            const input = document.getElementById("image") as HTMLInputElement;
                                            if (input) input.value = "";

                                            // Ensure we check if we need to revert to server image in edit mode, 
                                            // but if user explicitly removed, maybe they want no image? 
                                            // Actually prompt implied replacing, but clearing preview usually means "cancel selection".
                                            // If in edit mode, clearing the NEW selection should revert to OLD image.
                                            if (editingService && editingService.imgs && editingService.imgs.length > 0) {
                                                setPreviewUrl(editingService.imgs[0]);
                                            }
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="border-gray-200 file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded-md file:mr-4 hover:file:bg-gray-200 transition-colors"
                            />
                            {!file && !previewUrl && (
                                <p className="text-xs text-gray-500">Upload a cover image for your service.</p>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-gray-100">
                            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" className={`flex-1 ${buttonbg}`} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin" /> : (editingService ? "Update Service" : "Create Service")}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
