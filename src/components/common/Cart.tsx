import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SidebarMenu from "../sidebar/SidebarMenu";
import { globalServerRequest } from "@/actions/globalApi";
import toast from "react-hot-toast";

function Cart() {
  const router = useRouter();
  const [cartData, setCartData] = useState<any[]>([]);
  const [loginStatus, setLoginStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [btnHover, setBtnHover] = useState<boolean>(false);

  console.log(cartData, "add to cart ***********");

  const limit = 2;

  const fetchCartData = async (pageNum: number = 1) => {
    setLoading(true);
    try {
      const response = await globalServerRequest({
        endpoint: `cart/get-cart?pageNo=${pageNum}&limit=${limit}`,
        method: "GET",
      });

      if (response.success) {
        const responseData = response.data;
        const items =
          responseData?.data?.cart_items ||
          responseData?.cart_items ||
          responseData?.data ||
          responseData;
        const newItems = Array.isArray(items) ? items : [];
        const responseHasMore =
          responseData?.data?.pagination?.has_next_page ??
          newItems.length === limit;
        const total = responseData?.data?.pagination?.total ?? newItems.length;

        if (pageNum === 1) {
          setCartData(newItems);
        } else {
          setCartData((prev) => {
            const existingIds = new Set(
              prev.map((item) => item.cart_item_id || item.requestId || item.id)
            );
            const filteredNew = newItems.filter(
              (item) =>
                !existingIds.has(item.cart_item_id || item.requestId || item.id)
            );
            return [...prev, ...filteredNew];
          });
        }
        setHasMore(responseHasMore);
        setPage(pageNum);
        setTotalCount(total);
      } else {
        toast.error(response.error || "Failed to load cart items");
      }
    } catch (error: any) {
      console.error("Error fetching cart data:", error);
      toast.error(error?.message || "Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoginStatus(localStorage.getItem("isLoggedIn"));
  }, []);

  useEffect(() => {
    const handleLoginChange = () => {
      setLoginStatus(localStorage.getItem("isLoggedIn"));
    };

    window.addEventListener("loginStatusChanged", handleLoginChange);

    return () => {
      window.removeEventListener("loginStatusChanged", handleLoginChange);
    };
  }, []);

  useEffect(() => {
    if (loginStatus === "true") {
      fetchCartData(1);
    } else {
      setCartData([]);
      setPage(1);
      setHasMore(false);
      setTotalCount(0);
    }
  }, [loginStatus]);

  useEffect(() => {
    const handleCartUpdate = () => {
      if (loginStatus === "true") {
        fetchCartData(1);
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [loginStatus]);

  const handleRemoveCartItem = async (id: number) => {
    if (loginStatus === "true") {
      const [response] = await Promise.all([
        globalServerRequest({
          endpoint: `cart/delete`,
          method: "POST",
          payload: { cart_item_id: id },
        }),
      ]);
      if (response.success) {
        fetchCartData(1);
        toast.success("Item removed from cart successfully!");
      } else {
        toast.error(response.error || "Failed to remove item from cart");
      }
    }
  };

  return (
    <>
      {loginStatus !== "true" ? (
        <>
          <div
            className="icon cart-icon position-relative"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRightCart"
            aria-controls="offcanvasRight"
            style={{ cursor: "pointer" }}
          >
            <img
              src="/images/header/vector-img.svg"
              alt="Logo"
              className="logo"
            />
            {totalCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                style={{
                  backgroundColor: "#991318",
                  zIndex: 2,
                }}
              >
                {totalCount}
              </span>
            )}
          </div>

          <div
            className="offcanvas offcanvas-end cart-unfill"
            tabIndex={-1}
            id="offcanvasRightCart"
            aria-labelledby="offcanvasRightLabel"
          >
            <div className="offcanvas-header">
              <button
                type="button"
                className="btn-close my-cross"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                <img
                  src="/images/off-canvas/cross-icon-off-canvas.svg"
                  alt=""
                />
              </button>
              <h5 id="offcanvasRightLabel">Cart</h5>
            </div>

            <div className="offcanvas-body empaty-cart">
              <div className="cart-emp-wrp">
                <div className="cart-color-img">
                  <img src="/images/modal/cart-color-icon.svg" alt="" />
                </div>
                <p className="emt">Empty Cart</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="icon cart-icon position-relative"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRightCartFill"
            aria-controls="offcanvasRight"
            style={{ cursor: "pointer" }}
          >
            <img
              src="/images/header/vector-img.svg"
              alt="Logo"
              className="logo"
            />
            {totalCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                style={{
                  backgroundColor: "#991318",
                  zIndex: 2,
                }}
              >
                {totalCount}
              </span>
            )}
          </div>

          <div
            className="offcanvas offcanvas-end"
            tabIndex={-1}
            id="offcanvasRightCartFill"
            aria-labelledby="offcanvasRightLabel"
          >
            <div className="offcanvas-header cart-head">
              <button
                type="button"
                className="btn-close my-cross"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                <img
                  src="/images/off-canvas/cross-icon-off-canvas.svg"
                  alt=""
                />
              </button>
              <h5 id="offcanvasRightLabel">My Service Cart</h5>
            </div>

            <div
              className={`offcanvas-body ${
                !loading && cartData?.length === 0 ? "empaty-cart" : "cart-data"
              }`}
            >
              {loading && page === 1 ? (
                <div className="d-flex flex-column align-items-center justify-content-center py-5 w-100 h-100">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading your cart...</p>
                </div>
              ) : !cartData || cartData.length === 0 ? (
                <div className="cart-emp-wrp">
                  <div className="cart-color-img">
                    <img src="/images/modal/cart-color-icon.svg" alt="Empty" />
                  </div>
                  <p className="emt">Empty Cart</p>
                </div>
              ) : (
                <div className="wrp-cart">
                  {cartData.map((item) => {
                    const itemId =
                      item.cart_item_id || item.requestId || item.id;
                    const categoryName =
                      item.category?.name || item.category || "NA";
                    const subCategories = item.sub_categories || [];
                    const hasSubCategories = subCategories.length > 0;

                    return (
                      <div className="plumbing-wrp-cart" key={itemId}>
                        <div className="plumbing">
                          <p className="plm">
                            {categoryName}
                            <img src="/images/home/up-right-arrow.svg" alt="" />
                          </p>

                          <p className="sub-cate">
                            {hasSubCategories
                              ? subCategories
                                  .map((sub: any) => sub.name)
                                  .join(", ")
                              : "Sub categories Selected"}
                          </p>

                          <div className="service-list-type">
                            {hasSubCategories ? (
                              <ol className="main-category">
                                {subCategories.map(
                                  (sub: any, subIdx: number) => (
                                    <li
                                      key={sub.id || subIdx}
                                      className={subIdx === 0 ? "bdr" : ""}
                                    >
                                      {sub.name}
                                      {sub.issues &&
                                        Array.isArray(sub.issues) &&
                                        sub.issues.map(
                                          (
                                            issueItem: any,
                                            issueIdx: number
                                          ) => (
                                            <ul key={issueItem.id || issueIdx}>
                                              <li>
                                                {issueItem.name}
                                                {issueItem.specificIssues &&
                                                  Array.isArray(
                                                    issueItem.specificIssues
                                                  ) &&
                                                  issueItem.specificIssues
                                                    .length > 0 && (
                                                    <ul>
                                                      {issueItem.specificIssues.map(
                                                        (
                                                          spec: any,
                                                          specIdx: number
                                                        ) => (
                                                          <li
                                                            key={
                                                              spec.id || specIdx
                                                            }
                                                          >
                                                            {spec.name}
                                                          </li>
                                                        )
                                                      )}
                                                    </ul>
                                                  )}
                                              </li>
                                            </ul>
                                          )
                                        )}
                                    </li>
                                  )
                                )}
                              </ol>
                            ) : (
                              <ol className="main-category">
                                {item.visibleServices?.map(
                                  (service: any, index: number) => (
                                    <li
                                      key={index}
                                      className={index === 0 ? "bdr" : ""}
                                    >
                                      {service.mainCategory}
                                      <ul>
                                        <li>
                                          {service.subCategory}
                                          <ul>
                                            <li>{service.service}</li>
                                          </ul>
                                        </li>
                                      </ul>
                                    </li>
                                  )
                                )}
                              </ol>
                            )}

                            {!hasSubCategories &&
                              item.additionalServices?.length > 0 && (
                                <ol className="main-category">
                                  <li className="more-service">
                                    + {item.additionalServices.length} more
                                    service
                                    <img
                                      src="/images/header/down-icon.svg"
                                      alt=""
                                    />
                                  </li>

                                  <div className="service-data">
                                    {item.additionalServices.map(
                                      (service: any, index: number) => (
                                        <li key={index}>
                                          {service.mainCategory}
                                          <ul>
                                            <li>
                                              {service.subCategory}
                                              <ul>
                                                <li>{service.service}</li>
                                              </ul>
                                            </li>
                                          </ul>
                                        </li>
                                      )
                                    )}
                                  </div>

                                  <li className="less-service">Less service</li>
                                </ol>
                              )}
                          </div>
                        </div>

                        <div className="service-quotes card-quotes">
                          <p className="service-cost cart-cost">
                            Estimated Cost:{" "}
                            <span>
                              {item.estimated_cost?.formatted ??
                                `$${item.estimated_cost?.amount ?? 0}`}
                            </span>
                          </p>

                          <div className="home-quotes-cta cart-cta">
                            <button
                              className="reject-btn"
                              onClick={() => handleRemoveCartItem(itemId)}
                            >
                              <img
                                src="/images/off-canvas/remove-cart.svg"
                                alt=""
                              />
                              Remove
                            </button>

                            <button
                              className="primary-cta rgt"
                              onClick={() =>
                                router.push(
                                  itemId
                                    ? `/summary-estimate?requestedId=${itemId}`
                                    : "/quotes"
                                )
                              }
                            >
                              Request
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {hasMore && (
                    <div className="text-center mt-4 mb-2">
                      <button
                        type="button"
                        onClick={() => fetchCartData(page + 1)}
                        disabled={loading}
                        onMouseEnter={() => setBtnHover(true)}
                        onMouseLeave={() => setBtnHover(false)}
                        style={{
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "500",
                          padding: "8px 24px",
                          border: "1px solid var(--primary-color)",
                          background: btnHover
                            ? "var(--primary-color)"
                            : "transparent",
                          color: btnHover
                            ? "var(--white)"
                            : "var(--primary-color)",
                          transition: "all 0.2s ease-in-out",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          outline: "none",
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
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Cart;
