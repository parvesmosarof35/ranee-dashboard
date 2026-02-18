"use client";

import { buttonbg } from "@/contexts/theme";

export default function ConsultantServicesPage() {
    return (
        <div className="w-full">
            <div className={`${buttonbg} p-6 rounded-xl shadow-sm mb-6 text-white`}>
                <h1 className="text-2xl font-bold">My Services</h1>
                <p className="opacity-90">Manage your consultation services here.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center py-20">
                <p className="text-gray-500 text-lg">Services management coming soon...</p>
            </div>
        </div>
    );
}
