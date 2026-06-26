import Link from 'next/link'
import React from 'react'

const ServiceRejected = () => {
  return (
    <>
       <div className="modal fade welcome" id="#servicesRejected" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="welcome-seva-ser">
                  <img src="images/modal/reject-cross-icon.svg" className="check" alt=""/>
                  <h4>Services Rejected</h4>
                  <p>You’ve rejected the additional services.</p>
                  <p>The job will continue based on the original scope and pricing.</p>
                  <Link href="/booking" data-bs-toggle="modal" className="primary-cta requ-suc same">Back to Booking</Link>
                </div>
              </div>
              
            </div>
          </div>
        </div>
    </>
  )
}

export default ServiceRejected
