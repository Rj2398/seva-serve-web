"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { globalServerRequest } from "@/actions/globalApi";
import toast from "react-hot-toast";

interface Card {
  id: string | number;
  card_id?: string | number;
  payment_method_id?: string;
  bankName?: string;
  card_last_four_digit?: string | number;
  card_holder_name?: string;
  expiry_month?: string | number;
  expiry_year?: string | number;
  brand?: string;
  last4?: string;
  exp_month?: number;
  exp_year?: number;
  billing_details?: {
    name?: string;
  };
  card?: {
    brand?: string;
    last4?: string;
    exp_month?: number;
    exp_year?: number;
  };
}

interface CardProps {
  initialCardsData: {
    cards: Card[];
  };
}

function PaymentMethodContent({ initialCardsData }: CardProps) {
  console.log(initialCardsData, "initialCardsData")
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const initialpayment = searchParams.get("initialpayment");
  const remainingPayment = searchParams.get("remaingPayment");
  const paymenttype = searchParams.get("paymenttype");

  // Safe numeric fallbacks for UI rendering (.toFixed)
  const initialPaymentNum = parseFloat(initialpayment || "0");
  const remainingPaymentNum = parseFloat(remainingPayment || "0");

  console.log(remainingPayment, "remaining payment **");

  //for subscription
  const planId: any = searchParams.get("subscription_plan_id");
  const planType: any = searchParams.get("type");
  const planAmount: any = searchParams.get("amount");
  const quoteId: any = searchParams.get("quoteId");

  console.log("quoteId", quoteId)

  const router = useRouter();
  const [cards, setCards] = useState<Card[]>(initialCardsData?.cards || []);

  const [selectedCard, setSelectedCard] = useState<any | number | null>(
    initialCardsData?.cards && initialCardsData.cards.length > 0
      ? initialCardsData.cards[0].card_id || initialCardsData.cards[0].id
      : null
  );

  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = async () => {
    if (!selectedCard) {
      toast.error("Please select a card to pay.");
      return;
    }

    const selectedCardObj = cards.find(
      (c) => (c.card_id || c.id) === selectedCard
    );
    const paymentMethodId = selectedCardObj?.payment_method_id || selectedCard;

    setIsPaying(true);
    const toastId = toast.loading("Processing payment...");

    try {
      const response = await globalServerRequest({
        endpoint: "payment/card/customer-pay-now",
        method: "POST",
        payload: {
          card_id: selectedCard,
          quote_id: quoteId || bookingId,
          payment_method_id: paymentMethodId,
          amount: paymenttype === "full" ? remainingPayment : initialpayment,
          type: paymenttype === "full" ? "full" : "initial",
        },
      });

      if (response.success) {
        toast.success("Payment completed successfully!", { id: toastId });
        router.push("/booking");
      } else {
        toast.error(response.error || "Failed to process payment.", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Payment API Error:", error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      setIsPaying(false);
    }
  };

  const handleSubscription = async () => {
    // 1. Payment type ke basis par dynamically amount calculate karein

    if (!selectedCard) {
      toast.error("Please select a card to pay.");
      return;
    }
    const formData = new FormData();
    formData.append("subscription_plan_id", planId);
    formData.append("card_id", selectedCard);
    formData.append("type", planType);
    formData.append("amount", planAmount); // Sahi calculated amount append karein

    try {
      const response = await globalServerRequest({
        endpoint: "payment/card/subscription-pay-now",
        method: "POST",
        payload: formData,
        isFormData: true,
      });

      // Response handle karein (Success/Error handling)
      if (response?.success) {
        toast.success(response?.data.message);
        router.push("/");
      }
    } catch (error) {
      console.error("Subscription payment failed:", error);
    }
  };
  const fetchCards = async () => {
    try {
      const response = await globalServerRequest({
        endpoint: "payment/card/fetch-cards",
        method: "GET",
      });
      if (response.success) {
        const fetchedCards: Card[] = response.data?.data || response.data || [];
        setCards(fetchedCards);
        if (fetchedCards.length > 0) {
          setSelectedCard((prev) => {
            const exists = fetchedCards.some(
              (c: Card) => (c.card_id || c.id) === prev
            );
            return exists
              ? prev
              : fetchedCards[0].card_id || fetchedCards[0].id;
          });
        } else {
          setSelectedCard(null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch cards on mount:", error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleDeleteCard = async (id: string | number) => {
    // 1. Update local list instantly
    const updatedCards = cards.filter(
      (card) => (card.card_id || card.id) !== id
    );
    setCards(updatedCards);
    if (selectedCard === id) {
      if (updatedCards.length > 0) {
        setSelectedCard(updatedCards[0].card_id || updatedCards[0].id);
      } else {
        setSelectedCard(null);
      }
    }

    const toastId = toast.loading("Deleting card...");
    try {
      // 2. Call backend delete-card POST endpoint
      const response = await globalServerRequest({
        endpoint: "payment/card/delete-card",
        method: "POST",
        payload: {
          card_id: id,
        },
      });

      if (response.success) {
        toast.success("Card deleted successfully!", { id: toastId });
      } else {
        toast.error(response.error || "Failed to delete card.", {
          id: toastId,
        });
        // Revert local state on failure
        fetchCards();
      }
    } catch (error) {
      console.error("Failed to delete card on server:", error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
      // Revert local state on failure
      fetchCards();
    }
  };

  // Helper to safely format Expiry Date
  const formatExpiry = (card: Card) => {
    const month =
      card?.expiry_month || card?.card?.exp_month || card?.exp_month;
    const year = card?.expiry_year || card?.card?.exp_year || card?.exp_year;
    if (!month || !year) return "MM/YY";
    const paddedMonth = String(month).padStart(2, "0");
    const shortYear = String(year).slice(-2);
    return `${paddedMonth}/${shortYear}`;
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
                    <button
                      onClick={() => router.back()}
                      className="btn p-0 m-0"
                      style={{ border: "none", background: "none" }}
                    >
                      <img src="images/home/left-arrow.svg" alt="" />
                    </button>
                    Payment Method
                  </h2>
                  <div className="add-card">
                    <Link
                      href={
                        !bookingId
                          ? `/add-new-card?subscription_plan_id=${planId}&type=${planType}&amount=${planAmount}`
                          : `/add-new-card?booking_id=${bookingId}&initialpayment=${initialpayment}&remaingPayment=${remainingPayment}&paymenttype=${paymenttype}`
                      }
                      className="primary-cta"
                    >
                      <img src="images/inner-page/add-rounded.svg" alt="" />
                      Add New Card
                    </Link>
                  </div>
                </div>
                <div className="card-wrp-surname">
                  <div className="card-wrp">
                    {cards?.length > 0 ? (
                      cards?.map((card, index) => {
                        const cardId = card?.card_id || card?.id || index;
                        const isSelected = selectedCard === cardId;
                        const lastFour =
                          card?.card_last_four_digit ||
                          card?.card?.last4 ||
                          card?.last4 ||
                          "****";
                        const holderName =
                          card?.card_holder_name ||
                          card?.billing_details?.name ||
                          card?.bankName ||
                          "Card Holder";
                        const cardBrand =
                          card?.brand || card?.card?.brand || "Credit Card";

                        return (
                          <div
                            className={`single-card ${isSelected ? "active-card" : ""
                              }`}
                            key={cardId}
                            onClick={() => setSelectedCard(cardId)}
                            style={{ cursor: "pointer" }}
                          >
                            {/* Checkbox selector */}
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                checked={isSelected}
                                onChange={() => setSelectedCard(cardId)}
                                style={{ cursor: "pointer" }}
                              />
                            </div>

                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCard(cardId);
                              }}
                              style={{ zIndex: 10 }}
                            >
                              <img
                                className="cross-card"
                                src="images/inner-page/card-cross.svg"
                                alt="Remove"
                              />
                            </button>

                            {/* Custom CSS Blank Card Background */}
                            <div className="custom-blank-card">
                              {/* Details Overlay */}
                              <div className="card-details-overlay">
                                <div className="card-brand-label">
                                  {cardBrand}
                                </div>
                                <div className="card-chip-img">
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/512/6404/6404078.png"
                                    alt="chip"
                                  />
                                </div>
                                <div className="card-number-label">
                                  **** **** **** {lastFour}
                                </div>
                                <div className="card-footer-row">
                                  <div className="card-holder-label">
                                    {holderName}
                                  </div>
                                  <div className="card-expiry-label">
                                    <span className="valid-thru-text">
                                      VALID THRU
                                    </span>
                                    <span className="expiry-val">
                                      {formatExpiry(card)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center w-100 p-5">
                        <p>No cards saved. Please add a new card.</p>
                      </div>
                    )}
                  </div>

                  <div className="card-help">
                    <button
                      type="button"
                      className="secondary-cta"
                      onClick={() => router.push("/help-support")}
                    >
                      Help & Support
                    </button>
                    <button
                      type="button"
                      className="primary-cta"
                      disabled={cards.length === 0 || isPaying}
                      onClick={() =>
                        bookingId ? handlePayment() : handleSubscription()
                      }
                    >
                      {isPaying ? (
                        "Processing..."
                      ) : (
                        <span style={{ fontWeight: 500 }}>
                          Pay Now $
                          {paymenttype === "full"
                            ? remainingPaymentNum.toFixed(2)
                            : paymenttype === "initial"
                              ? initialPaymentNum.toFixed(2)
                              : planAmount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .single-card {
          position: relative;
          transition: transform 0.2s ease;
        }
        .single-card:hover {
          transform: translateY(-2px);
        }
        .single-card.active-card .custom-blank-card {
          box-shadow: 0 0 0 3px #991318, 0 10px 25px rgba(0, 0, 0, 0.5);
        }
        .custom-blank-card {
          width: 304px;
          height: 192px;
          border-radius: 20px;
          background: linear-gradient(135deg, #2b2b2b 0%, #111111 100%);
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        .custom-blank-card::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -20%;
          width: 100%;
          height: 200%;
          background: rgba(255, 255, 255, 0.04);
          transform: rotate(25deg);
          pointer-events: none;
        }
        .card-details-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 304px;
          height: 192px;
          padding: 22px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #ffffff;
          font-family: "Inter", sans-serif;
          box-sizing: border-box;
          pointer-events: none;
        }
        .card-brand-label {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          align-self: flex-end;
          margin-right: 10px;
          margin-top: -2px;
          opacity: 0.9;
          letter-spacing: 1px;
        }
        .card-chip-img {
          margin-top: -5px;
          margin-left: 10px;
          align-self: flex-start;
        }
        .card-chip-img img {
          width: 32px;
          height: auto;
          filter: brightness(1.2);
        }
        .card-number-label {
          font-size: 17px;
          letter-spacing: 2px;
          font-family: monospace;
          margin-left: 10px;
          margin-top: 10px;
          font-weight: 500;
        }
        .card-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-left: 10px;
          padding-bottom: 2px;
        }
        .card-holder-label {
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 500;
          letter-spacing: 1px;
          max-width: 170px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .card-expiry-label {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .valid-thru-text {
          font-size: 6px;
          line-height: 1;
          text-align: right;
          opacity: 0.8;
          line-height: 1.1;
        }
        .expiry-val {
          font-size: 13px;
          font-weight: 500;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}

// Default export wrapping Content with a Suspense boundary to prevent Next.js build bail-outs
export default function PaymentMethod(props: CardProps) {
  return (
    <Suspense
      fallback={
        <div className="text-center p-5">Loading payment system...</div>
      }
    >
      <PaymentMethodContent {...props} />
    </Suspense>
  );
}

// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { globalServerRequest } from "@/actions/globalApi";
// import toast from "react-hot-toast";

// interface Card {
//   id: string | number;
//   card_id?: string | number;
//   payment_method_id?: string;
//   bankName?: string;
//   card_last_four_digit?: string | number;
//   card_holder_name?: string;
//   expiry_month?: string | number;
//   expiry_year?: string | number;
//   brand?: string;
//   last4?: string;
//   exp_month?: number;
//   exp_year?: number;
//   billing_details?: {
//     name?: string;
//   };
//   card?: {
//     brand?: string;
//     last4?: string;
//     exp_month?: number;
//     exp_year?: number;
//   };
// }

// interface CardProps {
//   initialCardsData: {
//     cards: Card[];
//   };
// }

// export default function PaymentMethod({ initialCardsData }: CardProps) {
//   const searchParams = useSearchParams();
//   const bookingId = searchParams.get("booking_id");
//   const initialpayment = searchParams.get("initialpayment");
//   const remainingPayment = searchParams.get("remaingPayment");
//   console.log(remainingPayment, "remaining payment **");

//   const paymenttype = searchParams.get("paymenttype");
//   const router = useRouter();
//   const [cards, setCards] = useState<Card[]>(initialCardsData.cards);

//   const [selectedCard, setSelectedCard] = useState<string | number | null>(
//     initialCardsData.cards && initialCardsData.cards.length > 0
//       ? initialCardsData.cards[0].card_id || initialCardsData.cards[0].id
//       : null
//   );

//   const [isPaying, setIsPaying] = useState(false);

//   const handlePayment = async () => {
//     if (!selectedCard) {
//       toast.error("Please select a card to pay.");
//       return;
//     }

//     const selectedCardObj = cards.find(
//       (c) => (c.card_id || c.id) === selectedCard
//     );
//     const paymentMethodId = selectedCardObj?.payment_method_id || selectedCard;

//     setIsPaying(true);
//     const toastId = toast.loading("Processing payment...");

//     try {
//       const response = await globalServerRequest({
//         endpoint: "payment/card/customer-pay-now",
//         method: "POST",
//         payload: {
//           card_id: selectedCard,
//           quote_id: bookingId,
//           payment_method_id: paymentMethodId,
//           amount: paymenttype === "full" ? remainingPayment : initialpayment,
//           type: paymenttype === "full" ? "full" : "initial",
//         },
//       });

//       if (response.success) {
//         toast.success("Payment completed successfully!", { id: toastId });
//         router.push("/booking");
//       } else {
//         toast.error(response.error || "Failed to process payment.", {
//           id: toastId,
//         });
//       }
//     } catch (error) {
//       console.error("Payment API Error:", error);
//       toast.error("Something went wrong. Please try again.", { id: toastId });
//     } finally {
//       setIsPaying(false);
//     }
//   };

//   console.log("cards list:", cards);

//   const fetchCards = async () => {
//     try {
//       const response = await globalServerRequest({
//         endpoint: "payment/card/fetch-cards",
//         method: "GET",
//       });
//       if (response.success) {
//         const fetchedCards = response.data?.data || response.data || [];
//         setCards(fetchedCards);
//         if (fetchedCards.length > 0) {
//           setSelectedCard((prev) => {
//             const exists = fetchedCards.some(
//               (c: any) => (c.card_id || c.id) === prev
//             );
//             return exists
//               ? prev
//               : fetchedCards[0].card_id || fetchedCards[0].id;
//           });
//         } else {
//           setSelectedCard(null);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch cards on mount:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCards();
//   }, []);

//   const handleDeleteCard = async (id: any) => {
//     // 1. Update local list instantly
//     const updatedCards = cards.filter(
//       (card) => (card.card_id || card.id) !== id
//     );
//     setCards(updatedCards);
//     if (selectedCard === id) {
//       if (updatedCards.length > 0) {
//         setSelectedCard(updatedCards[0].card_id || updatedCards[0].id);
//       } else {
//         setSelectedCard(null);
//       }
//     }

//     const toastId = toast.loading("Deleting card...");
//     try {
//       // 2. Call backend delete-card POST endpoint
//       const response = await globalServerRequest({
//         endpoint: "payment/card/delete-card",
//         method: "POST",
//         payload: {
//           card_id: id,
//         },
//       });

//       if (response.success) {
//         toast.success("Card deleted successfully!", { id: toastId });
//       } else {
//         toast.error(response.error || "Failed to delete card.", {
//           id: toastId,
//         });
//         // Revert local state on failure
//         fetchCards();
//       }
//     } catch (error) {
//       console.error("Failed to delete card on server:", error);
//       toast.error("Something went wrong. Please try again.", { id: toastId });
//       // Revert local state on failure
//       fetchCards();
//     }
//   };

//   // Helper to safely format Expiry Date
//   const formatExpiry = (card: Card) => {
//     const month =
//       card?.expiry_month || card?.card?.exp_month || card?.exp_month;
//     const year = card?.expiry_year || card?.card?.exp_year || card?.exp_year;
//     if (!month || !year) return "MM/YY";
//     const paddedMonth = String(month).padStart(2, "0");
//     const shortYear = String(year).slice(-2);
//     return `${paddedMonth}/${shortYear}`;
//   };

//   return (
//     <div className="container home-wraper my-profile">
//       <section>
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="browse-wrp">
//                 <div className="browse-ctg-head my-con-head">
//                   <h2 className="sub-cate-page">
//                     <button
//                       onClick={() => router.back()}
//                       className="btn p-0 m-0"
//                       style={{ border: "none", background: "none" }}
//                     >
//                       <img src="images/home/left-arrow.svg" alt="" />
//                     </button>
//                     Payment Method
//                   </h2>
//                   <div className="add-card">
//                     <Link href="/add-new-card" className="primary-cta">
//                       <img src="images/inner-page/add-rounded.svg" alt="" />
//                       Add New Card
//                     </Link>
//                   </div>
//                 </div>
//                 <div className="card-wrp-surname">
//                   <div className="card-wrp">
//                     {cards?.length > 0 ? (
//                       cards?.map((card, index) => {
//                         const cardId = card?.card_id || card?.id || index;
//                         const isSelected = selectedCard === cardId;
//                         const lastFour =
//                           card?.card_last_four_digit ||
//                           card?.card?.last4 ||
//                           card?.last4 ||
//                           "****";
//                         const holderName =
//                           card?.card_holder_name ||
//                           card?.billing_details?.name ||
//                           card?.bankName ||
//                           "Card Holder";
//                         const cardBrand =
//                           card?.brand || card?.card?.brand || "Credit Card";

//                         return (
//                           <div
//                             className={`single-card ${
//                               isSelected ? "active-card" : ""
//                             }`}
//                             key={cardId}
//                             onClick={() => setSelectedCard(cardId)}
//                             style={{ cursor: "pointer" }}
//                           >
//                             {/* Checkbox selector */}
//                             <div className="form-check">
//                               <input
//                                 className="form-check-input"
//                                 type="radio"
//                                 name="flexRadioDefault"
//                                 checked={isSelected}
//                                 onChange={() => setSelectedCard(cardId)}
//                                 style={{ cursor: "pointer" }}
//                               />
//                             </div>

//                             {/* Delete button */}
//                             <button
//                               type="button"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDeleteCard(cardId);
//                               }}
//                               style={{ zIndex: 10 }}
//                             >
//                               <img
//                                 className="cross-card"
//                                 src="images/inner-page/card-cross.svg"
//                                 alt="Remove"
//                               />
//                             </button>

//                             {/* Custom CSS Blank Card Background (No pre-rendered clashing text) */}
//                             <div className="custom-blank-card">
//                               {/* Details Overlay */}
//                               <div className="card-details-overlay">
//                                 <div className="card-brand-label">
//                                   {cardBrand}
//                                 </div>
//                                 <div className="card-chip-img">
//                                   <img
//                                     src="https://cdn-icons-png.flaticon.com/512/6404/6404078.png"
//                                     alt="chip"
//                                   />
//                                 </div>
//                                 <div className="card-number-label">
//                                   **** **** **** {lastFour}
//                                 </div>
//                                 <div className="card-footer-row">
//                                   <div className="card-holder-label">
//                                     {holderName}
//                                   </div>
//                                   <div className="card-expiry-label">
//                                     <span className="valid-thru-text">
//                                       VALID THRU
//                                     </span>
//                                     <span className="expiry-val">
//                                       {formatExpiry(card)}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })
//                     ) : (
//                       <div className="text-center w-100 p-5">
//                         <p>No cards saved. Please add a new card.</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="card-help">
//                     <button
//                       type="button"
//                       className="secondary-cta"
//                       onClick={() => router.push("/help-support")}
//                     >
//                       Help & Support
//                     </button>
//                     <button
//                       type="button"
//                       className="primary-cta"
//                       disabled={cards.length === 0 || isPaying}
//                       onClick={handlePayment}
//                     >
//                       {isPaying ? (
//                         "Processing..."
//                       ) : (
//                         <>
//                           <span>
//                             $
//                             {paymenttype === "full"
//                               ? remainingPayment.toFixed(2)
//                               : initialpayment.toFixed(2)}
//                           </span>
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <style jsx>{`
//         .single-card {
//           position: relative;
//           transition: transform 0.2s ease;
//         }
//         .single-card:hover {
//           transform: translateY(-2px);
//         }
//         .single-card.active-card .custom-blank-card {
//           box-shadow: 0 0 0 3px #991318, 0 10px 25px rgba(0, 0, 0, 0.5);
//         }
//         .custom-blank-card {
//           width: 304px;
//           height: 192px;
//           border-radius: 20px;
//           background: linear-gradient(135deg, #2b2b2b 0%, #111111 100%);
//           position: relative;
//           overflow: hidden;
//           box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
//           transition: all 0.3s ease;
//         }
//         .custom-blank-card::before {
//           content: "";
//           position: absolute;
//           top: -50%;
//           left: -20%;
//           width: 100%;
//           height: 200%;
//           background: rgba(255, 255, 255, 0.04);
//           transform: rotate(25deg);
//           pointer-events: none;
//         }
//         .card-details-overlay {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 304px;
//           height: 192px;
//           padding: 22px 20px;
//           display: flex;
//           flex-direction: column;
//           justify-content: space-between;
//           color: #ffffff;
//           font-family: "Inter", sans-serif;
//           box-sizing: border-box;
//           pointer-events: none;
//         }
//         .card-brand-label {
//           font-size: 13px;
//           font-weight: 600;
//           text-transform: uppercase;
//           align-self: flex-end;
//           margin-right: 10px;
//           margin-top: -2px;
//           opacity: 0.9;
//           letter-spacing: 1px;
//         }
//         .card-chip-img {
//           margin-top: -5px;
//           margin-left: 10px;
//           align-self: flex-start;
//         }
//         .card-chip-img img {
//           width: 32px;
//           height: auto;
//           filter: brightness(1.2);
//         }
//         .card-number-label {
//           font-size: 17px;
//           letter-spacing: 2px;
//           font-family: monospace;
//           margin-left: 10px;
//           margin-top: 10px;
//           font-weight: 500;
//         }
//         .card-footer-row {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-end;
//           padding-left: 10px;
//           padding-bottom: 2px;
//         }
//         .card-holder-label {
//           font-size: 12px;
//           text-transform: uppercase;
//           font-weight: 500;
//           letter-spacing: 1px;
//           max-width: 170px;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//         }
//         .card-expiry-label {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .valid-thru-text {
//           font-size: 6px;
//           line-height: 1;
//           text-align: right;
//           opacity: 0.8;
//           line-height: 1.1;
//         }
//         .expiry-val {
//           font-size: 13px;
//           font-weight: 500;
//           font-family: monospace;
//         }
//       `}</style>
//     </div>
//   );
// }
