"use client"
import DatePopup from '@/components/modals/bookingmodals/DatePopup'
import Link from 'next/link'
import React, { useState } from 'react'

const BookingUpdate = () => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  return (
    <>
      <main>
        <div className="container home-wraper my-profile" style={{ height: "auto" }}>
          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="browse-wrp">

                    <div className="browse-ctg-head my-con-head">
                      <h2 className="sub-cate-page">
                        <Link href="/view-booking-detail"><img src="images/home/left-arrow.svg" alt="" /></Link>
                        Booking Update
                      </h2>
                      <Link href="/help-support" className="hel-cta"><i className="fa-regular fa-circle-question"></i> Help & Support</Link>
                    </div>

                    <div className="contractor-runnig-late">
                      <div className="image-icon">
                        <img src="images/clock-color-icon.svg" alt="" />
                      </div>

                      <div className="text-data">
                        <h3>Your contractor is running late</h3>
                        <p>They've requested to push your booking by <span className="hors">1h</span>.</p>
                      </div>

                    </div>

                    <div className="vehicle-issue-data">


                      <div className="update-icons">
                        <h3>
                          <img src="images/calender-icon-update.svg" alt="" />Nov 18, 2025
                        </h3>

                      </div>

                      <div className="vehicle-inner-data">
                        <div className="time-wrp">
                          <p>Original Scheduled Time</p> <span className="line">10:00 AM</span>
                        </div>
                        <div className="time-wrp">
                          <p>New Time</p>     <span>01:00 PM</span>
                        </div>
                        <h4>Reason Given</h4>
                        <h4>Vehicle issue</h4>
                        <p>Hi, I apologize for the delay. I was held up due to an unexpected vehicle issue while on the way to the site. Thank you for your understanding.</p>
                      </div>

                    </div>

                    <div className="vahicle-footer-btn">
                      <button className="secondary-cta">Cancel</button>
                      <button className="primary-cta" onClick={() => setShowDatePicker(true)}>Accept new time 1:00 PM</button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

      </main>

      <DatePopup isOpen={showDatePicker} setIsOpen={setShowDatePicker} />
    </>
  )
}

export default BookingUpdate