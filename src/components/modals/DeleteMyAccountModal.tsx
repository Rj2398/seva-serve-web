import React from 'react'

interface DeleteMyAccountModalProps {
  accountData?: {
    pending_bookings_count?: number;
    booking_data?: Array<{
      booking_id?: number;
      service?: string[];
      pending_amount?: string | number;
      card?: any;
    }>;
  } | null;
  onConfirm?: () => void | Promise<void>;
  isDeleting?: boolean;
}


export default function DeleteMyAccountModal({
  accountData = null,
  onConfirm,
  isDeleting = false,
}: DeleteMyAccountModalProps) {
  const bookingData = accountData?.booking_data || [];

  const getCardLabel = (card: any) => {
    if (!card) return "No saved card";
    if (typeof card === "string") return card;

    const brand = card.brand || card.card_brand || card.type || "";
    const lastFour =
      card.last4 || card.last_four || card.lastFour || card.card_last_four || "";

    if (brand && lastFour) return `**** **** **** ${lastFour} (${brand})`;
    if (lastFour) return `**** **** **** ${lastFour}`;
    return brand || "Saved card";
  };

  return (
    <div className="modal fade delete-account" id="importantNoticeModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Important Notice</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body delete-account-bdy notice">
            <div className="notice-data">
              <h4>Before you delete your account</h4>
              <p>You have pending payment(s) for previously completed service(s). Even after deleting your account, we will still deduct the remaining amount from your saved payment method as per our payment policy.</p>
            </div>
            <div className="pending-bookings-list">
              {bookingData.length > 0 ? (
                bookingData.map((booking) => (
                  <div className="service-important" key={booking.booking_id}>
                    <p>Service</p>
                    <h4>{booking.service?.join(", ") || "Service"}</h4>
                    <p>Pending Amount</p>
                    <h4>${Number(booking.pending_amount || 0).toFixed(2)}</h4>
                    <p>Payment Method</p>
                    <h4>{getCardLabel(booking.card)}</h4>
                  </div>
                ))
              ) : (
                <div className="service-important">
                  <p>Pending payments</p>
                  <h4>{accountData?.pending_bookings_count || 0} booking(s)</h4>
                </div>
              )}
            </div>
            <div className="notice-footer-btn">
              <button
                type="button"
                className="primary-cta delete-confirm-cta"
                onClick={onConfirm}
                disabled={isDeleting}
              >
                <span className="delete-confirm-label">
                  {isDeleting
                    ? "Deleting..."
                    : "I Understand — Delete My Account"}
                </span>
                {!isDeleting && (
                  <img
                    className="delete-confirm-arrow"
                    src="images/modal/notice-right-arrow.svg"
                    alt=""
                  />
                )}
              </button>
              <button className="secondary-cta" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
