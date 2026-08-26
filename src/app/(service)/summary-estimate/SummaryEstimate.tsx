"use client";
import RequestModal from "@/components/modals/RequestModal";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { globalServerRequest } from "@/actions/globalApi";
import DatePopup from "@/components/modals/bookingmodals/DatePopup";

interface UserState {
  requestId: number;
  category: { id: number; name: string };
  subCategory: { id: number; name: string };
  subCategories?: any[];
  issue: Array<{ id: number; name: string }>;
  specificIssue: Array<{ id: number; name: string }>;
  description: string;
  mediaUrls: string[];
  estimatedAmount: number;
  status: string;
  createdAt: string;
  ai_summary: any;
}

const SummaryEstimate = () => {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("requestedId");

  const is_quote = searchParams.get("is_quote_edit");
  console.log("Edit", is_quote, "   requestedId ", requestedId);
  const router = useRouter();
  const [showReschedule, setShowReschedule] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([]);
  const [addressId, setAddressId] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // Pehla default open rahega

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  console.log(addressId, "address id of the file");

  const reduxData = useSelector(
    (state: RootState) => state.user.summary_estimate
  ) as UserState | null;

  const [apiEstimate, setApiEstimate] = useState<UserState | null>(null);
  const summary_estimate = apiEstimate || reduxData;
  console.log("summary_estimate", summary_estimate);
  console.log("apiEstimate", apiEstimate);
  console.log("reduxData", reduxData);

  const activeRequestId = requestedId || summary_estimate?.requestId;

  useEffect(() => {
    const fetchQuote = async () => {
      if (!activeRequestId) return;
      try {
        const response = await globalServerRequest({
          endpoint: `quotes/${activeRequestId}`,
          method: "GET",
        });

        const fetchedData = response?.data?.data || response?.data || response;
        console.log("response", fetchedData);
        if (fetchedData) {
          setApiEstimate(fetchedData);
        }
      } catch (error) {
        console.error("Failed to fetch quote data:", error);
        toast.error("Could not load fresh quote details.");
      }
    };

    fetchQuote();
  }, [activeRequestId]);

  const requestQuote = async (
    incomingSlots?: typeof availabilitySlots,
    incomingAddressId?: string
  ) => {
    if (!summary_estimate) {
      toast.error("Estimation details are not available");
      return;
    }

    const targetSlots = incomingSlots || availabilitySlots;

    if (!targetSlots || targetSlots.length === 0) {
      setShowReschedule(true);
      return;
    }

    try {
      const payload = {
        requestId: summary_estimate.requestId,
        addressId:
          incomingAddressId !== undefined ? incomingAddressId : addressId,
        availabilitySlots: targetSlots,
      };

      const response = await globalServerRequest({
        endpoint: "quotes/request",
        method: "POST",
        payload: payload,
      });

      if (response?.success) {
        toast.success("Quote requested successfully!");
        window.dispatchEvent(new Event("cartUpdated"));
        window.dispatchEvent(new Event("newNotification"));
        setShowReschedule(false);
        setIsOpenModal(true);
      } else {
        toast.error(response?.error || "Failed to request quote");
      }
    } catch (error: any) {
      console.error("Error requesting quote:", error);
      toast.error(error?.message || "An unexpected error occurred");
    }
  };

  console.log("summary_estimate here is the data", summary_estimate);

  return (
    <>
      <main>
        <div className="container home-wraper">
          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="browse-wrp">
                    <div className="browse-ctg-head">
                      <h2 className="sub-cate-page">
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            router.back();
                          }}
                          href="#"
                        >
                          <img src="images/home/left-arrow.svg" alt="Back" />
                        </a>
                        {summary_estimate?.subCategories &&
                        summary_estimate.subCategories.length > 1
                          ? "View Details"
                          : "Summary & Estimate"}
                      </h2>
                    </div>

                    <div className="selected-category">
                      <div className="category">
                        <p>Selected Category</p>
                      </div>
                      <h4 style={{ fontSize: "20px", color: "#000" }}>
                        {summary_estimate?.category?.name || "N/A"}
                      </h4>
                    </div>
                    <div
                      className="issue-details-wrp d-flex flex-column gap-3"
                      style={{ padding: "10px" }}
                    >
                      {summary_estimate?.subCategories?.map(
                        (subCat: any, subCatIndex: any) => {
                          const isExpanded = expandedIndex === subCatIndex;
                          return (
                            <div
                              key={subCat?.id || subCatIndex}
                              className="d-flex flex-column gap-3"
                            >
                              <div
                                className="category-accordion-header d-flex justify-content-between align-items-center p-3 bg-white"
                                style={{
                                  borderRadius: "30px",
                                  border: "1px solid #99131833",
                                  cursor: "pointer",
                                }}
                                onClick={() => toggleAccordion(subCatIndex)}
                              >
                                <div className="d-flex flex-column align-items-start w-100">
                                  <p
                                    className="text-muted small mb-1 fw-semibold"
                                    style={{ fontSize: "13px" }}
                                  >
                                    Selected Sub category
                                  </p>
                                  <h4
                                    className="m-0 fw-bold text-black"
                                    style={{ fontSize: "15px", color: "#000" }}
                                  >
                                    {subCatIndex + 1}. {subCat?.name || "N/A"}
                                  </h4>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      transition: "transform 0.2s",
                                      transform: isExpanded
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                      display: "inline-block",
                                    }}
                                  >
                                    ▼
                                  </span>
                                  <Link
                                    href={`/serviceDetails?categoryId=${
                                      summary_estimate?.category?.id || ""
                                    }&requestedId=${
                                      activeRequestId || ""
                                    }&subCategoryId=${subCat?.id || ""}${
                                      is_quote === "1" ? "&is_quote_edit=1" : ""
                                    }&is_quote_update=1`}
                                    className="ml-2"
                                    onClick={(e) => e.stopPropagation()} // Header toggle event ko rokne ke liye
                                  >
                                    <img
                                      src="images/inner-page/edit-icon-c.svg"
                                      alt="Edit"
                                      style={{ width: "14px" }}
                                    />
                                  </Link>
                                </div>
                              </div>
                              {isExpanded && (
                                <div className="d-flex flex-column gap-3 pl-2 transition-all">
                                  {/* CARD 1: Service & Issue Section (Dynamic Loop) */}
                                  <div
                                    className="p-3 bg-white position-relative"
                                    style={{
                                      borderRadius: "24px",
                                      border: "1px solid #99131833",
                                    }}
                                  >
                                    <div className="d-flex justify-content-between align-items-start">
                                      <div className="w-100">
                                        <p
                                          className="small mb-3 fw-semibold text-muted"
                                          style={{ fontSize: "13px" }}
                                        >
                                          Service & Issue
                                        </p>

                                        <ul
                                          className="list-unstyled pl-4 m-0"
                                          style={{
                                            fontSize: "14px",
                                            color: "#222",
                                          }}
                                        >
                                          {subCat?.services?.map(
                                            (item: any, index: any) => (
                                              <li
                                                key={item?.id || index}
                                                className="text-black fw-bold mb-1"
                                                style={{
                                                  fontSize: "15px",
                                                  color: "#111",
                                                }}
                                              >
                                                •{" "}
                                                {typeof item === "object"
                                                  ? item?.title
                                                  : item}{" "}
                                                {item.specificIssues &&
                                                  item.specificIssues.length >
                                                    0 && (
                                                    <ul
                                                      className="list-unstyled pl-4 m-0"
                                                      style={{
                                                        fontSize: "14px",
                                                        color: "#222",
                                                      }}
                                                    >
                                                      {item.specificIssues.map(
                                                        (
                                                          issue: any,
                                                          idx: any
                                                        ) => (
                                                          <li
                                                            key={
                                                              issue?.id || idx
                                                            }
                                                            className="small mb-1 text-secondary"
                                                            style={{
                                                              fontSize: "14px",
                                                              paddingLeft:
                                                                "10px",
                                                            }}
                                                          >
                                                            -{" "}
                                                            {typeof issue ===
                                                            "object"
                                                              ? issue?.name
                                                              : issue}
                                                          </li>
                                                        )
                                                      )}
                                                    </ul>
                                                  )}
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                      <Link
                                        href={`/serviceDetails?categoryId=${
                                          summary_estimate?.category?.id || ""
                                        }&requestedId=${
                                          activeRequestId || ""
                                        }&subCategoryId=${subCat?.id || ""}${
                                          is_quote === "1"
                                            ? "&is_quote_edit=1"
                                            : ""
                                        }&is_quote_update=1`}
                                      >
                                        <img
                                          src="images/inner-page/edit-icon-c.svg"
                                          alt="Edit"
                                          style={{ width: "14px" }}
                                        />
                                      </Link>
                                    </div>
                                  </div>
                                  <div
                                    className="p-3 bg-white position-relative"
                                    style={{
                                      borderRadius: "24px",
                                      border: "1px solid #99131833",
                                    }}
                                  >
                                    <div className="d-flex justify-content-between align-items-start">
                                      <div className="w-100 pr-3">
                                        <p
                                          className="small mb-2 fw-semibold text-muted"
                                          style={{ fontSize: "13px" }}
                                        >
                                          Problem Description
                                        </p>
                                        <p
                                          className="fw-bold text-dark m-0"
                                          style={{
                                            fontSize: "14px",
                                            lineHeight: "1.5",
                                            color: "#222",
                                          }}
                                        >
                                          {subCat?.problemDescription ||
                                            "No description provided"}
                                        </p>
                                      </div>
                                      <Link
                                        href={`/serviceDetails?categoryId=${
                                          summary_estimate?.category?.id || ""
                                        }&requestedId=${
                                          activeRequestId || ""
                                        }&subCategoryId=${subCat?.id || ""}${
                                          is_quote === "1"
                                            ? "&is_quote_edit=1"
                                            : ""
                                        }&is_quote_update=1`}
                                      >
                                        <img
                                          src="images/inner-page/edit-icon-c.svg"
                                          alt="Edit"
                                          style={{ width: "14px" }}
                                        />
                                      </Link>
                                    </div>
                                  </div>
                                  <div
                                    className="p-3 bg-white"
                                    style={{
                                      borderRadius: "24px",
                                      border: "1px solid #99131833",
                                    }}
                                  >
                                    <p
                                      className="small mb-3 fw-semibold text-muted"
                                      style={{ fontSize: "13px" }}
                                    >
                                      Uploaded Image/Video
                                    </p>
                                    <div className="d-flex flex-wrap gap-3">
                                      {subCat?.media?.map(
                                        (url: any, index: any) => (
                                          <img
                                            key={index}
                                            src={
                                              typeof url === "object"
                                                ? url?.url
                                                : url ||
                                                  "images/inner-page/issue-icon.svg"
                                            }
                                            alt={`Uploaded attachment ${
                                              index + 1
                                            }`}
                                            style={{
                                              width: "100px",
                                              height: "100px",
                                              objectFit: "cover",
                                              borderRadius: "20px",
                                              border: "1px solid #eee",
                                            }}
                                          />
                                        )
                                      )}
                                      {(!subCat?.media ||
                                        subCat?.media?.length === 0) && (
                                        <p className="text-muted small m-0">
                                          No media uploaded
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}

                      {summary_estimate?.ai_summary && (
                        <div
                          className="p-3 position-relative d-flex flex-column justify-content-center"
                          style={{
                            backgroundColor: "#FFF8F8", // Halka soft background
                            borderRadius: "20px",
                            borderLeft: "4px solid #8B1414", // Left Red Border Line
                            boxShadow: "0px 2px 8px rgba(0,0,0,0.03)",
                          }}
                        >
                          <h5
                            className="fw-bold mb-1"
                            style={{ fontSize: "15px", color: "#222" }}
                          >
                            AI Smart Analysis
                          </h5>
                          <p
                            className="m-0 text-muted"
                            style={{ fontSize: "13px", lineHeight: "1.5" }}
                          >
                            {summary_estimate?.ai_summary
                              ? summary_estimate?.ai_summary
                              : "The system detected that the seal may be broken causing leakage. You can upload more images or a short video for better diagnosis."}
                          </p>
                        </div>
                      )}
                      {/* Total Estimate Price Section */}
                      <div
                        className="estimated-total mt-3 p-3 d-flex justify-content-between align-items-center"
                        style={{
                          backgroundColor: "#FDF2F2",
                          borderRadius: "20px",
                        }}
                      >
                        <p
                          className="m-0 fw-bold text-dark"
                          style={{ fontSize: "15px" }}
                        >
                          Total Estimate Price
                        </p>
                        <span
                          className="fw-bold text-danger h5 m-0"
                          style={{ color: "#8B1414" }}
                        >
                          {summary_estimate?.estimatedAmount
                            ? `$${summary_estimate.estimatedAmount}`
                            : "N/A"}
                        </span>
                      </div>
                      {is_quote === "1" ? (
                        <div className="request-btn">
                          <button
                            type="button"
                            className="primary-cta"
                            onClick={() =>
                              router.push(`/quotes?is_requested=1`)
                            }
                          >
                            Save Quote
                          </button>
                        </div>
                      ) : (
                        <div className="request-btn">
                          <button
                            type="button"
                            className="secondary-cta"
                            onClick={() =>
                              router.push(
                                `/serviceDetails?categoryId=${
                                  summary_estimate?.category?.id || ""
                                }&requestedId=${activeRequestId || ""}`
                              )
                            }
                          >
                            Save & Add More
                          </button>
                          <button
                            type="button"
                            className="primary-cta"
                            onClick={() => requestQuote()}
                          >
                            Request Quote
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <RequestModal isOpen={isOpenModal} setIsOpen={setIsOpenModal} />
      <DatePopup
        isOpen={showReschedule}
        setIsOpen={setShowReschedule}
        onConfirm={(data: any) => {
          console.log("data****", data);
          const slots = data?.availabilitySlots || [];
          setAvailabilitySlots(slots);
          const selectedAddrId = data?.address || "";
          setAddressId(selectedAddrId);
          if (slots.length > 0) {
            requestQuote(slots, selectedAddrId);
          }
        }}
        getAddressIdCallback={setAddressId}
      />
    </>
  );
};

export default SummaryEstimate;
