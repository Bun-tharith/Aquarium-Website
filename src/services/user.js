import { forumApi } from "./api";

export const userService = forumApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /users/me
    getMe: builder.query({
      query: () => `/users/me`,
      providesTags: ["User"],
    }),

    // GET /users/{userId}
    getUserById: builder.query({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),

    // GET /users/email/{email}
    getUserByEmail: builder.query({
      query: (email) => `/users/email/${encodeURIComponent(email)}`,
      providesTags: ["User"],
    }),

    // GET /users/search?query=
    searchUsers: builder.query({
      query: (searchQuery) =>
        `/users/search?query=${encodeURIComponent(searchQuery)}`,
      providesTags: ["Users"],
    }),

    // PUT /users/update-user
    updateUser: builder.mutation({
      query: ({ updatedUser }) => ({
        url: `/users/update-user`,
        method: "PUT",
        body: {
          username: updatedUser.displayName,
          bio: updatedUser.bio,
        },
      }),
      invalidatesTags: ["User"],
    }),

    // PUT /users/update-password
    updatePassword: builder.mutation({
      query: ({ passwordInfo }) => ({
        url: `/users/update-password`,
        method: "PUT",
        body: {
          oldPassword: passwordInfo.oldPassword,
          newPassword: passwordInfo.newPassword,
          confirmedNewPassword: passwordInfo.confirmPassword,
        },
      }),
    }),

    // PUT /users/upload-image (multipart/form-data)
    uploadAvatar: builder.mutation({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/users/upload-image`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["User"],
    }),

    // DELETE /users/{userId}
    deleteUserById: builder.mutation({
      query: ({ userId }) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetUserByIdQuery,
  useGetUserByEmailQuery,
  useSearchUsersQuery,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useUploadAvatarMutation,
  useDeleteUserByIdMutation,
} = userService;