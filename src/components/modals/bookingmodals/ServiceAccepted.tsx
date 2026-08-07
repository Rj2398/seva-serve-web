"use client";

import { globalServerRequest } from "@/actions/globalApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface ServiceAcceptedProps {
  serviceId: string;
  isAddactional: boolean
  additionalId: string
}

const ServiceAccepted = ({ serviceId, isAddactional, additionalId }: ServiceAcceptedProps) => {

  const router = useRouter();

  const handleConfirm = async () => {
    try {
      const updatedEndpoint = isAddactional ? `booking/approve-additional-servies-request` : `quotes/accept/${serviceId}`
      const response = await globalServerRequest({
        endpoint: updatedEndpoint,
        method: isAddactional ? "POST" : "PUT",
        payload: {
          ...(isAddactional ? { booking_id: serviceId, status: 'approve', additional_work_id: additionalId } : { id: serviceId }),
        }
      });

      if (response.success) {
        isAddactional ? router.push(`/view-booking-detail/?bookingId=${serviceId}`) : router.push(`/checkout/?booking_id=${serviceId}`);
      }
      // if (isAddactional) {

      //   if (response.success) {
      //     router.push(`/view-booking-detail/?bookingId=${serviceId}`);
      //   }
      // } else {
      //   response = await globalServerRequest({
      //     endpoint: `quotes/accept/${serviceId}`,
      //     method: "PUT",
      //     payload: { id: serviceId },
      //   });
      //   if (response.success) {
      //     ;
      //   }
      // }


    } catch (error) {
      console.error("Failed to accept booking:", error);
    }
  }

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
              {isAddactional ? <>
                <p>You’ve successfully accepted the additional services.</p>
                <p>  The job details have been updated and work will continue as scheduled.</p>
              </> : <>
                <p>Now pay to start the work</p>
              </>
              }

              <Link
                href=""
                style={{ cursor: "pointer" }}
                onClick={handleConfirm}
                className="primary-cta requ-suc same"
              >
                {isAddactional ? "Back to booking" : "Confirm & Pay"}
              </Link>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAccepted;
