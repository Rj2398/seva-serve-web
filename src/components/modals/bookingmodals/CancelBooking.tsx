import Link from 'next/link'
import React from 'react'

const CancelBooking = () => {
  return (
    <>
     <div className="modal fade" id="cancelBookingPopup" data-bs-backdrop="static" tabIndex={-1}
    aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog  modal-dialog-centered">
      <div className="modal-content">
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        <div className="modal-body">
          <div className="select-date-time-wrp cancel-nooking">
            <h1>Cancel Booking</h1>
            <div>
              <h5>PLEASE NOTE:</h5>
              <p className="body-text">If cancelled, you may lose your deposit. If possible, please try rescheduling or contact <a href="#">Help & Support</a> for assistance.</p>
              <p className="notice">Notice:  <span> Bookings cannot be cancelled within 24 hours of the appointment.</span></p>
              <div className="cnl-cta">
                <button className="secondary-cta" data-bs-target="#select-date-time-popup" data-bs-toggle="modal" >Reschedule</button>
                <button type="button" className="secondary-cta cancel">Cancel</button>
              </div>
              <p className="contact"><Link href="/help-support" >Contact Help & Support</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    </>
  )
}

export default CancelBooking
