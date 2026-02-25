
import { io, Socket } from "socket.io-client";
import { imgUrl } from "@/store/config/envConfig";
import {
    SendMessagePayload,
    TypingPayload,
    MarkAsSeenPayload,
    SocketEvents
} from "@/types/chat";

class SocketClient {
    private static instance: SocketClient;
    private socket: Socket | null = null;
    private listeners: Map<string, Set<Function>> = new Map();

    private constructor() { }

    public static getInstance(): SocketClient {
        if (!SocketClient.instance) {
            SocketClient.instance = new SocketClient();
        }
        return SocketClient.instance;
    }

    public connect() {
        if (this.socket?.connected) return this.socket;

        let socketUrl = imgUrl;
        if (socketUrl.endsWith("/")) socketUrl = socketUrl.slice(0, -1);

        console.log("📡 SocketClient: Connecting to", socketUrl);

        this.socket = io(socketUrl, {
            transports: ["polling", "websocket"],
            forceNew: true,
            reconnectionAttempts: 5,
            timeout: 10000,
        });

        this.socket.on("connect", () => {
            console.log("✅ SocketClient: Connected! ID:", this.socket?.id);
            this.reAttachListeners();
        });

        this.socket.on("disconnect", (reason) => {
            console.log("⚠️ SocketClient: Disconnected:", reason);
        });

        this.socket.on("connect_error", (err) => {
            console.error("❌ SocketClient: Connection Error:", err.message);
        });

        return this.socket;
    }

    public disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public getSocket() {
        return this.socket;
    }

    // --- Emitters ---

    public joinUser(userId: string) {
        this.socket?.emit("join_user", { userId });
    }

    public joinConversation(conversationId: string, userId: string) {
        this.socket?.emit("join_conversation", {
            conversationid: conversationId,
            myuserid: userId
        });
    }

    public sendMessage(payload: SendMessagePayload) {
        this.socket?.emit("send_message", payload);
    }

    public typing(conversationId: string, userId: string) {
        this.socket?.emit("typing", { conversationId, userId });
    }

    public stopTyping(conversationId: string, userId: string) {
        this.socket?.emit("stop_typing", { conversationId, userId });
    }

    public markAsSeen(conversationId: string, userId: string) {
        this.socket?.emit("mark_as_seen", { conversationId, userId });
    }

    // --- Listener Management ---

    public addListener(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)?.add(callback);

        if (this.socket) {
            this.socket.on(event, callback as any);
        }
    }

    public removeListener(event: string, callback: Function) {
        this.listeners.get(event)?.delete(callback);
        if (this.socket) {
            this.socket.off(event, callback as any);
        }
    }

    private reAttachListeners() {
        if (!this.socket) return;
        this.listeners.forEach((callbacks, event) => {
            callbacks.forEach(cb => {
                this.socket?.off(event, cb as any);
                this.socket?.on(event, cb as any);
            });
        });
    }
}

export const socketClient = SocketClient.getInstance();
