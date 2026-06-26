import React, { useState } from 'react'
import toast from 'react-hot-toast';


interface RateSevaServeProps {
  feedback: string;
}

const RateSevaServe = ({ feedback }: RateSevaServeProps) => {

  const handleCopy =  async (
        e: React.MouseEvent<HTMLButtonElement>
      ) => {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(feedback);
          toast.success("Feedback copied!");
        } catch (error) {
          toast.error("Failed to copy feedback");
        }
  };


const handleGoogleReview = () => {
  window.open(
    "https://g.page/r/YOUR_GOOGLE_REVIEW_ID/review",
    "_blank"
  );
};


  return (
    
    <div className="modal fade" id="rateSevaServe" data-bs-backdrop="static" tabIndex={-1}
    aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        <div className="modal-body p-0">
          <div className="rate-contractor-wrp">
            <h1>Rate SevaServe</h1>
            <form action="">
              <div className="feedback-img">
                <h2>Your Feedback</h2>
             <button className="copy-btn" onClick={handleCopy}>
               <img src="images/copy-icon.svg" alt="" />
             </button>
              </div>
              <textarea placeholder="Please share your feedback" defaultValue={feedback}></textarea>
              <div className="feedback-cta">
                <button className="review-cta" onClick={handleGoogleReview}>
                  Leave us a review on  <img src="images/goggle-img.svg" alt="" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
 
  )
}

export default RateSevaServe