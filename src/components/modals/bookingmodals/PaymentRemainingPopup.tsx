import { globalServerRequest } from "@/actions/globalApi";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface PaymentRemainingPopupProps {
  bookingPaymentInfo: any;
  bookingId: string;
  quote_id: any;
}

const PaymentRemainingPopup = ({
  bookingPaymentInfo,
  bookingId,
  quote_id,
}: PaymentRemainingPopupProps) => {
  const [checkoutData, setCheckoutData] = useState<any>();
  console.log(checkoutData, "checkout data***");

  useEffect(() => {
    if (!quote_id) return;

    const fetchCheckoutDetails = async () => {
      try {
        // 1. Change 'body' to 'data' (the standard key for Axios/Fetch wrappers)
        const response = await globalServerRequest({
          endpoint: "quotes/checkout",
          method: "POST",
          payload: {
            quote_id: Number(quote_id),
          },
        } as any); // Keeping 'as any' temporarily until we match the correct key name

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

    fetchCheckoutDetails();
  }, [quote_id]);

  return (
    <>
      <div
        className="modal fade"
        id="pay-remaining-popup"
        data-bs-backdrop="static"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <div className="modal-body p-0">
              <div className="rate-contractor-wrp">
                <h1>Confirm & Pay Remaining</h1>
                <div className="pay-remaining-wrp">
                  <div className="pay-remaining-top">
                    <div className="pay-remaining-data">
                      <p>
                        <b>Remaining Amount to Pay</b>
                      </p>
                      <h3>${bookingPaymentInfo?.originalAmount}</h3>
                    </div>
                    <ul>
                      <li>
                        Service Total{" "}
                        <span>${bookingPaymentInfo?.originalAmount}</span>
                      </li>
                      <li>
                        Advance Paid{" "}
                        <span>-${bookingPaymentInfo?.discountAmount}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pay-remaining-top border-0">
                    <ul>
                      <li>
                        Total Due{" "}
                        <span>${bookingPaymentInfo?.totalAmount}</span>
                      </li>
                    </ul>
                    <div className="home-quotes-cta">
                      <button
                        type="button"
                        data-bs-dismiss="modal"
                        className="reject-btn"
                      >
                        Cancel
                      </button>
                      <Link
                        href={{
                          pathname: "/checkout",
                          query: {
                            booking_id: quote_id,
                            initialpayment:
                              checkoutData?.job_summary?.initial_deposit
                                ?.amount,
                            remaingPayment:
                              checkoutData?.job_summary?.remaining_amount,

                            paymenttype: "full",
                          },
                        }}
                        className="primary-cta rgt"
                      >
                        {" "}
                        Confirm & Pay{" "}
                        <img src="images/home/right-img.svg" alt="" />{" "}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentRemainingPopup;
