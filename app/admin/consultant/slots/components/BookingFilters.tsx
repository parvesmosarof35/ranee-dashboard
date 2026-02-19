"use client";

interface BookingFiltersProps {
    status: string;
    setStatus: (status: string) => void;
    date: string;
    setDate: (date: string) => void;
    setPage: (page: number) => void;
}

export function BookingFilters({
    status,
    setStatus,
    date,
    setDate,
    setPage,
}: BookingFiltersProps) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap md:flex-nowrap">
                <select
                    className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-full md:w-auto min-w-[150px]"
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

                <div className="relative">
                    <input
                        type="date"
                        className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-full md:w-auto"
                        value={date}
                        onChange={(e) => { setDate(e.target.value); setPage(1); }}
                        placeholder="Filter by Date"
                    />
                </div>
                
                {(status || date) && (
                    <button 
                        onClick={() => {
                            setStatus("");
                            setDate("");
                            setPage(1);
                        }}
                        className="text-sm text-red-500 hover:text-red-700 underline px-2"
                    >
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
}
