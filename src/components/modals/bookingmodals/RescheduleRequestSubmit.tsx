import React from 'react'

const RescheduleRequestSubmit = () => {
  return (
    <>
      
         <div className="modal fade welcome" id="rescheduleRequest" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="welcome-seva-ser">
                  <img src="images/modal/requ-sucess.svg" className="check" alt=""/>
                  <h4>Reschedule Request Submitted</h4>
                  <p>Your reschedule request has been submitted. You’ll be notified once the contractor reviews and confirms the updated time.</p>
                  <a href="#add-Your-Card" data-bs-toggle="modal" className="primary-cta requ-suc">Okay<img src="images/modal/right-arrow-icon.svg" className="arrow" alt=""/></a>
                </div>
              </div>
              
            </div>
          </div>
        </div>
    </>
  )
}

export default RescheduleRequestSubmit
