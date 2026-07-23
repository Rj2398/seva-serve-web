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
}

const SummaryEstimate = () => {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("requestedId");

  const is_quote = searchParams.get("is_quote_edit");
  console.log("Edit", is_quote, "   requestedId ", requestedId)
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
        console.log("response", fetchedData)
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
        addressId: incomingAddressId !== undefined ? incomingAddressId : addressId,
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

  console.log("summary_estimate here is the data", summary_estimate)

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
                        Summary & Estimate
                      </h2>
                    </div>

                    {/* <div className="issue-details-wrp">
                     
                      <div className="selected-category">
                        <div className="category">
                          <p>Selected Category</p>
                          <Link
                            href={`/serviceDetails?categoryId=${summary_estimate?.category?.id || ""
                              }&requestedId=${activeRequestId || ""}`}
                          >
                            <img
                              src="images/inner-page/edit-icon-c.svg"
                              alt="Edit"
                            />
                          </Link>
                        </div>
                        <h4>{summary_estimate?.category?.name || "N/A"}</h4>
                      </div>

                      <div className="selected-category">
                        <div className="category">
                          <p>Selected Subcategory</p>
                          <Link
                            href={`/serviceDetails?categoryId=${summary_estimate?.category?.id || ""
                              }&requestedId=${activeRequestId || ""}`}
                          >
                            <img
                              src="images/inner-page/edit-icon-c.svg"
                              alt="Edit"
                            />
                          </Link>
                        </div>
                        <h4>{summary_estimate?.subCategory?.name || "N/A"}</h4>
                      </div>

                      <div className="selected-category">
                        <div className="category">
                          <p>Selected Issue</p>
                          <Link
                            href={`/serviceDetails?categoryId=${summary_estimate?.category?.id || ""
                              }&requestedId=${activeRequestId || ""}`}
                          >
                            <img
                              src="images/inner-page/edit-icon-c.svg"
                              alt="Edit"
                            />
                          </Link>
                        </div>
                        <h4>
                          {typeof summary_estimate?.issue?.[0] === "object"
                            ? summary_estimate?.issue?.[0]?.name
                            : summary_estimate?.issue?.[0] || "N/A"}
                        </h4>
                        <div className="mt-2 d-flex flex-wrap gap-1">
                          {summary_estimate?.issue?.map(
                            (item: any, index: any) => (
                              <span
                                className="primary-cta tap"
                                key={item?.id || index}
                              >
                                {typeof item === "object" ? item?.name : item}
                              </span>
                            )
                          )}
                          {summary_estimate?.specificIssue?.map(
                            (item: any, index: any) => (
                              <span
                                className="primary-cta tap bg-secondary text-white"
                                key={item?.id || index}
                              >
                                {typeof item === "object" ? item?.name : item}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <div className="selected-category">
                        <div className="category">
                          <p>Problem Description</p>
                          <Link
                            href={`/serviceDetails?categoryId=${summary_estimate?.category?.id || ""
                              }&requestedId=${activeRequestId || ""}`}
                          >
                            <img
                              src="images/inner-page/edit-icon-c.svg"
                              alt="Edit"
                            />
                          </Link>
                        </div>
                        <h4>
                          {summary_estimate?.description ||
                            "No description provided"}
                        </h4>
                      </div>

                      <div className="upload-img selected-category">
                        <p>Uploaded Image/Video</p>
                        <div className="up-image-wrp">
                          {summary_estimate?.mediaUrls?.map(
                            (url: any, index: any) => (
                              <img
                                key={index}
                                src={url || "images/inner-page/issue-icon.svg"}
                                alt={`Uploaded attachment ${index + 1}`}
                                style={{
                                  maxWidth: "100px",
                                  marginRight: "8px",
                                  borderRadius: "4px",
                                }}
                              />
                            )
                          )}
                        </div>
                      </div>

                      <div className="estimated-total">
                        <div className="estimated">
                          <p>Estimated Amount</p>
                          <span>
                            {summary_estimate?.estimatedAmount
                              ? `$${summary_estimate.estimatedAmount}`
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="request-btn">
                        <button
                          type="button"
                          className="secondary-cta"
                          onClick={() =>
                            router.push(
                              `/serviceDetails?categoryId=${summary_estimate?.category?.id || ""
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
                    </div> */}

                    <div className="selected-category">
                      <div className="category">
                        <p>Selected Category</p>
                        {/* <Link
                          href={`/serviceDetails?categoryId=${summary_estimate?.category?.id || ""
                            }&requestedId=${activeRequestId || ""}`}
                        >
                          <img
                            src="images/inner-page/edit-icon-c.svg"
                            alt="Edit"
                          />
                        </Link> */}
                      </div>
                      <h4 style={{ fontSize: '20px', color: '#000' }}>{summary_estimate?.category?.name || "N/A"}</h4>
                    </div>

                    {/* <div className="issue-details-wrp d-flex flex-column gap-3" style={{ padding: '10px' }}>
                      
                      <div className="category-accordion-header d-flex justify-content-between align-items-center p-3 bg-white"
                        style={{ borderRadius: '30px', border: '1px solid #99131833' }}>

                        <div className="d-flex flex-column align-items-start w-100">
                         
                          <p className="text-muted small mb-2 fw-semibold" style={{ fontSize: '13px' }}>
                            Selected Sub category
                          </p>

                          <h4 className="m-0 mb-2 fw-bold text-black" style={{ fontSize: '15px', color: '#000' }}>
                            1. {summary_estimate?.subCategory?.name || "N/A"}
                          </h4>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                         
                          <i className="bi bi-geo-alt-fill text-muted" style={{ fontSize: '12px', transform: 'rotate(180deg)' }}>▼</i>
                          
                          <Link
                            href={`/serviceDetails?categoryId=${summary_estimate?.category?.id || ""}&requestedId=${activeRequestId || ""}`}
                            className="ml-2"
                          >
                            <img src="images/inner-page/edit-icon-c.svg" alt="Edit" style={{ width: '14px' }} />
                          </Link>
                        </div>
                      </div>

                      <div className="d-flex flex-column gap-3 pl-2">
                        <div className="p-3 bg-white position-relative" style={{ borderRadius: '24px', border: '1px solid #99131833' }}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="w-100">
                              <p className="small mb-3 fw-semibold" style={{ fontSize: '13px' }}>Service & Issue</p>
                             
                              <ul className="list-unstyled pl-4 m-0" style={{ fontSize: '14px', color: '#222' }}>
                                {summary_estimate?.issue?.map((item: any, index: any) => (
                                  <li key={item?.id || index} className="text-black fw-bold mb-1" style={{ fontSize: '15px', color: '#111' }}>
                                    • {typeof item === "object" ? item?.name : item}
                                  </li>
                                ))}
                                {summary_estimate?.specificIssue?.map((item: any, index: any) => (
                                  <li key={item?.id || index} className="small mb-1" style={{ fontSize: '14px', color: '#222', paddingLeft: '10px' }}>
                                    - {typeof item === "object" ? item?.name : item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <Link href={`/serviceDetails?categoryId=${summary_estimate?.category?.id || ""}&requestedId=${activeRequestId || ""}`}>
                              <img src="images/inner-page/edit-icon-c.svg" alt="Edit" style={{ width: '14px' }} />
                            </Link>
                          </div>
                        </div>

                        <div className="p-3 bg-white position-relative" style={{ borderRadius: '24px', border: '1px solid #99131833' }}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="w-100 pr-3">
                              <p className="small mb-2 fw-semibold" style={{ fontSize: '13px' }}>Problem Description</p>
                              <p className="fw-bold text-dark m-0" style={{ fontSize: '14px', lineHeight: '1.5', color: '#222' }}>
                                {summary_estimate?.description || "No description provided"}
                              </p>
                            </div>
                            <Link href={`/serviceDetails?categoryId=${summary_estimate?.category?.id || ""}&requestedId=${activeRequestId || ""}`}>
                              <img src="images/inner-page/edit-icon-c.svg" alt="Edit" style={{ width: '14px' }} />
                            </Link>
                          </div>
                        </div>

                        <div className="p-3 bg-white" style={{ borderRadius: '24px', border: '1px solid #99131833' }}>
                          <p className="small mb-3 fw-semibold" style={{ fontSize: '13px' }}>Uploaded Image/Video</p>
                          <div className="d-flex flex-wrap gap-3">
                            {summary_estimate?.mediaUrls?.map((url: any, index: any) => (
                              <img
                                key={index}
                                src={url || "images/inner-page/issue-icon.svg"}
                                alt={`Uploaded attachment ${index + 1}`}
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                  borderRadius: '20px',
                                  border: "1px solid #eee"
                                }}
                              />
                            ))}
                          </div>
                        </div>

                      </div>
                      <div className="estimated-total mt-3 p-3 d-flex justify-content-between align-items-center"
                        style={{ backgroundColor: '#FDF2F2', borderRadius: '20px' }}>
                        <p className="m-0 fw-bold text-dark" style={{ fontSize: '15px' }}>Total Estimate Price</p>
                        <span className="fw-bold text-danger h5 m-0" style={{ color: '#8B1414' }}>
                          {summary_estimate?.estimatedAmount ? `$${summary_estimate.estimatedAmount}` : "N/A"}
                        </span>
                      </div>

                      <div className="request-btn">
                        <button
                          type="button"
                          className="secondary-cta"
                          onClick={() =>
                            router.push(
                              `/serviceDetails?categoryId=${summary_estimate?.category?.id || ""
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

                    </div> */}

                    <div className="issue-details-wrp d-flex flex-column gap-3" style={{ padding: '10px' }}>
                      {summary_estimate?.subCategories?.map((subCat: any, subCatIndex: any) => {
                        const isExpanded = expandedIndex === subCatIndex;

                        return (
                          <div key={subCat?.id || subCatIndex} className="d-flex flex-column gap-3">
                            {/* 1. Dynamic Subcategory Header (Accordion Style Row) */}
                            <div
                              className="category-accordion-header d-flex justify-content-between align-items-center p-3 bg-white"
                              style={{ borderRadius: '30px', border: '1px solid #99131833', cursor: 'pointer' }}
                              onClick={() => toggleAccordion(subCatIndex)}
                            >
                              <div className="d-flex flex-column align-items-start w-100">
                                {/* Label */}
                                <p className="text-muted small mb-1 fw-semibold" style={{ fontSize: '13px' }}>
                                  Selected Sub category
                                </p>
                                {/* Dynamic Sub Category Name */}
                                <h4 className="m-0 fw-bold text-black" style={{ fontSize: '15px', color: '#000' }}>
                                  {subCatIndex + 1}. {subCat?.name || "N/A"}
                                </h4>
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                {/* Collapse/Expand Arrow Icon */}
                                <span style={{
                                  fontSize: '12px',
                                  transition: 'transform 0.2s',
                                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                  display: 'inline-block'
                                }}>
                                  ▼
                                </span>
                                {/* Edit Link */}
                                <Link
                                  href={`/serviceDetails?categoryId=${summary_estimate?.category?.id || ""}&requestedId=${activeRequestId || ""}&subCategoryId=${subCat?.id || ""}${is_quote === "1" ? "&is_quote_edit=1" : ""}`}
                                  className="ml-2"
                                  onClick={(e) => e.stopPropagation()} // Header toggle event ko rokne ke liye
                                >
                                  <img src="images/inner-page/edit-icon-c.svg" alt="Edit" style={{ width: '14px' }} />
                                </Link>
                              </div>
                            </div>

                            {/* Conditional Rendering base on Collapse State */}
                            {isExpanded && (
                              <div className="d-flex flex-column gap-3 pl-2 transition-all">

                                {/* CARD 1: Service & Issue Section (Dynamic Loop) */}
                                <div className="p-3 bg-white position-relative" style={{ borderRadius: '24px', border: '1px solid #99131833' }}>
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div className="w-100">
                                      <p className="small mb-3 fw-semibold text-muted" style={{ fontSize: '13px' }}>Service & Issue</p>

                                      <ul className="list-unstyled pl-4 m-0" style={{ fontSize: '14px', color: '#222' }}>
                                        {subCat?.services?.map((item: any, index: any) => (
                                          <li key={item?.id || index} className="text-black fw-bold mb-1" style={{ fontSize: '15px', color: '#111' }}>
                                            • {typeof item === "object" ? item?.title : item}  {
                                              item.specificIssues && item.specificIssues.length > 0 && (
                                                <ul className="list-unstyled pl-4 m-0" style={{ fontSize: '14px', color: '#222' }}>
                                                  {item.specificIssues.map((issue: any, idx: any) => (
                                                    <li key={issue?.id || idx} className="small mb-1 text-secondary" style={{ fontSize: '14px', paddingLeft: '10px' }}>
                                                      - {typeof issue === "object" ? issue?.name : issue}
                                                    </li>
                                                  ))}
                                                </ul>
                                              )
                                            }
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <Link href={`/serviceDetails?categoryId=${summary_estimate?.category?.id || ""}&requestedId=${activeRequestId || ""}&subCategoryId=${subCat?.id || ""}${is_quote === "1" ? "&is_quote_edit=1" : ""}`}>
                                      <img src="images/inner-page/edit-icon-c.svg" alt="Edit" style={{ width: '14px' }} />
                                    </Link>
                                  </div>
                                </div>
                                {/* CARD 2: Problem Description Section */}
                                <div className="p-3 bg-white position-relative" style={{ borderRadius: '24px', border: '1px solid #99131833' }}>
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div className="w-100 pr-3">
                                      <p className="small mb-2 fw-semibold text-muted" style={{ fontSize: '13px' }}>Problem Description</p>
                                      <p className="fw-bold text-dark m-0" style={{ fontSize: '14px', lineHeight: '1.5', color: '#222' }}>
                                        {subCat?.problemDescription || "No description provided"}
                                      </p>
                                    </div>
                                    <Link href={`/serviceDetails?categoryId=${summary_estimate?.category?.id || ""}&requestedId=${activeRequestId || ""}&subCategoryId=${subCat?.id || ""}${is_quote === "1" ? "&is_quote_edit=1" : ""}`}>
                                      <img src="images/inner-page/edit-icon-c.svg" alt="Edit" style={{ width: '14px' }} />
                                    </Link>
                                  </div>
                                </div>

                                {/* CARD 3: Uploaded Image/Video Section */}
                                <div className="p-3 bg-white" style={{ borderRadius: '24px', border: '1px solid #99131833' }}>
                                  <p className="small mb-3 fw-semibold text-muted" style={{ fontSize: '13px' }}>Uploaded Image/Video</p>
                                  <div className="d-flex flex-wrap gap-3">
                                    {subCat?.media?.map((url: any, index: any) => (
                                      <img
                                        key={index}
                                        src={typeof url === "object" ? url?.url : url || "images/inner-page/issue-icon.svg"}
                                        alt={`Uploaded attachment ${index + 1}`}
                                        style={{
                                          width: "100px",
                                          height: "100px",
                                          objectFit: "cover",
                                          borderRadius: '20px',
                                          border: "1px solid #eee"
                                        }}
                                      />
                                    ))}
                                    {(!subCat?.media || subCat?.media?.length === 0) && (
                                      <p className="text-muted small m-0">No media uploaded</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {/* Total Estimate Price Section */}
                      <div className="estimated-total mt-3 p-3 d-flex justify-content-between align-items-center"
                        style={{ backgroundColor: '#FDF2F2', borderRadius: '20px' }}>
                        <p className="m-0 fw-bold text-dark" style={{ fontSize: '15px' }}>Total Estimate Price</p>
                        <span className="fw-bold text-danger h5 m-0" style={{ color: '#8B1414' }}>
                          {summary_estimate?.estimatedAmount ? `$${summary_estimate.estimatedAmount}` : "N/A"}
                        </span>
                      </div>
                      {/* Action Buttons */}
                      {
                        (is_quote === "1") ? (
                          <div className="request-btn">
                            <button
                              type="button"
                              className="primary-cta"
                              onClick={() =>
                                router.push(
                                  `/quotes?is_requested=1`
                                )
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
                                  `/serviceDetails?categoryId=${summary_estimate?.category?.id || ""
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
                        )
                      }


                    </div>

                  </div>
                </div>
              </div>
            </div>
          </section >
        </div >
      </main >

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

// "use client";
// import RequestModal from "@/components/modals/RequestModal";
// import { useRouter, useSearchParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import { RootState } from "@/store";
// import { useSelector } from "react-redux";
// import { globalServerRequest } from "@/actions/globalApi";
// import DatePopup from "@/components/modals/bookingmodals/DatePopup";

// interface UserState {
//   requestId: number;
//   category: { id: number; name: string };
//   subCategory: { id: number; name: string };
//   issue: Array<{ id: number; name: string }>;
//   specificIssue: Array<{ id: number; name: string }>;
//   description: string;
//   mediaUrls: string[];
//   estimatedAmount: number;
//   status: string;
//   createdAt: string;
// }

// const SummaryEstimate = () => {
//   const searchParams = useSearchParams();
//   const requestedId = searchParams.get("requestedId");

//   const router = useRouter();
//   const [showReschedule, setShowReschedule] = useState<boolean>(false);
//   const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

//   const [availabilitySlots, setAvailabilitySlots] = useState<unknown[]>([]);
//   const summaryEstimate = useSelector((state: RootState) => state.user) as {
//     summary_estimate: UserState | null;
//   };

//   console.log(summaryEstimate?.summary_estimate?.requestId, "TstTestTest");

//   const [summary_estimate, setSummyEstimate] = useState<any>(
//     summaryEstimate?.summary_estimate
//   );
//   console.log(
//     summary_estimate,
//     "summary_estimatesummary_estimate",
//     summary_estimate?.requestId
//   );

//   const requestId = summaryEstimate?.summary_estimate?.requestId;

//   useEffect(() => {
//     const fetchQuote = async () => {
//       if (!requestedId || !requestId) return; // Guard clause: don't call if ID isn't ready yet

//       try {
//         const response = await globalServerRequest({
//           endpoint: `quotes/${requestedId || requestId}`,
//           method: "GET",
//         });

//         setSummyEstimate(response?.data?.data);
//         console.log(response.data?.data, "response data comes here");
//       } catch (error) {
//         console.error("Failed to fetch quote data:", error);
//         toast.error("Could not load quote details.");
//       }
//     };

//     fetchQuote();
//   }, [requestId]);

//   const requestQuote = async (incomingSlots?: typeof availabilitySlots) => {
//     if (!summary_estimate) {
//       toast.error("Estimation details are not available");
//       return;
//     }

//     const targetSlots = incomingSlots || availabilitySlots;

//     // CHECK: If we don't have slots data, break out and open the picker modal
//     if (!targetSlots || targetSlots.length === 0) {
//       setShowReschedule(true);
//       return;
//     }

//     // Otherwise, execute the API request immediately
//     try {
//       const payload = {
//         requestId: summary_estimate.requestId,
//         addressId: 23, // Static fallback until address section is done
//         availabilitySlots: targetSlots,
//       };

//       const response = await globalServerRequest({
//         endpoint: "quotes/request",
//         method: "POST",
//         payload: payload,
//         isFormData: false,
//       });

//       if (response?.success) {
//         toast.success("Quote requested successfully!");

//         // Close the date picker modal (if it was open)
//         setShowReschedule(false);

//         // NOW safely open the success confirmation modal
//         setIsOpenModal(true);
//       } else {
//         toast.error(response?.error || "Failed to request quote");
//       }
//     } catch (error: any) {
//       console.error("Error requesting quote:", error);
//       toast.error(error?.message || "An unexpected error occurred");
//     }
//   };

//   return (
//     <>
//       <main>
//         <div className="container home-wraper">
//           <section>
//             <div className="container">
//               <div className="row">
//                 <div className="col-lg-12">
//                   <div className="browse-wrp">
//                     <div className="browse-ctg-head">
//                       <h2 className="sub-cate-page">
//                         <a
//                           onClick={(e) => {
//                             e.preventDefault();
//                             router.back();
//                           }}
//                           href="#"
//                         >
//                           <img src="images/home/left-arrow.svg" alt="Back" />
//                         </a>
//                         Summary & Estimate
//                       </h2>
//                     </div>
//                     <div className="issue-details-wrp">
//                       {/* Category */}
//                       <div className="selected-category">
//                         <div className="category">
//                           <p>Selected Category</p>
//                           <Link href="/serviceDetails">
//                             <img
//                               src="images/inner-page/edit-icon-c.svg"
//                               alt="Edit"
//                             />
//                           </Link>
//                         </div>
//                         <h4>{summary_estimate?.category?.name || "N/A"}</h4>
//                       </div>

//                       {/* Subcategory */}
//                       <div className="selected-category">
//                         <div className="category">
//                           <p>Selected Subcategory</p>
//                           <Link href="/serviceDetails">
//                             <img
//                               src="images/inner-page/edit-icon-c.svg"
//                               alt="Edit"
//                             />
//                           </Link>
//                         </div>
//                         <h4>{summary_estimate?.subCategory?.name || "N/A"}</h4>
//                       </div>

//                       {/* Issue mapping */}
//                       <div className="selected-category">
//                         <div className="category">
//                           <p>Selected Issue</p>
//                           <Link href="/serviceDetails">
//                             <img
//                               src="images/inner-page/edit-icon-c.svg"
//                               alt="Edit"
//                             />
//                           </Link>
//                         </div>
//                         <h4>{summary_estimate?.issue?.[0]?.name || "N/A"}</h4>
//                         <div className="mt-2 d-flex flex-wrap gap-1">
//                           {summary_estimate?.issue?.map(
//                             (item: any, index: any) => (
//                               <span
//                                 className="primary-cta tap"
//                                 key={item.id || index}
//                               >
//                                 {item.name}
//                               </span>
//                             )
//                           )}
//                           {summary_estimate?.specificIssue?.map(
//                             (item: any, index: any) => (
//                               <span
//                                 className="primary-cta tap bg-secondary text-white"
//                                 key={item.id || index}
//                               >
//                                 {item.name}
//                               </span>
//                             )
//                           )}
//                         </div>
//                       </div>

//                       {/* Problem Description */}
//                       <div className="selected-category">
//                         <div className="category">
//                           <p>Problem Description</p>
//                           <Link href="/serviceDetails">
//                             <img
//                               src="images/inner-page/edit-icon-c.svg"
//                               alt="Edit"
//                             />
//                           </Link>
//                         </div>
//                         <h4>
//                           {summary_estimate?.description ||
//                             "No description provided"}
//                         </h4>
//                       </div>

//                       {/* Media URL mapping */}
//                       <div className="upload-img selected-category">
//                         <p>Uploaded Image/Video</p>
//                         <div className="up-image-wrp">
//                           {summary_estimate?.mediaUrls?.map(
//                             (url: any, index: any) => (
//                               <img
//                                 key={index}
//                                 src={url || "images/inner-page/issue-icon.svg"}
//                                 alt={`Uploaded attachment ${index + 1}`}
//                                 style={{
//                                   maxWidth: "100px",
//                                   marginRight: "8px",
//                                   borderRadius: "4px",
//                                 }}
//                               />
//                             )
//                           )}
//                         </div>
//                       </div>

//                       {/* Estimate Section */}
//                       <div className="estimated-total">
//                         <div className="estimated">
//                           <p>Estimated Amount</p>
//                           <span>
//                             {summary_estimate?.estimatedAmount
//                               ? `$${summary_estimate.estimatedAmount}`
//                               : "N/A"}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Buttons */}
//                       <div className="request-btn">
//                         <button
//                           type="button"
//                           className="secondary-cta"
//                           onClick={() => router.push("/serviceDetails")}
//                         >
//                           Save & Add More
//                         </button>

//                         {/* FIXED: Removed data-bs attributes that bypass React controls */}
//                         <button
//                           type="button"
//                           className="primary-cta"
//                           onClick={() => requestQuote()}
//                         >
//                           Request Quote
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>

//       {/* Success Modal controlled safely by React status */}
//       <RequestModal isOpen={isOpenModal} setIsOpen={setIsOpenModal} />

//       {/* Date Slots selection modal */}
//       <DatePopup
//         isOpen={showReschedule}
//         setIsOpen={setShowReschedule}
//         onConfirm={(data) => {
//           const slots = data?.availabilitySlots || [];
//           setAvailabilitySlots(slots);

//           if (slots.length > 0) {
//             requestQuote(slots);
//           }
//         }}
//       />
//     </>
//   );
// };

// export default SummaryEstimate;

// date-25-06-2026

// "use client";
// import RequestModal from "@/components/modals/RequestModal";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import { RootState } from "@/store";
// import { useSelector } from "react-redux";
// import { globalServerRequest } from "@/actions/globalApi";
// import DatePopup from "@/components/modals/bookingmodals/DatePopup";

// // 1. Updated interface to match your exact summary_estimate payload
// interface UserState {
//   requestId: number;
//   category: { id: number; name: string };
//   subCategory: { id: number; name: string };
//   issue: Array<{ id: number; name: string }>;
//   specificIssue: Array<{ id: number; name: string }>;
//   description: string;
//   mediaUrls: string[];
//   estimatedAmount: number;
//   status: string;
//   createdAt: string;
// }

// const SummaryEstimate = () => {
//   const router = useRouter();
//   const [showReschedule, setShowReschedule] = useState<any>(false);
//   const [isOpenModal, setIsOpenModal] = useState(false);

//   const [availabilitySlots, setAvailabilitySlots] = useState<unknown[]>([]);
//   const { summary_estimate } = useSelector(
//     (state: RootState) => state.user
//   ) as {
//     summary_estimate: UserState | null;
//   };

//   console.log(summary_estimate, "summary_estimate");

//   const requestQuote = async (incomingSlots?: typeof availabilitySlots) => {
//     if (!summary_estimate) {
//       toast.error("Estimation details are not available");
//       return;
//     }

//     const targetSlots = incomingSlots || availabilitySlots;

//     // CHECK: If we don't have slots data, break out and open the picker modal
//     if (!targetSlots || targetSlots.length === 0) {
//       setShowReschedule(true);
//       return;
//     }

//     // Otherwise, execute the API request immediately
//     try {
//       const payload = {
//         requestId: summary_estimate.requestId,
//         addressId: 23, // Static fallback until address section is done
//         availabilitySlots: targetSlots,
//       };

//       const response = await globalServerRequest({
//         endpoint: "quotes/request",
//         method: "POST",
//         payload: payload,
//         isFormData: false,
//       });

//       if (response?.success) {
//         toast.success("Quote requested successfully!");
//         setIsOpenModal(true);
//         // If you need to programmatically trigger your success modal:
//         // setIsSuccessModalOpen(true);
//       } else {
//         toast.error(response?.error || "Failed to request quote");
//       }
//     } catch (error: any) {
//       console.error("Error requesting quote:", error);
//       toast.error(error?.message || "An unexpected error occurred");
//     }
//   };

//   // const handleClick = async () => {
//   //   if (!summary_estimate) {
//   //     toast.error("Estimation details are not available");
//   //     return;
//   //   }

//   //   try {
//   //     const formData = new FormData();

//   //     // 1. Append standard text identifiers
//   //     formData.append(
//   //       "categoryId",
//   //       String(summary_estimate.category?.id || "")
//   //     );
//   //     formData.append(
//   //       "subCategoryId",
//   //       String(summary_estimate.subCategory?.id || "")
//   //     );

//   //     if (summary_estimate.issue?.[0]?.id) {
//   //       formData.append("issueId", String(summary_estimate.issue[0].id));
//   //     }

//   //     if (summary_estimate.specificIssue?.[0]?.id) {
//   //       formData.append(
//   //         "specificIssueId",
//   //         String(summary_estimate.specificIssue[0].id)
//   //       );
//   //     }

//   //     formData.append("description", summary_estimate.description || "");

//   //     // 2. Simply loop and append the original remote URL strings directly
//   //     if (summary_estimate.mediaUrls && summary_estimate.mediaUrls.length > 0) {
//   //       summary_estimate.mediaUrls.forEach((url, index) => {
//   //         formData.append(`mediaUrls[${index}]`, url);
//   //       });
//   //     }

//   //     // 3. Dispatch payload out to the server
//   // const response = await globalServerRequest({
//   //   endpoint: "quotes/save-quote",
//   //   method: "POST",
//   //   payload: formData,
//   //   isFormData: true,
//   // });

//   //     if (response?.success) {
//   //       toast.success("Quote saved successfully!");
//   //     } else {
//   //       toast.error(response?.error || "Failed to save quote");
//   //     }
//   //   } catch (error: any) {
//   //     console.error("Error saving quote layout:", error);
//   //     toast.error(error?.message || "An unexpected error occurred");
//   //   }
//   // };

//   return (
//     <>
//       <main>
//         <div className="container home-wraper">
//           <section>
//             <div className="container">
//               <div className="row">
//                 <div className="col-lg-12">
//                   <div className="browse-wrp">
//                     <div className="browse-ctg-head">
//                       <h2 className="sub-cate-page">
//                         <a
//                           onClick={(e) => {
//                             e.preventDefault();
//                             router.back();
//                           }}
//                           href="#"
//                         >
//                           <img src="images/home/left-arrow.svg" alt="Back" />
//                         </a>
//                         Summary & Estimate
//                       </h2>
//                     </div>
//                     <div className="issue-details-wrp">
//                       {/* Category */}
//                       <div className="selected-category">
//                         <div className="category">
//                           <p>Selected Category</p>
//                           <Link href="/serviceDetails">
//                             <img
//                               src="images/inner-page/edit-icon-c.svg"
//                               alt="Edit"
//                             />
//                           </Link>
//                         </div>
//                         <h4>{summary_estimate?.category?.name || "N/A"}</h4>
//                       </div>

//                       {/* Subcategory */}
//                       <div className="selected-category">
//                         <div className="category">
//                           <p>Selected Subcategory</p>
//                           <Link href="/serviceDetails">
//                             <img
//                               src="images/inner-page/edit-icon-c.svg"
//                               alt="Edit"
//                             />
//                           </Link>
//                         </div>
//                         <h4>{summary_estimate?.subCategory?.name || "N/A"}</h4>
//                       </div>

//                       {/* Issue mapping */}
//                       <div className="selected-category">
//                         <div className="category">
//                           <p>Selected Issue</p>
//                           <Link href="/serviceDetails">
//                             <img
//                               src="images/inner-page/edit-icon-c.svg"
//                               alt="Edit"
//                             />
//                           </Link>
//                         </div>
//                         <h4>{summary_estimate?.issue?.[0]?.name || "N/A"}</h4>
//                         <div className="mt-2 d-flex flex-wrap gap-1">
//                           {summary_estimate?.issue?.map((item, index) => (
//                             <span
//                               className="primary-cta tap"
//                               key={item.id || index}
//                             >
//                               {item.name}
//                             </span>
//                           ))}
//                           {/* Optional: if you also want to show specific issues */}
//                           {summary_estimate?.specificIssue?.map(
//                             (item, index) => (
//                               <span
//                                 className="primary-cta tap bg-secondary text-white"
//                                 key={item.id || index}
//                               >
//                                 {item.name}
//                               </span>
//                             )
//                           )}
//                         </div>
//                       </div>

//                       {/* Problem Description */}
//                       <div className="selected-category">
//                         <div className="category">
//                           <p>Problem Description</p>
//                           <Link href="/serviceDetails">
//                             <img
//                               src="images/inner-page/edit-icon-c.svg"
//                               alt="Edit"
//                             />
//                           </Link>
//                         </div>
//                         <h4>
//                           {summary_estimate?.description ||
//                             "No description provided"}
//                         </h4>
//                       </div>

//                       {/* Media URL mapping */}
//                       <div className="upload-img selected-category">
//                         <p>Uploaded Image/Video</p>
//                         <div className="up-image-wrp">
//                           {summary_estimate?.mediaUrls?.map((url, index) => (
//                             <img
//                               key={index}
//                               src={url || "images/inner-page/issue-icon.svg"}
//                               alt={`Uploaded attachment ${index + 1}`}
//                               style={{
//                                 maxWidth: "100px",
//                                 marginRight: "8px",
//                                 borderRadius: "4px",
//                               }}
//                             />
//                           ))}
//                         </div>
//                       </div>

//                       {/* Estimate Section (Using estimatedAmount) */}
//                       <div className="estimated-total">
//                         <div className="estimated">
//                           <p>Estimated Amount</p>
//                           <span>
//                             {summary_estimate?.estimatedAmount
//                               ? `$${summary_estimate.estimatedAmount}`
//                               : "N/A"}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Buttons */}
//                       <div className="request-btn">
//                         <button
//                           type="button"
//                           className="secondary-cta"
//                           onClick={() => router.push("/serviceDetails")}
//                         >
//                           Save & Add More
//                         </button>
//                         <button
//                           type="button"
//                           data-bs-target="#requestSuccessfully"
//                           data-bs-toggle="modal"
//                           className="primary-cta"
//                           onClick={() => requestQuote()}
//                         >
//                           Request Quote
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>

//       <RequestModal isOpen={isOpenModal} setIsOpen={setIsOpenModal} />
//       <DatePopup
//         isOpen={showReschedule}
//         setIsOpen={setShowReschedule}
//         onConfirm={(data) => {
//           const slots = data?.availabilitySlots || [];
//           setAvailabilitySlots(slots); // Sync back to your parent page state array

//           if (slots.length > 0) {
//             requestQuote(slots); // Pass the fresh slots array directly to fire the API
//           }
//         }}
//       />
//     </>
//   );
// };

// export default SummaryEstimate;

// "use client";
// import RequestModal from "@/components/modals/RequestModal";
// import { estimation } from "../../../json/service-detail.json";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";
// interface UserState {
//   id: string;
//   name: string;
//   summary_estimate: any; // Typed here
//   category: any;
// }
// const SummaryEstimate = () => {
//   const router = useRouter();
// const { summary_estimate } = useSelector(
//   (state: RootState) => state.user
// ) as {
//   summary_estimate: UserState | null;
// };

//   const summary_estimate = {
//     requestId: "Q-2026-1295",
//     category: {
//       id: 1,
//       name: "Plumbing",
//     },
//     subCategory: {
//       id: 4,
//       name: "Repair",
//     },
//     issue: [
//       {
//         id: 1,
//         name: "Deep Home Cleaning",
//       },
//     ],
//     specificIssue: [
//       {
//         id: 19,
//         name: "Full House Dust Removal",
//       },
//     ],
//     description: "test",
//     mediaUrls: [
//       "http://seva.tgastaging.com/public/storage/customer/27/58f0a050-613c-4d97-823f-c1fd6631726c.jpeg",
//     ],
//     estimatedAmount: 3000,
//     status: "",
//     createdAt: "2026-06-22T05:52:26.000000Z",
//   };

//   console.log(summary_estimate, "summary_estimate");

//   const [estimationDetails, setEstimationDetails] = useState(estimation);

//   const handleClick = () => {
//     if (estimationDetails) {
//       toast.error("estimation details is not available");
//     }
//   };

//   return (
//     <>
//       <main>
//         <div className="container home-wraper">
//           <section>
//             <div className="container">
//               <div className="row">
//                 <div className="col-lg-12">
//                   <div className="browse-wrp">
//                     <div className="browse-ctg-head">
//                       <h2 className="sub-cate-page">
//                         {" "}
//                         <a
//                           onClick={(e) => {
//                             e.preventDefault();
//                             router.back();
//                           }}
//                         >
//                           <img src="images/home/left-arrow.svg" alt="" />
//                         </a>
//                         Summary & Estimate
//                       </h2>
//                     </div>
//                     <div className="issue-details-wrp">
//                       <div className="selected-category">
//                         <div className="category">
//                           <p>Selected Category</p>
//                           <Link href="/serviceDetails">
//                             <img
//                               src="images/inner-page/edit-icon-c.svg"
//                               alt=""
//                             />
//                           </Link>
//                         </div>
//                         <h4>{summary_estimate?.category?.name}</h4>
//                       </div>

//                       <div className="selected-category">
//                         <div className="category">
//                           <p>Selected Subcategory</p>
//                           <Link href="/serviceDetails">
//                             <img
//                               src="images/inner-page/edit-icon-c.svg"
//                               alt=""
//                             />
//                           </Link>
//                         </div>
//                         <h4>{summary_estimate?.subCategory?.name}</h4>
//                       </div>

//                       <div className="selected-category">
//                         <div className="category">
//                           <p>Selected Issue</p>
//                           <Link href="/serviceDetails">
//                             <img
//                               src="images/inner-page/edit-icon-c.svg"
//                               alt=""
//                             />
//                           </Link>
//                         </div>
//                         <h4>
//                           {estimationDetails?.issue?.title ||
//                             "Tap / Faucet Installation"}
//                         </h4>
//                         {summary_estimate?.issue?.map(
//                           (item: any, index: number) => (
//                             <span className="primary-cta tap" key={index}>
//                               {item}
//                             </span>
//                           )
//                         )}
//                       </div>

//                       <div className="selected-category">
//                         <div className="category">
//                           <p>Problem Description</p>
//                           <Link href="/serviceDetails">
//                             <img
//                               src="images/inner-page/edit-icon-c.svg"
//                               alt=""
//                             />
//                           </Link>
//                         </div>
//                         <h4>{summary_estimate?.description}</h4>
//                       </div>

//                       <div className="upload-img selected-category">
//                         <p>Uploaded Image/Video</p>
//                         <div className="up-image-wrp">
//                           {summary_estimate?.mediaUrls.map(() => (
//                             <img
//                               src="images/inner-page/issue-icon.svg"
//                               alt=""
//                             />
//                           ))}
//                         </div>
//                       </div>

//                       <div className="estimated-total">
//                         <div className="estimated">
//                           <p>Estimated Total (range)</p>
//                           <span>
//                             {`$${estimationDetails?.estimate?.minimum} - $${estimationDetails?.estimate?.maximum}` ||
//                               "$149-$299"}
//                           </span>
//                         </div>
//                         <div className="avrg">
//                           <p>Average cost</p>
//                           <span>
//                             {`$${estimationDetails?.estimate?.average_cost}` ||
//                               "$224"}{" "}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="request-btn">
//                         <button
//                           type="button"
//                           className="secondary-cta"
//                           data-bs-dismiss="modal"
//                           onClick={() => router.push("/serviceDetails")}
//                         >
//                           Save & Add More
//                         </button>
//                         <button
//                           type="button"
//                           data-bs-target="#requestSuccessfully"
//                           data-bs-toggle="modal"
//                           className="primary-cta"
//                           onClick={() => handleClick()}
//                         >
//                           Save & Add to Service Cart
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>

//       <RequestModal />
//     </>
//   );
// };

// export default SummaryEstimate;
