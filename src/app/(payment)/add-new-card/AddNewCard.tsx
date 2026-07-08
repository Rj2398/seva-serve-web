"use client";
import { globalServerRequest } from "@/actions/globalApi";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51TpBrKBkqSLQl482FRrfPuOnc3qyndMLw0DCDwOvpl708kbL7NlnZCTttOPAb6nBTYdPf5rfak5IB8Rvf6oWVSXJ00KN2ZUamw";
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface FormErrors {
  holderName?: string;
}

function AddNewCardForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const initialpayment = searchParams.get("initialpayment");
  const remainingPayment = searchParams.get("remaingPayment");
  const paymenttype = searchParams.get("paymenttype");
  const [holderName, setHolderName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Front-end validation for Holder Name
    if (!holderName.trim()) {
      setErrors({ holderName: "Holder name is required" });
      return;
    }
    setErrors({});

    if (!stripe || !elements) {
      toast.error("Stripe SDK has not fully loaded yet. Please try again.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Processing card details...");

    try {
      // Tokenize / Create the Payment Method directly through Stripe Elements securely
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        billing_details: {
          name: holderName,
        },
      });

      if (error) {
        console.error("Stripe Element Error:", error);
        toast.error(error.message || "Invalid card details.", { id: toastId });
        setIsSubmitting(false);
        return;
      }

      console.log("Stripe Token Generated:", paymentMethod.id);

      const response = await globalServerRequest({
        endpoint: "payment/card/add",
        method: "POST",
        payload: {
          payment_method_id: paymentMethod.id,
        },
      });

      if (response.success) {
        console.log("Response from card add:", response);
        toast.success("Card added successfully!", { id: toastId });
        router.push(
          `/payment-method?booking_id=${bookingId || ""}&initialpayment=${
            initialpayment || ""
          }&remaingPayment=${remainingPayment || ""}&paymenttype=${
            paymenttype || ""
          }`
        );
      } else {
        toast.error(response.error || "Failed to add card.", { id: toastId });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("An error occurred during card submission:", error);
      toast.error("Something went wrong. Please try again later.", {
        id: toastId,
      });
      setIsSubmitting(false);
    }
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#363636",
        fontFamily: "Inter, sans-serif",
        "::placeholder": {
          color: "#3636364d",
        },
      },
      invalid: {
        color: "#dc3545",
      },
    },
  };

  return (
    <div className="container home-wraper my-profile">
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="browse-wrp">
                <div className="browse-ctg-head my-con-head">
                  <h2 className="sub-cate-page">
                    <span
                      onClick={() => router.back()}
                      style={{ cursor: "pointer" }}
                    >
                      <img src="images/home/left-arrow.svg" alt="back" />
                    </span>
                    Add New Card
                  </h2>
                </div>

                <div className="card-wrp-surname">
                  <div className="card-wrp form">
                    {/* Visual Card Preview */}
                    <div className="single-card">
                      <img
                        className="card"
                        src="images/inner-page/payment-method-cart.svg"
                        alt=""
                      />
                    </div>

                    <form className="Cardholder" onSubmit={handleSubmit}>
                      <div className="Cardholder-form">
                        {/* Holder Name */}
                        <label>Cardholder’s Name</label>
                        <input
                          type="text"
                          placeholder="Enter Cardholder’s Name"
                          value={holderName}
                          onChange={(e) => setHolderName(e.target.value)}
                          className={errors.holderName ? "error-border" : ""}
                        />
                        {errors.holderName && (
                          <span className="text-danger small">
                            {errors.holderName}
                          </span>
                        )}

                        {/* Card Number (Stripe Elements) */}
                        <label className="mt-3">Card Number</label>
                        <div className="stripe-card-element-container mb-15">
                          <CardNumberElement options={elementOptions} />
                        </div>

                        <div className="multi-row mt-3">
                          {/* CVV (Stripe Elements) */}
                          <div className="cvv-exp">
                            <label>CVV</label>
                            <div className="stripe-card-element-container">
                              <CardCvcElement options={elementOptions} />
                            </div>
                          </div>

                          {/* Expiry (Stripe Elements) */}
                          <div className="cvv-exp">
                            <label>Expiry Date</label>
                            <div className="stripe-card-element-container">
                              <CardExpiryElement options={elementOptions} />
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="primary-cta add-card mt-4"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Processing..." : "Add Card"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Basic Error Styling Inline */}
      <style jsx>{`
        .text-danger {
          color: #dc3545;
          display: block;
          margin-top: 5px;
        }
        .small {
          font-size: 12px;
        }
        .error-border {
          border-color: #dc3545 !important;
        }
        .stripe-card-element-container {
          border: 1px solid #3636364d;
          border-radius: 10px;
          padding: 12px 10px;
          background-color: white;
          width: 100%;
          outline: none;
        }
        .mb-15 {
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
}

export default function AddNewCard() {
  return (
    <Elements stripe={stripePromise}>
      <AddNewCardForm />
    </Elements>
  );
}

//
// "use client";
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React from 'react'

// const AddNewCard = () => {
//   const router =useRouter()

//   return (
//     <div className="container home-wraper my-profile">
//       <section>
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="browse-wrp">
//                 <div className="browse-ctg-head my-con-head">
//                   <h2 className="sub-cate-page"> <Link href="/" onClick={()=>router.back()}><img src="images/home/left-arrow.svg" alt="" /></Link>Add New Card</h2>

//                 </div>
//                 <div className="card-wrp-surname">
//                   <div className="card-wrp form">

//                   <div className="single-card">
//                     <img className="card" src="images/inner-page/payment-method-cart.svg" alt="" />
//                   </div>
//                       <form className="Cardholder">
//                               <div className="Cardholder-form">
//                                   <label>Cardholder’s Name</label>
//                               <input type="text" placeholder="Enter Cardholder’s Name" />

//                               <label>Card Number</label>
//                               <input type="text" placeholder="Enter Card Number" />

//                               <div className="multi-row">
//                                   <div className="cvv-exp">
//                                       <label>CVV</label>
//                                       <input type="text" placeholder="CVV" />
//                                   </div>
//                                   <div className="cvv-exp">
//                                       <label>Expiry Date</label>
//                                       <input type="text" placeholder="MM/YYYY" />
//                                   </div>
//                               </div>

//                               <button className="primary-cta add-card">Add Card</button>
//                               </div>
//                           </form>
//                 </div>

//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//     </div>

//   )
// }

// export default AddNewCard
