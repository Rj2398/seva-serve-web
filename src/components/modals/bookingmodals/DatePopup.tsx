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

interface booking {
  booking_id: number;
}
// Interface for the array payload you requested
interface SelectedSlotPayload {
  date: string;
  slotId: number;
  label?: string; // Stored locally to render text in the UI list cleanly
}

export interface ReschedulePayload {
  availabilitySlots: { date: string; slotId: string }[];
  address: string;
}

// interface DatePopupProps {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
//   // Callback now receives your exact array payload format
// onConfirm?: (data: {
//   // availabilitySlots: { date: string; slotIds: string }[];
//   availabilitySlots: { date: string; slotId: string }[];
//   address: string;
// }) => void;
// }
interface DatePopupProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  // Callback now receives your exact array payload format
  onConfirm?: (data: ReschedulePayload) => void;
  getAddressIdCallback?: (addressId: string) => void;
  booking_Id?: number | string;
}

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DatePopup: React.FC<DatePopupProps> = ({
  isOpen,
  setIsOpen,
  onConfirm,
  getAddressIdCallback,
  booking_Id,
}) => {
  // console.log("onConfirm up", onConfirm)
  // console.log("isOpen up", isOpen)
  // console.log("setIsOpen up", setIsOpen)
  console.log(booking_Id, "booking_Id");
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [address, setAddress] = useState<string>("");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  console.log(selectedAddressId, "saved *****");

  // Holds all selected slots across different dates
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlotPayload[]>([]);

  const [timeSlots, setTimeSlots] = useState<ApiTimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // 2. Safely parse out the data array inside the fetch effect
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await globalServerRequest({
          endpoint: "profile/address",
          method: "GET",
        });
        if (response.success) {
          const data = response?.data?.data || response?.data;
          const addressArray = Array.isArray(data) ? data : [];
          setSavedAddresses(addressArray);
          if (addressArray.length > 0) {
            const firstAddr = addressArray[0];
            const addrString = [
              firstAddr.type ? `${firstAddr.type} -` : "",
              firstAddr.flat_house_building,
              firstAddr.area_sector_locality,
              firstAddr.city,
            ]
              .filter(Boolean)
              .join(" ");
            setAddress(addrString);
            setSelectedAddressId(String(firstAddr.id));
          }
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

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
      fetchAddresses();
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
      setSelectedSlots([]); // Clear slots on open
      setSelectedDate(getTodayString()); // Set date to today on open
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

        const datepicker = ($("#datepicker-2") as any).datepicker({
          minDate: 0,
          dateFormat: "yy-mm-dd", // Changed to match your JSON payload format (YYYY-MM-DD)
          onSelect: (dateText: string) => {
            setSelectedDate(dateText);
          },
        });

        // Set today's date selected in the UI calendar
        datepicker.datepicker("setDate", new Date());
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
      const slotsForSameDate = selectedSlots.filter(
        (item) => item.date === selectedDate
      );

      if (slotsForSameDate.length >= 3) {
        toast.error("You can select a maximum of 3 slots for the same date");
        return;
      }

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

    if (!address) {
      toast.error("Please select a service address");
      return;
    }

    // Group selected slots by date to format as [{"date":"YYYY-MM-DD","slotIds":"id1,id2,..."}, ...]
    const grouped: { [date: string]: number[] } = {};
    selectedSlots.forEach((item) => {
      if (!grouped[item.date]) {
        grouped[item.date] = [];
      }
      grouped[item.date].push(item.slotId);
    });

    const cleanedSlots = Object.keys(grouped).map((date) => ({
      date,
      // slotIds: grouped[date].join(","),
      slotId: grouped[date].join(","),
    }));

    console.log("Output Array sent to callback:", cleanedSlots);

    // Send selectedAddressId or fallback to the typed address
    const payloadAddress = selectedAddressId || address;
    console.log(" onConfirm datepopup:", onConfirm);
    if (onConfirm) {
      onConfirm({
        availabilitySlots: cleanedSlots,
        address: payloadAddress,
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

                    <div
                      className="select-time-btn-grp"
                      style={{
                        maxHeight: "220px",
                        overflowY: "auto",
                        paddingRight: "5px",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                      }}
                    >
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
                                  width: "100%",
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

                <div className="service-address position-relative dropdown">
                  <p>Service Address</p>
                  <input
                    type="text"
                    placeholder="Enter full address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setSelectedAddressId(""); // Reset ID if user types custom address
                    }}
                    className="dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  />
                  {savedAddresses.length > 0 && (
                    <ul
                      className="dropdown-menu"
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      {savedAddresses.map((addr) => {
                        const addrString = [
                          addr.type ? `${addr.type} -` : "",
                          addr.flat_house_building,
                          addr.area_sector_locality,
                          addr.city,
                        ]
                          .filter(Boolean)
                          .join(" ");

                        return (
                          <li key={addr.id}>
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setAddress(addrString);
                                setSelectedAddressId(String(addr.id));
                                getAddressIdCallback?.(String(addr.id));
                              }}
                            >
                              {addrString}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
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
                    onClick={
                       handleConfirmBooking
                    }
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
