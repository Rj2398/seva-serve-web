'use client'
import { globalServerRequest } from "@/actions/globalApi";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function ZellePaymentScreen() {
  const route = useRouter()
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id') || '';
  const initialPayment = searchParams.get('initialpayment') || '';
  const remainingPayment = searchParams.get('remaingPayment') || '';
  const paymentType = searchParams.get('paymenttype') || '';
  const quoteId = searchParams.get('quoteId') || '';
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Please select an image smaller than 2MB.");
        e.target.value = "";
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file (PNG, JPG, JPEG).");
        e.target.value = "";
        return;
      }

      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove Image Handler
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  // Payment Submit Handler
  const handlePayment = async (e: any) => {
    e.preventDefault();
    console.log("selectedFile", selectedFile)
    if (!selectedFile) return;
    try {

      const formData = new FormData();
      formData.append("card_id", "");
      formData.append("quote_id", quoteId || bookingId);
      formData.append("amount", paymentType === "full" ? remainingPayment : initialPayment);
      formData.append("type", paymentType === "full" ? "full" : "initial");
      if (selectedFile) {
        formData.append("payment_proof", selectedFile);
      }

      const response = await globalServerRequest({
        endpoint: "payment/card/customer-pay-now-zelle",
        method: "POST",
        payload: formData,
        isFormData: true
        // payload: {
        //   card_id: null,
        //   quote_id: quoteId || bookingId,
        //   // payment_method_id: paymentMethodId,
        //   amount: paymentType === "full" ? remainingPayment : initialPayment,
        //   type: paymentType === "full" ? "full" : "initial",
        //   payment_proof: selectedFile
        // },
      });



      if (response.success) {
        toast.success("Payment completed successfully!");
        route.push("/booking");
      } else {
        toast.error(response.error || "Failed to process payment.", {
          // id: toastId,
        });
      }
    } catch (error) {
      console.error("Payment API Error:", error);
      // toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      // setIsPaying(false);
    }



    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // alert("Payment Screenshot Submitted Successfully!");
    }, 1500);
  };


  return (
    <div className="container py-4" style={{ maxWidth: "600px" }}>
      {/* 1. Header Section (Left Aligned Title & Back Arrow) */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          type="button"
          className="btn btn-light rounded-circle p-0 d-flex justify-content-center align-items-center shadow-sm"
          style={{ width: "38px", height: "38px" }}
          onClick={() => route.back()}
        >
          <i className="fa-solid fa-arrow-left text-dark"></i>
        </button>
        <h3 className="fw-bold m-0 text-dark">Payment</h3>
      </div>

      <div
        className="card border-0 shadow-sm p-4 mb-4"
        style={{
          borderRadius: "16px",
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
        }}
      >
        <h5 className="fw-bold text-dark mb-3">
          Please upload Zelle Transaction Screenshot
        </h5>

        <div
          className="p-3 rounded-3 border-2 border-dashed bg-light text-center"
          style={{ borderColor: "#d1d5db" }}
        >
          <label
            className={`btn btn-sm fw-semibold px-4 py-2 ${imagePreview
              ? "btn-secondary opacity-50 cursor-not-allowed"
              : "btn-outline-secondary cursor-pointer"
              }`}
            style={{ borderRadius: "8px", backgroundColor: imagePreview ? "#070707" : "rgb(128, 0, 32)" }}
          >
            <i className="fa-solid fa-cloud-arrow-up me-2"></i>
            Upload Screenshot
            <input
              type="file"
              accept="image/*"
              disabled={!!imagePreview}
              onChange={handleFileChange}
              className="d-none"
            />
          </label>
          <div className="text-muted mt-1" style={{ fontSize: "12px" }}>
            PNG, JPG or JPEG (Max 5MB)
          </div>

          {imagePreview && (
            <div className="d-flex justify-content-start mt-3 pt-3 border-top">
              <div className="position-relative d-inline-block">
                <div
                  className="border rounded-3 p-1 bg-white shadow-sm"
                  style={{ width: "80px", height: "80px", overflow: "hidden" }}
                >
                  <img
                    src={imagePreview}
                    alt="Screenshot"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn btn-danger rounded-circle p-0 position-absolute d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    top: "-6px",
                    right: "-6px",
                    width: "22px",
                    height: "22px",
                    fontSize: "10px",
                    border: "2px solid #ffffff",
                  }}
                  title="Remove image"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <button
          type="button"
          disabled={!selectedFile || isSubmitting}
          onClick={handlePayment}
          className="btn text-white fw-bold py-2.5 px-5 d-flex align-items-center justify-content-center gap-2 shadow-sm transition-all"
          style={{
            backgroundColor: !selectedFile ? "#242323" : "#800020",
            borderColor: !selectedFile ? "#a09c9c" : "#800020",
            borderRadius: "10px",
            minWidth: "180px",
            fontSize: "16px",
            cursor: !selectedFile ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? (
            "Processing..."
          ) : (
            <>
              Submit <i className="fa-solid fa-arrow-right fs-6 ms-1"></i>
            </>
          )}
        </button>
      </div>
    </div>
  );
}