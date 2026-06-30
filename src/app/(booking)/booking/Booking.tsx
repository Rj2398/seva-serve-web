"use client";

import CancelBooking from "@/components/modals/bookingmodals/CancelBooking";
import ConfirmCancelBooking from "@/components/modals/bookingmodals/ConfirmCancelBooking";
import ContractorRequest from "@/components/modals/bookingmodals/ContractorRequest";
import NewServiceRejectionModal from "@/components/modals/bookingmodals/NewServiceRejectionModal";
import PaymentRemainingPopup from "@/components/modals/bookingmodals/PaymentRemainingPopup";
import RateContractorPopup from "@/components/modals/bookingmodals/RateContractorPopup";
import RescheduleRequestSubmit from "@/components/modals/bookingmodals/RescheduleRequestSubmit";
import ServiceAccepted from "@/components/modals/bookingmodals/ServiceAccepted";
import ServiceRejected from "@/components/modals/bookingmodals/ServiceRejected";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { bookingData } from "../../../json/booking.json";

interface BookingProps {
  initialBookingData?: {
    upcoming: any[];
    previous: any[];
    cancelled: any[];
  };
}

export default function Booking({ initialBookingData }: BookingProps) {
  const router = useRouter();

  const [myBookingData, setMyBookingData] = useState<any>(
    initialBookingData || bookingData
  );
  const [activeTab, setActiveTab] = useState("upcoming");

  let booking = myBookingData?.[activeTab] || [];

  return (
    <>
      <main>
        <div className="container home-wraper" style={{ minHeight: "100vh" }}>
          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="browse-wrp">
                    <div className="browse-ctg-head my-con-head">
                      <h2 className="sub-cate-page">
                        {" "}
                        <Link href="/home">
                          <img src="images/home/left-arrow.svg" alt="" />
                        </Link>
                        My Bookings{" "}
                      </h2>
                      <div className="tab-left">
                        <ul
                          className="nav nav-pills mb-3"
                          id="customTabs-tab"
                          role="tablist"
                        >
                          {/* {["Upcoming", "Previous","Cancelled"].map((item,index)=>(
                                                        <li className="nav-item" role="presentation" key={index}>
                                                        <button className="nav-link active"
                                                            id="customTabs-upcoming-tab"
                                                            data-bs-toggle="pill"
                                                            data-bs-target="#customTabs-home"
                                                            type="button"
                                                            role="tab"
                                                            aria-controls="customTabs-home"
                                                            aria-selected="true">
                                                          {item}
                                                        </button>
                                                    </li>
                                                    ))
                                                   } */}

                          {["Upcoming", "Previous", "Cancelled"].map(
                            (item, index) => (
                              <li
                                className="nav-item"
                                role="presentation"
                                key={index}
                              >
                                <button
                                  className={`nav-link ${activeTab === item.toLowerCase()
                                      ? "active"
                                      : ""
                                    }`}
                                  type="button"
                                  onClick={() =>
                                    setActiveTab(item.toLowerCase())
                                  }
                                >
                                  {item}
                                </button>
                              </li>
                            )
                          )}

                          {/* <li className="nav-item" role="presentation">
                                                        <button className="nav-link"
                                                            id="customTabs-previous-tab"
                                                            data-bs-toggle="pill"
                                                            data-bs-target="#customTabs-profile"
                                                            type="button"
                                                            role="tab"
                                                            aria-controls="customTabs-profile"
                                                            aria-selected="false">
                                                            Previous
                                                        </button>
                                                    </li>

                                                    <li className="nav-item" role="presentation">
                                                        <button className="nav-link"
                                                            id="customTabs-cancelled-tab"
                                                            data-bs-toggle="pill"
                                                            data-bs-target="#customTabs-contact"
                                                            type="button"
                                                            role="tab"
                                                            aria-controls="customTabs-contact"
                                                            aria-selected="false">
                                                            Cancelled
                                                        </button>
                                                    </li> */}
                        </ul>
                      </div>
                    </div>
                    <div className="mu-quotes-body">
                      <div className="tab-content" id="customTabs-tabContent">
                        <div
                          className="tab-pane fade show active"
                          id="customTabs-home"
                          role="tabpanel"
                          aria-labelledby="customTabs-upcoming-tab"
                        >
                          {/* <div className="my-inner-boking-top">
                                                        <div className="my-quotes-inner">



                                                            <div className="my-booking-wrpper">
                                                                <div className="booking-left-img">
                                                                    <img src="images/inner-page/booking-img.svg" alt="" />
                                                                </div>
                                                                <div className="plumbing">

                                                                    <div className="plumbing-top">
                                                                        <p className="plm">
                                                                            Plumbing
                                                                            <img src="images/home/up-right-arrow.svg" alt="" />
                                                                        </p>
                                                                        <div className="add-progress">

                                                                            <p className="right"><img src="images/inner-page/in-progress.svg" alt="" />In Progress</p>
                                                                        </div>
                                                                    </div>
                                                                    <p className="months">Nov 19, 2026 • 10:30 AM</p>
                                                                    <p className="sub-cate">Services Selected</p>

                                                                    <div className="service-list-type">
                                                                        <ol className="main-category">
                                                                            <li>
                                                                                Sink Installation

                                                                            </li>
                                                                            <li>Toilet Blockage</li>
                                                                        </ol>
                                                                        <ol className="main-category booking">
                                                                            <li className="more-service">+ 1 more service</li>

                                                                            <div className="service-data">
                                                                                <ol className="main-category">
                                                                                    <li>
                                                                                        Sink Installation

                                                                                    </li>
                                                                                    <li>Toilet Blockage</li>
                                                                                </ol>
                                                                            </div>
                                                                            <li className="less-service">Less service</li>
                                                                        </ol>


                                                                        <div className="service-quotes">
                                                                            <p className="service-cost">Amount :<span>$149</span></p>
                                                                            <div className="home-quotes-cta">
                                                                                <Link href="/view-booking-detail" className="reject-btn">View Details</Link>
                                                                                <button className="primary-cta rgt" data-bs-target="#contractorTime" data-bs-toggle="modal">
                                                                                    View Contractor Request

                                                                                </button>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>

                                                            </div>


                                                        </div>
                                                        <div className="my-quotes-inner">



                                                            <div className="my-booking-wrpper">
                                                                <div className="booking-left-img">
                                                                    <img src="images/inner-page/booking-img.svg" alt="" />
                                                                </div>
                                                                <div className="plumbing">

                                                                    <div className="plumbing-top">
                                                                        <p className="plm">
                                                                            Plumbing
                                                                            <img src="images/home/up-right-arrow.svg" alt="" />
                                                                        </p>
                                                               
                                                                    </div>

                                                                    <p className="sub-cate">Nov 19, 2026 • 10:30 AM</p>
                                                                    <p className="service-cost">Amount :<span>$149</span></p>
                                                                    <p className="sub-cate">Services Selected</p>
                                                                    <div className="service-list-type">
                                                                        <ol className="main-category">
                                                                            <li>
                                                                                Sink Installation

                                                                            </li>
                                                                            <li>Toilet Blockage</li>
                                                                        </ol>
                                                                        <ol className="main-category booking">
                                                                          

                                                                            <div className="service-data">
                                                                                <ol className="main-category">
                                                                                    <li>
                                                                                        Sink Installation

                                                                                    </li>
                                                                                    <li>Toilet Blockage</li>
                                                                                </ol>
                                                                            </div>
                                                                            <li className="less-service">Less service</li>
                                                                        </ol>


                                                                        <div className="service-quotes my-booking">
                                                                            
                                                                            <div className="home-quotes-cta">
                                                                                <button className="reject-btn" data-bs-target="#cancelBookingPopup" data-bs-toggle="modal">Cancel</button>
                                                                                <button className="primary-cta rgt" data-bs-target="#rescheduleRequest" data-bs-toggle="modal">
                                                                                    <img src="images/inner-page/clock-booking.svg" className="img-left" alt="" />  Reschedule                                                                               
                                                                                </button>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>

                                                            </div>


                                                        </div>
                                                    </div> */}

                          {booking.length > 0 ? (
                            booking.map((item: any, index: number) => (
                              <div
                                className="my-inner-boking-top"
                                key={item?.id || index}
                              >
                                <div className="my-quotes-inner">
                                  <div className="my-booking-wrpper">
                                    <div className="booking-left-img">
                                      <img
                                        src="images/inner-page/booking-img.svg"
                                        alt=""
                                      />
                                    </div>
                                    <div className="plumbing">
                                      <div className="plumbing-top">
                                        {item?.status === "Completed" && (
                                          <p className="plm cmp">
                                            {item.category}
                                            <img
                                              src="images/home/up-right-arrow.svg"
                                              alt=""
                                            />{" "}
                                            <span>
                                              Completed{" "}
                                              <img
                                                src="images/inner-page/complete-check-icon.svg"
                                                alt=""
                                              />
                                            </span>
                                          </p>
                                        )}

                                        {item?.status === "Cancelled" && (
                                          <p className="plm cmp">
                                            Plumbing
                                            <img
                                              src="images/home/up-right-arrow.svg"
                                              alt=""
                                            />{" "}
                                            <span>
                                              Cancelled{" "}
                                              <img
                                                src="images/inner-page/delete-icon-can.svg"
                                                alt=""
                                              />
                                            </span>
                                          </p>
                                        )}
                                      </div>

                                      {item?.status === "In Progress" && (
                                        <div className="plumbing-top">
                                          <p className="plm">
                                            {item.category}
                                            <img
                                              src="images/home/up-right-arrow.svg"
                                              alt=""
                                            />
                                          </p>

                                          <div className="add-progress">
                                            <p className="right">
                                              <img
                                                src="images/inner-page/in-progress.svg"
                                                alt=""
                                              />
                                              In Progress
                                            </p>
                                          </div>
                                        </div>
                                      )}

                                      <p className="sub-cate">
                                        {item.booking_date} •{" "}
                                        {item.booking_time}
                                      </p>
                                      {(item.status === "Cancelled" ||
                                        item?.status === "Completed") && (
                                          <p className="service-cost">
                                            Amount :
                                            <span>
                                              {`$ ${item?.amount}` || "$0"}
                                            </span>
                                          </p>
                                        )}
                                      <p className="sub-cate">
                                        Services Selected
                                      </p>

                                      <div className="service-list-type">
                                        <ol className="main-category">
                                          {item?.services?.map(
                                            (
                                              service: string,
                                              index: number
                                            ) => (
                                              <li key={index}>{service}</li>
                                            )
                                          )}
                                        </ol>
                                        {item?.status === "In Progress" ||
                                          (item?.status === "Pending" && (
                                            <ol className="main-category booking">
                                              <li className="more-service">
                                                + 1 more service
                                              </li>

                                              <div className="service-data">
                                                <ol className="main-category">
                                                  <li>Sink Installation</li>
                                                  <li>Toilet Blockage</li>
                                                </ol>
                                              </div>
                                              <li className="less-service">
                                                Less service
                                              </li>
                                            </ol>
                                          ))}

                                        <div className="service-quotes">
                                          {(item.status === "In Progress" ||
                                            item.status === "Pending") && (
                                              <p className="service-cost">
                                                Amount :
                                                <span>
                                                  {`$ ${item?.amount}` || "$0"}
                                                </span>
                                              </p>
                                            )}
                                          {item.status === "In Progress" && (
                                            <div className="home-quotes-cta">
                                              <Link
                                                href="/view-booking-detail"
                                                className="reject-btn"
                                              >
                                                View Details
                                              </Link>
                                              <button
                                                className="primary-cta rgt"
                                                data-bs-target="#contractorTime"
                                                data-bs-toggle="modal"
                                              >
                                                View Contractor Request
                                              </button>
                                            </div>
                                          )}
                                        </div>

                                        {item.status === "Upcoming" ||
                                          (item.status === "Pending" && (
                                            <div className="service-quotes my-booking">
                                              <div className="home-quotes-cta">
                                                <button
                                                  className="reject-btn"
                                                  data-bs-target="#cancelBookingPopup"
                                                  data-bs-toggle="modal"
                                                >
                                                  Cancel
                                                </button>
                                                <button
                                                  className="primary-cta rgt"
                                                  data-bs-target="#select-date-time-popup"
                                                  data-bs-toggle="modal"
                                                >
                                                  <img
                                                    src="images/inner-page/clock-booking.svg"
                                                    className="img-left"
                                                    alt=""
                                                  />{" "}
                                                  Reschedule
                                                </button>
                                              </div>
                                            </div>
                                          ))}

                                        {item.status === "Completed" && (
                                          <div className="service-quotes my-booking">
                                            {/* <!-- <p className="service-cost">Cost:<span>$149</span></p> --> */}
                                            <div className="home-quotes-cta">
                                              <button
                                                className="reject-btn"
                                                data-bs-toggle="modal"
                                                data-bs-target="#rate-contractor-popup"
                                              >
                                                Add Feedback
                                              </button>
                                              <a
                                                href="#pay-remaining-popup"
                                                data-bs-toggle="modal"
                                                className="primary-cta rgt"
                                              >
                                                Confirm & Pay
                                                <img
                                                  src="images/modal/right-arrow-icon.svg"
                                                  className="img-right"
                                                  alt=""
                                                />
                                              </a>
                                            </div>
                                          </div>
                                        )}

                                        {item?.status === "fully-Completed" && (
                                          <div className="service-quotes my-booking">
                                            <div className="home-quotes-cta">
                                              <button
                                                className="primary-cta rgt"

                                              // data-bs-target="#rescheduleRequest" data-bs-toggle="modal"
                                              >
                                                <img
                                                  src="images/inner-page/download-icon.svg"
                                                  className="img-left"
                                                  alt=""
                                                />{" "}
                                                Download Invoice
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="my-quotes-inner">



                                                            <div className="my-booking-wrpper">
                                                                <div className="booking-left-img">
                                                                    <img src="images/inner-page/booking-img.svg" alt="" />
                                                                </div>
                                                                <div className="plumbing">

                                                                    <div className="plumbing-top">
                                                                        <p className="plm">
                                                                            Plumbing
                                                                            <img src="images/home/up-right-arrow.svg" alt="" />
                                                                        </p>
                                                               
                                                                    </div>

                                                                    <p className="sub-cate">Nov 19, 2026 • 10:30 AM</p>
                                                                    <p className="service-cost">Amount :<span>$149</span></p>
                                                                    <p className="sub-cate">Services Selected</p>
                                                                    <div className="service-list-type">
                                                                        <ol className="main-category">
                                                                            <li>
                                                                                Sink Installation

                                                                            </li>
                                                                            <li>Toilet Blockage</li>
                                                                        </ol>
                                                                        <ol className="main-category booking">
                                                                          

                                                                            <div className="service-data">
                                                                                <ol className="main-category">
                                                                                    <li>
                                                                                        Sink Installation

                                                                                    </li>
                                                                                    <li>Toilet Blockage</li>
                                                                                </ol>
                                                                            </div>
                                                                            <li className="less-service">Less service</li>
                                                                        </ol>


                                                                        <div className="service-quotes my-booking">
                                                                            
                                                                            <div className="home-quotes-cta">
                                                                                <button className="reject-btn" data-bs-target="#cancelBookingPopup" data-bs-toggle="modal">Cancel</button>
                                                                                <button className="primary-cta rgt" data-bs-target="#rescheduleRequest" data-bs-toggle="modal">
                                                                                    <img src="images/inner-page/clock-booking.svg" className="img-left" alt="" />  Reschedule                                                                               
                                                                                </button>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>

                                                            </div>


                                                        </div> */}
                              </div>
                            ))
                          ) : (
                            <p className="no-data">
                              No Upcoming Booking Available
                            </p>
                          )}
                        </div>

                        <div
                          className="tab-pane fade"
                          id="customTabs-profile"
                          role="tabpanel"
                          aria-labelledby="customTabs-previous-tab"
                        >
                          <div className="my-inner-boking-top">
                            <div className="my-quotes-inner">
                              <div className="my-booking-wrpper">
                                <div className="booking-left-img">
                                  <img
                                    src="images/inner-page/booking-img.svg"
                                    alt=""
                                  />
                                </div>
                                <div className="plumbing">
                                  <div className="plumbing-top">
                                    <p className="plm cmp">
                                      Plumbing
                                      <img
                                        src="images/home/up-right-arrow.svg"
                                        alt=""
                                      />{" "}
                                      <span>
                                        Completed{" "}
                                        <img
                                          src="images/inner-page/complete-check-icon.svg"
                                          alt=""
                                        />
                                      </span>
                                    </p>
                                    {/* <!-- <div className="add-progress">
                     
                      <p className="right"><img src="images/inner-page/in-progress.svg" alt=""/>In Progress</p>
                    </div> --> */}
                                  </div>

                                  <p className="sub-cate">
                                    Nov 19, 2026 • 10:30 AM
                                  </p>
                                  <p className="service-cost">
                                    Amount :<span>$149</span>
                                  </p>
                                  <p className="sub-cate">Services Selected</p>
                                  <div className="service-list-type">
                                    <ol className="main-category">
                                      <li>Sink Installation</li>
                                      <li>Toilet Blockage</li>
                                    </ol>
                                    <ol className="main-category booking">
                                      {/* <!-- <li className="more-service">+ 1 more service</li> --> */}

                                      <div className="service-data">
                                        <ol className="main-category">
                                          <li>Sink Installation</li>
                                          <li>Toilet Blockage</li>
                                        </ol>
                                      </div>
                                      <li className="less-service">
                                        Less service
                                      </li>
                                    </ol>

                                    <div className="service-quotes my-booking">
                                      {/* <!-- <p className="service-cost">Cost:<span>$149</span></p> --> */}
                                      <div className="home-quotes-cta">
                                        <button
                                          className="reject-btn"
                                          data-bs-toggle="modal"
                                          data-bs-target="#rate-contractor-popup"
                                        >
                                          Add Feedback
                                        </button>
                                        <a
                                          href="#pay-remaining-popup"
                                          data-bs-toggle="modal"
                                          className="primary-cta rgt"
                                        >
                                          Confirm & Pay
                                          <img
                                            src="images/modal/right-arrow-icon.svg"
                                            className="img-right"
                                            alt=""
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="my-quotes-inner">
                              <div className="my-booking-wrpper">
                                <div className="booking-left-img">
                                  <img
                                    src="images/inner-page/booking-img.svg"
                                    alt=""
                                  />
                                </div>
                                <div className="plumbing">
                                  <div className="plumbing-top">
                                    <p className="plm cmp">
                                      Plumbing
                                      <img
                                        src="images/home/up-right-arrow.svg"
                                        alt=""
                                      />{" "}
                                      <span>
                                        Completed{" "}
                                        <img
                                          src="images/inner-page/complete-check-icon.svg"
                                          alt=""
                                        />
                                      </span>
                                    </p>
                                    {/* <!-- <div className="add-progress">
                     
                      <p className="right"><img src="images/inner-page/in-progress.svg" alt="">In Progress</p>
                    </div> --> */}
                                  </div>

                                  <p className="sub-cate">
                                    Nov 19, 2026 • 10:30 AM
                                  </p>
                                  <p className="service-cost">
                                    Amount :<span>$149</span>
                                  </p>
                                  <p className="sub-cate">Services Selected</p>
                                  <div className="service-list-type">
                                    <ol className="main-category">
                                      <li>Sink Installation</li>
                                      <li>Toilet Blockage</li>
                                    </ol>
                                    <ol className="main-category booking">
                                      {/* <!-- <li className="more-service">+ 1 more service</li> --> */}

                                      <div className="service-data">
                                        <ol className="main-category">
                                          <li>Sink Installation</li>
                                          <li>Toilet Blockage</li>
                                        </ol>
                                      </div>
                                      <li className="less-service">
                                        Less service
                                      </li>
                                    </ol>

                                    <div className="service-quotes my-booking">
                                      {/* <!-- <p className="service-cost">Cost:<span>$149</span></p> --> */}
                                      <div className="home-quotes-cta">
                                        {/* <!-- <button className="reject-btn">Cancel</button> --> */}
                                        <button
                                          className="primary-cta rgt"
                                          data-bs-target="#rescheduleRequest"
                                          data-bs-toggle="modal"
                                        >
                                          <img
                                            src="images/inner-page/download-icon.svg"
                                            className="img-left"
                                            alt=""
                                          />{" "}
                                          Download Invoice
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className="tab-pane fade"
                          id="customTabs-contact"
                          role="tabpanel"
                          aria-labelledby="customTabs-cancelled-tab"
                        >
                          <div className="my-inner-boking-top">
                            <div className="my-quotes-inner">
                              <div className="my-booking-wrpper">
                                <div className="booking-left-img">
                                  <img
                                    src="images/inner-page/cleaning.svg"
                                    alt=""
                                  />
                                </div>
                                <div className="plumbing">
                                  <div className="plumbing-top">
                                    <p className="plm cmp">
                                      Cleaning
                                      <img
                                        src="images/home/up-right-arrow.svg"
                                        alt=""
                                      />{" "}
                                      <span>
                                        Cancelled{" "}
                                        <img
                                          src="images/inner-page/delete-icon-can.svg"
                                          alt=""
                                        />
                                      </span>
                                    </p>
                                    <div className="add-progress">
                                      {/* <!-- <p className="right"><img src="images/inner-page/in-progress.svg" alt="">In Progress</p> --> */}
                                    </div>
                                  </div>
                                  <p className="months">
                                    Nov 19, 2026 • 10:30 AM
                                  </p>
                                  <p className="service-cost">
                                    Amount :<span>$0</span>
                                  </p>
                                  <p className="sub-cate">Services Selected</p>

                                  <div className="service-list-type">
                                    <ol className="main-category">
                                      <li>Floor Cleaning</li>
                                    </ol>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <ServiceAccepted />
      <ServiceRejected />
      <ContractorRequest />
      <RescheduleRequestSubmit />
      <PaymentRemainingPopup />
      <CancelBooking />
      <ConfirmCancelBooking />
      <RateContractorPopup />
      <NewServiceRejectionModal />
    </>
  );
}
