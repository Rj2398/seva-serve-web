"use client";
import NewServiceRejectionModal from "@/components/modals/bookingmodals/NewServiceRejectionModal";
import ServiceAccepted from "@/components/modals/bookingmodals/ServiceAccepted";
import ServiceRejected from "@/components/modals/bookingmodals/ServiceRejected";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { globalServerRequest } from "@/actions/globalApi";
import Link from "next/link";

export default function Quotes() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const is_requested = searchParams.get("is_requested");

  const [activeTab, setActiveTab] = useState(is_requested === "1" ? "requested" : "received");
  const [quotes, setQuotes] = useState<any[]>([]);

  console.log(quotes, "quotes****************");


  const [loading, setLoading] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [limit, setLimit] = useState<number>(2);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [btnHover, setBtnHover] = useState(false);
  const [serviceId, setServiceId] = useState<string>("");

  const [expandService, setExpandService] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const response = await globalServerRequest({
          endpoint: "quotes/get-quote",
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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMore &&
      !loading &&
      !showLoadMore
    ) {
      setShowLoadMore(true);
    }
  };

  const [expandedQuotes, setExpandedQuotes] = useState<Record<number, boolean>>(
    {}
  );
  const [expandedAdditional, setExpandedAdditional] = useState<
    Record<number, boolean>
  >({});
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

                          {/* <li className="nav-item" role="presentation">
                                                        <button className="nav-link"
                                                            id="customTabs-profile-tab"
                                                            data-bs-toggle="pill"
                                                            data-bs-target="#customTabs-profile"
                                                            type="button"
                                                            role="tab"
                                                            aria-controls="customTabs-profile"
                                                            aria-selected="false">
                                                            Requested
                                                        </button>
                                                    </li>

                                                    <li className="nav-item" role="presentation">
                                                        <button className="nav-link"
                                                            id="customTabs-contact-tab"
                                                            data-bs-toggle="pill"
                                                            data-bs-target="#customTabs-contact"
                                                            type="button"
                                                            role="tab"
                                                            aria-controls="customTabs-contact"
                                                            aria-selected="false">
                                                            Accepted
                                                        </button>
                                                    </li> */}
                        </ul>
                      </div>
                    </div>
                    <div className="mu-quotes-body">
                      {/* <div className="tab-content" id="customTabs-tabContent">

                                                <div className="tab-pane fade show active"
                                                    id="customTabs-home"
                                                    role="tabpanel"
                                                    aria-labelledby="customTabs-home-tab">
                                                    <div className="my-quotes-inner">
                                                        <div className="add-user">
                                                            <p className="left">#Q1015</p>
                                                            <p className="right">Additional Services</p>
                                                        </div>

                                                        <div className="plumbing">
                                                            <p className="plm">
                                                                Plumbing
                                                                <img src="images/home/up-right-arrow.svg" alt="" />
                                                            </p>
                                                            <p className="sub-cate">Sub categories Selected</p>

                                                            <div className="service-list-type">
                                                                <ol className="main-category">
                                                                    <li>
                                                                        Installation
                                                                        <ul>
                                                                            <li>
                                                                                Sink Installation
                                                                                <ul>
                                                                                    <li>Replace Existing Sink</li>
                                                                                </ul>
                                                                            </li>
                                                                        </ul>
                                                                    </li>
                                                                </ol>
                                                                <ol className="main-category">
                                                                    <li className="more-service">+ 1 more service</li>

                                                                    <div className="service-data">
                                                                        <li>
                                                                            Installation
                                                                            <ul>
                                                                                <li>
                                                                                    Sink Installation
                                                                                    <ul>
                                                                                        <li>Replace Existing Sink</li>
                                                                                    </ul>
                                                                                </li>
                                                                            </ul>
                                                                        </li>
                                                                    </div>
                                                                    <li className="less-service">Less service</li>
                                                                </ol>
                                                                <div className="additional-services">
                                                                    <p className="additional-text">
                                                                        Additional Services
                                                                        <img
                                                                            src="images/home/additional-service.svg"
                                                                            alt=""
                                                                        />
                                                                    </p>

                                                                    <ul className="service-list">
                                                                        <li>Undermount / Vessel Sink Setup</li>
                                                                        <li>Vessel Sink Setup</li>
                                                                    </ul>
                                                                </div>
                                                                <p>
                                                                    Lorem ipsum dolor sit amet, consectetur adipiscing
                                                                    elit
                                                                </p>
                                                                <div className="service-quotes">
                                                                    <p className="service-cost">Cost:<span>$149</span></p>
                                                                    <div className="home-quotes-cta">
                                                                        <button className="reject-btn"
                                                                            // onClick={() => router.push("/quotesDetails")}
                                                                            data-bs-target="#servicesRejection" data-bs-toggle="modal">Reject</button>
                                                                        <a data-bs-target="#servicesAccepted" data-bs-toggle="modal"
                                                                            //  onClick={() => router.push("/quotesDetail")}
                                                                            className="primary-cta rgt">
                                                                            Accept
                                                                            <img src="images/home/right-img.svg" alt="" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="tab-pane fade"
                                                    id="customTabs-profile"
                                                    role="tabpanel"
                                                    aria-labelledby="customTabs-profile-tab">
                                                    <div className="my-quotes-inner">
                                                        <div className="add-user">
                                                            <p className="left">#Q1015</p>
                                                            <p className="right">Pending From Admin</p>
                                                        </div>

                                                        <div className="plumbing">
                                                            <p className="plm">
                                                                Plumbing
                                                                <img src="images/home/up-right-arrow.svg" alt="" />
                                                            </p>
                                                            <p className="sub-cate">Sub categories Selected</p>

                                                            <div className="service-list-type">
                                                                <ol className="main-category">
                                                                    <li>
                                                                        Installation
                                                                        <ul>
                                                                            <li>
                                                                                Sink Installation
                                                                                <ul>
                                                                                    <li>Replace Existing Sink</li>
                                                                                </ul>
                                                                            </li>
                                                                        </ul>
                                                                    </li>
                                                                </ol>
                                                                <ol className="main-category">
                                                                    <li className="more-service">+ 1 more service</li>

                                                                    <div className="service-data">
                                                                        <li>
                                                                            Installation
                                                                            <ul>
                                                                                <li>
                                                                                    Sink Installation
                                                                                    <ul>
                                                                                        <li>Replace Existing Sink</li>
                                                                                    </ul>
                                                                                </li>
                                                                            </ul>
                                                                        </li>
                                                                    </div>
                                                                    <li className="less-service">Less service</li>
                                                                </ol>
                                                                <div className="additional-services">
                                                                    <p className="additional-text">
                                                                        Additional Services
                                                                        <img
                                                                            src="images/home/additional-service.svg"
                                                                            alt=""
                                                                        />
                                                                    </p>

                                                                    <ul className="service-list">
                                                                        <li>Undermount / Vessel Sink Setup</li>
                                                                        <li>Vessel Sink Setup</li>
                                                                    </ul>
                                                                </div>
                                                                <p>
                                                                    Lorem ipsum dolor sit amet, consectetur adipiscing
                                                                    elit
                                                                </p>
                                                                <div className="service-quotes">
                                                                    <p className="service-cost">Cost:<span>$149</span></p>
                                                                    <div className="home-quotes-cta">
                                                                        <button className="reject-btn">Reject</button>
                                                                        <button className="primary-cta rgt">
                                                                            Edit Req.

                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="tab-pane fade"
                                                    id="customTabs-contact"
                                                    role="tabpanel"
                                                    aria-labelledby="customTabs-contact-tab">
                                                    <div className="my-quotes-inner">
                                                        <div className="add-user">
                                                            <p className="left">#Q1015</p>

                                                        </div>

                                                        <div className="plumbing">
                                                            <p className="plm">
                                                                Plumbing
                                                                <img src="images/home/up-right-arrow.svg" alt="" />
                                                            </p>
                                                            <p className="sub-cate">Sub categories Selected</p>

                                                            <div className="service-list-type">
                                                                <ol className="main-category">
                                                                    <li>
                                                                        Installation
                                                                        <ul>
                                                                            <li>
                                                                                Sink Installation
                                                                                <ul>
                                                                                    <li>Replace Existing Sink</li>
                                                                                </ul>
                                                                            </li>
                                                                        </ul>
                                                                    </li>
                                                                </ol>
                                                                <ol className="main-category">
                                                                    <li className="more-service">+ 1 more service</li>

                                                                    <div className="service-data">
                                                                        <li>
                                                                            Installation
                                                                            <ul>
                                                                                <li>
                                                                                    Sink Installation
                                                                                    <ul>
                                                                                        <li>Replace Existing Sink</li>
                                                                                    </ul>
                                                                                </li>
                                                                            </ul>
                                                                        </li>
                                                                    </div>
                                                                    <li className="less-service">Less service</li>
                                                                </ol>
                                                                <div className="additional-services">
                                                                    <p className="additional-text">
                                                                        Additional Services
                                                                        <img
                                                                            src="images/home/additional-service.svg"
                                                                            alt=""
                                                                        />
                                                                    </p>

                                                                    <ul className="service-list">
                                                                        <li>Undermount / Vessel Sink Setup</li>
                                                                        <li>Vessel Sink Setup</li>
                                                                    </ul>
                                                                </div>
                                                                <p>
                                                                    Lorem ipsum dolor sit amet, consectetur adipiscing
                                                                    elit
                                                                </p>
                                                                <div className="service-quotes">
                                                                    <p className="service-cost">Cost:<span>$149</span></p>
                                                                    <div className="home-quotes-cta">

                                                                        <button className="primary-cta rgt">
                                                                            <img className="download" src="images/inner-page/download-down-arrow.svg" alt="" />
                                                                            Download PDF

                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div> */}
                      <div
                        className="tab-content custom-scroll"
                        id="customTabs-tabContent"
                        style={{ maxHeight: "calc(100vh - 250px)", overflowY: "auto", overflowX: "hidden" }}
                        onScroll={handleScroll}
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

                                  {activeTab === "received" && (
                                    <p className="right">Additional Services</p>
                                  )}
                                  {activeTab === "requested" && (
                                    <p className="right">Pending From Admin</p>
                                  )}
                                </div>

                                <div className="plumbing">
                                  {/* <p className="plm">
                                    {item.category?.name || item.category}
                                    <img
                                      src="images/home/up-right-arrow.svg"
                                      alt=""
                                    />
                                  </p> */}

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
                                    {/* MAIN SERVICES */}
                                    {/* <ol className="main-category">
                                      {item.sub_categories?.slice(0, 1).map(
                                        (subCat: any, i: number) => (
                                          <li key={i}>
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
                                        )
                                      )}
                                    </ol>

                                    {item.sub_categories?.length > 1 && (
                                      <ol className="main-category">
                                        
                                        {!isServicesOpen && (
                                          <li
                                            className="more-service"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                              setExpandedQuotes((prev) => ({
                                                ...prev,
                                                [index]: true,
                                              }))
                                            }
                                          >
                                            + {item.sub_categories.length - 1} more category
                                          </li>
                                        )}

                                        {isServicesOpen && (
                                          <div
                                            className="service-data"
                                            style={{
                                              display: "block",
                                              marginTop: "10px",
                                            }}
                                          >
                                            {item.sub_categories?.slice(1).map(
                                              (subCat: any, i: number) => (
                                                <li key={i}>
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
                                              )
                                            )}

                                            <li
                                              style={{
                                                cursor: "pointer",
                                                fontWeight: "bold",
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
                                          </div>
                                        )}
                                      </ol>
                                    )} */}



                                    <ol className="main-category">
                                      {/* 1. First Category (Hamesha dikhegi) */}
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

                                              {/* 4. "Less service" Button - listStyleType none se iska number show nahi hoga */}
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

                                    {/* ADDITIONAL SERVICES TOGGLE BLOCK */}
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
                                          const addSrvs = item.additional_services?.items || item.additional_services;
                                          if (Array.isArray(addSrvs) && addSrvs.length > 0) {
                                            return addSrvs.map((srv: any, i: number) => (
                                              <li key={i}>{typeof srv === 'object' ? srv?.name : srv}</li>
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
                                              onClick={() => setServiceId(item.quote_id)}
                                              style={{ cursor: 'pointer' }}
                                            >
                                              Reject
                                            </button>

                                            <a
                                              className="primary-cta rgt"
                                              data-bs-target="#servicesAccepted"
                                              data-bs-toggle="modal"
                                              onClick={() => setServiceId(item.quote_id)}
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
                                              data-bs-target="#servicesRejection"
                                              data-bs-toggle="modal"
                                              onClick={() => setServiceId(item?.quote_id)}
                                            >
                                              Reject
                                            </button>

                                            <button
                                              className="primary-cta rgt"
                                              // onClick={() =>
                                              //   router.push("/serviceDetails")
                                              // }
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
                        {loading && (
                          <div style={{ textAlign: 'center', padding: '15px', color: '#666' }}>
                            Loading...
                          </div>
                        )}

                        {showLoadMore && hasMore && (
                          <div className="text-center mt-4 mb-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowLoadMore(false);
                                setPageNo((prev) => prev + 1);
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <ServiceAccepted serviceId={serviceId} />
      <ServiceRejected />
      <NewServiceRejectionModal serviceId={serviceId} />
    </>
  );
}
