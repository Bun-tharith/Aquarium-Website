import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const fetchBaseQueryCustom = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_FORUM_BASE_URL,
  prepareHeaders: (headers) => {
    const accessToken =
      localStorage.getItem("accessToken") || import.meta.env.VITE_ACCESS_TOKEN;

    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

export const forumApi = createApi({
  reducerPath: "forumApi",
  baseQuery: fetchBaseQueryCustom,
  tagTypes: [
    "Posts",
    "Post",
    "Comments",
    "Comment",
    "Tags",
    "Tag",
    "Users",
    "User",
    "Votes",
    "Bookmarks",
    "Media",
  ],
  endpoints: () => ({}),
});