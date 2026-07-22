"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import React from 'react'

interface BookingUpdateProps {
  bookingTrackingData?: any;
  bookingId?: any
}

const CompletePayment = ({ bookingTrackingData, bookingId }: BookingUpdateProps) => {
  const router = useRouter()
  return (
    <>
      <div className="modal fade header-bdr" id="completePayment" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">

              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              <h5 className="modal-title">Complete Your Payment</h5>
            </div>
            <div className="modal-body">
              <div className="welcome-seva-ser">
                <p>You’ve paid <span>${bookingTrackingData?.depositAmount}</span> The remaining balance is <span>${bookingTrackingData?.remainingCost}</span>, which you can pay now.</p>
                <Link href={`/checkout?bookingId=${bookingId}&paymenttype=full`} className="primary-cta requ-suc same">Pay Now</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default CompletePayment
