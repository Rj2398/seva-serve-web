"use client"
import React, { useState } from 'react';
import Link from 'next/link';



interface AboutProps {
  initialAboutUs?: {
    about: any;
  }
}

export default function About({ initialAboutUs }: AboutProps) {

  const [aboutData, setAboutData] = useState<any>(initialAboutUs?.about || {});

  console.log("aboutData", aboutData);



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
                      <h2 className="sub-cate-page"> <Link href="/home"><img src="images/home/left-arrow.svg" alt="" /></Link>{aboutData.title} </h2>

                    </div>
                    <div className="about-us-body">
                      <div dangerouslySetInnerHTML={{ __html: aboutData.content }} />
                      <div className="about-swap-inner">
                        <Link href="/privacypolicy">
                          <div className="inner-data">
                            <span style={{ color: "black" }}><img src="images/inner-page/policy-icon.svg" alt="" />Privacy Policy</span> <a href=""><img src="images/inner-page/right-side-move.svg" alt="" /></a>
                          </div>
                        </Link>

                        <Link href="/termcondition">
                          <div className="inner-data">
                            <span style={{ color: "black" }}><img src="images/inner-page/term-condition-icon.svg" alt="" />Terms & Conditions</span> <a href=""><img src="images/inner-page/right-side-move.svg" alt="" /></a>
                          </div>
                        </Link>
                      </div>
                    </div>
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

