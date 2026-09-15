"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { globalServerRequest } from "@/actions/globalApi";
import toast from "react-hot-toast";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
  "AcSjcn-dI9WSpKGaQ27OCtb_k3yuMpaNpEk_uc6EieJ-MIaVvWUu4mgCrdc5T7cEo3tOciK2e0cEN6ye";

interface CheckOutProps {
  bookingData?: any;
}

const PaymentPage = ({ bookingData }: CheckOutProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMethod, setSelectedMethod] = useState("paypal");
  const urlBookingId =
    searchParams.get("booking_id") || searchParams.get("bookingId");
  const bDataStr = searchParams.get("bData");

  let currentBookingData = bookingData;
  if (!currentBookingData && bDataStr) {
    try {
      currentBookingData = JSON.parse(bDataStr);
    } catch (e) { }
  }

  const bookingId =
    urlBookingId || currentBookingData?.bookingId || currentBookingData?.id;
  const paymentType = searchParams.get("paymenttype") || "initial";
  const [checkoutData, setCheckoutData] = useState<any>();
  const [couponCode, setCouponCode] = useState<string>("");

  const isFirstPayment =
    checkoutData?.first_payment_status === true ||
    checkoutData?.first_payment_status === 1 ||
    checkoutData?.first_payment_status === "true";

  useEffect(() => {
    if (isFirstPayment) {
      setSelectedMethod("paypal");
    }
  }, [isFirstPayment]);

  const fetchCheckoutDetails = async () => {
    if (!bookingId) return;
    try {
      const response = await globalServerRequest({
        endpoint: "quotes/final-checkout",
        method: "POST",
        payload: {
          booking_id: bookingId || checkoutData?.bookingId,
        },
      } as any);

      if (response.success) {
        setCheckoutData(response.data?.data || response.data);
      } else {
        console.error("Failed to fetch checkout details:", response.error);
      }
    } catch (error) {
      console.error("Error fetching checkout details:", error);
    }
  };

  useEffect(() => {
    fetchCheckoutDetails();
  }, [bookingId]);

  const handleApplyCoupon = async () => {
    if (
      checkoutData?.job_summary?.coupon_offer?.coupon_code !== null &&
      couponCode === checkoutData?.job_summary?.coupon_offer?.coupon_code
    ) {
      toast.success("Coupon already applied");
      return;
    }

    try {
      const response = await globalServerRequest({
        endpoint: "quotes/apply-coupon",
        method: "POST",
        payload: {
          quote_id: checkoutData?.quote_id,
          coupon_code: couponCode,
        },
      } as any);

      if (response.success) {
        toast.success("Coupon applied successfully");
        setCheckoutData(response.data?.data || response.data);
        await fetchCheckoutDetails();
      } else {
        console.error("Failed to apply coupon:", response.error);
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
    }
  };

  const handleProceed = () => {
    if (selectedMethod === "paypal") {
      const targetPath = checkoutData?.hasCard
        ? "/payment-method"
        : "/add-new-card";

      const queryParams = new URLSearchParams({
        quote_id: checkoutData?.quote_id || "",
        initialpayment:
          checkoutData?.job_summary?.initial_deposit_paid?.amount?.toString() ||
          "",
        remaingPayment:
          checkoutData?.job_summary?.remaining_cost?.toString() || "",
        paymenttype: paymentType,
      });

      router.push(`${targetPath}?${queryParams.toString()}`);
    } else if (selectedMethod === "zelle") {
      const queryParams = new URLSearchParams({
        booking_id: bookingId || "",
        quoteId: checkoutData?.quote_id || "",
        initialpayment:
          checkoutData?.job_summary?.initial_deposit_paid?.amount?.toString() ||
          "",
        remaingPayment:
          checkoutData?.job_summary?.remaining_cost?.toString() || "",
        paymenttype: paymentType || "full",
        zelle_phone: checkoutData?.zelle_phone || "",
        zelle_email: checkoutData?.zelle_email || "",
      });

      router.push(`/zelle-payment?${queryParams.toString()}`);
    }
  };

  const currentQuoteId = checkoutData?.quote_id || bookingId;
  const payAmount =
    checkoutData?.job_summary?.remaining_cost ||
    checkoutData?.job_summary?.initial_deposit_paid?.amount ||
    0;

  const handleCreatePayPalOrder = async () => {
    try {
      const response = await globalServerRequest({
        endpoint: "payment/card/create-paypal-order",
        method: "POST",
        payload: {
          amount: String(Number(payAmount).toFixed(2)),
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

  const handleApprovePayPalOrder = async (data: any) => {
    const toastId = toast.loading("Processing payment...");
    try {
      const response = await globalServerRequest({
        endpoint: "payment/card/customer-pay-now",
        method: "POST",
        payload: {
          type: paymentType,
          quote_id: String(currentQuoteId),
          amount: String(Number(payAmount).toFixed(2)),
          order_id: String(data?.orderID),
        },
      });

      if (response?.success) {
        toast.success(
          response?.data?.message || "Payment completed successfully!",
          { id: toastId }
        );
        router.push("/booking");
      } else {
        toast.error(
          response?.error ||
          response?.data?.message ||
          "Failed to complete payment.",
          { id: toastId }
        );
      }
    } catch (error) {
      console.error("PayPal payment execution error:", error);
      toast.error("Something went wrong during payment processing.", {
        id: toastId,
      });
    }
  };

  const handleConfirmPaymentClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const orderId = await handleCreatePayPalOrder();
      if (orderId) {
        window.location.href = `https://www.paypal.com/checkoutnow?token=${orderId}`;
      }
    } catch (err) {
      console.error("PayPal order creation error:", err);
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
                      <Link href="/booking">
                        <img src="images/home/left-arrow.svg" alt="" />
                      </Link>
                      Payment
                    </h2>
                  </div>
                </div>

                <div className="checkout-wrp">
                  <div className="payment-main">
                    <div className="payment-wrp">
                      <p>Please review and confirm your remaining balance.</p>

                      <div className="payment-in">
                        <h5>JOB SUMMARY {checkoutData?.quote_code}</h5>

                        <h6>
                          Initial Deposit Paid{" "}
                          <b>
                            $
                            {
                              checkoutData?.job_summary?.initial_deposit_paid
                                ?.amount
                            }
                          </b>
                        </h6>

                        <h6>
                          Subscription Offer
                          <span className="offer-tag">
                            {
                              checkoutData?.job_summary?.subscription_offer
                                ?.discount_percentage
                            }
                            % OFF
                          </span>{" "}
                          <b>
                            $
                            {
                              checkoutData?.job_summary?.subscription_offer
                                ?.discount_amount
                            }
                          </b>
                        </h6>
                        <hr />
                        <h6 className="text-black">
                          Total Service Cost
                          <b style={{ color: "#991318" }}>
                            <del className="text-black"></del> $
                            {checkoutData?.job_summary?.total_service_cost}
                          </b>
                        </h6>
                        <h6>
                          Coupon Offer{" "}
                          <span
                            className={
                              checkoutData?.job_summary?.coupon_offer
                                ?.coupon_code !== null
                                ? "offer-tag"
                                : ""
                            }
                          >
                            {
                              checkoutData?.job_summary?.coupon_offer
                                ?.coupon_code
                            }
                          </span>
                          <b>
                            $
                            {
                              checkoutData?.job_summary?.coupon_offer
                                ?.discount_amount
                            }
                          </b>
                        </h6>
                        <h6 className="mb-0" style={{ fontSize: "larger" }}>
                          Remaining Cost
                          <b
                            style={{
                              fontSize: "larger",
                              color: "#991318",
                            }}
                          >
                            ${checkoutData?.job_summary?.remaining_cost}
                          </b>
                        </h6>
                      </div>
                    </div>
                    <div className="select-pay-met">
                      <h4>Select Payment Method</h4>

                      <ul style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "flex-start", justifyContent: "flex-start", width: "100%", textAlign: "left" }}>
                        <li style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", display: "flex" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", width: "100%", justifyContent: "flex-start" }}>
                            <input
                              type="radio"
                              value="paypal"
                              name="payment"
                              checked={selectedMethod === "paypal"}
                              onChange={(e) =>
                                setSelectedMethod(e.target.value)
                              }
                            />{" "}
                            PayPal
                          </label>
                        </li>

                        {!isFirstPayment && (
                          <li style={{ width: "100%", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", display: "flex" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", width: "100%", justifyContent: "flex-start" }}>
                              <input
                                type="radio"
                                value="zelle"
                                name="payment"
                                checked={selectedMethod === "zelle"}
                                onChange={(e) =>
                                  setSelectedMethod(e.target.value)
                                }
                              />{" "}
                              Zelle
                            </label>
                            {selectedMethod === "zelle" && (
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
                                {checkoutData?.zelle_email && (
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
                                )}
                              </div>
                            )}
                          </li>
                        )}
                      </ul>

                      <h4>Have a Coupon?</h4>

                      <div className="coupon-field">
                        <input
                          type="text"
                          placeholder="Enter code (e.g. SEVA10)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button type="submit" onClick={handleApplyCoupon}>
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="smart-analysis">
                    <p>
                      You have 24 hours to complete the payment, else it will be
                      deducted automatically from the added credit card with 3%
                      extra charge.
                    </p>
                  </div>
                  <br />
                  <div className="payment-btom">
                    <div className="card-help">
                      {selectedMethod === "paypal" ? (
                        <div style={{ position: "relative", display: "inline-flex" }}>
                          <a
                            onClick={handleConfirmPaymentClick}
                            className="primary-cta"
                            style={{ cursor: "pointer" }}
                          >
                            Pay Now
                          </a>
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              opacity: 0.001,
                              overflow: "hidden",
                              zIndex: 10,
                            }}
                          >
                            <PayPalScriptProvider
                              options={{
                                clientId: PAYPAL_CLIENT_ID,
                                currency: "USD",
                              }}
                            >
                              <PayPalButtons
                                style={{ layout: "horizontal", height: 40, tagline: false }}
                                createOrder={handleCreatePayPalOrder}
                                onApprove={handleApprovePayPalOrder}
                                onError={(err) => {
                                  console.error("PayPal Error:", err);
                                  toast.error("PayPal initialization or transaction error.");
                                }}
                              />
                            </PayPalScriptProvider>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleProceed}
                          className="primary-cta"
                          style={{ cursor: "pointer", border: "none" }}
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PaymentPage;

// "use client";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { globalServerRequest } from "@/actions/globalApi";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// interface CheckOutProps {
//   bookingData?: any;
// }

// const PaymentPage = ({ bookingData }: CheckOutProps) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [selectedMethod, setSelectedMethod] = useState("paypal");
//   const urlBookingId =
//     searchParams.get("booking_id") || searchParams.get("bookingId");
//   const bDataStr = searchParams.get("bData");
//   console.log(bookingData, "booking data ********");
//   let currentBookingData = bookingData;
//   if (!currentBookingData && bDataStr) {
//     try {
//       currentBookingData = JSON.parse(bDataStr);
//     } catch (e) {}
//   }
//   console.log("bookingData", currentBookingData);
//   const bookingId =
//     urlBookingId || currentBookingData?.bookingId || currentBookingData?.id;
//   const paymentType = searchParams.get("paymenttype") || "initial";
//   const [checkoutData, setCheckoutData] = useState<any>();
//   const fetchCheckoutDetails = async () => {
//     if (!bookingId) return;
//     try {
//       const response = await globalServerRequest({
//         endpoint: "quotes/final-checkout",
//         method: "POST",
//         payload: {
//           booking_id: bookingId || checkoutData?.bookingId,
//         },
//       } as any);

//       if (response.success) {
//         console.log("Checkout details fetched successfully:", response.data);
//         setCheckoutData(response.data?.data || response.data);
//       } else {
//         console.error("Failed to fetch checkout details:", response.error);
//       }
//     } catch (error) {
//       console.error("Error fetching checkout details:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCheckoutDetails();
//   }, [bookingId]);

//   const [couponCode, setCouponCode] = useState<string>("");

//   const handleApplyCoupon = async () => {
//     if (
//       checkoutData?.job_summary?.coupon_offer?.coupon_code !== null &&
//       couponCode === checkoutData?.job_summary?.coupon_offer?.coupon_code
//     ) {
//       console.log("Coupon already applied");
//       toast.success("Coupon already applied");
//       return;
//     }

//     try {
//       const response = await globalServerRequest({
//         endpoint: "quotes/apply-coupon",
//         method: "POST",
//         payload: {
//           quote_id: checkoutData?.quote_id,
//           coupon_code: couponCode,
//         },
//       } as any);

//       if (response.success) {
//         console.log("Coupon applied successfully:", response.data);
//         toast.success("Coupon applied successfully");

//         setCheckoutData(response.data?.data || response.data);
//         await fetchCheckoutDetails();
//       } else {
//         console.error("Failed to apply coupon:", response.error);
//         toast.error(response.error);
//       }
//     } catch (error) {
//       console.error("Error applying coupon:", error);
//     }
//   };

//  const handleProceed = () => {
//   if (selectedMethod === "paypal") {
//     const targetPath = checkoutData?.hasCard ? "/payment-method" : "/add-new-card";

//     router.push(
//       `${targetPath}?quote_id=${checkoutData?.quote_id || ""}&initialpayment=${checkoutData?.job_summary?.initial_deposit_paid?.amount || ""}&remaingPayment=${checkoutData?.job_summary?.remaining_cost || ""}&paymenttype=${paymentType}`
//     );
//   } else if (selectedMethod === "zelle") {
//     router.push(`/zelle-payment?booking_id=${bookingId}&paymenttype=full`);
//   }
// };
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
//                       <Link href="/booking">
//                         <img src="images/home/left-arrow.svg" alt="" />
//                       </Link>
//                       Payment
//                     </h2>
//                   </div>
//                 </div>

//                 <div className="checkout-wrp">
//                   <div className="payment-main">
//                     <div className="payment-wrp">
//                       <p>Please review and confirm your remaining balance.</p>

//                       <div className="payment-in">
//                         <h5>JOB SUMMARY {checkoutData?.quote_code}</h5>

//                         <h6>
//                           Initial Deposit Paid{" "}
//                           <b>
//                             $
//                             {
//                               checkoutData?.job_summary?.initial_deposit_paid
//                                 ?.amount
//                             }
//                           </b>
//                         </h6>

//                         <h6>
//                           Subscription Offer
//                           <span className="offer-tag">
//                             {
//                               checkoutData?.job_summary?.subscription_offer
//                                 ?.discount_percentage
//                             }
//                             % OFF
//                           </span>{" "}
//                           <b>
//                             $
//                             {
//                               checkoutData?.job_summary?.subscription_offer
//                                 ?.discount_amount
//                             }
//                           </b>
//                         </h6>
//                         <hr />
//                         <h6 className="text-black">
//                           Total Service Cost
//                           <b style={{ color: "#991318" }}>
//                             <del className="text-black"></del> $
//                             {checkoutData?.job_summary?.total_service_cost}
//                           </b>
//                         </h6>
//                         <h6>
//                           Coupon Offer{" "}
//                           <span
//                             className={
//                               checkoutData?.job_summary?.coupon_offer
//                                 ?.coupon_code !== null
//                                 ? "offer-tag"
//                                 : ""
//                             }
//                           >
//                             {
//                               checkoutData?.job_summary?.coupon_offer
//                                 ?.coupon_code
//                             }
//                           </span>
//                           <b>
//                             $
//                             {
//                               checkoutData?.job_summary?.coupon_offer
//                                 ?.discount_amount
//                             }
//                           </b>
//                         </h6>
//                         <h6 className="mb-0" style={{ fontSize: "larger" }}>
//                           Remaining Cost
//                           <b
//                             style={{
//                               fontSize: "larger",
//                               color: "#991318",
//                             }}
//                           >
//                             ${checkoutData?.job_summary?.remaining_cost}
//                           </b>
//                         </h6>
//                       </div>
//                     </div>
//                     <div className="select-pay-met">
//                       <h4>Select Payment Method</h4>

//                       <ul>
//                         <li>
//                           <label>
//                             <input
//                               type="radio"
//                               value="paypal"
//                               name="payment"
//                               checked={selectedMethod === "paypal"}
//                               onChange={(e) =>
//                                 setSelectedMethod(e.target.value)
//                               }
//                             />{" "}
//                             PayPal
//                           </label>
//                         </li>

//                         <li>
//                           <label>
//                             <input
//                               type="radio"
//                               value="zelle"
//                               name="payment"
//                               checked={selectedMethod === "zelle"}
//                               onChange={(e) =>
//                                 setSelectedMethod(e.target.value)
//                               }
//                             />{" "}
//                             Zelle
//                           </label>
//                         </li>
//                       </ul>
//                       {/* <ul>
//                         <li>
//                           <input
//                             type="radio"
//                             value="1"
//                             name="payment-method"
//                             defaultChecked
//                           />{" "}
//                           PayPal
//                         </li>

//                         <li>
//                           <input type="radio" value="2" name="zelle-payment" />{" "}
//                           Zelle
//                         </li>

//                       </ul> */}

//                       <h4>Have a Coupon?</h4>

//                       <div className="coupon-field">
//                         <input
//                           type="text"
//                           placeholder="Enter code (e.g. SEVA10)"
//                           value={couponCode}
//                           onChange={(e) => setCouponCode(e.target.value)}
//                         />
//                         <button type="submit" onClick={handleApplyCoupon}>
//                           Apply
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="smart-analysis">
//                     <p>
//                       You have 24 hours to complete the payment, else it will be
//                       deducted automatically from the added credit card with 3%
//                       extra charge.
//                     </p>
//                   </div>
//                   <br />
//                   <div className="payment-btom">
//                     <div className="card-help">
//                       <Link
//                         href={
//                           checkoutData?.hasCard
//                             ? {
//                                 pathname: "/payment-method",
//                                 query: {
//                                   quote_id: checkoutData?.quote_id || "",
//                                   initialpayment:
//                                     checkoutData?.job_summary
//                                       ?.initial_deposit_paid?.amount,
//                                   remaingPayment:
//                                     checkoutData?.job_summary?.remaining_cost,
//                                   paymenttype: paymentType,
//                                 },
//                               }
//                             : {
//                                 pathname: "/add-new-card",
//                                 query: {
//                                   quote_id: checkoutData?.quote_id || "",
//                                   initialpayment:
//                                     checkoutData?.job_summary
//                                       ?.initial_deposit_paid?.amount,
//                                   remaingPayment:
//                                     checkoutData?.job_summary?.remaining_cost,
//                                   paymenttype: paymentType,
//                                 },
//                               }
//                         }
//                         className="primary-cta"
//                       >
//                         Pay Now
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// };

// export default PaymentPage;
