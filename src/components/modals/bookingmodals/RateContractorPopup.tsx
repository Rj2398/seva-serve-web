"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import RateSevaServe from "./RateSevaServe";
import { globalServerRequest } from "@/actions/globalApi";

interface BookingProps {
  bookingId: number | null;
  // callBooking: () => void;
  callBooking: (page?: number, currentTab?: string) => void | Promise<void>;
  reviewPayload: any;
}

const RateContractorPopup = ({ bookingId, callBooking }: BookingProps) => {
  const router = useRouter();
  const [reviewPayload, setReviewPayload] = useState<any>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [question, setQuetion] = useState<any>([]);

  const handleRatingChange = (questionId: string | number, star: number) => {
    if (questionId === undefined || questionId === null) return;

    setRatings((prev) => {
      const existingIndex = prev.findIndex((r) => r.questionId === questionId);
      if (existingIndex > -1) {
        const newRatings = [...prev];
        newRatings[existingIndex] = {
          ...newRatings[existingIndex],
          rating: star,
        };
        return newRatings;
      }
      return [...prev, { questionId, rating: star }];
    });
  };

  console.log("Ratings Payload:", ratings);
  console.log("Feedback:", feedback);

  // console.log()

  useEffect(() => {
    const modal = document.getElementById("rate-contractor-popup");

    const fetchQuestions = async () => {
      const res = await globalServerRequest({
        endpoint: `review/get-questions`,
        method: "GET",
      });

      if (res.success) {
        setQuetion(res.data.data);
      }
    };

    const handleModalOpen = () => {
      setRatings([]);
      setFeedback("");
      fetchQuestions();
    };

    modal?.addEventListener("shown.bs.modal", handleModalOpen);

    return () => {
      modal?.removeEventListener("shown.bs.modal", handleModalOpen);
    };
  }, []);

  let res: any = null;

  // const handleSubmit = async () => {
  //   const questionsArray = question?.questions || [];

  //   const validRatings = ratings.filter(
  //     (r) => r.questionId !== undefined && r.questionId !== null
  //   );

  //   if (
  //     questionsArray.length > 0 &&
  //     validRatings.length !== questionsArray.length
  //   ) {
  //     toast.error("Please provide a rating for all questions.");
  //     return;
  //   }

  //   const avgRating =
  //     questionsArray.length > 0
  //       ? Math.round(
  //           validRatings.reduce((acc, curr) => acc + curr.rating, 0) /
  //             questionsArray.length
  //         )
  //       : validRatings.length > 0
  //       ? validRatings[0].rating
  //       : 0;

  //   const payload = JSON.stringify(validRatings); // Pass this payload variable when you hit your API

  //   if (avgRating === 0) {
  //     toast.error("Please provide a rating.");
  //     return;
  //   }

  //   if (avgRating < 4) {
  //     const res = await globalServerRequest({
  //       endpoint: "review/give-feedback",
  //       method: "POST",
  //       payload: {
  //         booking_id: bookingId,
  //         feedback: feedback,
  //         ratings: validRatings.map((r) => ({
  //           question_id: r.questionId,
  //           rating: r.rating,
  //         })),
  //       },
  //     });

  //     if (res.success) {
  //       toast.success(res.data.message);
  //       await callBooking(1); // Call the callback function if provided

  //       const bootstrap = (window as any).bootstrap;
  //       const modal = document.getElementById("rate-contractor-popup");

  //       if (modal) {
  //         const instance =
  //           bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);

  //         instance.hide();
  //       }

  //       return;
  //     }

  //     toast.error(res.data.message);

  //     return;
  //   }

  //   // 4-5 star flow
  //   const bootstrap = (window as any).bootstrap;
  //   const currentModal = document.getElementById("rate-contractor-popup");
  //   const nextModal = document.getElementById("rateSevaServe");

  //   if (currentModal && nextModal) {
  //     const currentInstance =
  //       bootstrap.Modal.getInstance(currentModal) ||
  //       new bootstrap.Modal(currentModal);

  //     currentInstance.hide();

  //     const nextInstance = new bootstrap.Modal(nextModal);
  //     nextInstance.show();
  //   }
  // };

  const handleSubmit = async () => {
    const questionsArray = question?.questions || [];

    const validRatings = ratings.filter(
      (r) => r.questionId !== undefined && r.questionId !== null
    );

    if (
      questionsArray.length > 0 &&
      validRatings.length !== questionsArray.length
    ) {
      toast.error("Please provide a rating for all questions.");
      return;
    }

    const avgRating =
      questionsArray.length > 0
        ? Math.round(
            validRatings.reduce((acc, curr) => acc + curr.rating, 0) /
              questionsArray.length
          )
        : validRatings.length > 0
        ? validRatings[0].rating
        : 0;

    if (avgRating === 0) {
      toast.error("Please provide a rating.");
      return;
    }

    // 1. Prepare structured payload object
    const finalPayload = {
      booking_id: bookingId,
      feedback: feedback,
      avgRating: avgRating,
      ratings: validRatings.map((r) => ({
        question_id: r.questionId,
        rating: r.rating,
      })),
    };

    // Less than 4 stars -> Submit directly
    if (avgRating < 4) {
      const res = await globalServerRequest({
        endpoint: "review/give-feedback",
        method: "POST",
        payload: finalPayload,
      });

      if (res.success) {
        toast.success(res.data.message);
        await callBooking(1);

        const bootstrap = (window as any).bootstrap;
        const modal = document.getElementById("rate-contractor-popup");
        if (modal) {
          const instance =
            bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
          instance.hide();
        }
        return;
      }

      toast.error(res.data.message);
      return;
    }

    // 2. 4-5 stars flow -> Store payload in state and switch modals
    setReviewPayload(finalPayload);

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
                <h1>Rate Your Technician</h1>

                <form>
                  {question?.questions?.map((item: any, index: number) => {
                    const qId = item?.id;
                    const currentRating =
                      ratings.find((r) => r.questionId === qId)?.rating || 0;

                    return (
                      <React.Fragment key={qId}>
                        <h2>{item?.question}</h2>

                        <div className="rating-stars">
                          <div className="rating-group">
                            <input
                              disabled
                              checked={currentRating === 0}
                              className="rating__input rating__input--none"
                              name={`rating-${index}`}
                              id={`rating-${index}-none`}
                              value="0"
                              type="radio"
                              readOnly
                            />

                            {[1, 2, 3, 4, 5].map((star) => (
                              <React.Fragment key={star}>
                                <label
                                  aria-label={`${star} star`}
                                  className="rating__label"
                                  htmlFor={`rating-${index}-${star}`}
                                >
                                  <img
                                    className="rating__icon rating__icon--star"
                                    src={
                                      currentRating >= star
                                        ? "images/star-icon-img.svg"
                                        : "images/rating-star.svg"
                                    }
                                    alt={`star-${star}`}
                                  />
                                </label>

                                <input
                                  className="rating__input"
                                  name={`rating-${index}`}
                                  id={`rating-${index}-${star}`}
                                  value={star}
                                  type="radio"
                                  checked={currentRating === star}
                                  onChange={() => handleRatingChange(qId, star)}
                                />
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}

                  <h2 style={{ marginBottom: "8px", fontWeight: "600" }}>
                    Write your Feedback
                  </h2>

                  <textarea
                    placeholder="Please share your feedback"
                    value={feedback}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFeedback(e.target.value)
                    }
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
                      <img src="images/home/right-img.svg" alt="" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RateSevaServe feedback={feedback} reviewPayload={reviewPayload} />
    </>
  );
};

export default RateContractorPopup;
