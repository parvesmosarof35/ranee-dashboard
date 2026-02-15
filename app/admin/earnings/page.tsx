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
import { Search, Eye, FileText } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { buttonbg, textPrimary } from "@/contexts/theme";

// Mock Data
const earningsData = Array(8).fill(null).map((_, i) => ({
  id: "01",
  name: "Robert Fox",
  trxId: "#123456",
  service: i % 2 === 0 ? "Clients Subscription" : "Providers Subscription",
  price: i % 2 === 0 ? "€75" : "€405",
  isHighPrice: i % 2 !== 0, // Just for coloring logic demo
  date: "02-24-2024",
}));

// Stats Data
const stats = [
  { label: "Today", value: "1.2k" },
  { label: "This Month", value: "18.6K" },
  { label: "Total Revenue", value: "4.9M" },
];

export default function EarningsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      router.push("/auth");
    } else if (user && (user.role !== "admin" && user.role !== "superAdmin")) {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  if (!user || (user.role !== "admin" && user.role !== "superAdmin")) return null;

  return (
    <div className="min-h-screen bg-transparent space-y-5">

      {/* Stats Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {stats.map((stat, index) => (
          <div key={index} className="p-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h2>
            <p className={`font-medium ${textPrimary}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Header & Table Container */}
      <div className="space-y-0">

        {/* Header */}
        <div className={`bg-gradient-to-r ${buttonbg} rounded-t-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4`}>
          <h1 className="text-2xl font-bold text-white">Earnings</h1>

          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search User"
              className="pl-10 bg-white border-none h-11 text-gray-900 placeholder:text-gray-400 rounded-lg"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 overflow-hidden mt-0 p-5">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white">
                <TableRow className="border-b border-gray-100 hover:bg-transparent">
                  <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>S.ID</TableHead>
                  <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Full Name</TableHead>
                  <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Trx ID</TableHead>
                  <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Service</TableHead>
                  <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Price</TableHead>
                  <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Date</TableHead>
                  <TableHead className={`font-semibold text-base py-5 ${textPrimary} text-center`}>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earningsData.map((item, i) => (
                  <TableRow key={i} className="hover:bg-gray-50 border-b border-gray-100">
                    <TableCell className="font-medium text-gray-600 py-4">{i + 1}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-500">
                            {item.name.charAt(0)}
                          </div>
                        </div>
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 py-4">{item.trxId}</TableCell>
                    <TableCell className="text-gray-900 font-medium py-4">{item.service}</TableCell>
                    <TableCell className={`font-medium py-4 ${item.isHighPrice ? "text-[#58976B]" : "text-[#58976B]"}`}>
                      {item.price}
                    </TableCell>
                    <TableCell className="text-gray-600 py-4">{item.date}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <FileText className="w-5 h-5" />
                        </button>
                        <button className={`p-2 hover:bg-green-50 rounded-full transition-colors ${textPrimary}`}>
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 pt-2">
            {/* <p className={`text-sm font-medium ${textPrimary}`}>SHOWING 1-8 OF 250</p> */}

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" className="text-gray-500 hover:text-[#f3ab0c]" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive className="bg-[#f3ab0c] text-white hover:bg-[#f3ab0c]/90 hover:text-white border-0">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="text-gray-600 hover:text-[#f3ab0c] hover:bg-gray-100 border-0">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="text-gray-600 hover:text-[#f3ab0c] hover:bg-gray-100 border-0">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <span className="flex items-center justify-center h-9 w-9 text-gray-400">...</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="text-gray-600 hover:text-[#f3ab0c] hover:bg-gray-100 border-0">30</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="text-gray-600 hover:text-[#f3ab0c] hover:bg-gray-100 border-0">60</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="text-gray-600 hover:text-[#f3ab0c] hover:bg-gray-100 border-0">120</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" className="text-gray-500 hover:text-[#f3ab0c]" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

      </div>

    </div>
  );
}
