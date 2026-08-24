import { forumApi } from "./api";

export const tagService = forumApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /tags
    getAllTags: builder.query({
      query: () => `/tags`,
      providesTags: ["Tags"],
    }),

    // GET /tags/{tagId}
    getTagById: builder.query({
      query: (tagId) => `/tags/${tagId}`,
      providesTags: (result, error, tagId) => [{ type: "Tag", id: tagId }],
    }),

    // POST /tags
    createTag: builder.mutation({
      query: ({ newTag }) => ({
        url: `/tags`,
        method: "POST",
        body: newTag, // expects { tagName: "..." }
      }),
      invalidatesTags: ["Tags"],
    }),

    // PUT /tags/{tagId}
    updateTagById: builder.mutation({
      query: ({ updatedTag, tagId }) => ({
        url: `/tags/${tagId}`,
        method: "PUT",
        body: updatedTag, // expects { tagName: "..." }
      }),
      invalidatesTags: (result, error, arg) => [
        "Tags",
        { type: "Tag", id: arg.tagId },
      ],
    }),

    // DELETE /tags/{tagId}
    deleteTagById: builder.mutation({
      query: ({ tagId }) => ({
        url: `/tags/${tagId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tags"],
    }),

    // GET /tags/top/{limit}
    getTopTags: builder.query({
      query: (limit) => `/tags/top/${limit}`,
      providesTags: ["Tags"],
    }),

    // GET /tags/popular
    getPopularTags: builder.query({
      query: () => `/tags/popular`,
      providesTags: ["Tags"],
    }),

    // GET /tags/search?query=
    searchTags: builder.query({
      query: (searchQuery) => `/tags/search?query=${encodeURIComponent(searchQuery)}`,
      providesTags: ["Tags"],
    }),
  }),
});

export const {
  useGetAllTagsQuery,
  useGetTagByIdQuery,
  useCreateTagMutation,
  useUpdateTagByIdMutation,
  useDeleteTagByIdMutation,
  useGetTopTagsQuery,
  useGetPopularTagsQuery,
  useSearchTagsQuery,
} = tagService;