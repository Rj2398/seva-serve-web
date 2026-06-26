import React from 'react'

const ServiceDetails = () => {
  return (
    <>  <main>
      <div className="container home-wraper my-profile" style={{height: "auto"}}>
       
        <section>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="browse-wrp">
                  <div className="browse-ctg-head my-con-head">
                    <h2 className="sub-cate-page">
                      <a href="#"><img src="images/home/left-arrow.svg" alt=""/></a>
                      View Details
                    </h2>
                  </div>
                </div>
                <div className="view-summary-details-wrp">
                  <div className="view-sum-cat">
                    <p>Selected Category <a href="category-page.html"><img src="images/view-summary/edit-icon.svg" alt=""/></a> </p>
                    <h5>Plumbing</h5>
                  </div>
                  <div className="view-sum-subcat">
                    <h3>Selected Sub-category (3)
                      <a href="service-details.html">Edit All <img src="images/view-summary/edit-icon.svg" alt=""/></a>
                    </h3>

                    <div className="accordion" id="accordionExample">
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="heading-1">
                          <div className="sub-cat-head">
                            <p>1.Installations</p>
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                              data-bs-target="#collapse-1" aria-expanded="true" aria-controls="collapse-1">
                            </button>
                            <a href="service-details.html"><img src="images/view-summary/edit-icon.svg" alt=""/></a>
                          </div>
                        </h2>
                        <div id="collapse-1" className="accordion-collapse collapse" aria-labelledby="heading-1"
                          data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <ol className="main-category">
                              <li>
                                <ul>
                                  <li>
                                    Sink Installation
                                    <ul>
                                      <li>Replace Existing Sink</li>
                                    </ul>
                                  </li>
                                  <li>
                                    Tap Installation
                                    <ul>
                                      <li>Replace Existing Sink</li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                            </ol>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="heading-2">
                          <div className="sub-cat-head">
                            <p>2. Toilet & Sanitary</p>
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                              data-bs-target="#collapse-2" aria-expanded="true" aria-controls="collapse-2">
                            </button>
                            <a href="service-details.html"><img src="images/view-summary/edit-icon.svg" alt=""/></a>
                          </div>
                        </h2>
                        <div id="collapse-2" className="accordion-collapse collapse" aria-labelledby="heading-2"
                          data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <ol className="main-category">
                              <li>
                                <ul>
                                  <li>
                                    Sink Installation
                                    <ul>
                                      <li>Replace Existing Sink</li>
                                    </ul>
                                  </li>
                                  <li>
                                    Tap Installation
                                    <ul>
                                      <li>Replace Existing Sink</li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                            </ol>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="heading-3">
                          <div className="sub-cat-head">
                            <p>3. Water Heating</p>
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                              data-bs-target="#collapse-3" aria-expanded="true" aria-controls="collapse-3">
                            </button>
                            <a href="service-details.html"><img src="images/view-summary/edit-icon.svg" alt=""/></a>
                          </div>
                        </h2>
                        <div id="collapse-3" className="accordion-collapse collapse" aria-labelledby="heading-3"
                          data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <ol className="main-category">
                              <li>
                                <ul>
                                  <li>
                                    Sink Installation
                                    <ul>
                                      <li>Replace Existing Sink</li>
                                    </ul>
                                  </li>
                                  <li>
                                    Tap Installation
                                    <ul>
                                      <li>Replace Existing Sink</li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                 <div className="estimated-total">
                        <div className="estimated">
                            <p>Estimated Total (range)</p>
                            <span>$149-$299</span>
                        </div>
                        <div className="avrg">
                            <p>Average cost</p>
                            <span>$224 </span>
                        </div>
                    </div>
                    <div className="request-btn view">
                        <button type="button" data-bs-target="#requestSuccessfully" data-bs-toggle="modal" className="primary-cta">Request Exact Quote</button>
                    </div>
              </div>
            </div>
          </div>
        </section>
  

      </div>
 
    </main></>
  )
}

export default ServiceDetails
