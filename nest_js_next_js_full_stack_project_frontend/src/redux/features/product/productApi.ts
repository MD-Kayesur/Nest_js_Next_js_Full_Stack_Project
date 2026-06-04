import { baseApi } from "../../hooks/baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => "categories", // Assuming the endpoint is /categories
    }),
    getAllProducts: builder.query({
      query: () => "products",
    }),
    getProductById: builder.query({
      query: (id) => `products/${id}`,
    }),
    addProduct: builder.mutation({
      query: (productData) => ({
        url: "products",
        method: "POST",
        body: productData,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `products/${id}`,
        method: "PATCH",
        body: productData,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
