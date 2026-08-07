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
  const [expandedQuotes, setExpandedQuotes] = useState<Record<number, boolean>>(
    {}
  );
  const [isServicesOpen, setIsServicesOpen] = useState(false);


  useEffect(() => {
    const hasPendingRequest = bookingData?.additionalServices?.added_services?.some(
      (service: any) => service?.status === "request"
    );

    if (!hasPendingRequest) return;

    const timer = setTimeout(() => {
      const modalElement = document.getElementById("reviewAdditional");
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [bookingData]); // bookingData ko dependency mein zaroor dalein

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
    if (datePart == 'invalide' || timePart == 'invalide') return '-'
    return `${datePart} — ${timePart}`;
  };

  console.log(bookingData?.additionalServices, "bookingData");
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

                    {
                      bookingData !== null ? (
                        <>
                          {bookingData?.lateAlert?.isRunningLate && (
                            <div className="runing-late">

                              <div className="left-data-traking"  >
                                <div className="clock-runing-icon" onClick={() => router.back()}>
                                  <img src="images/clock-icon.svg" alt="" />
                                </div>

                                <div className="contract-left-text">
                                  <h3>Your contractor is running late</h3>
                                  <p>They've requested to push your booking by <span className="hours">{bookingData?.lateAlert?.delayDuration}</span>.</p>
                                </div>
                              </div>

                              <Link href={`/booking-update?bookingId=${bookingData?.bookingId}&late_alert_id=${bookingData?.late_alert_id}`} className="right-arrow-runing">
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
                              <p className="bold-text">{formatScheduleTime(bookingData?.scheduledDateTime) || "-"}</p>
                              <p className="normal-text">Selected Category</p>
                              <p className="bold-text">
                                {bookingData?.category?.categoryName}
                              </p>
                              <p className="sub-cate">Selected sub categories </p>
                              {/* <div className="service-list-type">
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
                                </ol>
                              </div> */}
                              <div className="service-list-type">
                                {/* 1. Main Subcategories List (Numbered: 1, 2, 3...) */}
                                {/* <ol className="main-category">
                                  {bookingData?.bookingcategory?.map((cat: any) => (
                                    <li key={cat.id} className="category-item">
                                      <span className="bold-text">{cat.name}</span>
                                      {cat.services?.length > 0 && (
                                        <ul className="service-list" style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                                          {cat.services.map((service: any) => (
                                            <li key={service.id} className="service-item">
                                              <span>{service.name || service.detail}</span>
                                              {service.issues?.length > 0 && (
                                                <ul className="issue-list" style={{ listStyleType: "none", paddingLeft: "15px" }}>
                                                  {service.issues.map((issue: any) => (
                                                    <li key={issue.id} className="issue-item">
                                                      {issue.name}
                                                    </li>
                                                  ))}
                                                </ul>
                                              )}
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </li>
                                  ))}
                                </ol> */}

                                {(() => {
                                  return (
                                    <>
                                      <ol className="main-category">
                                        {(() => {
                                          const categories = bookingData?.bookingcategory || [];
                                          const bookingId = bookingData?.id || bookingData?.bookingId || 0;
                                          const isServicesOpen = !!expandedQuotes[bookingId];
                                          const renderCategory = (cat: any) => (
                                            <li key={cat.id} className="category-item">
                                              <span className="bold-text">{cat.name}</span>
                                              {cat.services?.length > 0 && (
                                                <ul className="service-list">
                                                  {cat.services.map((service: any) => (
                                                    <li key={service.id} className="service-item">
                                                      <span>{service.name || service.detail}</span>
                                                      {service.issues?.length > 0 && (
                                                        <ul className="issue-list">
                                                          {service.issues.map((issue: any) => (
                                                            <li key={issue.id} className="issue-item">
                                                              {issue.name}
                                                            </li>
                                                          ))}
                                                        </ul>
                                                      )}
                                                      <p className="normal-text" style={{ marginTop: "15px" }}>
                                                        Problem Description
                                                      </p>
                                                      <span>{service.description || "N/A"}</span>
                                                    </li>
                                                  ))}
                                                </ul>
                                              )}
                                            </li>
                                          );
                                          return (
                                            <>
                                              {categories.slice(0, 1).map(renderCategory)}
                                              {categories.length > 1 && (
                                                <>
                                                  {!isServicesOpen && (
                                                    <li
                                                      className="more-service"
                                                      style={{
                                                        cursor: "pointer",
                                                        listStyleType: "none",
                                                        marginLeft: "-20px",
                                                      }}
                                                      onClick={() =>
                                                        setExpandedQuotes((prev) => ({
                                                          ...prev,
                                                          [bookingId]: true,
                                                        }))
                                                      }
                                                    >
                                                      + {categories.length - 1} more sub categories
                                                    </li>
                                                  )}
                                                  {isServicesOpen && (
                                                    <>
                                                      {categories.slice(1).map(renderCategory)}
                                                      <li
                                                        style={{
                                                          cursor: "pointer",
                                                          fontWeight: "bold",
                                                          listStyleType: "none",
                                                          marginLeft: "-20px",
                                                          marginTop: "10px",
                                                        }}
                                                        onClick={() =>
                                                          setExpandedQuotes((prev) => ({
                                                            ...prev,
                                                            [bookingId]: false, 
                                                          }))
                                                        }
                                                      >
                                                        Less sub categories
                                                      </li>
                                                    </>
                                                  )}
                                                </>
                                              )}
                                            </>
                                          );
                                        })()}
                                      </ol>
                                    </>
                                  );
                                })()}
                              </div>

                            </div>
                          </div>

                          {bookingData?.additionalServices?.added_services && bookingData?.additionalServices?.added_services?.length > 0 && (
                            <div className="additional-services-wrp">
                              {bookingData?.additionalServices?.added_services?.map((service: any) => (
                                <div
                                  className="additional-services-in"
                                  key={service?.serviceId}
                                >
                                  <h3>
                                    Additional Services{" "}
                                    {/* <span
                                className={`tag ${service?.status === "rejected" ? "rejected" : ""}`}
                              > */}
                                    <span
                                      className={`tag ${service?.status === "request"
                                        ? "add-progress"
                                        : service?.status === "rejected"
                                          ? "rejected"
                                          : ""
                                        }`}
                                    >
                                      {service?.status === "request" ? "Pending from admin" : service?.status === "approve" ? "Accepted" : "Rejected"}
                                    </span>
                                  </h3>
                                  <p>{service?.description}</p>
                                  {/* <p>ETA: {service?.etaHours} hours</p> */}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="cost-details-wrp">
                            <h4>Booking Cost Details</h4>
                            {/* */}
                            <div className="cost-details-in">
                              <p>
                                Deposit / Deductible Amount
                                <span>${bookingData?.bookingCostDetails?.depositAmount}</span>
                              </p>
                              <div className="additional-services">
                                {
                                  bookingData?.isAdditionalService && (
                                    bookingData?.additionalServices && (
                                      <>
                                        {/* Main Dropdown Toggle Button */}
                                        <div className="drop-down-toggle">
                                          <p
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
                                          </p>
                                        </div>
                                        {/* Main Dropdown Body */}
                                        <div
                                          className="dropdown-cost-box"
                                          id="costDropdown"
                                          style={{ display: showDropdown ? "block" : "none" }}
                                        >
                                          {/* 1. Combined Material Cost & Single Receipts Dropdown */}
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
                                              <span>${bookingData?.additionalServices?.total_material_cost || 0}</span>
                                            </div>

                                            <div
                                              className="nested-dropdown-menu"
                                              style={{ display: showMaterialDropdown ? "block" : "none" }}
                                            >
                                              <ul>
                                                <li>
                                                  <span className="header">Material Receipt</span>
                                                </li>

                                                {/* Sare added_services me se saare receipt_media ko ek single flat list me convert kiya */}
                                                {(() => {
                                                  const allReceipts =
                                                    bookingData?.additionalServices?.added_services?.flatMap(
                                                      (service: any) => service?.receipt_media || []
                                                    ) || [];

                                                  return allReceipts.length > 0 ? (
                                                    allReceipts.map((url: string, index: number) => (
                                                      <li key={index}>
                                                        <span>Receipt {String(index + 1).padStart(2, "0")}</span>
                                                        <button
                                                          type="button"
                                                          onClick={() => window.open(url, "_blank")}
                                                        >
                                                          <img
                                                            src="images/inner-page/download-icon-drop.svg"
                                                            alt="Download"
                                                          />
                                                        </button>
                                                      </li>
                                                    ))
                                                  ) : (
                                                    <li>
                                                      <span>No receipts available</span>
                                                    </li>
                                                  );
                                                })()}
                                              </ul>
                                            </div>
                                          </div>
                                          {/* 2. Total Labour Cost Row */}
                                          <p style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                                            Labour Cost
                                            <span>${bookingData?.additionalServices?.total_labour_cost || 0}</span>
                                          </p>
                                        </div>
                                      </>
                                    )
                                  )
                                }
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
                        </>
                      ) : (
                        <div className="runing-late text-center">
                          <div className="cost-details-in">No booking data available.</div>
                        </div>
                      )}
                    {
                      (bookingData?.serviceStatus?.currentStep === 4 && bookingData?.is_paid === false) && <div className="progress-btn-rgt">
                        <button type="button" className="primary-cta" data-bs-target="#serviceCompleted" data-bs-toggle="modal">Pay Now <span>${bookingData?.bookingCostDetails?.totalCost}</span></button>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <CompletedService bookingTrackingData={bookingData?.bookingCostDetails} bookingId={bookingData?.bookingId} />
      <ReviewAdditionalServices bookingId={bookingData?.bookingId} />
    </>
  )
}

export default ViewBookingDetail