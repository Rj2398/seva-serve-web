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
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = async () => {
    if (!reason) {
      toast.error("Please select a reason for deleting your account.");
      return;
    }

    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const deleteMyAccount = await globalServerRequest({
        endpoint: "profile/delete-request",
        method: "POST",
        payload: {
          reason_to_delete: reason,
          delete_feedback: feedback || "",
        },
      });

      if (!deleteMyAccount?.success) {
        toast.error(
          deleteMyAccount?.error ||
          deleteMyAccount?.data?.message ||
          "Unable to process the delete request."
        );
        return;
      }

      const deleteResponse =
        deleteMyAccount.data?.data || deleteMyAccount.data || deleteMyAccount;
      const pendingCountProvided =
        deleteResponse?.pending_bookings_count !== undefined &&
        deleteResponse?.pending_bookings_count !== null;
      const pendingCount = pendingCountProvided
        ? Number(deleteResponse.pending_bookings_count)
        : 0;
      const hasPendingPayment = pendingCountProvided
        ? pendingCount > 0
        : deleteResponse?.has_pending_payment === true;

      if (!hasPendingPayment) {
        await handleConfirmDelete();
      } else {
        setModalData(deleteResponse);
        const modal = document.getElementById("importantNoticeModal");
        const bootstrap = (window as any).bootstrap;
        const modalInstance =
          modal && bootstrap?.Modal
            ? bootstrap.Modal.getOrCreateInstance(modal)
            : null;
        modalInstance?.show();
      }
    } catch (error) {
      console.error("Something went wrong while deleting account:", error);
      toast.error("Unable to process the delete request.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const deleteConfirm = await globalServerRequest({
        endpoint: "profile/delete-confirm",
        method: "DELETE",
      });

      if (deleteConfirm?.success) {
        const modal = document.getElementById("importantNoticeModal");
        const bootstrap = (window as any).bootstrap;
        const modalInstance = modal
          ? bootstrap?.Modal?.getInstance(modal)
          : null;
        modalInstance?.hide();

        toast.success("Your account has been deleted successfully.");
        router.push("/home");
      } else {
        toast.error(
          deleteConfirm?.error ||
          deleteConfirm?.data?.message ||
          "Unable to delete your account."
        );
      }
    } catch (error) {
      console.error("Something went wrong while confirming account deletion:", error);
      toast.error("Unable to delete your account.");
    } finally {
      setIsDeleting(false);
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
                        className="primary-cta"
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Please wait..." : "Delete Account"}
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <DeleteMyAccountModal
          accountData={modalData}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </div>
    </main>
  )
}
