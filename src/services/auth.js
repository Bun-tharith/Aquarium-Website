import { forumApi } from "./api";

export const authService = forumApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /auth/register
    userRegister: builder.mutation({
      query: ({ registerInfo }) => ({
        url: `/auth/register`,
        method: "POST",
        body: registerInfo,
      }),
    }),

    // POST /auth/login
    userLogin: builder.mutation({
      query: ({ loginInfo }) => ({
        url: `/auth/login`,
        method: "POST",
        body: loginInfo,
      }),
    }),
  }),
});

export const { useUserRegisterMutation, useUserLoginMutation } = authService;
