import { forumApi } from "./api";

export const commentService = forumApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /comments
    createComment: builder.mutation({
      query: ({ newComment }) => ({
        url: `/comments`,
        method: "POST",
        body: newComment,
      }),
      invalidatesTags: ["Comments", "Posts"],
    }),

    // GET /comments/{commentId}
    getCommentById: builder.query({
      query: (commentId) => `/comments/${commentId}`,
      providesTags: (result, error, commentId) => [
        { type: "Comment", id: commentId },
      ],
    }),

    // PUT /comments/{commentId}
    updateCommentById: builder.mutation({
      query: ({ updatedComment, commentId }) => ({
        url: `/comments/${commentId}`,
        method: "PUT",
        body: updatedComment,
      }),
      invalidatesTags: (result, error, arg) => [
        "Comments",
        { type: "Comment", id: arg.commentId },
      ],
    }),

    // DELETE /comments/{commentId}
    deleteCommentById: builder.mutation({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments", "Posts"],
    }),

    // GET /comments/user/{userId}
    getCommentsByUser: builder.query({
      query: (userId) => `/comments/user/${userId}`,
      providesTags: ["Comments"],
    }),

    // GET /comments/post/{postId}
    getCommentsByPost: builder.query({
      query: (postId) => `/comments/post/${postId}`,
      providesTags: ["Comments"],
    }),

    // GET /comments/search?query=
    searchComments: builder.query({
      query: (searchQuery) =>
        `/comments/search?query=${encodeURIComponent(searchQuery)}`,
      providesTags: ["Comments"],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetCommentByIdQuery,
  useUpdateCommentByIdMutation,
  useDeleteCommentByIdMutation,
  useGetCommentsByUserQuery,
  useGetCommentsByPostQuery,
  useSearchCommentsQuery,
} = commentService;
