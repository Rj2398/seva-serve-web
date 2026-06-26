"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // 💡 Import useRouter

interface RequestModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const RequestModal: React.FC<RequestModalProps> = ({ isOpen, setIsOpen }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // 💡 Initialize router instance

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

  const handleOkayClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // 1. Close this modal via state management
    setIsOpen(false);

    // 2. Safely direct the user back to the homepage
    router.push("/");

    /* 
    💡 Note: If you want to open another modal on the homepage instead of navigating,
    you can un-comment this legacy daisy-chain block. Otherwise, router.push works perfectly.
    
    const nextModal = document.getElementById("add-Your-Card");
    if (nextModal) {
      const bootstrap = (window as any).bootstrap;
      const nextInstance =
        bootstrap.Modal.getInstance(nextModal) ||
        new bootstrap.Modal(nextModal);
      nextInstance.show();
    } 
    */
  };

  return (
    <>
      <div
        ref={modalRef}
        className="modal fade welcome"
        id="requestSuccessfully"
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
                  src="images/modal/requ-sucess.svg"
                  className="check"
                  alt=""
                />
                <h4>Request Sent Successfully!</h4>
                <p>
                  Your quote request has been shared with our admin team. You
                  will receive an update shortly.
                </p>
                <a
                  href="#"
                  onClick={handleOkayClick}
                  className="primary-cta requ-suc"
                >
                  Okay
                  <img
                    src="images/modal/right-arrow-icon.svg"
                    className="arrow"
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestModal;

// "use client";

// import React, { useEffect, useRef } from "react";

// interface RequestModalProps {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
// }

// const RequestModal: React.FC<RequestModalProps> = ({ isOpen, setIsOpen }) => {
//   const modalRef = useRef<HTMLDivElement>(null);

//   // Sync React's isOpen prop with Bootstrap's programmatic Modal instance
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

//   const handleOkayClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
//     e.preventDefault();

//     // Just close this modal via state management
//     setIsOpen(false);

//     // Optional: Daisy-chain next modal trigger if needed
//     const nextModal = document.getElementById("add-Your-Card");
//     if (nextModal) {
//       const bootstrap = (window as any).bootstrap;
//       const nextInstance =
//         bootstrap.Modal.getInstance(nextModal) ||
//         new bootstrap.Modal(nextModal);
//       nextInstance.show();
//     }

//   };

//   return (
//     <>
//       <div
//         ref={modalRef}
//         className="modal fade welcome"
//         id="requestSuccessfully"
//         tabIndex={-1}
//         aria-labelledby="staticBackdropLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-header">
//               <button
//                 type="button"
//                 className="btn-close"
//                 onClick={() => setIsOpen(false)}
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body">
//               <div className="welcome-seva-ser">
//                 <img
//                   src="images/modal/requ-sucess.svg"
//                   className="check"
//                   alt=""
//                 />
//                 <h4>Request Sent Successfully!</h4>
//                 <p>
//                   Your quote request has been shared with our admin team. You
//                   will receive an update shortly.
//                 </p>
//                 <a
//                   href="#add-Your-Card"
//                   onClick={handleOkayClick}
//                   className="primary-cta requ-suc"
//                 >
//                   Okay
//                   <img
//                     src="images/modal/right-arrow-icon.svg"
//                     className="arrow"
//                     alt=""
//                   />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default RequestModal;

// import React from "react";

// const RequestModal = () => {
//   return (
//     <>
//       <div
//         className="modal fade welcome"
//         id="requestSuccessfully"
//         data-bs-backdrop="static"
//         data-bs-keyboard="false"
//         tabIndex={-1}
//         aria-labelledby="staticBackdropLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-header">
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body">
//               <div className="welcome-seva-ser">
//                 <img
//                   src="images/modal/requ-sucess.svg"
//                   className="check"
//                   alt=""
//                 />
//                 <h4>Request Sent Successfully!</h4>
//                 <p>
//                   Your quote request has been shared with our admin team. You
//                   will receive an update shortly.
//                 </p>
//                 <a
//                   href="#add-Your-Card"
//                   data-bs-toggle="modal"
//                   className="primary-cta requ-suc"
//                 >
//                   Okay
//                   <img
//                     src="images/modal/right-arrow-icon.svg"
//                     className="arrow"
//                     alt=""
//                   />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default RequestModal;
