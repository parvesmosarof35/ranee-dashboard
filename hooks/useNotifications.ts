import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { getBaseUrl, imgUrl } from "@/store/config/envConfig";

export interface NotificationItem {
  _id: string;
  title: string;
  message?: string;
  isRead: boolean;
  createdAt: string;
  type?: string;
}

export const useNotifications = (userId: string | undefined, token: string | null) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. INITIAL LOAD (API) ---
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const baseUrl = getBaseUrl();
        
        const [listRes, countRes] = await Promise.all([
          fetch(`${baseUrl}notifications/get-all-notifications?limit=50`, {
            headers: { Authorization: `${token}` }
          }),
          fetch(`${baseUrl}notifications/unread-count`, {
            headers: { Authorization: `${token}` }
          })
        ]);
        
        const listData = await listRes.json();
        const countData = await countRes.json();
        
        if (listData.success) {
          // Handle both flat array and nested data.result or data.data structure
          const data = listData.data;
          if (Array.isArray(data)) {
            setNotifications(data);
          } else if (data && Array.isArray(data.data)) {
            setNotifications(data.data);
          } else if (data && Array.isArray(data.result)) {
            setNotifications(data.result);
          } else {
            setNotifications([]);
          }
        }

        if (countData.success) {
          setUnreadCount(countData.unreadCount ?? countData.count ?? 0);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && token) {
      init();
    } else {
      // If we don't have user yet, we might still be loading auth state
      if (!token) setIsLoading(false);
    }
  }, [userId, token]);

  // --- 2. REAL-TIME UPDATES (Socket) ---
  useEffect(() => {
    if (!userId) return;

    const socket = io(imgUrl);
    
    socket.emit("join_user", { userId });
    
    socket.on("new_notification", (newNote: NotificationItem) => {
      console.log("Got new notification!", newNote);
      setNotifications(prev => [newNote, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast.success(`${newNote.title}: ${newNote.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // --- 3. ACTIONS (Read/Delete) ---
  const markAsRead = async (id: string) => {
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}notifications/mark-as-read/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `${token}` }
      });
      const data = await res.json();
      if (data.status || data.success) {
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      }
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}notifications/mark-all-as-read`, {
        method: 'PATCH',
        headers: { Authorization: `${token}` }
      });
      const data = await res.json();
      if (data.status || data.success) {
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  return { notifications, unreadCount, isLoading, markAsRead, markAllAsRead };
};
