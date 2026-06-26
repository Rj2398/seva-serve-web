import React from 'react'

const ConfirmCancelBooking = () => {
  return (
    <>
        <div className="modal fade" id="cancelBooking" data-bs-backdrop="static" tabIndex={-1}
    aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog  modal-dialog-centered">
      <div className="modal-content">
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        <div className="modal-body">
          <div className="select-date-time-wrp">
            <h1>Cancel Booking</h1>

          </div>
        </div>
      </div>
    </div>
  </div>
    </>
  )
}

export default ConfirmCancelBooking
