import { baseApi } from "./baseApi";

export const chatApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getConversations: build.query<any, any>({
            query: (args = {}) => ({
                url: `/message/get_all_conversations?page=${args.page || 1}&limit=${args.limit || 10}&searchTerm=${args.searchTerm || ""}`,
                method: "GET",
            }),
            providesTags: ["Booking"],
        }),
        getConversation: build.query({
            query: ({ id, page = 1, limit = 10, searchTerm = "" }) => ({
                url: `/message/get_single_conversation_messages/${id}?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
                method: "GET",
            }),
            providesTags: ["Booking"],
        }),
        sendMessage: build.mutation({
            query: ({ id, data }) => ({
                url: `/message/send-message/${id}`,
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetConversationsQuery,
    useGetConversationQuery,
    useSendMessageMutation
} = chatApi;
