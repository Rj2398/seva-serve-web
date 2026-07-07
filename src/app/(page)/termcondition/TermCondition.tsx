"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'




interface TermConditionProps {
  initialTAndCData?: {
    termAndConditions: any;
  };
}


export default function TermCondition({ initialTAndCData }: TermConditionProps) {
  const router = useRouter();

  const [termAndCond, setTermAndCond] = useState<any>(
    initialTAndCData?.termAndConditions
  );



  console.log("termAndCond", termAndCond)




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
                      <h2 className="sub-cate-page"> <a href="#" onClick={(e) => { e.preventDefault(); router.back(); }}><img src="images/home/left-arrow.svg" alt="" /></a>{termAndCond.title}</h2>

                    </div>
                    <div className="about-us-body">
                      {/* <p className="about-us-data">Your trust and privacy are our top priorities. SevaServe  connects users with verified service professionals through a secure, transparent platform.
                        By using our app, you agree to:
                        Provide accurate information while creating your account or booking services.
                        Use the app responsibly and communicate respectfully with contractors.
                        Make payments securely through authorized gateways only.
                        Allow SevaServe  to contact you regarding bookings, offers, or feedback.
                        All service prices, quotes, and timelines are approximate and subject to mutual confirmation between you and the contractor.
                        SevaServe  is not liable for delays caused by external factors such as traffic, power issues, or weather conditions.
                        We reserve the right to update terms or service policies at any time. Continued use of the app means you accept the latest version of these Terms.</p>

                      <p className="about-us-data">Your trust and privacy are our top priorities. SevaServe  connects users with verified service professionals through a secure, transparent platform.
                        By using our app, you agree to:
                        Provide accurate information while creating your account or booking services.
                        Use the app responsibly and communicate respectfully with contractors.
                        Make payments securely through authorized gateways only.
                        Allow SevaServe  to contact you regarding bookings, offers, or feedback.
                        All service prices, quotes, and timelines are approximate and subject to mutual confirmation between you and the contractor.
                        SevaServe  is not liable for delays caused by external factors such as traffic, power issues, or weather conditions.
                        We reserve the right to update terms or service policies at any time. Continued use of the app means you accept the latest version of these Terms.</p> */}

                      <div dangerouslySetInnerHTML={{ __html: termAndCond.content }} />

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


