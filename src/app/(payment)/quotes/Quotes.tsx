"use client";

import NewServiceRejectionModal from "@/components/modals/bookingmodals/NewServiceRejectionModal";
import ServiceAccepted from "@/components/modals/bookingmodals/ServiceAccepted";
import ServiceRejected from "@/components/modals/bookingmodals/ServiceRejected";
import { quotesData } from "../../../json/quotes.json";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Quotes() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("received");
  const [quotesDataAll, setQuotesData] = useState<any>(quotesData);

  const [expandService, setExpandService] = useState<boolean>(false);

  // const toggleExpand = (index: number) => {
  //     setExpandedQuotes((prev) => ({
  //         ...prev,
  //         [index]: !prev[index], // Flip the true/false value for this specific item index
  //     }));
  // };

  let quotes = quotesDataAll?.[activeTab] || [];

  // Put this inside your component, right above your return statement
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
                                  className={`nav-link ${
                                    activeTab === item.toLowerCase()
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
                      <div className="tab-content" id="customTabs-tabContent">
                        {quotes?.map((item: any, index: number) => {
                          const isServicesOpen = !!expandedQuotes[index];
                          const isAdditionalOpen = !!expandedAdditional[index];

                          return (
                            <div className="my-quotes-inner" key={index}>
                              <div className="add-user">
                                <p className="left">#{item.quote_id}</p>

                                {item.status && (
                                  <p className="right">{item.status}</p>
                                )}
                              </div>

                              <div className="plumbing">
                                <p className="plm">
                                  {item.category}
                                  <img
                                    src="images/home/up-right-arrow.svg"
                                    alt=""
                                  />
                                </p>

                                <p className="sub-cate">
                                  Sub categories Selected
                                </p>

                                <div className="service-list-type">
                                  {/* MAIN SERVICES */}
                                  <ol className="main-category">
                                    {item.services?.map(
                                      (srv: any, i: number) => (
                                        <li key={i}>
                                          {srv.category}
                                          <ul>
                                            <li>
                                              {srv.service}
                                              <ul>
                                                <li>{srv.sub_service}</li>
                                              </ul>
                                            </li>
                                          </ul>
                                        </li>
                                      )
                                    )}
                                  </ol>

                                  {/* MORE / LESS SERVICES BLOCK */}
                                  <ol className="main-category">
                                    {/* 1. Toggle Button Option */}
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
                                        + 1 more service
                                      </li>
                                    )}

                                    {/* 2. Expanded Content Block (Keeps your exact UI classes) */}
                                    {isServicesOpen && (
                                      <div
                                        className="service-data"
                                        style={{
                                          display: "block",
                                          marginTop: "10px",
                                        }}
                                      >
                                        <li>
                                          {item.services?.[0]?.category}
                                          <ul>
                                            <li>
                                              {item.services?.[0]?.service}
                                              <ul>
                                                <li>
                                                  {
                                                    item.services?.[0]
                                                      ?.sub_service
                                                  }
                                                </li>
                                              </ul>
                                            </li>
                                          </ul>
                                        </li>

                                        <li
                                          // className="less-service"
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
                                      {item.additional_services?.map(
                                        (srv: string, i: number) => (
                                          <li key={i}>{srv}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>

                                  <p>{item.description}</p>

                                  <div className="service-quotes">
                                    <p className="service-cost">
                                      Cost:<span>${item.cost}</span>
                                    </p>

                                    <div className="home-quotes-cta">
                                      {/* RECEIVED */}
                                      {activeTab === "received" && (
                                        <>
                                          <button
                                            className="reject-btn"
                                            data-bs-target="#servicesRejection"
                                            data-bs-toggle="modal"
                                          >
                                            Reject
                                          </button>

                                          <a
                                            className="primary-cta rgt"
                                            data-bs-target="#servicesAccepted"
                                            data-bs-toggle="modal"
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
                                          >
                                            Reject
                                          </button>

                                          <button
                                            className="primary-cta rgt"
                                            onClick={() =>
                                              router.push("/serviceDetails")
                                            }
                                          >
                                            Edit Req.
                                          </button>
                                        </>
                                      )}

                                      {/* ACCEPTED */}
                                      {activeTab === "accepted" && (
                                        <button className="primary-cta rgt">
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
                        })}
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
      <NewServiceRejectionModal />
    </>
  );
}
