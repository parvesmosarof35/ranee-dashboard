import { baseApi } from "./baseApi";

export const chatApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
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

export const { useGetConversationQuery, useSendMessageMutation } = chatApi;
