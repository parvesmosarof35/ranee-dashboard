
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useGetConversationsQuery } from "@/store/api/chatApi";
import { buttonbg, textPrimary, textSecondarygray, borderPrimary } from "@/contexts/theme";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Clock, User, ChevronRight, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSocket } from "@/hooks/useSocket";
import { Message } from "@/types/chat";

export default function ChatListPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    const {
        isConnected,
        connect,
        joinUser,
        useSocketListener
    } = useSocket();

    const { data: convData, isLoading, isFetching, refetch } = useGetConversationsQuery({
        page,
        limit: 20,
        searchTerm
    });

    const conversations = convData?.data || [];

    // Socket Setup
    useEffect(() => {
        connect();
    }, [connect]);

    useEffect(() => {
        if (user && isConnected) {
            joinUser(user._id || user.id);
        }
    }, [user, isConnected, joinUser]);

    // Update list on new messages
    useSocketListener("new_message", (data: { conversationId: string, message: Message }) => {
        console.log("🔔 New message notification in list:", data);
        refetch(); // Simplest way to keep the list updated
    });

    const filteredConversations = useMemo(() => {
        return conversations; // Backend already handles search, but we can further filter if needed
    }, [conversations]);

    if (isLoading && page === 1) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <Loader2 className={`w-8 h-8 animate-spin ${textPrimary}`} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <MessageSquare className={`w-6 h-6 ${textPrimary}`} />
                        Messages
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {isConnected ? (
                            <span className="flex items-center gap-1.5 text-green-600 font-medium">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Connected & Syncing
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 text-gray-400">
                                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                Connecting...
                            </span>
                        )}
                    </p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 rounded-full border-gray-200 focus:ring-orange-500 bg-white"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 opacity-40">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No conversations found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {conversations.map((conv: any) => {
                            const otherParticipant = conv.participants?.find((p: any) => p._id !== (user?._id || user?.id));
                            const lastMessage = conv.lastMessage;
                            const lastTime = conv.lastMessageTime;

                            return (
                                <div
                                    key={conv._id}
                                    onClick={() => router.push(`/admin/consultant/chat/${conv._id}?receiverId=${otherParticipant?._id}`)}
                                    className="p-4 flex items-center gap-4 hover:bg-orange-50/30 cursor-pointer transition-all border-l-4 border-l-transparent hover:border-l-orange-500 group"
                                >
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center overflow-hidden border ${borderPrimary}`}>
                                            {otherParticipant?.photo ? (
                                                <img src={otherParticipant.photo} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className={`w-6 h-6 ${textPrimary}`} />
                                            )}
                                        </div>
                                        {otherParticipant?.isOnline && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-gray-900 truncate">
                                                {otherParticipant?.fullname || "Client"}
                                            </h3>
                                            {lastTime && (
                                                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                                    {formatDistanceToNow(new Date(lastTime), { addSuffix: true })}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-500 truncate pr-4 italic">
                                                {lastMessage || "No messages yet"}
                                            </p>
                                            <ChevronRight className="w-4 h-4 text-gray-300 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {convData?.meta?.totalPage > 1 && (
                <div className="flex justify-center pt-4">
                    <Button
                        variant="ghost"
                        onClick={() => setPage(p => p + 1)}
                        disabled={isFetching}
                        className={`${textPrimary} hover:bg-orange-50 rounded-full font-bold px-8`}
                    >
                        {isFetching ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Load More"}
                    </Button>
                </div>
            )}
        </div>
    );
}
