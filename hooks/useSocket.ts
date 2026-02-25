
import { useEffect, useState, useCallback } from "react";
import { socketClient } from "@/lib/socketClient";
import { SendMessagePayload } from "@/types/chat";

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(socketClient.getSocket()?.connected || false);

    useEffect(() => {
        const socket = socketClient.getSocket();
        if (!socket) return;

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    const connect = useCallback(() => {
        socketClient.connect();
    }, []);

    const disconnect = useCallback(() => {
        socketClient.disconnect();
    }, []);

    const joinUser = useCallback((userId: string) => {
        socketClient.joinUser(userId);
    }, []);

    const joinConversation = useCallback((conversationId: string, userId: string) => {
        socketClient.joinConversation(conversationId, userId);
    }, []);

    const sendMessage = useCallback((payload: SendMessagePayload) => {
        socketClient.sendMessage(payload);
    }, []);

    const emitTyping = useCallback((conversationId: string, userId: string) => {
        socketClient.typing(conversationId, userId);
    }, []);

    const emitStopTyping = useCallback((conversationId: string, userId: string) => {
        socketClient.stopTyping(conversationId, userId);
    }, []);

    const markAsSeen = useCallback((conversationId: string, userId: string) => {
        socketClient.markAsSeen(conversationId, userId);
    }, []);

    const useSocketListener = (event: string, callback: (...args: any[]) => void) => {
        useEffect(() => {
            socketClient.addListener(event, callback);
            return () => {
                socketClient.removeListener(event, callback);
            };
        }, [event, callback]);
    };

    return {
        isConnected,
        socket: socketClient.getSocket(),
        connect,
        disconnect,
        joinUser,
        joinConversation,
        sendMessage,
        emitTyping,
        emitStopTyping,
        markAsSeen,
        useSocketListener
    };
};
