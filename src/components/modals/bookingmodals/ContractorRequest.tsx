"use client";

import React, { useState } from 'react'
import DatePopup from './DatePopup'


interface ContractorRequestProps {
  booking: any;
}

const ContractorRequest = ({ booking }: ContractorRequestProps) => {


  console.log(booking, "jdsfdksfjkfj")
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);


  const handlePopupOpen = () => {
    const currentModal = document.getElementById("contractorTime");
    if (currentModal) {
      const bootstrapModal =
        window.bootstrap?.Modal.getInstance(currentModal);
      bootstrapModal?.hide();
    }
    setShowDatePicker(true);
  }



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
                  <h6>{booking?.categoryName} - {booking?.services[0]?.serviceName}</h6>
                  <p>Preferred : {booking?.contractorTimeRequest?.preferredDateTime}</p>
                  <p><img src="images/modal/location-icon.svg" alt="" /></p>
                </div>
                <div className="contractor-new">
                  <h6>Contractor Suggested New Time</h6>
                  <p>{booking?.contractorTimeRequest?.contractorSuggestedSlot}</p>
                </div>
                <div className="contractor-btn">
                  <a href="#" data-bs-toggle="modal" className="secondary-cta">Reject</a>
                  <a href="#" onClick={handlePopupOpen} className="Propose-cta">Propose</a>
                  <a href="#" data-bs-toggle="modal" className="primary-cta">Accept <img src="images/modal/right-arrow-icon.svg" alt="" /></a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <DatePopup isOpen={showDatePicker} setIsOpen={setShowDatePicker}
      //  requestId={booking?.contractorTimeRequest?.requestId}
      />
    </>
  )
}

export default ContractorRequest
