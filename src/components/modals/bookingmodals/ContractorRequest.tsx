"use client";

import React, { useState } from 'react';
import DatePopup from './DatePopup';

// 1. Extend the global Window interface for Bootstrap
declare global {
  interface Window {
    bootstrap?: {
      Modal: {
        getInstance: (element: HTMLElement) => { hide: () => void } | null;
      };
    };
  }
}


// 2. Define strict TypeScript interfaces for your booking prop
interface ServiceItem {
  serviceName?: string;
  [key: string]: any; // Allows fallback for other service properties
}

interface ContractorTimeRequest {
  preferredDateTime?: string;
  contractorSuggestedSlot?: string;
  requestId?: string | number;
}

interface BookingData {
  categoryName?: string;
  services?: ServiceItem[];
  contractorTimeRequest?: ContractorTimeRequest;
}

interface ContractorRequestProps {
  booking: BookingData | null | undefined; // Safe for null/uninitialized states
}

const ContractorRequest = ({ booking }: ContractorRequestProps) => {
  console.log(booking, "jdsfdksfjkfj");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const handlePopupOpen = () => {
    const currentModal = document.getElementById("contractorTime");
    if (currentModal) {
      // TypeScript now safely acknowledges window.bootstrap
      const bootstrapModal = window.bootstrap?.Modal.getInstance(currentModal);
      bootstrapModal?.hide();
    }
    setShowDatePicker(true);
  };

  // Optional: Safe access extraction to make your JSX cleaner and prevent array index crashes
  const firstService = booking?.services?.[0];

  return (
    <>
      <div
        className="modal fade header-bdr"
        id="contractorTime"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              <h5 className="modal-title">Contractor’s Time Request</h5>
            </div>
            <div className="modal-body">
              <div className="welcome-seva-ser full-bdr">
                <div className="plumbing-repair">
                  <h6>{booking?.categoryName} - {firstService?.serviceName}</h6>
                  <p>Preferred : {booking?.contractorTimeRequest?.preferredDateTime}</p>
                  <p><img src="images/modal/location-icon.svg" alt="" /></p>
                </div>
                <div className="contractor-new">
                  <h6>Contractor Suggested New Time</h6>
                  <p>{booking?.contractorTimeRequest?.contractorSuggestedSlot}</p>
                </div>
                <div className="contractor-btn">
                  <a href="#" data-bs-toggle="modal" className="secondary-cta">Reject</a>
                  <a href="#" onClick={handlePopupOpen} className="Propose-cta">Propose</a>
                  <a href="#" data-bs-toggle="modal" className="primary-cta">
                    Accept <img src="images/modal/right-arrow-icon.svg" alt="" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DatePopup
        isOpen={showDatePicker}
        setIsOpen={setShowDatePicker}
      // requestId={booking?.contractorTimeRequest?.requestId}
      />
    </>
  );
};

export default ContractorRequest;