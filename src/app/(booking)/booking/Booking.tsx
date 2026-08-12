"use client";
import { globalServerRequest } from "@/actions/globalApi";
import CancelBooking from "@/components/modals/bookingmodals/CancelBooking";
import ConfirmCancelBooking from "@/components/modals/bookingmodals/ConfirmCancelBooking";
import ContractorRequest from "@/components/modals/bookingmodals/ContractorRequest";
import DatePopup, {
  ReschedulePayload,
} from "@/components/modals/bookingmodals/DatePopup";
import PaymentRemainingPopup from "@/components/modals/bookingmodals/PaymentRemainingPopup";
import RateContractorPopup from "@/components/modals/bookingmodals/RateContractorPopup";
import RescheduleRequestSubmit from "@/components/modals/bookingmodals/RescheduleRequestSubmit";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

const canReschedule = (
  bookingDateTime: string | Date | null | undefined
): boolean => {
  if (!bookingDateTime) return false;

  const bookingDate = new Date(bookingDateTime);

  if (isNaN(bookingDate.getTime())) {
    return false;
  }
  const now = Date.now();
  const remainingTime = bookingDate.getTime() - now;
  return remainingTime >= 24 * 60 * 60 * 1000;
};

interface BookingProps {
  initialBookingData?: {
    upcoming: any[];
    previous: any[];
    cancelled: any[];
  };
}

export default function Booking({ initialBookingData }: BookingProps) {
  const [myBookingData, setMyBookingData] = useState<any>(initialBookingData);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [bookingId, setbookingId] = useState<number | null>(null);
  const [showCancle, setShowCancle] = useState<boolean>(false);
  const [selectedBookingData, setSelectedBookingData] = useState<any>(null)

  const [expandedQuotes, setExpandedQuotes] = useState<Record<number, boolean>>(
    {}
  );

  const [quote_id, setQuoteId] = useState<any>();
  const [bookingPaymentInfo, setBookingPaymentInfo] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  console.log("myBookingData", myBookingData);

  const bookingData = myBookingData?.[activeTab] || [];
  const booking = bookingData?.bookings;
  const services = booking?.services;
  console.log("booking leatest", booking);
  console.log("services", services);

  const handleRescheduleBooking = async (payload: ReschedulePayload) => {
    try {
      console.log("onConform", payload);
      console.log("bookingId", bookingId);

      const [response] = await Promise.all([
        globalServerRequest({
          endpoint: `booking/reschedule`,
          method: "POST",
          payload: {
            bookingId: bookingId,
            addressId: payload.address,
            availabilitySlots: payload.availabilitySlots,
          },
        }),
      ]);

      if (response?.success) {
        await fetchBookingData(1);
        toast.success("Booking rescheduled successfully!");
        setShowDatePicker(false);
      }
      const modalElement = document.getElementById("select-date-time-popup") || document.getElementById("#select-date-time-popup");
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.hide();
      }
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      toast.error("Failed to reschedule booking. Please try again.");
    }
  };

  const handleContractorRequest = async () => {
    await fetchBookingData(1);
  }

  const handleCancel = async (reason: string) => {
    try {
      const response = await globalServerRequest({
        endpoint: `booking/cancel-booking`,
        method: "POST",
        payload: {
          booking_id: selectedBookingData?.bookingId,
          reason: reason,
        },
      });
      if (response?.success) {
        toast.success("Booking cancelled successfully!");
        setShowCancle(false);
        setSelectedBookingData(null);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    }
  }

  const fetchBookingData = async (page: number, currentTab: string = activeTab) => {
    try {
      setLoading(true);

      const response = await globalServerRequest({
        endpoint: "booking",
        method: "POST",
        payload: {
          type: currentTab,
          pageNo: page,
          limit: 2,
        },
      });

      if (response.success) {
        const data = response?.data?.data || {};
        const newBookings = data.bookings || [];
        const pagination = data.pagination;

        setMyBookingData((prev: any) => ({
          ...prev,
          [currentTab]: {
            bookings:
              page === 1
                ? newBookings
                : [...(prev[currentTab]?.bookings || []), ...newBookings],
            pagination,
          },
        }));

        if (pagination) {
          setHasMore(pagination?.hasNextPage ?? false);
          setShowLoadMore(pagination?.hasNextPage ?? false);
        } else {
          setHasMore(newBookings.length === 2);
          setShowLoadMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingData(pageNo, activeTab);
  }, [pageNo, activeTab]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPageNo((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    const currentTarget = observerTarget.current;
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading]);

  const handleLoadRescheduleRequest = async (item: any) => {
    try {
      console.log("item", item)
      setbookingId(item?.bookingId);
      setQuoteId(item?.quoteId);
      setShowDatePicker(true);

      setTimeout(() => {
        const modalElement = document.getElementById("select-date-time-popup");

        if (modalElement) {
          const bootstrap = (window as any).bootstrap;
          if (bootstrap) {
            const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
            modal.show();
          }
        } else {
          console.warn("Modal element '#select-date-time-popup' is not avilible in the DOM.");
        }
      }, 0);

    } catch (error) {
      console.error("Error loading reschedule request:", error);
    }
  };

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

                                  onClick={() => {
                                    setActiveTab(item.toLowerCase());
                                    setPageNo(1);
                                    setHasMore(false);
                                    setShowLoadMore(false);
                                    // fetchBookingData(1);
                                  }}
                                >
                                  {item}
                                </button>
                              </li>
                            )
                          )}
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
                          {booking && booking.length > 0 ? (
                            booking.map((item: any, index: number) => {
                              const isServicesOpen = !!expandedQuotes[index];
                              const isCompleted = item?.status === "completed";
                              const isCancelled = item?.status === "contractor_cancel" || item?.status === "customer_cancel";
                              const isUpcoming = item?.status === "upcoming";
                              const isOngoing = item?.status === "ongoing";
                              const isContractorReschedule =
                                item?.reschedule_request !== null &&
                                item?.reschedule_request?.requested_by === "contractor" &&
                                item?.reschedule_request?.is_requested === true
                              const isAccpectedDate = item?.reschedule_request !== null &&
                                item?.reschedule_request?.is_accepted_customer === true

                              const isGivenRating = Number(item?.rating) > 0;
                              const canRescheduleBooking = !item?.is_previous_rescheduled;

                              console.log("isContractorReschedule", isContractorReschedule)
                              console.log("isGivenRating", isGivenRating)
                              return (
                                <div
                                  className="my-inner-boking-top"
                                  key={item?.bookingId || index}
                                >
                                  <div className="my-quotes-inner">
                                    <div className="my-booking-wrpper">
                                      <div className="booking-left-img">
                                        <img
                                          src={item?.categoryImageUrl || ""}
                                          alt={item?.categoryName || "Category"}
                                        />
                                      </div>
                                      <div className="plumbing">
                                        {/* Header / Status Banner */}
                                        <div className="plumbing-top">
                                          {isCompleted && (
                                            <>
                                              <p className="plm cmp">
                                                {item?.categoryName}
                                                <img src="images/home/up-right-arrow.svg" alt="" />{" "}
                                                <span>
                                                  Completed{" "}
                                                  <img
                                                    src="images/inner-page/complete-check-icon.svg"
                                                    alt=""
                                                  />
                                                </span>
                                              </p>
                                              {
                                                item?.rating > 0 && (
                                                  <p className="right">
                                                    You rated
                                                    <img
                                                      src="images/inner-page/review_star.png"
                                                      // className="img-left"
                                                      alt=""
                                                      style={{
                                                        height: '14px',
                                                        width: "14px",
                                                        marginRight: '2px',
                                                        marginLeft: '8px',
                                                        marginBottom: '5px'
                                                      }}
                                                    />
                                                    {item?.rating}
                                                  </p>
                                                )
                                              }
                                            </>
                                          )}
                                        </div>
                                        {isCancelled && (
                                          <div className="plumbing-top">
                                            <p className="plm">
                                              {item?.categoryName}
                                              <img src="images/home/up-right-arrow.svg" alt="" />
                                            </p>
                                            <div className="add-progress">
                                              <p className="right">
                                                <img
                                                  src="images/inner-page/in-progress.svg"
                                                  alt=""
                                                />
                                                {item?.status}
                                              </p>
                                            </div>
                                          </div>
                                          // <p className="plm cmp">
                                          //   {item?.categoryName}
                                          //   <img src="images/home/up-right-arrow.svg" alt="" />{" "}
                                          //   <span>
                                          //     {/* Cancelled{" "} */}
                                          //     {item?.status}
                                          //     <img
                                          //       src="images/inner-page/delete-icon-can.svg"
                                          //       alt=""
                                          //     />
                                          //   </span>
                                          // </p>
                                        )}

                                        {(isUpcoming || isOngoing) && (
                                          <div className="plumbing-top">
                                            <p className="plm">
                                              {item?.categoryName}
                                              <img src="images/home/up-right-arrow.svg" alt="" />
                                            </p>
                                            <div className="add-progress">
                                              <p className="right">
                                                <img
                                                  src="images/inner-page/in-progress.svg"
                                                  alt=""
                                                />
                                                {item?.status}
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                        <p className="sub-cate">
                                          {item?.bookingDateTime ? (
                                            `${new Date(item.bookingDateTime).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                            })} • ${new Date(item.bookingDateTime).toLocaleTimeString("en-US", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              hour12: true,
                                            })}`
                                          ) : (
                                            "-"
                                          )}
                                        </p>
                                        {/* Amount display for finished/canceled jobs */}
                                        {(isCancelled || isCompleted) && (
                                          <p className="service-cost">
                                            Amount :
                                            <span>{`$ ${item?.payment?.totalAmount ?? 0}`}</span>
                                          </p>
                                        )}
                                        <p className="sub-cate">Selected Services</p>
                                        <div className="service-list-type">
                                          <ol className="main-category">
                                            {item?.services?.slice(0, 1).map((service: any, idx: number) => (
                                              <li key={`first-${idx}`}>
                                                {service?.name || service?.serviceName || "Service"}
                                              </li>
                                            ))}
                                            {item?.services?.length > 1 && (
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
                                                        [index]: true,
                                                      }))
                                                    }
                                                  >
                                                    + {item.services.length - 1} more services
                                                  </li>
                                                )}
                                                {isServicesOpen && (
                                                  <>
                                                    {item?.services?.slice(1).map((service: any, idx: number) => (
                                                      <li key={`more-${idx}`}>
                                                        {service?.name || service?.serviceName || "Service"}
                                                      </li>
                                                    ))}
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
                                                          [index]: false,
                                                        }))
                                                      }
                                                    >
                                                      Less services
                                                    </li>
                                                  </>
                                                )}
                                              </>
                                            )}
                                          </ol>
                                          <div className="service-quotes">
                                            {(isUpcoming || isOngoing) && (
                                              <p className="service-cost">
                                                Amount :
                                                <span>{`$ ${item?.payment?.totalAmount ?? 0}`}</span>
                                              </p>
                                            )}
                                            {isContractorReschedule ? (
                                              isUpcoming ? (
                                                isAccpectedDate ? (
                                                  <div className="service-quotes my-booking">
                                                    <div className="home-quotes-cta">
                                                      <button
                                                        className="reject-btn"
                                                        onClick={() => {
                                                          setSelectedBookingData(item);
                                                          setShowCancle(true);
                                                        }}
                                                      >
                                                        Cancel
                                                      </button>
                                                      <Link
                                                        href={`/view-booking-detail?bookingId=${item?.bookingId}`}
                                                        className="reject-btn"
                                                      >
                                                        View Details
                                                      </Link>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div className="home-quotes-cta">
                                                    <Link
                                                      href={`/view-booking-detail?bookingId=${item?.bookingId}`}
                                                      className="reject-btn"
                                                    >
                                                      View Details
                                                    </Link>
                                                    <button
                                                      className="primary-cta rgt"
                                                      data-bs-target="#contractorTime"
                                                      data-bs-toggle="modal"
                                                      onClick={() => setSelectedBooking(item)}
                                                    >
                                                      View Contractor Request
                                                    </button>
                                                  </div>
                                                )
                                              ) : (
                                                isOngoing && (
                                                  <div className="service-quotes my-booking">
                                                    <div className="home-quotes-cta">
                                                      <button
                                                        className="reject-btn"
                                                        onClick={() => {
                                                          setSelectedBookingData(item);
                                                          setShowCancle(true);
                                                        }}
                                                      >
                                                        Cancel
                                                      </button>
                                                      <Link
                                                        href={`/view-booking-detail?bookingId=${item?.bookingId}`}
                                                        className="reject-btn"
                                                      >
                                                        View Details
                                                      </Link>
                                                    </div>
                                                  </div>
                                                )
                                              )
                                            ) : isUpcoming ? (
                                              <div className="service-quotes my-booking">
                                                <div className="home-quotes-cta">
                                                  <button
                                                    className="reject-btn"
                                                    onClick={() => {
                                                      setSelectedBookingData(item);
                                                      setShowCancle(true);
                                                    }}
                                                  >
                                                    Cancel
                                                  </button>
                                                  {canReschedule(item?.bookingDateTime) ? (
                                                    <button
                                                      className="primary-cta rgt"
                                                      onClick={() =>
                                                        canRescheduleBooking ? handleLoadRescheduleRequest(item) : toast.error("You have already rescheduled this booking once. Further rescheduling is not allowed.")
                                                      }
                                                      disabled={!canRescheduleBooking}
                                                    >
                                                      <img
                                                        src="images/inner-page/clock-booking.svg"
                                                        className="img-left"
                                                        alt=""
                                                      />
                                                      Reschedule
                                                    </button>
                                                  ) : (
                                                    <Link
                                                      href={`/view-booking-detail?bookingId=${item?.bookingId}`}
                                                      className="reject-btn"
                                                    >
                                                      View Details
                                                    </Link>
                                                  )}
                                                </div>
                                              </div>
                                            ) : (
                                              isOngoing && (
                                                <div className="home-quotes-cta">
                                                  <button
                                                    className="reject-btn"
                                                    onClick={() => {
                                                      setSelectedBookingData(item);
                                                      setShowCancle(true);
                                                    }}
                                                  >
                                                    Cancel
                                                  </button>
                                                  <Link
                                                    href={`/view-booking-detail?bookingId=${item?.bookingId}`}
                                                    className="reject-btn"
                                                  >
                                                    View Details
                                                  </Link>
                                                </div>
                                              )
                                            )}
                                          </div>
                                          {item?.payment?.isPaid === false ? (
                                            isCompleted && (
                                              <div className="service-quotes my-booking">
                                                <div className="home-quotes-cta">
                                                  {
                                                    !isGivenRating && (
                                                      <button
                                                        className="reject-btn"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#rate-contractor-popup"
                                                        disabled={!isGivenRating}
                                                        onClick={() => {
                                                          setbookingId(item?.bookingId);
                                                          setQuoteId(item?.quoteId);
                                                        }}
                                                      >
                                                        Add Feedback
                                                      </button>
                                                    )
                                                  }
                                                  <a
                                                    href="#pay-remaining-popup"
                                                    data-bs-toggle="modal"
                                                    className="primary-cta rgt"
                                                    onClick={() => {
                                                      setbookingId(item?.bookingId);
                                                      setBookingPaymentInfo(item?.payment);
                                                      setQuoteId(item?.quoteId);
                                                    }}
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
                                            )
                                          ) : (
                                            isCompleted && (
                                              <div className="service-quotes my-booking">
                                                <div className="home-quotes-cta">
                                                  {
                                                    !isGivenRating && (
                                                      <button
                                                        className="reject-btn"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#rate-contractor-popup"
                                                        disabled={!isGivenRating}
                                                        onClick={() => {
                                                          setbookingId(item?.bookingId);
                                                          setQuoteId(item?.quoteId);
                                                        }}
                                                      >
                                                        Add Feedback
                                                      </button>
                                                    )
                                                  }
                                                  <button className="primary-cta rgt">
                                                    <img
                                                      src="images/inner-page/download-icon.svg"
                                                      className="img-left"
                                                      alt=""
                                                    />
                                                    Download Invoice
                                                  </button>
                                                </div>
                                              </div>
                                            )
                                          )}
                                          {
                                            isCancelled && (
                                              <div className="service-quotes my-booking">
                                                <div className="home-quotes-cta">
                                                  <button
                                                    className="reject-btn"
                                                    onClick={() => {
                                                      toast.error("Booking cancellation request is in review this action is not allowed at this moment.");
                                                    }}
                                                  >
                                                    Cancel
                                                  </button>
                                                  {canReschedule(item?.bookingDateTime) ? (
                                                    <button
                                                      className="primary-cta rgt"
                                                      onClick={() =>
                                                        toast.error("Booking cancellation request is in review this action is not allowed at this moment.")
                                                      }
                                                      disabled={!canRescheduleBooking}
                                                    >
                                                      <img
                                                        src="images/inner-page/clock-booking.svg"
                                                        className="img-left"
                                                        alt=""
                                                      />
                                                      Reschedule
                                                    </button>
                                                  ) : (
                                                    <Link
                                                      href={`/view-booking-detail?bookingId=${item?.bookingId}`}
                                                      className="reject-btn"
                                                    >
                                                      View Details
                                                    </Link>
                                                  )}
                                                </div>
                                              </div>
                                            )
                                          }
                                        </div>
                                      </div>

                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="no-data" style={{ textAlign: "center" }}>
                              No Booking Data Available
                            </p>
                          )}
                          {hasMore && (
                            <div ref={observerTarget} style={{ height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              {loading && <div className="spinner-border text-danger spinner-border-sm" role="status"><span className="visually-hidden">Loading...</span></div>}
                            </div>
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
                                      <div className="home-quotes-cta">
                                        <button
                                          className="primary-cta rgt"
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
          </section >
        </div >
      </main >
      <DatePopup
        isOpen={showDatePicker}
        setIsOpen={setShowDatePicker}
        onConfirm={handleRescheduleBooking}
      />
      <ContractorRequest booking={selectedBooking} onConfirm={handleContractorRequest} />
      <RescheduleRequestSubmit />
      <PaymentRemainingPopup
        bookingPaymentInfo={bookingPaymentInfo}
        bookingId={bookingId !== null ? String(bookingId) : ""}
        quote_id={quote_id}
      />
      <CancelBooking
        isOpen={showCancle}
        setIsOpen={setShowCancle}
        onCancel={handleCancel}
      />
      <ConfirmCancelBooking />
      <RateContractorPopup bookingId={bookingId} callBooking={() => fetchBookingData(1)} />
    </>
  );
}
