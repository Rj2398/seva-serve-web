"use client"
import { globalServerRequest } from '@/actions/globalApi';
import DatePopup from '@/components/modals/bookingmodals/DatePopup'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'


interface BookingUpdateProps {
  bookingData?: any;
}

const formatDate = (dateStr:any) => {
  if (!dateStr) return '';
  let dateObj;
  if (typeof dateStr === 'string' && (dateStr.includes('-') || dateStr.includes('/'))) {
    const separator = dateStr.includes('-') ? '-' : '/';
    const parts = dateStr.split(separator);
    if (parts[0].length === 2 && parts[2].length === 4) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);

      dateObj = new Date(year, month, day);
    }
  }

  if (!dateObj || isNaN(dateObj.getTime())) {
    dateObj = new Date(dateStr);
  }

  if (isNaN(dateObj.getTime())) return '';
  const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  return `${month} ${day} ${year}`; // Target: "jul 23 2026"
};

const BookingUpdate = ({ bookingData }: BookingUpdateProps) => {
  const route = useRouter()
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [bookings, setBookings] = useState<any>(bookingData)

  type LateRequestStatus = 'decline' | 'accept';

  const handleRequest = async (status: LateRequestStatus) => {
    try {
      const res = await globalServerRequest({
        endpoint: "booking/approve-running-late-request",
        method: "POST",
        payload: {
          booking_id: Number(bookings.booking_id),
          late_alert_id: Number(bookings.late_alert_id),
          status: status
        }
      })
      if (res?.success) {
        const bData = await globalServerRequest({
          endpoint: "booking/get-running-late-request",
          method: "POST",
          payload: {
            booking_id: Number(bookings.booking_id),
            late_alert_id: Number(bookings.late_alert_id),
          }
        })
        if (bData?.success) {
          setBookings(bData.data?.data);
          if (status == "decline") route.push(`/view-booking-detail?bookingId=${Number(bookings.booking_id)}`)
          if (status == "accept") route.push('/booking')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

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
                        <Link href={`/view-booking-detail?bookingId=${bookings.booking_id}`}><img src="images/home/left-arrow.svg" alt="" /></Link>
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
                        <p>They've requested to push your booking by <span className="hors">{bookings?.duration}</span>.</p>
                      </div>
                    </div>
                    <div className="vehicle-issue-data">
                      <div className="update-icons">
                        <h3>
                          <img src="images/calender-icon-update.svg" alt="" />{bookings?.schedule_date &&
                            formatDate(bookings?.schedule_date)}
                        </h3>
                      </div>
                      <div className="vehicle-inner-data">
                        <div className="time-wrp">
                          <p>Original Scheduled Time</p> <span className="line">{bookings?.time_slot?.original_slot}</span>
                        </div>
                        <div className="time-wrp">
                          <p>New Time</p>     <span>{bookings?.time_slot?.slot}</span>
                        </div>
                        <h4>Reason Given</h4>
                        <h4>{bookings?.reason_for_late}</h4>
                        <p>{bookings?.description}</p>
                      </div>
                    </div>
                    {
                      bookings?.status === "request" ? (
                        <div className="vahicle-footer-btn">
                          <button className="primary-cta" onClick={() => handleRequest('decline')}>Reject</button>
                          <button className="primary-cta" onClick={() => handleRequest('accept')}>Accept new time {bookings?.time_slot?.slot}</button>
                        </div>
                      ) : (
                        bookings?.status === "accept" ? (
                          <div className="vahicle-footer-btn">
                            <button className="primary-cta" disabled >Accepted</button>
                          </div>
                        ) : bookings?.status === "decline" && (
                          <div className="vahicle-footer-btn">
                            <button className="secondary-cta" disabled>Rejected</button>
                          </div>
                        )
                      )
                    }
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