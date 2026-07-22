"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { globalServerRequest } from "@/actions/globalApi";

interface serviceProp {
  serviceData: any
}

export default function ClientComponent({ serviceData }: serviceProp) {
  const router = useRouter()

  console.log(serviceData, "new service Data");

  const [filterTopServices, setFilteredServices] = useState<any[]>([])
  const [filterfeaturedCategory, setFilteredfeaturedCategory] = useState<any[]>([])
  const [filertallServices, setFilteredAllServices] = useState<any[]>([])
  const [searchServices, setSearchServices] = useState<any>("")

  const [selectedCategory, setSelectedCategory] = useState<string>("0");
  const [apiFilteredServices, setApiFilteredServices] = useState<any[] | null>(null);
  const [isLoadingFilter, setIsLoadingFilter] = useState<boolean>(false);

  const extractServices = (resData: any) => {
    if (!resData) return [];
    if (Array.isArray(resData)) return resData;
    if (resData.data && Array.isArray(resData.data)) return resData.data;
    if (resData.allServices?.items && Array.isArray(resData.allServices.items)) {
      return resData.allServices.items;
    }
    if (resData.data?.allServices?.items && Array.isArray(resData.data.allServices.items)) {
      return resData.data.allServices.items;
    }
    if (resData.services && Array.isArray(resData.services)) return resData.services;
    if (resData.data?.services && Array.isArray(resData.data.services)) return resData.data.services;
    return [];
  };

  const handleCategoryChange = async (selectedValue: string) => {
    setSelectedCategory(selectedValue);
    if (selectedValue === "0" || selectedValue === "All Category") {
      setApiFilteredServices(null);
      return;
    }

    // Determine category name and category id
    let categoryName = selectedValue;
    let categoryId = Number(selectedValue);

    // Try to find in serviceData?.featuredCategories
    const matchedCategory = serviceData?.featuredCategories?.find(
      (cat: any) => String(cat.id) === selectedValue || cat.name === selectedValue
    );

    if (matchedCategory) {
      categoryName = matchedCategory.name;
      categoryId = matchedCategory.id;
    } else {
      // Fallback mapping for hardcoded categories
      const fallbackMapping: Record<string, string> = {
        "1": "Plumbing",
        "2": "Repairing",
        "3": "Painting",
        "4": "Laundry",
      };
      if (fallbackMapping[selectedValue]) {
        categoryName = fallbackMapping[selectedValue];
      }
    }

    setIsLoadingFilter(true);
    try {
      const response = await globalServerRequest({
        endpoint: "services/filterService",
        method: "POST",
        payload: {
          category: categoryName,
          category_id: categoryId
        }
      });

      console.log("filterService API response:", response);

      if (response.success) {
        const extracted = extractServices(response.data);
        setApiFilteredServices(extracted);
      } else {
        console.error("Failed to filter services:", response.error);
      }
    } catch (err) {
      console.error("Error calling filterService API:", err);
    } finally {
      setIsLoadingFilter(false);
    }
  };

  const truncateWords = (text: string, n: number) => {
    return text.split(" ").slice(0, n).join(" ") + "...";
  };

  // Persistent reference trackers to stop infinite teardown/init loops
  const topSliderInitialized = useRef(false);
  const featuredSliderInitialized = useRef(false);

  // Restores immediate mounting slick sliders on navigation transitions safely
  useEffect(() => {
    let frameId: number;

    const initServicesSliders = () => {
      const $ = (window as any).$;
      if (!$ || !$.fn.slick) {
        frameId = requestAnimationFrame(initServicesSliders);
        return;
      }

      // Initialize Top Services Slider only once when elements are fully ready
      const $topSlider = $(".top-services-slider");
      if ($topSlider.length && $topSlider.children().length > 0) {
        if ($topSlider.hasClass("slick-initialized")) {
          topSliderInitialized.current = true;
        } else if (filterTopServices.length > 0 && !topSliderInitialized.current) {
          $topSlider.slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            arrows: true,
            dots: false,
            draggable: false,
            infinite: filterTopServices.length > 4,
            autoplay: false,
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 2
                }
              },
              {
                breakpoint: 767,
                settings: {
                  slidesToShow: 1
                }
              }
            ]
          });
          topSliderInitialized.current = true;
        }
      } else {
        topSliderInitialized.current = true;
      }

      // Initialize Featured Category Slider only once when elements are fully ready
      const $featuredSlider = $(".featured-category-slider");
      if ($featuredSlider.length && $featuredSlider.children().length > 0) {
        if ($featuredSlider.hasClass("slick-initialized")) {
          featuredSliderInitialized.current = true;
        } else if (filterfeaturedCategory.length > 0 && !featuredSliderInitialized.current) {
          $featuredSlider.slick({
            slidesToShow: 8,
            slidesToScroll: 1,
            arrows: true,
            dots: false,
            draggable: false,
            infinite: filterfeaturedCategory.length > 8,
            autoplay: false,
            responsive: [
              {
                breakpoint: 1439,
                settings: {
                  slidesToShow: 6
                }
              },
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 5
                }
              },
              {
                breakpoint: 767,
                settings: {
                  slidesToShow: 1
                }
              }
            ]
          });
          featuredSliderInitialized.current = true;
        }
      } else {
        featuredSliderInitialized.current = true;
      }

      // Keep cycling the frame loop if layout targets haven't loaded elements yet
      if (!topSliderInitialized.current || !featuredSliderInitialized.current) {
        frameId = requestAnimationFrame(initServicesSliders);
      }
    };

    frameId = requestAnimationFrame(initServicesSliders);

    return () => {
      cancelAnimationFrame(frameId);
      topSliderInitialized.current = false;
      featuredSliderInitialized.current = false;
      const _$ = (window as any).$;
      if (_$ && _$.fn.slick) {
        if (_$(".top-services-slider").hasClass("slick-initialized")) {
          _$(".top-services-slider").slick("unslick");
        }
        if (_$(".featured-category-slider").hasClass("slick-initialized")) {
          _$(".featured-category-slider").slick("unslick");
        }
      }
    };
  }, [filterTopServices, filterfeaturedCategory]);

  // useEffect(() => {
  //   const $ = (window as any).$;

  //   if ($ && $.fn.slick) {
  //     if ($(".top-services-slider").hasClass("slick-initialized")) {
  //       $(".top-services-slider").slick("unslick");
  //       topSliderInitialized.current = false;
  //     }
  //     if ($(".featured-category-slider").hasClass("slick-initialized")) {
  //       $(".featured-category-slider").slick("unslick");
  //       featuredSliderInitialized.current = false;
  //     }
  //   }

  //   // Determine target lists based on category filter
  //   const rawAllSource = apiFilteredServices !== null
  //     ? apiFilteredServices
  //     : (serviceData?.allServices?.items || []);

  //   const rawTopSource = (selectedCategory === "0" || selectedCategory === "All Category")
  //     ? (serviceData?.topServices || [])
  //     : [];

  //   // Safely apply filtering matching your exact backend object keys
  //   setFilteredServices(handlefilter(rawTopSource));
  //   setFilteredfeaturedCategory(handlefilter(serviceData?.featuredCategories));
  //   setFilteredAllServices(handlefilter(rawAllSource));
  // }, [
  //   searchServices,
  //   serviceData?.topServices,
  //   serviceData?.featuredCategories,
  //   serviceData?.allServices,
  //   apiFilteredServices,
  //   selectedCategory,
  // ]);


 useEffect(() => {
  const $ = (window as any).$;

  if ($ && $.fn.slick) {
    if ($(".top-services-slider").hasClass("slick-initialized")) {
      $(".top-services-slider").slick("unslick");
      topSliderInitialized.current = false;
    }

    if ($(".featured-category-slider").hasClass("slick-initialized")) {
      $(".featured-category-slider").slick("unslick");
      featuredSliderInitialized.current = false;
    }
  }

  if (selectedCategory === "0") {
    // ✅ All Category
    setFilteredServices(handlefilter(serviceData?.topServices || []));
    setFilteredfeaturedCategory(
      handlefilter(serviceData?.featuredCategories || [])
    );
    setFilteredAllServices(
      handlefilter(serviceData?.allServices?.items || [])
    );
  } else {
    // ✅ Selected Category
    const featured = (serviceData?.featuredCategories || []).filter(
      (item: any) => String(item.id) === selectedCategory
    );

    setFilteredfeaturedCategory(handlefilter(featured));

    // Hide these two sections
    setFilteredServices([]);
    setFilteredAllServices([]);
  }
}, [
  searchServices,
  selectedCategory,
  serviceData?.topServices,
  serviceData?.featuredCategories,
  serviceData?.allServices,
]);
  const handlefilter = (data: any[]) => {
    if (!data || !Array.isArray(data)) return [];
    return data.filter((item) => {
      // Matches the precise backend structure target string key ".name"
      const searchTarget = item?.name || "";
      return searchTarget
        .toLowerCase()
        .includes(searchServices.toLowerCase());
    });
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .top-services-slider:not(.slick-initialized),
            .featured-category-slider:not(.slick-initialized) {
              display: flex !important;
              overflow: hidden;
              gap: 15px;
            }
            .top-services-slider:not(.slick-initialized) .top-services-slider-item {
              flex: 0 0 auto !important;
              width: 24%;
            }
            .featured-category-slider:not(.slick-initialized) .featured-category-slider-item {
              flex: 0 0 auto !important;
              width: 12%;
            }
            .top-services-slider .slick-track,
            .featured-category-slider .slick-track {
              margin-left: 0 !important;
              margin-right: auto !important;
              display: flex !important;
              justify-content: flex-start !important;
            }
            @media (max-width: 1024px) {
              .top-services-slider:not(.slick-initialized) .top-services-slider-item { width: 49%; }
              .featured-category-slider:not(.slick-initialized) .featured-category-slider-item { width: 20%; }
            }
            @media (max-width: 767px) {
              .top-services-slider:not(.slick-initialized) .top-services-slider-item,
              .featured-category-slider:not(.slick-initialized) .featured-category-slider-item {
                width: 100%;
              }
            }
          `,
        }}
      />

      <main>
        <div className="container home-wraper my-profile" style={{ height: "auto" }}>
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
                          }}><img src="images/home/left-arrow.svg" alt="" /></a>
                        Services
                      </h2>
                      <div className="your-location-top" >
                        <input type="text"
                          placeholder="Search"
                          value={searchServices}
                          onChange={(e) => setSearchServices(e.target.value)}
                          className="top-srch" />

                        <select
                          name="category"
                          id="category-select"
                          value={selectedCategory}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          disabled={isLoadingFilter}
                        >
                          <option value="0">All Category</option>
                          {serviceData?.featuredCategories?.length > 0 ? (
                            serviceData.featuredCategories.map((category: any) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))
                          ) : (
                            <>
                              <option value="1">Plumbing</option>
                              <option value="2">Repairing</option>
                              <option value="3">Painting</option>
                              <option value="4">Laundry</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    {!filterTopServices?.length && !filterfeaturedCategory?.length && !filertallServices?.length ? (
                      <div className="text-center" style={{ padding: "50px 0" }}>
                        <h4 className="text-muted" style={{ color: "#999" }}>No data available</h4>
                      </div>
                    ) : (
                      <>
                        {filterTopServices?.length > 0 && (
                          <div className="services-sec-wrp">
                            <h3>Top Services</h3>
                            <div className="top-services-slider" >
                              {filterTopServices.map((item) => (
                                <div className="top-services-slider-item" key={item.id} >
                                  <div className="upcoming-my-slide">
                                    <Link href={`/serviceDetails?serviceId=${item.id}&categoryId=${item.category_id || (selectedCategory !== "0" && selectedCategory !== "All Category" ? selectedCategory : "")}`}>
                                      <div className="upcoming-img">
                                        {/* Fixed: Uses item.imageUrl dynamically matching your payload */}
                                        <img src={item?.imageUrl || "images/home/home-slider/1.svg"} alt="" />
                                      </div>
                                      <div className="upcoming-data ser">
                                        {/* Fixed: Uses item.name dynamically matching your payload */}
                                        <p className="up-text">{item?.name}</p>
                                        <p className="up-date">{truncateWords(item.description, 5)}</p>
                                      </div>
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {filterfeaturedCategory?.length > 0 && (
                          <div className="services-sec-wrp">
                            <h3>Featured Category</h3>
                            <div className="featured-category-slider">
                              {filterfeaturedCategory.map((item) => (
                                <div className="featured-category-slider-item" key={`${item.id}_featured`}>
                                  <div className="browse-inner">
                                    <ul>
                                      <li>
                                        <Link href={`/serviceDetails?categoryId=${item.id}`} className="wrp-img">
                                          <div className="c-img">
                                            {/* Fixed: Uses item.iconUrl dynamically matching your payload */}
                                            <img src={item?.iconUrl} alt={item?.name} />
                                          </div>
                                          {/* Fixed: Uses item.name dynamically matching your payload */}
                                          <span>{item?.name}</span>
                                        </Link>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {filertallServices?.length > 0 && (
                          <div className="services-sec-wrp">
                            <h3 style={{ padding: '10px' }}>All Services</h3>
                            <div className="services-sec-in">
                              {filertallServices.map((item) => (
                                <div className="upcoming-my-slide" key={`${item.id}_all`}>
                                  <Link href={`/serviceDetails?serviceId=${item.id}&categoryId=${item.category_id || (selectedCategory !== "0" && selectedCategory !== "All Category" ? selectedCategory : "")}`}>
                                    <div className="upcoming-img">
                                      {/* Fixed: Uses item.imageUrl dynamically matching your payload */}
                                      <img src={item?.imageUrl || "images/home/home-slider/1.svg"} alt="" />
                                    </div>
                                    <div className="upcoming-data ser">
                                      {/* Fixed: Uses item.name dynamically matching your payload */}
                                      <p className="up-text">{item?.name}</p>
                                      <p className="up-date">{truncateWords(item.description, 5)}.</p>
                                    </div>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}