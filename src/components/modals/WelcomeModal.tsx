"use client";

import React, { useEffect, useRef } from "react";

interface WelcomeModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onConfirm?: () => void; // 💡 Optional callback function passed from parent
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, setIsOpen, onConfirm }) => {
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

    const handleExploreService = () => {
        // 1. SAVE LOGIN STATUS
        localStorage.setItem("isLoggedIn", "true");
        window.dispatchEvent(new Event("loginStatusChanged"));

        // 2. CLOSE THIS MODAL Programmatically via State
        setIsOpen(false);

        // 3. EXECUTE THE CALLBACK IF PROVIDED BY PARENT
        if (onConfirm) {
            onConfirm();
        } else {
            // Fallback: If no callback is passed, run your default daisy-chain behavior
            const nextModal = document.getElementById("add-Your-Card");
            if (nextModal) {
                const bootstrap = (window as any).bootstrap;
                const nextInstance =
                    bootstrap.Modal.getInstance(nextModal) || new bootstrap.Modal(nextModal);
                nextInstance.show();
            }
        }
    };

    return (
        <div
            ref={modalRef}
            className="modal fade welcome"
            id="welcome-SevaServeModal"
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
                            <img src="images/modal/welcome-img.svg" className="check" alt="Welcome" />
                            <h4>Welcome to SevaServe!</h4>
                            <p>Your trusted service partner is now in your pocket.</p>

                            <button
                                type="button"
                                onClick={handleExploreService}
                                className="primary-cta"
                                style={{
                                    textAlign: "center",
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "8px",
                                }}
                            >
                                Explore Services
                                <img
                                    src="images/modal/right-arrow-icon.svg"
                                    className="arrow"
                                    alt=""
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;






// "use client";

// import React from 'react'

// const WelcomeModal = () => {

//     const handleExploreService = () => {
//         // SAVE LOGIN STATUS
//         localStorage.setItem("isLoggedIn", "true");

//         window.dispatchEvent(new Event("loginStatusChanged"));

//         // CLOSE MODAL
//         const modal = document.getElementById("welcome-SevaServeModal");

//         if (modal) {
//             const bootstrapModal = window.bootstrap?.Modal.getInstance(modal);

//             bootstrapModal?.hide();
//         }

//         const nextModal = document.getElementById("add-Your-Card");

//         if (nextModal) {
//             const nextInstance = new window.bootstrap.Modal(nextModal);

//                 nextInstance.show();
//         }

//     }
//     return (
//         <div
//             className="modal fade welcome"
//             id="welcome-SevaServeModal"
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
//                             <img src="images/modal/welcome-img.svg" className="check" alt="" />
//                             <h4>Welcome to SevaServe!</h4>
//                             <p>Your trusted service partner is now in your pocket.</p>
//                             {/* <a
//                                 href="#add-Your-Card"
//                                 data-bs-toggle="modal"
//                                 className="primary-cta"
//                             >Explore Services
//                                 <img
//                                     src="images/modal/right-arrow-icon.svg"
//                                     className="arrow"
//                                     alt=""
//                                 /></a> */}
//                             <button type="button"
//                                 // href="#add-Your-Card"
//                                 // data-bs-toggle="modal"
//                                 onClick={handleExploreService}
//                                 className="primary-cta"
//                                 style={{ textAlign: "center", display: "flex", justifyContent: "center",gap: "8px"   }}
//                             >Explore Services
//                                 <img
//                                     src="images/modal/right-arrow-icon.svg"
//                                     className="arrow"
//                                     alt=""
//                                 /></button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default WelcomeModal