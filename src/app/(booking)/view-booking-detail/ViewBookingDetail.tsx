"use client";
import CompletedService from '@/components/modals/bookingmodals/CompletedService'
import ReviewAdditionalServices from '@/components/modals/bookingmodals/ReviewAdditionalServices'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'

interface BookingUpdateProps {
  bookingData?: any;
}

const ViewBookingDetail = ({ bookingData }: BookingUpdateProps) => {
  console.log(bookingData, "bookingtrackingData")

  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMaterialDropdown, setShowMaterialDropdown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const modalElement = document.getElementById("reviewAdditional");
      if (bookingData?.isAdditionalService) {
        if (modalElement) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const formatScheduleTime = (date: string) => {
    const d = new Date(date);
    const datePart = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const timePart = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${datePart} — ${timePart}`;
  };

  console.log(formatScheduleTime("2026-07-16T02:00:00+05:30"));
  // Jul 16, 2026 — 2:00 AM

  //   const toggleCostDropdown = () => {
  //   document.getElementById("costDropdown")?.classList.toggle("show");
  // };
  return (
    <>
      {/* Tiny style patch to handle standard icon rotation animations matching state */}
      <style dangerouslySetInnerHTML={{
        __html: `
         .rotate-icon {
           transform: rotate(180deg);
           transition: transform 0.2s ease;
         }
         .dropdown-toggle-cost img, .nested-toggle img {
           transition: transform 0.2s ease;
         }
       `}} />

      <main>
        <div className="container home-wraper my-profile" style={{ height: "auto" }}>

          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="browse-wrp">
                    <div className="browse-ctg-head my-con-head">
                      <h2 className="sub-cate-page">
                        <Link href="/booking"><img src="images/home/left-arrow.svg" alt="" /></Link>
                        Booking Tracking
                      </h2>
                      <Link href="/help-support" className="hel-cta"><i className="fa-regular fa-circle-question"></i> Help & Support</Link>
                    </div>
                    {bookingData?.lateAlert != null && (
                      <div className="runing-late">

                        <div className="left-data-traking"  >
                          <div className="clock-runing-icon" onClick={() => router.back()}>
                            <img src="images/clock-icon.svg" alt="" />
                          </div>

                          <div className="contract-left-text">
                            <h3>Your contractor is running late</h3>
                            <p>They've requested to push your booking by <span className="hours">1h</span>.</p>
                          </div>
                        </div>

                        <Link href="/booking-update" className="right-arrow-runing">
                          <img src="images/right-arrow.svg" alt="" />
                        </Link>

                      </div>)}
                    {/* */}
                    {bookingData?.serviceStatus && (
                      <div className="service-status-wrp">
                        <h4>Service Status</h4>
                        <div className="service-status-inner">
                          {bookingData.serviceStatus.steps.map((step: any, index: number) => {
                            const isChecked = step.state === "completed" || step.state === "active";

                            const getStepImage = (stepKey: string) => {
                              switch (stepKey) {
                                case 'on_the_way': return "images/service-status/on-way.svg";
                                case 'work_in_progress': return "images/service-status/start-job.svg";
                                case 'completed': return "images/service-status/completed.svg";
                                default: return null;
                              }
                            };

                            const mainImg = getStepImage(step.stepKey);
                            const isLineFilled = isChecked;

                            return (
                              <React.Fragment key={step?.stepNumber}>
                                <div className={`service-status-item step-${step?.stepNumber} ${isChecked ? 'check' : ''}`}>
                                  {mainImg && <img src={mainImg} alt="" />}
                                  {isChecked && <img src="images/service-status/check.svg" className="check-image" alt="" />}
                                  <h5>STEP {step?.stepNumber}</h5>
                                  <p>{step?.label}</p>
                                </div>

                                {index < bookingData?.serviceStatus?.steps?.length - 1 && (
                                  <div className={`progress-line ${isLineFilled ? 'step-fill' : ''}`}></div>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="plumbing-wrp-book">
                      <div className="boking-right-img">
                        <img src={bookingData?.category?.categoryImageUrl || "images/inner-page/booking-traking-img.svg"} alt="" />
                      </div>
                      <div className="plumbing">
                        <p className="normal-text">Scheduled Time</p>
                        <p className="bold-text">{formatScheduleTime(bookingData?.scheduledDateTime)}</p>
                        <p className="normal-text">Selected Category</p>
                        <p className="bold-text">
                          {bookingData?.category?.categoryName}
                        </p>
                        <p className="sub-cate">Selected sub categories </p>
                        <div className="service-list-type">
                          <ol className="main-category">
                            {bookingData?.subcategory?.subcategoryName && (
                              <li>
                                {bookingData?.subcategory?.subcategoryName}
                              </li>
                            )}
                          </ol>
                          <p className="normal-text">Problem Description</p>
                          <p className="light-text">{bookingData?.problemDescription || "N/A"}</p>
                          <ol className="main-category" start={2}>
                            {/* */}
                            {/* */}
                          </ol>
                        </div>
                      </div>
                    </div>

                    {/* <div className="additional-services-wrp">
                      <div className="additional-services-in">
                        <h3>Additional Services <span className="tag">Accepted</span></h3>
                        <p>Undermount / Vessel Sink Setup</p>
                      </div>
                      <div className="additional-services-in">
                        <h3>Additional Services <span className="tag rejected">Rejected</span></h3>
                        <p>Undermount / Vessel Sink Setup</p>
                      </div>
                    </div> */}

                    {/* */}
                    {bookingData?.additionalServices && bookingData?.additionalServices?.length > 0 && (
                      <div className="additional-services-wrp">
                        {bookingData?.additionalServices?.map((service: any) => (
                          <div
                            className="additional-services-in"
                            key={service?.serviceId}
                          >
                            <h3>
                              Additional Services{" "}
                              <span
                                className={`tag ${service?.approvalStatus === "rejected" ? "rejected" : ""}`}
                              >
                                {service?.approvalStatus}
                              </span>
                            </h3>
                            <p>{service?.serviceName}</p>
                            <p>ETA: {service?.etaHours} hours</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* */}
                    {/* <div className="cost-details-wrp">
                    <h4>Booking Cost Details</h4>
                    <div className="cost-details-in">
                      <p>Deposit / Deductible Amount <span>$10</span></p>
                      <p>Remaining Cost <span>$10</span></p>
                      <hr/>
                      <p  data-bs-target="#reviewAdditional" data-bs-toggle="modal">Total Cost <span><b>$80</b></span></p>
                    </div>
                  </div> */}

                    <div className="cost-details-wrp">
                      <h4>Booking Cost Details</h4>
                      {/* */}
                      <div className="cost-details-in">
                        <p>
                          Deposit / Deductible Amount
                          <span>${bookingData?.bookingCostDetails?.depositAmount}</span>
                        </p>

                        {/* */}
                        <div className="additional-services">

                          {/* */}
                          <div className="drop-down-toggle">
                            
                            {/* <p
                              className="dropdown-toggle-cost"
                              style={{ cursor: "pointer" }}
                              onClick={() => setShowDropdown(!showDropdown)}
                            >
                              Additional Services Cost
                              <img
                                src="images/header/down-icon.svg"
                                alt=""
                                className={showDropdown ? "rotate-icon" : ""}
                              />
                            </p> */}

                            {/* <span>$20</span> */}
                          </div>
                          {/* <div
                            className="dropdown-cost-box"
                            id="costDropdown"
                            style={{ display: showDropdown ? "block" : "none" }}
                          >
                            <div className="nested-dropdown">

                              <div
                                className="nested-toggle"
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowMaterialDropdown(!showMaterialDropdown)}
                              >
                                <p>
                                  Material Cost
                                  <img
                                    src="images/header/down-icon.svg"
                                    alt=""
                                    className={showMaterialDropdown ? "rotate-icon" : ""}
                                  />
                                </p>

                                <span>$05</span>
                              </div>
                              <div
                                className="nested-dropdown-menu"
                                style={{ display: showMaterialDropdown ? "block" : "none" }}
                              >
                                <ul>
                                  <li>
                                    <span className="header">Material Receipt</span>

                                  </li>

                                  <li>
                                    <span>Receipt 01</span>
                                    <button>
                                      <img src="images/inner-page/download-icon-drop.svg" alt="" />
                                    </button>
                                  </li>

                                  <li>
                                    <span>Receipt 02</span>
                                    <button>
                                      <img src="images/inner-page/download-icon-drop.svg" alt="" />
                                    </button>
                                  </li>

                                  <li>
                                    <span>Receipt 03</span>
                                    <button>
                                      <img src="images/inner-page/download-icon-drop.svg" alt="" />
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <p>
                              Labour Cost
                              <span>$02</span>
                            </p>

                          </div> */}
                        </div>

                        <p>
                          Remaining Cost
                          <span>${bookingData?.bookingCostDetails?.remainingCost}</span>
                        </p>
                        <hr />
                        <p
                        //  data-bs-target="#reviewAdditional" data-bs-toggle="modal"
                        >
                          Total Cost
                          <span><b>${bookingData?.bookingCostDetails?.totalCost}</b></span>
                        </p>
                      </div>
                    </div>
                    {bookingData?.serviceStatus?.currentStep === 4 && <div className="progress-btn-rgt">
                      <button type="button" className="primary-cta" data-bs-target="#serviceCompleted" data-bs-toggle="modal">Pay Now <span>${bookingData?.bookingCostDetails?.totalCost}</span></button>
                    </div>}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <CompletedService bookingTrackingData={bookingData?.bookingCostDetails} bookingId={bookingData?.bookingId} />
      <ReviewAdditionalServices />
    </>
  )
}

export default ViewBookingDetail