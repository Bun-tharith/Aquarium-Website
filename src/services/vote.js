import { forumApi } from "./api";

export const voteService = forumApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /votes
    createVote: builder.mutation({
      query: ({ newVote }) => ({
        url: `/votes`,
        method: "POST",
        body: newVote,
      }),
      invalidatesTags: ["Votes", "Posts"],
    }),

    // GET /votes/{voteId}
    getVoteById: builder.query({
      query: (voteId) => `/votes/${voteId}`,
      providesTags: (result, error, voteId) => [{ type: "Votes", id: voteId }],
    }),

    // PUT /votes/{voteId}
    updateVoteById: builder.mutation({
      query: ({ updatedVote, voteId }) => ({
        url: `/votes/${voteId}`,
        method: "PUT",
        body: updatedVote,
      }),
      invalidatesTags: ["Votes", "Posts"],
    }),

    // DELETE /votes/{voteId}
    deleteVoteById: builder.mutation({
      query: ({ voteId }) => ({
        url: `/votes/${voteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Votes", "Posts"],
    }),
  }),
});

export const {
  useCreateVoteMutation,
  useGetVoteByIdQuery,
  useUpdateVoteByIdMutation,
  useDeleteVoteByIdMutation,
} = voteService;
