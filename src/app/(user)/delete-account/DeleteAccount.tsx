"use client";

import { globalServerRequest } from '@/actions/globalApi';
import DeleteMyAccountModal from '@/components/modals/DeleteMyAccountModal';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function DeleteAccount() {
  const router = useRouter();
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    const savedReason = sessionStorage.getItem("deleteReason");
    if (savedReason) {
      setReason(savedReason);
      sessionStorage.removeItem("deleteReason");
    }
  }, []);

  const [feedback, setFeedback] = useState<any | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  // const handleDeleteClick = async () => {
  //   if (reason && feedback) {
  //     const [deleteMyAccount] = await Promise.all([
  //       globalServerRequest({
  //         endpoint: "profile/delete-request",
  //         method: "POST",
  //         payload: { reason_to_delete: reason, delete_feedback: feedback },
  //       }),
  //     ])
  //     if (deleteMyAccount.success) {
  //       console.log("deleteMyAccount", deleteMyAccount.data.data.has_pending_payment)
  //       const modal = document.getElementById("importantNoticeModal");
  //       const modalInstance = window.bootstrap?.Modal.getInstance(modal);
  //       modalInstance.show();
  //       if (deleteMyAccount.data.data.has_pending_payment) {
  //         if (modal) modalInstance?.show();
  //       } else {
  //         if (modal) modalInstance?.show();
  //       }
  //     }
  //     console.log("Account deleted successfully");
  //   }
  // }





  const handleDeleteClick = async () => {
    if (reason && feedback) {
      try {
        const [deleteMyAccount] = await Promise.all([
          globalServerRequest({
            endpoint: "profile/delete-request",
            method: "POST",
            payload: { reason_to_delete: reason, delete_feedback: feedback },
          }),
        ]);

        if (deleteMyAccount && deleteMyAccount.success) {
          const hasPendingPayment = deleteMyAccount.data?.data?.has_pending_payment;
          console.log("has_pending_payment:", hasPendingPayment);
          const modal = document.getElementById("importantNoticeModal");

          if (modal) {
            const bootstrap = (window as any).bootstrap;
            const modalInstance = bootstrap?.Modal.getOrCreateInstance(modal);
            setModalData(deleteMyAccount);

            if (modalInstance) {
              if (hasPendingPayment) {
                modalInstance.show();
              } else {
                const [deleteConfirm] = await Promise.all([
                  globalServerRequest({
                    endpoint: "profile/delete-confirm",
                    method: "DELETE",
                  }),
                ]);
                if (deleteConfirm && deleteConfirm.success) {
                  console.log("Account deletion confirmed successfully");
                  toast.success("Your account has been deleted successfully.");
                  alert("Your account has been deleted successfully.");
                  router.push("/home");
                }

                // modalInstance.show();
              }
            }
          }

          console.log("Account deletion request processed successfully");
        }
      } catch (error) {
        console.error("Something went wrong while deleting account:", error);
      }
    }
  };


  return (
    <main>
      <div className="container home-wraper my-profile">
        <section>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="browse-wrp">
                  <div className="browse-ctg-head my-con-head">
                    <h2 className="sub-cate-page"> <a href="#" onClick={(e) => {
                      e.preventDefault(); // href="#" ki wajah se page upar jump na kare, isliye preventDefault lagaya hai
                      router.back();      // Yeh aapko previous URL par le jaayega
                    }}><img src="images/home/left-arrow.svg" alt="" /></a>Delete Account</h2>

                  </div>
                  <div className="delete-account-wrp">
                    <h3>{reason}</h3>
                    <p>Do you have any feedback for us? We would love to hear from you ! (optional)</p>
                    <div className="delete-inner-text-area">
                      <textarea rows={4} placeholder="Please share your feedback"
                        value={feedback}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setFeedback(e.target.value)
                        }
                      />
                    </div>

                    <div className="delete-btn-rgt">
                      <button
                        // data-bs-target="#importantNoticeModal"
                        data-bs-toggle="modal" className="primary-cta" onClick={handleDeleteClick}>Delete Account</button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <DeleteMyAccountModal
          accountData={modalData}
        />
      </div>
    </main>
  )
}
