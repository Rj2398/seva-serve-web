"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";

interface AddCardModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, setIsOpen }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Sync React's isOpen prop with Bootstrap's programmatic Modal instance
  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const bootstrap = (window as any).bootstrap;
    if (!bootstrap) return;

    const modalInstance =
      bootstrap.Modal.getInstance(modalElement) ||
      new bootstrap.Modal(modalElement, {
        backdrop: "static",
        keyboard: false,
      });

    if (isOpen) {
      modalInstance.show();
    } else {
      modalInstance.hide();
    }

    const handleModalHidden = () => {
      setIsOpen(false);
    };

    modalElement.addEventListener("hidden.bs.modal", handleModalHidden);
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleModalHidden);
    };
  }, [isOpen, setIsOpen]);

  return (
    <>
      <div
        ref={modalRef}
        className="modal fade welcome"
        id="add-Your-Card"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="welcome-seva-ser">
                <img
                  src="images/modal/add-to-cart.svg"
                  className="check"
                  alt=""
                />
                <h4>Add Your Card</h4>
                <p>
                  To complete your future bookings, please add your payment
                  card.
                </p>
                <Link
                  href="/add-new-card"
                  onClick={() => setIsOpen(false)} // Cleanly close modal via state on click before routing
                  className="primary-cta"
                >
                  Add Card
                  <img
                    src="images/modal/right-arrow-icon.svg"
                    className="arrow"
                    alt=""
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCardModal;

// "use client"
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'

// import React from 'react'

// const AddCardModal = () => {
//     const router=useRouter()
//     return (
//         <div
//             className="modal fade welcome"
//             id="add-Your-Card"
//             data-bs-backdrop="static"
//             data-bs-keyboard="false"
//             tabIndex={-1}
//             aria-labelledby="staticBackdropLabel"
//             aria-hidden="true"
//         >
//             <div className="modal-dialog modal-dialog-centered">
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <button
//                             type="button"
//                             className="btn-close"
//                             data-bs-dismiss="modal"
//                             aria-label="Close"
//                         ></button>
//                     </div>
//                     <div className="modal-body">
//                         <div className="welcome-seva-ser">
//                             <img src="images/modal/add-to-cart.svg" className="check" alt="" />
//                             <h4>Add Your Card</h4>
//                             <p>
//                                 To complete your future bookings, please add your payment card.
//                             </p>
//                             <Link href="/add-new-card" onClick={()=>router.push("/add-new-card")} className="primary-cta" data-bs-dismiss="modal"
//                             >Add Card
//                                 <img
//                                     src="images/modal/right-arrow-icon.svg"
//                                     className="arrow"
//                                     alt=""
//                                 /></Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default AddCardModal
