
"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";

interface CancelBookingProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onCancel: (reason: string) => void;
  isQuote?: boolean;
}

const CancelBooking = ({
  isOpen,
  setIsOpen,
  onCancel,
  isQuote = false
}: CancelBookingProps) => {

  const [reason, setReason] = React.useState<string>("");

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalRef.current) return;

    const bootstrap = (window as any).bootstrap;

    if (!bootstrap) return;

    const modal =
      bootstrap.Modal.getOrCreateInstance(modalRef.current);

    if (isOpen) {
      modal.show();
    } else {
      setReason("");
      modal.hide();
    }

    const hiddenHandler = () => {
      setIsOpen(false);
    };

    modalRef.current.addEventListener(
      "hidden.bs.modal",
      hiddenHandler
    );

    return () => {
      modalRef.current?.removeEventListener(
        "hidden.bs.modal",
        hiddenHandler
      );
    };
  }, [isOpen]);


  const handleClose = () => {
    if (onCancel) {
      onCancel(reason);
      setReason("");
    }
    setIsOpen(false);
  };



  return (
    <div
      ref={modalRef}
      className="modal fade"
      id="cancelBookingPopup"
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <button
            type="button"
            className="btn-close"
            onClick={() => setIsOpen(false)}
          ></button>

          <div className="modal-body">

            <div className="select-date-time-wrp cancel-nooking">
              <h1>
                {
                  isQuote ? "Cancel Quote" : "Cancel Booking"
                }</h1>

              <div>
                {
                  isQuote ? (
                    <>
                      <div className="welcome-seva-ser">
                        <img src="images/modal/reject-cross-icon.svg" className="check" alt="" />
                      </div>
                      <p style={{ textAlign: "center", fontSize: "14px", marginTop: "10px", marginBottom: "25px" }}>
                        Are you sure you want to cancel this quote?
                      </p>
                    </>

                  ) : (
                    <>
                      <h5>PLEASE NOTE:</h5>
                      <p className="body-text">
                        If cancelled, you may lose your deposit.
                      </p>
                      <p className="notice">
                        Notice:
                        <span>
                          Bookings cannot be cancelled within
                          24 hours.
                        </span>
                      </p>
                    </>
                  )
                }
                <div className="reject-text-area">
                  {!isQuote && <>
                    <label htmlFor="">Reason for Cancel</label>
                    <textarea
                      placeholder="Share your reason for rejection"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    ></textarea>
                  </>
                  }
                </div>
                <div className="cnl-cta">

                  {
                    isQuote &&
                    <button
                      className="secondary-cta cancel btn"
                      onClick={handleClose}
                      style={{ marginRight: "10px", backgroundColor: "#991318", color: "#fff" }}
                    >
                      Yes
                    </button>
                  }
                  <button
                    className="secondary-cta"
                    onClick={!isQuote ? handleClose : () => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>

                <p className="contact">
                  <Link href="/help-support">
                    Contact Help & Support
                  </Link>
                </p>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CancelBooking;
