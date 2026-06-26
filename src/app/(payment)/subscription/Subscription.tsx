"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Subscription = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('Quarterly');

  const [isCopied, setIsCopied] = useState(false);
  const couponCode = "SEVA200FF";

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const plans = [
    { id: 'Monthly', price: '$9.99', popular: false },
    { id: 'Quarterly', price: '$7.99', popular: true },
    { id: 'Yearly', price: '$5.99', popular: false }
  ];



  return (
    <>
      <main>
        <div className="container home-wraper my-profile">

          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="browse-wrp">
                    <div className="browse-ctg-head my-con-head">
                      <h2 className="sub-cate-page">
                        <button onClick={() => router.back()} className="btn p-0 m-0">
                          <img src="images/home/left-arrow.svg" alt="" />
                        </button>
                        Choose Your Plan
                      </h2>
                    </div>

                    <div className="choose-plan-wrp">
                      {plans.map((plan) => (
                        <div
                          key={plan.id}
                          // Dynamic active class based on selection
                          className={`yearly-cards ${selectedPlan === plan.id ? 'active' : ''}`}
                          onClick={() => setSelectedPlan(plan.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {plan.popular && (
                            <span><img src="images/inner-page/check-papular-icon.svg" alt="" />Most Popular</span>
                          )}
                          <h3>{plan.id}</h3>
                          <h4>{plan.price}</h4>
                          <div>
                            <p><img src="images/inner-page/red-check.svg" alt="" />Priority Customer Service Access</p>
                            <p><img src="images/inner-page/red-check.svg" alt="" />20% OFF Discount Offers</p>
                          </div>
                          <button className="primary-cta">
                            Subscribe Now <img src="images/inner-page/right-subcription.svg" alt="" />
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
                          <p>Enjoy additional rewards at checkout with your exclusive curator code.</p>
                        </div>
                      </div>
                      {!isCopied ? (
                        <div className="right">
                          <p>{couponCode}</p>
                          <button className="copy-text-size" onClick={handleCopy}>
                            <img src="images/inner-page/copy-icon-inner.svg" alt="" />
                          </button>
                        </div>
                      ) : (
                        /* Dusra Copy Box: Jab copy success ho gaya (UI change) */
                        <div className="right">
                          <p className="copy">{couponCode}</p>
                          <button className="copy-text-size">
                            <img src="images/inner-page/success-icon.svg" alt="" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


        </div>

      </main>
    </>
  )
}

export default Subscription