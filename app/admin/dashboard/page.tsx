"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Eye, Ban, X } from "lucide-react";
import { buttonbg, textPrimary, textSecondarygray } from "@/contexts/theme";
import {
  useGetDashboardStatsQuery,
  useGetUserGrowthQuery,
  useGetRecentUsersQuery,
} from "@/store/api/dashboardStatsApi";
import { useDeleteUserMutation } from "@/store/api/authApi";
import Swal from "sweetalert2"; // Ensure Swal is installed/imported if used, or use AlertDialog for consistency

// Custom Modal for User Details
const UserDetailModal = ({ isOpen, onClose, user }: { isOpen: boolean; onClose: () => void; user: any }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden relative">
            {user?.photo ? (
              <img src={user.photo} alt={user.fullname} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xl font-bold">
                {user?.fullname?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-[#2E6F65]">{user?.fullname}</h3>
          <p className="text-sm text-gray-500 mb-6">{user?.email}</p>

          <div className="space-y-3 text-left">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium">{user?.phone}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Joined Date</span>
              <span className="font-medium">{user?.joinedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // API Hooks
  const { data: statsData, isLoading: isStatsLoading } = useGetDashboardStatsQuery(undefined);
  const { data: growthData, isLoading: isGrowthLoading } = useGetUserGrowthQuery(selectedYear);
  const { data: recentUsersData, isLoading: isRecentUsersLoading, refetch: refetchRecentUsers } = useGetRecentUsersQuery(10);
  const [deleteUser] = useDeleteUserMutation();

  const stats = statsData?.data || { totalUsers: 0, totalRevenue: 0 };
  const userGrowth = growthData?.data?.monthlyData || [];
  const recentUsers = recentUsersData?.data || [];

  const rawMax = userGrowth.length > 0 ? Math.max(...userGrowth.map((d: any) => d.totalUsers)) : 0;
  const maxVal = rawMax > 0 ? rawMax : 100;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    } else if (user) {
      const isNotAdmin = user.role !== "admin";
      const isNotSuperAdmin = user.role !== "superAdmin";

      if (isNotAdmin && isNotSuperAdmin) {
        const roleLower = user.role ? user.role.toLowerCase() : "";
        if (roleLower !== "admin" && roleLower !== "superadmin") {
          router.push("/auth");
        }
      }
    }
  }, [isAuthenticated, user, router]);

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id).unwrap();
          Swal.fire("Deleted!", "User has been deleted from records.", "success");
          refetchRecentUsers();
        } catch (error: any) {
          Swal.fire("Error!", error?.data?.message || "Failed to delete user", "error");
        }
      }
    });
  };

  if (!user || (user.role !== "admin" && user.role !== "superAdmin")) return null;

  return (
    <div className="min-h-screen space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
          <h2 className="text-4xl font-bold text-slate-500 mb-2">
            {isStatsLoading ? "..." : stats.totalUsers?.toLocaleString()}
          </h2>
          <p className={`${textSecondarygray} font-medium`}>Total Users</p>
        </div>
        <div className="p-8 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-slate-500 mb-2">
            {isStatsLoading ? "..." : stats.totalRevenue?.toLocaleString()}
          </h2>
          <p className={`${textSecondarygray} font-medium`}>Total Revenue</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className={`text-xl font-bold ${textSecondarygray}`}>User Ratio</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-3 h-3 rounded-full bg-${buttonbg.replace("bg-", "")}`}></span>
              <span className="text-sm text-gray-500">Users</span>
            </div>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value.replace("Year-", "")))}
            className={`bg-${buttonbg.replace("bg-", "")} !text-gray-600 px-4 py-2 rounded-lg text-sm border-none outline-none cursor-pointer`}
          >
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>Year-{year}</option>
            ))}
          </select>
        </div>

        {/* CSS Bar Chart */}
        <div className="relative h-[300px] w-full mt-10">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400 pointer-events-none">
            {[maxVal, maxVal * 0.75, maxVal * 0.5, maxVal * 0.25, 0].map((val) => (
              <div key={val} className="flex items-center w-full">
                <span className="w-10 text-right pr-2">{Math.round(val)}</span>
                <div className="h-[1px] flex-1 bg-gray-100 border-dashed border-gray-200"></div>
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex justify-between items-end pl-12 pr-4 pt-4">
            {isGrowthLoading ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400">Loading Chart...</div>
            ) : userGrowth.length > 0 ? (
              userGrowth.map((data: any, index: number) => {
                const heightPercent = (data.totalUsers / maxVal) * 100;
                return (
                  <div key={index} className="flex flex-col items-center justify-end gap-2 group w-full h-full">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 bg-[#FCD34D] text-[#0D0D0D] text-xs py-1 px-3 rounded shadow-sm mb-2 z-10 pointer-events-none whitespace-nowrap">
                      <p className="font-bold">Users</p>
                      <p>{data.totalUsers}</p>
                      <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#FCD34D]"></div>
                    </div>

                    <div
                      style={{ height: `${heightPercent > 100 ? 100 : heightPercent}%` }}
                      className={`w-3 sm:w-4 md:w-8 bg-${buttonbg.replace("bg-", "")} rounded-t-sm transition-all duration-300 hover:opacity-80 relative`}
                    >
                    </div>
                    <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                  </div>
                )
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No data available for {selectedYear}</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-t-xl shadow-sm border border-gray-100 overflow-hidden" >
        <div className={` p-5 pb-5  ${buttonbg} text-white hover:bg-[#58976B]/90`}>
          <h2 className="text-xl font-bold">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className={` text-black bg-white hover:bg-`}>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-black font-semibold pl-6">S.ID</TableHead>
                <TableHead className="text-black font-semibold">Full Name</TableHead>
                <TableHead className="text-black font-semibold">Email</TableHead>
                <TableHead className="text-black font-semibold">Phone No</TableHead>
                <TableHead className="text-black font-semibold">Joined Date</TableHead>
                <TableHead className="text-black font-semibold text-center pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isRecentUsersLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading recent users...</TableCell></TableRow>
              ) : recentUsers.map((u: any, i: number) => (
                <TableRow key={i} className="hover:bg-gray-50 border-b border-gray-100">
                  <TableCell className="font-medium text-gray-600 pl-6 text-center">{u.serialId || i + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                        {u?.photo ? (
                          <img src={u.photo} alt={u.fullname} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-500">
                            {u.fullname?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{u.fullname}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{u.email}</TableCell>
                  <TableCell className="text-gray-600">{u.phone}</TableCell>
                  <TableCell className="text-gray-600">{u.joinedDate}</TableCell>
                  <TableCell className="pr-6">
                    <div className="flex items-center justify-center gap-3">
                      {/* Delete Action Button - Reusing logic from Users Page if possible, or new Delete endpoint if exists. Assuming same Delete endpoint for now using id if available, or just visual if not provided in 'recent-users' response. Response has no ID! Checking recent-users response... it has 'serialId' but not actual DB ID. I will disable delete or assume ID is hidden, but response example shows no ID. I'll comment out delete or try to use what I have. Wait, user provided response for recent users doesn't have _id. I will assume it might be added or I can't delete here. I'll use Trash icon but might fail if no ID. Safest is to remove Delete from this view or ask. I'll keep UI consistent but maybe disable delete if no ID. Actually, I'll use `Ban` visual as per mock but hook it to nothing or log warning? No, wait, User provided mock shows Ban and Eye. I will implement Ban as Delete (since Block was replaced by Delete elsewhere) if I have ID. If not, I'll hide it. */}
                      {/* Update: User request showed response with only serialId. I cannot delete without ID. I will show Eye only or generic delete that logs "No ID". */}

                      {/* View Action Button */}
                      <button
                        onClick={() => { setSelectedUser(u); setIsViewOpen(true); }}
                        className="text-[#2E6F65] hover:text-[#58976B] hover:bg-green-50 p-2 rounded-full transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* User Details Modal */}
      <UserDetailModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} user={selectedUser} />

    </div>
  );
}