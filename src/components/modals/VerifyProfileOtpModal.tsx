"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { globalServerRequest } from "@/actions/globalApi";

interface VerifyProfileOtpModalProps {
    emailLogin?: boolean;
    loginValue?: string;
}

const VerifyProfileOtpModal = ({ emailLogin = false, loginValue = "" }: VerifyProfileOtpModalProps) => {
    const [otp, setOtp] = useState(["", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);

    // Timer starts immediately on mount
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

        return () => clearInterval(intervalId);
    }, []);

    const handleChange = (value: string, index: number) => {
        const numericValue = value.replace(/\D/g, "");
        const updatedOtp = [...otp];
        updatedOtp[index] = numericValue;
        setOtp(updatedOtp);
    };

    const handleVerify = async () => {
        const finalOtp = otp.join("");

        if (finalOtp.length !== 5) {
            setError("Please enter complete OTP");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const type = emailLogin ? "email" : "phone";
            const endpoint = "profile/profile-verify";

            const payload = {
                channel: type,
                value: loginValue,
                otp: finalOtp,
            };

            const response = await globalServerRequest({
                endpoint: endpoint,
                method: "POST",
                payload: payload,
            });

            setLoading(false);

            if (response.success) {
                toast.success(response.data?.message || response.data?.messages || "Profile verified successfully!");

                // Fetch the updated profile data immediately
                try {
                    const profileRes = await globalServerRequest({
                        endpoint: "profile",
                        method: "GET"
                    });
                    
                    if (profileRes.success) {
                        const updatedUser = profileRes.data?.data || profileRes.data;
                        const rawUser = localStorage.getItem("user");
                        if (rawUser) {
                            const userObj = JSON.parse(rawUser);
                            if (userObj.user) {
                                userObj.user = { ...userObj.user, ...updatedUser };
                            } else {
                                Object.assign(userObj, updatedUser);
                            }
                            localStorage.setItem("user", JSON.stringify(userObj));
                        }
                    }
                } catch(e) {
                    console.error("Failed to fetch fresh profile data:", e);
                }

                // Trigger a global UI refresh
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("loginStatusChanged"));
                    // We also reload the page to make sure the NextJS context (if any) is fully synced
                    window.location.reload(); 
                }

                const currentModal = document.getElementById("verify-profile-screen-2");
                if (currentModal) {
                    const currentInstance = window.bootstrap?.Modal.getInstance(currentModal);
                    currentInstance?.hide();
                }
            } else {
                setError(response.error || "Invalid OTP entered. Please try again.");
                toast.error(response.error || "Verification failed.");
            }

        } catch (error) {
            setLoading(false);
            toast.error("An unexpected network error occurred.");
            setError("Connection failure. Try again.");
        }

        setOtp(["", "", "", "", ""]);
    };

    const handleResend = async () => {
        if (timer > 0 || loading) return;

        setLoading(true);
        setError("");

        try {
            const type = emailLogin ? "email" : "phone";
            const endpoint = `profile/profile-update?type=${type}&value=${loginValue}`;

            const response = await globalServerRequest({
                endpoint: endpoint,
                method: "POST",
            });

            setLoading(false);

            if (response.success) {
                toast.success(response.data?.message || response.data?.messages || "A brand new OTP has been sent!");
                setTimer(30);
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
            id="verify-profile-screen-2"
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
                                    id="carouselExampleCaptionsVerifyOtp"
                                    className="carousel slide"
                                    data-bs-ride="carousel"
                                >
                                    <div className="carousel-indicators">
                                        <button
                                            type="button"
                                            data-bs-target="#carouselExampleCaptionsVerifyOtp"
                                            data-bs-slide-to="0"
                                            className="active"
                                            aria-current="true"
                                            aria-label="Slide 1"
                                        ></button>
                                        <button
                                            type="button"
                                            data-bs-target="#carouselExampleCaptionsVerifyOtp"
                                            data-bs-slide-to="1"
                                            aria-label="Slide 2"
                                        ></button>
                                        <button
                                            type="button"
                                            data-bs-target="#carouselExampleCaptionsVerifyOtp"
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
                                        data-bs-target="#carouselExampleCaptionsVerifyOtp"
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
                                        data-bs-target="#carouselExampleCaptionsVerifyOtp"
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
                                <h5>Verify Your Profile Update</h5>
                                <p>
                                    Enter the 5-digit code we sent to <br />
                                    {emailLogin ? "" : "+1 "} {loginValue}
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

export default VerifyProfileOtpModal;
