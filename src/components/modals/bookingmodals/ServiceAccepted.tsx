"use client";

import { globalServerRequest } from "@/actions/globalApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface ServiceAcceptedProps {
  serviceId: string;
}

const ServiceAccepted = ({ serviceId }: ServiceAcceptedProps) => {

  const router = useRouter();

  const handleConfirm = async () => {
    let response;
    try {
      response = await globalServerRequest({
        endpoint: `quotes/accept/${serviceId}`,
        method: "PUT",
        payload: { id: serviceId },
      });

      if (response.success) {
        router.push(`/payment?booking_id=${serviceId}`);
      }
    } catch (error) {
      console.error("Failed to accept booking:", error);
    }
  };

  return (
    <div
      className="modal fade welcome"
      id="servicesAccepted"
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
            ></button>
          </div>
          <div className="modal-body">
            <div className="welcome-seva-ser">
              <img
                src="images/modal/requ-sucess.svg"
                className="check"
                alt=""
              />
              <h4>Services Accepted</h4>
              <p>You’ve successfully accepted the additional services.</p>
              {/* <p>  The job details have been updated and work will continue as scheduled.</p> */}
              <Link
                href=""
                style={{ cursor: "pointer" }}
                onClick={handleConfirm}
                className="primary-cta requ-suc same"
              >
                Confirm & Pay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAccepted;
