"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { serviceDetails } from "../../../json/service-detail.json";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { globalServerRequest } from "@/actions/globalApi";
import { useDispatch } from "react-redux";
import { setSummaryestimate } from "@/store/slices/userSlice";

const normalizeData = (data: any) => {
  if (!data) return null;

  // If it's already in the new format
  if (data.subCategories) {
    return data;
  }

  // Convert old mock structure to new schema format
  return {
    category: {
      id: data.category?.id || 1,
      name: data.service?.category || "Plumbing",
      bannerImageUrl:
        data.service?.banner_image ||
        "images/service-details/service-banner.svg",
    },
    subCategories: (data.sub_categories || []).map((sub: any) => ({
      id: sub.id,
      name: sub.name,
      issues: (data.facingIssues || [])
        .filter(
          (issue: any) => String(issue.sub_category_id) === String(sub.id)
        )
        .map((issue: any) => ({
          id:
            typeof issue.id === "string" && issue.id.startsWith("issue_")
              ? parseInt(issue.id.replace("issue_", ""), 10)
              : issue.id,
          title: issue.issue_type?.title || "Issue Title",
          description: issue.issue_type?.description || "Issue Description",
          imageUrl:
            issue.issue_type?.imageUrl ||
            "images/service-details/service-issue.svg",
          specificIssues: (issue.issue_options || []).map((opt: any) => ({
            id: opt.id,
            name: opt.title || "Option Title",
          })),
        })),
    })),
  };
};

export default function ServiceViewDetail({
  initialData,
}: {
  initialData: any;
}) {
  const dispatch = useDispatch();
  console.log(initialData, "initial data***");

  // FIX: Unified selectedOptionId with selectedSpecificIssueId so state flows down to the API payload correctly
  const [selectedSpecificIssueId, setSelectedSpecificIssueId] = useState<
    number | null
  >(null);

  const isLoggedIn =
    typeof window !== "undefined"
      ? localStorage.getItem("isLoggedIn") ?? "false"
      : "false";

  const router = useRouter();

  const initialNormalized = normalizeData(initialData || serviceDetails);

  const [serviceDetailss, setServiceDetails] = useState<any>(initialNormalized);
  const [subCategories, setSubCategories] = useState<any[]>(
    initialNormalized?.subCategories || []
  );
  const [addedCategory, setAddedCategory] = useState<boolean>(false);
  const [selectSubCategories, setSelectSubCategories] = useState<any>(
    initialNormalized?.subCategories?.[0]?.id
  );
  const [problemDesc, setProblemDesc] = useState<string>(
    serviceDetailss?.problemDesc || ""
  );
  const [uploadedImg, setUploadedImage] = useState<string[]>(
    serviceDetailss?.uploadedImg || []
  );
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Sync state if initialData changes via route update
  useEffect(() => {
    const normalized = normalizeData(initialData || serviceDetails);
    if (normalized) {
      setServiceDetails(normalized);
      setSubCategories(normalized.subCategories || []);
      if (normalized.subCategories?.length > 0) {
        setSelectSubCategories(normalized.subCategories[0].id);
      } else {
        setSelectSubCategories(null);
      }
    }
  }, [initialData]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const fileArray = Array.from(files);
      const imageUrls = fileArray.map((file) => URL.createObjectURL(file));

      setUploadedImage((prev) => [...prev, ...imageUrls]);
      setUploadedFiles((prev) => [...prev, ...fileArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImage((prev) => prev.filter((_, i) => i !== index));
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleServiceCart = async (
    actionType: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();

    if (!isLoggedIn || isLoggedIn === "false") {
      if (typeof window !== "undefined" && (window as any).bootstrap) {
        const loginModalElement = document.getElementById("login-screen-1");

        if (loginModalElement) {
          const bootstrapModal =
            (window as any).bootstrap.Modal.getInstance(loginModalElement) ||
            new (window as any).bootstrap.Modal(loginModalElement);

          bootstrapModal.show();
        }
      }
      return;
    }

    if (!addedCategory) {
      toast.error("please select sub Category");
    } else if (uploadedImg.length === 0) {
      toast.error("please upload at least one video/image");
    } else if (!problemDesc) {
      toast.error("please enter the description");
    } else {
      try {
        const formData = new FormData();

        // categoryId
        if (serviceDetailss?.category?.id) {
          formData.append("categoryId", String(serviceDetailss.category.id));
        }

        // subCategoryId
        if (selectSubCategories) {
          formData.append("subCategoryId", String(selectSubCategories));
        }

        // issueId
        if (activeIssueId) {
          const cleanIssueId = String(activeIssueId).replace("issue_", "");
          formData.append("issueId", cleanIssueId);
        }

        // specificIssueId
        if (selectedSpecificIssueId) {
          formData.append("specificIssueId", String(selectedSpecificIssueId));
        }

        // description
        formData.append("description", problemDesc);

        // mediaUrls
        uploadedFiles.forEach((file, index) => {
          formData.append(`mediaUrls[${index}]`, file);
        });

        const response = await globalServerRequest({
          endpoint:
            actionType === "addtocart" ? "cart/add-cart" : "quotes/save-quote",
          method: "POST",
          payload: formData,
          isFormData: true,
        });

        if (!response.success) {
          throw new Error(response.error || "Failed to add service to cart");
        }
        const apiNavigateData = response.data;
        const requestedId = response?.data?.data?.requestId;

        toast.success(
          actionType === "addtocart"
            ? "Added to cart!"
            : "Quote saved successfully!"
        );
        // dispatch(setSummaryestimate(apiNavigateData?.data));//when api got called
        if (actionType === "checkout")
          router.push(`/summary-estimate?requestedId=${requestedId}`);

        if (actionType === "addtocart") router.push(`/`);

        setAddedCategory(false);
        setProblemDesc("");
        setUploadedImage([]);
        setUploadedFiles([]);
        setActiveIssueId(null);
        setSelectedSpecificIssueId(null);
      } catch (error: any) {
        console.error("Failed to add to cart:", error);
        toast.error(
          error?.message || error?.error || "Failed to add service to cart"
        );
      }
    }
  };

  const activeSubCategory = subCategories?.find(
    (sub: any) => String(sub.id) === String(selectSubCategories)
  );
  const activeIssues = activeSubCategory?.issues || [];

  return (
    <>
      <main>
        <div
          className="container home-wraper my-profile"
          style={{ height: "auto" }}
        >
          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="browse-wrp">
                    <div className="browse-ctg-head my-con-head">
                      <h2 className="sub-cate-page">
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            router.back();
                          }}
                        >
                          <img src="images/home/left-arrow.svg" alt="" />
                        </a>
                        {serviceDetailss?.category?.name || "NA"}
                      </h2>
                      <div className="your-location-top">
                        <input
                          type="text"
                          placeholder="Search"
                          className="top-srch"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="service-details-wrp">
                    <div className="service-details-banner">
                      <div className="service-details-banner-data">
                        <h1>
                          {" "}
                          Expert {serviceDetailss?.category?.name || "NA"}{" "}
                          Services{" "}
                        </h1>
                        <p>
                          Fast <i className="fa-solid fa-circle"></i> Reliable
                          <i className="fa-solid fa-circle"></i> Verified
                          Contractors
                        </p>
                      </div>
                      <img
                        src={
                          serviceDetailss?.category?.bannerImageUrl ||
                          "images/service-details/service-banner.svg"
                        }
                        alt=""
                      />
                    </div>

                    <div className="service-details-sub-cat">
                      <h3>Choose a Sub-category</h3>

                      <div className="sub-cat-filtr-btns">
                        {subCategories?.map((item) => (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectSubCategories(item?.id);
                              setActiveIssueId(null);
                              setAddedCategory(false);
                              setSelectedSpecificIssueId(null);
                            }}
                            className={
                              String(selectSubCategories) === String(item?.id)
                                ? "active"
                                : ""
                            }
                            key={item?.id}
                          >
                            {item?.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="service-details-issues">
                      <h3>What issues are you facing?</h3>

                      {activeIssues?.map((item: any, index: number) => {
                        const issueIdStr = String(item?.id);
                        const isOpen = activeIssueId === issueIdStr;

                        return (
                          <div
                            key={item?.id || index}
                            className={`service-issues-in ${
                              isOpen ? "active" : ""
                            }`}
                          >
                            <div
                              className="service-issues-tab"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                if (!isOpen) {
                                  setActiveIssueId(issueIdStr);
                                  setAddedCategory(true);
                                } else {
                                  setActiveIssueId(null);
                                  setAddedCategory(false);
                                }
                              }}
                            >
                              <img
                                src={
                                  item?.imageUrl ||
                                  "images/service-details/service-issue.svg"
                                }
                                alt=""
                              />
                              <div className="service-issues-tab-data">
                                <h4>
                                  {item?.title || "NA"}
                                  {/* <input
                                    type="checkbox"
                                    className="tab-check"
                                    checked={isOpen}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setActiveIssueId(currentKey);
                                        setAddedCategory(true);
                                        setSelectedSpecificIssueId(null);
                                      } else {
                                        setActiveIssueId(null);
                                        setAddedCategory(false);
                                        setSelectedSpecificIssueId(null);
                                      }
                                    }}
                                  /> */}
                                </h4>
                                <p>
                                  {item?.description ||
                                    "Fix or install new taps in kitchen, bathroom, or wash area."}
                                </p>
                              </div>
                            </div>

                            <div
                              className="service-issues-content"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              <hr />
                              <p>
                                Select specific issue for{" "}
                                {item?.title || "Service"}
                              </p>
                              <ul>
                                {item?.specificIssues?.map((option: any) => {
                                  const isSelected =
                                    selectedSpecificIssueId !== null &&
                                    String(selectedSpecificIssueId) ===
                                      String(option?.id);
                                  return (
                                    <li
                                      key={option?.id}
                                      onClick={() =>
                                        setSelectedSpecificIssueId(option?.id)
                                      }
                                      style={{
                                        cursor: "pointer",
                                        transition: "all 0.2s ease-in-out",
                                        border: isSelected
                                          ? "1px solid #b30000"
                                          : "1px solid transparent",
                                        borderRadius: "8px",
                                        padding: "4px",
                                      }}
                                    >
                                      <label
                                        style={{
                                          cursor: "pointer",
                                          width: "100%",
                                          height: "100%",
                                          margin: 0,
                                        }}
                                      >
                                        <img
                                          src="images/service-details/issues/1.jpg"
                                          alt=""
                                        />
                                        {option?.name}{" "}
                                        {/* <input
                                        type="checkbox"
                                        checked={
                                          selectedSpecificIssueId === option?.id
                                        }
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedSpecificIssueId(
                                              option?.id
                                            );
                                          } else {
                                            setSelectedSpecificIssueId(null);
                                          }
                                        }}
                                      /> */}
                                      </label>
                                      <div className="hover-data">
                                        Upgrade your space with a new sink
                                        installation. We handle removal,
                                        fitting, and leak-proof connections for
                                        a hassle-free experience.
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>

                              <div className="service-issues-content-problem">
                                <h3>Problem Description</h3>
                                <textarea
                                  value={problemDesc}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>
                                  ) => setProblemDesc(e.target.value)}
                                  placeholder="Describe the specific issue..."
                                ></textarea>

                                <h3>Uploaded Image/Video</h3>
                                <label>
                                  <img
                                    src="images/service-details/upload-icon.svg"
                                    alt=""
                                  />
                                  Drag and drop files here, or click to browse
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    onChange={handleFile}
                                    hidden
                                  />
                                </label>

                                <div className="service-issues-content-problem-thumbs">
                                  {uploadedImg.map((imgUrl, imgIndex) => (
                                    <div
                                      key={imgIndex}
                                      className="service-issues-content-problem-thumbs-image"
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveImage(imgIndex)
                                        }
                                      >
                                        <img
                                          src="/images/service-details/cancel-icon.svg"
                                          alt=""
                                        />
                                      </button>

                                      <img
                                        src={
                                          imgUrl ||
                                          "/images/service-details/thumb-image.svg"
                                        }
                                        alt=""
                                        width={100}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Link
                      href=""
                      onClick={(e) => handleServiceCart("addtocart", e)}
                      className="primary-cta"
                    >
                      Add to Cart
                    </Link>
                    <Link
                      href=""
                      onClick={(e) => handleServiceCart("checkout", e)}
                      className="primary-cta"
                      style={{ marginRight: "10px" }}
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { serviceDetails } from "../../../json/service-detail.json";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { globalServerRequest } from "@/actions/globalApi";
// import { useDispatch, useSelector } from "react-redux";
// import { setSummaryestimate } from "@/store/slices/userSlice";
// import { RootState } from "@/store";

// const normalizeData = (data: any) => {
//   if (!data) return null;

//   // If it's already in the new format
//   if (data.subCategories) {
//     return data;
//   }

//   // Convert old mock structure to new schema format
//   return {
//     category: {
//       id: data.category?.id || 1,
//       name: data.service?.category || "Plumbing",
//       bannerImageUrl:
//         data.service?.banner_image ||
//         "images/service-details/service-banner.svg",
//     },
//     subCategories: (data.sub_categories || []).map((sub: any) => ({
//       id: sub.id,
//       name: sub.name,
//       issues: (data.facingIssues || [])
//         .filter((issue: any) => issue.sub_category_id === sub.id)
//         .map((issue: any) => ({
//           id: issue.id,
//           title: issue.issue_type?.title || "Issue Title",
//           description: issue.issue_type?.description || "Issue Description",
//           imageUrl:
//             issue.issue_type?.imageUrl ||
//             "images/service-details/service-issue.svg",
//           specificIssues: (issue.issue_options || []).map((opt: any) => ({
//             id: opt.id,
//             name: opt.title || "Option Title",
//           })),
//         })),
//     })),
//   };
// };

// export default function ServiceViewDetail({
//   initialData,
// }: {
//   initialData: any;
// }) {
//   const dispatch = useDispatch();

//   const isLoggedIn = localStorage.getItem("isLoggedIn") ?? "false";

//   const router = useRouter();

//   const initialNormalized = normalizeData(initialData || serviceDetails);

//   const [serviceDetailss, setServiceDetails] = useState<any>(initialNormalized);
//   const [subCategories, setSubCategories] = useState<any[]>(
//     initialNormalized?.subCategories || []
//   );
//   const [addedCategory, setAddedCategory] = useState<boolean>(false);
//   const [selectSubCategories, setSelectSubCategories] = useState<any>(
//     initialNormalized?.subCategories?.[0]?.id
//   );
//   const [problemDesc, setProblemDesc] = useState<string>(
//     serviceDetailss?.problemDesc || ""
//   );
//   const [uploadedImg, setUploadedImage] = useState<string[]>(
//     serviceDetailss?.uploadedImg || []
//   );
//   const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
//   const [selectedSpecificIssueId, setSelectedSpecificIssueId] = useState<
//     number | null
//   >(null);
//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

//   // Sync state if initialData changes via route update
//   useEffect(() => {
//     const normalized = normalizeData(initialData || serviceDetails);
//     if (normalized) {
//       setServiceDetails(normalized);
//       setSubCategories(normalized.subCategories || []);
//       if (normalized.subCategories?.length > 0) {
//         setSelectSubCategories(normalized.subCategories[0].id);
//       } else {
//         setSelectSubCategories(null);
//       }
//     }
//   }, [initialData]);

//   const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;

//     if (files) {
//       const fileArray = Array.from(files);
//       const imageUrls = fileArray.map((file) => URL.createObjectURL(file));

//       setUploadedImage((prev) => [...prev, ...imageUrls]);
//       setUploadedFiles((prev) => [...prev, ...fileArray]);
//     }
//   };

//   const handleRemoveImage = (index: number) => {
//     setUploadedImage((prev) => prev.filter((_, i) => i !== index));
//     setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleServiceCart = async (e: React.MouseEvent<HTMLAnchorElement>) => {
//     e.preventDefault();

//     if (!isLoggedIn || isLoggedIn === "false") {
//       if (typeof window !== "undefined" && (window as any).bootstrap) {
//         const loginModalElement = document.getElementById("login-screen-1");

//         if (loginModalElement) {
//           const bootstrapModal =
//             (window as any).bootstrap.Modal.getInstance(loginModalElement) ||
//             new (window as any).bootstrap.Modal(loginModalElement);

//           bootstrapModal.show();
//         }
//       }
//       return;
//     }

//     if (!addedCategory) {
//       toast.error("please select sub Category");
//     } else if (uploadedImg.length === 0) {
//       toast.error("please upload at least one video/image");
//     } else if (!problemDesc) {
//       toast.error("please enter the description");
//     } else {
//       try {
//         const formData = new FormData();

//         // categoryId
//         if (serviceDetailss?.category?.id) {
//           formData.append("categoryId", String(serviceDetailss.category.id));
//         }

//         // subCategoryId
//         if (selectSubCategories) {
//           formData.append("subCategoryId", String(selectSubCategories));
//         }

//         // issueId
//         if (activeIssueId) {
//           const issueIndex = parseInt(activeIssueId.split("_")[0], 10);
//           const activeSubCategory = subCategories?.find(
//             (sub: any) => sub.id === selectSubCategories
//           );
//           const activeIssues = activeSubCategory?.issues || [];
//           const selectedIssueId = activeIssues[issueIndex]?.id;
//           if (selectedIssueId) {
//             formData.append("issueId", String(selectedIssueId));
//           }
//         }

//         // specificIssueId
//         if (selectedSpecificIssueId) {
//           formData.append("specificIssueId", String(selectedSpecificIssueId));
//         }

//         // description
//         formData.append("description", problemDesc);

//         // mediaUrls
//         uploadedFiles.forEach((file, index) => {
//           formData.append(`mediaUrls[${index}]`, file);
//         });

//         const response = await globalServerRequest({
//           endpoint: "cart/add-cart",
//           method: "POST",
//           payload: formData,
//           isFormData: true,
//         });

//         if (!response.success) {
//           throw new Error(response.error || "Failed to add service to cart");
//         }
//         const apiNavigateData = response.data;
//         toast.success("services added to the cart");
//         dispatch(setSummaryestimate(apiNavigateData?.data));
//         router.push("/summary-estimate");
//         setAddedCategory(false);
//         setProblemDesc("");
//         setUploadedImage([]);
//         setUploadedFiles([]);
//         setActiveIssueId(null);
//         setSelectedSpecificIssueId(null);
//       } catch (error: any) {
//         console.error("Failed to add to cart:", error);
//         toast.error(
//           error?.message || error?.error || "Failed to add service to cart"
//         );
//       }
//     }
//   };

//   const activeSubCategory = subCategories?.find(
//     (sub: any) => sub.id === selectSubCategories
//   );
//   const activeIssues = activeSubCategory?.issues || [];

//   return (
//     <>
//       <main>
//         <div
//           className="container home-wraper my-profile"
//           style={{ height: "auto" }}
//         >
//           <section>
//             <div className="container">
//               <div className="row">
//                 <div className="col-lg-12">
//                   <div className="browse-wrp">
//                     <div className="browse-ctg-head my-con-head">
//                       <h2 className="sub-cate-page">
//                         <a
//                           onClick={(e) => {
//                             e.preventDefault();
//                             router.back();
//                           }}
//                         >
//                           <img src="images/home/left-arrow.svg" alt="" />
//                         </a>
//                         {serviceDetailss?.category?.name || "NA"}
//                       </h2>
//                       <div className="your-location-top">
//                         <input
//                           type="text"
//                           placeholder="Search"
//                           className="top-srch"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="service-details-wrp">
//                     <div className="service-details-banner">
//                       <div className="service-details-banner-data">
//                         <h1>
//                           {" "}
//                           Expert {serviceDetailss?.category?.name || "NA"}{" "}
//                           Services{" "}
//                         </h1>
//                         <p>
//                           Fast <i className="fa-solid fa-circle"></i> Reliable
//                           <i className="fa-solid fa-circle"></i> Verified
//                           Contractors
//                         </p>
//                       </div>
//                       <img
//                         src={
//                           serviceDetailss?.category?.bannerImageUrl ||
//                           "images/service-details/service-banner.svg"
//                         }
//                         alt=""
//                       />
//                     </div>

//                     <div className="service-details-sub-cat">
//                       <h3>Choose a Sub-category</h3>

//                       <div className="sub-cat-filtr-btns">
//                         {subCategories?.map((item) => (
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setSelectSubCategories(item?.id);
//                               setActiveIssueId(null);
//                               setAddedCategory(false);
//                               setSelectedSpecificIssueId(null);
//                             }}
//                             className={
//                               selectSubCategories === item?.id ? "active" : ""
//                             }
//                             key={item?.id}
//                           >
//                             {item?.name}
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="service-details-issues">
//                       <h3>What issues are you facing?</h3>

//                       {activeIssues?.map((item: any, index: number) => {
//                         const currentKey = `${index}_all`;
//                         const isOpen = activeIssueId === currentKey;

//                         return (
//                           <div
//                             key={currentKey}
//                             className={`service-issues-in ${
//                               isOpen ? "active" : ""
//                             }`}
//                           >
//                             <div className="service-issues-tab">
//                               <img
//                                 src={
//                                   item?.imageUrl ||
//                                   "images/service-details/service-issue.svg"
//                                 }
//                                 alt=""
//                               />
//                               <div className="service-issues-tab-data">
//                                 <h4>
//                                   {item?.title || "NA"}
//                                   <input
//                                     type="checkbox"
//                                     className="tab-check"
//                                     checked={isOpen}
//                                     onChange={(e) => {
//                                       if (e.target.checked) {
//                                         setActiveIssueId(currentKey);
//                                         setAddedCategory(true);
//                                         setSelectedSpecificIssueId(null);
//                                       } else {
//                                         setActiveIssueId(null);
//                                         setAddedCategory(false);
//                                         setSelectedSpecificIssueId(null);
//                                       }
//                                     }}
//                                   />
//                                 </h4>
//                                 <p>
//                                   {item?.description ||
//                                     "Fix or install new taps in kitchen, bathroom, or wash area."}
//                                 </p>
//                               </div>
//                             </div>

//                             <div
//                               className="service-issues-content"
//                               style={{ display: isOpen ? "block" : "none" }}
//                             >
//                               <hr />
//                               <p>
//                                 Select specific issue for{" "}
//                                 {item?.title || "Service"}
//                               </p>
//                               <ul>
//                                 {item?.specificIssues?.map((option: any) => (
//                                   <li key={option?.id}>
//                                     <label>
//                                       <img
//                                         src="images/service-details/issues/1.jpg"
//                                         alt=""
//                                       />
//                                       {option?.name}{" "}
//                                       <input
//                                         type="checkbox"
//                                         checked={
//                                           selectedSpecificIssueId === option?.id
//                                         }
//                                         onChange={(e) => {
//                                           if (e.target.checked) {
//                                             setSelectedSpecificIssueId(
//                                               option?.id
//                                             );
//                                           } else {
//                                             setSelectedSpecificIssueId(null);
//                                           }
//                                         }}
//                                       />
//                                     </label>
//                                     <div className="hover-data">
//                                       Upgrade your space with a new sink
//                                       installation. We handle removal, fitting,
//                                       and leak-proof connections for a
//                                       hassle-free experience.
//                                     </div>
//                                   </li>
//                                 ))}
//                               </ul>

//                               <div className="service-issues-content-problem">
//                                 <h3>Problem Description</h3>
//                                 <textarea
//                                   value={problemDesc}
//                                   onChange={(
//                                     e: React.ChangeEvent<HTMLTextAreaElement>
//                                   ) => setProblemDesc(e.target.value)}
//                                   placeholder="Describe the specific issue..."
//                                 ></textarea>

//                                 <h3>Uploaded Image/Video</h3>
//                                 <label>
//                                   <img
//                                     src="images/service-details/upload-icon.svg"
//                                     alt=""
//                                   />
//                                   Drag and drop files here, or click to browse
//                                   <input
//                                     type="file"
//                                     multiple
//                                     accept="image/*,video/*"
//                                     onChange={handleFile}
//                                     hidden
//                                   />
//                                 </label>

//                                 <div className="service-issues-content-problem-thumbs">
//                                   {uploadedImg.map((imgUrl, imgIndex) => (
//                                     <div
//                                       key={imgIndex}
//                                       className="service-issues-content-problem-thumbs-image"
//                                     >
//                                       <button
//                                         type="button"
//                                         onClick={() =>
//                                           handleRemoveImage(imgIndex)
//                                         }
//                                       >
//                                         <img
//                                           src="/images/service-details/cancel-icon.svg"
//                                           alt=""
//                                         />
//                                       </button>

//                                       <img
//                                         src={
//                                           imgUrl ||
//                                           "/images/service-details/thumb-image.svg"
//                                         }
//                                         alt=""
//                                         width={100}
//                                       />
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>

//                     <Link
//                       href=""
//                       onClick={handleServiceCart}
//                       className="primary-cta"
//                     >
//                       Save & Add to Service Cart
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>
//     </>
//   );
// }
