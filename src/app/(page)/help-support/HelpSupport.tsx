"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'

const HelpSupport = () => {

  const router = useRouter()

  return (
   <>
     <main>
      <div className="container home-wraper my-profile fixing">
      
        <section>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="browse-wrp">
                  <div className="browse-ctg-head my-con-head">
                    <h2 className="sub-cate-page" > <Link  href="/"  ><img src="images/home/left-arrow.svg" alt=""/></Link>Help & Support</h2>
                   
                  </div>
                  <div className="help-support-wrp">
                    <h3>Need Assistance? We’re Here to Help!</h3>
                    <p className="wht">Whether you’re managing your profile, booking services, or facing technical issues, the SevaServe support team is always ready to assist you</p>
                    <a href="mailto:support@sevaserve.com" className="email-box">
                        <span>Email Us: support@sevaserve.com</span>
                    </a>

                    <div className="share-facebook">
                      <h3>Share Your Feedback</h3>
                      <p className="exp">Your experience matters to us! Share your feedback, suggestions, or feature ideas to help us make SevaServe more reliable, user-friendly, and community-driven.</p>
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

export default HelpSupport
