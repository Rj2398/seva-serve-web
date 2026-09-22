"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface PlanProps {
  initialPlanData?: {
    plans: any[];
  };
}

export default function ChoosePlan({ initialPlanData }: PlanProps) {
  const router = useRouter();
  const [myPlans, setmyPlans] = useState<any>(initialPlanData);

  let plansData = myPlans.plans.plans;

  console.log("plansData", myPlans.plans);

  const couponCode = myPlans.plans.coupon;

  const [selectedPlan, setSelectedPlan] = useState<number | string | null>(() => {
    const subscription = myPlans?.plans?.subscription;
    return (subscription?.status === "active") ? subscription.plan_id : null;
  });

  const [copied, setCopied] = useState(false);

  const handleSubscribe = (plan: any) => {
    // URL parameters build karein (Safe navigation ?. ke saath)

    console.log("plan", plan)
    const planId = plan?.id || "";
    const planType = plan?.type || "";
    const planAmount = plan?.price?.amount || "";
    const hasCard = plan?.hasCard;
    const subscription = myPlans?.plans?.subscription;
    const isActivePlan = subscription?.status === "active" && subscription?.plan_id === planId;

    if (isActivePlan) {
      return;
    }

    router.push(
      hasCard
        ? `/payment-method?subscription_plan_id=${planId}&type=${planType}&amount=${planAmount}`
        : `/add-new-card?subscription_plan_id=${planId}&type=${planType}&amount=${planAmount}`
    );
  };

  const isExpired =
    new Date(myPlans?.plans?.subscription?.end_date) < new Date();

  // COPY COUPON
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);

      setCopied(true);

      console.log("Copied:", couponCode);
    } catch (error) {
      console.log("Copy failed");
    }
  };

  return (
    <main>
      <div className="container home-wraper my-profile">
        <section>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="browse-wrp">
                  <div className="browse-ctg-head my-con-head">
                    <h2 className="sub-cate-page">
                      {" "}
                      <Link href="/home">
                        <img src="images/home/left-arrow.svg" alt="" />
                      </Link>
                      Choose Your Plan
                    </h2>
                  </div>

                  <div className="choose-plan-wrp">
                    {plansData?.map((plan: any) => (
                      <div
                        key={plan.id}
                        className={`yearly-cards ${selectedPlan === plan.id ? "active" : ""
                          }`}
                        onClick={() => setSelectedPlan(plan.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {plan?.is_popular && (
                          <span>
                            <img src="images/inner-page/check-papular-icon.svg" />
                            Most Popular
                          </span>
                        )}

                        <h3>{plan.label}</h3>

                        <h4>{plan.price.formatted}</h4>

                        <div className="plan-features">
                          {plan?.features.map((feature: any, index: any) => (
                            <p key={index}>
                              <img
                                src="images/inner-page/red-check.svg"
                                alt=""
                              />

                              {feature}
                            </p>
                          ))}
                        </div>

                        <button
                          className="primary-cta"
                          onClick={(e) => {
                            e.stopPropagation();

                            handleSubscribe(plan);
                          }}
                          disabled={myPlans?.plans?.subscription?.status === "active" && myPlans?.plans?.subscription?.plan_id === plan.id}
                          style={(myPlans?.plans?.subscription?.status === "active" && myPlans?.plans?.subscription?.plan_id === plan.id) ? { opacity: 0.6, cursor: "not-allowed" } : {}}
                        >
                          {
                            myPlans?.plans?.subscription?.plan_id === plan.id
                              ? isExpired
                                ? "Renew Subscription"
                                : "Current Plan"
                              : "Subscribe Now"
                          }
                          <img
                            src="images/inner-page/right-subcription.svg"
                            alt=""
                          />
                        </button>
                      </div>
                    ))}

                  
                  </div>

                  <div className="coupon-unlocked-wrp">
                    <div className="left">
                      <div className="coupon-img">
                        <img src="images/inner-page/cupan-icon.svg" alt="" />
                      </div>
                      <div className="inner-data">
                        <h4>Coupon Unlocked!</h4>
                        <p>
                          Enjoy additional rewards at checkout with your
                          exclusive curator code.
                        </p>
                      </div>
                    </div>

                    <div className="right">
                      <p className={copied ? "copy" : ""}>{couponCode}</p>
                      <button className="copy-text-size" onClick={handleCopy}>
                        <img
                          src={
                            copied
                              ? "images/inner-page/success-icon.svg"
                              : "images/inner-page/copy-icon-inner.svg"
                          }
                          alt=""
                        />
                      </button>
                    </div>

                    {/* <div className="right">
                      <p className="copy">SEVA200FF</p>
                      <button className="copy-text-size">
                        <img src="images/inner-page/success-icon.svg" alt="" />
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}















// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { globalServerRequest } from "@/actions/globalApi";
// // @ts-ignore
// import * as braintree from "braintree-web";

// interface PlanProps {
//   initialPlanData?: {
//     plans: any[];
//   };
// }

// export default function ChoosePlan({ initialPlanData }: PlanProps) {
//   const router = useRouter();
//   const [myPlans, setmyPlans] = useState<any>(initialPlanData);

//   let plansData = myPlans.plans.plans;

//   console.log("plansData", myPlans.plans);

//   const couponCode = myPlans.plans.coupon;

//   const [selectedPlan, setSelectedPlan] = useState<number | string | null>(() => {
//     const subscription = myPlans?.plans?.subscription;
//     return (subscription?.status === "active") ? subscription.plan_id : null;
//   });

//   const [copied, setCopied] = useState(false);


//   const [paypalInstance, setPaypalInstance] = useState<any>(null);
//   const [paypalLoading, setPaypalLoading] = useState(true);
//   const [isTokenizing, setIsTokenizing] = useState(false);
//   const braintreeTokenizationKey = "sandbox_bkv6vn9s_8gjjrj3w6gpngkmr";

//   const initializeBraintree = async () => {
//     try {
//       setPaypalLoading(true);
//       const clientInstance = await braintree.client.create({
//         authorization: braintreeTokenizationKey,
//       });

//       const instance = await braintree.paypal.create({
//         client: clientInstance,
//       });

//       setPaypalInstance(instance);
//     } catch (error) {
//       console.error("Braintree initialization error:", error);
//     } finally {
//       setPaypalLoading(false);
//     }
//   };

//   useEffect(() => {
//     initializeBraintree();
//   }, []);

//   const handleSubscription = async (plan: any, nonce: string) => {
//     const formData = new FormData();
//     formData.append("subscription_plan_id", plan?.id || "");
//     formData.append("nonce", nonce);
//     formData.append("type", plan?.type || "");
//     formData.append("amount", "1"); // As requested, payment amount is $1

//     try {
//       const response = await globalServerRequest({
//         endpoint: "payment/card/subscription-pay-now",
//         method: "POST",
//         payload: formData,
//         isFormData: true,
//       });

//       if (response?.success) {
//         toast.success(response?.data?.message || "Subscription payment successful");
//         router.push("/");
//       } else {
//         toast.error(response?.data?.message || response?.error || "Failed to process payment");
//       }
//     } catch (error) {
//       console.error("Subscription payment failed:", error);
//       toast.error("Subscription payment failed");
//     }
//   };

//   const handleSubscribe = async (plan: any) => {
//     console.log("plan", plan);
//     const planId = plan?.id || "";
//     const planType = plan?.type || "";
//     const planAmount = plan?.price?.amount || "";
//     const hasCard = plan?.hasCard;
//     const subscription = myPlans?.plans?.subscription;
//     const isActivePlan = subscription?.status === "active" && subscription?.plan_id === planId;

//     if (isActivePlan) {
//       return;
//     }

//     if (isTokenizing) return;
//     if (!paypalInstance) {
//       toast.error("PayPal is still loading... Please wait.");
//       return;
//     }

//     try {
//       setIsTokenizing(true);
//       const payload = await paypalInstance.tokenize({
//         flow: 'checkout',
//         amount: "1.00",
//         currency: 'USD'
//       });

//       console.log("Braintree nonce:", payload.nonce);
//       await handleSubscription(plan, payload.nonce);
//     } catch (error: any) {
//       if (error.code === 'PAYPAL_POPUP_CLOSED') {
//         toast.error("PayPal popup was closed.");
//       } else if (error.code === 'PAYPAL_TOKENIZATION_REQUEST_ACTIVE') {
//         toast.error("Another PayPal request is already active.");
//       } else {
//         console.error("PayPal start error:", error);
//         toast.error("Unable to open PayPal.");
//       }
//     } finally {
//       setIsTokenizing(false);
//     }
//   };

//   const isExpired =
//     new Date(myPlans?.plans?.subscription?.end_date) < new Date();

//   // COPY COUPON
//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(couponCode);

//       setCopied(true);

//       console.log("Copied:", couponCode);
//     } catch (error) {
//       console.log("Copy failed");
//     }
//   };

//   return (
//     <main>
//       <div className="container home-wraper my-profile">
//         <section>
//           <div className="container">
//             <div className="row">
//               <div className="col-lg-12">
//                 <div className="browse-wrp">
//                   <div className="browse-ctg-head my-con-head">
//                     <h2 className="sub-cate-page">
//                       {" "}
//                       <Link href="/home">
//                         <img src="images/home/left-arrow.svg" alt="" />
//                       </Link>
//                       Choose Your Plan
//                     </h2>
//                   </div>

//                   <div className="choose-plan-wrp">
//                     {plansData?.map((plan: any) => (
//                       <div
//                         key={plan.id}
//                         className={`yearly-cards ${selectedPlan === plan.id ? "active" : ""
//                           }`}
//                         onClick={() => setSelectedPlan(plan.id)}
//                         style={{ cursor: "pointer" }}
//                       >
//                         {plan?.is_popular && (
//                           <span>
//                             <img src="images/inner-page/check-papular-icon.svg" />
//                             Most Popular
//                           </span>
//                         )}

//                         <h3>{plan.label}</h3>

//                         <h4>{plan.price.formatted}</h4>

//                         <div className="plan-features">
//                           {plan?.features.map((feature: any, index: any) => (
//                             <p key={index}>
//                               <img
//                                 src="images/inner-page/red-check.svg"
//                                 alt=""
//                               />

//                               {feature}
//                             </p>
//                           ))}
//                         </div>

//                         <button
//                           className="primary-cta"
//                           onClick={(e) => {
//                             e.stopPropagation();

//                             handleSubscribe(plan);
//                           }}
//                           disabled={myPlans?.plans?.subscription?.status === "active" && myPlans?.plans?.subscription?.plan_id === plan.id}
//                           style={(myPlans?.plans?.subscription?.status === "active" && myPlans?.plans?.subscription?.plan_id === plan.id) ? { opacity: 0.6, cursor: "not-allowed" } : {}}
//                         >
//                           {
//                             myPlans?.plans?.subscription?.plan_id === plan.id
//                               ? isExpired
//                                 ? "Renew Subscription"
//                                 : "Current Plan"
//                               : "Subscribe Now" 
//                           }
//                           <img
//                             src="images/inner-page/right-subcription.svg"
//                             alt=""
//                           />
//                         </button>
//                       </div>
//                     ))}

                  
//                   </div>

//                   <div className="coupon-unlocked-wrp">
//                     <div className="left">
//                       <div className="coupon-img">
//                         <img src="images/inner-page/cupan-icon.svg" alt="" />
//                       </div>
//                       <div className="inner-data">
//                         <h4>Coupon Unlocked!</h4>
//                         <p>
//                           Enjoy additional rewards at checkout with your
//                           exclusive curator code.
//                         </p>
//                       </div>
//                     </div>

//                     <div className="right">
//                       <p className={copied ? "copy" : ""}>{couponCode}</p>
//                       <button className="copy-text-size" onClick={handleCopy}>
//                         <img
//                           src={
//                             copied
//                               ? "images/inner-page/success-icon.svg"
//                               : "images/inner-page/copy-icon-inner.svg"
//                           }
//                           alt=""
//                         />
//                       </button>
//                     </div>

//                     {/* <div className="right">
//                       <p className="copy">SEVA200FF</p>
//                       <button className="copy-text-size">
//                         <img src="images/inner-page/success-icon.svg" alt="" />
//                       </button>
//                     </div> */}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

