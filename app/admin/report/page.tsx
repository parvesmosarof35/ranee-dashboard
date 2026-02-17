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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye, Trash2, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { textPrimary, buttonbg, textSecondarygray } from "@/contexts/theme";
import { useGetAllContactQuery, useDeleteContactMutation } from "@/store/api/contactApi";
import { DebouncedInput } from "@/components/ui/debounced-input";
import Swal from "sweetalert2";

import { toast } from "sonner";

// Contact Detail Modal
const ContactDetailModal = ({ isOpen, onClose, contact }: { isOpen: boolean; onClose: () => void; contact: any }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h3 className={`text-xl font-bold ${textPrimary} mb-4`}>Contact Details</h3>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-lg">
                {contact?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">{contact?.name}</p>
              <p className="text-xs text-gray-500">{contact?.email}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-left space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">Subject:</p>
              <p className="text-gray-600">{contact?.title}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700">Message:</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{contact?.description}</p>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-400">Received on: {contact?.createdAt ? new Date(contact.createdAt).toLocaleString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ContactPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: contactData, isLoading, refetch } = useGetAllContactQuery({ page, limit, searchTerm });
  const [deleteContact] = useDeleteContactMutation();

  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const contacts = contactData?.data?.allContactList || [];
  const meta = contactData?.data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

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
          await deleteContact(id).unwrap();
          Swal.fire("Deleted!", "Contact message has been deleted.", "success");
          refetch();
        } catch (error: any) {
          Swal.fire("Error!", error?.data?.message || "Failed to delete message", "error");
        }
      }
    });
  };

  if (!user || (user.role !== "admin" && user.role !== "superAdmin")) return null;

  return (
    <div className="w-full mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${textPrimary}`}>Contact Messages</h1>
          <p className={`${textSecondarygray} mt-1`}>View and manage user inquiries.</p>
        </div>
        <div className="w-full md:w-auto relative">
          <DebouncedInput
            placeholder="Search contacts..."
            className="pl-3 bg-white border-gray-200 w-full md:w-64"
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(String(val));
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="py-4 pl-6">Sender</TableHead>
                <TableHead className="py-4">Subject</TableHead>
                <TableHead className="py-4">Message Preview</TableHead>
                <TableHead className="py-4">Date</TableHead>
                <TableHead className="py-4 pr-6 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">Loading messages...</TableCell>
                </TableRow>
              ) : contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-500">No messages found.</TableCell>
                </TableRow>
              ) : (
                contacts.map((item: any) => (
                  <TableRow key={item._id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                          {item.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <span className="text-xs text-gray-500">{item.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900 font-medium py-4 max-w-[150px] truncate" title={item.title}>
                      {item.title}
                    </TableCell>
                    <TableCell className="text-gray-500 py-4 max-w-[250px] truncate" title={item.description}>
                      {item.description}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm py-4 whitespace-nowrap">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="py-4 pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Action */}
                        <button
                          onClick={() => { setSelectedContact(item); setIsViewOpen(true); }}
                          className="text-blue-500 hover:text-blue-700 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Delete Action */}
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
 
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

      </div>

      {/* Details Modal */}
      <ContactDetailModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} contact={selectedContact} />

    </div >
  );
}
