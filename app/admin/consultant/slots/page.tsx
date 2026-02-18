"use client";

import { buttonbg } from "@/contexts/theme";

export default function ConsultantSlotsPage() {
    return (
        <div className="w-full">
            <div className={`${buttonbg} p-6 rounded-xl shadow-sm mb-6 text-white`}>
                <h1 className="text-2xl font-bold">My Slots</h1>
                <p className="opacity-90">Manage your availability and booking slots.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center py-20">
                <p className="text-gray-500 text-lg">Slots management coming soon...</p>
            </div>
        </div>
    );
}
