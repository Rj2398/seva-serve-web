import React from 'react'

const PaymentPage = () => {
  return (
    <>
        <main>
        <div className="container home-wraper my-profile" style={{height: "auto"}}>
      
          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="browse-wrp">
                    <div className="browse-ctg-head my-con-head">
                      <h2 className="sub-cate-page">
                        <a href="#"
                          ><img src="images/home/left-arrow.svg" alt=""
                        /></a>
                        Payment
                      </h2>
                    
                    </div>
                  </div>
            
                  <div className="checkout-wrp">
                    <div className="payment-main">
                      <div className="payment-wrp">
                        <p>Please review and confirm your remaining balance.</p>
                        <div className="payment-in">
                          {/* <!-- <h3>$149</h3> --> */}
                          <h5>JOB SUMMARY #Q1015</h5>
                          <h6>Initial Deposit Paid <b>-$10.00</b></h6>
                          <h6>
                            Subscription Offer
                            <span className="offer-tag">10% OFF</span> <b>-$9.00</b>
                          </h6>
                          <hr />
                          <h6 className="text-black">
                            Total Service Cost
                            <b style={{color:" #991318"}}
                              ><del className="text-black">$100</del> $81</b
                            >
                          </h6>
                          <h6>
                            Coupon Offer <span className="offer-tag">SEVA10</span>
                            <b>$8.10</b>
                          </h6>
                          <h6 style={{fontSize: "larger"}} className="mb-0">
                            Remaining Cost
                            <b style={{fontSize: "larger", color:" #991318"}}
                              >$72.90</b
                            >
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
                              checked
                            />
                            Credit Card (Stripe)
                          </li>
                          <li>
                            <input
                              type="radio"
                              value="2"
                              name="payment-method"
                            />
                            Zelle
                          </li>
                          <li>
                            <input
                              type="radio"
                              value="3"
                              name="payment-method"
                            />
                            Venmo
                          </li>
                        </ul>
                        <h4>Have a Coupon?</h4>
                        <div className="coupon-field">
                          <input type="text" placeholder="Enter code (e.g. SEVA10)" />
                          <button type="submit">Apply</button>
                        </div>
                      </div>
                    </div>

                    <div className="smart-analysis">
                      <p>
                        You have 24 hours to complete the payment, else it will
                        be deducted automatically from the added credit card
                        with 3% extra charge.
                      </p>
                    </div>
                    <br />
                
                    <div className="smart-analysis">
                      <h5>Important</h5>
                      <p>
                        • Please upload the payment screenshot if you select
                        Zelle or Venmo.
                      </p>
                      <p>
                        • If the paid amount is less than the requested amount,
                        the remaining balance will be deducted automatically
                        from your saved credit card.
                      </p>
                      <p>
                        <b>Please Note:</b> You have 24 hours to complete the
                        payment. If not completed, the full amount will be
                        automatically deducted from your added credit card with
                        a 3% additional charge.
                      </p>
                    </div>
                
                   
                    <div className="upload-screenshot">
                      <h4>Upload Payment Screenshot</h4>
                      <input type="file" />
                    </div>
                   
                    <div className="payment-btom">
                      <p>
                        Your payment will be securely processed and
                        automatically released to the contractor once the job is
                        approved.
                      </p>
                      <a href="#" className="primary-cta"
                        >Pay Now <img src="images/home/right-arrow.svg" alt=""
                      /></a>
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

export default PaymentPage
