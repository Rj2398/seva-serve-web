"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Payment = () => {
    const router = useRouter()

    const [activeTab, setActiveTab] = useState('all');

    const paymentsData = [
        { id: 1, title: "Plumbing - Shower Repair 1", date: "Nov 19, 2026", time: "10:30 AM", amount: "$149", status: "pending", icon: "images/inner-page/plum-img.svg" },
        { id: 2, title: "Plumbing - Shower Repair 2", date: "Nov 19, 2026", time: "10:30 AM", amount: "$149", status: "pending", icon: "images/inner-page/plum-img.svg" },
        { id: 3, title: "Plumbing - Shower Repair 3", date: "Nov 19, 2026", time: "10:30 AM", amount: "$149", status: "paid", icon: "images/inner-page/plum-img.svg" },
    ];

    const filteredData = paymentsData.filter(item => {
        if (activeTab === 'all') return true;
        return item.status === activeTab;
    });


    return (
        <div>
            <main>
                <div className="container home-wraper my-profile">

                    <section>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="browse-wrp">
                                        <div className="browse-ctg-head my-con-head">
                                            <h2 className="sub-cate-page"> <button onClick={() => router.back()} className="btn p-0 m-0"><img src="images/home/left-arrow.svg" alt="" /></button>My Payments </h2>
                                            <div className="tab-left">
                                                {/* <ul className="nav nav-pills mb-3" id="customTabs-tab" role="tablist">
    
    <li className="nav-item" role="presentation">
      <button className="nav-link active"
        id="customTabs-all-tab"
        data-bs-toggle="pill"
        data-bs-target="#customTabs-home"
        type="button"
        role="tab"
        aria-controls="customTabs-home"
        aria-selected="true">
        All
      </button>
    </li>

    <li className="nav-item" role="presentation">
      <button className="nav-link"
        id="customTabs-paid-tab"
        data-bs-toggle="pill"
        data-bs-target="#customTabs-profile"
        type="button"
        role="tab"
        aria-controls="customTabs-profile"
        aria-selected="false">
        Paid
      </button>
    </li>

    <li className="nav-item" role="presentation">
      <button className="nav-link"
        id="customTabs-pending-tab"
        data-bs-toggle="pill"
        data-bs-target="#customTabs-contact"
        type="button"
        role="tab"
        aria-controls="customTabs-contact"
        aria-selected="false">
        Pending
      </button>
    </li>

  </ul> */}

                                                <ul className="nav nav-pills mb-3" id="customTabs-tab">
                                                    {['all', 'paid', 'pending'].map((tab) => (
                                                        <li className="nav-item" key={tab}>
                                                            <button
                                                                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                                                onClick={() => setActiveTab(tab)}
                                                                style={{ textTransform: 'capitalize' }}
                                                            >
                                                                {tab}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>


                                            </div>
                                        </div>

                                        {/* <div className="tab-content" id="customTabs-tabContent">

                        <div className="tab-pane fade show active"
                            role="tabpanel"
                            aria-labelledby="customTabs-all-tab">
                            
                            <div className="my-payments-body-wrp">
                                <div className="my-payments-body">
                                <div className="left-payments-body">
                                    <div className="plumbing-icon">
                                    <img src="images/inner-page/plum-img.svg" alt=""/>
                                </div>
                                <div className="paid">
                                    <h5>Plumbing - Shower Repair <span><img src="images/inner-page/paidcircle-tick.svg" alt=""/> Paid</span></h5>
                                    <p>Nov 19, 2026 • 10:30 AM</p>
                                    <p className="amount">Amount : <span>$149</span> </p>
                                </div>
                                </div>
                                <div className="right-payments-body">
                                    <button className="secondary-cta">View Job</button>
                                </div>
                            </div>
                            <div className="my-payments-body">
                                <div className="left-payments-body">
                                    <div className="plumbing-icon">
                                    <img src="images/inner-page/plum-img.svg" alt=""/>
                                </div>
                                <div className="paid pending">
                                    <h5>Plumbing - Shower Repair <span><img src="images/inner-page/pending-clock-icon.svg" alt=""/> Pending</span></h5>
                                    <p>Nov 19, 2026 • 10:30 AM</p>
                                    <p className="amount">Amount : <span>$149</span> </p>
                                </div>
                                </div>
                                <div className="right-payments-body">
                                    <button className="secondary-cta">View Job</button>
                                    <button className="primary-cta"  onClick={()=>router.push("/checkout")}><img className="pay" src="images/modal/notice-right-arrow.svg" alt=""/> Pay Now</button>
                                </div>
                            </div>
                            <div className="my-payments-body">
                                <div className="left-payments-body">
                                    <div className="plumbing-icon">
                                    <img src="images/inner-page/plum-img.svg" alt=""/>
                                </div>
                                <div className="paid">
                                    <h5>Plumbing - Shower Repair <span><img src="images/inner-page/paidcircle-tick.svg" alt=""/> Paid</span></h5>
                                    <p>Nov 19, 2026 • 10:30 AM</p>
                                    <p className="amount">Amount : <span>$149</span> </p>
                                </div>
                                </div>
                                <div className="right-payments-body">
                                    <button className="secondary-cta">View Job</button>
                                </div>
                            </div>
                            </div>
                        </div>

                        <div className="tab-pane fade"
                            id="customTabs-profile"
                            role="tabpanel"
                            aria-labelledby="customTabs-paid-tab">
                            <div className="my-payments-body-wrp">
                                <div className="my-payments-body">
                                <div className="left-payments-body">
                                    <div className="plumbing-icon">
                                    <img src="images/inner-page/plum-img.svg" alt=""/>
                                </div>
                                <div className="paid">
                                    <h5>Plumbing - Shower Repair <span><img src="images/inner-page/paidcircle-tick.svg" alt=""/> Paid</span></h5>
                                    <p>Nov 19, 2026 • 10:30 AM</p>
                                    <p className="amount">Amount : <span>$149</span> </p>
                                </div>
                                </div>
                                <div className="right-payments-body">
                                    <button className="secondary-cta">View Job</button>
                                </div>
                            </div>
                            <div className="my-payments-body">
                                <div className="left-payments-body">
                                    <div className="plumbing-icon">
                                    <img src="images/inner-page/plum-img.svg" alt=""/>
                                </div>
                                <div className="paid">
                                    <h5>Plumbing - Shower Repair <span><img src="images/inner-page/paidcircle-tick.svg" alt=""/> Paid</span></h5>
                                    <p>Nov 19, 2026 • 10:30 AM</p>
                                    <p className="amount">Amount : <span>$149</span> </p>
                                </div>
                                </div>
                                <div className="right-payments-body">
                                    <button className="secondary-cta">View Job</button>
                                </div>
                            </div>
                            <div className="my-payments-body">
                                <div className="left-payments-body">
                                    <div className="plumbing-icon">
                                    <img src="images/inner-page/plum-img.svg" alt=""/>
                                </div>
                                <div className="paid">
                                    <h5>Plumbing - Shower Repair <span><img src="images/inner-page/paidcircle-tick.svg" alt=""/> Paid</span></h5>
                                    <p>Nov 19, 2026 • 10:30 AM</p>
                                    <p className="amount">Amount : <span>$149</span> </p>
                                </div>
                                </div>
                                <div className="right-payments-body">
                                    <button className="secondary-cta">View Job</button>
                                </div>
                            </div>
                            </div>
                        </div>

                        <div className="tab-pane fade"
                            id="customTabs-contact"
                            role="tabpanel"
                            aria-labelledby="customTabs-pending-tab">
                            <div className="my-payments-body-wrp">
                                <div className="my-payments-body">
                                <div className="left-payments-body">
                                    <div className="plumbing-icon">
                                    <img src="images/inner-page/plum-img.svg" alt=""/>
                                </div>
                                <div className="paid pending">
                                    <h5>Plumbing - Shower Repair <span><img src="images/inner-page/pending-clock-icon.svg" alt=""/> Pending</span></h5>
                                    <p>Nov 19, 2026 • 10:30 AM</p>
                                    <p className="amount">Amount : <span>$149</span> </p>
                                </div>
                                </div>
                                <div className="right-payments-body">
                                    <button className="secondary-cta">View Job</button>
                                    <button className="primary-cta" onClick={()=>router.push("/checkout")}><img className="pay" src="images/modal/notice-right-arrow.svg" alt=""/> Pay Now</button>
                                </div>
                            </div>
                            <div className="my-payments-body">
                                <div className="left-payments-body">
                                    <div className="plumbing-icon">
                                    <img src="images/inner-page/plum-img.svg" alt=""/>
                                </div>
                                <div className="paid pending">
                                    <h5>Plumbing - Shower Repair <span><img src="images/inner-page/pending-clock-icon.svg" alt=""/> Pending</span></h5>
                                    <p>Nov 19, 2026 • 10:30 AM</p>
                                    <p className="amount">Amount : <span>$149</span> </p>
                                </div>
                                </div>
                                <div className="right-payments-body">
                                    <button className="secondary-cta">View Job</button>
                                    <button className="primary-cta" onClick={()=>router.push("/checkout")}><img className="pay" src="images/modal/notice-right-arrow.svg" alt=""/> Pay Now</button>
                                </div>
                            </div>
                            <div className="my-payments-body">
                                <div className="left-payments-body">
                                    <div className="plumbing-icon">
                                    <img src="images/inner-page/plum-img.svg" alt=""/>
                                </div>
                                <div className="paid pending">
                                    <h5>Plumbing - Shower Repair <span><img src="images/inner-page/pending-clock-icon.svg" alt=""/> Pending</span></h5>
                                    <p>Nov 19, 2026 • 10:30 AM</p>
                                    <p className="amount">Amount : <span>$149</span> </p>
                                </div>
                                </div>
                                <div className="right-payments-body">
                                    <button className="secondary-cta">View Job</button>
                                    <button className="primary-cta" onClick={()=>router.push("/checkout")} ><img className="pay" src="images/modal/notice-right-arrow.svg" alt=""/> Pay Now</button>
                                </div>
                            </div>
                            </div>
                        </div>

                        </div> */}



                                        <div className="tab-content">
                                            <div className="my-payments-body-wrp">

                                                {/* Loop start: filteredData ko map kar rahe hain */}
                                                {filteredData.map((item) => (
                                                    <div className="my-payments-body" key={item.id}>
                                                        <div className="left-payments-body">
                                                            <div className="plumbing-icon">
                                                                <img src={item.icon} alt={item.title} />
                                                            </div>
                                                            <div className={`paid ${item.status === 'pending' ? 'pending' : ''}`}>
                                                                <h5>
                                                                    {item.title}
                                                                    <span>
                                                                        <img
                                                                            src={item.status === 'paid' ? "images/inner-page/paidcircle-tick.svg" : "images/inner-page/pending-clock-icon.svg"}
                                                                            alt=""
                                                                        />
                                                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                                    </span>
                                                                </h5>
                                                                <p>{item.date} • {item.time}</p>
                                                                <p className="amount">Amount : <span>{item.amount}</span></p>
                                                            </div>
                                                        </div>

                                                        <div className="right-payments-body">
                                                            <button className="secondary-cta" onClick={() => router.push("/view-booking-detail")}>
                                                                View Job
                                                            </button>
                                                          {item.status === "pending" && (
                                                                <button
                                                                    className="primary-cta"
                                                                    disabled={item.status === "pending"}
                                                                    onClick={() => router.push("/checkout")}
                                                                >
                                                                    <img
                                                                    className="pay"
                                                                    src="images/modal/notice-right-arrow.svg"
                                                                    alt=""
                                                                    />
                                                                    Pay Now
                                                                </button>
                                                                )}
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Agar koi data na ho tab ke liye */}
                                                {filteredData.length === 0 && <p className="text-center">No {activeTab} payments found.</p>}

                                            </div>
                                        </div>






                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>


                </div>

            </main>
        </div>
    )
}

export default Payment
