"use client";

import React, {useState} from 'react';

const DeleteAccount = () => {

  const [feedback, setFeedback] = useState("");

  const handleDeleteClick = () => {
    console.log("Feedback:", feedback);
  }

    return (
        <main>
        <div className="container home-wraper my-profile">
          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="browse-wrp">
                    <div className="browse-ctg-head my-con-head">
                      <h2 className="sub-cate-page"> <a href="#"><img src="images/home/left-arrow.svg" alt="" /></a>Delete Account</h2>
                
                    </div>
                    <div className="delete-account-wrp">
                      <h3>I don’t want to use SevaServe anymore</h3>
                      <p>Do you have any feedback for us? We would love to hear from you ! (optional)</p>
                      <div className="delete-inner-text-area">
                          <textarea rows={4} placeholder="Please share your feedback" 
                          value={feedback}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                            setFeedback(e.target.value)
                          }
                           />
                      </div>
  
                      <div className="delete-btn-rgt">
                          <button data-bs-target="#importantNoticeModal" data-bs-toggle="modal" className="primary-cta" onClick={handleDeleteClick}>Delete Account</button>
                      </div>
  
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

export default DeleteAccount