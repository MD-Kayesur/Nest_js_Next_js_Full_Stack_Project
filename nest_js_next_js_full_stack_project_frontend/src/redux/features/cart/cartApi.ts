import { baseApi } from "../../hooks/baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCart: builder.query({
      query: () => "carts/my-cart",
    }),

    addToCart: builder.mutation({
      query: (cartItemData: { productId: string; quantity: number }) => ({
        url: "carts/items",
        method: "POST",
        body: cartItemData,
      }),
    }),

    updateCartItem: builder.mutation({
      query: ({ id, quantity }: { id: string; quantity: number }) => ({
        url: `carts/items/${id}`,
        method: "PATCH",
        body: { quantity },
      }),
    }),

    removeFromCart: builder.mutation({
      query: (id: string) => ({
        url: `carts/items/${id}`,
        method: "DELETE",
      }),
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: "carts",
        method: "DELETE",
      }),
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

