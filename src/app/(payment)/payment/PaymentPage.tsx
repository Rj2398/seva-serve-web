"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { globalServerRequest } from "@/actions/globalApi";
import toast from "react-hot-toast";

interface CheckOutProps {
  bookingData?: any;
}

const PaymentPage = ({ bookingData }: CheckOutProps) => {
  const searchParams = useSearchParams();
  const urlBookingId = searchParams.get("booking_id") || searchParams.get("bookingId");
  const bDataStr = searchParams.get("bData");
  console.log(bookingData, "booking data ********");
  let currentBookingData = bookingData;
  if (!currentBookingData && bDataStr) {
    try {
      currentBookingData = JSON.parse(bDataStr);
    } catch (e) { }
  }
  console.log('bookingData', currentBookingData);
  const bookingId = urlBookingId || currentBookingData?.bookingId || currentBookingData?.id;
  const paymentType = searchParams.get("paymenttype") || "initial";
  const [checkoutData, setCheckoutData] = useState<any>();
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
        console.log("Checkout details fetched successfully:", response.data);
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

  const [couponCode, setCouponCode] = useState<string>("");

  const handleApplyCoupon = async () => {
    if (checkoutData?.job_summary?.coupon_offer?.coupon_code !== null && couponCode === checkoutData?.job_summary?.coupon_offer?.coupon_code) {
      console.log("Coupon already applied");
      toast.success("Coupon already applied")
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
        console.log("Coupon applied successfully:", response.data);
        toast.success("Coupon applied successfully")

        setCheckoutData(response.data?.data || response.data);
        await fetchCheckoutDetails();
      } else {
        console.error("Failed to apply coupon:", response.error);
        toast.error(response.error)

      }
    } catch (error) {
      console.error("Error applying coupon:", error);
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
                      <Link href="/booking" >
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
                            {checkoutData?.job_summary?.initial_deposit_paid?.amount}
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
                          Coupon Offer <span className={checkoutData?.job_summary?.coupon_offer?.coupon_code !== null ? "offer-tag" : ""}>
                            {checkoutData?.job_summary?.coupon_offer?.coupon_code}
                          </span>
                          <b>${checkoutData?.job_summary?.coupon_offer?.discount_amount}</b>
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
                      <ul>
                        <li>
                          <input
                            type="radio"
                            value="1"
                            name="payment-method"
                            defaultChecked
                          />{" "}
                          Credit Card (Stripe)
                        </li>

                        <li>
                          <input type="radio" value="2" name="payment-method" />{" "}
                          Zelle
                        </li>

                        <li>
                          <input type="radio" value="3" name="payment-method" />{" "}
                          Venmo
                        </li>
                      </ul>

                      <h4>Have a Coupon?</h4>

                      <div className="coupon-field">
                        <input
                          type="text"
                          placeholder="Enter code (e.g. SEVA10)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button type="submit" onClick={handleApplyCoupon}>Apply</button>
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
                      <Link
                        href={
                          checkoutData?.hasCard
                            ? {
                              pathname: "/payment-method",
                              query: {
                                quote_id: checkoutData?.quote_id || "",
                                initialpayment:
                                  checkoutData?.job_summary?.initial_deposit_paid
                                    ?.amount,
                                remaingPayment:
                                  checkoutData?.job_summary?.remaining_cost,
                                paymenttype: paymentType,
                              },
                            }
                            : {
                              pathname: "/add-new-card",
                              query: {
                                quote_id: checkoutData?.quote_id || "",
                                initialpayment:
                                  checkoutData?.job_summary?.initial_deposit_paid
                                    ?.amount,
                                remaingPayment:
                                  checkoutData?.job_summary?.remaining_cost,
                                paymenttype: paymentType,
                              },
                            }
                        }
                        className="primary-cta"
                      >
                        Pay Now
                      </Link>
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
