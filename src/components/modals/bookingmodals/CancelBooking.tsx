// import Link from 'next/link'
// import React, { useEffect, useRef } from 'react'


// interface BookingProps {
//   bookingData?: any;
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
//   onConfirm?: (data: CanclePayload) => void;
// }

// const CancelBooking = ({ bookingData, isOpen, setIsOpen, onConfirm }: BookingProps) => {
//   const modalRef = useRef<HTMLDivElement>(null);

//   console.log("bookingData", bookingData?.bookingDateTime)

//   useEffect(() => {
//     const modalElement = modalRef.current;
//     if (!modalElement) return;

//     const bootstrap = (window as any).bootstrap;
//     if (!bootstrap) return;

//     const modalInstance =
//       bootstrap.Modal.getInstance(modalElement) ||
//       new bootstrap.Modal(modalElement, {
//         backdrop: "static",
//         keyboard: false,
//       });

//     if (isOpen) {
//       // Set date to today on open
//       modalInstance.show();
//     } else {
//       modalInstance.hide();
//     }

//     const handleModalHidden = () => {
//       setIsOpen(false);
//     };

//     modalElement.addEventListener("hidden.bs.modal", handleModalHidden);
//     return () => {
//       modalElement.removeEventListener("hidden.bs.modal", handleModalHidden);
//     };
//   }, [isOpen, setIsOpen]);


//   const canReschedule = (
//     bookingDateTime: string | Date | null | undefined
//   ): boolean => {
//     if (!bookingDateTime) return false;

//     const bookingDate = new Date(bookingDateTime);

//     if (isNaN(bookingDate.getTime())) {
//       return false;
//     }

//     const now = Date.now();

//     // Time remaining until booking
//     const remainingTime = bookingDate.getTime() - now;

//     // Allow only if at least 24 hours remain
//     return remainingTime >= 24 * 60 * 60 * 1000;
//   };


//   return (
//     <>
//       <div
//         ref={modalRef}
//         className="modal fade"
//         id="cancelBookingPopup"
//         data-bs-backdrop="static"
//         tabIndex={-1}
//         aria-labelledby="exampleModalLabel" aria-hidden="true">
//         <div className="modal-dialog  modal-dialog-centered">
//           <div className="modal-content">
//             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//             <div className="modal-body">
//               <div className="select-date-time-wrp cancel-nooking">
//                 <h1>Cancel Booking</h1>
//                 <div>
//                   <h5>PLEASE NOTE:</h5>
//                   <p className="body-text">If cancelled, you may lose your deposit. If possible, please try rescheduling or contact <a href="#">Help & Support</a> for assistance.</p>
//                   <p className="notice">Notice:  <span> Bookings cannot be cancelled within 24 hours of the appointment.</span></p>
//                   <div className="cnl-cta">
//                     <button className="secondary-cta" data-bs-target="#select-date-time-popup" data-bs-toggle="modal" >Reschedule</button>
//                     <button type="button" className={`secondary-cta ${canReschedule(bookingData?.bookingDateTime) ? "" : "cancel"}`}
//                       onClick={() => {
//                         canReschedule(bookingData?.bookingDateTime) ? onConfirm(bookingData) : null,
//                         setIsOpen(false)
//                       }}
//                     >Cancel</button>
//                   </div>
//                   <p className="contact"><Link href="/help-support" >Contact Help & Support</Link></p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div >
//     </>
//   )
// }

// export default CancelBooking




"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";

interface CancelBookingProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onReschedule: () => void;
}

const CancelBooking = ({
  isOpen,
  setIsOpen,
  onReschedule,
}: CancelBookingProps) => {

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

              <h1>Cancel Booking</h1>

              <div>

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

                <div className="cnl-cta">

                  <button
                    className="secondary-cta"
                    onClick={onReschedule}
                  >
                    Reschedule
                  </button>

                  <button
                    className="secondary-cta cancel"
                    onClick={() => setIsOpen(false)}
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
