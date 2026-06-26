"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import React from 'react'

const CompletePayment = () => {
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
                  <p>You’ve paid <span>$50.00</span> The remaining balance is <span>$100.00</span>, which you can pay now.</p>
                  <Link href="/checkout" onClick={()=>router.push("/checkout")}  data-bs-toggle="modal" className="primary-cta requ-suc same">Pay Now</Link>
                </div>
              </div>
              
            </div>
          </div>
        </div>
    </>
  )
}

export default CompletePayment
