"use client";

import React from 'react';
import Link from 'next/link';

const About = () => {
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
                    <h2 className="sub-cate-page"> <Link href="/home"><img src="images/home/left-arrow.svg" alt=""/></Link>About SevaServe </h2>
                   
                  </div>
                  <div className="about-us-body"> 
                      <p className="about-us-data">SevaServe  is your trusted home services companion designed to make it easy for you to find verified professionals for all your daily household needs.
                      From quick electrical repairs and plumbing fixes to deep cleaning, appliance maintenance, and emergency  requests, SevaServe  brings expert help right to your doorstep anytime, anywhere.
                      We’re on a mission to simplify how India manages home services. With a user-friendly design, real-time tracking, secure digital payments, and verified service providers, SevaServe  ensures convenience, reliability, and safety every time you book.
                      Your comfort and trust are at the heart of everything we do because your home deserves the best care.</p>

                      <p className="about-us-data">SevaServe  is your trusted home services companion designed to make it easy for you to find verified professionals for all your daily household needs.
                      From quick electrical repairs and plumbing fixes to deep cleaning, appliance maintenance, and emergency  requests, SevaServe  brings expert help right to your doorstep anytime, anywhere.
                      We’re on a mission to simplify how India manages home services. With a user-friendly design, real-time tracking, secure digital payments, and verified service providers, SevaServe  ensures convenience, reliability, and safety every time you book.
                      Your comfort and trust are at the heart of everything we do because your home deserves the best care.</p>
                      <div className="about-swap-inner">
                        <Link href="/privacypolicy">
                        <div className="inner-data">
                          <span style={{color: "black"}}><img src="images/inner-page/policy-icon.svg" alt=""/>Privacy Policy</span> <a href=""><img src="images/inner-page/right-side-move.svg" alt=""/></a>
                        </div>
                        </Link>

                        <Link href="/termcondition">
                        <div className="inner-data">
                          <span style={{color: "black"}}><img src="images/inner-page/term-condition-icon.svg" alt=""/>Terms & Conditions</span> <a href=""><img src="images/inner-page/right-side-move.svg" alt=""/></a>
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

export default About
