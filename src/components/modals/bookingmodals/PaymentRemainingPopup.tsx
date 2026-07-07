import Link from 'next/link';
import React from 'react'

interface PaymentRemainingPopupProps {
  bookingPaymentInfo: any;
  bookingId: string;
}

const PaymentRemainingPopup = ({ bookingPaymentInfo, bookingId }: PaymentRemainingPopupProps) => {
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
                      <h3>${bookingPaymentInfo?.originalAmount}</h3>
                    </div>
                    <ul>
                      <li>Service Total <span>${bookingPaymentInfo?.originalAmount}</span></li>
                      <li>Advance Paid <span>-${bookingPaymentInfo?.discountAmount}</span></li>
                    </ul>
                  </div>
                  <div className="pay-remaining-top border-0">
                    <ul>
                      <li>Total Due <span>${bookingPaymentInfo?.totalAmount}</span></li>
                    </ul>
                    <div className="home-quotes-cta">
                      <button type="button" data-bs-dismiss="modal" className="reject-btn">Cancel</button>
                      <Link href="/checkout" className="primary-cta rgt"> Confirm & Pay <img
                        src="images/home/right-img.svg" alt="" /> </Link>
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
