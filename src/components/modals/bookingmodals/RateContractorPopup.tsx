"use client"




import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import RateSevaServe from "./RateSevaServe";
import { globalServerRequest } from "@/actions/globalApi";

interface BookingProps {
  bookingId: number | null;
  // callBooking: () => void;
  callBooking: (page?: number, currentTab?: string) => void | Promise<void>;
}

const RateContractorPopup = ({ bookingId, callBooking }: BookingProps) => {

  const router = useRouter();

  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  console.log("Rating:", rating);
  console.log("Feedback:", feedback);



  useEffect(() => {
    const modal = document.getElementById("rate-contractor-popup");

    const handleModalOpen = () => {
      setRating(0);
      setFeedback("");
    };

    modal?.addEventListener("shown.bs.modal", handleModalOpen);

    return () => {
      modal?.removeEventListener("shown.bs.modal", handleModalOpen);
    };
  }, []);


  let res: any = null;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please provide a rating.");
      return;
    }

    if (rating <= 3) {
      const res = await globalServerRequest({
        endpoint: `review/contractor?rating=${rating}&bookingId=${bookingId}&feedback=${encodeURIComponent(feedback)}`,
        method: "POST",
      });

      if (res.success) {
        toast.success(res.data.message);
        await callBooking(1); // Call the callback function if provided


        const bootstrap = (window as any).bootstrap;
        const modal = document.getElementById("rate-contractor-popup");

        if (modal) {
          const instance =
            bootstrap.Modal.getInstance(modal) ||
            new bootstrap.Modal(modal);

          instance.hide();
        }

        return;
      }

      toast.error(res.data.message);

      return;
    }

    // 4-5 star flow
    const bootstrap = (window as any).bootstrap;
    const currentModal = document.getElementById("rate-contractor-popup");
    const nextModal = document.getElementById("rateSevaServe");



    if (currentModal && nextModal) {
      const currentInstance =
        bootstrap.Modal.getInstance(currentModal) ||
        new bootstrap.Modal(currentModal);

      currentInstance.hide();

      const nextInstance = new bootstrap.Modal(nextModal);
      nextInstance.show();
    }

  };
  return (
    <>
      <div
        className="modal fade"
        id="rate-contractor-popup"
        data-bs-backdrop="static"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>

            <div className="modal-body p-0">
              <div className="rate-contractor-wrp">
                <h1>Rate Your Contractor</h1>

                <form>
                  <h2>How was your experience?</h2>

                  <div className="rating-stars">
                    <div className="rating-group">
                      <input
                        disabled
                        checked={rating === 0}
                        className="rating__input rating__input--none"
                        name="rating4"
                        id="rating4-none"
                        value="0"
                        type="radio"
                        readOnly
                      />

                      {[1, 2, 3, 4, 5].map((star) => (
                        <React.Fragment key={star}>
                          <label
                            aria-label={`${star} star`}
                            className="rating__label"
                            htmlFor={`rating4-${star}`}
                          >
                            <img
                              className="rating__icon rating__icon--star"
                              src="images/rating-star.svg"
                              alt={`star-${star}`}
                            />
                          </label>

                          <input
                            className="rating__input"
                            name="rating4"
                            id={`rating4-${star}`}
                            value={star}
                            type="radio"
                            checked={rating === star}
                            onChange={() => setRating(star)}
                          />
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <h2>Write your Feedback</h2>

                  <textarea
                    placeholder="Please share your feedback"
                    value={feedback}
                    onChange={(
                      e: React.ChangeEvent<HTMLTextAreaElement>
                    ) => setFeedback(e.target.value)}
                  ></textarea>

                  <div className="home-quotes-cta">
                    <button
                      type="button"
                      data-bs-dismiss="modal"
                      className="reject-btn"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      // data-bs-target="#rateSevaServe"
                      // data-bs-toggle="modal"
                      // data-bs-dismiss="modal"
                      className="primary-cta rgt"
                      onClick={handleSubmit}
                    >
                      Rate
                      <img
                        src="images/home/right-img.svg"
                        alt=""
                      />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RateSevaServe feedback={feedback} />
    </>
  );
};

export default RateContractorPopup;