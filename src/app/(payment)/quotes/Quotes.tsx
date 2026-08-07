"use client";
import NewServiceRejectionModal from "@/components/modals/bookingmodals/NewServiceRejectionModal";
import ServiceAccepted from "@/components/modals/bookingmodals/ServiceAccepted";
import ServiceRejected from "@/components/modals/bookingmodals/ServiceRejected";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { globalServerRequest } from "@/actions/globalApi";
import Link from "next/link";
import toast from "react-hot-toast";
import CancelBooking from "@/components/modals/bookingmodals/CancelBooking";
import ConfirmCancelBooking from "@/components/modals/bookingmodals/ConfirmCancelBooking";

export default function Quotes() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const is_requested = searchParams.get("is_requested");
  const booking_id = searchParams.get('bookingId')
  const [activeTab, setActiveTab] = useState(is_requested === "1" ? "requested" : "received");
  const [quotes, setQuotes] = useState<any[]>([]);
  const [showCancle, setShowCancle] = useState<boolean>(false);
  const [selectedBookingData, setSelectedBookingData] = useState<any>(null)

  console.log(quotes, "quotes****************");

  // console.log("selectedBookingData", selectedBookingData)

  const observerTarget = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [limit, setLimit] = useState<number>(2);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [btnHover, setBtnHover] = useState(false);
  const [serviceId, setServiceId] = useState<string>("");
  const [additionalId, setAdditionalId] = useState<string>("");
  const [isAddactional, setIsAddactional] = useState<boolean>(false);

  const [expandService, setExpandService] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const response = await globalServerRequest({
          endpoint: `quotes/get-quote?bookingId=${booking_id}`,
          method: "POST",
          payload: { type: activeTab, pageNo, limit },
        });
        if (response.success) {
          const data = response?.data?.data?.quotes || response?.data?.data || response?.data || [];
          const pagination = response?.data?.data?.pagination;
          const newQuotes = Array.isArray(data) ? data : [];

          if (pageNo === 1) {
            setQuotes(newQuotes);
          } else {
            setQuotes(prev => [...prev, ...newQuotes]);
          }
          if (pagination) {
            setHasMore(pagination.has_next_page);
          } else {
            setHasMore(newQuotes.length === limit);
          }
        } else {
          if (pageNo === 1) setQuotes([]);
          setHasMore(false);
          // setShowLoadMore(false);
        }

      } catch (error) {
        console.error("Failed to fetch quotes:", error);
        if (pageNo === 1) setQuotes([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
    const handleQuoteUpdate = () => {
      fetchQuotes();
    }
    window.addEventListener("quoteUpdated", handleQuoteUpdate);
    return () => {
      window.removeEventListener("quoteUpdated", handleQuoteUpdate);
    };

  }, [activeTab, pageNo, limit, is_requested]);

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

  const [expandedQuotes, setExpandedQuotes] = useState<Record<number, boolean>>(
    {}
  );
  const [expandedAdditional, setExpandedAdditional] = useState<
    Record<number, boolean>
  >({});

  const handleReject = async (reason: string, isAddactional: boolean) => {
    console.log("reason", reason, "isAddactional", isAddactional, "  additionalId", additionalId)

    const updatedEndpoint = isAddactional ? `booking/approve-additional-servies-request` : `quotes/reject/${serviceId}`
    try {
      const response = await globalServerRequest({
        endpoint: updatedEndpoint,
        method: isAddactional ? "POST" : "PUT",
        payload: {
          rejection_reason: reason,
          ...(isAddactional && { booking_id: serviceId, status: 'reject', additional_work_id: additionalId }),
        }
      });

      console.log(" rejected services response  ", response)
      if (response.success) {

        window.dispatchEvent(new Event("quoteUpdated"));

        const bootstrap = (window as any).bootstrap;

        const currentModalEl = document.getElementById("servicesRejection");
        const confirmModalEl = document.getElementById("#servicesRejected");

        if (!currentModalEl) return;

        const currentModal =
          bootstrap?.Modal?.getInstance(currentModalEl) ||
          bootstrap?.Modal?.getOrCreateInstance(currentModalEl);
        currentModal.hide();
        if (confirmModalEl && isAddactional) {
          currentModalEl.addEventListener(
            "hidden.bs.modal",
            () => {
              const confirmModal =
                bootstrap?.Modal?.getOrCreateInstance(confirmModalEl);
              confirmModal?.show();
            },
            { once: true }
          );
        }
      } else {
        toast.error("Failed to reject service. Please try again.");
      }
    } catch (error) {
      console.error("Rejection Error:", error);
      toast.error("An error occurred while rejecting the service.");
    }
  }

  const handleCancel = async (reason: string) => {
    console.log("selectedBookingData", selectedBookingData)
    console.log("Cancel Reason", reason)

    try {
      const response = await globalServerRequest({
        endpoint: `booking/delete-quote`,
        // endpoint: ``,
        method: "POST",
        payload: {
          quote_id: selectedBookingData?.quote_id,
          // reason: reason,
        },
      });
      if (response?.success) {
        toast.success("Booking cancelled successfully!");
        setShowCancle(false);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    }


  }






  return (
    <>
      <main>
        <div className="container home-wraper my-profile">
          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="browse-wrp">
                    <div className="browse-ctg-head my-con-head">
                      <h2 className="sub-cate-page">
                        {/* <a href="index.html"><img src="images/home/left-arrow.svg" alt="" /></a> */}
                        <button
                          type="button"
                          onClick={() => router.back()}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                          }}
                        >
                          <img src="images/home/left-arrow.svg" alt="" />
                        </button>
                        My Quotes{" "}
                      </h2>
                      <div className="tab-left">
                        <ul
                          className="nav nav-pills mb-3"
                          id="customTabs-tab"
                          role="tablist"
                        >
                          {["Received", "Requested", "Accepted"].map(
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
                                  // onClick={() => {
                                  //   if (activeTab !== item.toLowerCase()) {
                                  //     setActiveTab(item.toLowerCase());
                                  //     setPageNo(1);
                                  //     setQuotes([]);
                                  //   }
                                  // }}

                                  onClick={() => {
                                    if (activeTab !== item.toLowerCase()) {
                                      setActiveTab(item.toLowerCase());
                                      setPageNo(1);
                                      setQuotes([]);
                                      setShowLoadMore(false);
                                    }
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

                      <div
                        className="tab-content custom-scroll"
                        id="customTabs-tabContent"
                        style={{ maxHeight: "calc(100vh - 250px)", overflowY: "auto", overflowX: "hidden" }}
                      >
                        {quotes?.length === 0 ? (
                          <div style={{ padding: "50px 0", textAlign: "center", color: "#777" }}>
                            {activeTab === "received" && <h5>No received quotes available.</h5>}
                            {activeTab === "requested" && <h5>No requested quotes found.</h5>}
                            {activeTab === "accepted" && <h5>No accepted quotes yet.</h5>}
                          </div>
                        ) : (
                          quotes?.map((item: any, index: number) => {
                            const isServicesOpen = !!expandedQuotes[index];
                            const isAdditionalOpen = !!expandedAdditional[index];

                            return (
                              <div className="my-quotes-inner" key={index}>
                                <div className="add-user">
                                  <p className="left">{item.quote_number || `#${item.quote_id}`}</p>

                                  {item?.has_additional_services && (
                                    <p className="right">Additional Services</p>
                                  )}
                                  {activeTab === "requested" && (
                                    <p className="right">Pending From Admin</p>
                                  )}
                                </div>

                                <div className="plumbing">

                                  <Link href={`/serviceDetails?serviceId=${item?.quote_id}`} className="plm">
                                    {item?.category?.name || item.category}{" "}
                                    <img
                                      src="images/home/up-right-arrow.svg"
                                      alt=""
                                    />
                                  </Link>
                                  <p className="sub-cate">
                                    Selected Sub categories
                                  </p>
                                  <div className="service-list-type">
                                    <ol className="main-category">
                                      {item.sub_categories?.slice(0, 1).map((subCat: any, i: number) => (
                                        <li key={`first-${i}`}>
                                          {subCat.name}
                                          <ul>
                                            {subCat.services?.map((srv: any, j: number) => (
                                              <li key={j}>
                                                {srv.name}
                                                <ul>
                                                  {srv.issues?.map((issue: any, k: number) => (
                                                    <li key={k}>{issue.name}</li>
                                                  ))}
                                                </ul>
                                              </li>
                                            ))}
                                          </ul>
                                        </li>
                                      ))}

                                      {/* MORE / LESS SERVICES LOGIC INSIDE THE SAME OL */}
                                      {item.sub_categories?.length > 1 && (
                                        <>
                                          {/* 2. "+ X more category" Button - Number hide karne ke liye inline styles use kiye hain */}
                                          {!isServicesOpen && (
                                            <li
                                              className="more-service"
                                              style={{ cursor: "pointer", listStyleType: "none", marginLeft: "-20px" }}
                                              onClick={() =>
                                                setExpandedQuotes((prev) => ({
                                                  ...prev,
                                                  [index]: true,
                                                }))
                                              }
                                            >
                                              + {item.sub_categories.length - 1} more sub category
                                            </li>
                                          )}

                                          {/* 3. Expanded Content Block - Fragment use karne se numbering sequence break nahi hogi */}
                                          {isServicesOpen && (
                                            <>
                                              {item.sub_categories?.slice(1).map((subCat: any, i: number) => (
                                                <li key={`more-${i}`}>
                                                  {subCat.name}
                                                  <ul>
                                                    {subCat.services?.map((srv: any, j: number) => (
                                                      <li key={j}>
                                                        {srv.name}
                                                        <ul>
                                                          {srv.issues?.map((issue: any, k: number) => (
                                                            <li key={k}>{issue.name}</li>
                                                          ))}
                                                        </ul>
                                                      </li>
                                                    ))}
                                                  </ul>
                                                </li>
                                              ))}
                                              <li
                                                style={{
                                                  cursor: "pointer",
                                                  fontWeight: "bold",
                                                  listStyleType: "none",
                                                  marginLeft: "-20px",
                                                  marginTop: "10px"
                                                }}
                                                onClick={() =>
                                                  setExpandedQuotes((prev) => ({
                                                    ...prev,
                                                    [index]: false,
                                                  }))
                                                }
                                              >
                                                Less service
                                              </li>
                                            </>
                                          )}
                                        </>
                                      )}
                                    </ol>
                                    <div className="booking-schedule-container" style={{ padding: "15px", fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: "#333", fontSize: "16px", maxWidth: "400px" }}>
                                      {item?.schedule?.map((scheduleItem: any, schedIndex: number) => (
                                        <div key={schedIndex} style={{ display: "flex", alignItems: "center", marginBottom: "12px", lineHeight: "1.4" }}>
                                          <div style={{ width: "70px", fontWeight: "500", color: "#222222" }}>
                                            {schedIndex === 0 ? "Date :" : ""}
                                          </div>
                                          <div style={{ width: "140px", letterSpacing: "0.3px", color: "#222" }}>
                                            {scheduleItem?.date}
                                          </div>
                                          <div style={{ letterSpacing: "0.5px", color: "#222", paddingLeft: "10px" }}>
                                            {scheduleItem?.time}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    {
                                      item?.has_additional_services && (
                                        <div className="additional-services">
                                          <p
                                            className="additional-text"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                              setExpandedAdditional((prev) => ({
                                                ...prev,
                                                [index]: !isAdditionalOpen,
                                              }))
                                            }
                                          >
                                            Additional Services {!isAdditionalOpen}
                                            <img
                                              src="images/home/additional-service.svg"
                                              alt=""
                                            />
                                          </p>
                                          <ul
                                            className="service-list"
                                            style={{
                                              display: isAdditionalOpen
                                                ? "block"
                                                : "none",
                                            }}
                                          >
                                            {(() => {
                                              const addSrvs = item?.additional_services?.items;
                                              if (Array.isArray(addSrvs) && addSrvs.length > 0) {
                                                return addSrvs.map((srv: any, i: number) => (
                                                  <li key={i}>
                                                    {typeof srv === 'object' ? srv?.description : srv}
                                                    {srv?.material_cost && ` (Material Cost: $${srv.material_cost})`}
                                                    {Number(srv?.labour_cost) > 0 && `,(Lebour Cost: $${srv?.labour_cost})`}
                                                  </li>
                                                ));
                                              } else if (typeof addSrvs === 'string' && addSrvs.trim() !== '') {
                                                return addSrvs.split(',').map((srv: string, i: number) => (
                                                  <li key={i}>{srv.trim()}</li>
                                                ));
                                              }
                                              return <li>No additional services</li>;
                                            })()}
                                          </ul>
                                        </div>
                                      )
                                    }
                                    <p>{item.description}</p>
                                    <div className="service-quotes">
                                      <p className="service-cost">
                                        Cost:<span>${typeof item.cost === 'object' ? (item.cost?.totalAmount || item.cost?.amount || "") : item.cost}</span>
                                      </p>
                                      <div className="home-quotes-cta">
                                        {/* RECEIVED */}
                                        {activeTab === "received" && (
                                          <>
                                            <button
                                              className="reject-btn"
                                              data-bs-target="#servicesRejection"
                                              data-bs-toggle="modal"
                                              // onClick={() => handleAction(item, 'reject')}
                                              onClick={() => {
                                                setServiceId(item.has_additional_services ? item.additional_services.booking_id : item.quote_id);
                                                setAdditionalId(item.has_additional_services ? item.additional_services?.items?.[0]?.id : null);
                                                setIsAddactional(item.has_additional_services)
                                              }}
                                              style={{ cursor: 'pointer' }}
                                            >
                                              Reject
                                            </button>
                                            <a
                                              className="primary-cta rgt"
                                              data-bs-target="#servicesAccepted"
                                              data-bs-toggle="modal"
                                              onClick={() => {
                                                setServiceId(item.has_additional_services ? item.additional_services.booking_id : item.quote_id);
                                                setAdditionalId(item.has_additional_services ? item.additional_services?.items?.[0]?.id : null);
                                                setIsAddactional(item.has_additional_services)
                                              }}
                                              style={{ cursor: 'pointer' }}
                                            >
                                              Accept
                                              <img
                                                src="images/home/right-img.svg"
                                                alt=""
                                              />
                                            </a>
                                          </>
                                        )}

                                        {/* REQUESTED */}
                                        {activeTab === "requested" && (
                                          <>
                                            <button
                                              className="reject-btn"
                                              // data-bs-target="#servicesRejection"
                                              // data-bs-toggle="modal"
                                              onClick={() => {
                                                setSelectedBookingData(item);
                                                setShowCancle(true);
                                              }}
                                            // onClick={() => setServiceId(item?.quote_id)}
                                            >
                                              Cancel
                                            </button>

                                            <button
                                              className="primary-cta rgt"
                                              onClick={() =>
                                                router.push(`/summary-estimate?requestedId=${item?.quote_id}&is_quote_edit=1`)
                                              }
                                            >
                                              Edit Req.
                                            </button>
                                          </>
                                        )}

                                        {/* ACCEPTED */}
                                        {activeTab === "accepted" && (
                                          <button className="primary-cta rgt" onClick={() => window.open(item?.download_url, "_blank")} >
                                            <img
                                              className="download"
                                              src="images/inner-page/download-down-arrow.svg"
                                              alt=""
                                            />
                                            Download PDF
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}

                          {hasMore && (
                            <div ref={observerTarget} style={{ height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              {loading && <div className="spinner-border text-danger spinner-border-sm" role="status"><span className="visually-hidden">Loading...</span></div>}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <CancelBooking
        isOpen={showCancle}
        setIsOpen={setShowCancle}
        onCancel={handleCancel}
        isQuote={true}
      />

      <ConfirmCancelBooking />

      <ServiceAccepted serviceId={serviceId} isAddactional={isAddactional} additionalId={additionalId} />
      <ServiceRejected />
      <NewServiceRejectionModal serviceId={serviceId} onConfirm={handleReject} isAddactional={isAddactional} />
    </>
  );
}
