"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/auth-context";
import { buttonbg, textPrimary, textSecondarygray, activeTabBG, borderPrimary } from "@/contexts/theme";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Paperclip, X, Search as SearchIcon, MoreVertical, Phone, Video, ChevronLeft } from "lucide-react";
import { useGetConversationQuery, useSendMessageMutation } from "@/store/api/chatApi";
import Swal from "sweetalert2";
import { format, isToday, isYesterday } from "date-fns";

interface Message {
    _id?: string;
    senderId: string | { _id: string; fullname?: string; email?: string; photo?: string };
    receiverId?: string | { _id: string; fullname?: string; email?: string; photo?: string };
    text: string;
    createdAt?: string;
    images?: string[];
}

export default function ChatPage() {
    const { id: conversationId } = useParams();
    const searchParams = useSearchParams();
    const receiverIdParam = searchParams.get("receiverId");
    const { user } = useAuth();
    const router = useRouter();

    // State
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch messages
    const { data: conversationData, isLoading: isHistoryLoading, isFetching } = useGetConversationQuery({
        id: conversationId,
        page,
        limit: 20,
        searchTerm
    }, {
        skip: !conversationId,
        refetchOnMountOrArgChange: true
    });

    // Receiver Info - Derived from messages if available
    const otherUser = useMemo(() => {
        if (!messages.length) return null;
        const firstMsg = messages[0];
        const userId = user?._id || user?.id;
        
        const sender = typeof firstMsg.senderId === 'object' ? firstMsg.senderId : null;
        const receiver = typeof firstMsg.receiverId === 'object' ? firstMsg.receiverId : null;

        if (sender && sender._id !== userId) return sender;
        if (receiver && receiver._id !== userId) return receiver;
        return null;
    }, [messages, user]);

    // Handle data update
    useEffect(() => {
        if (conversationData?.data) {
            const newMessages = [...conversationData.data].reverse();
            const meta = conversationData.meta;

            if (meta) {
                setHasMore(meta.page < meta.totalPage);
            }

            if (page === 1) {
                setMessages(newMessages);
                setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
            } else {
                setMessages((prev) => [...newMessages, ...prev]);
            }
        }
    }, [conversationData, page]);

    // Handle Search
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    // Socket Connection
    useEffect(() => {
        if (!user || !conversationId) return;

        const socketUrl = process.env.NEXT_PUBLIC_IMG_URL || "https://smith-husband-mailman-retrieval.trycloudflare.com/";
        const newSocket = io(socketUrl);

        newSocket.on("connect", () => {
            setIsConnected(true);
            const userId = user._id || user.id;
            newSocket.emit("join_conversation", {
                conversationid: conversationId,
                myuserid: userId
            });
        });

        newSocket.on("disconnect", () => setIsConnected(false));

        newSocket.on("receive_message", (message: any) => {
            setMessages((prev) => {
                const messageId = message._id || (message.createdAt + message.text);
                if (prev.find(m => (m._id && m._id === message._id) || (m.createdAt === message.createdAt && m.text === message.text))) {
                    return prev;
                }
                return [...prev, message];
            });
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        });

        setSocket(newSocket);
        return () => { newSocket.disconnect(); };
    }, [conversationId, user]);

    const handleSendMessage = async () => {
        if ((!inputMessage.trim() && selectedImages.length === 0) || !conversationId) return;

        const formData = new FormData();
        formData.append("data", JSON.stringify({ text: inputMessage }));
        selectedImages.forEach((image) => formData.append("images", image));

        try {
            const response = await sendMessage({ id: conversationId, data: formData }).unwrap();
            
            // Immediately update UI if the response contains the message
            if (response?.data) {
                const newMessage = response.data;
                setMessages((prev) => {
                    const messageId = newMessage._id || (newMessage.createdAt + newMessage.text);
                    if (prev.find(m => (m._id && m._id === newMessage._id) || (m.createdAt === newMessage.createdAt && m.text === newMessage.text))) {
                        return prev;
                    }
                    return [...prev, newMessage];
                });
                setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
            }
            
            setInputMessage("");
            setSelectedImages([]);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed to send message",
                text: "Something went wrong while sending your message. Please try again.",
                confirmButtonColor: "#F96803"
            });
        }
    };

    const formatMessageTime = (dateStr?: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return format(date, "hh:mm a");
    };

    const formatMessageDate = (dateStr?: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isToday(date)) return "Today";
        if (isYesterday(date)) return "Yesterday";
        return format(date, "MMMM dd, yyyy");
    };

    // Grouping messages by date
    const groupedMessages = useMemo(() => {
        const groups: { [key: string]: Message[] } = {};
        messages.forEach(msg => {
            const date = formatMessageDate(msg.createdAt);
            if (!groups[date]) groups[date] = [];
            groups[date].push(msg);
        });
        return groups;
    }, [messages]);

    if (isHistoryLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className={`w-12 h-12 animate-spin ${textPrimary} mx-auto transition-all`} />
                    <p className={`mt-4 ${textSecondarygray} font-medium`}>Loading your conversation...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-hidden relative">
            {/* Header - Fixed height */}
            <div className="bg-white px-4 py-3 border-b flex items-center justify-between shadow-sm z-20 shrink-0">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="md:hidden">
                        <ChevronLeft className={`w-5 h-5 ${textSecondarygray}`} />
                    </Button>
                    <div className="relative">
                        <div className={`w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center overflow-hidden border ${borderPrimary}`}>
                            {otherUser?.photo ? (
                                <img src={otherUser.photo} alt={otherUser.fullname} className="w-full h-full object-cover" />
                            ) : (
                                <span className={`font-bold ${textPrimary}`}>{otherUser?.fullname?.charAt(0) || "U"}</span>
                            )}
                        </div>
                        {/* {isConnected && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )} */}
                    </div>
                    <div>
                        <h2 className="text-sm md:text-base font-bold text-gray-900 leading-tight truncate max-w-[120px] md:max-w-none">
                            {otherUser?.fullname || "Our Consultant"}
                        </h2>
                        <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                            {isConnected ? (
                                <><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Connected</>
                            ) : "Offline"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className={`${textSecondarygray} hover:${textPrimary} hover:bg-orange-50 rounded-full hidden sm:flex`}>
                        <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className={`${textSecondarygray} hover:${textPrimary} hover:bg-orange-50 rounded-full hidden sm:flex`}>
                        <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className={`${textSecondarygray} hover:${textPrimary} hover:bg-orange-50 rounded-full`}>
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Messages Area - Flexible growing height */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scroll-smooth pb-10" id="scroll-area">
                {hasMore && (
                    <div className="flex justify-center -mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => p + 1)}
                            disabled={isFetching}
                            className={`text-xs h-8 px-4 rounded-full border-gray-200 ${textPrimary} hover:bg-orange-50 transition-all font-semibold`}
                        >
                            {isFetching ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                            Load Previous Messages
                        </Button>
                    </div>
                )}

                {messages.length === 0 && !isFetching && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-40">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <Send className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className={`${textSecondarygray} font-medium`}>No messages yet. Say hi!</p>
                    </div>
                )}

                {Object.entries(groupedMessages).map(([date, dateMsgs]) => (
                    <div key={date} className="space-y-6">
                        <div className="flex justify-center">
                            <span className="px-3 py-1 bg-white border border-gray-100 shadow-sm rounded-full text-[10px] uppercase tracking-wider font-bold text-gray-400">
                                {date}
                            </span>
                        </div>
                        {dateMsgs.map((msg, idx) => {
                            const userId = user?._id || user?.id;
                            const isMe = (typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId) === userId;
                            const sender = typeof msg.senderId === 'object' ? msg.senderId : null;
                            const showAvatar = !isMe;
                            
                            return (
                                <div
                                    key={msg._id || idx}
                                    className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                >
                                    {showAvatar && (
                                        <div className={`w-8 h-8 rounded-full bg-orange-50 border ${borderPrimary} shrink-0 flex items-center justify-center overflow-hidden mb-1`}>
                                            {sender?.photo ? (
                                                <img src={sender.photo} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className={`text-xs font-bold ${textPrimary}`}>{sender?.fullname?.charAt(0) || "U"}</span>
                                            )}
                                        </div>
                                    )}
                                    <div className={`flex flex-col max-w-[75%] md:max-w-[60%] ${isMe ? "items-end" : "items-start"}`}>
                                        <div
                                            className={`relative px-4 py-2.5 rounded-2xl shadow-sm text-sm ${isMe
                                                ? `${buttonbg} rounded-br-sm`
                                                : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                                                }`}
                                        >
                                            {msg.images && msg.images.length > 0 && (
                                                <div className="mb-2 grid gap-1 grid-cols-1 select-none">
                                                    {msg.images.map((img, i) => (
                                                        <img key={i} src={img} alt="Attachment" className="max-w-full rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-sm" />
                                                    ))}
                                                </div>
                                            )}
                                            {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                                        </div>
                                        <span className={`text-[9px] mt-1.5 font-bold uppercase tracking-tighter ${isMe ? "opacity-60" : "text-gray-400"}`}>
                                            {formatMessageTime(msg.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input Section - Fixed at bottom */}
            <div className="bg-white border-t p-2 md:p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 shrink-0">
                {selectedImages.length > 0 && (
                    <div className="flex gap-2 mb-3 bg-gray-50 p-2 rounded-xl overflow-x-auto border border-dashed border-gray-200">
                        {selectedImages.map((file, index) => (
                            <div key={index} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border shadow-sm group">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <button
                                    onClick={() => setSelectedImages(p => p.filter((_, i) => i !== index))}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex gap-2 items-center max-w-6xl mx-auto">
                    <div className="flex gap-1">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className={`${textSecondarygray} hover:${textPrimary} hover:bg-orange-50 h-9 w-9 my-auto rounded-full`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Paperclip className="w-5 h-5" />
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files && setSelectedImages(p => [...p, ...Array.from(e.target.files!)])}
                        />
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Type your message here..."
                            className={`w-full bg-gray-50 border-gray-200 rounded-2xl px-4 py-3 pr-12 text-sm focus:ring-[#F96803] focus:border-[#F96803] resize-none min-h-[44px] max-h-32 transition-all scrollbar-hide`}
                            rows={1}
                        />
                        <Button
                            type="button"
                            size="icon"
                            className={`absolute right-1.5 bottom-1.5 h-7 w-7 mb-2 rounded-full shadow-lg ${buttonbg} text-white hover:scale-105 active:scale-95 transition-all`}
                            onClick={handleSendMessage}
                            disabled={(!inputMessage.trim() && selectedImages.length === 0) || isSending}
                        >
                            {isSending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
