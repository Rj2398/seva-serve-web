"use client";
import React, { Suspense, useState, useEffect } from "react";
import { globalServerRequest } from "@/actions/globalApi";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface CheckOutProps {
  bookingData?: any;
}

const CheckOutContent = ({ bookingData }: CheckOutProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingId =
    searchParams.get("booking_id") || searchParams.get("bookingId");
  const paymenttype = searchParams.get("paymenttype") || "initial";

  const [checkoutData, setCheckoutData] = useState<any>();
  console.log(checkoutData, "check out data*******");
  const [paymentMethod, setPaymentMethod] = useState<any>('1');

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
                    <ul>
                      <li>
                        <input
                          type="radio"
                          value="1"
                          name="payment-method"
                          // defaultChecked
                          checked={paymentMethod === "1"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />{" "}
                        PayPal
                      </li>
                      <li>
                        <input type="radio" value="2" name="payment-method" checked={paymentMethod === "2"}
                          onChange={(e) => setPaymentMethod(e.target.value)} />{" "}
                        Zelle
                      </li>
                      {/* <li>
                        <input type="radio" value="3" name="payment-method" checked={paymentMethod === "1"}
                          onChange={(e) => setPaymentMethod(e.target.value)} />{" "}
                        Venmo
                      </li> */}
                    </ul>
                  </div>
                </div>
                <div className="card-help">
                  <Link
                    href={{
                      // pathname: checkoutData?.hasCard
                      //   ? `/payment-method`
                      //   : `/add-new-card`,
                      pathname:
                        paymentMethod === "2"
                          ? `/zelle-payment`
                          : checkoutData?.hasCard
                            ? `/payment-method`
                            : `/add-new-card`,
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
                  >
                    Confirm Payment
                  </Link>
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
