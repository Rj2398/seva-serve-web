"use client";
import CompletedService from '@/components/modals/bookingmodals/CompletedService'
import ReviewAdditionalServices from '@/components/modals/bookingmodals/ReviewAdditionalServices'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'

const ViewBookingDetail = () => {

const router=useRouter()
const [showDropdown, setShowDropdown] = useState(false);
const [showMaterialDropdown, setShowMaterialDropdown] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => {
    const modalElement = document.getElementById("reviewAdditional");

    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }, 2000);

  return () => clearTimeout(timer);
}, []);

//   const toggleCostDropdown = () => {
//   document.getElementById("costDropdown")?.classList.toggle("show");
// };
  return (
     <>
       {/* Tiny style patch to handle standard icon rotation animations matching state */}
       <style dangerouslySetInnerHTML={{ __html: `
         .rotate-icon {
           transform: rotate(180deg);
           transition: transform 0.2s ease;
         }
         .dropdown-toggle-cost img, .nested-toggle img {
           transition: transform 0.2s ease;
         }
       `}} />

       <main>
      <div className="container home-wraper my-profile" style={{height: "auto"}}>
 
        <section>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="browse-wrp">
                  <div className="browse-ctg-head my-con-head">
                    <h2 className="sub-cate-page">
                      <Link href="/booking"><img src="images/home/left-arrow.svg" alt=""/></Link>
                      Booking Tracking
                    </h2>
                    <Link href="/help-support" className="hel-cta"><i className="fa-regular fa-circle-question"></i> Help & Support</Link>
                  </div>
                    <div className="runing-late">

                    <div className="left-data-traking"  >
                      <div className="clock-runing-icon" onClick={()=>router.back()}>
                      <img src="images/clock-icon.svg" alt=""/>
                    </div>

                    <div className="contract-left-text">
                      <h3>Your contractor is running late</h3>
                      <p>They've requested to push your booking by <span className="hours">1h</span>.</p>
                    </div>
                    </div>

                    <Link href="/booking-update" className="right-arrow-runing">
                      <img src="images/right-arrow.svg" alt=""/>
                    </Link>

                  </div>


                  {/* */}
                  <div className="service-status-wrp">
                    <h4>Service Status</h4>
                   
                    {/* */}
                   <div className="service-status-inner">
                      <div className="service-status-item step-1 check">
                        <img src="images/service-status/check.svg" className="check-image" alt=""/>
                        <h5>STEP 1</h5>
                        <p>Provider Assigned</p>
                      </div>
                      {/* */}
                      <div className="progress-line step-fill"></div>
                      <div className="service-status-item step-2 check">
                        <img src="images/service-status/on-way.svg" alt=""/>
                        <img src="images/service-status/check.svg" className="check-image" alt=""/>
                        <h5>STEP 2</h5>
                        <p>On the Way</p>
                      </div>
                      <div className="progress-line step-fill"></div>
                      <div className="service-status-item step-3 check">
                        <img src="images/service-status/start-job.svg" alt=""/>
                        <img src="images/service-status/check.svg" className="check-image" alt=""/>
                        <h5>STEP 3</h5>
                        <p>Start the Job</p>
                      </div>
                      <div className="progress-line step-fill"></div>
                      <div className="service-status-item step-4 check">
                        <img src="images/service-status/completed.svg" alt=""/>
                        <img src="images/service-status/check.svg" className="check-image" alt=""/>
                        <h5>STEP 4</h5>
                        <p>Completed</p>
                      </div>
                    </div>
                    {/* */}
                  </div>
                  {/* */}

                  {/* */}
                   <div className="plumbing-wrp-book">
                   <div className="boking-right-img">
                     <img src="images/inner-page/booking-traking-img.svg" alt=""/>
                   </div>
                    <div className="plumbing">
                        <p className="normal-text">Scheduled Time</p>
                        <p className="bold-text">Nov 18, 2026 — 10:00 AM</p>
                        <p className="normal-text">Selected Category</p>
                      <p className="bold-text">
                        Plumbing
                      </p>
                      <p className="sub-cate">Sub categories Selected</p>

                      <div className="service-list-type">
                        <ol className="main-category">
                          <li>
                            Installation
                            <ul>
                              <li>
                                Sink Installation
                                <ul>
                                  <li>Replace Existing Sink</li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                        </ol>
                        <p className="normal-text">Problem Description</p>
                        <p className="light-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        <ol className="main-category"  start={2}>
                        {/* */}
{/* */}
                        </ol>
                      </div>
                    </div>
                   </div>
                  

                    

                  <div className="additional-services-wrp">
                    <div className="additional-services-in">
                      <h3>Additional Services <span className="tag">Accepted</span></h3>
                      <p>Undermount / Vessel Sink Setup</p>
                    </div>
                    <div className="additional-services-in">
                      <h3>Additional Services <span className="tag rejected">Rejected</span></h3>
                      <p>Undermount / Vessel Sink Setup</p>
                    </div>
                  </div>
                 

                 
                  {/* <div className="cost-details-wrp">
                    <h4>Booking Cost Details</h4>
                    <div className="cost-details-in">
                      <p>Deposit / Deductible Amount <span>$10</span></p>
                      <p>Remaining Cost <span>$10</span></p>
                      <hr/>
                      <p  data-bs-target="#reviewAdditional" data-bs-toggle="modal">Total Cost <span><b>$80</b></span></p>
                    </div>
                  </div> */}
              

                   <div className="cost-details-wrp">
                    <h4>Booking Cost Details</h4>
                    {/* */}
                    <div className="cost-details-in">
    <p>
        Deposit / Deductible Amount 
        <span>$10</span>
    </p>

    {/* */}
  <div className="additional-services">

    {/* */}
    <div className="drop-down-toggle">
        {/* Added state toggler to top dropdown arrow label */}
        <p
          className="dropdown-toggle-cost"
          style={{ cursor: "pointer" }}
          onClick={() => setShowDropdown(!showDropdown)}
        >
            Additional Services Cost
            <img 
              src="images/header/down-icon.svg" 
              alt=""
              className={showDropdown ? "rotate-icon" : ""}
            />
        </p>

        <span>$20</span>
    </div>

 
      <div 
        className="dropdown-cost-box" 
        id="costDropdown"
        style={{ display: showDropdown ? "block" : "none" }}
      >

        
        <div className="nested-dropdown">

            {/* Added state toggler to nested sub-category click target */}
            <div 
              className="nested-toggle" 
              style={{ cursor: "pointer" }}
              onClick={() => setShowMaterialDropdown(!showMaterialDropdown)}
            >
                <p>
                    Material Cost
                    <img 
                      src="images/header/down-icon.svg" 
                      alt=""
                      className={showMaterialDropdown ? "rotate-icon" : ""}
                    />
                </p>

                <span>$05</span>
            </div>

         
             <div 
               className="nested-dropdown-menu"
               style={{ display: showMaterialDropdown ? "block" : "none" }}
             >
                <ul>
    <li>
        <span className="header">Material Receipt</span>
       
    </li>

    <li>
        <span>Receipt 01</span>
        <button>
            <img src="images/inner-page/download-icon-drop.svg" alt=""/>
        </button>
    </li>

    <li>
        <span>Receipt 02</span>
        <button>
            <img src="images/inner-page/download-icon-drop.svg" alt=""/>
        </button>
    </li>

    <li>
        <span>Receipt 03</span>
        <button>
            <img src="images/inner-page/download-icon-drop.svg" alt=""/>
        </button>
    </li>
</ul>
            </div>

        </div>

        {/* */}
        <p>
            Labour Cost
            <span>$02</span>
        </p>

    </div>
</div>

    <p>
        Remaining Cost 
        <span>$70</span>
    </p>

    <hr/>

    <p data-bs-target="#reviewAdditional" data-bs-toggle="modal">
        Total Cost 
        <span><b>$100</b></span>
    </p>
</div>
                  </div>


                 <div className="progress-btn-rgt">
                     <button type="button" className="primary-cta" data-bs-target="#serviceCompleted" data-bs-toggle="modal">Pay Now <span>$70</span></button>
                 </div>
                 
                </div>
              </div>
            </div>
          </div>
        </section>
        

      </div>
 
  </main>

     <CompletedService/>
     <ReviewAdditionalServices/>
     </>
  )
}

export default ViewBookingDetail