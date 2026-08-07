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

                    {/* <div className="yearly-cards">
                      <h3>Monthly</h3>
                      <h4>$9.99</h4>
                      <div>
                        <p><img src="images/inner-page/red-check.svg" alt="" />Priority Customer Service Access</p>
                        <p><img src="images/inner-page/red-check.svg" alt="" />20% OFF Discount Offers</p>
                      </div>
                      <button className="primary-cta">Subscribe Now <img src="images/inner-page/right-subcription.svg" alt="" /></button>
                    </div>

                    <div className="yearly-cards active">
                      <span><img src="images/inner-page/check-papular-icon.svg" alt="" />Most Popular</span>
                      <h3>Quarterly</h3>
                      <h4>$7.99</h4>
                      <div>
                        <p><img src="images/inner-page/red-check.svg" alt="" />Priority Customer Service Access</p>
                        <p><img src="images/inner-page/red-check.svg" alt="" />20% OFF Discount Offers</p>
                      </div>
                      <button className="primary-cta">Subscribe Now <img src="images/inner-page/right-subcription.svg" alt="" /></button>
                    </div>

                    <div className="yearly-cards">
                      <h3>Yearly</h3>
                      <h4>$5.99</h4>
                      <div>
                        <p><img src="images/inner-page/red-check.svg" alt="" />Priority Customer Service Access</p>
                        <p><img src="images/inner-page/red-check.svg" alt="" />20% OFF Discount Offers</p>
                      </div>
                      <button className="primary-cta">Subscribe Now <img src="images/inner-page/right-subcription.svg" alt="" /></button>
                    </div> */}
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

// const ChoosePlan = () => {
//   // JSON DATA
//   const plans = [
//     {
//       id: 1,
//       title: "Monthly",
//       price: "$9.99",
//       features: [
//         "Priority Customer Service Access",
//         "20% OFF Discount Offers",
//       ],
//     },
//     {
//       id: 2,
//       title: "Quarterly",
//       price: "$7.99",
//       popular: true,
//       features: [
//         "Priority Customer Service Access",
//         "20% OFF Discount Offers",
//       ],
//     },
//     {
//       id: 3,
//       title: "Yearly",
//       price: "$5.99",
//       features: [
//         "Priority Customer Service Access",
//         "20% OFF Discount Offers",
//       ],
//     },
//   ];

//   const couponCode = "SEVA200FF";

//   const [selectedPlan, setSelectedPlan] = useState<number | null>(2);

//   const [copied, setCopied] = useState(false);

//   const handleSubscribe = (price: string) => {
//     console.log("Selected Price:", price);
//   }

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
//                     <h2 className="sub-cate-page"> <Link href="/home"><img src="images/home/left-arrow.svg" alt="" /></Link>Choose Your Plan</h2>

//                   </div>

//                   <div className="choose-plan-wrp">

//                     {
//                       plans.map((plan) => (
//                         <div
//                           key={plan.id}
//                           className={`yearly-cards ${selectedPlan === plan.id ? "active" : ""}`}
//                           onClick={() => setSelectedPlan(plan.id)}
//                           style={{ cursor: "pointer" }}
//                         >
//                           {
//                             plan?.popular && (
//                               <span>
//                                 <img
//                                   src="images/inner-page/check-papular-icon.svg"
//                                 />
//                                 Most Popular
//                               </span>
//                             )
//                           }

//                           <h3>{plan.title}</h3>

//                           <h4>{plan.price}</h4>

//                           <div>

//                             {plan.features.map((feature, index) => (

//                               <p key={index}>
//                                 <img
//                                   src="images/inner-page/red-check.svg"
//                                   alt=""
//                                 />

//                                 {feature}
//                               </p>

//                             ))}

//                           </div>

//                           <button
//                             className="primary-cta"
//                             onClick={(e) => {
//                               e.stopPropagation();

//                               handleSubscribe(plan.price);
//                             }}
//                           >
//                             Subscribe Now

//                             <img
//                               src="images/inner-page/right-subcription.svg"
//                               alt=""
//                             />
//                           </button>

//                         </div>
//                       ))
//                     }

//                     {/* <div className="yearly-cards">
//                       <h3>Monthly</h3>
//                       <h4>$9.99</h4>
//                       <div>
//                         <p><img src="images/inner-page/red-check.svg" alt="" />Priority Customer Service Access</p>
//                         <p><img src="images/inner-page/red-check.svg" alt="" />20% OFF Discount Offers</p>
//                       </div>
//                       <button className="primary-cta">Subscribe Now <img src="images/inner-page/right-subcription.svg" alt="" /></button>
//                     </div>

//                     <div className="yearly-cards active">
//                       <span><img src="images/inner-page/check-papular-icon.svg" alt="" />Most Popular</span>
//                       <h3>Quarterly</h3>
//                       <h4>$7.99</h4>
//                       <div>
//                         <p><img src="images/inner-page/red-check.svg" alt="" />Priority Customer Service Access</p>
//                         <p><img src="images/inner-page/red-check.svg" alt="" />20% OFF Discount Offers</p>
//                       </div>
//                       <button className="primary-cta">Subscribe Now <img src="images/inner-page/right-subcription.svg" alt="" /></button>
//                     </div>

//                     <div className="yearly-cards">
//                       <h3>Yearly</h3>
//                       <h4>$5.99</h4>
//                       <div>
//                         <p><img src="images/inner-page/red-check.svg" alt="" />Priority Customer Service Access</p>
//                         <p><img src="images/inner-page/red-check.svg" alt="" />20% OFF Discount Offers</p>
//                       </div>
//                       <button className="primary-cta">Subscribe Now <img src="images/inner-page/right-subcription.svg" alt="" /></button>
//                     </div> */}

//                   </div>

//                   <div className="coupon-unlocked-wrp">
//                     <div className="left">
//                       <div className="coupon-img">
//                         <img src="images/inner-page/cupan-icon.svg" alt="" />
//                       </div>
//                       <div className="inner-data">
//                         <h4>Coupon Unlocked!</h4>
//                         <p>Enjoy additional rewards at checkout with your exclusive curator code.</p>
//                       </div>
//                     </div>

//                     <div className="right">
//                       <p className={copied ? "copy" : ""}>
//                         {couponCode}
//                       </p>
//                       <button className="copy-text-size" onClick={handleCopy}>
//                         <img src={
//                           copied ? "images/inner-page/success-icon.svg" : "images/inner-page/copy-icon-inner.svg"
//                         } alt="" />
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
//   )
// }

// export default ChoosePlan
