import React from 'react'
import CompletePayment from './CompletePayment'
import Link from 'next/link'

const CompletedService = () => {
  return (
    <>
       <div className="modal fade welcome" id="serviceCompleted" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1 }aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="welcome-seva-ser">
                  <img src="images/modal/service-check.svg" className="check" alt=""/>
                  <h4>Service Completed</h4>
                  <p>The service is completed by your contractor successfully. <br/> Please approve!</p>
                  <a href="#completePayment" data-bs-toggle="modal" className="primary-cta requ-suc same">Approved</a>
                  <Link href="/help-support" className="secondary-cta"> Help & Support</Link>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        <CompletePayment/>
    </>
  )
}

export default CompletedService
