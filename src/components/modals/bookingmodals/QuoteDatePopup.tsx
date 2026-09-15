"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { globalServerRequest } from "@/actions/globalApi";
import NewAddressModal from "../Address/NewAddressModal";

interface ApiTimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  duration: number;
  label: string;
}

interface SelectedSlotPayload {
  date: string;
  slotId: number;
  label?: string;
}

interface QuoteDatePopupProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  quoteId?: number | string;
  onSuccess?: (data?: any) => void;
  getAddressIdCallback?: (addressId: string) => void;
}

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const QuoteDatePopup: React.FC<QuoteDatePopupProps> = ({
  isOpen,
  setIsOpen,
  quoteId,
  onSuccess,
  getAddressIdCallback,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [address, setAddress] = useState<string>("");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlotPayload[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedSlotsRef = useRef(selectedSlots);
  useEffect(() => {
    selectedSlotsRef.current = selectedSlots;
  }, [selectedSlots]);

  const selectedDateRef = useRef(selectedDate);
  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  const [timeSlots, setTimeSlots] = useState<ApiTimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

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
          getAddressIdCallback?.(String(firstAddr.id));
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  useEffect(() => {
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const response = await globalServerRequest({
          endpoint: `quotes/time-slots?date=${selectedDate}`,
          method: "GET",
          isFormData: false,
        });

        if (response?.success) {
          const slotsArray = Array.isArray(response.data)
            ? response.data
            : response.data?.data || [];
          setTimeSlots(slotsArray);
        } else {
          toast.error(response?.error || "Failed to load time slots");
          setTimeSlots([]);
        }
      } catch (error: any) {
        console.error("Error fetching slots:", error);
        toast.error(error?.message || "Error loading time slots");
        setTimeSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    if (isOpen) {
      fetchSlots();
      fetchAddresses();
    }
  }, [isOpen, selectedDate]);

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
      setSelectedSlots([]);
      setSelectedDate(getTodayString());
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

  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const initDatepicker = () => {
      const $ = (window as any).$;
      if ($ && $.fn?.datepicker) {
        if ($("#quote-datepicker").hasClass("hasDatepicker")) {
          $("#quote-datepicker").datepicker("destroy");
        }

        const datepicker = ($("#quote-datepicker") as any).datepicker({
          minDate: 0,
          dateFormat: "yy-mm-dd",
          onSelect: (dateText: string) => {
            const currentSelectedSlots = selectedSlotsRef.current;
            const uniqueDates = Array.from(
              new Set(currentSelectedSlots.map((item) => item.date))
            );

            if (!uniqueDates.includes(dateText) && uniqueDates.length >= 3) {
              toast.error("You can select a maximum of 3 dates");
              setTimeout(() => {
                const $ = (window as any).$;
                $("#quote-datepicker").datepicker(
                  "setDate",
                  selectedDateRef.current
                );
              }, 10);
              return;
            }

            setSelectedDate(dateText);
          },
        });

        datepicker.datepicker("setDate", new Date());
      }
    };

    modalElement.addEventListener("shown.bs.modal", initDatepicker);
    return () => {
      modalElement.removeEventListener("shown.bs.modal", initDatepicker);
    };
  }, []);

  const handleSlotToggle = (slotId: number, label: string) => {
    if (!selectedDate) {
      toast.error("Please select a date from the calendar first");
      return;
    }

    const itemExists = selectedSlots.find(
      (item) => item.date === selectedDate && item.slotId === slotId
    );

    if (itemExists) {
      setSelectedSlots((prev) =>
        prev.filter(
          (item) => !(item.date === selectedDate && item.slotId === slotId)
        )
      );
    } else {
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

  const handleConfirmBooking = async () => {
    if (selectedSlots.length === 0) {
      toast.error("Please select at least one date and time slot");
      return;
    }

    if (!address && !selectedAddressId) {
      toast.error("Please select a service address");
      return;
    }

    const availabilitySlots = selectedSlots.map((item) => ({
      slotId: String(item.slotId),
      date: item.date,
    }));

    const payload = {
      quote_id: Number(quoteId),
      address_id: Number(selectedAddressId),
      availabilitySlots,
    };

    console.log("Update Quote Data Payload:", payload);
    setIsSubmitting(true);

    try {
      const response = await globalServerRequest({
        endpoint: "quotes/update-quote-data",
        method: "POST",
        payload,
      });

      if (response?.success) {
        toast.success("Quote updated successfully!");
        onSuccess?.(response?.data?.data || response?.data);
        setIsOpen(false);
      } else {
        toast.error(response?.error || "Failed to update quote data");
      }
    } catch (error: any) {
      console.error("Error updating quote data:", error);
      toast.error(error?.message || "An error occurred while updating quote");
    } finally {
      setIsSubmitting(false);
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
    <>
      <style>{`
        #quote-date-time-popup .modal-dialog {
          max-width: 780px !important;
        }
        #quote-date-time-popup .select-date-time-inner {
          display: flex !important;
          gap: 20px !important;
          align-items: flex-start !important;
        }
        #quote-date-time-popup .select-date-in {
          flex: 0 0 330px !important;
          width: 330px !important;
          max-width: 330px !important;
        }
        #quote-date-time-popup .select-time-in {
          flex: 1 !important;
          min-width: 0 !important;
          width: auto !important;
        }
        #quote-datepicker table th {
          width: 14.28% !important;
          font-size: 13px !important;
          text-align: center !important;
        }
        #quote-datepicker .ui-datepicker-calendar td a,
        #quote-datepicker .ui-datepicker-calendar td span {
          width: 34px !important;
          height: 34px !important;
          line-height: 34px !important;
          font-size: 13px !important;
          margin: 0 auto !important;
        }
        #quote-datepicker .ui-datepicker-inline {
          width: 100% !important;
          box-sizing: border-box !important;
          padding: 10px !important;
        }
      `}</style>
      <div
        ref={modalRef}
        className="modal fade"
        id="quote-date-time-popup"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ borderRadius: "20px", padding: "10px" }}>
            <button
              type="button"
              className="btn-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              style={{ position: "absolute", top: "20px", right: "20px", zIndex: 10 }}
            ></button>

            <div className="modal-body p-4">
              <div className="select-date-time-wrp">
                <h3 className="fw-bold mb-4" style={{ fontSize: "20px", color: "#1f2937" }}>
                  Select Date & Time
                </h3>

                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="select-date-time-inner">
                    <div className="select-date-in">
                      <div id="quote-datepicker" style={{ width: "100%" }}></div>
                    </div>

                    <div className="select-time-in">
                      {selectedSlots.length > 0 && (
                        <div
                          className="saved-date-times"
                          style={{
                            maxHeight: "120px",
                            overflowY: "auto",
                            marginBottom: "15px",
                          }}
                        >
                          <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
                            Selected Slots ({selectedSlots.length})
                          </h4>
                          {selectedSlots.map((item, index) => (
                            <div
                              key={index}
                              className="d-flex align-items-center justify-content-between mb-1 bg-light p-2 rounded-3"
                            >
                              <small style={{ fontSize: "12px", color: "#374151" }}>
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

                      <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px", color: "#111827" }}>
                        Available Time Slots
                        {selectedDate &&
                          ` for ${formatDateLabel(selectedDate)}`}
                      </h4>

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
                          <p className="text-muted small">Loading available slots...</p>
                        ) : timeSlots.length === 0 ? (
                          <p className="text-muted small">No time slots available</p>
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
                                  type="checkbox"
                                  hidden
                                  id={`quote-time-${slot.id}`}
                                  name="time"
                                  checked={isChecked}
                                  onChange={() =>
                                    handleSlotToggle(slot.id, slot.label)
                                  }
                                />
                                <label
                                  htmlFor={`quote-time-${slot.id}`}
                                  style={{
                                    width: "100%",
                                    border: isChecked
                                      ? "1px solid #800020"
                                      : "1px solid #e5e7eb",
                                    backgroundColor: isChecked
                                      ? "#fff5f5"
                                      : "#ffffff",
                                    color: isChecked ? "#800020" : "#374151",
                                    padding: "10px 12px",
                                    borderRadius: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  <i className="fa-regular fa-clock" style={{ fontSize: "14px" }}></i>{" "}
                                  {slot.label}
                                </label>
                              </React.Fragment>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="service-address position-relative dropdown mt-4">
                    <p className="fw-semibold mb-2" style={{ fontSize: "15px", color: "#111827" }}>
                      Service Address
                    </p>
                    {savedAddresses.length > 0 ? (
                      <input
                        type="text"
                        placeholder="Enter full address"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          setSelectedAddressId("");
                        }}
                        className="dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{
                          width: "100%",
                          height: "46px",
                          padding: "12px 18px",
                          borderRadius: "30px",
                          border: "1px solid #d1d5db",
                          fontSize: "14px",
                          outline: "none",
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter full address"
                        data-bs-target="#add-address-popup"
                        data-bs-toggle="modal"
                        className="dropdown-toggle"
                        aria-expanded="false"
                        style={{
                          width: "100%",
                          height: "46px",
                          padding: "12px 18px",
                          borderRadius: "30px",
                          border: "1px solid #d1d5db",
                          fontSize: "14px",
                          outline: "none",
                        }}
                      />
                    )}
                    {savedAddresses.length > 0 && (
                      <ul
                        className="dropdown-menu shadow-sm border-0 mt-1"
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          overflowY: "auto",
                          borderRadius: "14px",
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
                                className="dropdown-item py-2 px-3"
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

                  <div className="select-date-time-foot mt-4 d-flex justify-content-end gap-3">
                    <button
                      type="button"
                      className="btn px-4 py-2 fw-semibold"
                      onClick={() => setIsOpen(false)}
                      disabled={isSubmitting}
                      style={{
                        borderRadius: "30px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#ffffff",
                        color: "#374151",
                        fontSize: "14px",
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="btn px-4 py-2 fw-bold text-white d-flex align-items-center gap-2"
                      onClick={handleConfirmBooking}
                      disabled={isSubmitting}
                      style={{
                        borderRadius: "30px",
                        backgroundColor: "#800020",
                        borderColor: "#800020",
                        fontSize: "14px",
                      }}
                    >
                      {isSubmitting ? "Updating..." : "Update Schedule"}
                      <i className="fa-solid fa-arrow-right fs-6"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NewAddressModal
        selectedAddress={null}
        onSave={() => {
          fetchAddresses();
        }}
        onClose={() => {}}
      />
    </>
  );
};

export default QuoteDatePopup;
