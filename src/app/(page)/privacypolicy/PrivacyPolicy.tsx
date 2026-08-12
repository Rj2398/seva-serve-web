"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'



interface PrivacyPolicyProps {
  initialPrivacyPolicyData?: {
    privacyPolicy: any;
  }
};



export default function PrivacyPolicy({ initialPrivacyPolicyData }: PrivacyPolicyProps) {
  const router = useRouter();


  const [privacyPolicy, setPrivacyPolicy] = useState<any>(
    initialPrivacyPolicyData?.privacyPolicy
  )

  console.log("privacyPolicy2", privacyPolicy)








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
                      <h2 className="sub-cate-page"> <a href="#" onClick={(e) => {
                        e.preventDefault();
                        router.back()
                      }}><img src="images/home/left-arrow.svg" alt="" /></a>{privacyPolicy.title}</h2>

                    </div>
                    <div className="about-us-body">
                      <div dangerouslySetInnerHTML={{ __html: privacyPolicy.content }} />
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

