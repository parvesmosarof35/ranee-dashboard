"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/auth-context";
import { buttonbg } from "@/contexts/theme";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, Paperclip, X, Search as SearchIcon } from "lucide-react";
import { useGetConversationQuery, useSendMessageMutation } from "@/store/api/chatApi";
import { getBaseUrl, getImageBaseUrl } from "@/store/config/envConfig";

interface Message {
    _id?: string;
    senderId: string | { _id: string; fullname?: string; email?: string };
    text: string;
    createdAt?: string;
    images?: string[];
}

export default function ChatPage() {
    const { id: conversationId } = useParams();
    const searchParams = useSearchParams();
    const receiverId = searchParams.get("receiverId");
    const { user } = useAuth();

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

    const scrollRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch messages
    const { data: conversationData, isLoading: isHistoryLoading, isFetching } = useGetConversationQuery({
        id: conversationId,
        page,
        limit: 10,
        searchTerm
    }, {
        skip: !conversationId,
        refetchOnMountOrArgChange: true
    });

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
                // Scroll to bottom only on initial load or search reset
                if (!isHistoryLoading) {
                    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
                }
            } else {
                // Prepend older messages
                setMessages((prev) => [...newMessages, ...prev]);
            }
        }
    }, [conversationData/*, page, searchTerm*/]); // Intentionally omitting page/searchTerm to rely on data change

    // Handle Search
    useEffect(() => {
        setPage(1);
        setMessages([]);
    }, [searchTerm]);

    // Handle Load More
    const loadMoreMessages = () => {
        if (hasMore && !isFetching) {
            setPage(prev => prev + 1);
        }
    };

    // Socket Connection
    useEffect(() => {
        if (!user || !conversationId) return;

        console.log("Attempting to connect with:", { conversationId, userId: user?._id, user });

        // Use appropriate URL. HTML used http://localhost:5000, 
        // we should use env config or window.location.origin if relative
        // Trying to deduce from common practices or env.
        const socketUrl = process.env.NEXT_PUBLIC_IMG_URL || "http://localhost:5000";

        const newSocket = io(socketUrl);

        newSocket.on("connect", () => {
            console.log("Connected to socket");
            setIsConnected(true);

            // Join conversation
            const userId = user._id || user.id || user.uid;
            console.log("Joining with userId:", userId);

            newSocket.emit("join_conversation", {
                conversationid: conversationId,
                myuserid: userId
            });
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from socket");
            setIsConnected(false);
        });

        newSocket.on("join_confirmation", (data) => {
            console.log("Joined conversation:", data);
        });

        newSocket.on("receive_message", (message: any) => {
            console.log("Received message:", message);
            // Append message if it's not already in the list (deduplication check logic might be needed)
            // For now, just append.
            setMessages((prev) => [...prev, message]);
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        });

        newSocket.on("error", (err) => {
            console.error("Socket error:", err);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [conversationId, user]);



    const handleSendMessage = async () => {
        if ((!inputMessage.trim() && selectedImages.length === 0) || !conversationId) return;

        const formData = new FormData();
        const data = {
            text: inputMessage,
        };
        formData.append("data", JSON.stringify(data));

        selectedImages.forEach((image) => {
            formData.append("images", image);
        });

        try {
            await sendMessage({ id: conversationId, data: formData }).unwrap();

            // Clear input
            setInputMessage("");
            setSelectedImages([]);

            // Note: We don't manually add the message here because we rely on the socket 'receive_message' event 
            // to update the UI, which avoids duplication and ensures consistency.
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedImages((prev) => [...prev, ...Array.from(e.target.files || [])]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    };

    if (isHistoryLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 h-[calc(100vh-100px)]">
            <Card className="h-full flex flex-col shadow-lg border-gray-100">
                <CardHeader className="pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold text-gray-800">Chat</CardTitle>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${isConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {isConnected ? "Connected" : "Disconnected"}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0 flex flex-col relative">
                    {/* Search Bar */}
                    <div className="px-4 py-2 border-b bg-gray-50">
                        <div className="relative">
                            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search messages..."
                                className="pl-9 bg-white border-gray-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto" ref={scrollRef}>
                        {/* Load More Button */}
                        {hasMore && (
                            <div className="flex justify-center mb-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={loadMoreMessages}
                                    disabled={isFetching}
                                    className="text-xs text-gray-500 hover:text-gray-800"
                                >
                                    {isFetching ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                    Load previous messages
                                </Button>
                            </div>
                        )}

                        <div className="space-y-4">
                            {messages.length === 0 && !isFetching && (
                                <div className="text-center text-gray-400 py-10">
                                    {searchTerm ? "No messages found matching your search." : "No messages yet. Start the conversation!"}
                                </div>
                            )}
                            {messages.map((msg, index) => {
                                const userId = user?._id || user?.id || user?.uid;
                                const isMe = (typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId) === userId;
                                return (
                                    <div
                                        key={msg._id || index}
                                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe
                                                ? `${buttonbg} text-white rounded-br-none`
                                                : "bg-gray-100 text-gray-800 rounded-bl-none"
                                                }`}
                                        >
                                            {msg.images && msg.images.length > 0 && (
                                                <div className="mb-2">
                                                    {msg.images.map((img, i) => (
                                                        <img key={i} src={img} alt="Attachment" className="max-w-full rounded-lg" />
                                                    ))}
                                                </div>
                                            )}
                                            <p>{msg.text}</p>
                                            {msg.createdAt && (
                                                <p className={`text-[10px] mt-1 text-right ${isMe ? "text-white/70" : "text-gray-400"}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="p-4 bg-white border-t mt-auto">
                        {selectedImages.length > 0 && (
                            <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                                {selectedImages.map((file, index) => (
                                    <div key={index} className="relative w-16 h-16 flex-shrink-0">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-md border"
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            className="flex gap-2 items-center"
                        >
                            <label className="cursor-pointer text-gray-400 hover:text-gray-600">
                                <Paperclip className="w-5 h-5" />
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                            </label>
                            <Input
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 rounded-full border-gray-200 focus:ring-orange-500 focus:border-orange-500"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className={`rounded-full ${buttonbg} text-white hover:opacity-90`}
                                disabled={(!inputMessage.trim() && selectedImages.length === 0) || isSending}
                            >
                                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
