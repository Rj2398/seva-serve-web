import React from 'react'

const ServiceAccepted = () => {
  return (
    <div className="modal fade welcome" id="servicesAccepted" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="welcome-seva-ser">
                  <img src="images/modal/requ-sucess.svg" className="check" alt=""/>
                  <h4>Services Accepted</h4>
                  <p>You’ve successfully accepted the additional services.</p>
                  <p>  The job details have been updated and work will continue as scheduled.</p>
                  <a href="#add-Your-Card" data-bs-toggle="modal" className="primary-cta requ-suc same">Back to Booking</a>
                </div>
              </div>
              
            </div>
          </div>
        </div>
  )
}

export default ServiceAccepted
