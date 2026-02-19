"use client";

import { Search } from "lucide-react";
import { DebouncedInput } from "@/components/ui/debounced-input";

interface ConsultantServiceFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterCategory: string;
    setFilterCategory: (categoryId: string) => void;
    filterType: string;
    setFilterType: (type: string) => void;
    filterSort: string;
    setFilterSort: (sort: string) => void;
    setPage: (page: number) => void;
    categories: any[];
    viewMode: "list" | "grid";
    setViewMode: (mode: "list" | "grid") => void;
}

export function ConsultantServiceFilters({
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    filterSort,
    setFilterSort,
    setPage,
    categories,
    viewMode,
    setViewMode,
}: ConsultantServiceFiltersProps) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full md:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <DebouncedInput
                    placeholder="Search my services..."
                    className="pl-9 bg-gray-50 border-gray-200"
                    value={searchTerm}
                    onChange={(val) => {
                        setSearchTerm(String(val));
                        setPage(1);
                    }}
                />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap md:flex-nowrap">
                <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 mr-2">
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                        title="List View"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    </button>
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                        title="Grid View"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    </button>
                </div>

                <select
                    className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-full md:w-auto"
                    value={filterCategory}
                    onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
                >
                    <option value="">All Categories</option>
                    {categories.map((cat: any) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>

                <select
                    className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-full md:w-auto"
                    value={filterType}
                    onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                >
                    <option value="">All Types</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="both">Both</option>
                </select>

                <select
                    className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-full md:w-auto"
                    value={filterSort}
                    onChange={(e) => { setFilterSort(e.target.value); setPage(1); }}
                >
                    <option value="">Sort By</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                </select>
            </div>
        </div>
    );
}
