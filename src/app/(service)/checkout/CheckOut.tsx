"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const CheckOut = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract values from the query parameters
  const bookingId = searchParams.get("booking_id");
  const initialPayment = parseFloat(searchParams.get("initialpayment") || "0");
  const remainingPayment = parseFloat(
    searchParams.get("remaingPayment") || "0"
  );
  const paymenttype = searchParams.get("paymenttype");
  // Dynamically calculate total cost
  const totalCost = initialPayment + remainingPayment;

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
                      Payment
                    </h2>
                  </div>
                </div>
                <div className="checkout-wrp">
                  {/* Steps tracker removed from here */}

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
                  </div>
                </div>
                <div className="card-help">
                  <Link
                    href={{
                      pathname: "/payment-method",
                      query: {
                        booking_id: bookingId,
                        remaingPayment: remainingPayment, // Passing the remaining amount
                        paymenttype: paymenttype, // Passing the payment type ("full" or "initial")
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

export default CheckOut;
