"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, MapPin, CreditCard, ShieldCheck } from "lucide-react";
import { useGetMyCartQuery, useClearCartMutation } from "../../redux/features/cart/cartApi";
import { useCreateOrderMutation } from "../../redux/features/order/orderApi";
import { useCreatePaymentIntentMutation, useConfirmPaymentMutation, useCreateCodPaymentMutation } from "../../redux/features/payment/paymentApi";
import { Header } from "../../components/landing/Header";
import { Footer } from "../../components/landing/Footer";

// Stripe Imports
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Make sure to use your own publishable key in production!
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_TYooMQauvdEDq54NiTphI7jx");

function StripeCheckoutForm({ clientSecret, orderId, onSuccess, onError }: { clientSecret: string, orderId: string, onSuccess: () => void, onError: (msg: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [confirmPaymentApi] = useConfirmPaymentMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !isCardComplete) return;

    setIsProcessing(true);
    
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
        setIsProcessing(false);
        return;
    }

    // 1. Confirm payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      }
    });

    if (error) {
      onError(error.message || "An error occurred with your payment.");
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        // 2. Notify backend of success
        await confirmPaymentApi({
          paymentIntentId: paymentIntent.id,
          orderId,
          status: 'COMPLETED',
          message: 'Payment confirmed successfully'
        }).unwrap();
        
        onSuccess();
      } catch (err: any) {
        console.error("Backend confirmation failed:", err);
        onError("Payment processed, but failed to sync with our servers. Contact support.");
        setIsProcessing(false);
      }
    } else {
      onError("Payment was not completed.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
        <CardElement 
          onChange={(e) => setIsCardComplete(e.complete)}
          options={{ 
            style: { 
              base: { 
                color: '#fff', 
                fontSize: '16px', 
                '::placeholder': { color: '#aab7c4' } 
              },
              invalid: { color: '#ef4444' }
            } 
          }} 
        />
      </div>
      <button 
        disabled={isProcessing || !stripe || !elements || !isCardComplete}
        className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-lg rounded-2xl transition-all shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:bg-emerald-800 disabled:text-emerald-300"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5" />
            <span>Pay Now</span>
          </>
        )}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  
  const { data: cartData, isLoading: isLoadingCart } = useGetMyCartQuery(undefined);
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [createPaymentIntent, { isLoading: isCreatingIntent }] = useCreatePaymentIntentMutation();
  const [createCodPayment, { isLoading: isCreatingCod }] = useCreateCodPaymentMutation();
  const [clearCart] = useClearCartMutation();

  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  
  const [error, setError] = useState("");

  // Payment State
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('stripe');

  const cart = cartData?.data || cartData;
  const cartItems = cart?.cartItems || [];

  const subtotal = cartItems.reduce((acc: number, item: any) => {
    return acc + (item.product.price * item.quantity);
  }, 0);

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoadingCart && cartItems.length === 0 && step === 1) {
      router.push("/cart");
    }
  }, [isLoadingCart, cartItems, router, step]);

  const handleCreateOrderAndIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!addressLine.trim() || !city.trim() || !state.trim() || !zipCode.trim() || !country.trim()) {
      setError("Please fill out all shipping fields.");
      return;
    }

    const fullShippingAddress = `${addressLine.trim()}, ${city.trim()}, ${state.trim()}, ${zipCode.trim()}, ${country.trim()}`;

    try {
      const orderItems = cartItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.product.price)
      }));

      // 1. Create Order
      const orderResponse = await createOrder({
        items: orderItems,
        shippingAddress: fullShippingAddress
      }).unwrap();

      const createdOrderId = orderResponse.data?.id || orderResponse.id;
      setOrderId(createdOrderId);

      // 2. Create Payment Intent via Stripe
      const intentResponse = await createPaymentIntent({
        orderId: createdOrderId,
        amount: subtotal,
        currency: 'usd', // Modify if your shop uses another currency
        description: 'Checkout Order'
      }).unwrap();

      if (intentResponse.data?.clientSecret) {
        setClientSecret(intentResponse.data.clientSecret);
        setStep(2); // Move to payment step
      } else {
        throw new Error("Invalid response from payment gateway.");
      }
      
    } catch (err: any) {
      console.error("Initialization failed:", err);
      setError(err?.data?.message || err?.message || "Failed to initialize payment. Please try again.");
    }
  };

  const handlePaymentSuccess = async () => {
    // Clear cart and redirect
    try {
      await clearCart(undefined).unwrap();
    } catch(e) {
      console.error("Cart clear error:", e);
    }
    router.push("/checkout/success?type=stripe");
  };

  const handleCodSubmit = async () => {
    setError("");
    try {
      await createCodPayment({ orderId, amount: subtotal, currency: 'usd', description: 'Cash on Delivery' }).unwrap();
      try {
        await clearCart(undefined).unwrap();
      } catch(e) {
        console.error("Cart clear error:", e);
      }
      router.push("/checkout/success?type=cod");
    } catch(err: any) {
      console.error("COD submission failed:", err);
      setError("Failed to place COD order. Please try again.");
    }
  };

  if (isLoadingCart || (cartItems.length === 0 && step === 1)) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
          <span className="text-zinc-500 mt-4 font-medium uppercase tracking-widest text-sm">Loading Secure Checkout...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white selection:bg-zinc-800 scroll-smooth">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 z-10 relative">
        {step === 1 ? (
          <button 
            onClick={() => router.back()}
            className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors w-fit font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Cart
          </button>
        ) : (
          <button 
            onClick={() => setStep(1)}
            className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors w-fit font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shipping
          </button>
        )}

        <div className="mb-10 flex items-center gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Secure <span className="text-emerald-400">Checkout</span>
          </h1>
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-full text-xs font-semibold border border-zinc-800">
            <span className={step === 1 ? "text-emerald-400" : "text-zinc-500"}>1. Shipping</span>
            <span className="text-zinc-600">→</span>
            <span className={step === 2 ? "text-emerald-400" : "text-zinc-500"}>2. Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Form Steps */}
          <div className="lg:col-span-2">
            
            {step === 1 && (
              <form onSubmit={handleCreateOrderAndIntent} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Shipping Details</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                        Address Line
                      </label>
                      <input
                        required
                        type="text"
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        placeholder="123 Example Street, Apt 4B"
                        className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-zinc-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                        City
                      </label>
                      <input
                        required
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City Name"
                        className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-zinc-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                        State / Province
                      </label>
                      <input
                        required
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                        className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-zinc-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                        Zip Code
                      </label>
                      <input
                        required
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="10001"
                        className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-zinc-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                        Country
                      </label>
                      <input
                        required
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="United States"
                        className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-zinc-600"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-medium">
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isCreatingOrder || isCreatingIntent}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-lg rounded-2xl transition-all shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isCreatingOrder || isCreatingIntent ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Initializing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Payment</span>
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 2 && clientSecret && (
              <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Payment Method</h2>
                </div>

                <div className="flex gap-4 mb-6">
                   <button 
                     onClick={() => setPaymentMethod('stripe')}
                     className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-all ${paymentMethod === 'stripe' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}>
                     Pay with Card
                   </button>
                   <button 
                     onClick={() => setPaymentMethod('cod')}
                     className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-all ${paymentMethod === 'cod' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}>
                     Cash on Delivery
                   </button>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-medium">
                    {error}
                  </div>
                )}

                <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800/50">
                  {paymentMethod === 'stripe' ? (
                    <Elements stripe={stripePromise}>
                      <StripeCheckoutForm 
                        clientSecret={clientSecret} 
                        orderId={orderId} 
                        onSuccess={handlePaymentSuccess} 
                        onError={setError} 
                      />
                    </Elements>
                  ) : (
                    <div className="space-y-6">
                       <p className="text-zinc-400">You will pay in cash when your order is delivered to your address. Please ensure you have the exact amount ready.</p>
                       <button 
                          onClick={handleCodSubmit}
                          disabled={isCreatingCod}
                          className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-lg rounded-2xl transition-all shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                        >
                          {isCreatingCod ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /><span>Processing...</span></>
                          ) : (
                            <><ShieldCheck className="w-5 h-5" /><span>Place Order (COD)</span></>
                          )}
                        </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 backdrop-blur sticky top-6">
              <h3 className="text-xl font-bold text-white mb-6">Order Review</h3>
              
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-zinc-950 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-800">
                      {item.product.imageUrl && (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white line-clamp-1">{item.product.name}</h4>
                      <div className="text-xs text-zinc-500 mt-1">Qty: {item.quantity}</div>
                      <div className="text-emerald-400 font-semibold text-sm mt-1">
                        ${(Number(item.product.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800/50 pt-6 space-y-3 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/50 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Total to Pay</span>
                  <span className="text-2xl font-extrabold text-white">${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
