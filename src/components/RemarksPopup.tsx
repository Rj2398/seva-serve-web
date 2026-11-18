"use client";

import { globalServerRequest } from "@/actions/globalApi";
import React, { useEffect, useState } from "react";
// Import globalServerRequest from your existing API file

interface RemarksPopupProps {
  onClose: () => void;
  quoteId: number | string | null;
}

interface Remark {
  id?: number | string;
  sender?: string;
  sender_name?: string;
  type?: string;
  title?: string;
  message?: string;
  remark?: string;
  image?: string;
  image_url?: string | null;
  date?: string;
  created_at?: string;
  user_type?: string;
  user_name?: string;
}

const RemarksPopup = ({ onClose, quoteId }: RemarksPopupProps) => {
  const [reply, setReply] = useState("");
  const [replyImage, setReplyImage] = useState<File | null>(null);
  const [remarksData, setRemarksData] = useState<Remark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // GET REMARKS
  const fetchRemarks = async () => {
    if (quoteId === null || quoteId === undefined || quoteId === "") return;

    try {
      setIsLoading(true);

      const response = await globalServerRequest({
        endpoint: "quotes/get-quote-remarks",
        method: "POST",
        payload: {
          quote_id: quoteId,
        },
      });

      console.log("Remarks API response:", response);

      const data =
        response?.data?.data ||
        response?.data?.remarks?.data ||
        response?.data?.remarks ||
        response?.data?.remark ||
        [];

      setRemarksData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching remarks:", error);
      setRemarksData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch remarks when popup opens / quoteId changes
  useEffect(() => {
    if (quoteId) {
      fetchRemarks();
    }
  }, [quoteId]);

  // POST REPLY
  const handlePostReply = async () => {
    if (quoteId === null || quoteId === undefined || quoteId === "") return;
    if (!reply.trim() && !replyImage) return;

    try {
      setIsPosting(true);

      const formData = new FormData();

      formData.append("quote_id", String(quoteId));
      formData.append("message", reply.trim());

      if (replyImage) {
        formData.append("image", replyImage, replyImage.name);
      }

      const response = await globalServerRequest({
        endpoint: "quotes/add-quote-remarks",
        method: "POST",
        payload: formData,
        isFormData: true,
      });

      console.log("Post remark response:", response);

      if (!response?.success) {
        console.error("Failed to post remark:", response?.error);
        return;
      }

      // Clear input after successful post
      setReply("");
      setReplyImage(null);

      // Refresh remarks
      await fetchRemarks();
    } catch (error) {
      console.error("Error posting remark:", error);
    } finally {
      setIsPosting(false);
    }
  };

  // Get remark title
  const getRemarkTitle = (item: Remark) => {
    if (
      item.sender?.toLowerCase() === "admin" ||
      item.type?.toLowerCase() === "admin" ||
      item.user_type?.toLowerCase() === "admin" ||
      item.user_type?.toLowerCase() === "administrator"
    ) {
      return item.sender_name || item.title || "Administrator Remark";
    }

    return item.title || "My Reply";
  };

  // Determine remark type
  const getRemarkType = (item: Remark) => {
    if (
      item.sender?.toLowerCase() === "admin" ||
      item.type?.toLowerCase() === "admin" ||
      item.user_type?.toLowerCase() === "admin" ||
      item.user_type?.toLowerCase() === "administrator"
    ) {
      return "admin";
    }

    return "user";
  };

  return (
    <div className="remarks-popup-overlay" onClick={onClose}>
      <div
        className="remarks-popup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="remarks-close-btn"
          onClick={onClose}
          type="button"
        >
          ×
        </button>

        {/* Header */}
        <div className="remarks-popup-header">
          <h6>Remarks</h6>
          <span className="remarks-request-id">
            Quote ID: {quoteId}
          </span>
        </div>

        {/* Chat body */}
        <div className="remarks-chat-body">
          {isLoading ? (
            <div className="remarks-loading">
              Loading remarks...
            </div>
          ) : remarksData.length > 0 ? (
            remarksData.map((item, index) => {
              const type = getRemarkType(item);

              return (
                <div
                  className={`remarks-message-card ${type}`}
                  key={item.id ?? index}
                >
                  <div className="remarks-message-title">
                    <span className="remarks-message-icon">
                      {type === "admin" ? "♟" : "●"}
                    </span>

                    <strong>{getRemarkTitle(item)}</strong>
                  </div>

                  {/* {(item.created_at || item.date) && (
                    <span className="remarks-date">
                      {item.created_at || item.date}
                    </span>
                  )} */}

                  <p>{item.message || item.remark}</p>

                  {(item.image_url || item.image) && (
                    <div className="remarks-attachment">
                      <img
                        src={item.image_url || item.image || ""}
                        alt="Remark attachment"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="remarks-empty">
              No remarks found.
            </div>
          )}
        </div>

        {/* Reply box */}
        <div className="remarks-reply-container">
          <label className="remarks-attachment-btn" aria-label="Attach image">
            <i className="fa-solid fa-paperclip" aria-hidden="true"></i>

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                setReplyImage(e.target.files?.[0] || null);
                e.currentTarget.value = "";
              }}
            />
          </label>

          <input
            type="text"
            placeholder="Type your reply..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isPosting) {
                handlePostReply();
              }
            }}
          />

          <button
            className="remarks-send-btn"
            onClick={handlePostReply}
            disabled={
              isPosting || (!reply.trim() && !replyImage)
            }
            type="button"
          >
            {isPosting ? (
              <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
            ) : (
              <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
            )}
          </button>
        </div>

        {/* Selected image name */}
        {replyImage && (
          <div className="remarks-selected-image">
            <span>{replyImage.name}</span>

            <button
              type="button"
              onClick={() => setReplyImage(null)}
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemarksPopup;