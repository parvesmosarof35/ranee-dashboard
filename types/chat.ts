
export interface Message {
    _id?: string;
    senderId: string | { _id: string; fullname?: string; email?: string; photo?: string };
    receiverId?: string | { _id: string; fullname?: string; email?: string; photo?: string };
    text: string;
    createdAt?: string;
    images?: string[];
}

export interface UserStatusPayload {
    userId: string;
    isOnline: boolean;
    lastSeen: string | null;
}

export interface TypingPayload {
    conversationId: string;
    userId: string;
}

export interface SendMessagePayload {
    conversationId: string;
    senderId: string;
    text?: string;
}

export interface MarkAsSeenPayload {
    conversationId: string;
    userId: string;
}

export interface SocketEvents {
    // Shared
    typing: (data: TypingPayload) => void;
    stop_typing: (data: TypingPayload) => void;

    // Client to Server only
    join_user: (data: { userId: string }) => void;
    join_conversation: (data: { conversationid: string; myuserid: string }) => void;
    send_message: (data: SendMessagePayload) => void;
    mark_as_seen: (data: MarkAsSeenPayload) => void;

    // Server to Client only
    user_status: (data: UserStatusPayload) => void;
    receive_message: (message: Message) => void;
    messages_seen: (data: { conversationId: string; seenBy: string }) => void;
    new_message: (data: { conversationId: string; message: Message }) => void;
    join_confirmation: (data: any) => void;
    error: (data: { message: string }) => void;
}
