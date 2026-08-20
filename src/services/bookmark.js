import { forumApi as api } from "./api";

// ======================================================
// BOOKMARK API
// ======================================================

export const bookmarkApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ==================================================
    // GET BOOKMARKS
    // ==================================================

    getBookmarks: builder.query({
      query: () => ({
        url: "/bookmarks",
        method: "GET",
      }),

      providesTags: [
        {
          type: "Bookmarks",
          id: "LIST",
        },
      ],
    }),

    // ==================================================
    // ADD BOOKMARK
    // ==================================================

    addBookmark: builder.mutation({
      query: (postIds) => ({
        url: "/bookmarks/add",
        method: "POST",
        body: { postIds },
      }),

      invalidatesTags: [
        {
          type: "Bookmarks",
          id: "LIST",
        },
      ],
    }),

    // ==================================================
    // REMOVE BOOKMARK
    // ==================================================

    removeBookmark: builder.mutation({
      query: (postIds) => ({
        url: "/bookmarks/remove",
        method: "DELETE",
        body: { postIds },
      }),

      invalidatesTags: [
        {
          type: "Bookmarks",
          id: "LIST",
        },
      ],
    }),
  }),

  overrideExisting: false,
});

// ======================================================
// HOOKS
// ======================================================

export const {
  useGetBookmarksQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} = bookmarkApi;