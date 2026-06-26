"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { globalServerRequest } from "@/actions/globalApi";

interface ApiTimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  duration: number;
  label: string;
}

// Interface for the array payload you requested
interface SelectedSlotPayload {
  date: string;
  slotId: number;
  label?: string; // Stored locally to render text in the UI list cleanly
}

interface DatePopupProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  // Callback now receives your exact array payload format
  onConfirm?: (data: {
    availabilitySlots: SelectedSlotPayload[];
    address: string;
  }) => void;
}

const DatePopup: React.FC<DatePopupProps> = ({
  isOpen,
  setIsOpen,
  onConfirm,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [address, setAddress] = useState<string>(
    "123, Street, Anywhere, 11001"
  );

  // Holds all selected slots across different dates
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlotPayload[]>([]);

  const [timeSlots, setTimeSlots] = useState<ApiTimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // 2. Safely parse out the data array inside the fetch effect
  useEffect(() => {
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const response = await globalServerRequest({
          endpoint: "quotes/time-slots",
          method: "GET",
          isFormData: false,
        });

        // API Response fallback protection
        if (response?.success) {
          // If the array is nested inside response.data.data or response.data
          const slotsArray = Array.isArray(response.data)
            ? response.data
            : response.data?.data || [];

          setTimeSlots(slotsArray);
        } else {
          toast.error(response?.error || "Failed to load time slots");
          setTimeSlots([]); // Reset to safe fallback array
        }
      } catch (error: any) {
        console.error("Error fetching slots:", error);
        toast.error(error?.message || "Error loading time slots");
        setTimeSlots([]); // Reset to safe fallback array
      } finally {
        setLoadingSlots(false);
      }
    };

    if (isOpen) {
      fetchSlots();
    }
  }, [isOpen]);

  // Bootstrap modal sync lifecycle
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

  // JQuery UI Datepicker initialization
  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const initDatepicker = () => {
      const $ = (window as any).$;
      if ($ && $.fn?.datepicker) {
        if ($("#datepicker-2").hasClass("hasDatepicker")) {
          $("#datepicker-2").datepicker("destroy");
        }

        ($("#datepicker-2") as any).datepicker({
          minDate: 0,
          dateFormat: "yy-mm-dd", // Changed to match your JSON payload format (YYYY-MM-DD)
          onSelect: (dateText: string) => {
            setSelectedDate(dateText);
          },
        });
      }
    };

    modalElement.addEventListener("shown.bs.modal", initDatepicker);
    return () => {
      modalElement.removeEventListener("shown.bs.modal", initDatepicker);
    };
  }, []);

  // Toggle selection handler (adds or removes slots)
  const handleSlotToggle = (slotId: number, label: string) => {
    if (!selectedDate) {
      toast.error("Please select a date from the calendar first");
      return;
    }

    const itemExists = selectedSlots.find(
      (item) => item.date === selectedDate && item.slotId === slotId
    );

    if (itemExists) {
      // Remove slot if already selected for this date
      setSelectedSlots((prev) =>
        prev.filter(
          (item) => !(item.date === selectedDate && item.slotId === slotId)
        )
      );
    } else {
      // Add slot to array
      setSelectedSlots((prev) => [
        ...prev,
        { date: selectedDate, slotId, label },
      ]);
    }
  };

  const removeSpecificSlot = (date: string, slotId: number) => {
    setSelectedSlots((prev) =>
      prev.filter((item) => !(item.date === date && item.slotId === slotId))
    );
  };

  const handleConfirmBooking = () => {
    if (selectedSlots.length === 0) {
      toast.error("Please select at least one date and time slot");
      return;
    }

    // Map to your exact required API structure
    const cleanedSlots = selectedSlots.map((item) => ({
      date: item.date,
      slotId: item.slotId,
    }));

    console.log("Output Array sent to callback:", cleanedSlots);

    if (onConfirm) {
      onConfirm({
        availabilitySlots: cleanedSlots,
        address,
      });
    }

    setIsOpen(false);

    const nextModal = document.getElementById("rescheduleRequest");
    if (nextModal) {
      const bootstrap = (window as any).bootstrap;
      const nextInstance =
        bootstrap.Modal.getInstance(nextModal) ||
        new bootstrap.Modal(nextModal);
      nextInstance.show();
    }
  };

  const formatDateLabel = (dateStr: string) => {
    const parsed = Date.parse(dateStr);
    if (isNaN(parsed)) return dateStr;
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div
      ref={modalRef}
      className="modal fade"
      id="select-date-time-popup"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        {" "}
        {/* Changed to modal-lg to accommodate selected items view cleanly */}
        <div className="modal-content">
          <button
            type="button"
            className="btn-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          ></button>

          <div className="modal-body">
            <div className="select-date-time-wrp">
              <h1>Reschedule Booking</h1>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="select-date-time-inner">
                  <div className="select-date-in">
                    <div id="datepicker-2" style={{ width: "100%" }}></div>
                  </div>

                  <div className="select-time-in">
                    {/* Display currently active accumulated slots */}
                    {selectedSlots.length > 0 && (
                      <div
                        className="saved-date-times"
                        style={{
                          maxHeight: "120px",
                          overflowY: "auto",
                          marginBottom: "15px",
                        }}
                      >
                        <h3>Selected Slots ({selectedSlots.length})</h3>
                        {selectedSlots.map((item, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-center justify-content-between mb-1 bg-light p-1 rounded"
                          >
                            <small style={{ fontSize: "12px" }}>
                              <strong>{formatDateLabel(item.date)}</strong>:{" "}
                              {item.label}
                            </small>
                            <button
                              type="button"
                              className="btn btn-sm text-danger p-0 ms-2"
                              onClick={() =>
                                removeSpecificSlot(item.date, item.slotId)
                              }
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <h2>
                      Available Time Slots
                      {selectedDate && ` for ${formatDateLabel(selectedDate)}`}
                    </h2>

                    <div className="select-time-btn-grp">
                      {loadingSlots ? (
                        <p>Loading available slots...</p>
                      ) : timeSlots.length === 0 ? (
                        <p>No time slots available</p>
                      ) : (
                        timeSlots.map((slot) => {
                          const isChecked = selectedSlots.some(
                            (item) =>
                              item.date === selectedDate &&
                              item.slotId === slot.id
                          );
                          return (
                            <React.Fragment key={slot.id}>
                              <input
                                type="checkbox" // Swapped to checkbox to handle multiple choices per date cleanly
                                hidden
                                id={`time-${slot.id}`}
                                name="time"
                                checked={isChecked}
                                onChange={() =>
                                  handleSlotToggle(slot.id, slot.label)
                                }
                              />
                              <label
                                htmlFor={`time-${slot.id}`}
                                style={{
                                  border: isChecked
                                    ? "1px solid #b30000"
                                    : "1px solid #ccc",
                                  backgroundColor: isChecked
                                    ? "#fff5f5"
                                    : "transparent",
                                }}
                              >
                                <i className="fa-regular fa-clock"></i>{" "}
                                {slot.label}
                              </label>
                            </React.Fragment>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                <div className="service-address">
                  <p>Service Address</p>
                  <input
                    type="text"
                    placeholder="Enter full address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="select-date-time-foot">
                  <button
                    type="button"
                    className="unfilled"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="filled"
                    onClick={handleConfirmBooking}
                  >
                    Confirm & Book
                    <img src="images/home/right-img.svg" alt="" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePopup;
