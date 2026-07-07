'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { globalServerRequest } from '@/actions/globalApi';

interface DeleteAddressModalProps {
  selectedAddress: any;
  onDelete: (id: number | string) => void;
  onClose: () => void;
}

const DeleteAddressModal: React.FC<DeleteAddressModalProps> = ({ selectedAddress, onDelete, onClose }) => {

  console.log(selectedAddress)
  const [loading, setLoading] = useState(false);
  const addressId = selectedAddress?.id;

  const confirmDelete = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!addressId) return;

    setLoading(true);
    try {
      const response = await globalServerRequest({
        endpoint: `profile/address/${addressId}`,
        method: "DELETE",
      });

      if (response.success) {
        toast.success("Address deleted successfully!");
        onDelete(addressId);

        const closeBtn = document.querySelector("#delete-address-popup .btn-close") as HTMLButtonElement;
        if (closeBtn) closeBtn.click();

        onClose();
      } else {
        toast.error(response.error || "Failed to delete address");
      }
    } catch (err) {
      console.error("Delete address error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal fade welcome" id="delete-address-popup" data-bs-backdrop="static" data-bs-keyboard="false"
        tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="welcome-seva-ser">
                <img src="images/saved-addresses/delete-pop.svg" className="check" alt="" />
                <p><b>Are you sure you want to delete this address?</b></p>
                {selectedAddress && (
                  <p className="small text-muted">
                    Deleting: {selectedAddress.label} ({selectedAddress.flat_house_building})
                  </p>
                )}
                <a
                  href="#"
                  className="primary-cta"
                  onClick={loading ? (e) => e.preventDefault() : confirmDelete}
                  style={{ opacity: loading ? 0.7 : 1, pointerEvents: loading ? 'none' : 'auto' }}
                >
                  {loading ? "Deleting..." : "Delete Address"}
                </a>
                <button type="button" data-bs-dismiss="modal" disabled={loading}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteAddressModal;
