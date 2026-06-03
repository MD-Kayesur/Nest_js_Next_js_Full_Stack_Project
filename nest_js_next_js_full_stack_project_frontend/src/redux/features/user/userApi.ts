import { baseApi } from "../../hooks/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "users/me",
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "users/me",
        method: "PATCH",
        body: profileData,
      }),
    }),
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: "users/me/password",
        method: "PATCH",
        body: passwordData,
      }),
    }),
    deleteMe: builder.mutation({
      query: () => ({
        url: "users/me",
        method: "DELETE",
      }),
    }),
    // Admin endpoints
    getAllUsers: builder.query({
      query: () => "users",
    }),
    getUserById: builder.query({
      query: (id) => `users/${id}`,
    }),
    deleteUserById: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteMeMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserByIdMutation,
} = userApi;
