"use client"


import React from 'react'
import toast from 'react-hot-toast';
import { globalServerRequest } from '@/actions/globalApi';

interface ServiceAcceptedProps {
  serviceId: string;
}


export default function NewServiceRejectionModal({ serviceId }: ServiceAcceptedProps) {

  const [reason, setReason] = React.useState<string>("");

  // const handleServiceRejection = () => {
  //   if (reason.trim() === "") {
  //     toast.error("Please provide a reason for rejection.");

  //     return;
  //   }
  // }

  const handleServiceRejection = async (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }

    try {
      const response = await globalServerRequest({
        endpoint: `quotes/reject/${serviceId}`,
        method: "PUT",
        payload: { rejection_reason: reason }
      });

      console.log(" rejected services response  ", response)
      if (response.success) {
        const bootstrap = (window as any).bootstrap;

        const currentModalEl = document.getElementById("servicesRejection");
        const confirmModalEl = document.getElementById("#servicesRejected");

        if (!currentModalEl) return;

        const currentModal =
          bootstrap?.Modal?.getInstance(currentModalEl) ||
          bootstrap?.Modal?.getOrCreateInstance(currentModalEl);

        currentModal.hide();

        if (confirmModalEl) {
          currentModalEl.addEventListener(
            "hidden.bs.modal",
            () => {
              const confirmModal =
                bootstrap?.Modal?.getOrCreateInstance(confirmModalEl);

              confirmModal?.show();
            },
            { once: true }
          );
        }
      } else {
        toast.error("Failed to reject service. Please try again.");
      }
    } catch (error) {
      console.error("Rejection Error:", error);
      toast.error("An error occurred while rejecting the service.");
    }
  };

  return (
    <div className="modal fade welcome" id="servicesRejection" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="welcome-seva-ser">
              <h4>Services Rejection</h4>
              <p>Help us understand why you’re rejecting <br />
                this service.</p>
              <div className="reject-text-area">
                <label htmlFor="">Reason for Rejection</label>
                <textarea
                  placeholder="Share your reason for rejection"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
              </div>
              <div className="home-quotes-cta">

                <a href="#" className="primary-cta rgt"
                  onClick={handleServiceRejection}>  Reject </a>
                <button type="button" data-bs-dismiss="modal" className="reject-btn">Cancel</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}