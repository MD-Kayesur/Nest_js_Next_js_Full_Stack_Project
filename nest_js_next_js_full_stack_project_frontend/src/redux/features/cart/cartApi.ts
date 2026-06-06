import { baseApi } from "../../hooks/baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get the active cart for the currently logged-in user
    getMyCart: builder.query({
      query: () => "carts/my-cart",
    }),

    // Add a product item to the cart
    addToCart: builder.mutation({
      query: (cartItemData: { productId: string; quantity: number }) => ({
        url: "carts/items",
        method: "POST",
        body: cartItemData,
      }),
    }),

    // Update the quantity of a specific cart item
    updateCartItem: builder.mutation({
      query: ({ id, quantity }: { id: string; quantity: number }) => ({
        url: `carts/items/${id}`,
        method: "PATCH",
        body: { quantity },
      }),
    }),

    // Remove a specific item from the cart
    removeFromCart: builder.mutation({
      query: (id: string) => ({
        url: `carts/items/${id}`,
        method: "DELETE",
      }),
    }),

    // Clear all items from the cart / delete the active cart
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
