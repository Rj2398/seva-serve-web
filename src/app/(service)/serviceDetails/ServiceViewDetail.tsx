"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { globalServerRequest } from "@/actions/globalApi";
import { useDispatch } from "react-redux";

const normalizeData = (data: any) => {
  if (!data || Object.keys(data).length === 0) return null;
  // If it's already in the new format
  if (data.subCategories) {
    return data;
  }

  return {
    category: {
      id: data.category?.id || 1,
      name: data.service?.category || "",
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
          title: issue.issue_type?.title || "",
          description: issue.issue_type?.description || "",
          imageUrl:
            issue.issue_type?.imageUrl ||
            "images/service-details/service-issue.svg",
          specificIssues: (issue.issue_options || []).map((opt: any) => ({
            id: opt.id,
            name: opt.title || "",
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

  const searchParams = useSearchParams();
  const requestedId = searchParams.get("requestedId");
  const subCategoryId = searchParams.get("subCategoryId");
  const is_quote_edit = searchParams.get("is_quote_edit");

  // FIX: Unified selectedOptionId with selectedSpecificIssueId so state flows down to the API payload correctly
  // const [selectedSpecificIssueId, setSelectedSpecificIssueId] = useState<
  //   Record<string, number | null>
  // >({});

  const [selectedSpecificIssueId, setSelectedSpecificIssueId] = useState<
    Record<string, number[]>
  >({});

  const isLoggedIn =
    typeof window !== "undefined"
      ? localStorage.getItem("isLoggedIn") ?? "false"
      : "false";

  const router = useRouter();

  const initialNormalized = normalizeData(
    initialData && Object.keys(initialData).length > 0 ? initialData : null
  );

  const [serviceDetailss, setServiceDetails] = useState<any>(initialNormalized);
  const [subCategories, setSubCategories] = useState<any[]>(
    initialNormalized?.subCategories || []
  );
  const [addedCategory, setAddedCategory] = useState<boolean>(false);
  const [selectSubCategories, setSelectSubCategories] = useState<any>(
    initialNormalized?.subCategories?.[0]?.id
  );
  const [problemDesc, setProblemDesc] = useState<Record<string, string>>({});
  const [uploadedImg, setUploadedImage] = useState<Record<string, string[]>>({});
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});
  const [searchSubCategory, setSearchSubCategory] = useState<string>("");
  const [loadedData, setLoadedData] = useState<{
    subCategoryId: number | null;
    issueId: number | null;
    specificIssueId: number | null;
    description: string;
    mediaUrls: string[];
  } | null>(null);

  useEffect(() => {
    if (searchSubCategory) {
      if (filtersubCategory.length > 0) {
        setSelectSubCategories(filtersubCategory[0].id);
      } else {
        setSelectSubCategories(null);
      }
    } else {
      setSelectSubCategories(subCategories?.[0]?.id);
    }
  }, [searchSubCategory, subCategories]);

  useEffect(() => {
    const fetchSavedRequest = async () => {
      if (!requestedId) return;
      try {
        const response = await globalServerRequest({
          endpoint: `quotes/${requestedId}`,
          method: "GET",
        });

        if (response.success) {
          const savedData = response.data?.data || response.data;

          console.log("savedData", savedData)

          if (savedData) {

            const matchedSubCategory = savedData?.subCategories?.find(
              (sub) => sub.id == subCategoryId
            );

            console.log("matchedSubCategory", matchedSubCategory)

            if (matchedSubCategory) {
              const firstService = matchedSubCategory.services?.[0];
              // const firstSpecificIssue = firstService?.specificIssues?.[0]; // Check standard naming in JSON
              const savedIssueId = firstService?.id ? String(firstService.id) : null;
              const savedSpecificIssueIds = Array.isArray(firstService?.specificIssues)
                ? firstService.specificIssues.map((spec: any) => Number(spec.id))
                : [];
              // State me direct clean structure set karein
              setLoadedData({
                subCategoryId: matchedSubCategory.id || null,
                issueId: firstService?.id || null,
                // specificIssueId: firstSpecificIssue?.id || null,
                specificIssueId: savedSpecificIssueIds,
                description: matchedSubCategory.problemDescription || "",
                mediaUrls: Array.isArray(matchedSubCategory.media)
                  ? matchedSubCategory.media.map(m => m.url)
                  : [],
              });

              if (matchedSubCategory.id) {
                setSelectSubCategories(matchedSubCategory.id);
              }

              // 2. Select the issue
              if (savedIssueId) {
                setActiveIssueId(savedIssueId);
                setAddedCategory(true);

                // 3. Select the specific issue
                // if (firstSpecificIssue?.id) {
                //   setSelectedSpecificIssueId((prev) => ({
                //     ...prev,
                //     [savedIssueId]: Number(firstSpecificIssue.id),
                //   }));
                // }
                if (savedIssueId && savedSpecificIssueIds.length > 0) {
                  setSelectedSpecificIssueId((prev) => ({
                    ...prev,
                    [savedIssueId]: savedSpecificIssueIds,
                  }));
                }

                // 4. Pre-fill problem description
                if (matchedSubCategory.problemDescription) {
                  setProblemDesc((prev) => ({
                    ...prev,
                    [savedIssueId]: matchedSubCategory.problemDescription,
                  }));
                }

                // 5. Pre-fill uploaded images
                if (matchedSubCategory.media && Array.isArray(matchedSubCategory.media)) {
                  setUploadedImage((prev) => ({
                    ...prev,
                    [savedIssueId]: matchedSubCategory.media.map((item) => item.url),
                  }));
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to load saved quote request:", error);
      }
    };

    fetchSavedRequest();
  }, [requestedId]);


  console.log("loadedData", loadedData)
  console.log("requestedId", requestedId)



  // Check if form changed when editing
  const isFormChanged = () => {
    if (!requestedId || !loadedData) return true;

    // Compare subcategory
    if (Number(selectSubCategories || 0) !== Number(loadedData.subCategoryId || 0)) return true;

    // Compare issue
    const cleanActiveIssueId = activeIssueId ? Number(String(activeIssueId).replace("issue_", "")) : null;
    const cleanLoadedIssueId = loadedData.issueId ? Number(loadedData.issueId) : null;
    if (cleanActiveIssueId !== cleanLoadedIssueId) return true;

    // const currentSpecificIssueId = activeIssueId ? selectedSpecificIssueId[activeIssueId] : null;
    const currentSpecificIssueId = activeIssueId ? selectedSpecificIssueId[activeIssueId] || [] : [];
    const currentProblemDesc = activeIssueId ? problemDesc[activeIssueId] || "" : "";
    const currentUploadedFiles = activeIssueId ? uploadedFiles[activeIssueId] || [] : [];
    const currentUploadedImg = activeIssueId ? uploadedImg[activeIssueId] || [] : [];
    const loadedSpecificIssueIds = loadedData?.specificIssueId || [];

    // Compare specific issue
    if (Number(currentSpecificIssueId || 0) !== Number(loadedData.specificIssueId || 0)) return true;

    if (currentSpecificIssueId.length !== loadedSpecificIssueIds.length) return true;
    const isMismatch = currentSpecificIssueId.some(id => !loadedSpecificIssueIds.includes(id));
    if (isMismatch) return true;

    // Compare description
    if ((currentProblemDesc || "") !== (loadedData.description || "")) return true;

    // Compare uploaded files (if any new files are selected, it's changed)
    if (currentUploadedFiles.length > 0) return true;

    // Compare uploadedImg remote URLs
    const currentRemoteUrls = currentUploadedImg.filter((url) => url.startsWith("http"));
    if (currentRemoteUrls.length !== loadedData.mediaUrls.length) return true;

    for (let i = 0; i < currentRemoteUrls.length; i++) {
      if (currentRemoteUrls[i] !== loadedData.mediaUrls[i]) return true;
    }

    return false;
  };

  // Sync state if initialData changes via route update
  useEffect(() => {
    const normalized = normalizeData(
      initialData && Object.keys(initialData).length > 0 ? initialData : null
    );
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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, issueIdStr: string) => {
    const files = e.target.files;

    if (files) {
      const fileArray = Array.from(files);
      const imageUrls = fileArray.map((file) => URL.createObjectURL(file));

      setUploadedImage((prev) => ({
        ...prev,
        [issueIdStr]: [...(prev[issueIdStr] || []), ...imageUrls],
      }));
      setUploadedFiles((prev) => ({
        ...prev,
        [issueIdStr]: [...(prev[issueIdStr] || []), ...fileArray],
      }));
    }
  };

  const handleRemoveImage = (index: number, issueIdStr: string) => {
    setUploadedImage((prev) => ({
      ...prev,
      [issueIdStr]: (prev[issueIdStr] || []).filter((_, i) => i !== index),
    }));
    setUploadedFiles((prev) => ({
      ...prev,
      [issueIdStr]: (prev[issueIdStr] || []).filter((_, i) => i !== index),
    }));
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

    const currentUploadedImg = activeIssueId ? uploadedImg[activeIssueId] || [] : [];
    const currentProblemDesc = activeIssueId ? problemDesc[activeIssueId] || "" : "";

    if (!addedCategory) {
      toast.error("please select sub Category");
    } else if (currentUploadedImg.length === 0) {
      toast.error("please upload at least one video/image");
    } else if (!currentProblemDesc) {
      toast.error("please enter the description");
    } else {
      // Direct redirect if editing and form was not changed
      if (requestedId && !isFormChanged()) {
        toast.success(
          actionType === "addtocart"
            ? "Added to cart!"
            : "Redirecting to summary..."
        );
        if (actionType === "checkout") {
          router.push(`/summary-estimate?requestedId=${requestedId}`);
        } else {
          router.push(`/`);
        }
        return;
      }

      try {


        // const existingSubCategoryIds: number[] = [];
        // const existingIssueIds: string[] = [];
        // const existingSpecificIssueIds: number[] = [];
        // const fetchedMediaFiles: File[] = [];


        // if (requestedId && actionType === "addtocart") {
        //   try {
        //     const fetchResponse = await globalServerRequest({
        //       endpoint: `quotes/${requestedId}`,
        //       method: "GET",
        //     });

        //     const savedData = fetchResponse.data?.data || fetchResponse.data;

        //     if (fetchResponse?.success && savedData) {
        //       const subCats = savedData.subCategories;

        //       if (Array.isArray(subCats.media)) {
        //         for (const mediaItem of subCats.media) {
        //           if (mediaItem.url) {
        //             try {
        //               const imgRes = await fetch(mediaItem.url);
        //               const blob = await imgRes.blob();
        //               const filename = mediaItem.url.substring(mediaItem.url.lastIndexOf('/') + 1) || "existing-file.png";
        //               const file = new File([blob], filename, { type: blob.type || "image/png" });
        //               fetchedMediaFiles.push(file);
        //             } catch (imgErr) {
        //               console.error("Error converting remote image url to file:", imgErr);
        //             }
        //           }
        //         }
        //       }

        //       subCats.forEach((sub: any) => {
        //         if (sub.id) existingSubCategoryIds.push(sub.id);

        //         sub.services?.forEach((service: any) => {
        //           if (service.id) existingIssueIds.push(String(service.id));

        //           service.specificIssues?.forEach((spec: any) => {
        //             if (spec.id) existingSpecificIssueIds.push(spec.id);
        //           });
        //         });
        //       });
        //     }
        //   } catch (fetchError) {
        //     console.error("Failed to fetch existing quote details, proceeding with current selection only:", fetchError);
        //   }
        // }

        // console.log("existingSubCategoryIds  ", existingSubCategoryIds, "  existingIssueIds", existingIssueIds, "   existingSpecificIssueIds", existingSpecificIssueIds)







        const formData = new FormData();

        // categoryId
        if (serviceDetailss?.category?.id) {
          formData.append("categoryId", String(serviceDetailss.category.id));
        }

        // subCategoryId
        console.log("selectSubCategories", selectSubCategories)
        if (selectSubCategories) {
          formData.append("subCategoryId", String(selectSubCategories));
          // const currentSubId = Number(selectSubCategories);
          // const mergedSubCategories = Array.from(new Set([...existingSubCategoryIds, currentSubId])).filter(Boolean);
          // formData.append("subCategoryId", mergedSubCategories.join(","));
        }

        // issueId
        console.log("activeIssueId", activeIssueId)
        if (activeIssueId) {
          const cleanIssueId = String(activeIssueId).replace("issue_", "");
          formData.append("issueId", cleanIssueId);
          // const cleanCurrentIssue = String(activeIssueId).replace("issue_", "");
          // const mergedIssues = Array.from(new Set([...existingIssueIds, cleanCurrentIssue])).filter(Boolean);
          // formData.append("issueId", mergedIssues.join(","));
        }

        // const currentSpecificIssueId = activeIssueId ? selectedSpecificIssueId[activeIssueId] : null;
        const currentSpecificIssueId = activeIssueId ? selectedSpecificIssueId[activeIssueId] || [] : [];
        const currentUploadedFiles = activeIssueId ? uploadedFiles[activeIssueId] || [] : [];
        // const totalMediaFiles = [...fetchedMediaFiles, ...currentUploadedFiles];
        // // specificIssueId
        // console.log("currentSpecificIssueId", currentSpecificIssueId)
        // if (currentSpecificIssueId) {
        //   formData.append("specificIssueId", String(currentSpecificIssueId));
        // }

        if (currentSpecificIssueId.length > 0) {
          formData.append("specificIssueId", currentSpecificIssueId.join(","));
        }

        // const currentSpecificIssueId = activeIssueId ? selectedSpecificIssueId[activeIssueId] : null;
        // const specIdsToMerge = currentSpecificIssueId ? [Number(currentSpecificIssueId)] : [];
        // const mergedSpecificIssues = Array.from(new Set([...existingSpecificIssueIds, ...specIdsToMerge])).filter(Boolean);

        // if (mergedSpecificIssues.length > 0) {
        //   formData.append("specificIssueId", mergedSpecificIssues.join(","));
        // }




        // description
        formData.append("description", currentProblemDesc);

        // mediaUrls (only new file uploads)
        currentUploadedFiles.forEach((file, index) => {
          formData.append(`mediaUrls[${index}]`, file);
        });

        // totalMediaFiles.forEach((file, index) => {
        //   formData.append(`mediaUrls[${index}]`, file);
        // });

        // Pass existing remote URLs in a separate existingMediaUrls parameter
        const existingRemoteUrls = currentUploadedImg.filter((url) => url.startsWith("http"));
        existingRemoteUrls.forEach((url, index) => {
          console.log(`existingMediaUrls[${index}]`, url);
          formData.append(`existingMediaUrls[${index}]`, url);
        });

        if (requestedId) {
          formData.append("requestId", requestedId);
          formData.append("id", requestedId);
        }

        console.log("formData", formData)

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

        // Instantly trigger cart update so the counter and offcanvas fetch the new data
        if (actionType === "addtocart") {
          window.dispatchEvent(new Event("cartUpdated"));
        }

        const apiNavigateData = response.data;
        const newRequestedId = response?.data?.data?.requestId || requestedId;

        toast.success(
          actionType === "addtocart"
            ? "Added to cart!"
            : "Quote saved successfully!"
        );
        // dispatch(setSummaryestimate(apiNavigateData?.data));//when api got called
        if (actionType === "checkout")
          router.push(`/summary-estimate?requestedId=${newRequestedId}`);

        if (actionType === "addtocart") router.push(`/`);

        setAddedCategory(false);
        if (activeIssueId) {
          setProblemDesc((prev) => ({ ...prev, [activeIssueId]: "" }));
          setUploadedImage((prev) => ({ ...prev, [activeIssueId]: [] }));
          setUploadedFiles((prev) => ({ ...prev, [activeIssueId]: [] }));
          setSelectedSpecificIssueId((prev) => ({ ...prev, [activeIssueId]: null }));
        }
        setActiveIssueId(null);
      } catch (error: any) {
        console.error("Failed to add to cart:", error);
        toast.error(
          error?.message || error?.error || "Failed to add service to cart"
        );
      }
    }
  };



  const handleUpdateQuote = async (actionType: string,
    e: React.MouseEvent<HTMLAnchorElement>) => {
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

    const currentUploadedImg = activeIssueId ? uploadedImg[activeIssueId] || [] : [];
    const currentProblemDesc = activeIssueId ? problemDesc[activeIssueId] || "" : "";

    if (!addedCategory) {
      toast.error("please select sub Category");
    } else if (currentUploadedImg.length === 0) {
      toast.error("please upload at least one video/image");
    } else if (!currentProblemDesc) {
      toast.error("please enter the description");
    } else {
      if (requestedId && !isFormChanged()) {
        toast.success(
          actionType === "updateQuote"
            ? "Updated your quote!"
            : "Redirecting to summary..."
        );
        if (actionType === "cancle") {
          router.push(`/summary-estimate?requestedId=${requestedId}&is_quote_edit=${is_quote_edit}`);
        } else {
          router.push(`/summary-estimate?requestedId=${requestedId}&is_quote_edit=${is_quote_edit}`);
        }
        return;
      }

      try {
        const formData = new FormData();
        if (serviceDetailss?.category?.id) {
          formData.append("categoryId", String(serviceDetailss.category.id));
        }

        console.log("selectSubCategories", selectSubCategories);
        if (!(selectSubCategories == subCategoryId)) {
          toast.error("You can't update subcategory you can only update there data")
        }
        if (selectSubCategories) {
          formData.append("subCategoryId", String(selectSubCategories));
        }

        // issueId
        console.log("activeIssueId", activeIssueId)
        if (activeIssueId) {
          const cleanIssueId = String(activeIssueId).replace("issue_", "");
          formData.append("issueId", cleanIssueId);
        }

        const currentSpecificIssueId = activeIssueId ? selectedSpecificIssueId[activeIssueId] : null;
        const currentUploadedFiles = activeIssueId ? uploadedFiles[activeIssueId] || [] : [];
        if (currentSpecificIssueId) {
          formData.append("specificIssueId", String(currentSpecificIssueId));
        }

        // description
        formData.append("description", currentProblemDesc);

        // mediaUrls (only new file uploads)
        currentUploadedFiles.forEach((file, index) => {
          formData.append(`mediaUrls[${index}]`, file);
        });

        const existingRemoteUrls = currentUploadedImg.filter((url) => url.startsWith("http"));
        existingRemoteUrls.forEach((url, index) => {
          console.log(`existingMediaUrls[${index}]`, url);
          formData.append(`existingMediaUrls[${index}]`, url);
        });

        if (requestedId) {
          formData.append("requestId", requestedId);
          formData.append("id", requestedId);
        }

        console.log("formData", formData)

        const response = await globalServerRequest({
          endpoint: "quotes/update-quote",
          method: "POST",
          payload: formData,
          isFormData: true,
        });

        if (!response.success) {
          throw new Error(response.error || "Failed to add service to cart");
        }

        toast.success(
          actionType === "updateQuote"
            ? "Updated your Quote"
            : "Redirecting to summery...!"
        );

        if (actionType === "cancle")
          router.push(`/summary-estimate?requestedId=${requestedId}&is_quote_edit=${is_quote_edit}`);
        if (actionType === "updateQuote") router.push(`/summary-estimate?requestedId=${requestedId}&is_quote_edit=${is_quote_edit}`);

        setAddedCategory(false);
        if (activeIssueId) {
          setProblemDesc((prev) => ({ ...prev, [activeIssueId]: "" }));
          setUploadedImage((prev) => ({ ...prev, [activeIssueId]: [] }));
          setUploadedFiles((prev) => ({ ...prev, [activeIssueId]: [] }));
          setSelectedSpecificIssueId((prev) => ({ ...prev, [activeIssueId]: null }));
        }
        setActiveIssueId(null);
      } catch (error: any) {
        console.error("Failed to add to cart:", error);
        toast.error(
          error?.message || error?.error || "Failed to add service to cart"
        );
      }
    }
  }






  const activeSubCategory = subCategories?.find(
    (sub: any) => String(sub.id) === String(selectSubCategories)
  );

  const filtersubCategory = subCategories?.filter((sub: any) =>
    !searchSubCategory ||
    sub.name.toLowerCase().includes(searchSubCategory.toLowerCase())
  );



  // const activeSubCategory = subCategories?.find(
  //   (sub: any) => String(sub.id) === String(selectSubCategories)
  // );
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
                          value={searchSubCategory}
                          onChange={(e) => setSearchSubCategory(e.target.value)}
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
                        {filtersubCategory?.map((item) => (
                          <button
                            type="button"

                            onClick={() => {
                              setSelectSubCategories(item?.id);
                              setActiveIssueId(null);
                              setAddedCategory(false);
                            }}

                            className={
                              String(selectSubCategories) === String(item?.id)
                                ? "active"
                                : ""
                            }
                            key={item?.id}
                            disabled={is_quote_edit == 1 && String(subCategoryId) !== String(item?.id)}
                          >
                            {item?.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="service-details-issues">
                      <h3>What services are you looking for ?</h3>

                      {activeIssues && activeIssues.length > 0 ? (
                        activeIssues.map((item: any, index: number) => {
                          const issueIdStr = String(item?.id);
                          const isOpen = activeIssueId === issueIdStr;

                          return (
                            <div
                              key={item?.id || index}
                              className={`service-issues-in ${isOpen ? "active" : ""
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
                                  </h4>
                                  <p>
                                    {item?.description || ""}
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
                                    // const currentSpecificIssueId = selectedSpecificIssueId[issueIdStr]
                                    const currentSelectedIds = selectedSpecificIssueId[issueIdStr] || [];

                                    const isSelected =
                                      currentSelectedIds !== null &&
                                      currentSelectedIds !== undefined &&
                                      // String(currentSpecificIssueId) ===
                                      // String(option?.id);
                                      currentSelectedIds.includes(Number(option?.id))
                                    return (
                                      <li
                                        key={option?.id}
                                        onClick={() =>
                                        // setSelectedSpecificIssueId((prev) => ({
                                        //   ...prev,
                                        //   [issueIdStr]: option?.id,
                                        // }))
                                        {
                                          setSelectedSpecificIssueId((prev) => {
                                            const currentIds = prev[issueIdStr] || [];
                                            const optionId = Number(option?.id);

                                            const updatedIds = currentIds.includes(optionId)
                                              ? currentIds.filter((id) => id !== optionId)
                                              : [...currentIds, optionId];

                                            return {
                                              ...prev,
                                              [issueIdStr]: updatedIds,
                                            };
                                          });
                                        }}
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
                                          {option?.name}
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
                                    value={problemDesc[issueIdStr] || ""}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLTextAreaElement>
                                    ) =>
                                      setProblemDesc((prev) => ({
                                        ...prev,
                                        [issueIdStr]: e.target.value,
                                      }))
                                    }
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
                                      onChange={(e) => handleFile(e, issueIdStr)}
                                      hidden
                                    />
                                  </label>

                                  <div className="service-issues-content-problem-thumbs">
                                    {(uploadedImg[issueIdStr] || []).map((imgUrl, imgIndex) => (
                                      <div
                                        key={imgIndex}
                                        className="service-issues-content-problem-thumbs-image"
                                      >
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveImage(imgIndex, issueIdStr)
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
                        })
                      ) : (
                        <div className="no-issues-message" style={{ padding: "20px", textAlign: "center", color: "#666", background: "#f9f9f9", borderRadius: "8px", marginTop: "20px" }}>
                          No issues available.
                        </div>
                      )}
                    </div>

                    {is_quote_edit == 1 ? (
                      <>
                        <Link
                          href=""
                          onClick={(e) => handleUpdateQuote("updateQuote", e)}
                          className="primary-cta"
                        >
                          Update Quote
                        </Link>
                        <Link
                          href=""
                          onClick={(e) => handleUpdateQuote("cancle", e)}
                          className="primary-cta"
                          style={{ marginRight: "10px" }}
                        >
                          Cancle
                        </Link>
                      </>
                    ) : (
                      (activeIssues && activeIssues.length > 0) &&
                      (
                        <>
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

                        </>
                      )
                    )}


                  </div>
                </div>
              </div>
            </div>
          </section>
        </div >
      </main >
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
