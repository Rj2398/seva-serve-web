import React from 'react'

const PaymentRemainingPopup = () => {
  return (
    <>
      <div className="modal fade" id="pay-remaining-popup" data-bs-backdrop="static" tabIndex={-1}
    aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        <div className="modal-body p-0">
          <div className="rate-contractor-wrp">
            <h1>Confirm & Pay Remaining</h1>
            <div className="pay-remaining-wrp">
              <div className="pay-remaining-top">
                <div className="pay-remaining-data">
                  <p><b>Remaining Amount to Pay</b></p>
                  <h3>$149</h3>
                </div>
                <ul>
                  <li>Service Total <span>$200</span></li>
                  <li>Advance Paid <span>-$51</span></li>
                </ul>
              </div>
              <div className="pay-remaining-top border-0">
                <ul>
                  <li>Total Due <span>$149</span></li>
                </ul>
                <div className="home-quotes-cta">
                  <button type="button" data-bs-dismiss="modal" className="reject-btn">Cancel</button>
                  <a href="checkout.html" className="primary-cta rgt"> Confirm & Pay <img
                      src="images/home/right-img.svg" alt=""/> </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   </div>
    </>
  )
}

export default PaymentRemainingPopup
