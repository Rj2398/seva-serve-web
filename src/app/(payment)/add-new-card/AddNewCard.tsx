"use client";
import { globalServerRequest } from "@/actions/globalApi";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, Suspense } from "react";
import toast from "react-hot-toast";

interface FormErrors {
  holderName?: string;
  cardNumber?: string;
  cvv?: string;
  expiryDate?: string;
}

// Luhn algorithm for card number validation
function isValidLuhn(number: string) {
  let sum = 0;
  let isEven = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i), 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

// Helpers for Web Crypto API
function str2ab(pem: string) {
  // Strip out PEM headers and all whitespace if they exist
  let b64 = pem.replace(/-----BEGIN PUBLIC KEY-----/g, '')
               .replace(/-----END PUBLIC KEY-----/g, '')
               .replace(/\s/g, '');
  const str = window.atob(b64);
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function ab2str(buf: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Hybrid Encryption: AES-GCM for payload + RSA-OAEP-SHA1 for AES key
async function encryptPayloadHybrid(payload: string, b64PublicKey: string) {
  try {
    // 1. Generate AES-GCM key (256-bit)
    const aesKey = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    // 2. Generate random IV (12 bytes)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // 3. Encrypt payload with AES-GCM
    const encodedPayload = new TextEncoder().encode(payload);
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      aesKey,
      encodedPayload
    );

    // AES-GCM appends the 16-byte auth tag at the end of the ciphertext
    const encryptedBytes = new Uint8Array(encryptedBuffer);
    const ciphertext = encryptedBytes.slice(0, -16);
    const authTag = encryptedBytes.slice(-16);

    // 4. Encrypt the AES key with RSA-OAEP-SHA1
    const rawAesKey = await window.crypto.subtle.exportKey("raw", aesKey);
    
    const binaryDer = str2ab(b64PublicKey);
    const rsaPublicKey = await window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-1"
      },
      true,
      ["encrypt"]
    );

    const encryptedKeyBuffer = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      rsaPublicKey,
      rawAesKey
    );

    // 5. Return everything encoded in Base64
    return {
      iv: ab2str(iv.buffer),
      tag: ab2str(authTag.buffer),
      encryptedPayload: ab2str(ciphertext.buffer),
      encryptedKey: ab2str(encryptedKeyBuffer)
    };
  } catch (error) {
    console.error("Hybrid Encryption Error:", error);
    return null;
  }
}

function AddNewCardForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("booking_id");
  const initialpayment = searchParams.get("initialpayment");
  const remainingPayment = searchParams.get("remaingPayment");
  const paymenttype = searchParams.get("paymenttype");
  const planId = searchParams.get("subscription_plan_id");
  const planType = searchParams.get("type");
  const planAmount = searchParams.get("amount");
  const quoteId = searchParams.get("quote_id");

  const [holderName, setHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // remove non-digits

    const isAmex = /^3[47]/.test(value);
    const maxLength = isAmex ? 15 : 16;

    if (value.length > maxLength) value = value.slice(0, maxLength);

    let formatted = "";
    if (isAmex) {
      const p1 = value.slice(0, 4);
      const p2 = value.slice(4, 10);
      const p3 = value.slice(10, 15);
      formatted = p1;
      if (p2) formatted += " " + p2;
      if (p3) formatted += " " + p3;
    } else {
      formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    }

    setCardNumber(formatted);
    if (errors.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: undefined }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    // Stripe-like Expiry Auto-Format
    if (value.length >= 1) {
      if (parseInt(value[0], 10) > 1) {
        value = "0" + value;
      }
    }
    if (value.length >= 2) {
      const month = parseInt(value.slice(0, 2), 10);
      if (month === 0) {
        value = "01" + value.slice(2);
      } else if (month > 12) {
        value = "12" + value.slice(2);
      }
    }

    if (value.length > 6) value = value.slice(0, 6);
    
    if (value.length >= 2) {
      value = value.slice(0, 2) + " / " + value.slice(2);
    }

    setExpiryDate(value);
    if (errors.expiryDate) {
      setErrors(prev => ({ ...prev, expiryDate: undefined }));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    const rawCardNumber = cardNumber.replace(/\s/g, "");
    const isAmex = /^3[47]/.test(rawCardNumber);
    const maxLength = isAmex ? 4 : 3;

    if (value.length > maxLength) value = value.slice(0, maxLength);

    setCvv(value);
    if (errors.cvv) {
      setErrors(prev => ({ ...prev, cvv: undefined }));
    }
  };

  const validateCardNumber = (numberStr: string) => {
    const rawCardNumber = numberStr.replace(/\s/g, "");
    const isAmex = /^3[47]/.test(rawCardNumber);
    const requiredLength = isAmex ? 15 : 16;
    if (!rawCardNumber) return "Your card number is incomplete.";
    if (rawCardNumber.length < requiredLength) return "Your card number is incomplete.";
    if (!isValidLuhn(rawCardNumber)) return "Your card number is invalid.";
    return undefined;
  };

  const validateExpiry = (expiryStr: string) => {
    if (!expiryStr.trim()) return "Your card's expiration date is incomplete.";
    const cleanStr = expiryStr.replace(/\s+/g, "");
    const parts = cleanStr.split("/");
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return "Your card's expiration date is incomplete.";
    }
    if (parts[0].length !== 2) {
      return "Your card's expiration date is incomplete.";
    }
    if (parts[1].length === 2) {
      return "Expiration year must be 4 digits (e.g. 02/2024).";
    }
    if (parts[1].length !== 4) {
      return "Expiration date must be in MM/YYYY format.";
    }
    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (month < 1 || month > 12) return "Your card's expiration month is invalid.";
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return "Your card's expiration year is in the past.";
    }
    return undefined;
  };

  const validateCvv = (cvvStr: string, numberStr: string) => {
    const rawCardNumber = numberStr.replace(/\s/g, "");
    const isAmex = /^3[47]/.test(rawCardNumber);
    const requiredLength = isAmex ? 4 : 3;
    if (!cvvStr.trim()) return "Your card's security code is incomplete.";
    if (cvvStr.length < requiredLength) return "Your card's security code is incomplete.";
    return undefined;
  };

  const handleBlur = (field: "cardNumber" | "expiryDate" | "cvv") => {
    setErrors(prev => {
      const newErrors = { ...prev };
      if (field === "cardNumber") newErrors.cardNumber = validateCardNumber(cardNumber);
      if (field === "expiryDate") newErrors.expiryDate = validateExpiry(expiryDate);
      if (field === "cvv") newErrors.cvv = validateCvv(cvv, cardNumber);
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    // 1. Holder Name Validation
    if (!holderName.trim()) {
      newErrors.holderName = "Holder name is required";
    }

    // 2. Card Number Validation
    const cardNumberError = validateCardNumber(cardNumber);
    if (cardNumberError) newErrors.cardNumber = cardNumberError;

    // 3. Expiry Date Validation
    const expiryError = validateExpiry(expiryDate);
    if (expiryError) newErrors.expiryDate = expiryError;

    // 4. CVV Validation
    const cvvError = validateCvv(cvv, cardNumber);
    if (cvvError) newErrors.cvv = cvvError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    setIsSubmitting(true);
    const toastId = toast.loading("Processing card details...");

    try {
      // Create payload object with raw card details
      const rawCardNumber = cardNumber.replace(/\s/g, "");
      // Convert "MM / YYYY" format to "YYYY-MM" for PayPal API
      const expiryParts = expiryDate.replace(/\s+/g, "").split("/");
      const formattedExpiry = expiryParts.length === 2 ? `${expiryParts[1]}-${expiryParts[0]}` : expiryDate;

      const payloadData = {
        number: rawCardNumber,
        cvv: cvv,
        expiry: formattedExpiry,
        name: holderName,
      };


      console.log("payloadData", payloadData);

      // Hybrid Encryption (AES-GCM + RSA-OAEP-SHA1)
      const publicKey = process.env.NEXT_PUBLIC_RSA_KEY || `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoyA9qDFvDIXmMa8faXHI
T45TZv5CuO/qAamO0BqXYjcOKzM0P1U5Wfl7ksUiWLoIpVMdprP61LiUOUeyjUsH
O26UcHWKGhO+Kmg1oNkMZy20CHga+e3fjMOdFKKwQK5YZz4GY84W3r5wSsnXOhy9
x56ONW2nspFEPFxb0Yf7vo79zZiHVt/iuHnc4HjEQX8hsxvEp/Apx/K+myrBoQUx
XG+iNkIzW95V08/URSWr4NnQsK+upFHw1x4fyWKJ2T6lXQKbrM6UsWRp/blRqk2z
Cegj3MFo/jeqp9wkzjbUciufvSXPOYU4tn0EaRWvP/wV29KoGu3WnoOixawmmShE
zQIDAQAB
-----END PUBLIC KEY-----`;

      const encryptedDataObj = await encryptPayloadHybrid(JSON.stringify(payloadData), publicKey);

      console.log("encryptedDataObj", encryptedDataObj);

      if (!encryptedDataObj) {
        toast.error("Encryption failed. Please check your public key.");
        setIsSubmitting(false);
        return;
      }

      const response = await globalServerRequest({
        endpoint: "payment/card/add",
        method: "POST",
        payload: encryptedDataObj,
      });

      if (response.success) {
        console.log("Response from card add:", response);
        toast.success("Card added successfully!", { id: toastId });
        if (quoteId) {
          router.push(`/payment-method?quote_id=${bookingId}&initialpayment=${initialpayment}&remaingPayment=${remainingPayment}&paymenttype=${paymenttype}`)
        }
        if (bookingId) {
          router.push(
            `/payment-method?booking_id=${bookingId || ""}&initialpayment=${initialpayment || ""
            }&remaingPayment=${remainingPayment || ""}&paymenttype=${paymenttype || ""
            }`
          );
        } else {
          if (!quoteId && !bookingId) {
            router.push(
              `/payment-method?subscription_plan_id=${planId}&type=${planType}&amount=${planAmount}`
            );
          } else {
            router.push(
              `/payment-method?quote_id=${quoteId}&initialpayment=${initialpayment}&remaingPayment=${remainingPayment}&paymenttype=${paymenttype}`
            );
          }
        }
      } else {
        toast.error(response.error || "Failed to add card.", { id: toastId });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("An error occurred during card submission:", error);
      toast.error("Something went wrong. Please try again later.", {
        id: toastId,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container home-wraper my-profile">
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="browse-wrp">
                <div className="browse-ctg-head my-con-head">
                  <h2 className="sub-cate-page">
                    <span
                      onClick={() => router.back()}
                      style={{ cursor: "pointer" }}
                    >
                      <img src="images/home/left-arrow.svg" alt="back" />
                    </span>
                    Add New Card
                  </h2>
                </div>

                <div className="card-wrp-surname">
                  <div className="card-wrp form">
                    {/* Visual Card Preview */}
                    <div className="single-card">
                      <img
                        className="card"
                        src="images/inner-page/payment-method-cart.svg"
                        alt=""
                      />
                    </div>

                    <form className="Cardholder" onSubmit={handleSubmit}>
                      <div className="Cardholder-form">
                        {/* Holder Name */}
                        <label>Cardholder’s Name</label>
                        <input
                          type="text"
                          placeholder="Enter Cardholder’s Name"
                          value={holderName}
                          onChange={(e) => setHolderName(e.target.value)}
                          className={errors.holderName ? "error-border" : ""}
                        />
                        {errors.holderName && (
                          <span className="text-danger small">
                            {errors.holderName}
                          </span>
                        )}
                        <label className="mt-3">Card Number</label>
                        <div style={{ padding: '0px 0px 0px 0px' }} className={`stripe-card-element-container mb-15 ${errors.cardNumber ? "error-border" : ""}`}>
                          <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            onBlur={() => handleBlur("cardNumber")}
                            style={{
                              border: "none",
                              outline: "none",
                              width: "100%",
                              background: "transparent",
                              fontSize: "16px",
                              color: "#363636",
                              fontFamily: "Inter, sans-serif"
                            }}
                          />
                        </div>
                        {errors.cardNumber && (
                          <span className="text-danger small" style={{ marginTop: "-10px", marginBottom: "15px", display: "block" }}>
                            {errors.cardNumber}
                          </span>
                        )}

                        <div className="multi-row mt-3">
                          <div className="cvv-exp">
                            <label>CVV</label>
                            <div className={`stripe-card-element-container ${errors.cvv ? "error-border" : ""}`} style={{ padding: '0px 0px 0px 0px' }}>
                              <input
                                type="text"
                                placeholder="CVC"
                                value={cvv}
                                onChange={handleCvvChange}
                                onBlur={() => handleBlur("cvv")}
                                style={{
                                  border: "none",
                                  outline: "none",
                                  width: "100%",
                                  background: "transparent",
                                  fontSize: "16px",
                                  color: "#363636",
                                  fontFamily: "Inter, sans-serif"
                                }}
                              />
                            </div>
                            {errors.cvv && (
                              <span className="text-danger small">
                                {errors.cvv}
                              </span>
                            )}
                          </div>
                          <div className="cvv-exp">
                            <label>Expiry Date</label>
                            <div style={{ padding: '0px 0px 0px 0px' }} className={`stripe-card-element-container ${errors.expiryDate ? "error-border" : ""}`}>
                              <input
                                type="text"
                                placeholder="MM / YYYY"
                                value={expiryDate}
                                onChange={handleExpiryChange}
                                onBlur={() => handleBlur("expiryDate")}
                                style={{
                                  border: "none",
                                  outline: "none",
                                  width: "100%",
                                  background: "transparent",
                                  fontSize: "16px",
                                  color: "#363636",
                                  fontFamily: "Inter, sans-serif"
                                }}
                              />
                            </div>
                            {errors.expiryDate && (
                              <span className="text-danger small">
                                {errors.expiryDate}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="primary-cta add-card mt-4"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Processing..." : "Add Card"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        .text-danger {
          color: #dc3545;
          display: block;
          margin-top: 5px;
        }
        .small {
          font-size: 12px;
        }
        .error-border {
          border-color: #dc3545 !important;
        }
        .stripe-card-element-container {
          border: 1px solid #3636364d;
          border-radius: 10px;
          padding: 12px 10px;
          background-color: white;
          width: 100%;
          outline: none;
        }
        .stripe-card-element-container input::placeholder {
          color: #3636364d;
        }
        .mb-15 {
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
}

export default function AddNewCard() {
  return (
    <Suspense
      fallback={
        <div className="text-center p-5">Loading card registration...</div>
      }
    >
      <AddNewCardForm />
    </Suspense>
  );
}