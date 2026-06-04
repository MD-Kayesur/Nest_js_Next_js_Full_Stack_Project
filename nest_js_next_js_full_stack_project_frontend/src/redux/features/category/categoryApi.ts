import { baseApi } from "../../hooks/baseApi";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (categoryData) => ({
        url: "categories",
        method: "POST",
        body: categoryData,
      }),
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...categoryData }) => ({
        url: `categories/${id}`,
        method: "PATCH",
        body: categoryData,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `categories/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
