"use client";
import React, { Suspense, useState, useEffect } from "react";
import { globalServerRequest } from "@/actions/globalApi";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// @ts-ignore
import * as braintree from "braintree-web";

// const PAYPAL_CLIENT_ID =
//   process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
//   "AcSjcn-dI9WSpKGaQ27OCtb_k3yuMpaNpEk_uc6EieJ-MIaVvWUu4mgCrdc5T7cEo3tOciK2e0cEN6ye";

const braintreeTokenizationKey = "sandbox_bkv6vn9s_8gjjrj3w6gpngkmr"

interface CheckOutProps {
  bookingData?: any;
}

const CheckOutContent = ({ bookingData }: CheckOutProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingId =
    searchParams.get("booking_id") || searchParams.get("bookingId");
  const paymenttype = searchParams.get("paymenttype") || "initial";

  const [paypalInstance, setPaypalInstance] = useState<any>(null);
  const [paypalLoading, setPaypalLoading] = useState(true);

  const [venmoInstance, setVenmoInstance] = useState<any>(null);
  const [venmoLoading, setVenmoLoading] = useState(true);

  const [isTokenizing, setIsTokenizing] = useState(false);

  const [checkoutData, setCheckoutData] = useState<any>();
  console.log(checkoutData, "check out data*******");
  const [paymentMethod, setPaymentMethod] = useState<any>('4');

  const isFirstPayment =
    checkoutData?.first_payment_status === true ||
    checkoutData?.first_payment_status === 1 ||
    checkoutData?.first_payment_status === "true";

  useEffect(() => {
    if (isFirstPayment) {
      setPaymentMethod("1");
    }
  }, [isFirstPayment]);

  useEffect(() => {
    const fetchCheckoutDetails = async () => {
      if (!bookingId) return;
      try {
        const response = await globalServerRequest({
          endpoint: "quotes/checkout",
          method: "POST",
          payload: { quote_id: Number(bookingId) },
        } as any);

        if (response.success) {
          setCheckoutData(response.data?.data || response.data);
        }
      } catch (error) {
        console.error("Error fetching checkout details:", error);
      }
    };
    fetchCheckoutDetails();
  }, [bookingId]);

  const initialPayment =
    checkoutData?.job_summary?.initial_deposit?.amount || 0;
  const remainingPayment = checkoutData?.job_summary?.remaining_amount || 0;

  const totalCost =
    checkoutData?.job_summary?.total_service_cost ||
    initialPayment + remainingPayment;

  const finalAmount = initialPayment;

  const currentQuoteId = checkoutData?.quote_id || bookingData?.quoteId || bookingId;

  const handleCreatePayPalOrder = async () => {
    try {
      const response = await globalServerRequest({
        endpoint: "payment/card/create-paypal-order",
        method: "POST",
        payload: {
          amount: String(1),
          booking_id: Number(currentQuoteId),
        },
      });

      if (response?.success) {
        const orderId =
          response.data?.data?.order_id ||
          response.data?.order_id ||
          response.data?.data?.id;

        if (orderId) {
          return orderId;
        }
      }
      const errorMsg =
        response?.error ||
        response?.data?.message ||
        "Failed to create PayPal order.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } catch (error: any) {
      console.error("Error creating PayPal order:", error);
      toast.error(error?.message || "Failed to create PayPal order.");
      throw error;
    }
  };

  // const handleApprovePayPalOrder = async (data: any) => {
  //   const toastId = toast.loading("Processing payment...");
  //   try {
  //     const response = await globalServerRequest({
  //       endpoint: "payment/card/customer-pay-now",
  //       method: "POST",
  //       payload: {
  //         type: paymenttype || "initial",
  //         quote_id: String(currentQuoteId),
  //         amount: String(finalAmount.toFixed(2)),
  //         order_id: String(data?.orderID),
  //       },
  //     });

  //     if (response?.success) {
  //       toast.success(
  //         response?.data?.message || "Payment completed successfully!",
  //         { id: toastId }
  //       );
  //       router.push("/booking");
  //     } else {
  //       toast.error(
  //         response?.error ||
  //         response?.data?.message ||
  //         "Failed to complete payment.",
  //         { id: toastId }
  //       );
  //     }
  //   } catch (error) {
  //     console.error("PayPal payment execution error:", error);
  //     toast.error("Something went wrong during payment processing.", {
  //       id: toastId,
  //     });
  //   }
  // };

  // const handleConfirmPaymentClick = async (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   try {
  //     const orderId = await handleCreatePayPalOrder();
  //     if (orderId) {
  //       window.location.href = `https://www.paypal.com/checkoutnow?token=${orderId}`;
  //     }
  //   } catch (err) {
  //     console.error("PayPal order creation error:", err);
  //   }
  // };

  const initializeBraintree = async () => {
    try {
      setPaypalLoading(true);
      setVenmoLoading(true);

      const clientInstance = await braintree.client.create({
        authorization: braintreeTokenizationKey,
      });

      console.log("Braintree client created");

      const paypalInstance = await braintree.paypal.create({
        client: clientInstance,
      });

      console.log("Braintree PayPal created");
      setPaypalInstance(paypalInstance);

      if (braintree.venmo) {
        try {
          const venmoInstance = await braintree.venmo.create({
            client: clientInstance,
            allowDesktop: true,
            allowDesktopWebLogin: true,
            allowNewBrowserTab: true,
            paymentMethodUsage: 'multi_use'
          });
          console.log("Braintree Venmo created");
          setVenmoInstance(venmoInstance);
        } catch (venmoError) {
          console.error("Braintree Venmo initialization error:", venmoError);
        }
      }

    } catch (error) {
      console.error("Braintree initialization error:", error);
      toast.error("Unable to initialize Braintree payment methods");
    } finally {
      setPaypalLoading(false);
      setVenmoLoading(false);
    }
  };

  useEffect(() => {
    if (!checkoutData || !braintreeTokenizationKey) return;

    initializeBraintree();
  }, [checkoutData, braintreeTokenizationKey]);

  const handleBraintreePayment = async (nonce: string) => {
    const toastId = toast.loading("Processing payment...");

    try {
      const response = await globalServerRequest({
        endpoint: "payment/card/customer-pay-now",
        method: "POST",
        payload: {
          type: paymenttype || "initial",
          quote_id: String(currentQuoteId),
          amount: paymentMethod === "1" ? String(1) : String(finalAmount.toFixed(2)),
          nonce: nonce,
        },
      });

      if (response?.success) {
        toast.success(
          response?.data?.message ||
          "Payment completed successfully!",
          {
            id: toastId,
          }
        );

        router.push("/booking");
      } else {
        toast.error(
          response?.error ||
          response?.data?.message ||
          "Failed to complete payment.",
          {
            id: toastId,
          }
        );
      }
    } catch (error) {
      console.error("Braintree payment error:", error);

      toast.error(
        "Something went wrong during payment processing.",
        {
          id: toastId,
        }
      );
    }
  };

  const handleStartPayPal = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isTokenizing) return;
    if (!paypalInstance) {
      toast.error("PayPal is still loading...");
      return;
    }

    try {
      setIsTokenizing(true);
      const payload = await paypalInstance.tokenize({
        flow: 'checkout',
        amount: "1.00",
        currency: 'USD'
      });

      console.log("Braintree nonce:", payload.nonce);

      await handleBraintreePayment(payload.nonce);
    } catch (error: any) {
      if (error.code === 'PAYPAL_POPUP_CLOSED') {
        console.error("Customer closed PayPal popup.");
        toast.error("PayPal popup was closed.");
      } else {
        console.error("PayPal start error:", error);
        toast.error("Unable to open PayPal. Please check popup blockers.");
      }
    } finally {
      setIsTokenizing(false);
    }
  };

  const handleStartVenmo = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isTokenizing) return;
    if (!venmoInstance) {
      toast.error("Venmo is still loading or unavailable...");
      return;
    }

    try {
      setIsTokenizing(true);
      const payload = await venmoInstance.tokenize();

      console.log("Braintree Venmo nonce:", payload.nonce);

      await handleBraintreePayment(payload.nonce);
    } catch (error: any) {
      if (error.code === 'VENMO_CANCELED') {
        console.error("Customer canceled Venmo.");
        toast.error("Venmo payment was canceled.");
      } else {
        console.error("Venmo start error:", error);
        toast.error("Unable to open Venmo. Please check popup blockers.");
      }
    } finally {
      setIsTokenizing(false);
    }
  };

  return (
    <main>
      <div
        className="container home-wraper my-profile"
        style={{ height: "auto" }}
      >
        <section>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="browse-wrp">
                  <div className="browse-ctg-head my-con-head">
                    <h2 className="sub-cate-page">
                      <button
                        onClick={() => router.back()}
                        className="btn p-0 m-0"
                      >
                        <img src="images/home/left-arrow.svg" alt="" />
                      </button>
                      Checkout
                    </h2>
                  </div>
                </div>
                <div className="checkout-wrp">
                  <div className="checkout-steps">
                    <div className="checkout-step-in check">
                      <div className="checkout-step-in-count">
                        <i className="fa-solid fa-check"></i>
                      </div>
                      <div className="checkout-step-in-data">
                        <h5>Step 1</h5>
                        <p>Accept Job</p>
                      </div>
                    </div>
                    <div className="checkout-step-in">
                      <div className="checkout-step-in-count">
                        02
                      </div>
                      <div className="checkout-step-in-data">
                        <h5>Step 2</h5>
                        <p>Payment</p>
                      </div>
                    </div>
                  </div>
                  <div className="cost-details-wrp">
                    <h4>Booking Cost Details (ID: {bookingId})</h4>
                    <div className="cost-details-in">
                      <p>
                        Deposit / Deductible Amount{" "}
                        <span>${initialPayment.toFixed(2)}</span>
                      </p>
                      <p>
                        Remaining Cost{" "}
                        <span>${remainingPayment.toFixed(2)}</span>
                      </p>
                      <hr />
                      <p>
                        Total Cost{" "}
                        <span>
                          <b>${totalCost.toFixed(2)}</b>
                        </span>
                      </p>
                      <p
                        className="pay-now-highlight"
                        style={{ marginTop: "10px" }}
                      >
                        <b>Pay Now: </b>
                        <span>
                          <b>${finalAmount.toFixed(2)}</b>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="select-pay-met">
                    <h4>Select Payment Method</h4>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "flex-start", justifyContent: "flex-start", width: "100%", textAlign: "left" }}>
                      
                       <li style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", display: "flex" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", width: "100%", justifyContent: "flex-start" }}>
                          <input
                            type="radio"
                            value="4"
                            name="payment-method"
                            // defaultChecked
                            checked={paymentMethod === "4"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />{" "}
                            Pay by card(Debit/Credit)
                        </label>
                      </li>
                      
                      
                      <li style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", display: "flex" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", width: "100%", justifyContent: "flex-start" }}>
                          <input
                            type="radio"
                            value="1"
                            name="payment-method"
                            // defaultChecked
                            checked={paymentMethod === "1"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />{" "}
                          PayPal
                        </label>
                      </li>
                      <li style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", display: "flex" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", width: "100%", justifyContent: "flex-start" }}>
                          <input
                            type="radio"
                            value="3"
                            name="payment-method"
                            checked={paymentMethod === "3"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />{" "}
                          Venmo
                        </label>
                      </li>
                      <li style={{ width: "100%", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", display: "flex" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", width: "100%", justifyContent: "flex-start" }}>
                            <input
                              type="radio"
                              value="2"
                              name="payment-method"
                              checked={paymentMethod === "2"}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            />{" "}
                            Zelle
                          </label>
                          {paymentMethod === "2" && (
                            <div style={{ marginTop: "12px", width: "100%", paddingLeft: "25px" }}>
                              {checkoutData?.zelle_phone && (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", fontWeight: "400" }}>
                                  <span>Send amount to: <b>{checkoutData.zelle_phone}</b></span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(checkoutData.zelle_phone);
                                      toast.success("Phone number copied!");
                                    }}
                                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 6px", color: "#363636" }}
                                    title="Copy phone number"
                                  >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                  </button>
                                </div>
                              )}
                              {/* {checkoutData?.zelle_email && (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", fontWeight: "400" }}>
                                  <span>Send amount to: <b>{checkoutData.zelle_email}</b></span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(checkoutData.zelle_email);
                                      toast.success("Email copied!");
                                    }}
                                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 6px", color: "#363636" }}
                                    title="Copy email"
                                  >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                  </button>
                                </div>
                              )} */}
                            </div>
                          )}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-help">
                  {paymentMethod === "1" ? (
                    <a
                      onClick={handleStartPayPal}
                      className="primary-cta"
                      style={{
                        cursor: (paypalLoading || isTokenizing) ? "not-allowed" : "pointer",
                        opacity: (paypalLoading || isTokenizing) ? 0.6 : 1,
                      }}
                    >
                      {paypalLoading ? "Loading PayPal..." : isTokenizing ? "Opening..." : "Pay Now"}
                    </a>
                  ) : paymentMethod === "3" ? (
                    <a
                      onClick={handleStartVenmo}
                      className="primary-cta"
                      style={{
                        cursor: (venmoLoading || isTokenizing) ? "not-allowed" : "pointer",
                        opacity: (venmoLoading || isTokenizing) ? 0.6 : 1,
                      }}
                    >
                      {venmoLoading ? "Loading Venmo..." : isTokenizing ? "Opening..." : "Pay Now"}
                    </a>
                  ) : paymentMethod === "2" ? (
                    <Link
                      href={{
                        pathname: `/zelle-payment`,
                        query: {
                          booking_id: bookingId || bookingData?.bookingId,
                          initialpayment: initialPayment,
                          remaingPayment: remainingPayment,
                          paymenttype: paymenttype,
                          quoteId:
                            checkoutData?.quote_id || bookingData?.quoteId || "",
                          zelle_phone: checkoutData?.zelle_phone || "",
                          zelle_email: checkoutData?.zelle_email || "",
                        },
                      }}
                      className="primary-cta"
                    >
                      Confirm Payment
                    </Link>
                  ) :  paymentMethod === "4" ? (
                   
                    <Link
                          href={{
                            pathname: checkoutData?.hasCard
                              ? "/payment-method"
                              : "/add-new-card",
                            query: {
                              booking_id: bookingId || bookingData?.bookingId,
                              initialpayment: initialPayment,
                              remaingPayment: remainingPayment,
                              paymenttype: paymenttype,
                              quoteId:
                                checkoutData?.quote_id || bookingData?.quoteId || "",
                            },
                          }}
                          className="primary-cta"
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          Pay Now
                        </Link>
                  ): null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default function CheckOut({ bookingData }: CheckOutProps) {
  return (
    <Suspense
      fallback={
        <div className="text-center p-5">Loading checkout details...</div>
      }
    >
      <CheckOutContent bookingData={bookingData} />
    </Suspense>
  );
}









// / "use client";
// import React, { Suspense, useState, useEffect } from "react";
// import { globalServerRequest } from "@/actions/globalApi";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import toast from "react-hot-toast";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// const PAYPAL_CLIENT_ID =
//   process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
//   "AcSjcn-dI9WSpKGaQ27OCtb_k3yuMpaNpEk_uc6EieJ-MIaVvWUu4mgCrdc5T7cEo3tOciK2e0cEN6ye";

// interface CheckOutProps {
//   bookingData?: any;
// }

// const CheckOutContent = ({ bookingData }: CheckOutProps) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const bookingId =
//     searchParams.get("booking_id") || searchParams.get("bookingId");
//   const paymenttype = searchParams.get("paymenttype") || "initial";

//   const [checkoutData, setCheckoutData] = useState<any>();
//   console.log(checkoutData, "check out data*******");
//   const [paymentMethod, setPaymentMethod] = useState<any>('1');

//   const isFirstPayment =
//     checkoutData?.first_payment_status === true ||
//     checkoutData?.first_payment_status === 1 ||
//     checkoutData?.first_payment_status === "true";

//   useEffect(() => {
//     if (isFirstPayment) {
//       setPaymentMethod("1");
//     }
//   }, [isFirstPayment]);

//   useEffect(() => {
//     const fetchCheckoutDetails = async () => {
//       if (!bookingId) return;
//       try {
//         const response = await globalServerRequest({
//           endpoint: "quotes/checkout",
//           method: "POST",
//           payload: { quote_id: Number(bookingId) },
//         } as any);

//         if (response.success) {
//           setCheckoutData(response.data?.data || response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching checkout details:", error);
//       }
//     };
//     fetchCheckoutDetails();
//   }, [bookingId]);

//   const initialPayment =
//     checkoutData?.job_summary?.initial_deposit?.amount || 0;
//   const remainingPayment = checkoutData?.job_summary?.remaining_amount || 0;

//   const totalCost =
//     checkoutData?.job_summary?.total_service_cost ||
//     initialPayment + remainingPayment;

//   const finalAmount = initialPayment;

//   const currentQuoteId = checkoutData?.quote_id || bookingData?.quoteId || bookingId;

//   const handleCreatePayPalOrder = async () => {
//     try {
//       const response = await globalServerRequest({
//         endpoint: "payment/card/create-paypal-order",
//         method: "POST",
//         payload: {
//           amount: String(finalAmount.toFixed(2)),
//           booking_id: Number(currentQuoteId),
//         },
//       });

//       if (response?.success) {
//         const orderId =
//           response.data?.data?.order_id ||
//           response.data?.order_id ||
//           response.data?.data?.id;

//         if (orderId) {
//           return orderId;
//         }
//       }
//       const errorMsg =
//         response?.error ||
//         response?.data?.message ||
//         "Failed to create PayPal order.";
//       toast.error(errorMsg);
//       throw new Error(errorMsg);
//     } catch (error: any) {
//       console.error("Error creating PayPal order:", error);
//       toast.error(error?.message || "Failed to create PayPal order.");
//       throw error;
//     }
//   };

//   const handleApprovePayPalOrder = async (data: any) => {
//     const toastId = toast.loading("Processing payment...");
//     try {
//       const response = await globalServerRequest({
//         endpoint: "payment/card/customer-pay-now",
//         method: "POST",
//         payload: {
//           type: paymenttype || "initial",
//           quote_id: String(currentQuoteId),
//           amount: String(finalAmount.toFixed(2)),
//           order_id: String(data?.orderID),
//         },
//       });

//       if (response?.success) {
//         toast.success(
//           response?.data?.message || "Payment completed successfully!",
//           { id: toastId }
//         );
//         router.push("/booking");
//       } else {
//         toast.error(
//           response?.error ||
//           response?.data?.message ||
//           "Failed to complete payment.",
//           { id: toastId }
//         );
//       }
//     } catch (error) {
//       console.error("PayPal payment execution error:", error);
//       toast.error("Something went wrong during payment processing.", {
//         id: toastId,
//       });
//     }
//   };

//   const handleConfirmPaymentClick = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     try {
//       const orderId = await handleCreatePayPalOrder();
//       if (orderId) {
//         window.location.href = `https://www.paypal.com/checkoutnow?token=${orderId}`;
//       }
//     } catch (err) {
//       console.error("PayPal order creation error:", err);
//     }
//   };

//   return (
//     <main>
//       <div
//         className="container home-wraper my-profile"
//         style={{ height: "auto" }}
//       >
//         <section>
//           <div className="container">
//             <div className="row">
//               <div className="col-lg-12">
//                 <div className="browse-wrp">
//                   <div className="browse-ctg-head my-con-head">
//                     <h2 className="sub-cate-page">
//                       <button
//                         onClick={() => router.back()}
//                         className="btn p-0 m-0"
//                       >
//                         <img src="images/home/left-arrow.svg" alt="" />
//                       </button>
//                       Checkout
//                     </h2>
//                   </div>
//                 </div>
//                 <div className="checkout-wrp">
//                   <div className="checkout-steps">
//                     <div className="checkout-step-in check">
//                       <div className="checkout-step-in-count">
//                         <i className="fa-solid fa-check"></i>
//                       </div>
//                       <div className="checkout-step-in-data">
//                         <h5>Step 1</h5>
//                         <p>Accept Job</p>
//                       </div>
//                     </div>
//                     <div className="checkout-step-in">
//                       <div className="checkout-step-in-count">
//                         02
//                       </div>
//                       <div className="checkout-step-in-data">
//                         <h5>Step 2</h5>
//                         <p>Payment</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="cost-details-wrp">
//                     <h4>Booking Cost Details (ID: {bookingId})</h4>
//                     <div className="cost-details-in">
//                       <p>
//                         Deposit / Deductible Amount{" "}
//                         <span>${initialPayment.toFixed(2)}</span>
//                       </p>
//                       <p>
//                         Remaining Cost{" "}
//                         <span>${remainingPayment.toFixed(2)}</span>
//                       </p>
//                       <hr />
//                       <p>
//                         Total Cost{" "}
//                         <span>
//                           <b>${totalCost.toFixed(2)}</b>
//                         </span>
//                       </p>
//                       <p
//                         className="pay-now-highlight"
//                         style={{ marginTop: "10px" }}
//                       >
//                         <b>Pay Now: </b>
//                         <span>
//                           <b>${finalAmount.toFixed(2)}</b>
//                         </span>
//                       </p>
//                     </div>
//                   </div>
//                   <div className="select-pay-met">
//                     <h4>Select Payment Method</h4>
//                     <ul style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "flex-start", justifyContent: "flex-start", width: "100%", textAlign: "left" }}>
//                       <li style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", display: "flex" }}>
//                         <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", width: "100%", justifyContent: "flex-start" }}>
//                           <input
//                             type="radio"
//                             value="1"
//                             name="payment-method"
//                             // defaultChecked
//                             checked={paymentMethod === "1"}
//                             onChange={(e) => setPaymentMethod(e.target.value)}
//                           />{" "}
//                           PayPal
//                         </label>
//                       </li>
//                       {!isFirstPayment && (
//                         <li style={{ width: "100%", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", display: "flex" }}>
//                           <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", width: "100%", justifyContent: "flex-start" }}>
//                             <input
//                               type="radio"
//                               value="2"
//                               name="payment-method"
//                               checked={paymentMethod === "2"}
//                               onChange={(e) => setPaymentMethod(e.target.value)}
//                             />{" "}
//                             Zelle
//                           </label>
//                           {paymentMethod === "2" && (
//                             <div style={{ marginTop: "12px", width: "100%", paddingLeft: "25px" }}>
//                               {checkoutData?.zelle_phone && (
//                                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", fontWeight: "400" }}>
//                                   <span>Send amount to: <b>{checkoutData.zelle_phone}</b></span>
//                                   <button
//                                     type="button"
//                                     onClick={() => {
//                                       navigator.clipboard.writeText(checkoutData.zelle_phone);
//                                       toast.success("Phone number copied!");
//                                     }}
//                                     style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 6px", color: "#363636" }}
//                                     title="Copy phone number"
//                                   >
//                                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                       <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
//                                       <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
//                                     </svg>
//                                   </button>
//                                 </div>
//                               )}
//                               {checkoutData?.zelle_email && (
//                                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", fontWeight: "400" }}>
//                                   <span>Send amount to: <b>{checkoutData.zelle_email}</b></span>
//                                   <button
//                                     type="button"
//                                     onClick={() => {
//                                       navigator.clipboard.writeText(checkoutData.zelle_email);
//                                       toast.success("Email copied!");
//                                     }}
//                                     style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 6px", color: "#363636" }}
//                                     title="Copy email"
//                                   >
//                                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                       <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
//                                       <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
//                                     </svg>
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </li>
//                       )}
//                       {/* <li>
//                         <input type="radio" value="3" name="payment-method" checked={paymentMethod === "1"}
//                           onChange={(e) => setPaymentMethod(e.target.value)} />{" "}
//                         Venmo
//                       </li> */}
//                     </ul>
//                   </div>
//                 </div>
//                 <div className="card-help">
//                   {paymentMethod === "1" ? (
//                     <div style={{ position: "relative", display: "inline-flex" }}>
//                       <a
//                         onClick={handleConfirmPaymentClick}
//                         className="primary-cta"
//                         style={{ cursor: "pointer" }}
//                       >
//                         Confirm Payment
//                       </a>
//                       <div
//                         style={{
//                           position: "absolute",
//                           top: 0,
//                           left: 0,
//                           width: "100%",
//                           height: "100%",
//                           opacity: 0.001,
//                           overflow: "hidden",
//                           zIndex: 10,
//                         }}
//                       >
//                         <PayPalScriptProvider
//                           options={{
//                             clientId: PAYPAL_CLIENT_ID,
//                             currency: "USD",
//                           }}
//                         >
//                           <PayPalButtons
//                             style={{ layout: "horizontal", height: 40, tagline: false }}
//                             createOrder={handleCreatePayPalOrder}
//                             onApprove={handleApprovePayPalOrder}
//                             onError={(err) => {
//                               console.error("PayPal Error:", err);
//                               toast.error("PayPal initialization or transaction error.");
//                             }}
//                           />
//                         </PayPalScriptProvider>
//                       </div>
//                     </div>
//                   ) : (
//                     <Link
//                       href={{
//                         pathname: `/zelle-payment`,
//                         query: {
//                           booking_id: bookingId || bookingData?.bookingId,
//                           initialpayment: initialPayment,
//                           remaingPayment: remainingPayment,
//                           paymenttype: paymenttype,
//                           quoteId:
//                             checkoutData?.quote_id || bookingData?.quoteId || "",
//                           zelle_phone: checkoutData?.zelle_phone || "",
//                           zelle_email: checkoutData?.zelle_email || "",
//                         },
//                       }}
//                       className="primary-cta"
//                     >
//                       Confirm Payment
//                     </Link>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// };

// export default function CheckOut({ bookingData }: CheckOutProps) {
//   return (
//     <Suspense
//       fallback={
//         <div className="text-center p-5">Loading checkout details...</div>
//       }
//     >
//       <CheckOutContent bookingData={bookingData} />
//     </Suspense>
//   );
// }
