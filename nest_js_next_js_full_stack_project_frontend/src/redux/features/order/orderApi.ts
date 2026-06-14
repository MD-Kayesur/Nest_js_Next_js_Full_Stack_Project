import { baseApi } from "../../hooks/baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Cart", "Orders"],
    }),
    getMyOrders: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams(params).toString();
        return `orders/my-orders?${queryParams}`;
      },
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
} = orderApi;
