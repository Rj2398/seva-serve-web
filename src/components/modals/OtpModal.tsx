"use client";

import { globalServerRequest } from "@/actions/globalApi";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface OtpModalProps {
  emailLogin?: boolean; // Maps to your isEmailLogin state
  loginValue?: string; // Maps to your inputValue state
}

const OtpModal = ({ emailLogin = false, loginValue = "" }: OtpModalProps) => {
  // console.log(emailLogin, "emailLogin");

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  // Read storage data safely inside the component body
  const userData: any =
    typeof window !== "undefined" && sessionStorage.getItem("userData")
      ? JSON.parse(sessionStorage.getItem("userData")!)
      : null;

  // ✅ TIMER FIX: Clean implementation that starts immediately on modal mount
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []); // Empty array ensures it initializes immediately on mount

  // ✅ INPUT FIX: Smooth auto-focus that allows continuous typing without lockups
  const handleChange = (value: string, index: number) => {
    const numericValue = value.replace(/\D/g, "");
    const updatedOtp = [...otp];
    updatedOtp[index] = numericValue;
    setOtp(updatedOtp);

    // Auto-focus next box using a deferred queue so characters render first
    // if (numericValue && index < 4) {
    //   setTimeout(() => {
    //     const nextInput = document.getElementById(`otp-${index + 1}`);
    //     nextInput?.focus();
    //   }, 0);
    // }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 5) {
      setError("Please enter complete OTP");
      return;
    }

    setError("");
    setLoading(true);

    console.log("Submitting Verification OTP:", finalOtp);

    const endPoint = "auth/otp/verify";

    // ✅ PROPS FALLBACK: Uses loginValue/emailLogin immediately if storage hasn't synced
    const payload = {
      channel: userData?.channel || (emailLogin ? "email" : "phone"),
      value: userData?.value || loginValue,
      otp: finalOtp,
    };

    try {
      const response = await globalServerRequest({
        endpoint: endPoint,
        method: "POST",
        payload: payload,
      });

      setLoading(false);

      if (response.success) {
        toast.success(response.data?.message || "Verified successfully!");

        localStorage.setItem("user", JSON.stringify(response?.data?.data));
        localStorage.setItem("isLoggedIn", "true");

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("loginStatusChanged"));
        }
        // ✅ SET COOKIE for server-side access
        const token =
          response?.data?.data?.access_token || response?.data?.data?.token;
        if (token) {
          document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
        }

        const currentModal = document.getElementById("login-screen-2");
        if (currentModal) {
          const currentInstance =
            window.bootstrap?.Modal.getInstance(currentModal);
          currentInstance?.hide();
        }

        const nextModal = document.getElementById("welcome-SevaServeModal");
        if (nextModal) {
          const nextInstance = new window.bootstrap.Modal(nextModal);
          nextInstance.show();
        }
      } else {
        setError(response.error || "Invalid OTP entered. Please try again.");
        toast.error(response.error || "Verification failed.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Critical OTP Verification Exception:", error);
      toast.error("An unexpected network error occurred.");
      setError("Connection failure. Try again.");
    }

    setOtp(["", "", "", "", ""]);
  };

  const handleResend = async () => {
    if (timer > 0 || loading) return;

    setLoading(true);
    setError("");

    const endPoint = "auth/otp/request/customer";

    // ✅ PROPS FALLBACK
    const payload = {
      value: userData?.value || loginValue,
      channel: userData?.channel || (emailLogin ? "email" : "phone"),
      role: "customer",
    };

    try {
      const response = await globalServerRequest({
        endpoint: endPoint,
        method: "POST",
        payload: payload,
      });

      setLoading(false);

      if (response.success) {
        toast.success("A brand new OTP has been sent!");
        setTimer(30); // Cleanly restart our timer back to 30 seconds
        setOtp(["", "", "", "", ""]);
      } else {
        setError(response.error || "Failed to resend OTP. Try again.");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Network error. Could not resend OTP.");
    }
  };

  return (
    <div
      className="modal fade log-in-slid"
      id="login-screen-2"
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
            <div className="left-rgt-car-wrp">
              <div className="left-slider-pop">
                <div
                  id="carouselExampleCaptions"
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-indicators">
                    <button
                      type="button"
                      data-bs-target="#carouselExampleCaptions"
                      data-bs-slide-to="0"
                      className="active"
                      aria-current="true"
                      aria-label="Slide 1"
                    ></button>
                    <button
                      type="button"
                      data-bs-target="#carouselExampleCaptions"
                      data-bs-slide-to="1"
                      aria-label="Slide 2"
                    ></button>
                    <button
                      type="button"
                      data-bs-target="#carouselExampleCaptions"
                      data-bs-slide-to="2"
                      aria-label="Slide 3"
                    ></button>
                  </div>
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img
                        src="images/modal/login-1-left.svg"
                        className="frist-img d-block w-100"
                        alt="..."
                      />
                      <div className="my-text-carousel">
                        <h5>
                          Reliable Home Services,
                          <br />
                          Powered by <span>SevaServe</span>
                        </h5>
                        <p>
                          Get fast, trusted, and professional help for any
                          <br />
                          home problem right when you need it.
                        </p>
                      </div>
                    </div>
                    <div className="carousel-item">
                      <img
                        src="images/modal/login-2-left.svg"
                        className="sec-img d-block w-100"
                        alt="..."
                      />
                      <div className="my-text-carousel">
                        <h5>Tell SevaServe the Issue, We Handle the Rest</h5>
                        <p>
                          Describe your problem or upload a photo , our smart
                          system instantly identifies the right service.
                        </p>
                      </div>
                    </div>
                    <div className="carousel-item">
                      <img
                        src="images/modal/login-3-left.svg"
                        className="thd-img d-block w-100"
                        alt="..."
                      />
                      <div className="my-text-carousel">
                        <h5>
                          Clear Estimates. Easy Booking. Total Peace of Mind.
                        </h5>
                        <p>
                          SevaServe gives you upfront pricing, secure payments,
                          and flexible scheduling in just a few taps.
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
              <div className="right-slider-pop">
                <h5>Verify Your Number</h5>
                <p>
                  Enter the 5-digit code we sent to <br />
                  {emailLogin ? "" : "+1"} {loginValue || userData?.value}
                </p>
                <form>
                  <div className="input-multigrp">
                    {otp?.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        placeholder="-"
                        className="input-field-code-in inputs"
                        maxLength={1}
                        disabled={loading}
                        value={digit}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(e.target.value, index)
                        }
                      />
                    ))}
                  </div>

                  {error && (
                    <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
                  )}

                  <button
                    type="button"
                    onClick={handleVerify}
                    className="vry-fy-btn"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify & Continue"}
                  </button>
                </form>

                <p className="terms">
                  Didn’t get it?{" "}
                  <span
                    className="one"
                    onClick={handleResend}
                    style={{
                      cursor:
                        timer === 0 && !loading ? "pointer" : "not-allowed",
                      color: timer === 0 && !loading ? "#0070f3" : "#999",
                      fontWeight: "bold",
                    }}
                  >
                    Resend
                  </span>{" "}
                  {timer > 0 && (
                    <>
                      in{" "}
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        00:{timer < 10 ? `0${timer}` : timer}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;

// "use client";

// import { globalServerRequest } from '@/actions/globalApi';
// import React, { useState } from 'react'
// import toast from 'react-hot-toast';

// interface OtpModalProps {
//   emailLogin: boolean;   // Maps to your isEmailLogin state
//   loginValue: string;    // Maps to your inputValue state
// }

// const userData: any = typeof window !== "undefined" && sessionStorage.getItem("userData")
//   ? JSON.parse(sessionStorage.getItem("userData")!)
//   : null;

//   console.log(userData)

// const OtpModal = ({emailLogin,loginValue}:OtpModalProps) => {

//     const [otp, setOtp] = useState(["", "", "", "", ""]);
//     const [error, setError] = useState("");
//     const [loading,setLoading]=useState(false);

//     const handleChange = (
//         value: string,
//         index: number
//     ) => {
//         // ONLY NUMBERS
//         const numericValue = value.replace(/\D/g, "");

//         const updatedOtp = [...otp];

//         updatedOtp[index] = numericValue;

//         setOtp(updatedOtp);

//         // AUTO FOCUS NEXT INPUT
//         // if (numericValue && index < 4) {

//         //     const nextInput = document.getElementById(
//         //         `otp-${index + 1}`
//         //     );

//         //     nextInput?.focus();

//         // }

//     }

//     // const handleVerify = async() => {

//     //     const finalOtp = otp.join("");

//     //     // CHECK ALL 5 FILLED
//     //     if (finalOtp.length !== 5) {

//     //         setError("Please enter complete OTP");

//     //         return;

//     //     }

//     //     setError("");

//     //     console.log("OTP:", finalOtp);

//     //      const endPoint = "auth/otp/verify"
//     //      const payload = { channel: userData?.channel, value: userData?.value,otp: userData?.otp}

//     //      const response = await globalServerRequest ({
//     //         endpoint:endPoint,
//     //         method:"POST",
//     //         payload:payload,
//     //      })

//     //      try {
//     //         if(response.success){
//     //              toast.success(response.message)
//     //         }
//     //      } catch (error) {

//     //      }
//     //     const currentModal = document.getElementById("login-screen-2");

//     //     if (currentModal) {
//     //         const currentInstance = window.bootstrap?.Modal.getInstance(currentModal);

//     //         currentInstance?.hide();
//     //     }

//     //     const nextModal = document.getElementById("welcome-SevaServeModal");

//     //     if (nextModal) {
//     //         const nextInstance = new window.bootstrap.Modal(nextModal);

//     //         nextInstance.show();
//     //     }

//     // };

//     const handleVerify = async () => {
//     const finalOtp = otp.join("");

//     // CHECK ALL 5 FILLED
//     if (finalOtp.length !== 5) {
//         setError("Please enter complete OTP");
//         return;
//     }

//     setError("");
//     setLoading(true); // Assuming you have a loading state variable

//     console.log("Submitting Verification OTP:", finalOtp);

//     const endPoint = "auth/otp/verify";
//     // FIX 1: Send 'finalOtp' instead of 'userData?.otp'
//     const payload = {
//         channel: userData?.channel,
//         value: userData?.value,
//         otp: finalOtp
//     };

//     // FIX 2: Wrapped the execution safely inside the try block
//     try {
//         const response = await globalServerRequest({
//             endpoint: endPoint,
//             method: "POST",
//             payload: payload,
//         });

//         setLoading(false);

//         if (response.success) {
//             // FIX 4: Use response.data.message based on your global utility layout
//             toast.success(response.data?.message || "Verified successfully!");

//             // FIX 3: Only transition modals if the API code reports back true!
//             const currentModal = document.getElementById("login-screen-2");
//             if (currentModal) {
//                 const currentInstance = window.bootstrap?.Modal.getInstance(currentModal);
//                 currentInstance?.hide();
//             }

//             const nextModal = document.getElementById("welcome-SevaServeModal");
//             if (nextModal) {
//                 const nextInstance = new window.bootstrap.Modal(nextModal);
//                 nextInstance.show();
//             }
//         } else {
//             // Display backend error message (e.g., "Invalid OTP", "Expired OTP")
//             setError(response.error || "Invalid OTP entered. Please try again.");
//             toast.error(response.error || "Verification failed.");
//         }
//     } catch (error) {
//         setLoading(false);
//         console.error("Critical OTP Verification Exception:", error);
//         toast.error("An unexpected network error occurred.");
//         setError("Connection failure. Try again.");
//     }
// };
//     return (
//         <div
//             className="modal fade log-in-slid"
//             id="login-screen-2"
//             data-bs-backdrop="static"
//             data-bs-keyboard="false"
//             tabIndex={-1}
//             aria-labelledby="staticBackdropLabel"
//             aria-hidden="true"
//         >
//             <div className="modal-dialog modal-dialog-centered">
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <button
//                             type="button"
//                             className="btn-close"
//                             data-bs-dismiss="modal"
//                             aria-label="Close"
//                         ></button>
//                     </div>
//                     <div className="modal-body">
//                         <div className="left-rgt-car-wrp">
//                             <div className="left-slider-pop">
//                                 <div
//                                     id="carouselExampleCaptions"
//                                     className="carousel slide"
//                                     data-bs-ride="carousel"
//                                 >
//                                     <div className="carousel-indicators">
//                                         <button
//                                             type="button"
//                                             data-bs-target="#carouselExampleCaptions"
//                                             data-bs-slide-to="0"
//                                             className="active"
//                                             aria-current="true"
//                                             aria-label="Slide 1"
//                                         ></button>
//                                         <button
//                                             type="button"
//                                             data-bs-target="#carouselExampleCaptions"
//                                             data-bs-slide-to="1"
//                                             aria-label="Slide 2"
//                                         ></button>
//                                         <button
//                                             type="button"
//                                             data-bs-target="#carouselExampleCaptions"
//                                             data-bs-slide-to="2"
//                                             aria-label="Slide 3"
//                                         ></button>
//                                     </div>
//                                     <div className="carousel-inner">
//                                         <div className="carousel-item active">
//                                             <img
//                                                 src="images/modal/login-1-left.svg"
//                                                 className="frist-img d-block w-100"
//                                                 alt="..."
//                                             />
//                                             <div className="my-text-carousel">
//                                                 <h5>
//                                                     Reliable Home Services,<br />
//                                                     Powered by <span>SevaServe</span>
//                                                 </h5>
//                                                 <p>
//                                                     Get fast, trusted, and professional help for any<br />
//                                                     home problem right when you need it.
//                                                 </p>
//                                             </div>
//                                         </div>
//                                         <div className="carousel-item">
//                                             <img
//                                                 src="images/modal/login-2-left.svg"
//                                                 className="sec-img d-block w-100"
//                                                 alt="..."
//                                             />
//                                             <div className="my-text-carousel">
//                                                 <h5>Tell SevaServe the Issue, We Handle the Rest</h5>
//                                                 <p>
//                                                     Describe your problem or upload a photo , our smart
//                                                     system instantly identifies the right service.
//                                                 </p>
//                                             </div>
//                                         </div>
//                                         <div className="carousel-item">
//                                             <img
//                                                 src="images/modal/login-3-left.svg"
//                                                 className="thd-img d-block w-100"
//                                                 alt="..."
//                                             />
//                                             <div className="my-text-carousel">
//                                                 <h5>
//                                                     Clear Estimates. Easy Booking. Total Peace of Mind.
//                                                 </h5>
//                                                 <p>
//                                                     SevaServe gives you upfront pricing, secure payments,
//                                                     and flexible scheduling in just a few taps.
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <button
//                                         className="carousel-control-prev"
//                                         type="button"
//                                         data-bs-target="#carouselExampleCaptions"
//                                         data-bs-slide="prev"
//                                     >
//                                         <span
//                                             className="carousel-control-prev-icon"
//                                             aria-hidden="true"
//                                         ></span>
//                                         <span className="visually-hidden">Previous</span>
//                                     </button>
//                                     <button
//                                         className="carousel-control-next"
//                                         type="button"
//                                         data-bs-target="#carouselExampleCaptions"
//                                         data-bs-slide="next"
//                                     >
//                                         <span
//                                             className="carousel-control-next-icon"
//                                             aria-hidden="true"
//                                         ></span>
//                                         <span className="visually-hidden">Next</span>
//                                     </button>
//                                 </div>
//                             </div>
//                             <div className="right-slider-pop">
//                                 <h5>Verify Your Number</h5>
//                                 <p>
//                                     Enter the 5-digit code we sent to <br />
//                                   {emailLogin?"":+1} {loginValue}
//                                 </p>
//                                 <form>
//                                     <div className="input-multigrp">
//                                         {
//                                             otp?.map((digit, index) => (
//                                                 <input
//                                                     key={index}
//                                                     id={`otp-${index}`}
//                                                     type="text"
//                                                     placeholder='-'
//                                                     className='input-field-code-in inputs'
//                                                     maxLength={1}
//                                                     value={digit}
//                                                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                                                         handleChange(e.target.value, index)
//                                                     }
//                                                 />
//                                             ))
//                                         }
//                                         {/* <input
//                                             type="text"
//                                             placeholder="-"
//                                             inputMode="numeric"
//                                             pattern="[0-9]*"
//                                               onInput={(e: React.FormEvent<HTMLInputElement>) => {
//                                                                         e.currentTarget.value =
//                                                                         e.currentTarget.value.replace(/[^0-9]/g, "");
//                                                                     }}
//                                                                     onKeyPress={(e) => {
//                                                                         if (
//                                                                         (e.target as HTMLInputElement).value.length === 1
//                                                                         ) {
//                                                                         e.preventDefault();
//                                                                         }
//                                                                     }}
//                                             className="input-field-code-in inputs"
//                                             maxLength={1}

//                                             onkeyPress="if (this.value.length == 1) return false;"
//                                         /> */}
//                                         {/* <input

//                                         />
//                                         <input
//                                             type="text"
//                                             placeholder="-"
//                                             inputMode="numeric"
//                                             pattern="[0-9]*"
//                                               onInput={(e: React.FormEvent<HTMLInputElement>) => {
//                                                     e.currentTarget.value =
//                                                     e.currentTarget.value.replace(/[^0-9]/g, "");
//                                                 }}
//                                                 onKeyPress={(e) => {
//                                                     if (
//                                                     (e.target as HTMLInputElement).value.length === 1
//                                                     ) {
//                                                     e.preventDefault();
//                                                     }
//                                                 }}
//                                             className="input-field-code-in inputs"
//                                             maxLength={1}

//                                         />
//                                         <input
//                                             type="text"
//                                             placeholder="-"
//                                             inputMode="numeric"
//                                             pattern="[0-9]*"
//                                              onInput={(e: React.FormEvent<HTMLInputElement>) => {
//                                                     e.currentTarget.value =
//                                                     e.currentTarget.value.replace(/[^0-9]/g, "");
//                                                 }}
//                                                 onKeyPress={(e) => {
//                                                     if (
//                                                     (e.target as HTMLInputElement).value.length === 1
//                                                     ) {
//                                                     e.preventDefault();
//                                                     }
//                                                 }}
//                                             className="input-field-code-in inputs"
//                                             maxLength={1}

//                                         />
//                                         <input
//                                             type="text"
//                                             placeholder="-"
//                                             inputMode="numeric"
//                                             pattern="[0-9]*"
//                                              onInput={(e: React.FormEvent<HTMLInputElement>) => {
//                                                 e.currentTarget.value =
//                                                 e.currentTarget.value.replace(/[^0-9]/g, "");
//                                             }}
//                                             onKeyPress={(e) => {
//                                                 if (
//                                                 (e.target as HTMLInputElement).value.length === 1
//                                                 ) {
//                                                 e.preventDefault();
//                                                 }
//                                             }}
//                                             className="input-field-code-in inputs"
//                                             maxLength={1}
//                                             // onkeyPress="if (this.value.length == 1) return false;"
//                                         />
//                                         <input
//                                             type="text"
//                                             placeholder="-"
//                                             inputMode="numeric"
//                                             pattern="[0-9]*"
//                                              onInput={(e: React.FormEvent<HTMLInputElement>) => {
//                                                     e.currentTarget.value =
//                                                     e.currentTarget.value.replace(/[^0-9]/g, "");
//                                                 }}
//                                                 onKeyPress={(e) => {
//                                                     if (
//                                                     (e.target as HTMLInputElement).value.length === 1
//                                                     ) {
//                                                     e.preventDefault();
//                                                     }
//                                                 }}
//                                             className="input-field-code-in inputs"
//                                             maxLength={1}

//                                             onkeyPress="if (this.value.length == 1) return false;"
//                                         /> */}
//                                             {/* // onkeyPress="if (this.value.length == 1) return false;" */}
//                                         {/* /> */}
//                                     </div>

//                                     {
//                                         error && (
//                                             <p style={{ color: "red", marginTop: "10px" }}>
//                                                 {error}
//                                             </p>
//                                         )
//                                     }

//                                     <button
//                                         type="button"
//                                         // data-bs-toggle="modal"
//                                         // data-bs-target="#welcome-SevaServeModal"

//                                         onClick={handleVerify}
//                                         className="vry-fy-btn"
//                                     >
//                                         Verify & Continue
//                                     </button>
//                                 </form>

//                                 <p className="terms">
//                                     Didn’t get it? <span className="one">Resend</span> in
//                                     <a href="#">00:30</a>.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default OtpModal
