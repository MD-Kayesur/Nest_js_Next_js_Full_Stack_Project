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
        const queryParams = params ? new URLSearchParams(params).toString() : '';
        return queryParams ? `orders/my-orders?${queryParams}` : `orders/my-orders`;
      },
      providesTags: ["Orders"],
    }),
    getAllOrders: builder.query({
      query: (params) => {
        const queryParams = params ? new URLSearchParams(params).toString() : '';
        return queryParams ? `orders/admin/all-orders?${queryParams}` : `orders/admin/all-orders`;
      },
      providesTags: ["Orders"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `orders/admin/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
