import { baseApi } from "../../hooks/baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCart: builder.query({
      query: () => "carts/my-cart",
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: (cartItemData: { productId: string; quantity: number }) => ({
        url: "carts/items",
        method: "POST",
        body: cartItemData,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation({
      query: ({ id, quantity }: { id: string; quantity: number }) => ({
        url: `carts/items/${id}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: (id: string) => ({
        url: `carts/items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: "carts",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetMyCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;

