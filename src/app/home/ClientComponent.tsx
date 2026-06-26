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

interface homeprops {
  data: any;
}

const ClientComponent = ({ data }: homeprops) => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);

  const user =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const isNewUser = user ? JSON.parse(user)?.isNewUser : false;
  const isLoginUser =
    typeof window !== "undefined" ? localStorage.getItem("isLoggedIn") : null;
  const isLogin = isLoginUser === "true";

  const router = useRouter();

  useEffect(() => {
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
          centerMode: true,
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

  const formatTimeDifference = (isoString: string) => {
    if (!isoString) return "Started recently";
    const scheduledDate = new Date(isoString);
    const now = new Date();
    const diffInMs = now.getTime() - scheduledDate.getTime();
    const diffInMins = Math.floor(Math.abs(diffInMs) / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);
    const suffix = diffInMs > 0 ? "ago" : "from now";
    if (diffInMins < 60)
      return `${diffInMins} min${diffInMins !== 1 ? "s" : ""} ${suffix}`;
    return `${diffInHours} hr${diffInHours !== 1 ? "s" : ""} ${suffix}`;
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
                              <button onClick={() => router.push("/category")}>
                                Book Now{" "}
                                <img src="images/home/right-arrow.svg" />
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
                          {/* <span></span> */}
                          <p>{item?.status || "On-going"} Booking</p>
                        </div>
                        <div className="right-leakage">
                          <div className="leakage-img">
                            <img src="images/home/leakage-img.svg" />
                          </div>
                          <div className="right-text">
                            <p className="frist">
                              {item?.serviceName || "Pipe Leakage Fixing"}
                            </p>
                            <p className="sec">
                              {formatTimeDifference(item.scheduledAt) ||
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
                        <p className="see-all">
                          <Link href="/category">
                            See All{" "}
                            <img
                              src="images/home/browse-category/right-arrow.svg"
                              alt="right-arrow"
                            />
                          </Link>
                        </p>
                      </div>
                      <div className="browse-inner">
                        <ul>
                          {data?.categories?.map((item: any) => (
                            <li key={item?.id}>
                              <Link
                                href={`/serviceDetails?categoryId=${item?.id}`}
                                className="wrp-img"
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
                      {data?.quotes?.map((item: any, index: number) => (
                        <div className="my-quotes-inner" key={index}>
                          <div className="add-user">
                            <p className="left">#{item?.quoteId}</p>
                            <p className="right">Additional Services</p>
                          </div>
                          <div className="plumbing">
                            <a href="service-details.html" className="plm">
                              {item?.title || "Plumbing"}{" "}
                              <img
                                src="images/home/up-right-arrow.svg"
                                alt=""
                              />
                            </a>
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
                                  >
                                    Reject
                                  </button>
                                  <button
                                    className="primary-cta rgt"
                                    data-bs-target="#servicesAccepted"
                                    data-bs-toggle="modal"
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

          {data?.popularServices?.length > 0 && (
            <section>
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="popular-service-home">
                      <div className="browse-ctg-head">
                        <h2>Popular Services</h2>
                        <p className="see-all">
                          <Link href="/services">
                            See All{" "}
                            <img
                              src="images/home/browse-category/right-arrow.svg"
                              alt="right-arrow"
                            />
                          </Link>
                        </p>
                      </div>
                      <div
                        className="upcoming-slider"
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          const slide = target.closest("[data-route]");
                          if (slide) {
                            e.stopPropagation();
                            router.push("/quotes");
                          }
                        }}
                      >
                        {data?.popularServices.map(
                          (item: any, index: number) => (
                            <div
                              className="upcoming-my-slide"
                              key={index}
                              data-route="/quotes"
                              style={{
                                cursor: "pointer",
                                position: "relative",
                                zIndex: 999,
                              }}
                            >
                              <div className="upcoming-img">
                                <img
                                  src="images/home/home-slider/1.svg"
                                  alt=""
                                />
                              </div>
                              <div className="upcoming-data">
                                <p className="up-text">
                                  Plumbing - Pipe Leakage Repair
                                </p>
                                <div className="upcm-slider-btn pop-srv">
                                  <button
                                    className="primary-cta upcm-btn pop-srv-btn"
                                    style={{ pointerEvents: "none" }}
                                    tabIndex={-1}
                                  >
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
      <ServiceAccepted />
      <CancelBooking />
    </>
  );
};

export default ClientComponent;
