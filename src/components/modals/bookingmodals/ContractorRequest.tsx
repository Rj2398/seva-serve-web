import React, { useState } from 'react'
import DatePopup from './DatePopup'

const ContractorRequest = () => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  return (
    <>
       <div className="modal fade header-bdr" id="contractorTime" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                 
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                <h5 className="modal-title">Contractor’s Time Request</h5>
              </div>
              <div className="modal-body">
                <div className="welcome-seva-ser full-bdr">
                  <div className="plumbing-repair">
                    <h6>Plumbing - Shower Repair</h6>
                  <p>Preferred : Jan 15, 2026 • 10:30 AM</p>
                  <p><img src="images/modal/location-icon.svg" alt=""/>10001</p>
                  </div>
                  <div className="contractor-new">
                    <h6>Contractor Suggested New Time</h6>
                    <p>24 Jan 2026 · 2:00 PM – 4:00 PM</p>
                  </div>
                  <div className="contractor-btn">
                    <a href="#" data-bs-toggle="modal" className="secondary-cta">Reject</a>
                     <a href="#select-date-time-popup" onClick={() => setShowDatePicker(true)} data-bs-toggle="modal" className="Propose-cta">Propose</a>
                      <a href="#" data-bs-toggle="modal" className="primary-cta">Accept <img src="images/modal/right-arrow-icon.svg" alt=""/></a>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        <DatePopup isOpen={showDatePicker} setIsOpen={setShowDatePicker}/>
    </>
  )
}

export default ContractorRequest
