"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WelcomeModal from "@/components/modals/WelcomeModal";
import AddCardModal from "@/components/modals/AddCardModal";
import DatePopup from "@/components/modals/bookingmodals/DatePopup";
import RescheduleRequestSubmit from "@/components/modals/bookingmodals/RescheduleRequestSubmit";
import CancelBooking from "@/components/modals/bookingmodals/CancelBooking";
import ServiceRejected from "@/components/modals/bookingmodals/ServiceRejected";
import ServiceAccepted from "@/components/modals/bookingmodals/ServiceAccepted";
import NewServiceRejectionModal from "@/components/modals/bookingmodals/NewServiceRejectionModal";
import { globalServerRequest } from "@/actions/globalApi";
import toast from "react-hot-toast";
import {
  FaWhatsapp,
  FaFacebookF,
  FaXTwitter,
  FaEnvelope,
  // FaTimes,
} from "react-icons/fa6";

import { IoCopyOutline } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";

interface homeprops {
  data: any;
}

const ClientComponent = ({ data }: homeprops) => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);
  const [serviceId, setServiceId] = useState<string>("");

  const referralCode = data?.refferalBanners?.refferalCode;
  // console.log("Referral Code22222222", referralCode )

  const [showShareMenu, setShowShareMenu] = useState(false);

  const user =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const isNewUser = user ? JSON.parse(user)?.isNewUser : false;
  const isLoginUser =
    typeof window !== "undefined" ? localStorage.getItem("isLoggedIn") : null;
  const isLogin = isLoginUser === "true";

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && data?.user?.address) {
      localStorage.setItem("homeUserData", JSON.stringify(data.user.address));
    }

    const checkModalFlags = () => {
      if (typeof window !== "undefined") {
        if (sessionStorage.getItem("showWelcomeModal") === "true") {
          setShowWelcomeModal(true);
          sessionStorage.removeItem("showWelcomeModal");
        }
        if (sessionStorage.getItem("showAddCardModal") === "true") {
          setShowAddCardModal(true);
          sessionStorage.removeItem("showAddCardModal");
        }
      }
    };

    checkModalFlags();

    if (typeof window !== "undefined") {
      window.addEventListener("loginStatusChanged", checkModalFlags);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("loginStatusChanged", checkModalFlags);
      }
    };
  }, []);

  useEffect(() => {
    let frameId: number;

    const initSliders = () => {
      const $ = (window as any).$;

      // CRITICAL FIX: Ensure BOTH jQuery and its .slick extension are fully initialized
      if (!$ || typeof $.fn.slick !== "function") {
        frameId = requestAnimationFrame(initSliders);
        return;
      }

      // 1. Safe layout checking for Hero Slider
      const $hero = $(".hero-slider");
      if (
        $hero.length &&
        $hero.children().length > 0 &&
        !$hero.hasClass("slick-initialized")
      ) {
        $hero.slick({
          infinite: true,
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows: false,
          dots: true,
          autoplay: true,
          responsive: [
            {
              breakpoint: 767,
              settings: { slidesToShow: 1, slidesToScroll: 1 },
            },
          ],
        });
      }

      // 2. Safe layout checking for Upcoming & Popular Slider configurations
      const $upcoming = $(".upcoming-slider");
      if (
        $upcoming.length &&
        $upcoming.children().length > 0 &&
        !$upcoming.hasClass("slick-initialized")
      ) {
        $upcoming.slick({
          dots: false,
          infinite: true,
          speed: 300,
          slidesToShow: 1,
          // centerMode: true,
          autoplay: true,
          arrows: false,
          variableWidth: true,
        });
      }
    };

    // Spin initialization request loop up safely
    frameId = requestAnimationFrame(initSliders);

    // Context execution logic for simple non-plugin click bindings
    const checkBindings = () => {
      const $ = (window as any).$;
      if ($) {
        const $body = $("body");

        $body
          .off("click", ".service-list-type .more-service")
          .on("click", ".service-list-type .more-service", function (e: any) {
            let parent = $(e.currentTarget).closest(".service-list-type");
            parent.find(".service-data").show();
            $(e.currentTarget).hide();
            parent.find(".less-service").css("display", "list-item");
          });

        $body
          .off("click", ".service-list-type .less-service")
          .on("click", ".service-list-type .less-service", function (e: any) {
            let parent = $(e.currentTarget).closest(".service-list-type");
            parent.find(".service-data").hide();
            parent.find(".more-service").css("display", "list-item");
            $(e.currentTarget).hide();
          });

        $body
          .off("click", ".additional-text")
          .on("click", ".additional-text", function (this: any) {
            $(this).next(".service-list").slideToggle(300);
            $(this).find("img").toggleClass("rotate");
          });
      } else {
        setTimeout(checkBindings, 50);
      }
    };

    checkBindings();

    // Clean teardown handlers to guarantee no duplicate slider instances on history mutations
    return () => {
      cancelAnimationFrame(frameId);
      const _$ = (window as any).$;
      if (_$ && typeof _$.fn?.slick === "function") {
        if (_$(".hero-slider").hasClass("slick-initialized"))
          _$(".hero-slider").slick("unslick");
        if (_$(".upcoming-slider").hasClass("slick-initialized"))
          _$(".upcoming-slider").slick("unslick");
      }
    };
  }, [data]);

  const formatTimeDifference = (isoString: string): string => {
    if (!isoString) return "Started recently";

    const targetTime = new Date(isoString).getTime();

    if (isNaN(targetTime)) return "Invalid date";

    const currentTime = Date.now();

    const diff = currentTime - targetTime; // +ve => past, -ve => future
    const absDiff = Math.abs(diff);

    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const suffix = diff >= 0 ? "ago" : "from now";

    if (seconds < 30) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? "s" : ""} ${suffix}`;
    }

    if (hours < 24) {
      return `${hours} hr${hours !== 1 ? "s" : ""} ${suffix}`;
    }

    return `${days} day${days !== 1 ? "s" : ""} ${suffix}`;
  };

  const formatBookingDateTime = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dateStr} • ${timeStr}`;
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied to clipboard!");
  }

  const referralLink = `${window.location.origin}`;

  const shareMessage = `Invite Friends & Earn
  
  Use my referral code: ${referralCode}
  
  ${referralLink}`;

  const handleWhatsAppShare = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
      "_blank"
    );
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      "_blank"
    );
  };

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
      "_blank"
    );
  };

  const handleEmailShare = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(
      "Invite Friends & Earn"
    )}&body=${encodeURIComponent(shareMessage)}`;
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-slider:not(.slick-initialized),
            .upcoming-slider:not(.slick-initialized) {
              display: flex !important;
              overflow: hidden;
              gap: 15px;
            }
            .hero-slider:not(.slick-initialized) .item-inner,
            .upcoming-slider:not(.slick-initialized) .upcoming-my-slide {
              flex: 0 0 auto !important;
              width: 48%;
            }
            .hero-slider .slick-track,
            .upcoming-slider .slick-track {
              margin-left: 0 !important;
              margin-right: auto !important;
              display: flex !important;
              justify-content: flex-start !important;
            }
            @media (max-width: 767px) {
              .hero-slider:not(.slick-initialized) .item-inner,
              .upcoming-slider:not(.slick-initialized) .upcoming-my-slide {
                width: 100%;
              }
            }
          `,
        }}
      />

      <main>
        <div className="container home-wraper">
          {(!isLogin || isNewUser) && data?.topServiceCards?.length > 0 && (
            <section>
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="hero-slider">
                      {data?.topServiceCards.map((item: any, index: any) => (
                        <div className="item-inner" key={index}>
                          <div className="inner-hero">
                            <div className="hero-img">
                              <img
                                src={
                                  item?.image ||
                                  "images/home/hero-slider-img.svg"
                                }
                                alt=""
                              />
                            </div>
                            <p>{item?.title}</p>
                            <div className="hero-btn">
                              <button
                                onClick={() => {
                                  if (isLogin) {
                                    router.push("/category");
                                  }
                                }}
                                data-bs-toggle={!isLogin ? "modal" : undefined}
                                data-bs-target={
                                  !isLogin ? "#login-screen-1" : undefined
                                }
                              >
                                Book Now{" "}
                                <img
                                  src="/images/home/right-arrow.svg"
                                  alt="arrow"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {data?.activeBookings?.length > 0 && (
            <section>
              <div
                className="container"
                onClick={() => router.push("/view-booking-detail")}
                style={{ cursor: "pointer" }}
              >
                <div className="row">
                  {data?.activeBookings.map((item: any, index: number) => (
                    <div className="col-lg-12" key={index}>
                      <div className="pipe-leakage">
                        <div className="left-leakage">
                          <span></span>
                          <p>{item?.status || "On-going"} Booking</p>
                        </div>
                        <div className="right-leakage">
                          <div className="leakage-img">
                            <img src={item?.image} alt={item?.serviceName} />
                          </div>
                          <div className="right-text">
                            <p className="frist">
                              {item?.serviceName || "Pipe Leakage Fixing"}
                            </p>
                            <p className="sec">
                              Started {formatTimeDifference(item.scheduledAt) ||
                                "Started 20 mins ago"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {data?.categories?.length > 0 && (
            <section>
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="browse-wrp">
                      <div className="browse-ctg-head">
                        <h2>Browse by Category</h2>
                        <p
                          className="see-all"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            if (isLogin) {
                              router.push("/category");
                            }
                          }}
                          data-bs-toggle={!isLogin ? "modal" : undefined}
                          data-bs-target={
                            !isLogin ? "#login-screen-1" : undefined
                          }
                        >
                          {/* <Link href="/category"> */}
                          See All{" "}
                          <img
                            src="images/home/browse-category/right-arrow.svg"
                            alt="right-arrow"
                          />
                          {/* </Link> */}
                        </p>
                      </div>
                      <div className="browse-inner">
                        <ul>
                          {data?.categories?.map((item: any) => (
                            <li key={item?.id}>
                              <Link
                                href={
                                  isLogin
                                    ? `/serviceDetails?categoryId=${item?.id}`
                                    : "#"
                                }
                                className="wrp-img"
                                data-bs-toggle={!isLogin ? "modal" : undefined}
                                data-bs-target={
                                  !isLogin ? "#login-screen-1" : undefined
                                }
                                onClick={(e) => {
                                  if (!isLogin) {
                                    e.preventDefault();
                                  }
                                }}
                              >
                                <div className="c-img">
                                  <img
                                    src={
                                      item?.iconUrl ||
                                      "images/home/browse-category/2.svg"
                                    }
                                    alt=""
                                  />
                                </div>
                                <span>{item?.name || "Repairing"}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {data?.upcomingBookings?.length > 0 && (
            <section>
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="browse-ctg-head">
                      <h2>Upcoming Bookings</h2>
                      <p className="see-all">
                        <Link href="/booking">
                          See All{" "}
                          <img
                            src="images/home/browse-category/right-arrow.svg"
                            alt="right-arrow"
                          />
                        </Link>
                      </p>
                    </div>
                    <div className="upcoming-slider">
                      {data?.upcomingBookings?.map(
                        (item: any, index: number) => (
                          <div className="upcoming-my-slide" key={index}>
                            <div className="upcoming-img">
                              <img src="images/home/home-slider/1.svg" alt="" />
                            </div>
                            <div className="upcoming-data">
                              <p className="up-text">
                                {item?.serviceName ||
                                  "Plumbing - Pipe Leakage Repair"}
                              </p>
                              <p className="up-date">
                                {formatBookingDateTime(item?.scheduledAt) ||
                                  "Nov 15, 2025 • 10:00 AM"}
                              </p>
                              <div className="upcm-slider-btn">
                                <button
                                  className="primary-cta upcm-btn"
                                  onClick={() => setShowDatePicker(true)}
                                  data-bs-target="#select-date-time-popup"
                                  data-bs-toggle="modal"
                                >
                                  <img
                                    src="images/home/home-slider/re-sdl-btn.svg"
                                    alt=""
                                  />{" "}
                                  Reschedule
                                </button>
                                <button
                                  className="cnl"
                                  data-bs-target="#cancelBookingPopup"
                                  data-bs-toggle="modal"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {data?.quotes?.length > 0 && (
            <section>
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="my-quotes-wrp">
                      <div className="browse-ctg-head">
                        <h2>My Quotes</h2>
                        <p className="see-all">
                          <Link href="/quotes">
                            See All{" "}
                            <img
                              src="images/home/browse-category/right-arrow.svg"
                              alt="right-arrow"
                            />
                          </Link>
                        </p>
                      </div>
                      {data?.quotes
                        ?.slice(0, 1)
                        .map((item: any, index: number) => (
                          <div className="my-quotes-inner" key={index}>
                            <div className="add-user">
                              <p className="left">#{item?.quoteId}</p>
                              <p className="right">Additional Services</p>
                            </div>
                            <div className="plumbing">
                              <Link
                                // href={`/serviceDetails?serviceId=${item?.id}`}
                                href={`/quotes`}
                                className="plm"
                              >
                                {item?.title || "Plumbing"}{" "}
                                <img
                                  src="images/home/up-right-arrow.svg"
                                  alt=""
                                />
                              </Link>
                              {/* <p className="sub-cate">Sub categories Selected</p> */}
                              <div className="service-list-type">
                                {/* <ol className="main-category">
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
                                <li className="more-service">
                                  + 1 more service
                                </li>
                                <div
                                  className="service-data"
                                  style={{ display: "none" }}
                                >
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
                                <li
                                  className="less-service"
                                  style={{ display: "none" }}
                                >
                                  Less service
                                </li>
                              </ol>
                              <div className="additional-services">
                                <p className="additional-text">
                                  Additional Services{" "}
                                  <img
                                    src="images/home/additional-service.svg"
                                    alt=""
                                  />
                                </p>
                                <ul
                                  className="service-list"
                                  style={{ display: "none" }}
                                >
                                  <li>Undermount / Vessel Sink Setup</li>
                                  <li>Vessel Sink Setup</li>
                                </ul>
                              </div> */}

                                <div
                                  className="booking-schedule-container"
                                  style={{
                                    padding: "15px",
                                    fontFamily:
                                      "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                                    color: "#333",
                                    fontSize: "16px",
                                    maxWidth: "400px",
                                  }}
                                >
                                  {/* {item?.schedule?.map((scheduleItem: any, schedIndex: number) => ( */}
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginBottom: "12px",
                                      lineHeight: "1.4",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "70px",
                                        fontWeight: "500",
                                        color: "#222222",
                                      }}
                                    >
                                      Date :
                                    </div>
                                    <div
                                      style={{
                                        width: "140px",
                                        letterSpacing: "0.3px",
                                        color: "#222",
                                      }}
                                    >
                                      {item?.date}
                                    </div>
                                    <div
                                      style={{
                                        letterSpacing: "0.5px",
                                        color: "#222",
                                        paddingLeft: "10px",
                                      }}
                                    >
                                      {item?.time}
                                    </div>
                                  </div>
                                  {/* ))} */}
                                </div>

                                <div className="service-quotes">
                                  <p className="service-cost">
                                    Cost:<span>${item?.quotedPrice}</span>
                                  </p>
                                  <div className="home-quotes-cta">
                                    <button
                                      className="reject-btn"
                                      data-bs-target="#servicesRejection"
                                      data-bs-toggle="modal"
                                      onClick={() => setServiceId(item?.id)}
                                    >
                                      Reject
                                    </button>
                                    <button
                                      className="primary-cta rgt"
                                      data-bs-target="#servicesAccepted"
                                      data-bs-toggle="modal"
                                      onClick={() => setServiceId(item?.id)}
                                    >
                                      Accept{" "}
                                      <img
                                        src="images/home/right-img.svg"
                                        alt=""
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ==================== NEW SECTION: INVITE AND EARN ==================== */}

          {/* ==================== INVITE AND EARN ==================== */}
          {(data?.refferalBanners?.refferalCode) && (
            <section className="mb-4">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div
                      style={{
                        background: "#FCF6EE",
                        border: "1px solid #F6E2CA",
                        borderRadius: "24px",
                        padding: "24px 32px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "24px",
                        width: "100%",
                      }}
                    >
                      {/* Left Column: Groups both the text details and the referral code block close together */}
                      <div style={{ display: "flex", gap: "18px", flex: "1 1 auto", minWidth: "280px" }}>
                        {/* Text Group */}
                        <div>
                          <h3
                            style={{
                              fontSize: "20px",
                              fontWeight: "700",
                              color: "#1E293B",
                              margin: "0 0 4px 0",
                            }}
                          >
                            Invite Friends & Earn
                          </h3>
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#64748B",
                              margin: 0,
                              fontWeight: "500",
                            }}
                          >
                            Earn up to $20 for every successful referral.
                          </p>
                        </div>

                        {/* Referral Code & Copy Button Group (Positioned directly under the text) */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: "12px",
                            flexWrap: "wrap",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: "10px",
                                fontWeight: "700",
                                color: "#94A3B8",
                                marginBottom: "4px",
                                letterSpacing: "0.5px",
                              }}
                            >
                              Referral Code
                            </div>
                            <div
                              style={{
                                background: "#FFFFFF",
                                border: "1px dashed #F87171",
                                borderRadius: "8px",
                                padding: "8px 16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                height: "44px",
                              }}
                            >
                              <svg
                                width="14"
                                height="16"
                                viewBox="0 0 14 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.5 6H10.5V4.5C10.5 2.56 8.94 1 7 1C5.06 1 3.5 2.56 3.5 4.5V6H2.5C1.67 6 1 6.67 1 7.5V13.5C1 14.33 1.67 15 2.5 15H11.5C12.33 15 13 14.33 13 13.5V7.5C13 6.67 12.33 6 11.5 6ZM7 11.5C6.17 11.5 5.5 10.83 5.5 10C5.5 9.17 6.17 8.5 7 8.5C7.83 8.5 8.5 9.17 8.5 10C8.5 10.83 7.83 11.5 7 11.5ZM9 6H5V4.5C5 3.4 5.9 2.5 7 2.5C8.1 2.5 9 3.4 9 4.5V6Z"
                                  fill="#9F1239"
                                />
                              </svg>
                              <span
                                style={{
                                  fontFamily: "monospace",
                                  fontWeight: "700",
                                  color: "#0F172A",
                                  fontSize: "15px",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                {referralCode}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={handleCopyReferral}
                            className="refer-btn"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#FFF1F2";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#FFFFFF";
                            }}
                          >
                            Copy
                          </button>

                          {/* <button className="refer-btn" onClick={handleShareReferral}>
                            Share
                          </button> */}
                          <button className="refer-btn" onClick={() => setShowShareMenu(true)}>
                            Share
                          </button>
                        </div>
                      </div>

                      {/* Right Link Column: Positioned safely on the far right */}
                      <div style={{ display: "flex", alignItems: "center", flex: "0 0 auto" }}>
                        <Link
                          href="/referral"
                          style={{
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#9F1239",
                            fontWeight: "700",
                            fontSize: "14px",
                          }}
                        >
                          View Referral History
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 8H15M15 8L8 1M15 8L8 15"
                              stroke="#9F1239"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {data?.popularServices?.length > 0 && (
            <section>
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="popular-service-home">
                      <div className="browse-ctg-head">
                        <h2>Popular Services</h2>
                        <p
                          className="see-all"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            if (isLogin) {
                              router.push("/services");
                            }
                          }}
                          data-bs-toggle={!isLogin ? "modal" : undefined}
                          data-bs-target={
                            !isLogin ? "#login-screen-1" : undefined
                          }
                        >
                          {/* <Link href="/services"> */}
                          See All{" "}
                          <img
                            src="images/home/browse-category/right-arrow.svg"
                            alt="right-arrow"
                          />
                          {/* </Link> */}
                        </p>
                      </div>
                      <div
                        className="upcoming-slider"
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          const slide = target.closest("[data-route]");
                          if (slide) {
                            e.stopPropagation();
                            // router.push(`/serviceDetails?serviceId=${item?.id}`);
                          }
                        }}
                      >
                        {data?.popularServices.map(
                          (item: any, index: number) => (
                            <div
                              className="upcoming-my-slide"
                              key={item?.id}
                              onClick={() => {
                                if (isLogin) {
                                  router.push(
                                    `/serviceDetails?serviceId=${item?.id}`
                                  );
                                } else {
                                  const modal =
                                    document.getElementById("login-screen-1");
                                  if (modal) {
                                    const bsModal = new (
                                      window as any
                                    ).bootstrap.Modal(modal);
                                    bsModal.show();
                                  }
                                }
                              }}
                              style={{
                                cursor: "pointer",
                                position: "relative",
                                zIndex: 999,
                              }}
                            >
                              <div className="upcoming-img">
                                <img
                                  src={`${item?.imageUrl}`}
                                  alt=""
                                  style={{ width: "308px" }}
                                />
                              </div>
                              <div className="upcoming-data">
                                <p className="up-text">{item?.name}</p>
                                <div className="upcm-slider-btn pop-srv">
                                  <button className="primary-cta upcm-btn pop-srv-btn">
                                    Request Exact Quote
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
      <WelcomeModal
        isOpen={showWelcomeModal}
        setIsOpen={setShowWelcomeModal}
        onConfirm={() => {
          router.push("/edit-profile");
        }}
      />
      <AddCardModal isOpen={showAddCardModal} setIsOpen={setShowAddCardModal} />
      <DatePopup isOpen={showDatePicker} setIsOpen={setShowDatePicker} />
      <RescheduleRequestSubmit />
      <ServiceRejected />
      <NewServiceRejectionModal serviceId={serviceId} />
      <ServiceAccepted serviceId={serviceId} />
      <CancelBooking />

      {
        showShareMenu && (
          <div
            className="share-overlay"
            // onClick={() => setShowShareMenu(false)}
          >
            <div
              className="share-popup"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="share-header">
                <h4>Share Referral</h4>

                <button
                  className="close-btn"
                  onClick={() => setShowShareMenu(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="share-grid">

                <button className="share-item" onClick={handleWhatsAppShare}>
                  <div className="icon1 whatsapp">
                    <FaWhatsapp />
                  </div>
                  <span>WhatsApp</span>
                </button>

                <button className="share-item" onClick={handleFacebookShare}>
                  <div className="icon1 facebook">
                    <FaFacebookF />
                  </div>
                  <span>Facebook</span>
                </button>

                <button className="share-item" onClick={handleTwitterShare}>
                  <div className="icon1 twitter">
                    <FaXTwitter />
                  </div>
                  <span>X</span>
                </button>

                <button className="share-item" onClick={handleEmailShare}>
                  <div className="icon1 email">
                    <FaEnvelope />
                  </div>
                  <span>Email</span>
                </button>



              </div>
            </div>
          </div>
        )
}

    </>
  );
};

export default ClientComponent;
