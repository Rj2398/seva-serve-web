"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const PaymentInvoiceModal = ({
  isOpen,
  setIsOpen,
  onClose,
  isDownloadInvoice = false,
  invoiceUrl = "",
  onDownloadInvoice,
  onBookingClick,
}) => {
  const modalRef = useRef(null);
  const router = useRouter();

  // Sync React's isOpen prop with Bootstrap's programmatic Modal instance
  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const bootstrap = typeof window !== "undefined" ? window.bootstrap : null;
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
      if (setIsOpen) setIsOpen(false);
      if (onClose) onClose();
    };

    modalElement.addEventListener("hidden.bs.modal", handleModalHidden);
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleModalHidden);
    };
  }, [isOpen, setIsOpen, onClose]);

  const cleanupBackdrop = () => {
    if (typeof document !== "undefined") {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((el) => el.remove());
    }
  };

  const handleDownloadInvoice = (e) => {
    if (e) e.preventDefault();

    // 1. Open invoice in new tab if available or custom callback
    if (onDownloadInvoice) {
      onDownloadInvoice();
    } else if (invoiceUrl) {
      window.open(invoiceUrl, "_blank");
    } else {
      toast.error("Invoice not available.");
    }

    // 2. Close modal immediately
    const modalElement =
      modalRef.current ||
      (typeof document !== "undefined"
        ? document.getElementById("dwonloadInvoice")
        : null);

    if (modalElement && typeof window !== "undefined" && window.bootstrap) {
      const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }

    if (setIsOpen) setIsOpen(false);
    if (onClose) onClose();
    cleanupBackdrop();

    // 3. Navigate to booking in current tab
    if (onBookingClick) {
      onBookingClick();
    } else {
      router.push("/booking");
    }
  };

  const handleGoToBooking = (e) => {
    if (e) e.preventDefault();

    const modalElement =
      modalRef.current ||
      (typeof document !== "undefined"
        ? document.getElementById("dwonloadInvoice")
        : null);

    if (modalElement && typeof window !== "undefined" && window.bootstrap) {
      const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }

    if (setIsOpen) setIsOpen(false);
    if (onClose) onClose();
    cleanupBackdrop();

    if (onBookingClick) {
      onBookingClick();
    } else {
      router.push("/booking");
    }
  };

  const handleClose = () => {
    const modalElement =
      modalRef.current ||
      (typeof document !== "undefined"
        ? document.getElementById("dwonloadInvoice")
        : null);

    if (modalElement && typeof window !== "undefined" && window.bootstrap) {
      const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }

    if (setIsOpen) setIsOpen(false);
    if (onClose) onClose();
    cleanupBackdrop();
  };

  return (
    <div
      ref={modalRef}
      className="modal fade welcome"
      id="dwonloadInvoice"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
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
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="welcome-seva-ser">
              <img
                src="/images/modal/requ-sucess.svg"
                className="check"
                alt="Payment Successful"
              />
              <h4 className="text-center">Payment Completed Successfully!</h4>

              <p>
                Thank you for your payment. Your transaction has been processed securely.
              </p>

              {isDownloadInvoice ? (
                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  style={{
                    cursor: "pointer",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  className="primary-cta requ-suc same"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      d="M2.6665 10.6693V11.3333C2.6665 11.8638 2.87722 12.3725 3.25229 12.7475C3.62736 13.1226 4.13607 13.3333 4.6665 13.3333H11.3332C11.8636 13.3333 12.3723 13.1226 12.7474 12.7475C13.1225 12.3725 13.3332 11.8638 13.3332 11.3333V10.6667M7.99984 3V10.3333M7.99984 10.3333L10.3332 8M7.99984 10.3333L5.6665 8"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Download Invoice</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGoToBooking}
                  style={{
                    cursor: "pointer",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="primary-cta requ-suc same"
                >
                  Go to Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInvoiceModal;
