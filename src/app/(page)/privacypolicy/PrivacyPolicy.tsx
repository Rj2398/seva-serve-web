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
                      {/* <p className="about-us-data">At SevaServe , your personal data is handled with care and transparency.
                        We collect only the information necessary to deliver smooth and personalized service — such as your name, contact details, service preferences, location (if permitted), and payment details.
                        We never sell or rent your personal information to third parties.
                        All data is securely stored and shared only with verified service partners directly related to your request.
                        You have full control of your data and can update, export, or delete it anytime via your profile settings.
                        For safety, we recommend keeping your app updated to the latest version to enjoy new security features and improvements.</p>

                      <p className="about-us-data">At SevaServe , your personal data is handled with care and transparency.
                        We collect only the information necessary to deliver smooth and personalized service — such as your name, contact details, service preferences, location (if permitted), and payment details.
                        We never sell or rent your personal information to third parties.
                        All data is securely stored and shared only with verified service partners directly related to your request.
                        You have full control of your data and can update, export, or delete it anytime via your profile settings.
                        For safety, we recommend keeping your app updated to the latest version to enjoy new security features and improvements.</p> */}
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

