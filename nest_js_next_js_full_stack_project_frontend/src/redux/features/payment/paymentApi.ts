import { baseApi } from "../../hooks/baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: "payments/create-intent",
        method: "POST",
        body: data,
      }),
    }),
    confirmPayment: builder.mutation({
      query: (data) => ({
        url: "payments/confirm",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart", "Orders"],
    }),
    createCodPayment: builder.mutation({
      query: (data) => ({
        url: "payments/create-cod",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart", "Orders"],
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
  useCreateCodPaymentMutation,
} = paymentApi;
