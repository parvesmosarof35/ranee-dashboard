"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Search, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { buttonbg, textPrimary } from "@/contexts/theme";
import { useFindAllUsersQuery, useDeleteUserMutation } from "@/store/api/authApi";
import { DebouncedInput } from "@/components/ui/debounced-input";
import Swal from "sweetalert2";

// User Detail Modal Component
const UserDetailModal = ({ isOpen, onClose, user }: { isOpen: boolean; onClose: () => void; user: any }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
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
              <span className="font-medium">{user?.phoneNumber || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Joined Date</span>
              <span className="font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Role</span>
              <span className="font-medium capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Status</span>
              <span className={`font-medium ${user?.status === 'blocked' ? 'text-red-600' : 'text-green-600'} capitalize`}>
                {user?.status || "Active"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Verified</span>
              <span className={`font-medium ${user?.isVerify ? 'text-green-600' : 'text-yellow-600'}`}>
                {user?.isVerify ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function UsersPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: usersData, isLoading, refetch } = useFindAllUsersQuery({ page, limit, searchTerm });
  const [deleteUser] = useDeleteUserMutation();

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const allUsers = usersData?.data?.all_users || [];
  const meta = usersData?.data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    } else if (user && (user.role !== "admin" && user.role !== "superAdmin")) {
      router.push("/");
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
          Swal.fire("Deleted!", "User has been deleted.", "success");
          refetch();
        } catch (error: any) {
          Swal.fire("Error!", error?.data?.message || "Failed to delete user", "error");
        }
      }
    });
  };

  if (!user || (user.role !== "admin" && user.role !== "superAdmin")) return null;

  return (
    <div className="w-full mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header Section */}
      <div className={`bg-gradient-to-r ${buttonbg} rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm`}>
        <h1 className="text-2xl font-bold text-white">User List</h1>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-[300px]">
            <DebouncedInput
              placeholder="Search User..."
              className="pl-3 bg-white border-none h-11 text-gray-900 placeholder:text-gray-400 rounded-lg w-full"
              value={searchTerm}
              onChange={(val) => {
                setSearchTerm(String(val));
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="text-[#58976B] font-semibold text-base py-5 pl-6">S.ID</TableHead>
                <TableHead className="text-[#58976B] font-semibold text-base py-5">Full Name</TableHead>
                <TableHead className="text-[#58976B] font-semibold text-base py-5">Email</TableHead>
                <TableHead className="text-[#58976B] font-semibold text-base py-5">Phone No</TableHead>
                <TableHead className="text-[#58976B] font-semibold text-base py-5">Joined Date</TableHead>
                <TableHead className="text-[#58976B] font-semibold text-base py-5">Role</TableHead>
                <TableHead className="text-[#58976B] font-semibold text-base text-center py-5 pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">Loading users...</TableCell>
                </TableRow>
              ) : allUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-gray-500">No users found.</TableCell>
                </TableRow>
              ) : (
                allUsers.map((u: any, i: number) => (
                  <TableRow key={u._id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
                    <TableCell className="font-medium text-gray-600 py-4 pl-6">{(meta.page - 1) * meta.limit + i + 1}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative shrink-0">
                          {u.photo ? (
                            <img src={u.photo} alt={u.fullname} className="w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-500">
                              {u.fullname?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{u.fullname}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 py-4">{u.email}</TableCell>
                    <TableCell className="text-gray-600 py-4">{u.phoneNumber || "N/A"}</TableCell>
                    <TableCell className="text-gray-600 py-4">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-gray-600 py-4 capitalize">{u.role}</TableCell>
                    <TableCell className="py-4 pr-6">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleDelete(u.id || u._id)}
                          className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => { setSelectedUser(u); setIsViewOpen(true); }}
                          className="text-[#58976B] hover:text-[#2E6F65] p-2 hover:bg-green-50 rounded-full transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        {meta.totalPage > 1 && (
          <div className="py-4 border-t border-gray-100">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNum}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pageNum);
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < meta.totalPage) setPage(page + 1);
                    }}
                    className={page === meta.totalPage ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <UserDetailModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} user={selectedUser} />

    </div>
  );
}
