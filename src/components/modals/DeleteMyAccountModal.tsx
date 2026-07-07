import React from 'react'

interface DeleteMyAccountModalProps {

  accountData: {
    data?: string;
  } | null;

}


export default function DeleteMyAccountModal({ accountData }: DeleteMyAccountModalProps) {


  console.log("accountData", accountData)

  return (
    <div className="modal fade delete-account" id="importantNoticeModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Important Notice</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body delete-account-bdy notice">
            <div className="notice-data">
              <h4>Before you delete your account</h4>
              <p>You have pending payment(s) for previously completed service(s). Even after deleting your account, we will still deduct the remaining amount from your saved payment method as per our payment policy.</p>
            </div>
            <div className="service-important">
              <p>Service</p>
              <h4>AC Deep Cleaning</h4>
              <p>Pending Amount</p>
              <h4>$120</h4>
              <p>Payment Method</p>
              <h4>**** **** **** 4321 (Visa)</h4>
            </div>
            <div className="notice-footer-btn">
              <a href="#" className="primary-cta">I Understand — Delete My Account <img src="images/modal/notice-right-arrow.svg" alt="" /></a>
              <button className="secondary-cta" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
