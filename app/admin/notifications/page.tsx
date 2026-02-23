"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Loader2, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { io } from "socket.io-client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
import { buttonbg, textPrimary, borderPrimary } from "@/contexts/theme";
import { useAuthState } from "@/store/hooks";
import { getBaseUrl, imgUrl } from "@/store/config/envConfig";
import { useNotifications, NotificationItem } from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const router = useRouter();
  const { user, token } = useAuthState();
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications(user?._id || user?.id, token);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  const pageSize = 15;
  const totalPages = Math.ceil(notifications.length / pageSize);
  const paginatedNotifications = notifications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getNotificationIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'system':
        return <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Bell className="w-5 h-5" /></div>;
      case 'alert':
      case 'warning':
        return <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Bell className="w-5 h-5" /></div>;
      case 'offer':
      case 'promo':
        return <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Bell className="w-5 h-5" /></div>;
      default:
        return <div className="p-2 bg-orange-50 text-[#F3AB0C] rounded-xl"><Bell className="w-5 h-5" /></div>;
    }
  };

  const formatTimeAgo = (createdAt: string) => {
    try {
      const date = new Date(createdAt);
      if (isNaN(date.getTime())) return 'Recently';
      
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Recently';
    }
  };

  // Group notifications by date
  const groupedNotifications = paginatedNotifications.reduce((groups: { [key: string]: NotificationItem[] }, note) => {
    const date = new Date(note.createdAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let groupKey = "Older";
    if (date.toDateString() === today.toDateString()) {
      groupKey = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = "Yesterday";
    } else {
      groupKey = date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    }

    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(note);
    return groups;
  }, {});

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActionLoading(true);
    await markAsRead(id);
    setIsActionLoading(false);
  };
  
  const handleMarkAllRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    if (unreadNotifications.length === 0) {
      toast.info("All notifications are already marked as read");
      return;
    }
    setIsActionLoading(true);
    await markAllAsRead();
    setIsActionLoading(false);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#F9FAFB]">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-gray-200 shadow-sm md:shadow-none"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight">Notifications</h1>
              <p className="text-gray-500 text-sm mt-1">
                You have <span className={`font-bold ${textPrimary}`}>{unreadCount}</span> unread alerts
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleMarkAllRead}
            size="sm"
            variant="outline"
            className={`w-full md:w-auto ${textPrimary} ${borderPrimary} hover:bg-[#F3AB0C] hover:text-white transition-all font-semibold rounded-xl px-6`}
            disabled={isLoading || isActionLoading || unreadCount === 0}
          >
            Mark all as read
          </Button>
        </div>

        {/* Page Content */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Loader2 className={`w-12 h-12 animate-spin text-[#F3AB0C] mb-4`} />
            <p className="text-gray-500 font-medium animate-pulse">Fetching your alerts...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {notifications.length > 0 ? (
              <>
                {Object.entries(groupedNotifications).map(([group, items]) => (
                  <div key={group} className="space-y-4">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">{group}</h2>
                    <div className="grid gap-3">
                      {items.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => !item.isRead && markAsRead(item._id)}
                          className={`group relative flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer border shadow-sm hover:shadow-md ${
                            item.isRead 
                              ? "bg-white/60 border-gray-100 opacity-80" 
                              : "bg-white border-orange-100 ring-1 ring-orange-50"
                          }`}
                        >
                          {/* Unread Indicator Dot */}
                          {!item.isRead && (
                            <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#F3AB0C] rounded-full ring-4 ring-orange-50" />
                          )}

                          {/* Icon */}
                          <div className="shrink-0 mt-1">
                            {getNotificationIcon(item.type)}
                          </div>

                          {/* Text Content */}
                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className={`text-base font-bold truncate ${item.isRead ? "text-gray-700" : "text-[#111827]"}`}>
                                {item.title}
                              </h4>
                            </div>
                            {item.message && (
                              <p className={`text-sm leading-relaxed line-clamp-2 ${item.isRead ? "text-gray-500" : "text-gray-600"}`}>
                                {item.message}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[11px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                {formatTimeAgo(item.createdAt)}
                              </span>
                              {!item.isRead && (
                                <button 
                                  onClick={(e) => handleMarkAsRead(item._id, e)}
                                  className={`text-[11px] font-bold ${textPrimary} hover:underline uppercase tracking-tight`}
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center pt-8">
                    <Pagination>
                        <PaginationContent className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                            <PaginationItem>
                                <PaginationPrevious 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); if(currentPage > 1) setCurrentPage(c => c - 1); }}
                                    className={`rounded-xl ${currentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-gray-50"}`}
                                />
                            </PaginationItem>
                            
                            {Array.from({length: totalPages}).map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink 
                                        href="#" 
                                        isActive={currentPage === i + 1}
                                        onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }}
                                        className={`rounded-xl w-10 h-10 ${currentPage === i + 1 ? "bg-[#F3AB0C] text-white hover:bg-[#F3AB0C] hover:text-white" : "hover:bg-gray-50 text-gray-600"}`}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); if(currentPage < totalPages) setCurrentPage(c => c + 1); }} 
                                    className={`rounded-xl ${currentPage === totalPages ? "pointer-events-none opacity-50" : "hover:bg-gray-50"}`}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[32px] border border-dashed border-gray-200 shadow-sm">
                <div className="bg-orange-50 p-8 rounded-[32px] mb-6 relative">
                  <Bell className="w-16 h-16 text-[#F3AB0C]" strokeWidth={1.5} />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#F3AB0C] rounded-full border-4 border-white animate-bounce" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#111827] mb-2 tracking-tight">All caught up!</h3>
                <p className="text-gray-500 max-w-[280px] text-center font-medium leading-relaxed">
                  When you receive new updates, alerts or system messages, they'll appear here.
                </p>
                <Button 
                  onClick={() => router.back()}
                  variant="link" 
                  className={`mt-6 ${textPrimary} font-bold`}
                >
                  Return to Dashboard
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

