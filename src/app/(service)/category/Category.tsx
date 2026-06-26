"use client";

import Link from "next/link";
import { useState } from "react";
// import { topServices, featuredCategory, allServices } from "../../json/services.json"


interface categoryProps {
  initialData: any;
}
const Category = ({ initialData }: categoryProps) => {
  const [searchCategory, setSearchCategory] = useState<string>("");

  const featuredCategory = initialData?.data?.categories?.filter((item: any) => item?.name?.toLowerCase()?.includes(searchCategory?.toLowerCase()));

  return (
    <main>
      <div className="container home-wraper my-profile">
        <section>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="browse-wrp">
                  <div className="browse-ctg-head my-con-head">
                    <h2 className="sub-cate-page"> <Link href="/"><img src="images/home/left-arrow.svg" alt="" /></Link>Category</h2>
                    <div className="see-search">
                      <img src="images/home/search-icon.svg" alt="" />
                      <input type="search" placeholder="Search" onChange={(e) => setSearchCategory(e.target.value)} />
                    </div>
                  </div>
                  <div className="browse-inner">
                    {
                      featuredCategory?.length === 0 ? (
                        <div className="text-center">
                          <p className="text-muted">No category found</p>
                        </div>
                      ) : (
                        <ul>
                          {featuredCategory.map((item: any) => (
                            <li key={item?.id}  >
                              <Link href={`/serviceDetails?categoryId=${item?.id}`} className="wrp-img">
                                <div className="c-img">
                                  <img
                                    src={item?.icon || "images/home/browse-category/1.svg"}
                                    alt=""
                                  />
                                </div>
                                <span>{item?.name}</span>
                              </Link>
                            </li>
                          ))}

                        </ul>
                      )
                    }
                    {/* <ul>
                      {featuredCategory.map((item: any) => (
                        <li key={item?.id}  >
                          <Link href={`/serviceDetails?categoryId=${item?.id}`} className="wrp-img">
                            <div className="c-img">
                              <img
                                src={item?.icon || "images/home/browse-category/1.svg"}
                                alt=""
                              />
                            </div>
                            <span>{item?.name}</span>
                          </Link>
                        </li>
                      ))}

                    </ul> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}

export default Category