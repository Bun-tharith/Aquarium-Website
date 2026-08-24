import { forumApi } from "./api";

export const postService = forumApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /posts
    getAllPosts: builder.query({
      query: () => `/posts`,
      providesTags: ["Posts"],
    }),

    // GET /posts/{postId}
    getPostById: builder.query({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, postId) => [{ type: "Post", id: postId }],
    }),

    // GET /posts/tag/{tagId}
    getPostsByTag: builder.query({
      query: (tagId) => `/posts/tag/${tagId}`,
      providesTags: ["Posts"],
    }),

    // POST /posts
    createPost: builder.mutation({
      query: (newPost) => ({
        url: `/posts`,
        method: "POST",
        body: newPost,
      }),
      invalidatesTags: ["Posts"],
    }),

    // PUT /posts/{postId}
    updatePostById: builder.mutation({
      query: ({ updatedPost, postId }) => ({
        url: `/posts/${postId}`,
        method: "PUT",
        body: updatedPost,
      }),
      invalidatesTags: (result, error, arg) => [
        "Posts",
        { type: "Post", id: arg.postId },
      ],
    }),

    // DELETE /posts/{postId}
    deletePostById: builder.mutation({
      query: ({ postId }) => ({
        url: `/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetPostByIdQuery,
  useGetPostsByTagQuery,
  useCreatePostMutation,
  useUpdatePostByIdMutation,
  useDeletePostByIdMutation,
} = postService;