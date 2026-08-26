import { globalServerRequest } from "@/actions/globalApi";
import React from "react";
import toast from "react-hot-toast";

interface RateSevaServeProps {
  feedback: string;
  reviewPayload: any;
}

const RateSevaServe = ({ feedback, reviewPayload }: RateSevaServeProps) => {
  console.log(reviewPayload, "Review payload of the 5 star");

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      await navigator.clipboard.writeText(feedback);
      toast.success("Feedback copied!");
    } catch (error) {
      toast.error("Failed to copy feedback");
    }
  };

  const handleGoogleReview = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const res = await globalServerRequest({
        endpoint: "review/give-feedback",
        method: "POST",
        payload: reviewPayload,
      });

      console.log("API RESPONSE:", res);

      if (res?.success) {
        const googleReviewUrl =
          "https://www.google.com/search?sca_esv=5cd892c2b13a5520&sxsrf=APpeQnsHlhuRJia8VWVwMT2I-AMl1dPkyg:1785913523815&kgmid=/g/11fy4yrlzj&q=SevaServe+LLC&shem=dlvs1,ltae,rimspwouoe&shndl=30&source=sh/x/loc/uni/m1/1&kgs=ec3df1c0708037d5&utm_source=dlvs1,ltae,rimspwouoe,sh/x/loc/uni/m1/1#lrd=0x89c3b7c01a642313:0xc0c61501b622167b,3";

        // Open Google review after successful API response
        window.open(googleReviewUrl, "_blank", "noopener,noreferrer");

        // Close Bootstrap modal
        const modalElement = document.getElementById("rateSevaServe");

        if (modalElement) {
          const modal = window.bootstrap?.Modal.getInstance(modalElement);

          modal?.hide();
        }

        return;
      }

      toast.error(res?.data?.message || "Failed to submit feedback.");
    } catch (error) {
      console.error("Error submitting review:", error);

      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="modal fade"
      id="rateSevaServe"
      data-bs-backdrop="static"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />

          <div className="modal-body p-0">
            <div className="rate-contractor-wrp">
              <h1>Rate SevaServe</h1>

              <form>
                <div className="feedback-img">
                  <h2>Your Feedback</h2>

                  <button
                    type="button"
                    className="copy-btn"
                    onClick={handleCopy}
                  >
                    <img src="images/copy-icon.svg" alt="" />
                  </button>
                </div>

                <textarea
                  readOnly
                  placeholder="Please share your feedback"
                  defaultValue={feedback}
                />

                <div className="feedback-cta">
                  <button
                    type="button"
                    className="review-cta"
                    onClick={handleGoogleReview}
                  >
                    Leave us a review on{" "}
                    <img src="images/goggle-img.svg" alt="" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateSevaServe;

// import React, { useState } from 'react'
// import toast from 'react-hot-toast';

// interface RateSevaServeProps {
//   feedback: string;
// }

// const RateSevaServe = ({ feedback }: RateSevaServeProps) => {

//   const handleCopy = async (
//     e: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     e.preventDefault();
//     try {
//       await navigator.clipboard.writeText(feedback);
//       toast.success("Feedback copied!");
//     } catch (error) {
//       toast.error("Failed to copy feedback");
//     }
//   };

//   const handleGoogleReview = () => {
//     window.open(
//       "https://www.google.com/search?sca_esv=5cd892c2b13a5520&sxsrf=APpeQnsHlhuRJia8VWVwMT2I-AMl1dPkyg:1785913523815&kgmid=/g/11fy4yrlzj&q=SevaServe+LLC&shem=dlvs1,epsd1,ltae,rimspwouoe&shndl=30&source=sh/x/loc/uni/m1/1&kgs=ec3df1c0708037d5&utm_source=dlvs1,epsd1,ltae,rimspwouoe,sh/x/loc/uni/m1/1#lrd=0x89c3b7c01a642313:0xc0c61501b622167b,3,,,,",
//       "_blank"
//     );
//   };

//   return (

//     <div className="modal fade" id="rateSevaServe" data-bs-backdrop="static" tabIndex={-1}
//       aria-labelledby="exampleModalLabel" aria-hidden="true">
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content">
//           <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//           <div className="modal-body p-0">
//             <div className="rate-contractor-wrp">
//               <h1>Rate SevaServe</h1>
//               <form action="">
//                 <div className="feedback-img">
//                   <h2>Your Feedback</h2>
//                   <button className="copy-btn" onClick={handleCopy}>
//                     <img src="images/copy-icon.svg" alt="" />
//                   </button>
//                 </div>
//                 <textarea readOnly placeholder="Please share your feedback" defaultValue={feedback}></textarea>
//                 <div className="feedback-cta">
//                   <button className="review-cta" onClick={handleGoogleReview}>
//                     Leave us a review on  <img src="images/goggle-img.svg" alt="" />
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//   )
// }

// export default RateSevaServe
