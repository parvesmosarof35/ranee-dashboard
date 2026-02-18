"use client";

import { useAuth } from "@/contexts/auth-context";

export default function ConsultantDashboard() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.fullname || "Consultant"}!</h1>
                <p className="text-gray-500 mt-2">Here is your dashboard overview.</p>
            </div>

            {/* Placeholder for stats or specific consultant widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700">My Services</h3>
                    <p className="text-3xl font-bold text-[#F96803] mt-2">--</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700">Upcoming Slots</h3>
                    <p className="text-3xl font-bold text-[#F96803] mt-2">--</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
                    <p className="text-3xl font-bold text-[#F96803] mt-2">--</p>
                </div>
            </div>
        </div>
    );
}
