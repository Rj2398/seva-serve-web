"use client";

import { globalServerRequest } from "@/actions/globalApi";
import CancelBooking from "@/components/modals/bookingmodals/CancelBooking";
import ConfirmCancelBooking from "@/components/modals/bookingmodals/ConfirmCancelBooking";
import ContractorRequest from "@/components/modals/bookingmodals/ContractorRequest";
import DatePopup, {
  ReschedulePayload,
} from "@/components/modals/bookingmodals/DatePopup";
import NewServiceRejectionModal from "@/components/modals/bookingmodals/NewServiceRejectionModal";
import PaymentRemainingPopup from "@/components/modals/bookingmodals/PaymentRemainingPopup";
import RateContractorPopup from "@/components/modals/bookingmodals/RateContractorPopup";
import RescheduleRequestSubmit from "@/components/modals/bookingmodals/RescheduleRequestSubmit";
import ServiceAccepted from "@/components/modals/bookingmodals/ServiceAccepted";
import ServiceRejected from "@/components/modals/bookingmodals/ServiceRejected";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  // Time remaining until booking
  const remainingTime = bookingDate.getTime() - now;

  // Allow only if at least 24 hours remain
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
  const router = useRouter();
  // console.log("initialBookingData", initialBookingData)
  const [myBookingData, setMyBookingData] = useState<any>(initialBookingData);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [bookingId, setbookingId] = useState<number | null>(null);
  const [showCancle, setShowCancle] = useState<boolean>(false);
  const [selectedBookingData, setSelectedBookingData] = useState<any>(null)

  const [quote_id, setQuoteId] = useState<any>();
  const [bookingPaymentInfo, setBookingPaymentInfo] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

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
        toast.success("Booking rescheduled successfully!");
        setShowDatePicker(false);
      }
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      toast.error("Failed to reschedule booking. Please try again.");
    }
  };


  const handleCancleBooking = async (data) => {
    console.log("data on cnacle click in booking", data)
  }

  const fetchBookingData = async (page: number) => {
    try {
      setLoading(true);

      const response = await globalServerRequest({
        endpoint: "booking",
        method: "POST",
        payload: {
          type: activeTab,
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
          [activeTab]: {
            bookings:
              page === 1
                ? newBookings
                : [...(prev[activeTab]?.bookings || []), ...newBookings],
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
    fetchBookingData(1);
  }, [activeTab]);

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
                                    setActiveTab(item.toLowerCase()); // ya previous/cancelled
                                    setPageNo(1);
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
                          {booking?.length > 0 ? (
                            booking?.map((item: any, index: number) => (
                              <div
                                className="my-inner-boking-top"
                                key={item?.bookingId || index}
                              >
                                <div className="my-quotes-inner">
                                  <div className="my-booking-wrpper">
                                    <div className="booking-left-img">
                                      <img
                                        src={item?.categoryImageUrl || ""}
                                        alt=""

                                      />
                                    </div>
                                    <div className="plumbing">
                                      <div className="plumbing-top">
                                        {item?.status == "completed" && (
                                          <p className="plm cmp">
                                            {item?.categoryName}
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

                                        {item?.status ==
                                          "contractor_cancel" && (
                                            <p className="plm cmp">
                                              {item?.categoryName}
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

                                      {item?.status == "upcoming" ||
                                        item?.status == "ongoing" ? (
                                        <div className="plumbing-top">
                                          <p className="plm">
                                            {item?.categoryName}
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
                                              {item?.status}
                                            </p>
                                          </div>
                                        </div>
                                      ) : (
                                        ""
                                      )}

                                      <p className="sub-cate">
                                        {
                                          item?.bookingDateTime ? (
                                            <>
                                              {`${new Date(item.bookingDateTime).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                              })} • ${new Date(item.bookingDateTime).toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              })}`}
                                            </>
                                          ) : (
                                            "-"
                                          )
                                        }
                                        {/* {item.booking_time} */}
                                      </p>
                                      {(item?.status === "contractor_cancel" ||
                                        item?.status == "completed") && (
                                          <p className="service-cost">
                                            Amount :
                                            <span>
                                              {`$ ${item?.payment.totalAmount}` ||
                                                "$0"}
                                            </span>
                                          </p>
                                        )}
                                      <p className="sub-cate">
                                        Services Selected
                                      </p>

                                      <div className="service-list-type">
                                        {/* <ol className="main-category">
                                          {item?.services?.map(
                                            (
                                              service: string,
                                              index: number
                                            ) => (
                                              <li key={index}>{service}</li>
                                            )
                                          )}
                                        </ol> */}

                                        <ol className="main-category">
                                          {item?.services?.map(
                                            (service: any, index: number) => (
                                              <li key={index}>
                                                {service?.name ||
                                                  service?.serviceName ||
                                                  "Service"}
                                              </li>
                                            )
                                          )}
                                        </ol>

                                        {/* {item?.status === "upcoming" ||
                                          (item?.status === "completed" && (
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
                                          ))} */}

                                        <div className="service-quotes">
                                          {(item?.status === "upcoming" ||
                                            item?.status == "ongoing") && (
                                              <p className="service-cost">
                                                Amount :
                                                <span>
                                                  {`$ ${item?.payment?.totalAmount}` ||
                                                    "$0"}
                                                </span>
                                              </p>
                                            )}
                                          {item?.reschedule_request !== null
                                            ? (
                                              item?.status === "ongoing" && (
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
                                                    onClick={() =>
                                                      setSelectedBooking(item)
                                                    }
                                                  >
                                                    View Contractor Request
                                                  </button>
                                                </div>
                                              )
                                            ) : item?.status === "upcoming" ? (
                                              <div className="service-quotes my-booking">
                                                <div className="home-quotes-cta">
                                                  <button
                                                    className="reject-btn"
                                                    // data-bs-target="#cancelBookingPopup"
                                                    // data-bs-toggle="modal"
                                                    onClick={() => {
                                                      setSelectedBookingData(item)
                                                      setShowCancle(true)
                                                    }}
                                                  >
                                                    Cancel
                                                  </button>
                                                  {canReschedule(
                                                    item?.bookingDateTime
                                                  ) ? (
                                                    <button
                                                      className="primary-cta rgt"
                                                      onClick={() => {
                                                        setShowDatePicker(true),
                                                          setbookingId(
                                                            item?.bookingId
                                                          );
                                                        setQuoteId(item?.quoteId);
                                                      }}
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
                                              item?.status === "ongoing" && (
                                                <div className="home-quotes-cta">
                                                  <button
                                                    className="reject-btn"
                                                    // data-bs-target="#cancelBookingPopup"
                                                    // data-bs-toggle="modal"
                                                    onClick={() => {
                                                      setSelectedBookingData(item)
                                                      setShowCancle(true)
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
                                          item?.status === "completed" && (
                                            <div className="service-quotes my-booking">
                                              {/* <!-- <p className="service-cost">Cost:<span>$149</span></p> --> */}
                                              <div className="home-quotes-cta">
                                                <button
                                                  className="reject-btn"
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#rate-contractor-popup"
                                                  onClick={() => {
                                                    setbookingId(
                                                      item?.bookingId
                                                    );
                                                    setQuoteId(item?.quoteId);
                                                  }}
                                                >
                                                  Add Feedback
                                                </button>
                                                <a
                                                  href="#pay-remaining-popup"
                                                  data-bs-toggle="modal"
                                                  className="primary-cta rgt"
                                                  onClick={() => {
                                                    setbookingId(
                                                      item?.bookingId
                                                    ),
                                                      setBookingPaymentInfo(
                                                        item?.payment
                                                      );
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
                                          item?.status == "completed" && (
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
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p
                              className="no-data"
                              style={{ textAlign: "center" }}
                            >
                              No Booking Data Available
                            </p>
                          )}
                          {showLoadMore && hasMore && (
                            <div className="text-center mt-4 mb-2">
                              <button
                                type="button"
                                onClick={() => {
                                  // setShowLoadMore(false);
                                  const nextPage = pageNo + 1;
                                  setPageNo(nextPage);
                                  fetchBookingData(nextPage);
                                }}
                                disabled={loading}
                                style={{
                                  borderRadius: "20px",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  padding: "8px 24px",
                                  border: "1px solid var(--primary-color)",
                                  background: "transparent",
                                  // color: "var(--primary-color)",
                                  transition: "all 0.2s ease-in-out",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  outline: "none",
                                  backgroundColor: btnHover ? "var(--primary-color)" : "transparent",
                                  color: btnHover ? "var(--white)" : "var(--primary-color)"
                                }}
                                onMouseEnter={(e) => {
                                  setBtnHover(true);
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "transparent";
                                  e.currentTarget.style.color = "var(--primary-color)";
                                }}
                              >
                                {loading ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                      aria-hidden="true"
                                      style={{ width: "12px", height: "12px" }}
                                    ></span>
                                    Loading...
                                  </>
                                ) : (
                                  "Load More"
                                )}
                              </button>
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
      <DatePopup
        isOpen={showDatePicker}
        setIsOpen={setShowDatePicker}
        onConfirm={handleRescheduleBooking}
      />

      {/* <ServiceAccepted  />
      <ServiceRejected /> */}
      <ContractorRequest booking={selectedBooking} />
      <RescheduleRequestSubmit />
      <PaymentRemainingPopup
        bookingPaymentInfo={bookingPaymentInfo}
        bookingId={bookingId !== null ? String(bookingId) : ""}
        quote_id={quote_id}
      />
      {/* <CancelBooking
        isOpen={showCancle}
        setIsOpen={setShowCancle}
        onConfirm={handleCancleBooking}
        bookingData={selectedBookingData}
      /> */}

      <CancelBooking
        isOpen={showCancle}
        setIsOpen={setShowCancle}
        onReschedule={() => {
          setShowCancle(false);
          setShowDatePicker(true);
        }}
      />

      <ConfirmCancelBooking />
      <RateContractorPopup bookingId={bookingId} />
      {/* <NewServiceRejectionModal /> */}
    </>
  );
}
